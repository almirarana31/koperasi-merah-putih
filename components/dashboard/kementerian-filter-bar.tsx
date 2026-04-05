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

interface KementerianFilterBarProps {
  filters: ScopeFilters
  setFilters: (filters: ScopeFilters | ((prev: ScopeFilters) => ScopeFilters)) => void
  search?: string
  setSearch?: (search: string) => void
  showCommodity?: boolean
}

const triggerClassName =
  'h-8 rounded-lg border border-[var(--dashboard-secondary)]/12 bg-white px-3 text-[10px] font-black tracking-tight text-[var(--dashboard-secondary)] shadow-none transition-colors hover:bg-[var(--dashboard-neutral)]'

const contentClassName = 'border-[var(--dashboard-secondary)]/15 bg-white text-[var(--dashboard-secondary)]'
const itemClassName =
  'text-[10px] font-black uppercase tracking-tight focus:bg-[var(--dashboard-neutral)] focus:text-[var(--dashboard-secondary)]'

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
      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-[var(--dashboard-secondary)]/15 bg-[var(--dashboard-neutral)] p-2 shadow-[0_16px_36px_-22px_rgba(69,90,100,0.45)]">
        {setSearch !== undefined && (
          <div className="relative min-w-[180px] flex-1 border-r border-[var(--dashboard-secondary)]/10 pr-2">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--dashboard-secondary)]/45" />
            <Input
              placeholder="PENCARIAN DATA NASIONAL..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-8 border-none bg-transparent pl-9 text-[10px] font-black uppercase tracking-widest text-[var(--dashboard-secondary)] placeholder:text-[var(--dashboard-secondary)]/45 shadow-none focus-visible:ring-0"
            />
          </div>
        )}

        <div className="flex items-center gap-2 border-r border-[var(--dashboard-secondary)]/10 px-3">
          <span className="shrink-0 text-[9px] font-black uppercase tracking-widest text-[var(--dashboard-secondary)]/55">PROV</span>
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
              <SelectValue placeholder="SEMUA PROVINSI" />
            </SelectTrigger>
            <SelectContent className={contentClassName}>
              <SelectItem value="all" className={itemClassName}>
                SEMUA PROVINSI
              </SelectItem>
              {provinceOptions.map((opt) => (
                <SelectItem key={opt.id} value={opt.id} className={itemClassName}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2 border-r border-[var(--dashboard-secondary)]/10 px-3">
          <span className="shrink-0 text-[9px] font-black uppercase tracking-widest text-[var(--dashboard-secondary)]/55">KAB/KOTA</span>
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
              <SelectValue placeholder="SEMUA KABUPATEN" />
            </SelectTrigger>
            <SelectContent className={contentClassName}>
              <SelectItem value="all" className={itemClassName}>
                SEMUA KAB/KOTA
              </SelectItem>
              {regionOptions.map((opt) => (
                <SelectItem key={opt.id} value={opt.id} className={itemClassName}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2 border-r border-[var(--dashboard-secondary)]/10 px-3">
          <span className="shrink-0 text-[9px] font-black uppercase tracking-widest text-[var(--dashboard-secondary)]/55">DESA</span>
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
              <SelectValue placeholder="SEMUA DESA" />
            </SelectTrigger>
            <SelectContent className={contentClassName}>
              <SelectItem value="all" className={itemClassName}>
                SEMUA DESA
              </SelectItem>
              {villageOptions.map((opt) => (
                <SelectItem key={opt.id} value={opt.id} className={itemClassName}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2 border-r border-[var(--dashboard-secondary)]/10 px-3">
          <span className="shrink-0 text-[9px] font-black uppercase tracking-widest text-[var(--dashboard-secondary)]/55">KOPERASI</span>
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
              <SelectValue placeholder="SEMUA ENTITAS" />
            </SelectTrigger>
            <SelectContent className={contentClassName}>
              <SelectItem value="all" className={itemClassName}>
                SEMUA KOPERASI
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
          <div className="flex items-center gap-2 border-r border-[var(--dashboard-secondary)]/10 px-3">
            <span className="shrink-0 text-[9px] font-black uppercase tracking-widest text-[var(--dashboard-secondary)]/55">KOMODITAS</span>
            <Select
              value={filters.commodityId}
              onValueChange={(v) => setFilters((prev) => ({ ...prev, commodityId: v }))}
            >
              <SelectTrigger className={`${triggerClassName} w-[140px]`}>
                <SelectValue placeholder="SEMUA" />
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
          className="ml-auto h-8 w-8 rounded-lg p-0 text-[var(--dashboard-secondary)]/70 transition-all hover:bg-[var(--dashboard-primary)] hover:text-white"
          onClick={resetFilters}
        >
          <RefreshCw className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  )
}
