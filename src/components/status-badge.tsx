import { cn } from "@/lib/utils"
import { STATUS_CONFIG } from "@/lib/constants"
import type { AccountStatus, ScreenStatus, OrderStatus } from "@/lib/constants"

interface StatusBadgeProps {
  status: AccountStatus | ScreenStatus | OrderStatus | "disponible"
  showDot?: boolean
  className?: string
}

export function StatusBadge({ status, showDot = true, className }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status] ?? { label: status, dotColor: "bg-gray-400" }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-border px-2.5 py-0.5 text-xs font-medium",
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
