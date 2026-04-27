'use client'

import { useState } from 'react'
import {
  ArrowRight,
  ArrowUpRight,
  Brain,
  Calendar,
  CheckCircle2,
  Clock,
  ShoppingCart,
  Sprout,
  TrendingUp,
  Wallet,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Area, AreaChart, ResponsiveContainer } from 'recharts'
import Link from 'next/link'
import { DashboardLinks } from './dashboard-shared'
import { RoleHeader } from '@/components/dashboard/role-header'
import { LoanApplicationDialog } from '@/components/dialogs/loan-application-dialog'

const priceTrendData = [
  { day: 'Sen', harga: 12500 },
  { day: 'Sel', harga: 12800 },
  { day: 'Rab', harga: 13200 },
  { day: 'Kam', harga: 13000 },
  { day: 'Jum', harga: 13500 },
  { day: 'Sab', harga: 14200 },
  { day: 'Min', harga: 14500 },
]

const activities = [
  {
    icon: CheckCircle2,
    text: 'Verifikasi panen 1.2 ton disetujui koperasi',
    time: '1 jam lalu',
    iconClass: 'bg-success/10 text-[color:var(--success)]',
  },
  {
    icon: Clock,
    text: 'Jadwal pupuk susulan lahan B2',
    time: 'Besok, 08:00',
    iconClass: 'bg-warning/10 text-[color:var(--warning)]',
  },
  {
    icon: Wallet,
    text: 'Pencairan pinjaman modal Rp 5.000.000 berhasil',
    time: 'Kemarin',
    iconClass: 'bg-[color:var(--dashboard-tertiary-soft)] text-[color:var(--dashboard-tertiary)]',
  },
]

export function PetaniDashboard() {
  const [isLoanDialogOpen, setIsLoanDialogOpen] = useState(false)

  return (
    <div className="page-shell">
      <RoleHeader
        title="Pusat Kerja Petani"
        subtitle="Pantau panen, harga pasar, dan layanan keuangan Anda."
      />

      <div className="grid gap-4 md:grid-cols-3">
        {/* Hero — harvest status */}
        <Card className="md:col-span-2 card-accent card-accent-success relative overflow-hidden">
          <div className="pointer-events-none absolute right-6 top-6 opacity-10">
            <Sprout className="h-24 w-24 text-[color:var(--success)]" />
          </div>
          <CardContent>
            <div className="mb-4 flex items-center gap-2">
              <Badge variant="outline" className="border-success/30 bg-success/10 text-[color:var(--success)]">
                Panen aktif
              </Badge>
              <span className="text-xs text-muted-foreground">Update: 15 menit lalu</span>
            </div>
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <p className="metric-label">Estimasi hasil panen</p>
                <div className="mt-1 flex items-baseline gap-2">
                  <p className="metric-value text-4xl">
                    2.9 <span className="text-xl text-muted-foreground">ton</span>
                  </p>
                  <Badge variant="outline" className="border-success/30 bg-success/10 text-[color:var(--success)]">
                    <ArrowUpRight className="h-3 w-3" /> +12%
                  </Badge>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">Komoditas: Cabai Merah (Lahan A1)</p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-foreground">Kesiapan panen</span>
                  <span className="font-semibold text-[color:var(--success)]">85%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div className="h-full rounded-full bg-[color:var(--success)]" style={{ width: '85%' }} />
                </div>
                <p className="text-xs italic leading-snug text-muted-foreground">
                  AI memprediksi panen optimal dalam 4 hari berdasarkan cuaca & kelembaban.
                </p>
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              <Button asChild>
                <Link href="/produksi">Catat aktivitas panen</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/assistant">Tanya AI tani</Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick price card */}
        <Card className="card-accent card-accent-primary">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Harga Pasar</CardTitle>
              <ShoppingCart className="h-4 w-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="metric-value">
                Rp 14.500 <span className="text-xs text-muted-foreground">/kg</span>
              </p>
              <div className="mt-1 flex items-center gap-1.5 text-xs">
                <TrendingUp className="h-3 w-3 text-[color:var(--success)]" />
                <span className="font-medium text-[color:var(--success)]">Naik 6% hari ini</span>
              </div>
            </div>
            <div className="h-[80px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={priceTrendData}>
                  <defs>
                    <linearGradient id="petaniPrice" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--dashboard-primary)" stopOpacity={0.18} />
                      <stop offset="95%" stopColor="var(--dashboard-primary)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="harga"
                    stroke="var(--dashboard-primary)"
                    strokeWidth={2.5}
                    fill="url(#petaniPrice)"
                    isAnimationActive={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <Button variant="ghost" size="sm" className="group w-full" asChild>
              <Link href="/pasar/harga">
                Lihat komoditas <ArrowRight className="ml-1 h-3 w-3 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="card-accent card-accent-primary">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
                <Brain className="h-4 w-4" />
              </div>
              <CardTitle className="text-base">Rekomendasi AI</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="surface-card-muted space-y-1 p-3">
              <p className="text-xs font-semibold text-primary">Strategi jual</p>
              <p className="text-sm leading-snug">Tahan panen 3 hari lagi untuk potensi harga +Rp 1.200/kg.</p>
            </div>
            <div className="surface-card-muted space-y-1 p-3">
              <p className="text-xs font-semibold text-[color:var(--dashboard-tertiary)]">Peringatan cuaca</p>
              <p className="text-sm leading-snug">Hujan lebat diprediksi besok sore. Pastikan drainase lahan A1 aman.</p>
            </div>
            <Button variant="link" className="px-0 text-xs" asChild>
              <Link href="/ai">Lihat 4 insight lainnya →</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="card-accent card-accent-secondary lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Aktivitas & Notifikasi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {activities.map((item, i) => (
                <div key={i} className="flex items-start gap-3 border-b border-border pb-3 last:border-0 last:pb-0">
                  <div className={`mt-0.5 rounded-md p-2 ${item.iconClass}`}>
                    <item.icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm leading-snug text-foreground">{item.text}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardContent className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary/10 text-primary">
                <Wallet className="h-6 w-6" />
              </div>
              <div>
                <p className="metric-label">Sisa plafon pinjaman</p>
                <p className="text-xl font-semibold tabular-nums">Rp 12.500.000</p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={() => setIsLoanDialogOpen(true)}>
              Ajukan baru
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary/10 text-primary">
                <Calendar className="h-6 w-6" />
              </div>
              <div>
                <p className="metric-label">Simpanan pokok & wajib</p>
                <p className="text-xl font-semibold tabular-nums">Rp 4.250.000</p>
              </div>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/keuangan/shu">Detail SHU</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <DashboardLinks />
      <LoanApplicationDialog open={isLoanDialogOpen} onOpenChange={setIsLoanDialogOpen} />
    </div>
  )
}
