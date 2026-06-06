import { useDashboardResumen } from "../hooks/use-dashboard"
import { KpiCards } from "../components/KpiCards"
import { RevenueByPlatform } from "../components/RevenueByPlatform"
import { InventorySummary } from "../components/InventorySummary"
import { StatusChart } from "../components/StatusChart"
import { ExpiringSoon } from "../components/ExpiringSoon"
import { InactiveClients } from "../components/InactiveClients"
import { useAccounts } from "@/modules/accounts/hooks/use-accounts"
import { useScreens } from "@/modules/screens/hooks/use-screens"
import { Zap } from "lucide-react"

export function DashboardPage() {
  useDashboardResumen()
  const { data: accounts } = useAccounts()
  const { data: screens } = useScreens()

  // Build status distribution data for donut chart
  const buildStatusData = () => {
    if (!accounts && !screens) return []

    const counts: Record<string, number> = {}
    const addCount = (status: string, count = 1) => {
      counts[status] = (counts[status] || 0) + count
    }

    accounts?.forEach((a) => addCount(a.status))
    screens?.forEach((s) => addCount(s.status))

    return Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
  }

  return (
    <div className="space-y-6">
      {/* Purple gradient header */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary via-primary-soft to-primary-muted p-6 shadow-lg">
        <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        <div className="relative flex items-center gap-3">
          <div className="rounded-xl bg-white/20 p-2 backdrop-blur-sm">
            <Zap className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Dashboard</h1>
            <p className="text-sm text-white/80">
              Resumen financiero y operativo del negocio
            </p>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <KpiCards />

      {/* Row 1: Revenue + Inventory */}
      <div className="grid gap-6 lg:grid-cols-2">
        <RevenueByPlatform />
        <InventorySummary />
      </div>

      {/* Row 2: Status chart + Expiring soon */}
      <div className="grid gap-6 lg:grid-cols-2">
        <StatusChart
          data={buildStatusData()}
          title="Distribución de Estados"
        />
        <ExpiringSoon />
      </div>

      {/* Row 3: Inactive clients (full width) */}
      <InactiveClients />
    </div>
  )
}
