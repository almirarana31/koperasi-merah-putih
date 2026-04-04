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

      <div className="grid gap-4 lg:grid-cols-3">
        {/* KPI Row - Main Aggregates */}
        <div className="lg:col-span-2 grid gap-4 sm:grid-cols-2">
          {kpiData.slice(0, 2).map((kpi) => (
            <Card key={kpi.title} className="border-border/50 shadow-sm transition-all hover:shadow-md bg-white">
              <CardContent className="p-5 flex items-center gap-4">
                <div className={`p-3 rounded-2xl ${kpi.bg} ${kpi.color}`}>
                  <kpi.icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{kpi.title}</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-3xl font-black text-slate-950 tracking-tight">{kpi.value}</p>
                    <span className={`text-[10px] font-bold ${kpi.trend === "up" ? "text-emerald-600" : "text-primary"}`}>
                      {kpi.change}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          {kpiData.slice(2, 4).map((kpi) => (
            <Card key={kpi.title} className="border-border/50 shadow-sm transition-all hover:shadow-md bg-white">
              <CardContent className="p-5 flex items-center gap-4">
                <div className={`p-3 rounded-2xl ${kpi.bg} ${kpi.color}`}>
                  <kpi.icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{kpi.title}</p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-3xl font-black text-slate-950 tracking-tight">{kpi.value}</p>
                    <span className={`text-[10px] font-bold ${kpi.trend === "up" ? "text-emerald-600" : "text-primary"}`}>
                      {kpi.change}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Summary / Pulse */}
        <Card className="border-primary/20 bg-primary/5 shadow-inner">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-black text-primary uppercase tracking-widest flex items-center gap-2">
              <Zap className="h-4 w-4 fill-primary" /> Status Platform
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="font-bold text-slate-600">Onboarding Rate</span>
              <span className="font-black text-slate-900">92%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
              <div className="h-full bg-primary w-[92%] rounded-full shadow-[0_0_8px_rgba(190,8,23,0.4)]" />
            </div>
            <p className="text-[10px] text-slate-500 leading-tight">Sinkronisasi data desa berjalan optimal. Tidak ada hambatan infrastruktur di 1,248 titik.</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-12 lg:items-stretch">
        {/* Main Production Chart - 8 Cols */}
        <Card className="lg:col-span-8 border-border/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div>
              <CardTitle className="text-lg font-black text-slate-900">Trend Nasional: Anggota & Produksi</CardTitle>
              <CardDescription className="text-[10px] font-semibold">Volume agregat dari seluruh koperasi terdaftar.</CardDescription>
            </div>
            <div className="flex gap-3">
               <div className="flex items-center gap-1.5 text-[10px] font-black uppercase text-emerald-600">
                 <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]" /> Anggota
               </div>
               <div className="flex items-center gap-1.5 text-[10px] font-black uppercase text-blue-600">
                 <div className="h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_5px_rgba(59,130,246,0.5)]" /> Beras
               </div>
            </div>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={productionData}>
                  <defs>
                    <linearGradient id="colorAnggota" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                  <XAxis dataKey="month" fontSize={10} tickLine={false} axisLine={false} fontWeights="900" />
                  <YAxis yAxisId="left" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v) => `${v/1000}k`} />
                  <YAxis yAxisId="right" orientation="right" fontSize={10} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }} />
                  <Area yAxisId="left" type="monotone" dataKey="anggota" stroke="#10b981" strokeWidth={3} fill="url(#colorAnggota)" />
                  <Area yAxisId="right" type="monotone" dataKey="beras" stroke="#3b82f6" strokeWidth={3} fill="transparent" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Early Warning System - 4 Cols */}
        <Card className="lg:col-span-4 border-border/50 shadow-sm flex flex-col">
          <CardHeader className="bg-slate-50/50 border-b border-border/50 py-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-black text-slate-900">EWS (Early Warning)</CardTitle>
              <Badge variant="destructive" className="h-5 px-2 text-[9px] font-black">3 KRITIS</Badge>
            </div>
          </CardHeader>
          <CardContent className="flex-1 p-0">
            <div className="divide-y divide-border/40">
              {alerts.map((alert) => (
                <div key={alert.id} className="p-4 transition-colors hover:bg-slate-50">
                  <div className="flex items-start gap-3">
                    <div className={`mt-1 p-1.5 rounded-lg ${alert.type === 'critical' ? 'bg-primary/10 text-primary' : 'bg-amber-100 text-amber-600'}`}>
                      {alert.type === 'critical' ? <AlertTriangle className="h-3.5 w-3.5" /> : <Info className="h-3.5 w-3.5" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-black text-slate-900 leading-none">{alert.title}</p>
                      <p className="text-[10px] text-slate-500 mt-1.5 leading-tight font-medium line-clamp-2">{alert.desc}</p>
                      <span className="text-[9px] font-black text-slate-400 mt-2 block uppercase">{alert.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-3">
              <Button variant="outline" className="w-full h-8 text-[10px] font-black text-slate-600 hover:text-primary">Monitor Semua Anomali</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Comparative Table Section */}
      <div className="grid gap-4 lg:grid-cols-1">
        <Card className="border-border/50 shadow-sm overflow-hidden">
          <CardHeader className="bg-slate-900 py-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-lg font-black text-white">Monitoring Lintas Koperasi Nasional</CardTitle>
                <CardDescription className="text-[10px] font-bold text-slate-400">Komparatif performa 1,248 unit koperasi di seluruh Indonesia.</CardDescription>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5">
                  <span className="text-[9px] font-black text-slate-500 uppercase mr-2">Provinsi:</span>
                  <select className="bg-transparent text-[10px] font-bold text-white outline-none border-none cursor-pointer">
                    <option>Semua Wilayah</option>
                    <option>Jawa Barat</option>
                    <option>Sulawesi Selatan</option>
                  </select>
                </div>
                <Button size="sm" className="h-8 text-[10px] font-black bg-primary text-white hover:bg-rose-700 shadow-lg shadow-primary/20">Audit Lanjutan</Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-border/50">
                    <th className="px-5 py-3 text-[10px] font-black uppercase text-slate-500 tracking-wider">Koperasi / Unit Kerja</th>
                    <th className="px-5 py-3 text-[10px] font-black uppercase text-slate-500 tracking-wider text-center">Anggota</th>
                    <th className="px-5 py-3 text-[10px] font-black uppercase text-slate-500 tracking-wider text-center">Produksi</th>
                    <th className="px-5 py-3 text-[10px] font-black uppercase text-slate-500 tracking-wider text-center">Inc / Member</th>
                    <th className="px-5 py-3 text-[10px] font-black uppercase text-slate-500 tracking-wider text-center">NPL Ratio</th>
                    <th className="px-5 py-3 text-[10px] font-black uppercase text-slate-500 tracking-wider text-right">Health Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {[
                    { name: "Kop. Sukatani (Desa A)", members: "1,240", prod: "450T", income: "Rp 5.8jt", npl: "1.2%", score: 98 },
                    { name: "Kop. Merdeka (Desa B)", members: "850", prod: "320T", income: "Rp 5.2jt", npl: "2.1%", score: 92 },
                    { name: "Kop. Jaya (Desa C)", members: "2,100", prod: "580T", income: "Rp 4.9jt", npl: "3.5%", score: 74 },
                    { name: "Kop. Makmur (Desa D)", members: "1,100", prod: "285T", income: "Rp 6.1jt", npl: "1.5%", score: 95 },
                    { name: "Kop. Tani Sejahtera (Desa E)", members: "920", prod: "310T", income: "Rp 5.5jt", npl: "0.8%", score: 99 },
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-slate-50 transition-all group">
                      <td className="px-5 py-4 text-xs font-black text-slate-900">{row.name}</td>
                      <td className="px-5 py-4 text-xs font-bold text-slate-600 text-center">{row.members}</td>
                      <td className="px-5 py-4 text-xs font-bold text-slate-600 text-center">{row.prod}</td>
                      <td className="px-5 py-4 text-xs font-black text-emerald-600 text-center">{row.income}</td>
                      <td className={`px-5 py-4 text-xs font-black text-center ${parseFloat(row.npl) > 3 ? 'text-primary' : 'text-slate-700'}`}>{row.npl}</td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-12 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${row.score > 90 ? 'bg-emerald-500' : row.score > 80 ? 'bg-blue-500' : 'bg-amber-500'}`} style={{ width: `${row.score}%` }} />
                          </div>
                          <span className="text-[10px] font-black text-slate-900">{row.score}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Health Distribution Chart */}
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-black text-slate-900">Kesehatan Portfolio Nasional</CardTitle>
            <CardDescription className="text-[10px] font-semibold text-slate-500">Klasifikasi 1,248 Koperasi berdasarkan rasio NPL & Likuiditas.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col sm:flex-row items-center gap-6 py-6">
            <div className="h-[180px] w-[180px] relative">
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
                <span className="text-xl font-black text-slate-950">1,248</span>
                <span className="text-[8px] uppercase text-slate-400 font-black">UNIT</span>
              </div>
            </div>
            <div className="flex-1 grid grid-cols-1 gap-2 w-full">
              {distributionData.map((item) => (
                <div key={item.name} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-border/40 shadow-sm">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full shadow-[0_0_5px_rgba(0,0,0,0.1)]" style={{ backgroundColor: item.color }} />
                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-tight">{item.name}</span>
                  </div>
                  <span className="text-xs font-black text-slate-950">{item.value} Unit</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Demographics Summary */}
        <Card className="border-border/50 shadow-sm bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-black text-slate-900">Demografi Anggota Terpadu</CardTitle>
            <CardDescription className="text-[10px] font-semibold text-slate-500">Profil usia dari 842,500 anggota nasional.</CardDescription>
          </CardHeader>
          <CardContent className="py-6">
            <div className="h-[120px] w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={demographicData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} opacity={0.1} />
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" fontSize={10} fontWeights="900" width={100} axisLine={false} tickLine={false} />
                  <Tooltip cursor={{ fill: 'transparent' }} />
                  <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={20}>
                    {demographicData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-6 flex items-center justify-between p-4 rounded-2xl bg-emerald-50 border border-emerald-100 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-white shadow-sm text-emerald-600">
                  <Users className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-black text-emerald-900 uppercase tracking-tight">Kapasitas Desa</p>
                  <p className="text-[10px] font-bold text-emerald-700">Rerata 675 Anggota/Desa</p>
                </div>
              </div>
              <Button size="sm" variant="ghost" className="h-8 text-[10px] font-black text-emerald-700 hover:bg-emerald-100" asChild>
                <Link href="/anggota">Audit Data →</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
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
                  <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }} />
                  <Legend wrapperStyle={{ paddingTop: '20px', fontSize: '10px', fontWeight: 'bold' }} />
                  <Area
                    yAxisId="left"
                    type="monotone"
                    dataKey="anggota"
                    name="Anggota"
                    stroke="#10b981"
                    fill="url(#colorAnggota)"
                    strokeWidth={3}
                  />
                  <Area
                    yAxisId="right"
                    type="monotone"
                    dataKey="beras"
                    name="Produksi Beras (Ton)"
                    stroke="#be0817"
                    fill="transparent"
                    strokeWidth={2}
                  />
                </AreaChart>
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
                  <Tooltip contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }} />
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

      <div className="grid gap-6 lg:grid-cols-1">
        {/* Cross-Koperasi Data Table (Nationwide Monitoring) */}
        <Card className="border-border/50 shadow-sm overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b border-border/50 pb-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="text-xl font-black text-slate-950">Monitoring Lintas Koperasi (Nasional)</CardTitle>
                <CardDescription className="text-xs font-semibold text-slate-600">Komparasi performa real-time antar desa dan unit koperasi.</CardDescription>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center rounded-lg border border-border/50 bg-background px-2 py-1">
                  <span className="text-[9px] font-black text-slate-400 uppercase mr-2">Provinsi:</span>
                  <select className="bg-transparent text-[10px] font-bold outline-none border-none cursor-pointer">
                    <option>Semua Wilayah</option>
                    <option>Jawa Barat</option>
                    <option>Sulawesi Selatan</option>
                    <option>Sumatera Utara</option>
                  </select>
                </div>
                <div className="flex items-center rounded-lg border border-border/50 bg-background px-2 py-1">
                  <span className="text-[9px] font-black text-slate-400 uppercase mr-2">Komoditas:</span>
                  <select className="bg-transparent text-[10px] font-bold outline-none border-none cursor-pointer">
                    <option>Semua</option>
                    <option>Beras</option>
                    <option>Jagung</option>
                    <option>Cabai</option>
                  </select>
                </div>
                <Button size="sm" variant="outline" className="h-8 text-[10px] font-bold border-primary/20 text-primary hover:bg-primary/5">Terapkan Filter</Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 border-b border-border/50">
                    <th className="px-4 py-3 text-[10px] font-black uppercase text-slate-500 tracking-wider">Nama Koperasi / Desa</th>
                    <th className="px-4 py-3 text-[10px] font-black uppercase text-slate-500 tracking-wider">Total Anggota</th>
                    <th className="px-4 py-3 text-[10px] font-black uppercase text-slate-500 tracking-wider">Produksi (Ton)</th>
                    <th className="px-4 py-3 text-[10px] font-black uppercase text-slate-500 tracking-wider">Pendapatan Rerata</th>
                    <th className="px-4 py-3 text-[10px] font-black uppercase text-slate-500 tracking-wider">NPL (%)</th>
                    <th className="px-4 py-3 text-[10px] font-black uppercase text-slate-500 tracking-wider text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {[
                    { name: "Kop. Sukatani (Desa A)", members: "1,240", prod: "450", income: "Rp 5.8jt", npl: "1.2%", status: "Sehat" },
                    { name: "Kop. Merdeka (Desa B)", members: "850", prod: "320", income: "Rp 5.2jt", npl: "2.1%", status: "Sehat" },
                    { name: "Kop. Jaya (Desa C)", members: "2,100", prod: "580", income: "Rp 4.9jt", npl: "3.5%", status: "Peringatan" },
                    { name: "Kop. Makmur (Desa D)", members: "1,100", prod: "285", income: "Rp 6.1jt", npl: "1.5%", status: "Sehat" },
                    { name: "Kop. Tani Sejahtera (Desa E)", members: "920", prod: "310", income: "Rp 5.5jt", npl: "0.8%", status: "Sangat Sehat" },
                  ].map((row, i) => (
                    <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-4 py-3 text-sm font-bold text-slate-900">{row.name}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-slate-700">{row.members}</td>
                      <td className="px-4 py-3 text-sm font-semibold text-slate-700">{row.prod}</td>
                      <td className="px-4 py-3 text-sm font-bold text-emerald-600">{row.income}</td>
                      <td className={`px-4 py-3 text-sm font-bold ${parseFloat(row.npl) > 3 ? 'text-primary' : 'text-slate-700'}`}>{row.npl}</td>
                      <td className="px-4 py-3 text-right">
                        <Button variant="ghost" size="sm" className="h-7 text-[10px] font-black text-slate-500 group-hover:text-primary transition-colors">
                          Detail Unit →
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 bg-slate-50/30 border-t border-border/50 text-center">
              <Button variant="link" className="text-xs font-bold text-primary" asChild>
                <Link href="/anggota">Lihat Seluruh 1,248 Koperasi Terdaftar →</Link>
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
