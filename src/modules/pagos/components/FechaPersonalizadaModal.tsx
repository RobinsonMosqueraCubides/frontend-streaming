import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface FechaPersonalizadaModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  clienteNombre: string
  fechaActual: string | null
  onGuardar: (nuevaFecha: string) => void
  loading?: boolean
}

export function FechaPersonalizadaModal({
  open,
  onOpenChange,
  clienteNombre,
  fechaActual,
  onGuardar,
  loading,
}: FechaPersonalizadaModalProps) {
  const today = new Date().toISOString().split("T")[0]
  const [nuevaFecha, setNuevaFecha] = useState("")

  const handleSave = () => {
    if (nuevaFecha && nuevaFecha > today) {
      onGuardar(nuevaFecha)
      onOpenChange(false)
      setNuevaFecha("")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Fecha Personalizada</DialogTitle>
          <DialogDescription>
            Ingrese la nueva fecha de cobro. Debe ser posterior a la fecha actual.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">Cliente</Label>
            <p className="text-sm font-medium">{clienteNombre}</p>
          </div>
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">Fecha actual de cobro</Label>
            <p className="text-sm font-medium">{fechaActual || "Sin fecha"}</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="nueva-fecha">Nueva fecha de cobro</Label>
            <Input
              id="nueva-fecha"
              type="date"
              min={today}
              value={nuevaFecha}
              onChange={(e) => setNuevaFecha(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={!nuevaFecha || nuevaFecha <= today || loading}
          >
            {loading ? "Actualizando..." : "Actualizar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
