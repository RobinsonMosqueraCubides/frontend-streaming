import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { useEgresosProveedor } from "../hooks/use-dashboard"
import { Skeleton } from "@/components/ui/skeleton"
import { PriceDisplay } from "@/components/price-display"

export function ExpensesByProvider() {
  const { data, isLoading } = useEgresosProveedor()

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Egresos por Proveedor</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    )
  }

  if (!data || data.length === 0) {
    return null
  }

  const chartData = data
    .sort((a, b) => b.total - a.total)
    .slice(0, 8)
    .map((item) => ({
      name: item.proveedor,
      total: item.total,
    }))

  return (
    <Card className="border-2 border-border/50 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg">Egresos por Proveedor</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={chartData} margin={{ top: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} angle={-30} textAnchor="end" height={60} />
            <YAxis tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }} />
            <Tooltip
              formatter={(value) => <PriceDisplay amount={Number(value)} />}
              contentStyle={{
                backgroundColor: "var(--color-card)",
                border: "1px solid var(--color-border)",
                borderRadius: "8px",
                fontSize: "12px",
                color: "var(--color-foreground)",
              }}
            />
            <Bar dataKey="total" fill="#6D28D9" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
