import { useState, type FormEvent, type TextareaHTMLAttributes } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Mail, Pencil, Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { emailsApi, type CreateEmailPayload, type EmailAccount } from "@/api/emails"
import { providersApi } from "@/api/providers"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"

const emptyEmail: CreateEmailPayload = {
  email: "",
  password: "",
  notes: "",
  provider: undefined,
  is_active: true,
}

function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className="min-h-20 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring" />
}

export function EmailsListPage() {
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<EmailAccount | null>(null)
  const [form, setForm] = useState<CreateEmailPayload>(emptyEmail)

  const emails = useQuery({ queryKey: ["emails"], queryFn: () => emailsApi.list() })
  const providers = useQuery({ queryKey: ["providers"], queryFn: () => providersApi.list() })

  const save = useMutation({
    mutationFn: () => editing ? emailsApi.update(editing.id, form) : emailsApi.create(form),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["emails"] })
      setOpen(false)
      setEditing(null)
      setForm(emptyEmail)
      toast.success(editing ? "Correo actualizado" : "Correo registrado")
    },
    onError: () => toast.error("No se pudo guardar el correo"),
  })

  const remove = useMutation({
    mutationFn: emailsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["emails"] })
      toast.success("Correo eliminado")
    },
    onError: () => toast.error("No se pudo eliminar el correo"),
  })

  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (!form.email.trim() || !form.password.trim()) {
      toast.error("Correo y contraseña son obligatorios")
      return
    }
    save.mutate()
  }

  const startEdit = (email: EmailAccount) => {
    setEditing(email)
    setForm({
      email: email.email,
      password: email.password ?? "",
      notes: email.notes ?? "",
      provider: email.provider ?? email.provider_id ?? undefined,
      is_active: email.is_active ?? true,
    })
    setOpen(true)
  }

  const providerName = (id?: number | null) => providers.data?.find((provider) => provider.id === id)?.name ?? "Sin proveedor"

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Correos</h1>
          <p className="text-sm text-muted-foreground">Administra correos base y contraseñas.</p>
        </div>
        <Button onClick={() => { setEditing(null); setForm(emptyEmail); setOpen(true) }}>
          <Plus className="h-4 w-4" />
          Nuevo correo
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {emails.isLoading ? (
            <div className="space-y-2 p-4">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-14" />)}</div>
          ) : (
            <div className="divide-y divide-border">
              {(emails.data ?? []).map((email) => (
                <div key={email.id} className="grid gap-3 p-4 md:grid-cols-[1fr_180px_100px_auto] md:items-center">
                  <div className="flex items-start gap-3">
                    <Mail className="mt-1 h-4 w-4 text-primary" />
                    <div>
                      <p className="font-medium">{email.email}</p>
                      <p className="text-xs text-muted-foreground">{email.notes || "Sin notas"}</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{providerName(email.provider ?? email.provider_id)}</p>
                  <Badge variant={email.is_active === false ? "secondary" : "success"}>{email.is_active === false ? "Inactivo" : "Activo"}</Badge>
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" onClick={() => startEdit(email)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => remove.mutate(email.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <form onSubmit={submit} className="space-y-4">
            <DialogHeader><DialogTitle>{editing ? "Editar correo" : "Nuevo correo"}</DialogTitle></DialogHeader>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Correo</Label>
                <Input value={form.email} onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Contraseña</Label>
                <Input value={form.password} onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Proveedor</Label>
              <Select value={form.provider ? String(form.provider) : ""} onValueChange={(value) => setForm((current) => ({ ...current, provider: Number(value) }))}>
                <SelectTrigger><SelectValue placeholder="Seleccionar proveedor" /></SelectTrigger>
                <SelectContent>
                  {providers.data?.map((provider) => <SelectItem key={provider.id} value={String(provider.id)}>{provider.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Estado</Label>
              <Select value={form.is_active === false ? "false" : "true"} onValueChange={(value) => setForm((current) => ({ ...current, is_active: value === "true" }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Activo</SelectItem>
                  <SelectItem value="false">Inactivo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Notas</Label>
              <TextArea value={form.notes ?? ""} onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))} />
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
