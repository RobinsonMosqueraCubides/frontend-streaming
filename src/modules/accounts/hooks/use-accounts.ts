import { useQuery } from "@tanstack/react-query"
import { accountsApi } from "@/api/accounts"

export function useAccounts(filters?: Record<string, unknown>) {
  return useQuery({
    queryKey: ["accounts", filters],
    queryFn: () => accountsApi.list({ page_size: 100, ...filters }).then((r) => r.results),
  })
}

export function useAccount(id: number) {
  return useQuery({
    queryKey: ["accounts", id],
    queryFn: () => accountsApi.get(id),
    enabled: !!id,
  })
}
