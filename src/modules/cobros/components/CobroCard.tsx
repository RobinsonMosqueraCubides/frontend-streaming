import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { StatusBadge } from "@/components/status-badge"
import { PlatformIcon } from "@/components/platform-icon"
import { DateDisplay } from "@/components/date-display"
import { Phone, Pencil, MessageCircle, AlertTriangle, Check } from "lucide-react"
import { EditPhoneModal } from "./EditPhoneModal"
import { useMarcarCobro } from "@/modules/dashboard/hooks/use-dashboard"
import type { Cobro } from "@/api/dashboard"
import type { OrderStatus } from "@/lib/constants"

interface CobroCardProps {
  cobro: Cobro
}

function buildWhatsAppUrl(telefono: string, mensaje: string): string {
  const cleaned = telefono.replace(/\D/g, "")
  const fullNumber = cleaned.startsWith("57") ? cleaned : `57${cleaned}`
  return `https://wa.me/${fullNumber}?text=${encodeURIComponent(mensaje)}`
}

function buildAvisoMensaje(cliente: string, plataformas: string[]): string {
  const lista = plataformas.map((p) => `  • ${p}`).join("\n")
  return `Hola ${cliente} 👋

Le recordamos que los siguientes servicios están por vencer:

${lista}

Si desea renovar, comuníquese con nosotros. ¡Gracias!`
}

function buildNotificacionMensaje(
  cliente: string,
  plataformas: string[],
  fechaCorte: string
): string {
  const lista = plataformas.map((p) => `  • ${p}`).join("\n")
  return `Hola ${cliente} ⚠️

Su servicio de streaming vence mañana:

${lista}

📅 Fecha de corte: ${fechaCorte}

Por favor realice el pago para evitar la interrupción del servicio.`
}

function buildCorteMensaje(
  cliente: string,
  plataformas: string[],
  fechaCorte: string
): string {
  const lista = plataformas.map((p) => `  • ${p}`).join("\n")
  return `Hola ${cliente} 🔴

Su servicio de streaming vence HOY:

${lista}

📅 Fecha de corte: ${fechaCorte}

De no recibir pago, su servicio será cortado. Comuníquese para regularizar.`
}

export function CobroCard({ cobro }: CobroCardProps) {
  const [editOpen, setEditOpen] = useState(false)
  const [localPhone, setLocalPhone] = useState(cobro.telefono)
  const marcarCobro = useMarcarCobro()

  const isPhoneInvalid = !localPhone || localPhone === "2222"

  const { aviso, notificacion, corte } = cobro.estado_envio

  // Lógica secuencial basada en el estado de la orden Y los envíos WhatsApp
  const isPorCobrar = cobro.status === "por_cobrar"
  const isPorCortar = cobro.status === "por_cortar"

  // Para por_cobrar: la secuencia empieza en aviso
  // Para por_cortar: la secuencia empieza en corte (saltando aviso y notificación)
  const avisoEnabled = isPorCobrar && !aviso && !isPhoneInvalid && !marcarCobro.isPending
  const notificacionEnabled = isPorCobrar && aviso && !notificacion && !isPhoneInvalid && !marcarCobro.isPending
  const corteEnabled = !isPhoneInvalid && !marcarCobro.isPending && (
    // Si es por_cortar y no se ha enviado corte aún
    (isPorCortar && !corte) ||
    // Si es por_cobrar y ya pasó por aviso y notificación
    (isPorCobrar && notificacion && !corte)
  )
  const todosEnviados = aviso && notificacion && corte

  const handlePhoneSave = (nuevoTelefono: string) => {
    setLocalPhone(nuevoTelefono)
  }

  const handleMarcar = (accion: string) => {
    marcarCobro.mutate(
      { orderId: cobro.orden_id, accion },
      {
        onSuccess: () => {
          // El cache se invalida automáticamente via onSuccess del hook
        },
      }
    )
  }

  const avisoUrl = localPhone
    ? buildWhatsAppUrl(localPhone, buildAvisoMensaje(cobro.cliente, cobro.plataformas))
    : "#"
  const notificacionUrl = localPhone
    ? buildWhatsAppUrl(
        localPhone,
        buildNotificacionMensaje(cobro.cliente, cobro.plataformas, cobro.fecha_corte ?? "")
      )
    : "#"
  const corteUrl = localPhone
    ? buildWhatsAppUrl(
        localPhone,
        buildCorteMensaje(cobro.cliente, cobro.plataformas, cobro.fecha_corte ?? "")
      )
    : "#"

  return (
    <>
      <Card
        className={
          isPhoneInvalid
            ? "border-2 border-destructive/40 shadow-md shadow-destructive/5"
            : todosEnviados
            ? "border-2 border-success/40 shadow-md shadow-success/5"
            : "border-2 border-border hover:border-primary/40 hover:shadow-md hover:shadow-primary/5 transition-all duration-200"
        }
      >
        <CardContent className="p-4 space-y-3">
          {/* Header: nombre + status */}
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="text-sm font-bold truncate">{cobro.cliente}</p>
              <StatusBadge status={cobro.status as OrderStatus} className="mt-1" />
            </div>
            {isPhoneInvalid && (
              <Badge variant="destructive" className="shrink-0 text-[10px]">
                <AlertTriangle className="h-3 w-3 mr-1" />
                Teléfono pendiente
              </Badge>
            )}
            {todosEnviados && (
              <Badge variant="success" className="shrink-0 text-[10px]">
                <Check className="h-3 w-3 mr-1" />
                Enviado
              </Badge>
            )}
          </div>

          {/* Teléfono */}
          <div className="flex items-center gap-2">
            <Phone className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <span className={`text-xs ${isPhoneInvalid ? "text-destructive font-medium" : "text-muted-foreground"}`}>
              {localPhone || "Sin teléfono"}
            </span>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 ml-auto"
              onClick={() => setEditOpen(true)}
            >
              <Pencil className="h-3 w-3 mr-1" />
              Editar
            </Button>
          </div>

          {/* Plataformas */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {cobro.plataformas.map((p) => (
              <PlatformIcon key={p} name={p} size="sm" />
            ))}
            <span className="text-[10px] text-muted-foreground ml-1">
              {cobro.plataformas.join(", ")}
            </span>
          </div>

          {/* Fecha corte */}
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <span>Corte:</span>
            <DateDisplay date={cobro.fecha_corte} showRelative className="font-medium" />
          </div>

          {/* Botones WhatsApp - secuenciales */}
          <div className="flex gap-2 pt-1">
            <Button
              asChild
              size="sm"
              className={`flex-1 text-xs ${
                aviso
                  ? "bg-muted text-muted-foreground border border-border"
                  : "bg-emerald-600 hover:bg-emerald-700 text-white"
              }`}
              disabled={!avisoEnabled}
            >
              <a
                href={avisoEnabled ? avisoUrl : undefined}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  if (!avisoEnabled) {
                    e.preventDefault()
                    return
                  }
                  handleMarcar("aviso")
                }}
              >
                {aviso ? (
                  <Check className="h-3.5 w-3.5 mr-1" />
                ) : (
                  <MessageCircle className="h-3.5 w-3.5 mr-1" />
                )}
                Aviso
              </a>
            </Button>
            <Button
              asChild
              size="sm"
              className={`flex-1 text-xs ${
                notificacion
                  ? "bg-muted text-muted-foreground border border-border"
                  : "bg-amber-500 hover:bg-amber-600 text-white"
              }`}
              disabled={!notificacionEnabled}
            >
              <a
                href={notificacionEnabled ? notificacionUrl : undefined}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  if (!notificacionEnabled) {
                    e.preventDefault()
                    return
                  }
                  handleMarcar("notificacion")
                }}
              >
                {notificacion ? (
                  <Check className="h-3.5 w-3.5 mr-1" />
                ) : (
                  <MessageCircle className="h-3.5 w-3.5 mr-1" />
                )}
                Notificación
              </a>
            </Button>
            <Button
              asChild
              size="sm"
              className={`flex-1 text-xs ${
                corte
                  ? "bg-muted text-muted-foreground border border-border"
                  : "bg-red-600 hover:bg-red-700 text-white"
              }`}
              disabled={!corteEnabled}
            >
              <a
                href={corteEnabled ? corteUrl : undefined}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  if (!corteEnabled) {
                    e.preventDefault()
                    return
                  }
                  handleMarcar("corte")
                }}
              >
                {corte ? (
                  <Check className="h-3.5 w-3.5 mr-1" />
                ) : (
                  <MessageCircle className="h-3.5 w-3.5 mr-1" />
                )}
                Corte
              </a>
            </Button>
          </div>
        </CardContent>
      </Card>

      <EditPhoneModal
        open={editOpen}
        onOpenChange={setEditOpen}
        clienteNombre={cobro.cliente}
        telefonoActual={localPhone ?? ""}
        onGuardar={handlePhoneSave}
      />
    </>
  )
}
