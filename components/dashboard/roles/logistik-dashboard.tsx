'use client'

import { Clock, MapPin, TrendingUp, Truck, Warehouse } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import Link from 'next/link'
import { DashboardLinks } from './dashboard-shared'
import { KpiCard } from '@/components/dashboard/kpi-card'
import { RoleHeader } from '@/components/dashboard/role-header'
import { AiInsightBanner } from '@/components/dashboard/ai-insight-banner'

const deliveryData = [
  { day: 'Sen', value: 12 },
  { day: 'Sel', value: 18 },
  { day: 'Rab', value: 15 },
  { day: 'Kam', value: 24 },
  { day: 'Jum', value: 20 },
  { day: 'Sab', value: 28 },
  { day: 'Min', value: 10 },
]

const tracking = [
  { id: 'LOG-421', dest: 'Gudang Pusat', status: 'Perjalanan', time: '15 mnt lagi' },
  { id: 'LOG-422', dest: 'Unit Sukatani', status: 'Bongkar', time: 'Sedang proses' },
  { id: 'LOG-423', dest: 'PT Pangan', status: 'Pickup', time: '1 jam lalu' },
  { id: 'LOG-424', dest: 'Pasar Induk', status: 'Selesai', time: 'Hari ini' },
]

export function LogistikDashboard() {
  return (
    <div className="page-shell">
      <RoleHeader
        title="Koordinasi Logistik & Armada"
        subtitle="Monitor pengiriman, utilisasi armada, dan status gudang."
      />

      <div className="grid gap-4 md:grid-cols-4">
        <KpiCard label="Pengiriman Aktif" value="12 Rute" change="3 Pickup" trend="up" icon={Truck} accent="tertiary" />
        <KpiCard label="Utilisasi Armada" value="82%" change="+5%" trend="up" icon={TrendingUp} accent="success" />
        <KpiCard label="Antrean Kirim" value="9 Order" change="4 Urgent" trend="up" icon={Clock} accent="warning" />
        <KpiCard label="Status Gudang" value="75%" change="OK" trend="up" icon={Warehouse} accent="secondary" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <Card className="card-accent card-accent-tertiary">
          <CardHeader>
            <CardTitle>Volume Pengiriman Harian</CardTitle>
            <CardDescription>Total paket & komoditas terkirim minggu ini.</CardDescription>
          </CardHeader>
          <CardContent className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deliveryData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="value" fill="var(--dashboard-tertiary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="card-accent card-accent-secondary">
          <CardHeader>
            <CardTitle>Pelacakan Live</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-border">
              {tracking.map((ship) => (
                <div key={ship.id} className="group flex cursor-pointer items-center gap-3 py-3 transition-colors hover:bg-muted/50">
                  <div className="flex h-9 w-9 items-center justify-center rounded-md bg-[color:var(--dashboard-tertiary-soft)] text-[color:var(--dashboard-tertiary)]">
                    <MapPin className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
                      {ship.dest}
                    </p>
                    <p className="text-xs text-muted-foreground">{ship.id}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-[color:var(--dashboard-tertiary)]">{ship.status}</p>
                    <p className="text-xs text-muted-foreground">{ship.time}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3">
              <Button variant="ghost" className="w-full" asChild>
                <Link href="/logistik">Monitor semua armada →</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <AiInsightBanner
        title="AI Insight: Optimasi Rute Baru"
        description="3 rute pickup dapat digabung untuk menghemat BBM hingga 15%."
        action={
          <Button size="sm" variant="outline" asChild>
            <Link href="/ai/optimasi-rute">Terapkan rekomendasi</Link>
          </Button>
        }
      />

      <DashboardLinks />
    </div>
  )
}
