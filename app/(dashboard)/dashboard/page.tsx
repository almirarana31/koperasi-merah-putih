"use client"

import Link from 'next/link'
import { Brain, Sparkles } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/auth'
import { KementerianNationalDashboard } from '@/components/dashboard/kementerian-national-dashboard'
import { PetaniDashboard } from '@/components/dashboard/roles/petani-dashboard'
import { KoperasiManagerDashboard } from '@/components/dashboard/roles/koperasi-manager-dashboard'
import { KasirDashboard } from '@/components/dashboard/roles/kasir-dashboard'
import { BankDashboard } from '@/components/dashboard/roles/bank-dashboard'
import { LogistikDashboard } from '@/components/dashboard/roles/logistik-dashboard'
import { PemdaDashboard } from '@/components/dashboard/roles/pemda-dashboard'
import { SysadminDashboard } from '@/components/dashboard/roles/sysadmin-dashboard'
import { KetuaDashboard } from '@/components/dashboard/roles/ketua-dashboard'

export default function DashboardPage() {
  const { user, roleConfig } = useAuth()

  if (!user || !roleConfig) return null

  const dailyInsight =
    user.role === 'kementerian'
      ? 'Analisis lintas 1.248 desa menunjukkan kenaikan risiko NPL di tiga wilayah prioritas. Audit verifikasi paling mendesak saat ini berada di Jawa Barat.'
      : `Sistem mendeteksi efisiensi ${
          user.role === 'petani' ? 'panen' : 'transaksi'
        } meningkat 12% dibanding pekan lalu. Rekomendasi harga dan asisten AI siap dipakai untuk keputusan berikutnya.`

  const focusItems = [
    {
      label: 'Prioritas operasional',
      value:
        user.role === 'kementerian'
          ? 'Audit verifikasi koperasi regional Jawa Barat'
          : user.role === 'petani'
            ? 'Tindak lanjuti rekomendasi harga panen hari ini'
            : 'Pantau tugas persetujuan dan arus operasional utama',
    },
    {
      label: 'Status jaringan',
      value: '1.248 desa aktif dan sinkron setiap 2 menit',
    },
    {
      label: 'Workspace aktif',
      value: roleConfig.label,
    },
  ]

  const renderDashboard = () => {
    switch (user.role) {
      case 'kementerian':
        return <KementerianNationalDashboard />
      case 'petani':
        return <PetaniDashboard />
      case 'koperasi_manager':
        return <KoperasiManagerDashboard />
      case 'kasir':
        return <KasirDashboard />
      case 'bank':
        return <BankDashboard />
      case 'logistik_manager':
        return <LogistikDashboard />
      case 'pemda':
        return <PemdaDashboard />
      case 'sysadmin':
        return <SysadminDashboard />
      case 'ketua':
        return <KetuaDashboard />
      default:
        return (
          <section className="dashboard-surface flex min-h-[320px] items-center justify-center p-6">
            <p className="text-sm font-medium text-muted-foreground">
              Dashboard untuk peran ini sedang dikonfigurasi.
            </p>
          </section>
        )
    }
  }

  return (
    <div className="page-shell">
      <div className="page-header px-1">
        <div className="section-heading">
          <Badge variant="outline" className="w-fit bg-secondary/70 text-secondary-foreground">
            Ringkasan sistem hari ini
          </Badge>
          <div className="space-y-2">
            <h1 className="page-title">Dashboard Eksekutif Nasional</h1>
            <p className="page-subtitle max-w-3xl">
              Selamat datang kembali, {user.name}. Dashboard ini sekarang berjalan di atas
              layout dan komponen bersama agar tampilannya lebih konsisten, lebih ringan, dan
              lebih nyaman digunakan dari halaman ke halaman.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/command-center">Pusat Kendali</Link>
          </Button>
          <Button size="sm" asChild>
            <Link href="/assistant">
              <Brain className="h-4 w-4" />
              Tanya AI
            </Link>
          </Button>
        </div>
      </div>

      <section className="dashboard-surface-strong relative overflow-hidden p-5 sm:p-6">
        <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-56 bg-[radial-gradient(circle_at_center,color-mix(in_oklab,var(--dashboard-tertiary-soft)_68%,white),transparent_70%)] md:block" />

        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-3xl space-y-4">
            <Badge className="w-fit border-primary/15 bg-primary/10 text-primary shadow-none">
              <Sparkles className="h-3.5 w-3.5" />
              Insight AI prioritas
            </Badge>

            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-foreground">Rangkuman insight hari ini</h2>
              <p className="text-sm leading-7 text-muted-foreground">{dailyInsight}</p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="bg-card/80">
                Akurasi forecast 98.2%
              </Badge>
              <Badge variant="outline" className="bg-card/80">
                Sinkronisasi data 2 menit lalu
              </Badge>
              <Badge variant="outline" className="bg-card/80">
                Workspace aktif {roleConfig.label}
              </Badge>
            </div>
          </div>

          <div className="dashboard-inner-surface grid min-w-[280px] gap-3 p-4 sm:min-w-[320px]">
            <div className="section-heading">
              <h3 className="section-title">Fokus yang disarankan</h3>
              <p className="section-description">
                Tiga konteks yang sebaiknya jadi perhatian pertama saat membuka dashboard.
              </p>
            </div>

            <div className="grid gap-3">
              {focusItems.map((item) => (
                <div key={item.label} className="surface-card-muted p-3.5">
                  <p className="metric-label">{item.label}</p>
                  <p className="mt-1 text-sm font-semibold text-foreground">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {renderDashboard()}
    </div>
  )
}
