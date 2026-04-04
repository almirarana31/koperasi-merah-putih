'use client'

import { Search, RefreshCw, Filter } from 'lucide-react'
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

export function KementerianFilterBar({
  filters,
  setFilters,
  search,
  setSearch,
  showCommodity = true,
}: KementerianFilterBarProps) {
  const provinceOptions = KEMENTERIAN_DASHBOARD_DATA.provinceOptions
  const regionOptions = KEMENTERIAN_DASHBOARD_DATA.regionOptions.filter(
    (option) => filters.provinceId === 'all' || option.provinceId === filters.provinceId
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
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-2 bg-white p-2 rounded-xl border border-slate-200 shadow-sm">
        {/* Search Input - If provided */}
        {setSearch !== undefined && (
          <div className="relative flex-1 min-w-[200px] border-r border-slate-100 pr-2">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Cari..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-8 border-none bg-transparent shadow-none focus-visible:ring-0"
            />
          </div>
        )}

        {/* Province */}
        <div className="flex items-center gap-1 px-2 border-r border-slate-100">
          <span className="text-[10px] font-black text-slate-400 uppercase">Prov</span>
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
            <SelectTrigger className="h-8 border-none bg-transparent shadow-none w-[120px] text-xs font-bold p-0">
              <SelectValue placeholder="Semua" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Provinsi</SelectItem>
              {provinceOptions.map((opt) => (
                <SelectItem key={opt.id} value={opt.id}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Region */}
        <div className="flex items-center gap-1 px-2 border-r border-slate-100">
          <span className="text-[10px] font-black text-slate-400 uppercase">Kab/Kota</span>
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
            <SelectTrigger className="h-8 border-none bg-transparent shadow-none w-[120px] text-xs font-bold p-0">
              <SelectValue placeholder="Semua" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Kab/Kota</SelectItem>
              {regionOptions.map((opt) => (
                <SelectItem key={opt.id} value={opt.id}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Village */}
        <div className="flex items-center gap-1 px-2 border-r border-slate-100">
          <span className="text-[10px] font-black text-slate-400 uppercase">Desa</span>
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
            <SelectTrigger className="h-8 border-none bg-transparent shadow-none w-[120px] text-xs font-bold p-0">
              <SelectValue placeholder="Semua" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Desa</SelectItem>
              {villageOptions.map((opt) => (
                <SelectItem key={opt.id} value={opt.id}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Cooperative */}
        <div className="flex items-center gap-1 px-2 border-r border-slate-100">
          <span className="text-[10px] font-black text-slate-400 uppercase">Kop</span>
          <Select
            value={filters.cooperativeId}
            onValueChange={(v) =>
              setFilters((prev) => ({
                ...prev,
                cooperativeId: v,
              }))
            }
          >
            <SelectTrigger className="h-8 border-none bg-transparent shadow-none w-[120px] text-xs font-bold p-0">
              <SelectValue placeholder="Semua" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Koperasi</SelectItem>
              {cooperativeOptions.map((opt) => (
                <SelectItem key={opt.id} value={opt.id}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Commodity */}
        {showCommodity && (
          <div className="flex items-center gap-1 px-2 border-r border-slate-100">
            <span className="text-[10px] font-black text-slate-400 uppercase">Komoditas</span>
            <Select
              value={filters.commodityId}
              onValueChange={(v) =>
                setFilters((prev) => ({ ...prev, commodityId: v }))
              }
            >
              <SelectTrigger className="h-8 border-none bg-transparent shadow-none w-[120px] text-xs font-bold p-0">
                <SelectValue placeholder="Semua" />
              </SelectTrigger>
              <SelectContent>
                {commodityOptions.map((opt) => (
                  <SelectItem key={opt.id} value={opt.id}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Reset Button */}
        <Button
          size="sm"
          variant="ghost"
          className="h-8 w-8 p-0 hover:bg-rose-50 hover:text-rose-600"
          onClick={resetFilters}
        >
          <RefreshCw className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
