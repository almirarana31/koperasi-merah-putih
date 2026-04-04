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
          <Card key={idx} className="border-border/50 shadow-sm">
            <CardContent className="p-5">
              <div className="flex justify-between items-center">
                <div className={`p-2 rounded-xl ${kpi.bg} ${kpi.color}`}>
                  <kpi.icon className="h-5 w-5" />
                </div>
                <div className="flex items-center gap-1 text-[10px] font-bold">
                  {kpi.trend === 'up' ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                  {kpi.change}
                </div>
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
        {/* Regional Production Chart */}
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Produksi Per Kecamatan</CardTitle>
            <CardDescription className="text-xs">Perbandingan hasil panen utama antar wilayah.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={regionalProduction}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                  <XAxis dataKey="area" fontSize={12} axisLine={false} tickLine={false} />
                  <YAxis fontSize={12} axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="beras" name="Beras" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="cabai" name="Cabai" fill="#be0817" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Top Performing Cooperatives */}
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Koperasi Unggulan</CardTitle>
            <CardDescription className="text-xs">Berdasarkan volume & kepatuhan.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { name: "Kop. Sukatani", area: "Kec. A", volume: "450 Ton", status: "Gold" },
              { name: "Kop. Berkah", area: "Kec. B", volume: "320 Ton", status: "Silver" },
              { name: "Kop. Mandiri", area: "Kec. D", volume: "285 Ton", status: "Silver" },
              { name: "Kop. Tani Jaya", area: "Kec. C", volume: "150 Ton", status: "Active" },
            ].map((kop, idx) => (
              <div key={idx} className="flex items-center justify-between p-3.5 rounded-xl border border-border/50 bg-white group">
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-slate-950">{kop.name}</span>
                  <span className="text-[10px] text-muted-foreground mt-0.5">{kop.area}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-emerald-600">{kop.volume}</p>
                  <Badge variant="outline" className="text-[9px] h-4 mt-1">{kop.status}</Badge>
                </div>
              </div>
            ))}
            <Button variant="ghost" className="w-full text-xs font-bold text-primary" asChild>
              <Link href="/produksi/agregasi">Detail Wilayah →</Link>
            </Button>
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
