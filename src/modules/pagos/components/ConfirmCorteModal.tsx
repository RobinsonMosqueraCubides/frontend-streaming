import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

interface ConfirmCorteModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  clienteNombre: string
  plataformas: string[]
  ordenId: number
  onConfirmar: () => void
  loading?: boolean
}

export function ConfirmCorteModal({
  open,
  onOpenChange,
  clienteNombre,
  plataformas,
  ordenId,
  onConfirmar,
  loading,
}: ConfirmCorteModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-destructive" />
            Confirmar Corte
          </DialogTitle>
          <DialogDescription>
            Esta acción pondrá la orden, sus pantallas y cuentas en estado
            "vencida". Los recursos serán liberados si no tienen otros clientes
            activos.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <div className="rounded-lg border border-border p-3 space-y-1">
            <p className="text-sm">
              <span className="text-muted-foreground">Orden:</span>{" "}
              <span className="font-medium">#{ordenId}</span>
            </p>
            <p className="text-sm">
              <span className="text-muted-foreground">Cliente:</span>{" "}
              <span className="font-medium">{clienteNombre}</span>
            </p>
            <p className="text-sm">
              <span className="text-muted-foreground">Plataformas:</span>{" "}
              <span className="font-medium">{plataformas.join(", ")}</span>
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirmar}
            disabled={loading}
          >
            {loading ? "Procesando..." : "Confirmar Corte"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
