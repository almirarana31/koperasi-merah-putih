'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Search,
  Plus,
  Wallet,
  CreditCard,
  AlertTriangle,
  CheckCircle,
  User,
  Calendar,
  Percent,
  TrendingUp,
  Download,
  History,
  Activity,
  ArrowUpRight,
  PieChart,
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
import { Progress } from '@/components/ui/progress'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import { useToast } from '@/components/ui/use-toast'
import { useAuth } from '@/lib/auth/use-auth'
import { KementerianFilterBar } from '@/components/dashboard/kementerian-filter-bar'
import { loans, members, formatCurrency, formatDate, getStatusColor } from '@/lib/data'
import type { ScopeFilters } from '@/lib/kementerian-dashboard-data'

export default function SimpanPinjamPage() {
  const { user } = useAuth()
  const { toast } = useToast()
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
    if (filters.villageId !== 'all') return 0.15
    if (filters.regionId !== 'all') return 0.4
    if (filters.provinceId !== 'all') return 0.7
    return 1.0
  }, [filters])

  const stats = useMemo(() => {
    const totalSimpanan = 4528000000 * scaleFactor
    const totalPinjaman = 2145000000 * scaleFactor
    const outstanding = 842000000 * scaleFactor
    const repaymentRate = (96.2).toFixed(1)
    return { totalSimpanan, totalPinjaman, outstanding, repaymentRate }
  }, [scaleFactor])

  const filteredLoans = useMemo(() => {
    return loans.filter((loan) => {
      const matchesSearch = loan.memberNama.toLowerCase().includes(search.toLowerCase())
      return matchesSearch
    })
  }, [search])

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild className="h-8 w-8 hover:bg-slate-100 rounded-none">
              <Link href="/keuangan">
                <ArrowLeft className="h-4 w-4 text-slate-600" />
              </Link>
            </Button>
            <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">PUSAT SIMPAN PINJAM</h1>
          </div>
          <p className="text-[10px] font-black text-slate-500 mt-1 uppercase tracking-widest leading-relaxed ml-12">
            MONITORING PORTOFOLIO KOPERASI NASIONAL • {formatCurrency(stats.totalSimpanan)} TOTAL MODAL DIKELOLA
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" className="h-9 text-[10px] font-black uppercase tracking-widest border-slate-200 text-slate-600 rounded-none" onClick={() => toast({ title: "Sinkronisasi Portofolio", description: "Mengambil data buku besar anggota real-time..." })}>
            <History className="h-3.5 w-3.5 mr-2 text-blue-600" />
            RIWAYAT
          </Button>
          <Button size="sm" className="h-9 bg-slate-900 text-white hover:bg-slate-800 text-[10px] font-black uppercase tracking-widest px-6 rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] transition-all" onClick={() => toast({ title: "Pengajuan Pinjaman", description: "Membuka portal entri kredit..." })}>
            <Plus className="h-4 w-4 mr-2" />
            PENGAJUAN BARU
          </Button>
        </div>
      </div>

      <KementerianFilterBar filters={filters} setFilters={setFilters} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'TOTAL SIMPANAN', value: formatCurrency(stats.totalSimpanan), sub: 'MODAL DIKELOLA', icon: Wallet, tone: 'emerald' },
          { label: 'TOTAL PINJAMAN', value: formatCurrency(stats.totalPinjaman), sub: 'KREDIT AKTIF', icon: CreditCard, tone: 'blue' },
          { label: 'SALDO TERHUTANG', value: formatCurrency(stats.outstanding), sub: 'RISIKO PIUTANG', icon: AlertTriangle, tone: 'rose' },
          { label: 'TINGKAT PENGEMBALIAN', value: stats.repaymentRate + '%', sub: 'RATA-RATA NASIONAL', icon: TrendingUp, tone: 'emerald' },
        ].map((s, i) => (
          <Card key={i} className="border-none shadow-sm bg-white overflow-hidden">
             <div className={`h-1 w-full ${
              s.tone === 'emerald' ? 'bg-emerald-500' : 
              s.tone === 'blue' ? 'bg-blue-500' : 
              s.tone === 'rose' ? 'bg-rose-500' : 'bg-slate-900'
            }`} />
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-10 w-10 rounded-none bg-slate-50 flex items-center justify-center shrink-0 shadow-inner">
                <s.icon className={`h-5 w-5 ${
                  s.tone === 'emerald' ? 'text-emerald-500' : 
                  s.tone === 'blue' ? 'text-blue-500' : 
                  s.tone === 'rose' ? 'text-rose-500' : 'text-slate-900'
                }`} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{s.label}</p>
                <div className="flex flex-col">
                  <span className="text-sm font-black text-slate-900 leading-tight">{s.value}</span>
                  <span className="text-[8px] font-bold text-slate-500 uppercase tracking-tighter">{s.sub}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="pinjaman" className="space-y-6">
        <TabsList className="bg-slate-100 p-1 h-11 rounded-none shadow-inner w-full sm:w-auto">
          <TabsTrigger value="pinjaman" className="rounded-none font-black text-[10px] uppercase tracking-widest px-8 data-[state=active]:bg-white data-[state=active]:shadow-md">BUKU BESAR KREDIT NASIONAL</TabsTrigger>
          <TabsTrigger value="simpanan" className="rounded-none font-black text-[10px] uppercase tracking-widest px-8 data-[state=active]:bg-white data-[state=active]:shadow-md">KUMPULAN MODAL DIKELOLA</TabsTrigger>
        </TabsList>

        <TabsContent value="pinjaman" className="space-y-6">
          <Card className="border-none bg-white shadow-sm overflow-hidden rounded-none">
            <div className="h-1 w-full bg-slate-900" />
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="CARI BERDASARKAN NAMA ANGGOTA ATAU ID PINJAMAN..."
                  className="pl-9 h-11 text-[10px] font-black uppercase tracking-widest bg-slate-50 border-slate-100 rounded-none focus-visible:ring-slate-900"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-none bg-white shadow-sm overflow-hidden rounded-none">
            <div className="h-1 w-full bg-slate-900" />
            <CardHeader className="p-6 border-b border-slate-50">
              <div className="flex items-center justify-between">
                 <div>
                    <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-900">MANIFEST PORTOFOLIO KREDIT</CardTitle>
                    <CardDescription className="text-[10px] font-bold text-slate-400 uppercase mt-1">AUDIT REAL-TIME AKUN PINJAMAN AKTIF</CardDescription>
                 </div>
                 <Button variant="outline" size="sm" className="h-8 text-[9px] font-black uppercase tracking-widest border-slate-200 rounded-none" onClick={() => toast({ title: "Inisiasi Ekspor", description: "Menyiapkan manifest pinjaman untuk audit nasional..." })}>
                    <Download className="h-3 w-3 mr-2" /> EKSPOR MANIFEST
                 </Button>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-slate-900">
                  <TableRow className="hover:bg-slate-900 border-none">
                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400 h-10 px-6">ANGGOTA / WILAYAH</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400 h-10 px-6 text-right">POKOK</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400 h-10 px-6 text-right">PENGEMBALIAN</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400 h-10 px-6">STATUS</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400 h-10 px-6 text-right">AUDIT</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLoans.map((loan) => {
                    const progressPercent = ((loan.jumlahPinjaman - loan.sisaPinjaman) / loan.jumlahPinjaman) * 100
                    return (
                      <TableRow key={loan.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors group">
                        <TableCell className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 bg-slate-100 flex items-center justify-center font-black text-[10px] text-slate-500 rounded-none">
                               {loan.memberNama.split(' ')[1]?.[0] || loan.memberNama[0]}
                            </div>
                            <div>
                               <p className="text-xs font-black text-slate-900 uppercase tracking-tight">{loan.memberNama}</p>
                               <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">#{loan.id}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="px-6 py-4 text-right">
                          <p className="text-xs font-black text-slate-900">{formatCurrency(loan.jumlahPinjaman)}</p>
                          <p className="text-[9px] font-bold text-slate-400 uppercase">{loan.tenor}M @ {loan.bunga}%</p>
                        </TableCell>
                        <TableCell className="px-6 py-4 text-right">
                          <div className="flex flex-col items-end gap-1.5">
                             <div className="w-24 h-1.5 bg-slate-100 rounded-none overflow-hidden">
                                <div className="h-full bg-emerald-500" style={{ width: `${progressPercent}%` }} />
                             </div>
                              <p className="text-[9px] font-black text-slate-900">{Math.round(progressPercent)}% TERKUMPUL</p>
                           </div>
                        </TableCell>
                        <TableCell className="px-6 py-4">
                          <Badge className={`text-[9px] font-black border-none px-2 h-5 uppercase rounded-none ${getStatusColor(loan.status)}`}>
                            {loan.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="px-6 py-4 text-right">
                          <Button variant="ghost" size="sm" className="h-8 text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 hover:bg-white rounded-none group-hover:shadow-sm" onClick={() => toast({ title: "Audit Akun", description: "Memuat buku besar rinci untuk " + loan.id })}>
                             DETAIL
                          </Button>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="simpanan" className="space-y-6">
           <div className="grid gap-6 lg:grid-cols-3">
               <Card className="border-none shadow-xl bg-slate-950 text-white overflow-hidden rounded-none lg:col-span-2">
                 <CardHeader className="p-6 border-b border-white/5 bg-slate-900/50">
                    <div className="flex items-center justify-between">
                       <CardTitle className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                          <Activity className="h-4 w-4 text-emerald-500" /> FEED ALIRAN MODAL
                       </CardTitle>
                       <div className="flex items-center gap-1.5">
                          <div className="h-1 w-1 bg-emerald-500 rounded-full animate-ping" />
                          <span className="text-[9px] font-black text-emerald-500 tracking-widest">SINKRONISASI</span>
                       </div>
                    </div>
                 </CardHeader>
                 <CardContent className="p-0">
                    <div className="divide-y divide-white/5">
                       {members.slice(0, 5).map((m, i) => (
                          <div key={i} className="p-4 hover:bg-white/5 transition-all cursor-pointer group">
                             <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                   <div className="h-10 w-10 bg-white/5 flex items-center justify-center font-black text-[10px] text-white/40">
                                      {m.nama.split(' ')[1]?.[0] || m.nama[0]}
                                   </div>
                                   <div>
                                      <p className="text-[11px] font-black text-white uppercase tracking-tight">{m.nama}</p>
                                      <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">SIMPANAN WAJIB • {m.status}</p>
                                   </div>
                                </div>
                                <div className="text-right">
                                   <p className="text-xs font-black text-emerald-400">+{formatCurrency(m.simpananWajib)}</p>
                                   <p className="text-[9px] font-bold text-slate-500 uppercase">SELESAI HARI INI</p>
                                </div>
                             </div>
                          </div>
                       ))}
                    </div>
                 </CardContent>
              </Card>

              <div className="space-y-6">
                 <Card className="border-none shadow-sm bg-slate-50 rounded-none">
                    <CardHeader className="p-4 border-b border-slate-200">
                       <CardTitle className="text-[10px] font-black uppercase tracking-widest text-slate-900">STRUKTUR MODAL</CardTitle>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                       {[
                         { label: 'POKOK (FONDASI)', val: '42.4%', color: 'bg-emerald-500' },
                         { label: 'WAJIB (OPERASIONAL)', val: '38.6%', color: 'bg-blue-500' },
                         { label: 'SUKARELA (LIKUID)', val: '19.0%', color: 'bg-slate-900' },
                       ].map((c, i) => (
                          <div key={i} className="space-y-2">
                             <div className="flex items-center justify-between">
                                <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{c.label}</span>
                                <span className="text-[10px] font-black text-slate-900">{c.val}</span>
                             </div>
                             <div className="h-1.5 w-full bg-slate-200 rounded-none overflow-hidden">
                                <div className={`h-full ${c.color}`} style={{ width: c.val }} />
                             </div>
                          </div>
                       ))}
                    </CardContent>
                 </Card>

                  <Card className="border-none shadow-sm bg-white rounded-none border border-slate-100">
                    <CardHeader className="p-4 border-b border-slate-100">
                       <CardTitle className="text-[10px] font-black uppercase tracking-widest text-slate-900">MITIGASI RISIKO</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 space-y-4">
                       {[
                         { label: 'RASIO CADANGAN', val: '12.4%', status: 'Optimal' },
                         { label: 'INDEKS LIKUIDITAS', val: '1.82', status: 'Stabil' },
                       ].map((h, i) => (
                          <div key={i} className="flex items-center justify-between">
                             <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{h.label}</span>
                             <div className="text-right">
                                <p className="text-[10px] font-black text-slate-900">{h.val}</p>
                                <p className="text-[9px] font-black text-emerald-600 uppercase tracking-tighter">{h.status}</p>
                             </div>
                          </div>
                       ))}
                       <Button variant="ghost" className="w-full text-[9px] font-black text-slate-500 hover:text-slate-900 uppercase tracking-widest h-8 rounded-none border-t border-slate-50 pt-2" onClick={() => toast({ title: "Modul Risiko", description: "Memuat heatmap risiko modal nasional..." })}>
                          ANALITIK LENGKAP →
                       </Button>
                    </CardContent>
                 </Card>
              </div>
           </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
