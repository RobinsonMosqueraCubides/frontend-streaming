import { api } from "@/api/client"

export interface PagoItem {
  orden_id: number
  customer_id: number
  cliente: string
  telefono: string | null
  fecha_cobro: string | null
  fecha_corte: string | null
  status: string
  plataformas: string[]
  items_count: number
  estado_envio: {
    aviso: boolean
    notificacion: boolean
    corte: boolean
  }
}

export const pagosApi = {
  actualizarPago: (orderId: number) =>
    api.post("/dashboard/pagos/actualizar-pago/", { order_id: orderId }).then((r) => r.data),

  fechaPersonalizada: (orderId: number, nuevaFecha: string) =>
    api.post("/dashboard/pagos/fecha-personalizada/", { order_id: orderId, nueva_fecha: nuevaFecha }).then((r) => r.data),

  corte: (orderId: number) =>
    api.post("/dashboard/pagos/corte/", { order_id: orderId }).then((r) => r.data),
}
