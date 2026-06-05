import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import { Toaster } from "sonner"
import { AppShell } from "@/components/layout/AppShell"
import { DashboardPage } from "@/modules/dashboard/pages/DashboardPage"
import { AccountsListPage } from "@/modules/accounts/pages/AccountsListPage"
import { ScreensListPage } from "@/modules/screens/pages/ScreensListPage"
import { CustomerAccountsListPage } from "@/modules/customer-accounts/pages/CustomerAccountsListPage"
import { OrdersListPage } from "@/modules/orders/pages/OrdersListPage"
import { CustomersListPage } from "@/modules/customers/pages/CustomersListPage"
import { ProvidersListPage } from "@/modules/providers/pages/ProvidersListPage"
import { EmailsListPage } from "@/modules/emails/pages/EmailsListPage"
import { PATHS } from "@/routes/paths"

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
            <Route path={PATHS.accounts} element={<AccountsListPage />} />
            <Route path={PATHS.screens} element={<ScreensListPage />} />
            <Route path={PATHS.customerAccounts} element={<CustomerAccountsListPage />} />
            <Route path={PATHS.orders} element={<OrdersListPage />} />
            <Route path={PATHS.customers} element={<CustomersListPage />} />
            <Route path={PATHS.providers} element={<ProvidersListPage />} />
            <Route path={PATHS.emails} element={<EmailsListPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" richColors />
      {import.meta.env.VITE_ENABLE_QUERY_DEVTOOLS === "true" && <ReactQueryDevtools />}
    </QueryClientProvider>
  )
}
