'use client'

import { useState, useMemo } from 'react'
import {
  AlertTriangle,
  Calendar,
  ChevronRight,
  Leaf,
  Plus,
  TrendingUp,
  Search,
  Target,
  BarChart3,
  MapPin,
  Building2,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useAuth } from '@/lib/auth/use-auth'
import { KementerianFilterBar } from '@/components/dashboard/kementerian-filter-bar'
import { ScopeFilters } from '@/lib/kementerian-dashboard-data'

const rencanaTanam = [
  {
    id: 'RT001',
    komoditas: 'Padi',
    varietas: 'IR64',
    luasHa: 15.5,
    kelompok: 'Klp. Makmur Jaya',
    desa: 'SUKAMAJU',
    koperasi: 'KOP. MAJU JAYA',
    musim: 'MT1 2024',
    tanggalMulai: '2024-01-15',
    tanggalPanen: '2024-04-15',
    progress: 65,
    status: 'berjalan',
    estimasiHasil: '85 ton',
  },
  {
    id: 'RT002',
    komoditas: 'Jagung',
    varietas: 'Hibrida',
    luasHa: 8.0,
    kelompok: 'Klp. Makmur Jaya',
    desa: 'SUKAMAJU',
    koperasi: 'KOP. MAJU JAYA',
    musim: 'MT1 2024',
    tanggalMulai: '2024-02-01',
    tanggalPanen: '2024-05-01',
    progress: 40,
    status: 'berjalan',
    estimasiHasil: '32 ton',
  },
  {
    id: 'RT003',
    komoditas: 'Kentang',
    varietas: 'Granola',
    luasHa: 5.0,
    kelompok: 'Klp. Sumber Rezeki',
    desa: 'CIBODAS',
    koperasi: 'KOP. MANDIRI',
    musim: 'MT1 2024',
    tanggalMulai: '2024-01-20',
    tanggalPanen: '2024-04-20',
    progress: 80,
    status: 'berjalan',
    estimasiHasil: '75 ton',
  },
  {
    id: 'RT004',
    komoditas: 'Cabai Merah',
    varietas: 'TM999',
    luasHa: 3.2,
    kelompok: 'Klp. Makmur Jaya',
    desa: 'SUKAMAJU',
    koperasi: 'KOP. MAJU JAYA',
    musim: 'MT2 2024',
    tanggalMulai: '2024-03-01',
    tanggalPanen: '2024-06-15',
    progress: 0,
    status: 'dijadwalkan',
    estimasiHasil: '28 ton',
  },
]

const musimOptions = ['MT1 2024', 'MT2 2024', 'MT1 2025']

export default function RencanaTanamPage() {
  const { user } = useAuth()
  const isKementerian = user?.role === 'kementerian'
  const isPetani = user?.role === 'petani'

  const [filters, setFilters] = useState<ScopeFilters>({
    provinceId: 'all',
    regionId: 'all',
    villageId: 'all',
    cooperativeId: 'all',
    commodityId: 'all',
  })

  const [filterMusim, setFilterMusim] = useState('semua')
  const [search, setSearch] = useState('')

  const filteredRencana = useMemo(() => {
    return rencanaTanam.filter(r => {
      const matchesSearch = r.komoditas.toLowerCase().includes(search.toLowerCase()) || r.kelompok.toLowerCase().includes(search.toLowerCase())
      const matchesMusim = filterMusim === 'semua' || r.musim === filterMusim
      
      if (!isKementerian) return matchesSearch && matchesMusim

      const matchesVillage = filters.villageId === 'all' || r.desa.toUpperCase().includes(filters.villageId.split('-').pop() || '')
      const matchesKop = filters.cooperativeId === 'all' || r.koperasi.toUpperCase().includes(filters.cooperativeId.split('-').pop() || '')
      const matchesCommodity = filters.commodityId === 'all' || r.komoditas.toLowerCase().includes(filters.commodityId.toLowerCase())

      return matchesSearch && matchesMusim && matchesVillage && matchesKop && matchesCommodity
    })
  }, [search, filterMusim, filters, isKementerian])

  const totals = useMemo(() => {
    return {
      count: filteredRencana.length,
      luas: filteredRencana.reduce((acc, r) => acc + r.luasHa, 0),
      berjalan: filteredRencana.filter(r => r.status === 'berjalan').length,
      estHasil: filteredRencana.reduce((acc, r) => acc + parseInt(r.estimasiHasil), 0)
    }
  }, [filteredRencana])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 uppercase">Rencana Produksi Nasional</h1>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
            Orkestrasi Musim Tanam dan Proyeksi Hasil Panen Lintas Wilayah
          </p>
        </div>
        {!isPetani && (
          <Button size="sm" className="h-10 bg-slate-900 text-white hover:bg-slate-800 text-[10px] font-black uppercase tracking-widest px-6 shadow-lg shadow-slate-200">
            <Plus className="mr-2 h-4 w-4" />
            Buat Rencana Strategis
          </Button>
        )}
      </div>

      {/* Kementerian Filter Bar */}
      {isKementerian && <KementerianFilterBar filters={filters} setFilters={setFilters} search={search} setSearch={setSearch} />}

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: 'Rencana Aktif', value: totals.count, sub: `${totals.berjalan} Dalam Proses`, icon: Target, tone: 'slate' },
          { label: 'Akumulasi Lahan', value: `${totals.luas.toFixed(1)} Ha`, sub: 'Area Terencana', icon: Leaf, tone: 'emerald' },
          { label: 'Proyeksi Output', value: `${totals.estHasil} Ton`, sub: 'Est. Panen Global', icon: BarChart3, tone: 'emerald' },
          { label: 'Risk Alert', value: '1', sub: 'Terlambat Jadwal', icon: AlertTriangle, tone: 'rose' },
        ].map((stat, i) => (
          <Card key={i} className="border-none shadow-[0_4px_12px_-4px_rgba(0,0,0,0.05)] overflow-hidden">
            <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <stat.icon className={`h-3.5 w-3.5 ${stat.tone === 'rose' ? 'text-rose-500' : 'text-slate-400'}`} />
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="text-2xl font-black text-slate-900 tracking-tighter">{stat.value}</p>
              <p className={`text-[10px] font-bold uppercase mt-1 tracking-widest ${stat.tone === 'rose' ? 'text-rose-600' : 'text-slate-500'}`}>{stat.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Local Filter: Musim */}
      <div className="flex bg-white p-2 rounded-xl border border-slate-100 shadow-sm w-fit gap-2">
        <span className="flex items-center px-3 text-[9px] font-black text-slate-400 uppercase tracking-widest border-r border-slate-100">Filter Musim</span>
        <Select value={filterMusim} onValueChange={setFilterMusim}>
          <SelectTrigger className="h-8 border-none bg-transparent shadow-none w-[160px] text-[10px] font-black uppercase px-2 focus:ring-0">
            <SelectValue placeholder="Pilih Musim" />
          </SelectTrigger>
          <SelectContent className="bg-slate-900 border-slate-800 text-white">
            <SelectItem value="semua" className="text-[10px] font-black uppercase">SEMUA MUSIM</SelectItem>
            {musimOptions.map((musim) => (
              <SelectItem key={musim} value={musim} className="text-[10px] font-black uppercase">
                {musim}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Rencana Grid */}
      <div className="grid gap-4 lg:grid-cols-2">
        {filteredRencana.map((rencana) => (
          <Card key={rencana.id} className="border-none shadow-[0_4px_12px_-4px_rgba(0,0,0,0.05)] overflow-hidden group hover:shadow-lg transition-all">
            <CardHeader className="p-4 border-b border-slate-50 bg-slate-50/50">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded bg-white border border-slate-100 flex items-center justify-center shadow-sm">
                    <Leaf className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight group-hover:text-emerald-600 transition-colors">
                        {rencana.komoditas}
                      </h3>
                      <Badge variant="outline" className="text-[8px] font-black uppercase border-slate-200 text-slate-500 h-4">{rencana.varietas}</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">PELAKSANA:</p>
                      <p className="text-[9px] font-black text-slate-900 uppercase tracking-tight">{rencana.kelompok}</p>
                    </div>
                  </div>
                </div>
                <Badge className={`text-[9px] font-black uppercase border-none px-2 h-5 ${rencana.status === 'berjalan' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                  {rencana.status === 'berjalan' ? 'ON-GOING' : 'SCHEDULED'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">AREA</p>
                  <p className="text-xs font-black text-slate-900 mt-1">{rencana.luasHa} HA</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">MUSIM</p>
                  <p className="text-xs font-black text-slate-900 mt-1">{rencana.musim}</p>
                </div>
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100">
                  <p className="text-[9px] font-black text-emerald-600 uppercase tracking-widest">EST. HASIL</p>
                  <p className="text-xs font-black text-emerald-700 mt-1">{rencana.estimasiHasil}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-tight">
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Calendar className="h-3 w-3" />
                    <span>{rencana.tanggalMulai} — {rencana.tanggalPanen}</span>
                  </div>
                  <span className="text-slate-900">{rencana.progress}% PROGRESS</span>
                </div>
                <Progress value={rencana.progress} className="h-1.5 bg-slate-100" />
              </div>

              <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-50">
                <div className="flex items-center gap-2">
                  <MapPin className="h-3 w-3 text-slate-400" />
                  <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{rencana.desa} • {rencana.koperasi}</span>
                </div>
                <Button variant="ghost" size="sm" className="h-8 text-[9px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-100">
                  Detail Rencana
                  <ChevronRight className="ml-1.5 h-3.5 w-3.5" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
