'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  BarChart3,
  Brain,
  FileText,
  LayoutDashboard,
  ShoppingCart,
  Sprout,
  Truck,
  UserRound,
  Users,
  Wallet,
  Warehouse,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useAuth } from '@/lib/auth'

type NavItem = {
  label: string
  href: string
  icon: LucideIcon
}

const MOBILE_ROLE_NAV: Record<string, NavItem[]> = {
  petani: [
    { label: 'Beranda', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Panen', href: '/produksi', icon: Sprout },
    { label: 'Harga', href: '/pasar/harga', icon: ShoppingCart },
    { label: 'Pinjaman', href: '/keuangan/pinjaman', icon: Wallet },
    { label: 'Profil', href: '/anggota/profil', icon: UserRound },
  ],
  kasir: [
    { label: 'Beranda', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Pasar', href: '/pasar', icon: ShoppingCart },
    { label: 'Gudang', href: '/gudang', icon: Warehouse },
    { label: 'Bayar', href: '/keuangan/pembayaran', icon: Wallet },
    { label: 'AI', href: '/ai/supply-demand', icon: Brain },
  ],
  logistik_manager: [
    { label: 'Beranda', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Kirim', href: '/logistik', icon: Truck },
    { label: 'Gudang', href: '/gudang', icon: Warehouse },
    { label: 'Rute', href: '/logistik/rute', icon: Truck },
    { label: 'AI', href: '/ai/optimasi-rute', icon: Brain },
  ],
  koperasi_manager: [
    { label: 'Beranda', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Anggota', href: '/anggota', icon: Users },
    { label: 'Produksi', href: '/produksi', icon: Sprout },
    { label: 'Keuangan', href: '/keuangan', icon: Wallet },
    { label: 'AI', href: '/ai/forecast', icon: Brain },
  ],
  ketua: [
    { label: 'Beranda', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Kendali', href: '/command-center', icon: BarChart3 },
    { label: 'Anggota', href: '/anggota', icon: Users },
    { label: 'Laporan', href: '/keuangan/laporan', icon: FileText },
    { label: 'AI', href: '/ai/analisis-pasar', icon: Brain },
  ],
  pemda: [
    { label: 'Beranda', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Produksi', href: '/produksi/agregasi', icon: Sprout },
    { label: 'Logistik', href: '/logistik', icon: Truck },
    { label: 'Harga', href: '/pasar/harga', icon: ShoppingCart },
    { label: 'Laporan', href: '/keuangan/laporan', icon: FileText },
  ],
  bank: [
    { label: 'Beranda', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Scoring', href: '/keuangan/credit-scoring', icon: BarChart3 },
    { label: 'Pinjaman', href: '/keuangan/pinjaman', icon: Wallet },
    { label: 'Laporan', href: '/keuangan/laporan', icon: FileText },
    { label: 'AI', href: '/ai', icon: Brain },
  ],
  kementerian: [
    { label: 'Beranda', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Kendali', href: '/command-center', icon: BarChart3 },
    { label: 'Anggota', href: '/anggota', icon: Users },
    { label: 'Keuangan', href: '/keuangan', icon: Wallet },
    { label: 'AI', href: '/ai', icon: Brain },
  ],
  sysadmin: [
    { label: 'Beranda', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Kendali', href: '/command-center', icon: BarChart3 },
    { label: 'Anggota', href: '/anggota', icon: Users },
    { label: 'Keuangan', href: '/keuangan', icon: Wallet },
    { label: 'AI', href: '/ai', icon: Brain },
  ],
}

export function KopdesBottomNav() {
  const pathname = usePathname()
  const { user, canRoute } = useAuth()

  if (!user) return null

  const items = (MOBILE_ROLE_NAV[user.role] ?? []).filter((item) => canRoute(item.href)).slice(0, 5)
  if (items.length === 0) return null

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 px-3 pb-4 pt-2 md:hidden">
      <div className="mx-auto flex max-w-md items-center justify-around rounded-[1.9rem] border border-white/70 bg-white/88 px-2 py-2 shadow-[0_-6px_30px_-16px_rgba(92,64,61,0.18)] backdrop-blur-xl">
        {items.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex min-w-0 flex-col items-center justify-center rounded-full px-3 py-2 text-sm font-semibold transition-all ${
                isActive
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <item.icon className={`mb-1 h-4 w-4 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} />
              <span className="line-clamp-1">{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
