import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StatusBadge } from "@/components/status-badge"
import { PlatformIcon } from "@/components/platform-icon"
import { DateDisplay } from "@/components/date-display"
import { AlertTriangle, Phone } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { useVencimientos } from "../hooks/use-dashboard"
import { Button } from "@/components/ui/button"
import type { OrderStatus } from "@/lib/constants"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"

export function ExpiringSoon() {
  const [statusFilter, setStatusFilter] = useState<string>("todos")
  const [fechaDesde, setFechaDesde] = useState("")
  const [fechaHasta, setFechaHasta] = useState("")

  const params =
    statusFilter !== "todos" || fechaDesde || fechaHasta
      ? {
          ...(statusFilter !== "todos" && { status: statusFilter }),
          ...(fechaDesde && { fecha_desde: fechaDesde }),
          ...(fechaHasta && { fecha_hasta: fechaHasta }),
        }
      : undefined

  const { data: vencimientos, isLoading } = useVencimientos(params)

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-warning" />
            Órdenes por Vencer
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  const items = vencimientos ?? []

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-warning" />
            Órdenes por Vencer
            {items.length > 0 && <Badge variant="destructive">{items.length}</Badge>}
          </CardTitle>
        </div>
        {/* Filtros */}
        <div className="flex flex-wrap gap-2 pt-1">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-8 w-[130px] text-xs">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos</SelectItem>
              <SelectItem value="activo">Activo</SelectItem>
              <SelectItem value="por_vencer">Por vencer</SelectItem>
              <SelectItem value="vencida">Vencida</SelectItem>
            </SelectContent>
          </Select>
          <Input
            type="date"
            value={fechaDesde}
            onChange={(e) => setFechaDesde(e.target.value)}
            className="h-8 w-[140px] text-xs"
            placeholder="Desde"
          />
          <Input
            type="date"
            value={fechaHasta}
            onChange={(e) => setFechaHasta(e.target.value)}
            className="h-8 w-[140px] text-xs"
            placeholder="Hasta"
          />
          {(statusFilter !== "todos" || fechaDesde || fechaHasta) && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-xs"
              onClick={() => {
                setStatusFilter("todos")
                setFechaDesde("")
                setFechaHasta("")
              }}
            >
              Limpiar
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <AlertTriangle className="h-8 w-8 text-success mb-2" />
            <p className="text-sm font-medium">Sin vencimientos próximos</p>
            <p className="text-xs text-muted-foreground">
              Todos los items están al día.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {items.slice(0, 10).map((item) => (
              <div
                key={item.orden_id}
                className="flex items-center gap-3 rounded-lg border border-border p-3 hover:bg-muted/50 transition-colors"
              >
                <PlatformIcon
                  name={item.plataformas[0] ?? "N/A"}
                  size="sm"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium truncate">
                      {item.cliente}
                    </p>
                    {item.items_count > 1 && (
                      <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                        {item.items_count} items
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    {item.plataformas.length > 0 && (
                      <span className="truncate">
                        {item.plataformas.join(", ")}
                      </span>
                    )}
                    {item.telefono && (
                      <span className="flex items-center gap-1 shrink-0">
                        <Phone className="h-3 w-3" />
                        {item.telefono}
                      </span>
                    )}
                  </div>
                </div>
                <div className="hidden sm:flex flex-col items-end gap-0.5 shrink-0">
                  <DateDisplay
                    date={item.fecha_cobro}
                    showRelative={false}
                    className="text-xs text-muted-foreground"
                  />
                  <DateDisplay
                    date={item.fecha_corte}
                    className="text-xs font-medium"
                  />
                </div>
                <StatusBadge status={item.status as OrderStatus} />
              </div>
            ))}
            {items.length > 10 && (
              <p className="text-center text-xs text-muted-foreground pt-2">
                ...y {items.length - 10} más
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
