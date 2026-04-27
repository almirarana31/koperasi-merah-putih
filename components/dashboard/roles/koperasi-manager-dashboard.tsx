'use client'

import {
  ArrowRight,
  BarChart3,
  ChevronRight,
  ClipboardCheck,
  Sprout,
  Users,
  Wallet,
  Zap,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import Link from 'next/link'
import { DashboardLinks } from './dashboard-shared'
import { KpiCard } from '@/components/dashboard/kpi-card'
import { RoleHeader } from '@/components/dashboard/role-header'

const memberGrowthData = [
  { month: 'Jan', aktif: 850, onboarding: 45 },
  { month: 'Feb', aktif: 920, onboarding: 68 },
  { month: 'Mar', aktif: 1050, onboarding: 82 },
  { month: 'Apr', aktif: 1120, onboarding: 55 },
  { month: 'Mei', aktif: 1247, onboarding: 94 },
]

const tasks = [
  { title: 'Verifikasi Panen — Unit Sukatani', desc: '1.5 ton beras menanti validasi gudang.', time: '30 mnt lalu', status: 'New' as const },
  { title: 'Onboarding Anggota — 8 Orang', desc: 'Dokumen KTP belum lengkap untuk 3 orang.', time: '2 jam lalu', status: 'Tertunda' as const },
  { title: 'Persetujuan Pinjaman', desc: 'Ajukan Rp 15jt dari Pak Budi (Unit A).', time: '5 jam lalu', status: 'Urgent' as const },
]

const STATUS_CLASS: Record<typeof tasks[number]['status'], string> = {
  Urgent: 'border-destructive/30 bg-destructive/10 text-destructive',
  New: 'border-tertiary/30 bg-[color:var(--dashboard-tertiary-soft)] text-[color:var(--dashboard-tertiary)]',
  Tertunda: 'border-border bg-muted text-muted-foreground',
}

const quickLinks = [
  { href: '/ai/forecast', icon: Zap, title: 'AI Forecast', description: 'Prediksi stok 30 hari.' },
  { href: '/keuangan/laporan', icon: BarChart3, title: 'Laporan Keuangan', description: 'Monitor P&L & cashflow.' },
  { href: '/anggota', icon: Users, title: 'Basis Data Anggota', description: 'Profil & behavior tani.' },
]

export function KoperasiManagerDashboard() {
  return (
    <div className="page-shell">
      <RoleHeader
        title="Kendali Operasional Koperasi"
        subtitle="Kelola anggota, produksi, dan cashflow unit Anda hari ini."
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Anggota Aktif" value="1.247" change="+12%" trend="up" icon={Users} accent="tertiary" />
        <KpiCard label="Total Produksi" value="42.5 Ton" change="+8%" trend="up" icon={Sprout} accent="success" />
        <KpiCard label="Kas Masuk" value="Rp 542jt" change="+15%" trend="up" icon={Wallet} accent="warning" />
        <KpiCard label="Loan Pending" value="12 Berkas" change="4 Baru" trend="up" icon={ClipboardCheck} accent="primary" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="card-accent card-accent-secondary">
          <CardHeader>
            <CardTitle>Pertumbuhan Anggota</CardTitle>
            <CardDescription>Tren penambahan & keaktifan anggota 5 bulan terakhir.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={memberGrowthData}>
                <defs>
                  <linearGradient id="kmAktif" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--dashboard-primary)" stopOpacity={0.18} />
                    <stop offset="95%" stopColor="var(--dashboard-primary)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="kmOnboarding" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--dashboard-tertiary)" stopOpacity={0.18} />
                    <stop offset="95%" stopColor="var(--dashboard-tertiary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="aktif" stroke="var(--dashboard-primary)" fill="url(#kmAktif)" strokeWidth={2.5} />
                <Area type="monotone" dataKey="onboarding" stroke="var(--dashboard-tertiary)" fill="url(#kmOnboarding)" strokeWidth={2.5} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="card-accent card-accent-primary">
          <CardHeader>
            <CardTitle>Tugas Perlu Tindakan</CardTitle>
            <CardDescription>Daftar verifikasi dan persetujuan mendesak.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-border">
              {tasks.map((item) => (
                <div key={item.title} className="group cursor-pointer py-3 transition-colors hover:bg-muted/50">
                  <div className="flex items-start justify-between">
                    <Badge variant="outline" className={STATUS_CLASS[item.status]}>
                      {item.status}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{item.time}</span>
                  </div>
                  <p className="mt-2 text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
                    {item.title}
                  </p>
                  <p className="line-clamp-1 text-xs text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
            <div className="mt-3">
              <Button variant="ghost" className="w-full" asChild>
                <Link href="/anggota/verifikasi">
                  Lihat semua tugas <ChevronRight className="ml-1 h-3 w-3" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {quickLinks.map((link) => (
          <Link key={link.href} href={link.href} className="group">
            <Card className="transition-colors hover:border-primary/40">
              <CardContent className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                  <link.icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground">{link.title}</p>
                  <p className="truncate text-xs text-muted-foreground">{link.description}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <DashboardLinks />
    </div>
  )
}
