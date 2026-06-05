import { create } from "zustand"

interface UIStore {
  sidebarOpen: boolean
  sidebarCollapsed: boolean
  toggleSidebar: () => void
  collapseSidebar: () => void
  expandSidebar: () => void
  mobileOpen: boolean
  setMobileOpen: (open: boolean) => void
}

export const useUIStore = create<UIStore>((set) => ({
  sidebarOpen: true,
  sidebarCollapsed: false,
  mobileOpen: false,
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  collapseSidebar: () => set({ sidebarCollapsed: true }),
  expandSidebar: () => set({ sidebarCollapsed: false }),
  setMobileOpen: (open) => set({ mobileOpen: open }),
}))
