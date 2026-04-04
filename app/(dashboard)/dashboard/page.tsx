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
      <section className="relative overflow-hidden rounded-[2rem] border border-primary/20 bg-gradient-to-br from-rose-50 to-white p-6 shadow-lg">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Brain className="h-32 w-32" />
        </div>
        <div className="relative flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary uppercase tracking-widest">
              <Zap className="h-3 w-3" /> AI Intelligence Core
            </div>
            <h2 className="text-2xl font-black text-slate-950 drop-shadow-sm">Rangkuman Insight AI Hari Ini</h2>
            <p className="max-w-xl text-sm font-medium text-slate-700 leading-relaxed">
              Berdasarkan data real-time dari {user.role === 'kementerian' ? '1,248 Desa' : 'wilayah Anda'}, AI mendeteksi tren positif pada pendapatan anggota dan merekomendasikan fokus pada digitalisasi onboarding minggu ini.
            </p>
          </div>
          <Button className="h-12 rounded-2xl bg-primary px-8 font-bold text-white shadow-md hover:bg-rose-800 transition-all" asChild>
            <Link href="/assistant">
              <Brain className="mr-2 h-5 w-5" /> Tanya AI
            </Link>
          </Button>
        </div>
      </section>
      
      {renderDashboard()}
    </div>
  )
}
