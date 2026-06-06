import { cn } from "@/lib/utils"
import { useClientesAntiguos } from "@/modules/dashboard/hooks/use-dashboard"

interface LoyaltyHighlightProps {
  clienteId: number
  children: React.ReactNode
  className?: string
}

export function LoyaltyHighlight({ clienteId, children, className }: LoyaltyHighlightProps) {
  const { data: clientesAntiguos } = useClientesAntiguos()

  const isAntiguo = clientesAntiguos?.includes(clienteId) ?? false

  return (
    <div
      className={cn(
        "rounded-lg transition-all duration-200",
        isAntiguo &&
          "border-2 border-amber-400 shadow-md shadow-amber-400/20 dark:border-amber-600 dark:shadow-amber-600/20",
        !isAntiguo && "border border-border",
        className
      )}
    >
      {children}
    </div>
  )
}
