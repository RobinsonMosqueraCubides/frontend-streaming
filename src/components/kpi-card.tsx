import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import type { LucideIcon } from "lucide-react"

interface KpiCardProps {
  title: string
  value: string | number
  icon?: LucideIcon
  subtitle?: string
  loading?: boolean
}

export function KpiCard({ title, value, icon: Icon, subtitle, loading }: KpiCardProps) {
  if (loading) {
    return (
      <Card className="border-2 border-border">
        <CardContent className="p-5">
          <Skeleton className="h-3 w-20 mb-2" />
          <Skeleton className="h-7 w-28" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-2 border-border hover:border-primary/40 hover:shadow-md hover:shadow-primary/5 transition-all duration-200">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-1 min-w-0">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground truncate">
              {title}
            </p>
            <p className="text-2xl font-bold tracking-tight text-foreground">{value}</p>
            {subtitle && (
              <p className="text-xs text-muted-foreground truncate">{subtitle}</p>
            )}
          </div>
          {Icon && (
            <div className="rounded-xl bg-primary/10 text-primary p-2.5 shrink-0 ml-3">
              <Icon className="h-5 w-5" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
