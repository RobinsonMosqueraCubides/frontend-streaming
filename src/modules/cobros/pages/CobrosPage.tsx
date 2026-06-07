import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CircleDollarSign, PhoneOff } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { useCobros } from "@/modules/dashboard/hooks/use-dashboard"
import { CobroCard } from "../components/CobroCard"

export function CobrosPage() {
  const { data: cobros, isLoading } = useCobros()

  const items = cobros ?? []
  const invalidPhones = items.filter((c) => !c.telefono || c.telefono === "2222").length
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
            <CircleDollarSign className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Cobros</h1>
            <p className="text-sm text-white/80">
              Gestión de cobros y notificaciones por WhatsApp
            </p>
          </div>
        </div>
      </div>

      {/* Resumen */}
      <div className="flex flex-wrap items-center gap-3">
        <Badge variant="secondary" className="text-sm px-3 py-1">
          {items.length} cliente{items.length !== 1 ? "s" : ""} pendiente{items.length !== 1 ? "s" : ""}
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
        {invalidPhones > 0 && (
          <Badge variant="destructive" className="text-sm px-3 py-1">
            <PhoneOff className="h-3.5 w-3.5 mr-1" />
            {invalidPhones} teléfono{invalidPhones !== 1 ? "s" : ""} pendiente{invalidPhones !== 1 ? "s" : ""}
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
            <CircleDollarSign className="h-12 w-12 text-success mb-3" />
            <p className="text-lg font-medium">Sin cobros pendientes</p>
            <p className="text-sm text-muted-foreground mt-1">
              No hay órdenes pendientes de cobro o corte.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((cobro) => (
            <CobroCard key={cobro.orden_id} cobro={cobro} />
          ))}
        </div>
      )}
    </div>
  )
}
