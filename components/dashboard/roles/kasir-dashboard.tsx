"use client"

import { useState } from "react"
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
import { RecordTransactionDialog } from "@/components/dialogs/record-transaction-dialog"

const transactionData = [
  { time: "08:00", value: 12 },
  { time: "10:00", value: 25 },
  { time: "12:00", value: 42 },
  { time: "14:00", value: 38 },
  { time: "16:00", value: 54 },
  { time: "18:00", value: 22 },
]

export function KasirDashboard() {
  const [isRecordDialogOpen, setIsRecordDialogOpen] = useState(false)

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 px-1">
        <h2 className="text-2xl font-black tracking-tight text-slate-950 drop-shadow-sm">Operasional Kasir Harian</h2>
        <p className="text-slate-700 text-sm font-semibold drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]">Fokus pada transaksi, pembayaran, dan aliran order harian.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {/* Main Stats */}
        <Card className="border-slate-200 bg-white shadow-sm overflow-hidden">
          <CardContent className="p-6">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Total Kas Masuk (Hari Ini)</p>
            <p className="text-3xl font-black mt-2 text-[var(--dashboard-secondary)] tracking-tighter">Rp 52.450.000</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[10px] font-black bg-[var(--dashboard-secondary)]/10 text-[var(--dashboard-secondary)] px-2 py-0.5 rounded-full uppercase">+18% dari kemarin</span>
            </div>
            <div className="mt-6 flex gap-2">
              <Button 
                size="sm" 
                className="flex-1 rounded-xl bg-[var(--dashboard-secondary)] font-black text-[10px] uppercase tracking-widest text-white shadow-md shadow-slate-200 hover:bg-[#394B54]"
                onClick={() => setIsRecordDialogOpen(true)}
              >
                Input Transaksi
              </Button>
              <Button size="sm" variant="outline" className="flex-1 rounded-xl font-black text-[10px] uppercase tracking-widest border-slate-200 hover:bg-slate-50">Cetak Shift</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white shadow-sm overflow-hidden">
          <CardContent className="p-6">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Order Menunggu Pembayaran</p>
            <p className="text-3xl font-black mt-2 text-amber-600 tracking-tighter">18 PO</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[10px] font-black bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full uppercase">Total Rp 12.8jt</span>
            </div>
            <div className="mt-6">
              <Button size="sm" variant="secondary" className="w-full rounded-xl font-black text-[10px] uppercase tracking-widest bg-amber-100 text-amber-700 hover:bg-amber-200 border-none shadow-sm" asChild>
                <Link href="/pasar">Proses Order Sekarang</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white shadow-sm overflow-hidden">
          <CardContent className="p-6">
              <div className="mt-4">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.15em]">Status Stok Kritis</p>
                <p className="text-3xl font-black mt-1 text-slate-950 drop-shadow-sm tracking-tighter">4 Item</p>
              </div>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-[10px] font-black bg-rose-50 text-rose-600 px-2 py-0.5 rounded-full uppercase tracking-tight">Butuh restock segera</span>
            </div>
            <div className="mt-6">
              <Button size="sm" variant="ghost" className="w-full rounded-xl font-black text-[10px] uppercase tracking-widest text-rose-600 hover:bg-rose-50" asChild>
                <Link href="/gudang">Cek Inventori →</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        {/* Transaction Chart */}
        <Card className="border-slate-200 bg-white shadow-sm">
          <CardHeader className="pb-2 bg-slate-50/50 border-b border-slate-100">
            <CardTitle className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-900">Aliran Transaksi Per Jam</CardTitle>
            <CardDescription className="text-[10px] font-bold text-slate-500 uppercase">Jumlah transaksi yang diproses hari ini.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[280px] w-full mt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={transactionData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="time" fontSize={10} fontWeight={900} axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                  <YAxis fontSize={10} fontWeight={900} axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontSize: '12px' }} 
                    cursor={{ fill: '#f8fafc' }}
                  />
                  <Bar dataKey="value" fill="#be0817" radius={[6, 6, 0, 0]} isAnimationActive={false}>
                    {transactionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 4 ? '#be0817' : '#e2e8f0'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Transactions List */}
        <Card className="border-slate-200 bg-white shadow-sm overflow-hidden">
          <CardHeader className="pb-3 bg-slate-50/50 border-b border-slate-100">
            <CardTitle className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-900">Transaksi Terbaru</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100">
              {[
                { id: "TRX-001", user: "Pak Joko", amount: "Rp 1.250.000", time: "5 mnt lalu" },
                { id: "TRX-002", user: "Ibu Ani", amount: "Rp 450.000", time: "12 mnt lalu" },
                { id: "TRX-003", user: "Toko Berkah", amount: "Rp 15.200.000", time: "45 mnt lalu" },
                { id: "TRX-004", user: "Pak Budi", amount: "Rp 850.000", time: "1 jam lalu" },
              ].map((trx, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors group cursor-pointer">
                  <div className="flex flex-col">
                    <span className="text-xs font-black text-slate-900 uppercase group-hover:text-rose-600 transition-colors">{trx.user}</span>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{trx.id}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-slate-900">{trx.amount}</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase">{trx.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-3 bg-slate-50/30">
              <Button variant="ghost" className="w-full text-[10px] font-black text-slate-500 hover:text-rose-600 hover:bg-white uppercase tracking-widest transition-all" asChild>
                <Link href="/keuangan/pembayaran">Riwayat Lengkap →</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Demand Insight */}
      <Card className="border-rose-100 bg-rose-50/20 shadow-sm">
        <CardContent className="p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center border border-rose-100 shadow-sm">
              <Zap className="h-6 w-6 text-rose-600" />
            </div>
            <div>
              <p className="text-[11px] font-black text-rose-900 uppercase tracking-widest">AI Insight: Prediksi Lonjakan Permintaan</p>
              <p className="text-xs text-slate-600 font-bold mt-0.5 leading-tight">Permintaan beras diprediksi naik 25% untuk shift besok pagi.</p>
            </div>
          </div>
          <Button size="sm" variant="outline" className="w-full sm:w-auto h-10 px-6 font-black text-[10px] uppercase tracking-widest border-rose-200 text-rose-700 hover:bg-rose-50 shadow-sm" asChild>
            <Link href="/ai/supply-demand">Lihat Rekomendasi Stok</Link>
          </Button>
        </CardContent>
      </Card>
      <DashboardLinks />
      <RecordTransactionDialog 
        open={isRecordDialogOpen} 
        onOpenChange={setIsRecordDialogOpen} 
      />
    </div>
  )
}
