import { api } from "@/api/client"

export interface Customer {
  id: number
  name: string
  phone: string
  notes?: string | null
  created_at?: string
  updated_at?: string
}

export type CreateCustomerPayload = Pick<Customer, "name" | "phone" | "notes">

export const customersApi = {
  list: (params?: Record<string, unknown>) =>
    api.get<{ count?: number; results?: Customer[] } | Customer[]>("/customers/", { params }).then((r) => {
      const data = r.data
      return Array.isArray(data) ? data : data.results ?? []
    }),

  create: (data: CreateCustomerPayload) =>
    api.post<Customer>("/customers/", data).then((r) => r.data),

  update: (id: number, data: CreateCustomerPayload) =>
    api.put<Customer>(`/customers/${id}/`, data).then((r) => r.data),

  delete: (id: number) =>
    api.delete(`/customers/${id}/`),
}
