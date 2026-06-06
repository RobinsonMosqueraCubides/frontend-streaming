import { KpiCard } from "@/components/kpi-card"
import { Wallet, TrendingDown, TrendingUp, KeyRound, Monitor, Receipt, Star } from "lucide-react"
import { useDashboardResumen, useClientesAntiguos } from "../hooks/use-dashboard"

function formatCOP(value: number | string): string {
  const num = typeof value === "string" ? parseFloat(value) : value
  return new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency: "COP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num)
}

export function KpiCards() {
  const { data, isLoading } = useDashboardResumen()
  const { data: clientesAntiguos } = useClientesAntiguos()

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-7">
        {Array.from({ length: 7 }).map((_, i) => (
          <KpiCard key={i} title="" value="" loading />
        ))}
      </div>
    )
  }

  if (!data) return null

  const { ingresos, egresos, balance, conteos } = data

  const kpis = [
    {
      title: "Ingresos",
      value: formatCOP(ingresos.total),
      icon: Wallet,
      subtitle: `Órdenes: $${(ingresos.orders_total / 1000).toFixed(0)}K`,
    },
    {
      title: "Egresos",
      value: formatCOP(egresos),
      icon: TrendingDown,
    },
    {
      title: "Balance",
      value: formatCOP(balance),
      icon: TrendingUp,
      subtitle: balance >= 0 ? "Positivo ✓" : "Negativo ⚠",
    },
    {
      title: "Cuentas Activas",
      value: conteos.cuentas_activas,
      icon: KeyRound,
    },
    {
      title: "Pantallas Vendidas",
      value: conteos.pantallas_vendidas,
      icon: Monitor,
      subtitle: `${conteos.pantallas_disponibles} disponibles`,
    },
    {
      title: "Órdenes Activas",
      value: conteos.ordenes_activas,
      icon: Receipt,
    },
    {
      title: "Clientes Antiguos",
      value: clientesAntiguos?.length ?? 0,
      icon: Star,
      subtitle: "1+ año de relación",
    },
  ]

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-7">
      {kpis.map((kpi) => (
        <KpiCard key={kpi.title} {...kpi} />
      ))}
    </div>
  )
}
