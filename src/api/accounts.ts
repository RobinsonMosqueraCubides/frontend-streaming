import { api } from "@/api/client"
import type { Account, AccountStatus } from "@/modules/accounts/types"

export const accountsApi = {
  list: (params?: Record<string, unknown>) =>
    api.get<{ count: number; results: Account[] }>("/accounts/", { params }).then((r) => r.data),

  get: (id: number) =>
    api.get<Account>(`/accounts/${id}/`).then((r) => r.data),

  create: (data: Partial<Account>) =>
    api.post<Account>("/accounts/", data).then((r) => r.data),

  update: (id: number, data: Partial<Account>) =>
    api.put<Account>(`/accounts/${id}/`, data).then((r) => r.data),

  partialUpdate: (id: number, data: Partial<Account>) =>
    api.patch<Account>(`/accounts/${id}/`, data).then((r) => r.data),

  changeStatus: (id: number, status: AccountStatus) =>
    api.patch<Account>(`/accounts/${id}/change_status/`, { status }).then((r) => r.data),

  delete: (id: number) =>
    api.delete(`/accounts/${id}/`),
}
