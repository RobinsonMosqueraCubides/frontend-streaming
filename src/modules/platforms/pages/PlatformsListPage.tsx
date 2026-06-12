import { useState, type FormEvent } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Pencil, Plus, Trash2, Tv, Search, SlidersHorizontal, Layers, Sparkles } from "lucide-react"
import { toast } from "sonner"
import { platformsApi, type Platform } from "@/api/platforms"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
  const [search, setSearch] = useState("")

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

  const listData = platforms.data ?? []
  const filteredPlatforms = listData.filter((platform) =>
    platform.name.toLowerCase().includes(search.toLowerCase().trim())
  )

  return (
    <div className="space-y-6">
      {/* Cabecera */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Plataformas</h1>
          <p className="text-sm text-muted-foreground">Catálogo de servicios vendidos.</p>
        </div>
        <Button onClick={() => { setEditing(null); setForm(emptyPlatform); setOpen(true) }} className="shadow-sm transition-transform duration-200 active:scale-95">
          <Plus className="h-4 w-4" />
          Nueva plataforma
        </Button>
      </div>

      {/* Estadísticas */}
      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="border-primary/10 bg-gradient-to-br from-card to-primary/5 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Plataformas Registradas</CardTitle>
            <Layers className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{platforms.isLoading ? "..." : listData.length}</div>
            <p className="text-[10px] text-muted-foreground mt-1">Servicios de streaming disponibles</p>
          </CardContent>
        </Card>

        <Card className="border-primary/10 bg-gradient-to-br from-card to-primary/5 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Estado Catálogo</CardTitle>
            <Sparkles className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">Activo</div>
            <p className="text-[10px] text-muted-foreground mt-1">Sincronizado correctamente</p>
          </CardContent>
        </Card>
      </div>

      {/* Filtros */}
      <Card className="border-primary/10 bg-card/60 backdrop-blur-sm shadow-sm">
        <CardContent className="p-4 flex flex-col sm:flex-row gap-3 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Buscar plataforma por nombre..."
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

      {/* Grid de Tarjetas */}
      {platforms.isLoading ? (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="h-32 border-primary/5"><CardContent className="p-4"><Skeleton className="h-full w-full" /></CardContent></Card>
          ))}
        </div>
      ) : filteredPlatforms.length === 0 ? (
        <Card className="border-dashed border-primary/20"><CardContent className="p-8 text-center text-muted-foreground">No se encontraron plataformas.</CardContent></Card>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {filteredPlatforms.map((platform) => (
            <Card key={platform.id} className="border-primary/10 hover:border-primary/30 transition-all duration-300 hover:shadow-md group">
              <CardContent className="p-4 flex flex-col justify-between h-32">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                      <Tv className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-foreground leading-tight group-hover:text-primary transition-colors duration-200">{platform.name}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">ID: {platform.id}</p>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-1.5 pt-2 border-t border-primary/5">
                  <Button variant="outline" size="icon" className="h-7 w-7 hover:bg-primary/10 hover:text-primary transition-all duration-200" onClick={() => startEdit(platform)}>
                    <Pencil className="h-3 w-3" />
                  </Button>
                  <Button variant="outline" size="icon" className="h-7 w-7 hover:bg-destructive/10 hover:text-destructive transition-all duration-200" onClick={() => remove.mutate(platform.id)}>
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

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
