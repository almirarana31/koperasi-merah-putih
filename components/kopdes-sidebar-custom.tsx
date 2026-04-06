"use client"

import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  Sprout,
  Warehouse,
  ShoppingCart,
  Truck,
  Wallet,
  Settings,
  Brain,
  Zap,
  ChevronDown,
  Leaf,
  X,
  Activity,
} from "lucide-react"
import { useState } from "react"
import { useAuth } from "@/lib/auth"
import { canAccessRoute } from "@/lib/rbac"
import type { Role } from "@/lib/rbac"

interface NavItem {
  label: string
  icon: React.ElementType
  href?: string
  children?: { label: string; href: string }[]
}

function getRoleAwareNavLabel(role: Role, href: string, fallback: string): string {
  if (role !== "petani") return fallback

  const overrides: Record<string, string> = {
    "/anggota/profil": "Profil Saya",
    "/produksi": "Panen Saya",
    "/produksi/rencana": "Rencana Tanam",
    "/produksi/jadwal": "Jadwal Panen",
    "/keuangan/pinjaman": "Pinjaman Saya",
    "/keuangan/shu": "SHU Saya",
    "/pasar/harga": "Harga Pasar",
    "/ai/rekomendasi-harga": "Saran Harga AI",
    "/assistant/konsultasi": "Konsultasi Tani",
    "/assistant/notifikasi": "Notifikasi Saya",
  }

  return overrides[href] ?? fallback
}

const navigation: { section: string; items: NavItem[] }[] = [
  {
    section: "Overview",
    items: [
      { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
      { label: "Pusat Kendali Eksekutif", icon: Activity, href: "/command-center" },
    ],
  },
  {
    section: "Core Operations",
    items: [
      {
        label: "Anggota",
        icon: Users,
        children: [
          { label: "Daftar Anggota", href: "/anggota" },
          { label: "Tambah Anggota", href: "/anggota/tambah" },
          { label: "Onboarding KTP", href: "/anggota/onboarding" },
          { label: "Profil & Behavior", href: "/anggota/profil" },
          { label: "Produsen", href: "/anggota/produsen" },
          { label: "Kelompok Tani", href: "/anggota/kelompok" },
          { label: "Verifikasi KYC", href: "/anggota/verifikasi" },
        ],
      },
      {
        label: "Produksi",
        icon: Sprout,
        children: [
          { label: "Catatan Panen", href: "/produksi" },
          { label: "Komoditas", href: "/produksi/komoditas" },
          { label: "Rencana Tanam", href: "/produksi/rencana" },
          { label: "Jadwal Panen", href: "/produksi/jadwal" },
          { label: "Agregasi", href: "/produksi/agregasi" },
        ],
      },
      {
        label: "Gudang",
        icon: Warehouse,
        children: [
          { label: "Stok Barang", href: "/gudang" },
          { label: "Daftar Gudang", href: "/gudang/daftar" },
          { label: "Grading & QC", href: "/gudang/grading" },
          { label: "Cold Storage", href: "/gudang/cold-storage" },
          { label: "Traceability", href: "/gudang/traceability" },
        ],
      },
      {
        label: "Pasar",
        icon: ShoppingCart,
        children: [
          { label: "Order Masuk", href: "/pasar" },
          { label: "Daftar Buyer", href: "/pasar/buyer" },
          { label: "Katalog B2B", href: "/pasar/katalog" },
          { label: "Kontrak", href: "/pasar/kontrak" },
          { label: "Harga Pasar", href: "/pasar/harga" },
        ],
      },
      {
        label: "Logistik",
        icon: Truck,
        children: [
          { label: "Pengiriman", href: "/logistik" },
          { label: "Tracking", href: "/logistik/tracking" },
          { label: "Jadwal Pickup", href: "/logistik/pickup" },
          { label: "Rute", href: "/logistik/rute" },
          { label: "Armada", href: "/logistik/armada" },
        ],
      },
      {
        label: "Keuangan",
        icon: Wallet,
        children: [
          { label: "Kas & Transaksi", href: "/keuangan" },
          { label: "Credit Scoring", href: "/keuangan/credit-scoring" },
          { label: "Pengajuan Pinjaman", href: "/keuangan/pinjaman" },
          { label: "Simpan Pinjam", href: "/keuangan/simpan-pinjam" },
          { label: "Invoice", href: "/keuangan/invoice" },
          { label: "Pembayaran", href: "/keuangan/pembayaran" },
          { label: "SHU", href: "/keuangan/shu" },
          { label: "Laporan", href: "/keuangan/laporan" },
        ],
      },
    ],
  },
  {
    section: "AI Intelligence",
    items: [
      {
        label: "AI Intelligence",
        icon: Brain,
        children: [
          { label: "Dashboard AI", href: "/ai" },
          { label: "Forecast Permintaan", href: "/ai/forecast" },
          { label: "Supply & Demand", href: "/ai/supply-demand" },
          { label: "Rekomendasi Harga", href: "/ai/rekomendasi-harga" },
          { label: "Optimasi Rute", href: "/ai/optimasi-rute" },
          { label: "Grading Otomatis", href: "/ai/grading" },
          { label: "Analisis Pasar", href: "/ai/analisis-pasar" },
        ],
      },
      {
        label: "AI Assistant",
        icon: Zap,
        children: [
          { label: "Konsultasi Pertanian", href: "/assistant/konsultasi" },
          { label: "Laporan Otomatis", href: "/assistant/laporan" },
          { label: "Notifikasi Cerdas", href: "/assistant/notifikasi" },
        ],
      },
    ],
  },
]

const bottomNav: NavItem[] = [
  { label: "Pengaturan", icon: Settings, href: "/settings" },
]

interface SidebarProps {
  open?: boolean
  onClose?: () => void
}

export function KopdesSidebarCustom({ open, onClose }: SidebarProps) {
  const [expandedItems, setExpandedItems] = useState<string[]>(["Anggota", "Produksi"])
  const pathname = usePathname()
  const { user } = useAuth()

  const visibleNavigation = user
    ? navigation
        .map((group) => ({
          ...group,
          items: group.items
            .map((item) => {
              if (item.children) {
                const visibleChildren = item.children.filter((child) => canAccessRoute(user.role, child.href))
                if (visibleChildren.length === 0) return null
                const label =
                  user.role === "petani" && item.label === "Anggota"
                    ? "Akun Saya"
                    : user.role === "petani" && item.label === "Keuangan"
                    ? "Pembiayaan"
                    : user.role === "petani" && item.label === "AI Intelligence"
                    ? "AI Tani"
                    : item.label

                return {
                  ...item,
                  label,
                  children: visibleChildren.map((child) => ({
                    ...child,
                    label: getRoleAwareNavLabel(user.role, child.href, child.label),
                  })),
                }
              }

              if (item.href && !canAccessRoute(user.role, item.href)) return null
              return item.href
                ? { ...item, label: getRoleAwareNavLabel(user.role, item.href, item.label) }
                : item
            })
            .filter(Boolean) as NavItem[],
        }))
        .filter((group) => group.items.length > 0)
    : []

  const visibleBottomNav = user
    ? bottomNav.filter((item) => !item.href || canAccessRoute(user.role, item.href))
    : []

  const toggleExpand = (label: string) => {
    setExpandedItems((prev) =>
      prev.includes(label) ? prev.filter((item) => item !== label) : [...prev, label]
    )
  }

  const isActive = (href?: string) => {
    if (!href) return false
    return pathname === href
  }

  const hasActiveChild = (item: NavItem) => {
    if (!item.children) return false
    return item.children.some((child) => pathname === child.href || pathname.startsWith(`${child.href}/`))
  }

  const handleLinkClick = () => {
    if (onClose) onClose()
  }

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 z-50 flex h-screen w-64 flex-col border-r border-sidebar-border bg-[linear-gradient(180deg,color-mix(in_oklab,var(--sidebar)_94%,#a92724)_0%,color-mix(in_oklab,var(--sidebar)_86%,var(--dashboard-secondary))_100%)] shadow-[18px_0_34px_-24px_rgba(120,48,44,0.34)] transition-transform duration-200 ease-in-out",
          "lg:translate-x-0 lg:z-40",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="flex h-20 items-center justify-between px-6">
          <Link href="/login" className="flex items-center gap-3" onClick={handleLinkClick}>
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary shadow-sm">
              <Leaf className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-sidebar-foreground">Kopdes</h1>
              <p className="text-sm text-sidebar-foreground/70">Koperasi Digital</p>
            </div>
          </Link>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-sidebar-foreground/70 hover:bg-sidebar-accent lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          {visibleNavigation.map((group) => (
            <div key={group.section} className="mb-6">
              <p className="mb-2 px-3 text-[13px] font-semibold text-sidebar-foreground/72">
                {group.section}
              </p>
              <ul className="space-y-1">
                {group.items.map((item) => (
                  <li key={item.label}>
                    {item.children ? (
                      <div>
                        {(() => {
                          const parentActive = hasActiveChild(item)
                          return (
                        <button
                          onClick={() => toggleExpand(item.label)}
                          className={cn(
                            "flex w-full items-center justify-between rounded-full px-4 py-3 text-[0.95rem] transition-all duration-200",
                            parentActive
                              ? "border border-white/55 bg-[color-mix(in_oklab,white_88%,var(--dashboard-primary)_12%)] text-[var(--dashboard-primary)] shadow-[0_12px_24px_-18px_rgba(78,19,17,0.45)]"
                              : "text-sidebar-foreground hover:bg-white/8"
                          )}
                        >
                          <span className="flex items-center gap-3">
                            <item.icon
                              className={cn(
                                "h-4 w-4 transition-colors",
                                parentActive ? "text-[var(--dashboard-primary)]" : "text-sidebar-foreground/70"
                              )}
                            />
                            {item.label}
                          </span>
                          <ChevronDown
                            className={cn(
                              "h-4 w-4 transition-transform",
                              parentActive ? "text-[var(--dashboard-primary)]" : "text-sidebar-foreground/70",
                              expandedItems.includes(item.label) && "rotate-180"
                            )}
                          />
                        </button>
                          )
                        })()}
                        {expandedItems.includes(item.label) && (
                          <ul className="ml-3 mt-2 space-y-1 pl-3">
                            {item.children.map((child) => (
                              <li key={child.label}>
                                <Link
                                  href={child.href}
                                  onClick={handleLinkClick}
                                  className={cn(
                                    "block w-full rounded-full px-4 py-2.5 text-left text-sm transition-all duration-200",
                                    isActive(child.href)
                                      ? "border border-white/50 bg-[color-mix(in_oklab,white_88%,var(--dashboard-primary)_12%)] font-medium text-[var(--dashboard-primary)] shadow-[0_10px_22px_-18px_rgba(78,19,17,0.4)]"
                                      : "text-sidebar-foreground/85 hover:bg-white/8 hover:text-sidebar-foreground"
                                  )}
                                >
                                  {child.label}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ) : (
                      <Link
                        href={item.href || "#"}
                        onClick={handleLinkClick}
                        className={cn(
                          "flex w-full items-center gap-3 rounded-full px-4 py-3 text-[0.95rem] transition-all duration-200",
                          isActive(item.href)
                            ? "border border-white/55 bg-[color-mix(in_oklab,white_88%,var(--dashboard-primary)_12%)] font-medium text-[var(--dashboard-primary)] shadow-[0_12px_24px_-18px_rgba(78,19,17,0.45)]"
                            : "text-sidebar-foreground hover:bg-white/8"
                        )}
                      >
                        <item.icon
                          className={cn(
                            "h-4 w-4 transition-colors",
                            isActive(item.href) ? "text-[var(--dashboard-primary)]" : "text-sidebar-foreground/75"
                          )}
                        />
                        {item.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>

        {/* Bottom Navigation */}
        <div className="px-3 py-4">
          <ul className="space-y-1">
            {visibleBottomNav.map((item) => (
              <li key={item.label}>
                <Link
                  href={item.href || "#"}
                  onClick={handleLinkClick}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-full px-3 py-2.5 text-sm transition-colors",
                    "text-sidebar-foreground hover:bg-white/8"
                  )}
                >
                  <item.icon className="h-4 w-4 text-sidebar-foreground/70" />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </aside>
    </>
  )
}
