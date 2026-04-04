"use client"

import {
  ArrowUpRight,
  Building2,
  Users,
  Wallet,
  AlertTriangle,
  TrendingUp,
  LineChart as LineChartIcon,
  ArrowRight,
  ChevronRight,
  CheckCircle2,
  ArrowDownRight,
  Info,
  Zap,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
  Cell,
  PieChart,
  Pie,
} from "recharts"
import Link from "next/link"
import { DashboardLinks } from "./dashboard-shared"

const kpiData = [
  {
    title: "Total Koperasi Terpantau",
    value: "1,248",
    change: "+12",
    trend: "up",
    icon: Building2,
    description: "Monitoring 1,248 desa di seluruh Indonesia",
    color: "text-blue-600",
    bg: "bg-blue-500/10",
  },
  {
    title: "Total Anggota Nasional",
    value: "842,500",
    change: "+3.2%",
    trend: "up",
    icon: Users,
    description: "Pertumbuhan anggota 3.2% (Q1 2026)",
    color: "text-emerald-600",
    bg: "bg-emerald-500/10",
  },
  {
    title: "Rata-rata Pendapatan Anggota",
    value: "Rp 5.2jt",
    change: "+Rp 450rb",
    trend: "up",
    icon: Wallet,
    description: "Target: Rp 6jt per anggota di Q4",
    color: "text-amber-600",
    bg: "bg-amber-500/10",
  },
  {
    title: "Tingkat NPL Nasional",
    value: "2.4%",
    change: "-0.2%",
    trend: "down",
    icon: TrendingUp,
    description: "Non-Performing Loan rata-rata seluruh koperasi",
    color: "text-purple-600",
    bg: "bg-purple-500/10",
  },
]

const alerts = [
  {
    id: 1,
    title: "Lonjakan NPL - Jawa Barat",
    desc: "Kenaikan NPL 0.8% di 12 koperasi wilayah Cianjur.",
    type: "critical",
    time: "2 jam lalu",
  },
  {
    id: 2,
    title: "Target Onboarding Tercapai",
    desc: "Provinsi Sulsel mencapai 100% target digitalisasi.",
    type: "success",
    time: "5 jam lalu",
  },
  {
    id: 3,
    title: "Audit Tertunda",
    desc: "24 koperasi belum mengunggah laporan tahunan (RAT).",
    type: "warning",
    time: "1 hari lalu",
  },
]

const productionData = [
  { month: "Jan", beras: 4500, jagung: 3200, cabai: 1200, anggota: 780000 },
  { month: "Feb", beras: 4800, jagung: 3400, cabai: 1350, anggota: 795000 },
  { month: "Mar", beras: 5200, jagung: 3800, cabai: 1500, anggota: 812000 },
  { month: "Apr", beras: 5100, jagung: 3600, cabai: 1400, anggota: 825000 },
  { month: "Mei", beras: 5600, jagung: 4200, cabai: 1800, anggota: 835000 },
  { month: "Jun", beras: 6000, jagung: 4500, cabai: 2100, anggota: 842500 },
]

const incomeData = [
  { name: "Kop. Sukatani", income: 5.8, npl: 1.2, anggota: 1240 },
  { name: "Kop. Merdeka", income: 5.2, npl: 2.1, anggota: 850 },
  { name: "Kop. Jaya", income: 4.9, npl: 3.5, anggota: 2100 },
  { name: "Kop. Makmur", income: 6.1, npl: 1.5, anggota: 1100 },
]

const demographicData = [
  { name: "Pemuda (18-35)", value: 35, color: "#3b82f6" },
  { name: "Dewasa (36-55)", value: 45, color: "#10b981" },
  { name: "Senior (>55)", value: 20, color: "#f59e0b" },
]

const distributionData = [
  { name: "Sangat Sehat", value: 450, color: "#10b981" },
  { name: "Sehat", value: 620, color: "#3b82f6" },
  { name: "Perlu Perhatian", value: 128, color: "#f59e0b" },
  { name: "Kritis", value: 50, color: "#ef4444" },
]

export function KementerianDashboard() {
  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between px-1">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-950 drop-shadow-sm">Executive Summary Nasional</h2>
          <p className="text-slate-700 text-sm font-semibold drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]">Monitoring 1,248 Desa & Analisis Performa Koperasi Real-Time.</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-background px-3 py-1 text-xs">
            Periode: Q1 2026
          </Badge>
          <Button size="sm" variant="outline" className="h-9 text-xs">
            Ekspor Laporan
          </Button>
        </div>
      </div>

      {/* KPI Grid - High Density */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {kpiData.map((kpi) => (
          <Card key={kpi.title} className="border-border/50 shadow-sm transition-all hover:shadow-md">
            <CardContent className="p-5">
              <div className="flex justify-between items-start">
                <div className={`p-2 rounded-xl ${kpi.bg} ${kpi.color}`}>
                  <kpi.icon className="h-5 w-5" />
                </div>
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-secondary/50 text-[10px] font-bold">
                  {kpi.trend === "up" ? (
                    <ArrowUpRight className="h-3 w-3 text-emerald-600" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 text-primary" />
                  )}
                  <span className={kpi.trend === "up" ? "text-emerald-600" : "text-primary"}>
                    {kpi.change}
                  </span>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wider drop-shadow-sm">{kpi.title}</p>
                <p className="text-3xl font-black mt-1 tracking-tight text-slate-950 drop-shadow-sm">{kpi.value}</p>
                <p className="mt-2 text-[11px] text-slate-700 leading-relaxed italic font-medium">{kpi.description}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Growth Chart - Anggota & Produksi */}
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-6">
            <div>
              <CardTitle className="text-lg">Pertumbuhan Anggota & Produksi</CardTitle>
              <CardDescription className="text-xs">Monitor peningkatan anggota nasional dan volume panen.</CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={productionData}>
                  <defs>
                    <linearGradient id="colorAnggota" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.15}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                  <XAxis dataKey="month" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis yAxisId="left" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value/1000}k`} />
                  <YAxis yAxisId="right" orientation="right" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `${value/1000} Ton`} />
                  <Tooltip />
                  <Legend />
                  <Area yAxisId="left" type="monotone" dataKey="anggota" name="Total Anggota" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorAnggota)" />
                  <Area yAxisId="right" type="monotone" dataKey="beras" name="Beras (Ton)" stroke="#3b82f6" strokeWidth={2} fillOpacity={0} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Early Warning System (Alerts) */}
        <Card className="border-border/50 shadow-sm flex flex-col">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">Early Warning System (EWS)</CardTitle>
              <Badge variant="destructive" className="h-5 px-1.5 text-[10px]">Anomali Terdeteksi</Badge>
            </div>
            <CardDescription className="text-xs">Deteksi dini NPL, penurunan anggota, dan anomali pasar.</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 space-y-3">
            {alerts.map((alert) => (
              <div key={alert.id} className="group relative flex flex-col gap-1 rounded-xl border border-border/50 bg-secondary/30 p-3.5 transition-colors hover:bg-secondary/50 shadow-sm">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {alert.type === "critical" ? (
                      <AlertTriangle className="h-4 w-4 text-primary" />
                    ) : alert.type === "warning" ? (
                      <Info className="h-4 w-4 text-amber-500" />
                    ) : (
                      <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    )}
                    <span className="text-sm font-bold tracking-tight text-slate-900">{alert.title}</span>
                  </div>
                  <span className="text-[10px] font-medium text-muted-foreground">{alert.time}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">{alert.desc}</p>
              </div>
            ))}
            <Button variant="ghost" className="w-full text-xs font-bold text-muted-foreground mt-2 shadow-sm border border-border/20">
              Lihat Detail Semua Desa →
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Income & NPL per Koperasi */}
        <Card className="border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Metrik Koperasi: Pendapatan & NPL</CardTitle>
            <CardDescription className="text-xs">Analisis pendapatan rata-rata anggota vs tingkat NPL per koperasi.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={incomeData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                  <XAxis dataKey="name" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="income" name="Pendapatan (Juta/Bulan)" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="npl" name="NPL (%)" fill="#be0817" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Demographic & Member Count per Desa */}
        <Card className="border-border/50 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Demografi & Kapasitas Desa</CardTitle>
            <CardDescription className="text-xs">Sebaran usia anggota dan catatan kapasitas anggota per desa.</CardDescription>
          </CardHeader>
          <CardContent className="grid sm:grid-cols-2 gap-4">
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={demographicData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={60}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {demographicData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap justify-center gap-2 mt-2">
                {demographicData.map((item) => (
                  <div key={item.name} className="flex items-center gap-1.5">
                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-[10px] font-bold text-muted-foreground">{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-3">
              <p className="text-xs font-bold text-muted-foreground uppercase">Anggota per Koperasi/Desa</p>
              {incomeData.map((item) => (
                <div key={item.name} className="flex items-center justify-between p-2 rounded-lg bg-secondary/20 shadow-sm border border-border/10">
                  <span className="text-xs font-bold">{item.name}</span>
                  <Badge variant="secondary" className="text-[10px] font-bold">{item.anggota} Jiwa</Badge>
                </div>
              ))}
              <Button variant="link" className="px-0 text-xs font-bold text-primary" asChild>
                <Link href="/anggota">Audit Seluruh Catatan Desa →</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Remove Logistic focus as per instructions */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Regional Performance - Horizontal Bars */}
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-base">Digitalisasi & Onboarding Desa</CardTitle>
            <CardDescription className="text-xs">Peningkatan penetrasi platform per wilayah.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { prov: "Sulawesi Selatan", progress: 100 },
              { prov: "Jawa Timur", progress: 85 },
              { prov: "Jawa Barat", progress: 72 },
              { prov: "Sumatera Utara", progress: 64 },
            ].map((item) => (
              <div key={item.prov} className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-900">{item.prov}</span>
                  <span className="text-slate-900">{item.progress}%</span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-secondary overflow-hidden shadow-inner">
                  <div 
                    className={`h-full rounded-full shadow-sm ${item.progress === 100 ? 'bg-emerald-500' : 'bg-primary'}`} 
                    style={{ width: `${item.progress}%` }} 
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Health Status - Pie Chart */}
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Status Kesehatan Koperasi Nasional</CardTitle>
            <CardDescription className="text-xs">Analisis finansial 1,248 unit koperasi.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-[180px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={distributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={75}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {distributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xl font-bold text-slate-950 drop-shadow-sm">1,248</span>
                <span className="text-[9px] uppercase text-muted-foreground font-bold drop-shadow-sm">Desa/Unit</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 mt-4">
              {distributionData.map((item) => (
                <div key={item.name} className="flex items-center gap-2 px-2 py-1.5 rounded-lg bg-secondary/40 shadow-sm border border-border/10">
                  <div className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-[10px] font-bold text-slate-700">{item.value} Unit</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <DashboardLinks />
    </div>
  )
}
