interface PriceDisplayProps {
  amount: number | string | null | undefined
  className?: string
  currency?: string
}

export function PriceDisplay({ amount, className, currency = "COP" }: PriceDisplayProps) {
  if (amount === null || amount === undefined) {
    return <span className={className}>—</span>
  }

  const num = typeof amount === "string" ? parseFloat(amount) : amount

  const formatted = new Intl.NumberFormat("es-CO", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num)

  return <span className={className}>{formatted}</span>
}
