'use client'

import { useState, useMemo } from 'react'
import {
  Calculator,
  Users,
  Wallet,
  PieChart,
  TrendingUp,
  Calendar,
  Download,
  ShieldAlert,
  Globe,
  Activity,
  FileText,
  DollarSign,
  ArrowRight,
  TrendingDown,
  History,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
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
import { useToast } from '@/components/ui/use-toast'
import { useAuth } from '@/lib/auth/use-auth'
import { KementerianFilterBar } from '@/components/dashboard/kementerian-filter-bar'
import { formatCurrency } from '@/lib/data'
import type { ScopeFilters } from '@/lib/kementerian-dashboard-data'

const shuData = {
  tahun: 2023,
  totalPendapatan: 850000000,
  totalBiaya: 680000000,
  labaKotor: 170000000,
  cadanganKoperasi: 25500000,
  danaKaryawan: 17000000,
  danaPendidikan: 8500000,
  danaSosial: 8500000,
  shuAnggota: 110500000,
}

const pembagianSHU = [
  { nama: 'Pak Slamet Widodo', simpanan: 1700000, transaksi: 45000000, shuSimpanan: 1850000, shuTransaksi: 2800000, totalSHU: 4650000, region: 'JAWA BARAT' },
  { nama: 'Bu Sri Wahyuni', simpanan: 1300000, transaksi: 38000000, shuSimpanan: 1415000, shuTransaksi: 2365000, totalSHU: 3780000, region: 'JAWA TENGAH' },
  { nama: 'Pak Ahmad Sudirman', simpanan: 1100000, transaksi: 28000000, shuSimpanan: 1200000, shuTransaksi: 1740000, totalSHU: 2940000, region: 'JAWA TIMUR' },
  { nama: 'Bu Ratna Dewi', simpanan: 2000000, transaksi: 52000000, shuSimpanan: 2180000, shuTransaksi: 3235000, totalSHU: 5415000, region: 'BALI' },
  { nama: 'Pak Budi Santoso', simpanan: 2500000, transaksi: 65000000, shuSimpanan: 2725000, shuTransaksi: 4045000, totalSHU: 6770000, region: 'SUMATERA UTARA' },
]

const alokasi = [
  { nama: 'SHU Anggota', persentase: 65, nilai: shuData.shuAnggota, color: 'bg-emerald-500' },
  { nama: 'Cadangan Koperasi', persentase: 15, nilai: shuData.cadanganKoperasi, color: 'bg-blue-500' },
  { nama: 'Dana Karyawan', persentase: 10, nilai: shuData.danaKaryawan, color: 'bg-amber-500' },
  { nama: 'Dana Pendidikan', persentase: 5, nilai: shuData.danaPendidikan, color: 'bg-violet-500' },
  { nama: 'Dana Sosial', persentase: 5, nilai: shuData.danaSosial, color: 'bg-pink-500' },
]

export default function SHUPage() {
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
    return {
      totalRevenue: shuData.totalPendapatan * scaleFactor * 100,
      totalMargin: shuData.labaKotor * scaleFactor * 100,
      distributedSHU: shuData.shuAnggota * scaleFactor * 100,
      activeMembers: Math.round(12480 * scaleFactor)
    }
  }, [scaleFactor])

  const filteredSHU = useMemo(() => {
    return pembagianSHU.filter(item => {
      const matchesProvince = filters.provinceId === 'all' || item.region.includes(filters.provinceId.toUpperCase())
      return matchesProvince
    })
  }, [filters])

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">AUDIT SHU NASIONAL</h1>
          <p className="text-[10px] font-black text-slate-500 mt-1 uppercase tracking-widest leading-relaxed">
            MONITORING SURPLUS & KEPATUHAN DISTRIBUSI • TAHUN BUKU 2023 • {formatCurrency(stats.totalMargin)} AGREGAT SURPLUS
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" className="h-9 text-[10px] font-black uppercase tracking-widest border-slate-200 text-slate-600 rounded-none" onClick={() => toast({ title: "Sinkronisasi Audit", description: "Memverifikasi alokasi surplus terhadap standar AD/ART nasional..." })}>
            <History className="h-3.5 w-3.5 mr-2 text-blue-600" />
            RIWAYAT
          </Button>
          <Button size="sm" className="h-9 bg-slate-900 text-white hover:bg-slate-800 text-[10px] font-black uppercase tracking-widest px-6 rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] transition-all" onClick={() => toast({ title: "Inisiasi Ekspor", description: "Menghasilkan manifest distribusi lintas entitas..." })}>
            <Download className="h-4 w-4 mr-2" />
            EKSPOR DATA
          </Button>
        </div>
      </div>

      <KementerianFilterBar filters={filters} setFilters={setFilters} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'TOTAL SURPLUS (SHU)', value: (stats.totalMargin / 1000000000).toFixed(2), sub: 'MILIAR IDR', icon: TrendingUp, tone: 'emerald' },
          { label: 'PORSI TERDISTRIBUSI', value: (stats.distributedSHU / 1000000000).toFixed(2), sub: 'MILIAR IDR', icon: Wallet, tone: 'blue' },
          { label: 'BASIS ANGGOTA', value: stats.activeMembers.toLocaleString(), sub: 'PENERIMA', icon: Users, tone: 'slate' },
          { label: 'RASIO EFISIENSI', value: '82.4%', sub: 'RATA-RATA NASIONAL', icon: Activity, tone: 'emerald' },
        ].map((s, i) => (
          <Card key={i} className="border-none shadow-sm bg-white overflow-hidden rounded-none">
             <div className={`h-1 w-full ${
              s.tone === 'emerald' ? 'bg-emerald-500' : 
              s.tone === 'blue' ? 'bg-blue-500' : 'bg-slate-900'
            }`} />
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-10 w-10 rounded-none bg-slate-50 flex items-center justify-center shrink-0 shadow-inner">
                <s.icon className={`h-5 w-5 ${
                  s.tone === 'emerald' ? 'text-emerald-500' : 
                  s.tone === 'blue' ? 'text-blue-500' : 'text-slate-900'
                }`} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{s.label}</p>
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
            <Card className="border-none shadow-sm overflow-hidden rounded-none">
              <div className="h-1 w-full bg-slate-900" />
              <CardHeader className="p-6 border-b border-slate-50 bg-slate-50/50">
                 <div className="flex items-center justify-between">
                    <div>
                       <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-900">MATRIKS ALOKASI NASIONAL</CardTitle>
                       <CardDescription className="text-[10px] font-bold text-slate-400 uppercase mt-1">DISTRIBUSI AGREGAT BERDASARKAN AD/ART KOLEKTIF</CardDescription>
                    </div>
                    <Badge className="bg-emerald-100 text-emerald-700 text-[9px] font-black border-none px-2 h-5 uppercase rounded-none tracking-widest">AUDIT LANGSUNG</Badge>
                 </div>
              </CardHeader>
              <CardContent className="p-6">
                 <div className="grid gap-8 md:grid-cols-2">
                    <div className="space-y-5">
                       {alokasi.map((item) => (
                          <div key={item.nama} className="space-y-2">
                             <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-tight">
                                <div className="flex items-center gap-2">
                                   <div className={`h-2.5 w-2.5 rounded-none ${item.color}`} />
                                   <span className="text-slate-600">{item.nama.toUpperCase()}</span>
                                </div>
                                <span className="text-slate-900">{item.persentase}%</span>
                             </div>
                             <div className="h-1.5 w-full bg-slate-100 rounded-none overflow-hidden">
                                <div className={`h-full ${item.color}`} style={{ width: `${item.persentase}%` }} />
                             </div>
                             <p className="text-right text-[9px] font-black text-slate-400 uppercase tracking-tighter">{formatCurrency(item.nilai * scaleFactor * 100)}</p>
                          </div>
                       ))}
                    </div>
                    <div className="bg-slate-900 rounded-none p-6 text-white flex flex-col justify-center relative overflow-hidden shadow-2xl">
                       <div className="absolute top-0 right-0 p-4 opacity-5">
                          <PieChart className="h-32 w-32" />
                       </div>
                       <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">KUMPULAN PENDAPATAN KOTOR</p>
                       <p className="text-3xl font-black mt-2 tracking-tighter">{formatCurrency(stats.totalRevenue)}</p>
                       <div className="mt-8 space-y-4">
                          <div className="flex items-center justify-between border-b border-white/10 pb-2">
                             <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">BIAYA OPERASIONAL</span>
                             <span className="text-sm font-black text-rose-400">-{formatCurrency(stats.totalRevenue * 0.8)}</span>
                          </div>
                          <div className="flex items-center justify-between">
                             <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">SURPLUS BERSIH (SHU)</span>
                             <span className="text-sm font-black text-emerald-400">{formatCurrency(stats.totalMargin)}</span>
                          </div>
                       </div>
                    </div>
                 </div>
              </CardContent>
           </Card>

           <Card className="border-none bg-white shadow-sm overflow-hidden rounded-none">
              <div className="h-1 w-full bg-slate-900" />
              <CardHeader className="p-6 border-b border-slate-50">
                 <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-900">LOG DISTRIBUSI ANGGOTA</CardTitle>
                 <CardDescription className="text-[10px] font-bold text-slate-400 uppercase mt-1">ALOKASI SURPLUS INDIVIDUAL PER PESERTA AKTIF</CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                 <Table>
                    <TableHeader className="bg-slate-900">
                       <TableRow className="hover:bg-slate-900 border-none">
                          <TableHead className="h-10 text-[10px] font-black uppercase tracking-widest text-slate-400 px-6">PENERIMA</TableHead>
                          <TableHead className="h-10 text-[10px] font-black uppercase tracking-widest text-slate-400 px-6">WILAYAH</TableHead>
                          <TableHead className="h-10 text-[10px] font-black uppercase tracking-widest text-slate-400 px-6 text-right">TOTAL SHU</TableHead>
                          <TableHead className="h-10 text-[10px] font-black uppercase tracking-widest text-slate-400 px-6 text-right">AUDIT</TableHead>
                       </TableRow>
                    </TableHeader>
                    <TableBody>
                       {filteredSHU.map((item) => (
                          <TableRow key={item.nama} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors group">
                             <TableCell className="px-6 py-4">
                                <span className="text-xs font-black text-slate-900 uppercase tracking-tight">{item.nama}</span>
                             </TableCell>
                             <TableCell className="px-6 py-4">
                                <Badge className="text-[9px] font-black border-none px-1.5 h-4 uppercase rounded-none bg-slate-100 text-slate-500 tracking-tighter">{item.region}</Badge>
                             </TableCell>
                             <TableCell className="px-6 py-4 text-right">
                                <span className="text-xs font-black text-emerald-600">{formatCurrency(item.totalSHU)}</span>
                             </TableCell>
                             <TableCell className="px-6 py-4 text-right">
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-300 group-hover:text-slate-900 rounded-none group-hover:bg-white group-hover:shadow-sm" onClick={() => toast({ title: "Audit Alokasi", description: "Memuat perhitungan surplus rinci untuk " + item.nama })}>
                                   <ArrowRight className="h-4 w-4" />
                                </Button>
                             </TableCell>
                          </TableRow>
                       ))}
                    </TableBody>
                 </Table>
              </CardContent>
           </Card>
        </div>

        <div className="space-y-6">
           <Card className="border-none shadow-xl bg-slate-950 text-white overflow-hidden rounded-none">
               <CardHeader className="p-4 border-b border-white/5 bg-slate-900/50">
                  <div className="flex items-center justify-between">
                     <CardTitle className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                        <ShieldAlert className="h-4 w-4 text-rose-500" /> FEED SURPLUS
                     </CardTitle>
                     <div className="flex items-center gap-1.5">
                        <div className="h-1 w-1 bg-emerald-500 rounded-full animate-ping" />
                        <span className="text-[9px] font-black text-emerald-500 tracking-widest">AUDIT LANGSUNG</span>
                     </div>
                  </div>
               </CardHeader>
               <CardContent className="p-0">
                  <div className="divide-y divide-white/5">
                     {[
                       { time: '14:25', action: 'Kumpulan Dividen Dihasilkan', status: 'BERHASIL', region: 'Nasional' },
                       { time: '14:12', action: 'Audit Kepatuhan Selesai', status: 'TERVERIFIKASI', region: 'Jawa Barat' },
                       { time: '13:45', action: 'Deviasi Margin Terdeteksi', status: 'PERINGATAN', region: 'Bali' },
                       { time: '13:20', action: 'Penyelesaian Transaksi Q4', status: 'PENDING', region: 'Sumatera' },
                     ].map((log, i) => (
                       <div key={i} className="p-4 hover:bg-white/5 transition-colors cursor-pointer group">
                          <div className="flex items-center justify-between mb-2">
                             <Badge className={`text-[9px] font-black px-1.5 h-4 border-none rounded-none tracking-widest ${
                               log.status === 'PERINGATAN' ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-400'
                             }`}>
                                {log.status}
                             </Badge>
                             <span className="text-[9px] font-mono text-slate-600 group-hover:text-slate-400">{log.time}</span>
                          </div>
                          <p className="text-xs font-black text-slate-200 uppercase tracking-tight leading-tight">{log.action}</p>
                          <p className="text-[9px] font-bold text-slate-500 mt-1 uppercase">WILAYAH: {log.region}</p>
                       </div>
                     ))}
                  </div>
                  <div className="p-4 bg-white/5 border-t border-white/5">
                     <Button variant="ghost" className="w-full text-[10px] font-black text-slate-500 hover:text-white uppercase tracking-widest h-9 rounded-none" onClick={() => toast({ title: "Konsol Utama", description: "Memuat konsol audit keuangan nasional..." })}>
                        KONSOL KEUANGAN →
                     </Button>
                  </div>
               </CardContent>
            </Card>

            <Card className="border-none shadow-sm bg-slate-50 rounded-none">
               <CardHeader className="p-4 border-b border-slate-200">
                  <CardTitle className="text-[10px] font-black uppercase tracking-widest text-slate-900">PERFORMA KEUANGAN</CardTitle>
               </CardHeader>
               <CardContent className="p-4 space-y-4">
                  {[
                    { label: 'INDEKS PROFITABILITAS', val: '1.24', trend: 'naik' },
                    { label: 'CADANGAN MODAL', val: 'Rp 42.8M', trend: 'stabil' },
                    { label: 'YIELD DIVIDEN', val: '6.8%', trend: 'naik' },
                  ].map((h, i) => (
                     <div key={i} className="flex items-center justify-between">
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{h.label}</span>
                        <div className="text-right">
                           <p className="text-[10px] font-black text-slate-900">{h.val}</p>
                           <p className="text-[9px] font-black text-emerald-600 uppercase tracking-tighter">{h.trend.toUpperCase()}</p>
                        </div>
                     </div>
                  ))}
               </CardContent>
            </Card>
        </div>
      </div>

      <Card className="alert-surface-banner border-none overflow-hidden relative group cursor-pointer bg-rose-50 border border-rose-100 rounded-none" onClick={() => toast({ title: "Investigasi Dipicu", description: "Membuka audit forensik untuk varians margin operasional di wilayah Bali..." })}>
        <div className="absolute top-0 right-0 p-6 opacity-10 transition-transform duration-700 group-hover:scale-110">
          <ShieldAlert className="h-32 w-32 text-rose-900" />
        </div>
        <CardContent className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-8 relative">
          <div className="flex items-center gap-6">
             <div className="flex h-14 w-14 items-center justify-center rounded-none bg-rose-600 text-white shadow-xl shadow-rose-200 shrink-0">
                <DollarSign className="h-7 w-7" />
             </div>
             <div>
                <div className="flex items-center gap-3">
                   <Badge className="bg-rose-600 text-white text-[10px] font-black px-2 h-5 rounded-none tracking-widest border-none">PERINGATAN AUDIT</Badge>
                   <span className="text-[10px] font-black text-rose-900 uppercase tracking-widest">Varians Margin Terdeteksi (&gt;15%)</span>
                </div>
                <p className="mt-2 text-lg font-black text-rose-900 uppercase tracking-tight">KRITIS: Deviasi margin operasional di hub regional Bali. Audit segera diperlukan.</p>
             </div>
          </div>
          <Button className="bg-rose-900 text-white hover:bg-rose-800 h-12 rounded-none px-8 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-rose-200 transition-all">
             MULAI INVESTIGASI
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
