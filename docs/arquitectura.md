# 🏗️ Arquitectura Frontend — Streaming Dashboard

> Centro de gestión del negocio de compra/venta de cuentas de streaming.

---

## 1. Visión General

El frontend es el **centro operativo** del negocio. Desde aquí se gestiona todo el ciclo: comprar cuentas a proveedores, asignar pantallas a clientes, cobrar, renovar, y monitorear el estado financiero.

### Principios

- **Operativo primero**: la interfaz está diseñada para uso diario intensivo, no para presentación.
- **Datos en tiempo real**: los estados de cuentas/pantallas cambían frecuentemente (activos → por vencer → vencidos). La UI debe reflejar esto sin refresh manual.
- **Mobile-aware**: el negocio probablemente se maneja desde el celular. Los CRUDs principales deben ser usables en móvil.

---

## 2. Stack Tecnológico

| Capa | Tecnología | Justificación |
|------|-----------|---------------|
| **Framework** | React 19 + Vite 6 | Velocidad de desarrollo, ecosistema maduro, HMR rápido |
| **Lenguaje** | TypeScript 5.x | Tipado estricto para entidades del negocio (estados, plataformas, roles) |
| **Routing** | React Router 7 | Rutas anidadas, layout routes, lazy loading natural |
| **Estado server** | TanStack Query v5 | Cache, refetch, invalidación, optimistic updates — ideal para CRUD contra DRF |
| **Estado cliente** | Zustand | Liviano, sin boilerplate, para UI state (filtros, modales, toasts) |
| **Estilos** | Tailwind CSS 4 + shadcn/ui | Utility-first, componentes accesibles, diseño consistente sin esfuerzo |
| **Tablas** | TanStack Table v8 | Ordenamiento, filtros, paginación, row selection — esencial para gestión |
| **Gráficos** | Recharts | Simple, declarativo, suficiente para el dashboard financiero |
| **Formularios** | React Hook Form + Zod | Validación tipada, rendimiento, integración con shadcn |
| **HTTP Client** | Axios | Interceptors para auth token, base URL centralizada |
| **Fechas** | date-fns | Ligero, tree-shakeable, para cálculos de vencimiento |
| **Notificaciones** | sonner | Toasts minimalistas y accesibles |
| **Testing** | Vitest + Playwright | Unit + E2E, mismo runner que Vite |

---

## 3. Estructura de Carpetas

```
frontend-streaming/
├── public/
│   └── favicon.svg
├── src/
│   ├── api/                        # Cliente HTTP + endpoints por dominio
│   │   ├── client.ts               # Axios instance, interceptors, auth
│   │   ├── platforms.ts
│   │   ├── providers.ts
│   │   ├── emails.ts
│   │   ├── customers.ts
│   │   ├── accounts.ts
│   │   ├── screens.ts
│   │   ├── customer-accounts.ts
│   │   ├── orders.ts
│   │   └── dashboard.ts
│   │
│   ├── components/                 # Componentes compartidos
│   │   ├── ui/                     # shadcn/ui (Button, Input, Dialog, etc.)
│   │   ├── layout/
│   │   │   ├── AppShell.tsx        # Sidebar + Header + Main content
│   │   │   ├── Sidebar.tsx
│   │   │   ├── Header.tsx
│   │   │   └── MobileNav.tsx
│   │   ├── data-table/
│   │   │   ├── DataTable.tsx       # Tabla genérica con TanStack Table
│   │   │   ├── DataTableToolbar.tsx
│   │   │   ├── DataTablePagination.tsx
│   │   │   └── DataTableColumnHeader.tsx
│   │   ├── status-badge.tsx       # Badge de estado con colores semánticos
│   │   ├── platform-icon.tsx      # Ícono/logo por plataforma (Netflix, Disney, etc.)
│   │   ├── date-display.tsx       # Muestra fecha + días restantes
│   │   ├── price-display.tsx      # Formato COP con símbolo $
│   │   ├── confirm-dialog.tsx     # Confirmación antes de acciones destructivas
│   │   └── empty-state.tsx        # Estado vacío con ilustración
│   │
│   ├── hooks/                      # Custom hooks
│   │   ├── use-auth.ts
│   │   ├── use-debounce.ts
│   │   ├── use-status-colors.ts
│   │   └── use-currency.ts
│   │
│   ├── lib/                        # Utilidades puras
│   │   ├── utils.ts                # cn(), formateadores
│   │   ├── constants.ts            # Estados, plataformas, opciones de filtro
│   │   ├── schemas.ts              # Zod schemas por entidad
│   │   └── types.ts                # Tipos TypeScript globales
│   │
│   ├── modules/                    # Feature modules (dominio del negocio)
│   │   ├── dashboard/
│   │   │   ├── pages/
│   │   │   │   └── DashboardPage.tsx
│   │   │   ├── components/
│   │   │   │   ├── KpiCards.tsx          # Tarjetas de resumen
│   │   │   │   ├── RevenueByPlatform.tsx # Gráfico barras
│   │   │   │   ├── RevenueByProvider.tsx  # Gráfico barras
│   │   │   │   ├── RevenueByCustomer.tsx  # Tabla top clientes
│   │   │   │   ├── ExpensesByProvider.tsx # Gráfico pastel/barras
│   │   │   │   ├── StatusChart.tsx        # Distribución de estados
│   │   │   │   └── ExpiringSoon.tsx       # Alerta: próximos a vencer
│   │   │   └── hooks/
│   │   │       └── use-dashboard.ts
│   │   │
│   │   ├── accounts/               # Inventario de cuentas
│   │   │   ├── pages/
│   │   │   │   ├── AccountsListPage.tsx
│   │   │   │   └── AccountDetailPage.tsx
│   │   │   ├── components/
│   │   │   │   ├── AccountForm.tsx
│   │   │   │   ├── AccountCard.tsx
│   │   │   │   ├── AccountsTable.tsx
│   │   │   │   ├── ScreenSlots.tsx        # Pantallas dentro de una cuenta
│   │   │   │   └── StatusChangeDialog.tsx
│   │   │   └── hooks/
│   │   │       └── use-accounts.ts
│   │   │
│   │   ├── screens/                # Pantallas vendidas
│   │   │   ├── pages/
│   │   │   │   ├── ScreensListPage.tsx
│   │   │   │   └── ScreenFormPage.tsx
│   │   │   ├── components/
│   │   │   │   ├── ScreenForm.tsx
│   │   │   │   ├── ScreensTable.tsx
│   │   │   │   └── AssignScreenDialog.tsx   # Asignar pantalla a cliente
│   │   │   └── hooks/
│   │   │       └── use-screens.ts
│   │   │
│   │   ├── customer-accounts/      # Cuentas completas vendidas
│   │   │   ├── pages/
│   │   │   │   ├── CustomerAccountsListPage.tsx
│   │   │   │   └── CustomerAccountFormPage.tsx
│   │   │   ├── components/
│   │   │   │   ├── CustomerAccountForm.tsx
│   │   │   │   └── CustomerAccountsTable.tsx
│   │   │   └── hooks/
│   │   │       └── use-customer-accounts.ts
│   │   │
│   │   ├── orders/                 # Órdenes de compra
│   │   │   ├── pages/
│   │   │   │   ├── OrdersListPage.tsx
│   │   │   │   └── OrderDetailPage.tsx
│   │   │   ├── components/
│   │   │   │   ├── OrderForm.tsx          # Crear Orden (wizard multi-step)
│   │   │   │   ├── OrderItemsSummary.tsx  # Items de la orden
│   │   │   │   ├── OrdersTable.tsx
│   │   │   │   └── AddItemToOrder.tsx      # Agregar pantalla/cuenta a orden
│   │   │   └── hooks/
│   │   │       └── use-orders.ts
│   │   │
│   │   ├── customers/              # Clientes
│   │   │   ├── pages/
│   │   │   │   ├── CustomersListPage.tsx
│   │   │   │   └── CustomerDetailPage.tsx
│   │   │   ├── components/
│   │   │   │   ├── CustomerForm.tsx
│   │   │   │   ├── CustomersTable.tsx
│   │   │   │   └── PurchaseHistory.tsx     # Historial de órdenes del cliente
│   │   │   └── hooks/
│   │   │       └── use-customers.ts
│   │   │
│   │   ├── providers/              # Proveedores
│   │   │   ├── pages/
│   │   │   │   ├── ProvidersListPage.tsx
│   │   │   │   └── ProviderDetailPage.tsx
│   │   │   ├── components/
│   │   │   │   ├── ProviderForm.tsx
│   │   │   │   ├── ProvidersTable.tsx
│   │   │   │   ├── EmailsList.tsx          # Correos asociados al proveedor
│   │   │   │   └── AccountsByProvider.tsx   # Cuentas del proveedor
│   │   │   └── hooks/
│   │   │       └── use-providers.ts
│   │   │
│   │   └── emails/                 # Correos/Gmails
│   │       ├── pages/
│   │       │   └── EmailsListPage.tsx
│   │       ├── components/
│   │       │   ├── EmailForm.tsx
│   │       │   └── EmailsTable.tsx
│   │       └── hooks/
│   │           └── use-emails.ts
│   │
│   ├── routes/                     # React Router config
│   │   ├── index.tsx               # RouterProvider config
│   │   ├── protected.tsx           # Auth guard
│   │   └── paths.ts                # Constantes de rutas
│   │
│   ├── stores/                     # Zustand stores
│   │   ├── auth-store.ts
│   │   └── ui-store.ts             # Sidebar collapse, filters, etc.
│   │
│   ├── App.tsx
│   └── main.tsx
│
├── index.html
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.ts
├── package.json
└── arquitectura.md                  # ← Este archivo
```

---

## 4. Routing

```
/                           → Redirect → /dashboard
/dashboard                  → Resumen financiero
/accounts                   → Lista de cuentas (inventario)
/accounts/:id               → Detalle de cuenta + pantallas
/accounts/new               → Nueva cuenta
/screens                   → Lista de pantallas
/screens/new               → Nueva pantalla
/customer-accounts         → Lista cuentas de clientes
/customer-accounts/new     → Nueva cuenta de cliente
/orders                    → Lista de órdenes
/orders/:id                → Detalle de orden
/orders/new                → Nueva orden (wizard)
/customers                 → Lista de clientes
/customers/:id             → Detalle de cliente
/providers                 → Lista de proveedores
/providers/:id             → Detalle de proveedor
/emails                    → Lista de correos
/login                     → Login
```

### Layout routes

```
<AppShell>                    # Sidebar + Header
  <ProtectedRoute>            # Auth check
    /dashboard
    /accounts/*
    /screens/*
    /customer-accounts/*
    /orders/*
    /customers/*
    /providers/*
    /emails/*
  </ProtectedRoute>
</AppShell>

<GuestLayout>                 # Sin sidebar
  /login
</GuestLayout>
```

---

## 5. Modelo de Datos TypeScript

```typescript
// ─── Estados ─────────────────────────────────────
type AccountStatus = "activo" | "por_vencer" | "vencida" | "caida";
type ScreenStatus = "disponible" | "activo" | "por_vencer" | "vencida" | "caida";
type OrderStatus = "activo" | "por_vencer" | "vencida" | "caida";

// ─── Entidades ───────────────────────────────────
interface Platform {
  id: number;
  name: string;
}

interface Provider {
  id: number;
  name: string;
  contact?: string;
  phone?: string;
  notes?: string;
  observaciones?: string;
  created_at: string;
}

interface Email {
  id: number;
  email: string;
  password?: string;
  verification_email?: string;
  last_login?: string;
  requires_validation?: boolean;
  owner_name?: string;
  birth_date?: string;
  gender?: string;
  provider?: number;       // FK
  notes?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface Customer {
  id: number;
  name: string;
  phone: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

interface Account {
  id: number;
  email?: number;           // FK → Email
  platform: number;          // FK → Platform
  platform_name?: string;    // read_only
  email_address?: string;    // read_only
  max_screens: number;       // 1-5
  credentials?: string;
  status: AccountStatus;
  purchase_price?: number;
  fecha_compra?: string;
  fecha_pago?: string;
  fecha_corte?: string;
  observaciones?: string;
  notes?: string;
  is_active: boolean;
  screens_count?: number;     // computed
  available_screens?: number; // computed
  created_at: string;
  updated_at: string;
}

interface Screen {
  id: number;
  account: number;           // FK → Account
  customer?: number;         // FK → Customer
  order?: number;            // FK → Order
  pin?: string;
  precio_venta?: number;
  profile_name?: string;
  status: ScreenStatus;
  fecha_inicio?: string;
  fecha_cobro?: string;
  fecha_corte?: string;
  observaciones?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  // Populated por serializer
  account_info?: string;
  customer_name?: string;
}

interface CustomerAccount {
  id: number;
  account: number;
  customer: number;
  order?: number;
  contraseña: string;
  precio_venta?: number;
  profile_name?: string;
  status: AccountStatus;
  fecha_inicio?: string;
  fecha_cobro?: string;
  fecha_corte?: string;
  observaciones?: string;
  created_at: string;
  updated_at: string;
  // Populated
  account_info?: string;
  customer_name?: string;
}

interface Order {
  id: number;
  customer: number;
  total?: number;
  status: OrderStatus;
  fecha_inicio?: string;
  fecha_cobro?: string;
  fecha_corte?: string;
  observaciones?: string;
  created_at: string;
  updated_at: string;
  // Nested detail
  customer_name?: string;
  items_count?: number;
  screens_detail?: ScreenDetail[];
  customer_accounts_detail?: CustomerAccountDetail[];
}

// ─── Dashboard ──────────────────────────────────
interface DashboardResumen {
  ingresos: {
    orders_total: number;
    screens_total: number;
    customer_accounts_total: number;
    total: number;
  };
  egresos: number;
  balance: number;
  conteos: {
    cuentas_activas: number;
    pantallas_vendidas: number;
    pantallas_disponibles: number;
    ordenes_activas: number;
  };
}
```

---

## 6. Capa API

### Patrón: un archivo por dominio + TanStack Query hooks

```typescript
// src/api/client.ts
import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api",
  headers: { "Content-Type": "application/json" },
});

// Interceptor: inyectar token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Token ${token}`;
  return config;
});

// Interceptor: 401 → logout
api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
```

```typescript
// src/api/accounts.ts
import { api } from "./client";
import type { Account } from "@/lib/types";

export const accountsApi = {
  list: (params?: Record<string, unknown>) =>
    api.get<Account[]>("/accounts/", { params }).then((r) => r.data),

  get: (id: number) =>
    api.get<Account>(`/accounts/${id}/`).then((r) => r.data),

  create: (data: Partial<Account>) =>
    api.post<Account>("/accounts/", data).then((r) => r.data),

  update: (id: number, data: Partial<Account>) =>
    api.put<Account>(`/accounts/${id}/`, data).then((r) => r.data),

  partialUpdate: (id: number, data: Partial<Account>) =>
    api.patch<Account>(`/accounts/${id}/`, data).then((r>) => r.data),

  changeStatus: (id: number, status: AccountStatus) =>
    api.patch<Account>(`/accounts/${id}/change_status/`, { status }).then((r) => r.data),

  getScreens: (id: number) =>
    api.get<Screen[]>(`/accounts/${id}/screens/`).then((r) => r.data),

  delete: (id: number) =>
    api.delete(`/accounts/${id}/`),
};
```

### TanStack Query hooks

```typescript
// src/modules/accounts/hooks/use-accounts.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { accountsApi } from "@/api/accounts";

export function useAccounts(filters?: Record<string, unknown>) {
  return useQuery({
    queryKey: ["accounts", filters],
    queryFn: () => accountsApi.list(filters),
  });
}

export function useAccount(id: number) {
  return useQuery({
    queryKey: ["accounts", id],
    queryFn: () => accountsApi.get(id),
    enabled: !!id,
  });
}

export function useCreateAccount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: accountsApi.create,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["accounts"] }),
  });
}

export function useChangeAccountStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: AccountStatus }) =>
      accountsApi.changeStatus(id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["accounts"] }),
  });
}
```

---

## 7. Diseño de Pantallas por Módulo

### 7.1 Dashboard (`/dashboard`)

**Propósito**: Vista ejecutiva del estado del negocio.

| Sección | Contenido | Componente |
|---------|-----------|------------|
| KPI Cards | Ingresos totales, Egresos, Balance, Cuentas activas, Pantallas vendidas, Órdenes activas | `KpiCards` |
| Ingresos por Plataforma | Barras horizontales — qué plataforma genera más | `RevenueByPlatform` |
| Ingresos por Proveedor | Barras — rendimiento de cada proveedor | `RevenueByProvider` |
| Top Clientes | Tabla top 10 por ingreso | `RevenueByCustomer` |
| Egresos por Proveedor | Gráfico — a quién más se le paga | `ExpensesByProvider` |
| Distribución de Estados | Donut/Pie — cuentas y pantallas por estado | `StatusChart` |
| Próximos a Vencer | Lista de items con `fecha_corte` < 7 días | `ExpiringSoon` |

**Data source**: `GET /api/dashboard/resumen/` + endpoints agrupados.

```
┌─────────────────────────────────────────────────────────────┐
│  💰 $2,450,000    💸 $1,180,000    📊 $1,270,000           │
│  Ingresos          Egresos           Balance                  │
│                                                             │
│  🟢 45 cuentas    🔵 78 pantallas   🟡 12 por vencer       │
│  activas            vendidas           items                 │
├────────────────────────┬────────────────────────────────────┤
│  Ingresos por Plat.    │  Egresos por Proveedor              │
│  ████████ Netflix      │  ██████ P SIR                       │
│  █████  Disney+       │  ███████ P William                  │
│  ███   HBO Max        │  ████ P Adriana                     │
│  ██    Prime Video    │  ███ P Brayan                       │
├────────────────────────┴────────────────────────────────────┤
│  ⚠️ Próximos a vencer (7 días)                              │
│  • Netflix #12 → Mechas 2 → corte 05 jun                   │
│  • Disney+ #8 → Salome → corte 06 jun                       │
│  • HBO Max #3 → Silvia → corte 07 jun                      │
└─────────────────────────────────────────────────────────────┘
```

### 7.2 Cuentas (Inventario) (`/accounts`)

**Propósito**: CRUD de cuentas compradas a proveedores. Es el inventario.

| Vista | Funcionalidad |
|-------|-------------|
| Lista | Tabla con filtros: estado, plataforma, activo. Columnas: ID, Plataforma, Email, Estado, Capacidad (X/5 pantallas), Precio compra, Fecha corte, Acciones |
| Detalle | Vista expandida de una cuenta con sus pantallas asignadas (slots), fechas, historial de estados |
| Crear/Editar | Form: plataforma, email (select de correos), credentials, max_screens, purchase_price, fecha_compra, observaciones |
| Cambiar estado | Dialog con select de nuevo estado (`activo → por_vencer → vencida → caida`) |

**UX clave**:
- **Slots visuales**: Al ver una cuenta con `max_screens=4`, mostrar 4 slots. Los vendidos en verde, disponibles en gris, clic para asignar.
- **Auto-cálculo**: Al crear cuenta con `fecha_compra`, auto-calcular `fecha_pago` (+28d) y `fecha_corte` (+30d).

### 7.3 Pantallas (`/screens`)

**Propósito**: Gestión de perfiles vendidos dentro de cuentas.

| Vista | Funcionalidad |
|-------|-------------|
| Lista | Tabla: Cuenta origen, Plataforma, Cliente, PIN, Precio venta, Estado, Fecha corte |
| Crear | Seleccionar cuenta (con validación de capacidad), asignar cliente, PIN, precio, fecha_inicio |
| Asignar | Workflow: pantalla disponible → asignar a cliente + crear/link a orden |

**UX clave**:
- **Asignación rápida**: Desde la vista de cuenta, clic en slot disponible → modal para asignar cliente + precio.
- **PIN field**: Input de 4 dígitos numéricos con mask.
- **Validación**: No permitir crear más pantallas que `max_screens` de la cuenta.

### 7.4 Cuentas de Cliente (`/customer-accounts`)

**Propósito**: Cuentas completas vendidas (no pantallas individuales).

Similar a Pantallas pero con campos: contraseña en vez de PIN, sin concepto de "slot".

### 7.5 Órdenes (`/orders`)

**Propósito**: Agrupar ventas (combos). Una orden = una factura al cliente.

| Vista | Funcionalidad |
|-------|-------------|
| Lista | Tabla: #Orden, Cliente, Total, Estado, Items, Fecha inicio, Fecha corte |
| Detalle | Datos de la orden + lista de pantallas y cuentas de cliente asociadas |
| Crear (Wizard) | **Step 1**: Seleccionar cliente (o crear uno nuevo inline) → **Step 2**: Agregar pantallas y/o cuentas → **Step 3**: Confirmar, ver resumen |

**UX clave**:
- **Wizard multi-step**: El flujo de crear una orden es la operación más importante del negocio.
- **Auto-total**: Calcula el total sumando `precio_venta` de todos los items al momento de confirmar.
- **Acciones en lote**: Desde el detalle, poder cambiar estado a todos los items de la orden.

```
┌─────────────────────────────────────────────────┐
│  Nueva Orden                                      │
│                                                   │
│  Step 1: Cliente ────────────────────────────    │
│  Cliente: [Buscar o crear... ▼]                  │
│                                                   │
│  Step 2: Agregar items ────────────────────      │
│  ┌──────────────────────────────────────┐        │
│  │ + Pantalla    + Cuenta de Cliente    │        │
│  │                                      │        │
│  │ Netflix #15 → Pantalla 2 - $5,000   │        │
│  │ Disney+ #8  → Pantalla 1 - $4,000   │        │
│  │ HBO Max #3  → Cuenta completa - $9,000│       │
│  └──────────────────────────────────────┘        │
│                                                   │
│  Total: $18,000                                   │
│                                                   │
│  Step 3: Confirmar ──────────────────────        │
│  [Cancelar]                        [Crear Orden] │
└─────────────────────────────────────────────────┘
```

### 7.6 Clientes (`/customers`)

| Vista | Funcionalidad |
|-------|-------------|
| Lista | Tabla: Nombre, Teléfono, # Órdenes, Total gastado, Última orden |
| Detalle | Datos del cliente + historial de órdenes + pantallas/cuentas activas |
| Crear/Editar | Nombre, Teléfono, Notas |

**UX clave**:
- **Búsqueda rápida**: Buscar por nombre o teléfono mientras se escribe (debounce 300ms).
- **Inline create**: From orders, poder crear un cliente nuevo sin salir del wizard.

### 7.7 Proveedores (`/providers`)

| Vista | Funcionalidad |
|-------|-------------|
| Lista | Tabla: Nombre, Contacto, Teléfono, # Cuentas, # Correos, Total egresos |
| Detalle | Datos + correos asociados + cuentas en inventario |

### 7.8 Correos (`/emails`)

| Vista | Funcionalidad |
|-------|-------------|
| Lista | Tabla: Email, Proveedor, Activo, Último login |
| Crear/Editar | Email, Password, Proveedor, verificación, notas |

---

## 8. Diseño Visual

### Paleta de Colores

```
Estado → Color semántico:
  activo       → 🟢 green-500   (#22c55e)
  disponible   → 🔵 blue-400    (#60a5fa)
  por_vencer   → 🟡 amber-500   (#f59e0b)
  vencida      → 🔴 red-500     (#ef4444)
  caida        → ⚫ slate-500    (#64748b)
```

### Plataformas — Colores e Íconos

```
Netflix       → 🔴 #E50914
Disney+       → 🔵 #1A6DFF
HBO Max       → 🟣 #B01EEF
Star+         → 🟡 #FFD100
Prime Video   → 🔷 #00A8E1
Crunchyroll   → 🟠 #F47521
Directv Go    → 💚 #00B82E
Spotify       → 💚 #1DB954
ChatGPT       → ⚪ #10A37F
Paramount+    → 🔵 #0064FF
VIX           → 🟡 #FF6B00
YouTube Prem  → 🔴 #FF0000
```

### Layout

```
┌──────────────────────────────────────────────────────────┐
│ ☰ Streaming Dashboard                    🔔 👤 Admin    │
├──────┬───────────────────────────────────────────────────┤
│      │                                                   │
│ 📊   │  [Contenido principal]                             │
│ Dash │                                                   │
│      │                                                   │
│ 📦   │                                                   │
│ Cuen │                                                   │
│      │                                                   │
│ 🖥️   │                                                   │
│ Pant │                                                   │
│      │                                                   │
│ 🧾   │                                                   │
│ Orde │                                                   │
│      │                                                   │
│ 👤   │                                                   │
│ Clie │                                                   │
│      │                                                   │
│ 🏭   │                                                   │
│ Prov │                                                   │
│      │                                                   │
│ 📧   │                                                   │
│ Mail │                                                   │
│      │                                                   │
└──────┴───────────────────────────────────────────────────┘
```

- **Sidebar**: Colapsable (iconos only en móvil). Items: Dashboard, Cuentas, Pantallas, Cuentas Cliente, Órdenes, Clientes, Proveedores, Correos.
- **Header**: Breadcrumb + notificaciones (vencimientos) + avatar.
- **Contenido**: Full-width para tablas, max-width para forms.

---

## 9. Flujos Críticos

### 9.1 Compra a Proveedor → Inventario

```
1. Proveedor vende una cuenta Netflix
2. Admin crea Email (si no existe) → lo asocia al proveedor
3. Admin crea Account:
   - Elige plataforma (Netflix)
   - Elige email asociado
   - Define max_screens (ej: 5)
   - Ingresa purchase_price
   - Ingresa fecha_compra
   - Se auto-calcula: fecha_pago = compra + 28d, fecha_corte = compra + 30d
4. Account aparece en inventario con estado "activo"
5. Se crean N pantallas con status "disponible" listas para vender
```

### 9.2 Venta a Cliente (Orden)

```
1. Cliente quiere Netflix pantalla + Disney pantalla + HBO cuenta completa
2. Admin crea Order:
   - Selecciona/crea cliente
   - Step 1: Pantalla Netflix (cuenta X, slot 2) → $5,000
   - Step 2: Pantalla Disney (cuenta Y, slot 1) → $4,000
   - Step 3: Cuenta completa HBO (cuenta Z) → $9,000
   - Total: $18,000
3. Cada item hereda status "activo"
4. Cada item calcula: fecha_cobro = inicio + 29d, fecha_corte = inicio + 30d
5. Order.status = "activo"
```

### 9.3 Ciclo de Vencimiento

```
Cada día (o al cargar):
  - Items con fecha_corte < hoy → status = "vencida"
  - Items con fecha_corte - 7 días < hoy → status = "por_vencer"

Al cambiar estado:
  - Si la Order tiene todos los items "vencida" → Order.status = "vencida"
  - Si algún item "por_vencer" → Order.status = "por_vencer"
```

**NOTA**: Este cálculo debe hacerse en el backend. El frontend muestra los estados y opcionalmente refresca con `refetchInterval` en TanStack Query.

---

## 10. Estado y Cache

### Estrategia TanStack Query

| Recurso | Stale Time | Refetch | Placeholder |
|---------|-----------|---------|-------------|
| Dashboard | 30s | `refetchInterval: 30_000` | Skeleton |
| Accounts | 2 min | On window focus | Cache |
| Screens | 2 min | On window focus | Cache |
| Orders | 1 min | On window focus | Cache |
| Customers | 5 min | On window focus | Cache |
| Providers | 10 min | On window focus | Cache |
| Platforms | Infinity | Never (catálogo) | Prefetch |

### Invalidaciones en Mutations

```typescript
// Crear pantalla → invalidar cuenta (screens_count cambia)
onSuccess: () => {
  qc.invalidateQueries({ queryKey: ["screens"] });
  qc.invalidateQueries({ queryKey: ["accounts"] }); // Refresca screens_count
  qc.invalidateQueries({ queryKey: ["dashboard"] });
}

// Cambiar estado → invalidar el recurso + dashboard
onSuccess: () => {
  qc.invalidateQueries({ queryKey: ["accounts"] });
  qc.invalidateQueries({ queryKey: ["screens"] });
  qc.invalidateQueries({ queryKey: ["customer-accounts"] });
  qc.invalidateQueries({ queryKey: ["orders"] });
  qc.invalidateQueries({ queryKey: ["dashboard"] });
}
```

---

## 11. Autenticación

El backend **no tiene auth** aún (ver `MEJORAS.md` del backend). El frontend debe prepararse para:

### Fase 1 (actual): Sin auth real
- Constante `VITE_AUTH_ENABLED=false` → saltea login
- App funciona sin token

### Fase 2 (próxima): Token auth
- Login: `POST /api/auth/login/` → guarda token en `localStorage`
- Logout: elimina token
- Interceptor Axios inyecta `Authorization: Token xxx`
- Interceptor 401 → redirect a `/login`
- Rutas protegidas con `<ProtectedRoute>` wrapper

---

## 12. Manejo de Formularios

### Patrón con React Hook Form + Zod

```typescript
// src/lib/schemas.ts
import { z } from "zod";

export const accountSchema = z.object({
  platform: z.number({ required_error: "Plataforma requerida" }),
  email: z.number().nullable().optional(),
  max_screens: z.number().min(1).max(5),
  purchase_price: z.number().positive().optional(),
  fecha_compra: z.string().optional(),
  credentials: z.string().optional(),
  observaciones: z.string().optional(),
});

export type AccountFormData = z.infer<typeof accountSchema>;
```

```typescript
// En el componente:
const form = useForm<AccountFormData>({
  resolver: zodResolver(accountSchema),
  defaultValues: { max_screens: 1 },
});
```

---

## 13. Paginación

El backend DRF ya pagína a 25 items por defecto. El frontend debe manejar `count`, `next`, `previous`, `results`:

```typescript
interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// En TanStack Query:
export function useAccounts(page: number, filters?: Record<string, unknown>) {
  return useQuery({
    queryKey: ["accounts", page, filters],
    queryFn: () =>
      accountsApi.list({ page, ...filters }).then((r) => r.data),
  });
}
```

La tabla usa `DataTablePagination` con TanStack Table que maneja `pageIndex` y `pageSize`.

---

## 14. Testing Strategy

| Capa | Tipo | Herramienta | Qué se prueba |
|------|------|------------|---------------|
| Unit | Componentes aislados | Vitest + Testing Library | Render, interacciones, formularios |
| Integration | API hooks + cache | Vitest + MSW | TanStack Query hooks con mock server |
| E2E | Flujos críticos | Playwright | Crear orden, cambiar estado, filtros |
| Visual | Regresión UI | Playwright screenshots | Layout principal, tabs de datos |

### Tests prioritizados (E2E)

1. **Crear orden completa** (cliente + pantallas + cuenta) — el flujo más importante
2. **Cambiar estado** de cuenta/pantalla y verificar refresh
3. **Filtrar** cuentas por estado y plataforma
4. **Dashboard** carga datos y muestra gráficos

---

## 15. Optimizaciones

| Técnica | Dónde | Impacto |
|---------|-------|---------|
| **Lazy loading** | Rutas de módulos | Reduce bundle inicial ~40% |
| **React.memo** | Celdas de tablas | Evita re-renders en scroll |
| **useMemo** | Totales calculados | Cálculos en dashboard |
| **Placeholder** | Imágenes de plataformas | No bloquea paint |
| **Prefetch** | Platforms, Providers | Catálogo que no cambia |
| **Virtual scroll** | Si tablas > 100 rows | Solo para futuro |

```typescript
// Lazy loading en router
const AccountsListPage = lazy(() => import("@/modules/accounts/pages/AccountsListPage"));
```

---

## 16. Internacionalización

Para esta fase, **no se implementa i18n completo**. Se usan strings en español directamente en los componentes. Si en el futuro se necesita multi-idioma, se puede agregar `react-i18next` sin refactoring mayor ya que los strings están en los componentes (no en una lib externa).

---

## 17. Comunicación con el Backend

### Base URL y CORS

```
VITE_API_URL=http://localhost:8000/api
```

El backend necesita `django-cors-headers` configurado para aceptar requests desde `http://localhost:5173` (Vite dev server).

### Convención de errores DRF

```json
// 400 Bad Request
{
  "field_name": ["Error message"],
  "non_field_errors": ["Error general"]
}

// 404 Not Found
{ "detail": "Not found." }
```

El frontend normaliza errores:

```typescript
// src/api/client.ts
function normalizeError(error: unknown): ApiError {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;
    if (typeof data === "object" && data !== null) {
      // DRF field errors
      const messages = Object.values(data).flat().join(". ");
      return { message: messages, fields: data, status: error.response?.status };
    }
    return { message: data?.detail || error.message, status: error.response?.status };
  }
  return { message: "Error inesperado", status: 500 };
}
```

---

## 18. Decisiones de Arquitectura — Trade-offs

| Decisión | Opción elegida | Alternativa descartada | Por qué |
|----------|---------------|----------------------|---------|
| State server | TanStack Query | Redux + RTK Query | Menos boilerplate, cache automática, invalidación por clave |
| State cliente | Zustand | Redux, Context | Muy poca UI state global, no merece Redux |
| Componentes UI | shadcn/ui | Material UI, Chakra | Sin runtime, copia código, personalizable al 100% |
| Tablas | TanStack Table | AG Grid, MUI DataGrid | Headless, sin opiniones de UI, gratis, ligero |
| Forms | RHF + Zod | Formik + Yup | RHF mejor performance (uncontrolled), Zod infiere tipos TS |
| Charts | Recharts | Chart.js, D3 | Suficiente para barras/pie, declarativo, React-native |
| Auth | Token DRF | JWT | Backend ya usa DRF, JWT agrega complejidad innecesaria para un dashboard interno |

---

## 19. Diagrama de Arquitectura

```
┌─────────────────────────────────────────────────────┐
│                   NAVEGADOR                          │
│                                                      │
│  ┌──────────────────────────────────────────────┐   │
│  │              React App                         │   │
│  │                                                │   │
│  │  ┌─────────┐  ┌─────────┐  ┌──────────────┐  │   │
│  │  │ Zustand │  │  React   │  │ TanStack     │  │   │
│  │  │ (UI     │  │  Router  │  │ Query        │  │   │
│  │  │ State)  │  │  (routes)│  │ (server     │  │   │
│  │  └─────────┘  └─────────┘  │  state +     │  │   │
│  │                             │  cache)      │  │   │
│  │                             └──────┬───────┘  │   │
│  │                                    │           │   │
│  │  ┌─────────────────────────────────┘           │   │
│  │  │  API Layer (Axios)                          │   │
│  │  │  - Interceptors (auth, errors)              │   │
│  │  │  - Endpoint modules per domain             │   │
│  │  └──────────┬──────────────────────────────────┘   │
│  └─────────────┼───────────────────────────────────────┘
│                │                                      │
└────────────────┼──────────────────────────────────────┘
                 │  HTTP (REST JSON)
                 │
┌────────────────▼──────────────────────────────────────┐
│              DJANGO REST BACKEND                       │
│                                                       │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌─────────┐ │
│  │Accounts  │ │Screens   │ │Orders    │ │Dashboard│ │
│  │ViewSet   │ │ViewSet   │ │ViewSet   │ │Views    │ │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬────┘ │
│       │            │            │             │       │
│  ┌────▼────────────▼────────────▼─────────────▼────┐  │
│  │              Django ORM                         │  │
│  └────────────────────┬───────────────────────────┘  │
│                       │                               │
│  ┌────────────────────▼───────────────────────────┐   │
│  │              MariaDB                           │   │
│  │  platforms · providers · emails · customers     │   │
│  │  accounts · screens · customer_accounts · orders │   │
│  └────────────────────────────────────────────────┘   │
└───────────────────────────────────────────────────────┘
```

---

## 20. Plan de Implementación por Sprints

### Sprint 1 — Fundación (1 semana)

- [ ] Vite + React + TypeScript + Tailwind + shadcn setup
- [ ] API client (Axios) con interceptors
- [ ] Layout: AppShell (Sidebar + Header)
- [ ] React Router config con todas las rutas
- [ ] TanStack Query provider + devtools
- [ ] Zod schemas para entidades principales
- [ ] Componentes base: DataTable, StatusBadge, PriceDisplay, DateDisplay

### Sprint 2 — CRUD Esencial (1 semana)

- [ ] Módulo Cuentas (lista + crear + editar + cambiar estado)
- [ ] Módulo Pantallas (lista + crear + asignar cliente)
- [ ] Módulo Cuentas de Cliente (lista + crear)
- [ ] Módulo Clientes (lista + crear + editar + detalle)
- [ ] Módulo Proveedores (lista + crear + editar + detalle)
- [ ] Módulo Correos (lista + crear + editar)

### Sprint 3 — Órdenes y Dashboard (1 semana)

- [ ] Módulo Órdenes con wizard multi-step
- [ ] Dashboard con KPIs + gráficos
- [ ] Endpoint de próximos a vencer (frontend polling o refetch)
- [ ] Filtros y búsqueda en todas las tablas

### Sprint 4 — Polish y Deploy (1 semana)

- [ ] Auth (Token) integración
- [ ] Notificaciones/toasts para acciones
- [ ] Responsive mobile
- [ ] Tests E2E (Playwright) de flujos críticos
- [ ] Dockerfile + docker-compose con backend
- [ ] Deploy a producción

---

## 21. Comandos de Setup

```bash
# Crear proyecto
npm create vite@latest frontend-streaming -- --template react-ts
cd frontend-streaming

# Dependencias principales
npm install react-router-dom @tanstack/react-query @tanstack/react-table
npm install axios zustand react-hook-form @hookform/resolvers zod
npm install recharts date-fns sonner

# shadcn/ui
npx shadcn@latest init
npx shadcn@latest add button input dialog select table badge
npx shadcn@latest add card dropdown-menu sheet separator tooltip
npx shadcn@latest add form toast tabs popover command

# Dev dependencies
npm install -D vitest @testing-library/react @testing-library/jest-dom msw
npm install -D @playwright/test
npm install -D tailwindcss @tailwindcss/vite
```

---

*Documento generado por Arquitecto — versión 1.0 — 2026-06-04*