'use client'

import { useState, useMemo } from 'react'
import { 
  Package, 
  Plus, 
  Search, 
  Sprout, 
  TrendingUp, 
  Layers, 
  ArrowRight, 
  ArrowDownCircle, 
  Download, 
  FileText, 
  Activity, 
  ShieldAlert,
  Globe,
  PieChart
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useAuth } from '@/lib/auth/use-auth'
import { commodities, formatCurrency } from '@/lib/data'
import { KementerianFilterBar } from '@/components/dashboard/kementerian-filter-bar'
import { ScopeFilters } from '@/lib/kementerian-dashboard-data'

const categoryLabels: Record<string, string> = {
  pangan: 'Pangan',
  hortikultura: 'Hortikultura',
  perkebunan: 'Perkebunan',
  peternakan: 'Peternakan',
  perikanan: 'Perikanan',
}

const categoryColors: Record<string, string> = {
  pangan: 'bg-emerald-100 text-emerald-700',
  hortikultura: 'bg-amber-100 text-amber-700',
  perkebunan: 'bg-slate-100 text-slate-700',
  peternakan: 'bg-rose-100 text-rose-700',
  perikanan: 'bg-blue-100 text-blue-700',
}

export default function KomoditasPage() {
  const { user } = useAuth()
  const isKementerian = user?.role === 'kementerian'
  
  const [search, setSearch] = useState('')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [filters, setFilters] = useState<ScopeFilters>({
    provinceId: 'all',
    regionId: 'all',
    villageId: 'all',
    cooperativeId: 'all',
    commodityId: 'all',
  })

  // Simulated Hierarchical Filtering
  const filteredCommodities = useMemo(() => {
    return commodities.filter((commodity) => {
      const matchesSearch = commodity.nama.toLowerCase().includes(search.toLowerCase())
      const matchesCategory = filterCategory === 'all' || commodity.kategori === filterCategory
      
      // In a real app, commodities would be linked to specific cooperatives/regions
      // For this refactor, we simulate the effect of hierarchical filters on volumes/presence
      const matchesFilterId = filters.commodityId === 'all' || commodity.id === filters.commodityId
      
      return matchesSearch && matchesCategory && matchesFilterId
    })
  }, [search, filterCategory, filters])

  // Aggregate Metrics with scaling simulation
  const stats = useMemo(() => {
    // Simulate data reduction based on hierarchical scope
    const scopeFactor = filters.provinceId === 'all' ? 1 : filters.regionId === 'all' ? 0.4 : 0.1
    
    const count = filteredCommodities.length
    const totalStock = filteredCommodities.reduce((sum, item) => sum + (item.stokTotal * scopeFactor), 0)
    const totalValue = filteredCommodities.reduce(
      (sum, item) => sum + (item.stokTotal * scopeFactor * item.hargaAcuan),
      0
    )
    
    return {
      count,
      totalStock,
      totalValue,
      isNational: filters.provinceId === 'all'
    }
  }, [filteredCommodities, filters])

  if (!user) return null

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-slate-900 flex items-center justify-center shadow-xl">
            <Package className="h-6 w-6 text-emerald-500" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold  text-slate-900 ">Master Komoditas & Stok</h1>
            <p className="text-xs font-bold text-slate-500   mt-1">
              Monitoring Agregat Cadangan Pangan • {stats.isNational ? 'Scope Nasional' : `Regional: ${filters.provinceId}`}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
           <Button variant="outline" size="sm" className="h-10 text-xs font-semibold   text-slate-600 border-slate-200">
            <PieChart className="h-4 w-4 mr-2 text-blue-600" />
            Analisis Mix
          </Button>
          <Button size="sm" className="h-10 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold   px-6 shadow-lg shadow-slate-200">
            <Download className="h-4 w-4 mr-2" />
            Stock Audit PDF
          </Button>
        </div>
      </div>

      {/* Kementerian Hierarchical Filter Bar */}
      <KementerianFilterBar filters={filters} setFilters={setFilters} />

      {/* Executive KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Varietas Aktif', value: stats.count, sub: 'SKU Terdaftar', icon: Layers, color: 'text-slate-900', accent: 'bg-slate-50' },
          { label: 'Total Volume Stok', value: (stats.totalStock / 1000).toFixed(1), sub: 'Metric Ton', icon: TrendingUp, color: 'text-emerald-600', accent: 'bg-emerald-50' },
          { label: 'Nilai Kapitalisasi', value: formatCurrency(stats.totalValue), sub: 'Estimasi Pasar', icon: Globe, color: 'text-blue-600', accent: 'bg-blue-50' },
        ].map((s, i) => (
          <Card key={i} className="border-none shadow-sm overflow-hidden">
            <CardContent className="p-6 flex items-center gap-5">
              <div className={`h-14 w-14 rounded-2xl ${s.accent} flex items-center justify-center`}>
                <s.icon className={`h-7 w-7 ${s.color}`} />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400  ">{s.label}</p>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className={`text-2xl font-semibold  ${s.color}`}>{s.value}</span>
                  <span className="text-sm font-bold text-slate-500 ">{s.sub}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search & Category Filter */}
      <Card className="border-none shadow-sm bg-slate-50/50">
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="CARI KOMODITAS ATAU SKU ID..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="pl-9 bg-white border-slate-200 h-11 text-sm font-bold  "
              />
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-full sm:w-[220px] h-11 border-slate-200 bg-white font-semibold text-xs ">
                <SelectValue placeholder="SEMUA KATEGORI" />
              </SelectTrigger>
              <SelectContent className="font-bold text-xs ">
                <SelectItem value="all">SEMUA KATEGORI</SelectItem>
                <SelectItem value="pangan">PANGAN</SelectItem>
                <SelectItem value="hortikultura">HORTIKULTURA</SelectItem>
                <SelectItem value="perkebunan">PERKEBUNAN</SelectItem>
                <SelectItem value="peternakan">PETERNAKAN</SelectItem>
                <SelectItem value="perikanan">PERIKANAN</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Main Inventory Table - High Density Executive Style */}
      <Card className="border-none shadow-sm overflow-hidden">
        <CardHeader className="p-6 border-b border-slate-50">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xs font-semibold text-slate-900  ">Data Inventaris Komoditas</CardTitle>
              <CardDescription className="text-xs font-bold text-slate-400  mt-1">Audit stok terkini berdasarkan filter yang diterapkan</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="h-6 text-xs font-semibold   bg-slate-50 border-slate-200">{filteredCommodities.length} ITEMS</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-900">
                <TableRow className="hover:bg-slate-900 border-none">
                  <TableHead className="h-10 text-xs font-semibold text-slate-400   px-6">ID SKU</TableHead>
                  <TableHead className="h-10 text-xs font-semibold text-slate-400   px-6">Nama Komoditas</TableHead>
                  <TableHead className="h-10 text-xs font-semibold text-slate-400   px-6">Kategori</TableHead>
                  <TableHead className="h-10 text-xs font-semibold text-slate-400   px-6">Satuan</TableHead>
                  <TableHead className="h-10 text-xs font-semibold text-slate-400   px-6 text-right">Harga Acuan</TableHead>
                  <TableHead className="h-10 text-xs font-semibold text-slate-400   px-6 text-right">Stok Agregat</TableHead>
                  <TableHead className="h-10 text-xs font-semibold text-slate-400   px-6 text-right">Nilai Kapitalisasi</TableHead>
                  <TableHead className="h-10 text-xs font-semibold text-slate-400   px-6"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCommodities.map((commodity) => {
                  // Simulate scope-based stock scaling for the table
                  const scopeFactor = filters.provinceId === 'all' ? 1 : filters.regionId === 'all' ? 0.4 : 0.1
                  const displayStock = Math.round(commodity.stokTotal * scopeFactor)
                  const displayValue = displayStock * commodity.hargaAcuan

                  return (
                    <TableRow key={commodity.id} className="group border-b border-slate-50 hover:bg-slate-50 transition-colors">
                      <TableCell className="px-6 py-4">
                        <span className="font-mono text-xs font-bold text-slate-500">{commodity.id}</span>
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded bg-emerald-50 flex items-center justify-center shrink-0">
                            <Sprout className="h-4 w-4 text-emerald-600" />
                          </div>
                          <span className="text-sm font-semibold text-slate-900  ">{commodity.nama}</span>
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <Badge className={`h-5 text-xs font-semibold  px-2 rounded border-none ${categoryColors[commodity.kategori]}`}>
                          {categoryLabels[commodity.kategori]}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-6 py-4 text-xs font-bold text-slate-500 ">{commodity.satuan}</TableCell>
                      <TableCell className="px-6 py-4 text-right">
                        <span className="text-sm font-semibold text-slate-900">{formatCurrency(commodity.hargaAcuan)}</span>
                      </TableCell>
                      <TableCell className="px-6 py-4 text-right">
                        <div className="flex flex-col items-end">
                          <span className="text-sm font-semibold text-slate-900">{displayStock.toLocaleString()}</span>
                          <span className="text-xs font-bold text-slate-400  ">{commodity.satuan}</span>
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4 text-right">
                        <span className="text-sm font-semibold text-emerald-600">{formatCurrency(displayValue)}</span>
                      </TableCell>
                      <TableCell className="px-6 py-4 text-right">
                         <Button variant="ghost" size="icon" className="h-8 w-8 rounded-lg text-slate-400 group-hover:text-slate-900 transition-colors">
                           <ArrowRight className="h-4 w-4" />
                         </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        {filteredCommodities.length > 0 && (
          <div className="p-4 bg-slate-900 flex flex-col md:flex-row md:items-center justify-between gap-4">
             <div className="flex items-center gap-6">
               <div className="flex flex-col">
                  <span className="text-xs font-semibold text-slate-400  ">Total Agregat</span>
                  <span className="text-sm font-semibold text-white">{stats.totalStock.toLocaleString()} UNIT</span>
               </div>
               <div className="h-8 w-px bg-slate-800" />
               <div className="flex flex-col">
                  <span className="text-xs font-semibold text-slate-400  ">Estimasi Nilai Total</span>
                  <span className="text-sm font-semibold text-emerald-400">{formatCurrency(stats.totalValue)}</span>
               </div>
             </div>
             <div className="flex items-center gap-3">
               <Button size="sm" variant="outline" className="h-8 bg-transparent border-slate-700 text-white text-xs font-semibold  hover:bg-slate-800">
                 <FileText className="h-3 w-3 mr-2" />
                 Download Table
               </Button>
               <Button size="sm" className="h-8 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold  shadow-lg">
                 <Activity className="h-3 w-3 mr-2" />
                 Market Insights
               </Button>
             </div>
          </div>
        )}
      </Card>

      {filteredCommodities.length === 0 && (
        <Card className="border-dashed py-20 bg-slate-50/50">
          <CardContent className="flex flex-col items-center justify-center text-center">
            <div className="h-16 w-16 rounded-full bg-slate-200 flex items-center justify-center mb-4 text-slate-400">
              <Package className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 ">Komoditas Tidak Ditemukan</h3>
            <p className="text-xs font-bold text-slate-500   mt-1">Sesuaikan kata kunci atau filter hierarki Anda.</p>
            <Button 
              variant="link" 
              onClick={() => {
                setSearch('')
                setFilterCategory('all')
                setFilters({ provinceId: 'all', regionId: 'all', villageId: 'all', cooperativeId: 'all', commodityId: 'all' })
              }}
              className="mt-4 text-xs font-semibold  text-emerald-600"
            >
              Reset Semua Filter
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Global Stock Alert Banner */}
      <Card className="alert-surface-banner border-none overflow-hidden relative group cursor-pointer">
        <div className="alert-surface-watermark absolute top-0 right-0 p-4 transition-transform group-hover:scale-110">
          <ShieldAlert className="h-20 w-20" />
        </div>
        <CardContent className="p-5 flex items-center gap-6 relative">
          <div className="alert-surface-icon flex h-12 w-12 items-center justify-center rounded-xl shrink-0">
            <Activity className="h-6 w-6" />
          </div>
          <div className="flex-1">
             <div className="flex items-center gap-2">
                <Badge className="alert-surface-chip h-4 px-1.5 text-xs font-semibold">Priority Alert</Badge>
                <span className="alert-surface-meta text-sm font-medium">Stock Anomaly Detected</span>
             </div>
             <p className="alert-surface-copy mt-1 text-base font-semibold">Beberapa wilayah melaporkan stok kritis untuk Padi Premium (Sumatera Utara).</p>
          </div>
          <Button className="alert-surface-action h-10 px-6 text-xs font-semibold transition-all">
            Lihat Detail
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
