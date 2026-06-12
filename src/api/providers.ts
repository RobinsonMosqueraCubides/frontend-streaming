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
}
