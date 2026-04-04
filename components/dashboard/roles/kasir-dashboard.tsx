"use client"

import {
  Wallet,
  ShoppingCart,
  Warehouse,
  TrendingUp,
  ArrowRight,
  Send,
  Zap,
  Clock,
  CheckCircle2,
  FileText,
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

const transactionData = [
  { time: "08:00", value: 12 },
  { time: "10:00", value: 25 },
  { time: "12:00", value: 42 },
  { time: "14:00", value: 38 },
  { time: "16:00", value: 54 },
  { time: "18:00", value: 22 },
]

export function KasirDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 px-1">
        <h2 className="text-2xl font-black tracking-tight text-slate-950 drop-shadow-sm">Operasional Kasir Harian</h2>
        <p className="text-slate-700 text-sm font-semibold drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]">Fokus pada transaksi, pembayaran, dan aliran order harian.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {/* Main Stats */}
        <Card className="border-border/50 shadow-sm">
          <CardContent className="p-6">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Total Kas Masuk (Hari Ini)</p>
            <p className="text-3xl font-bold mt-2 text-emerald-600">Rp 52.450.000</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[10px] font-bold bg-emerald-50 text-emerald-600 px-2 py-0.5 rounded-full">+18% dari kemarin</span>
            </div>
            <div className="mt-6 flex gap-2">
              <Button size="sm" className="flex-1 rounded-lg">Input Transaksi</Button>
              <Button size="sm" variant="outline" className="flex-1 rounded-lg">Cetak Shift</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm">
          <CardContent className="p-6">
            <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Order Menunggu Pembayaran</p>
            <p className="text-3xl font-bold mt-2 text-amber-600">18 PO</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[10px] font-bold bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full">Total Rp 12.8jt</span>
            </div>
            <div className="mt-6">
              <Button size="sm" variant="secondary" className="w-full rounded-lg" asChild>
                <Link href="/pasar">Proses Order Sekarang</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/50 shadow-sm">
          <CardContent className="p-6">
              <div className="mt-4">
                <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wider drop-shadow-sm">Status Stok Kritis</p>
                <p className="text-3xl font-black mt-1 text-slate-950 drop-shadow-sm">4 Item</p>
              </div>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[10px] font-bold bg-primary/5 text-primary px-2 py-0.5 rounded-full">Butuh restock segera</span>
            </div>
            <div className="mt-6">
              <Button size="sm" variant="ghost" className="w-full rounded-lg text-primary" asChild>
                <Link href="/gudang">Cek Inventori →</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        {/* Transaction Chart */}
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Aliran Transaksi Per Jam</CardTitle>
            <CardDescription className="text-xs">Jumlah transaksi yang diproses hari ini.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[280px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={transactionData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                  <XAxis dataKey="time" fontSize={12} axisLine={false} tickLine={false} />
                  <YAxis fontSize={12} axisLine={false} tickLine={false} />
                  <Tooltip />
                  <Bar dataKey="value" fill="#be0817" radius={[4, 4, 0, 0]}>
                    {transactionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 4 ? '#be0817' : '#be081744'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions List */}
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Transaksi Terbaru</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { id: "TRX-001", user: "Pak Joko", amount: "Rp 1.250.000", time: "5 mnt lalu" },
              { id: "TRX-002", user: "Ibu Ani", amount: "Rp 450.000", time: "12 mnt lalu" },
              { id: "TRX-003", user: "Toko Berkah", amount: "Rp 15.200.000", time: "45 mnt lalu" },
              { id: "TRX-004", user: "Pak Budi", amount: "Rp 850.000", time: "1 jam lalu" },
            ].map((trx, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-xl border border-border/50 bg-secondary/10">
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-slate-950">{trx.user}</span>
                  <span className="text-[10px] text-muted-foreground uppercase">{trx.id}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-primary">{trx.amount}</p>
                  <p className="text-[10px] text-muted-foreground">{trx.time}</p>
                </div>
              </div>
            ))}
            <Button variant="ghost" className="w-full text-xs font-bold text-muted-foreground" asChild>
              <Link href="/keuangan/pembayaran">Riwayat Lengkap →</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* AI Demand Insight */}
      <Card className="border-primary/10 bg-primary/[0.03]">
        <CardContent className="p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center border border-primary/10 shadow-sm">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-bold">AI Insight: Prediksi Lonjakan Permintaan</p>
              <p className="text-xs text-muted-foreground mt-0.5">Permintaan beras diprediksi naik 25% untuk shift besok pagi.</p>
            </div>
          </div>
          <Button size="sm" variant="outline" className="w-full sm:w-auto h-9 text-xs" asChild>
            <Link href="/ai/supply-demand">Lihat Rekomendasi Stok</Link>
          </Button>
        </CardContent>
      </Card>
      <DashboardLinks />
    </div>
  )
}
