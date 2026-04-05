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
    <div className="w-full">
      <div className="flex flex-wrap items-center gap-2 bg-slate-900 p-2 rounded-xl shadow-xl border border-slate-800">
        {/* Search Input - If provided */}
        {setSearch !== undefined && (
          <div className="relative flex-1 min-w-[180px] border-r border-slate-800 pr-2">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <Input
              placeholder="PENCARIAN DATA NASIONAL..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-8 border-none bg-transparent shadow-none focus-visible:ring-0 text-[10px] font-black text-white placeholder:text-slate-600 uppercase tracking-widest"
            />
          </div>
        )}

        {/* Province */}
        <div className="flex items-center gap-2 px-3 border-r border-slate-800">
          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest shrink-0">PROV</span>
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
            <SelectTrigger className="h-8 border-none bg-slate-800/50 hover:bg-slate-800 transition-colors shadow-none w-[140px] text-[10px] font-black px-3 text-white tracking-tight rounded-lg">
              <SelectValue placeholder="SEMUA PROVINSI" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-slate-800 text-white">
              <SelectItem value="all" className="text-[10px] font-black uppercase tracking-tight focus:bg-slate-800 focus:text-white">SEMUA PROVINSI</SelectItem>
              {provinceOptions.map((opt) => (
                <SelectItem key={opt.id} value={opt.id} className="text-[10px] font-black uppercase tracking-tight focus:bg-slate-800 focus:text-white">
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Region */}
        <div className="flex items-center gap-2 px-3 border-r border-slate-800">
          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest shrink-0">KAB/KOTA</span>
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
            <SelectTrigger className="h-8 border-none bg-slate-800/50 hover:bg-slate-800 transition-colors shadow-none w-[140px] text-[10px] font-black px-3 text-white tracking-tight rounded-lg">
              <SelectValue placeholder="SEMUA KABUPATEN" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-slate-800 text-white">
              <SelectItem value="all" className="text-[10px] font-black uppercase tracking-tight focus:bg-slate-800 focus:text-white">SEMUA KAB/KOTA</SelectItem>
              {regionOptions.map((opt) => (
                <SelectItem key={opt.id} value={opt.id} className="text-[10px] font-black uppercase tracking-tight focus:bg-slate-800 focus:text-white">
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Village */}
        <div className="flex items-center gap-2 px-3 border-r border-slate-800">
          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest shrink-0">DESA</span>
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
            <SelectTrigger className="h-8 border-none bg-slate-800/50 hover:bg-slate-800 transition-colors shadow-none w-[140px] text-[10px] font-black px-3 text-white tracking-tight rounded-lg">
              <SelectValue placeholder="SEMUA DESA" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-slate-800 text-white">
              <SelectItem value="all" className="text-[10px] font-black uppercase tracking-tight focus:bg-slate-800 focus:text-white">SEMUA DESA</SelectItem>
              {villageOptions.map((opt) => (
                <SelectItem key={opt.id} value={opt.id} className="text-[10px] font-black uppercase tracking-tight focus:bg-slate-800 focus:text-white">
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Cooperative */}
        <div className="flex items-center gap-2 px-3 border-r border-slate-800">
          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest shrink-0">KOPERASI</span>
          <Select
            value={filters.cooperativeId}
            onValueChange={(v) =>
              setFilters((prev) => ({
                ...prev,
                cooperativeId: v,
              }))
            }
          >
            <SelectTrigger className="h-8 border-none bg-slate-800/50 hover:bg-slate-800 transition-colors shadow-none w-[160px] text-[10px] font-black px-3 text-white tracking-tight rounded-lg">
              <SelectValue placeholder="SEMUA ENTITAS" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-slate-800 text-white">
              <SelectItem value="all" className="text-[10px] font-black uppercase tracking-tight focus:bg-slate-800 focus:text-white">SEMUA KOPERASI</SelectItem>
              {cooperativeOptions.map((opt) => (
                <SelectItem key={opt.id} value={opt.id} className="text-[10px] font-black uppercase tracking-tight focus:bg-slate-800 focus:text-white">
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Commodity */}
        {showCommodity && (
          <div className="flex items-center gap-2 px-3 border-r border-slate-800">
            <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest shrink-0">KOMODITAS</span>
            <Select
              value={filters.commodityId}
              onValueChange={(v) =>
                setFilters((prev) => ({ ...prev, commodityId: v }))
              }
            >
              <SelectTrigger className="h-8 border-none bg-slate-800/50 hover:bg-slate-800 transition-colors shadow-none w-[140px] text-[10px] font-black px-3 text-white tracking-tight rounded-lg">
                <SelectValue placeholder="SEMUA" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-800 text-white">
                {commodityOptions.map((opt) => (
                  <SelectItem key={opt.id} value={opt.id} className="text-[10px] font-black uppercase tracking-tight focus:bg-slate-800 focus:text-white">
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
          className="h-8 w-8 p-0 text-slate-500 hover:bg-rose-500 hover:text-white transition-all ml-auto rounded-lg"
          onClick={resetFilters}
        >
          <RefreshCw className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  )
}
