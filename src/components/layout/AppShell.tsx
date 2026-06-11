import { Outlet } from "react-router-dom"
import { Sidebar } from "@/components/layout/Sidebar"
import { Header } from "@/components/layout/Header"
import { cn } from "@/lib/utils"
import { useUIStore } from "@/stores/ui-store"
import { Suspense } from "react"

export function AppShell() {
  const { sidebarCollapsed } = useUIStore()

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div
        className={cn(
          "transition-all duration-300",
          sidebarCollapsed ? "lg:pl-[72px]" : "lg:pl-60"
        )}
      >
        <Header />
        <main className="p-4 sm:p-6 lg:p-8">
          <Suspense
            fallback={
              <div className="space-y-6 animate-pulse">
                {/* Header skeleton */}
                <div className="h-20 bg-muted/60 rounded-2xl border border-border/20" />
                {/* KPI cards skeleton */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-24 bg-muted/60 rounded-xl border border-border/20" />
                  ))}
                </div>
                {/* Content grid skeleton */}
                <div className="grid gap-6 lg:grid-cols-2">
                  <div className="h-64 bg-muted/60 rounded-2xl border border-border/20" />
                  <div className="h-64 bg-muted/60 rounded-2xl border border-border/20" />
                </div>
              </div>
            }
          >
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  )
}
