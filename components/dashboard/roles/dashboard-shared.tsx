'use client'

import { Building2, ChevronRight, LineChart as LineChartIcon, Zap } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'

const LINKS: { href: string; icon: LucideIcon; title: string; description: string }[] = [
  {
    href: '/keuangan/laporan',
    icon: LineChartIcon,
    title: 'Laporan Agregat Lengkap',
    description: 'Analisis mendalam per sektor komoditas.',
  },
  {
    href: '/assistant',
    icon: Zap,
    title: 'Asisten AI Digital',
    description: 'Tanya data operasional via chat.',
  },
  {
    href: '/produksi/agregasi',
    icon: Building2,
    title: 'Pusat Data Produksi',
    description: 'Pantau hasil panen wilayah.',
  },
]

export function DashboardLinks() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {LINKS.map((link) => (
        <Link key={link.href} href={link.href} className="group">
          <Card className="transition-colors hover:border-primary/40">
            <CardContent className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10 text-primary">
                <link.icon className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-foreground">{link.title}</p>
                <p className="truncate text-xs text-muted-foreground">{link.description}</p>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
