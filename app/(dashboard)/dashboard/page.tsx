"use client"

import Link from 'next/link'
import { Brain } from 'lucide-react'
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
          <div className="flex min-h-[400px] items-center justify-center">
            <p className="text-sm font-medium text-muted-foreground">Dashboard untuk peran ini sedang dikonfigurasi.</p>
          </div>
        )
    }
  }

  return (
    <div className="space-y-5 pb-8">
      <div className="px-1">
        <p className="text-sm font-medium text-slate-600">Selamat datang kembali,</p>
        <h1 className="mt-1 text-[2rem] font-semibold leading-tight text-slate-950 sm:text-[2.15rem]">
          {user.name.split(' ')[0]}!
        </h1>
      </div>

      <section className="relative overflow-hidden rounded-[1.6rem] border border-primary/15 bg-gradient-to-br from-white via-rose-50/35 to-stone-50 p-5 shadow-[0_16px_34px_-26px_rgba(15,23,42,0.2)] sm:p-6">
        <div className="absolute right-0 top-0 p-6 opacity-[0.08] transition-transform duration-700 hover:rotate-0 sm:rotate-6">
          <Brain className="h-32 w-32 text-primary sm:h-36 sm:w-36" />
        </div>
        <div className="absolute -bottom-12 -left-12 h-32 w-32 rounded-full bg-primary/5 blur-3xl" />

        <div className="relative flex flex-col items-center justify-between gap-5 lg:flex-row">
          <div className="flex-1 space-y-3 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/8 px-3 py-1.5 text-xs font-medium text-primary shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
              </span>
              AI Intelligence Core | Real-time Engine
            </div>
            <div>
              <h2 className="text-[1.6rem] font-semibold text-slate-950 sm:text-[1.85rem]">Rangkuman Insight AI Hari Ini</h2>
              <p className="mt-2 max-w-2xl text-[0.98rem] leading-6 text-slate-700">
                {user.role === 'kementerian'
                  ? 'Analisis nasional dari 1,248 desa mendeteksi tren kenaikan NPL di 3 wilayah kunci. Rekomendasi: segera lakukan audit verifikasi pada koperasi di wilayah Jawa Barat.'
                  : `Berdasarkan data operasional terbaru, sistem mendeteksi efisiensi ${user.role === 'petani' ? 'panen' : 'transaksi'} meningkat 12%. Gunakan rekomendasi harga AI untuk hasil maksimal.`}
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-2 lg:justify-start">
              <Badge variant="outline" className="border-primary/15 bg-white/85 px-3 py-1 text-xs font-medium text-slate-700">
                Forecast akurasi: 98.2%
              </Badge>
              <Badge variant="outline" className="border-primary/15 bg-white/85 px-3 py-1 text-xs font-medium text-slate-700">
                Data sinkron: 2 mnt lalu
              </Badge>
            </div>
          </div>

          <div className="flex w-full flex-col gap-2.5 sm:w-auto">
            <Button
              className="group h-11 rounded-xl bg-primary px-6 text-sm font-medium text-white shadow-[0_12px_24px_-18px_rgba(190,8,23,0.55)] transition-all hover:scale-[1.01] hover:bg-rose-800"
              asChild
            >
              <Link href="/assistant">
                <Brain className="mr-2.5 h-[18px] w-[18px] transition-transform group-hover:rotate-12" />
                Tanya AI Sekarang
              </Link>
            </Button>
            <p className="text-center text-xs text-slate-500">Powered by Kopdes Intelligence</p>
          </div>
        </div>
      </section>

      {renderDashboard()}
    </div>
  )
}
