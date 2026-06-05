import { cn } from "@/lib/utils"
import { PLATFORM_COLORS } from "@/lib/constants"

interface PlatformIconProps {
  name: string
  size?: "sm" | "md" | "lg"
  className?: string
}

const sizeMap = {
  sm: "h-6 w-6 text-[10px]",
  md: "h-8 w-8 text-xs",
  lg: "h-10 w-10 text-sm",
}

export function PlatformIcon({ name, size = "md", className }: PlatformIconProps) {
  const color = PLATFORM_COLORS[name] || "hsl(var(--muted-foreground))"

  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-md font-bold text-white shrink-0",
        sizeMap[size],
        className
      )}
      style={{ backgroundColor: color }}
      title={name}
    >
      {name.charAt(0)}
    </div>
  )
}
