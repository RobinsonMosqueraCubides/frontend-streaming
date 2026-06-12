import { api } from "@/api/client"

export interface CustomerAccount {
  id: number
  account: number
  account_info?: string
  platform_name?: string
  email_address?: string
  customer: number
  customer_name?: string
  order?: number | null
  contrasena: string
  precio_venta: number
  profile_name?: string | null
  status: "activo" | "por_vencer" | "vencida" | "caida"
  fecha_inicio?: string | null
  fecha_cobro?: string | null
  fecha_corte?: string | null
  observaciones?: string | null
  created_at?: string
  updated_at?: string
}

export type CreateCustomerAccountPayload = Partial<CustomerAccount>

export const customerAccountsApi = {
  list: (params?: Record<string, unknown>) =>
    api.get<{ count?: number; results?: CustomerAccount[] } | CustomerAccount[]>("/customer-accounts/", { params }).then((r) => {
      const data = r.data
      return Array.isArray(data) ? data : data.results ?? []
    }),

  create: (data: CreateCustomerAccountPayload) =>
    api.post<CustomerAccount>("/customer-accounts/", data).then((r) => r.data),

  update: (id: number, data: CreateCustomerAccountPayload) =>
    api.put<CustomerAccount>(`/customer-accounts/${id}/`, data).then((r) => r.data),

  partialUpdate: (id: number, data: Partial<CustomerAccount>) =>
    api.patch<CustomerAccount>(`/customer-accounts/${id}/`, data).then((r) => r.data),

  delete: (id: number) =>
    api.delete(`/customer-accounts/${id}/`),
}
