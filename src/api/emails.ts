import { api } from "@/api/client"

export interface EmailAccount {
  id: number
  email: string
  password?: string | null
  notes?: string | null
  provider?: number | null
  provider_id?: number | null
  is_active?: boolean
}

export interface CreateEmailPayload {
  email: string
  password: string
  notes?: string
  provider?: number
  is_active?: boolean
}

export const emailsApi = {
  list: (params?: Record<string, unknown>) =>
    api.get<{ count?: number; results?: EmailAccount[] } | EmailAccount[]>("/emails/", { params }).then((r) => {
      const data = r.data
      return Array.isArray(data) ? data : data.results ?? []
    }),

  create: (data: CreateEmailPayload) =>
    api.post<EmailAccount>("/emails/", data).then((r) => r.data),

  update: (id: number, data: CreateEmailPayload) =>
    api.put<EmailAccount>(`/emails/${id}/`, data).then((r) => r.data),

  delete: (id: number) =>
    api.delete(`/emails/${id}/`),
}
