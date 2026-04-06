'use client'

import { useState, useMemo } from 'react'
import {
  ArrowDownLeft,
  ArrowUpRight,
  CreditCard,
  Building,
  Banknote,
  CheckCircle2,
  Clock,
  Plus,
  ShieldAlert,
  Download,
  FileText,
  Activity,
  Globe,
  Wallet,
  ArrowRight,
  Search,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { formatCurrency, formatDate } from '@/lib/data'
import { useAuth } from '@/lib/auth/use-auth'
import { KementerianFilterBar } from '@/components/dashboard/kementerian-filter-bar'
import { ScopeFilters } from '@/lib/kementerian-dashboard-data'

const pembayaranMasuk = [
  { id: 'PM001', tanggal: '2024-02-10', dari: 'Hotel Grand Hyatt', invoice: 'INV/2024/02/001', metode: 'Transfer Bank', bank: 'BCA', jumlah: 9250000, status: 'verified', region: 'JAWA BARAT' },
  { id: 'PM002', tanggal: '2024-02-14', dari: 'Restoran Padang Sederhana', invoice: 'INV/2024/01/012', metode: 'Transfer Bank', bank: 'Mandiri', jumlah: 4500000, status: 'verified', region: 'SUMATERA UTARA' },
  { id: 'PM003', tanggal: '2024-02-16', dari: 'PT Indofood', invoice: 'INV/2024/01/015', metode: 'Transfer Bank', bank: 'BCA', jumlah: 11000000, status: 'pending', region: 'BALI' },
]

const pembayaranKeluar = [
  { id: 'PK001', tanggal: '2024-02-02', kepada: 'Bu Sri Wahyuni', tipe: 'Pembelian Komoditas', deskripsi: 'Pembelian cabai merah 150kg', metode: 'Transfer Bank', jumlah: 6750000, status: 'completed', region: 'JAWA BARAT' },
  { id: 'PK002', tanggal: '2024-02-05', kepada: 'Pak Joko (Driver)', tipe: 'Biaya Operasional', deskripsi: 'Biaya BBM & tol Jakarta', metode: 'Cash', jumlah: 500000, status: 'completed', region: 'JAWA BARAT' },
  { id: 'PK003', tanggal: '2024-02-10', kepada: 'Pak Slamet Widodo', tipe: 'Pencairan Pinjaman', deskripsi: 'Pinjaman modal usaha', metode: 'Transfer Bank', jumlah: 10000000, status: 'completed', region: 'JAWA TENGAH' },
]

export default function PembayaranPage() {
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

  const filteredIn = useMemo(() => {
    return pembayaranMasuk.filter(p => {
      const matchesSearch = p.dari.toLowerCase().includes(search.toLowerCase()) || p.invoice.toLowerCase().includes(search.toLowerCase())
      const matchesProvince = filters.provinceId === 'all' || p.region.includes(filters.provinceId.toUpperCase())
      return matchesSearch && matchesProvince
    })
  }, [search, filters])

  const filteredOut = useMemo(() => {
    return pembayaranKeluar.filter(p => {
      const matchesSearch = p.kepada.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase())
      const matchesProvince = filters.provinceId === 'all' || p.region.includes(filters.provinceId.toUpperCase())
      return matchesSearch && matchesProvince
    })
  }, [search, filters])

  const stats = useMemo(() => {
    const scale = filters.provinceId === 'all' ? 1 : 0.25
    const totalIn = filteredIn.reduce((acc, p) => acc + p.jumlah, 0)
    const totalOut = filteredOut.reduce((acc, p) => acc + p.jumlah, 0)
    return {
      totalIn,
      totalOut,
      net: totalIn - totalOut,
      pendingCount: filteredIn.filter(p => p.status === 'pending').length
    }
  }, [filteredIn, filteredOut, filters])

  if (!user) return null

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-slate-900 flex items-center justify-center shadow-xl">
            <CreditCard className="h-6 w-6 text-emerald-500" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold  text-slate-900 ">National Settlement Hub</h1>
            <p className="text-xs font-bold text-slate-500   mt-1">
              Monitoring Arus Kas & Penyelesaian Transaksi Antar Wilayah • Live Financial Ledger
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
           <Button variant="outline" size="sm" className="h-10 text-xs font-semibold   text-slate-600 border-slate-200">
            <FileText className="h-4 w-4 mr-2 text-rose-600" />
            Tax Report
          </Button>
          <Button size="sm" className="h-10 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold   px-6 shadow-lg">
            <Download className="h-4 w-4 mr-2" />
            Export Ledger
          </Button>
        </div>
      </div>

      {/* Kementerian Hierarchical Filter Bar */}
      <KementerianFilterBar filters={filters} setFilters={setFilters} />

      {/* High-Density KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Inflow', value: (stats.totalIn / 1000000).toFixed(1), sub: 'Juta IDR', icon: ArrowDownLeft, color: 'text-emerald-600' },
          { label: 'Total Outflow', value: (stats.totalOut / 1000000).toFixed(1), sub: 'Juta IDR', icon: ArrowUpRight, color: 'text-rose-600' },
          { label: 'Net Cashflow', value: (stats.net / 1000000).toFixed(1), sub: 'Juta IDR', icon: Wallet, color: 'text-slate-900' },
          { label: 'Pending Audit', value: stats.pendingCount, sub: 'Vouchers', icon: Clock, color: 'text-amber-600' },
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

      <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
        <div className="space-y-6">
           {/* Search & Tabs */}
           <Card className="border-none shadow-sm bg-slate-50/50">
              <CardContent className="p-4">
                 <div className="flex flex-col gap-4 md:flex-row md:items-center">
                    <div className="relative flex-1">
                       <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                       <Input
                         placeholder="CARI ENTITAS, INVOICE, ATAU DESKRIPSI..."
                         value={search}
                         onChange={(e) => setSearch(e.target.value)}
                         className="pl-9 bg-white border-slate-200 h-11 text-sm font-bold   focus:ring-slate-900"
                       />
                    </div>
                    {!isKementerian && (
                      <Button className="h-11 bg-slate-900 text-white font-semibold text-xs   px-6 shadow-lg">
                        <Plus className="h-4 w-4 mr-2" /> CATAT TRANSAKSI
                      </Button>
                    )}
                 </div>
              </CardContent>
           </Card>

           <Tabs defaultValue="masuk" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-slate-100 p-1 h-12 rounded-2xl shadow-inner">
                 <TabsTrigger value="masuk" className="rounded-xl font-semibold text-xs   gap-2 data-[state=active]:bg-white data-[state=active]:shadow-md">
                    <ArrowDownLeft className="h-3.5 w-3.5" /> Inflow Nasional
                 </TabsTrigger>
                 <TabsTrigger value="keluar" className="rounded-xl font-semibold text-xs   gap-2 data-[state=active]:bg-white data-[state=active]:shadow-md">
                    <ArrowUpRight className="h-3.5 w-3.5" /> Outflow Operasional
                 </TabsTrigger>
              </TabsList>

              <TabsContent value="masuk" className="mt-6 space-y-4">
                 {filteredIn.map((payment) => (
                    <Card key={payment.id} className="group border-none shadow-sm hover:shadow-xl transition-all duration-300 bg-white overflow-hidden border-l-4 border-l-emerald-500">
                       <CardContent className="p-5 flex items-center justify-between">
                          <div className="flex items-center gap-5">
                             <div className="h-12 w-12 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0 shadow-inner">
                                <ArrowDownLeft className="h-6 w-6 text-emerald-600" />
                             </div>
                             <div>
                                <div className="flex items-center gap-2">
                                   <p className="text-xs font-semibold text-slate-900  ">{payment.dari}</p>
                                   <Badge variant="outline" className="text-xs font-semibold  text-slate-400 border-slate-200">{payment.region}</Badge>
                                </div>
                                <div className="flex items-center gap-3 mt-1.5">
                                   <Badge className="bg-slate-900 text-white text-xs font-semibold   h-4 px-1.5">{payment.invoice}</Badge>
                                   <span className="text-xs font-bold text-slate-400  ">{formatDate(payment.tanggal)}</span>
                                </div>
                             </div>
                          </div>
                          <div className="flex items-center gap-6">
                             <div className="text-right">
                                <p className="text-lg font-semibold text-emerald-600 ">+{formatCurrency(payment.jumlah)}</p>
                                <div className="flex items-center justify-end gap-1 text-xs font-bold text-slate-400  mt-0.5">
                                   <Building className="h-2.5 w-2.5" />
                                   {payment.metode} • {payment.bank}
                                </div>
                             </div>
                             <div className="flex flex-col items-center gap-1.5">
                                <Badge className={`h-5 text-xs font-semibold  px-2 rounded border-none ${
                                  payment.status === 'verified' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                                }`}>
                                   {payment.status}
                                </Badge>
                                <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-300 group-hover:text-slate-900">
                                   <ArrowRight className="h-3.5 w-3.5" />
                                </Button>
                             </div>
                          </div>
                       </CardContent>
                    </Card>
                 ))}
              </TabsContent>

              <TabsContent value="keluar" className="mt-6 space-y-4">
                 {filteredOut.map((payment) => (
                    <Card key={payment.id} className="group border-none shadow-sm hover:shadow-xl transition-all duration-300 bg-white overflow-hidden border-l-4 border-l-rose-500">
                       <CardContent className="p-5 flex items-center justify-between">
                          <div className="flex items-center gap-5">
                             <div className="h-12 w-12 rounded-xl bg-rose-50 flex items-center justify-center shrink-0 shadow-inner">
                                <ArrowUpRight className="h-6 w-6 text-rose-600" />
                             </div>
                             <div>
                                <div className="flex items-center gap-2">
                                   <p className="text-xs font-semibold text-slate-900  ">{payment.kepada}</p>
                                   <Badge variant="outline" className="text-xs font-semibold  text-slate-400 border-slate-200">{payment.region}</Badge>
                                </div>
                                <p className="text-xs font-bold text-slate-500  mt-1 leading-tight">{payment.deskripsi}</p>
                                <div className="flex items-center gap-3 mt-2">
                                   <Badge className="bg-slate-100 text-slate-600 text-xs font-semibold  h-4 px-1.5 border-none">{payment.tipe}</Badge>
                                   <span className="text-xs font-bold text-slate-400  ">{formatDate(payment.tanggal)}</span>
                                </div>
                             </div>
                          </div>
                          <div className="flex items-center gap-6">
                             <div className="text-right">
                                <p className="text-lg font-semibold text-rose-600 ">-{formatCurrency(payment.jumlah)}</p>
                                <div className="flex items-center justify-end gap-1 text-xs font-bold text-slate-400  mt-0.5">
                                   {payment.metode === 'Cash' ? <Banknote className="h-2.5 w-2.5" /> : <CreditCard className="h-2.5 w-2.5" />}
                                   {payment.metode}
                                </div>
                             </div>
                             <div className="flex flex-col items-center gap-1.5">
                                <Badge className="h-5 text-xs font-semibold  px-2 rounded border-none bg-emerald-100 text-emerald-700">
                                   COMPLETED
                                </Badge>
                                <Button variant="ghost" size="icon" className="h-6 w-6 text-slate-300 group-hover:text-slate-900">
                                   <ArrowRight className="h-3.5 w-3.5" />
                                </Button>
                             </div>
                          </div>
                       </CardContent>
                    </Card>
                 ))}
              </TabsContent>
           </Tabs>
        </div>

        {/* Audit Side Panel */}
        <div className="space-y-6">
           <Card className="border-none shadow-xl bg-slate-950 text-white overflow-hidden">
              <CardHeader className="p-5 border-b border-white/5 bg-slate-900/50">
                 <div className="flex items-center justify-between">
                    <CardTitle className="text-xs font-semibold   flex items-center gap-2">
                       <Activity className="h-4 w-4 text-emerald-500" /> CASHFLOW FEED
                    </CardTitle>
                    <div className="flex items-center gap-1.5">
                       <div className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-ping" />
                       <span className="text-xs font-semibold text-emerald-500 ">LIVE</span>
                    </div>
                 </div>
              </CardHeader>
              <CardContent className="p-0">
                 <div className="divide-y divide-white/5">
                    {[
                      { time: '14:30', action: 'BCA Settlement: PM-042', status: 'SUCCESS', val: '+4.2M' },
                      { time: '14:15', action: 'Vendor Payout: PK-012', status: 'COMPLETED', val: '-120JT' },
                      { time: '13:58', action: 'Anomaly: Large Outflow', status: 'WARN', val: '-850JT' },
                      { time: '13:42', action: 'Invoice Batch Sync', status: 'INFO', val: '42 ITEMS' },
                    ].map((log, i) => (
                      <div key={i} className="p-5 hover:bg-white/5 transition-colors cursor-pointer group">
                         <div className="flex items-center justify-between mb-2">
                            <Badge className={`text-xs font-semibold  px-1.5 h-4 border-none ${
                              log.status === 'WARN' ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-400'
                            }`}>
                               {log.status}
                            </Badge>
                            <span className="text-xs font-mono text-slate-600">{log.time}</span>
                         </div>
                         <p className="text-sm font-semibold text-slate-200  leading-tight group-hover:text-emerald-400 transition-colors">{log.action}</p>
                         <p className={`text-xs font-semibold mt-1 ${log.val.startsWith('+') ? 'text-emerald-400' : 'text-slate-500'}`}>{log.val}</p>
                      </div>
                    ))}
                 </div>
                 <div className="p-4 bg-white/5 border-t border-white/5 text-center">
                    <Button variant="ghost" className="w-full text-xs font-semibold text-slate-500 hover:text-white   h-10">
                       Buka Konsol Settlement →
                    </Button>
                 </div>
              </CardContent>
           </Card>

           <Card className="border-none shadow-sm bg-slate-50">
              <CardHeader className="p-4 border-b border-slate-200">
                 <CardTitle className="text-xs font-semibold   text-slate-900">Health Check: Payment API</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                 {[
                   { label: 'Bank Gateway', val: '99.9%', status: 'Online' },
                   { label: 'VAT Calculation', val: 'Active', status: 'Synced' },
                   { label: 'Audit Compliance', val: '100%', status: 'Clear' },
                 ].map((h, i) => (
                    <div key={i} className="flex items-center justify-between">
                       <span className="text-xs font-bold text-slate-500 ">{h.label}</span>
                       <div className="text-right">
                          <p className="text-xs font-semibold text-slate-900 ">{h.val}</p>
                          <p className="text-xs font-bold text-emerald-600 ">{h.status}</p>
                       </div>
                    </div>
                 ))}
              </CardContent>
           </Card>
        </div>
      </div>

      {/* Global Financial Alert Banner */}
      <Card className="bg-rose-600 border-none overflow-hidden relative shadow-2xl shadow-rose-100 group cursor-pointer">
        <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform duration-700">
          <ShieldAlert className="h-32 w-32 text-white" />
        </div>
        <CardContent className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-8 relative">
          <div className="flex items-center gap-6">
             <div className="h-14 w-14 rounded-2xl bg-white/20 border border-white/10 flex items-center justify-center shrink-0">
                <Globe className="h-7 w-7 text-white animate-pulse" />
             </div>
             <div>
                <div className="flex items-center gap-3">
                   <Badge className="bg-white text-rose-600 font-semibold text-xs px-2 h-5 border-none">COMPLIANCE ALERT</Badge>
                   <span className="text-xs font-semibold text-rose-100  ">Unreconciled Batch Detected</span>
                </div>
                <p className="text-white text-base font-semibold  mt-2 ">Perhatian: Terdeteksi batch transaksi yang belum direkonsiliasi di wilayah Sumatera Utara (Rp 1.2M).</p>
             </div>
          </div>
          <Button className="h-12 bg-white text-rose-600 hover:bg-slate-100 font-semibold text-sm   px-8 rounded-xl shadow-xl transition-all">
             Audit Settlement →
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
