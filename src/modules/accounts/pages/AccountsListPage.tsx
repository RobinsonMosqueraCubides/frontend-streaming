import { useState, type FormEvent, type TextareaHTMLAttributes } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { KeyRound, Pencil, Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { accountsApi } from "@/api/accounts"
import { emailsApi } from "@/api/emails"
import { platformsApi } from "@/api/platforms"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import type { Account, AccountStatus } from "@/modules/accounts/types"

const emptyAccount: Partial<Account> = {
  email: undefined,
  platform: undefined,
  max_screens: 1,
  credentials: "",
  status: "activo",
  purchase_price: undefined,
  fecha_compra: "",
  fecha_pago: "",
  fecha_corte: "",
  observaciones: "",
  notes: "",
  is_active: true,
}

function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className="min-h-20 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring" />
}

export function AccountsListPage() {
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Account | null>(null)
  const [form, setForm] = useState<Partial<Account>>(emptyAccount)

  const accounts = useQuery({
    queryKey: ["accounts", "crud"],
    queryFn: () => accountsApi.list({ page_size: 100 }).then((data) => data.results),
  })
  const platforms = useQuery({ queryKey: ["platforms"], queryFn: platformsApi.list })
  const emails = useQuery({ queryKey: ["emails"], queryFn: () => emailsApi.list() })

  const save = useMutation({
    mutationFn: () => editing ? accountsApi.partialUpdate(editing.id, form) : accountsApi.create(form),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] })
      queryClient.invalidateQueries({ queryKey: ["dashboard"] })
      setOpen(false)
      setEditing(null)
      setForm(emptyAccount)
      toast.success(editing ? "Cuenta actualizada" : "Cuenta registrada")
    },
    onError: () => toast.error("No se pudo guardar la cuenta"),
  })

  const remove = useMutation({
    mutationFn: accountsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["accounts"] })
      queryClient.invalidateQueries({ queryKey: ["dashboard"] })
      toast.success("Cuenta eliminada")
    },
    onError: () => toast.error("No se pudo eliminar la cuenta"),
  })

  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (!form.platform || !form.email || !form.max_screens || !form.purchase_price) {
      toast.error("Completa plataforma, correo, pantallas y valor de compra")
      return
    }
    save.mutate()
  }

  const startEdit = (account: Account) => {
    setEditing(account)
    setForm({
      email: account.email,
      platform: account.platform,
      max_screens: account.max_screens,
      credentials: account.credentials ?? "",
      status: account.status,
      purchase_price: account.purchase_price,
      fecha_compra: account.fecha_compra ?? "",
      fecha_pago: account.fecha_pago ?? "",
      fecha_corte: account.fecha_corte ?? "",
      observaciones: account.observaciones ?? "",
      notes: account.notes ?? "",
      is_active: account.is_active,
    })
    setOpen(true)
  }

  const emailLabel = (id?: number) => emails.data?.find((email) => email.id === id)?.email ?? "Sin correo"

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Cuentas</h1>
          <p className="text-sm text-muted-foreground">Inventario de cuentas compradas.</p>
        </div>
        <Button onClick={() => { setEditing(null); setForm(emptyAccount); setOpen(true) }}>
          <Plus className="h-4 w-4" />
          Nueva cuenta
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {accounts.isLoading ? (
            <div className="space-y-2 p-4">{Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-16" />)}</div>
          ) : (
            <div className="divide-y divide-border">
              {(accounts.data ?? []).map((account) => (
                <div key={account.id} className="grid gap-3 p-4 lg:grid-cols-[1fr_180px_120px_120px_auto] lg:items-center">
                  <div className="flex items-start gap-3">
                    <KeyRound className="mt-1 h-4 w-4 text-primary" />
                    <div>
                      <p className="font-medium">{account.platform_name ?? `Plataforma #${account.platform}`}</p>
                      <p className="text-xs text-muted-foreground">{account.email_address ?? emailLabel(account.email)}</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{account.max_screens} pantalla(s)</p>
                  <Badge variant={account.status === "activo" ? "success" : "secondary"}>{account.status}</Badge>
                  <p className="text-sm text-muted-foreground">{account.fecha_corte ?? "Sin corte"}</p>
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" onClick={() => startEdit(account)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => remove.mutate(account.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-3xl">
          <form onSubmit={submit} className="space-y-4">
            <DialogHeader><DialogTitle>{editing ? "Editar cuenta" : "Nueva cuenta"}</DialogTitle></DialogHeader>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label>Plataforma</Label>
                <Select value={form.platform ? String(form.platform) : ""} onValueChange={(value) => setForm((current) => ({ ...current, platform: Number(value) }))}>
                  <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                  <SelectContent>{platforms.data?.map((platform) => <SelectItem key={platform.id} value={String(platform.id)}>{platform.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Correo</Label>
                <Select value={form.email ? String(form.email) : ""} onValueChange={(value) => setForm((current) => ({ ...current, email: Number(value) }))}>
                  <SelectTrigger><SelectValue placeholder="Seleccionar" /></SelectTrigger>
                  <SelectContent>{emails.data?.map((email) => <SelectItem key={email.id} value={String(email.id)}>{email.email}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Estado</Label>
                <Select value={form.status} onValueChange={(value) => setForm((current) => ({ ...current, status: value as AccountStatus }))}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="activo">Activo</SelectItem>
                    <SelectItem value="por_vencer">Por vencer</SelectItem>
                    <SelectItem value="vencida">Vencida</SelectItem>
                    <SelectItem value="caida">Caida</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Pantallas</Label>
                <Input type="number" min={1} max={5} value={form.max_screens ?? ""} onChange={(event) => setForm((current) => ({ ...current, max_screens: Number(event.target.value) }))} />
              </div>
              <div className="space-y-2">
                <Label>Valor compra</Label>
                <Input type="number" min={0} step="0.01" value={form.purchase_price ?? ""} onChange={(event) => setForm((current) => ({ ...current, purchase_price: Number(event.target.value) }))} />
              </div>
              <div className="space-y-2">
                <Label>Contraseña cuenta</Label>
                <Input value={form.credentials ?? ""} onChange={(event) => setForm((current) => ({ ...current, credentials: event.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Fecha inicio</Label>
                <Input type="date" value={form.fecha_compra ?? ""} onChange={(event) => setForm((current) => ({ ...current, fecha_compra: event.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Fecha cobro</Label>
                <Input type="date" value={form.fecha_pago ?? ""} onChange={(event) => setForm((current) => ({ ...current, fecha_pago: event.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Fecha corte</Label>
                <Input type="date" value={form.fecha_corte ?? ""} onChange={(event) => setForm((current) => ({ ...current, fecha_corte: event.target.value }))} />
              </div>
              <div className="space-y-2 md:col-span-3">
                <Label>Observaciones</Label>
                <TextArea value={form.observaciones ?? ""} onChange={(event) => setForm((current) => ({ ...current, observaciones: event.target.value }))} />
              </div>
              <div className="space-y-2 md:col-span-3">
                <Label>Notas</Label>
                <TextArea value={form.notes ?? ""} onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))} />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
              <Button type="submit" disabled={save.isPending}>Guardar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
