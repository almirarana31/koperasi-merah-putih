"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Download,
  Calendar,
  Package,
  ShoppingCart,
} from "lucide-react"

// Supply and Demand forecast data
const supplyDemandData = [
  {
    week: "Minggu 1",
    supply: 120,
    demand: 100,
    gap: 20,
    price: 45000,
  },
  {
    week: "Minggu 2",
    supply: 115,
    demand: 110,
    gap: 5,
    price: 46000,
  },
  {
    week: "Minggu 3",
    supply: 105,
    demand: 125,
    gap: -20,
    price: 52000,
  },
  {
    week: "Minggu 4",
    supply: 100,
    demand: 130,
    gap: -30,
    price: 55000,
  },
  {
    week: "Minggu 5",
    supply: 95,
    demand: 135,
    gap: -40,
    price: 58000,
  },
  {
    week: "Minggu 6",
    supply: 110,
    demand: 120,
    gap: -10,
    price: 53000,
  },
]

// Historical supply-demand balance
const historicalBalance = [
  { month: "Jan", supply: 450, demand: 420, balance: 30 },
  { month: "Feb", supply: 480, demand: 460, balance: 20 },
  { month: "Mar", supply: 420, demand: 480, balance: -60 },
  { month: "Apr", supply: 500, demand: 470, balance: 30 },
  { month: "Mei", supply: 460, demand: 520, balance: -60 },
  { month: "Jun", supply: 490, demand: 500, balance: -10 },
]

// Commodity-specific forecasts
const commodityForecasts = [
  {
    name: "Beras Grade A",
    currentSupply: 120,
    forecastDemand: 135,
    gap: -15,
    status: "shortage",
    action: "Tingkatkan produksi 15 ton",
    confidence: 87,
  },
  {
    name: "Cabai Merah",
    currentSupply: 25,
    forecastDemand: 22,
    gap: 3,
    status: "surplus",
    action: "Tahan stok, harga akan naik",
    confidence: 92,
  },
  {
    name: "Tomat",
    currentSupply: 18,
    forecastDemand: 15,
    gap: 3,
    status: "surplus",
    action: "Kurangi stok 20%",
    confidence: 78,
  },
  {
    name: "Wortel",
    currentSupply: 32,
    forecastDemand: 30,
    gap: 2,
    status: "balanced",
    action: "Pertahankan level saat ini",
    confidence: 85,
  },
  {
    name: "Jagung",
    currentSupply: 80,
    forecastDemand: 95,
    gap: -15,
    status: "shortage",
    action: "Order 20 ton dalam 2 minggu",
    confidence: 90,
  },
]

// Price impact analysis
const priceImpactData = [
  { scenario: "Surplus 20%", priceChange: -15, revenue: 85 },
  { scenario: "Surplus 10%", priceChange: -8, revenue: 92 },
  { scenario: "Balanced", priceChange: 0, revenue: 100 },
  { scenario: "Shortage 10%", priceChange: 12, revenue: 112 },
  { scenario: "Shortage 20%", priceChange: 25, revenue: 125 },
]

export default function SupplyDemandForecastPage() {
  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Forecast Supply & Demand</h1>
          <p className="mt-1 text-muted-foreground">
            Prediksi keseimbangan pasokan dan permintaan berbasis AI
          </p>
        </div>
        <div className="flex gap-2">
          <Select defaultValue="cabai">
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Pilih Komoditas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="cabai">Cabai Merah</SelectItem>
              <SelectItem value="beras">Beras Grade A</SelectItem>
              <SelectItem value="tomat">Tomat</SelectItem>
              <SelectItem value="wortel">Wortel</SelectItem>
              <SelectItem value="jagung">Jagung</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border bg-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Supply Saat Ini</p>
                <p className="text-2xl font-bold text-card-foreground">120 ton</p>
                <p className="text-xs text-muted-foreground mt-1">Cabai Merah</p>
              </div>
              <div className="rounded-full bg-blue-100 p-3">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Demand Forecast</p>
                <p className="text-2xl font-bold text-card-foreground">135 ton</p>
                <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" />
                  +12.5% vs bulan lalu
                </p>
              </div>
              <div className="rounded-full bg-emerald-100 p-3">
                <ShoppingCart className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Supply Gap</p>
                <p className="text-2xl font-bold text-amber-600">-15 ton</p>
                <p className="text-xs text-muted-foreground mt-1">Shortage predicted</p>
              </div>
              <div className="rounded-full bg-amber-100 p-3">
                <AlertTriangle className="h-6 w-6 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Confidence Score</p>
                <p className="text-2xl font-bold text-card-foreground">87%</p>
                <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                  <CheckCircle className="h-3 w-3" />
                  High accuracy
                </p>
              </div>
              <div className="rounded-full bg-green-100 p-3">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Supply vs Demand Forecast */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-card-foreground">Supply vs Demand Forecast (6 Minggu)</CardTitle>
            <CardDescription>Prediksi keseimbangan pasokan dan permintaan</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={supplyDemandData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="week" tick={{ fill: "#64748b" }} />
                <YAxis tick={{ fill: "#64748b" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="supply"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="Supply (ton)"
                  dot={{ fill: "#3b82f6", r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="demand"
                  stroke="#10b981"
                  strokeWidth={2}
                  name="Demand (ton)"
                  dot={{ fill: "#10b981", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle className="text-card-foreground">Supply-Demand Gap</CardTitle>
            <CardDescription>Selisih pasokan dan permintaan (positif = surplus, negatif = shortage)</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={supplyDemandData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="week" tick={{ fill: "#64748b" }} />
                <YAxis tick={{ fill: "#64748b" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    border: "1px solid #e2e8f0",
                    borderRadius: "8px",
                  }}
                />
                <Bar dataKey="gap" name="Gap (ton)" radius={[8, 8, 0, 0]}>
                  {supplyDemandData.map((entry, index) => (
                    <Bar
                      key={`bar-${index}`}
                      dataKey="gap"
                      fill={entry.gap >= 0 ? "#10b981" : "#ef4444"}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Historical Balance */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-card-foreground">Historical Supply-Demand Balance</CardTitle>
          <CardDescription>Tren keseimbangan 6 bulan terakhir</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={historicalBalance}>
              <defs>
                <linearGradient id="colorSupply" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorDemand" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="month" tick={{ fill: "#64748b" }} />
              <YAxis tick={{ fill: "#64748b" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Area
                type="monotone"
                dataKey="supply"
                stroke="#3b82f6"
                fillOpacity={1}
                fill="url(#colorSupply)"
                name="Supply (ton)"
              />
              <Area
                type="monotone"
                dataKey="demand"
                stroke="#10b981"
                fillOpacity={1}
                fill="url(#colorDemand)"
                name="Demand (ton)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Commodity-Specific Forecasts */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-card-foreground">Forecast per Komoditas</CardTitle>
          <CardDescription>Prediksi supply-demand untuk setiap komoditas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {commodityForecasts.map((commodity, index) => {
              const statusConfig = {
                shortage: {
                  color: "text-red-600",
                  bg: "bg-red-50",
                  badge: "bg-red-100 text-red-700",
                  icon: AlertTriangle,
                },
                surplus: {
                  color: "text-blue-600",
                  bg: "bg-blue-50",
                  badge: "bg-blue-100 text-blue-700",
                  icon: TrendingDown,
                },
                balanced: {
                  color: "text-green-600",
                  bg: "bg-green-50",
                  badge: "bg-green-100 text-green-700",
                  icon: CheckCircle,
                },
              }

              const config = statusConfig[commodity.status as keyof typeof statusConfig]
              const Icon = config.icon

              return (
                <div
                  key={index}
                  className={`rounded-lg border p-4 ${config.bg}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex gap-3 flex-1">
                      <div className={`shrink-0 mt-1 ${config.color}`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-semibold text-card-foreground">{commodity.name}</h4>
                          <Badge className={config.badge}>
                            {commodity.status === "shortage" && "Shortage"}
                            {commodity.status === "surplus" && "Surplus"}
                            {commodity.status === "balanced" && "Balanced"}
                          </Badge>
                        </div>
                        <div className="grid grid-cols-3 gap-4 text-sm mb-2">
                          <div>
                            <p className="text-muted-foreground">Supply</p>
                            <p className="font-medium text-card-foreground">{commodity.currentSupply} ton</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Demand Forecast</p>
                            <p className="font-medium text-card-foreground">{commodity.forecastDemand} ton</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Gap</p>
                            <p className={`font-medium ${commodity.gap >= 0 ? "text-blue-600" : "text-red-600"}`}>
                              {commodity.gap > 0 ? "+" : ""}{commodity.gap} ton
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-muted-foreground">
                            <strong>Rekomendasi:</strong> {commodity.action}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Confidence: {commodity.confidence}%
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Price Impact Analysis */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-card-foreground">Price Impact Analysis</CardTitle>
          <CardDescription>Dampak supply-demand terhadap harga dan revenue</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={priceImpactData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="scenario" tick={{ fill: "#64748b", fontSize: 12 }} />
              <YAxis tick={{ fill: "#64748b" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#ffffff",
                  border: "1px solid #e2e8f0",
                  borderRadius: "8px",
                }}
              />
              <Legend />
              <Bar dataKey="priceChange" fill="#f59e0b" name="Price Change (%)" radius={[8, 8, 0, 0]} />
              <Bar dataKey="revenue" fill="#10b981" name="Revenue Index" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* AI Insights */}
      <Card className="border-l-4 border-l-emerald-500 bg-emerald-50">
        <CardContent className="p-6">
          <div className="flex gap-4">
            <div className="shrink-0">
              <div className="rounded-full bg-emerald-100 p-3">
                <TrendingUp className="h-6 w-6 text-emerald-600" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-card-foreground mb-2">AI Insights & Recommendations</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>
                  ✓ <strong>Cabai Merah:</strong> Demand diprediksi naik 12.5% dalam 4 minggu. Shortage 15 ton akan terjadi minggu ke-4. 
                  Rekomendasi: Tingkatkan produksi atau order dari supplier eksternal.
                </p>
                <p>
                  ✓ <strong>Beras Grade A:</strong> Supply cukup untuk 3 minggu. Setelah itu, shortage 20 ton. 
                  Rekomendasi: Order 50 ton dalam 2 minggu untuk menghindari stockout.
                </p>
                <p>
                  ✓ <strong>Tomat:</strong> Surplus 3 ton diprediksi. Demand turun 12%. 
                  Rekomendasi: Kurangi stok 20% atau promosikan dengan diskon untuk percepat penjualan.
                </p>
                <p>
                  ✓ <strong>Price Opportunity:</strong> Shortage cabai merah akan mendorong harga naik 15-20%. 
                  Jika bisa secure supply sekarang, potensi profit tambahan Rp 7,000-10,000/kg.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
