"use client"

import {
  LineChart as LineChartIcon,
  ArrowRight,
  ChevronRight,
  Zap,
  Building2,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

export function DashboardLinks() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Link href="/keuangan/laporan" className="group">
        <Card className="border-border/50 bg-secondary/20 transition-all hover:bg-secondary/40 hover:border-primary/40">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-background flex items-center justify-center border border-border/50 text-primary">
              <LineChartIcon className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold">Laporan Agregat Lengkap</p>
              <p className="text-sm text-muted-foreground mt-0.5">Analisis mendalam per sektor komoditas.</p>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
          </CardContent>
        </Card>
      </Link>
      <Link href="/assistant" className="group">
        <Card className="border-border/50 bg-secondary/20 transition-all hover:bg-secondary/40 hover:border-primary/40">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-background flex items-center justify-center border border-border/50 text-primary">
              <Zap className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold">Asisten AI Digital</p>
              <p className="text-sm text-muted-foreground mt-0.5">Tanya data operasional via chat.</p>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
          </CardContent>
        </Card>
      </Link>
      <Link href="/produksi/agregasi" className="group">
        <Card className="border-border/50 bg-secondary/20 transition-all hover:bg-secondary/40 hover:border-primary/40">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="h-10 w-10 rounded-xl bg-background flex items-center justify-center border border-border/50 text-primary">
              <Building2 className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold">Pusat Data Produksi</p>
              <p className="text-sm text-muted-foreground mt-0.5">Pantau hasil panen wilayah.</p>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
          </CardContent>
        </Card>
      </Link>
    </div>
  )
}
