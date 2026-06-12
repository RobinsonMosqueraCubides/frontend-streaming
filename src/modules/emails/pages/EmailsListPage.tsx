import { useState, type FormEvent, type TextareaHTMLAttributes } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Mail, Pencil, Plus, Trash2, Search, SlidersHorizontal, CheckCircle, XCircle } from "lucide-react"
import { toast } from "sonner"
import { emailsApi, type CreateEmailPayload, type EmailAccount } from "@/api/emails"
import { providersApi } from "@/api/providers"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
  
  // Filtros
  const [search, setSearch] = useState("")
  const [providerFilter, setProviderFilter] = useState("all")
  const [activeFilter, setActiveFilter] = useState("all")

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

  const listData = emails.data ?? []
  
  // Datos filtrados
  const filteredEmails = listData.filter((email) => {
    const matchesSearch = email.email.toLowerCase().includes(search.toLowerCase().trim())
    
    const pId = email.provider ?? email.provider_id
    const matchesProvider = providerFilter === "all" || String(pId) === providerFilter
    
    const matchesActive =
      activeFilter === "all" ||
      (activeFilter === "active" && email.is_active !== false) ||
      (activeFilter === "inactive" && email.is_active === false)

    return matchesSearch && matchesProvider && matchesActive
  })

  // Estadísticas
  const totalEmails = listData.length
  const activeEmails = listData.filter(e => e.is_active !== false).length
  const inactiveEmails = listData.filter(e => e.is_active === false).length

  return (
    <div className="space-y-6">
      {/* Cabecera */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Correos</h1>
          <p className="text-sm text-muted-foreground">Administra correos base y contraseñas.</p>
        </div>
        <Button onClick={() => { setEditing(null); setForm(emptyEmail); setOpen(true) }} className="shadow-sm transition-transform duration-200 active:scale-95">
          <Plus className="h-4 w-4" />
          Nuevo correo
        </Button>
      </div>

      {/* Tarjetas de estadísticas */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-primary/10 bg-gradient-to-br from-card to-primary/5 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Total Correos</CardTitle>
            <Mail className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{emails.isLoading ? "..." : totalEmails}</div>
            <p className="text-[10px] text-muted-foreground mt-1">Cuentas de correo base creadas</p>
          </CardContent>
        </Card>

        <Card className="border-emerald-500/10 bg-gradient-to-br from-card to-emerald-500/5 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Activos</CardTitle>
            <CheckCircle className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{emails.isLoading ? "..." : activeEmails}</div>
            <p className="text-[10px] text-muted-foreground mt-1">Habilitados para vinculación</p>
          </CardContent>
        </Card>

        <Card className="border-destructive/10 bg-gradient-to-br from-card to-destructive/5 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Inactivos</CardTitle>
            <XCircle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-destructive">{emails.isLoading ? "..." : inactiveEmails}</div>
            <p className="text-[10px] text-muted-foreground mt-1">Correos suspendidos o caídos</p>
          </CardContent>
        </Card>
      </div>

      {/* Panel de Filtros Combinados */}
      <Card className="border-primary/10 bg-card/60 backdrop-blur-sm shadow-sm">
        <CardContent className="p-4 grid gap-3 md:grid-cols-[1fr_200px_160px_auto] md:items-center">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar por dirección de correo..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 bg-background/50 focus-visible:ring-primary"
            />
          </div>

          <div className="w-full">
            <Select value={providerFilter} onValueChange={setProviderFilter}>
              <SelectTrigger className="bg-background/50 focus:ring-primary">
                <SelectValue placeholder="Proveedor" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los Proveedores</SelectItem>
                {providers.data?.map((p) => (
                  <SelectItem key={p.id} value={String(p.id)}>{p.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="w-full">
            <Select value={activeFilter} onValueChange={setActiveFilter}>
              <SelectTrigger className="bg-background/50 focus:ring-primary">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los Estados</SelectItem>
                <SelectItem value="active">Activos</SelectItem>
                <SelectItem value="inactive">Inactivos</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground px-2 py-1.5 bg-muted/50 rounded-md border justify-center">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span>Filtros:</span>
            {(search || providerFilter !== "all" || activeFilter !== "all") ? (
              <span className="bg-primary text-primary-foreground px-1.5 py-0.5 rounded text-[10px] font-bold">Activos</span>
            ) : (
              <span className="text-[10px]">Ninguno</span>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Listado de Correos */}
      <Card className="border-primary/10 shadow-sm overflow-hidden">
        <CardContent className="p-0">
          {emails.isLoading ? (
            <div className="space-y-2 p-4">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-14" />)}</div>
          ) : filteredEmails.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              No se encontraron correos con los filtros actuales.
            </div>
          ) : (
            <div className="divide-y divide-border">
              {filteredEmails.map((email) => (
                <div key={email.id} className="grid gap-3 p-4 md:grid-cols-[1fr_200px_120px_auto] md:items-center transition-colors duration-200 hover:bg-muted/30">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <Mail className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground">{email.email}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{email.notes || "Sin observaciones adicionales"}</p>
                    </div>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block md:hidden">Proveedor:</span>
                    <span className="text-sm font-medium text-foreground/80 bg-primary/5 px-2 py-1 rounded border border-primary/15">{providerName(email.provider ?? email.provider_id)}</span>
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider block md:hidden">Estado:</span>
                    <Badge variant={email.is_active === false ? "secondary" : "success"}>
                      {email.is_active === false ? "Inactivo" : "Activo"}
                    </Badge>
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="icon" className="h-8 w-8 hover:bg-primary/10 hover:text-primary transition-all duration-200" onClick={() => startEdit(email)}><Pencil className="h-3.5 w-3.5" /></Button>
                    <Button variant="outline" size="icon" className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive transition-all duration-200" onClick={() => remove.mutate(email.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
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
