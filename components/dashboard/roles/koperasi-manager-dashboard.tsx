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
          <Card key={idx} className="border-slate-200 bg-white shadow-sm overflow-hidden">
            <CardContent className="p-5">
              <div className="flex justify-between items-center">
                <div className={`p-2 rounded-xl ${kpi.bg} ${kpi.color}`}>
                  <kpi.icon className="h-5 w-5" />
                </div>
                <Badge variant="outline" className="text-[10px] font-black uppercase tracking-widest border-slate-200 bg-slate-50">
                  {kpi.change}
                </Badge>
              </div>
              <div className="mt-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] drop-shadow-sm">{kpi.title}</p>
                <p className="text-3xl font-black mt-1 text-slate-950 drop-shadow-sm tracking-tighter">{kpi.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        {/* Growth Chart */}
        <Card className="border-slate-200 bg-white shadow-sm overflow-hidden">
          <CardHeader className="pb-2 bg-slate-50/50 border-b border-slate-100">
            <CardTitle className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-900">Pertumbuhan Anggota</CardTitle>
            <CardDescription className="text-[10px] font-bold text-slate-500 uppercase">Tren penambahan & keaktifan anggota 5 bulan terakhir.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={memberGrowthData}>
                  <defs>
                    <linearGradient id="colorAktif" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#be0817" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#be0817" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorOnboarding" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" fontSize={10} fontWeight={900} axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                  <YAxis fontSize={10} fontWeight={900} axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontSize: '12px' }} 
                  />
                  <Area type="monotone" dataKey="aktif" stroke="#be0817" fill="url(#colorAktif)" strokeWidth={3} isAnimationActive={false} />
                  <Area type="monotone" dataKey="onboarding" stroke="#3b82f6" fill="url(#colorOnboarding)" strokeWidth={3} isAnimationActive={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Action Items List */}
        <Card className="border-slate-200 bg-white shadow-sm overflow-hidden">
          <CardHeader className="pb-3 bg-slate-50/50 border-b border-slate-100">
            <CardTitle className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-900">Tugas Perlu Tindakan</CardTitle>
            <CardDescription className="text-[10px] font-bold text-slate-500 uppercase">Daftar verifikasi dan persetujuan mendesak.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100">
              {[
                { title: "Verifikasi Panen - Unit Sukatani", desc: "1.5 Ton Beras menanti validasi gudang.", time: "30 mnt lalu", status: "New" },
                { title: "Onboarding Anggota - 8 Orang", desc: "Dokumen KTP belum lengkap untuk 3 orang.", time: "2 jam lalu", status: "Pending" },
                { title: "Persetujuan Pinjaman", desc: "Ajukan Rp 15jt dari Pak Budi (Unit A).", time: "5 jam lalu", status: "Urgent" },
              ].map((item, idx) => (
                <div key={idx} className="p-4 hover:bg-slate-50 transition-colors group cursor-pointer">
                  <div className="flex justify-between items-start">
                    <Badge className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${item.status === 'Urgent' ? 'bg-rose-600 text-white shadow-lg shadow-rose-200' : 'bg-slate-100 text-slate-500'}`}>
                      {item.status}
                    </Badge>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{item.time}</span>
                  </div>
                  <p className="text-sm font-black mt-3 text-slate-900 group-hover:text-rose-600 transition-colors uppercase tracking-tight">{item.title}</p>
                  <p className="text-xs font-bold text-slate-500 mt-1 line-clamp-1">{item.desc}</p>
                </div>
              ))}
            </div>
            <div className="p-3 bg-slate-50/30">
              <Button variant="ghost" className="w-full text-[10px] font-black text-slate-500 hover:text-rose-600 hover:bg-white uppercase tracking-widest transition-all" asChild>
                <Link href="/anggota/verifikasi">Lihat Semua Tugas <ChevronRight className="ml-1 h-3 w-3" /></Link>
              </Button>
            </div>
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
