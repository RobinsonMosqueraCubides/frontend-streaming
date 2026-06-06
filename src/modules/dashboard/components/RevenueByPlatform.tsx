import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { useIngresosPlataforma } from "../hooks/use-dashboard"
import { Skeleton } from "@/components/ui/skeleton"
import { PriceDisplay } from "@/components/price-display"

export function RevenueByPlatform() {
  const { data, isLoading } = useIngresosPlataforma()

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Ingresos por Plataforma</CardTitle>
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

  const chartData = data.map((item) => ({
    name: item.plataforma,
    screens: item.screens,
    cuentas: item.cuentas,
    total: item.total,
  }))

  return (
    <Card className="border-2 border-border/50 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg">Ingresos por Plataforma</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={chartData} layout="vertical" margin={{ left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.5} />
            <XAxis type="number" tick={{ fontSize: 12, fill: "var(--color-muted-foreground)" }} />
            <YAxis dataKey="name" type="category" tick={{ fontSize: 12, fill: "var(--color-foreground)" }} width={90} />
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
            <Bar dataKey="screens" stackId="a" fill="#8B5CF6" radius={[0, 6, 6, 0]} name="Pantallas" />
            <Bar dataKey="cuentas" stackId="a" fill="#C4B5FD" radius={[0, 6, 6, 0]} name="Cuentas" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
