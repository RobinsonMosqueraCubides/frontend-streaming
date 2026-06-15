import { api } from "@/api/client"

export interface Order {
  id: number
  customer: number
  customer_name?: string
  total: number
  status: "activo" | "por_cobrar" | "por_vencer" | "por_cortar" | "vencida" | "caida"
  fecha_inicio?: string | null
  fecha_cobro?: string | null
  fecha_corte?: string | null
  observaciones?: string | null
  created_at?: string
  updated_at?: string
}

export type CreateOrderPayload = Partial<Order>

export const ordersApi = {
  list: (params?: Record<string, unknown>) =>
    api.get<{ count?: number; results?: Order[] } | Order[]>("/orders/", { params }).then((r) => {
      const data = r.data
      return Array.isArray(data) ? data : data.results ?? []
    }),

  create: (data: CreateOrderPayload) =>
    api.post<Order>("/orders/", data).then((r) => r.data),

  update: (id: number, data: CreateOrderPayload) =>
    api.put<Order>(`/orders/${id}/`, data).then((r) => r.data),

  partialUpdate: (id: number, data: Partial<Order>) =>
    api.patch<Order>(`/orders/${id}/`, data).then((r) => r.data),

  delete: (id: number) =>
    api.delete(`/orders/${id}/`),

  sell: (data: { customer_id: number; fecha_inicio: string; observaciones?: string; items: any[] }) =>
    api.post<Order>("/orders/sell/", data).then((r) => r.data),
}
