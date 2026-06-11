import { EmptyState } from "@/components/empty-state"
import { Mail } from "lucide-react"

export function EmailsListPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-foreground tracking-tight">Correos</h1>
        <p className="text-sm text-muted-foreground">Gestión de correos electrónicos</p>
      </div>

      <div className="rounded-2xl border border-border/60 bg-card p-12 shadow-sm">
        <EmptyState
          icon={Mail}
          title="Gestión de Correos"
          description="Este módulo te permitirá administrar los correos y contraseñas raíz asociados a los servicios de streaming adquiridos."
          actionLabel="Registrar Correo"
          onAction={() => console.log("Registrar correo clicked")}
        />
      </div>
    </div>
  )
}
