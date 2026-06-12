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

export interface Vencimiento {
  orden_id: number
  customer_id: number
  cliente: string
  telefono: string | null
  fecha_cobro: string | null
  fecha_corte: string | null
  status: string
  plataformas: string[]
  items_count: number
}

export interface InventarioPlataforma {
  plataforma: string
  total: number
  disponibles: number
  activas: number
  por_vencer: number
  vencidas: number
  caidas: number
}

export interface Inventario {
  cuentas: InventarioPlataforma[]
  totales: {
    total: number
    disponibles: number
    activas: number
    por_vencer: number
    vencidas: number
    caidas: number
  }
}

export interface ClienteInactivo {
  cliente_id: number
  nombre: string
  telefono: string
  ultima_compra: string | null
  dias_sin_compra: number | null
  total_compras: number
  total_gastado: number
  plataformas: string[]
  ultima_plataforma: string | null
}

export type Cobro = Vencimiento & {
  estado_envio: {
    aviso: boolean
    notificacion: boolean
    corte: boolean
  }
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

  vencimientos: (params?: { status?: string; fecha_desde?: string; fecha_hasta?: string }) =>
    api.get<Vencimiento[]>("/dashboard/vencimientos/", { params }).then((r) => r.data),

  inventario: () =>
    api.get<Inventario>("/dashboard/inventario/").then((r) => r.data),

  clientesInactivos: (dias = 30) =>
    api.get<ClienteInactivo[]>("/dashboard/clientes-inactivos/", { params: { dias } }).then((r) => r.data),

  cobros: () =>
    api.get<Cobro[]>("/dashboard/cobros/").then((r) => r.data),

  marcarCobro: (orderId: number, accion: string) =>
    api.post("/dashboard/cobros/marcar/", { order_id: orderId, accion }).then((r) => r.data),
}
