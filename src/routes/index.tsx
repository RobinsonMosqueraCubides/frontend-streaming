import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { Toaster } from "sonner"
import { lazy } from "react"
import { AppShell } from "@/components/layout/AppShell"
import { PATHS } from "@/routes/paths"

const DashboardPage = lazy(() => import("@/modules/dashboard/pages/DashboardPage").then(m => ({ default: m.DashboardPage })))
const ProviderPurchasesPage = lazy(() => import("@/modules/provider-purchases/pages/ProviderPurchasesPage").then(m => ({ default: m.ProviderPurchasesPage })))
const AccountsListPage = lazy(() => import("@/modules/accounts/pages/AccountsListPage").then(m => ({ default: m.AccountsListPage })))
const ScreensListPage = lazy(() => import("@/modules/screens/pages/ScreensListPage").then(m => ({ default: m.ScreensListPage })))
const CustomerAccountsListPage = lazy(() => import("@/modules/customer-accounts/pages/CustomerAccountsListPage").then(m => ({ default: m.CustomerAccountsListPage })))
const OrdersListPage = lazy(() => import("@/modules/orders/pages/OrdersListPage").then(m => ({ default: m.OrdersListPage })))
const OrderNewPage = lazy(() => import("@/modules/orders/pages/OrderNewPage").then(m => ({ default: m.OrderNewPage })))
const CustomersListPage = lazy(() => import("@/modules/customers/pages/CustomersListPage").then(m => ({ default: m.CustomersListPage })))
const ProvidersListPage = lazy(() => import("@/modules/providers/pages/ProvidersListPage").then(m => ({ default: m.ProvidersListPage })))
const PlatformsListPage = lazy(() => import("@/modules/platforms/pages/PlatformsListPage").then(m => ({ default: m.PlatformsListPage })))
const EmailsListPage = lazy(() => import("@/modules/emails/pages/EmailsListPage").then(m => ({ default: m.EmailsListPage })))
const CobrosPage = lazy(() => import("@/modules/cobros/pages/CobrosPage").then(m => ({ default: m.CobrosPage })))
const PagosPage = lazy(() => import("@/modules/pagos/pages/PagosPage").then(m => ({ default: m.PagosPage })))

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 2, // 2 min default
    },
  },
})

export default function AppRouter() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to={PATHS.dashboard} replace />} />
          <Route element={<AppShell />}>
            <Route path={PATHS.dashboard} element={<DashboardPage />} />
            <Route path={PATHS.providerPurchases} element={<ProviderPurchasesPage />} />
            <Route path={PATHS.accounts} element={<AccountsListPage />} />
            <Route path={PATHS.screens} element={<ScreensListPage />} />
            <Route path={PATHS.customerAccounts} element={<CustomerAccountsListPage />} />
            <Route path={PATHS.orders} element={<OrdersListPage />} />
            <Route path={PATHS.orderNew} element={<OrderNewPage />} />
            <Route path={PATHS.customers} element={<CustomersListPage />} />
            <Route path={PATHS.providers} element={<ProvidersListPage />} />
            <Route path={PATHS.platforms} element={<PlatformsListPage />} />
            <Route path={PATHS.emails} element={<EmailsListPage />} />
            <Route path={PATHS.cobros} element={<CobrosPage />} />
            <Route path={PATHS.pagos} element={<PagosPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" richColors />
      {import.meta.env.VITE_ENABLE_QUERY_DEVTOOLS === "true" && <ReactQueryDevtools />}
    </QueryClientProvider>
  )
}
