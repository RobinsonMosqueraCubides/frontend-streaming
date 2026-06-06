import { Star } from "lucide-react"
import { cn } from "@/lib/utils"
import { useClientesAntiguos } from "@/modules/dashboard/hooks/use-dashboard"

interface LoyaltyBadgeProps {
  clienteId: number
  className?: string
}

export function LoyaltyBadge({ clienteId, className }: LoyaltyBadgeProps) {
  const { data: clientesAntiguos } = useClientesAntiguos()

  if (!clientesAntiguos?.includes(clienteId)) return null

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-amber-400 bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-600",
        className
      )}
    >
      <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
      Cliente antiguo
    </span>
  )
}
