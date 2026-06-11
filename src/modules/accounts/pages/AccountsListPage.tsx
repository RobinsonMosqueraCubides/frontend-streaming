import { EmptyState } from "@/components/empty-state"
import { KeyRound } from "lucide-react"

export function AccountsListPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Cuentas</h1>
        <p className="text-sm text-muted-foreground">Inventario de cuentas de streaming</p>
      </div>

      <div className="rounded-2xl border border-border/60 bg-card p-12 shadow-sm">
        <EmptyState
          icon={KeyRound}
          title="Gestión de Cuentas"
          description="Este módulo te permitirá administrar el inventario, credenciales y perfiles de todas tus cuentas de streaming compradas a proveedores."
          actionLabel="Crear Cuenta"
          onAction={() => console.log("Crear cuenta clicked")}
        />
      </div>
    </div>
  )
}
