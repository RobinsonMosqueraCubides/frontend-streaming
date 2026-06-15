import * as React from "react"
import { cn } from "@/lib/utils"

const Badge = React.forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement> & {
  variant?: "default" | "secondary" | "destructive" | "outline" | "success" | "warning"
}>(
  ({ className, variant = "default", ...props }, ref) => {
    const variants = {
      default: "bg-primary text-primary-foreground border-primary-hover",
      secondary: "bg-slate-100 text-slate-800 border-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700",
      destructive: "bg-rose-600 text-white border-rose-700 dark:bg-rose-700 dark:text-rose-50 dark:border-rose-600",
      outline: "border-border text-foreground bg-white dark:bg-slate-900",
      success: "bg-emerald-600 text-white border-emerald-700 dark:bg-emerald-700 dark:text-emerald-50 dark:border-emerald-600",
      warning: "bg-amber-500 text-amber-950 border-amber-600 dark:bg-amber-600 dark:text-amber-50 dark:border-amber-500",
    }

    return (
      <span
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
          variants[variant],
          className
        )}
        {...props}
      />
    )
  }
)
Badge.displayName = "Badge"

export { Badge }
