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

      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        {/* Delivery Chart */}
        <Card className="border-slate-200 bg-white shadow-sm overflow-hidden">
          <CardHeader className="pb-2 bg-slate-50/50 border-b border-slate-100">
            <CardTitle className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-900">Volume Pengiriman Harian</CardTitle>
            <CardDescription className="text-[10px] font-bold text-slate-500 uppercase">Total paket & komoditas terkirim minggu ini.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[280px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={deliveryData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="day" fontSize={10} fontWeights="900" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                  <YAxis fontSize={10} fontWeights="900" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontSize: '12px' }} 
                    cursor={{ fill: '#f8fafc' }}
                  />
                  <Bar dataKey="value" fill="#3b82f6" radius={[6, 6, 0, 0]} isAnimationActive={false} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Tracking List */}
        <Card className="border-slate-200 bg-white shadow-sm overflow-hidden">
          <CardHeader className="pb-3 bg-slate-50/50 border-b border-slate-100">
            <CardTitle className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-900">Pelacakan Live</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100">
              {[
                { id: "LOG-421", dest: "Gudang Pusat", status: "Perjalanan", time: "15 mnt lagi" },
                { id: "LOG-422", dest: "Unit Sukatani", status: "Bongkar", time: "Sedang proses" },
                { id: "LOG-423", dest: "PT Pangan", status: "Pickup", time: "1 jam lalu" },
                { id: "LOG-424", dest: "Pasar Induk", status: "Selesai", time: "Hari ini" },
              ].map((ship, idx) => (
                <div key={idx} className="flex items-center gap-3 p-4 hover:bg-slate-50 transition-colors group cursor-pointer">
                  <div className="h-9 w-9 rounded-xl bg-slate-100 flex items-center justify-center border border-slate-200 text-blue-600 shadow-sm">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-black text-slate-900 truncate uppercase tracking-tight group-hover:text-rose-600 transition-colors">{ship.dest}</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{ship.id}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-blue-600 uppercase">{ship.status}</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase">{ship.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-3 bg-slate-50/30">
              <Button variant="ghost" className="w-full text-[10px] font-black text-slate-500 hover:text-rose-600 hover:bg-white uppercase tracking-widest transition-all" asChild>
                <Link href="/logistik">Monitor Semua Armada →</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Route Insight */}
      <Card className="border-rose-100 bg-rose-50/20 shadow-sm">
        <CardContent className="p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center border border-rose-100 shadow-sm">
              <Zap className="h-6 w-6 text-rose-600" />
            </div>
            <div>
              <p className="text-[11px] font-black text-rose-900 uppercase tracking-widest">AI Insight: Optimasi Rute Baru</p>
              <p className="text-xs text-slate-600 font-bold mt-0.5 leading-tight">3 rute pickup dapat digabung untuk menghemat BBM hingga 15%.</p>
            </div>
          </div>
          <Button size="sm" variant="outline" className="w-full sm:w-auto h-10 px-6 font-black text-[10px] uppercase tracking-widest border-rose-200 text-rose-700 hover:bg-rose-50 shadow-sm" asChild>
            <Link href="/ai/optimasi-rute">Terapkan Rekomendasi</Link>
          </Button>
        </CardContent>
      </Card>
      <DashboardLinks />
    </div>
  )
}
