"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import {
  Download,
  FileText,
  TrendingUp,
  TrendingDown,
  Package,
  ShoppingCart,
  Truck,
  DollarSign,
  Users,
  AlertTriangle,
  CheckCircle,
  Activity,
  MapPin,
} from "lucide-react"
import { exportToPDF } from "@/lib/pdf-export"
import { toast } from "sonner"

// Production/Output data
const productionData = [
  { month: "Jan", beras: 120, sayur: 45, buah: 30 },
  { month: "Feb", beras: 135, sayur: 52, buah: 35 },
  { month: "Mar", beras: 150, sayur: 48, buah: 38 },
  { month: "Apr", beras: 145, sayur: 55, buah: 42 },
  { month: "Mei", beras: 160, sayur: 60, buah: 45 },
  { month: "Jun", beras: 155, sayur: 58, buah: 48 },
]

// Warehouse Inventory
const inventoryData = [
  { name: "Beras Grade A", value: 30, color: "#10b981" },
  { name: "Sayuran", value: 23, color: "#3b82f6" },
  { name: "Buah-buahan", value: 15, color: "#f59e0b" },
  { name: "Jagung", value: 20, color: "#8b5cf6" },
  { name: "Lainnya", value: 12, color: "#06b6d4" },
]

// Sales trend
const salesData = [
  { week: "W1", revenue: 125, target: 120 },
  { week: "W2", revenue: 145, target: 130 },
  { week: "W3", revenue: 135, target: 140 },
  { week: "W4", revenue: 165, target: 150 },
  { week: "W5", revenue: 180, target: 160 },
  { week: "W6", revenue: 195, target: 170 },
]

// Cashflow data
const cashflowSummary = {
  inflow: 538090000,
  outflow: 126870000,
  net: 411220000,
  trend: "up",
}

// Member performance
const memberPerformance = [
  { name: "Pak Budi", score: 470, rating: 95 },
  { name: "Ibu Siti", score: 445, rating: 89 },
  { name: "Pak Ahmad", score: 420, rating: 84 },
  { name: "Ibu Ani", score: 395, rating: 79 },
  { name: "Pak Joko", score: 332, rating: 66 },
]

// Commodity performance heatmap
const commodityPerformance = [
  { name: "Beras", quality: 100, demand: 95, margin: 85 },
  { name: "Cabai", quality: 92, demand: 88, margin: 95 },
  { name: "Tomat", quality: 85, demand: 75, margin: 70 },
  { name: "Wortel", quality: 88, demand: 82, margin: 78 },
  { name: "Jagung", quality: 78, demand: 85, margin: 72 },
]

// Risk matrix
const riskData = [
  { category: "Stok Menipis", level: "high", items: 3, impact: "Rp 45M" },
  { category: "Harga Volatil", level: "medium", items: 5, impact: "Rp 28M" },
  { category: "Kualitas Turun", level: "low", items: 2, impact: "Rp 12M" },
  { category: "Logistik Delay", level: "medium", items: 4, impact: "Rp 18M" },
]

// Indonesia map regions (simplified)
const logisticsRegions = [
  { region: "Jawa Barat", deliveries: 45, status: "on-time", percentage: 95 },
  { region: "Jawa Tengah", deliveries: 32, status: "on-time", percentage: 88 },
  { region: "Jawa Timur", deliveries: 38, status: "delayed", percentage: 75 },
  { region: "Bali", deliveries: 15, status: "on-time", percentage: 92 },
  { region: "Sumatra", deliveries: 22, status: "delayed", percentage: 70 },
]

const initialLogs = [
  { time: "14:20:05", role: "SYSADMIN", action: "Database scaling event", status: "success" },
  { time: "14:18:22", role: "KEMENTERIAN", action: "NPL Audit: Koperasi Maju Jaya", status: "warning" },
  { time: "14:15:10", role: "BANK", action: "Credit Scoring generated (Batch 42)", status: "success" },
  { time: "14:10:45", role: "KASIR", action: "Large transaction alert (>Rp 100M)", status: "info" },
]

export default function ExecutiveCommandCenterPage() {
  const [exportTarget, setExportTarget] = useState<"koperasi" | "pemda" | "bank">("koperasi")
  const [activeView, setActiveView] = useState<"war-room" | "monitoring" | "audit">("war-room")
  const [isExporting, setIsExporting] = useState(false)
  const [logs, setLogs] = useState(initialLogs)

  useEffect(() => {
    const actions = [
      { role: "PETANI", action: "Harvest report uploaded (Lahan A1)", status: "success" },
      { role: "LOGISTIK", action: "Delivery route optimized (Route 4)", status: "success" },
      { role: "KASIR", action: "End-of-shift report generated", status: "success" },
      { role: "KETUA", action: "New loan policy approved", status: "info" },
      { role: "BANK", action: "NPL Alert: Sudden increase (Bali Region)", status: "warning" },
      { role: "PEMDA", action: "Production data requested for Q2", status: "info" }
    ]

    const intervalId = setInterval(() => {
      const randomAction = actions[Math.floor(Math.random() * actions.length)]
      const newLog = {
        time: new Date().toLocaleTimeString("id-ID"),
        ...randomAction
      }
      setLogs(prev => [newLog, ...prev].slice(0, 15))
    }, 5000)

    return () => clearInterval(intervalId)
  }, [])

  const handleExportPDF = async () => {
    setIsExporting(true)
    toast.info(`Menyiapkan export PDF untuk ${exportTarget.toUpperCase()}...`)
    
    const result = await exportToPDF({
      title: `Executive Report - ${exportTarget.toUpperCase()}`,
      subtitle: `Generated for Command Center Visibility Hub`,
      data: riskData.map(r => ({
        Kategori: r.category,
        Level: r.level.toUpperCase(),
        Terpengaruh: `${r.items} Items`,
        Dampak: r.impact
      })),
      filename: `KOPDES_Executive_Report_${exportTarget}_${new Date().getTime()}.pdf`
    })

    if (result.success) {
      toast.success("PDF berhasil diexport!")
    } else {
      toast.error(`Gagal export PDF: ${result.error}`)
    }
    setIsExporting(false)
  }

  const handleExportExcel = () => {
    toast.success(`Data ${exportTarget.toUpperCase()} berhasil diexport ke Excel!`)
  }

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Activity className="h-8 w-8 text-emerald-600" />
            Pusat Kendali Eksekutif
          </h1>
          <p className="mt-1 text-muted-foreground">
            Real-time visibility hub untuk pengambilan keputusan berbasis data
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={activeView} onValueChange={(value: any) => setActiveView(value)}>
            <SelectTrigger className="w-40 border-slate-200">
              <SelectValue placeholder="Mode Tampilan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="war-room">War Room (Live)</SelectItem>
              <SelectItem value="monitoring">Monitoring Unit</SelectItem>
              <SelectItem value="audit">Jejak Audit</SelectItem>
            </SelectContent>
          </Select>
          <Select value={exportTarget} onValueChange={(value: any) => setExportTarget(value)}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Export untuk..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="koperasi">Koperasi (Internal)</SelectItem>
              <SelectItem value="pemda">Pemda (Pemerintah)</SelectItem>
              <SelectItem value="bank">Bank/Kementerian</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleExportPDF} variant="outline" disabled={isExporting}>
            <FileText className="h-4 w-4 mr-2" />
            {isExporting ? "Exporting..." : "Export PDF"}
          </Button>
          <Button onClick={handleExportExcel} className="bg-emerald-600 hover:bg-emerald-700">
            <Download className="h-4 w-4 mr-2" />
            Export Excel
          </Button>
        </div>
      </div>

      {/* Real-time Status Banner */}
      <Card className="border-l-4 border-l-emerald-500 bg-gradient-to-r from-emerald-50 to-white">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 bg-emerald-500 rounded-full animate-pulse"></div>
                <span className="font-semibold text-card-foreground">Live Data</span>
              </div>
              <span className="text-sm text-muted-foreground">
                Last updated: {new Date().toLocaleTimeString("id-ID")}
              </span>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>8/8 Panels Active</span>
              </div>
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-blue-600" />
                <span>Real-time Sync</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[1fr_350px]">
        <div className="space-y-6">
          {/* Panel 1 & 2: Production and Inventory */}
          <div className="grid gap-6 lg:grid-cols-2">
        {/* Production/Output */}
        <Card className="border-border bg-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-card-foreground flex items-center gap-2">
                  <Package className="h-5 w-5 text-emerald-600" />
                  Produksi/Output
                </CardTitle>
                <CardDescription>Volume produksi per komoditas (ton)</CardDescription>
              </div>
              <Badge className="bg-emerald-100 text-emerald-700">+12% vs bulan lalu</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={productionData}>
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
                <Bar dataKey="beras" fill="#10b981" name="Beras (ton)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="sayur" fill="#3b82f6" name="Sayur (ton)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="buah" fill="#f59e0b" name="Buah (ton)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Warehouse Inventory */}
        <Card className="border-border bg-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-card-foreground flex items-center gap-2">
                  <Package className="h-5 w-5 text-blue-600" />
                  Stok Gudang
                </CardTitle>
                <CardDescription>Distribusi inventory berdasarkan kategori</CardDescription>
              </div>
              <Badge className="bg-blue-100 text-blue-700">Total: 450 ton</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={inventoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {inventoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Panel 3 & 4: Sales and Logistics */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Sales Trend */}
        <Card className="border-border bg-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-card-foreground flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5 text-purple-600" />
                  Penjualan
                </CardTitle>
                <CardDescription>Tren revenue vs target (juta Rp)</CardDescription>
              </div>
              <Badge className="bg-green-100 text-green-700">
                <TrendingUp className="h-3 w-3 mr-1" />
                +18% growth
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={salesData}>
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
                  dataKey="revenue"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  name="Revenue Aktual"
                  dot={{ fill: "#8b5cf6", r: 4 }}
                />
                <Line
                  type="monotone"
                  dataKey="target"
                  stroke="#94a3b8"
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  name="Target"
                  dot={{ fill: "#94a3b8", r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Logistics Map */}
        <Card className="border-border bg-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-card-foreground flex items-center gap-2">
                  <Truck className="h-5 w-5 text-orange-600" />
                  Logistik & Distribusi
                </CardTitle>
                <CardDescription>Status pengiriman per wilayah</CardDescription>
              </div>
              <Badge className="bg-orange-100 text-orange-700">152 deliveries</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {logisticsRegions.map((region, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                  <MapPin className={`h-5 w-5 ${region.status === "on-time" ? "text-green-600" : "text-amber-600"}`} />
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm text-card-foreground">{region.region}</span>
                      <Badge
                        variant={region.status === "on-time" ? "default" : "secondary"}
                        className={region.status === "on-time" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}
                      >
                        {region.status === "on-time" ? "On Time" : "Delayed"}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{region.deliveries} pengiriman</span>
                      <span>•</span>
                      <span>{region.percentage}% success rate</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Panel 5: Cashflow */}
      <Card className="border-border bg-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-card-foreground flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                Cashflow
              </CardTitle>
              <CardDescription>Ringkasan arus kas koperasi</CardDescription>
            </div>
            <Badge className="bg-green-100 text-green-700">
              <TrendingUp className="h-3 w-3 mr-1" />
              Healthy
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="rounded-lg border border-green-200 bg-green-50 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-muted-foreground">Cash Inflow</span>
                <TrendingUp className="h-4 w-4 text-green-600" />
              </div>
              <p className="text-2xl font-bold text-green-700">
                Rp {(cashflowSummary.inflow / 1000000).toFixed(1)}M
              </p>
              <p className="text-xs text-muted-foreground mt-1">Penerimaan bulan ini</p>
            </div>
            <div className="rounded-lg border border-red-200 bg-red-50 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-muted-foreground">Cash Outflow</span>
                <TrendingDown className="h-4 w-4 text-red-600" />
              </div>
              <p className="text-2xl font-bold text-red-700">
                -Rp {(cashflowSummary.outflow / 1000000).toFixed(1)}M
              </p>
              <p className="text-xs text-muted-foreground mt-1">Pengeluaran bulan ini</p>
            </div>
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-muted-foreground">Net Cash Position</span>
                <CheckCircle className="h-4 w-4 text-emerald-600" />
              </div>
              <p className="text-2xl font-bold text-emerald-700">
                Rp {(cashflowSummary.net / 1000000).toFixed(1)}M
              </p>
              <p className="text-xs text-muted-foreground mt-1">Saldo bersih</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Panel 6 & 7: Member and Commodity Performance */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Member Performance */}
        <Card className="border-border bg-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-card-foreground flex items-center gap-2">
                  <Users className="h-5 w-5 text-indigo-600" />
                  Performa Anggota
                </CardTitle>
                <CardDescription>Top 5 anggota berdasarkan engagement & performance</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {memberPerformance.map((member, index) => (
                <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50">
                  <div className="flex items-center justify-center h-8 w-8 rounded-full bg-indigo-100 text-indigo-600 font-bold text-sm">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-sm text-card-foreground">{member.name}</span>
                      <Badge className="bg-indigo-100 text-indigo-700">{member.rating}%</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-secondary rounded-full h-2">
                        <div
                          className="bg-indigo-600 h-2 rounded-full"
                          style={{ width: `${member.rating}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-muted-foreground">{member.score} pts</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Commodity Performance Heatmap */}
        <Card className="border-border bg-card">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-card-foreground flex items-center gap-2">
                  <Activity className="h-5 w-5 text-cyan-600" />
                  Performa Komoditas
                </CardTitle>
                <CardDescription>Skor kualitas, demand, dan margin per komoditas</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {commodityPerformance.map((commodity, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-sm text-card-foreground">{commodity.name}</span>
                    <span className="text-xs text-muted-foreground">
                      Avg: {Math.round((commodity.quality + commodity.demand + commodity.margin) / 3)}%
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Quality</div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-secondary rounded-full h-2">
                          <div
                            className="bg-green-600 h-2 rounded-full"
                            style={{ width: `${commodity.quality}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-medium">{commodity.quality}%</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Demand</div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-secondary rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${commodity.demand}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-medium">{commodity.demand}%</span>
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground mb-1">Margin</div>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-secondary rounded-full h-2">
                          <div
                            className="bg-amber-600 h-2 rounded-full"
                            style={{ width: `${commodity.margin}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-medium">{commodity.margin}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Panel 8: Risk Matrix */}
      <Card className="border-border bg-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-card-foreground flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                Risiko
              </CardTitle>
              <CardDescription>Identifikasi risiko operasional dan dampaknya</CardDescription>
            </div>
            <Badge variant="destructive">3 High Priority</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            {riskData.map((risk, index) => {
              const levelConfig = {
                high: { color: "text-red-600", bg: "bg-red-50", border: "border-red-200" },
                medium: { color: "text-amber-600", bg: "bg-amber-50", border: "border-amber-200" },
                low: { color: "text-blue-600", bg: "bg-blue-50", border: "border-blue-200" },
              }
              const config = levelConfig[risk.level as keyof typeof levelConfig]

              return (
                <div
                  key={index}
                  className={`rounded-lg border p-4 ${config.bg} ${config.border}`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className={`h-5 w-5 ${config.color}`} />
                      <h4 className="font-semibold text-card-foreground">{risk.category}</h4>
                    </div>
                    <Badge
                      variant={risk.level === "high" ? "destructive" : "secondary"}
                      className={risk.level === "high" ? "" : risk.level === "medium" ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"}
                    >
                      {risk.level.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{risk.items} items affected</span>
                    <span className={`font-medium ${config.color}`}>Impact: {risk.impact}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
      </div>

      {/* War Room Side Panel (Conditional) */}
      <div className="space-y-6">
        <Card className="border-slate-900 bg-slate-950 text-white overflow-hidden shadow-2xl">
          <CardHeader className="p-4 border-b border-slate-800 bg-slate-900">
            <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
              <Activity className="h-4 w-4 text-emerald-500" /> Live Audit Log
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-800">
              {logs.map((log, i) => (
                <div key={i} className="p-4 hover:bg-slate-900 transition-colors">
                  <div className="flex items-center justify-between mb-1">
                    <Badge className={`text-[8px] font-black uppercase h-4 px-1 ${
                      log.status === 'success' ? 'bg-emerald-900 text-emerald-400 border-emerald-800' :
                      log.status === 'warning' ? 'bg-amber-900 text-amber-400 border-amber-800' :
                      'bg-slate-800 text-slate-400 border-slate-700'
                    }`}>
                      {log.status}
                    </Badge>
                    <span className="text-[9px] font-mono text-slate-500">{log.time}</span>
                  </div>
                  <p className="text-[10px] font-black text-slate-300 uppercase leading-tight">{log.action}</p>
                  <p className="text-[9px] font-bold text-slate-500 mt-1">BY: {log.role}</p>
                </div>
              ))}
            </div>
          </CardContent>
          <div className="p-3 bg-slate-900 border-t border-slate-800">
            <Button variant="ghost" className="w-full text-[9px] font-black text-slate-400 hover:text-white uppercase tracking-widest">
              View All Logs →
            </Button>
          </div>
        </Card>

        <Card className="border-slate-200 bg-white shadow-sm overflow-hidden">
          <CardHeader className="p-4 border-b border-slate-100 flex flex-row items-center justify-between space-y-0 bg-slate-50/50">
            <CardTitle className="text-[10px] font-black uppercase tracking-[0.1em] text-slate-500">
              Health Check
            </CardTitle>
            <Badge className="bg-emerald-100 text-emerald-700 font-black text-[9px]">99.9% UP</Badge>
          </CardHeader>
          <CardContent className="p-4 space-y-3">
            {[
              { label: 'Blockchain Sync', status: 'Healthy', val: '100%' },
              { label: 'AI Core Engine', status: 'Optimal', val: '42ms' },
              { label: 'User Sessions', status: 'Active', val: '2,842' },
            ].map((s, i) => (
              <div key={i} className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-600 uppercase">{s.label}</span>
                <span className="text-[10px] font-black text-slate-900">{s.val}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
  )
}
