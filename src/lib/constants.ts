// ─── Status Types ────────────────────────────────
export type AccountStatus = "activo" | "por_cobrar" | "por_vencer" | "por_cortar" | "vencida" | "caida"
export type ScreenStatus = "disponible" | "activo" | "por_cobrar" | "por_vencer" | "por_cortar" | "vencida" | "caida"
export type OrderStatus = "activo" | "por_cobrar" | "por_vencer" | "por_cortar" | "vencida" | "caida"

// ─── Platform Colors ─────────────────────────────
export const PLATFORM_COLORS: Record<string, string> = {
  "Netflix": "#E50914",
  "Disney+": "#1A6DFF",
  "HBO Max": "#B01EEF",
  "Star+": "#FFD100",
  "Prime Video": "#00A8E1",
  "Crunchyroll": "#F47521",
  "Directv Go": "#00B82E",
  "Spotify": "#1DB954",
  "ChatGPT": "#10A37F",
  "Paramount+": "#0064FF",
  "VIX": "#FF6B00",
  "YouTube Premium": "#FF0000",
}

// ─── Status Config ──────────────────────────────
export const STATUS_CONFIG: Record<string, { label: string; color: string; dotColor: string }> = {
  activo: { label: "Activo", color: "text-status-activo", dotColor: "bg-status-activo" },
  por_cobrar: { label: "Por cobrar", color: "text-status-por-cobrar", dotColor: "bg-status-por-cobrar" },
  disponible: { label: "Disponible", color: "text-status-disponible", dotColor: "bg-status-disponible" },
  por_vencer: { label: "Por vencer", color: "text-status-por-vencer", dotColor: "bg-status-por-vencer" },
  por_cortar: { label: "Por cortar", color: "text-status-por-cortar", dotColor: "bg-status-por-cortar" },
  vencida: { label: "Vencida", color: "text-status-vencida", dotColor: "bg-status-vencida" },
  caida: { label: "Caída", color: "text-status-caida", dotColor: "bg-status-caida" },
}
