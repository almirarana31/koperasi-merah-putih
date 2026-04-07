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
import { toast } from 'sonner'

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

  const scaleFactor = useMemo(() => {
    if (filters.cooperativeId !== 'all') return 0.05
    if (filters.villageId !== 'all') return 0.1
    if (filters.regionId !== 'all') return 0.25
    if (filters.provinceId !== 'all') return 0.5
    return 1.0
  }, [filters])

  const filteredCommodities = useMemo(() => {
    return commodities.filter((commodity) => {
      const matchesSearch = commodity.nama.toLowerCase().includes(search.toLowerCase())
      const matchesCategory = filterCategory === 'all' || commodity.kategori === filterCategory
      const matchesFilterId = filters.commodityId === 'all' || commodity.id === filters.commodityId
      
      return matchesSearch && matchesCategory && matchesFilterId
    })
  }, [search, filterCategory, filters])

  const stats = useMemo(() => {
    const count = filteredCommodities.length
    const totalStock = filteredCommodities.reduce((sum, item) => sum + (item.stokTotal * scaleFactor), 0)
    const totalValue = filteredCommodities.reduce(
      (sum, item) => sum + (item.stokTotal * scaleFactor * item.hargaAcuan),
      0
    )
    
    return {
      count,
      totalStock,
      totalValue,
      isNational: filters.provinceId === 'all'
    }
  }, [filteredCommodities, scaleFactor, filters.provinceId])

  const handleAction = (action: string) => {
    toast.success(`Aksi ${action} sedang diproses secara nasional`)
  }

  if (!user) return null

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-none bg-slate-900 flex items-center justify-center shadow-xl">
            <Package className="h-7 w-7 text-emerald-500" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Master Komoditas & Cadangan Strategis</h1>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">
              Monitoring Agregat Cadangan Pangan • {stats.isNational ? 'Scope Nasional' : `Regional: ${filters.provinceId}`}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
           <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleAction('Analisis Mix')}
            className="h-10 rounded-none text-[10px] font-black uppercase tracking-widest text-slate-600 border-slate-200"
          >
            <PieChart className="h-4 w-4 mr-2 text-blue-600" />
            Analisis Mix
          </Button>
          <Button 
            size="sm" 
            onClick={() => handleAction('Audit PDF')}
            className="h-10 rounded-none bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-black uppercase tracking-widest px-6 shadow-lg shadow-slate-200"
          >
            <Download className="h-4 w-4 mr-2" />
            Audit Stok PDF
          </Button>
        </div>
      </div>

      <KementerianFilterBar filters={filters} setFilters={setFilters} />

      {/* Executive KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'VARIETAS AKTIF', value: stats.count, sub: 'SKU TERDAFTAR NASIONAL', icon: Layers, tone: 'slate' },
          { label: 'AGREGAT VOLUME STOK', value: (stats.totalStock / 1000).toLocaleString(), sub: 'METRIC TON (MT)', icon: TrendingUp, tone: 'emerald' },
          { label: 'VALUASI CADANGAN', value: `Rp ${(stats.totalValue / 1000000000).toFixed(2)} M`, sub: 'ESTIMASI NILAI PASAR', icon: Globe, tone: 'blue' },
        ].map((s, i) => (
          <Card key={i} className="rounded-none border-none bg-white shadow-sm overflow-hidden group">
            <div className={`h-1.5 w-full ${s.tone === 'emerald' ? 'bg-emerald-500' : s.tone === 'blue' ? 'bg-blue-500' : 'bg-slate-900'}`} />
            <CardContent className="p-6 flex items-center gap-5">
              <div className={`h-14 w-14 rounded-none bg-slate-50 flex items-center justify-center group-hover:scale-110 transition-transform border border-slate-100`}>
                <s.icon className={`h-7 w-7 ${s.tone === 'emerald' ? 'text-emerald-600' : s.tone === 'blue' ? 'text-blue-600' : 'text-slate-900'}`} />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{s.label}</p>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className={`text-2xl font-black text-slate-900`}>{s.value}</span>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">{s.sub}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search & Category Filter */}
      <Card className="rounded-none border-none shadow-sm bg-slate-50/50">
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="CARI KOMODITAS ATAU SKU ID STRATEGIS..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="pl-9 bg-white border-slate-200 h-11 text-[10px] font-black uppercase tracking-widest rounded-none focus:ring-slate-900"
              />
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-full sm:w-[220px] h-11 border-slate-200 bg-white font-black text-[10px] uppercase tracking-widest rounded-none">
                <SelectValue placeholder="SEMUA KATEGORI" />
              </SelectTrigger>
              <SelectContent className="font-black text-[10px] uppercase tracking-widest rounded-none">
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
      <Card className="rounded-none border-none shadow-sm overflow-hidden">
        <CardHeader className="p-6 border-b border-slate-50">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Database Inventaris Komoditas Nasional</CardTitle>
              <CardDescription className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">Audit stok terkini berdasarkan filter hierarki kementerian</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="h-6 rounded-none text-[10px] font-black uppercase tracking-widest bg-slate-50 border-slate-200">{filteredCommodities.length} ITEMS</Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-900 rounded-none">
                <TableRow className="hover:bg-slate-900 border-none">
                  <TableHead className="h-10 text-[10px] font-black text-slate-400 uppercase tracking-widest px-6">ID SKU</TableHead>
                  <TableHead className="h-10 text-[10px] font-black text-slate-400 uppercase tracking-widest px-6">Nama Komoditas</TableHead>
                  <TableHead className="h-10 text-[10px] font-black text-slate-400 uppercase tracking-widest px-6">Kategori</TableHead>
                  <TableHead className="h-10 text-[10px] font-black text-slate-400 uppercase tracking-widest px-6">Satuan</TableHead>
                  <TableHead className="h-10 text-[10px] font-black text-slate-400 uppercase tracking-widest px-6 text-right">Harga Acuan</TableHead>
                  <TableHead className="h-10 text-[10px] font-black text-slate-400 uppercase tracking-widest px-6 text-right">Stok Agregat</TableHead>
                  <TableHead className="h-10 text-[10px] font-black text-slate-400 uppercase tracking-widest px-6 text-right">Valuasi</TableHead>
                  <TableHead className="h-10 text-[10px] font-black text-slate-400 uppercase tracking-widest px-6"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCommodities.map((commodity) => {
                  const displayStock = Math.round(commodity.stokTotal * scaleFactor)
                  const displayValue = displayStock * commodity.hargaAcuan

                  return (
                    <TableRow key={commodity.id} className="group border-b border-slate-50 hover:bg-slate-50 transition-colors">
                      <TableCell className="px-6 py-4">
                        <span className="font-mono text-[10px] font-black text-slate-500 uppercase">{commodity.id}</span>
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-none bg-emerald-50 flex items-center justify-center shrink-0 border border-emerald-100">
                            <Sprout className="h-4 w-4 text-emerald-600" />
                          </div>
                          <span className="text-sm font-black text-slate-900 uppercase tracking-tight">{commodity.nama}</span>
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <Badge className={`h-5 rounded-none text-[10px] font-black uppercase tracking-widest px-2 border-none ${categoryColors[commodity.kategori]}`}>
                          {categoryLabels[commodity.kategori]}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase">{commodity.satuan}</TableCell>
                      <TableCell className="px-6 py-4 text-right">
                        <span className="text-sm font-black text-slate-900">{formatCurrency(commodity.hargaAcuan)}</span>
                      </TableCell>
                      <TableCell className="px-6 py-4 text-right">
                        <div className="flex flex-col items-end">
                          <span className="text-sm font-black text-slate-900">{displayStock.toLocaleString()}</span>
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{commodity.satuan}</span>
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4 text-right">
                        <span className="text-sm font-black text-emerald-600">{formatCurrency(displayValue)}</span>
                      </TableCell>
                      <TableCell className="px-6 py-4 text-right">
                         <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => handleAction(`Detail ${commodity.nama}`)}
                          className="h-8 w-8 rounded-none text-slate-400 group-hover:text-slate-900 transition-colors"
                        >
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
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Agregat Stok</span>
                  <span className="text-sm font-black text-white">{Math.round(filteredCommodities.reduce((sum, item) => sum + (item.stokTotal * scaleFactor), 0)).toLocaleString()} UNIT</span>
               </div>
               <div className="h-8 w-px bg-slate-800" />
               <div className="flex flex-col">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Valuasi Cadangan</span>
                  <span className="text-sm font-black text-emerald-400">{formatCurrency(filteredCommodities.reduce((sum, item) => sum + (item.stokTotal * scaleFactor * item.hargaAcuan), 0))}</span>
               </div>
             </div>
             <div className="flex items-center gap-3">
               <Button 
                size="sm" 
                variant="outline" 
                onClick={() => handleAction('Download Table')}
                className="h-8 rounded-none bg-transparent border-slate-700 text-white text-[10px] font-black uppercase tracking-widest hover:bg-slate-800"
              >
                 <FileText className="h-3 w-3 mr-2" />
                 Eksport Tabel
               </Button>
               <Button 
                size="sm" 
                onClick={() => handleAction('Market Insights')}
                className="h-8 rounded-none bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-black uppercase tracking-widest shadow-lg"
              >
                 <Activity className="h-3 w-3 mr-2" />
                 Analisis Pasar
               </Button>
             </div>
          </div>
        )}
      </Card>

      {filteredCommodities.length === 0 && (
        <Card className="rounded-none border-dashed py-20 bg-slate-50/50">
          <CardContent className="flex flex-col items-center justify-center text-center">
            <div className="h-16 w-16 rounded-none bg-slate-200 flex items-center justify-center mb-4 text-slate-400">
              <Package className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-black text-slate-900 uppercase">Komoditas Tidak Ditemukan</h3>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Sesuaikan kata kunci atau filter hierarki kementerian Anda.</p>
            <Button 
              variant="link" 
              onClick={() => {
                setSearch('')
                setFilterCategory('all')
                setFilters({ provinceId: 'all', regionId: 'all', villageId: 'all', cooperativeId: 'all', commodityId: 'all' })
              }}
              className="mt-4 text-[10px] font-black uppercase tracking-widest text-emerald-600"
            >
              Reset Semua Filter
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Global Stock Alert Banner */}
      <Card className="rounded-none alert-surface-banner border-none overflow-hidden relative group cursor-pointer" onClick={() => handleAction('Detail Anomali')}>
        <div className="alert-surface-watermark absolute top-0 right-0 p-4 transition-transform group-hover:scale-110">
          <ShieldAlert className="h-20 w-20" />
        </div>
        <CardContent className="p-5 flex items-center gap-6 relative">
          <div className="alert-surface-icon flex h-12 w-12 items-center justify-center rounded-none shrink-0 border border-white/20">
            <Activity className="h-6 w-6" />
          </div>
          <div className="flex-1">
             <div className="flex items-center gap-2">
                <Badge className="rounded-none alert-surface-chip h-4 px-1.5 text-[10px] font-black uppercase tracking-widest">Priority Alert</Badge>
                <span className="alert-surface-meta text-xs font-black uppercase tracking-tighter">Deteksi Anomali Stok Nasional</span>
             </div>
             <p className="alert-surface-copy mt-1 text-base font-black uppercase tracking-tight">Beberapa wilayah melaporkan stok kritis untuk Padi Premium (Scope Sumatera Utara).</p>
          </div>
          <Button className="rounded-none alert-surface-action h-10 px-6 text-[10px] font-black uppercase tracking-widest transition-all">
            Lihat Detail Audit
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

