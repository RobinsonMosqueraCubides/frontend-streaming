import axios from "axios"
import {
  mockProviders,
  mockPlatforms,
  mockEmails,
  mockAccounts,
  mockDashboardResumen,
  mockInventario,
  mockCustomers,
  mockScreens,
  mockCustomerAccounts,
  mockOrders,
} from "./mockData"

// Bandera para activar/desactivar fácilmente el fallback de datos de prueba
export const ENABLE_MOCK_FALLBACK = true

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api",
  headers: { "Content-Type": "application/json" },
  timeout: 20000, // Timeout de 20 segundos
})

// Interceptor: inyectar token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token")
  if (token) {
    config.headers.Authorization = `Token ${token}`
  }
  return config
})

// Interceptor: 401 → logout o fallback a mock en localhost si hay timeout o error de red
api.interceptors.response.use(
  (res) => res,
  (error) => {
    // Verificar si es error de autorización
    if (error.response?.status === 401) {
      localStorage.removeItem("token")
      window.location.href = "/login"
      return Promise.reject(error)
    }

    const isLocalhost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    const isTimeoutOrNetworkError = error.code === "ECONNABORTED" || !error.response

    if (ENABLE_MOCK_FALLBACK && isLocalhost && isTimeoutOrNetworkError) {
      const url = error.config?.url || ""
      const method = error.config?.method?.toLowerCase() || "get"

      console.warn(`[API Fallback] Backend offline o lento. Sirviendo mock para ${method.toUpperCase()} ${url}`)

      let mockResponseData: any = null

      if (url.includes("/providers/")) {
        if (method === "get") {
          mockResponseData = mockProviders
        } else if (method === "post") {
          mockResponseData = { id: Math.floor(Math.random() * 1000) + 100, ...JSON.parse(error.config.data || "{}") }
        } else if (method === "put" || method === "patch") {
          mockResponseData = JSON.parse(error.config.data || "{}")
        } else if (method === "delete") {
          mockResponseData = {}
        }
      } else if (url.includes("/platforms/")) {
        if (method === "get") {
          mockResponseData = mockPlatforms
        } else if (method === "post") {
          mockResponseData = { id: Math.floor(Math.random() * 1000) + 100, ...JSON.parse(error.config.data || "{}") }
        } else if (method === "put" || method === "patch") {
          mockResponseData = JSON.parse(error.config.data || "{}")
        } else if (method === "delete") {
          mockResponseData = {}
        }
      } else if (url.includes("/emails/")) {
        if (method === "get") {
          mockResponseData = mockEmails
        } else if (method === "post") {
          mockResponseData = { id: Math.floor(Math.random() * 1000) + 100, ...JSON.parse(error.config.data || "{}") }
        } else if (method === "put" || method === "patch") {
          mockResponseData = JSON.parse(error.config.data || "{}")
        } else if (method === "delete") {
          mockResponseData = {}
        }
      } else if (url.includes("/accounts/")) {
        if (method === "get") {
          mockResponseData = { count: mockAccounts.length, results: mockAccounts }
        } else if (method === "post") {
          mockResponseData = { id: Math.floor(Math.random() * 1000) + 100, ...JSON.parse(error.config.data || "{}") }
        } else if (method === "put" || method === "patch") {
          mockResponseData = JSON.parse(error.config.data || "{}")
        } else if (method === "delete") {
          mockResponseData = {}
        }
      } else if (url.includes("/screens/")) {
        if (method === "get") {
          mockResponseData = { count: mockScreens.length, results: mockScreens }
        } else if (method === "post") {
          mockResponseData = { id: Math.floor(Math.random() * 1000) + 100, ...JSON.parse(error.config.data || "{}") }
        } else if (method === "put" || method === "patch") {
          mockResponseData = JSON.parse(error.config.data || "{}")
        } else if (method === "delete") {
          mockResponseData = {}
        }
      } else if (url.includes("/customers/")) {
        if (method === "get") {
          mockResponseData = { count: mockCustomers.length, results: mockCustomers }
        } else if (method === "post") {
          mockResponseData = { id: Math.floor(Math.random() * 1000) + 100, ...JSON.parse(error.config.data || "{}") }
        } else if (method === "put" || method === "patch") {
          mockResponseData = JSON.parse(error.config.data || "{}")
        } else if (method === "delete") {
          mockResponseData = {}
        }
      } else if (url.includes("/customer-accounts/")) {
        if (method === "get") {
          mockResponseData = { count: mockCustomerAccounts.length, results: mockCustomerAccounts }
        } else if (method === "post") {
          mockResponseData = { id: Math.floor(Math.random() * 1000) + 100, ...JSON.parse(error.config.data || "{}") }
        } else if (method === "put" || method === "patch") {
          mockResponseData = JSON.parse(error.config.data || "{}")
        } else if (method === "delete") {
          mockResponseData = {}
        }
      } else if (url.includes("/orders/")) {
        if (method === "get") {
          mockResponseData = { count: mockOrders.length, results: mockOrders }
        } else if (method === "post") {
          mockResponseData = { id: Math.floor(Math.random() * 1000) + 100, ...JSON.parse(error.config.data || "{}") }
        } else if (method === "put" || method === "patch") {
          mockResponseData = JSON.parse(error.config.data || "{}")
        } else if (method === "delete") {
          mockResponseData = {}
        }
      } else if (url.includes("/dashboard/resumen/")) {
        mockResponseData = mockDashboardResumen
      } else if (url.includes("/dashboard/inventario/")) {
        mockResponseData = mockInventario
      }

      if (mockResponseData !== null) {
        return Promise.resolve({
          data: mockResponseData,
          status: method === "post" ? 201 : (method === "delete" ? 204 : 200),
          statusText: "OK",
          headers: {},
          config: error.config,
        })
      }
    }

    return Promise.reject(error)
  }
)
