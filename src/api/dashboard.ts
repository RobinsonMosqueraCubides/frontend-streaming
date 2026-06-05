import { api } from "@/api/client"

// ─── Dashboard types ─────────────────────────────

export interface DashboardResumen {
  ingresos: {
    orders_total: number
    screens_total: number
    customer_accounts_total: number
    total: number
  }
  egresos: number
  balance: number
  conteos: {
    cuentas_activas: number
    pantallas_vendidas: number
    pantallas_disponibles: number
    ordenes_activas: number
  }
}

export interface IngresoPorPlataforma {
  plataforma: string
  screens: number
  cuentas: number
  total: number
  count_screens: number
  count_cuentas: number
}

export interface IngresoPorProveedor {
  proveedor: string
  total: number
  count: number
}

export interface IngresoPorCliente {
  cliente: string
  total: number
  count: number
}

export interface EgresoPorProveedor {
  proveedor: string
  total: number
  count: number
}

export interface EgresoPorPlataforma {
  plataforma: string
  total: number
  count: number
}

// ─── API functions ───────────────────────────────

export const dashboardApi = {
  resumen: () =>
    api.get<DashboardResumen>("/dashboard/resumen/").then((r) => r.data),

  ingresosPlataforma: () =>
    api.get<IngresoPorPlataforma[]>("/dashboard/ingresos/plataforma/").then((r) => r.data),

  ingresosProveedor: () =>
    api.get<IngresoPorProveedor[]>("/dashboard/ingresos/proveedor/").then((r) => r.data),

  ingresosCliente: () =>
    api.get<IngresoPorCliente[]>("/dashboard/ingresos/cliente/").then((r) => r.data),

  egresosProveedor: () =>
    api.get<EgresoPorProveedor[]>("/dashboard/egresos/proveedor/").then((r) => r.data),

  egresosPlataforma: () =>
    api.get<EgresoPorPlataforma[]>("/dashboard/egresos/plataforma/").then((r) => r.data),
}
