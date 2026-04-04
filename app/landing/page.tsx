'use client'

import Link from 'next/link'
import {
  ArrowRight,
  Building2,
  Landmark,
  Leaf,
  LockKeyhole,
  ShieldCheck,
  Sprout,
  UserCog,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

type EntryRole = {
  title: string
  scope: string
  description: string
  icon: LucideIcon
  tone: string
}

const ENTRY_ROLES: EntryRole[] = [
  {
    title: 'Petani',
    scope: 'Data pribadi anggota',
    description: 'Akses usaha tani, panen, pembiayaan, dan aktivitas anggota.',
    icon: Sprout,
    tone: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  {
    title: 'Ketua Koperasi',
    scope: 'Lingkup koperasi',
    description: 'Monitoring operasional, anggota, keuangan, dan keputusan strategis.',
    icon: Building2,
    tone: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  {
    title: 'Kementerian',
    scope: 'Lintas koperasi nasional',
    description: 'Pengawasan nasional, analitik, alert risiko, dan laporan wilayah.',
    icon: Landmark,
    tone: 'bg-rose-50 text-rose-700 border-rose-200',
  },
  {
    title: 'System Admin',
    scope: 'Seluruh platform',
    description: 'Administrasi sistem, audit akses, dan kontrol konfigurasi platform.',
    icon: UserCog,
    tone: 'bg-stone-100 text-stone-700 border-stone-200',
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f6f8fb_0%,#eef2f6_100%)] text-slate-950">
      <header className="border-b border-slate-200 bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Leaf className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Koperasi Merah Putih</p>
              <p className="text-lg font-semibold tracking-tight text-slate-950">Portal Akses Nasional</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="outline" className="hidden border-slate-300 bg-white text-slate-700 hover:bg-slate-50 sm:inline-flex" asChild>
              <Link href="/login">Masuk</Link>
            </Button>
            <Button className="bg-primary text-primary-foreground hover:bg-primary/92" asChild>
              <Link href="/login">
                Akses Sistem
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main>
        <section className="px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <div className="mx-auto grid w-full max-w-7xl gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-start">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="rounded-md border border-primary/15 bg-primary/[0.06] px-3 py-1 text-xs font-medium text-primary hover:bg-primary/[0.06]">
                  Sistem Akses Terpadu
                </Badge>
                <h1 className="max-w-4xl text-4xl font-bold leading-tight tracking-tight text-slate-950 sm:text-5xl">
                  Akses terkelola untuk operasional koperasi, pengawasan nasional, dan administrasi sistem.
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-slate-600">
                  Portal ini menjadi pintu masuk resmi untuk role utama dalam ekosistem Koperasi Merah Putih.
                  Setiap pengguna diarahkan ke workspace yang sesuai dengan kewenangan, lingkup data, dan tanggung
                  jawab institusionalnya.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <Card className="border-slate-200 bg-white shadow-sm">
                  <CardContent className="p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Peran Utama</p>
                    <p className="mt-4 text-4xl font-bold text-slate-950">4</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">Struktur akses utama untuk pengguna inti sistem.</p>
                  </CardContent>
                </Card>
                <Card className="border-slate-200 bg-white shadow-sm">
                  <CardContent className="p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Kontrol</p>
                    <p className="mt-4 text-4xl font-bold text-slate-950">RBAC</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">Hak akses ditetapkan konsisten berdasarkan role.</p>
                  </CardContent>
                </Card>
                <Card className="border-slate-200 bg-white shadow-sm">
                  <CardContent className="p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Kesiapan</p>
                    <p className="mt-4 text-4xl font-bold text-slate-950">Produksi</p>
                    <p className="mt-2 text-sm leading-6 text-slate-600">Dirancang untuk penggunaan harian yang stabil dan terukur.</p>
                  </CardContent>
                </Card>
              </div>

              <Card className="border-slate-200 bg-white shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-rose-200 bg-rose-50 text-rose-700">
                      <LockKeyhole className="h-5 w-5" />
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-950">Alur akses dibuat singkat dan jelas</p>
                        <p className="mt-1 text-sm leading-6 text-slate-600">
                          Pengguna cukup memilih peran, memverifikasi kredensial, lalu langsung masuk ke dashboard sesuai
                          kewenangan tanpa melalui langkah yang tidak relevan.
                        </p>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-3">
                        <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                          1. Pilih role utama
                        </div>
                        <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                          2. Verifikasi akun
                        </div>
                        <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                          3. Masuk ke workspace
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <Card className="border-slate-200 bg-white shadow-[0_30px_80px_-60px_rgba(15,23,42,0.45)]">
                <CardContent className="space-y-5 p-6">
                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Peran Akses</p>
                    <h2 className="text-2xl font-bold tracking-tight text-slate-950">Empat role utama dalam satu portal</h2>
                    <p className="text-sm leading-6 text-slate-600">
                      Setiap peran memiliki cakupan data dan ruang kerja yang berbeda untuk menjaga ketertiban akses.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {ENTRY_ROLES.map((role) => {
                      const Icon = role.icon

                      return (
                        <div key={role.title} className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
                          <div className="flex items-start gap-4">
                            <div className={`flex h-11 w-11 items-center justify-center rounded-lg border ${role.tone}`}>
                              <Icon className="h-5 w-5" />
                            </div>
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <p className="text-base font-semibold text-slate-950">{role.title}</p>
                                <span className="rounded-md bg-white px-2 py-1 text-xs font-medium text-slate-600">
                                  {role.scope}
                                </span>
                              </div>
                              <p className="mt-2 text-sm leading-6 text-slate-600">{role.description}</p>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  <div className="rounded-xl border border-primary/15 bg-primary/[0.04] p-4">
                    <div className="flex items-start gap-3">
                      <ShieldCheck className="mt-0.5 h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm font-semibold text-slate-950">Akses berbasis role dengan kontrol tegas</p>
                        <p className="mt-1 text-sm leading-6 text-slate-600">
                          Portal login hanya menampilkan role utama untuk mempercepat akses dan mengurangi beban
                          pengambilan keputusan bagi pengguna.
                        </p>
                      </div>
                    </div>
                  </div>

                  <Button className="h-11 w-full bg-primary text-primary-foreground hover:bg-primary/92" asChild>
                    <Link href="/login">
                      Masuk ke Portal Akses
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
