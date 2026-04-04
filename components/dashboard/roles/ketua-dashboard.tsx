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
          <Card key={idx} className="border-border/50 shadow-sm">
            <CardContent className="p-5">
              <div className="flex justify-between items-center">
                <div className={`p-2 rounded-xl ${kpi.bg} ${kpi.color}`}>
                  <kpi.icon className="h-5 w-5" />
                </div>
                <div className="text-[10px] font-bold text-muted-foreground uppercase">{kpi.change}</div>
              </div>
              <div className="mt-4">
                <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wider drop-shadow-sm">{kpi.title}</p>
                <p className="text-3xl font-black mt-1 text-slate-950 drop-shadow-sm">{kpi.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        {/* Unit Performance Chart */}
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Kinerja Lintas Unit Kerja</CardTitle>
            <CardDescription className="text-xs">Perbandingan profitabilitas dan skor kesehatan unit.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={unitPerformance}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                  <XAxis dataKey="name" fontSize={12} axisLine={false} tickLine={false} />
                  <YAxis fontSize={12} axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="profit" name="Profit (Juta)" fill="#be0817" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="health" name="Skor Kesehatan" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Executive Approval List */}
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Persetujuan Eksekutif</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { title: "Anggaran Q2 2026", user: "Manager Keuangan", type: "Budget", time: "1 jam lalu" },
              { title: "Kerjasama PT Pangan", user: "Manager Pasar", type: "Contract", time: "3 jam lalu" },
              { title: "Pencairan SHU Tahap 1", user: "Sistem", type: "Payout", time: "Hari ini" },
              { title: "Investasi Cold Storage", user: "Manager Logistik", type: "CAPEX", time: "Kemarin" },
            ].map((app, idx) => (
              <div key={idx} className="p-3.5 rounded-xl border border-border/50 bg-secondary/10 hover:border-primary/30 transition-all cursor-pointer group">
                <div className="flex justify-between items-start">
                  <span className="text-[10px] font-bold text-primary uppercase">{app.type}</span>
                  <span className="text-[10px] text-muted-foreground">{app.time}</span>
                </div>
                <p className="text-sm font-bold mt-2 group-hover:text-primary transition-colors">{app.title}</p>
                <p className="text-[11px] text-muted-foreground mt-1">Diajukan oleh: {app.user}</p>
              </div>
            ))}
            <Button variant="ghost" className="w-full text-xs font-bold text-muted-foreground" asChild>
              <Link href="/command-center">Buka Pusat Kendali →</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

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
