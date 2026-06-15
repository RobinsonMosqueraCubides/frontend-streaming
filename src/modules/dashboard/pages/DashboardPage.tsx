import { useMemo, useState } from 'react'
import { KpiCards } from "../components/KpiCards"
import { RevenueByPlatform } from "../components/RevenueByPlatform"
import { InventorySummary } from "../components/InventorySummary"
import { StatusChart } from "../components/StatusChart"
import { ExpiringSoon } from "../components/ExpiringSoon"
import { InactiveClients } from "../components/InactiveClients"
import { useAccounts } from "@/modules/accounts/hooks/use-accounts"
import { useScreens } from "@/modules/screens/hooks/use-screens"
import { Zap, Calendar } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function DashboardPage() {
  const [rango, setRango] = useState<string>("historico")
  const { data: accounts } = useAccounts()
  const { data: screens } = useScreens()

  // Build status distribution data for donut chart
  const statusData = useMemo(() => {
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
  }, [accounts, screens])

  return (
    <div className="space-y-6">
      {/* Solid header */}
      <div className="relative overflow-hidden rounded-2xl bg-primary p-6 shadow-lg flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
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

        {/* Date Filter Dropdown */}
        <div className="relative shrink-0 w-[200px] z-10">
          <Select value={rango} onValueChange={setRango}>
            <SelectTrigger className="bg-white border-none text-primary shadow-md hover:bg-white/90 font-medium transition-colors">
              <Calendar className="h-4 w-4 mr-2 text-primary" />
              <SelectValue placeholder="Rango de fecha" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="historico">Histórico completo</SelectItem>
              <SelectItem value="mes_actual">Mes actual</SelectItem>
              <SelectItem value="ultimos_3_meses">Últimos 3 meses</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* KPI Cards */}
      <KpiCards rango={rango} />

      {/* Row 1: Revenue + Inventory */}
      <div className="grid gap-6 lg:grid-cols-2">
        <RevenueByPlatform rango={rango} />
        <InventorySummary />
      </div>

      {/* Row 2: Status chart + Expiring soon */}
      <div className="grid gap-6 lg:grid-cols-2">
        <StatusChart
          data={statusData}
          title="Distribución de Estados"
        />
        <ExpiringSoon />
      </div>

      {/* Row 3: Inactive clients (full width) */}
      <InactiveClients />
    </div>
  )
}

