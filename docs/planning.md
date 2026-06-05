# 📋 Planning — Streaming Dashboard

> Documento maestro de planificación. Define módulos, diseño visual, responsive strategy y roadmap.

---

## 1. Resumen del Negocio

Dashboard operativo para la gestión de compra/venta de cuentas de streaming. El flujo principal:

1. **Comprar** cuentas a proveedores → inventario
2. **Vender** pantallas o cuentas completas a clientes (vía órdenes)
3. **Cobrar** y gestionar renovaciones
4. **Monitorear** el estado financiero (ingresos vs egresos)

Moneda: **COP** (Pesos Colombianos)

---

## 2. Sistema de Diseño

### 2.1 Paleta de Colores

#### Tema Claro (Light)

| Token | Color | Hex | Uso |
|-------|-------|-----|-----|
| `--primary` | Morado medio | `#8B5CF6` | Botones principales, acentos, links activos |
| `--primary-soft` | Lila claro | `#C4B5FD` | Fondos de cards, badges, hover states |
| `--primary-muted` | Lila muy claro | `#EDE9FE` | Fondos de sección, sidebar activo |
| `--background` | Blanco | `#FFFFFF` | Fondo principal |
| `--surface` | Blanco humo | `#F8F7FC` | Fondo de cards, contenedores |
| `--surface-raised` | Blanco puro | `#FFFFFF` | Modals, dropdowns, popovers |
| `--border` | Gris-lila | `#E2DFF0` | Bordes, separadores |
| `--text-primary` | Gris oscuro | `#1E1B2E` | Texto principal |
| `--text-secondary` | Gris medio | `#6B6480` | Labels, placeholders, metadata |
| `--text-muted` | Gris claro | `#9CA3AF` | Texto deshabilitado, timestamps |
| `--destructive` | Rojo | `#EF4444` | Acciones destructivas, errores |
| `--success` | Verde | `#22C55E` | Confirmaciones, estados positivos |
| `--warning` | Ámbar | `#F59E0B` | Advertencias, "por vencer" |

#### Tema Oscuro (Dark)

| Token | Color | Hex | Uso |
|-------|-------|-----|-----|
| `--primary` | Morado vibrante | `#A78BFA` | Botones principales, acentos |
| `--primary-soft` | Morado suave | `#7C3AED` | Fondos hover, badges |
| `--primary-muted` | Morado oscuro | `#4C1D95` | Sidebar activo, fondos |
| `--background` | Gris casi negro | `#0F0B1A` | Fondo principal |
| `--surface` | Gris oscuro | `#1A1528` | Cards, contenedores |
| `--surface-raised` | Gris medio-oscuro | `#231E35` | Modals, dropdowns |
| `--border` | Gris-lila oscuro | `#2D2840` | Bordes, separadores |
| `--text-primary` | Blanco-lila | `#F1EDFA` | Texto principal |
| `--text-secondary` | Gris-lila medio | `#A89DC4` | Labels, metadata |
| `--text-muted` | Gris oscuro | `#6B6480` | Timestamps, disabled |

#### Colores Semánticos de Estado (ambos temas)

| Estado | Light | Dark |
|--------|-------|------|
| `activo` / `disponible` | `#22C55E` (green-500) | `#4ADE80` (green-400) |
| `por_vencer` | `#F59E0B` (amber-500) | `#FBBF24` (amber-400) |
| `vencida` | `#EF4444` (red-500) | `#F87171` (red-400) |
| `caida` | `#64748B` (slate-500) | `#94A3B8` (slate-400) |

#### Colores de Plataforma

| Plataforma | Light Hex | Dark Hex |
|-----------|-----------|----------|
| Netflix | `#E50914` | `#FF1A25` |
| Disney+ | `#1A6DFF` | `#4D8EFF` |
| HBO Max | `#B01EEF` | `#C94FFF` |
| Star+ | `#FFD100` | `#FFDC33` |
| Prime Video | `#00A8E1` | `#33BEE8` |
| Crunchyroll | `#F47521` | `#FF8A3D` |
| Directv Go | `#00B82E` | `#33CC55` |
| Spotify | `#1DB954` | `#4DDB7A` |
| ChatGPT | `#10A37F` | `#33BEA0` |
| Paramount+ | `#0064FF` | `#3385FF` |
| VIX | `#FF6B00` | `#FF8A33` |
| YouTube Premium | `#FF0000` | `#FF3333` |

### 2.2 Tipografía

```
Font family:  Inter (system fallback: system-ui, -apple-system, sans-serif)
Base size:    16px (1rem)
Scale:        14px → 16px → 18px → 20px → 24px → 30px → 36px
Weights:      400 (normal), 500 (medium), 600 (semibold), 700 (bold)
```

| Nivel | Tamaño | Peso | Uso |
|-------|--------|------|-----|
| `text-xs` | 12px | 500 | Badges, labels secundarios |
| `text-sm` | 14px | 400 | Cuerpo de tablas, inputs |
| `text-base` | 16px | 400 | Cuerpo de texto |
| `text-lg` | 18px | 600 | Subtítulos de sección |
| `text-xl` | 20px | 600 | Títulos de página |
| `text-2xl` | 24px | 700 | Títulos de sección |
| `text-3xl` | 30px | 700 | KPI cards (valores) |
| `text-4xl` | 36px | 700 | Logo/header |

### 2.3 Espaciado

Sistema basado en múltiplos de 4px:

```
--space-1:  4px    (iconos tight)
--space-2:  8px    (gap entre elementos)
--space-3:  12px   (padding compacto)
--space-4:  16px   (padding estándar, gap de cards)
--space-6:  24px   (secciones)
--space-8:  32px   (entre módulos)
--space-12: 48px   (layout margins)
--space-16: 64px   (page padding mobile)
```

### 2.4 Bordes y Sombras

```
Radius:
  sm:  6px   (buttons, inputs, badges)
  md:  10px  (cards, dialogs)
  lg:  16px  (modals, sheet)
  xl:  24px  (contenedores grandes)
  full: 9999px (pills, avatars)

Shadows (light):
  sm:  0 1px 2px rgba(139, 92, 246, 0.05)
  md:  0 4px 12px rgba(139, 92, 246, 0.08)
  lg:  0 8px 24px rgba(139, 92, 246, 0.12)
  xl:  0 16px 48px rgba(139, 92, 246, 0.16)

Shadows (dark):
  sm:  0 1px 2px rgba(0, 0, 0, 0.3)
  md:  0 4px 12px rgba(0, 0, 0, 0.4)
  lg:  0 8px 24px rgba(0, 0, 0, 0.5)
```

### 2.5 Iconografía

Usar **Lucide React** (compatible con shadcn/ui). Iconos por módulo:

| Módulo | Icono |
|--------|-------|
| Dashboard | `LayoutDashboard` |
| Cuentas | `KeyRound` |
| Pantallas | `Monitor` |
| Cuentas Cliente | `Users` |
| Órdenes | `Receipt` |
| Clientes | `UserCircle` |
| Proveedores | `Building2` |
| Correos | `Mail` |

---

## 3. Estrategia Responsive

### 3.1 Breakpoints

```
sm:  640px   — Móvil landscape
md:  768px   — Tablet portrait
lg:  1024px  — Tablet landscape / laptop small
xl:  1280px  — Desktop
2xl: 1536px  — Desktop grande
```

### 3.2 Comportamiento por Breakpoint

| Elemento | < 640px (mobile) | 640–1024px (tablet) | > 1024px (desktop) |
|----------|-------------------|---------------------|-------------------|
| **Sidebar** | Drawer (Sheet) overlay | Colapsado (iconos only) | Expandido completo |
| **Tablas** | Cards apiladas | Scroll horizontal | Tabla completa |
| **KPI Cards** | 1 columna (stack) | 2 columnas | 3-4 columnas |
| **Gráficos** | Full width, stack | 2 columnas grid | 2-3 columnas grid |
| **Formularios** | 1 columna | 1 columna | 2 columnas si aplica |
| **Modals** | Sheet desde bottom | Centered dialog | Centered dialog |
| **Header** | Logo + hamburger + avatar | Breadcrumb + avatar | Breadcrumb + notifs + avatar |
| **DataTable** | Vista card mode | Compact columns | Full columns |
| **Wizard** | Steps verticales | Steps horizontales | Steps horizontales |

### 3.3 Patrón: Tabla → Cards en Mobile

En pantallas < 640px, las tablas se transforman en cards apiladas:

```
Desktop (tabla):
┌──────┬──────────┬────────┬──────────┬───────────┐
│ ID   │ Cliente  │ Total  │ Estado   │ Fecha     │
├──────┼──────────┼────────┼──────────┼───────────┤
│ #42  │ María    │ $18K   │ ● Activo │ 05 Jun    │
└──────┴──────────┴────────┴──────────┴───────────┘

Mobile (cards):
┌─────────────────────────┐
│ Orden #42               │
│ María · 05 Jun          │
│ $18,000 COP    ● Activo │
│ [→ Ver detalle]         │
└─────────────────────────┘
```

### 3.4 Touch Targets

Mínimo **44×44px** para todos los elementos interactivos en mobile. Botones de acción en tablas se convierten en menús contextuales (long-press o icono `⋮`).

---

## 4. Módulos del Dashboard

### 4.1 Módulo: Dashboard (Resumen Financiero)

**Ruta:** `/dashboard`

**Propósito:** Vista ejecutiva del estado del negocio en un solo golpe de vista.

**Componentes:**

| Componente | Descripción | Data Source |
|-----------|-------------|-------------|
| `KpiCards` | 6 tarjetas: Ingresos, Egresos, Balance, Cuentas activas, Pantallas vendidas, Órdenes activas | `GET /api/dashboard/resumen/` |
| `RevenueByPlatform` | Barras horizontales — ingreso por plataforma | `GET /api/dashboard/ingresos/plataforma/` |
| `RevenueByProvider` | Barras — ingreso por proveedor | `GET /api/dashboard/ingresos/proveedor/` |
| `RevenueByCustomer` | Tabla top 10 clientes por ingreso | `GET /api/dashboard/ingresos/cliente/` |
| `ExpensesByProvider` | Gráfico de barras — egresos por proveedor | `GET /api/dashboard/egresos/proveedor/` |
| `StatusChart` | Donut — distribución de estados de cuentas/pantallas | Agregado de accounts + screens |
| `ExpiringSoon` | Lista de items con fecha_corte < 7 días | Agregado con filtro de fecha |

**Layout responsive:**

```
Desktop (> 1024px):
┌─────┬─────┬─────┬─────┬─────┬─────┐  ← KPIs (6 cards en grid)
├──────────────────┬──────────────────┤
│  Ingresos Plat.  │  Egresos Prov.   │  ← 2 gráficos lado a lado
├──────────────────┬──────────────────┤
│  Top Clientes    │  Donut estados   │  ← Tabla + gráfico
├─────────────────────────────────────┤
│  ⚠️ Próximos a vencer               │  ← Lista completa abajo
└─────────────────────────────────────┘

Mobile (< 640px):
┌─────────────────┐
│ Ingresos        │
├─────────────────┤
│ Egresos         │
├─────────────────┤
│ Balance         │  ← Cards apiladas
├─────────────────┤
│ Cuentas activas │
├─────────────────┤
│ Pantallas       │
├─────────────────┤
│ Órdenes         │
├─────────────────┤
│ Ingresos Plat.  │  ← Gráficos full width
├─────────────────┤
│ Próx. a vencer  │
└─────────────────┘
```

**Refetch:** Cada 30 segundos (`refetchInterval: 30_000`).

---

### 4.2 Módulo: Cuentas (Inventario)

**Ruta:** `/accounts`, `/accounts/:id`, `/accounts/new`

**Propósito:** CRUD del inventario de cuentas compradas a proveedores.

**Sub-componentes:**

| Componente | Funcionalidad |
|-----------|-------------|
| `AccountsTable` | Lista con filtros (estado, plataforma, activo), búsqueda, paginación |
| `AccountCard` | Vista card para mobile — muestra plataforma, estado, pantallas (X/5) |
| `AccountForm` | Crear/editar: plataforma, email (select), credentials, max_screens, precio, fecha_compra |
| `AccountDetail` | Detalle: datos de la cuenta + slots de pantallas + historial |
| `ScreenSlots` | Visualización de slots: disponibles (gris), ocupados (verde), clic para asignar |
| `StatusChangeDialog` | Cambiar estado con confirmación |
| `DateAutoCalc` | Auto-calcula fecha_pago (+28d) y fecha_corte (+30d) al ingresar fecha_compra |

**Acciones por item:**

- Ver detalle
- Cambiar estado
- Editar
- Eliminar (con confirmación)
- Ver pantallas asociadas

**Filtros:**

- Estado (activo, por_vencer, vencida, caida)
- Plataforma (multi-select)
- Activo/inactivo toggle
- Búsqueda por plataforma o email

**Vista de Slots (cuenta individual):**

```
┌─────────────────────────────────┐
│ Netflix #15 — Activo            │
│ cr0020-fz0056@strampre77.com   │
│ ─────────────────────────────── │
│ Pantallas: 3/5                  │
│                                 │
│ ┌─────┐ ┌─────┐ ┌─────┐ ┌───┐ ┌───┐
│ │ 🟢  │ │ 🟢  │ │ 🟢  │ │ ⬜│ │ ⬜│
│ │Me-  │ │Sal- │ │Sil- │ │Disp│ │Disp│
│ │chas │ │ome  │ │via  │ │    │ │    │
│ └─────┘ └─────┘ └─────┘ └───┘ └───┘
└─────────────────────────────────┘
```

---

### 4.3 Módulo: Pantallas

**Ruta:** `/screens`, `/screens/new`

**Propósito:** Gestión de perfiles (pantallas) individuales vendidos dentro de cuentas.

**Sub-componentes:**

| Componente | Funcionalidad |
|-----------|-------------|
| `ScreensTable` | Lista: cuenta, plataforma, cliente, PIN, precio, estado, fecha_corte |
| `ScreensCard` | Vista mobile: plataforma + cliente + PIN + estado |
| `ScreenForm` | Crear: seleccionar cuenta (validar capacidad), asignar cliente, PIN (4 dígitos), precio |
| `AssignScreenDialog` | Flujo rápido desde cuenta: slot disponible → asignar cliente + precio |

**Validaciones:**

- PIN: exactamente 4 dígitos numéricos
- No crear más pantallas que `max_screens` de la cuenta
- La cuenta debe existir y estar activa

**Filtros:**

- Estado
- Cuenta origen
- Cliente asignado
- Búsqueda por PIN

---

### 4.4 Módulo: Cuentas de Cliente

**Ruta:** `/customer-accounts`, `/customer-accounts/new`

**Propósito:** Cuentas completas vendidas (diferente de pantallas individuales).

**Sub-componentes:**

| Componente | Funcionalidad |
|-----------|-------------|
| `CustomerAccountsTable` | Lista: cuenta, plataforma, cliente, precio, estado, fechas |
| `CustomerAccountsCard` | Vista mobile |
| `CustomerAccountForm` | Crear: cuenta, cliente, contraseña, precio, fecha_inicio |

**Diferencias con Pantallas:**

- Usa contraseña en vez de PIN
- No tiene concepto de "slot"
- Es la cuenta completa, no un perfil

---

### 4.5 Módulo: Órdenes

**Ruta:** `/orders`, `/orders/:id`, `/orders/new`

**Propósito:** Agrupar ventas. Una orden = una factura al cliente.

**Sub-componentes:**

| Componente | Funcionalidad |
|-----------|-------------|
| `OrdersTable` | Lista: #orden, cliente, total, estado, # items, fechas |
| `OrdersCard` | Vista mobile |
| `OrderWizard` | **Multi-step form** (ver abajo) |
| `OrderDetail` | Detalle con items anidados (screens + customer_accounts) |
| `OrderItemsSummary` | Resumen visual de items en la orden |
| `AddItemToOrder` | Agregar pantalla o cuenta a una orden |

**Wizard de Creación (3 pasos):**

```
Step 1 — Cliente:
  [🔍 Buscar cliente por nombre o teléfono...]
  ┌──────────────────────────────┐
  │ María García  ·  3001234567  │ ← Resultados dropdown
  │ Carlos López  ·  3109876543  │
  └──────────────────────────────┘
  [＋ Crear cliente nuevo] → modal inline

Step 2 — Agregar Items:
  ┌──────────────────────────────────┐
  │ [＋ Pantalla]  [＋ Cuenta Comp.] │
  │ ───────────────────────────────  │
  │ 🟢 Netflix #15  Pantalla 2       │
  │    María G.  →  $5,000      [✕]  │
  │ 🟢 Disney+ #8   Pantalla 1       │
  │    María G.  →  $4,000      [✕]  │
  │ 🟣 HBO Max #3   Cuenta completa  │
  │    María G.  →  $9,000      [✕]  │
  │ ───────────────────────────────  │
  │ Total: $18,000 COP               │
  └──────────────────────────────────┘

Step 3 — Confirmar:
  Resumen de la orden:
    Cliente: María García
    3 items (2 pantallas + 1 cuenta)
    Total: $18,000 COP
  [Cancelar]                    [✓ Crear Orden]
```

**Acciones en lote (desde detalle):**

- Cambiar estado a todos los items de la orden
- Marcar como renovada

---

### 4.6 Módulo: Clientes

**Ruta:** `/customers`, `/customers/:id`

**Propósito:** Gestión de clientes.

**Sub-componentes:**

| Componente | Funcionalidad |
|-----------|-------------|
| `CustomersTable` | Lista: nombre, teléfono, # órdenes, total gastado, última orden |
| `CustomersCard` | Vista mobile |
| `CustomerForm` | Crear/editar: nombre, teléfono, notas |
| `CustomerDetail` | Datos + historial de órdenes + pantallas/cuentas activas |
| `PurchaseHistory` | Tabla de órdenes del cliente (desde el detalle) |

**Búsqueda:** Debounce 300ms por nombre y teléfono.

**Inline create:** Disponible desde el wizard de órdenes.

---

### 4.7 Módulo: Proveedores

**Ruta:** `/providers`, `/providers/:id`

**Propósito:** Gestión de proveedores de cuentas.

**Sub-componentes:**

| Componente | Funcionalidad |
|-----------|-------------|
| `ProvidersTable` | Lista: nombre, contacto, teléfono, # cuentas, # correos, total egresos |
| `ProvidersCard` | Vista mobile |
| `ProviderForm` | Crear/editar: nombre, contacto, teléfono, notas, observaciones |
| `ProviderDetail` | Datos + correos asociados + cuentas en inventario |
| `EmailsList` | Correos vinculados al proveedor (dentro del detalle) |
| `AccountsByProvider` | Cuentas en inventario de este proveedor |

---

### 4.8 Módulo: Correos (Emails)

**Ruta:** `/emails`

**Propósito:** Gestión de correos electrónicos asociados a cuentas.

**Sub-componentes:**

| Componente | Funcionalidad |
|-----------|-------------|
| `EmailsTable` | Lista: email, proveedor, activo, último login |
| `EmailsCard` | Vista mobile |
| `EmailForm` | Crear/editar: email, password, proveedor, verificación, notas |

**Campos del formulario:**

- Email (validación de formato)
- Password (oculto por defecto, toggle para ver)
- Proveedor (select)
- Verification email
- Datos de recuperación: owner_name, birth_date, gender
- Activo/Inactivo toggle

---

### 4.9 Módulo: Autenticación

**Ruta:** `/login`

**Fase 1 (inicial):** Sin auth real. Variable `VITE_AUTH_ENABLED=false`.

**Fase 2 (próxima):** Token auth contra DRF.

**Sub-componentes:**

| Componente | Funcionalidad |
|-----------|-------------|
| `LoginPage` | Form de login: email + password → `POST /api/auth/login/` |
| `ProtectedRoute` | Guard: verifica token antes de renderizar ruta protegida |
| `AuthInterceptor` | Axios interceptor: inyecta `Authorization: Token xxx` |
| `LogoutButton` | Elimina token + redirect a `/login` |

---

## 5. Layout Global

### 5.1 AppShell

```
┌──────────────────────────────────────────────────────────┐
│  🎬 StreamAdmin    [Breadcrumb]        🔔 👤 Admin ▼    │  ← Header (64px)
├──────────┬───────────────────────────────────────────────┤
│          │                                               │
│ ┌──────┐ │  [Contenido principal]                         │
│ │ 📊   │ │                                               │
│ │ Dash │ │  Padding: 24px desktop / 16px mobile          │
│ │      │ │  Max content width: 1400px                    │
│ │ 📦   │ │                                               │
│ │ Cuent│ │                                               │
│ │      │ │                                               │
│ │ 🖥️   │ │                                               │
│ │ Pant │ │                                               │
│ │      │ │                                               │
│ │ 🧾   │ │                                               │
│ │ Orde │ │                                               │
│ │      │ │                                               │
│ │ 👤   │ │                                               │
│ │ Clie │ │                                               │
│ │      │ │                                               │
│ │ 🏭   │ │                                               │
│ │ Prov │ │                                               │
│ │      │ │                                               │
│ │ 📧   │ │                                               │
│ │ Mail │ │                                               │
│ │      │ │                                               │
│ │ ⚙️   │ │                                               │
│ │ Tema │ │  ← Toggle dark/light                          │
│ └──────┘ │                                               │
│          │                                               │
└──────────┴───────────────────────────────────────────────┘
```

### 5.2 Sidebar

| Propiedad | Desktop | Tablet | Mobile |
|-----------|---------|--------|--------|
| Ancho | 240px expandido / 72px colapsado | 72px (iconos) | Drawer overlay |
| Posición | Fijo left | Fijo left | Sheet desde left |
| Items | Icono + texto | Icono only | Icono + texto |
| Colapsar | Toggle button | Auto | N/A (drawer) |
| Overlay | No | No | Sí (backdrop) |

### 5.3 Header

- **Left:** Breadcrumb de la ruta actual
- **Right:**
  - 🔔 Icono de notificaciones (badge con count de vencimientos)
  - 🌙/☀️ Toggle tema dark/light
  - 👤 Avatar con dropdown (nombre + logout)

---

## 6. Componentes Compartidos

### 6.1 Catálogo de Componentes UI

| Componente | Tipo | Descripción |
|-----------|------|-------------|
| `StatusBadge` | Badge | Estado con color semántico + dot indicator |
| `PlatformIcon` | Icono | Logo de plataforma con color de marca |
| `DateDisplay` | Text | Fecha formateada + días restantes (ej: "05 Jun · 3 días") |
| `PriceDisplay` | Text | Formato COP: `$ 18.000` |
| `ConfirmDialog` | Dialog | Confirmación antes de acciones destructivas |
| `EmptyState` | Placeholder | Ilustración + texto cuando no hay datos |
| `DataTable` | Table | Tabla genérica con TanStack Table (sort, filter, paginate, select) |
| `DataTableToolbar` | Toolbar | Búsqueda + filtros sobre tabla |
| `DataTablePagination` | Pagination | Controles de paginación |
| `DataTableColumnHeader` | Header | Columna sortable con icono de orden |
| `KpiCard` | Card | Métrica con icono, valor, label, trend |
| `SkeletonCard` | Loader | Placeholder animado de carga |
| `Toast` | Notificación | sonner — éxito, error, advertencia |
| `ScreenSlots` | Visual | Grid de slots de pantalla por cuenta |
| `CommandPalette` | Search | Búsqueda global (Cmd+K) |

### 6.2 Estados de Loading

Cada módulo usa **skeleton loaders** específicos:

- Dashboard: skeleton para cada KPI card + skeleton para gráficos
- Tablas: skeleton rows (5 líneas) mientras carga
- Forms: skeleton del formulario
- Cards mobile: skeleton cards

---

## 7. Mapa de Rutas Completo

```
/                              → Redirect → /dashboard
/login                         → Login (solo si auth habilitado)
/dashboard                     → Resumen financiero

/accounts                      → Lista de cuentas
/accounts/new                  → Nueva cuenta
/accounts/:id                  → Detalle de cuenta

/screens                       → Lista de pantallas
/screens/new                   → Nueva pantalla

/customer-accounts             → Lista cuentas de cliente
/customer-accounts/new         → Nueva cuenta de cliente

/orders                        → Lista de órdenes
/orders/new                    → Nueva orden (wizard)
/orders/:id                    → Detalle de orden

/customers                     → Lista de clientes
/customers/new                 → Nuevo cliente
/customers/:id                 → Detalle de cliente

/providers                     → Lista de proveedores
/providers/new                 → Nuevo proveedor
/providers/:id                 → Detalle de proveedor

/emails                        → Lista de correos
/emails/new                    → Nuevo correo
```

---

## 8. Estado y Cache

### 8.1 TanStack Query — Estrategia por Recurso

| Recurso | Stale Time | Refetch | Placeholder |
|---------|-----------|---------|-------------|
| Dashboard resumen | 30s | `refetchInterval: 30_000` | Skeleton cards |
| Dashboard charts | 2 min | Window focus | Skeleton chart |
| Accounts | 2 min | Window focus | Skeleton rows |
| Screens | 2 min | Window focus | Skeleton rows |
| Customer Accounts | 2 min | Window focus | Skeleton rows |
| Orders | 1 min | Window focus | Skeleton rows |
| Customers | 5 min | Window focus | Cache |
| Providers | 10 min | Window focus | Cache |
| Emails | 10 min | Window focus | Cache |
| Platforms | Infinity | Never | Prefetch al inicio |

### 8.2 Invalidación en Mutations

```
Crear/actualizar account → invalidate: accounts, dashboard
Crear/actualizar screen  → invalidate: screens, accounts, dashboard
Crear/actualizar order   → invalidate: orders, screens, customer-accounts, dashboard
Cambiar estado (cualquier) → invalidate: recurso + dashboard
Crear customer           → invalidate: customers
Crear provider           → invalidate: providers
Crear email              → invalidate: emails
```

---

## 9. Gestión de Estado UI (Zustand)

### 9.1 UI Store

```typescript
interface UIStore {
  // Sidebar
  sidebarOpen: boolean;
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  collapseSidebar: () => void;

  // Theme
  theme: "light" | "dark";
  toggleTheme: () => void;
  setTheme: (theme: "light" | "dark") => void;

  // Global filters
  globalSearch: string;
  setGlobalSearch: (q: string) => void;

  // Toasts
  toasts: Toast[];
  addToast: (toast: Toast) => void;
  removeToast: (id: string) => void;

  // Modals
  activeModal: string | null;
  openModal: (id: string) => void;
  closeModal: () => void;
}
```

### 9.2 Auth Store

```typescript
interface AuthStore {
  token: string | null;
  isAuthenticated: boolean;
  login: (token: string) => void;
  logout: () => void;
}
```

---

## 10. Flujos Críticos

### 10.1 Compra a Proveedor → Inventario

```
1. Proveedor ofrece cuenta Netflix
2. Si no existe el email → crear Email y asociar al proveedor
3. Crear Account: plataforma + email + max_screens + purchase_price + fecha_compra
4. Auto-calcular fecha_pago (+28d) y fecha_corte (+30d)
5. Account aparece en inventario como "activo"
6. Crear N pantallas con status "disponible"
```

### 10.2 Venta a Cliente (Orden)

```
1. Seleccionar o crear cliente
2. Agregar pantallas (desde cuentas con slots disponibles)
3. Agregar cuentas completas si aplica
4. Confirmar → crea Order con total automático
5. Cada item hereda status "activo" y calcula fechas
```

### 10.3 Ciclo de Vencimiento

```
Al cargar datos:
  - fecha_corte < hoy → status = "vencida" (amarillo/rojo)
  - fecha_corte - 7 días < hoy → status = "por_vencer" (ámbar)

El backend calcula los estados. El frontend:
  - Muestra badges de estado con colores
  - Polling cada 30s en dashboard
  - Notificación en header si hay items por vencer
```

---

## 11. Testing

### 11.1 Tests E2E Prioritarios (Playwright)

| # | Flujo | Prioridad |
|---|-------|-----------|
| 1 | Crear orden completa (cliente + pantallas + cuenta) | 🔴 Crítico |
| 2 | Cambiar estado de cuenta y verificar refresh | 🔴 Crítico |
| 3 | Filtrar cuentas por estado y plataforma | 🟡 Alto |
| 4 | Dashboard carga datos y muestra gráficos | 🟡 Alto |
| 5 | Crear cuenta con auto-cálculo de fechas | 🟡 Alto |
| 6 | Asignar pantalla desde slot visual | 🟢 Medio |
| 7 | Buscar cliente por nombre/teléfono | 🟢 Medio |

### 11.2 Tests Unitarios (Vitest)

- Componentes de UI (StatusBadge, PriceDisplay, DateDisplay)
- Form validation schemas (Zod)
- Utility functions (cn(), formatters)
- Custom hooks (useDebounce, useStatusColors)

---

## 12. Roadmap por Sprints

### Sprint 1 — Fundación (Semana 1)

- [ ] Setup: Vite + React 19 + TypeScript + Tailwind 4 + shadcn/ui
- [ ] Configurar sistema de temas (light/dark) con CSS variables
- [ ] API client (Axios) con interceptors (auth + errores)
- [ ] AppShell layout: Sidebar + Header + Main content
- [ ] Sidebar responsive: expandido → colapsado → drawer
- [ ] React Router con todas las rutas + ProtectedRoute stub
- [ ] TanStack Query provider + React Query DevTools
- [ ] Zod schemas para todas las entidades
- [ ] Componentes base: DataTable, StatusBadge, PriceDisplay, DateDisplay, EmptyState, KpiCard
- [ ] Toggle de tema dark/light en header

### Sprint 2 — CRUD Core (Semana 2)

- [ ] Módulo Cuentas: lista (tabla + cards mobile), crear, editar, cambiar estado
- [ ] Módulo Pantallas: lista, crear con validación de capacidad, asignar
- [ ] Módulo Cuentas de Cliente: lista, crear
- [ ] Módulo Clientes: lista, crear, editar, detalle con historial
- [ ] Módulo Proveedores: lista, crear, editar, detalle con correos y cuentas
- [ ] Módulo Correos: lista, crear, editar
- [ ] Filtros y búsqueda en todas las tablas
- [ ] Responsive completo de todos los módulos

### Sprint 3 — Órdenes y Dashboard (Semana 3)

- [ ] Módulo Órdenes: lista, wizard multi-step de creación, detalle con items
- [ ] Dashboard: KPI cards, gráficos de barras, donut de estados
- [ ] Lista de próximos a vencer con polling
- [ ] Top clientes por ingreso
- [ ] Acciones en lote desde detalle de orden
- [ ] Toasts de confirmación en todas las mutations

### Sprint 4 — Polish y Deploy (Semana 4)

- [ ] Auth integration (Fase 2: Token DRF)
- [ ] Command palette (Cmd+K) para navegación rápida
- [ ] Skeleton loaders en todas las vistas
- [ ] Optimización: lazy loading de rutas, React.memo en tablas
- [ ] Tests E2E de flujos críticos (Playwright)
- [ ] Dockerfile para frontend
- [ ] Documentación de setup y deploy

---

## 13. Stack Tecnológico Confirmado

| Capa | Tecnología | Versión |
|------|-----------|---------|
| Framework | React + Vite | 19 + 6 |
| Lenguaje | TypeScript | 5.x |
| Routing | React Router | 7 |
| Estado server | TanStack Query | v5 |
| Estado cliente | Zustand | latest |
| Estilos | Tailwind CSS + shadcn/ui | 4 + latest |
| Tablas | TanStack Table | v8 |
| Gráficos | Recharts | latest |
| Formularios | React Hook Form + Zod | latest + latest |
| HTTP | Axios | latest |
| Fechas | date-fns | latest |
| Notificaciones | sonner | latest |
| Iconos | Lucide React | latest |
| Testing unit | Vitest + Testing Library | latest |
| Testing E2E | Playwright | latest |

---

## 14. Variables de Entorno

```env
# Backend
VITE_API_URL=http://localhost:8000/api

# Auth (Fase 1: deshabilitado)
VITE_AUTH_ENABLED=false

# Dev
VITE_ENABLE_QUERY_DEVTOOLS=true
```

---

## 15. Comandos de Setup

```bash
# Crear proyecto
npm create vite@latest frontend-streaming -- --template react-ts
cd frontend-streaming

# Dependencias principales
npm install react-router-dom @tanstack/react-query @tanstack/react-table
npm install axios zustand react-hook-form @hookform/resolvers zod
npm install recharts date-fns sonner lucide-react

# shadcn/ui
npx shadcn@latest init
npx shadcn@latest add button input dialog select table badge
npx shadcn@latest add card dropdown-menu sheet separator tooltip
npx shadcn@latest add form toast tabs popover command skeleton

# Dev dependencies
npm install -D vitest @testing-library/react @testing-library/jest-dom msw
npm install -D @playwright/test
npm install -D tailwindcss @tailwindcss/vite
```

---

*Documento de planificación — versión 1.0 — 2026-06-04*
