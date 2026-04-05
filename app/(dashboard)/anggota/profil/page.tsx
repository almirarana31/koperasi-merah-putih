'use client'

import { useState, useMemo } from 'react'
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
  Activity,
  ShieldAlert,
  Globe,
  Settings,
  Search,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useAuth } from '@/lib/auth/use-auth'
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
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { KementerianFilterBar } from '@/components/dashboard/kementerian-filter-bar'
import { ScopeFilters } from '@/lib/kementerian-dashboard-data'

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

function fallbackPreset(user: any): Preset {
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
  const isKementerian = user?.role === 'kementerian'
  
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<ScopeFilters>({
    provinceId: 'all',
    regionId: 'all',
    villageId: 'all',
    cooperativeId: 'all',
    commodityId: 'all',
  })

  if (!user || !roleConfig) return null

  // When ministry, they can explore other profiles
  const activeProfileId = isKementerian ? (selectedUserId || user.id) : user.id
  const preset = ACCOUNT_PRESETS[activeProfileId] ?? fallbackPreset(user)
  const scoreTone = scoreToneClass(preset.scoreTone)

  const member = members.find((item) => item.nama === user.name)
  const linkedLoans = loans.filter((item) => item.memberNama === user.name || item.memberId === member?.id)

  return (
    <div className="space-y-6">
       {/* Header Section */}
       <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-slate-900 flex items-center justify-center shadow-xl">
            <UserRound className="h-6 w-6 text-emerald-500" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 uppercase">
              {isKementerian ? 'Penjelajah Profil & Akses' : 'Profil Akun Saya'}
            </h1>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
              {isKementerian 
                ? 'Monitoring Hak Akses & Aktivitas Personel Lintas Entitas' 
                : 'Informasi Keanggotaan, Pembiayaan, dan Aktivitas Akun Anda'}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
           <Button variant="outline" size="sm" className="h-10 text-[10px] font-black uppercase tracking-widest text-slate-600 border-slate-200">
            <Settings className="h-4 w-4 mr-2" />
            Pengaturan
          </Button>
          <Button size="sm" className="h-10 bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-black uppercase tracking-widest px-6 shadow-lg">
            <Activity className="h-4 w-4 mr-2" />
            Audit Aktivitas
          </Button>
        </div>
      </div>

      {isKementerian && (
        <>
          <KementerianFilterBar filters={filters} setFilters={setFilters} />
          
          <Card className="border-none shadow-sm bg-slate-50/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                 <div className="relative flex-1">
                   <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                   <Input 
                    placeholder="CARI PERSONEL BERDASARKAN NAMA ATAU ROLE..." 
                    className="pl-9 bg-white h-11 border-slate-200 text-[11px] font-bold uppercase tracking-wider"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                   />
                 </div>
                 <Select value={selectedUserId || ''} onValueChange={setSelectedUserId}>
                    <SelectTrigger className="w-64 h-11 border-slate-200 bg-white font-black text-[10px] uppercase">
                       <SelectValue placeholder="PILIH AKUN SAMPLE" />
                    </SelectTrigger>
                    <SelectContent className="font-bold text-[10px] uppercase">
                       <SelectItem value="USR-009">USR-009: ROOT ADMIN (SYSTEM)</SelectItem>
                       <SelectItem value="USR-005">USR-005: KETUA KOPERASI (SUKAMAJU)</SelectItem>
                       <SelectItem value="USR-004">USR-004: MANAJER (SUKAMAJU)</SelectItem>
                       <SelectItem value="USR-001">USR-001: ANGGOTA (TANGERANG)</SelectItem>
                    </SelectContent>
                 </Select>
              </div>
            </CardContent>
          </Card>
        </>
      )}

      {/* Profile Header Card - Executive Style */}
      <Card className="border-none shadow-xl overflow-hidden bg-white border-t-8 border-t-slate-900">
        <CardContent className="p-8">
          <div className="flex flex-col gap-8 xl:flex-row xl:items-start">
             <div className="flex flex-1 flex-col gap-6 sm:flex-row sm:items-start">
                <Avatar className="h-28 w-28 rounded-2xl border-4 border-slate-50 shadow-xl shrink-0">
                  <AvatarFallback className="bg-slate-900 text-white text-3xl font-black">
                    {initials(user.name)}
                  </AvatarFallback>
                </Avatar>

                <div className="min-w-0 flex-1 space-y-4">
                   <div>
                     <div className="flex flex-wrap items-center gap-3">
                        <h2 className="text-3xl font-black tracking-tighter text-slate-900 uppercase leading-none">
                          {activeProfileId === user.id ? user.name : `EXPLORING: ${activeProfileId}`}
                        </h2>
                        <Badge className="bg-emerald-100 text-emerald-700 font-black text-[10px] uppercase tracking-widest px-2 py-1 border-none shadow-sm">
                          {preset.tier}
                        </Badge>
                     </div>
                     <p className="text-[11px] font-bold text-slate-500 uppercase tracking-[0.15em] mt-2">
                       {preset.accountType}
                     </p>
                   </div>

                   <div className="flex flex-wrap gap-2 pt-2">
                     <Badge className="bg-slate-900 text-white font-black text-[9px] uppercase tracking-widest h-6">{roleConfig.label}</Badge>
                     <Badge variant="outline" className="border-slate-200 text-slate-500 font-black text-[9px] uppercase tracking-widest h-6">RBAC: {dataScope()}</Badge>
                     <Badge className="bg-blue-600 text-white font-black text-[9px] uppercase tracking-widest h-6">STATUS: AKTIF</Badge>
                   </div>

                   <div className="grid gap-4 sm:grid-cols-2 mt-6">
                      <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4 group hover:border-slate-300 transition-all">
                        <div className="flex items-center gap-3">
                           <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center shadow-sm">
                             <Mail className="h-4 w-4 text-slate-400 group-hover:text-blue-600" />
                           </div>
                           <span className="text-[11px] font-bold text-slate-900 truncate">{user.email}</span>
                        </div>
                        <div className="mt-4 flex items-center gap-3">
                           <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center shadow-sm">
                             <Phone className="h-4 w-4 text-slate-400 group-hover:text-emerald-600" />
                           </div>
                           <span className="text-[11px] font-black text-slate-900 tracking-widest">{preset.phone}</span>
                        </div>
                      </div>

                      <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4 group hover:border-slate-300 transition-all">
                         <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center shadow-sm">
                              <MapPin className="h-4 w-4 text-slate-400 group-hover:text-rose-600" />
                            </div>
                            <span className="text-[11px] font-bold text-slate-600 uppercase tracking-tight leading-tight">{preset.address}</span>
                         </div>
                         <div className="mt-4 flex items-center gap-3">
                            <div className="h-8 w-8 rounded-lg bg-white flex items-center justify-center shadow-sm">
                              <Calendar className="h-4 w-4 text-slate-400 group-hover:text-amber-600" />
                            </div>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">JOINED {formatDate(preset.joinedAt)}</span>
                         </div>
                      </div>
                   </div>
                </div>
             </div>

             <div className="w-full rounded-3xl bg-slate-900 p-6 xl:max-w-[21rem] shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                   <Activity className="h-32 w-32 text-white" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">{preset.scoreLabel}</p>
                <p className={`mt-4 text-5xl font-black tracking-tighter ${scoreTone.value}`}>{preset.scoreValue}</p>
                <div className="mt-4 flex items-center gap-2">
                   <Badge className={`${scoreTone.badge} font-black text-[10px] uppercase border-none h-6`}>
                     {preset.scoreState}
                   </Badge>
                   <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                </div>
                
                <div className="mt-8 space-y-2">
                   <div className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3 border border-white/10">
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">USER AUTH ID</span>
                      <span className="font-mono text-[11px] font-bold text-white uppercase">{activeProfileId}</span>
                   </div>
                   {member && (
                      <div className="flex items-center justify-between rounded-xl bg-white/5 px-4 py-3 border border-white/10">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">MEMBER DATA ID</span>
                        <span className="font-mono text-[11px] font-bold text-white uppercase">{member.id}</span>
                      </div>
                   )}
                </div>

                <Button className="mt-6 w-full h-12 bg-white text-slate-900 hover:bg-slate-100 font-black text-[11px] uppercase tracking-[0.1em] rounded-xl shadow-lg">
                  LIHAT DASHBOARD SKOR →
                </Button>
             </div>
          </div>
        </CardContent>
      </Card>

      {/* Metrics Row */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {preset.metrics.map((metric) => (
          <Card key={metric.label} className="border-none shadow-sm overflow-hidden bg-white">
            <CardContent className="p-4 flex items-center gap-4">
              <div className={`h-11 w-11 flex items-center justify-center rounded-xl shadow-inner ${metric.accent}`}>
                <metric.icon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{metric.label}</p>
                <p className="truncate text-lg font-black tracking-tighter text-slate-900 mt-0.5">{metric.value}</p>
                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">{metric.helper}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="ringkasan" className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-slate-100 p-1.5 h-12 rounded-2xl shadow-inner">
          <TabsTrigger value="ringkasan" className="text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-md rounded-xl">Ringkasan</TabsTrigger>
          <TabsTrigger value="akses" className="text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-md rounded-xl">Peta Akses</TabsTrigger>
          <TabsTrigger value="aktivitas" className="text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-md rounded-xl">Aktivitas</TabsTrigger>
          <TabsTrigger value="riwayat" className="text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-md rounded-xl">Audit Log</TabsTrigger>
        </TabsList>

        <TabsContent value="ringkasan" className="mt-6 space-y-6">
           <div className="grid gap-6 lg:grid-cols-2">
              <Card className="border-none shadow-sm">
                <CardHeader className="p-6 border-b border-slate-50">
                  <CardTitle className="text-xs font-black text-slate-900 uppercase tracking-widest">Fokus Kerja & KPI</CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-4">
                  {preset.workstreams.map((item, i) => (
                    <div key={i} className="flex items-start gap-4 p-4 rounded-2xl border border-slate-100 bg-slate-50/30 group hover:border-slate-300 transition-all">
                       <div className="h-8 w-8 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0">
                         <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                       </div>
                       <p className="text-[11px] font-bold text-slate-700 leading-relaxed uppercase tracking-tight">{item}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="border-none shadow-sm overflow-hidden">
                <CardHeader className="p-6 border-b border-slate-50">
                  <CardTitle className="text-xs font-black text-slate-900 uppercase tracking-widest">Pemetaan Hirarki</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                   <div className="divide-y divide-slate-50">
                      {[
                        { label: 'Induk Organisasi', val: 'DNA Desa Platform', sub: 'Root Entity' },
                        { label: 'Wilayah Kerja', val: preset.address, sub: 'Operation Scope' },
                        { label: 'Unit Terhubung', val: member?.nama || 'Akun Operasional', sub: 'Direct Link' },
                      ].map((h, i) => (
                        <div key={i} className="px-6 py-5 bg-white flex items-center justify-between group cursor-default">
                           <div>
                             <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">{h.label}</p>
                             <p className="text-[11px] font-black text-slate-900 uppercase mt-1 group-hover:text-blue-600 transition-colors">{h.val}</p>
                           </div>
                           <Badge variant="outline" className="text-[8px] font-black text-slate-400 border-slate-200">{h.sub}</Badge>
                        </div>
                      ))}
                   </div>
                   <div className="p-4 bg-slate-50 border-t border-slate-100">
                      <div className="flex items-center gap-2">
                        <Globe className="h-3 w-3 text-blue-600" />
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Akses Multi-Entitas: AKTIF</span>
                      </div>
                   </div>
                </CardContent>
              </Card>
           </div>
        </TabsContent>

        <TabsContent value="akses" className="mt-6">
           <Card className="border-none shadow-sm">
              <CardHeader className="p-6 border-b border-slate-50">
                 <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xs font-black text-slate-900 uppercase tracking-widest">Modul Terotorisasi</CardTitle>
                      <CardDescription className="text-[10px] font-bold text-slate-400 uppercase mt-1">Daftar endpoint sistem yang dapat diakses oleh role ini</CardDescription>
                    </div>
                    <Badge className="bg-blue-100 text-blue-700 font-black text-[9px] px-2 h-5">ACL: SYNCED</Badge>
                 </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {['Dashboard', 'Profil', 'Produksi', 'Anggota', 'Logistik', 'Keuangan', 'AI Suite'].map((m) => (
                    <div key={m} className="p-4 rounded-xl border border-slate-100 bg-white flex items-center justify-between group hover:border-slate-900 hover:bg-slate-900 transition-all cursor-pointer">
                       <span className="text-[10px] font-black text-slate-900 uppercase group-hover:text-white">{m}</span>
                       <ShieldCheck className="h-4 w-4 text-emerald-500" />
                    </div>
                  ))}
                </div>
              </CardContent>
           </Card>
        </TabsContent>

        <TabsContent value="aktivitas" className="mt-6">
          <div className="grid gap-6">
            <Card className="border-none shadow-sm">
              <CardHeader className="p-6 border-b border-slate-50">
                <CardTitle className="text-xs font-black text-slate-900 uppercase tracking-widest">Monitoring Interaksi Terkini</CardTitle>
              </CardHeader>
              <CardContent className="p-6 space-y-4">
                {preset.activities.map((item) => (
                  <div key={item.id} className="p-5 rounded-2xl border border-slate-100 bg-white shadow-sm flex items-center justify-between group hover:border-slate-900 transition-all">
                    <div className="flex items-center gap-5">
                       <div className="h-10 w-10 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
                         <Activity className="h-5 w-5 text-blue-600" />
                       </div>
                       <div>
                         <p className="text-xs font-black text-slate-900 uppercase tracking-tight group-hover:text-blue-600">{item.title}</p>
                         <p className="text-[10px] font-bold text-slate-500 uppercase mt-1 leading-tight">{item.detail}</p>
                       </div>
                    </div>
                    <div className="text-right">
                       <Badge variant="outline" className="text-[9px] font-black text-slate-400 border-slate-200 uppercase h-5">{formatDate(item.date)}</Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="riwayat" className="mt-6">
           <Card className="border-none shadow-sm overflow-hidden">
              <CardHeader className="p-6 border-b border-slate-50 bg-slate-900">
                <CardTitle className="text-[10px] font-black text-white uppercase tracking-[0.2em] flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4 text-rose-500" /> Executive Audit Trail
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-slate-50">
                      <TableRow className="hover:bg-slate-50 border-none">
                        <TableHead className="h-10 text-[9px] font-black text-slate-500 uppercase tracking-widest px-6">TRX ID</TableHead>
                        <TableHead className="h-10 text-[9px] font-black text-slate-500 uppercase tracking-widest px-6">AKTIVITAS</TableHead>
                        <TableHead className="h-10 text-[9px] font-black text-slate-500 uppercase tracking-widest px-6">DETAIL PARAMETER</TableHead>
                        <TableHead className="h-10 text-[9px] font-black text-slate-500 uppercase tracking-widest px-6 text-right">TIMESTAMP</TableHead>
                        <TableHead className="h-10 text-[9px] font-black text-slate-500 uppercase tracking-widest px-6 text-center">STATUS</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {preset.history.map((item) => (
                        <TableRow key={item.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                          <TableCell className="px-6 py-4">
                            <span className="font-mono text-[10px] font-bold text-slate-400 uppercase">{item.id}</span>
                          </TableCell>
                          <TableCell className="px-6 py-4">
                            <span className="text-[10px] font-black text-slate-900 uppercase tracking-tight">{item.title}</span>
                          </TableCell>
                          <TableCell className="px-6 py-4">
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">{item.detail}</span>
                          </TableCell>
                          <TableCell className="px-6 py-4 text-right">
                             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{formatDate(item.date)}</span>
                          </TableCell>
                          <TableCell className="px-6 py-4 text-center">
                            <Badge className={`${statusClass(item.status)} font-black text-[9px] uppercase border-none h-5 px-2`}>
                              {item.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
           </Card>
        </TabsContent>
      </Tabs>

      {/* Security Banner */}
      <Card className="bg-slate-50 border-2 border-dashed border-slate-200">
        <CardContent className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
           <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center shadow-sm">
                 <ShieldCheck className="h-6 w-6 text-emerald-600" />
              </div>
              <div>
                 <p className="text-xs font-black text-slate-900 uppercase tracking-tight">Privasi & Keamanan Data</p>
                 <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">Seluruh akses profil diaudit secara real-time untuk kepatuhan tata kelola nasional.</p>
              </div>
           </div>
           <div className="flex items-center gap-3">
              <Button variant="ghost" className="h-10 text-[10px] font-black uppercase tracking-widest text-slate-500">
                 Kebijakan Privasi
              </Button>
              <Button variant="outline" className="h-10 border-slate-200 text-slate-900 font-black text-[10px] uppercase tracking-widest px-6 bg-white hover:bg-slate-50">
                 Audit Access Log
              </Button>
           </div>
        </CardContent>
      </Card>
    </div>
  )
}
