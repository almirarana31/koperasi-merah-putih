'use client'

import { useState, useMemo } from 'react'
import {
  AlertTriangle,
  Calendar as CalendarIcon,
  ChevronRight,
  Leaf,
  Plus,
  TrendingUp,
  Search,
  Target,
  BarChart3,
  MapPin,
  Building2,
  ChevronLeft,
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
import { toast } from 'sonner'

const baseRencanaTanam = [
  {
    id: 'RT001',
    komoditas: 'Padi IR64',
    varietas: 'Unggul Nasional',
    luasHa: 15500,
    kelompok: 'Gabungan Kelompok Tani Makmur',
    desa: 'SUKAMAJU',
    koperasi: 'KOP. MERAH PUTIH JAYA',
    musim: 'MT1 2026',
    tanggalMulai: '2026-05-15',
    tanggalPanen: '2026-08-15',
    progress: 65,
    status: 'berjalan',
    estimasiHasil: 85000,
  },
  {
    id: 'RT002',
    komoditas: 'Jagung Hibrida',
    varietas: 'Pioneer P35',
    luasHa: 8000,
    kelompok: 'Klp. Tani Sejahtera',
    desa: 'SUKAMAJU',
    koperasi: 'KOP. MERAH PUTIH JAYA',
    musim: 'MT1 2026',
    tanggalMulai: '2026-06-01',
    tanggalPanen: '2026-09-01',
    progress: 40,
    status: 'berjalan',
    estimasiHasil: 32000,
  },
  {
    id: 'RT003',
    komoditas: 'Kentang Granola',
    varietas: 'G2 Bersertifikat',
    luasHa: 5000,
    kelompok: 'Klp. Tani Mandiri',
    desa: 'CIBODAS',
    koperasi: 'KOP. MANDIRI SEJAHTERA',
    musim: 'MT1 2026',
    tanggalMulai: '2026-05-20',
    tanggalPanen: '2026-08-20',
    progress: 80,
    status: 'berjalan',
    estimasiHasil: 75000,
  },
  {
    id: 'RT004',
    komoditas: 'Cabai Merah Keriting',
    varietas: 'TM999 Special',
    luasHa: 3200,
    kelompok: 'Klp. Tani Makmur',
    desa: 'SUKAMAJU',
    koperasi: 'KOP. MERAH PUTIH JAYA',
    musim: 'MT2 2026',
    tanggalMulai: '2026-07-01',
    tanggalPanen: '2026-10-15',
    progress: 0,
    status: 'dijadwalkan',
    estimasiHasil: 28000,
  },
]

const musimOptions = ['MT1 2026', 'MT2 2026', 'MT1 2027']

export default function RencanaTanamPage() {
  const { user } = useAuth()
  const isKementerian = user?.role === 'kementerian'

  const [filters, setFilters] = useState<ScopeFilters>({
    provinceId: 'all',
    regionId: 'all',
    villageId: 'all',
    cooperativeId: 'all',
    commodityId: 'all',
  })

  const [filterMusim, setFilterMusim] = useState('semua')
  const [search, setSearch] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'calendar'>('grid')
  const [calendarView, setCalendarView] = useState<'day' | 'week' | 'month' | 'year'>('month')

  const scaleFactor = useMemo(() => {
    if (filters.cooperativeId !== 'all') return 0.05
    if (filters.villageId !== 'all') return 0.1
    if (filters.regionId !== 'all') return 0.25
    if (filters.provinceId !== 'all') return 0.5
    return 1.0
  }, [filters])

  const rencanaTanam = useMemo(() => {
    return baseRencanaTanam.map(item => ({
      ...item,
      luasHa: item.luasHa * scaleFactor,
      estimasiHasil: item.estimasiHasil * scaleFactor,
    })).filter(r => {
      const matchesSearch = r.komoditas.toLowerCase().includes(search.toLowerCase()) || r.kelompok.toLowerCase().includes(search.toLowerCase())
      const matchesMusim = filterMusim === 'semua' || r.musim === filterMusim
      return matchesSearch && matchesMusim
    })
  }, [search, filterMusim, scaleFactor])

  const totals = useMemo(() => {
    return {
      count: rencanaTanam.length,
      luas: rencanaTanam.reduce((acc, r) => acc + r.luasHa, 0),
      berjalan: rencanaTanam.filter(r => r.status === 'berjalan').length,
      estHasil: rencanaTanam.reduce((acc, r) => acc + r.estimasiHasil, 0)
    }
  }, [rencanaTanam])

  const handleAction = (action: string) => {
    toast.success(`Aksi ${action} berhasil diverifikasi`)
  }

  const daysInMonth = 31
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1)

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-2">
          <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Pusat Rencana Produksi</h1>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">
            Orkestrasi Musim Tanam dan Proyeksi Hasil Panen Strategis Nasional
          </p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-slate-100 p-1 rounded-none border border-slate-200">
            <Button 
              variant={viewMode === 'grid' ? 'default' : 'ghost'} 
              size="sm" 
              className={`h-8 px-4 text-[10px] font-black uppercase tracking-widest rounded-none ${viewMode === 'grid' ? 'bg-slate-900 text-white' : 'text-slate-500'}`}
              onClick={() => setViewMode('grid')}
            >
              List
            </Button>
            <Button 
              variant={viewMode === 'calendar' ? 'default' : 'ghost'} 
              size="sm" 
              className={`h-8 px-4 text-[10px] font-black uppercase tracking-widest rounded-none ${viewMode === 'calendar' ? 'bg-slate-900 text-white' : 'text-slate-500'}`}
              onClick={() => setViewMode('calendar')}
            >
              Kalender
            </Button>
          </div>
          <Button 
            size="sm" 
            onClick={() => handleAction('Buat Rencana')}
            className="h-10 rounded-none bg-slate-900 text-white hover:bg-slate-800 text-[10px] font-black uppercase tracking-widest px-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] transition-all"
          >
            <Plus className="mr-2 h-4 w-4" />
            Rencana Baru
          </Button>
        </div>
      </div>

      <KementerianFilterBar filters={filters} setFilters={setFilters} search={search} setSearch={setSearch} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Rencana Aktif', value: totals.count, sub: `${totals.berjalan} Unit Dalam Proses`, icon: Target, tone: 'slate' },
          { label: 'Akumulasi Lahan', value: `${totals.luas.toLocaleString()} Ha`, sub: 'Total Area Terencana', icon: Leaf, tone: 'emerald' },
          { label: 'Proyeksi Output', value: `${(totals.estHasil / 1000).toFixed(1)}K Ton`, sub: 'Estimasi Panen Global', icon: BarChart3, tone: 'emerald' },
          { label: 'Skor Risiko', value: 'LOW', sub: 'Kerawanan Pangan Rendah', icon: AlertTriangle, tone: 'emerald' },
        ].map((s, i) => (
          <Card key={i} className="border-none shadow-sm bg-white overflow-hidden rounded-none">
             <div className={`h-1 w-full ${
              s.tone === 'emerald' ? 'bg-emerald-500' : 'bg-slate-900'
            }`} />
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-10 w-10 rounded-none bg-slate-50 flex items-center justify-center shrink-0 shadow-inner">
                <s.icon className={`h-5 w-5 ${s.tone === 'emerald' ? 'text-emerald-500' : 'text-slate-900'}`} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{s.label}</p>
                <div className="flex flex-col">
                  <span className="text-sm font-black text-slate-900 leading-tight">{s.value}</span>
                  <span className="text-[8px] font-bold text-slate-500 uppercase tracking-tighter">{s.sub}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex bg-white p-2 rounded-none border border-slate-100 shadow-sm w-fit gap-2">
          <span className="flex items-center px-3 text-[10px] font-black text-slate-400 uppercase tracking-widest border-r border-slate-100">Filter Musim</span>
          <Select value={filterMusim} onValueChange={setFilterMusim}>
            <SelectTrigger className="h-8 border-none bg-transparent shadow-none w-[160px] text-[10px] font-black uppercase px-2 focus:ring-0">
              <SelectValue placeholder="Pilih Musim" />
            </SelectTrigger>
            <SelectContent className="rounded-none bg-slate-900 border-slate-800 text-white">
              <SelectItem value="semua" className="text-[10px] font-black uppercase">SEMUA MUSIM</SelectItem>
              {musimOptions.map((musim) => (
                <SelectItem key={musim} value={musim} className="text-[10px] font-black uppercase">
                  {musim}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {viewMode === 'calendar' && (
          <div className="flex bg-slate-900 p-1 rounded-none border border-slate-800 shadow-xl">
            {(['day', 'week', 'month', 'year'] as const).map((view) => (
              <Button 
                key={view}
                variant={calendarView === view ? 'secondary' : 'ghost'} 
                size="sm" 
                className={`h-7 px-4 text-[10px] font-black uppercase tracking-widest rounded-none ${calendarView === view ? 'bg-emerald-500 text-white hover:bg-emerald-600 border-none' : 'text-slate-400 hover:text-white'}`}
                onClick={() => setCalendarView(view)}
              >
                {view === 'day' ? 'Harian' : view === 'week' ? 'Mingguan' : view === 'month' ? 'Bulanan' : 'Tahunan'}
              </Button>
            ))}
          </div>
        )}
      </div>

      {viewMode === 'grid' ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {rencanaTanam.map((rencana) => (
            <Card key={rencana.id} className="rounded-none border-none shadow-sm overflow-hidden group hover:shadow-md transition-all border-t-4 border-t-emerald-500">
              <CardHeader className="p-4 border-b border-slate-50 bg-slate-50/50">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4">
                    <div className="h-10 w-10 rounded-none bg-white border border-slate-100 flex items-center justify-center shadow-sm">
                      <Leaf className="h-5 w-5 text-emerald-600" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight group-hover:text-emerald-600 transition-colors">
                          {rencana.komoditas}
                        </h3>
                        <Badge variant="outline" className="rounded-none text-[10px] font-black uppercase tracking-widest border-slate-200 text-slate-500 h-4">{rencana.varietas}</Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">PELAKSANA:</p>
                        <p className="text-[10px] font-black text-slate-900 uppercase tracking-tighter">{rencana.kelompok}</p>
                      </div>
                    </div>
                  </div>
                  <Badge className={`rounded-none text-[8px] font-black uppercase tracking-widest border-none px-2 h-5 flex items-center justify-center ${rencana.status === 'berjalan' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                    {rencana.status === 'berjalan' ? 'ON-GOING' : 'SCHEDULED'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="grid grid-cols-3 gap-2 mb-6">
                  <div className="p-3 rounded-none bg-slate-50 border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">LUAS AREA</p>
                    <p className="text-xs font-black text-slate-900 mt-1 uppercase">{rencana.luasHa.toLocaleString()} HA</p>
                  </div>
                  <div className="p-3 rounded-none bg-slate-50 border border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">MUSIM</p>
                    <p className="text-xs font-black text-slate-900 mt-1 uppercase">{rencana.musim}</p>
                  </div>
                  <div className="p-3 rounded-none bg-emerald-50 border border-emerald-100">
                    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">EST. PANEN</p>
                    <p className="text-xs font-black text-emerald-700 mt-1 uppercase">{(rencana.estimasiHasil / 1000).toFixed(1)}K TON</p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-slate-400">
                      <CalendarIcon className="h-3 w-3" />
                      <span className="text-[10px] font-black uppercase tracking-widest">{rencana.tanggalMulai} — {rencana.tanggalPanen}</span>
                    </div>
                    <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">{rencana.progress}% PROGRESS</span>
                  </div>
                  <Progress value={rencana.progress} className="h-1.5 bg-slate-100 rounded-none" />
                </div>

                <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-50">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-3 w-3 text-slate-400" />
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{rencana.desa} • {rencana.koperasi}</span>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => handleAction(`Detail ${rencana.id}`)}
                    className="h-8 rounded-none text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 p-0"
                  >
                    Detail Rencana
                    <ChevronRight className="ml-1.5 h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="rounded-none border-none shadow-xl overflow-hidden border-t-4 border-t-slate-900">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-none hover:bg-slate-200">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <CardTitle className="text-base font-black uppercase tracking-widest text-slate-900">AGUSTUS 2026</CardTitle>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-none hover:bg-slate-200">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
              <Badge variant="outline" className="rounded-none border-emerald-200 bg-emerald-50 text-emerald-700 text-[8px] font-black uppercase tracking-widest h-5">3 Proyeksi Panen</Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-100/50">
              {['SEN', 'SEL', 'RAB', 'KAM', 'JUM', 'SAB', 'MIN'].map(day => (
                <div key={day} className="py-2 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest border-r border-slate-200 last:border-none">
                  {day}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 auto-rows-[120px]">
              {days.map(day => {
                const hasPanen = day === 15 || day === 20 || day === 25
                return (
                  <div key={day} className={`p-2 border-r border-b border-slate-100 relative group hover:bg-slate-50 transition-colors ${day > 28 ? 'bg-slate-50/30' : ''}`}>
                    <span className="text-[10px] font-black text-slate-400">{day}</span>
                    {hasPanen && (
                      <div className="mt-2 space-y-1">
                        <div className="p-1.5 bg-emerald-600 text-white text-[9px] font-black uppercase tracking-tighter truncate rounded-none shadow-sm cursor-pointer hover:bg-emerald-700">
                          {day === 15 ? 'PANEN PADI IR64' : day === 20 ? 'PANEN KENTANG' : 'EST. CABAI'}
                        </div>
                        {day === 15 && (
                          <div className="p-1.5 bg-slate-900 text-white text-[9px] font-black uppercase tracking-tighter truncate rounded-none shadow-sm cursor-pointer hover:bg-slate-800">
                            MT1 LOGISTIK
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )
              })}
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={`pad-${i}`} className="p-2 border-r border-b border-slate-50 bg-slate-50/20" />
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
