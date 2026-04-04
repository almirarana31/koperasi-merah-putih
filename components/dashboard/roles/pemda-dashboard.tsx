"use client"

import {
  TrendingUp,
  BarChart3,
  MapPin,
  Sprout,
  Truck,
  ArrowUpRight,
  ArrowDownRight,
  ChevronRight,
  ArrowRight,
  Building2,
  Zap,
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
  AreaChart,
  Area,
  Legend,
} from "recharts"
import Link from "next/link"
import { DashboardLinks } from "./dashboard-shared"

const regionalProduction = [
  { area: "Kec. A", beras: 450, cabai: 120 },
  { area: "Kec. B", beras: 520, cabai: 95 },
  { area: "Kec. C", beras: 380, cabai: 150 },
  { area: "Kec. D", beras: 610, cabai: 80 },
]

export function PemdaDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 px-1">
        <h2 className="text-2xl font-black tracking-tight text-slate-950 drop-shadow-sm">Monitoring Daerah (Kabupaten)</h2>
        <p className="text-slate-700 text-sm font-semibold drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]">Pantau produksi agregat dan pergerakan komoditas lintas wilayah.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {[
          { title: "Total Produksi", value: "1.4k Ton", change: "+15%", trend: "up", icon: Sprout, color: "text-emerald-600", bg: "bg-emerald-50" },
          { title: "Koperasi Aktif", value: "42 Unit", change: "+2 Baru", trend: "up", icon: Building2, color: "text-blue-600", bg: "bg-blue-50" },
          { title: "Distribusi", value: "Stabil", change: "Ok", trend: "up", icon: Truck, color: "text-purple-600", bg: "bg-purple-50" },
          { title: "Harga Rata-rata", value: "Rp 12.8k", change: "+4%", trend: "up", icon: TrendingUp, color: "text-amber-600", bg: "bg-amber-50" },
        ].map((kpi, idx) => (
          <Card key={idx} className="border-slate-200 bg-white shadow-sm overflow-hidden">
            <CardContent className="p-5">
              <div className="flex justify-between items-center">
                <div className={`p-2 rounded-xl ${kpi.bg} ${kpi.color}`}>
                  <kpi.icon className="h-5 w-5" />
                </div>
                <div className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-tight ${kpi.trend === 'up' ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {kpi.trend === 'up' ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                  {kpi.change}
                </div>
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
        {/* Regional Production Chart */}
        <Card className="border-slate-200 bg-white shadow-sm overflow-hidden">
          <CardHeader className="pb-2 bg-slate-50/50 border-b border-slate-100">
            <CardTitle className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-900">Produksi Per Kecamatan</CardTitle>
            <CardDescription className="text-[10px] font-bold text-slate-500 uppercase">Perbandingan hasil panen utama antar wilayah.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={regionalProduction}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="area" fontSize={10} fontWeights="900" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                  <YAxis fontSize={10} fontWeights="900" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontSize: '12px' }} 
                    cursor={{ fill: '#f8fafc' }}
                  />
                  <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: '900', textTransform: 'uppercase', paddingBottom: '20px' }} />
                  <Bar dataKey="beras" name="Beras" fill="#3b82f6" radius={[4, 4, 0, 0]} isAnimationActive={false} />
                  <Bar dataKey="cabai" name="Cabai" fill="#be0817" radius={[4, 4, 0, 0]} isAnimationActive={false} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Top Performing Cooperatives */}
        <Card className="border-slate-200 bg-white shadow-sm overflow-hidden">
          <CardHeader className="pb-3 bg-slate-50/50 border-b border-slate-100">
            <CardTitle className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-900">Koperasi Unggulan</CardTitle>
            <CardDescription className="text-[10px] font-bold text-slate-500 uppercase">Berdasarkan volume & kepatuhan.</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100">
              {[
                { name: "Kop. Sukatani", area: "Kec. A", volume: "450 Ton", status: "Gold" },
                { name: "Kop. Berkah", area: "Kec. B", volume: "320 Ton", status: "Silver" },
                { name: "Kop. Mandiri", area: "Kec. D", volume: "285 Ton", status: "Silver" },
                { name: "Kop. Tani Jaya", area: "Kec. C", volume: "150 Ton", status: "Active" },
              ].map((kop, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors group cursor-pointer">
                  <div className="flex flex-col">
                    <span className="text-sm font-black text-slate-900 group-hover:text-rose-600 transition-colors uppercase tracking-tight">{kop.name}</span>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{kop.area}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-emerald-600">{kop.volume}</p>
                    <Badge variant="outline" className="text-[9px] font-black uppercase px-1.5 h-4 border-slate-200 text-slate-500 mt-1">{kop.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-3 bg-slate-50/30">
              <Button variant="ghost" className="w-full text-[10px] font-black text-slate-500 hover:text-rose-600 hover:bg-white uppercase tracking-widest transition-all" asChild>
                <Link href="/produksi/agregasi">Detail Wilayah →</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Map Insight Quick Link */}
      <Card className="border-primary/10 bg-primary/[0.03]">
        <CardContent className="p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center border border-primary/10 shadow-sm">
              <MapPin className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-bold">Visualisasi Geografis</p>
              <p className="text-xs text-muted-foreground mt-0.5">Buka peta interaktif untuk melihat titik sebaran produksi & logistik.</p>
            </div>
          </div>
          <Button size="sm" variant="outline" className="w-full sm:w-auto h-9 text-xs" asChild>
            <Link href="/logistik">Buka Peta Dashboard</Link>
          </Button>
        </CardContent>
      </Card>
      <DashboardLinks />
    </div>
  )
}
