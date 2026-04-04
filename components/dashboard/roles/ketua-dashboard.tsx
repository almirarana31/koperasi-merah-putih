"use client"

import {
  BarChart3,
  ShieldCheck,
  Zap,
  TrendingUp,
  Users,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  ClipboardCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  FileText,
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
} from "recharts"
import Link from "next/link"
import { DashboardLinks } from "./dashboard-shared"

const unitPerformance = [
  { name: "Unit A", profit: 120, health: 92 },
  { name: "Unit B", profit: 85, health: 88 },
  { name: "Unit C", profit: 150, health: 95 },
  { name: "Unit D", profit: 110, health: 82 },
]

export function KetuaDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 px-1">
        <h2 className="text-2xl font-black tracking-tight text-slate-950 drop-shadow-sm">Pengawasan Strategis Ketua Koperasi</h2>
        <p className="text-slate-700 text-sm font-semibold drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]">Monitor kinerja unit, risiko, dan ambil keputusan strategis.</p>
      </div>


      <div className="grid gap-4 md:grid-cols-4">
        {[
          { title: "Total Aset", value: "Rp 24.8M", change: "+12%", trend: "up", icon: Wallet, color: "text-blue-600", bg: "bg-blue-50" },
          { title: "Kesehatan Unit", value: "92%", change: "Sangat Sehat", trend: "up", icon: ShieldCheck, color: "text-emerald-600", bg: "bg-emerald-50" },
          { title: "Profit Bersih", value: "Rp 1.2M", change: "+18%", trend: "up", icon: TrendingUp, color: "text-amber-600", bg: "bg-amber-50" },
          { title: "Persetujuan", value: "7 Masuk", change: "Action Needed", trend: "up", icon: ClipboardCheck, color: "text-primary", bg: "bg-primary/5" },
        ].map((kpi, idx) => (
          <Card key={idx} className="border-slate-200 bg-white shadow-sm overflow-hidden">
            <CardContent className="p-5">
              <div className="flex justify-between items-center">
                <div className={`p-2 rounded-xl ${kpi.bg} ${kpi.color}`}>
                  <kpi.icon className="h-5 w-5" />
                </div>
                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{kpi.change}</div>
              </div>
              <div className="mt-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] drop-shadow-sm">{kpi.title}</p>
                <p className="text-3xl font-black mt-1 text-slate-950 drop-shadow-sm tracking-tighter">{kpi.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        {/* Unit Performance Chart */}
        <Card className="border-slate-200 bg-white shadow-sm overflow-hidden">
          <CardHeader className="pb-2 bg-slate-50/50 border-b border-slate-100">
            <CardTitle className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-900">Kinerja Lintas Unit Kerja</CardTitle>
            <CardDescription className="text-[10px] font-bold text-slate-500 uppercase">Perbandingan profitabilitas dan skor kesehatan unit.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={unitPerformance}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="name" fontSize={10} fontWeights="900" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                  <YAxis fontSize={10} fontWeights="900" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontSize: '12px' }} 
                    cursor={{ fill: '#f8fafc' }}
                  />
                  <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', paddingBottom: '20px' }} />
                  <Bar dataKey="profit" name="Profit (Juta)" fill="#be0817" radius={[4, 4, 0, 0]} isAnimationActive={false} />
                  <Bar dataKey="health" name="Skor Kesehatan" fill="#10b981" radius={[4, 4, 0, 0]} isAnimationActive={false} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Executive Approval List */}
        <Card className="border-slate-200 bg-white shadow-sm overflow-hidden">
          <CardHeader className="pb-3 bg-slate-50/50 border-b border-slate-100">
            <CardTitle className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-900">Persetujuan Eksekutif</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100">
              {[
                { title: "Anggaran Q2 2026", user: "Manager Keuangan", type: "Budget", time: "1 jam lalu" },
                { title: "Kerjasama PT Pangan", user: "Manager Pasar", type: "Contract", time: "3 jam lalu" },
                { title: "Pencairan SHU Tahap 1", user: "Sistem", type: "Payout", time: "Hari ini" },
                { title: "Investasi Cold Storage", user: "Manager Logistik", type: "CAPEX", time: "Kemarin" },
              ].map((app, idx) => (
                <div key={idx} className="flex flex-col p-4 hover:bg-slate-50 transition-colors group cursor-pointer">
                  <div className="flex justify-between items-start">
                    <Badge variant="outline" className="text-[9px] font-black uppercase px-1.5 h-4 border-rose-200 text-rose-600 bg-rose-50">{app.type}</Badge>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{app.time}</span>
                  </div>
                  <p className="text-sm font-black mt-3 text-slate-900 group-hover:text-rose-600 transition-colors uppercase tracking-tight">{app.title}</p>
                  <p className="text-[10px] font-bold text-slate-500 mt-1 uppercase tracking-widest">Diajukan oleh: {app.user}</p>
                </div>
              ))}
            </div>
            <div className="p-3 bg-slate-50/30">
              <Button variant="ghost" className="w-full text-[10px] font-black text-slate-500 hover:text-rose-600 hover:bg-white uppercase tracking-widest transition-all" asChild>
                <Link href="/command-center">Buka Pusat Kendali →</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Strategy Insight */}
      <Card className="border-rose-100 bg-rose-50/20 shadow-sm">
        <CardContent className="p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center border border-rose-100 shadow-sm">
              <Zap className="h-6 w-6 text-rose-600" />
            </div>
            <div>
              <p className="text-[11px] font-black text-rose-900 uppercase tracking-widest">AI Strategy: Ekspansi Komoditas</p>
              <p className="text-xs text-slate-600 font-bold mt-0.5 leading-tight">Potensi profit naik 12% jika koperasi menambah kuota serapan jagung di wilayah Timur.</p>
            </div>
          </div>
          <Button size="sm" variant="outline" className="w-full sm:w-auto h-10 px-6 font-black text-[10px] uppercase tracking-widest border-rose-200 text-rose-700 hover:bg-rose-50 shadow-sm" asChild>
            <Link href="/ai/analisis-pasar">Lihat Analisis Pasar</Link>
          </Button>
        </CardContent>
      </Card>

      {/* AI Strategy Insight */}
      <Card className="border-primary/10 bg-primary/[0.03]">
        <CardContent className="p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center border border-primary/10 shadow-sm">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-bold">AI Strategy: Ekspansi Komoditas</p>
              <p className="text-xs text-muted-foreground mt-0.5">Potensi profit naik 12% jika koperasi menambah kuota serapan jagung di wilayah Timur.</p>
            </div>
          </div>
          <Button size="sm" variant="outline" className="w-full sm:w-auto h-9 text-xs" asChild>
            <Link href="/ai/analisis-pasar">Lihat Analisis Pasar</Link>
          </Button>
        </CardContent>
      </Card>
      <DashboardLinks />
    </div>
  )
}
