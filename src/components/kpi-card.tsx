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
      <Card className="border border-border/80 bg-card/60 backdrop-blur-sm">
        <CardContent className="p-5">
          <Skeleton className="h-3.5 w-16 mb-2 rounded-full" />
          <Skeleton className="h-8 w-24 rounded-md" />
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="group relative overflow-hidden border border-border/60 bg-card hover:bg-gradient-to-br hover:from-card hover:to-primary/[0.02] hover:border-primary/30 hover:shadow-lg hover:shadow-primary/[0.03] transition-all duration-300 hover:-translate-y-0.5">
      {/* Decorative gradient corner glow */}
      <div className="absolute -right-6 -top-6 h-12 w-12 rounded-full bg-primary/5 blur-xl group-hover:bg-primary/10 transition-colors duration-300" />
      
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div className="space-y-1.5 min-w-0">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/80 truncate">
              {title}
            </p>
            <p className="text-2xl font-extrabold tracking-tight text-foreground bg-gradient-to-r from-foreground to-foreground group-hover:from-primary group-hover:to-primary-soft bg-clip-text transition-all duration-300">
              {value}
            </p>
            {subtitle && (
              <p className="text-[11px] text-muted-foreground/80 truncate font-medium flex items-center gap-1">
                {subtitle}
              </p>
            )}
          </div>
          {Icon && (
            <div className="rounded-xl bg-primary/[0.07] text-primary p-2.5 shrink-0 ml-3 border border-primary/10 group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300 shadow-sm">
              <Icon className="h-4.5 w-4.5" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
