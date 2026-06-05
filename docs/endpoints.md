# API Endpoints — Backend Streaming

Base URL: `http://{host}:8000/api`

---

## Plataformas

### `GET /api/platforms/`

Catálogo de plataformas. Solo lectura.

**Response:**
```json
[
  {"id": 1, "name": "Netflix"},
  {"id": 2, "name": "Disney+"},
  {"id": 3, "name": "HBO Max"},
  {"id": 4, "name": "Star+"},
  {"id": 5, "name": "Prime Video"},
  {"id": 6, "name": "Crunchyroll"},
  {"id": 7, "name": "Directv Go"},
  {"id": 8, "name": "Spotify"},
  {"id": 9, "name": "ChatGPT"},
  {"id": 10, "name": "Paramount+"},
  {"id": 11, "name": "VIX"},
  {"id": 12, "name": "YouTube Premium"}
]
```

---

## Proveedores

### `GET /api/providers/`

Lista todos los proveedores.

### `POST /api/providers/`

Crear proveedor.

**Body:**
```json
{
  "name": "P Nuevo",
  "contact": "...",
  "phone": "2222",
  "notes": "...",
  "observaciones": "..."
}
```

### `GET /api/providers/:id/`

Detalle de un proveedor.

### `PUT /api/providers/:id/`

Actualizar proveedor.

### `DELETE /api/providers/:id/`

Eliminar proveedor.

---

## Correos (Emails)

### `GET /api/emails/`

Lista todos los correos. Filtrable por `?is_active=true&provider=1`.

### `POST /api/emails/`

Crear correo.

**Body:**
```json
{
  "email": "ejemplo@gmail.com",
  "password": "...",
  "provider": 1,
  "is_active": true
}
```

### `GET /api/emails/:id/`

### `PUT /api/emails/:id/`

### `DELETE /api/emails/:id/`

---

## Clientes

### `GET /api/customers/`

Lista todos los clientes (80 registros). Paginado a 25.

**Query params:** `?search=nombre&page=2`

### `POST /api/customers/`

Crear cliente.

**Body:**
```json
{
  "name": "Nuevo Cliente",
  "phone": "3001234567",
  "notes": "..."
}
```

### `GET /api/customers/:id/`

### `PUT /api/customers/:id/`

### `DELETE /api/customers/:id/`

---

## Cuentas (Accounts)

### `GET /api/accounts/`

Lista cuentas en inventario. 90 registros.

**Query params:**

| Parámetro | Ejemplo |
|---|---|
| `?status=activo` | Filtrar por estado |
| `?platform=1` | Filtrar por plataforma |
| `?is_active=true` | Solo activas |
| `?search=netflix` | Búsqueda |
| `?ordering=-created_at` | Orden |

**Response:**
```json
{
  "count": 90,
  "results": [
    {
      "id": 1,
      "platform": 1,
      "platform_name": "Netflix",
      "email": 5,
      "email_address": "crunchroll0020-fz0056@strampre77.com",
      "max_screens": 4,
      "credentials": "castillos9871",
      "status": "activo",
      "purchase_price": "5000.00",
      "fecha_compra": "2025-09-18",
      "fecha_pago": "2026-06-14",
      "fecha_corte": "2026-06-15",
      "observaciones": null,
      "is_active": true,
      "screens_count": 0,
      "available_screens": 0
    }
  ]
}
```

### `POST /api/accounts/`

Crear cuenta.

**Body:**
```json
{
  "platform": 1,
  "email": 5,
  "max_screens": 4,
  "credentials": "...",
  "status": "activo",
  "purchase_price": "5000.00",
  "fecha_compra": "2025-09-18",
  "is_active": true
}
```

### `GET /api/accounts/:id/`

### `PUT /api/accounts/:id/`

### `DELETE /api/accounts/:id/`

### `PATCH /api/accounts/:id/change_status/`

Cambiar solo el estado.

**Body:** `{"status": "vencida"}`

### `GET /api/accounts/:id/screens/`

Pantallas asociadas a esta cuenta.

---

## Pantallas (Screens)

### `GET /api/screens/`

Lista todas las pantallas. 73 registros.

**Query params:**

| Parámetro | Ejemplo |
|---|---|
| `?status=activo` | Estado |
| `?account=5` | Pantallas de cuenta #5 |
| `?customer=10` | Pantallas del cliente #10 |
| `?search=5522` | Buscar por PIN |

**Response:**
```json
{
  "count": 73,
  "results": [
    {
      "id": 1,
      "account": 5,
      "account_info": "Netflix #5 — Activo",
      "customer": 10,
      "customer_name": "Dania Buitrago",
      "order": 16,
      "pin": "5522",
      "precio_venta": "14000.00",
      "profile_name": null,
      "status": "activo",
      "fecha_inicio": "2024-02-20",
      "fecha_cobro": "2026-06-12",
      "fecha_corte": "2026-06-13",
      "observaciones": null,
      "notes": null
    }
  ]
}
```

### `POST /api/screens/`

Crear pantalla.

**Body:**
```json
{
  "account": 5,
  "customer": 10,
  "order": 16,
  "pin": "1234",
  "precio_venta": "15000.00",
  "status": "activo",
  "fecha_inicio": "2025-01-01"
}
```

### `GET /api/screens/:id/`

### `PUT /api/screens/:id/`

### `DELETE /api/screens/:id/`

### `PATCH /api/screens/:id/change_status/`

**Body:** `{"status": "caida"}`

---

## Cuentas de Clientes (Customer Accounts)

### `GET /api/customer_accounts/`

Lista cuentas completas vendidas. 15 registros.

### `POST /api/customer_accounts/`

**Body:**
```json
{
  "account": 3,
  "customer": 1,
  "order": 1,
  "contraseña": "PANICO",
  "precio_venta": "37000.00",
  "status": "activo",
  "fecha_inicio": "2022-10-22"
}
```

### `GET /api/customer_accounts/:id/`

### `PUT /api/customer_accounts/:id/`

### `DELETE /api/customer_accounts/:id/`

---

## Órdenes (Orders)

### `GET /api/orders/`

Lista todas las órdenes. 78 registros. Incluye los items anidados.

**Query params:** `?status=activo&customer=1`

**Response:**
```json
{
  "count": 78,
  "results": [
    {
      "id": 1,
      "customer": 6,
      "customer_name": "Leidisita",
      "total": "37000.00",
      "status": "vencida",
      "fecha_inicio": "2022-10-22",
      "fecha_cobro": "2026-05-25",
      "fecha_corte": "2026-05-26",
      "observaciones": null,
      "items_count": 2,
      "screens_detail": [
        {
          "id": 1,
          "pin": "1212",
          "precio_venta": "12000.00",
          "status": "vencida",
          "platform": "Disney+"
        }
      ],
      "customer_accounts_detail": [
        {
          "id": 1,
          "precio_venta": "37000.00",
          "status": "vencida",
          "platform": "Netflix"
        }
      ]
    }
  ]
}
```

### `POST /api/orders/`

**Body:**
```json
{
  "customer": 6,
  "total": "49000.00",
  "status": "activo",
  "fecha_inicio": "2025-01-01"
}
```

### `GET /api/orders/:id/`

### `PUT /api/orders/:id/`

### `DELETE /api/orders/:id/`

---

## Dashboard Financiero

### `GET /api/dashboard/resumen/`

**Response:**
```json
{
  "ingresos": {
    "orders_total": 1170000.0,
    "screens_total": 832000.0,
    "customer_accounts_total": 425000.0,
    "total": 1257000.0
  },
  "egresos": 1574533.34,
  "balance": -317533.34,
  "conteos": {
    "cuentas_activas": 78,
    "pantallas_vendidas": 73,
    "pantallas_disponibles": 0,
    "ordenes_activas": 62
  }
}
```

### `GET /api/dashboard/ingresos/plataforma/`

Ingresos totalizados por plataforma (screens + customer_accounts).

**Response:**
```json
[
  {"plataforma": "Netflix", "screens": 240000, "cuentas": 425000, "total": 665000, "count_screens": 16, "count_cuentas": 15},
  {"plataforma": "Disney+", "screens": 390000, "cuentas": 0, "total": 390000, "count_screens": 30},
  ...
]
```

### `GET /api/dashboard/ingresos/proveedor/`

Ingresos totalizados por proveedor.

### `GET /api/dashboard/ingresos/cliente/`

Ingresos totalizados por cliente.

### `GET /api/dashboard/egresos/proveedor/`

Egresos (compras a proveedores) totalizados.

### `GET /api/dashboard/egresos/plataforma/`

Egresos totalizados por plataforma.

---

## Paginación, Filtros y Ordenamiento

Todos los endpoints CRUD soportan:

| Feature | Query Param |
|---|---|
| Paginación | `?page=2` (25 por página) |
| Búsqueda | `?search=término` |
| Orden | `?ordering=-created_at` |
| Filtros | `?status=activo&platform=1` |

---

## Docs Interactivas

| Ruta | Descripción |
|---|---|
| `GET /api/docs/` | Swagger UI — probar la API desde el navegador |
| `GET /api/schema/` | OpenAPI 3.0 schema (JSON) |
