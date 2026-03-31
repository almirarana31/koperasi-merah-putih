"use client"

import { useRouter } from "next/navigation"
import { Bell, User, Calendar, Menu, Sparkles, TrendingUp, AlertTriangle, LogOut, Leaf } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth"
import { ROLE_CONFIGS } from "@/lib/rbac/roles"
import { toast } from "sonner"

interface HeaderProps {
  onMenuClick?: () => void
}

export function KopdesHeader({ onMenuClick }: HeaderProps) {
  const router = useRouter()
  const { user, logout } = useAuth()
  const roleConfig = user ? ROLE_CONFIGS[user.role] : null
  
  const currentDate = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const handleLogout = () => {
    logout()
    toast.success('Berhasil keluar')
    router.push('/login')
  }

  return (
    <div className="sticky top-0 z-30 px-4 pt-4 sm:px-6 lg:px-8">
      <header className="flex min-h-[4.5rem] items-center justify-between gap-3 rounded-[1.7rem] border border-white/70 bg-white/88 px-4 py-3 shadow-[0_12px_40px_-24px_rgba(92,64,61,0.22)] backdrop-blur-xl">
      <div className="flex min-w-0 items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="h-10 w-10 rounded-full bg-secondary/75 lg:hidden"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </Button>

        <Link href="/dashboard" className="flex min-w-0 items-center gap-3 lg:hidden">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm">
            <Leaf className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-bold tracking-tight text-primary">KOPDES</p>
            <p className="truncate text-[11px] text-muted-foreground">Digital Workspace</p>
          </div>
        </Link>

        <div className="hidden items-center gap-3 lg:flex">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-sm">
            <Leaf className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-bold tracking-tight text-primary">KOPDES Workspace</p>
            <p className="text-[11px] text-muted-foreground">Tata letak utility-first ala Stitch</p>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <div className="hidden items-center gap-2 rounded-full bg-secondary/65 px-4 py-2 text-sm text-muted-foreground xl:flex">
          <Calendar className="h-4 w-4" />
          <span>{currentDate}</span>
        </div>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative h-10 w-10 rounded-full bg-secondary/75 hover:bg-secondary">
              <Bell className="h-5 w-5 text-muted-foreground" />
              <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground">
                8
              </span>
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[min(24rem,calc(100vw-1rem))] p-0">
            <Tabs defaultValue="regular" className="w-full">
              <div className="px-4 pt-4 pb-2">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="regular" className="text-xs">
                    <Bell className="h-3 w-3 mr-1" />
                    Reguler (5)
                  </TabsTrigger>
                  <TabsTrigger value="ai" className="text-xs">
                    <Sparkles className="h-3 w-3 mr-1" />
                    AI Cerdas (3)
                  </TabsTrigger>
                </TabsList>
              </div>

              <TabsContent value="regular" className="m-0 max-h-96 overflow-y-auto">
                <div className="px-2">
                  <DropdownMenuItem asChild>
                    <Link 
                      href="/notifications"
                      className="flex flex-col items-start gap-1 py-3 cursor-pointer hover:bg-secondary focus:bg-secondary rounded-md px-3"
                    >
                      <span className="font-medium text-foreground">Stok Rendah: Beras Grade A</span>
                      <span className="text-xs text-muted-foreground">
                        Stok tersisa 150 kg, di bawah minimum 200 kg
                      </span>
                      <span className="text-xs text-muted-foreground">5 menit lalu</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link 
                      href="/notifications"
                      className="flex flex-col items-start gap-1 py-3 cursor-pointer hover:bg-secondary focus:bg-secondary rounded-md px-3"
                    >
                      <span className="font-medium text-foreground">Order Baru dari PT Sumber Makmur</span>
                      <span className="text-xs text-muted-foreground">
                        Permintaan 500 kg Cabai Merah Grade A
                      </span>
                      <span className="text-xs text-muted-foreground">15 menit lalu</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link 
                      href="/notifications"
                      className="flex flex-col items-start gap-1 py-3 cursor-pointer hover:bg-secondary focus:bg-secondary rounded-md px-3"
                    >
                      <span className="font-medium text-foreground">Jadwal Panen Mendekati</span>
                      <span className="text-xs text-muted-foreground">
                        3 lahan siap panen dalam 7 hari
                      </span>
                      <span className="text-xs text-muted-foreground">1 jam lalu</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link 
                      href="/notifications"
                      className="flex flex-col items-start gap-1 py-3 cursor-pointer hover:bg-secondary focus:bg-secondary rounded-md px-3"
                    >
                      <span className="font-medium text-foreground">Pembayaran Diterima</span>
                      <span className="text-xs text-muted-foreground">
                        Rp 15.5 juta dari Toko Berkah Jaya
                      </span>
                      <span className="text-xs text-muted-foreground">2 jam lalu</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link 
                      href="/notifications"
                      className="flex flex-col items-start gap-1 py-3 cursor-pointer hover:bg-secondary focus:bg-secondary rounded-md px-3"
                    >
                      <span className="font-medium text-foreground">Anggota Baru Terdaftar</span>
                      <span className="text-xs text-muted-foreground">
                        Pak Joko Susilo - Petani Cabai (2 hektar)
                      </span>
                      <span className="text-xs text-muted-foreground">3 jam lalu</span>
                    </Link>
                  </DropdownMenuItem>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link 
                    href="/notifications"
                    className="flex items-center justify-center py-3 text-sm font-medium text-primary hover:bg-secondary"
                  >
                    Lihat Semua Notifikasi Reguler
                  </Link>
                </DropdownMenuItem>
              </TabsContent>

              <TabsContent value="ai" className="m-0 max-h-96 overflow-y-auto">
                <div className="px-2">
                  <DropdownMenuItem asChild>
                    <div className="flex flex-col items-start gap-2 py-3 cursor-pointer hover:bg-secondary focus:bg-secondary rounded-md px-3">
                      <div className="flex items-center gap-2 w-full">
                        <TrendingUp className="h-4 w-4 text-emerald-600 shrink-0" />
                        <span className="font-medium text-foreground flex-1">Peluang Profit Tinggi</span>
                        <Badge variant="destructive" className="text-xs">Urgent</Badge>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        Harga cabai merah diprediksi naik 15% dalam 7 hari. Tahan stok untuk profit maksimal Rp 7,000/kg.
                      </span>
                      <div className="flex items-center justify-between w-full">
                        <span className="text-xs text-muted-foreground">5 menit lalu</span>
                        <button className="text-xs font-medium text-emerald-600 hover:underline">
                          Lihat Analisis →
                        </button>
                      </div>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <div className="flex flex-col items-start gap-2 py-3 cursor-pointer hover:bg-secondary focus:bg-secondary rounded-md px-3">
                      <div className="flex items-center gap-2 w-full">
                        <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0" />
                        <span className="font-medium text-foreground flex-1">Stok Menipis - Beras</span>
                        <Badge variant="destructive" className="text-xs">Urgent</Badge>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        Stok beras Grade A tersisa 45 ton, cukup untuk 3 hari. Rekomendasi order 50 ton segera.
                      </span>
                      <div className="flex items-center justify-between w-full">
                        <span className="text-xs text-muted-foreground">15 menit lalu</span>
                        <button className="text-xs font-medium text-amber-600 hover:underline">
                          Order Sekarang →
                        </button>
                      </div>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <div className="flex flex-col items-start gap-2 py-3 cursor-pointer hover:bg-secondary focus:bg-secondary rounded-md px-3">
                      <div className="flex items-center gap-2 w-full">
                        <TrendingUp className="h-4 w-4 text-blue-600 shrink-0" />
                        <span className="font-medium text-foreground flex-1">Tren Permintaan Tomat</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        Demand tomat turun 12% minggu ini. Pertimbangkan kurangi stok 20% untuk minimalisir waste.
                      </span>
                      <div className="flex items-center justify-between w-full">
                        <span className="text-xs text-muted-foreground">2 jam lalu</span>
                        <button className="text-xs font-medium text-blue-600 hover:underline">
                          Lihat Forecast →
                        </button>
                      </div>
                    </div>
                  </DropdownMenuItem>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link 
                    href="/ai"
                    className="flex items-center justify-center py-3 text-sm font-medium text-emerald-600 hover:bg-secondary"
                  >
                    <Sparkles className="h-4 w-4 mr-2" />
                    Lihat Semua Insight AI
                  </Link>
                </DropdownMenuItem>
              </TabsContent>
            </Tabs>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-11 rounded-full bg-secondary/65 px-1.5 hover:bg-secondary">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-lg">
                {roleConfig?.icon || <User className="h-4 w-4 text-primary-foreground" />}
              </div>
              <div className="hidden text-left md:block">
                <p className="text-sm font-medium text-foreground">{user?.name || 'User'}</p>
                <div className="flex items-center gap-1">
                  {roleConfig && (
                    <span className={`text-xs px-1.5 py-0.5 rounded ${roleConfig.color}`}>
                      {roleConfig.label}
                    </span>
                  )}
                </div>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-medium">{user?.name}</p>
                <p className="text-xs text-muted-foreground">{user?.email}</p>
                {roleConfig && (
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-base">{roleConfig.icon}</span>
                    <span className="text-xs font-normal">{roleConfig.label}</span>
                  </div>
                )}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profil</DropdownMenuItem>
            <DropdownMenuItem>Pengaturan</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              Keluar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      </header>
    </div>
  )
}
