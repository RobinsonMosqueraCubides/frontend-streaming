import { useUIStore } from "@/stores/ui-store"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Header() {
  const { setMobileOpen } = useUIStore()

  return (
    <header
      className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-border/60 bg-background/85 backdrop-blur-md px-4 sm:px-6 transition-all duration-200 lg:hidden"
    >
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden text-foreground hover:bg-muted"
        onClick={() => setMobileOpen(true)}
      >
        <Menu className="h-5 w-5" />
      </Button>
    </header>
  )
}
