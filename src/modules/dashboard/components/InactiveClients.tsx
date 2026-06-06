import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { UserX, Phone, ShoppingCart, DollarSign } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { useClientesInactivos } from "../hooks/use-dashboard"
import { LoyaltyHighlight } from "@/components/loyalty-highlight"
import { LoyaltyBadge } from "@/components/loyalty-badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

function formatCOP(value: number): string {
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()
}

export function InactiveClients() {
  const [dias, setDias] = useState(30)
  const { data: clientes, isLoading } = useClientesInactivos(dias)

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <UserX className="h-5 w-5 text-muted-foreground" />
            Clientes Inactivos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  const items = clientes ?? []

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-lg flex items-center gap-2">
            <UserX className="h-5 w-5 text-muted-foreground" />
            Clientes Inactivos
            {items.length > 0 && (
              <Badge variant="secondary">{items.length}</Badge>
            )}
          </CardTitle>
          <Select
            value={String(dias)}
            onValueChange={(v) => setDias(Number(v))}
          >
            <SelectTrigger className="h-8 w-[140px] text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="15">Últimos 15 días</SelectItem>
              <SelectItem value="30">Últimos 30 días</SelectItem>
              <SelectItem value="60">Últimos 60 días</SelectItem>
              <SelectItem value="90">Últimos 90 días</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <UserX className="h-8 w-8 text-success mb-2" />
            <p className="text-sm font-medium">Todos los clientes activos</p>
            <p className="text-xs text-muted-foreground">
              No hay clientes sin compras en los últimos {dias} días.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {items.slice(0, 10).map((cliente) => (
              <LoyaltyHighlight key={cliente.cliente_id} clienteId={cliente.cliente_id}>
                <div
                  className="flex items-center gap-3 p-3 hover:bg-muted/50 transition-colors"
                >
                  {/* Avatar */}
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-bold">
                    {getInitials(cliente.nombre)}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium truncate">
                        {cliente.nombre}
                      </p>
                      <LoyaltyBadge clienteId={cliente.cliente_id} />
                    </div>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      {cliente.telefono && (
                        <span className="flex items-center gap-1">
                          <Phone className="h-3 w-3" />
                          {cliente.telefono}
                        </span>
                      )}
                      {cliente.dias_sin_compra !== null && (
                        <span className="text-status-por-vencer font-medium">
                          {cliente.dias_sin_compra} días sin compra
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="hidden sm:flex items-center gap-3 text-xs shrink-0">
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <ShoppingCart className="h-3 w-3" />
                      {cliente.total_compras}
                    </span>
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <DollarSign className="h-3 w-3" />
                      {formatCOP(cliente.total_gastado)}
                    </span>
                  </div>
                </div>
              </LoyaltyHighlight>
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
