import { useState, type FormEvent, type TextareaHTMLAttributes } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Monitor, Pencil, Plus, Trash2, Search, SlidersHorizontal, CheckCircle2, AlertTriangle, ShieldCheck } from "lucide-react"
import { toast } from "sonner"
import { screensApi } from "@/api/screens"
import { accountsApi } from "@/api/accounts"
import { customersApi } from "@/api/customers"
import { ordersApi } from "@/api/orders"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import type { Screen, ScreenStatus } from "@/modules/screens/types"

const emptyScreen: Partial<Screen> = {
  account: undefined,
  customer: undefined,
  order: undefined,
  pin: "",
  precio_venta: undefined,
  profile_name: "",
  status: "disponible",
  fecha_inicio: "",
  fecha_cobro: "",
  fecha_corte: "",
  observaciones: "",
  notes: "",
}

function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className="min-h-20 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring" />
}

export function ScreensListPage() {
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Screen | null>(null)
  const [form, setForm] = useState<Partial<Screen>>(emptyScreen)

  // Filtros
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const screens = useQuery({
    queryKey: ["screens"],
    queryFn: () => screensApi.list().then((data) => data.results),
  })
  const accounts = useQuery({
    queryKey: ["accounts", "list"],
    queryFn: () => accountsApi.list({ page_size: 100 }).then((data) => data.results),
  })
  const customers = useQuery({ queryKey: ["customers"], queryFn: () => customersApi.list() })
  const orders = useQuery({ queryKey: ["orders"], queryFn: () => ordersApi.list() })

  const save = useMutation({
    mutationFn: () => editing ? screensApi.partialUpdate(editing.id, form) : screensApi.create(form),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["screens"] })
      queryClient.invalidateQueries({ queryKey: ["dashboard"] })
      setOpen(false)
      setEditing(null)
      setForm(emptyScreen)
      toast.success(editing ? "Pantalla actualizada" : "Pantalla registrada")
    },
    onError: () => toast.error("No se pudo guardar la pantalla"),
  })

  const remove = useMutation({
    mutationFn: screensApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["screens"] })
      queryClient.invalidateQueries({ queryKey: ["dashboard"] })
      toast.success("Pantalla eliminada")
    },
    onError: () => toast.error("No se pudo eliminar la pantalla"),
  })

  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (!form.account || !form.status) {
      toast.error("Selecciona una cuenta de inventario y un estado")
      return
    }
    save.mutate()
  }

  const startEdit = (screen: Screen) => {
    setEditing(screen)
    setForm({
      account: screen.account,
      customer: screen.customer,
      order: screen.order,
      pin: screen.pin ?? "",
      precio_venta: screen.precio_venta,
      profile_name: screen.profile_name ?? "",
      status: screen.status,
      fecha_inicio: screen.fecha_inicio ?? "",
      fecha_cobro: screen.fecha_cobro ?? "",
      fecha_corte: screen.fecha_corte ?? "",
      observaciones: screen.observaciones ?? "",
      notes: screen.notes ?? "",
    })
    setOpen(true)
  }

  const accountLabel = (id?: number) => {
    const acc = accounts.data?.find((a) => a.id === id)
    return acc ? `${acc.platform_name} (${acc.email_address})` : `Cuenta #${id}`
  }

  const customerName = (id?: number) => {
    return customers.data?.find((c) => c.id === id)?.name ?? "Sin cliente asignado"
  }

  const listData = screens.data ?? []

  // Filtrado
  const filteredScreens = listData.filter((screen) => {
    const term = search.toLowerCase().trim()
    const matchesSearch =
      !term ||
      (screen.account_info ?? accountLabel(screen.account)).toLowerCase().includes(term) ||
      (screen.customer_name ?? customerName(screen.customer)).toLowerCase().includes(term) ||
      (screen.profile_name ?? "").toLowerCase().includes(term) ||
      (screen.observaciones ?? "").toLowerCase().includes(term)

    const matchesStatus = statusFilter === "all" || screen.status === statusFilter

    return matchesSearch && matchesStatus
  })

  // Estadísticas
  const total = listData.length
  const active = listData.filter((s) => s.status === "activo").length
  const available = listData.filter((s) => s.status === "disponible").length
  const issues = listData.filter((s) => s.status === "vencida" || s.status === "caida").length

  const getStatusBadgeVariant = (status: ScreenStatus) => {
    switch (status) {
      case "activo":
        return "success"
      case "disponible":
        return "secondary"
      case "por_vencer":
        return "warning"
      case "vencida":
      case "caida":
        return "destructive"
      default:
        return "default"
    }
  }

  return (
    <div className="space-y-6">
      {/* Cabecera */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Pantallas</h1>
          <p className="text-sm text-muted-foreground">Monitoreo y asignación de perfiles individuales de streaming.</p>
        </div>
        <Button onClick={() => { setEditing(null); setForm(emptyScreen); setOpen(true) }} className="shadow-sm transition-transform duration-200 active:scale-95">
          <Plus className="h-4 w-4" />
          Nueva pantalla
        </Button>
      </div>

      {/* Estadísticas */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-primary/10 bg-gradient-to-br from-card to-primary/5 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total Pantallas</CardTitle>
            <Monitor className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{screens.isLoading ? "..." : total}</div>
            <p className="text-[10px] text-muted-foreground mt-1">Perfiles en inventario</p>
          </CardContent>
        </Card>

        <Card className="border-emerald-500/10 bg-gradient-to-br from-card to-emerald-500/5 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Activas</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{screens.isLoading ? "..." : active}</div>
            <p className="text-[10px] text-muted-foreground mt-1">Asignadas y funcionando</p>
          </CardContent>
        </Card>

        <Card className="border-blue-500/10 bg-gradient-to-br from-card to-blue-500/5 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Disponibles</CardTitle>
            <ShieldCheck className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{screens.isLoading ? "..." : available}</div>
            <p className="text-[10px] text-muted-foreground mt-1">Listas para ser vendidas</p>
          </CardContent>
        </Card>

        <Card className="border-destructive/10 bg-gradient-to-br from-card to-destructive/5 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Caídas / Vencidas</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{screens.isLoading ? "..." : issues}</div>
            <p className="text-[10px] text-muted-foreground mt-1">Requieren soporte técnico</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card className="border-primary/10 bg-card/60 backdrop-blur-sm shadow-sm">
        <CardContent className="p-4 flex flex-col sm:flex-row gap-3 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar pantalla por cuenta, cliente o perfil..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-background/50 focus-visible:ring-primary"
            />
          </div>

          <div className="w-full sm:w-[200px]">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="bg-background/50 focus:ring-primary">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los Estados</SelectItem>
                <SelectItem value="disponible">Disponible</SelectItem>
                <SelectItem value="activo">Activo</SelectItem>
                <SelectItem value="por_vencer">Por vencer</SelectItem>
                <SelectItem value="vencida">Vencida</SelectItem>
                <SelectItem value="caida">Caída</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground px-2 py-1.5 bg-muted/50 rounded-md border w-full sm:w-auto justify-center">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span>Filtros:</span>
            {(search || statusFilter !== "all") ? (
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
          {screens.isLoading ? (
            <div className="space-y-2 p-4">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-14" />)}</div>
          ) : filteredScreens.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              No se encontraron pantallas con los filtros actuales.
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filteredScreens.map((screen) => (
                <div key={screen.id} className="grid gap-3 p-4 md:grid-cols-[1fr_180px_100px_100px_auto] md:items-center transition-colors duration-200 hover:bg-muted/30">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <Monitor className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{screen.account_info ?? accountLabel(screen.account)}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Perfil: <span className="font-medium text-foreground">{screen.profile_name || "Sin nombre"}</span> {screen.pin ? ` | PIN: ${screen.pin}` : ""}</p>
                    </div>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block md:hidden">Cliente:</span>
                    <p className="text-sm font-medium text-foreground/80">{screen.customer_name ?? customerName(screen.customer)}</p>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block md:hidden">Precio:</span>
                    <p className="text-sm font-semibold text-primary">{screen.precio_venta ? `$${screen.precio_venta}` : "Sin precio"}</p>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block md:hidden">Estado:</span>
                    <Badge variant={getStatusBadgeVariant(screen.status)}>
                      {screen.status}
                    </Badge>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="icon" className="h-8 w-8 hover:bg-primary/10 hover:text-primary transition-all duration-200" onClick={() => startEdit(screen)}><Pencil className="h-3.5 w-3.5" /></Button>
                    <Button variant="outline" size="icon" className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive transition-all duration-200" onClick={() => remove.mutate(screen.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal Diálogo */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <form onSubmit={submit} className="space-y-4">
            <DialogHeader><DialogTitle>{editing ? "Editar pantalla" : "Nueva pantalla"}</DialogTitle></DialogHeader>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Cuenta de Inventario</Label>
                <Select value={form.account ? String(form.account) : ""} onValueChange={(value) => setForm((current) => ({ ...current, account: Number(value) }))}>
                  <SelectTrigger className="focus:ring-primary"><SelectValue placeholder="Seleccionar Cuenta" /></SelectTrigger>
                  <SelectContent>
                    {accounts.data?.map((acc) => (
                      <SelectItem key={acc.id} value={String(acc.id)}>{acc.platform_name} - {acc.email_address}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Cliente Asignado</Label>
                <Select value={form.customer ? String(form.customer) : ""} onValueChange={(value) => setForm((current) => ({ ...current, customer: value ? Number(value) : undefined }))}>
                  <SelectTrigger className="focus:ring-primary"><SelectValue placeholder="Ninguno" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Ninguno</SelectItem>
                    {customers.data?.map((cust) => (
                      <SelectItem key={cust.id} value={String(cust.id)}>{cust.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Nombre de Perfil</Label>
                <Input value={form.profile_name ?? ""} onChange={(event) => setForm((current) => ({ ...current, profile_name: event.target.value }))} />
              </div>

              <div className="space-y-2">
                <Label>PIN (4 dígitos)</Label>
                <Input maxLength={4} value={form.pin ?? ""} onChange={(event) => setForm((current) => ({ ...current, pin: event.target.value }))} />
              </div>

              <div className="space-y-2">
                <Label>Precio Venta</Label>
                <Input type="number" value={form.precio_venta ?? ""} onChange={(event) => setForm((current) => ({ ...current, precio_venta: Number(event.target.value) }))} />
              </div>

              <div className="space-y-2">
                <Label>Estado</Label>
                <Select value={form.status} onValueChange={(value) => setForm((current) => ({ ...current, status: value as ScreenStatus }))}>
                  <SelectTrigger className="focus:ring-primary"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="disponible">Disponible</SelectItem>
                    <SelectItem value="activo">Activo</SelectItem>
                    <SelectItem value="por_vencer">Por vencer</SelectItem>
                    <SelectItem value="vencida">Vencida</SelectItem>
                    <SelectItem value="caida">Caída</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Fecha Inicio</Label>
                <Input type="date" value={form.fecha_inicio ?? ""} onChange={(event) => setForm((current) => ({ ...current, fecha_inicio: event.target.value }))} />
              </div>

              <div className="space-y-2">
                <Label>Fecha Corte</Label>
                <Input type="date" value={form.fecha_corte ?? ""} onChange={(event) => setForm((current) => ({ ...current, fecha_corte: event.target.value }))} />
              </div>

              <div className="space-y-2 sm:col-span-2">
                <Label>Observaciones</Label>
                <TextArea value={form.observaciones ?? ""} onChange={(event) => setForm((current) => ({ ...current, observaciones: event.target.value }))} />
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
