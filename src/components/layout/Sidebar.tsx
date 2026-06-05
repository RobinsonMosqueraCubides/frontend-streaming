import { useUIStore } from "@/stores/ui-store"
import { useThemeStore } from "@/stores/theme-store"
import { NavLink } from "react-router-dom"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  KeyRound,
  Monitor,
  Users,
  Receipt,
  UserCircle,
  Building2,
  Mail,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { PATHS } from "@/routes/paths"

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: PATHS.dashboard },
  { icon: KeyRound, label: "Cuentas", path: PATHS.accounts },
  { icon: Monitor, label: "Pantallas", path: PATHS.screens },
  { icon: Users, label: "Ctas. Cliente", path: PATHS.customerAccounts },
  { icon: Receipt, label: "Órdenes", path: PATHS.orders },
  { icon: UserCircle, label: "Clientes", path: PATHS.customers },
  { icon: Building2, label: "Proveedores", path: PATHS.providers },
  { icon: Mail, label: "Correos", path: PATHS.emails },
]

export function Sidebar() {
  const { sidebarCollapsed, toggleSidebar, mobileOpen, setMobileOpen } = useUIStore()
  const { theme, toggleTheme } = useThemeStore()

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed top-0 left-0 z-50 flex h-screen flex-col bg-sidebar text-sidebar-foreground transition-all duration-300 shadow-lg",
          sidebarCollapsed ? "w-[72px]" : "w-60",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between px-4 border-b border-white/10">
          {!sidebarCollapsed && (
            <div className="flex items-center gap-2">
              <span className="text-xl">🎬</span>
              <span className="text-lg font-bold text-white">StreamAdmin</span>
            </div>
          )}
          {sidebarCollapsed && <span className="mx-auto text-xl">🎬</span>}

          {/* Desktop toggle */}
          <button
            onClick={toggleSidebar}
            className="hidden h-8 w-8 items-center justify-center rounded-md hover:bg-sidebar-accent lg:inline-flex"
          >
            {sidebarCollapsed ? <ChevronRight className="h-4 w-4 text-white" /> : <ChevronLeft className="h-4 w-4 text-white" />}
          </button>

          {/* Mobile close */}
          <button
            onClick={() => setMobileOpen(false)}
            className="h-8 w-8 items-center justify-center rounded-md hover:bg-sidebar-accent lg:hidden"
          >
            <ChevronLeft className="h-4 w-4 text-white" />
          </button>
        </div>

        <Separator className="bg-white/10" />

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto p-2">
          {navItems.map(({ icon: Icon, label, path }) => (
            <NavLink
              key={path}
              to={path}
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-sidebar-accent text-white shadow-md shadow-black/10"
                    : "text-white/80 hover:bg-sidebar-accent/60 hover:text-white",
                  sidebarCollapsed && "justify-center px-2"
                )
              }
            >
              <Icon className="h-5 w-5 shrink-0" />
              {!sidebarCollapsed && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Footer - Theme toggle */}
        <div className="space-y-1 border-t border-white/10 p-2">
          <button
            onClick={toggleTheme}
            className={cn(
              "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-sidebar-accent/50 text-white/80 hover:text-white",
              sidebarCollapsed && "justify-center px-2"
            )}
          >
            {theme === "dark" ? (
              <Sun className="h-5 w-5 shrink-0" />
            ) : (
              <Moon className="h-5 w-5 shrink-0" />
            )}
            {!sidebarCollapsed && <span>{theme === "dark" ? "Tema claro" : "Tema oscuro"}</span>}
          </button>
        </div>
      </aside>
    </>
  )
}
