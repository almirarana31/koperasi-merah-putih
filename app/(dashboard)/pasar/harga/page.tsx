'use client'

import { useState, useMemo } from 'react'
import {
  ArrowDownRight,
  ArrowUpRight,
  Calendar,
  Minus,
  RefreshCw,
  TrendingDown,
  TrendingUp,
  Globe,
  ShieldAlert,
  Activity,
  Download,
  FileText,
  BarChart3,
  Search,
  ArrowRight,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/lib/auth/use-auth'
import { commodities, formatCurrency } from '@/lib/data'
import { KementerianFilterBar } from '@/components/dashboard/kementerian-filter-bar'
import { ScopeFilters } from '@/lib/kementerian-dashboard-data'

const hargaPasar = commodities.map((commodity) => {
  const change = (Math.random() - 0.5) * 20
  return {
    ...commodity,
    hargaKemarin: commodity.hargaAcuan - commodity.hargaAcuan * (change / 100),
    perubahan: change,
    hargaMingguan: commodity.hargaAcuan * (0.95 + Math.random() * 0.1),
    hargaBulanan: commodity.hargaAcuan * (0.9 + Math.random() * 0.2),
    region: ['JAWA BARAT', 'JAWA TIMUR', 'SUMATERA UTARA', 'BALI'][Math.floor(Math.random() * 4)]
  }
})

export default function HargaPasarPage() {
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

  const filteredHarga = useMemo(() => {
    return hargaPasar.filter(item => {
      const matchesSearch = item.nama.toLowerCase().includes(search.toLowerCase())
      const matchesProvince = filters.provinceId === 'all' || item.region.includes(filters.provinceId.toUpperCase())
      const matchesCommodity = filters.commodityId === 'all' || item.id === filters.commodityId
      return matchesSearch && matchesProvince && matchesCommodity
    })
  }, [search, filters])

  const stats = useMemo(() => {
    const naik = filteredHarga.filter((item) => item.perubahan > 0).length
    const turun = filteredHarga.filter((item) => item.perubahan < 0).length
    const stabil = filteredHarga.filter((item) => Math.abs(item.perubahan) < 1).length
    const volIndex = filteredHarga.length > 0 ? (filteredHarga.reduce((acc, i) => acc + Math.abs(i.perubahan), 0) / filteredHarga.length).toFixed(1) : '0'
    
    return { count: filteredHarga.length, naik, turun, stabil, volIndex }
  }, [filteredHarga])

  if (!user) return null

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-slate-900 flex items-center justify-center shadow-xl">
            <BarChart3 className="h-6 w-6 text-emerald-500" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 uppercase">National Price Index</h1>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
              Real-time Commodity Benchmarking & Market Volatility Monitoring
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
           <Button variant="outline" size="sm" className="h-10 text-[10px] font-black uppercase tracking-widest text-slate-600 border-slate-200">
            <FileText className="h-4 w-4 mr-2 text-rose-600" />
            Price Audit
          </Button>
          <Button size="sm" className="h-10 bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-black uppercase tracking-widest px-6 shadow-lg">
            <Download className="h-4 w-4 mr-2" />
            Export Index
          </Button>
        </div>
      </div>

      {/* Kementerian Hierarchical Filter Bar */}
      <KementerianFilterBar filters={filters} setFilters={setFilters} />

      {/* High-Density KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Komoditas Dipantau', value: stats.count, sub: 'SKU', icon: BarChart3, color: 'text-slate-900' },
          { label: 'Indeks Kenaikan', value: stats.naik, sub: 'UP TREND', icon: TrendingUp, color: 'text-emerald-600' },
          { label: 'Indeks Penurunan', value: stats.turun, sub: 'DOWN TREND', icon: TrendingDown, color: 'text-rose-600' },
          { label: 'Volatility Index', value: stats.volIndex + '%', sub: 'National Avg', icon: Activity, color: 'text-blue-600' },
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

      <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
        <div className="space-y-6">
           {/* Search & Benchmark Tools */}
           <Card className="border-none shadow-sm bg-slate-50/50">
              <CardContent className="p-4">
                 <div className="flex flex-col gap-4 md:flex-row md:items-center">
                    <div className="relative flex-1">
                       <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                       <Input
                         placeholder="CARI KOMODITAS ATAU ANALISIS HARGA..."
                         value={search}
                         onChange={(e) => setSearch(e.target.value)}
                         className="pl-9 bg-white border-slate-200 h-11 text-[11px] font-bold uppercase tracking-wider focus:ring-slate-900"
                       />
                    </div>
                    <Button variant="outline" className="h-11 border-slate-200 bg-white font-black text-[10px] uppercase tracking-widest px-6">
                       <RefreshCw className="h-4 w-4 mr-2" /> REFRESH INDEX
                    </Button>
                 </div>
              </CardContent>
           </Card>

           {/* High-Density Price Table */}
           <Card className="border-none shadow-sm overflow-hidden">
              <CardHeader className="p-6 border-b border-slate-50">
                 <div className="flex items-center justify-between">
                    <div>
                       <CardTitle className="text-xs font-black text-slate-900 uppercase tracking-widest">Matriks Benchmarking Harga Nasional</CardTitle>
                       <CardDescription className="text-[10px] font-bold text-slate-400 uppercase mt-1">Komparasi Harga Aktual Lintas Wilayah Kerja</CardDescription>
                    </div>
                    <Badge className="bg-slate-900 text-white font-black text-[9px] uppercase h-5 px-2">LIVE INDEX</Badge>
                 </div>
              </CardHeader>
              <CardContent className="p-0">
                 <div className="overflow-x-auto">
                    <Table>
                       <TableHeader className="bg-slate-900">
                          <TableRow className="hover:bg-slate-900 border-none">
                             <TableHead className="h-10 text-[9px] font-black text-slate-400 uppercase tracking-widest px-6">KOMODITAS</TableHead>
                             <TableHead className="h-10 text-[9px] font-black text-slate-400 uppercase tracking-widest px-6">REGION</TableHead>
                             <TableHead className="h-10 text-[9px] font-black text-slate-400 uppercase tracking-widest px-6 text-right">HARGA SAAT INI</TableHead>
                             <TableHead className="h-10 text-[9px] font-black text-slate-400 uppercase tracking-widest px-6 text-right">PERUBAHAN (24H)</TableHead>
                             <TableHead className="h-10 text-[9px] font-black text-slate-400 uppercase tracking-widest px-6 text-right">AVG MINGGUAN</TableHead>
                             <TableHead className="h-10 text-[9px] font-black text-slate-400 uppercase tracking-widest px-6"></TableHead>
                          </TableRow>
                       </TableHeader>
                       <TableBody>
                          {filteredHarga.map((item) => (
                             <TableRow key={item.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors group">
                                <TableCell className="px-6 py-4">
                                   <span className="text-[11px] font-black text-slate-900 uppercase tracking-tight">{item.nama}</span>
                                </TableCell>
                                <TableCell className="px-6 py-4">
                                   <Badge variant="outline" className="text-[8px] font-black uppercase text-slate-400 border-slate-200">{item.region}</Badge>
                                </TableCell>
                                <TableCell className="px-6 py-4 text-right">
                                   <span className="text-[11px] font-black text-slate-900">{formatCurrency(item.hargaAcuan)}</span>
                                   <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">PER {item.satuan}</p>
                                </TableCell>
                                <TableCell className="px-6 py-4 text-right">
                                   <div className={`flex items-center justify-end gap-1 font-black text-[11px] ${
                                     item.perubahan > 0 ? 'text-emerald-600' : item.perubahan < 0 ? 'text-rose-600' : 'text-slate-400'
                                   }`}>
                                      {item.perubahan > 0 ? <ArrowUpRight className="h-3.5 w-3.5" /> : item.perubahan < 0 ? <ArrowDownRight className="h-3.5 w-3.5" /> : <Minus className="h-3.5 w-3.5" />}
                                      {item.perubahan > 0 ? '+' : ''}{item.perubahan.toFixed(1)}%
                                   </div>
                                </TableCell>
                                <TableCell className="px-6 py-4 text-right">
                                   <span className="text-[10px] font-bold text-slate-500">{formatCurrency(Math.round(item.hargaMingguan))}</span>
                                </TableCell>
                                <TableCell className="px-6 py-4 text-right">
                                   <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-300 group-hover:text-slate-900">
                                      <ArrowRight className="h-4 w-4" />
                                   </Button>
                                </TableCell>
                             </TableRow>
                          ))}
                       </TableBody>
                    </Table>
                 </div>
              </CardContent>
           </Card>
        </div>

        {/* Side Market Analysis Panel */}
        <div className="space-y-6">
           <Card className="border-none shadow-xl bg-slate-950 text-white overflow-hidden">
              <CardHeader className="p-5 border-b border-white/5 bg-slate-900/50">
                 <div className="flex items-center justify-between">
                    <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                       <Activity className="h-4 w-4 text-emerald-500" /> MARKET FEED
                    </CardTitle>
                    <div className="flex items-center gap-1.5">
                       <div className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-ping" />
                       <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">LIVE DATA</span>
                    </div>
                 </div>
              </CardHeader>
              <CardContent className="p-0">
                 <div className="divide-y divide-white/5">
                    {[
                      { time: '14:35', action: 'Beras A: Price Spike Detected', status: 'ALERT', region: 'Jawa Timur' },
                      { time: '14:18', action: 'Cabai: Trend Normalization', status: 'INFO', region: 'Nasional' },
                      { time: '13:55', action: 'Corn Index: Critical Support', status: 'WARN', region: 'Sumatera' },
                      { time: '13:30', action: 'Data Sync: Bali Wholesale', status: 'SYNC', region: 'Bali' },
                    ].map((log, i) => (
                      <div key={i} className="p-5 hover:bg-white/5 transition-colors cursor-pointer group">
                         <div className="flex items-center justify-between mb-2">
                            <Badge className={`text-[8px] font-black uppercase px-1.5 h-4 border-none ${
                              log.status === 'ALERT' || log.status === 'WARN' ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-400'
                            }`}>
                               {log.status}
                            </Badge>
                            <span className="text-[9px] font-mono text-slate-600">{log.time}</span>
                         </div>
                         <p className="text-[11px] font-black text-slate-200 uppercase leading-tight group-hover:text-emerald-400 transition-colors">{log.action}</p>
                         <p className="text-[9px] font-bold text-slate-500 uppercase mt-1">WILAYAH: {log.region}</p>
                      </div>
                    ))}
                 </div>
                 <div className="p-4 bg-white/5 border-t border-white/5 text-center">
                    <Button variant="ghost" className="w-full text-[9px] font-black text-slate-500 hover:text-white uppercase tracking-widest h-10">
                       Buka Terminal Analisis →
                    </Button>
                 </div>
              </CardContent>
           </Card>

           <Card className="border-none shadow-sm bg-slate-50">
              <CardHeader className="p-4 border-b border-slate-200">
                 <CardTitle className="text-[10px] font-black uppercase tracking-widest text-slate-900">Health Check: Market API</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                 {[
                   { label: 'Source Integrity', val: '100%', status: 'Verified' },
                   { label: 'Latency (Global)', val: '18ms', status: 'Low' },
                   { label: 'Confidence Score', val: '98.2%', status: 'Optimal' },
                 ].map((h, i) => (
                    <div key={i} className="flex items-center justify-between">
                       <span className="text-[10px] font-bold text-slate-500 uppercase">{h.label}</span>
                       <div className="text-right">
                          <p className="text-[10px] font-black text-slate-900 uppercase">{h.val}</p>
                          <p className="text-[8px] font-bold text-emerald-600 uppercase">{h.status}</p>
                       </div>
                    </div>
                 ))}
              </CardContent>
           </Card>
        </div>
      </div>

      {/* Global Volatility Alert Banner */}
      <Card className="bg-rose-600 border-none overflow-hidden relative shadow-2xl shadow-rose-100 group cursor-pointer">
        <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform duration-700">
          <ShieldAlert className="h-32 w-32 text-white" />
        </div>
        <CardContent className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-8 relative">
          <div className="flex items-center gap-6">
             <div className="h-14 w-14 rounded-2xl bg-white/20 border border-white/10 flex items-center justify-center shrink-0">
                <Activity className="h-7 w-7 text-white animate-pulse" />
             </div>
             <div>
                <div className="flex items-center gap-3">
                   <Badge className="bg-white text-rose-600 font-black text-[9px] px-2 h-5 border-none">VOLATILITY ALERT</Badge>
                   <span className="text-[10px] font-black text-rose-100 uppercase tracking-widest">Abnormal Price Movement Detected ({'>'}20%)</span>
                </div>
                <p className="text-white text-base font-black uppercase mt-2 tracking-tight">Perhatian: Terdeteksi lonjakan harga Beras Grade A yang tidak wajar di regional Jawa Timur. Segera lakukan audit stok.</p>
             </div>
          </div>
          <Button className="h-12 bg-white text-rose-600 hover:bg-slate-100 font-black text-[11px] uppercase tracking-widest px-8 rounded-xl shadow-xl transition-all">
             Audit Supply Chain →
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
