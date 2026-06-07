import { useState, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { CreditCard, Search } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { useCobros } from "@/modules/dashboard/hooks/use-dashboard"
import { PagoCard } from "../components/PagoCard"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function PagosPage() {
  const { data: cobros, isLoading } = useCobros()

  const [search, setSearch] = useState("")
  const [platformFilter, setPlatformFilter] = useState("todas")
  const [statusFilter, setStatusFilter] = useState("todos")

  // Obtener plataformas únicas
  const plataformas = useMemo(() => {
    if (!cobros) return []
    const set = new Set<string>()
    cobros.forEach((c) => c.plataformas.forEach((p) => set.add(p)))
    return Array.from(set).sort()
  }, [cobros])

  // Filtrar
  const items = useMemo(() => {
    if (!cobros) return []
    return cobros.filter((c) => {
      // Búsqueda por nombre, teléfono
      const query = search.toLowerCase()
      if (query) {
        const matchNombre = c.cliente.toLowerCase().includes(query)
        const matchTelefono = c.telefono?.toLowerCase().includes(query) ?? false
        if (!matchNombre && !matchTelefono) return false
      }

      // Filtro por plataforma
      if (platformFilter !== "todas") {
        if (!c.plataformas.includes(platformFilter)) return false
      }

      // Filtro por status
      if (statusFilter !== "todos") {
        if (c.status !== statusFilter) return false
      }

      return true
    })
  }, [cobros, search, platformFilter, statusFilter])

  const porCobrar = items.filter((c) => c.status === "por_cobrar").length
  const porCortar = items.filter((c) => c.status === "por_cortar").length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary via-primary-soft to-primary-muted p-6 shadow-lg">
        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="relative flex items-center gap-3">
          <div className="rounded-xl bg-white/20 p-2 backdrop-blur-sm">
            <CreditCard className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Actualizar Pagos
            </h1>
            <p className="text-sm text-white/80">
              Gestión de pagos y disponibilidad de cuentas
            </p>
          </div>
        </div>
      </div>

      {/* Búsqueda y filtros */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por cliente o teléfono..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={platformFilter} onValueChange={setPlatformFilter}>
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Plataforma" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todas</SelectItem>
            {plataformas.map((p) => (
              <SelectItem key={p} value={p}>
                {p}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value="por_cobrar">Por cobrar</SelectItem>
            <SelectItem value="por_cortar">Por cortar</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Resumen */}
      <div className="flex flex-wrap items-center gap-3">
        <Badge variant="secondary" className="text-sm px-3 py-1">
          {items.length} resultado{items.length !== 1 ? "s" : ""}
        </Badge>
        {porCobrar > 0 && (
          <Badge className="text-sm px-3 py-1 bg-status-por-cobrar text-white">
            {porCobrar} por cobrar
          </Badge>
        )}
        {porCortar > 0 && (
          <Badge className="text-sm px-3 py-1 bg-status-por-cortar text-white">
            {porCortar} por cortar
          </Badge>
        )}
      </div>

      {/* Contenido */}
      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-4 space-y-3">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
                <Skeleton className="h-8 w-full" />
                <div className="flex gap-2">
                  <Skeleton className="h-8 flex-1" />
                  <Skeleton className="h-8 flex-1" />
                  <Skeleton className="h-8 flex-1" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : items.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12 text-center">
            <CreditCard className="h-12 w-12 text-success mb-3" />
            <p className="text-lg font-medium">Sin pagos pendientes</p>
            <p className="text-sm text-muted-foreground mt-1">
              {search || platformFilter !== "todas" || statusFilter !== "todos"
                ? "No se encontraron resultados con los filtros aplicados."
                : "No hay órdenes pendientes de cobro o corte."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((item) => (
            <PagoCard key={item.orden_id} item={item} />
          ))}
        </div>
      )}
    </div>
  )
}
