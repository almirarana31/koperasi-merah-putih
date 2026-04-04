"use client"

import {
  Truck,
  Warehouse,
  ClipboardCheck,
  TrendingUp,
  MapPin,
  Clock,
  ArrowRight,
  ChevronRight,
  Zap,
  CheckCircle2,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts"
import Link from "next/link"
import { DashboardLinks } from "./dashboard-shared"

const deliveryData = [
  { day: "Sen", value: 12 },
  { day: "Sel", value: 18 },
  { day: "Rab", value: 15 },
  { day: "Kam", value: 24 },
  { day: "Jum", value: 20 },
  { day: "Sab", value: 28 },
  { day: "Min", value: 10 },
]

export function LogistikDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 px-1">
        <h2 className="text-2xl font-black tracking-tight text-slate-950 drop-shadow-sm">Koordinasi Logistik & Armada</h2>
        <p className="text-slate-700 text-sm font-semibold drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]">Monitor pengiriman, utilisasi armada, dan status gudang.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {[
          { title: "Pengiriman Aktif", value: "12 Rute", change: "3 Pickup", trend: "up", icon: Truck, color: "text-blue-600", bg: "bg-blue-50" },
          { title: "Utilisasi Armada", value: "82%", change: "+5%", trend: "up", icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
          { title: "Antrean Kirim", value: "9 Order", change: "4 Urgent", trend: "up", icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
          { title: "Status Gudang", value: "75%", change: "Ok", trend: "up", icon: Warehouse, color: "text-purple-600", bg: "bg-purple-50" },
        ].map((kpi, idx) => (
          <Card key={idx} className="border-border/50 shadow-sm">
            <CardContent className="p-5">
              <div className="flex justify-between items-center">
                <div className={`p-2 rounded-xl ${kpi.bg} ${kpi.color}`}>
                  <kpi.icon className="h-5 w-5" />
                </div>
                <Badge variant="outline" className="text-[10px] font-bold">{kpi.change}</Badge>
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
        {/* Delivery Chart */}
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Volume Pengiriman Harian</CardTitle>
            <CardDescription className="text-xs">Total paket & komoditas terkirim minggu ini.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[280px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={deliveryData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                  <XAxis dataKey="day" fontSize={12} axisLine={false} tickLine={false} />
                  <YAxis fontSize={12} axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Tracking List */}
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Pelacakan Live</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { id: "LOG-421", dest: "Gudang Pusat", status: "Perjalanan", time: "15 mnt lagi" },
              { id: "LOG-422", dest: "Unit Sukatani", status: "Bongkar", time: "Sedang proses" },
              { id: "LOG-423", dest: "PT Pangan", status: "Pickup", time: "1 jam lalu" },
              { id: "LOG-424", dest: "Pasar Induk", status: "Selesai", time: "Hari ini" },
            ].map((ship, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 rounded-xl border border-border/50 bg-secondary/10">
                <div className="h-8 w-8 rounded-full bg-white flex items-center justify-center border border-border/50 text-blue-600">
                  <MapPin className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-950 truncate">{ship.dest}</p>
                  <p className="text-[10px] text-muted-foreground uppercase">{ship.id}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-bold text-blue-600">{ship.status}</p>
                  <p className="text-[10px] text-muted-foreground">{ship.time}</p>
                </div>
              </div>
            ))}
            <Button variant="ghost" className="w-full text-xs font-bold text-muted-foreground" asChild>
              <Link href="/logistik">Monitor Semua Armada →</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* AI Route Insight */}
      <Card className="border-primary/10 bg-primary/[0.03]">
        <CardContent className="p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center border border-primary/10 shadow-sm">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-bold">AI Insight: Optimasi Rute Baru</p>
              <p className="text-xs text-muted-foreground mt-0.5">3 rute pickup dapat digabung untuk menghemat BBM hingga 15%.</p>
            </div>
          </div>
          <Button size="sm" variant="outline" className="w-full sm:w-auto h-9 text-xs" asChild>
            <Link href="/ai/optimasi-rute">Terapkan Rekomendasi</Link>
          </Button>
        </CardContent>
      </Card>
      <DashboardLinks />
    </div>
  )
}
