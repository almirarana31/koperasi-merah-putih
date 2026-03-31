'use client'

import Link from 'next/link'
import {
  ArrowRight,
  BarChart3,
  Bell,
  Brain,
  ClipboardCheck,
  FileText,
  ShieldCheck,
  ShoppingCart,
  Sprout,
  Truck,
  UserRound,
  Users,
  Wallet,
  Warehouse,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/auth'
import type { DataScope, Role } from '@/lib/rbac'

type DashboardAction = {
  title: string
  description: string
  href: string
  icon: LucideIcon
}

type RoleExperience = {
  heading: string
  summary: string
  priorities: string[]
  actions: DashboardAction[]
}

type HeroInsight = {
  label: string
  value: string
  note: string
}

type RoleArtwork = {
  primaryIcon: LucideIcon
  secondaryIcon: LucideIcon
  tertiaryIcon: LucideIcon
  eyebrow: string
  panelLabel: string
  stat: string
  statNote: string
  secondaryLabel: string
  secondaryValue: string
  tertiaryLabel: string
  tertiaryValue: string
  featuredActionIndexes: [number, number, number]
}

const SCOPE_LABELS: Record<DataScope, string> = {
  own: 'Data pribadi',
  koperasi: 'Level koperasi',
  district_aggregate: 'Agregat kabupaten',
  national_aggregate: 'Agregat nasional',
  all_koperasi: 'Seluruh koperasi',
}

const HERO_INSIGHTS: Record<Role, HeroInsight> = {
  petani: {
    label: 'Akses aktif',
    value: '6 fitur',
    note: 'Panen, harga pasar, pinjaman, dan pendampingan AI pribadi.',
  },
  kasir: {
    label: 'Fokus harian',
    value: 'Operasional',
    note: 'Transaksi, pembayaran, order, dan stok berjalan cepat dari satu tempat.',
  },
  logistik_manager: {
    label: 'Kontrol utama',
    value: 'Distribusi',
    note: 'Pengiriman, rute, armada, dan traceability siap dipantau.',
  },
  koperasi_manager: {
    label: 'Area kerja',
    value: '5 modul',
    note: 'Anggota, produksi, keuangan, laporan, dan AI operasional.',
  },
  ketua: {
    label: 'Ringkasan',
    value: 'Strategis',
    note: 'Pantauan lintas unit untuk keputusan koperasi tingkat pimpinan.',
  },
  pemda: {
    label: 'Mode akses',
    value: 'Agregat',
    note: 'Pemantauan wilayah tanpa membuka data anggota individual.',
  },
  bank: {
    label: 'Fokus utama',
    value: 'Pembiayaan',
    note: 'Credit scoring, pinjaman, dan laporan untuk analisis risiko.',
  },
  kementerian: {
    label: 'Tampilan',
    value: 'Nasional',
    note: 'Produksi, forecast, dan laporan agregat untuk kebijakan.',
  },
  sysadmin: {
    label: 'Kontrol',
    value: 'Lintas sistem',
    note: 'Pemantauan platform dan validasi akses seluruh modul.',
  },
}

const HERO_ARTWORKS: Record<Role, RoleArtwork> = {
  petani: {
    primaryIcon: Sprout,
    secondaryIcon: ShoppingCart,
    tertiaryIcon: Brain,
    eyebrow: 'Aktivitas petani',
    panelLabel: 'Lumbung pribadi',
    stat: '2.9 ton',
    statNote: 'Panen siap verifikasi minggu ini',
    secondaryLabel: 'Harga acuan',
    secondaryValue: 'Rp14.5k',
    tertiaryLabel: 'AI jual',
    tertiaryValue: 'Naik 6%',
    featuredActionIndexes: [0, 3, 4],
  },
  kasir: {
    primaryIcon: Wallet,
    secondaryIcon: ShoppingCart,
    tertiaryIcon: Warehouse,
    eyebrow: 'Operasional harian',
    panelLabel: 'Kas & order',
    stat: '24 jam',
    statNote: 'Aliran transaksi dan stok berjalan cepat',
    secondaryLabel: 'Order aktif',
    secondaryValue: '18 PO',
    tertiaryLabel: 'Kas masuk',
    tertiaryValue: 'Rp52jt',
    featuredActionIndexes: [2, 0, 1],
  },
  logistik_manager: {
    primaryIcon: Truck,
    secondaryIcon: Warehouse,
    tertiaryIcon: ClipboardCheck,
    eyebrow: 'Distribusi',
    panelLabel: 'Rute & gudang',
    stat: '12 rute',
    statNote: 'Distribusi aktif lintas gudang dan titik pickup',
    secondaryLabel: 'Utilisasi',
    secondaryValue: '82%',
    tertiaryLabel: 'Pending',
    tertiaryValue: '9 kirim',
    featuredActionIndexes: [0, 1, 2],
  },
  koperasi_manager: {
    primaryIcon: Users,
    secondaryIcon: Wallet,
    tertiaryIcon: FileText,
    eyebrow: 'Koperasi',
    panelLabel: 'Anggota & cashflow',
    stat: '5 modul',
    statNote: 'Kontrol utama untuk operasional koperasi hari ini',
    secondaryLabel: 'Anggota aktif',
    secondaryValue: '1,247',
    tertiaryLabel: 'Laporan',
    tertiaryValue: '12 siap',
    featuredActionIndexes: [0, 1, 4],
  },
  ketua: {
    primaryIcon: BarChart3,
    secondaryIcon: ShieldCheck,
    tertiaryIcon: FileText,
    eyebrow: 'Strategis',
    panelLabel: 'Kinerja lintas unit',
    stat: 'Ringkas',
    statNote: 'Arah kebijakan, risiko, dan evaluasi koperasi',
    secondaryLabel: 'Risiko',
    secondaryValue: '3 fokus',
    tertiaryLabel: 'Persetujuan',
    tertiaryValue: '7 masuk',
    featuredActionIndexes: [0, 2, 3],
  },
  pemda: {
    primaryIcon: BarChart3,
    secondaryIcon: Sprout,
    tertiaryIcon: Truck,
    eyebrow: 'Pemantauan daerah',
    panelLabel: 'Produksi agregat',
    stat: 'Kabupaten',
    statNote: 'Akses wilayah untuk melihat tren tanpa data individual',
    secondaryLabel: 'Kecamatan',
    secondaryValue: '24 area',
    tertiaryLabel: 'Distribusi',
    tertiaryValue: 'Stabil',
    featuredActionIndexes: [0, 1, 2],
  },
  bank: {
    primaryIcon: ShieldCheck,
    secondaryIcon: Wallet,
    tertiaryIcon: FileText,
    eyebrow: 'Pembiayaan',
    panelLabel: 'Risk & loan',
    stat: 'Skor kredit',
    statNote: 'Pengajuan pembiayaan dan risiko ada dalam satu pandangan',
    secondaryLabel: 'Loan review',
    secondaryValue: '16 berkas',
    tertiaryLabel: 'Risk',
    tertiaryValue: 'A-',
    featuredActionIndexes: [0, 1, 2],
  },
  kementerian: {
    primaryIcon: BarChart3,
    secondaryIcon: Brain,
    tertiaryIcon: FileText,
    eyebrow: 'Nasional',
    panelLabel: 'Forecast & kebijakan',
    stat: 'Agregat',
    statNote: 'Tren nasional untuk kebijakan dan evaluasi program',
    secondaryLabel: 'Program',
    secondaryValue: '92%',
    tertiaryLabel: 'Forecast',
    tertiaryValue: '+14%',
    featuredActionIndexes: [0, 1, 2],
  },
  sysadmin: {
    primaryIcon: Brain,
    secondaryIcon: ShieldCheck,
    tertiaryIcon: ClipboardCheck,
    eyebrow: 'Platform',
    panelLabel: 'Kontrol sistem',
    stat: 'All systems',
    statNote: 'Akses, audit, dan stabilitas platform dipantau serentak',
    secondaryLabel: 'Latency',
    secondaryValue: '42ms',
    tertiaryLabel: 'Alert',
    tertiaryValue: '0 kritis',
    featuredActionIndexes: [0, 2, 3],
  },
}

const ROLE_EXPERIENCES: Record<Role, RoleExperience> = {
  petani: {
    heading: 'Pusat kerja petani',
    summary: 'Fokus pada aktivitas usaha tani pribadi, akses harga komoditas, dan layanan pembiayaan untuk anggota.',
    priorities: [
      'Catat hasil panen dan rencana tanam milik sendiri.',
      'Pantau profil anggota Anda sendiri tanpa akses manajemen desa.',
      'Ajukan pinjaman dan lihat harga pasar terbaru.',
    ],
    actions: [
      { title: 'Panen Saya', description: 'Catat panen, cek verifikasi, dan siapkan hasil jual.', href: '/produksi', icon: Sprout },
      { title: 'Profil Saya', description: 'Lihat profil anggota dan ringkasan aktivitas pribadi.', href: '/anggota/profil', icon: UserRound },
      { title: 'Pinjaman', description: 'Ajukan pembiayaan dan pantau status pinjaman.', href: '/keuangan/pinjaman', icon: Wallet },
      { title: 'Harga Pasar', description: 'Bandingkan harga komoditas sebelum menjual.', href: '/pasar/harga', icon: ShoppingCart },
      { title: 'AI Harga', description: 'Gunakan rekomendasi AI untuk strategi jual.', href: '/ai/rekomendasi-harga', icon: Brain },
      { title: 'Notifikasi', description: 'Terima pengingat panen, cuaca, dan harga.', href: '/assistant/notifikasi', icon: Bell },
    ],
  },
  kasir: {
    heading: 'Operasional kasir harian',
    summary: 'Fokus pada transaksi koperasi, stok, pembayaran, dan aliran order harian.',
    priorities: [
      'Proses penjualan dan pembayaran tanpa membuka area manajemen anggota.',
      'Pantau stok gudang untuk transaksi hari ini.',
      'Gunakan AI untuk membaca permintaan dan harga pasar.',
    ],
    actions: [
      { title: 'Pasar', description: 'Kelola order masuk dan penjualan harian.', href: '/pasar', icon: ShoppingCart },
      { title: 'Gudang', description: 'Cek stok sebelum fulfillment dan transaksi.', href: '/gudang', icon: Warehouse },
      { title: 'Pembayaran', description: 'Proses pembayaran dan invoice koperasi.', href: '/keuangan/pembayaran', icon: Wallet },
      { title: 'AI Demand', description: 'Lihat prediksi permintaan untuk operasional.', href: '/ai/supply-demand', icon: Brain },
    ],
  },
  logistik_manager: {
    heading: 'Koordinasi logistik',
    summary: 'Fokus pada distribusi, armada, rute, dan kualitas stok yang siap dikirim.',
    priorities: [
      'Pastikan pengiriman dan pickup berjalan tepat waktu.',
      'Optimalkan rute dan pemanfaatan armada.',
      'Pantau stok dan grading yang berkaitan dengan distribusi.',
    ],
    actions: [
      { title: 'Pengiriman', description: 'Kelola pengiriman dan tracking logistik.', href: '/logistik', icon: Truck },
      { title: 'Rute', description: 'Optimalkan jalur antar gudang dan titik serah.', href: '/logistik/rute', icon: Truck },
      { title: 'Gudang', description: 'Pantau stok, grading, dan traceability.', href: '/gudang', icon: Warehouse },
      { title: 'AI Rute', description: 'Gunakan AI untuk menyusun rute lebih efisien.', href: '/ai/optimasi-rute', icon: Brain },
    ],
  },
  koperasi_manager: {
    heading: 'Kendali operasional koperasi',
    summary: 'Fokus pada pengelolaan anggota, produksi, pasar, dan laporan untuk operasional koperasi sehari-hari.',
    priorities: [
      'Kelola onboarding, verifikasi, dan struktur anggota koperasi.',
      'Pantau produksi, penjualan, dan cashflow lintas unit.',
      'Gunakan laporan dan AI untuk keputusan operasional.',
    ],
    actions: [
      { title: 'Anggota', description: 'Kelola daftar anggota, onboarding, dan verifikasi.', href: '/anggota', icon: Users },
      { title: 'Produksi', description: 'Pantau panen, jadwal, dan agregasi komoditas.', href: '/produksi', icon: Sprout },
      { title: 'Keuangan', description: 'Buka transaksi, laporan, dan pembiayaan koperasi.', href: '/keuangan', icon: Wallet },
      { title: 'Forecast', description: 'Gunakan prediksi untuk produksi berikutnya.', href: '/ai/forecast', icon: Brain },
      { title: 'Laporan', description: 'Buat dan bagikan laporan operasional.', href: '/keuangan/laporan', icon: FileText },
    ],
  },
  ketua: {
    heading: 'Pengawasan ketua koperasi',
    summary: 'Fokus pada keputusan strategis, persetujuan, evaluasi kinerja, dan pemantauan lintas unit.',
    priorities: [
      'Lihat ringkasan operasional lintas fungsi.',
      'Arahkan kebijakan anggota, keuangan, dan risiko.',
      'Gunakan command center untuk keputusan strategis.',
    ],
    actions: [
      { title: 'Pusat Kendali', description: 'Pantau kondisi koperasi dari dashboard eksekutif.', href: '/command-center', icon: BarChart3 },
      { title: 'Anggota', description: 'Awasi onboarding dan kualitas anggota.', href: '/anggota', icon: Users },
      { title: 'Laporan', description: 'Tinjau laporan dan pembagian hasil usaha.', href: '/keuangan/laporan', icon: FileText },
      { title: 'Analisis Pasar', description: 'Gunakan insight AI untuk arah bisnis koperasi.', href: '/ai/analisis-pasar', icon: Brain },
    ],
  },
  pemda: {
    heading: 'Monitoring tingkat daerah',
    summary: 'Fokus pada data agregat kabupaten untuk produksi, logistik, dan perkembangan komoditas.',
    priorities: [
      'Pantau produksi agregat per wilayah.',
      'Lihat distribusi dan logistik antar area.',
      'Gunakan laporan agregat untuk keputusan daerah.',
    ],
    actions: [
      { title: 'Produksi Wilayah', description: 'Lihat ringkasan produksi tingkat daerah.', href: '/produksi/agregasi', icon: Sprout },
      { title: 'Logistik', description: 'Pantau distribusi dan hambatan logistik.', href: '/logistik', icon: Truck },
      { title: 'Harga Pasar', description: 'Amati pergerakan harga komoditas di lapangan.', href: '/pasar/harga', icon: ShoppingCart },
      { title: 'Laporan', description: 'Akses laporan agregat untuk evaluasi program.', href: '/keuangan/laporan', icon: FileText },
    ],
  },
  bank: {
    heading: 'Analisis pembiayaan',
    summary: 'Fokus pada kelayakan kredit, pengajuan pembiayaan, dan evaluasi performa anggota yang relevan.',
    priorities: [
      'Tinjau skor kredit dan risiko pembiayaan.',
      'Pantau pengajuan pinjaman yang masuk.',
      'Gunakan laporan untuk penilaian pembiayaan.',
    ],
    actions: [
      { title: 'Credit Scoring', description: 'Evaluasi kelayakan kredit anggota.', href: '/keuangan/credit-scoring', icon: ShieldCheck },
      { title: 'Pinjaman', description: 'Lihat detail pengajuan pembiayaan.', href: '/keuangan/pinjaman', icon: Wallet },
      { title: 'Laporan', description: 'Buka laporan untuk analisis risiko.', href: '/keuangan/laporan', icon: FileText },
    ],
  },
  kementerian: {
    heading: 'Monitoring nasional',
    summary: 'Fokus pada data agregat nasional untuk kebijakan, evaluasi program, dan tren komoditas.',
    priorities: [
      'Pantau produksi dan komoditas secara agregat.',
      'Lihat pergerakan distribusi dan harga secara luas.',
      'Gunakan laporan untuk kebijakan nasional.',
    ],
    actions: [
      { title: 'Produksi Nasional', description: 'Lihat rangkuman produksi lintas wilayah.', href: '/produksi/agregasi', icon: Sprout },
      { title: 'Forecast', description: 'Gunakan prediksi untuk perencanaan nasional.', href: '/ai/forecast', icon: Brain },
      { title: 'Logistik', description: 'Tinjau distribusi dan hambatan pasok.', href: '/logistik', icon: Truck },
      { title: 'Laporan', description: 'Akses laporan ringkas untuk kebutuhan kebijakan.', href: '/keuangan/laporan', icon: FileText },
    ],
  },
  sysadmin: {
    heading: 'Kontrol sistem',
    summary: 'Fokus pada kontrol platform, stabilitas operasional, dan pengawasan lintas modul.',
    priorities: [
      'Pastikan seluruh modul berjalan konsisten.',
      'Pantau area operasional yang kritikal.',
      'Bantu troubleshooting lintas peran dan lingkungan.',
    ],
    actions: [
      { title: 'Pusat Kendali', description: 'Pantau seluruh area operasional dari satu tempat.', href: '/command-center', icon: BarChart3 },
      { title: 'Anggota', description: 'Validasi alur anggota dan akses lintas modul.', href: '/anggota', icon: Users },
      { title: 'Keuangan', description: 'Masuk ke transaksi dan laporan untuk verifikasi sistem.', href: '/keuangan', icon: Wallet },
      { title: 'AI', description: 'Tinjau modul AI dan dukungan assistant.', href: '/ai', icon: Brain },
    ],
  },
}

function getActionByPriority(actions: DashboardAction[], preferredIndex: number, usedIndexes: number[]) {
  const preferred = actions[preferredIndex]
  if (preferred && !usedIndexes.includes(preferredIndex)) {
    return { action: preferred, index: preferredIndex }
  }

  const fallbackIndex = actions.findIndex((_, index) => !usedIndexes.includes(index))
  if (fallbackIndex >= 0) {
    return { action: actions[fallbackIndex], index: fallbackIndex }
  }

  return null
}

function RoleHeroArtwork({
  role,
  actions,
}: {
  role: Role
  actions: DashboardAction[]
}) {
  const artwork = HERO_ARTWORKS[role]
  const PrimaryIcon = artwork.primaryIcon
  const usedIndexes: number[] = []
  const featuredActions = artwork.featuredActionIndexes
    .map((preferredIndex) => {
      const picked = getActionByPriority(actions, preferredIndex, usedIndexes)
      if (!picked) return null
      usedIndexes.push(picked.index)
      return picked.action
    })
    .filter((action): action is DashboardAction => Boolean(action))

  const mainAction = featuredActions[0]
  const secondaryAction = featuredActions[1] ?? mainAction
  const tertiaryAction = featuredActions[2] ?? secondaryAction ?? mainAction

  if (!mainAction) {
    return null
  }

  return (
    <div className="relative min-h-[250px] overflow-hidden rounded-[2rem] border border-white/12 bg-[linear-gradient(145deg,rgba(255,255,255,0.12),rgba(255,255,255,0.04))] p-4 backdrop-blur-sm">
      <div className="absolute -right-10 -top-8 h-32 w-32 rounded-full bg-white/12 blur-2xl" />
      <div className="absolute -left-8 bottom-10 h-24 w-24 rounded-full bg-black/10 blur-2xl" />
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.08),transparent_48%)]" />
      <div className="relative flex h-full flex-col gap-4">
        <div className="flex items-start justify-between gap-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/14 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-primary-foreground/82">
            <span className="h-2 w-2 rounded-full bg-green-300" />
            {artwork.eyebrow}
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/16 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]">
            <PrimaryIcon className="h-5 w-5 text-primary-foreground" />
          </div>
        </div>

        <div className="grid flex-1 grid-cols-[1.15fr_0.85fr] gap-3">
          <Link
            href={mainAction.href}
            className="group flex flex-col justify-between rounded-[1.9rem] bg-[linear-gradient(180deg,rgba(255,255,255,0.16),rgba(255,255,255,0.08))] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.16)] transition-transform hover:-translate-y-0.5"
          >
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary-foreground/74">{artwork.panelLabel}</p>
              <mainAction.icon className="h-4 w-4 text-primary-foreground/78" />
            </div>
            <div className="space-y-2">
              <p className="text-3xl font-bold tracking-tight text-primary-foreground">{artwork.stat}</p>
              <p className="max-w-[14rem] text-sm text-primary-foreground/74">{artwork.statNote}</p>
            </div>
            <div className="mt-4 rounded-2xl border border-white/12 bg-black/8 px-3 py-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary-foreground/62">Status panel</p>
              <div className="mt-2 flex items-center justify-between">
                <span className="line-clamp-1 text-sm font-medium text-primary-foreground">{mainAction.title}</span>
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-white/12 px-2 py-1 text-[10px] font-semibold text-primary-foreground/80">
                    Live
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 text-primary-foreground/75 transition-transform group-hover:translate-x-0.5" />
                </div>
              </div>
            </div>
          </Link>

          <div className="flex flex-col gap-3">
            {secondaryAction && (
              <Link
                href={secondaryAction.href}
                className="group rounded-[1.6rem] bg-[linear-gradient(180deg,rgba(255,255,255,0.15),rgba(255,255,255,0.08))] p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.12)] transition-transform hover:-translate-y-0.5"
              >
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary-foreground/66">{artwork.secondaryLabel}</p>
                <secondaryAction.icon className="h-4 w-4 text-primary-foreground/74" />
              </div>
              <p className="mt-4 text-2xl font-bold tracking-tight text-primary-foreground">{artwork.secondaryValue}</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="line-clamp-1 text-sm font-medium text-primary-foreground/82">{secondaryAction.title}</span>
                <ArrowRight className="h-3.5 w-3.5 text-primary-foreground/75 transition-transform group-hover:translate-x-0.5" />
              </div>
              </Link>
            )}
            {tertiaryAction && (
              <Link
                href={tertiaryAction.href}
                className="group flex flex-1 flex-col justify-between rounded-[1.6rem] border border-white/10 bg-black/8 p-4 transition-transform hover:-translate-y-0.5"
              >
              <div className="flex items-center justify-between">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-primary-foreground/66">{artwork.tertiaryLabel}</p>
                <tertiaryAction.icon className="h-4 w-4 text-primary-foreground/72" />
              </div>
              <div>
                <p className="text-2xl font-bold tracking-tight text-primary-foreground">{artwork.tertiaryValue}</p>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full w-[68%] rounded-full bg-white/70" />
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="line-clamp-1 text-sm font-medium text-primary-foreground/82">{tertiaryAction.title}</span>
                  <ArrowRight className="h-3.5 w-3.5 text-primary-foreground/75 transition-transform group-hover:translate-x-0.5" />
                </div>
              </div>
              </Link>
            )}
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {featuredActions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className="rounded-2xl border border-white/8 bg-white/10 px-3 py-2 text-center text-xs font-medium text-primary-foreground/84 transition-colors hover:bg-white/18"
            >
              <span className="line-clamp-1">{action.title}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const { user, roleConfig, canRoute, dataScope } = useAuth()

  if (!user || !roleConfig) return null

  const experience = ROLE_EXPERIENCES[user.role]
  const scope = SCOPE_LABELS[dataScope()]
  const visibleActions = experience.actions.filter((action) => canRoute(action.href))
  const primaryActions = visibleActions.slice(0, 4)
  const secondaryActions = visibleActions.slice(4)
  const hero = HERO_INSIGHTS[user.role]

  return (
    <div className="space-y-6">
      <section className="space-y-4">
        <div className="px-1">
          <p className="text-sm font-medium text-muted-foreground">Selamat datang kembali,</p>
          <h1 className="mt-1 text-[2rem] font-bold leading-tight tracking-tight sm:text-[2.3rem]">
            {user.name.split(' ')[0]}!
          </h1>
        </div>

        <Card className="overflow-hidden border-none bg-[linear-gradient(135deg,#be0817_0%,#d92827_54%,#aa2d2a_100%)] text-primary-foreground shadow-[0_28px_70px_-30px_rgba(133,18,23,0.55)]">
          <CardContent className="relative p-0">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.14),transparent_36%),radial-gradient(circle_at_bottom_left,rgba(0,0,0,0.12),transparent_28%)]" />
            <div className="absolute -right-10 -top-12 h-40 w-40 rounded-full bg-white/12 blur-3xl" />
            <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-black/10 blur-2xl" />
            <div className="relative grid gap-5 p-5 sm:p-6 xl:grid-cols-[1.02fr_0.98fr] xl:items-stretch">
              <div className="space-y-5">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary-foreground/72">{hero.label}</p>
                  <p className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">{hero.value}</p>
                  <p className="mt-3 max-w-xl text-sm leading-6 text-primary-foreground/80">{hero.note}</p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-2xl backdrop-blur-sm">
                    {roleConfig.icon}
                  </div>
                  <div className="text-sm text-primary-foreground/84">
                    <p className="font-semibold">{experience.heading}</p>
                    <p className="max-w-md text-primary-foreground/74">{experience.summary}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge className="border-none bg-white/15 px-3 py-1 text-primary-foreground backdrop-blur-sm">
                    {roleConfig.label}
                  </Badge>
                  <Badge className="border-none bg-white/15 px-3 py-1 text-primary-foreground backdrop-blur-sm">
                    {scope}
                  </Badge>
                </div>

                <div className="flex flex-col gap-2 sm:flex-row">
                  {primaryActions.slice(0, 2).map((action) => (
                    <Button
                      key={action.href}
                      asChild
                      className="h-11 flex-1 rounded-xl bg-white/16 text-primary-foreground backdrop-blur-sm hover:bg-white/22"
                    >
                      <Link href={action.href}>
                        <action.icon className="mr-2 h-4 w-4" />
                        {action.title}
                      </Link>
                    </Button>
                  ))}
                </div>
              </div>

              <RoleHeroArtwork role={user.role} actions={visibleActions} />
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-4">
        <div className="px-1">
          <h2 className="text-xl font-bold tracking-tight">Quick Actions</h2>
          <p className="text-sm text-muted-foreground">Shortcut ke fitur yang paling relevan untuk role Anda.</p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {primaryActions.map((action) => {
            const Icon = action.icon

            return (
              <Link key={action.href} href={action.href} className="group">
                <Card className="border-white/80 bg-white shadow-sm transition-transform hover:-translate-y-0.5">
                  <CardContent className="flex flex-col items-center gap-3 p-4 text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-border/60 bg-background text-primary shadow-sm">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{action.title}</p>
                      <p className="mt-1 text-xs text-muted-foreground">{action.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
        <Card className="border-white/80 bg-white shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <CardTitle className="text-lg">Fokus Utama</CardTitle>
                <CardDescription>Ringkasan tugas yang paling penting untuk role ini.</CardDescription>
              </div>
              <Badge variant="outline" className="text-xs">
                {experience.heading}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {experience.priorities.map((priority, index) => (
              <div key={priority} className="flex items-start gap-3 rounded-2xl border border-border/60 bg-background p-4">
                <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  {index === 0 ? <ShieldCheck className="h-4 w-4" /> : index === 1 ? <ClipboardCheck className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
                </div>
                <div>
                  <p className="font-medium text-foreground">{priority}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{experience.summary}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-white/80 bg-white shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Lanjutan Aksi</CardTitle>
            <CardDescription>Fitur tambahan yang tetap tersedia untuk Anda.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {secondaryActions.length > 0 ? (
              secondaryActions.map((action) => (
                <Link
                  key={action.href}
                  href={action.href}
                  className="flex items-center gap-3 rounded-2xl border border-border/60 bg-background p-4 transition-colors hover:border-primary/30 hover:bg-primary/[0.03]"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <action.icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-foreground">{action.title}</p>
                    <p className="text-sm text-muted-foreground">{action.description}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </Link>
              ))
            ) : (
              <div className="rounded-2xl border border-dashed bg-background p-4">
                <p className="font-medium text-foreground">Semua fitur utama sudah tampil di atas</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Role ini memang didesain dengan alur yang lebih ringkas agar fokus kerja tetap jelas.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      <Card className="border-white/80 bg-white shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Akses Dilindungi</CardTitle>
          <CardDescription>
            Fitur di luar tanggung jawab role Anda otomatis disembunyikan dari dashboard, sidebar, dan akses URL langsung.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-3">
          <div className="rounded-2xl border border-dashed bg-background p-4">
            <Users className="mb-3 h-5 w-5 text-primary" />
            <p className="font-medium">Manajemen anggota sensitif</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Penambahan, onboarding, dan verifikasi anggota hanya muncul untuk role pengelola.
            </p>
          </div>
          <div className="rounded-2xl border border-dashed bg-background p-4">
            <Warehouse className="mb-3 h-5 w-5 text-primary" />
            <p className="font-medium">Operasional sesuai fungsi</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Gudang, logistik, pasar, dan keuangan dibatasi berdasarkan use case tiap peran.
            </p>
          </div>
          <div className="rounded-2xl border border-dashed bg-background p-4">
            <ClipboardCheck className="mb-3 h-5 w-5 text-primary" />
            <p className="font-medium">URL manual tetap ditolak</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Walau alamat halaman diketik langsung, halaman yang tidak sesuai tetap tidak bisa dibuka.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
