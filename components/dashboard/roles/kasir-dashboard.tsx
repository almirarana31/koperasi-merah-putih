'use client'

import { useState } from 'react'
import { Clock, ShoppingCart, Wallet, Warehouse, Zap } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import Link from 'next/link'
import { DashboardLinks } from './dashboard-shared'
import { RecordTransactionDialog } from '@/components/dialogs/record-transaction-dialog'
import { KpiCard } from '@/components/dashboard/kpi-card'
import { RoleHeader } from '@/components/dashboard/role-header'
import { AiInsightBanner } from '@/components/dashboard/ai-insight-banner'

const transactionData = [
  { time: '08:00', value: 12 },
  { time: '10:00', value: 25 },
  { time: '12:00', value: 42 },
  { time: '14:00', value: 38 },
  { time: '16:00', value: 54 },
  { time: '18:00', value: 22 },
]

const recentTransactions = [
  { id: 'TRX-001', user: 'Pak Joko', amount: 'Rp 1.250.000', time: '5 mnt lalu' },
  { id: 'TRX-002', user: 'Ibu Ani', amount: 'Rp 450.000', time: '12 mnt lalu' },
  { id: 'TRX-003', user: 'Toko Berkah', amount: 'Rp 15.200.000', time: '45 mnt lalu' },
  { id: 'TRX-004', user: 'Pak Budi', amount: 'Rp 850.000', time: '1 jam lalu' },
]

export function KasirDashboard() {
  const [isRecordDialogOpen, setIsRecordDialogOpen] = useState(false)
  const peakIndex = transactionData.reduce(
    (best, item, idx) => (item.value > transactionData[best].value ? idx : best),
    0,
  )

  return (
    <div className="page-shell">
      <RoleHeader
        title="Operasional Kasir Harian"
        subtitle="Fokus pada transaksi, pembayaran, dan aliran order harian."
      />

      <div className="grid gap-4 md:grid-cols-3">
        <KpiCard
          label="Total Kas Masuk (Hari Ini)"
          value="Rp 52.450.000"
          change="+18% dari kemarin"
          trend="up"
          icon={Wallet}
          accent="primary"
        />
        <KpiCard
          label="Order Menunggu Pembayaran"
          value="18 PO"
          change="Total Rp 12.8jt"
          trend="neutral"
          icon={ShoppingCart}
          accent="warning"
        />
        <KpiCard
          label="Status Stok Kritis"
          value="4 Item"
          change="Butuh restock"
          trend="down"
          icon={Warehouse}
          accent="danger"
        />
      </div>

      <div className="flex flex-wrap gap-2">
        <Button onClick={() => setIsRecordDialogOpen(true)}>Input transaksi</Button>
        <Button variant="outline">Cetak shift</Button>
        <Button variant="outline" asChild>
          <Link href="/pasar">Proses order</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/gudang">Cek inventori</Link>
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <Card className="card-accent card-accent-secondary">
          <CardHeader>
            <CardTitle>Aliran Transaksi per Jam</CardTitle>
            <CardDescription>Jumlah transaksi yang diproses hari ini.</CardDescription>
          </CardHeader>
          <CardContent className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={transactionData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="time" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {transactionData.map((_, index) => (
                    <Cell
                      key={index}
                      fill={index === peakIndex ? 'var(--dashboard-primary)' : 'var(--dashboard-secondary)'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="card-accent card-accent-tertiary">
          <CardHeader>
            <CardTitle>Transaksi Terbaru</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-border">
              {recentTransactions.map((trx) => (
                <div key={trx.id} className="group flex cursor-pointer items-center justify-between py-3 transition-colors hover:bg-muted/50">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
                      {trx.user}
                    </p>
                    <p className="text-xs text-muted-foreground">{trx.id}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold tabular-nums">{trx.amount}</p>
                    <p className="text-xs text-muted-foreground">{trx.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3">
              <Button variant="ghost" className="w-full" asChild>
                <Link href="/keuangan/pembayaran">Riwayat lengkap →</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <AiInsightBanner
        title="AI Insight: Prediksi Lonjakan Permintaan"
        description="Permintaan beras diprediksi naik 25% untuk shift besok pagi."
        action={
          <Button size="sm" variant="outline" asChild>
            <Link href="/ai/supply-demand">Lihat rekomendasi stok</Link>
          </Button>
        }
      />

      <DashboardLinks />
      <RecordTransactionDialog open={isRecordDialogOpen} onOpenChange={setIsRecordDialogOpen} />
    </div>
  )
}
