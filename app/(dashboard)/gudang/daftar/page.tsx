'use client'

import { useState, useMemo } from 'react'
import {
  Plus,
  Warehouse,
  Thermometer,
  MapPin,
  Settings,
  Globe,
  TrendingUp,
  ShieldAlert,
  Download,
  FileText,
  Activity,
  Layers,
  ArrowRight,
  Search,
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/lib/auth/use-auth'
import {
  type ScopeFilters,
} from '@/lib/kementerian-dashboard-data'
import { KementerianFilterBar } from '@/components/dashboard/kementerian-filter-bar'
import { warehouses } from '@/lib/data'
import { toast } from 'sonner'

export default function DaftarGudangPage() {
  const { user } = useAuth()
  const isKementerian = user?.role === 'kementerian'
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState<ScopeFilters>({
    provinceId: 'all',
    regionId: 'all',
    villageId: 'all',
    cooperativeId: 'all',
    commodityId: 'all',
  })

  const scaleFactor = useMemo(() => {
    if (filters.cooperativeId !== 'all') return 0.05
    if (filters.villageId !== 'all') return 0.1
    if (filters.regionId !== 'all') return 0.25
    if (filters.provinceId !== 'all') return 0.5
    return 1.0
  }, [filters])

  const filteredWarehouses = useMemo(() => {
    return warehouses.filter((warehouse) => {
      const matchesSearch = warehouse.nama.toLowerCase().includes(search.toLowerCase()) || 
                           warehouse.alamat.toLowerCase().includes(search.toLowerCase())
      
      const loc = warehouse.alamat.toUpperCase()
      const matchesProvince = filters.provinceId === 'all' || loc.includes(filters.provinceId)
      const matchesRegion = filters.regionId === 'all' || loc.includes(filters.regionId.split('-')[0].toUpperCase())
      
      return matchesSearch && matchesProvince && matchesRegion
    }).map(w => ({
      ...w,
      kapasitas: w.kapasitas * scaleFactor,
      kapasitasTerpakai: w.kapasitasTerpakai * scaleFactor
    }))
  }, [search, filters, scaleFactor])

  const stats = useMemo(() => {
    const totalCapacity = filteredWarehouses.reduce((sum, w) => sum + w.kapasitas, 0)
    const totalUsed = filteredWarehouses.reduce((sum, w) => sum + w.kapasitasTerpakai, 0)
    const coldStorageCount = filteredWarehouses.filter(w => w.tipe === 'cold-storage').length
    const occupancyRate = totalCapacity > 0 ? (totalUsed / totalCapacity) * 100 : 0
    
    return {
      count: filteredWarehouses.length,
      totalCapacity,
      totalUsed,
      coldStorageCount,
      occupancyRate
    }
  }, [filteredWarehouses])

  const handleAction = (action: string) => {
    toast.success(`Aksi ${action} berhasil diverifikasi secara nasional`)
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-none bg-slate-900 flex items-center justify-center shadow-xl">
            <Warehouse className="h-7 w-7 text-emerald-500" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Pusat Inventaris Nasional</h1>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">
              Monitoring Agregat Kapasitas Penyimpanan • {stats.count} Simpul Strategis Terdaftar
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
           <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleAction('Audit Stok')}
            className="h-10 rounded-none text-[10px] font-black uppercase tracking-widest text-slate-600 border-slate-200"
          >
            <ShieldAlert className="h-4 w-4 mr-2 text-rose-600" />
            Audit Stok
          </Button>
          <Button 
            size="sm" 
            onClick={() => handleAction('PDF')}
            className="h-10 rounded-none bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-black uppercase tracking-widest px-6 shadow-lg shadow-slate-200"
          >
            <Download className="h-4 w-4 mr-2" />
            Eksport PDF
          </Button>
        </div>
      </div>

      <KementerianFilterBar filters={filters} setFilters={setFilters} />

      {/* High-Density KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'TOTAL FASILITAS', value: stats.count.toLocaleString(), sub: 'UNIT GUDANG AKTIF', icon: Warehouse, color: 'text-slate-900' },
          { label: 'TOTAL KAPASITAS', value: (stats.totalCapacity / 1000).toLocaleString(), sub: 'METRIC TON (MT)', icon: Layers, color: 'text-blue-600' },
          { label: 'TINGKAT OKUPANSI', value: stats.occupancyRate.toFixed(1), sub: '% TOTAL TERISI', icon: TrendingUp, color: 'text-emerald-600' },
          { label: 'COLD STORAGE', value: stats.coldStorageCount.toLocaleString(), sub: 'UNIT TERVERIFIKASI', icon: Thermometer, color: 'text-blue-400' },
        ].map((s, i) => (
          <Card key={i} className="rounded-none border-none shadow-sm bg-white overflow-hidden">
            <div className={`h-1.5 w-full ${s.color.includes('emerald') ? 'bg-emerald-500' : s.color.includes('blue') ? 'bg-blue-500' : 'bg-slate-900'}`} />
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-10 w-10 rounded-none bg-slate-50 flex items-center justify-center border border-slate-100">
                <s.icon className={`h-5 w-5 ${s.color}`} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.label}</p>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className={`text-xl font-black ${s.color}`}>{s.value}</span>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">{s.sub}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search & Action Bar */}
      <Card className="rounded-none border-none shadow-sm bg-slate-50/50">
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="CARI NAMA GUDANG ATAU ALAMAT STRATEGIS..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="rounded-none pl-9 bg-white border-slate-200 h-11 text-[10px] font-black uppercase tracking-widest focus:ring-slate-900"
              />
            </div>
            {!isKementerian && (
              <Button className="rounded-none h-11 bg-slate-900 text-white font-black text-[10px] uppercase tracking-widest px-6 shadow-lg">
                <Plus className="h-4 w-4 mr-2" /> TAMBAH GUDANG
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Warehouse Grid - High Density Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredWarehouses.map((warehouse) => {
          const usagePercent = Math.round(
            (warehouse.kapasitasTerpakai / warehouse.kapasitas) * 100
          )
          return (
            <Card key={warehouse.id} className="group rounded-none border-none shadow-sm hover:shadow-md transition-all duration-300 bg-white overflow-hidden border-t-4 border-t-slate-900">
               <div className="p-5 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                       <div className={`h-10 w-10 rounded-none flex items-center justify-center shadow-inner border border-slate-100 ${
                         warehouse.tipe === 'cold-storage' ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-600'
                       }`}>
                         <Warehouse className="h-5 w-5" />
                       </div>
                       <div className="min-w-0">
                          <CardTitle className="text-sm font-black text-slate-900 uppercase tracking-tight truncate leading-tight max-w-[140px]">
                            {warehouse.nama}
                          </CardTitle>
                          <div className="flex items-center gap-1.5 mt-1">
                             <MapPin className="h-3 w-3 text-slate-400" />
                             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest truncate max-w-[120px]">{warehouse.alamat}</span>
                          </div>
                       </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => handleAction('Settings')}
                      className="h-8 w-8 rounded-none text-slate-400 hover:text-slate-900"
                    >
                       <Settings className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-2">
                    <Badge className={`rounded-none h-5 text-[8px] font-black uppercase tracking-widest px-2 border-none ${
                      warehouse.tipe === 'cold-storage' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {warehouse.tipe}
                    </Badge>
                    <Badge className={`rounded-none h-5 text-[8px] font-black uppercase tracking-widest px-2 border-none ${
                      warehouse.status === 'aktif' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                    }`}>
                      {warehouse.status}
                    </Badge>
                  </div>

                  {warehouse.suhu && (
                    <div className="flex items-center justify-between p-3 rounded-none bg-blue-50/50 border border-blue-100">
                       <div className="flex items-center gap-2">
                         <Thermometer className="h-4 w-4 text-blue-600" />
                         <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Core Temp</span>
                       </div>
                       <span className="text-xl font-black text-blue-700">{warehouse.suhu}°C</span>
                    </div>
                  )}

                  <div className="space-y-2 pt-2">
                     <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                        <span className="text-slate-400">LOAD FACTOR</span>
                        <span className={usagePercent > 85 ? 'text-rose-600' : 'text-slate-900'}>{usagePercent}%</span>
                     </div>
                     <Progress
                        value={usagePercent}
                        className="h-1.5 bg-slate-50 rounded-none"
                      />
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <div className="p-3 rounded-none bg-slate-900 text-white flex flex-col items-center justify-center shadow-lg">
                       <p className="text-lg font-black uppercase tracking-tight">{(warehouse.kapasitasTerpakai / 1000).toFixed(1)}</p>
                       <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest mt-1 text-center leading-none">TON TERPAKAI</p>
                    </div>
                    <div className="p-3 rounded-none bg-slate-50 border border-slate-100 flex flex-col items-center justify-center">
                       <p className="text-lg font-black uppercase tracking-tight text-slate-900">
                         {((warehouse.kapasitas - warehouse.kapasitasTerpakai) / 1000).toFixed(1)}
                       </p>
                       <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mt-1 text-center leading-none">TON VACANT</p>
                    </div>
                  </div>
               </div>
               
               <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 group-hover:bg-slate-900 transition-colors flex items-center justify-between">
                  <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest group-hover:text-slate-500">System Sync: OK</span>
                  <Button 
                    variant="ghost" 
                    onClick={() => handleAction(`Audit ${warehouse.nama}`)}
                    className="h-6 px-2 text-[8px] font-black uppercase tracking-widest text-slate-900 group-hover:text-white"
                  >
                    LIHAT AUDIT <ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
               </div>
            </Card>
          )
        })}
      </div>

      {filteredWarehouses.length === 0 && (
        <Card className="rounded-none border-dashed py-24 bg-slate-50/50">
          <CardContent className="flex flex-col items-center justify-center text-center">
            <div className="h-20 w-20 rounded-none bg-slate-100 flex items-center justify-center mb-6 text-slate-300">
              <Warehouse className="h-10 w-10" />
            </div>
            <h3 className="text-xl font-black text-slate-900 uppercase">Gudang Tidak Ditemukan</h3>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-2">Silakan sesuaikan filter wilayah atau kata kunci pencarian kementerian.</p>
            <Button 
              variant="link" 
              onClick={() => {
                setSearch('')
                setFilters({ provinceId: 'all', regionId: 'all', villageId: 'all', cooperativeId: 'all', commodityId: 'all' })
              }}
              className="mt-6 text-[10px] font-black uppercase tracking-widest text-emerald-600"
            >
              Reset Semua Filter
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Global Capacity Risk Banner */}
      <Card className="rounded-none alert-surface-banner border-none overflow-hidden relative cursor-pointer" onClick={() => handleAction('Relokasi Stok')}>
        <div className="alert-surface-watermark absolute top-0 right-0 p-6">
          <ShieldAlert className="h-32 w-32" />
        </div>
        <CardContent className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-8 relative">
          <div className="flex items-center gap-6">
             <div className="alert-surface-icon flex h-14 w-14 items-center justify-center rounded-none shrink-0 border border-white/20">
                <Activity className="h-7 w-7" />
             </div>
             <div>
                <div className="flex items-center gap-3">
                   <Badge className="rounded-none alert-surface-chip h-5 px-2 text-[10px] font-black uppercase tracking-widest">KAPASITAS KRITIS</Badge>
                   <span className="alert-surface-meta text-xs font-black uppercase tracking-widest">OKUPANSI MELEBIHI 92% (LINGKUP JAWA BARAT)</span>
                </div>
                <p className="alert-surface-copy mt-2 text-lg font-black uppercase tracking-tight">Anomali terdeteksi: Kapasitas penyimpanan di regional Jawa Barat mendekati batas kritis nasional.</p>
             </div>
          </div>
          <Button className="rounded-none alert-surface-action h-12 px-10 text-[10px] font-black uppercase tracking-widest">
             Jalankan Relokasi Stok
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

