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

interface EditPhoneModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  clienteNombre: string
  telefonoActual: string
  onGuardar: (nuevoTelefono: string) => void
}

export function EditPhoneModal({
  open,
  onOpenChange,
  clienteNombre,
  telefonoActual,
  onGuardar,
}: EditPhoneModalProps) {
  const [nuevoTelefono, setNuevoTelefono] = useState(telefonoActual)

  const handleSave = () => {
    if (nuevoTelefono.trim() && nuevoTelefono !== "2222") {
      onGuardar(nuevoTelefono.trim())
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar Teléfono</DialogTitle>
          <DialogDescription>
            El teléfono del cliente no es válido para WhatsApp. Actualícelo para
            poder enviar notificaciones.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">Cliente</Label>
            <p className="text-sm font-medium">{clienteNombre}</p>
          </div>
          <div className="space-y-2">
            <Label className="text-sm text-muted-foreground">
              Teléfono actual
            </Label>
            <p className="text-sm font-medium text-destructive">
              {telefonoActual}
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="nuevo-telefono">Nuevo teléfono</Label>
            <Input
              id="nuevo-telefono"
              value={nuevoTelefono}
              onChange={(e) => setNuevoTelefono(e.target.value)}
              placeholder="Ej: 3001234567"
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handleSave}
            disabled={!nuevoTelefono.trim() || nuevoTelefono === "2222"}
          >
            Guardar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
