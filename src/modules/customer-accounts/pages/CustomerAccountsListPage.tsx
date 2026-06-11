import { EmptyState } from "@/components/empty-state"
import { Users } from "lucide-react"

export function CustomerAccountsListPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Cuentas de Cliente</h1>
        <p className="text-sm text-muted-foreground">Cuentas completas vendidas a clientes</p>
      </div>

      <div className="rounded-2xl border border-border/60 bg-card p-12 shadow-sm">
        <EmptyState
          icon={Users}
          title="Cuentas de Clientes"
          description="Este módulo te permitirá rastrear cuentas completas asignadas de forma exclusiva a clientes y sus respectivos perfiles."
          actionLabel="Asociar Cuenta"
          onAction={() => console.log("Asociar cuenta clicked")}
        />
      </div>
    </div>
  )
}
