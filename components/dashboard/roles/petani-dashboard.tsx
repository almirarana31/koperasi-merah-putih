"use client"

import {
  Sprout,
  ShoppingCart,
  Wallet,
  Brain,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  AlertCircle,
  Calendar,
  ArrowRight,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts"
import Link from "next/link"
import { DashboardLinks } from "./dashboard-shared"

const priceTrendData = [
  { day: "Sen", harga: 12500 },
  { day: "Sel", harga: 12800 },
  { day: "Rab", harga: 13200 },
  { day: "Kam", harga: 13000 },
  { day: "Jum", harga: 13500 },
  { day: "Sab", harga: 14200 },
  { day: "Min", harga: 14500 },
]

export function PetaniDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 px-1">
        <h2 className="text-2xl font-bold tracking-tight drop-shadow-sm">Pusat Kerja Petani</h2>
        <p className="text-slate-700 text-sm font-medium drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]">Pantau panen, harga pasar, dan layanan keuangan Anda.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {/* Main Status Card */}
        <Card className="md:col-span-2 border-primary/20 bg-gradient-to-br from-white to-emerald-50/30 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-6 opacity-10">
            <Sprout className="h-24 w-24" />
          </div>
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Badge className="bg-emerald-500 hover:bg-emerald-600">Panen Aktif</Badge>
              <span className="text-xs text-muted-foreground font-medium">Update: 15 menit lalu</span>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Estimasi Hasil Panen</p>
                <div className="flex items-baseline gap-2 mt-1">
                  <p className="text-4xl font-bold">2.9 <span className="text-xl">Ton</span></p>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <ArrowUpRight className="h-3 w-3" /> +12%
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">Komoditas: Cabai Merah (Lahan A1)</p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Kesiapan Panen</span>
                  <span className="font-bold">85%</span>
                </div>
                <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 w-[85%] rounded-full" />
                </div>
                <p className="text-[11px] text-muted-foreground leading-tight italic">
                  *AI memprediksi panen optimal dalam 4 hari berdasarkan cuaca & kelembaban.
                </p>
              </div>
            </div>
            <div className="mt-6 flex gap-3">
              <Button className="rounded-xl h-10 px-6" asChild>
                <Link href="/produksi">Catat Aktivitas Panen</Link>
              </Button>
              <Button variant="outline" className="rounded-xl h-10 px-6" asChild>
                <Link href="/assistant">Tanya AI Tani</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Price Card */}
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Harga Pasar</CardTitle>
              <ShoppingCart className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-2xl font-bold">Rp 14.500 <span className="text-xs font-normal text-muted-foreground">/kg</span></p>
              <div className="flex items-center gap-1.5 mt-1">
                <TrendingUp className="h-3 w-3 text-emerald-600" />
                <span className="text-xs font-bold text-emerald-600">Naik 6% hari ini</span>
              </div>
            </div>
            <div className="h-[80px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={priceTrendData}>
                  <Line type="monotone" dataKey="harga" stroke="#be0817" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <Button variant="ghost" size="sm" className="w-full text-xs font-bold text-primary group" asChild>
              <Link href="/pasar/harga">
                Lihat Semua Komoditas <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* AI Recommendations */}
        <Card className="border-primary/10 bg-primary/[0.02]">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                <Brain className="h-4 w-4" />
              </div>
              <CardTitle className="text-base">Rekomendasi AI</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="p-3 rounded-xl border border-primary/10 bg-white/50 space-y-1">
              <p className="text-xs font-bold text-primary uppercase">Strategi Jual</p>
              <p className="text-sm font-medium leading-tight">Tahan panen 3 hari lagi untuk potensi harga +Rp 1.200/kg.</p>
            </div>
            <div className="p-3 rounded-xl border border-blue-100 bg-blue-50/30 space-y-1">
              <p className="text-xs font-bold text-blue-600 uppercase">Peringatan Cuaca</p>
              <p className="text-sm font-medium leading-tight">Hujan lebat diprediksi besok sore. Pastikan drainase lahan A1 aman.</p>
            </div>
            <Button variant="link" className="px-0 text-xs font-bold" asChild>
              <Link href="/ai">Lihat 4 Insight Lainnya →</Link>
            </Button>
          </CardContent>
        </Card>

        {/* Recent Activities */}
        <Card className="lg:col-span-2 border-border/50 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Aktivitas & Notifikasi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                { icon: CheckCircle2, text: "Verifikasi panen 1.2 Ton disetujui koperasi", time: "1 jam lalu", color: "text-emerald-500", bg: "bg-emerald-50" },
                { icon: Clock, text: "Jadwal pupuk susulan lahan B2", time: "Besok, 08:00", color: "text-amber-500", bg: "bg-amber-50" },
                { icon: Wallet, text: "Pencairan pinjaman modal Rp 5.000.000 berhasil", time: "Kemarin", color: "text-blue-500", bg: "bg-blue-50" },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3 pb-3 border-b last:border-0 last:pb-0">
                  <div className={`mt-0.5 p-2 rounded-lg ${item.bg} ${item.color}`}>
                    <item.icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium leading-tight">{item.text}</p>
                    <p className="text-xs text-muted-foreground mt-1">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Finance Summary */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-border/50 shadow-sm">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-secondary/50 flex items-center justify-center">
                <Wallet className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Sisa Plafon Pinjaman</p>
                <p className="text-xl font-bold">Rp 12.500.000</p>
              </div>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/keuangan/pinjaman">Ajukan Baru</Link>
            </Button>
          </CardContent>
        </Card>
        <Card className="border-border/50 shadow-sm">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-secondary/50 flex items-center justify-center">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Simpanan Pokok & Wajib</p>
                <p className="text-xl font-bold">Rp 4.250.000</p>
              </div>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/keuangan/shu">Detail SHU</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <DashboardLinks />
    </div>
  )
}
