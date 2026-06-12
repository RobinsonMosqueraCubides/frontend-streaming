import { NavLink } from "react-router-dom"
import {
  Building2,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  CreditCard,
  KeyRound,
  LayoutDashboard,
  Mail,
  Monitor,
  Moon,
  PackagePlus,
  Receipt,
  Sun,
  UserCircle,
  Users,
} from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { PATHS } from "@/routes/paths"
import { useThemeStore } from "@/stores/theme-store"
import { useUIStore } from "@/stores/ui-store"

const navGroups = [
  {
    label: "Inicio",
    items: [{ icon: LayoutDashboard, label: "Dashboard", path: PATHS.dashboard }],
  },
  {
    label: "Compras",
    items: [
      { icon: PackagePlus, label: "Compras", path: PATHS.providerPurchases },
      { icon: Building2, label: "Proveedores", path: PATHS.providers },
      { icon: Monitor, label: "Plataformas", path: PATHS.platforms },
      { icon: Mail, label: "Correos", path: PATHS.emails },
    ],
  },
  {
    label: "Inventario",
    items: [
      { icon: KeyRound, label: "Cuentas", path: PATHS.accounts },
      { icon: Monitor, label: "Pantallas", path: PATHS.screens },
      { icon: Users, label: "Ctas. cliente", path: PATHS.customerAccounts },
    ],
  },
  {
    label: "Ventas",
    items: [
      { icon: Receipt, label: "Ordenes", path: PATHS.orders },
      { icon: UserCircle, label: "Clientes", path: PATHS.customers },
    ],
  },
  {
    label: "Finanzas",
    items: [
      { icon: CircleDollarSign, label: "Cobros", path: PATHS.cobros },
      { icon: CreditCard, label: "Pagos", path: PATHS.pagos },
    ],
  },
]

export function Sidebar() {
  const { sidebarCollapsed, toggleSidebar, mobileOpen, setMobileOpen } = useUIStore()
  const { theme, toggleTheme } = useThemeStore()

  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-0 z-50 flex h-screen flex-col bg-sidebar text-sidebar-foreground shadow-lg transition-all duration-300",
          sidebarCollapsed ? "w-[72px]" : "w-60",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-white/5 px-4">
          {!sidebarCollapsed && (
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 shadow-inner">
                <PackagePlus className="h-4 w-4 text-white" />
              </div>
              <span className="text-base font-extrabold tracking-wider text-white">
                StreamAdmin
              </span>
            </div>
          )}
          {sidebarCollapsed && (
            <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 shadow-inner">
              <PackagePlus className="h-4 w-4 text-white" />
            </div>
          )}

          <button
            onClick={toggleSidebar}
            className="hidden h-8 w-8 items-center justify-center rounded-md transition-colors hover:bg-white/10 lg:inline-flex"
          >
            {sidebarCollapsed ? (
              <ChevronRight className="h-4 w-4 text-white" />
            ) : (
              <ChevronLeft className="h-4 w-4 text-white" />
            )}
          </button>

          <button
            onClick={() => setMobileOpen(false)}
            className="h-8 w-8 items-center justify-center rounded-md transition-colors hover:bg-white/10 lg:hidden"
          >
            <ChevronLeft className="h-4 w-4 text-white" />
          </button>
        </div>

        <Separator className="bg-white/5" />

        <nav className="flex-1 space-y-2 overflow-y-auto p-2">
          {navGroups.map((group) => (
            <div key={group.label} className="space-y-1">
              {!sidebarCollapsed && (
                <p className="px-3 pt-3 text-[10px] font-semibold uppercase tracking-wider text-white/35">
                  {group.label}
                </p>
              )}
              {group.items.map(({ icon: Icon, label, path }) => (
                <NavLink
                  key={path}
                  to={path}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                      isActive
                        ? "border-l-2 border-white/70 bg-white/10 text-white shadow-inner"
                        : "text-white/70 hover:bg-white/5 hover:text-white",
                      sidebarCollapsed && "justify-center px-2"
                    )
                  }
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  {!sidebarCollapsed && <span>{label}</span>}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>

        <div className="space-y-1 border-t border-white/5 p-2">
          <div
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2",
              sidebarCollapsed && "justify-center px-1"
            )}
          >
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 text-xs font-semibold text-white shadow-sm">
              A
            </div>
            {!sidebarCollapsed && (
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-bold text-white">Administrador</p>
                <p className="truncate text-[10px] text-white/50">admin@streamadmin.com</p>
              </div>
            )}
          </div>

          <button
            onClick={toggleTheme}
            className={cn(
              "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-white/70 transition-colors hover:bg-white/5 hover:text-white",
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
