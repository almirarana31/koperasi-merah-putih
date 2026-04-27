'use client'

import { ClipboardCheck, ShieldCheck, TrendingUp, Wallet } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import Link from 'next/link'
import { DashboardLinks } from './dashboard-shared'
import { KpiCard } from '@/components/dashboard/kpi-card'
import { RoleHeader } from '@/components/dashboard/role-header'
import { AiInsightBanner } from '@/components/dashboard/ai-insight-banner'

const unitPerformance = [
  { name: 'Unit A', profit: 120, health: 92 },
  { name: 'Unit B', profit: 85, health: 88 },
  { name: 'Unit C', profit: 150, health: 95 },
  { name: 'Unit D', profit: 110, health: 82 },
]

const approvals = [
  { title: 'Anggaran Q2 2026', user: 'Manager Keuangan', type: 'Budget', time: '1 jam lalu' },
  { title: 'Kerjasama PT Pangan', user: 'Manager Pasar', type: 'Contract', time: '3 jam lalu' },
  { title: 'Pencairan SHU Tahap 1', user: 'Sistem', type: 'Payout', time: 'Hari ini' },
  { title: 'Investasi Cold Storage', user: 'Manager Logistik', type: 'CAPEX', time: 'Kemarin' },
]

export function KetuaDashboard() {
  return (
    <div className="page-shell">
      <RoleHeader
        title="Pengawasan Strategis Ketua Koperasi"
        subtitle="Monitor kinerja unit, risiko, dan ambil keputusan strategis."
      />

      <div className="grid gap-4 md:grid-cols-4">
        <KpiCard label="Total Aset" value="Rp 24.8M" change="+12%" trend="up" icon={Wallet} accent="tertiary" />
        <KpiCard label="Kesehatan Unit" value="92%" change="Sangat sehat" trend="up" icon={ShieldCheck} accent="success" />
        <KpiCard label="Profit Bersih" value="Rp 1.2M" change="+18%" trend="up" icon={TrendingUp} accent="warning" />
        <KpiCard label="Persetujuan" value="7 Masuk" change="Action needed" trend="up" icon={ClipboardCheck} accent="primary" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <Card className="card-accent card-accent-secondary">
          <CardHeader>
            <CardTitle>Kinerja Lintas Unit Kerja</CardTitle>
            <CardDescription>Perbandingan profitabilitas dan skor kesehatan unit.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={unitPerformance}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Legend verticalAlign="top" align="right" iconType="circle" />
                <Bar dataKey="profit" name="Profit (Juta)" fill="var(--dashboard-primary)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="health" name="Skor Kesehatan" fill="var(--success)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="card-accent card-accent-primary">
          <CardHeader>
            <CardTitle>Persetujuan Eksekutif</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-border">
              {approvals.map((app) => (
                <div key={app.title} className="group flex cursor-pointer flex-col py-3 transition-colors hover:bg-muted/50">
                  <div className="flex items-start justify-between">
                    <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary">
                      {app.type}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{app.time}</span>
                  </div>
                  <p className="mt-2 text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
                    {app.title}
                  </p>
                  <p className="text-xs text-muted-foreground">Diajukan oleh: {app.user}</p>
                </div>
              ))}
            </div>
            <div className="mt-3">
              <Button variant="ghost" className="w-full" asChild>
                <Link href="/command-center">Buka Pusat Kendali →</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <AiInsightBanner
        title="AI Strategy: Ekspansi Komoditas"
        description="Potensi profit naik 12% jika koperasi menambah kuota serapan jagung di wilayah Timur."
        action={
          <Button size="sm" variant="outline" asChild>
            <Link href="/ai/analisis-pasar">Lihat analisis pasar</Link>
          </Button>
        }
      />

      <DashboardLinks />
    </div>
  )
}
