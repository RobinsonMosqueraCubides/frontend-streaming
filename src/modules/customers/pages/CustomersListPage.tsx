import { EmptyState } from "@/components/empty-state"
import { UserCircle } from "lucide-react"

export function CustomersListPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Clientes</h1>
        <p className="text-sm text-muted-foreground">Gestión de clientes</p>
      </div>

      <div className="rounded-2xl border border-border/60 bg-card p-12 shadow-sm">
        <EmptyState
          icon={UserCircle}
          title="Gestión de Clientes"
          description="Este módulo te permitirá ver el listado de clientes, su historial de compras, nivel de fidelidad y números de contacto."
          actionLabel="Agregar Cliente"
          onAction={() => console.log("Agregar cliente clicked")}
        />
      </div>
    </div>
  )
}
