'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
  ArrowRight,
  BarChart3,
  Building2,
  Check,
  Landmark,
  Leaf,
  LockKeyhole,
  ShieldCheck,
  Sprout,
  User,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useAuth } from '@/lib/auth'
import { MOCK_USERS } from '@/lib/auth/mock-users'
import { ROLE_CONFIGS } from '@/lib/rbac/roles'
import type { Role } from '@/lib/rbac/types'

type RoleOption = {
  role: Role
  title: string
  subtitle: string
  description: string
  scope: string
  workspace: string
  icon: LucideIcon
  tone: {
    soft: string
    border: string
    icon: string
    badge: string
    selected: string
    selectedIcon: string
  }
}

const ROLE_OPTIONS: RoleOption[] = [
  {
    role: 'petani',
    title: 'Petani',
    subtitle: 'Akses lapangan',
    description: 'Catatan panen, harga pasar, pembiayaan, dan profil anggota pribadi.',
    scope: 'Data pribadi anggota',
    workspace: 'Ruang kerja anggota',
    icon: Sprout,
    tone: {
      soft: 'bg-emerald-50',
      border: 'border-emerald-200',
      icon: 'text-emerald-700',
      badge: 'bg-emerald-100 text-emerald-700',
      selected: 'border-emerald-400 bg-emerald-50 shadow-[0_18px_42px_-30px_rgba(5,150,105,0.4)]',
      selectedIcon: 'bg-emerald-500 text-white border-emerald-500',
    },
  },
  {
    role: 'ketua',
    title: 'Ketua Koperasi',
    subtitle: 'Kendali koperasi',
    description: 'Monitoring anggota, produksi, keuangan, dan keputusan operasional koperasi.',
    scope: 'Level koperasi',
    workspace: 'Pusat kendali koperasi',
    icon: Building2,
    tone: {
      soft: 'bg-amber-50',
      border: 'border-amber-200',
      icon: 'text-amber-700',
      badge: 'bg-amber-100 text-amber-700',
      selected: 'border-amber-400 bg-amber-50 shadow-[0_18px_42px_-30px_rgba(217,119,6,0.35)]',
      selectedIcon: 'bg-amber-500 text-white border-amber-500',
    },
  },
  {
    role: 'kementerian',
    title: 'Kementerian',
    subtitle: 'Pengawasan nasional',
    description: 'Monitoring lintas wilayah, early warning, insight strategis, dan laporan nasional.',
    scope: 'Lintas koperasi nasional',
    workspace: 'Dashboard kebijakan nasional',
    icon: Landmark,
    tone: {
      soft: 'bg-sky-50',
      border: 'border-sky-200',
      icon: 'text-sky-700',
      badge: 'bg-sky-100 text-sky-700',
      selected: 'border-sky-400 bg-sky-50 shadow-[0_18px_42px_-30px_rgba(14,165,233,0.35)]',
      selectedIcon: 'bg-sky-600 text-white border-sky-600',
    },
  },
  {
    role: 'sysadmin',
    title: 'System Admin',
    subtitle: 'Administrasi platform',
    description: 'Audit akses, konfigurasi sistem, dan pengelolaan integrasi lintas koperasi.',
    scope: 'Seluruh platform',
    workspace: 'Panel administrasi sistem',
    icon: ShieldCheck,
    tone: {
      soft: 'bg-slate-100',
      border: 'border-slate-200',
      icon: 'text-slate-700',
      badge: 'bg-slate-200 text-slate-700',
      selected: 'border-slate-400 bg-slate-100 shadow-[0_18px_42px_-30px_rgba(15,23,42,0.35)]',
      selectedIcon: 'bg-slate-800 text-white border-slate-800',
    },
  },
]

export default function LoginPage() {
  const router = useRouter()
  const { loginAs } = useAuth()
  const [selectedRole, setSelectedRole] = useState<Role>('petani')
  const [isLoading, setIsLoading] = useState(false)

  const selectedRoleOption = ROLE_OPTIONS.find((option) => option.role === selectedRole) ?? ROLE_OPTIONS[0]
  const selectedConfig = ROLE_CONFIGS[selectedRole]
  const selectedUser = MOCK_USERS[selectedRole]
  const SelectedRoleIcon = selectedRoleOption.icon

  const handleLogin = () => {
    setIsLoading(true)

    setTimeout(() => {
      document.cookie = `kopdes-session=${selectedRole}; path=/; max-age=86400; samesite=strict`
      loginAs(selectedRole)
      toast.success(`Selamat datang, ${selectedUser.name}!`)
      router.push('/dashboard')
      setIsLoading(false)
    }, 500)
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f6f8fb_0%,#eef2f7_100%)] px-4 py-4 sm:px-6 lg:px-8 lg:py-6">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] w-full max-w-7xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_40px_120px_-70px_rgba(15,23,42,0.35)] lg:grid-cols-[1.08fr_0.92fr]">
        <section className="relative hidden overflow-hidden bg-[linear-gradient(160deg,#0f172a_0%,#16253a_46%,#1f766e_100%)] px-10 py-10 text-white lg:flex lg:flex-col lg:justify-between">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.22),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(16,185,129,0.18),transparent_30%)]" />
          <div className="absolute inset-0 opacity-15 [background-image:linear-gradient(rgba(255,255,255,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:34px_34px]" />

          <div className="relative space-y-8">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm">
                <Leaf className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/70">Koperasi Merah Putih</p>
                <p className="text-lg font-semibold tracking-tight">Portal Akses Role</p>
              </div>
            </div>

            <div className="max-w-xl space-y-4">
              <h1 className="text-4xl font-bold leading-tight tracking-tight text-white">
                Akses tersegmentasi untuk operasi koperasi, pengawasan, dan administrasi sistem.
              </h1>
              <p className="max-w-lg text-base leading-7 text-slate-200">
                Halaman masuk ini dirancang untuk lingkungan kerja produksi dengan struktur peran yang jelas,
                kontrol akses yang tegas, dan tampilan yang siap dipakai untuk sistem pemerintah atau enterprise.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-white/12 bg-white/8 p-4 backdrop-blur-sm">
                <p className="text-xs uppercase tracking-[0.18em] text-sky-100/80">Peran Utama</p>
                <p className="mt-3 text-3xl font-bold text-white">4</p>
                <p className="mt-1 text-sm text-slate-200">Petani, Ketua, Kementerian, dan System Admin</p>
              </div>
              <div className="rounded-xl border border-white/12 bg-white/8 p-4 backdrop-blur-sm">
                <p className="text-xs uppercase tracking-[0.18em] text-emerald-100/80">Struktur Akses</p>
                <p className="mt-3 text-3xl font-bold text-white">RBAC</p>
                <p className="mt-1 text-sm text-slate-200">Setiap role membuka menu dan data sesuai kewenangan</p>
              </div>
              <div className="rounded-xl border border-white/12 bg-white/8 p-4 backdrop-blur-sm">
                <p className="text-xs uppercase tracking-[0.18em] text-amber-100/80">Kesiapan Operasi</p>
                <p className="mt-3 text-3xl font-bold text-white">24/7</p>
                <p className="mt-1 text-sm text-slate-200">Dirancang untuk pemantauan harian dan pengambilan keputusan</p>
              </div>
            </div>
          </div>

          <div className="relative space-y-4">
            <div className="rounded-2xl border border-white/12 bg-slate-950/22 p-6 backdrop-blur-sm">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">Struktur Akses</p>
                  <p className="mt-2 text-xl font-semibold text-white">Empat gerbang peran utama</p>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
                  <LockKeyhole className="h-5 w-5 text-white" />
                </div>
              </div>

              <div className="space-y-3">
                {ROLE_OPTIONS.map((option) => {
                  const Icon = option.icon

                  return (
                    <div key={option.role} className="flex items-start gap-3 rounded-xl border border-white/8 bg-white/[0.04] p-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${option.tone.soft}`}>
                        <Icon className={`h-5 w-5 ${option.tone.icon}`} />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-white">{option.title}</p>
                        <p className="text-sm text-slate-200">{option.scope}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-xl border border-emerald-300/20 bg-emerald-400/10 p-4">
              <ShieldCheck className="mt-0.5 h-5 w-5 text-emerald-100" />
              <div>
                <p className="font-medium text-white">Akses dan audit lebih mudah dikendalikan</p>
                <p className="mt-1 text-sm leading-6 text-slate-200">
                  Pemilihan role di halaman masuk ini langsung menentukan ruang kerja, lingkup data, dan kewenangan
                  yang tersedia setelah login.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center px-5 py-6 sm:px-8 sm:py-8 lg:px-10 lg:py-10">
          <div className="w-full max-w-2xl">
            <div className="mb-6 flex items-center gap-3 lg:hidden">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Leaf className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">Koperasi Merah Putih</p>
                <p className="text-lg font-semibold tracking-tight text-foreground">Portal Akses Role</p>
              </div>
            </div>

            <Card className="border-slate-200 shadow-[0_32px_90px_-70px_rgba(15,23,42,0.35)]">
              <CardContent className="space-y-6 p-6 sm:p-8">
                <div className="space-y-2">
                  <Badge className="rounded-md border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50">
                    Role-Based Access Login
                  </Badge>
                  <div className="space-y-3">
                    <h2 className="text-3xl font-bold tracking-tight text-slate-950">Masuk ke sistem</h2>
                    <p className="max-w-xl text-sm leading-6 text-slate-600">
                      Pilih salah satu peran utama untuk membuka workspace sesuai lingkup akses. Setiap peran memiliki
                      menu, data, dan kewenangan yang berbeda.
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Peran Utama</p>
                      <p className="text-sm text-slate-500">Tersusun untuk kebutuhan operasional, pengawasan, dan administrasi.</p>
                    </div>
                    <div className="hidden items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600 sm:flex">
                      <BarChart3 className="h-3.5 w-3.5" />
                      Desktop-first layout
                    </div>
                  </div>

                  <div className="grid gap-3 md:grid-cols-2">
                    {ROLE_OPTIONS.map((option) => {
                      const Icon = option.icon
                      const isSelected = selectedRole === option.role

                      return (
                        <button
                          key={option.role}
                          type="button"
                          onClick={() => setSelectedRole(option.role)}
                          className={`group rounded-xl border p-4 text-left transition-all ${
                            isSelected
                              ? option.tone.selected
                              : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/70'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className={`flex h-11 w-11 items-center justify-center rounded-lg border ${isSelected ? option.tone.selectedIcon : `${option.tone.soft} ${option.tone.border}`}`}>
                              <Icon className={`h-5 w-5 ${isSelected ? 'text-white' : option.tone.icon}`} />
                            </div>
                            <div className={`flex h-6 w-6 items-center justify-center rounded-full border ${isSelected ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-200 text-transparent group-hover:border-slate-300'}`}>
                              <Check className="h-3.5 w-3.5" />
                            </div>
                          </div>

                          <div className="mt-4 space-y-2">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="text-base font-semibold text-slate-950">{option.title}</p>
                              <span className={`rounded-md px-2 py-1 text-xs font-medium ${option.tone.badge}`}>
                                {option.subtitle}
                              </span>
                            </div>
                            <p className="text-sm text-slate-600">{option.description}</p>
                            <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">{option.scope}</p>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-5">
                  <div className="flex items-start gap-4">
                    <div className={`flex h-11 w-11 items-center justify-center rounded-lg border ${selectedRoleOption.tone.selectedIcon}`}>
                      <SelectedRoleIcon className="h-5 w-5 text-white" />
                    </div>

                    <div className="min-w-0 flex-1 space-y-4">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-base font-semibold text-slate-950">{selectedUser.name}</p>
                        <Badge className={`rounded-md px-2.5 py-1 ${selectedRoleOption.tone.badge}`}>
                          {selectedRoleOption.title}
                        </Badge>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-3">
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Email Sesi</p>
                          <p className="mt-2 text-sm text-slate-700">{selectedUser.email}</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Lingkup Data</p>
                          <p className="mt-2 text-sm text-slate-700">{selectedRoleOption.scope}</p>
                        </div>
                        <div>
                          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Hak Akses</p>
                          <p className="mt-2 text-sm text-slate-700">{selectedConfig.permissions.length} izin aktif</p>
                        </div>
                      </div>

                      <div className="rounded-lg border border-slate-200 bg-white px-4 py-3">
                        <div className="flex items-start gap-3">
                          <User className="mt-0.5 h-4 w-4 text-slate-500" />
                          <div>
                            <p className="text-sm font-medium text-slate-900">{selectedRoleOption.workspace}</p>
                            <p className="mt-1 text-sm leading-6 text-slate-600">{selectedRoleOption.description}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-3 border-t border-slate-200 pt-2 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-sm text-slate-500">
                    Akses akan diarahkan langsung ke dashboard sesuai peran yang dipilih.
                  </p>
                  <Button
                    onClick={handleLogin}
                    disabled={isLoading}
                    className="h-11 rounded-lg bg-slate-900 px-5 text-sm font-semibold text-white hover:bg-slate-800"
                  >
                    {isLoading ? 'Memproses akses...' : 'Masuk ke Dashboard'}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>

                <div className="rounded-xl border border-slate-200 bg-white p-4">
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="mt-0.5 h-5 w-5 text-slate-700" />
                    <div>
                      <p className="text-sm font-semibold text-slate-900">Kebijakan akses berbasis peran</p>
                      <p className="mt-1 text-sm leading-6 text-slate-600">
                        Role menentukan visibilitas menu, halaman, data finansial, data anggota, dan lingkup monitoring
                        yang tersedia setelah login.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  )
}
