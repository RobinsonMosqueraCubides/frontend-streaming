import { useMemo, useState, type FormEvent, type TextareaHTMLAttributes } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { Building2, CheckCircle2, KeyRound, MailPlus, PackagePlus, Plus, Save } from "lucide-react"
import { accountsApi } from "@/api/accounts"
import { emailsApi } from "@/api/emails"
import { platformsApi } from "@/api/platforms"
import { providersApi, type CreateProviderPayload } from "@/api/providers"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import type { AccountStatus } from "@/modules/accounts/types"

const today = new Date().toISOString().slice(0, 10)

function addDays(date: string, days: number) {
  if (!date) return ""
  const nextDate = new Date(`${date}T00:00:00`)
  nextDate.setDate(nextDate.getDate() + days)
  return nextDate.toISOString().slice(0, 10)
}

interface PurchaseForm {
  providerId: string
  platformId: string
  email: string
  password: string
  emailNotes: string
  maxScreens: string
  credentials: string
  status: AccountStatus
  purchasePrice: string
  fechaCompra: string
  fechaPago: string
  fechaCorte: string
  observaciones: string
  accountNotes: string
}

const emptyForm: PurchaseForm = {
  providerId: "",
  platformId: "",
  email: "",
  password: "",
  emailNotes: "",
  maxScreens: "1",
  credentials: "",
  status: "activo",
  purchasePrice: "",
  fechaCompra: today,
  fechaPago: "",
  fechaCorte: "",
  observaciones: "",
  accountNotes: "",
}

const emptyProvider: CreateProviderPayload = {
  name: "",
  contact: "",
  phone: "",
  notes: "",
  observaciones: "",
}

function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={[
        "min-h-20 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm",
        "placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring",
        props.className,
      ].filter(Boolean).join(" ")}
    />
  )
}

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

export function ProviderPurchasesPage() {
  const queryClient = useQueryClient()
  const [form, setForm] = useState<PurchaseForm>(emptyForm)
  const [providerDialogOpen, setProviderDialogOpen] = useState(false)
  const [providerForm, setProviderForm] = useState<CreateProviderPayload>(emptyProvider)

  const providersQuery = useQuery({
    queryKey: ["providers"],
    queryFn: () => providersApi.list(),
  })

  const platformsQuery = useQuery({
    queryKey: ["platforms"],
    queryFn: platformsApi.list,
  })

  const selectedProvider = useMemo(
    () => providersQuery.data?.find((provider) => String(provider.id) === form.providerId),
    [form.providerId, providersQuery.data]
  )

  const createProvider = useMutation({
    mutationFn: providersApi.create,
    onSuccess: (provider) => {
      queryClient.invalidateQueries({ queryKey: ["providers"] })
      setForm((current) => ({ ...current, providerId: String(provider.id) }))
      setProviderForm(emptyProvider)
      setProviderDialogOpen(false)
      toast.success("Proveedor registrado")
    },
    onError: () => toast.error("No se pudo registrar el proveedor"),
  })

  const createPurchase = useMutation({
    mutationFn: async () => {
      const emailAccount = await emailsApi.create({
        email: form.email.trim(),
        password: form.password,
        notes: form.emailNotes.trim(),
        provider: Number(form.providerId),
        is_active: true,
      })

      return accountsApi.create({
        email: emailAccount.id,
        platform: Number(form.platformId),
        max_screens: Number(form.maxScreens),
        credentials: form.credentials.trim(),
        status: form.status,
        purchase_price: Number(form.purchasePrice),
        fecha_compra: form.fechaCompra,
        fecha_pago: form.fechaPago,
        fecha_corte: form.fechaCorte,
        observaciones: form.observaciones.trim(),
        notes: form.accountNotes.trim(),
        is_active: true,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["emails"] })
      queryClient.invalidateQueries({ queryKey: ["accounts"] })
      queryClient.invalidateQueries({ queryKey: ["dashboard"] })
      setForm(emptyForm)
      toast.success("Compra registrada en inventario")
    },
    onError: () => toast.error("No se pudo registrar la compra"),
  })

  const update = (field: keyof PurchaseForm, value: string) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const updateStartDate = (value: string) => {
    const fechaCorte = addDays(value, 30)
    setForm((current) => ({
      ...current,
      fechaCompra: value,
      fechaCorte,
      fechaPago: addDays(fechaCorte, -2),
    }))
  }

  const validate = () => {
    const maxScreens = Number(form.maxScreens)
    const purchasePrice = Number(form.purchasePrice)

    if (!form.providerId) return "Selecciona o registra un proveedor."
    if (!form.platformId) return "Selecciona una plataforma."
    if (!isEmail(form.email.trim())) return "Escribe un correo válido."
    if (!form.password.trim()) return "Escribe la contraseña del correo."
    if (!Number.isInteger(maxScreens) || maxScreens < 1 || maxScreens > 5) return "La cantidad de pantallas debe estar entre 1 y 5."
    if (!form.purchasePrice || Number.isNaN(purchasePrice) || purchasePrice < 0) return "Escribe un valor de compra válido."
    if (!form.fechaCompra || !form.fechaPago || !form.fechaCorte) return "Completa las fechas de compra, cobro y corte."
    return null
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const error = validate()
    if (error) {
      toast.error(error)
      return
    }
    createPurchase.mutate()
  }

  const handleCreateProvider = () => {
    if (!providerForm.name?.trim()) {
      toast.error("Escribe el nombre del proveedor")
      return
    }
    createProvider.mutate({
      ...providerForm,
      name: providerForm.name.trim(),
      contact: providerForm.contact?.trim(),
      phone: providerForm.phone?.trim(),
      notes: providerForm.notes?.trim(),
      observaciones: providerForm.observaciones?.trim(),
    })
  }

  const loadingCatalogs = providersQuery.isLoading || platformsQuery.isLoading
  const catalogsError = providersQuery.isError || platformsQuery.isError
  const saving = createProvider.isPending || createPurchase.isPending

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Compras a proveedores</h1>
        <p className="text-sm text-muted-foreground">
          Registra la compra, el correo y la cuenta de inventario en un solo flujo.
        </p>
      </div>

      {catalogsError && (
        <Card className="border-destructive/40">
          <CardContent className="p-4 text-sm text-destructive">
            No se pudieron cargar proveedores o plataformas. Revisa que el backend esté activo en la URL configurada.
          </CardContent>
        </Card>
      )}

      {loadingCatalogs ? (
        <div className="grid gap-4 lg:grid-cols-[1fr_320px]">
          <Skeleton className="h-[620px] w-full" />
          <Skeleton className="h-[320px] w-full" />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="grid gap-4 lg:grid-cols-[1fr_320px]">
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <Building2 className="h-4 w-4 text-primary" />
                  Proveedor y plataforma
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Proveedor</Label>
                  <div className="flex gap-2">
                    <Select value={form.providerId} onValueChange={(value) => update("providerId", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar proveedor" />
                      </SelectTrigger>
                      <SelectContent>
                        {(providersQuery.data?.length ?? 0) > 0 ? (
                          providersQuery.data?.map((provider) => (
                            <SelectItem key={provider.id} value={String(provider.id)}>
                              {provider.name}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="no-providers" disabled>
                            Sin proveedores registrados
                          </SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <Button type="button" variant="outline" size="icon" onClick={() => setProviderDialogOpen(true)}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {providersQuery.data?.length ?? 0} proveedor(es) disponibles
                  </p>
                </div>

                <div className="space-y-2">
                  <Label>Plataforma</Label>
                  <Select value={form.platformId} onValueChange={(value) => update("platformId", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar plataforma" />
                    </SelectTrigger>
                    <SelectContent>
                      {(platformsQuery.data?.length ?? 0) > 0 ? (
                        platformsQuery.data?.map((platform) => (
                          <SelectItem key={platform.id} value={String(platform.id)}>
                            {platform.name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="no-platforms" disabled>
                          Sin plataformas registradas
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground">
                    {platformsQuery.data?.length ?? 0} plataforma(s) disponibles
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <MailPlus className="h-4 w-4 text-primary" />
                  Correo de acceso
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="email">Correo</Label>
                  <Input id="email" value={form.email} onChange={(event) => update("email", event.target.value)} placeholder="cuenta@correo.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Contraseña</Label>
                  <Input id="password" value={form.password} onChange={(event) => update("password", event.target.value)} placeholder="Clave del correo" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="emailNotes">Notas del correo</Label>
                  <TextArea id="emailNotes" value={form.emailNotes} onChange={(event) => update("emailNotes", event.target.value)} placeholder="Recuperación, observaciones o datos útiles" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <KeyRound className="h-4 w-4 text-primary" />
                  Cuenta comprada
                </CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="maxScreens">Pantallas</Label>
                  <Input id="maxScreens" type="number" min={1} max={5} value={form.maxScreens} onChange={(event) => update("maxScreens", event.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="purchasePrice">Valor de compra</Label>
                  <Input id="purchasePrice" type="number" min={0} step="0.01" value={form.purchasePrice} onChange={(event) => update("purchasePrice", event.target.value)} placeholder="0.00" />
                </div>
                <div className="space-y-2">
                  <Label>Estado</Label>
                  <Select value={form.status} onValueChange={(value) => update("status", value as AccountStatus)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="activo">Activo</SelectItem>
                      <SelectItem value="por_vencer">Por vencer</SelectItem>
                      <SelectItem value="vencida">Vencida</SelectItem>
                      <SelectItem value="caida">Caída</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fechaCompra">Fecha de inicio</Label>
                  <Input id="fechaCompra" type="date" value={form.fechaCompra} onChange={(event) => updateStartDate(event.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fechaPago">Fecha de cobro</Label>
                  <Input id="fechaPago" type="date" value={form.fechaPago} onChange={(event) => update("fechaPago", event.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fechaCorte">Fecha de corte</Label>
                  <Input id="fechaCorte" type="date" value={form.fechaCorte} onChange={(event) => update("fechaCorte", event.target.value)} />
                </div>
                <div className="space-y-2 md:col-span-3">
                  <Label htmlFor="credentials">Contraseña de la cuenta</Label>
                  <Input id="credentials" value={form.credentials} onChange={(event) => update("credentials", event.target.value)} placeholder="Clave del servicio de streaming" />
                </div>
                <div className="space-y-2 md:col-span-3">
                  <Label htmlFor="observaciones">Observaciones</Label>
                  <TextArea id="observaciones" value={form.observaciones} onChange={(event) => update("observaciones", event.target.value)} placeholder="Condiciones del proveedor, vigencia o restricciones" />
                </div>
                <div className="space-y-2 md:col-span-3">
                  <Label htmlFor="accountNotes">Notas internas</Label>
                  <TextArea id="accountNotes" value={form.accountNotes} onChange={(event) => update("accountNotes", event.target.value)} placeholder="Notas adicionales para inventario" />
                </div>
              </CardContent>
            </Card>
          </div>

          <aside className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-base">
                  <PackagePlus className="h-4 w-4 text-primary" />
                  Resumen
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="rounded-md border border-border p-3">
                  <p className="text-xs text-muted-foreground">Proveedor</p>
                  <p className="font-medium">{selectedProvider?.name ?? "Sin seleccionar"}</p>
                </div>
                <div className="rounded-md border border-border p-3">
                  <p className="text-xs text-muted-foreground">Cuenta</p>
                  <p className="font-medium">{form.email || "Correo pendiente"}</p>
                  <p className="text-xs text-muted-foreground">{form.maxScreens} pantalla(s)</p>
                </div>
                <Button type="submit" className="w-full" disabled={saving}>
                  {saving ? <CheckCircle2 className="h-4 w-4" /> : <Save className="h-4 w-4" />}
                  Guardar compra
                </Button>
              </CardContent>
            </Card>
          </aside>
        </form>
      )}

      <Dialog open={providerDialogOpen} onOpenChange={setProviderDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nuevo proveedor</DialogTitle>
            <DialogDescription>Registra el proveedor y úsalo en esta compra.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="providerName">Nombre</Label>
              <Input id="providerName" value={providerForm.name ?? ""} onChange={(event) => setProviderForm((current) => ({ ...current, name: event.target.value }))} />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="providerContact">Contacto</Label>
                <Input id="providerContact" value={providerForm.contact ?? ""} onChange={(event) => setProviderForm((current) => ({ ...current, contact: event.target.value }))} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="providerPhone">Teléfono</Label>
                <Input id="providerPhone" value={providerForm.phone ?? ""} onChange={(event) => setProviderForm((current) => ({ ...current, phone: event.target.value }))} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="providerNotes">Notas</Label>
              <TextArea id="providerNotes" value={providerForm.notes ?? ""} onChange={(event) => setProviderForm((current) => ({ ...current, notes: event.target.value }))} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="providerObservaciones">Observaciones</Label>
              <TextArea id="providerObservaciones" value={providerForm.observaciones ?? ""} onChange={(event) => setProviderForm((current) => ({ ...current, observaciones: event.target.value }))} />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setProviderDialogOpen(false)}>
              Cancelar
            </Button>
            <Button type="button" onClick={handleCreateProvider} disabled={createProvider.isPending}>
              Registrar proveedor
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
