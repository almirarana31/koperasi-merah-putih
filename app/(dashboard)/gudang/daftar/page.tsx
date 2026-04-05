'use client'

import Link from 'next/link'
import { useState } from 'react'
import {
  ArrowLeft,
  Plus,
  Warehouse,
  Thermometer,
  MapPin,
  Settings,
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
import { useAuth } from '@/lib/auth/use-auth'
import {
  KEMENTERIAN_DASHBOARD_DATA,
  type ScopeFilters,
} from '@/lib/kementerian-dashboard-data'
import { KementerianFilterBar } from '@/components/dashboard/kementerian-filter-bar'
import { ExportButton } from '@/components/dashboard/export-button'
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

  const filteredWarehouses = warehouses.filter((warehouse) => {
    const matchesSearch = warehouse.nama.toLowerCase().includes(search.toLowerCase()) || 
                         warehouse.alamat.toLowerCase().includes(search.toLowerCase())
    
    if (isKementerian) {
      // Mapping warehouse address to regional filters (heuristic)
      const matchesProvince = filters.provinceId === 'all' || warehouse.alamat.toUpperCase().includes(filters.provinceId)
      const matchesRegion = filters.regionId === 'all' || warehouse.alamat.toUpperCase().includes(filters.regionId.split('-')[0])
      
      return matchesSearch && matchesProvince && matchesRegion
    }

    return matchesSearch
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/gudang">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 uppercase">Daftar Gudang</h1>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mt-1">
              Kelola lokasi penyimpanan komoditas strategis
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {isKementerian && (
            <ExportButton
              title="Daftar Gudang Nasional"
              filename="KOPDES_Inventory_Gudang"
              data={filteredWarehouses.map(w => ({
                'Nama': w.nama,
                'Tipe': w.tipe,
                'Alamat': w.alamat,
                'Kapasitas (kg)': w.kapasitas,
                'Terpakai (kg)': w.kapasitasTerpakai,
                'Suhu': w.suhu ? `${w.suhu}°C` : '-',
                'Status': w.status
              }))}
            />
          )}
          <Button size="sm" className="h-8 bg-slate-900 text-white hover:bg-slate-800 text-[10px] font-black uppercase tracking-widest">
            <Plus className="mr-2 h-3.5 w-3.5" />
            Tambah
          </Button>
        </div>
      </div>

      {isKementerian && (
        <div className="mb-4">
          <KementerianFilterBar
            filters={filters}
            setFilters={setFilters}
            search={search}
            setSearch={setSearch}
            showCommodity={false}
          />
        </div>
      )}

      {/* Warehouse Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredWarehouses.map((warehouse) => {
          const usagePercent = Math.round(
            (warehouse.kapasitasTerpakai / warehouse.kapasitas) * 100
          )
          return (
            <Card key={warehouse.id} className="relative overflow-hidden border-none shadow-[0_4px_12px_-4px_rgba(0,0,0,0.05)] transition-all hover:shadow-md">
              <div
                className={`absolute left-0 top-0 h-1 w-full ${
                  usagePercent > 80
                    ? 'bg-rose-500'
                    : usagePercent > 60
                    ? 'bg-amber-500'
                    : 'bg-emerald-500'
                }`}
              />
              <CardHeader className="p-4 pb-2">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                        warehouse.tipe === 'cold-storage'
                          ? 'bg-blue-50 text-blue-600'
                          : 'bg-slate-50 text-slate-600'
                      }`}
                    >
                      <Warehouse className="h-5 w-5" />
                    </div>
                    <div>
                      <CardTitle className="text-sm font-black text-slate-900 uppercase truncate max-w-[150px]">{warehouse.nama}</CardTitle>
                      <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 mt-0.5 uppercase tracking-tighter">
                        <MapPin className="h-2.5 w-2.5" />
                        {warehouse.alamat}
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Badge variant="secondary" className="text-[9px] font-black uppercase bg-slate-100 text-slate-600 border-none">
                    {warehouse.tipe === 'cold-storage' ? 'COLD STORAGE' : 'REGULER'}
                  </Badge>
                  <Badge className={`text-[9px] font-black uppercase border-none ${warehouse.status === 'aktif' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                    {warehouse.status === 'aktif' ? 'AKTIF' : 'MAIN'}
                  </Badge>
                </div>

                {warehouse.suhu && (
                  <div className="flex items-center gap-2 rounded-xl bg-blue-50/50 p-3 border border-blue-100">
                    <Thermometer className="h-4 w-4 text-blue-600" />
                    <div>
                      <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Suhu Ruangan</p>
                      <p className="text-xl font-black text-blue-700 tracking-tighter">
                        {warehouse.suhu}°C
                      </p>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                    <span>Kapasitas Terpakai</span>
                    <span className="text-slate-900">{usagePercent}%</span>
                  </div>
                  <Progress
                    value={usagePercent}
                    className={`h-1.5 bg-slate-100 ${
                      usagePercent > 80
                        ? '[&>div]:bg-rose-500'
                        : usagePercent > 60
                        ? '[&>div]:bg-amber-500'
                        : '[&>div]:bg-emerald-500'
                    }`}
                  />
                  <div className="flex justify-between text-[9px] font-bold text-slate-400 uppercase tracking-tighter">
                    <span>{warehouse.kapasitasTerpakai.toLocaleString()} KG TERPAKAI</span>
                    <span>{warehouse.kapasitas.toLocaleString()} KG TOTAL</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="rounded-xl bg-slate-50 p-3 text-center border border-slate-100">
                    <p className="text-lg font-black text-slate-900 tracking-tighter">
                      {(warehouse.kapasitas - warehouse.kapasitasTerpakai).toLocaleString()}
                    </p>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Kg Tersedia</p>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-3 text-center border border-slate-100">
                    <p className="text-lg font-black text-slate-900 tracking-tighter">
                      {warehouse.kapasitasTerpakai.toLocaleString()}
                    </p>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Kg Terisi</p>
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
