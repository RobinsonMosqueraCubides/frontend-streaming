import { useMutation, useQueryClient } from "@tanstack/react-query"
import { pagosApi } from "@/api/pagos"

export function useActualizarPago() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (orderId: number) => pagosApi.actualizarPago(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard", "cobros"] })
      queryClient.invalidateQueries({ queryKey: ["dashboard", "resumen"] })
      queryClient.invalidateQueries({ queryKey: ["dashboard", "vencimientos"] })
    },
  })
}

export function useFechaPersonalizada() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ orderId, fecha }: { orderId: number; fecha: string }) =>
      pagosApi.fechaPersonalizada(orderId, fecha),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard", "cobros"] })
      queryClient.invalidateQueries({ queryKey: ["dashboard", "resumen"] })
      queryClient.invalidateQueries({ queryKey: ["dashboard", "vencimientos"] })
    },
  })
}

export function useCortePago() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (orderId: number) => pagosApi.corte(orderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard", "cobros"] })
      queryClient.invalidateQueries({ queryKey: ["dashboard", "resumen"] })
      queryClient.invalidateQueries({ queryKey: ["dashboard", "vencimientos"] })
    },
  })
}
