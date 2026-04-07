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
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between px-1">
        <div className="space-y-2">
          <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">DASHBOARD EKSEKUTIF NASIONAL</h1>
          <p className="text-[10px] font-black text-slate-500 mt-1 uppercase tracking-widest leading-relaxed">
            SELAMAT DATANG KEMBALI, {user.name.toUpperCase()} • NODES AKTIF: 1,248 DESA • STATUS: KOPDES ONLINE
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="h-9 text-[10px] font-black uppercase tracking-widest border-slate-200 text-slate-600 rounded-none shadow-sm" asChild>
            <Link href="/command-center">
              PUSAT KENDALI
            </Link>
          </Button>
          <Button size="sm" className="h-9 bg-slate-900 text-white hover:bg-slate-800 text-[10px] font-black uppercase tracking-widest px-6 rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] transition-all" asChild>
            <Link href="/assistant">
              <Brain className="mr-2.5 h-3.5 w-3.5" />
              TANYA AI
            </Link>
          </Button>
        </div>
      </div>

      <section className="relative overflow-hidden rounded-none border-t-4 border-slate-900 bg-white p-5 shadow-sm sm:p-6 transition-all hover:shadow-md">
        <div className="absolute right-0 top-0 p-6 opacity-[0.05] transition-transform duration-700 hover:rotate-0 sm:rotate-6">
          <Brain className="h-32 w-32 text-slate-900 sm:h-36 sm:w-36" />
        </div>

        <div className="relative flex flex-col items-start justify-between gap-5 lg:flex-row">
          <div className="flex-1 space-y-4">
            <div className="inline-flex items-center gap-2 rounded-none bg-slate-900 px-3 py-1 text-[9px] font-black text-white tracking-widest">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
              </span>
              AI INTELLIGENCE CORE | SINYAL AKTIF
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">RANGKUMAN INSIGHT AI HARI INI</h2>
              <p className="mt-2 max-w-2xl text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-relaxed">
                {user.role === 'kementerian'
                  ? 'ANALISIS NASIONAL DARI 1,248 DESA MENDETEKSI TREN KENAIKAN NPL DI 3 WILAYAH KUNCI. REKOMENDASI: SEGERA LAKUKAN AUDIT VERIFIKASI PADA KOPERASI DI WILAYAH JAWA BARAT.'
                  : `BERDASARKAN DATA OPERASIONAL TERBARU, SISTEM MENDETEKSI EFISIENSI ${user.role === 'petani' ? 'PANEN' : 'TRANSAKSI'} MENINGKAT 12%. GUNAKAN REKOMENDASI HARGA AI UNTUK HASIL MAKSIMAL.`}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge className="bg-slate-50 text-slate-600 border border-slate-100 rounded-none px-3 py-1 text-[9px] font-black tracking-widest">
                AKURASI FORECAST: 98.2%
              </Badge>
              <Badge className="bg-slate-50 text-slate-600 border border-slate-100 rounded-none px-3 py-1 text-[9px] font-black tracking-widest">
                DATA SINKRON: 2 MENIT LALU
              </Badge>
            </div>
          </div>
        </div>
      </section>

      {renderDashboard()}
    </div>
  )
}
