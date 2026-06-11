import { EmptyState } from "@/components/empty-state"
import { Building2 } from "lucide-react"

export function ProvidersListPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Proveedores</h1>
        <p className="text-sm text-muted-foreground">Gestión de proveedores</p>
      </div>

      <div className="rounded-2xl border border-border/60 bg-card p-12 shadow-sm">
        <EmptyState
          icon={Building2}
          title="Gestión de Proveedores"
          description="Este módulo te permitirá llevar el control de tus proveedores de cuentas, compras mayoristas, balances de costos y garantías."
          actionLabel="Agregar Proveedor"
          onAction={() => console.log("Agregar proveedor clicked")}
        />
      </div>
    </div>
  )
}
