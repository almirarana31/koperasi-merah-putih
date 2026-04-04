"use client"

import {
  Users,
  Wallet,
  Sprout,
  BarChart3,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  ClipboardCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  ChevronRight,
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
} from "recharts"
import Link from "next/link"
import { DashboardLinks } from "./dashboard-shared"

const memberGrowthData = [
  { month: "Jan", aktif: 850, onboarding: 45 },
  { month: "Feb", aktif: 920, onboarding: 68 },
  { month: "Mar", aktif: 1050, onboarding: 82 },
  { month: "Apr", aktif: 1120, onboarding: 55 },
  { month: "Mei", aktif: 1247, onboarding: 94 },
]

export function KoperasiManagerDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 px-1">
        <h2 className="text-2xl font-black tracking-tight text-slate-950 drop-shadow-sm">Kendali Operasional Koperasi</h2>
        <p className="text-slate-700 text-sm font-semibold drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]">Kelola anggota, produksi, dan cashflow unit Anda hari ini.</p>
      </div>

      {/* KPI Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          { title: "Anggota Aktif", value: "1,247", change: "+12%", trend: "up", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
          { title: "Total Produksi", value: "42.5 Ton", change: "+8%", trend: "up", icon: Sprout, color: "text-emerald-600", bg: "bg-emerald-50" },
          { title: "Kas Masuk", value: "Rp 542jt", change: "+15%", trend: "up", icon: Wallet, color: "text-amber-600", bg: "bg-amber-50" },
          { title: "Loan Pending", value: "12 Berkas", change: "4 Baru", trend: "up", icon: ClipboardCheck, color: "text-primary", bg: "bg-primary/5" },
        ].map((kpi, idx) => (
          <Card key={idx} className="border-border/50 shadow-sm">
            <CardContent className="p-5">
              <div className="flex justify-between items-center">
                <div className={`p-2 rounded-xl ${kpi.bg} ${kpi.color}`}>
                  <kpi.icon className="h-5 w-5" />
                </div>
                <Badge variant="outline" className="text-[10px] font-bold">
                  {kpi.change}
                </Badge>
              </div>
              <div className="mt-4">
                <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wider drop-shadow-sm">{kpi.title}</p>
                <p className="text-3xl font-black mt-1 text-slate-950 drop-shadow-sm">{kpi.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        {/* Growth Chart */}
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Pertumbuhan Anggota</CardTitle>
            <CardDescription className="text-xs">Tren penambahan & keaktifan anggota 5 bulan terakhir.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={memberGrowthData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                  <XAxis dataKey="month" fontSize={12} axisLine={false} tickLine={false} />
                  <YAxis fontSize={12} axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Area type="monotone" dataKey="aktif" stroke="#be0817" fill="#be0817" fillOpacity={0.05} strokeWidth={2} />
                  <Area type="monotone" dataKey="onboarding" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.05} strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Action Items List */}
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Tugas Perlu Tindakan</CardTitle>
            <CardDescription className="text-xs">Daftar verifikasi dan persetujuan mendesak.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { title: "Verifikasi Panen - Unit Sukatani", desc: "1.5 Ton Beras menanti validasi gudang.", time: "30 mnt lalu", status: "New" },
              { title: "Onboarding Anggota - 8 Orang", desc: "Dokumen KTP belum lengkap untuk 3 orang.", time: "2 jam lalu", status: "Pending" },
              { title: "Persetujuan Pinjaman", desc: "Ajukan Rp 15jt dari Pak Budi (Unit A).", time: "5 jam lalu", status: "Urgent" },
            ].map((item, idx) => (
              <div key={idx} className="p-3.5 rounded-xl border border-border/50 bg-secondary/20 hover:bg-secondary/40 transition-colors cursor-pointer group">
                <div className="flex justify-between items-start">
                  <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${item.status === 'Urgent' ? 'bg-primary text-white' : 'bg-stone-200 text-stone-600'}`}>
                    {item.status}
                  </span>
                  <span className="text-[10px] text-muted-foreground">{item.time}</span>
                </div>
                <p className="text-sm font-bold mt-2 group-hover:text-primary transition-colors">{item.title}</p>
                <p className="text-xs text-muted-foreground mt-1 line-clamp-1">{item.desc}</p>
              </div>
            ))}
            <Button variant="ghost" className="w-full text-xs font-bold text-primary" asChild>
              <Link href="/anggota/verifikasi">Lihat Semua Tugas <ChevronRight className="ml-1 h-3 w-3" /></Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Nav Grid */}
      <div className="grid gap-4 md:grid-cols-3">
        <Link href="/ai/forecast" className="group">
          <Card className="border-border/50 bg-emerald-50/30 hover:bg-emerald-50/50 transition-all">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center border border-emerald-100 text-emerald-600">
                <Zap className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold">AI Forecast</p>
                <p className="text-[11px] text-muted-foreground">Prediksi stok 30 hari.</p>
              </div>
              <ArrowRight className="h-4 w-4 text-emerald-600 transition-transform group-hover:translate-x-1" />
            </CardContent>
          </Card>
        </Link>
        <Link href="/keuangan/laporan" className="group">
          <Card className="border-border/50 bg-blue-50/30 hover:bg-blue-50/50 transition-all">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center border border-blue-100 text-blue-600">
                <BarChart3 className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold">Laporan Keuangan</p>
                <p className="text-[11px] text-muted-foreground">Monitor P&L & Cashflow.</p>
              </div>
              <ArrowRight className="h-4 w-4 text-blue-600 transition-transform group-hover:translate-x-1" />
            </CardContent>
          </Card>
        </Link>
        <Link href="/anggota" className="group">
          <Card className="border-border/50 bg-stone-50 hover:bg-stone-100 transition-all">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center border border-stone-200 text-stone-600">
                <Users className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold">Basis Data Anggota</p>
                <p className="text-[11px] text-muted-foreground">Profil & behavior tani.</p>
              </div>
              <ArrowRight className="h-4 w-4 text-stone-600 transition-transform group-hover:translate-x-1" />
            </CardContent>
          </Card>
        </Link>
      </div>
      <DashboardLinks />
    </div>
  )
}
