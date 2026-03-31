'use client'

import Link from 'next/link'
import {
  ArrowRight,
  Bell,
  Brain,
  FileOutput,
  Lock,
  MapPinned,
  ShieldCheck,
  Sprout,
  Truck,
  Users,
  Wallet,
  Warehouse,
  ShoppingCart,
  Activity,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/auth'
import type { AccessLevel, DataScope, PanelKey } from '@/lib/rbac'

type ModuleDefinition = {
  key: PanelKey
  title: string
  description: string
  href: string
  icon: LucideIcon
}

type ShortcutDefinition = {
  title: string
  description: string
  href: string
  icon: LucideIcon
}

const SCOPE_LABELS: Record<DataScope, string> = {
  own: 'Data pribadi',
  koperasi: 'Level koperasi',
  district_aggregate: 'Agregat kabupaten',
  national_aggregate: 'Agregat nasional',
  all_koperasi: 'Seluruh koperasi',
}

const ACCESS_LABELS: Record<AccessLevel, string> = {
  full: 'Penuh',
  view_only: 'Lihat',
  aggregate: 'Agregat',
  own_only: 'Pribadi',
  today_only: 'Hari ini',
  consent_required: 'Perlu izin',
  none: 'Tidak ada',
}

const ACCESS_BADGES: Record<Exclude<AccessLevel, 'none'>, string> = {
  full: 'bg-primary/15 text-primary border-primary/20',
  view_only: 'bg-secondary text-secondary-foreground border-border',
  aggregate: 'bg-[color:var(--color-info)]/12 text-[color:var(--color-info)] border-[color:var(--color-info)]/20',
  own_only: 'bg-[color:var(--color-success)]/12 text-[color:var(--color-success)] border-[color:var(--color-success)]/20',
  today_only: 'bg-[color:var(--color-warning)]/14 text-[color:var(--color-warning-foreground)] border-[color:var(--color-warning)]/30',
  consent_required: 'bg-destructive/10 text-destructive border-destructive/20',
}

const MODULES: ModuleDefinition[] = [
  {
    key: 'produksi',
    title: 'Produksi',
    description: 'Pantau panen, rencana tanam, dan progres komoditas.',
    href: '/produksi',
    icon: Sprout,
  },
  {
    key: 'stok',
    title: 'Gudang',
    description: 'Kelola stok, grading, cold storage, dan traceability.',
    href: '/gudang',
    icon: Warehouse,
  },
  {
    key: 'penjualan',
    title: 'Pasar',
    description: 'Akses order, buyer, kontrak, dan harga pasar.',
    href: '/pasar',
    icon: ShoppingCart,
  },
  {
    key: 'logistik',
    title: 'Logistik',
    description: 'Lihat pengiriman, tracking, pickup, dan rute.',
    href: '/logistik',
    icon: Truck,
  },
  {
    key: 'cashflow',
    title: 'Keuangan',
    description: 'Tinjau transaksi, pinjaman, laporan, dan pembayaran.',
    href: '/keuangan',
    icon: Wallet,
  },
  {
    key: 'performa_anggota',
    title: 'Anggota',
    description: 'Lihat anggota, profil, verifikasi, dan onboarding.',
    href: '/anggota',
    icon: Users,
  },
  {
    key: 'performa_komoditas',
    title: 'AI & Komoditas',
    description: 'Gunakan forecast, grading, dan rekomendasi harga.',
    href: '/ai',
    icon: Brain,
  },
  {
    key: 'risiko',
    title: 'Pusat Kendali',
    description: 'Masuk ke ringkasan eksekutif dan pemantauan risiko.',
    href: '/command-center',
    icon: Activity,
  },
]

const SHORTCUTS: ShortcutDefinition[] = [
  {
    title: 'Notifikasi',
    description: 'Cek alert, approval, dan update terbaru.',
    href: '/assistant/notifikasi',
    icon: Bell,
  },
  {
    title: 'AI Assistant',
    description: 'Dapatkan bantuan operasional berbasis AI.',
    href: '/assistant',
    icon: Brain,
  },
  {
    title: 'Laporan Otomatis',
    description: 'Buka laporan yang tersedia untuk role Anda.',
    href: '/assistant/laporan',
    icon: FileOutput,
  },
]

export default function DashboardPage() {
  const { roleConfig, canRoute, canSeePanel, panelAccess, canExportAs, dataScope } = useAuth()

  if (!roleConfig) return null

  const scope = dataScope()
  const visibleModules = MODULES.filter((module) => canSeePanel(module.key) && canRoute(module.href)).map((module) => ({
    ...module,
    access: panelAccess(module.key),
  }))

  const visibleShortcuts = SHORTCUTS.filter((shortcut) => canRoute(shortcut.href))
  const hiddenModules = MODULES.filter((module) => !visibleModules.some((item) => item.key === module.key))
  const exportFormats = [canExportAs('pdf') ? 'PDF' : null, canExportAs('excel') ? 'Excel' : null].filter(Boolean)

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-primary/15 bg-card shadow-sm">
        <CardContent className="relative p-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(180,39,45,0.14),transparent_40%),linear-gradient(135deg,rgba(248,243,237,0.95),rgba(255,255,255,0.9))]" />
          <div className="relative grid gap-6 p-5 sm:p-6 lg:grid-cols-[1.5fr_1fr] lg:items-start">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
                  <span className="text-2xl leading-none">{roleConfig.icon}</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-primary">Dashboard Role-Based</p>
                  <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{roleConfig.label}</h1>
                </div>
              </div>

              <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
                {roleConfig.description}
              </p>

              <div className="flex flex-wrap gap-2">
                <Badge className="border border-primary/20 bg-primary/10 px-3 py-1 text-primary">
                  {SCOPE_LABELS[scope]}
                </Badge>
                <Badge variant="outline" className="px-3 py-1">
                  {visibleModules.length} modul aktif
                </Badge>
                <Badge variant="outline" className="px-3 py-1">
                  Ekspor: {exportFormats.length > 0 ? exportFormats.join(', ') : 'Tidak tersedia'}
                </Badge>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              <Card className="border-primary/10 bg-background/85 shadow-none">
                <CardContent className="p-4">
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">Jangkauan Data</p>
                  <p className="mt-2 text-lg font-semibold">{SCOPE_LABELS[scope]}</p>
                  <p className="mt-1 text-sm text-muted-foreground">Akses yang terlihat di UI sekarang mengikuti scope role Anda.</p>
                </CardContent>
              </Card>
              <Card className="border-primary/10 bg-background/85 shadow-none">
                <CardContent className="p-4">
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">Fitur Tersedia</p>
                  <p className="mt-2 text-lg font-semibold">{visibleModules.length + visibleShortcuts.length}</p>
                  <p className="mt-1 text-sm text-muted-foreground">Menu dan shortcut yang tidak relevan otomatis disembunyikan.</p>
                </CardContent>
              </Card>
              <Card className="border-primary/10 bg-background/85 shadow-none">
                <CardContent className="p-4">
                  <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">Status Akses</p>
                  <div className="mt-2 flex items-center gap-2 text-lg font-semibold">
                    <ShieldCheck className="h-5 w-5 text-primary" />
                    Terproteksi
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">Halaman tanpa izin akan hilang dari menu dan ditolak saat diakses langsung.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>

      <section className="space-y-3">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold sm:text-xl">Modul yang Bisa Anda Gunakan</h2>
            <p className="text-sm text-muted-foreground">Tampilan ini menyesuaikan route dan level akses role Anda.</p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {visibleModules.map((module) => {
            const Icon = module.icon

            return (
              <Card key={module.key} className="border-border/80 shadow-sm">
                <CardHeader className="space-y-4 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="min-w-0">
                        <CardTitle className="text-base sm:text-lg">{module.title}</CardTitle>
                        <CardDescription className="mt-1 text-sm">{module.description}</CardDescription>
                      </div>
                    </div>
                    <Badge
                      variant="outline"
                      className={ACCESS_BADGES[module.access as Exclude<AccessLevel, 'none'>]}
                    >
                      {ACCESS_LABELS[module.access]}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-col gap-4 p-5 pt-0">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPinned className="h-4 w-4 text-primary" />
                    {module.href}
                  </div>
                  <Button asChild className="w-full justify-between">
                    <Link href={module.href}>
                      Buka modul
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      <div className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Shortcut yang Relevan</CardTitle>
            <CardDescription>Hanya aksi yang masih bisa diakses oleh role Anda yang ditampilkan di sini.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {visibleShortcuts.map((shortcut) => {
              const Icon = shortcut.icon

              return (
                <Link
                  key={shortcut.href}
                  href={shortcut.href}
                  className="group rounded-2xl border border-border bg-secondary/35 p-4 transition-colors hover:border-primary/25 hover:bg-primary/5"
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="font-medium">{shortcut.title}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{shortcut.description}</p>
                      <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary">
                        Buka
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                      </span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Yang Tidak Ditampilkan</CardTitle>
            <CardDescription>UI menyembunyikan area yang bukan bagian dari tanggung jawab role Anda.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3 rounded-2xl border border-dashed border-border bg-secondary/35 p-4">
              <Lock className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
              <div>
                <p className="font-medium">{hiddenModules.length} modul dibatasi</p>
                <p className="text-sm text-muted-foreground">Halaman admin dan fitur lintas peran tidak lagi tampil di navigasi Anda.</p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {hiddenModules.map((module) => (
                <Badge key={module.key} variant="outline" className="bg-background">
                  {module.title}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
