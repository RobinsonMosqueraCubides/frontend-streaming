import { useState, type FormEvent, type TextareaHTMLAttributes } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Building2, Pencil, Plus, Trash2, Search, SlidersHorizontal, Users, Sparkles, MessageSquare, Phone } from "lucide-react"
import { toast } from "sonner"
import { providersApi, type CreateProviderPayload, type Provider } from "@/api/providers"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"

const emptyProvider: CreateProviderPayload = {
  name: "",
  contact: "",
  phone: "",
  notes: "",
  observaciones: "",
}

function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className="min-h-20 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring" />
}

export function ProvidersListPage() {
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Provider | null>(null)
  const [form, setForm] = useState<CreateProviderPayload>(emptyProvider)
  const [search, setSearch] = useState("")

  const providers = useQuery({ queryKey: ["providers"], queryFn: () => providersApi.list() })

  const save = useMutation({
    mutationFn: () => editing ? providersApi.update(editing.id, form) : providersApi.create(form),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["providers"] })
      setOpen(false)
      setEditing(null)
      setForm(emptyProvider)
      toast.success(editing ? "Proveedor actualizado" : "Proveedor registrado")
    },
    onError: () => toast.error("No se pudo guardar el proveedor"),
  })

  const remove = useMutation({
    mutationFn: providersApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["providers"] })
      toast.success("Proveedor eliminado")
    },
    onError: () => toast.error("No se pudo eliminar el proveedor"),
  })

  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (!form.name?.trim()) {
      toast.error("Escribe el nombre del proveedor")
      return
    }
    save.mutate()
  }

  const startEdit = (provider: Provider) => {
    setEditing(provider)
    setForm({
      name: provider.name,
      contact: provider.contact ?? "",
      phone: provider.phone ?? "",
      notes: provider.notes ?? "",
      observaciones: provider.observaciones ?? "",
    })
    setOpen(true)
  }

  const listData = providers.data ?? []
  const filteredProviders = listData.filter((provider) => {
    const term = search.toLowerCase().trim()
    if (!term) return true
    return (
      provider.name.toLowerCase().includes(term) ||
      (provider.contact ?? "").toLowerCase().includes(term) ||
      (provider.phone ?? "").toLowerCase().includes(term) ||
      (provider.notes ?? "").toLowerCase().includes(term)
    )
  })

  const totalProviders = listData.length
  const providersWithNotes = listData.filter(p => p.notes?.trim()).length

  return (
    <div className="space-y-6">
      {/* Cabecera */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Proveedores</h1>
          <p className="text-sm text-muted-foreground">Gestiona contactos y notas de compra.</p>
        </div>
        <Button onClick={() => { setEditing(null); setForm(emptyProvider); setOpen(true) }} className="shadow-sm transition-transform duration-200 active:scale-95">
          <Plus className="h-4 w-4" />
          Nuevo proveedor
        </Button>
      </div>

      {/* Tarjetas de estadísticas */}
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        <Card className="border-primary/10 bg-gradient-to-br from-card to-primary/5 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total Proveedores</CardTitle>
            <Users className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{providers.isLoading ? "..." : totalProviders}</div>
            <p className="text-[10px] text-muted-foreground mt-1">Registrados en la base de datos</p>
          </CardContent>
        </Card>

        <Card className="border-primary/10 bg-gradient-to-br from-card to-primary/5 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Con Anotaciones</CardTitle>
            <MessageSquare className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{providers.isLoading ? "..." : providersWithNotes}</div>
            <p className="text-[10px] text-muted-foreground mt-1">Proveedores con notas especiales</p>
          </CardContent>
        </Card>

        <Card className="border-primary/10 bg-gradient-to-br from-card to-primary/5 shadow-sm sm:col-span-2 md:col-span-1">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Estado API</CardTitle>
            <Sparkles className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">Online</div>
            <p className="text-[10px] text-muted-foreground mt-1">Conexión con el servidor activa</p>
          </CardContent>
        </Card>
      </div>

      {/* Barra de Filtros */}
      <Card className="border-primary/10 bg-card/60 backdrop-blur-sm shadow-sm">
        <CardContent className="p-4 flex flex-col sm:flex-row gap-3 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por nombre, contacto, teléfono o notas..."
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
          {providers.isLoading ? (
            <div className="space-y-2 p-4">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-14" />)}</div>
          ) : filteredProviders.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              No se encontraron proveedores que coincidan con la búsqueda.
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filteredProviders.map((provider) => (
                <div key={provider.id} className="grid gap-3 p-4 md:grid-cols-[1fr_180px_140px_auto] md:items-center transition-colors duration-200 hover:bg-muted/30">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <Building2 className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{provider.name}</p>
                      <p className="text-xs text-muted-foreground max-w-md line-clamp-2 mt-0.5">{provider.notes || "Sin notas"}</p>
                    </div>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block md:hidden">Contacto:</span>
                    <p className="text-sm font-medium text-foreground/80">{provider.contact || "Sin contacto"}</p>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block md:hidden">Teléfono:</span>
                    <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Phone className="h-3.5 w-3.5 text-primary/70" />
                      <span>{provider.phone || "Sin teléfono"}</span>
                    </div>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="icon" className="h-8 w-8 hover:bg-primary/10 hover:text-primary transition-all duration-200" onClick={() => startEdit(provider)}><Pencil className="h-3.5 w-3.5" /></Button>
                    <Button variant="outline" size="icon" className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive transition-all duration-200" onClick={() => remove.mutate(provider.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
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
            <DialogHeader><DialogTitle>{editing ? "Editar proveedor" : "Nuevo proveedor"}</DialogTitle></DialogHeader>
            <div className="space-y-2">
              <Label>Nombre</Label>
              <Input value={form.name ?? ""} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Contacto</Label>
                <Input value={form.contact ?? ""} onChange={(event) => setForm((current) => ({ ...current, contact: event.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label>Telefono</Label>
                <Input value={form.phone ?? ""} onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Notas</Label>
              <TextArea value={form.notes ?? ""} onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label>Observaciones</Label>
              <TextArea value={form.observaciones ?? ""} onChange={(event) => setForm((current) => ({ ...current, observaciones: event.target.value }))} />
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
