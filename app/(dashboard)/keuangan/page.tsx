'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  Wallet,
  TrendingUp,
  CreditCard,
  FileText,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  Activity,
  History,
  Download,
  BarChart3,
  PieChart as PieChartIcon,
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
import { useToast } from '@/components/ui/use-toast'
import { useAuth } from '@/lib/auth/use-auth'
import { KementerianFilterBar } from '@/components/dashboard/kementerian-filter-bar'
import { formatCurrency } from '@/lib/data'
import type { ScopeFilters } from '@/lib/kementerian-dashboard-data'

export default function KeuanganPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [filters, setFilters] = useState<ScopeFilters>({
    provinceId: 'all',
    regionId: 'all',
    villageId: 'all',
    cooperativeId: 'all',
    commodityId: 'all',
  })

  const scaleFactor = useMemo(() => {
    if (filters.cooperativeId !== 'all') return 0.05
    if (filters.villageId !== 'all') return 0.15
    if (filters.regionId !== 'all') return 0.4
    if (filters.provinceId !== 'all') return 0.7
    return 1.0
  }, [filters])

  const stats = useMemo(() => {
    const totalAssets = 852400000000 * scaleFactor
    const totalLoans = 412500000000 * scaleFactor
    const monthlyInflow = 42500000000 * scaleFactor
    const nplRate = (2.4).toFixed(1)
    return { totalAssets, totalLoans, monthlyInflow, nplRate }
  }, [scaleFactor])

  const modules = [
    { title: 'HUB PENYELESAIAN', desc: 'Buku besar waktu nyata dan kliring pembayaran lintas entitas.', href: '/keuangan/pembayaran', icon: CreditCard, color: 'emerald' },
    { title: 'ANALITIK KEUANGAN', desc: 'Proyeksi arus kas nasional dan arsip audit.', href: '/keuangan/laporan', icon: BarChart3, color: 'blue' },
    { title: 'HUB SIMPAN PINJAM', desc: 'Analisis portofolio simpanan dan pinjaman koperasi.', href: '/keuangan/simpan-pinjam', icon: Wallet, color: 'blue' },
    { title: 'HUB RATING KREDIT', desc: 'Skoring kredit berbasis AI dan log audit anggota.', href: '/keuangan/credit-scoring', icon: TrendingUp, color: 'emerald' },
    { title: 'HUB KREDIT NASIONAL', desc: 'Antrean aplikasi pinjaman dan matriks penilaian risiko.', href: '/keuangan/pinjaman', icon: ShieldCheck, color: 'emerald' },
    { title: 'AUDIT SHU NASIONAL', desc: 'Distribusi surplus dan kepatuhan alokasi.', href: '/keuangan/shu', icon: PieChartIcon, color: 'blue' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">PUSAT KOMANDO KEUANGAN</h1>
          <p className="text-[10px] font-black text-slate-500 mt-1 uppercase tracking-widest leading-relaxed">
            PEMANTAUAN FISKAL NASIONAL • AUDIT RISIKO PORTOFOLIO • TOTAL ASET DIKELOLA {formatCurrency(stats.totalAssets)}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" className="h-9 text-[10px] font-black uppercase tracking-widest border-slate-200 text-slate-600 rounded-none" onClick={() => toast({ title: "Sinkronisasi Fiskal", description: "Mengagregasi data keuangan regional ke dalam buku besar nasional..." })}>
            <History className="h-3.5 w-3.5 mr-2 text-blue-600" />
            RIWAYAT
          </Button>
          <Button size="sm" className="h-9 bg-slate-900 text-white hover:bg-slate-800 text-[10px] font-black uppercase tracking-widest px-6 rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] transition-all" onClick={() => toast({ title: "Inisiasi Audit", description: "Menghasilkan laporan integritas keuangan lintas entitas..." })}>
            <Download className="h-4 w-4 mr-2" />
            PUSAT AUDIT
          </Button>
        </div>
      </div>

      <KementerianFilterBar filters={filters} setFilters={setFilters} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'ASET DIKELOLA', value: formatCurrency(stats.totalAssets), sub: 'POOL NASIONAL', icon: Wallet, tone: 'emerald' },
          { label: 'PORTOFOLIO PINJAMAN', value: formatCurrency(stats.totalLoans), sub: 'KREDIT AKTIF', icon: CreditCard, tone: 'blue' },
          { label: 'INFLOW BULANAN', value: formatCurrency(stats.monthlyInflow), sub: 'PENDAPATAN JARINGAN', icon: ArrowDownRight, tone: 'emerald' },
          { label: 'RASIO NPL', value: stats.nplRate + '%', sub: 'INDEKS RISIKO', icon: Activity, tone: 'rose' },
        ].map((s, i) => (
          <Card key={i} className="border-none shadow-sm bg-white overflow-hidden rounded-none">
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

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {modules.map((mod, i) => (
          <Link key={i} href={mod.href} className="group">
            <Card className="border-none shadow-sm bg-white overflow-hidden hover:shadow-md transition-all h-full">
              <div className={`h-1 w-full ${mod.color === 'emerald' ? 'bg-emerald-600' : 'bg-blue-600'}`} />
              <CardHeader className="p-6">
                 <div className="flex items-start justify-between">
                    <div className={`h-12 w-12 rounded-none flex items-center justify-center shadow-inner ${
                       mod.color === 'emerald' ? 'bg-emerald-600 text-white' : 'bg-blue-600 text-white'
                    }`}>
                       <mod.icon className="h-6 w-6" />
                    </div>
                    <ArrowUpRight className="h-5 w-5 text-slate-300 group-hover:text-slate-900 transition-colors" />
                 </div>
                 <div className="mt-4">
                    <CardTitle className="text-sm font-black text-slate-900 uppercase tracking-tight">{mod.title}</CardTitle>
                    <CardDescription className="text-[10px] font-bold text-slate-400 uppercase mt-2 leading-relaxed tracking-widest">
                       {mod.desc}
                    </CardDescription>
                 </div>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                 <div className="h-1 w-full bg-slate-50 rounded-full overflow-hidden">
                    <div className={`h-full bg-slate-900 w-0 group-hover:w-full transition-all duration-500`} />
                 </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
         <Card className="border-none shadow-xl bg-slate-950 text-white overflow-hidden rounded-none">
            <CardHeader className="p-4 border-b border-white/5 bg-slate-900/50">
               <div className="flex items-center justify-between">
                  <CardTitle className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                     <ShieldCheck className="h-4 w-4 text-emerald-500" /> FISCAL INTEGRITY AUDIT
                  </CardTitle>
                  <div className="flex items-center gap-1.5">
                     <div className="h-1 w-1 bg-emerald-500 rounded-full animate-ping" />
                     <span className="text-[9px] font-black text-emerald-500 tracking-widest">REAL-TIME</span>
                  </div>
               </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
               <div className="grid grid-cols-2 gap-8">
                  {[
                    { label: 'SKOR KEPATUHAN', val: '98.2%', tone: 'emerald' },
                    { label: 'NODE WASPADA FRAUD', val: '0', tone: 'emerald' },
                    { label: 'PENYELESAIAN TERTUNDA', val: '124', tone: 'blue' },
                    { label: 'LATENSI JARINGAN', val: '142ms', tone: 'blue' },
                  ].map((a, i) => (
                    <div key={i}>
                       <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{a.label}</p>
                       <p className={`text-xl font-black mt-1 ${
                          a.tone === 'emerald' ? 'text-emerald-500' : 'text-blue-500'
                       }`}>{a.val}</p>
                    </div>
                  ))}
               </div>
               <div className="pt-6 border-t border-white/5">
                  <Button variant="outline" className="w-full h-10 bg-transparent text-white border-white/10 hover:bg-white/5 text-[10px] font-black uppercase tracking-widest rounded-none" onClick={() => toast({ title: "Suite Kepatuhan", description: "Membuka dashboard kepatuhan fiskal nasional..." })}>
                     AKSES SUITE KEPATUHAN LENGKAP →
                  </Button>
               </div>
            </CardContent>
         </Card>

         <Card className="border-none shadow-sm bg-slate-50 rounded-none">
            <CardHeader className="p-4 border-b border-slate-200">
               <CardTitle className="text-[10px] font-black uppercase tracking-widest text-slate-900">PROYEKSI STRATEGIS</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
               <div className="space-y-4">
                  {[
                    { label: 'PROYEKSI PENDAPATAN Q3', val: '+12.4%', sub: 'vs Kuartal Sebelumnya' },
                    { label: 'TINGKAT EKSPANSI JARINGAN', val: '4.2%', sub: 'Node Baru/Bulan' },
                  ].map((p, i) => (
                    <div key={i}>
                       <div className="flex items-center justify-between">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{p.label}</p>
                          <span className="text-xs font-black text-emerald-600">{p.val}</span>
                       </div>
                       <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">{p.sub}</p>
                    </div>
                  ))}
               </div>
               <div className="pt-6 border-t border-slate-200">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-4">NODE INTEGRITAS DATA</p>
                  <div className="flex flex-wrap gap-2">
                     {['FIN-HUB-01', 'FIN-HUB-02', 'RISK-SEC-A', 'RISK-SEC-B'].map(n => (
                        <Badge key={n} className="bg-white text-slate-900 text-[9px] font-black border border-slate-200 rounded-none h-5 tracking-tighter">
                           {n}
                        </Badge>
                     ))}
                  </div>
               </div>
            </CardContent>
         </Card>
      </div>
    </div>
  )
}
