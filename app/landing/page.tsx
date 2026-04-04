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
    <div className="relative min-h-screen overflow-hidden bg-[#f8f9fa] text-slate-950">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(145,0,15,0.08),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(184,25,31,0.05),transparent_28%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:linear-gradient(rgba(120,113,108,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(120,113,108,0.06)_1px,transparent_1px)] [background-size:32px_32px]" />

      <header className="relative border-b border-[#ead8d6]/80 bg-white/82 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[linear-gradient(135deg,#91000f_0%,#b8191f_100%)] text-white shadow-[0_14px_28px_-18px_rgba(145,0,15,0.55)]">
              <Leaf className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[#7b5c57]">Koperasi Merah Putih</p>
              <p className="font-display text-lg font-semibold tracking-tight text-slate-950">Portal Akses Nasional</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="hidden border-[#e4beba]/60 bg-white text-[#6b4a46] hover:bg-[#fbf7f6] sm:inline-flex"
              asChild
            >
              <Link href="/login">Masuk</Link>
            </Button>
            <Button
              className="bg-[linear-gradient(135deg,#91000f_0%,#b8191f_100%)] text-primary-foreground shadow-[0_18px_36px_-22px_rgba(145,0,15,0.55)] hover:opacity-95"
              asChild
            >
              <Link href="/login">
                Akses Sistem
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main>
        <section className="relative px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          <div className="mx-auto grid w-full max-w-7xl gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-start">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="rounded-md border border-[#e4beba]/70 bg-[#ffefed] px-3 py-1 text-xs font-medium text-[#930010] hover:bg-[#ffefed]">
                  Institutional Access Gateway
                </Badge>
                <h1 className="max-w-4xl font-display text-4xl font-bold leading-tight tracking-tight text-slate-950 sm:text-5xl">
                  Akses terkelola untuk operasional koperasi, pengawasan nasional, dan administrasi sistem.
                </h1>
                <p className="max-w-2xl text-lg leading-8 text-[#5f666d]">
                  Portal ini menjadi pintu masuk resmi untuk role utama dalam ekosistem Koperasi Merah Putih.
                  Setiap pengguna diarahkan ke workspace yang sesuai dengan kewenangan, lingkup data, dan tanggung
                  jawab institusionalnya.
                </p>
              </div>

              <div className="grid gap-4 rounded-[28px] bg-[#f3f4f5] p-4 sm:grid-cols-3">
                <Card className="border-[#ead8d6]/50 bg-white shadow-[0_18px_36px_-30px_rgba(145,0,15,0.18)]">
                  <CardContent className="p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7b5c57]">Peran Utama</p>
                    <p className="mt-4 font-display text-4xl font-bold text-slate-950">4</p>
                    <p className="mt-2 text-sm leading-6 text-[#5f666d]">Struktur akses utama untuk pengguna inti sistem.</p>
                  </CardContent>
                </Card>
                <Card className="border-[#ead8d6]/50 bg-white shadow-[0_18px_36px_-30px_rgba(145,0,15,0.18)]">
                  <CardContent className="p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7b5c57]">Kontrol</p>
                    <p className="mt-4 font-display text-4xl font-bold text-slate-950">RBAC</p>
                    <p className="mt-2 text-sm leading-6 text-[#5f666d]">Hak akses ditetapkan konsisten berdasarkan role.</p>
                  </CardContent>
                </Card>
                <Card className="border-[#ead8d6]/50 bg-white shadow-[0_18px_36px_-30px_rgba(145,0,15,0.18)]">
                  <CardContent className="p-5">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#7b5c57]">Kesiapan</p>
                    <p className="mt-4 font-display text-4xl font-bold text-slate-950">Produksi</p>
                    <p className="mt-2 text-sm leading-6 text-[#5f666d]">Dirancang untuk penggunaan harian yang stabil dan terukur.</p>
                  </CardContent>
                </Card>
              </div>

              <Card className="border-[#ead8d6]/50 bg-[#f3f4f5] shadow-[0_20px_44px_-34px_rgba(145,0,15,0.16)]">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#e4beba]/70 bg-white text-[#930010]">
                      <LockKeyhole className="h-5 w-5" />
                    </div>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-950">Alur akses dibuat singkat dan jelas</p>
                        <p className="mt-1 text-sm leading-6 text-[#5f666d]">
                          Pengguna cukup memilih peran, memverifikasi kredensial, lalu langsung masuk ke dashboard sesuai
                          kewenangan tanpa melalui langkah yang tidak relevan.
                        </p>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-3">
                        <div className="rounded-lg bg-white px-4 py-3 text-sm text-[#5f666d] shadow-[inset_0_0_0_1px_rgba(228,190,186,0.45)]">
                          1. Pilih role utama
                        </div>
                        <div className="rounded-lg bg-white px-4 py-3 text-sm text-[#5f666d] shadow-[inset_0_0_0_1px_rgba(228,190,186,0.45)]">
                          2. Verifikasi akun
                        </div>
                        <div className="rounded-lg bg-white px-4 py-3 text-sm text-[#5f666d] shadow-[inset_0_0_0_1px_rgba(228,190,186,0.45)]">
                          3. Masuk ke workspace
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <Card className="border-[#ead8d6]/55 bg-[#f3f4f5] shadow-[0_28px_72px_-54px_rgba(145,0,15,0.22)]">
                <CardContent className="space-y-5 p-6">
                  <div className="space-y-2">
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#7b5c57]">Peran Akses</p>
                    <h2 className="font-display text-2xl font-bold tracking-tight text-slate-950">Empat role utama dalam satu portal</h2>
                    <p className="text-sm leading-6 text-[#5f666d]">
                      Setiap peran memiliki cakupan data dan ruang kerja yang berbeda untuk menjaga ketertiban akses.
                    </p>
                  </div>

                  <div className="space-y-3">
                    {ENTRY_ROLES.map((role) => {
                      const Icon = role.icon

                      return (
                        <div
                          key={role.title}
                          className="rounded-xl bg-white p-4 shadow-[inset_0_0_0_1px_rgba(228,190,186,0.45)]"
                        >
                          <div className="flex items-start gap-4">
                            <div className={`flex h-11 w-11 items-center justify-center rounded-lg border ${role.tone}`}>
                              <Icon className="h-5 w-5" />
                            </div>
                            <div className="min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <p className="text-base font-semibold text-slate-950">{role.title}</p>
                                <span className="rounded-md bg-[#f3f4f5] px-2 py-1 text-xs font-medium text-[#5f666d]">
                                  {role.scope}
                                </span>
                              </div>
                              <p className="mt-2 text-sm leading-6 text-[#5f666d]">{role.description}</p>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  <div className="rounded-xl bg-white p-4 shadow-[inset_0_0_0_1px_rgba(228,190,186,0.45)]">
                    <div className="flex items-start gap-3">
                      <ShieldCheck className="mt-0.5 h-5 w-5 text-primary" />
                      <div>
                        <p className="text-sm font-semibold text-slate-950">Akses berbasis role dengan kontrol tegas</p>
                        <p className="mt-1 text-sm leading-6 text-[#5f666d]">
                          Portal login hanya menampilkan role utama untuk mempercepat akses dan mengurangi beban
                          pengambilan keputusan bagi pengguna.
                        </p>
                      </div>
                    </div>
                  </div>

                  <Button
                    className="h-11 w-full bg-[linear-gradient(135deg,#91000f_0%,#b8191f_100%)] text-primary-foreground shadow-[0_18px_36px_-22px_rgba(145,0,15,0.45)] hover:opacity-95"
                    asChild
                  >
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
