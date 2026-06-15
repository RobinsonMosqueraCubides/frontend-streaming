import { useState, useMemo, type FormEvent, type TextareaHTMLAttributes } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { ShieldCheck, Pencil, Plus, Trash2, Search, SlidersHorizontal, UserCheck, AlertTriangle } from "lucide-react"
import { toast } from "sonner"
import { customerAccountsApi } from "@/api/customerAccounts"
import { accountsApi } from "@/api/accounts"
import { customersApi } from "@/api/customers"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import type { CustomerAccount } from "@/api/customerAccounts"

const emptyCustomerAccount: Partial<CustomerAccount> = {
  account: undefined,
  customer: undefined,
  contrasena: "",
  precio_venta: 0,
  profile_name: "",
  status: "activo",
  fecha_inicio: "",
  fecha_cobro: "",
  fecha_corte: "",
  observaciones: "",
}

function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className="min-h-20 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring" />
}

export function CustomerAccountsListPage() {
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<CustomerAccount | null>(null)
  const [form, setForm] = useState<Partial<CustomerAccount>>(emptyCustomerAccount)

  // Filtros
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const customerAccounts = useQuery({
    queryKey: ["customerAccounts"],
    queryFn: () => customerAccountsApi.list(),
  })
  const accounts = useQuery({
    queryKey: ["accounts", "list"],
    queryFn: () => accountsApi.list({ page_size: 100 }).then((data) => data.results),
  })
  const customers = useQuery({ queryKey: ["customers"], queryFn: () => customersApi.list() })

  const save = useMutation({
    mutationFn: () => editing ? customerAccountsApi.update(editing.id, form) : customerAccountsApi.create(form),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customerAccounts"] })
      queryClient.invalidateQueries({ queryKey: ["dashboard"] })
      setOpen(false)
      setEditing(null)
      setForm(emptyCustomerAccount)
      toast.success(editing ? "Cuenta de cliente actualizada" : "Cuenta de cliente vendida")
    },
    onError: () => toast.error("No se pudo guardar la cuenta"),
  })

  const remove = useMutation({
    mutationFn: customerAccountsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customerAccounts"] })
      queryClient.invalidateQueries({ queryKey: ["dashboard"] })
      toast.success("Asignación eliminada")
    },
    onError: () => toast.error("No se pudo eliminar la asignación"),
  })

  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (!form.account || !form.customer || !form.contrasena) {
      toast.error("Selecciona cuenta, cliente e introduce contraseña")
      return
    }
    save.mutate()
  }

  const startEdit = (ca: CustomerAccount) => {
    setEditing(ca)
    setForm({
      account: ca.account,
      customer: ca.customer,
      contrasena: ca.contrasena,
      precio_venta: ca.precio_venta,
      profile_name: ca.profile_name ?? "",
      status: ca.status,
      fecha_inicio: ca.fecha_inicio ?? "",
      fecha_cobro: ca.fecha_cobro ?? "",
      fecha_corte: ca.fecha_corte ?? "",
      observaciones: ca.observaciones ?? "",
    })
    setOpen(true)
  }

  const accountLabel = (id?: number) => {
    const acc = accounts.data?.find((a) => a.id === id)
    return acc ? `${acc.platform_name} (${acc.email_address})` : `Cuenta #${id}`
  }

  const customerName = (id?: number) => {
    return customers.data?.find((c) => c.id === id)?.name ?? `Cliente #${id}`
  }

  const listData = customerAccounts.data ?? []

  // Filtrado
  const filteredCAs = useMemo(() => {
    return listData.filter((ca: CustomerAccount) => {
      const term = search.toLowerCase().trim()
      const matchesSearch =
        !term ||
        (ca.platform_name ?? "").toLowerCase().includes(term) ||
        (ca.email_address ?? accountLabel(ca.account)).toLowerCase().includes(term) ||
        (ca.customer_name ?? customerName(ca.customer)).toLowerCase().includes(term) ||
        (ca.observaciones ?? "").toLowerCase().includes(term)

      const matchesStatus = statusFilter === "all" || ca.status === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [listData, search, statusFilter, accounts.data, customers.data])

  // Estadísticas (solo dependen de listData)
  const stats = useMemo(() => {
    return {
      total: listData.length,
      active: listData.filter((ca: CustomerAccount) => ca.status === "activo").length,
      warning: listData.filter((ca: CustomerAccount) => ca.status === "por_vencer").length,
      inactive: listData.filter((ca: CustomerAccount) => ca.status === "vencida" || ca.status === "caida").length,
    }
  }, [listData])

  const { total, active, warning, inactive } = stats

  return (
    <div className="space-y-6">
      {/* Cabecera */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Cuentas Clientes</h1>
          <p className="text-sm text-muted-foreground">Monitoreo de cuentas completas vendidas directamente a clientes.</p>
        </div>
        <Button onClick={() => { setEditing(null); setForm(emptyCustomerAccount); setOpen(true) }} className="shadow-sm transition-transform duration-200 active:scale-95">
          <Plus className="h-4 w-4" />
          Vender cuenta completa
        </Button>
      </div>

      {/* Estadísticas */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-primary/10 bg-gradient-to-br from-card to-primary/5 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total Vendido</CardTitle>
            <ShieldCheck className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customerAccounts.isLoading ? "..." : total}</div>
            <p className="text-[10px] text-muted-foreground mt-1">Cuentas completas activas</p>
          </CardContent>
        </Card>

        <Card className="border-emerald-500/10 bg-gradient-to-br from-card to-emerald-500/5 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Activas</CardTitle>
            <UserCheck className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{customerAccounts.isLoading ? "..." : active}</div>
            <p className="text-[10px] text-muted-foreground mt-1">Funcionando correctamente</p>
          </CardContent>
        </Card>

        <Card className="border-yellow-500/10 bg-gradient-to-br from-card to-yellow-500/5 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Por Vencer</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{customerAccounts.isLoading ? "..." : warning}</div>
            <p className="text-[10px] text-muted-foreground mt-1">Renovación próxima</p>
          </CardContent>
        </Card>

        <Card className="border-destructive/10 bg-gradient-to-br from-card to-destructive/5 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Vencidas / Caídas</CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{customerAccounts.isLoading ? "..." : inactive}</div>
            <p className="text-[10px] text-muted-foreground mt-1">Requieren cambio de clave</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card className="border-primary/10 bg-card/60 backdrop-blur-sm shadow-sm">
        <CardContent className="p-4 flex flex-col sm:flex-row gap-3 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por plataforma, correo, observaciones o cliente..."
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
          {customerAccounts.isLoading ? (
            <div className="space-y-2 p-4">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-14" />)}</div>
          ) : filteredCAs.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              No se encontraron cuentas de clientes registradas con los filtros actuales.
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filteredCAs.map((ca: CustomerAccount) => (
                <div key={ca.id} className="grid gap-3 p-4 md:grid-cols-[1fr_180px_100px_100px_auto] md:items-center transition-colors duration-200 hover:bg-muted/30">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <ShieldCheck className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{ca.platform_name ?? accountLabel(ca.account)}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">Correo: <span className="font-semibold text-foreground">{ca.email_address ?? "Desconocido"}</span> | Clave: <span className="font-mono bg-muted px-1 py-0.5 rounded text-[10px]">{ca.contrasena}</span></p>
                    </div>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block md:hidden">Cliente:</span>
                    <p className="text-sm font-medium text-foreground/80">{ca.customer_name ?? customerName(ca.customer)}</p>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block md:hidden">Precio:</span>
                    <p className="text-sm font-semibold text-primary">${ca.precio_venta}</p>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block md:hidden">Estado:</span>
                    <Badge variant={ca.status === "activo" ? "success" : ca.status === "por_vencer" ? "warning" : "destructive"}>
                      {ca.status}
                    </Badge>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="icon" className="h-8 w-8 hover:bg-primary/10 hover:text-primary transition-all duration-200" onClick={() => startEdit(ca)}><Pencil className="h-3.5 w-3.5" /></Button>
                    <Button variant="outline" size="icon" className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive transition-all duration-200" onClick={() => remove.mutate(ca.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
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
            <DialogHeader><DialogTitle>{editing ? "Editar cuenta de cliente" : "Vender cuenta completa"}</DialogTitle></DialogHeader>
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
                <Label>Cliente Adquirente</Label>
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
                <Label>Contraseña Cuenta</Label>
                <Input value={form.contrasena ?? ""} onChange={(event) => setForm((current) => ({ ...current, contrasena: event.target.value }))} />
              </div>

              <div className="space-y-2">
                <Label>Precio de Venta</Label>
                <Input type="number" value={form.precio_venta ?? 0} onChange={(event) => setForm((current) => ({ ...current, precio_venta: Number(event.target.value) }))} />
              </div>

              <div className="space-y-2">
                <Label>Nombre del Perfil (opcional)</Label>
                <Input value={form.profile_name ?? ""} onChange={(event) => setForm((current) => ({ ...current, profile_name: event.target.value }))} />
              </div>

              <div className="space-y-2">
                <Label>Estado</Label>
                <Select value={form.status} onValueChange={(value) => setForm((current) => ({ ...current, status: value as any }))}>
                  <SelectTrigger className="focus:ring-primary"><SelectValue /></SelectTrigger>
                  <SelectContent>
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
