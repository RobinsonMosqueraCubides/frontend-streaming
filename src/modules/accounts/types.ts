export type AccountStatus = "activo" | "por_vencer" | "vencida" | "caida"

export interface Account {
  id: number
  email?: number
  platform: number
  platform_name?: string
  email_address?: string
  max_screens: number
  credentials?: string
  status: AccountStatus
  purchase_price?: number
  fecha_compra?: string
  fecha_pago?: string
  fecha_corte?: string
  observaciones?: string
  notes?: string
  is_active: boolean
  screens_count?: number
  available_screens?: number
  created_at: string
  updated_at: string
}
