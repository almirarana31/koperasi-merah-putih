"use client"

import { useState, useMemo } from 'react'
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
  BrainCircuit,
  Globe,
  ArrowUpRight,
  Zap,
} from "lucide-react"
import { KementerianFilterBar, type ScopeFilters } from '@/components/dashboard/kementerian-filter-bar'
import { Progress } from '@/components/ui/progress'

// Supply and Demand forecast data
const supplyDemandData = [
  { week: "Week 1", supply: 120, demand: 100, gap: 20, price: 45000 },
  { week: "Week 2", supply: 115, demand: 110, gap: 5, price: 46000 },
  { week: "Week 3", supply: 105, demand: 125, gap: -20, price: 52000 },
  { week: "Week 4", supply: 100, demand: 130, gap: -30, price: 55000 },
  { week: "Week 5", supply: 95, demand: 135, gap: -40, price: 58000 },
  { week: "Week 6", supply: 110, demand: 120, gap: -10, price: 53000 },
]

// Historical supply-demand balance
const historicalBalance = [
  { month: "Jan", supply: 450, demand: 420, balance: 30 },
  { month: "Feb", supply: 480, demand: 460, balance: 20 },
  { month: "Mar", supply: 420, demand: 480, balance: -60 },
  { month: "Apr", supply: 500, demand: 470, balance: 30 },
  { month: "May", supply: 460, demand: 520, balance: -60 },
  { month: "Jun", supply: 490, demand: 500, balance: -10 },
]

// Commodity-specific forecasts
const commodityForecasts = [
  { name: "Beras Grade A", currentSupply: 120, forecastDemand: 135, gap: -15, status: "shortage", action: "Increase regional allocation by 15 tons", confidence: 87 },
  { name: "Cabai Merah", currentSupply: 25, forecastDemand: 22, gap: 3, status: "surplus", action: "Redirect surplus to deficit regions", confidence: 92 },
  { name: "Tomat", currentSupply: 18, forecastDemand: 15, gap: 3, status: "surplus", action: "Incentivize local retail distribution", confidence: 78 },
  { name: "Wortel", currentSupply: 32, forecastDemand: 30, gap: 2, status: "balanced", action: "Maintain current supply levels", confidence: 85 },
  { name: "Jagung", currentSupply: 80, forecastDemand: 95, gap: -15, status: "shortage", action: "Trigger strategic reserve release", confidence: 90 },
]

// Price impact analysis
const priceImpactData = [
  { scenario: "Surplus 20%", priceChange: -15, revenue: 85 },
  { scenario: "Surplus 10%", priceChange: -8, revenue: 92 },
  { scenario: "Balanced", priceChange: 0, revenue: 100 },
  { scenario: "Shortage 10%", priceChange: 12, revenue: 112 },
  { scenario: "Shortage 20%", priceChange: 25, revenue: 125 },
]

export default function SupplyDemandForecastKementerianPage() {
  const [filters, setFilters] = useState<ScopeFilters>({
    province: 'all',
    regency: 'all',
    village: 'all',
    cooperative: 'all',
  })

  const processedData = useMemo(() => {
    let scaleFactor = 1.0
    if (filters.cooperative !== 'all') scaleFactor = 0.08
    else if (filters.regency !== 'all') scaleFactor = 0.22
    else if (filters.province !== 'all') scaleFactor = 0.45

    return {
      supplyDemand: supplyDemandData.map(d => ({
        ...d,
        supply: d.supply * scaleFactor,
        demand: d.demand * scaleFactor,
        gap: (d.supply - d.demand) * scaleFactor,
      })),
      historical: historicalBalance.map(d => ({
        ...d,
        supply: d.supply * scaleFactor,
        demand: d.demand * scaleFactor,
        balance: (d.supply - d.demand) * scaleFactor,
      })),
      commodities: commodityForecasts.map(c => ({
        ...c,
        currentSupply: c.currentSupply * scaleFactor,
        forecastDemand: c.forecastDemand * scaleFactor,
        gap: (c.currentSupply - c.forecastDemand) * scaleFactor,
      }))
    }
  }, [filters])

  return (
    <div className="flex flex-col gap-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tighter text-slate-900 uppercase flex items-center gap-2">
              <BrainCircuit className="h-8 w-8 text-slate-900" />
              Supply & Demand Intelligence
            </h1>
            <p className="text-slate-500 font-medium">
              Analisis prediktif neraca pangan nasional berbasis Machine Learning.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="font-bold border-2">
              <Download className="mr-2 h-4 w-4" /> EXPORT DATA
            </Button>
            <Button className="bg-slate-900 font-bold">
              <Zap className="mr-2 h-4 w-4" /> RECALCULATE AI
            </Button>
          </div>
        </div>

        <KementerianFilterBar onFilterChange={setFilters} />
      </div>

      {/* KPI Section */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-l-4 border-l-slate-900 shadow-sm">
          <CardHeader className="pb-2">
            <CardDescription className="text-[10px] font-black uppercase tracking-widest text-slate-500">Aggregate Supply</CardDescription>
            <CardTitle className="text-2xl font-black text-slate-900">
              {processedData.supplyDemand[0].supply.toFixed(1)} <span className="text-sm font-bold text-slate-400">TONS</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1 text-[10px] font-black text-slate-500 uppercase">
              <Package className="h-3 w-3" /> Real-time Inventory
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-500 shadow-sm">
          <CardHeader className="pb-2">
            <CardDescription className="text-[10px] font-black uppercase tracking-widest text-slate-500">Forecast Demand</CardDescription>
            <CardTitle className="text-2xl font-black text-slate-900">
              {processedData.supplyDemand[0].demand.toFixed(1)} <span className="text-sm font-bold text-slate-400">TONS</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1 text-[10px] font-black text-emerald-600 uppercase">
              <TrendingUp className="h-3 w-3" /> +12.5% Next Month
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-rose-500 shadow-sm">
          <CardHeader className="pb-2">
            <CardDescription className="text-[10px] font-black uppercase tracking-widest text-slate-500">Predicted Gap</CardDescription>
            <CardTitle className="text-2xl font-black text-rose-600">
              {processedData.supplyDemand[4].gap.toFixed(1)} <span className="text-sm font-bold text-slate-400">TONS</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1 text-[10px] font-black text-rose-600 uppercase">
              <AlertTriangle className="h-3 w-3" /> Shortage Warning
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500 shadow-sm">
          <CardHeader className="pb-2">
            <CardDescription className="text-[10px] font-black uppercase tracking-widest text-slate-500">AI Confidence</CardDescription>
            <CardTitle className="text-2xl font-black text-slate-900">92%</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1 text-[10px] font-black text-emerald-600 uppercase">
              <CheckCircle className="h-3 w-3" /> High Reliability
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Charts Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-2 shadow-sm">
          <CardHeader className="border-b bg-slate-50/50">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-sm font-black uppercase tracking-tighter text-slate-900">Supply vs Demand Forecast</CardTitle>
                <CardDescription className="text-[10px] font-bold uppercase text-slate-500">Predicted balance over 6 weeks</CardDescription>
              </div>
              <Select defaultValue="cabai">
                <SelectTrigger className="w-[150px] h-8 text-[10px] font-black uppercase border-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cabai">Cabai Merah</SelectItem>
                  <SelectItem value="beras">Beras Grade A</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={processedData.supplyDemand}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="week" tick={{ fill: "#64748b", fontSize: 10, fontWeight: 800 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#64748b", fontSize: 10, fontWeight: 800 }} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#0f172a", border: "none", borderRadius: "8px", color: "#fff" }}
                  itemStyle={{ fontSize: "10px", fontWeight: "900", textTransform: "uppercase" }}
                />
                <Legend iconType="rect" wrapperStyle={{ paddingTop: "20px", fontSize: "10px", fontWeight: "900", textTransform: "uppercase" }} />
                <Line type="monotone" dataKey="supply" stroke="#0f172a" strokeWidth={3} dot={{ r: 4, fill: "#0f172a" }} name="SUPPLY (TON)" />
                <Line type="monotone" dataKey="demand" stroke="#10b981" strokeWidth={3} dot={{ r: 4, fill: "#10b981" }} name="DEMAND (TON)" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-2 shadow-sm">
          <CardHeader className="border-b bg-slate-50/50">
            <CardTitle className="text-sm font-black uppercase tracking-tighter text-slate-900">Supply-Demand Variance</CardTitle>
            <CardDescription className="text-[10px] font-bold uppercase text-slate-500">Net balance surplus / deficit</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={processedData.supplyDemand}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="week" tick={{ fill: "#64748b", fontSize: 10, fontWeight: 800 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#64748b", fontSize: 10, fontWeight: 800 }} axisLine={false} tickLine={false} />
                <Tooltip 
                   contentStyle={{ backgroundColor: "#0f172a", border: "none", borderRadius: "8px", color: "#fff" }}
                   itemStyle={{ fontSize: "10px", fontWeight: "900", textTransform: "uppercase" }}
                />
                <Bar dataKey="gap" radius={[4, 4, 0, 0]}>
                  {processedData.supplyDemand.map((entry, index) => (
                    <Bar key={`bar-${index}`} dataKey="gap" fill={entry.gap >= 0 ? "#10b981" : "#f43f5e"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Commodity-Specific Table Section */}
      <Card className="border-2 shadow-sm overflow-hidden">
        <CardHeader className="border-b bg-slate-50/50">
          <CardTitle className="text-sm font-black uppercase tracking-tighter text-slate-900">Strategic Commodity Forecasts</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100/50 border-b">
                  <th className="p-4 text-[10px] font-black uppercase text-slate-500">Commodity</th>
                  <th className="p-4 text-[10px] font-black uppercase text-slate-500">Supply</th>
                  <th className="p-4 text-[10px] font-black uppercase text-slate-500">Demand</th>
                  <th className="p-4 text-[10px] font-black uppercase text-slate-500">Net Gap</th>
                  <th className="p-4 text-[10px] font-black uppercase text-slate-500">Status</th>
                  <th className="p-4 text-[10px] font-black uppercase text-slate-500">AI Recommendation</th>
                  <th className="p-4 text-[10px] font-black uppercase text-slate-500 text-right">Confidence</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {processedData.commodities.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <p className="text-xs font-black text-slate-900 uppercase">{item.name}</p>
                    </td>
                    <td className="p-4 text-xs font-bold text-slate-700">{item.currentSupply.toFixed(1)}T</td>
                    <td className="p-4 text-xs font-bold text-slate-700">{item.forecastDemand.toFixed(1)}T</td>
                    <td className="p-4 text-xs font-black">
                      <span className={item.gap >= 0 ? 'text-emerald-600' : 'text-rose-600'}>
                        {item.gap > 0 ? '+' : ''}{item.gap.toFixed(1)}T
                      </span>
                    </td>
                    <td className="p-4">
                      <Badge className={`text-[9px] font-black uppercase ${
                        item.status === 'shortage' ? 'bg-rose-500' : 
                        item.status === 'surplus' ? 'bg-blue-500' : 'bg-emerald-500'
                      }`}>
                        {item.status}
                      </Badge>
                    </td>
                    <td className="p-4 text-xs font-bold text-slate-600 italic">
                      "{item.action}"
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-xs font-black text-slate-900">{item.confidence}%</span>
                        <Progress value={item.confidence} className="h-1 w-16" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Footer AI Insights */}
      <Card className="border-2 border-slate-900 bg-slate-900 text-white overflow-hidden">
        <div className="flex">
          <div className="p-6 bg-emerald-500 flex items-center justify-center">
            <BrainCircuit className="h-12 w-12 text-slate-900" />
          </div>
          <div className="p-6 flex-1 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black uppercase tracking-tighter">AI National Intelligence Insights</h3>
              <Badge className="bg-white text-slate-900 font-black">SYSTEM HEALTH: OPTIMAL</Badge>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-3 bg-slate-800 rounded border border-slate-700">
                <p className="text-[10px] font-black text-emerald-400 uppercase mb-1">Surplus Opportunity</p>
                <p className="text-xs font-medium text-slate-300">
                  Detected surplus in <span className="text-white font-bold">Tomat</span> production. AI recommends immediate redirection to Central Logistics Hub for cold storage preservation.
                </p>
              </div>
              <div className="p-3 bg-slate-800 rounded border border-slate-700">
                <p className="text-[10px] font-black text-rose-400 uppercase mb-1">Strategic Threat</p>
                <p className="text-xs font-medium text-slate-300">
                  <span className="text-white font-bold">Cabai Merah</span> shortage predicted in 4 weeks. Price volatility index likely to hit +20%. Triggering early contract settlements.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
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
