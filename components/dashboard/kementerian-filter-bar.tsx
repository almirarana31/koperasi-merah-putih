'use client'

import { RefreshCw, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  KEMENTERIAN_DASHBOARD_DATA,
  type ScopeFilters,
} from '@/lib/kementerian-dashboard-data'

export type { ScopeFilters } from '@/lib/kementerian-dashboard-data'

interface KementerianFilterBarProps {
  filters: ScopeFilters
  setFilters: (filters: ScopeFilters | ((prev: ScopeFilters) => ScopeFilters)) => void
  search?: string
  setSearch?: (search: string) => void
  showCommodity?: boolean
}

const triggerClassName =
  'h-9 rounded-md border border-[var(--dashboard-secondary-border)] bg-white px-3 text-sm font-medium text-[var(--dashboard-secondary)] shadow-[0_1px_2px_rgba(15,23,42,0.04)] transition-colors hover:bg-[var(--dashboard-secondary-muted)]'

const contentClassName = 'border-[var(--dashboard-secondary)]/15 bg-white text-[var(--dashboard-secondary)]'
const itemClassName =
  'text-sm font-medium focus:bg-[var(--dashboard-secondary-muted)] focus:text-[var(--dashboard-secondary)]'

export function KementerianFilterBar({
  filters,
  setFilters,
  search,
  setSearch,
  showCommodity = true,
}: KementerianFilterBarProps) {
  const provinceOptions = KEMENTERIAN_DASHBOARD_DATA.provinceOptions
  const regionOptions = KEMENTERIAN_DASHBOARD_DATA.regionOptions.filter(
    (option) => filters.provinceId === 'all' || option.provinceId === filters.provinceId,
  )
  const villageOptions = KEMENTERIAN_DASHBOARD_DATA.villageOptions.filter((option) => {
    const matchesProvince = filters.provinceId === 'all' || option.provinceId === filters.provinceId
    const matchesRegion = filters.regionId === 'all' || option.regionId === filters.regionId
    return matchesProvince && matchesRegion
  })
  const cooperativeOptions = KEMENTERIAN_DASHBOARD_DATA.cooperativeOptions.filter((option) => {
    const matchesProvince = filters.provinceId === 'all' || option.provinceId === filters.provinceId
    const matchesRegion = filters.regionId === 'all' || option.regionId === filters.regionId
    const matchesVillage = filters.villageId === 'all' || option.villageId === filters.villageId
    return matchesProvince && matchesRegion && matchesVillage
  })

  const commodityOptions = [
    { id: 'all', label: 'Semua Komoditas' },
    { id: 'beras', label: 'Beras' },
    { id: 'jagung', label: 'Jagung' },
    { id: 'cabai', label: 'Cabai' },
    { id: 'bawang', label: 'Bawang' },
  ]

  const resetFilters = () => {
    setFilters({
      provinceId: 'all',
      regionId: 'all',
      villageId: 'all',
      cooperativeId: 'all',
      commodityId: 'all',
    })
    if (setSearch) setSearch('')
  }

  return (
    <div className="w-full">
      <div className="flex flex-wrap items-center gap-1.5 rounded-lg border border-[var(--dashboard-secondary-border)] bg-white p-1.5 shadow-[0_8px_18px_-14px_rgba(137,114,111,0.22)]">
        {setSearch !== undefined && (
          <div className="relative min-w-[220px] flex-1 border-r border-[var(--dashboard-secondary)]/10 pr-1.5">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--dashboard-secondary)]/45" />
            <Input
              placeholder="Cari data"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 border-none bg-transparent pl-9 text-sm font-medium text-[var(--dashboard-secondary)] placeholder:text-[var(--dashboard-secondary)]/45 shadow-none focus-visible:ring-0"
            />
          </div>
        )}

        <div className="flex items-center gap-2 border-r border-[var(--dashboard-secondary)]/10 px-2.5">
          <span className="shrink-0 text-[13px] font-medium text-[var(--dashboard-secondary)]/60">Provinsi</span>
          <Select
            value={filters.provinceId}
            onValueChange={(v) =>
              setFilters((prev) => ({
                ...prev,
                provinceId: v,
                regionId: 'all',
                villageId: 'all',
                cooperativeId: 'all',
              }))
            }
          >
            <SelectTrigger className={`${triggerClassName} w-[140px]`}>
              <SelectValue placeholder="Semua provinsi" />
            </SelectTrigger>
            <SelectContent className={contentClassName}>
              <SelectItem value="all" className={itemClassName}>
                Semua provinsi
              </SelectItem>
              {provinceOptions.map((opt) => (
                <SelectItem key={opt.id} value={opt.id} className={itemClassName}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2 border-r border-[var(--dashboard-secondary)]/10 px-2.5">
          <span className="shrink-0 text-[13px] font-medium text-[var(--dashboard-secondary)]/60">Kab/Kota</span>
          <Select
            value={filters.regionId}
            onValueChange={(v) =>
              setFilters((prev) => ({
                ...prev,
                regionId: v,
                villageId: 'all',
                cooperativeId: 'all',
              }))
            }
          >
            <SelectTrigger className={`${triggerClassName} w-[140px]`}>
              <SelectValue placeholder="Semua kab/kota" />
            </SelectTrigger>
            <SelectContent className={contentClassName}>
              <SelectItem value="all" className={itemClassName}>
                Semua kab/kota
              </SelectItem>
              {regionOptions.map((opt) => (
                <SelectItem key={opt.id} value={opt.id} className={itemClassName}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2 border-r border-[var(--dashboard-secondary)]/10 px-2.5">
          <span className="shrink-0 text-[13px] font-medium text-[var(--dashboard-secondary)]/60">Desa</span>
          <Select
            value={filters.villageId}
            onValueChange={(v) =>
              setFilters((prev) => ({
                ...prev,
                villageId: v,
                cooperativeId: 'all',
              }))
            }
          >
            <SelectTrigger className={`${triggerClassName} w-[140px]`}>
              <SelectValue placeholder="Semua desa" />
            </SelectTrigger>
            <SelectContent className={contentClassName}>
              <SelectItem value="all" className={itemClassName}>
                Semua desa
              </SelectItem>
              {villageOptions.map((opt) => (
                <SelectItem key={opt.id} value={opt.id} className={itemClassName}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2 border-r border-[var(--dashboard-secondary)]/10 px-2.5">
          <span className="shrink-0 text-[13px] font-medium text-[var(--dashboard-secondary)]/60">Koperasi</span>
          <Select
            value={filters.cooperativeId}
            onValueChange={(v) =>
              setFilters((prev) => ({
                ...prev,
                cooperativeId: v,
              }))
            }
          >
            <SelectTrigger className={`${triggerClassName} w-[160px]`}>
              <SelectValue placeholder="Semua koperasi" />
            </SelectTrigger>
            <SelectContent className={contentClassName}>
              <SelectItem value="all" className={itemClassName}>
                Semua koperasi
              </SelectItem>
              {cooperativeOptions.map((opt) => (
                <SelectItem key={opt.id} value={opt.id} className={itemClassName}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {showCommodity && (
          <div className="flex items-center gap-2 border-r border-[var(--dashboard-secondary)]/10 px-2.5">
            <span className="shrink-0 text-[13px] font-medium text-[var(--dashboard-secondary)]/60">Komoditas</span>
            <Select
              value={filters.commodityId}
              onValueChange={(v) => setFilters((prev) => ({ ...prev, commodityId: v }))}
            >
              <SelectTrigger className={`${triggerClassName} w-[140px]`}>
                <SelectValue placeholder="Semua" />
              </SelectTrigger>
              <SelectContent className={contentClassName}>
                {commodityOptions.map((opt) => (
                  <SelectItem key={opt.id} value={opt.id} className={itemClassName}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        <Button
          size="sm"
          variant="ghost"
          className="ml-auto h-9 w-9 rounded-md p-0 text-[var(--dashboard-secondary)]/70 transition-all hover:bg-[var(--dashboard-primary)] hover:text-white"
          onClick={resetFilters}
        >
          <RefreshCw className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  )
}
