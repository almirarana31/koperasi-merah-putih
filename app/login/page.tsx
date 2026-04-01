'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { ArrowRight, Check, Leaf, ShieldCheck, User } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/lib/auth'
import { ROLE_CONFIGS, ALL_ROLES } from '@/lib/rbac/roles'
import { MOCK_USERS } from '@/lib/auth/mock-users'
import type { Role } from '@/lib/rbac/types'

const PRIMARY_ROLES: Role[] = ['petani', 'koperasi_manager', 'ketua', 'kasir']

function getScopeLabel(role: Role) {
  const config = ROLE_CONFIGS[role]

  if (config.dataScope === 'own') return 'Data pribadi'
  if (config.dataScope === 'koperasi') return 'Level koperasi'
  if (config.dataScope === 'district_aggregate') return 'Agregat kabupaten'
  if (config.dataScope === 'national_aggregate') return 'Agregat nasional'
  return 'Seluruh koperasi'
}

export default function LoginPage() {
  const router = useRouter()
  const { loginAs } = useAuth()
  const [selectedRole, setSelectedRole] = useState<Role>('petani')
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = () => {
    setIsLoading(true)

    setTimeout(() => {
      // Set a mock session cookie for middleware
      document.cookie = `kopdes-session=${selectedRole}; path=/; max-age=86400; samesite=strict`
      
      loginAs(selectedRole)
      toast.success(`Selamat datang, ${MOCK_USERS[selectedRole].name}!`)
      router.push('/dashboard')
      setIsLoading(false)
    }, 700)
  }

  const selectedConfig = ROLE_CONFIGS[selectedRole]
  const selectedUser = MOCK_USERS[selectedRole]
  const secondaryRoles = ALL_ROLES.filter((role) => !PRIMARY_ROLES.includes(role))

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f8f6f6_0%,#f4efef_100%)] px-4 py-6 sm:px-6 sm:py-10">
      <div className="mx-auto w-full max-w-[460px]">
        <Card className="overflow-hidden border-white/80 bg-white shadow-[0_28px_70px_-30px_rgba(133,18,23,0.35)]">
          <div className="flex items-center justify-between border-b border-border/70 px-4 py-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Leaf className="h-5 w-5" />
            </div>
            <h1 className="text-center text-lg font-bold tracking-tight">Koperasi Merah Putih</h1>
            <div className="w-10" />
          </div>

          <div className="border-b border-border/60 bg-[linear-gradient(160deg,#9ec3e3_0%,#d9ebf9_42%,#ffffff_100%)] px-4 py-4">
            <div className="relative h-44 overflow-hidden rounded-xl bg-[linear-gradient(145deg,#8bb5d8_0%,#d7e9f6_55%,#ffffff_100%)]">
              <div className="absolute inset-y-0 left-6 w-28 skew-x-[-14deg] rounded-tl-3xl rounded-br-3xl border border-white/80 bg-white/92 shadow-lg" />
              <div className="absolute bottom-0 left-[4.5rem] h-32 w-24 skew-x-[-14deg] rounded-tl-3xl border border-white/80 bg-slate-100 shadow-lg" />
              <div className="absolute right-10 top-4 h-36 w-36 skew-x-[-14deg] rounded-tl-[2rem] rounded-br-[2rem] border border-slate-300 bg-slate-700 shadow-xl" />
              <div className="absolute right-24 top-10 h-6 w-6 border-2 border-primary bg-white/70" />
              <div className="absolute right-16 top-10 h-6 w-6 border-2 border-primary bg-white/70" />
              <div className="absolute right-24 top-20 h-6 w-6 border-2 border-primary bg-white/70" />
              <div className="absolute right-16 top-20 h-6 w-6 border-2 border-primary bg-white/70" />
              <div className="absolute right-24 top-[7.5rem] h-6 w-6 border-2 border-primary bg-white/70" />
              <div className="absolute right-16 top-[7.5rem] h-6 w-6 border-2 border-primary bg-white/70" />
              <div className="absolute inset-x-0 bottom-0 h-10 bg-white/70 backdrop-blur-sm" />
            </div>
          </div>

          <CardContent className="space-y-6 px-5 py-7 sm:px-6">
            <div className="text-center">
              <h2 className="text-[2rem] font-bold tracking-tight text-foreground">Welcome Back</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Masuk ke akun koperasi sesuai peran Anda.
              </p>
            </div>

            <div className="space-y-3">
              <div>
                <p className="mb-2 text-sm font-semibold text-foreground">Peran Utama</p>
                <div className="grid grid-cols-2 gap-2">
                  {PRIMARY_ROLES.map((role) => {
                    const config = ROLE_CONFIGS[role]
                    const isSelected = selectedRole === role

                    return (
                      <button
                        key={role}
                        type="button"
                        onClick={() => setSelectedRole(role)}
                        className={`rounded-xl border px-3 py-3 text-left transition-all ${
                          isSelected
                            ? 'border-primary bg-primary text-primary-foreground shadow-[0_16px_30px_-20px_rgba(219,31,31,0.8)]'
                            : 'border-border bg-white hover:border-primary/40 hover:bg-secondary/50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xl">{config.icon}</span>
                          {isSelected && <Check className="h-4 w-4" />}
                        </div>
                        <p className="mt-3 text-sm font-semibold">{config.label}</p>
                      </button>
                    )
                  })}
                </div>
              </div>

              <div>
                <p className="mb-2 text-sm font-semibold text-foreground">Peran Lainnya</p>
                <div className="flex flex-wrap gap-2">
                  {secondaryRoles.map((role) => {
                    const config = ROLE_CONFIGS[role]
                    const isSelected = selectedRole === role

                    return (
                      <button
                        key={role}
                        type="button"
                        onClick={() => setSelectedRole(role)}
                        className={`rounded-full border px-3 py-2 text-sm transition-colors ${
                          isSelected
                            ? 'border-primary bg-primary text-primary-foreground'
                            : 'border-border bg-white text-muted-foreground hover:border-primary/40 hover:text-foreground'
                        }`}
                      >
                        <span className="mr-2">{config.icon}</span>
                        {config.label}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-border bg-background/80 p-4 shadow-sm">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm">
                  <User className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-foreground">{selectedUser.name}</p>
                    <Badge className="bg-primary/10 text-primary">{selectedConfig.label}</Badge>
                  </div>
                    <p className="mt-1 text-sm text-muted-foreground">{selectedUser.email}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{selectedConfig.description}</p>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs">
                    <span className="rounded-full bg-secondary px-3 py-1 text-secondary-foreground">
                      {getScopeLabel(selectedRole)}
                    </span>
                    <span className="rounded-full bg-secondary px-3 py-1 text-secondary-foreground">
                      {selectedConfig.permissions.length} izin aktif
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <Button
              onClick={handleLogin}
              disabled={isLoading}
              className="h-14 w-full rounded-xl bg-primary text-base font-bold text-primary-foreground shadow-[0_18px_40px_-18px_rgba(219,31,31,0.9)] hover:bg-primary/90"
            >
              {isLoading ? 'Masuk...' : 'Sign In'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>

            <div className="rounded-2xl border border-primary/10 bg-primary/[0.04] p-4">
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <ShieldCheck className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Akses Berbasis Peran</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Setiap pilihan peran akan membuka tampilan, menu, dan akses halaman yang berbeda sesuai kewenangannya.
                  </p>
                </div>
              </div>
            </div>

            <p className="text-center text-sm text-muted-foreground">
              Belum punya akun tetap?{' '}
              <span className="font-semibold text-primary">Hubungi admin koperasi</span>
            </p>
          </CardContent>

          <div className="h-2 w-full bg-primary" />
        </Card>

        <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Leaf className="h-3.5 w-3.5 text-primary" />
          <span>Koperasi Merah Putih</span>
        </div>
      </div>
    </div>
  )
}
