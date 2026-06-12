import { useState, type FormEvent, type TextareaHTMLAttributes } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Users, Pencil, Plus, Trash2, Search, SlidersHorizontal, UserPlus, Phone } from "lucide-react"
import { toast } from "sonner"
import { customersApi, type CreateCustomerPayload, type Customer } from "@/api/customers"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"

const emptyCustomer: CreateCustomerPayload = {
  name: "",
  phone: "",
  notes: "",
}

function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className="min-h-20 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring" />
}

export function CustomersListPage() {
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Customer | null>(null)
  const [form, setForm] = useState<CreateCustomerPayload>(emptyCustomer)
  const [search, setSearch] = useState("")

  const customers = useQuery({ queryKey: ["customers"], queryFn: () => customersApi.list() })

  const save = useMutation({
    mutationFn: () => editing ? customersApi.update(editing.id, form) : customersApi.create(form),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] })
      setOpen(false)
      setEditing(null)
      setForm(emptyCustomer)
      toast.success(editing ? "Cliente actualizado" : "Cliente registrado")
    },
    onError: () => toast.error("No se pudo guardar el cliente"),
  })

  const remove = useMutation({
    mutationFn: customersApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] })
      toast.success("Cliente eliminado")
    },
    onError: () => toast.error("No se pudo eliminar el cliente"),
  })

  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (!form.name.trim() || !form.phone.trim()) {
      toast.error("El nombre y el teléfono son obligatorios")
      return
    }
    save.mutate()
  }

  const startEdit = (customer: Customer) => {
    setEditing(customer)
    setForm({
      name: customer.name,
      phone: customer.phone,
      notes: customer.notes ?? "",
    })
    setOpen(true)
  }

  const listData = customers.data ?? []
  const filteredCustomers = listData.filter((c) => {
    const query = search.toLowerCase().trim()
    if (!query) return true
    return (
      c.name.toLowerCase().includes(query) ||
      c.phone.toLowerCase().includes(query) ||
      (c.notes ?? "").toLowerCase().includes(query)
    )
  })

  return (
    <div className="space-y-6">
      {/* Cabecera */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Clientes</h1>
          <p className="text-sm text-muted-foreground">Listado general de compradores y sus números de contacto.</p>
        </div>
        <Button onClick={() => { setEditing(null); setForm(emptyCustomer); setOpen(true) }} className="shadow-sm transition-transform duration-200 active:scale-95">
          <Plus className="h-4 w-4" />
          Nuevo cliente
        </Button>
      </div>

      {/* Tarjeta de Estadísticas */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="border-primary/10 bg-gradient-to-br from-card to-primary/5 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total Clientes</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{customers.isLoading ? "..." : listData.length}</div>
            <p className="text-[10px] text-muted-foreground mt-1">Clientes registrados en la plataforma</p>
          </CardContent>
        </Card>

        <Card className="border-primary/10 bg-gradient-to-br from-card to-primary/5 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Clientes Activos esta Semana</CardTitle>
            <UserPlus className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">{customers.isLoading ? "..." : listData.length}</div>
            <p className="text-[10px] text-muted-foreground mt-1">Registrados con compras activas</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card className="border-primary/10 bg-card/60 backdrop-blur-sm shadow-sm">
        <CardContent className="p-4 flex flex-col sm:flex-row gap-3 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar cliente por nombre, teléfono o notas..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-background/50 focus-visible:ring-primary"
            />
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground px-2 py-1.5 bg-muted/50 rounded-md border w-full sm:w-auto justify-center">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span>Filtros Activos</span>
            {search && <span className="bg-primary text-primary-foreground px-1.5 py-0.5 rounded text-[10px]">Búsqueda</span>}
          </div>
        </CardContent>
      </Card>

      {/* Listado */}
      <Card className="border-primary/10 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          {customers.isLoading ? (
            <div className="space-y-2 p-4">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-14" />)}</div>
          ) : filteredCustomers.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              No se encontraron clientes que coincidan con la búsqueda.
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filteredCustomers.map((customer) => (
                <div key={customer.id} className="grid gap-3 p-4 md:grid-cols-[1fr_180px_auto] md:items-center transition-colors duration-200 hover:bg-muted/30">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <Users className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{customer.name}</p>
                      <p className="text-xs text-muted-foreground max-w-md line-clamp-2 mt-0.5">{customer.notes || "Sin observaciones adicionales"}</p>
                    </div>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block md:hidden">Teléfono:</span>
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Phone className="h-3.5 w-3.5 text-primary/70" />
                      <span>{customer.phone}</span>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="icon" className="h-8 w-8 hover:bg-primary/10 hover:text-primary transition-all duration-200" onClick={() => startEdit(customer)}><Pencil className="h-3.5 w-3.5" /></Button>
                    <Button variant="outline" size="icon" className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive transition-all duration-200" onClick={() => remove.mutate(customer.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal Diálogo */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <form onSubmit={submit} className="space-y-4">
            <DialogHeader><DialogTitle>{editing ? "Editar cliente" : "Nuevo cliente"}</DialogTitle></DialogHeader>
            <div className="space-y-2">
              <Label>Nombre completo</Label>
              <Input value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Teléfono</Label>
              <Input value={form.phone} onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))} />
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
