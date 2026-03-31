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

const SCOPE_LABELS: Record<DataScope, string> = {
  own: 'Data pribadi',
  koperasi: 'Level koperasi',
  district_aggregate: 'Agregat kabupaten',
  national_aggregate: 'Agregat nasional',
  all_koperasi: 'Seluruh koperasi',
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
      { title: 'Catatan Panen Saya', description: 'Masuk ke pencatatan produksi dan panen pribadi.', href: '/produksi', icon: Sprout },
      { title: 'Profil Saya', description: 'Lihat profil anggota, aktivitas, dan ringkasan performa pribadi.', href: '/anggota/profil', icon: UserRound },
      { title: 'Ajukan Pinjaman', description: 'Akses pengajuan pinjaman anggota berdasarkan skor kredit.', href: '/keuangan/pinjaman', icon: Wallet },
      { title: 'Harga Pasar', description: 'Pantau perubahan harga komoditas sebelum menjual hasil panen.', href: '/pasar/harga', icon: ShoppingCart },
      { title: 'Rekomendasi Harga AI', description: 'Gunakan insight AI untuk menentukan strategi jual.', href: '/ai/rekomendasi-harga', icon: Brain },
      { title: 'Notifikasi Cerdas', description: 'Terima pengingat panen, harga, dan alert penting.', href: '/assistant/notifikasi', icon: Bell },
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
      { title: 'Pasar & Order', description: 'Kelola order masuk, buyer, dan proses penjualan harian.', href: '/pasar', icon: ShoppingCart },
      { title: 'Gudang', description: 'Cek stok barang sebelum transaksi dan fulfillment.', href: '/gudang', icon: Warehouse },
      { title: 'Pembayaran', description: 'Proses pembayaran dan pencatatan invoice.', href: '/keuangan/pembayaran', icon: Wallet },
      { title: 'Supply & Demand AI', description: 'Lihat perkiraan permintaan untuk keputusan operasional.', href: '/ai/supply-demand', icon: Brain },
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
      { title: 'Pengiriman', description: 'Masuk ke pengelolaan pengiriman dan tracking logistik.', href: '/logistik', icon: Truck },
      { title: 'Rute Distribusi', description: 'Optimalkan jalur antar gudang dan titik serah.', href: '/logistik/rute', icon: Truck },
      { title: 'Gudang', description: 'Cek stok, grading, dan traceability untuk distribusi.', href: '/gudang', icon: Warehouse },
      { title: 'Optimasi Rute AI', description: 'Gunakan AI untuk menyusun rute yang lebih efisien.', href: '/ai/optimasi-rute', icon: Brain },
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
      { title: 'Manajemen Anggota', description: 'Kelola daftar anggota, onboarding, dan verifikasi KYC.', href: '/anggota', icon: Users },
      { title: 'Operasional Produksi', description: 'Pantau produksi, jadwal panen, dan agregasi komoditas.', href: '/produksi', icon: Sprout },
      { title: 'Keuangan Koperasi', description: 'Buka transaksi, laporan, dan pembiayaan koperasi.', href: '/keuangan', icon: Wallet },
      { title: 'Forecast AI', description: 'Gunakan prediksi untuk produksi dan penjualan berikutnya.', href: '/ai/forecast', icon: Brain },
      { title: 'Laporan', description: 'Buat dan bagikan laporan operasional koperasi.', href: '/keuangan/laporan', icon: FileText },
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
      { title: 'Pusat Kendali', description: 'Masuk ke dashboard eksekutif untuk pemantauan menyeluruh.', href: '/command-center', icon: BarChart3 },
      { title: 'Anggota & Verifikasi', description: 'Awasi onboarding, verifikasi, dan kualitas anggota.', href: '/anggota', icon: Users },
      { title: 'Laporan Koperasi', description: 'Tinjau laporan dan pembagian hasil usaha.', href: '/keuangan/laporan', icon: FileText },
      { title: 'Analisis Pasar AI', description: 'Gunakan insight strategis untuk arah bisnis koperasi.', href: '/ai/analisis-pasar', icon: Brain },
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
      { title: 'Agregasi Produksi', description: 'Lihat ringkasan produksi tingkat daerah.', href: '/produksi/agregasi', icon: Sprout },
      { title: 'Logistik Daerah', description: 'Pantau distribusi dan hambatan logistik wilayah.', href: '/logistik', icon: Truck },
      { title: 'Harga Pasar', description: 'Amati pergerakan harga komoditas di lapangan.', href: '/pasar/harga', icon: ShoppingCart },
      { title: 'Laporan Daerah', description: 'Akses laporan agregat untuk evaluasi program.', href: '/keuangan/laporan', icon: FileText },
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
      { title: 'Credit Scoring', description: 'Evaluasi kelayakan kredit dan profil pembiayaan anggota.', href: '/keuangan/credit-scoring', icon: ShieldCheck },
      { title: 'Pengajuan Pinjaman', description: 'Lihat detail pengajuan pinjaman yang perlu diproses.', href: '/keuangan/pinjaman', icon: Wallet },
      { title: 'Laporan Pembiayaan', description: 'Buka laporan untuk analisis risiko dan performa.', href: '/keuangan/laporan', icon: FileText },
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
      { title: 'Agregasi Produksi', description: 'Lihat rangkuman produksi nasional dan lintas wilayah.', href: '/produksi/agregasi', icon: Sprout },
      { title: 'Forecast Nasional', description: 'Gunakan prediksi untuk perencanaan lintas wilayah.', href: '/ai/forecast', icon: Brain },
      { title: 'Logistik', description: 'Tinjau distribusi dan hambatan pasok tingkat luas.', href: '/logistik', icon: Truck },
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
      { title: 'Manajemen Anggota', description: 'Validasi alur anggota dan akses lintas modul.', href: '/anggota', icon: Users },
      { title: 'Operasional Koperasi', description: 'Masuk ke transaksi dan laporan untuk verifikasi sistem.', href: '/keuangan', icon: Wallet },
      { title: 'AI Monitoring', description: 'Tinjau modul AI dan dukungan assistant.', href: '/ai', icon: Brain },
    ],
  },
}

export default function DashboardPage() {
  const { user, roleConfig, canRoute, dataScope } = useAuth()

  if (!user || !roleConfig) return null

  const experience = ROLE_EXPERIENCES[user.role]
  const scope = SCOPE_LABELS[dataScope()]
  const visibleActions = experience.actions.filter((action) => canRoute(action.href))

  return (
    <div className="space-y-6">
      <Card className="overflow-hidden border-primary/15 shadow-sm">
        <CardContent className="relative p-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(180,39,45,0.12),transparent_40%),linear-gradient(135deg,rgba(248,243,237,0.98),rgba(255,255,255,0.92))]" />
          <div className="relative grid gap-6 p-5 sm:p-6 lg:grid-cols-[1.45fr_0.95fr]">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-sm">
                  <span className="text-2xl leading-none">{roleConfig.icon}</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-primary">{experience.heading}</p>
                  <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{roleConfig.label}</h1>
                </div>
              </div>

              <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
                {experience.summary}
              </p>

              <div className="flex flex-wrap gap-2">
                <Badge className="border border-primary/20 bg-primary/10 px-3 py-1 text-primary">
                  {scope}
                </Badge>
                <Badge variant="outline" className="px-3 py-1">
                  {visibleActions.length} area kerja
                </Badge>
              </div>
            </div>

            <Card className="border-primary/10 bg-background/90 shadow-none">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Fokus Utama</CardTitle>
                <CardDescription>Ringkasan tanggung jawab untuk role ini.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {experience.priorities.map((priority) => (
                  <div key={priority} className="flex items-start gap-3 rounded-xl bg-secondary/45 p-3">
                    <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <p className="text-sm text-foreground">{priority}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      <section className="space-y-3">
        <div>
          <h2 className="text-lg font-semibold sm:text-xl">Aksi yang Relevan untuk Anda</h2>
          <p className="text-sm text-muted-foreground">
            Hanya fitur yang sesuai dengan tugas role Anda yang ditampilkan di sini.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {visibleActions.map((action) => {
            const Icon = action.icon

            return (
              <Card key={action.href} className="border-border/80 shadow-sm">
                <CardHeader className="space-y-3 p-5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-base sm:text-lg">{action.title}</CardTitle>
                    <CardDescription className="mt-1 text-sm">{action.description}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent className="p-5 pt-0">
                  <Button asChild className="w-full justify-between">
                    <Link href={action.href}>
                      Buka fitur
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </section>

      <Card className="shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Akses Dilindungi</CardTitle>
          <CardDescription>
            Fitur di luar tanggung jawab role Anda otomatis disembunyikan dari dashboard, sidebar, dan akses URL langsung.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-dashed bg-secondary/35 p-4">
            <Users className="mb-3 h-5 w-5 text-primary" />
            <p className="font-medium">Manajemen anggota sensitif</p>
            <p className="mt-1 text-sm text-muted-foreground">Hanya role pengelola koperasi yang dapat menambah dan memverifikasi anggota.</p>
          </div>
          <div className="rounded-2xl border border-dashed bg-secondary/35 p-4">
            <Warehouse className="mb-3 h-5 w-5 text-primary" />
            <p className="font-medium">Operasional khusus unit</p>
            <p className="mt-1 text-sm text-muted-foreground">Gudang, logistik, dan transaksi tampil sesuai fungsi kerja masing-masing.</p>
          </div>
          <div className="rounded-2xl border border-dashed bg-secondary/35 p-4">
            <ClipboardCheck className="mb-3 h-5 w-5 text-primary" />
            <p className="font-medium">Akses langsung tetap dijaga</p>
            <p className="mt-1 text-sm text-muted-foreground">Walau URL diketik manual, halaman yang tidak sesuai tetap akan ditolak.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
