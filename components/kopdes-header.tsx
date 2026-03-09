"use client"

import { Search, Bell, User, Calendar, Menu } from "lucide-react"
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
                5
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-72 sm:w-80 max-h-96 overflow-y-auto">
            <DropdownMenuLabel className="text-foreground">Notifikasi</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link 
                href="/notifications"
                className="flex flex-col items-start gap-1 py-3 cursor-pointer hover:bg-secondary focus:bg-secondary"
              >
                <span className="font-medium text-foreground">Stok Rendah: Beras Grade A</span>
                <span className="text-xs text-muted-foreground">
                  Stok tersisa 150 kg, di bawah minimum 200 kg
                </span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link 
                href="/notifications"
                className="flex flex-col items-start gap-1 py-3 cursor-pointer hover:bg-secondary focus:bg-secondary"
              >
                <span className="font-medium text-foreground">Order Baru dari PT Sumber Makmur</span>
                <span className="text-xs text-muted-foreground">
                  Permintaan 500 kg Cabai Merah Grade A
                </span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link 
                href="/notifications"
                className="flex flex-col items-start gap-1 py-3 cursor-pointer hover:bg-secondary focus:bg-secondary"
              >
                <span className="font-medium text-foreground">Jadwal Panen Mendekati</span>
                <span className="text-xs text-muted-foreground">
                  3 lahan siap panen dalam 7 hari
                </span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link 
                href="/notifications"
                className="flex items-center justify-center py-2 text-sm font-medium text-primary hover:bg-secondary"
              >
                Lihat Semua Notifikasi
              </Link>
            </DropdownMenuItem>
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
