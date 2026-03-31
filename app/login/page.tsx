'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { Leaf, ArrowLeft, ArrowRight, BarChart3, User } from 'lucide-react'
import { useAuth } from '@/lib/auth'
import { ROLE_CONFIGS, ALL_ROLES } from '@/lib/rbac/roles'
import { MOCK_USERS } from '@/lib/auth/mock-users'
import type { Role } from '@/lib/rbac/types'

export default function LoginPage() {
  const router = useRouter()
  const { loginAs } = useAuth()
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleRoleSelect = (role: Role) => {
    setSelectedRole(role)
  }

  const handleLogin = () => {
    if (!selectedRole) {
      toast.error('Silakan pilih role terlebih dahulu')
      return
    }

    setIsLoading(true)

    // Simulate login delay
    setTimeout(() => {
      loginAs(selectedRole)
      const mockUser = MOCK_USERS[selectedRole]
      toast.success(`Selamat datang, ${mockUser.name}!`)
      router.push('/dashboard')
      setIsLoading(false)
    }, 800)
  }

  const selectedConfig = selectedRole ? ROLE_CONFIGS[selectedRole] : null
  const selectedUser = selectedRole ? MOCK_USERS[selectedRole] : null

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,rgba(248,243,237,0.96),rgba(255,255,255,0.96)),radial-gradient(circle_at_top,rgba(180,39,45,0.14),transparent_40%)] flex items-center justify-center p-4">
      <div className="w-full max-w-6xl space-y-6">
        {/* Back to Landing */}
        <Link href="/landing">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali ke Beranda
          </Button>
        </Link>

        {/* Logo & Title */}
        <div className="text-center space-y-2">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80">
            <Leaf className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold">Koperasi Merah Putih</h1>
          <p className="text-muted-foreground">Pilih role untuk masuk ke sistem</p>
        </div>

        {/* Role Selection Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ALL_ROLES.map((role) => {
            const config = ROLE_CONFIGS[role]
            const isSelected = selectedRole === role
            
            return (
              <Card
                key={role}
                className={`cursor-pointer transition-all hover:shadow-lg ${
                  isSelected
                    ? 'ring-2 ring-primary shadow-lg scale-105'
                    : 'hover:scale-102'
                }`}
                onClick={() => handleRoleSelect(role)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="text-4xl">{config.icon}</div>
                      <div>
                        <CardTitle className="text-lg">{config.label}</CardTitle>
                        <CardDescription className="text-xs">
                          {config.labelEn}
                        </CardDescription>
                      </div>
                    </div>
                    {isSelected && (
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary">
                        <svg
                          className="w-4 h-4 text-white"
                          fill="none"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path d="M5 13l4 4L19 7"></path>
                        </svg>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-2">
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {config.description}
                  </p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className={`text-xs px-2 py-1 rounded-full ${config.color}`}>
                      {config.dataScope === 'own' && '🔒 Data Pribadi'}
                      {config.dataScope === 'koperasi' && '🏢 Koperasi'}
                      {config.dataScope === 'district_aggregate' && '🏛️ Kabupaten'}
                      {config.dataScope === 'national_aggregate' && '🇮🇩 Nasional'}
                      {config.dataScope === 'all_koperasi' && '🌐 Semua Koperasi'}
                    </span>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* Selected User Preview & Login Button */}
        {selectedRole && selectedConfig && selectedUser && (
          <Card className="border-2 border-primary/20 bg-primary/5">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/80">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{selectedUser.name}</h3>
                    <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-2xl">{selectedConfig.icon}</span>
                      <span className="text-sm font-medium">{selectedConfig.label}</span>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={handleLogin}
                  disabled={isLoading}
                  size="lg"
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {isLoading ? 'Masuk...' : `Masuk sebagai ${selectedConfig.label}`}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Info Card */}
        <Card className="border-2 border-primary/15 bg-background/90">
          <CardContent className="p-4">
            <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
              <Leaf className="h-4 w-4 text-primary" />
              Mode Demo - Role-Based Access Control
            </h3>
            <p className="text-xs text-muted-foreground">
              Sistem ini menggunakan RBAC dengan 9 role berbeda. Setiap role memiliki akses dan permission yang berbeda.
              Pilih role di atas untuk melihat tampilan sistem sesuai dengan hak akses role tersebut.
            </p>
          </CardContent>
        </Card>

        {/* Sister App Link */}
        <Card className="border-2 border-slate-200 dark:border-slate-800">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg">
                  <BarChart3 className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-sm">DNA Desa AI Presisi</p>
                  <p className="text-xs text-muted-foreground">Village Analytics Platform</p>
                </div>
              </div>
              <Link href="http://localhost:3001">
                <Button variant="outline" size="sm">
                  Kunjungi
                  <ArrowRight className="ml-2 h-3 w-3" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
