"use client"

import { useState } from "react"
import { Search, Bell, User, Calendar, Menu, Sparkles, TrendingUp, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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

interface HeaderProps {
  onMenuClick?: () => void
}

export function KopdesHeader({ onMenuClick }: HeaderProps) {
  const currentDate = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border bg-background/95 px-4 sm:px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      {/* Left side: hamburger + search */}
      <div className="flex items-center gap-3">
        {/* Mobile menu button */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
        </Button>

        <div className="relative hidden sm:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Cari anggota, produk, atau transaksi..."
            className="h-9 w-48 sm:w-64 md:w-80 bg-secondary pl-9 text-sm"
          />
        </div>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-2 sm:gap-4">
        {/* Date */}
        <div className="hidden items-center gap-2 text-sm text-muted-foreground lg:flex">
          <Calendar className="h-4 w-4" />
          <span>{currentDate}</span>
        </div>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative">
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
          <DropdownMenuContent align="end" className="w-96 p-0">
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
            <Button variant="ghost" className="gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
                <User className="h-4 w-4 text-primary-foreground" />
              </div>
              <div className="hidden text-left md:block">
                <p className="text-sm font-medium text-foreground">Admin Koperasi</p>
                <p className="text-xs text-muted-foreground">Koperasi Merah Putih</p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Akun Saya</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profil</DropdownMenuItem>
            <DropdownMenuItem>Pengaturan</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Keluar</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
