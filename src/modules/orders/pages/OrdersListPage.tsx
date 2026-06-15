import { useState, type FormEvent, type TextareaHTMLAttributes } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { ShoppingBag, Pencil, Plus, Trash2, Search, SlidersHorizontal, DollarSign, Clock, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"
import { PATHS } from "@/routes/paths"
import { ordersApi } from "@/api/orders"
import { customersApi } from "@/api/customers"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import type { Order } from "@/api/orders"

const emptyOrder: Partial<Order> = {
  customer: undefined,
  total: 0,
  status: "activo",
  fecha_inicio: "",
  fecha_cobro: "",
  fecha_corte: "",
  observaciones: "",
}

function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className="min-h-20 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring" />
}

export function OrdersListPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Order | null>(null)
  const [form, setForm] = useState<Partial<Order>>(emptyOrder)

  // Filtros
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const orders = useQuery({ queryKey: ["orders"], queryFn: () => ordersApi.list() })
  const customers = useQuery({ queryKey: ["customers"], queryFn: () => customersApi.list() })

  const save = useMutation({
    mutationFn: () => editing ? ordersApi.update(editing.id, form) : ordersApi.create(form),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] })
      queryClient.invalidateQueries({ queryKey: ["dashboard"] })
      setOpen(false)
      setEditing(null)
      setForm(emptyOrder)
      toast.success(editing ? "Orden actualizada" : "Orden registrada")
    },
    onError: () => toast.error("No se pudo guardar la orden"),
  })

  const remove = useMutation({
    mutationFn: ordersApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] })
      queryClient.invalidateQueries({ queryKey: ["dashboard"] })
      toast.success("Orden eliminada")
    },
    onError: () => toast.error("No se pudo eliminar la orden"),
  })

  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (!form.customer || form.total === undefined) {
      toast.error("Selecciona un cliente e introduce el total de la orden")
      return
    }
    save.mutate()
  }

  const startEdit = (order: Order) => {
    setEditing(order)
    setForm({
      customer: order.customer,
      total: order.total,
      status: order.status,
      fecha_inicio: order.fecha_inicio ?? "",
      fecha_cobro: order.fecha_cobro ?? "",
      fecha_corte: order.fecha_corte ?? "",
      observaciones: order.observaciones ?? "",
    })
    setOpen(true)
  }

  const customerName = (id?: number) => {
    return customers.data?.find((c) => c.id === id)?.name ?? `Cliente #${id}`
  }

  const listData = orders.data ?? []

  // Filtrado
  const filteredOrders = listData.filter((order) => {
    const term = search.toLowerCase().trim()
    const matchesSearch =
      !term ||
      (order.customer_name ?? customerName(order.customer)).toLowerCase().includes(term) ||
      (order.observaciones ?? "").toLowerCase().includes(term)

    const matchesStatus = statusFilter === "all" || order.status === statusFilter

    return matchesSearch && matchesStatus
  })

  // Estadísticas
  const totalCount = listData.length
  const totalFacturado = listData.reduce((acc, curr) => acc + Number(curr.total), 0)
  const activeOrders = listData.filter((o) => o.status === "activo").length
  const pendingCollection = listData.filter((o) => o.status === "por_cobrar").length

  const getStatusBadgeVariant = (status: Order["status"]) => {
    switch (status) {
      case "activo":
        return "success"
      case "por_cobrar":
      case "por_vencer":
        return "warning"
      case "vencida":
      case "caida":
      case "por_cortar":
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
          <h1 className="text-2xl font-bold tracking-tight">Órdenes</h1>
          <p className="text-sm text-muted-foreground">Administración de ventas transaccionales agrupadas de clientes.</p>
        </div>
        <Button onClick={() => navigate(PATHS.orderNew)} className="shadow-sm transition-transform duration-200 active:scale-95">
          <Plus className="h-4 w-4" />
          Nueva orden
        </Button>
      </div>

      {/* Estadísticas */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-primary/10 bg-gradient-to-br from-card to-primary/5 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total Órdenes</CardTitle>
            <ShoppingBag className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders.isLoading ? "..." : totalCount}</div>
            <p className="text-[10px] text-muted-foreground mt-1">Órdenes registradas</p>
          </CardContent>
        </Card>

        <Card className="border-primary/10 bg-gradient-to-br from-card to-primary/5 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Facturado Total</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">${orders.isLoading ? "..." : totalFacturado.toFixed(2)}</div>
            <p className="text-[10px] text-muted-foreground mt-1">Suma acumulada de ventas</p>
          </CardContent>
        </Card>

        <Card className="border-emerald-500/10 bg-gradient-to-br from-card to-emerald-500/5 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Ventas Activas</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{orders.isLoading ? "..." : activeOrders}</div>
            <p className="text-[10px] text-muted-foreground mt-1">Servicios vigentes</p>
          </CardContent>
        </Card>

        <Card className="border-yellow-500/10 bg-gradient-to-br from-card to-yellow-500/5 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Por Cobrar</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{orders.isLoading ? "..." : pendingCollection}</div>
            <p className="text-[10px] text-muted-foreground mt-1">Órdenes esperando renovación</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card className="border-primary/10 bg-card/60 backdrop-blur-sm shadow-sm">
        <CardContent className="p-4 flex flex-col sm:flex-row gap-3 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por cliente u observaciones..."
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
                <SelectItem value="activo">Activo</SelectItem>
                <SelectItem value="por_cobrar">Por cobrar</SelectItem>
                <SelectItem value="por_vencer">Por vencer</SelectItem>
                <SelectItem value="por_cortar">Por cortar</SelectItem>
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
          {orders.isLoading ? (
            <div className="space-y-2 p-4">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-14" />)}</div>
          ) : filteredOrders.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              No se encontraron órdenes registradas con los filtros actuales.
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filteredOrders.map((order) => (
                <div key={order.id} className="grid gap-3 p-4 md:grid-cols-[1fr_120px_120px_120px_auto] md:items-center transition-colors duration-200 hover:bg-muted/30">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <ShoppingBag className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{order.customer_name ?? customerName(order.customer)}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{order.observaciones || "Sin observaciones adicionales"}</p>
                    </div>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block md:hidden">Monto Total:</span>
                    <p className="text-sm font-semibold text-primary">${order.total}</p>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block md:hidden">Estado:</span>
                    <Badge variant={getStatusBadgeVariant(order.status)}>
                      {order.status.replace("_", " ")}
                    </Badge>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block md:hidden">Fecha Cobro:</span>
                    <p className="text-sm text-muted-foreground font-medium">{order.fecha_cobro || "Sin cobro"}</p>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="icon" className="h-8 w-8 hover:bg-primary/10 hover:text-primary transition-all duration-200" onClick={() => startEdit(order)}><Pencil className="h-3.5 w-3.5" /></Button>
                    <Button variant="outline" size="icon" className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive transition-all duration-200" onClick={() => remove.mutate(order.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
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
            <DialogHeader><DialogTitle>{editing ? "Editar orden" : "Nueva orden"}</DialogTitle></DialogHeader>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Cliente</Label>
                <Select value={form.customer ? String(form.customer) : ""} onValueChange={(value) => setForm((current) => ({ ...current, customer: Number(value) }))}>
                  <SelectTrigger className="focus:ring-primary"><SelectValue placeholder="Seleccionar Cliente" /></SelectTrigger>
                  <SelectContent>
                    {customers.data?.map((cust) => (
                      <SelectItem key={cust.id} value={String(cust.id)}>{cust.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Total Factura ($)</Label>
                <Input type="number" step="0.01" value={form.total ?? 0} onChange={(event) => setForm((current) => ({ ...current, total: Number(event.target.value) }))} />
              </div>

              <div className="space-y-2">
                <Label>Estado de la Orden</Label>
                <Select value={form.status} onValueChange={(value) => setForm((current) => ({ ...current, status: value as any }))}>
                  <SelectTrigger className="focus:ring-primary"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="activo">Activo</SelectItem>
                    <SelectItem value="por_cobrar">Por cobrar</SelectItem>
                    <SelectItem value="por_vencer">Por vencer</SelectItem>
                    <SelectItem value="por_cortar">Por cortar</SelectItem>
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
                <Label>Fecha Cobro</Label>
                <Input type="date" value={form.fecha_cobro ?? ""} onChange={(event) => setForm((current) => ({ ...current, fecha_cobro: event.target.value }))} />
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
