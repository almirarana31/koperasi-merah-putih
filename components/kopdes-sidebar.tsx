'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  Sprout,
  Warehouse,
  ShoppingCart,
  Truck,
  Wallet,
  Settings,
  LogOut,
  ChevronDown,
  Leaf,
  Brain,
  Zap,
} from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

const mainNavItems = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    title: 'Anggota',
    url: '/anggota',
    icon: Users,
    items: [
      { title: 'Daftar Anggota', url: '/anggota' },
      { title: 'Tambah Anggota', url: '/anggota/tambah' },
      { title: 'Onboarding KTP', url: '/anggota/onboarding' },
      { title: 'Profil & Behavior', url: '/anggota/profil' },
      { title: 'Produsen', url: '/anggota/produsen' },
      { title: 'Kelompok Tani', url: '/anggota/kelompok' },
      { title: 'Verifikasi KYC', url: '/anggota/verifikasi' },
    ],
  },
  {
    title: 'Produksi',
    url: '/produksi',
    icon: Sprout,
    items: [
      { title: 'Catatan Panen', url: '/produksi' },
      { title: 'Komoditas', url: '/produksi/komoditas' },
      { title: 'Rencana Tanam', url: '/produksi/rencana' },
      { title: 'Jadwal Panen', url: '/produksi/jadwal' },
      { title: 'Agregasi', url: '/produksi/agregasi' },
    ],
  },
  {
    title: 'Gudang',
    url: '/gudang',
    icon: Warehouse,
    items: [
      { title: 'Stok Barang', url: '/gudang' },
      { title: 'Daftar Gudang', url: '/gudang/daftar' },
      { title: 'Grading & QC', url: '/gudang/grading' },
      { title: 'Cold Storage', url: '/gudang/cold-storage' },
      { title: 'Traceability', url: '/gudang/traceability' },
    ],
  },
  {
    title: 'Pasar',
    url: '/pasar',
    icon: ShoppingCart,
    items: [
      { title: 'Order Masuk', url: '/pasar' },
      { title: 'Daftar Buyer', url: '/pasar/buyer' },
      { title: 'Katalog B2B', url: '/pasar/katalog' },
      { title: 'Kontrak', url: '/pasar/kontrak' },
      { title: 'Harga Pasar', url: '/pasar/harga' },
    ],
  },
  {
    title: 'Logistik',
    url: '/logistik',
    icon: Truck,
    items: [
      { title: 'Pengiriman', url: '/logistik' },
      { title: 'Tracking', url: '/logistik/tracking' },
      { title: 'Jadwal Pickup', url: '/logistik/pickup' },
      { title: 'Rute', url: '/logistik/rute' },
      { title: 'Armada', url: '/logistik/armada' },
    ],
  },
  {
    title: 'Keuangan',
    url: '/keuangan',
    icon: Wallet,
    items: [
      { title: 'Kas & Transaksi', url: '/keuangan' },
      { title: 'Credit Scoring', url: '/keuangan/credit-scoring' },
      { title: 'Pengajuan Pinjaman', url: '/keuangan/pinjaman' },
      { title: 'Simpan Pinjam', url: '/keuangan/simpan-pinjam' },
      { title: 'Invoice', url: '/keuangan/invoice' },
      { title: 'Pembayaran', url: '/keuangan/pembayaran' },
      { title: 'SHU', url: '/keuangan/shu' },
      { title: 'Laporan', url: '/keuangan/laporan' },
    ],
  },
  {
    title: 'AI Intelligence',
    url: '/ai',
    icon: Brain,
    items: [
      { title: 'Dashboard AI', url: '/ai' },
      { title: 'Forecast Permintaan', url: '/ai/forecast' },
      { title: 'Rekomendasi Harga', url: '/ai/rekomendasi-harga' },
      { title: 'Optimasi Rute', url: '/ai/optimasi-rute' },
      { title: 'Grading Otomatis', url: '/ai/grading' },
      { title: 'Analisis Pasar', url: '/ai/analisis-pasar' },
    ],
  },
  {
    title: 'AI Assistant',
    url: '/assistant',
    icon: Zap,
    items: [
      { title: 'Chat Assistant', url: '/assistant' },
      { title: 'Konsultasi Pertanian', url: '/assistant/konsultasi' },
      { title: 'Laporan Otomatis', url: '/assistant/laporan' },
      { title: 'Notifikasi Cerdas', url: '/assistant/notifikasi' },
    ],
  },
]

export function KopdesSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/dashboard">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <Leaf className="h-5 w-5" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">KOPDES</span>
                  <span className="text-xs text-sidebar-foreground/70">Koperasi Digital</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu Utama</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) =>
                item.items ? (
                  <Collapsible
                    key={item.title}
                    defaultOpen={pathname.startsWith(item.url)}
                    className="group/collapsible"
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                          isActive={pathname.startsWith(item.url)}
                          tooltip={item.title}
                        >
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                          <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.items.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.url}>
                              <SidebarMenuSubButton
                                asChild
                                isActive={pathname === subItem.url}
                              >
                                <Link href={subItem.url}>{subItem.title}</Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                ) : (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === item.url}
                      tooltip={item.title}
                    >
                      <Link href={item.url}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton size="lg">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                      AD
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col gap-0.5 leading-none">
                    <span className="font-medium">Admin Koperasi</span>
                    <span className="text-xs text-sidebar-foreground/70">admin@kopdes.id</span>
                  </div>
                  <ChevronDown className="ml-auto h-4 w-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width]"
              >
                <DropdownMenuItem>
                  <Settings className="mr-2 h-4 w-4" />
                  Pengaturan
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive">
                  <LogOut className="mr-2 h-4 w-4" />
                  Keluar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
