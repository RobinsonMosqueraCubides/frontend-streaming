import { useState, type FormEvent, type TextareaHTMLAttributes } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Building2, Pencil, Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { providersApi, type CreateProviderPayload, type Provider } from "@/api/providers"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
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

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Proveedores</h1>
          <p className="text-sm text-muted-foreground">Gestiona contactos y notas de compra.</p>
        </div>
        <Button onClick={() => { setEditing(null); setForm(emptyProvider); setOpen(true) }}>
          <Plus className="h-4 w-4" />
          Nuevo proveedor
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {providers.isLoading ? (
            <div className="space-y-2 p-4">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-14" />)}</div>
          ) : (
            <div className="divide-y divide-border">
              {(providers.data ?? []).map((provider) => (
                <div key={provider.id} className="grid gap-3 p-4 md:grid-cols-[1fr_160px_120px_auto] md:items-center">
                  <div className="flex items-start gap-3">
                    <Building2 className="mt-1 h-4 w-4 text-primary" />
                    <div>
                      <p className="font-medium">{provider.name}</p>
                      <p className="text-xs text-muted-foreground">{provider.notes || "Sin notas"}</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">{provider.contact || "Sin contacto"}</p>
                  <p className="text-sm text-muted-foreground">{provider.phone || "Sin telefono"}</p>
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="icon" onClick={() => startEdit(provider)}><Pencil className="h-4 w-4" /></Button>
                    <Button variant="ghost" size="icon" onClick={() => remove.mutate(provider.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
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
