import { useState, useMemo } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "react-router-dom"
import { ShoppingBag, ArrowLeft, Plus, Search, Trash2, UserPlus, KeyRound, Monitor } from "lucide-react"
import { toast } from "sonner"

import { ordersApi } from "@/api/orders"
import { customersApi } from "@/api/customers"
import { accountsApi } from "@/api/accounts"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PATHS } from "@/routes/paths"
import type { Customer } from "@/api/customers"

export function OrderNewPage() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  // Form general de la orden
  const [customerId, setCustomerId] = useState<string>("")
  const [customerSearch, setCustomerSearch] = useState<string>("")
  const [fechaInicio, setFechaInicio] = useState<string>(new Date().toISOString().slice(0, 10))
  const [observaciones, setObservaciones] = useState<string>("")

  // Modal para crear cliente
  const [customerModalOpen, setCustomerModalOpen] = useState(false)
  const [newCustomer, setNewCustomer] = useState({ name: "", phone: "", notes: "" })

  // Items agregados a la orden
  const [items, setItems] = useState<any[]>([])

  // Modal para agregar item
  const [itemModalOpen, setItemModalOpen] = useState(false)
  const [itemForm, setItemForm] = useState({
    type: "screen" as "screen" | "customer_account",
    account_id: "",
    pin: "",
    contrasena: "",
    precio_venta: "",
    profile_name: "",
    observaciones: "",
    notes: "",
  })

  // Queries
  const customers = useQuery({
    queryKey: ["customers"],
    queryFn: () => customersApi.list(),
  })

  // Clientes filtrados por la búsqueda
  const filteredCustomers = useMemo(() => {
    if (!customers.data) return []
    const term = customerSearch.toLowerCase().trim()
    if (!term) return customers.data
    return customers.data.filter((c: Customer) =>
      c.name.toLowerCase().includes(term) || c.phone.includes(term)
    )
  }, [customers.data, customerSearch])

  const accounts = useQuery({
    queryKey: ["accounts", "list-disponibles"],
    queryFn: () => accountsApi.list({ page_size: 100 }).then((data) => data.results.filter((a) => a.status === "disponible" && a.is_active)),
  })

  // Mutations
  const createCustomer = useMutation({
    mutationFn: customersApi.create,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["customers"] })
      setCustomerId(String(data.id))
      setCustomerModalOpen(false)
      setNewCustomer({ name: "", phone: "", notes: "" })
      toast.success("Cliente creado y seleccionado")
    },
    onError: () => toast.error("Error al crear el cliente"),
  })

  const sellOrder = useMutation({
    mutationFn: ordersApi.sell,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] })
      queryClient.invalidateQueries({ queryKey: ["accounts"] })
      queryClient.invalidateQueries({ queryKey: ["dashboard"] })
      toast.success("Venta registrada con éxito")
      navigate(PATHS.orders)
    },
    onError: (error: any) => {
      const msg = error.response?.data?.error || "Error al registrar la venta"
      toast.error(msg)
    },
  })

  const handleCreateCustomerSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCustomer.name || !newCustomer.phone) {
      toast.error("Nombre y Teléfono son requeridos")
      return
    }
    createCustomer.mutate(newCustomer)
  }

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault()
    if (!itemForm.account_id) {
      toast.error("Selecciona una cuenta")
      return
    }
    if (!itemForm.precio_venta || isNaN(Number(itemForm.precio_venta))) {
      toast.error("Ingresa un precio de venta válido")
      return
    }
    if (itemForm.type === "screen" && (!itemForm.pin || itemForm.pin.length !== 4)) {
      toast.error("El PIN debe tener exactamente 4 dígitos")
      return
    }
    if (itemForm.type === "customer_account" && !itemForm.contrasena) {
      toast.error("La contraseña es requerida para una cuenta completa")
      return
    }

    const selectedAcc = accounts.data?.find((a) => a.id === Number(itemForm.account_id))

    setItems((prev) => [
      ...prev,
      {
        ...itemForm,
        account_id: Number(itemForm.account_id),
        precio_venta: Number(itemForm.precio_venta),
        platform_name: selectedAcc?.platform_name || `Cuenta #${itemForm.account_id}`,
        email_address: selectedAcc?.email_address || "",
      },
    ])

    // Resetear form de item
    setItemForm({
      type: "screen",
      account_id: "",
      pin: "",
      contrasena: "",
      precio_venta: "",
      profile_name: "",
      observaciones: "",
      notes: "",
    })
    setItemModalOpen(false)
  }

  const handleRemoveItem = (index: number) => {
    setItems((prev) => prev.filter((_, i) => i !== index))
  }

  const handleRegisterSale = () => {
    if (!customerId) {
      toast.error("Selecciona o crea un cliente")
      return
    }
    if (items.length === 0) {
      toast.error("Debes agregar al menos un producto a la venta")
      return
    }

    sellOrder.mutate({
      customer_id: Number(customerId),
      fecha_inicio: fechaInicio,
      observaciones: observaciones,
      items: items.map((item) => ({
        type: item.type,
        account_id: item.account_id,
        pin: item.type === "screen" ? item.pin : undefined,
        contrasena: item.type === "customer_account" ? item.contrasena : undefined,
        precio_venta: item.precio_venta,
        profile_name: item.profile_name || undefined,
        observaciones: item.observaciones || undefined,
        notes: item.notes || undefined,
      })),
    })
  }

  const totalOrder = useMemo(() => {
    return items.reduce((sum, item) => sum + item.precio_venta, 0)
  }, [items])

  return (
    <div className="space-y-6">
      {/* Cabecera */}
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate(PATHS.orders)} className="h-9 w-9">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Registrar Nueva Venta</h1>
          <p className="text-sm text-muted-foreground">Genera órdenes de venta para cuentas completas o pantallas individuales.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Panel Datos del Cliente y la Orden */}
        <div className="md:col-span-1 space-y-6">
          <Card className="border-primary/10 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Datos de la Venta</CardTitle>
              <CardDescription>Selecciona el cliente y la fecha de inicio de la facturación.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Cliente</Label>
                  <Button
                    type="button"
                    variant="link"
                    size="sm"
                    className="h-auto p-0 flex items-center gap-1 text-xs text-primary"
                    onClick={() => setCustomerModalOpen(true)}
                  >
                    <UserPlus className="h-3 w-3" /> Nuevo Cliente
                  </Button>
                </div>
                <Select value={customerId} onValueChange={setCustomerId}>
                  <SelectTrigger className="bg-background/50">
                    <SelectValue placeholder="Seleccione un cliente" />
                  </SelectTrigger>
                  <SelectContent>
                    <div className="p-2">
                      <Input
                        placeholder="Buscar cliente..."
                        value={customerSearch}
                        onChange={(e) => setCustomerSearch(e.target.value)}
                        onKeyDown={(e) => e.stopPropagation()} // Evita que se cierre el select al escribir espacio o pulsar teclas
                        className="h-8 text-xs bg-muted/40"
                      />
                    </div>
                    {filteredCustomers.length === 0 ? (
                      <div className="p-2 text-xs text-muted-foreground text-center">No hay resultados</div>
                    ) : (
                      filteredCustomers.map((customer: Customer) => (
                        <SelectItem key={customer.id} value={String(customer.id)}>
                          {customer.name} ({customer.phone})
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Fecha Inicio Facturación</Label>
                <Input
                  type="date"
                  value={fechaInicio}
                  onChange={(e) => setFechaInicio(e.target.value)}
                  className="bg-background/50"
                />
              </div>

              <div className="space-y-2">
                <Label>Observaciones de la Orden</Label>
                <textarea
                  value={observaciones}
                  onChange={(e) => setObservaciones(e.target.value)}
                  placeholder="Detalles adicionales..."
                  className="min-h-20 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Panel de Items de la Orden */}
        <div className="md:col-span-2 space-y-6">
          <Card className="border-primary/10 shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="text-base">Servicios y Cuentas a Vender</CardTitle>
                <CardDescription>Agrega pantallas o cuentas completas a esta orden.</CardDescription>
              </div>
              <Button onClick={() => setItemModalOpen(true)} className="gap-1.5 shadow-sm">
                <Plus className="h-4 w-4" /> Agregar Item
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 text-center border-2 border-dashed rounded-lg border-muted/50 bg-muted/10">
                  <ShoppingBag className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm font-medium text-muted-foreground">No hay items agregados a esta venta.</p>
                  <p className="text-xs text-muted-foreground mt-1">Haz clic en "Agregar Item" para empezar.</p>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between py-3 hover:bg-muted/10 px-2 rounded-md">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded bg-primary/10 text-primary">
                          {item.type === "screen" ? <Monitor className="h-4 w-4" /> : <KeyRound className="h-4 w-4" />}
                        </div>
                        <div>
                          <p className="text-sm font-semibold">
                            {item.platform_name} - {item.type === "screen" ? "Pantalla" : "Cuenta Completa"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {item.email_address} {item.type === "screen" ? `| PIN: ${item.pin}` : ""}
                          </p>
                          {item.profile_name && (
                            <p className="text-xs text-muted-foreground">Perfil: {item.profile_name}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <p className="text-sm font-bold text-foreground">${item.precio_venta.toFixed(2)}</p>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveItem(index)}
                          className="h-8 w-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Total y botón de registro */}
              {items.length > 0 && (
                <div className="pt-4 border-t flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <span className="text-xs text-muted-foreground uppercase tracking-wider block">Total de la Venta</span>
                    <span className="text-2xl font-black text-foreground">${totalOrder.toFixed(2)}</span>
                  </div>
                  <Button
                    onClick={handleRegisterSale}
                    disabled={sellOrder.isPending}
                    size="lg"
                    className="px-6 font-bold shadow-md transition-all active:scale-95 bg-primary hover:bg-primary/90"
                  >
                    Confirmar y Registrar Venta
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modal para Crear Cliente */}
      <Dialog open={customerModalOpen} onOpenChange={setCustomerModalOpen}>
        <DialogContent className="max-w-md">
          <form onSubmit={handleCreateCustomerSubmit} className="space-y-4">
            <DialogHeader>
              <DialogTitle>Crear Nuevo Cliente</DialogTitle>
            </DialogHeader>
            <div className="space-y-3">
              <div className="space-y-1">
                <Label>Nombre</Label>
                <Input
                  value={newCustomer.name}
                  onChange={(e) => setNewCustomer((prev) => ({ ...prev, name: e.target.value }))}
                  placeholder="Nombre completo"
                  required
                />
              </div>
              <div className="space-y-1">
                <Label>Teléfono / WhatsApp</Label>
                <Input
                  value={newCustomer.phone}
                  onChange={(e) => setNewCustomer((prev) => ({ ...prev, phone: e.target.value }))}
                  placeholder="ej. 3001234567"
                  required
                />
              </div>
              <div className="space-y-1">
                <Label>Notas</Label>
                <textarea
                  value={newCustomer.notes}
                  onChange={(e) => setNewCustomer((prev) => ({ ...prev, notes: e.target.value }))}
                  placeholder="Observaciones sobre el cliente..."
                  className="min-h-20 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setCustomerModalOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit" disabled={createCustomer.isPending}>
                Crear Cliente
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal para Agregar Item (Pantalla / Cuenta) */}
      <Dialog open={itemModalOpen} onOpenChange={setItemModalOpen}>
        <DialogContent className="max-w-xl">
          <form onSubmit={handleAddItem} className="space-y-4">
            <DialogHeader>
              <DialogTitle>Agregar Item a la Venta</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1 sm:col-span-2">
                <Label>Tipo de Venta</Label>
                <Select
                  value={itemForm.type}
                  onValueChange={(val) =>
                    setItemForm((prev) => ({ ...prev, type: val as any, pin: "", contrasena: "" }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="screen">Vender Pantalla Individual</SelectItem>
                    <SelectItem value="customer_account">Vender Cuenta Completa</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1 sm:col-span-2">
                <Label>Cuenta Streaming Disponible</Label>
                <Select
                  value={itemForm.account_id}
                  onValueChange={(val) => setItemForm((prev) => ({ ...prev, account_id: val }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione una cuenta disponible" />
                  </SelectTrigger>
                  <SelectContent>
                    {accounts.data?.map((acc) => (
                      <SelectItem key={acc.id} value={String(acc.id)}>
                        [{acc.platform_name}] - {acc.email_address} (P: {acc.available_screens}/{acc.max_screens})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {itemForm.type === "screen" && (
                <>
                  <div className="space-y-1">
                    <Label>PIN de la Pantalla (4 dígitos)</Label>
                    <Input
                      maxLength={4}
                      value={itemForm.pin}
                      onChange={(e) => setItemForm((prev) => ({ ...prev, pin: e.target.value.replace(/\D/g, "") }))}
                      placeholder="1234"
                      required
                    />
                  </div>
                  <div className="space-y-1">
                    <Label>Nombre del Perfil (Opcional)</Label>
                    <Input
                      value={itemForm.profile_name}
                      onChange={(e) => setItemForm((prev) => ({ ...prev, profile_name: e.target.value }))}
                      placeholder="ej. Juan"
                    />
                  </div>
                </>
              )}

              {itemForm.type === "customer_account" && (
                <div className="space-y-1 sm:col-span-2">
                  <Label>Contraseña para el Cliente</Label>
                  <Input
                    value={itemForm.contrasena}
                    onChange={(e) => setItemForm((prev) => ({ ...prev, contrasena: e.target.value }))}
                    placeholder="Contraseña de acceso"
                    required
                  />
                </div>
              )}

              <div className="space-y-1">
                <Label>Precio de Venta ($)</Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={itemForm.precio_venta}
                  onChange={(e) => setItemForm((prev) => ({ ...prev, precio_venta: e.target.value }))}
                  placeholder="0.00"
                  required
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <Label>Observaciones del Item (Opcional)</Label>
                <Input
                  value={itemForm.observaciones}
                  onChange={(e) => setItemForm((prev) => ({ ...prev, observaciones: e.target.value }))}
                  placeholder="Detalles adicionales para este item..."
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setItemModalOpen(false)}>
                Cancelar
              </Button>
              <Button type="submit">Agregar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
