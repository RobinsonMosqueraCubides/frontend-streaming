import { useQuery } from "@tanstack/react-query"
import { dashboardApi } from "@/api/dashboard"

export function useDashboardResumen() {
  return useQuery({
    queryKey: ["dashboard", "resumen"],
    queryFn: dashboardApi.resumen,
    refetchInterval: 30_000,
  })
}

export function useIngresosPlataforma() {
  return useQuery({
    queryKey: ["dashboard", "ingresos", "plataforma"],
    queryFn: dashboardApi.ingresosPlataforma,
    staleTime: 1000 * 60 * 2,
  })
}

export function useIngresosProveedor() {
  return useQuery({
    queryKey: ["dashboard", "ingresos", "proveedor"],
    queryFn: dashboardApi.ingresosProveedor,
    staleTime: 1000 * 60 * 2,
  })
}

export function useIngresosCliente() {
  return useQuery({
    queryKey: ["dashboard", "ingresos", "cliente"],
    queryFn: dashboardApi.ingresosCliente,
    staleTime: 1000 * 60 * 2,
  })
}

export function useEgresosProveedor() {
  return useQuery({
    queryKey: ["dashboard", "egresos", "proveedor"],
    queryFn: dashboardApi.egresosProveedor,
    staleTime: 1000 * 60 * 2,
  })
}

export function useEgresosPlataforma() {
  return useQuery({
    queryKey: ["dashboard", "egresos", "plataforma"],
    queryFn: dashboardApi.egresosPlataforma,
    staleTime: 1000 * 60 * 2,
  })
}
