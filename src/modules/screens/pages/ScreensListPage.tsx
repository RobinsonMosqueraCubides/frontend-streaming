import { EmptyState } from "@/components/empty-state"
import { Monitor } from "lucide-react"

export function ScreensListPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Pantallas</h1>
        <p className="text-sm text-muted-foreground">Gestión de pantallas vendidas</p>
      </div>

      <div className="rounded-2xl border border-border/60 bg-card p-12 shadow-sm">
        <EmptyState
          icon={Monitor}
          title="Gestión de Pantallas"
          description="Este módulo te permitirá monitorear y asignar pantallas individuales a tus clientes finales, controlando perfiles y accesos."
          actionLabel="Asignar Pantalla"
          onAction={() => console.log("Asignar pantalla clicked")}
        />
      </div>
    </div>
  )
}
