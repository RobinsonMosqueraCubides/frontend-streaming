import { useUIStore } from "@/stores/ui-store"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PATHS } from "@/routes/paths"
import { useLocation } from "react-router-dom"

const pathLabels: Record<string, string> = {
  [PATHS.dashboard]: "Dashboard",
  [PATHS.accounts]: "Cuentas",
  [PATHS.screens]: "Pantallas",
  [PATHS.customerAccounts]: "Cuentas de Cliente",
  [PATHS.orders]: "Órdenes",
  [PATHS.customers]: "Clientes",
  [PATHS.providers]: "Proveedores",
  [PATHS.emails]: "Correos",
}

export function Header() {
  const { setMobileOpen } = useUIStore()
  const location = useLocation()
  const label = pathLabels[location.pathname] || location.pathname

  return (
    <header
      className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-white/10 px-4 sm:px-6 lg:px-8"
      style={{ backgroundColor: "#7C3AED" }}
    >
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden text-white hover:bg-white/10"
        onClick={() => setMobileOpen(true)}
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Breadcrumb */}
      <nav className="flex items-center text-sm">
        <span className="font-medium text-white">{label}</span>
      </nav>

      <div className="ml-auto flex items-center gap-2">
        {/* User avatar */}
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 text-xs font-medium text-white backdrop-blur-sm">
          A
        </div>
      </div>
    </header>
  )
}
