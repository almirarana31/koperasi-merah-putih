'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  FileCheck2,
  FileWarning,
  PiggyBank,
  Sparkles,
  TrendingUp,
  Wallet,
  ShieldAlert,
  Globe,
  Activity,
  Download,
  FileText,
  Search,
  Filter,
  BarChart3,
} from 'lucide-react'
import { useAuth } from '@/lib/auth/use-auth'
import { formatCurrency, formatDate, loans, members } from '@/lib/data'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { KementerianFilterBar } from '@/components/dashboard/kementerian-filter-bar'
import { ScopeFilters } from '@/lib/kementerian-dashboard-data'

type ReviewStatus = 'baru' | 'analisis' | 'komite' | 'disetujui' | 'perlu_dokumen'

type ReviewerApplication = {
  id: string
  borrowerName: string
  village: string
  commodity: string
  amount: number
  tenor: number
  score: number
  submittedAt: string
  status: ReviewStatus
  recommendation: string
  assignedRoles: string[]
}

const REVIEWER_APPLICATIONS: ReviewerApplication[] = [
  { id: 'APL-2603-031', borrowerName: 'Pak Budi Santoso', village: 'Cikupa', commodity: 'Padi', amount: 18000000, tenor: 12, score: 742, submittedAt: '2026-03-28', status: 'analisis', recommendation: 'Riwayat pembayaran baik. Siap final approval.', assignedRoles: ['bank', 'koperasi_manager', 'ketua', 'kementerian', 'sysadmin'] },
  { id: 'APL-2603-028', borrowerName: 'Bu Sri Wahyuni', village: 'Sukamaju', commodity: 'Cabai', amount: 9000000, tenor: 9, score: 701, submittedAt: '2026-03-25', status: 'baru', recommendation: 'Dokumen lengkap, perlu scoring awal.', assignedRoles: ['bank', 'koperasi_manager', 'ketua', 'kementerian', 'sysadmin'] },
  { id: 'APL-2603-025', borrowerName: 'Pak Hendra Wijaya', village: 'Cibodas', commodity: 'Kentang', amount: 14000000, tenor: 12, score: 733, submittedAt: '2026-03-21', status: 'komite', recommendation: 'Menunggu persetujuan komite.', assignedRoles: ['bank', 'ketua', 'kementerian', 'sysadmin'] },
]

function reviewStatusMeta(status: ReviewStatus) {
  const map = {
    baru: { label: 'BARU MASUK', className: 'bg-slate-100 text-slate-700' },
    analisis: { label: 'ANALISIS', className: 'bg-blue-100 text-blue-700' },
    komite: { label: 'KOMITE', className: 'bg-violet-100 text-violet-700' },
    disetujui: { label: 'DISETUJUI', className: 'bg-emerald-100 text-emerald-700' },
    perlu_dokumen: { label: 'BUTUH DOKUMEN', className: 'bg-rose-100 text-rose-700' },
  }
  return map[status]
}

export default function PinjamanPage() {
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

  const filteredQueue = useMemo(() => {
    return REVIEWER_APPLICATIONS.filter((item) => {
      const matchesSearch = item.borrowerName.toLowerCase().includes(search.toLowerCase()) || 
                           item.id.toLowerCase().includes(search.toLowerCase())
      
      // Hierarchical Filter Simulation
      const loc = item.village.toUpperCase()
      const matchesProvince = filters.provinceId === 'all' || true // In real app, check against region hierarchy
      const matchesCommodity = filters.commodityId === 'all' || item.commodity.toUpperCase().includes(filters.commodityId.toUpperCase())
      
      return matchesSearch && matchesProvince && matchesCommodity
    })
  }, [search, filters])

  const stats = useMemo(() => {
    const totalVolume = filteredQueue.reduce((sum, i) => sum + i.amount, 0)
    const avgScore = filteredQueue.length > 0 ? filteredQueue.reduce((sum, i) => sum + i.score, 0) / filteredQueue.length : 0
    return {
      count: filteredQueue.length,
      totalVolume,
      avgScore
    }
  }, [filteredQueue])

  if (!user) return null

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-slate-900 flex items-center justify-center shadow-xl">
            <Wallet className="h-6 w-6 text-emerald-500" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 uppercase">National Credit Hub</h1>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
              Monitoring Agregat Pembiayaan & Risiko Kredit • {stats.count} Aplikasi Aktif
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
           <Button variant="outline" size="sm" className="h-10 text-[10px] font-black uppercase tracking-widest text-slate-600 border-slate-200">
            <FileText className="h-4 w-4 mr-2 text-rose-600" />
            NPL Report
          </Button>
          <Button size="sm" className="h-10 bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-black uppercase tracking-widest px-6 shadow-lg shadow-slate-200">
            <Download className="h-4 w-4 mr-2" />
            Audit PDF
          </Button>
        </div>
      </div>

      {/* Kementerian Hierarchical Filter Bar */}
      <KementerianFilterBar filters={filters} setFilters={setFilters} />

      {/* High-Density KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Antrian Aplikasi', value: stats.count.toLocaleString(), sub: 'Entitas', icon: Clock3, color: 'text-slate-900' },
          { label: 'Volume Pengajuan', value: (stats.totalVolume / 1000000).toFixed(1), sub: 'Juta IDR', icon: CircleDollarSign, color: 'text-emerald-600' },
          { label: 'Rerata Credit Score', value: Math.round(stats.avgScore), sub: 'Poin', icon: Activity, color: 'text-blue-600' },
          { label: 'Default Risk', value: '2.4%', sub: 'Nasional', icon: ShieldAlert, color: 'text-rose-600' },
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
           {/* Search & Action Bar */}
           <Card className="border-none shadow-sm bg-slate-50/50">
              <CardContent className="p-4">
                 <div className="flex flex-col gap-4 md:flex-row md:items-center">
                    <div className="relative flex-1">
                       <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                       <Input
                         placeholder="CARI NAMA PEMOHON ATAU TRX ID..."
                         value={search}
                         onChange={(e) => setSearch(e.target.value)}
                         className="pl-9 bg-white border-slate-200 h-11 text-[11px] font-bold uppercase tracking-wider focus:ring-slate-900"
                       />
                    </div>
                    <Button variant="outline" className="h-11 border-slate-200 bg-white font-black text-[10px] uppercase tracking-widest px-6 shadow-sm">
                       <Filter className="h-4 w-4 mr-2" /> Opsi Lanjut
                    </Button>
                 </div>
              </CardContent>
           </Card>

           {/* Applications List - High Density Cards */}
           <div className="space-y-4">
              {filteredQueue.map((item) => {
                const status = reviewStatusMeta(item.status)
                return (
                  <Card key={item.id} className="group border-none shadow-sm hover:shadow-xl transition-all duration-300 bg-white overflow-hidden border-l-4 border-l-slate-900">
                    <CardContent className="p-5">
                       <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                          <div className="space-y-1">
                             <div className="flex items-center gap-3">
                                <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">{item.borrowerName}</h3>
                                <Badge className={`h-5 text-[8px] font-black uppercase px-2 rounded border-none ${status.className}`}>
                                   {status.label}
                                </Badge>
                             </div>
                             <div className="flex items-center gap-4 mt-2">
                                <div className="flex items-center gap-1.5">
                                   <MapPin className="h-3 w-3 text-slate-400" />
                                   <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{item.village}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                   <Activity className="h-3 w-3 text-emerald-500" />
                                   <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">{item.commodity}</span>
                                </div>
                                <span className="text-[9px] font-mono font-bold text-slate-400 uppercase">#{item.id}</span>
                             </div>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-3">
                             <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex flex-col items-center justify-center min-w-[80px]">
                                <span className="text-[8px] font-black text-slate-400 uppercase">NOMINAL</span>
                                <span className="text-[11px] font-black text-slate-900 mt-0.5">{formatCurrency(item.amount)}</span>
                             </div>
                             <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex flex-col items-center justify-center min-w-[60px]">
                                <span className="text-[8px] font-black text-slate-400 uppercase">TENOR</span>
                                <span className="text-[11px] font-black text-slate-900 mt-0.5">{item.tenor}M</span>
                             </div>
                             <div className="p-2.5 rounded-xl bg-slate-900 text-white flex flex-col items-center justify-center min-w-[60px] shadow-lg">
                                <span className="text-[8px] font-black text-slate-500 uppercase">SCORE</span>
                                <span className="text-[11px] font-black text-emerald-400 mt-0.5">{item.score}</span>
                             </div>
                          </div>
                       </div>

                       <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between group-hover:bg-slate-100 transition-colors">
                          <p className="text-[10px] font-bold text-slate-600 italic tracking-tight leading-relaxed">"{item.recommendation}"</p>
                          <Button variant="ghost" size="sm" className="h-8 text-[9px] font-black uppercase text-slate-900 hover:bg-white shadow-sm transition-all shrink-0 ml-4">
                             DETAIL AUDIT <ArrowRight className="ml-1 h-3.5 w-3.5" />
                          </Button>
                       </div>
                    </CardContent>
                  </Card>
                )
              })}
           </div>
        </div>

        {/* Audit Side Panel */}
        <div className="space-y-6">
           <Card className="border-none shadow-xl bg-slate-950 text-white overflow-hidden">
              <CardHeader className="p-5 border-b border-white/5 bg-slate-900/50">
                 <div className="flex items-center justify-between">
                    <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                       <BarChart3 className="h-4 w-4 text-emerald-500" /> CREDIT FEED
                    </CardTitle>
                    <div className="flex items-center gap-1.5">
                       <div className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-pulse" />
                       <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">LIVE DATA</span>
                    </div>
                 </div>
              </CardHeader>
              <CardContent className="p-0">
                 <div className="divide-y divide-white/5">
                    {[
                      { time: '14:22', action: 'Approval: AP-022', status: 'SUCCESS', borrower: 'Subang' },
                      { time: '14:10', action: 'Credit Score Update', status: 'INFO', borrower: 'Bandung' },
                      { time: '13:55', action: 'Disbursement Alert', status: 'WARN', borrower: 'Nasional' },
                      { time: '13:40', action: 'New App: AP-045', status: 'PENDING', borrower: 'Cikupa' },
                    ].map((log, i) => (
                      <div key={i} className="p-5 hover:bg-white/5 transition-colors cursor-pointer group">
                         <div className="flex items-center justify-between mb-2">
                            <Badge className={`text-[8px] font-black uppercase px-1.5 h-4 border-none ${
                              log.status === 'WARN' ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-400'
                            }`}>
                               {log.status}
                            </Badge>
                            <span className="text-[9px] font-mono text-slate-600">{log.time}</span>
                         </div>
                         <p className="text-[11px] font-black text-slate-200 uppercase leading-tight group-hover:text-emerald-400 transition-colors">{log.action}</p>
                         <p className="text-[9px] font-bold text-slate-500 uppercase mt-1 tracking-tighter">REGION: {log.borrower}</p>
                      </div>
                    ))}
                 </div>
                 <div className="p-4 bg-white/5 border-t border-white/5 text-center">
                    <Button variant="ghost" className="w-full text-[9px] font-black text-slate-500 hover:text-white uppercase tracking-widest h-10">
                       Buka Konsol Kredit →
                    </Button>
                 </div>
              </CardContent>
           </Card>

           <Card className="border-none shadow-sm bg-slate-50">
              <CardHeader className="p-4 border-b border-slate-200">
                 <CardTitle className="text-[10px] font-black uppercase tracking-widest text-slate-900">Analisis Risiko Nasional</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                 {[
                   { label: 'Indeks Kolektibilitas', val: '98.2%', status: 'Sangat Sehat' },
                   { label: 'Likuiditas Cabang', val: 'Rp 4.2M', status: 'Optimal' },
                   { label: 'Konsentrasi Sektor', val: 'PADI', status: 'Tinggi' },
                 ].map((h, i) => (
                    <div key={i} className="flex items-center justify-between group">
                       <span className="text-[10px] font-bold text-slate-500 uppercase">{h.label}</span>
                       <div className="text-right">
                          <p className="text-[10px] font-black text-slate-900 uppercase group-hover:text-emerald-600 transition-colors">{h.val}</p>
                          <p className="text-[8px] font-bold text-slate-400 uppercase">{h.status}</p>
                       </div>
                    </div>
                 ))}
                 <div className="pt-2">
                    <Button className="w-full h-10 bg-white border border-slate-200 text-slate-900 font-black text-[10px] uppercase tracking-widest hover:bg-slate-50 shadow-sm rounded-xl">
                       Lihat Heatmap Risiko
                    </Button>
                 </div>
              </CardContent>
           </Card>
        </div>
      </div>

      {/* Global Risk Alert Banner */}
      <Card className="bg-rose-600 border-none overflow-hidden relative shadow-2xl shadow-rose-100 group cursor-pointer">
        <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform duration-700">
          <ShieldAlert className="h-32 w-32 text-white" />
        </div>
        <CardContent className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-8 relative">
          <div className="flex items-center gap-6">
             <div className="h-14 w-14 rounded-2xl bg-white/20 border border-white/10 flex items-center justify-center shrink-0">
                <FileWarning className="h-7 w-7 text-white animate-pulse" />
             </div>
             <div>
                <div className="flex items-center gap-3">
                   <Badge className="bg-white text-rose-600 font-black text-[9px] px-2 h-5 border-none">SYSTEM ALERT</Badge>
                   <span className="text-[10px] font-black text-rose-100 uppercase tracking-widest">High Volatility Detected (Kredit Musim Tanam)</span>
                </div>
                <p className="text-white text-base font-black uppercase mt-2 tracking-tight">Perhatian: Terjadi lonjakan pengajuan pinjaman di Jawa Timur. Perketat verifikasi scoring.</p>
             </div>
          </div>
          <Button className="h-12 bg-white text-rose-600 hover:bg-slate-100 font-black text-[11px] uppercase tracking-widest px-8 rounded-xl shadow-xl transition-all">
             Audit Regional →
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
allet className="h-4 w-4" />
                        Kirim pengajuan
                      </Button>
                      <Button variant="outline" asChild>
                        <Link href="/dashboard">Kembali ke dashboard</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CircleDollarSign className="h-5 w-5 text-primary" />
                        Simulasi otomatis
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="rounded-2xl border bg-secondary/35 p-4">
                        <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Estimasi cicilan</p>
                        <p className="mt-2 text-3xl font-bold">{formatCurrency(monthlyInstallment)}</p>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="rounded-2xl border p-4">
                          <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Peluang lolos</p>
                          <p className="mt-2 text-2xl font-semibold">{approvalChance}%</p>
                        </div>
                        <div className="rounded-2xl border p-4">
                          <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Sisa limit</p>
                          <p className="mt-2 text-2xl font-semibold">{formatCurrency(Math.max(profile.maxLoanAmount - requestedAmount, 0))}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Alert className="border-red-200 bg-red-50/80">
                    <CheckCircle2 className="h-4 w-4 text-red-600" />
                    <AlertTitle className="text-red-900">Sudah sinkron ke akun aktif</AlertTitle>
                    <AlertDescription className="text-red-900/80">
                      Data anggota, limit, dan riwayat di halaman ini mengikuti akun {user.name}.
                    </AlertDescription>
                  </Alert>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="riwayat">
              <Card>
                <CardHeader>
                  <CardTitle>Riwayat pinjaman akun {user.name}</CardTitle>
                  <CardDescription>Setiap pengajuan baru langsung muncul untuk akun yang sedang login.</CardDescription>
                </CardHeader>
                <CardContent>
                  {loanHistory.length === 0 ? (
                    <Alert>
                      <Clock3 className="h-4 w-4" />
                      <AlertTitle>Belum ada riwayat pinjaman</AlertTitle>
                      <AlertDescription>Mulai dari form pengajuan untuk membuat riwayat pertama pada akun ini.</AlertDescription>
                    </Alert>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Tujuan</TableHead>
                            <TableHead>Tanggal</TableHead>
                            <TableHead className="text-right">Nominal</TableHead>
                            <TableHead className="text-right">Tenor</TableHead>
                            <TableHead className="text-right">Sisa</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {loanHistory.map((item) => {
                            const status = personalStatusMeta(item.status)
                            return (
                              <TableRow key={item.id}>
                                <TableCell className="font-medium">{item.id}</TableCell>
                                <TableCell>{item.purpose}</TableCell>
                                <TableCell>{formatDate(item.submittedAt)}</TableCell>
                                <TableCell className="text-right">{formatCurrency(item.amount)}</TableCell>
                                <TableCell className="text-right">{item.tenor} bulan</TableCell>
                                <TableCell className="text-right">{formatCurrency(item.remainingBalance)}</TableCell>
                                <TableCell><Badge className={status.className}>{status.label}</Badge></TableCell>
                              </TableRow>
                            )
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            <Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">Antrian role</p><p className="mt-2 text-3xl font-bold">{reviewerQueue.length}</p></CardContent></Card>
            <Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">Nominal ditinjau</p><p className="mt-2 text-3xl font-bold">{formatCurrency(queueTotal)}</p></CardContent></Card>
            <Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">Keputusan selesai</p><p className="mt-2 text-3xl font-bold">{processedQueue.length}</p></CardContent></Card>
          </div>

          <Card className="border-red-200/70 bg-gradient-to-br from-red-600 via-red-500 to-red-700 text-white shadow-lg shadow-red-200/60">
            <CardContent className="space-y-3 p-6">
              <Badge className="border-white/20 bg-white/15 text-white hover:bg-white/15">Workflow {user.role.replace('_', ' ')}</Badge>
              <h2 className="text-3xl font-bold">Mode reviewer aktif untuk {user.name}</h2>
              <p className="max-w-2xl text-sm text-red-50/90">
                Role reviewer melihat antrian verifikasi dan aksi keputusan, bukan data pribadi anggota.
              </p>
            </CardContent>
          </Card>

          <Tabs defaultValue="antrian" className="space-y-4">
            <TabsList className="grid h-auto w-full grid-cols-2 rounded-2xl bg-secondary/50 p-1">
              <TabsTrigger value="antrian" className="rounded-xl py-2">Antrian review</TabsTrigger>
              <TabsTrigger value="riwayat" className="rounded-xl py-2">Riwayat keputusan</TabsTrigger>
            </TabsList>

            <TabsContent value="antrian">
              <Card>
                <CardHeader>
                  <CardTitle>Antrian pengajuan sesuai role</CardTitle>
                  <CardDescription>Aksi di bawah langsung mengubah status antrian untuk role {user.role}.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {reviewerQueue.length === 0 ? (
                    <Alert>
                      <Clock3 className="h-4 w-4" />
                      <AlertTitle>Tidak ada antrian</AlertTitle>
                      <AlertDescription>Belum ada pengajuan yang masuk ke role ini.</AlertDescription>
                    </Alert>
                  ) : (
                    reviewerQueue.map((item) => {
                      const status = reviewStatusMeta(item.status)
                      const isFinal = item.status === 'disetujui' || item.status === 'perlu_dokumen'
                      return (
                        <Card key={item.id} className="border-dashed">
                          <CardContent className="space-y-4 p-5">
                            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                              <div>
                                <div className="flex flex-wrap items-center gap-2">
                                  <p className="text-lg font-semibold">{item.borrowerName}</p>
                                  <Badge className={status.className}>{status.label}</Badge>
                                  <Badge variant="outline">{item.id}</Badge>
                                </div>
                                <p className="mt-2 text-sm text-muted-foreground">{item.village} | {item.commodity} | Diajukan {formatDate(item.submittedAt)}</p>
                              </div>
                              <div className="grid gap-2 sm:grid-cols-3">
                                <div className="rounded-2xl border bg-secondary/35 p-3"><p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Nominal</p><p className="mt-2 font-semibold">{formatCurrency(item.amount)}</p></div>
                                <div className="rounded-2xl border bg-secondary/35 p-3"><p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Tenor</p><p className="mt-2 font-semibold">{item.tenor} bulan</p></div>
                                <div className="rounded-2xl border bg-secondary/35 p-3"><p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Skor</p><p className="mt-2 font-semibold">{item.score}</p></div>
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground">{item.recommendation}</p>
                            {!isFinal && (
                              <div className="flex flex-wrap gap-2">
                                <Button onClick={() => updateApplicationStatus(item.id, 'disetujui')}>
                                  <FileCheck2 className="h-4 w-4" />
                                  Setujui
                                </Button>
                                <Button variant="outline" onClick={() => updateApplicationStatus(item.id, 'perlu_dokumen')}>
                                  <FileWarning className="h-4 w-4" />
                                  Minta dokumen
                                </Button>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      )
                    })
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="riwayat">
              <Card>
                <CardHeader>
                  <CardTitle>Riwayat keputusan role {user.role}</CardTitle>
                  <CardDescription>Daftar ini ikut berubah setelah Anda menekan aksi pada antrian review.</CardDescription>
                </CardHeader>
                <CardContent>
                  {processedQueue.length === 0 ? (
                    <Alert>
                      <Clock3 className="h-4 w-4" />
                      <AlertTitle>Belum ada keputusan final</AlertTitle>
                      <AlertDescription>Aplikasi yang disetujui atau diminta revisi akan muncul di sini.</AlertDescription>
                    </Alert>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Pemohon</TableHead>
                            <TableHead>Tanggal</TableHead>
                            <TableHead className="text-right">Nominal</TableHead>
                            <TableHead className="text-right">Skor</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {processedQueue.map((item) => {
                            const status = reviewStatusMeta(item.status)
                            return (
                              <TableRow key={item.id}>
                                <TableCell><div><p className="font-medium">{item.borrowerName}</p><p className="text-xs text-muted-foreground">{item.id}</p></div></TableCell>
                                <TableCell>{formatDate(item.submittedAt)}</TableCell>
                                <TableCell className="text-right">{formatCurrency(item.amount)}</TableCell>
                                <TableCell className="text-right">{item.score}</TableCell>
                                <TableCell><Badge className={status.className}>{status.label}</Badge></TableCell>
                              </TableRow>
                            )
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}

      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Pengajuan berhasil dibuat</DialogTitle>
            <DialogDescription>Ajuan baru sudah tersimpan ke riwayat akun {user.name} dan siap diproses reviewer.</DialogDescription>
          </DialogHeader>
          <div className="rounded-2xl border bg-secondary/35 p-4">
            <p className="text-sm font-medium">Ringkasan pengajuan</p>
            <p className="mt-2 text-2xl font-bold">{formatCurrency(requestedAmount)}</p>
            <p className="mt-2 text-sm text-muted-foreground">{selectedPurpose} | {selectedTenor} bulan</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSuccessDialog(false)}>Tutup</Button>
            <Button onClick={() => setShowSuccessDialog(false)}>Lanjut</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
