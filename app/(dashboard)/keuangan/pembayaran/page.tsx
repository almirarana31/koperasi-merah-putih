'use client'

import { useState, useMemo } from 'react'
import { useToast } from '@/components/ui/use-toast'
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
  History,
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
  const { toast } = useToast()
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
    const totalIn = filteredIn.reduce((acc, p) => acc + p.jumlah, 0) * scale * 100
    const totalOut = filteredOut.reduce((acc, p) => acc + p.jumlah, 0) * scale * 100
    return {
      totalIn,
      totalOut,
      net: totalIn - totalOut,
      pendingCount: Math.round(filteredIn.filter(p => p.status === 'pending').length * scale * 10)
    }
  }, [filteredIn, filteredOut, filters])

  if (!user) return null

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">PUSAT PENYELESAIAN NASIONAL</h1>
          <p className="text-[10px] font-black text-slate-500 mt-1 uppercase tracking-widest leading-relaxed">
            MONITORING ARUS KAS & PENYELESAIAN TRANSAKSI ANTAR WILAYAH • BUKU BESAR KEUANGAN LANGSUNG
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
           <Button variant="outline" size="sm" className="h-9 text-[10px] font-black uppercase tracking-widest border-slate-200 text-slate-600 rounded-none shadow-sm" onClick={() => toast({ title: "Audit Pajak", description: "Menyiapkan laporan kepatuhan pajak nasional..." })}>
            <FileText className="h-3.5 w-3.5 mr-2 text-rose-600" />
            LAPORAN PAJAK
          </Button>
          <Button size="sm" className="h-9 bg-slate-900 text-white hover:bg-slate-800 text-[10px] font-black uppercase tracking-widest px-6 rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] transition-all" onClick={() => toast({ title: "Ekspor Buku Besar", description: "Mengekspor buku besar keuangan nasional untuk periode aktif..." })}>
            <Download className="h-4 w-4 mr-2" />
            EKSPOR BUKU BESAR
          </Button>
        </div>
      </div>

      <KementerianFilterBar filters={filters} setFilters={setFilters} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'TOTAL INFLOW', value: (stats.totalIn / 1000000).toFixed(1), sub: 'JUTA IDR', icon: ArrowDownLeft, tone: 'emerald' },
          { label: 'TOTAL OUTFLOW', value: (stats.totalOut / 1000000).toFixed(1), sub: 'JUTA IDR', icon: ArrowUpRight, tone: 'rose' },
          { label: 'ARUS KAS BERSIH', value: (stats.net / 1000000).toFixed(1), sub: 'JUTA IDR', icon: Wallet, tone: 'slate' },
          { label: 'AUDIT TERTUNDA', value: stats.pendingCount, sub: 'VOUCHER', icon: Clock, tone: 'amber' },
        ].map((s, i) => (
          <Card key={i} className="border-none shadow-sm bg-white overflow-hidden rounded-none">
            <div className={`h-1 w-full ${
              s.tone === 'emerald' ? 'bg-emerald-500' : 
              s.tone === 'rose' ? 'bg-rose-500' : 
              s.tone === 'amber' ? 'bg-amber-500' : 'bg-slate-900'
            }`} />
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-10 w-10 rounded-none bg-slate-50 flex items-center justify-center shrink-0 shadow-inner">
                <s.icon className={`h-5 w-5 ${
                  s.tone === 'emerald' ? 'text-emerald-500' : 
                  s.tone === 'rose' ? 'text-rose-500' : 
                  s.tone === 'amber' ? 'text-amber-500' : 'text-slate-900'
                }`} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.label}</p>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-xl font-black text-slate-900">{s.value}</span>
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">{s.sub}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_350px]">
        <div className="space-y-6">
           <Card className="border-none shadow-sm bg-white overflow-hidden rounded-none">
              <div className="h-1 w-full bg-slate-900" />
              <CardContent className="p-4">
                 <div className="flex flex-col gap-4 md:flex-row md:items-center">
                    <div className="relative flex-1">
                       <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                       <Input
                         placeholder="CARI ENTITAS, INVOICE, ATAU DESKRIPSI TRANSAKSI..."
                         value={search}
                         onChange={(e) => setSearch(e.target.value)}
                         className="pl-9 h-11 text-[10px] font-black uppercase tracking-widest bg-slate-50 border-slate-100 rounded-none focus-visible:ring-slate-900"
                       />
                    </div>
                    {!isKementerian && (
                      <Button className="h-11 bg-slate-900 text-white hover:bg-slate-800 text-[10px] font-black uppercase tracking-widest px-6 rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] transition-all">
                        <Plus className="h-4 w-4 mr-2" /> CATAT TRANSAKSI
                      </Button>
                    )}
                 </div>
              </CardContent>
           </Card>

           <Tabs defaultValue="masuk" className="w-full">
              <TabsList className="bg-slate-100 p-1 h-11 rounded-none shadow-inner w-full flex">
                 <TabsTrigger value="masuk" className="flex-1 rounded-none font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-md gap-2">
                    <ArrowDownLeft className="h-3 w-3" /> INFLOW NASIONAL
                 </TabsTrigger>
                 <TabsTrigger value="keluar" className="flex-1 rounded-none font-black text-[10px] uppercase tracking-widest data-[state=active]:bg-white data-[state=active]:shadow-md gap-2">
                    <ArrowUpRight className="h-3 w-3" /> OUTFLOW OPERASIONAL
                 </TabsTrigger>
              </TabsList>

              <TabsContent value="masuk" className="mt-6 space-y-4">
                 {filteredIn.map((payment) => (
                    <Card key={payment.id} className="border-none shadow-sm bg-white overflow-hidden rounded-none group hover:shadow-md transition-all">
                       <div className="h-1 w-full bg-emerald-500" />
                       <CardContent className="p-5 flex items-center justify-between">
                          <div className="flex items-center gap-5">
                             <div className="h-12 w-12 rounded-none bg-emerald-50 flex items-center justify-center shrink-0 shadow-inner">
                                <ArrowDownLeft className="h-6 w-6 text-emerald-600" />
                             </div>
                             <div>
                                <div className="flex items-center gap-2">
                                   <p className="text-xs font-black text-slate-900 uppercase tracking-tight">{payment.dari}</p>
                                   <Badge className="bg-slate-100 text-slate-500 text-[9px] font-black border-none px-1.5 h-4 uppercase rounded-none tracking-tighter">{payment.region}</Badge>
                                </div>
                                <div className="flex items-center gap-3 mt-1.5">
                                   <Badge className="bg-slate-900 text-white text-[9px] font-black h-4 px-1.5 rounded-none">{payment.invoice}</Badge>
                                   <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{formatDate(payment.tanggal)}</span>
                                </div>
                             </div>
                          </div>
                          <div className="flex items-center gap-6">
                             <div className="text-right">
                                <p className="text-sm font-black text-emerald-600 uppercase">+{formatCurrency(payment.jumlah)}</p>
                                <div className="flex items-center justify-end gap-1 text-[9px] font-bold text-slate-400 uppercase mt-0.5">
                                   <Building className="h-2.5 w-2.5" />
                                   {payment.metode} • {payment.bank}
                                </div>
                             </div>
                             <div className="flex flex-col items-center gap-1.5">
                                <Badge className={`h-4 text-[9px] font-black px-1.5 rounded-none border-none uppercase ${
                                  payment.status === 'verified' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                                }`}>
                                   {payment.status}
                                </Badge>
                                <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-300 group-hover:text-slate-900 rounded-none group-hover:bg-slate-50 transition-all">
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
                    <Card key={payment.id} className="border-none shadow-sm bg-white overflow-hidden rounded-none group hover:shadow-md transition-all">
                       <div className="h-1 w-full bg-rose-500" />
                       <CardContent className="p-5 flex items-center justify-between">
                          <div className="flex items-center gap-5">
                             <div className="h-12 w-12 rounded-none bg-rose-50 flex items-center justify-center shrink-0 shadow-inner">
                                <ArrowUpRight className="h-6 w-6 text-rose-600" />
                             </div>
                             <div>
                                <div className="flex items-center gap-2">
                                   <p className="text-xs font-black text-slate-900 uppercase tracking-tight">{payment.kepada}</p>
                                   <Badge className="bg-slate-100 text-slate-500 text-[9px] font-black border-none px-1.5 h-4 uppercase rounded-none tracking-tighter">{payment.region}</Badge>
                                </div>
                                <p className="text-[10px] font-bold text-slate-500 mt-1 uppercase leading-tight">{payment.deskripsi}</p>
                                <div className="flex items-center gap-3 mt-2">
                                   <Badge className="bg-slate-900 text-white text-[9px] font-black h-4 px-1.5 rounded-none uppercase">{payment.tipe}</Badge>
                                   <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{formatDate(payment.tanggal)}</span>
                                </div>
                             </div>
                          </div>
                          <div className="flex items-center gap-6">
                             <div className="text-right">
                                <p className="text-sm font-black text-rose-600 uppercase">-{formatCurrency(payment.jumlah)}</p>
                                <div className="flex items-center justify-end gap-1 text-[9px] font-bold text-slate-400 uppercase mt-0.5">
                                   {payment.metode === 'Cash' ? <Banknote className="h-2.5 w-2.5" /> : <CreditCard className="h-2.5 w-2.5" />}
                                   {payment.metode.toUpperCase()}
                                </div>
                             </div>
                             <div className="flex flex-col items-center gap-1.5">
                                <Badge className="h-4 text-[9px] font-black px-1.5 rounded-none border-none bg-emerald-100 text-emerald-700 uppercase">
                                   COMPLETED
                                </Badge>
                                <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-300 group-hover:text-slate-900 rounded-none group-hover:bg-slate-50 transition-all">
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

        <div className="space-y-6">
           <Card className="border-none shadow-xl bg-slate-950 text-white overflow-hidden rounded-none">
              <CardHeader className="p-4 border-b border-white/5 bg-slate-900/50">
                 <div className="flex items-center justify-between">
                     <CardTitle className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                        <Activity className="h-4 w-4 text-emerald-500" /> FEED ARUS KAS
                     </CardTitle>
                     <div className="flex items-center gap-1.5">
                        <div className="h-1 w-1 bg-emerald-500 rounded-full animate-ping" />
                        <span className="text-[9px] font-black text-emerald-500 tracking-widest">LANGSUNG</span>
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
                      <div key={i} className="p-4 hover:bg-white/5 transition-colors cursor-pointer group">
                         <div className="flex items-center justify-between mb-2">
                            <Badge className={`text-[9px] font-black px-1.5 h-4 border-none rounded-none tracking-widest ${
                              log.status === 'WARN' ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-400'
                            }`}>
                               {log.status}
                            </Badge>
                            <span className="text-[9px] font-mono text-slate-600 group-hover:text-slate-400">{log.time}</span>
                         </div>
                         <p className="text-xs font-black text-slate-200 uppercase tracking-tight leading-tight group-hover:text-emerald-400 transition-colors">{log.action}</p>
                         <p className={`text-[9px] font-bold mt-1 uppercase ${log.val.startsWith('+') ? 'text-emerald-400' : 'text-slate-500'}`}>{log.val}</p>
                      </div>
                    ))}
                 </div>
                 <div className="p-4 bg-white/5 border-t border-white/5">
                    <Button 
                      variant="ghost" 
                      className="w-full text-[10px] font-black text-slate-500 hover:text-white uppercase tracking-widest h-9 rounded-none"
                      onClick={() => toast({ title: "Settlement Hub", description: "Menginisialisasi konsol penyelesaian nasional..." })}
                    >
                       BUKA KONSOL SETTLEMENT →
                    </Button>
                 </div>
              </CardContent>
           </Card>

           <Card className="border-none shadow-sm bg-slate-50 rounded-none">
              <CardHeader className="p-4 border-b border-slate-200">
                 <CardTitle className="text-[10px] font-black uppercase tracking-widest text-slate-900">PEMERIKSAAN API PEMBAYARAN</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                 {[
                   { label: 'GATEWAY BANK', val: '99.9%', status: 'ONLINE' },
                   { label: 'KALKULASI PPN', val: 'AKTIF', status: 'SINKRON' },
                   { label: 'KEPATUHAN AUDIT', val: '100%', status: 'BERSIH' },
                 ].map((h, i) => (
                    <div key={i} className="flex items-center justify-between">
                       <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{h.label}</span>
                       <div className="text-right">
                          <p className="text-[10px] font-black text-slate-900">{h.val}</p>
                          <p className="text-[9px] font-black text-emerald-600 uppercase tracking-tighter">{h.status}</p>
                       </div>
                    </div>
                 ))}
              </CardContent>
           </Card>
        </div>
      </div>

      <Card className="alert-surface-banner border-none overflow-hidden relative group cursor-pointer bg-rose-50 border border-rose-100 rounded-none" onClick={() => toast({ title: "Audit Kepatuhan", description: "Mengaudit rekonsiliasi batch Sumatera Utara..." })}>
        <div className="absolute top-0 right-0 p-6 opacity-10 transition-transform duration-700 group-hover:scale-110">
          <ShieldAlert className="h-32 w-32 text-rose-900" />
        </div>
        <CardContent className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-8 relative">
          <div className="flex items-center gap-6">
             <div className="flex h-14 w-14 items-center justify-center rounded-none bg-rose-600 text-white shadow-xl shadow-rose-200 shrink-0">
                <Globe className="h-7 w-7" />
             </div>
             <div>
                <div className="flex items-center gap-3">
                   <Badge className="bg-rose-600 text-white text-[10px] font-black px-2 h-5 rounded-none tracking-widest border-none">PERINGATAN KEPATUHAN</Badge>
                   <span className="text-[10px] font-black text-rose-900 uppercase tracking-widest">BATCH TIDAK TERKONSILIASI TERDETEKSI</span>
                </div>
                <p className="mt-2 text-lg font-black text-rose-900 uppercase tracking-tight">PERHATIAN: TERDETEKSI BATCH TRANSAKSI YANG BELUM DIREKONSILIASI DI WILAYAH SUMATERA UTARA (RP 1.2M).</p>
              </div>
           </div>
           <Button className="bg-rose-900 text-white hover:bg-rose-800 h-12 rounded-none px-8 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-rose-200 transition-all">
              AUDIT PENYELESAIAN
           </Button>
        </CardContent>
      </Card>
    </div>
  )
}
