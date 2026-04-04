"use client"

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
  Zap,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/lib/auth'
import type { DataScope, Role } from '@/lib/rbac'

// Import Specialized Dashboards
import { KementerianDashboard } from '@/components/dashboard/roles/kementerian-dashboard'
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

  // Route to the appropriate specialized dashboard component
  const renderDashboard = () => {
    switch (user.role) {
      case 'kementerian':
        return <KementerianDashboard />
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
          <div className="flex items-center justify-center min-h-[400px]">
            <p className="text-muted-foreground text-sm font-medium">Dashboard untuk peran ini sedang dikonfigurasi.</p>
          </div>
        )
    }
  }

  return (
    <div className="space-y-6 pb-10">
      <div className="px-1">
        <p className="text-sm font-semibold text-slate-600 drop-shadow-sm">Selamat datang kembali,</p>
        <h1 className="mt-1 text-[2.2rem] font-black leading-tight tracking-tight text-slate-950 drop-shadow-md">
          {user.name.split(' ')[0]}!
        </h1>
      </div>

      {/* AI Intelligence Home Section */}
      <section className="relative overflow-hidden rounded-[2.2rem] border border-primary/20 bg-gradient-to-br from-white via-rose-50/30 to-rose-100/20 p-7 shadow-xl">
        <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12 transition-transform hover:rotate-0 duration-700">
          <Brain className="h-40 w-40 text-primary" />
        </div>
        <div className="absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-primary/5 blur-3xl" />
        
        <div className="relative flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-4 text-center lg:text-left flex-1">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 border border-primary/20 px-4 py-1.5 text-[10px] font-black text-primary uppercase tracking-[0.2em] shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              AI Intelligence Core • Real-time Engine
            </div>
            <div>
              <h2 className="text-3xl font-black text-slate-950 tracking-tight drop-shadow-sm">Rangkuman Insight AI Hari Ini</h2>
              <p className="mt-2 max-w-2xl text-base font-semibold text-slate-700 leading-relaxed drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]">
                {user.role === 'kementerian' 
                  ? "Analisis nasional dari 1,248 Desa mendeteksi tren kenaikan NPL di 3 wilayah kunci. Rekomendasi: Segera lakukan audit verifikasi pada Koperasi di Wilayah Jawa Barat." 
                  : `Berdasarkan data operasional terbaru, sistem mendeteksi efisiensi ${user.role === 'petani' ? 'panen' : 'transaksi'} meningkat 12%. Gunakan rekomendasi harga AI untuk hasil maksimal.`}
              </p>
            </div>
            <div className="flex flex-wrap justify-center lg:justify-start gap-3">
              <Badge variant="outline" className="bg-white/50 border-primary/10 text-[10px] font-bold py-1 px-3">Forecast Akurasi: 98.2%</Badge>
              <Badge variant="outline" className="bg-white/50 border-primary/10 text-[10px] font-bold py-1 px-3">Data Sync: 2 mnt lalu</Badge>
            </div>
          </div>
          
          <div className="flex flex-col gap-3 w-full sm:w-auto">
            <Button className="h-14 rounded-2xl bg-primary px-10 font-black text-white shadow-[0_10px_20px_-10px_rgba(190,8,23,0.5)] hover:bg-rose-800 hover:scale-[1.02] transition-all group" asChild>
              <Link href="/assistant">
                <Brain className="mr-3 h-6 w-6 transition-transform group-hover:rotate-12" /> Tanya AI Sekarang
              </Link>
            </Button>
            <p className="text-[10px] text-center font-bold text-slate-400 uppercase tracking-widest">Powered by KOPDES Intelligence</p>
          </div>
        </div>
      </section>
      
      {renderDashboard()}
    </div>
  )
}
