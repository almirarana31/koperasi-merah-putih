"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Users,
  Package,
  ShoppingCart,
  Warehouse,
  Truck,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Activity,
  BarChart3,
  PieChart,
  LineChart,
} from "lucide-react"
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart as RechartsPie,
  Pie,
  Legend,
} from "recharts"
import { getStats, members, products, marketOrders, production, inventory, logistics } from "@/lib/mock-data"

// Get comprehensive statistics
const stats = getStats()

// 8 Monitoring Areas
const monitoringAreas = [
  {
    id: "1",
    title: "Keanggotaan",
    icon: Users,
    color: "primary",
    metrics: {
      total: stats.members.total,
      active: stats.members.active,
      verified: stats.members.verified,
      growth: "+12%"
    }
  },
  {
    id: "2",
    title: "Produksi",
    icon: Package,
    color: "success",
    metrics: {
      total: `${(production.reduce((sum, p) => sum + p.quantity, 0) / 1000).toFixed(1)} Ton`,
      completed: production.filter(p => p.status === "completed").length,
      inProgress: production.filter(p => p.status === "in_progress").length,
      growth: "+18%"
    }
  },
  {
    id: "3",
    title: "Inventory",
    icon: Warehouse,
    color: "info",
    metrics: {
      total: stats.products.total,
      available: stats.products.available,
      lowStock: stats.products.lowStock,
      growth: "+8%"
    }
  },
  {
    id: "4",
    title: "Penjualan",
    icon: ShoppingCart,
    color: "warning",
    metrics: {
      total: stats.orders.total,
      pending: stats.orders.pending,
      delivered: stats.orders.delivered,
      growth: "+25%"
    }
  },
  {
    id: "5",
    title: "Logistik",
    icon: Truck,
    color: "chart-2",
    metrics: {
      total: logistics.length,
      inTransit: logistics.filter(l => l.status === "in_transit").length,
      delivered: logistics.filter(l => l.status === "delivered").length,
      growth: "+15%"
    }
  },
  {
    id: "6",
    title: "Keuangan",
    icon: DollarSign,
    color: "success",
    metrics: {
      revenue: `Rp ${(stats.orders.totalValue / 1000000000).toFixed(2)}M`,
      transactions: stats.transactions.total,
      completed: stats.transactions.completed,
      growth: "+32%"
    }
  },
  {
    id: "7",
    title: "Kualitas",
    icon: BarChart3,
    color: "info",
    metrics: {
      gradeA: `${Math.round((production.reduce((sum, p) => sum + p.quality.A, 0) / production.reduce((sum, p) => sum + p.quantity, 0)) * 100)}%`,
      gradeB: `${Math.round((production.reduce((sum, p) => sum + p.quality.B, 0) / production.reduce((sum, p) => sum + p.quantity, 0)) * 100)}%`,
      gradeC: `${Math.round((production.reduce((sum, p) => sum + p.quality.C, 0) / production.reduce((sum, p) => sum + p.quantity, 0)) * 100)}%`,
      growth: "+5%"
    }
  },
  {
    id: "8",
    title: "Performance",
    icon: TrendingUp,
    color: "primary",
    metrics: {
      efficiency: "87%",
      satisfaction: "4.6/5",
      onTime: "92%",
      growth: "+10%"
    }
  }
]

// Revenue trend data
const revenueTrend = [
  { month: "Jan", revenue: 450, orders: 45 },
  { month: "Feb", revenue: 520, orders: 52 },
  { month: "Mar", revenue: 680, orders: 68 },
]

// Product category distribution
const categoryDistribution = [
  { name: "Sayuran", value: products.filter(p => p.category === "sayuran").length, color: "var(--color-success)" },
  { name: "Buah", value: products.filter(p => p.category === "buah").length, color: "var(--color-info)" },
  { name: "Biji-bijian", value: products.filter(p => p.category === "biji-bijian").length, color: "var(--color-warning)" },
  { name: "Ternak", value: products.filter(p => p.category === "ternak").length, color: "var(--color-chart-2)" },
  { name: "Perikanan", value: products.filter(p => p.category === "perikanan").length, color: "var(--color-primary)" },
  { name: "Olahan", value: products.filter(p => p.category === "olahan").length, color: "var(--color-chart-3)" },
]

export default function CommandCenterPage() {
  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="mt-1 text-muted-foreground">
          Overview of your cooperative's key activities and performance
        </p>
      </div>

      {/* 8 Monitoring Areas Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {monitoringAreas.map((area) => {
          const Icon = area.icon
          return (
            <Card key={area.id} className={`border-${area.color}/30 bg-card`}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className={`rounded-lg bg-${area.color}/20 p-2`}>
                    <Icon className={`h-5 w-5 text-${area.color}`} />
                  </div>
                  <Badge variant="outline" className={`border-${area.color} text-${area.color}`}>
                    {area.metrics.growth}
                  </Badge>
                </div>
                <CardTitle className="text-lg text-card-foreground">{area.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(area.metrics).filter(([key]) => key !== "growth").map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between text-sm">
                      <span className="capitalize text-muted-foreground">{key}:</span>
                      <span className="font-semibold text-card-foreground">{value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue Trend */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-card-foreground">Revenue & Orders</CardTitle>
            <CardDescription>Sales performance over the last 3 months</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={revenueTrend}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" tick={{ fill: "var(--color-muted-foreground)" }} />
                <YAxis tick={{ fill: "var(--color-muted-foreground)" }} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="var(--color-primary)"
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-card-foreground">Product Categories</CardTitle>
            <CardDescription>Products by category</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <RechartsPie>
                <Pie
                  data={categoryDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }: any) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPie>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Alerts */}
      <Card className="border-warning/30 bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-card-foreground">
            <AlertTriangle className="h-5 w-5 text-warning" />
            Alerts & Notifications
          </CardTitle>
          <CardDescription>Important updates that need your attention</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3 rounded-lg bg-warning/10 p-3">
              <AlertTriangle className="h-5 w-5 text-warning" />
              <div className="flex-1">
                <p className="font-medium text-card-foreground">Low Stock: {stats.products.lowStock} products</p>
                <p className="text-sm text-muted-foreground">Restock needed soon</p>
              </div>
              <Badge variant="outline" className="border-warning text-warning">Urgent</Badge>
            </div>
            <div className="flex items-center gap-3 rounded-lg bg-info/10 p-3">
              <Activity className="h-5 w-5 text-info" />
              <div className="flex-1">
                <p className="font-medium text-card-foreground">Pending Orders: {stats.orders.pending} orders</p>
                <p className="text-sm text-muted-foreground">Waiting for confirmation</p>
              </div>
              <Badge variant="outline" className="border-info text-info">Info</Badge>
            </div>
            <div className="flex items-center gap-3 rounded-lg bg-success/10 p-3">
              <TrendingUp className="h-5 w-5 text-success" />
              <div className="flex-1">
                <p className="font-medium text-card-foreground">Sales Up 25%</p>
                <p className="text-sm text-muted-foreground">Compared to last month</p>
              </div>
              <Badge variant="outline" className="border-success text-success">Good</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
)
}
rd>
    </div>
  )
}
)
}
 )
}
)
}
