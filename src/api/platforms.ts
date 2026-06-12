import { api } from "@/api/client"

export interface Platform {
  id: number
  name: string
}

export const platformsApi = {
  list: () =>
    api.get<{ count?: number; results?: Platform[] } | Platform[]>("/platforms/").then((r) => {
      const data = r.data
      return Array.isArray(data) ? data : data.results ?? []
    }),

  create: (data: Pick<Platform, "name">) =>
    api.post<Platform>("/platforms/", data).then((r) => r.data),

  update: (id: number, data: Pick<Platform, "name">) =>
    api.put<Platform>(`/platforms/${id}/`, data).then((r) => r.data),

  delete: (id: number) =>
    api.delete(`/platforms/${id}/`),
}
