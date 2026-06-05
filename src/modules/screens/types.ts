export type ScreenStatus = "disponible" | "activo" | "por_vencer" | "vencida" | "caida"

export interface Screen {
  id: number
  account: number
  account_info?: string
  customer?: number
  customer_name?: string
  order?: number
  pin?: string
  precio_venta?: number
  profile_name?: string
  status: ScreenStatus
  fecha_inicio?: string
  fecha_cobro?: string
  fecha_corte?: string
  observaciones?: string
  notes?: string
  created_at: string
  updated_at: string
}
