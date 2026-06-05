import { create } from "zustand"

type Theme = "light" | "dark"

interface ThemeStore {
  theme: Theme
  toggleTheme: () => void
  setTheme: (theme: Theme) => void
}

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark")
  localStorage.setItem("theme", theme)
}

export const useThemeStore = create<ThemeStore>((set) => ({
  theme: (localStorage.getItem("theme") as Theme) || "light",
  toggleTheme: () =>
    set((state) => {
      const next = state.theme === "light" ? "dark" : "light"
      applyTheme(next)
      return { theme: next }
    }),
  setTheme: (theme) => {
    applyTheme(theme)
    set({ theme })
  },
}))

// Apply on load
applyTheme((localStorage.getItem("theme") as "light" | "dark") || "light")
