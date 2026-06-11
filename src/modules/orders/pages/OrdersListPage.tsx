import { EmptyState } from "@/components/empty-state"
import { Receipt } from "lucide-react"

export function OrdersListPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Órdenes</h1>
        <p className="text-sm text-muted-foreground">Gestión de órdenes de compra</p>
      </div>

      <div className="rounded-2xl border border-border/60 bg-card p-12 shadow-sm">
        <EmptyState
          icon={Receipt}
          title="Gestión de Órdenes"
          description="Este módulo te permitirá ver el historial de compras y suscripciones de tus clientes, renovaciones y cortes programados."
          actionLabel="Nueva Orden"
          onAction={() => console.log("Nueva orden clicked")}
        />
      </div>
    </div>
  )
}
