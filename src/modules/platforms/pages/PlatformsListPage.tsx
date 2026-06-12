import { useState, type FormEvent } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Pencil, Plus, Trash2, Tv } from "lucide-react"
import { toast } from "sonner"
import { platformsApi, type Platform } from "@/api/platforms"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"

const emptyPlatform = { name: "" }

export function PlatformsListPage() {
  const queryClient = useQueryClient()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Platform | null>(null)
  const [form, setForm] = useState(emptyPlatform)

  const platforms = useQuery({ queryKey: ["platforms"], queryFn: platformsApi.list })

  const save = useMutation({
    mutationFn: () => editing ? platformsApi.update(editing.id, form) : platformsApi.create(form),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["platforms"] })
      setOpen(false)
      setEditing(null)
      setForm(emptyPlatform)
      toast.success(editing ? "Plataforma actualizada" : "Plataforma registrada")
    },
    onError: () => toast.error("No se pudo guardar la plataforma"),
  })

  const remove = useMutation({
    mutationFn: platformsApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["platforms"] })
      toast.success("Plataforma eliminada")
    },
    onError: () => toast.error("No se pudo eliminar la plataforma"),
  })

  const submit = (event: FormEvent) => {
    event.preventDefault()
    if (!form.name.trim()) {
      toast.error("Escribe el nombre de la plataforma")
      return
    }
    save.mutate()
  }

  const startEdit = (platform: Platform) => {
    setEditing(platform)
    setForm({ name: platform.name })
    setOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Plataformas</h1>
          <p className="text-sm text-muted-foreground">Catalogo de servicios vendidos.</p>
        </div>
        <Button onClick={() => { setEditing(null); setForm(emptyPlatform); setOpen(true) }}>
          <Plus className="h-4 w-4" />
          Nueva plataforma
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          {platforms.isLoading ? (
            <div className="space-y-2 p-4">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-12" />)}</div>
          ) : (
            <div className="divide-y divide-border">
              {(platforms.data ?? []).map((platform) => (
                <div key={platform.id} className="flex items-center gap-3 p-4">
                  <Tv className="h-4 w-4 text-primary" />
                  <div className="flex-1">
                    <p className="font-medium">{platform.name}</p>
                    <p className="text-xs text-muted-foreground">ID {platform.id}</p>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => startEdit(platform)}><Pencil className="h-4 w-4" /></Button>
                  <Button variant="ghost" size="icon" onClick={() => remove.mutate(platform.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <form onSubmit={submit} className="space-y-4">
            <DialogHeader><DialogTitle>{editing ? "Editar plataforma" : "Nueva plataforma"}</DialogTitle></DialogHeader>
            <div className="space-y-2">
              <Label htmlFor="platformName">Nombre</Label>
              <Input id="platformName" value={form.name} onChange={(event) => setForm({ name: event.target.value })} />
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
