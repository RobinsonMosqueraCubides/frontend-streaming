import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/status-badge"
import { PlatformIcon } from "@/components/platform-icon"
import { DateDisplay } from "@/components/date-display"
import { CalendarPlus, CalendarClock, Scissors } from "lucide-react"
import { useActualizarPago, useFechaPersonalizada, useCortePago } from "../hooks/use-pagos"
import { FechaPersonalizadaModal } from "./FechaPersonalizadaModal"
import { ConfirmCorteModal } from "./ConfirmCorteModal"
import { toast } from "sonner"
import type { PagoItem } from "@/api/pagos"
import type { OrderStatus } from "@/lib/constants"

interface PagoCardProps {
  item: PagoItem
}

export function PagoCard({ item }: PagoCardProps) {
  const [fechaModalOpen, setFechaModalOpen] = useState(false)
  const [corteModalOpen, setCorteModalOpen] = useState(false)

  const actualizarPago = useActualizarPago()
  const fechaPersonalizada = useFechaPersonalizada()
  const cortePago = useCortePago()

  const isLoading = actualizarPago.isPending || fechaPersonalizada.isPending || cortePago.isPending

  const handleActualizarPago = () => {
    actualizarPago.mutate(item.orden_id, {
      onSuccess: () => toast.success("Pago actualizado: +30 días"),
      onError: () => toast.error("Error al actualizar pago"),
    })
  }

  const handleFechaPersonalizada = (fecha: string) => {
    fechaPersonalizada.mutate(
      { orderId: item.orden_id, fecha },
      {
        onSuccess: () => {
          toast.success(`Fecha de cobro actualizada a ${fecha}`)
          setFechaModalOpen(false)
        },
        onError: () => toast.error("Error al actualizar fecha"),
      }
    )
  }

  const handleCorte = () => {
    cortePago.mutate(item.orden_id, {
      onSuccess: () => {
        toast.success("Orden cortada y recursos liberados")
        setCorteModalOpen(false)
      },
      onError: () => toast.error("Error al procesar corte"),
    })
  }

  const isPorCobrar = item.status === "por_cobrar"
  const isPorCortar = item.status === "por_cortar"

  return (
    <>
      <Card
        className={`border-2 transition-all duration-200 ${
          isPorCortar
            ? "border-status-por-cortar/40 shadow-md shadow-status-por-cortar/5"
            : isPorCobrar
            ? "border-status-por-cobrar/40 shadow-md shadow-status-por-cobrar/5"
            : "border-border hover:border-primary/40 hover:shadow-md hover:shadow-primary/5"
        }`}
      >
        <CardContent className="p-4 space-y-3">
          {/* Header: plataformas + status */}
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-1.5">
              {item.plataformas.map((p) => (
                <PlatformIcon key={p} name={p} size="sm" />
              ))}
            </div>
            <StatusBadge status={item.status as OrderStatus} />
          </div>

          {/* Cliente */}
          <div>
            <p className="text-sm font-bold truncate">{item.cliente}</p>
            {item.telefono && (
              <p className="text-xs text-muted-foreground">📱 {item.telefono}</p>
            )}
          </div>

          {/* Fechas */}
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <p className="text-muted-foreground">Cobro</p>
              <DateDisplay date={item.fecha_cobro} showRelative className="font-medium" />
            </div>
            <div>
              <p className="text-muted-foreground">Corte</p>
              <DateDisplay date={item.fecha_corte} showRelative className="font-medium" />
            </div>
          </div>

          {/* Items */}
          <p className="text-xs text-muted-foreground">
            📦 {item.items_count} item{item.items_count !== 1 ? "s" : ""}
          </p>

          {/* Botones de acción */}
          <div className="flex gap-2 pt-1">
            <Button
              size="sm"
              className="flex-1 text-xs bg-emerald-600 hover:bg-emerald-700 text-white"
              onClick={handleActualizarPago}
              disabled={isLoading}
            >
              <CalendarPlus className="h-3.5 w-3.5 mr-1" />
              +30 días
            </Button>
            <Button
              size="sm"
              className="flex-1 text-xs bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={() => setFechaModalOpen(true)}
              disabled={isLoading}
            >
              <CalendarClock className="h-3.5 w-3.5 mr-1" />
              Fecha
            </Button>
            <Button
              size="sm"
              className="flex-1 text-xs bg-destructive hover:bg-destructive/90 text-destructive-foreground"
              onClick={() => setCorteModalOpen(true)}
              disabled={isLoading}
            >
              <Scissors className="h-3.5 w-3.5 mr-1" />
              Corte
            </Button>
          </div>
        </CardContent>
      </Card>

      <FechaPersonalizadaModal
        open={fechaModalOpen}
        onOpenChange={setFechaModalOpen}
        clienteNombre={item.cliente}
        fechaActual={item.fecha_cobro}
        onGuardar={handleFechaPersonalizada}
        loading={fechaPersonalizada.isPending}
      />

      <ConfirmCorteModal
        open={corteModalOpen}
        onOpenChange={setCorteModalOpen}
        clienteNombre={item.cliente}
        plataformas={item.plataformas}
        ordenId={item.orden_id}
        onConfirmar={handleCorte}
        loading={cortePago.isPending}
      />
    </>
  )
}
