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

        <Card className="overflow-hidden border-none bg-primary text-primary-foreground shadow-[0_28px_70px_-30px_rgba(133,18,23,0.55)]">
          <CardContent className="relative p-0">
            <div className="absolute -right-10 -top-12 h-36 w-36 rounded-full bg-white/12 blur-3xl" />
            <div className="absolute -bottom-10 -left-10 h-28 w-28 rounded-full bg-black/10 blur-2xl" />
            <div className="relative space-y-5 p-5 sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-primary-foreground/80">{hero.label}</p>
                  <p className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl">{hero.value}</p>
                  <p className="mt-2 max-w-xl text-sm text-primary-foreground/80">{hero.note}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-2xl backdrop-blur-sm">
                  {roleConfig.icon}
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
