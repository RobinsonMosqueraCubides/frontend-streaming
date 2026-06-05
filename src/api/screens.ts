import { api } from "@/api/client"
import type { Screen, ScreenStatus } from "@/modules/screens/types"

export const screensApi = {
  list: (params?: Record<string, unknown>) =>
    api.get<{ count: number; results: Screen[] }>("/screens/", { params }).then((r) => r.data),

  get: (id: number) =>
    api.get<Screen>(`/screens/${id}/`).then((r) => r.data),

  create: (data: Partial<Screen>) =>
    api.post<Screen>("/screens/", data).then((r) => r.data),

  update: (id: number, data: Partial<Screen>) =>
    api.put<Screen>(`/screens/${id}/`, data).then((r) => r.data),

  partialUpdate: (id: number, data: Partial<Screen>) =>
    api.patch<Screen>(`/screens/${id}/`, data).then((r) => r.data),

  changeStatus: (id: number, status: ScreenStatus) =>
    api.patch<Screen>(`/screens/${id}/change_status/`, { status }).then((r) => r.data),

  delete: (id: number) =>
    api.delete(`/screens/${id}/`),
}
