import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PlatformIcon } from "@/components/platform-icon"
import { Package, CircleCheck, AlertTriangle, XCircle, MinusCircle } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { useInventario } from "../hooks/use-dashboard"

function formatNumber(n: number): string {
  return new Intl.NumberFormat("es-CO").format(n)
}

export function InventorySummary() {
  const { data: inventario, isLoading } = useInventario()

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            Inventario de Cuentas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!inventario) return null

  const { cuentas, totales } = inventario

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Package className="h-5 w-5 text-primary" />
          Inventario de Cuentas
          <Badge variant="secondary" className="ml-auto">
            {formatNumber(totales.total)}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Totales resumen */}
        <div className="grid grid-cols-2 gap-3 mb-4 sm:grid-cols-4">
          <div className="flex items-center gap-2 rounded-lg border border-border p-2.5">
            <MinusCircle className="h-4 w-4 text-status-disponible shrink-0" />
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">Disponibles</p>
              <p className="text-sm font-bold">{formatNumber(totales.disponibles)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-border p-2.5">
            <CircleCheck className="h-4 w-4 text-status-activo shrink-0" />
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">Activas</p>
              <p className="text-sm font-bold">{formatNumber(totales.activas)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-border p-2.5">
            <AlertTriangle className="h-4 w-4 text-status-por-vencer shrink-0" />
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">Por vencer</p>
              <p className="text-sm font-bold">{formatNumber(totales.por_vencer)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-border p-2.5">
            <XCircle className="h-4 w-4 text-status-vencida shrink-0" />
            <div className="min-w-0">
              <p className="text-xs text-muted-foreground">Vencidas</p>
              <p className="text-sm font-bold">{formatNumber(totales.vencidas)}</p>
            </div>
          </div>
        </div>

        {/* Lista por plataforma */}
        <div className="space-y-2">
          {cuentas.map((c) => (
            <div
              key={c.plataforma}
              className="flex items-center gap-3 rounded-lg border border-border p-3 hover:bg-muted/50 transition-colors"
            >
              <PlatformIcon name={c.plataforma} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{c.plataforma}</p>
              </div>
              <div className="flex items-center gap-3 text-xs shrink-0">
                <span className="text-muted-foreground">
                  <span className="font-semibold text-foreground">{c.total}</span> total
                </span>
                <span className="text-status-disponible">
                  {c.disponibles} disp.
                </span>
                <span className="text-status-activo">
                  {c.activas} act.
                </span>
                {c.por_vencer > 0 && (
                  <span className="text-status-por-vencer">
                    {c.por_vencer} vencer
                  </span>
                )}
                {c.vencidas > 0 && (
                  <span className="text-status-vencida">
                    {c.vencidas} venc.
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
