import { cn } from "@/lib/utils"

interface LoyaltyHighlightProps {
  clienteId: number
  children: React.ReactNode
  className?: string
}

export function LoyaltyHighlight({ clienteId: _clienteId, children, className }: LoyaltyHighlightProps) {
  return (
    <div
      className={cn(
        "rounded-lg transition-all duration-200",
        "border border-border",
        className
      )}
    >
      {children}
    </div>
  )
}
