import { useQuery } from "@tanstack/react-query"
import { screensApi } from "@/api/screens"


export function useScreens(filters?: Record<string, unknown>) {
  return useQuery({
    queryKey: ["screens", filters],
    queryFn: () => screensApi.list({ page_size: 100, ...filters }).then((r) => r.results),
  })
}

export function useScreen(id: number) {
  return useQuery({
    queryKey: ["screens", id],
    queryFn: () => screensApi.get(id),
    enabled: !!id,
  })
}
