import { useState, useMemo, type FormEvent, type TextareaHTMLAttributes } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { KeyRound, Pencil, Plus, Trash2, Search, SlidersHorizontal, AlertCircle, CheckCircle2, RefreshCw } from "lucide-react"
import { toast } from "sonner"
import { accountsApi } from "@/api/accounts"
import { emailsApi } from "@/api/emails"
import { platformsApi } from "@/api/platforms"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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

  // Filtros
  const [search, setSearch] = useState("")
  const [platformFilter, setPlatformFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

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

  const listData = accounts.data ?? []

  // Datos filtrados
  const filteredAccounts = useMemo(() => {
    return listData.filter((account) => {
      const term = search.toLowerCase().trim()
      const matchesSearch =
        !term ||
        (account.platform_name ?? "").toLowerCase().includes(term) ||
        (account.email_address ?? emailLabel(account.email)).toLowerCase().includes(term) ||
        (account.credentials ?? "").toLowerCase().includes(term) ||
        (account.observaciones ?? "").toLowerCase().includes(term) ||
        (account.notes ?? "").toLowerCase().includes(term)

      const matchesPlatform = platformFilter === "all" || String(account.platform) === platformFilter
      const matchesStatus = statusFilter === "all" || account.status === statusFilter

      return matchesSearch && matchesPlatform && matchesStatus
    })
  }, [listData, search, platformFilter, statusFilter, emails.data])

  // Estadísticas (solo dependen de listData)
  const stats = useMemo(() => {
    return {
      totalAccounts: listData.length,
      activeAccounts: listData.filter((a) => a.status === "activo").length,
      warningAccounts: listData.filter((a) => a.status === "por_vencer").length,
      dangerAccounts: listData.filter((a) => a.status === "vencida" || a.status === "caida").length,
    }
  }, [listData])

  const { totalAccounts, activeAccounts, warningAccounts, dangerAccounts } = stats

  const getStatusBadgeVariant = (status: AccountStatus) => {
    switch (status) {
      case "activo":
        return "success"
      case "por_vencer":
        return "warning"
      case "vencida":
      case "caida":
        return "destructive"
      default:
        return "secondary"
    }
  }

  return (
    <div className="space-y-6">
      {/* Cabecera */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Cuentas</h1>
          <p className="text-sm text-muted-foreground">Inventario de cuentas compradas y pantallas.</p>
        </div>
        <Button onClick={() => { setEditing(null); setForm(emptyAccount); setOpen(true) }} className="shadow-sm transition-transform duration-200 active:scale-95">
          <Plus className="h-4 w-4" />
          Nueva cuenta
        </Button>
      </div>

      {/* Tarjetas de estadísticas */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-primary/10 bg-gradient-to-br from-card to-primary/5 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total Cuentas</CardTitle>
            <KeyRound className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{accounts.isLoading ? "..." : totalAccounts}</div>
            <p className="text-[10px] text-muted-foreground mt-1">Cuentas registradas</p>
          </CardContent>
        </Card>

        <Card className="border-emerald-500/10 bg-gradient-to-br from-card to-emerald-500/5 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Activas</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{accounts.isLoading ? "..." : activeAccounts}</div>
            <p className="text-[10px] text-muted-foreground mt-1">Funcionando correctamente</p>
          </CardContent>
        </Card>

        <Card className="border-yellow-500/10 bg-gradient-to-br from-card to-yellow-500/5 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Por Vencer</CardTitle>
            <RefreshCw className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{accounts.isLoading ? "..." : warningAccounts}</div>
            <p className="text-[10px] text-muted-foreground mt-1">Próximas al corte de pago</p>
          </CardContent>
        </Card>

        <Card className="border-destructive/10 bg-gradient-to-br from-card to-destructive/5 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Vencidas / Caídas</CardTitle>
            <AlertCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{accounts.isLoading ? "..." : dangerAccounts}</div>
            <p className="text-[10px] text-muted-foreground mt-1">Requieren atención urgente</p>
          </CardContent>
        </Card>
      </div>

      {/* Barra de Filtros */}
      <Card className="border-primary/10 bg-card/60 backdrop-blur-sm shadow-sm">
        <CardContent className="p-4 grid gap-3 md:grid-cols-[1fr_200px_160px_auto] md:items-center">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por correo, credenciales, notas..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-background/50 focus-visible:ring-primary"
            />
          </div>

          <div className="w-full">
            <Select value={platformFilter} onValueChange={setPlatformFilter}>
              <SelectTrigger className="bg-background/50 focus:ring-primary">
                <SelectValue placeholder="Plataforma" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las plataformas</SelectItem>
                {platforms.data?.map((p) => (
                  <SelectItem key={p.id} value={String(p.id)}>{p.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="w-full">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="bg-background/50 focus:ring-primary">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="activo">Activo</SelectItem>
                <SelectItem value="por_vencer">Por vencer</SelectItem>
                <SelectItem value="vencida">Vencida</SelectItem>
                <SelectItem value="caida">Caída</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground px-2 py-1.5 bg-muted/50 rounded-md border justify-center">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span>Filtros:</span>
            {(search || platformFilter !== "all" || statusFilter !== "all") ? (
              <span className="bg-primary text-primary-foreground px-1.5 py-0.5 rounded text-[10px] font-bold">Activos</span>
            ) : (
              <span className="text-[10px]">Ninguno</span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Listado */}
      <Card className="border-primary/10 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          {accounts.isLoading ? (
            <div className="space-y-2 p-4">{Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="h-16" />)}</div>
          ) : filteredAccounts.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              No se encontraron cuentas con los filtros actuales.
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filteredAccounts.map((account) => (
                <div key={account.id} className="grid gap-3 p-4 lg:grid-cols-[1fr_180px_120px_120px_auto] lg:items-center transition-colors duration-200 hover:bg-muted/30">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <KeyRound className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{account.platform_name ?? `Plataforma #${account.platform}`}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{account.email_address ?? emailLabel(account.email)}</p>
                    </div>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block lg:hidden">Pantallas:</span>
                    <span className="text-sm text-foreground/80 font-medium">{account.max_screens} pantalla(s)</span>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block lg:hidden">Estado:</span>
                    <Badge variant={getStatusBadgeVariant(account.status)}>
                      {account.status.replace("_", " ")}
                    </Badge>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block lg:hidden">Fecha Corte:</span>
                    <p className={`text-sm font-medium ${account.status === "vencida" || account.status === "caida" ? "text-destructive font-bold" : "text-muted-foreground"}`}>
                      {account.fecha_corte ?? "Sin corte"}
                    </p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="icon" className="h-8 w-8 hover:bg-primary/10 hover:text-primary transition-all duration-200" onClick={() => startEdit(account)}><Pencil className="h-3.5 w-3.5" /></Button>
                    <Button variant="outline" size="icon" className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive transition-all duration-200" onClick={() => remove.mutate(account.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
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
                    <SelectItem value="caida">Caída</SelectItem>
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
