'use client'

import { useState, useMemo } from 'react'
import {
  Package,
  TrendingUp,
  Users,
  Warehouse,
  ArrowRight,
  Plus,
  Target,
  BarChart3,
  Calendar,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { KementerianFilterBar } from '@/components/dashboard/kementerian-filter-bar'
import { ScopeFilters } from '@/lib/kementerian-dashboard-data'
import { toast } from 'sonner'

const baseAgregasiData = [
  {
    id: 'AGR001',
    komoditas: 'Beras Premium',
    target: 5000000,
    terkumpul: 3500000,
    satuan: 'kg',
    kontributor: 850,
    gudang: 'Gudang Utama Nasional',
    deadline: '2026-05-28',
    buyer: 'Bulog / Retail Center',
    hargaTarget: 14000,
    status: 'berjalan',
  },
  {
    id: 'AGR002',
    komoditas: 'Jagung Pipil',
    target: 3000000,
    terkumpul: 3000000,
    satuan: 'kg',
    kontributor: 520,
    gudang: 'Gudang Utama Nasional',
    deadline: '2026-05-25',
    buyer: 'Industri Pakan Ternak',
    hargaTarget: 5500,
    status: 'selesai',
  },
  {
    id: 'AGR003',
    komoditas: 'Kentang Dieng',
    target: 2000000,
    terkumpul: 1200000,
    satuan: 'kg',
    kontributor: 340,
    gudang: 'Pusat Cold Storage',
    deadline: '2026-06-05',
    buyer: 'Jejaring Supermarket',
    hargaTarget: 15000,
    status: 'berjalan',
  },
  {
    id: 'AGR004',
    komoditas: 'Cabai Merah Keriting',
    target: 500000,
    terkumpul: 150000,
    satuan: 'kg',
    kontributor: 210,
    gudang: 'Pusat Cold Storage',
    deadline: '2026-06-10',
    buyer: 'Pasar Induk Nasional',
    hargaTarget: 45000,
    status: 'berjalan',
  },
]

export default function AgregasiPage() {
  const [filters, setFilters] = useState<ScopeFilters>({
    provinceId: 'all',
    regionId: 'all',
    villageId: 'all',
    cooperativeId: 'all',
    commodityId: 'all',
  })
  const [search, setSearch] = useState('')

  const scaleFactor = useMemo(() => {
    if (filters.cooperativeId !== 'all') return 0.05
    if (filters.villageId !== 'all') return 0.1
    if (filters.regionId !== 'all') return 0.25
    if (filters.provinceId !== 'all') return 0.5
    return 1.0
  }, [filters])

  const agregasiData = useMemo(() => {
    return baseAgregasiData.map(item => ({
      ...item,
      target: Math.round(item.target * scaleFactor),
      terkumpul: Math.round(item.terkumpul * scaleFactor),
      kontributor: Math.round(item.kontributor * scaleFactor),
    })).filter(item => 
      item.komoditas.toLowerCase().includes(search.toLowerCase()) ||
      item.buyer.toLowerCase().includes(search.toLowerCase())
    )
  }, [scaleFactor, search])

  const totalTarget = agregasiData.reduce((acc, a) => acc + a.target, 0)
  const totalTerkumpul = agregasiData.reduce((acc, a) => acc + a.terkumpul, 0)
  const totalNilai = agregasiData.reduce((acc, a) => acc + (a.terkumpul * a.hargaTarget), 0)

  const handleAction = (action: string) => {
    toast.success(`Aksi ${action} berhasil dijalankan`)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 uppercase">Pusat Agregasi Komoditas</h1>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">
            Monitoring Konsolidasi Hasil Panen Strategis Nasional
          </p>
        </div>
        <Button 
          size="sm" 
          onClick={() => handleAction('Buat Agregasi')}
          className="h-10 rounded-none bg-slate-900 text-white hover:bg-slate-800 text-[10px] font-black uppercase tracking-widest px-6"
        >
          <Plus className="mr-2 h-4 w-4" />
          Buat Agregasi Baru
        </Button>
      </div>

      <KementerianFilterBar 
        filters={filters} 
        setFilters={setFilters} 
        search={search} 
        setSearch={setSearch} 
      />

      {/* Summary Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: 'BATCH AKTIF', value: agregasiData.filter(a => a.status === 'berjalan').length.toString(), sub: 'PENGUMPULAN BERJALAN', icon: Target, tone: 'emerald' },
          { label: 'TARGET AGREGASI', value: `${(totalTarget / 1000).toLocaleString()} TON`, sub: 'VOLUME KONSOLIDASI', icon: BarChart3, tone: 'slate' },
          { label: 'TOTAL TERKUMPUL', value: `${(totalTerkumpul / 1000).toLocaleString()} TON`, sub: `${totalTarget > 0 ? ((totalTerkumpul / totalTarget) * 100).toFixed(0) : 0}% PROGRESS`, icon: Package, tone: 'emerald' },
          { label: 'VALUASI BATCH', value: `RP ${(totalNilai / 1000000000).toFixed(1)} M`, sub: 'ESTIMASI NILAI EKONOMI', icon: TrendingUp, tone: 'emerald' },
        ].map((stat, i) => (
          <Card key={i} className="rounded-none border-none bg-white shadow-sm overflow-hidden group">
            <div className={`h-1.5 w-full ${stat.tone === 'emerald' ? 'bg-emerald-500' : 'bg-slate-900'}`} />
            <CardHeader className="p-4 pb-2">
              <div className="flex justify-between items-start">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{stat.label}</p>
                <stat.icon className={`h-4 w-4 ${stat.tone === 'emerald' ? 'text-emerald-500' : 'text-slate-900'}`} />
              </div>
              <CardTitle className="text-2xl font-black text-slate-900 mt-1">{stat.value}</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              {stat.label === 'TOTAL TERKUMPUL' ? (
                <div className="space-y-1.5">
                  <Progress value={totalTarget > 0 ? (totalTerkumpul / totalTarget) * 100 : 0} className="h-1 bg-slate-100 rounded-none" />
                  <p className="text-[10px] font-black text-emerald-600 uppercase tracking-tighter">{stat.sub}</p>
                </div>
              ) : (
                <p className="text-[10px] font-black text-slate-500 mt-1 uppercase tracking-tighter">{stat.sub}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Agregasi List */}
      <div className="space-y-4">
        <h2 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Daftar Batch Pengumpulan Nasional</h2>
        {agregasiData.map((agregasi) => {
          const progress = (agregasi.terkumpul / agregasi.target) * 100
          
          return (
            <Card key={agregasi.id} className="rounded-none border-none shadow-sm overflow-hidden hover:shadow-md transition-all group border-t-4 border-t-emerald-500">
              <CardContent className="p-0">
                <div className="flex flex-col lg:flex-row">
                  <div className="flex-1 p-6">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                      <div className="flex items-start gap-4">
                        <div className="h-12 w-12 rounded-none bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200">
                          <Package className="h-6 w-6 text-slate-900" />
                        </div>
                        <div>
                          <div className="flex items-center gap-3">
                            <h3 className="text-lg font-black text-slate-900 uppercase tracking-tight">{agregasi.komoditas}</h3>
                            <Badge className={`rounded-none text-[10px] font-black tracking-widest px-2 py-0.5 border-none ${
                              agregasi.status === 'selesai' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                            }`}>
                              {agregasi.status === 'selesai' ? 'CLOSED' : 'OPEN'}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 mt-2">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">BUYER STRATEGIS:</p>
                            <p className="text-xs font-bold text-slate-900 uppercase">{agregasi.buyer}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <Calendar className="h-3.5 w-3.5" />
                          <p className="text-[10px] font-black uppercase tracking-widest">Deadline Pengiriman</p>
                        </div>
                        <p className="text-sm font-black text-slate-900">{agregasi.deadline}</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Pencapaian Volume Agregat</span>
                        <span className="text-sm font-black text-slate-900">
                          {agregasi.terkumpul.toLocaleString()} / {agregasi.target.toLocaleString()} {agregasi.satuan.toUpperCase()}
                        </span>
                      </div>
                      <Progress value={progress} className="h-2 bg-slate-100 rounded-none" />
                      <div className="flex justify-between items-center">
                         <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{progress.toFixed(0)}% Kapasitas Terpenuhi</p>
                         <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1.5">
                              <Users className="h-3.5 w-3.5 text-slate-400" />
                              <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{agregasi.kontributor} PRODUSEN AKTIF</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Warehouse className="h-3.5 w-3.5 text-slate-400" />
                              <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{agregasi.gudang.toUpperCase()}</span>
                            </div>
                         </div>
                      </div>
                    </div>
                  </div>

                  <div className="lg:w-64 bg-slate-50 p-6 flex flex-col items-center justify-center border-t lg:border-t-0 lg:border-l border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Nilai Agregasi Batch</p>
                    <p className="text-3xl font-black text-slate-900">
                      Rp {((agregasi.terkumpul * agregasi.hargaTarget) / 1000000).toFixed(1)} JT
                    </p>
                    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest mt-1">
                      Harga Acuan: Rp {agregasi.hargaTarget.toLocaleString()}/{agregasi.satuan}
                    </p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleAction(`Kelola ${agregasi.komoditas}`)}
                      className="mt-6 w-full h-10 rounded-none text-[10px] font-black uppercase tracking-widest border-slate-200 text-slate-600 hover:bg-slate-900 hover:text-white transition-all"
                    >
                      Kelola Kontribusi
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

