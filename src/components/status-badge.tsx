import { cn } from "@/lib/utils"
import { STATUS_CONFIG } from "@/lib/constants"
import type { AccountStatus, ScreenStatus, OrderStatus } from "@/lib/constants"

interface StatusBadgeProps {
  status: AccountStatus | ScreenStatus | OrderStatus | "disponible"
  showDot?: boolean
  className?: string
}

export function StatusBadge({ status, showDot = true, className }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status] ?? { label: status, color: "text-slate-500", dotColor: "bg-slate-400" }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 px-2.5 py-0.5 text-xs font-semibold shadow-xs transition-all duration-200",
        config.color,
        className
      )}
    >
      {showDot && (
        <span className={cn("h-1.5 w-1.5 rounded-full", config.dotColor)} />
      )}
      {config.label}
    </span>
  )
}
