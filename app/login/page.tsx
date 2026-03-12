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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 flex items-center justify-center p-4">
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
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-blue-500 mb-4">
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
                    ? 'ring-2 ring-emerald-500 shadow-lg scale-105'
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
                      <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
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
          <Card className="border-2 border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-950/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center">
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
                  className="bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  {isLoading ? 'Masuk...' : `Masuk sebagai ${selectedConfig.label}`}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Info Card */}
        <Card className="border-2 border-blue-200 dark:border-blue-900 bg-blue-50 dark:bg-blue-950/20">
          <CardContent className="p-4">
            <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
              <Leaf className="h-4 w-4 text-blue-600" />
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
