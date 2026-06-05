import { format, formatDistanceToNow, isValid, parseISO } from "date-fns"
import { es } from "date-fns/locale"

interface DateDisplayProps {
  date: string | Date | null | undefined
  showRelative?: boolean
  className?: string
  fallback?: string
}

export function DateDisplay({ date, showRelative = true, className, fallback = "—" }: DateDisplayProps) {
  if (!date) {
    return <span className={className}>{fallback}</span>
  }

  const parsed = typeof date === "string" ? parseISO(date) : date

  if (!isValid(parsed)) {
    return <span className={className}>{fallback}</span>
  }

  const formatted = format(parsed, "dd MMM yyyy", { locale: es })

  if (!showRelative) {
    return <span className={className}>{formatted}</span>
  }

  const relative = formatDistanceToNow(parsed, { addSuffix: true, locale: es })

  return (
    <span className={className}>
      {formatted}
      <span className="ml-1.5 text-xs text-muted-foreground">({relative})</span>
    </span>
  )
}
