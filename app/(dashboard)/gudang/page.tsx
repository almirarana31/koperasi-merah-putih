'use client'

import { useState } from 'react'
import Link from 'next/link'
import { AlertTriangle, Package, QrCode, Search, Snowflake, Warehouse } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import { useAuth } from '@/lib/auth/use-auth'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { KementerianFilterBar } from '@/components/dashboard/kementerian-filter-bar'
import { useToast } from '@/components/ui/use-toast'
import {
  filterInventoryByScope,
  getInventoryByCommodity,
  getScopeCaption,
  getWarehousesForInventory,
  resolveOperationalFilters,
} from '@/lib/cross-entity-operations'
import type { ScopeFilters } from '@/lib/kementerian-dashboard-data'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const REFERENCE_DATE = new Date('2026-04-06T00:00:00+07:00')

function formatCurrency(value: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value)
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function badgeTone(value: string) {
  if (value === 'fresh' || value === 'A') return 'bg-emerald-50 text-emerald-700 border-emerald-200'
  if (value === 'good' || value === 'B') return 'bg-amber-50 text-amber-700 border-amber-200'
  return 'bg-rose-50 text-rose-700 border-rose-200'
}

export default function GudangPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const showHierarchyFilter = user?.role === 'kementerian' || user?.role === 'pemda' || user?.role === 'sysadmin'

  const [search, setSearch] = useState('')
  const [warehouseFilter, setWarehouseFilter] = useState('all')
  const [qualityFilter, setQualityFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [filters, setFilters] = useState<ScopeFilters>({
    provinceId: 'all',
    regionId: 'all',
    villageId: 'all',
    cooperativeId: 'all',
    commodityId: 'all',
  })

  const scopedFilters = resolveOperationalFilters(user, filters)
  const inventoryRows = filterInventoryByScope(scopedFilters)
  const warehouses = getWarehousesForInventory(inventoryRows)

  const scaleFactor = filters.provinceId === 'all' ? 1.0 : filters.regionId === 'all' ? 0.4 : 0.1

  const filteredInventory = inventoryRows.filter((item) => {
    const keyword = search.toLowerCase()
    const matchesSearch =
      item.commodityName.toLowerCase().includes(keyword) ||
      item.batchCode.toLowerCase().includes(keyword) ||
      item.cooperativeName.toLowerCase().includes(keyword) ||
      item.villageName.toLowerCase().includes(keyword)
    const matchesWarehouse = warehouseFilter === 'all' || item.warehouseId === warehouseFilter
    const matchesQuality = qualityFilter === 'all' || item.quality === qualityFilter
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter
    return matchesSearch && matchesWarehouse && matchesQuality && matchesStatus
  })

  const filteredWarehouses = warehouses.filter((warehouse) => {
    if (warehouseFilter === 'all') return true
    return warehouse.id === warehouseFilter
  })

  const totalStockKg = filteredInventory.reduce((total, item) => total + item.quantityKg, 0)
  const totalValue = filteredInventory.reduce((total, item) => total + item.quantityKg * item.unitPrice, 0)
  const expiringBatches = filteredInventory.filter((item) => {
    const expiry = new Date(item.expiryDate)
    const diff = (expiry.getTime() - REFERENCE_DATE.getTime()) / (1000 * 60 * 60 * 24)
    return diff >= 0 && diff <= 7
  }).length
  const coldStorageBatches = filteredInventory.filter((item) => item.warehouseType === 'cold').length

  const commoditySeries = getInventoryByCommodity(filteredInventory).map((item) => ({
    name: item.commodity.replace(' Premium', '').toUpperCase(),
    stok: Number(((item.quantityKg * scaleFactor * 100) / 1000).toFixed(1)),
    nilai: Math.round((item.value * scaleFactor * 100) / 1_000_000),
  }))

  const warehouseSeries = filteredWarehouses.map((item) => ({
    name: item.villageName.toUpperCase(),
    utilization: item.utilizationPct,
    batch: item.batchCount,
  }))

  const scaleFactorValue = filters.provinceId === 'all' ? 100 : filters.regionId === 'all' ? 30 : 10

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">MANAJEMEN INVENTARIS NASIONAL</h1>
            <Badge className="h-5 border-none bg-rose-600 text-white text-[9px] font-black px-2 rounded-none tracking-widest">GUDANG LINTAS DESA</Badge>
          </div>
          <p className="text-[10px] font-black text-slate-500 mt-1 uppercase tracking-widest leading-relaxed">
            MONITORING STOK, KAPASITAS, DAN KESEHATAN BATCH UNTUK {getScopeCaption(scopedFilters).toUpperCase()}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="h-9 text-[10px] font-black uppercase tracking-widest border-slate-200 text-slate-600 rounded-none shadow-sm" asChild>
            <Link href="/gudang/traceability">
              <QrCode className="mr-2 h-3.5 w-3.5" />
              LACAK BATCH
            </Link>
          </Button>
          <Button variant="outline" className="h-9 text-[10px] font-black uppercase tracking-widest border-slate-200 text-slate-600 rounded-none shadow-sm" asChild>
            <Link href="/gudang/cold-storage">
              <Snowflake className="mr-2 h-3.5 w-3.5" />
              RANTAI DINGIN
            </Link>
          </Button>
        </div>
      </div>

      {showHierarchyFilter && <KementerianFilterBar filters={filters} setFilters={setFilters} />}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'STOK TERSEDIA', value: ((totalStockKg * scaleFactorValue) / 1000).toLocaleString('id-ID') + ' TON', sub: `${(filteredInventory.length * scaleFactorValue).toLocaleString('id-ID')} BATCH AKTIF`, icon: Package, tone: 'slate' },
          { label: 'NILAI PERSEDIAAN', value: formatCurrency(totalValue * scaleFactorValue), sub: `${filteredWarehouses.length} GUDANG TERHUBUNG`, icon: Warehouse, tone: 'emerald' },
          { label: 'BATCH SEGERA KELUAR', value: (expiringBatches * scaleFactorValue).toLocaleString('id-ID'), sub: 'MASA SIMPAN < 7 HARI', icon: AlertTriangle, tone: 'amber' },
          { label: 'COLD CHAIN AKTIF', value: (coldStorageBatches * scaleFactorValue).toLocaleString('id-ID'), sub: 'MEMERLUKAN RANTAI DINGIN', icon: Snowflake, tone: 'blue' },
        ].map((stat, i) => (
          <Card key={i} className="border-none bg-white shadow-sm overflow-hidden rounded-none">
            <div className={`h-1 w-full border-t-4 ${
              stat.tone === 'emerald' ? 'border-emerald-500' : 
              stat.tone === 'amber' ? 'border-amber-500' : 
              stat.tone === 'blue' ? 'border-blue-500' : 'border-slate-900'
            }`} />
            <CardHeader className="p-4 pb-2">
              <div className="flex justify-between items-start">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{stat.label}</p>
                <stat.icon className={`h-4 w-4 ${
                  stat.tone === 'emerald' ? 'text-emerald-500' : 
                  stat.tone === 'amber' ? 'text-amber-500' : 
                  stat.tone === 'blue' ? 'text-blue-500' : 'text-slate-900'
                }`} />
              </div>
              <CardTitle className="text-xl font-black text-slate-900 mt-1">{stat.value}</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="text-[10px] font-black text-slate-500 mt-1 uppercase tracking-tighter">{stat.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-none bg-white shadow-sm overflow-hidden rounded-none">
        <div className="h-1 w-full bg-slate-900" />
        <CardContent className="p-4">
          <div className="grid gap-3 lg:grid-cols-[1.3fr_repeat(3,220px)]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="CARI BATCH, KOMODITAS, KOPERASI, ATAU DESA..."
                className="pl-9 h-11 text-[10px] font-black uppercase tracking-widest bg-slate-50 border-slate-100 rounded-none focus-visible:ring-slate-900"
              />
            </div>
            <Select value={warehouseFilter} onValueChange={setWarehouseFilter}>
              <SelectTrigger className="h-11 text-[10px] font-black uppercase tracking-widest bg-slate-50 border-slate-100 rounded-none focus:ring-slate-900">
                <SelectValue placeholder="SEMUA GUDANG" />
              </SelectTrigger>
              <SelectContent className="rounded-none">
                <SelectItem value="all" className="text-[10px] font-black uppercase">SEMUA GUDANG</SelectItem>
                {warehouses.map((warehouse) => (
                  <SelectItem key={warehouse.id} value={warehouse.id} className="text-[10px] font-black uppercase">
                    {warehouse.name.toUpperCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={qualityFilter} onValueChange={setQualityFilter}>
              <SelectTrigger className="h-11 text-[10px] font-black uppercase tracking-widest bg-slate-50 border-slate-100 rounded-none focus:ring-slate-900">
                <SelectValue placeholder="SEMUA GRADE" />
              </SelectTrigger>
              <SelectContent className="rounded-none">
                <SelectItem value="all" className="text-[10px] font-black uppercase">SEMUA GRADE</SelectItem>
                <SelectItem value="A" className="text-[10px] font-black uppercase">GRADE A</SelectItem>
                <SelectItem value="B" className="text-[10px] font-black uppercase">GRADE B</SelectItem>
                <SelectItem value="C" className="text-[10px] font-black uppercase">GRADE C</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-11 text-[10px] font-black uppercase tracking-widest bg-slate-50 border-slate-100 rounded-none focus:ring-slate-900">
                <SelectValue placeholder="SEMUA KONDISI" />
              </SelectTrigger>
              <SelectContent className="rounded-none">
                <SelectItem value="all" className="text-[10px] font-black uppercase">SEMUA KONDISI</SelectItem>
                <SelectItem value="fresh" className="text-[10px] font-black uppercase">FRESH</SelectItem>
                <SelectItem value="good" className="text-[10px] font-black uppercase">GOOD</SelectItem>
                <SelectItem value="aging" className="text-[10px] font-black uppercase">AGING</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <Card className="border-none bg-white shadow-sm overflow-hidden rounded-none">
          <div className="h-1 w-full border-t-4 border-slate-900" />
          <CardHeader className="p-4 border-b border-slate-50">
            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-slate-900">KOMPOSISI STOK PER KOMODITAS</CardTitle>
            <CardDescription className="text-[10px] font-bold text-slate-500 mt-0.5 uppercase tracking-tight">ANALISIS VOLUME STOK TERKONSOLIDASI NASIONAL</CardDescription>
          </CardHeader>
          <CardContent className="p-4 h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={commoditySeries}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  tickLine={false} 
                  axisLine={false}
                  fontSize={9}
                  tick={{ fontWeight: 900, fill: '#64748b' }}
                />
                <YAxis 
                  tickLine={false} 
                  axisLine={false} 
                  fontSize={9}
                  tick={{ fontWeight: 900, fill: '#64748b' }}
                  tickFormatter={(val) => `${val}T`}
                />
                <Bar dataKey="stok" fill="#0f172a" radius={[0, 0, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-none bg-white shadow-sm overflow-hidden rounded-none">
          <div className="h-1 w-full border-t-4 border-slate-900" />
          <CardHeader className="p-4 border-b border-slate-50">
            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-slate-900">UTILISASI GUDANG</CardTitle>
            <CardDescription className="text-[10px] font-bold text-slate-500 mt-0.5 uppercase tracking-tight">PERBANDINGAN KAPASITAS AKTIF ANTAR NODES</CardDescription>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            {filteredWarehouses.slice(0, 4).map((warehouse) => (
              <div key={warehouse.id} className="rounded-none border border-slate-100 bg-slate-50/50 p-4 group hover:bg-white hover:shadow-md transition-all">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-black text-slate-900 uppercase tracking-tight">{warehouse.name.toUpperCase()}</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase mt-0.5 tracking-widest">
                      {warehouse.cooperativeName.toUpperCase()} · {warehouse.villageName.toUpperCase()}
                    </p>
                  </div>
                  <Badge className={`text-[9px] font-black border-none px-1.5 h-4 uppercase rounded-none tracking-widest ${
                    warehouse.type === 'cold' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {warehouse.type === 'cold' ? 'COLD STORAGE' : 'REGULER'}
                  </Badge>
                </div>
                <div className="mt-4 h-1.5 overflow-hidden bg-slate-200 rounded-none">
                  <div
                    className={`h-full ${warehouse.utilizationPct > 85 ? 'bg-rose-500' : 'bg-emerald-500'}`}
                    style={{ width: `${Math.min(warehouse.utilizationPct, 100)}%` }}
                  />
                </div>
                <div className="mt-3 flex justify-between text-[9px] font-black uppercase text-slate-500 tracking-widest">
                  <span>{warehouse.utilizationPct}% TERPAKAI</span>
                  <span>{warehouse.occupancyKg.toLocaleString('id-ID')} KG TERSIMPAN</span>
                  <span>{warehouse.batchCount} BATCH AKTIF</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="border-none bg-white shadow-sm overflow-hidden rounded-none">
        <div className="h-1 w-full bg-slate-900" />
        <CardHeader className="p-6 border-b border-slate-50">
          <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-900">MANIFEST BATCH GUDANG</CardTitle>
          <CardDescription className="text-[10px] font-bold text-slate-500 uppercase">AUDIT PERSEDIAAN DAN LOG TRACEABILITY</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-900">
              <TableRow className="hover:bg-slate-900 border-none">
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400 h-10 px-6">BATCH ID</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400 h-10 px-6">KOMODITAS / KOPERASI</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400 h-10 px-6">GUDANG / WILAYAH</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400 h-10 px-6 text-right">JUMLAH</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400 h-10 px-6 text-center">GRADE</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400 h-10 px-6 text-center">KONDISI</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400 h-10 px-6 text-right">KADALUARSA</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInventory.map((item) => {
                const expiringSoon =
                  (new Date(item.expiryDate).getTime() - REFERENCE_DATE.getTime()) / (1000 * 60 * 60 * 24) <= 7

                return (
                  <TableRow key={item.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors group">
                    <TableCell className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <QrCode className="h-3.5 w-3.5 text-slate-400" />
                        <span className="font-mono text-[10px] font-black text-slate-500 uppercase">{item.batchCode}</span>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <div>
                        <p className="text-xs font-black text-slate-900 uppercase tracking-tight">{item.commodityName.toUpperCase()}</p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase mt-0.5 tracking-widest">{item.cooperativeName.toUpperCase()}</p>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4">
                      <div>
                        <p className="text-xs font-black text-slate-900 uppercase tracking-tight">{item.warehouseName.toUpperCase()}</p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase mt-0.5 tracking-widest">{item.villageName.toUpperCase()}, {item.regionName.toUpperCase()}</p>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-right font-black text-xs text-slate-900">{item.quantityKg.toLocaleString('id-ID')} KG</TableCell>
                    <TableCell className="px-6 py-4 text-center">
                      <Badge className={`text-[9px] font-black border-none px-1.5 h-4 uppercase rounded-none tracking-widest ${badgeTone(item.quality)}`}>
                        GRADE {item.quality}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-center">
                      <Badge className={`text-[9px] font-black border-none px-1.5 h-4 uppercase rounded-none tracking-widest ${badgeTone(item.status)}`}>
                        {item.status.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {expiringSoon && <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />}
                        <span className={`text-[10px] font-black uppercase ${expiringSoon ? 'text-amber-600' : 'text-slate-500'}`}>
                          {formatDate(item.expiryDate).toUpperCase()}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="border-none bg-slate-900 text-white rounded-none">
        <CardContent className="flex flex-col gap-4 p-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="rounded-none bg-white/10 p-3 shadow-inner">
              <Warehouse className="h-6 w-6 text-emerald-400" />
            </div>
            <div>
              <p className="text-sm font-black uppercase tracking-widest text-white">SINKRONISASI INVENTARIS AKTIF</p>
              <p className="text-[10px] font-bold text-slate-400 uppercase mt-1 tracking-widest leading-relaxed max-w-2xl">
                SCOPE SAAT INI MENCAKUP {filteredWarehouses.length} GUDANG, {commoditySeries.length} KOMODITAS, DAN SELURUH RINGKASAN DI ATAS BERGERAK BERSAMA FILTER INTEGRITAS DATA NASIONAL.
              </p>
            </div>
          </div>
          <Button 
            className="bg-white text-slate-900 hover:bg-slate-100 text-[10px] font-black uppercase tracking-widest h-10 px-8 rounded-none transition-all"
            onClick={() => toast({ title: "Inisiasi Sinkronisasi", description: "Menghubungkan ke node penyimpanan regional untuk pembaruan inventaris live..." })}
          >
            SINKRONISASI LIVE
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
