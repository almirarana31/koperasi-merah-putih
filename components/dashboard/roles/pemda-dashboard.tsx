'use client'

import { Building2, MapPin, Sprout, TrendingUp, Truck } from 'lucide-react'
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

const regionalProduction = [
  { area: 'Kec. A', beras: 450, cabai: 120 },
  { area: 'Kec. B', beras: 520, cabai: 95 },
  { area: 'Kec. C', beras: 380, cabai: 150 },
  { area: 'Kec. D', beras: 610, cabai: 80 },
]

const cooperatives = [
  { name: 'Kop. Sukatani', area: 'Kec. A', volume: '450 Ton', status: 'Gold' },
  { name: 'Kop. Berkah', area: 'Kec. B', volume: '320 Ton', status: 'Silver' },
  { name: 'Kop. Mandiri', area: 'Kec. D', volume: '285 Ton', status: 'Silver' },
  { name: 'Kop. Tani Jaya', area: 'Kec. C', volume: '150 Ton', status: 'Active' },
]

export function PemdaDashboard() {
  return (
    <div className="page-shell">
      <RoleHeader
        title="Monitoring Daerah (Kabupaten)"
        subtitle="Pantau produksi agregat dan pergerakan komoditas lintas wilayah."
      />

      <div className="grid gap-4 md:grid-cols-4">
        <KpiCard label="Total Produksi" value="1.4k Ton" change="+15%" trend="up" icon={Sprout} accent="success" />
        <KpiCard label="Koperasi Aktif" value="42 Unit" change="+2 baru" trend="up" icon={Building2} accent="tertiary" />
        <KpiCard label="Distribusi" value="Stabil" change="OK" trend="neutral" icon={Truck} accent="secondary" />
        <KpiCard label="Harga Rata-rata" value="Rp 12.8k" change="+4%" trend="up" icon={TrendingUp} accent="warning" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <Card className="card-accent card-accent-secondary">
          <CardHeader>
            <CardTitle>Produksi per Kecamatan</CardTitle>
            <CardDescription>Perbandingan hasil panen utama antar wilayah.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regionalProduction}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="area" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Legend verticalAlign="top" align="right" iconType="circle" />
                <Bar dataKey="beras" name="Beras" fill="var(--dashboard-tertiary)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="cabai" name="Cabai" fill="var(--dashboard-primary)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="card-accent card-accent-success">
          <CardHeader>
            <CardTitle>Koperasi Unggulan</CardTitle>
            <CardDescription>Berdasarkan volume & kepatuhan.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-border">
              {cooperatives.map((kop) => (
                <div key={kop.name} className="group flex cursor-pointer items-center justify-between py-3 transition-colors hover:bg-muted/50">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
                      {kop.name}
                    </p>
                    <p className="text-xs text-muted-foreground">{kop.area}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-[color:var(--success)]">{kop.volume}</p>
                    <Badge variant="outline" className="mt-1 text-xs">{kop.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3">
              <Button variant="ghost" className="w-full" asChild>
                <Link href="/produksi/agregasi">Detail wilayah →</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="card-accent card-accent-tertiary">
        <CardContent className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-md bg-[color:var(--dashboard-tertiary-soft)] text-[color:var(--dashboard-tertiary)]">
              <MapPin className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Visualisasi Geografis</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Buka peta interaktif untuk melihat titik sebaran produksi & logistik.
              </p>
            </div>
          </div>
          <Button size="sm" variant="outline" asChild>
            <Link href="/logistik">Buka peta dashboard</Link>
          </Button>
        </CardContent>
      </Card>

      <DashboardLinks />
    </div>
  )
}
