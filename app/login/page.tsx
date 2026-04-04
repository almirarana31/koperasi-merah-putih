'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  Landmark,
  Leaf,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Sprout,
  UserCog,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { useAuth } from '@/lib/auth'
import { MOCK_USERS } from '@/lib/auth/mock-users'
import type { Role } from '@/lib/rbac/types'

type RoleAccessOption = {
  role: Role
  title: string
  shortDescription: string
  scope: string
  workspace: string
  icon: LucideIcon
  tone: {
    iconWrap: string
    icon: string
    badge: string
    border: string
    selected: string
    selectedRing: string
  }
}

const ROLE_ACCESS_OPTIONS: RoleAccessOption[] = [
  {
    role: 'petani',
    title: 'Petani',
    shortDescription: 'Akses data usaha, panen, pembiayaan, dan profil anggota pribadi.',
    scope: 'Data pribadi anggota',
    workspace: 'Ruang kerja anggota',
    icon: Sprout,
    tone: {
      iconWrap: 'bg-emerald-50 border-emerald-200',
      icon: 'text-emerald-700',
      badge: 'bg-emerald-100 text-emerald-700',
      border: 'border-emerald-200',
      selected: 'border-emerald-400 bg-emerald-50/90',
      selectedRing: 'ring-emerald-100',
    },
  },
  {
    role: 'ketua',
    title: 'Ketua Koperasi',
    shortDescription: 'Monitoring operasional koperasi, keuangan, dan pengambilan keputusan strategis.',
    scope: 'Lingkup koperasi',
    workspace: 'Pusat kendali koperasi',
    icon: Building2,
    tone: {
      iconWrap: 'bg-amber-50 border-amber-200',
      icon: 'text-amber-700',
      badge: 'bg-amber-100 text-amber-700',
      border: 'border-amber-200',
      selected: 'border-amber-400 bg-amber-50/90',
      selectedRing: 'ring-amber-100',
    },
  },
  {
    role: 'kementerian',
    title: 'Kementerian',
    shortDescription: 'Pengawasan nasional, analitik kinerja, early warning, dan laporan lintas wilayah.',
    scope: 'Lintas koperasi nasional',
    workspace: 'Dashboard pengawasan nasional',
    icon: Landmark,
    tone: {
      iconWrap: 'bg-sky-50 border-sky-200',
      icon: 'text-sky-700',
      badge: 'bg-sky-100 text-sky-700',
      border: 'border-sky-200',
      selected: 'border-sky-400 bg-sky-50/90',
      selectedRing: 'ring-sky-100',
    },
  },
  {
    role: 'sysadmin',
    title: 'System Admin',
    shortDescription: 'Administrasi platform, audit akses, integrasi, dan kontrol konfigurasi sistem.',
    scope: 'Seluruh platform',
    workspace: 'Panel administrasi sistem',
    icon: UserCog,
    tone: {
      iconWrap: 'bg-slate-100 border-slate-200',
      icon: 'text-slate-700',
      badge: 'bg-slate-200 text-slate-700',
      border: 'border-slate-200',
      selected: 'border-slate-400 bg-slate-100/90',
      selectedRing: 'ring-slate-200',
    },
  },
]

const ROLE_PASSWORDS: Record<Role, string> = {
  petani: 'KopdesPetani#2026',
  ketua: 'KopdesKetua#2026',
  kementerian: 'KopdesGov#2026',
  sysadmin: 'KopdesAdmin#2026',
  kasir: 'KopdesKasir#2026',
  koperasi_manager: 'KopdesManager#2026',
  logistik_manager: 'KopdesLogistik#2026',
  pemda: 'KopdesPemda#2026',
  bank: 'KopdesBank#2026',
}

type FormErrors = {
  email?: string
  password?: string
  general?: string
}

export default function LoginPage() {
  const router = useRouter()
  const { loginAs } = useAuth()
  const [selectedRole, setSelectedRole] = useState<Role>('petani')
  const [email, setEmail] = useState(MOCK_USERS.petani.email)
  const [password, setPassword] = useState(ROLE_PASSWORDS.petani)
  const [errors, setErrors] = useState<FormErrors>({})
  const [isLoading, setIsLoading] = useState(false)

  const selectedOption = useMemo(
    () => ROLE_ACCESS_OPTIONS.find((option) => option.role === selectedRole) ?? ROLE_ACCESS_OPTIONS[0],
    [selectedRole],
  )
  const selectedUser = MOCK_USERS[selectedRole]
  const expectedPassword = ROLE_PASSWORDS[selectedRole]

  useEffect(() => {
    setEmail(MOCK_USERS[selectedRole].email)
    setPassword(ROLE_PASSWORDS[selectedRole])
    setErrors({})
  }, [selectedRole])

  const validateForm = () => {
    const nextErrors: FormErrors = {}
    const normalizedEmail = email.trim().toLowerCase()
    const expectedEmail = selectedUser.email.toLowerCase()

    if (!normalizedEmail) {
      nextErrors.email = 'Email wajib diisi.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      nextErrors.email = 'Format email tidak valid.'
    } else if (normalizedEmail !== expectedEmail) {
      nextErrors.email = `Akun email untuk peran ${selectedOption.title} harus menggunakan ${selectedUser.email}.`
    }

    if (!password.trim()) {
      nextErrors.password = 'Kata sandi wajib diisi.'
    } else if (password.length < 12) {
      nextErrors.password = 'Kata sandi minimal 12 karakter.'
    } else if (password !== expectedPassword) {
      nextErrors.password = 'Kata sandi tidak sesuai untuk peran yang dipilih.'
    }

    if (Object.keys(nextErrors).length > 0) {
      nextErrors.general = 'Periksa kembali kredensial dan peran akses yang dipilih.'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!validateForm()) return

    setIsLoading(true)

    window.setTimeout(() => {
      document.cookie = `kopdes-session=${selectedRole}; path=/; max-age=86400; samesite=strict`
      loginAs(selectedRole)
      toast.success(`Akses diberikan untuk ${selectedUser.name}.`)
      router.push('/dashboard')
      setIsLoading(false)
    }, 500)
  }

  const SelectedIcon = selectedOption.icon

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f5f7fa_0%,#eef2f6_100%)] px-4 py-4 sm:px-6 lg:px-8 lg:py-6">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] w-full max-w-7xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_44px_120px_-72px_rgba(15,23,42,0.35)] lg:grid-cols-[1.02fr_0.98fr]">
        <section className="relative hidden overflow-hidden bg-[linear-gradient(165deg,#fffefe_0%,#f7f1f1_36%,#f2f4f7_100%)] px-10 py-10 lg:flex lg:flex-col lg:justify-start lg:gap-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(190,8,23,0.08),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(15,23,42,0.05),transparent_30%)]" />
          <div className="relative space-y-8">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Leaf className="h-6 w-6" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Koperasi Merah Putih</p>
                <p className="text-xl font-semibold tracking-tight text-slate-950">Portal Akses Role</p>
              </div>
            </div>

            <div className="space-y-4">
              <h1 className="max-w-2xl text-4xl font-bold leading-tight tracking-tight text-slate-950">
                Sistem akses terstruktur untuk operasional koperasi, pengawasan nasional, dan administrasi platform.
              </h1>
              <p className="max-w-xl text-base leading-7 text-slate-600">
                Halaman masuk ini dirancang untuk penggunaan nyata dalam lingkungan kerja pemerintah dan koperasi,
                dengan seleksi peran yang jelas, validasi kredensial, dan pengalaman masuk yang ringkas serta andal.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Peran Utama</p>
                <p className="mt-4 text-4xl font-bold text-slate-950">4</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">Petani, Ketua Koperasi, Kementerian, dan System Admin.</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Akses</p>
                <p className="mt-4 text-4xl font-bold text-slate-950">RBAC</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">Hak akses ditentukan otomatis berdasarkan peran yang dipilih.</p>
              </div>
              <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Kesiapan</p>
                <p className="mt-4 text-4xl font-bold text-slate-950">Siap Pakai</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">Dirancang untuk lingkungan kerja produksi dengan kontrol yang jelas.</p>
              </div>
            </div>
          </div>

          <div className="relative space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-950 px-6 py-6 text-white shadow-[0_24px_60px_-40px_rgba(15,23,42,0.85)]">
              <div className="mb-5 flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">Struktur Akses</p>
                  <p className="mt-2 text-xl font-semibold">Empat peran utama sistem</p>
                </div>
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
                  <LockKeyhole className="h-5 w-5 text-white" />
                </div>
              </div>

              <div className="space-y-3">
                {ROLE_ACCESS_OPTIONS.map((option) => {
                  const Icon = option.icon

                  return (
                    <div key={option.role} className="flex items-start gap-3 rounded-xl border border-white/8 bg-white/[0.04] p-3">
                      <div className={`flex h-10 w-10 items-center justify-center rounded-lg border ${option.tone.iconWrap}`}>
                        <Icon className={`h-5 w-5 ${option.tone.icon}`} />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-white">{option.title}</p>
                        <p className="text-sm text-slate-300">{option.scope}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="rounded-xl border border-primary/15 bg-primary/[0.04] p-5">
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 h-5 w-5 text-primary" />
                <div>
                  <p className="font-medium text-slate-950">Akses dan audit dikendalikan secara tegas</p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    Setiap login menentukan visibilitas menu, akses data, dan otorisasi halaman sesuai kewenangan
                    role tanpa membuka area yang tidak relevan.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="flex items-center justify-center px-5 py-6 sm:px-8 lg:px-10 lg:py-10">
          <div className="w-full max-w-2xl">
            <div className="mb-6 flex items-center gap-3 lg:hidden">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Leaf className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">Koperasi Merah Putih</p>
                <p className="text-lg font-semibold tracking-tight text-slate-950">Portal Akses Role</p>
              </div>
            </div>

            <Card className="border-slate-200 shadow-[0_32px_90px_-72px_rgba(15,23,42,0.35)]">
              <CardContent className="space-y-6 p-6 sm:p-8">
                <div className="space-y-3">
                  <Badge className="rounded-md border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50">
                    Login Berbasis Peran
                  </Badge>
                  <div className="space-y-2">
                    <h2 className="text-3xl font-bold tracking-tight text-slate-950">Masuk ke sistem</h2>
                    <p className="max-w-xl text-sm leading-6 text-slate-600">
                      Pilih peran utama, verifikasi akun yang terdaftar, lalu lanjutkan ke workspace yang sesuai.
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-slate-950">Peran Utama</p>
                      <p className="text-sm text-slate-500">Pemilihan role menentukan ruang kerja dan lingkup data.</p>
                    </div>
                    <Badge className="rounded-md border border-primary/15 bg-primary/[0.05] text-primary hover:bg-primary/[0.05]">
                      Akses terarah
                    </Badge>
                  </div>

                  <div className="grid gap-3">
                    {ROLE_ACCESS_OPTIONS.map((option) => {
                      const Icon = option.icon
                      const isSelected = selectedRole === option.role

                      return (
                        <button
                          key={option.role}
                          type="button"
                          onClick={() => setSelectedRole(option.role)}
                          className={`rounded-xl border p-4 text-left transition-all focus:outline-none focus:ring-4 ${
                            isSelected
                              ? `${option.tone.selected} ${option.tone.selectedRing}`
                              : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/70 focus:ring-slate-100'
                          }`}
                          aria-pressed={isSelected}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex min-w-0 items-start gap-4">
                              <div className={`mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border ${option.tone.iconWrap}`}>
                                <Icon className={`h-5 w-5 ${option.tone.icon}`} />
                              </div>
                              <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                  <p className="text-base font-semibold text-slate-950">{option.title}</p>
                                  <span className={`rounded-md px-2 py-1 text-xs font-medium ${option.tone.badge}`}>
                                    {option.workspace}
                                  </span>
                                </div>
                                <p className="mt-2 text-sm leading-6 text-slate-600">{option.shortDescription}</p>
                                <p className="mt-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                                  {option.scope}
                                </p>
                              </div>
                            </div>
                            <div className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${
                              isSelected ? 'border-primary bg-primary text-white' : 'border-slate-300 text-transparent'
                            }`}>
                              <CheckCircle2 className="h-3.5 w-3.5" />
                            </div>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>

                <Separator />

                <form className="space-y-5" onSubmit={handleSubmit} noValidate>
                  <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-5">
                    <div className="flex items-start gap-4">
                      <div className={`flex h-11 w-11 items-center justify-center rounded-lg border ${selectedOption.tone.iconWrap}`}>
                        <SelectedIcon className={`h-5 w-5 ${selectedOption.tone.icon}`} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="text-base font-semibold text-slate-950">{selectedUser.name}</p>
                          <Badge className={`rounded-md ${selectedOption.tone.badge}`}>
                            {selectedOption.title}
                          </Badge>
                        </div>
                        <p className="mt-2 text-sm leading-6 text-slate-600">{selectedOption.workspace}</p>
                      </div>
                    </div>
                  </div>

                  <div className="grid gap-5">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-sm font-semibold text-slate-900">
                        Email akun
                      </Label>
                      <div className="relative">
                        <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(event) => setEmail(event.target.value)}
                          className="h-11 border-slate-300 bg-white pl-10 text-sm"
                          aria-invalid={Boolean(errors.email)}
                          autoComplete="username"
                        />
                      </div>
                      {errors.email ? (
                        <p className="text-sm text-red-600">{errors.email}</p>
                      ) : (
                        <p className="text-sm text-slate-500">Gunakan akun yang telah terdaftar untuk peran terpilih.</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password" className="text-sm font-semibold text-slate-900">
                        Kata sandi
                      </Label>
                      <div className="relative">
                        <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                        <Input
                          id="password"
                          type="password"
                          value={password}
                          onChange={(event) => setPassword(event.target.value)}
                          className="h-11 border-slate-300 bg-white pl-10 text-sm"
                          aria-invalid={Boolean(errors.password)}
                          autoComplete="current-password"
                        />
                      </div>
                      {errors.password ? (
                        <p className="text-sm text-red-600">{errors.password}</p>
                      ) : (
                        <p className="text-sm text-slate-500">Kredensial diverifikasi berdasarkan role yang sedang aktif.</p>
                      )}
                    </div>
                  </div>

                  {errors.general && (
                    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3">
                      <p className="text-sm font-medium text-red-700">{errors.general}</p>
                    </div>
                  )}

                  <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
                    <p className="text-sm text-slate-500">Akses akan diarahkan langsung ke dashboard sesuai kewenangan role.</p>
                    <Button
                      type="submit"
                      disabled={isLoading}
                      className="h-11 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground hover:bg-primary/92"
                    >
                      {isLoading ? 'Memverifikasi akses...' : 'Masuk ke Dashboard'}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  )
}
