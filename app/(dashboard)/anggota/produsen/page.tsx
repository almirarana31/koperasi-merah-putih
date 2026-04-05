'use client'

import { useState, useMemo } from 'react'
import {
  Search,
  Filter,
  MapPin,
  Phone,
  Leaf,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Users,
  ShieldAlert,
  Download,
  FileText,
  Activity,
  Globe,
  Sprout,
  LandPlot,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { members } from '@/lib/data'
import { KementerianFilterBar } from '@/components/dashboard/kementerian-filter-bar'
import { ScopeFilters } from '@/lib/kementerian-dashboard-data'
import { useAuth } from '@/lib/auth/use-auth'

const producers = members.filter(m => m.tipe === 'petani' || m.tipe === 'nelayan')

export default function ProdusenPage() {
  const { user } = useAuth()
  const isKementerian = user?.role === 'kementerian'
  
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState('semua')
  const [filters, setFilters] = useState<ScopeFilters>({
    provinceId: 'all',
    regionId: 'all',
    villageId: 'all',
    cooperativeId: 'all',
    commodityId: 'all',
  })

  const filtered = useMemo(() => {
    return producers.filter(p => {
      const matchSearch = p.nama.toLowerCase().includes(search.toLowerCase())
      const matchType = filterType === 'semua' || p.tipe === filterType
      
      // Hierarchical Filtering Logic
      const matchProvince =
        filters.provinceId === 'all' || p.alamat?.toUpperCase().includes(filters.provinceId.toUpperCase())
      const matchRegion = filters.regionId === 'all' || 
        p.alamat?.toUpperCase().includes(filters.regionId.toUpperCase()) || 
        p.kecamatan?.toUpperCase().includes(filters.regionId.toUpperCase())
      const matchVillage = filters.villageId === 'all' || p.desa?.toUpperCase() === filters.villageId.toUpperCase()
      
      // Note: In mock data, cooperative link might be indirect
      const matchCoop = filters.cooperativeId === 'all' || true 
      const matchCommodity = filters.commodityId === 'all' || p.komoditas?.some(k => k.toLowerCase().includes(filters.commodityId.toLowerCase()))

      return matchSearch && matchType && matchProvince && matchRegion && matchVillage && matchCoop && matchCommodity
    })
  }, [search, filterType, filters])

  const stats = useMemo(() => {
    const totalLand = filtered.reduce((sum, p) => sum + (p.luasLahan || 0), 0)
    const avgLand = filtered.length > 0 ? totalLand / filtered.length : 0
    return {
      count: filtered.length,
      totalLand,
      avgLand,
    }
  }, [filtered])

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-slate-900 flex items-center justify-center shadow-xl">
            <Users className="h-6 w-6 text-emerald-500" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 uppercase">Direktori Produsen Nasional</h1>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
              Monitoring Agregat Petani & Nelayan • {filtered.length.toLocaleString()} Entitas Terdeteksi
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" className="h-10 text-[10px] font-black uppercase tracking-widest text-slate-600 border-slate-200">
            <FileText className="h-4 w-4 mr-2 text-rose-600" />
            Export CSV
          </Button>
          <Button size="sm" className="h-10 bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-black uppercase tracking-widest px-6 shadow-lg shadow-slate-200">
            <Download className="h-4 w-4 mr-2" />
            Download Report
          </Button>
        </div>
      </div>

      {/* Hierarchical Filter Bar */}
      <KementerianFilterBar filters={filters} setFilters={setFilters} />

      {/* High-Density Stats Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Produsen', value: stats.count.toLocaleString(), sub: 'Jiwa', icon: Users, color: 'text-slate-900' },
          { label: 'Total Luas Lahan', value: stats.totalLand.toFixed(1), sub: 'Hektar', icon: LandPlot, color: 'text-emerald-600' },
          { label: 'Rerata Lahan', value: stats.avgLand.toFixed(2), sub: 'Ha/Org', icon: Sprout, color: 'text-blue-600' },
          { label: 'Active Coverage', value: '94%', sub: 'Nasional', icon: Globe, color: 'text-amber-600' },
        ].map((s, i) => (
          <Card key={i} className="border-none shadow-sm bg-white overflow-hidden">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg bg-slate-50 flex items-center justify-center">
                <s.icon className={`h-5 w-5 ${s.color}`} />
              </div>
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{s.label}</p>
                <div className="flex items-baseline gap-1">
                  <span className={`text-xl font-black tracking-tighter ${s.color}`}>{s.value}</span>
                  <span className="text-[10px] font-bold text-slate-500 uppercase">{s.sub}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search & Local Filter */}
      <Card className="border-none shadow-sm bg-slate-50/50">
        <CardContent className="p-3">
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="CARI NAMA PRODUSEN ATAU NIK..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-white border-slate-200 h-10 text-[11px] font-bold uppercase tracking-wider focus:ring-slate-900"
              />
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mr-2">Tipe:</span>
              <div className="flex bg-white p-1 rounded-lg border border-slate-200">
                {['semua', 'petani', 'nelayan'].map((t) => (
                  <Button
                    key={t}
                    size="sm"
                    variant={filterType === t ? 'default' : 'ghost'}
                    onClick={() => setFilterType(t)}
                    className={`h-7 text-[9px] font-black uppercase px-3 rounded-md transition-all ${
                      filterType === t ? 'bg-slate-900 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'
                    }`}
                  >
                    {t}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Producers Grid - High Density Executive Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((producer) => (
          <Card key={producer.id} className="group border-none shadow-sm hover:shadow-xl transition-all duration-300 bg-white overflow-hidden border-t-4 border-t-slate-900">
            <CardHeader className="p-4 pb-2">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12 rounded-lg border-2 border-slate-100 shadow-sm group-hover:scale-105 transition-transform">
                    <AvatarFallback className="bg-slate-900 text-white font-black text-sm">
                      {producer.nama.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <CardTitle className="text-xs font-black text-slate-900 uppercase truncate leading-tight tracking-tight">
                      {producer.nama}
                    </CardTitle>
                    <div className="flex items-center gap-1.5 mt-1">
                      <Badge className={`h-4 text-[8px] font-black uppercase px-1.5 rounded border-none ${
                        producer.tipe === 'petani' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {producer.tipe}
                      </Badge>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">ID: {producer.id}</span>
                    </div>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-900">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48 font-bold text-[10px] uppercase">
                    <DropdownMenuItem className="py-2.5"><Eye className="mr-2 h-4 w-4 text-emerald-600" /> PROFIL LENGKAP</DropdownMenuItem>
                    <DropdownMenuItem className="py-2.5"><Activity className="mr-2 h-4 w-4 text-blue-600" /> TRACK LOGISTIK</DropdownMenuItem>
                    <DropdownMenuItem className="py-2.5 text-rose-600"><ShieldAlert className="mr-2 h-4 w-4" /> AUDIT ENTITAS</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-2 space-y-4">
              {/* Location & Contact - High Density */}
              <div className="space-y-2.5">
                <div className="flex items-start gap-2.5 group/loc">
                  <div className="h-6 w-6 rounded bg-slate-50 flex items-center justify-center shrink-0">
                    <MapPin className="h-3 w-3 text-slate-400 group-hover/loc:text-rose-600 transition-colors" />
                  </div>
                  <p className="text-[10px] font-bold text-slate-600 uppercase leading-relaxed tracking-tight">
                    {producer.desa}, {producer.kecamatan}
                  </p>
                </div>
                <div className="flex items-center gap-2.5 group/phone">
                   <div className="h-6 w-6 rounded bg-slate-50 flex items-center justify-center shrink-0">
                    <Phone className="h-3 w-3 text-slate-400 group-hover/phone:text-emerald-600 transition-colors" />
                  </div>
                  <p className="text-[10px] font-black text-slate-900 tracking-widest">
                    {producer.noHp}
                  </p>
                </div>
              </div>

              {/* Commodities Tags */}
              <div className="pt-3 border-t border-slate-50">
                <div className="flex items-center gap-1.5 mb-2">
                  <Leaf className="h-3 w-3 text-emerald-600" />
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Komoditas Fokus</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {producer.komoditas?.map((k, i) => (
                    <Badge key={i} variant="outline" className="h-5 text-[9px] font-black uppercase tracking-tight border-slate-100 text-slate-600 bg-slate-50/50">
                      {k}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Land Info KPI */}
              {producer.luasLahan && (
                <div className="p-3 rounded-xl bg-slate-900 text-white flex items-center justify-between shadow-inner">
                  <div>
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">Luas Lahan Aktif</p>
                    <p className="text-xl font-black tracking-tighter mt-0.5">{producer.luasLahan} <span className="text-[10px] text-emerald-400 uppercase ml-1">Hektar</span></p>
                  </div>
                  <div className="h-8 w-8 rounded-lg bg-white/10 flex items-center justify-center">
                    <LandPlot className="h-4 w-4 text-emerald-400" />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <Card className="border-dashed py-20 bg-slate-50/50">
          <CardContent className="flex flex-col items-center justify-center text-center">
            <div className="h-16 w-16 rounded-full bg-slate-200 flex items-center justify-center mb-4">
              <Users className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-black text-slate-900 uppercase">Tidak Ada Produsen Terdeteksi</h3>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1 max-w-[300px]">
              Sesuaikan filter hierarki atau kata kunci pencarian Anda untuk melihat data.
            </p>
            <Button 
              variant="link" 
              onClick={() => {
                setSearch('')
                setFilterType('semua')
                setFilters({ provinceId: 'all', regionId: 'all', villageId: 'all', cooperativeId: 'all', commodityId: 'all' })
              }}
              className="mt-4 text-[10px] font-black uppercase text-emerald-600"
            >
              Reset Semua Filter
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
