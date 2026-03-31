'use client'

import Link from 'next/link'
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  BarChart3,
  Brain,
  Calendar,
  CheckCircle2,
  CreditCard,
  FileText,
  LayoutDashboard,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  ShoppingCart,
  Sprout,
  Truck,
  UserRound,
  Users,
  Wallet,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useAuth } from '@/lib/auth'
import { members, loans, formatCurrency, formatDate } from '@/lib/data'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

type Metric = {
  label: string
  value: string
  helper: string
  icon: LucideIcon
  accent: string
}

type Entry = {
  id: string
  title: string
  detail: string
  date: string
  status: string
}

type Preset = {
  phone: string
  address: string
  joinedAt: string
  accountType: string
  tier: string
  scoreLabel: string
  scoreValue: string
  scoreState: string
  scoreTone: 'emerald' | 'amber' | 'blue'
  metrics: Metric[]
  workstreams: string[]
  activities: Entry[]
  history: Entry[]
}

type QuickRoute = {
  label: string
  href: string
  icon: LucideIcon
}

const SCOPE_LABELS = {
  own: 'Data pribadi',
  koperasi: 'Level koperasi',
  district_aggregate: 'Agregat kabupaten',
  national_aggregate: 'Agregat nasional',
  all_koperasi: 'Seluruh koperasi',
} as const

const QUICK_ROUTES: QuickRoute[] = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Profil', href: '/anggota/profil', icon: UserRound },
  { label: 'Produksi', href: '/produksi', icon: Sprout },
  { label: 'Anggota', href: '/anggota', icon: Users },
  { label: 'Harga Pasar', href: '/pasar/harga', icon: ShoppingCart },
  { label: 'Pinjaman', href: '/keuangan/pinjaman', icon: Wallet },
  { label: 'Keuangan', href: '/keuangan', icon: CreditCard },
  { label: 'Laporan', href: '/keuangan/laporan', icon: FileText },
  { label: 'Command Center', href: '/command-center', icon: BarChart3 },
  { label: 'Logistik', href: '/logistik', icon: Truck },
  { label: 'AI', href: '/ai', icon: Brain },
]

const ACCOUNT_PRESETS: Record<string, Preset> = {
  'USR-001': {
    phone: '081234567894',
    address: 'Jl. Gudang No. 1, Cikupa, Tangerang',
    joinedAt: '2023-05-12',
    accountType: 'Anggota usaha tani dan pemasok gabah',
    tier: 'Gold',
    scoreLabel: 'Credit Score',
    scoreValue: '742',
    scoreState: 'Sangat baik',
    scoreTone: 'emerald',
    metrics: [
      { label: 'Total Simpanan', value: formatCurrency(8500000), helper: 'Saldo aktif akun ini', icon: Wallet, accent: 'bg-emerald-500/10 text-emerald-600' },
      { label: 'Sisa Pinjaman', value: formatCurrency(4500000), helper: 'Pinjaman produktif berjalan', icon: CreditCard, accent: 'bg-amber-500/10 text-amber-600' },
      { label: 'Belanja Musim Ini', value: formatCurrency(18600000), helper: 'Pupuk, benih, dan panen', icon: ShoppingCart, accent: 'bg-primary/10 text-primary' },
      { label: 'Loyalty Points', value: '4.500', helper: 'Aktivitas koperasi', icon: BadgeCheck, accent: 'bg-blue-500/10 text-blue-600' },
    ],
    workstreams: [
      'Catat panen dan rencana tanam milik sendiri.',
      'Pantau pinjaman serta simpanan pribadi.',
      'Bandingkan harga pasar sebelum menjual hasil panen.',
    ],
    activities: [
      { id: 'A1', title: 'Pengajuan pinjaman disetujui', detail: 'Pembiayaan pupuk masuk tahap pencairan.', date: '2026-03-28', status: 'Aktif' },
      { id: 'A2', title: 'Harga gabah naik', detail: 'Saran AI merekomendasikan menahan stok 3 hari.', date: '2026-03-24', status: 'Info' },
    ],
    history: [
      { id: 'H1', title: 'Pembayaran cicilan', detail: 'Cicilan Maret dibayar tepat waktu.', date: '2026-03-05', status: 'Tepat waktu' },
      { id: 'H2', title: 'Pencatatan panen', detail: 'Panen gabah 2.9 ton masuk ke akun pribadi.', date: '2026-02-10', status: 'Terverifikasi' },
    ],
  },
  'USR-004': {
    phone: '081223344501',
    address: 'Kantor Koperasi Merah Putih Sukamaju, Cianjur',
    joinedAt: '2022-01-10',
    accountType: 'Manajer operasional koperasi',
    tier: 'Executive',
    scoreLabel: 'Health Index',
    scoreValue: '91',
    scoreState: 'Stabil',
    scoreTone: 'blue',
    metrics: [
      { label: 'Anggota Aktif', value: '1.247', helper: 'Dalam pengelolaan harian', icon: Users, accent: 'bg-primary/10 text-primary' },
      { label: 'Laporan Siap', value: '12', helper: 'Dokumen operasional minggu ini', icon: FileText, accent: 'bg-blue-500/10 text-blue-600' },
      { label: 'Review Pinjaman', value: '4', helper: 'Menunggu tindak lanjut', icon: Wallet, accent: 'bg-amber-500/10 text-amber-600' },
      { label: 'Modul Utama', value: '5', helper: 'Area kerja inti', icon: BarChart3, accent: 'bg-emerald-500/10 text-emerald-600' },
    ],
    workstreams: [
      'Kelola onboarding dan verifikasi anggota.',
      'Pantau produksi, pembiayaan, dan laporan operasional.',
      'Dorong tindak lanjut lintas tim berdasarkan insight AI.',
    ],
    activities: [
      { id: 'A1', title: 'Verifikasi anggota baru', detail: '3 anggota siap ke onboarding akhir.', date: '2026-03-29', status: 'Aktif' },
      { id: 'A2', title: 'Laporan cashflow selesai', detail: 'Dokumen siap dibagikan ke ketua.', date: '2026-03-27', status: 'Selesai' },
    ],
    history: [
      { id: 'H1', title: 'Onboarding anggota', detail: 'Batch onboarding KTP selesai diverifikasi.', date: '2026-03-29', status: 'Selesai' },
      { id: 'H2', title: 'Rapat operasional', detail: 'Prioritas distribusi dan stok diperbarui.', date: '2026-03-20', status: 'Tercatat' },
    ],
  },
  'USR-005': {
    phone: '081223344502',
    address: 'Sekretariat Ketua Koperasi, Sukamaju',
    joinedAt: '2021-07-01',
    accountType: 'Ketua koperasi dan pengambil keputusan strategis',
    tier: 'Executive',
    scoreLabel: 'Governance Score',
    scoreValue: '94',
    scoreState: 'Sangat sehat',
    scoreTone: 'emerald',
    metrics: [
      { label: 'Persetujuan Masuk', value: '7', helper: 'Pinjaman dan kebijakan', icon: ShieldCheck, accent: 'bg-primary/10 text-primary' },
      { label: 'Risiko Fokus', value: '3', helper: 'Butuh keputusan strategis', icon: BarChart3, accent: 'bg-amber-500/10 text-amber-600' },
      { label: 'Laporan Penting', value: '5', helper: 'Siap ditinjau hari ini', icon: FileText, accent: 'bg-blue-500/10 text-blue-600' },
      { label: 'Health Score', value: '94/100', helper: 'Kesehatan koperasi', icon: BadgeCheck, accent: 'bg-emerald-500/10 text-emerald-600' },
    ],
    workstreams: [
      'Gunakan command center untuk membaca kondisi koperasi.',
      'Tinjau laporan, pembiayaan, dan risiko yang perlu keputusan.',
      'Arahkan strategi lintas unit berdasarkan insight pasar.',
    ],
    activities: [
      { id: 'A1', title: 'Tinjau laporan stakeholder', detail: 'Audit internal dan laporan dampak siap dibaca.', date: '2026-03-30', status: 'Baru' },
      { id: 'A2', title: 'Persetujuan pembiayaan prioritas', detail: '7 pengajuan menunggu keputusan akhir.', date: '2026-03-28', status: 'Aktif' },
    ],
    history: [
      { id: 'H1', title: 'Keputusan komite', detail: 'Persetujuan pembiayaan anggota diproses.', date: '2026-03-30', status: 'Disetujui' },
      { id: 'H2', title: 'Rapat strategi', detail: 'Arah kebijakan pasar Q2 diperbarui.', date: '2026-03-19', status: 'Tercatat' },
    ],
  },
  'USR-009': {
    phone: '081223344599',
    address: 'Pusat Operasi Platform DNA Desa, Jakarta',
    joinedAt: '2020-11-18',
    accountType: 'Administrator sistem lintas koperasi',
    tier: 'Root Access',
    scoreLabel: 'System Health',
    scoreValue: '99.8%',
    scoreState: 'Optimal',
    scoreTone: 'blue',
    metrics: [
      { label: 'Alert Kritis', value: '0', helper: 'Tidak ada gangguan tinggi', icon: ShieldCheck, accent: 'bg-emerald-500/10 text-emerald-600' },
      { label: 'Audit Log', value: '16', helper: 'Perlu ditinjau hari ini', icon: FileText, accent: 'bg-primary/10 text-primary' },
      { label: 'Latency', value: '42ms', helper: 'Stabil lintas modul', icon: BarChart3, accent: 'bg-blue-500/10 text-blue-600' },
      { label: 'Modul Aktif', value: '9', helper: 'Lintas sistem', icon: Brain, accent: 'bg-amber-500/10 text-amber-600' },
    ],
    workstreams: [
      'Pantau kesehatan sistem, latensi, dan alert lintas modul.',
      'Audit akses dan hak role di seluruh platform.',
      'Validasi alur anggota, keuangan, dan AI untuk troubleshooting cepat.',
    ],
    activities: [
      { id: 'A1', title: 'Audit role access', detail: 'Capability role selesai diverifikasi.', date: '2026-03-31', status: 'Selesai' },
      { id: 'A2', title: 'Pemantauan health platform', detail: 'Semua layanan utama normal tanpa alert kritis.', date: '2026-03-30', status: 'Normal' },
    ],
    history: [
      { id: 'H1', title: 'Role audit', detail: 'Hak akses lintas modul direview.', date: '2026-03-31', status: 'Selesai' },
      { id: 'H2', title: 'Validasi route guard', detail: 'Akses URL langsung diuji lintas role.', date: '2026-03-27', status: 'Terverifikasi' },
    ],
  },
}

function initials(name: string) {
  return name.split(' ').map((part) => part[0]).join('').slice(0, 2).toUpperCase()
}

function statusClass(status: string) {
  const value = status.toLowerCase()
  if (value.includes('setuju') || value.includes('normal') || value.includes('selesai') || value.includes('verifikasi') || value.includes('tepat')) return 'bg-emerald-500 text-white'
  if (value.includes('catat') || value.includes('info')) return 'bg-blue-500 text-white'
  return 'bg-amber-500 text-white'
}

function scoreToneClass(tone: Preset['scoreTone']) {
  if (tone === 'emerald') {
    return {
      value: 'text-emerald-500',
      badge: 'bg-emerald-500 text-white',
    }
  }

  if (tone === 'amber') {
    return {
      value: 'text-amber-500',
      badge: 'bg-amber-500 text-white',
    }
  }

  return {
    value: 'text-blue-500',
    badge: 'bg-blue-500 text-white',
  }
}

function fallbackPreset(user: NonNullable<ReturnType<typeof useAuth>['user']>): Preset {
  const member = members.find((item) => item.nama === user.name)
  const loan = loans.find((item) => item.memberNama === user.name || item.memberId === member?.id)
  return {
    phone: member?.noHp ?? 'Belum diatur',
    address: member ? `${member.alamat}, ${member.desa}, ${member.kecamatan}` : user.koperasiName ?? user.districtName ?? user.provinceName ?? 'Wilayah kerja belum diatur',
    joinedAt: member?.tanggalDaftar ?? '2023-01-01',
    accountType: 'Akun operasional koperasi',
    tier: 'Active',
    scoreLabel: 'Status Akun',
    scoreValue: 'Aktif',
    scoreState: 'Sinkron',
    scoreTone: 'blue',
    metrics: [
      { label: 'Role Aktif', value: user.role, helper: 'Role yang sedang digunakan', icon: ShieldCheck, accent: 'bg-primary/10 text-primary' },
      { label: 'Pinjaman Aktif', value: loan ? formatCurrency(loan.sisaPinjaman) : formatCurrency(0), helper: 'Jika ada pembiayaan terkait', icon: Wallet, accent: 'bg-amber-500/10 text-amber-600' },
      { label: 'Data Scope', value: 'RBAC', helper: 'Mengikuti aturan akses', icon: Users, accent: 'bg-blue-500/10 text-blue-600' },
      { label: 'Status Sinkron', value: 'Ya', helper: 'User login terbaca', icon: CheckCircle2, accent: 'bg-emerald-500/10 text-emerald-600' },
    ],
    workstreams: ['Pantau akun yang sedang login.', 'Gunakan modul sesuai role dan scope akses.', 'Buka dashboard untuk tindakan prioritas.'],
    activities: [{ id: 'A1', title: 'Akun aktif terdeteksi', detail: 'Profil dibuat dari user yang sedang login.', date: '2026-03-31', status: 'Aktif' }],
    history: [{ id: 'H1', title: 'Login akun', detail: 'Akun dipilih dari halaman role selector.', date: '2026-03-31', status: 'Aktif' }],
  }
}

export default function MemberProfilPage() {
  const { user, roleConfig, canRoute, dataScope } = useAuth()
  if (!user || !roleConfig) return null

  const member = members.find((item) => item.nama === user.name)
  const linkedLoans = loans.filter((item) => item.memberNama === user.name || item.memberId === member?.id)
  const preset = ACCOUNT_PRESETS[user.id] ?? fallbackPreset(user)
  const routes = QUICK_ROUTES.filter((route) => canRoute(route.href))
  const backHref = canRoute('/anggota') ? '/anggota' : '/dashboard'
  const title = user.role === 'petani' ? 'Profil Saya' : 'Profil Akun'
  const subtitle = user.role === 'petani'
    ? 'Informasi keanggotaan, pembiayaan, dan aktivitas akun Anda.'
    : 'Informasi akun, peran kerja, dan status akses saat ini.'
  const scoreTone = scoreToneClass(preset.scoreTone)

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild className="shrink-0">
            <Link href={backHref}>
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-xl font-bold tracking-tight sm:text-2xl">{title}</h1>
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {routes.slice(0, 2).map((route) => (
            <Button key={route.href} variant="outline" asChild className="w-full sm:w-auto">
              <Link href={route.href}>
                <route.icon className="mr-2 h-4 w-4" />
                {route.label}
              </Link>
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <Card className="border-border/80 shadow-[0_18px_40px_-30px_rgba(77,39,32,0.25)]">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col gap-6 xl:flex-row xl:items-start xl:justify-between">
              <div className="flex flex-1 flex-col gap-5 sm:flex-row sm:items-start">
                <Avatar className="h-20 w-20 border border-red-100 shadow-sm sm:h-24 sm:w-24">
                  <AvatarFallback className="bg-red-50 text-xl font-bold text-primary sm:text-2xl">{initials(user.name)}</AvatarFallback>
                </Avatar>

                <div className="min-w-0 flex-1 space-y-4">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">{user.name}</h2>
                      <Badge className="bg-red-50 text-primary">{preset.tier}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{preset.accountType}</p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Badge className="bg-primary text-primary-foreground">{roleConfig.label}</Badge>
                    <Badge variant="secondary">{SCOPE_LABELS[dataScope()]}</Badge>
                    <Badge variant="outline">Akun aktif</Badge>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border bg-secondary/20 p-4">
                      <div className="flex items-center gap-2 text-sm text-foreground">
                        <Mail className="h-4 w-4 text-primary" />
                        <span className="truncate">{user.email}</span>
                      </div>
                      <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="h-4 w-4 text-primary" />
                        <span>{preset.phone}</span>
                      </div>
                    </div>

                    <div className="rounded-2xl border bg-secondary/20 p-4">
                      <div className="flex items-center gap-2 text-sm text-foreground">
                        <MapPin className="h-4 w-4 text-primary" />
                        <span>{preset.address}</span>
                      </div>
                      <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4 text-primary" />
                        <span>Bergabung {formatDate(preset.joinedAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full rounded-[1.75rem] border bg-secondary/25 p-5 xl:max-w-[21rem]">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">{preset.scoreLabel}</p>
                <p className={`mt-3 text-4xl font-bold tracking-tight ${scoreTone.value}`}>{preset.scoreValue}</p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <Badge className={scoreTone.badge}>{preset.scoreState}</Badge>
                </div>
                <div className="mt-4 grid gap-2 text-sm text-muted-foreground">
                  <div className="flex items-center justify-between rounded-2xl bg-background px-3 py-2">
                    <span>User ID</span>
                    <span className="font-medium text-foreground">{user.id}</span>
                  </div>
                  {member && (
                    <div className="flex items-center justify-between rounded-2xl bg-background px-3 py-2">
                      <span>Member ID</span>
                      <span className="font-medium text-foreground">{member.id}</span>
                    </div>
                  )}
                </div>
                {canRoute('/keuangan/credit-scoring') && (
                  <Button asChild variant="outline" className="mt-4 w-full">
                    <Link href="/keuangan/credit-scoring">
                      Lihat detail skor
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
          <Card>
            <CardHeader>
              <CardTitle>Status verifikasi akun</CardTitle>
              <CardDescription>Status keanggotaan dan identitas utama akun.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
              <div className="flex items-center justify-between rounded-2xl border p-3">
                <span className="text-sm font-medium">Status akun</span>
                <Badge className="bg-emerald-500 text-white">Aktif</Badge>
              </div>
              <div className="flex items-center justify-between rounded-2xl border p-3">
                <span className="text-sm font-medium">Hak akses</span>
                <Badge className="bg-blue-500 text-white">Ya</Badge>
              </div>
              <div className="flex items-center justify-between rounded-2xl border p-3">
                <span className="text-sm font-medium">Role aktif</span>
                <Badge variant="outline">{roleConfig.label}</Badge>
              </div>
              <div className="flex items-center justify-between rounded-2xl border p-3">
                <span className="text-sm font-medium">Scope data</span>
                <Badge variant="outline">{SCOPE_LABELS[dataScope()]}</Badge>
              </div>
              {member && (
                <div className="flex items-center justify-between rounded-2xl border p-3">
                  <span className="text-sm font-medium">NIK</span>
                  <Badge variant="outline">{member.nik}</Badge>
                </div>
              )}
              <div className="flex items-center justify-between rounded-2xl border p-3">
                <span className="text-sm font-medium">Tier akun</span>
                <Badge className="bg-red-50 text-primary">{preset.tier}</Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ringkasan akses</CardTitle>
              <CardDescription>Peran utama akun ini di dalam koperasi.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-2xl border bg-secondary/35 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Deskripsi role</p>
                <p className="mt-2 text-lg font-semibold">{roleConfig.label}</p>
                <p className="text-sm text-muted-foreground">{roleConfig.description}</p>
              </div>
              <div className="rounded-2xl border bg-secondary/35 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Komoditas utama</p>
                <p className="mt-2 text-lg font-semibold">{member?.nama ?? user.name}</p>
                <p className="text-sm text-muted-foreground">
                  {member ? member.komoditas.join(', ') : 'Akun operasional koperasi'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-2 xl:grid-cols-4">
        {preset.metrics.map((metric) => (
          <Card key={metric.label}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${metric.accent}`}>
                  <metric.icon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-muted-foreground">{metric.label}</p>
                  <p className="truncate text-lg font-bold">{metric.value}</p>
                  <p className="text-xs text-muted-foreground">{metric.helper}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="ringkasan" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="ringkasan" className="text-xs sm:text-sm">Ringkasan</TabsTrigger>
          <TabsTrigger value="akses" className="text-xs sm:text-sm">Akses</TabsTrigger>
          <TabsTrigger value="aktivitas" className="text-xs sm:text-sm">Aktivitas</TabsTrigger>
          <TabsTrigger value="riwayat" className="text-xs sm:text-sm">Riwayat</TabsTrigger>
        </TabsList>

        <TabsContent value="ringkasan" className="mt-4 space-y-4">
          <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
            <Card>
              <CardHeader>
                <CardTitle>Fokus kerja akun ini</CardTitle>
                <CardDescription>Prioritas utama yang perlu diperhatikan saat ini.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {preset.workstreams.map((item) => (
                  <div key={item} className="flex items-start gap-3 rounded-2xl border bg-background p-4">
                    <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    <p className="text-sm text-foreground">{item}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Identitas terhubung</CardTitle>
                <CardDescription>Ringkasan identitas dan cakupan kerja akun.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-2xl border bg-secondary/35 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Nama akun</p>
                  <p className="mt-2 text-lg font-semibold">{user.name}</p>
                </div>
                <div className="rounded-2xl border bg-secondary/35 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Scope akses</p>
                  <p className="mt-2 text-lg font-semibold">{SCOPE_LABELS[dataScope()]}</p>
                </div>
                <div className="rounded-2xl border bg-secondary/35 p-4">
                  <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Data anggota terkait</p>
                  <p className="mt-2 text-lg font-semibold">{member?.nama ?? 'Tidak ada member link langsung'}</p>
                  {member && <p className="text-sm text-muted-foreground">{member.komoditas.join(', ')}</p>}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="akses" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Modul yang bisa dibuka akun ini</CardTitle>
              <CardDescription>Menu kerja yang tersedia untuk akun ini.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {routes.map((route) => (
                <Link key={route.href} href={route.href} className="flex items-center gap-3 rounded-2xl border bg-background p-4 transition-colors hover:border-primary/35 hover:bg-primary/[0.03]">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <route.icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-foreground">{route.label}</p>
                    <p className="text-xs text-muted-foreground">{route.href}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="aktivitas" className="mt-4 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Aktivitas terkini akun</CardTitle>
              <CardDescription>Aktivitas terbaru yang perlu dipantau.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {preset.activities.map((item) => (
                <div key={item.id} className="rounded-2xl border p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-semibold text-foreground">{item.title}</p>
                      <p className="mt-1 text-sm text-muted-foreground">{item.detail}</p>
                    </div>
                    <Badge variant="outline">{formatDate(item.date)}</Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {linkedLoans.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Pembiayaan terhubung</CardTitle>
                <CardDescription>Daftar pinjaman dan status pembiayaan aktif.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {linkedLoans.map((loan) => (
                  <div key={loan.id} className="rounded-2xl border p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-semibold">{loan.id}</p>
                        <p className="text-sm text-muted-foreground">{formatCurrency(loan.jumlahPinjaman)} • tenor {loan.tenor} bulan</p>
                      </div>
                      <Badge className={loan.status === 'lunas' ? 'bg-emerald-500 text-white' : 'bg-amber-500 text-white'}>
                        {loan.status === 'lunas' ? 'Lunas' : 'Aktif'}
                      </Badge>
                    </div>
                    <Separator className="my-3" />
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <span>Mulai: {formatDate(loan.tanggalPinjam)}</span>
                      <span>Jatuh tempo: {formatDate(loan.tanggalJatuhTempo)}</span>
                      <span>Sisa: {formatCurrency(loan.sisaPinjaman)}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="riwayat" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Riwayat akun</CardTitle>
              <CardDescription>Catatan aktivitas dan histori penting akun.</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Aktivitas</TableHead>
                      <TableHead>Detail</TableHead>
                      <TableHead>Tanggal</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {preset.history.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-mono text-xs">{item.id}</TableCell>
                        <TableCell className="font-medium">{item.title}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">{item.detail}</TableCell>
                        <TableCell>{formatDate(item.date)}</TableCell>
                        <TableCell><Badge className={statusClass(item.status)}>{item.status}</Badge></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
