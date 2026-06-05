import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StatusBadge } from "@/components/status-badge"
import { PlatformIcon } from "@/components/platform-icon"
import { DateDisplay } from "@/components/date-display"
import { AlertTriangle, ArrowRight } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { useAccounts } from "@/modules/accounts/hooks/use-accounts"
import { useScreens } from "@/modules/screens/hooks/use-screens"
import type { Account } from "@/modules/accounts/types"
import type { Screen } from "@/modules/screens/types"
import { subDays, isBefore, parseISO } from "date-fns"
import { Button } from "@/components/ui/button"

function isExpiringSoon(dateStr: string | undefined, days = 7): boolean {
  if (!dateStr) return false
  const cutoff = subDays(new Date(), days)
  const date = parseISO(dateStr)
  return !isBefore(date, cutoff)
}

export function ExpiringSoon() {
  const { data: accounts, isLoading: accountsLoading } = useAccounts({ page_size: 100 })
  const { data: screens, isLoading: screensLoading } = useScreens({ page_size: 100 })

  if (accountsLoading || screensLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-warning" />
            Próximos a Vencer (7 días)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  const expiringAccounts: Account[] =
    accounts?.filter((a) => isExpiringSoon(a.fecha_corte)) ?? []

  const expiringScreens: Screen[] =
    screens?.filter((s) => isExpiringSoon(s.fecha_corte)) ?? []

  const expiringItems = [
    ...expiringAccounts.map((a) => ({
      type: "account" as const,
      id: a.id,
      platform: a.platform_name,
      label: `Cuenta #${a.id}`,
      fecha_corte: a.fecha_corte,
      status: a.status,
    })),
    ...expiringScreens.map((s) => ({
      type: "screen" as const,
      id: s.id,
      platform: s.account_info?.split(" #")[0],
      label: `Pantalla #${s.id}`,
      fecha_corte: s.fecha_corte,
      status: s.status,
    })),
  ].sort(
    (a, b) =>
      new Date(a.fecha_corte ?? 0).getTime() -
      new Date(b.fecha_corte ?? 0).getTime()
  )

  if (expiringItems.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-success" />
            Sin vencimientos próximos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Todos los items están al día. ✅
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-warning" />
          Próximos a Vencer (7 días)
          <Badge variant="destructive">{expiringItems.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {expiringItems.slice(0, 10).map((item) => (
            <div
              key={`${item.type}-${item.id}`}
              className="flex items-center gap-3 rounded-lg border border-border p-3 hover:bg-muted/50 transition-colors"
            >
              <PlatformIcon name={item.platform ?? "Desconocida"} size="sm" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{item.label}</p>
                <DateDisplay
                  date={item.fecha_corte}
                  className="text-xs text-muted-foreground"
                />
              </div>
              <StatusBadge status={item.status} />
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          ))}
          {expiringItems.length > 10 && (
            <p className="text-center text-xs text-muted-foreground pt-2">
              ...y {expiringItems.length - 10} más
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
