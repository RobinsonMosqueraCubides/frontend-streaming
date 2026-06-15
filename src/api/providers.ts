import { api } from "@/api/client"

export interface Provider {
  id: number
  name: string
  contact?: string | null
  phone?: string | null
  notes?: string | null
  observaciones?: string | null
  created_at?: string
}

export type CreateProviderPayload = Pick<Provider, "name" | "contact" | "phone" | "notes" | "observaciones">

export interface ProviderWarrantyClaim {
  id: number
  account: number
  provider: number
  claim_type: "password_change" | "account_replacement" | "store_credit"
  fecha_reclamo: string
  purchase_price: string
  fecha_corte: string
  remaining_days: number
  calculated_credit: string
  new_credentials?: string | null
  replacement_account?: number | null
  notes?: string | null
  created_at: string
  provider_name?: string
  platform_name?: string
  original_email?: string
  replacement_email?: string
}

export interface ApplyProviderWarrantyPayload {
  account_id: number
  claim_type: "password_change" | "account_replacement" | "store_credit"
  fecha_reclamo?: string
  new_credentials?: string
  new_email_password?: string
  new_email_address?: string
  replacement_duration_days?: number
  notes?: string
}

export const providersApi = {
  list: (params?: Record<string, unknown>) =>
    api.get<{ count?: number; results?: Provider[] } | Provider[]>("/providers/", { params }).then((r) => {
      const data = r.data
      return Array.isArray(data) ? data : data.results ?? []
    }),

  create: (data: CreateProviderPayload) =>
    api.post<Provider>("/providers/", data).then((r) => r.data),

  update: (id: number, data: CreateProviderPayload) =>
    api.put<Provider>(`/providers/${id}/`, data).then((r) => r.data),

  delete: (id: number) =>
    api.delete(`/providers/${id}/`),

  createWarranty: (data: ApplyProviderWarrantyPayload) =>
    api.post<ProviderWarrantyClaim>("/provider-warranty-claims/", data).then((r) => r.data),

  listWarranties: (params?: Record<string, unknown>) =>
    api.get<{ results?: ProviderWarrantyClaim[] } | ProviderWarrantyClaim[]>("/provider-warranty-claims/", { params }).then((r) => {
      const data = r.data
      return Array.isArray(data) ? data : data.results ?? []
    }),
}

