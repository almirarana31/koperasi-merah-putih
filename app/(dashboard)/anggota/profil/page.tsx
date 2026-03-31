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
            <p className="text-sm text-muted-foreground">
              Ringkasan akun login untuk role <span className="font-medium text-foreground">{roleConfig.label}</span>.
            </p>
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

      <div className="grid gap-4 xl:grid-cols-[1.28fr_0.82fr]">
        <Card className="overflow-hidden border-red-200/70 bg-[linear-gradient(135deg,#be0817_0%,#d92827_54%,#aa2d2a_100%)] text-primary-foreground shadow-[0_28px_70px_-30px_rgba(133,18,23,0.55)]">
          <CardContent className="space-y-5 p-6">
            <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
              <div className="flex items-start gap-4">
                <Avatar className="h-20 w-20 border border-white/20">
                  <AvatarFallback className="bg-white/15 text-xl font-bold text-white">{initials(user.name)}</AvatarFallback>
                </Avatar>
                <div className="space-y-3">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-2xl font-bold">{user.name}</h2>
                      <Badge className="border-none bg-white/15 text-white">{preset.tier}</Badge>
                    </div>
                    <p className="mt-1 text-sm text-primary-foreground/80">{preset.accountType}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge className="border-none bg-white/15 text-white">{roleConfig.label}</Badge>
                    <Badge className="border-none bg-white/15 text-white">{SCOPE_LABELS[dataScope()]}</Badge>
                    <Badge className="border-none bg-white/15 text-white">Akun aktif</Badge>
                  </div>
                </div>
              </div>
              <div className="rounded-[1.5rem] border border-white/15 bg-white/10 p-4 backdrop-blur-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary-foreground/72">{preset.scoreLabel}</p>
                <p className="mt-2 text-3xl font-bold">{preset.scoreValue}</p>
                <p className="mt-1 text-sm text-primary-foreground/78">{preset.scoreState}</p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-[1.3rem] border border-white/12 bg-black/10 p-4">
                <div className="flex items-center gap-2 text-sm text-primary-foreground/78">
                  <Mail className="h-4 w-4" />
                  <span>{user.email}</span>
                </div>
                <div className="mt-3 flex items-center gap-2 text-sm text-primary-foreground/78">
                  <Phone className="h-4 w-4" />
                  <span>{preset.phone}</span>
                </div>
              </div>
              <div className="rounded-[1.3rem] border border-white/12 bg-black/10 p-4">
                <div className="flex items-center gap-2 text-sm text-primary-foreground/78">
                  <MapPin className="h-4 w-4" />
                  <span>{preset.address}</span>
                </div>
                <div className="mt-3 flex items-center gap-2 text-sm text-primary-foreground/78">
                  <Calendar className="h-4 w-4" />
                  <span>Bergabung {formatDate(preset.joinedAt)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status verifikasi akun</CardTitle>
            <CardDescription>Data ini sekarang mengikuti user login, bukan member demo statis.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-2xl border bg-secondary/35 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Role aktif</p>
              <p className="mt-2 text-lg font-semibold">{roleConfig.label}</p>
              <p className="text-sm text-muted-foreground">{roleConfig.description}</p>
            </div>
            <div className="grid gap-3">
              <div className="flex items-center justify-between rounded-2xl border p-3"><span className="text-sm font-medium">User ID</span><Badge variant="outline">{user.id}</Badge></div>
              {member && <div className="flex items-center justify-between rounded-2xl border p-3"><span className="text-sm font-medium">Member ID</span><Badge variant="outline">{member.id}</Badge></div>}
              {member && <div className="flex items-center justify-between rounded-2xl border p-3"><span className="text-sm font-medium">NIK</span><Badge variant="outline">{member.nik}</Badge></div>}
              <div className="flex items-center justify-between rounded-2xl border p-3"><span className="text-sm font-medium">Status akun</span><Badge className="bg-emerald-500 text-white">Aktif</Badge></div>
              <div className="flex items-center justify-between rounded-2xl border p-3"><span className="text-sm font-medium">Sinkron RBAC</span><Badge className="bg-blue-500 text-white">Ya</Badge></div>
            </div>
          </CardContent>
        </Card>
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
                <CardDescription>Prioritas berikut menyesuaikan role dan akun yang sedang dipakai.</CardDescription>
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
                <CardDescription>Header profil dan data pendukung ikut berubah saat role/account diganti.</CardDescription>
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
              <CardDescription>Daftar berikut difilter langsung dari RBAC untuk role yang sedang login.</CardDescription>
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
              <CardDescription>Feed ini menyesuaikan konteks kerja dari role dan user yang sedang aktif.</CardDescription>
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
                <CardDescription>Pinjaman yang cocok dengan akun/member login saat ini.</CardDescription>
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
              <CardDescription>Riwayat berikut ikut berubah sesuai akun yang sedang login.</CardDescription>
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
