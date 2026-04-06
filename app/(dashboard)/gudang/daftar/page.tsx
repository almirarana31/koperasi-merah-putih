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

  const filteredWarehouses = useMemo(() => {
    return warehouses.filter((warehouse) => {
      const matchesSearch = warehouse.nama.toLowerCase().includes(search.toLowerCase()) || 
                           warehouse.alamat.toLowerCase().includes(search.toLowerCase())
      
      // Hierarchical Filter Simulation
      const loc = warehouse.alamat.toUpperCase()
      const matchesProvince = filters.provinceId === 'all' || loc.includes(filters.provinceId)
      const matchesRegion = filters.regionId === 'all' || loc.includes(filters.regionId.split('-')[0].toUpperCase())
      
      return matchesSearch && matchesProvince && matchesRegion
    })
  }, [search, filters])

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

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-slate-900 flex items-center justify-center shadow-xl">
            <Warehouse className="h-6 w-6 text-emerald-500" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold  text-slate-900 ">National Inventory Hub</h1>
            <p className="text-xs font-bold text-slate-500   mt-1">
              Monitoring Agregat Kapasitas Penyimpanan • {stats.count} Titik Strategis Terdaftar
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
           <Button variant="outline" size="sm" className="h-10 text-xs font-semibold   text-slate-600 border-slate-200">
            <ShieldAlert className="h-4 w-4 mr-2 text-rose-600" />
            Stock Audit
          </Button>
          <Button size="sm" className="h-10 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold   px-6 shadow-lg shadow-slate-200">
            <Download className="h-4 w-4 mr-2" />
            Inventory PDF
          </Button>
        </div>
      </div>

      {/* Kementerian Hierarchical Filter Bar */}
      <KementerianFilterBar filters={filters} setFilters={setFilters} />

      {/* High-Density KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Fasilitas', value: stats.count.toLocaleString(), sub: 'Gudang', icon: Warehouse, color: 'text-slate-900' },
          { label: 'Total Kapasitas', value: (stats.totalCapacity / 1000).toFixed(1), sub: 'Metric Ton', icon: Layers, color: 'text-blue-600' },
          { label: 'Tingkat Okupansi', value: stats.occupancyRate.toFixed(1), sub: '% Terisi', icon: TrendingUp, color: 'text-emerald-600' },
          { label: 'Cold Storage', value: stats.coldStorageCount.toLocaleString(), sub: 'Unit Aktif', icon: Thermometer, color: 'text-blue-400' },
        ].map((s, i) => (
          <Card key={i} className="border-none shadow-sm bg-white overflow-hidden">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg bg-slate-50 flex items-center justify-center">
                <s.icon className={`h-5 w-5 ${s.color}`} />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400  ">{s.label}</p>
                <div className="flex items-baseline gap-1">
                  <span className={`text-xl font-semibold  ${s.color}`}>{s.value}</span>
                  <span className="text-xs font-bold text-slate-500 ">{s.sub}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search & Action Bar */}
      <Card className="border-none shadow-sm bg-slate-50/50">
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="CARI NAMA GUDANG ATAU ALAMAT..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-white border-slate-200 h-11 text-sm font-bold   focus:ring-slate-900"
              />
            </div>
            {!isKementerian && (
              <Button className="h-11 bg-slate-900 text-white font-semibold text-xs   px-6 shadow-lg">
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
            <Card key={warehouse.id} className="group border-none shadow-sm hover:shadow-xl transition-all duration-300 bg-white overflow-hidden border-t-4 border-t-slate-900">
               <div className="p-5 space-y-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                       <div className={`h-10 w-10 rounded-xl flex items-center justify-center shadow-inner ${
                         warehouse.tipe === 'cold-storage' ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-600'
                       }`}>
                         <Warehouse className="h-5 w-5" />
                       </div>
                       <div className="min-w-0">
                          <CardTitle className="text-xs font-semibold text-slate-900  truncate leading-tight  max-w-[140px]">
                            {warehouse.nama}
                          </CardTitle>
                          <div className="flex items-center gap-1.5 mt-1">
                             <MapPin className="h-2.5 w-2.5 text-slate-400" />
                             <span className="text-xs font-bold text-slate-400  truncate max-w-[120px]">{warehouse.alamat}</span>
                          </div>
                       </div>
                    </div>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-900">
                       <Settings className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-2">
                    <Badge className={`h-5 text-xs font-semibold  px-2 rounded border-none ${
                      warehouse.tipe === 'cold-storage' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-700'
                    }`}>
                      {warehouse.tipe}
                    </Badge>
                    <Badge className={`h-5 text-xs font-semibold  px-2 rounded border-none ${
                      warehouse.status === 'aktif' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                    }`}>
                      {warehouse.status}
                    </Badge>
                  </div>

                  {warehouse.suhu && (
                    <div className="flex items-center justify-between p-3 rounded-xl bg-blue-50/50 border border-blue-100">
                       <div className="flex items-center gap-2">
                         <Thermometer className="h-4 w-4 text-blue-600" />
                         <span className="text-xs font-semibold text-blue-400  ">Core Temp</span>
                       </div>
                       <span className="text-xl font-semibold text-blue-700 ">{warehouse.suhu}°C</span>
                    </div>
                  )}

                  <div className="space-y-2.5 pt-2">
                     <div className="flex items-center justify-between text-xs font-semibold  ">
                        <span className="text-slate-400">Load Factor</span>
                        <span className={usagePercent > 85 ? 'text-rose-600' : 'text-slate-900'}>{usagePercent}%</span>
                     </div>
                     <Progress
                        value={usagePercent}
                        className={`h-1.5 bg-slate-50 ${
                          usagePercent > 85 ? '[&>div]:bg-rose-600' : usagePercent > 65 ? '[&>div]:bg-amber-500' : '[&>div]:bg-emerald-500'
                        }`}
                      />
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-2">
                    <div className="p-3 rounded-xl bg-slate-900 text-white flex flex-col items-center justify-center shadow-lg">
                       <p className="text-lg font-semibold ">{(warehouse.kapasitasTerpakai / 1000).toFixed(1)}</p>
                       <p className="text-xs font-semibold text-slate-500   mt-0.5">TON TERPAKAI</p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex flex-col items-center justify-center">
                       <p className="text-lg font-semibold text-slate-900 ">
                         {((warehouse.kapasitas - warehouse.kapasitasTerpakai) / 1000).toFixed(1)}
                       </p>
                       <p className="text-xs font-semibold text-slate-400   mt-0.5">TON VACANT</p>
                    </div>
                  </div>
               </div>
               
               <div className="px-5 py-3 bg-slate-50 border-t border-slate-100 group-hover:bg-slate-900 transition-colors flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400   group-hover:text-slate-500">System Sync: OK</span>
                  <Button variant="ghost" className="h-6 px-2 text-xs font-semibold text-slate-900 group-hover:text-white  ">
                    LIHAT AUDIT <ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
               </div>
            </Card>
          )
        })}
      </div>

      {filteredWarehouses.length === 0 && (
        <Card className="border-dashed py-24 bg-slate-50/50">
          <CardContent className="flex flex-col items-center justify-center text-center">
            <div className="h-20 w-20 rounded-full bg-slate-100 flex items-center justify-center mb-6 text-slate-300">
              <Warehouse className="h-10 w-10" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900 ">Gudang Tidak Ditemukan</h3>
            <p className="text-xs font-bold text-slate-500   mt-2">Silakan sesuaikan filter wilayah atau kata kunci pencarian.</p>
            <Button 
              variant="link" 
              onClick={() => {
                setSearch('')
                setFilters({ provinceId: 'all', regionId: 'all', villageId: 'all', cooperativeId: 'all', commodityId: 'all' })
              }}
              className="mt-6 text-xs font-semibold  text-emerald-600"
            >
              Reset Semua Filter
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Global Capacity Risk Banner */}
      <Card className="bg-rose-600 border-none overflow-hidden relative shadow-2xl shadow-rose-100">
        <div className="absolute top-0 right-0 p-6 opacity-10">
          <ShieldAlert className="h-32 w-32 text-white" />
        </div>
        <CardContent className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-8 relative">
          <div className="flex items-center gap-6">
             <div className="h-14 w-14 rounded-2xl bg-white/20 border border-white/10 flex items-center justify-center shrink-0">
                <Activity className="h-7 w-7 text-white animate-pulse" />
             </div>
             <div>
                <div className="flex items-center gap-3">
                   <Badge className="bg-white text-rose-600 font-semibold text-xs px-2 h-5 border-none">CRITICAL CAPACITY</Badge>
                   <span className="text-xs font-semibold text-rose-100  ">Usage Exceeds 92% (Jawa Barat)</span>
                </div>
                <p className="text-white text-base font-semibold  mt-2 ">Anomali Terdeteksi: Kapasitas penyimpanan di regional Jawa Barat mendekati batas kritis.</p>
             </div>
          </div>
          <Button className="h-12 bg-white text-rose-600 hover:bg-slate-100 font-semibold text-sm   px-8 rounded-xl shadow-xl">
             Relokasi Stok →
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
