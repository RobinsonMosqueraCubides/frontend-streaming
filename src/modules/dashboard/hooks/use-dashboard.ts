import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { dashboardApi } from "@/api/dashboard"

export function useDashboardResumen(rango?: string) {
  return useQuery({
    queryKey: ["dashboard", "resumen", rango],
    queryFn: () => dashboardApi.resumen({ rango }),
    refetchInterval: 30_000,
  })
}

export function useIngresosPlataforma(rango?: string) {
  return useQuery({
    queryKey: ["dashboard", "ingresos", "plataforma", rango],
    queryFn: () => dashboardApi.ingresosPlataforma({ rango }),
    staleTime: 1000 * 60 * 2,
  })
}

export function useIngresosProveedor(rango?: string) {
  return useQuery({
    queryKey: ["dashboard", "ingresos", "proveedor", rango],
    queryFn: () => dashboardApi.ingresosProveedor({ rango }),
    staleTime: 1000 * 60 * 2,
  })
}

export function useIngresosCliente(rango?: string) {
  return useQuery({
    queryKey: ["dashboard", "ingresos", "cliente", rango],
    queryFn: () => dashboardApi.ingresosCliente({ rango }),
    staleTime: 1000 * 60 * 2,
  })
}

export function useEgresosProveedor(rango?: string) {
  return useQuery({
    queryKey: ["dashboard", "egresos", "proveedor", rango],
    queryFn: () => dashboardApi.egresosProveedor({ rango }),
    staleTime: 1000 * 60 * 2,
  })
}

export function useEgresosPlataforma(rango?: string) {
  return useQuery({
    queryKey: ["dashboard", "egresos", "plataforma", rango],
    queryFn: () => dashboardApi.egresosPlataforma({ rango }),
    staleTime: 1000 * 60 * 2,
  })
}

export function useVencimientos(params?: { status?: string; fecha_desde?: string; fecha_hasta?: string }) {
  return useQuery({
    queryKey: ["dashboard", "vencimientos", params],
    queryFn: () => dashboardApi.vencimientos(params),
    staleTime: 1000 * 60 * 2,
  })
}

export function useInventario() {
  return useQuery({
    queryKey: ["dashboard", "inventario"],
    queryFn: dashboardApi.inventario,
    staleTime: 1000 * 60 * 5,
  })
}

export function useClientesInactivos(dias = 30) {
  return useQuery({
    queryKey: ["dashboard", "clientes-inactivos", dias],
    queryFn: () => dashboardApi.clientesInactivos(dias),
    staleTime: 1000 * 60 * 5,
  })
}

export function useCobros() {
  return useQuery({
    queryKey: ["dashboard", "cobros"],
    queryFn: dashboardApi.cobros,
    refetchInterval: 60_000,
  })
}

export function useMarcarCobro() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ orderId, accion }: { orderId: number; accion: string }) =>
      dashboardApi.marcarCobro(orderId, accion),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard", "cobros"] })
      queryClient.invalidateQueries({ queryKey: ["dashboard", "resumen"] })
      queryClient.invalidateQueries({ queryKey: ["dashboard", "vencimientos"] })
    },
  })
}
