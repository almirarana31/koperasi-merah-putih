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
import { formatCurrency } from '@/lib/data'
import { useAuth } from '@/lib/auth/use-auth'
import { KementerianFilterBar } from '@/components/dashboard/kementerian-filter-bar'
import { ScopeFilters } from '@/lib/kementerian-dashboard-data'

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
  const isKementerian = user?.role === 'kementerian'
  const [filters, setFilters] = useState<ScopeFilters>({
    provinceId: 'all',
    regionId: 'all',
    villageId: 'all',
    cooperativeId: 'all',
    commodityId: 'all',
  })

  const filteredSHU = useMemo(() => {
    return pembagianSHU.filter(item => {
      const matchesProvince = filters.provinceId === 'all' || item.region.includes(filters.provinceId.toUpperCase())
      return matchesProvince
    })
  }, [filters])

  const stats = useMemo(() => {
    // Simulate scaling based on hierarchy
    const scale = filters.provinceId === 'all' ? 1 : 0.3
    return {
      totalRevenue: shuData.totalPendapatan * scale,
      totalMargin: shuData.labaKotor * scale,
      distributedSHU: shuData.shuAnggota * scale,
      activeMembers: Math.round(12480 * scale)
    }
  }, [filters])

  if (!user) return null

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-slate-900 flex items-center justify-center shadow-xl">
            <Calculator className="h-6 w-6 text-emerald-500" />
          </div>
          <div>
            <h1 className="text-2xl font-semibold  text-slate-900 ">National SHU Audit</h1>
            <p className="text-xs font-bold text-slate-500   mt-1">
              Monitoring Agregat Surplus & Pembagian Hasil Lintas Koperasi • Tahun Buku 2023
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
           <Button variant="outline" size="sm" className="h-10 text-xs font-semibold   text-slate-600 border-slate-200">
            <FileText className="h-4 w-4 mr-2 text-rose-600" />
            Audit Report
          </Button>
          <Button size="sm" className="h-10 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold   px-6 shadow-lg">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Kementerian Hierarchical Filter Bar */}
      <KementerianFilterBar filters={filters} setFilters={setFilters} />

      {/* High-Density KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Surplus (SHU)', value: (stats.totalMargin / 1000000).toFixed(1), sub: 'Juta IDR', icon: TrendingUp, color: 'text-emerald-600' },
          { label: 'Porsi Terdistribusi', value: (stats.distributedSHU / 1000000).toFixed(1), sub: 'Juta IDR', icon: Wallet, color: 'text-slate-900' },
          { label: 'Basis Anggota', value: stats.activeMembers.toLocaleString(), sub: 'Penerima', icon: Users, color: 'text-blue-600' },
          { label: 'Efficiency Ratio', value: '82.4%', sub: 'Nasional', icon: Activity, color: 'text-amber-600' },
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
           {/* Detailed Allocation Matrix */}
           <Card className="border-none shadow-sm overflow-hidden">
              <CardHeader className="p-6 border-b border-slate-50 bg-slate-50/50">
                 <div className="flex items-center justify-between">
                    <div>
                       <CardTitle className="text-xs font-semibold text-slate-900  ">Matriks Alokasi Surplus Nasional</CardTitle>
                       <CardDescription className="text-xs font-bold text-slate-400  mt-1">Distribusi surplus berdasarkan AD/ART kolektif</CardDescription>
                    </div>
                    <Badge variant="outline" className="bg-white border-slate-200 text-xs font-semibold ">LIVE AUDIT</Badge>
                 </div>
              </CardHeader>
              <CardContent className="p-6">
                 <div className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-5">
                       {alokasi.map((item) => (
                          <div key={item.nama} className="space-y-2">
                             <div className="flex items-center justify-between text-xs font-semibold  ">
                                <div className="flex items-center gap-2">
                                   <div className={`h-2.5 w-2.5 rounded-full ${item.color}`} />
                                   <span className="text-slate-600">{item.nama}</span>
                                </div>
                                <span className="text-slate-900">{item.persentase}%</span>
                             </div>
                             <Progress value={item.persentase} className={`h-1.5 bg-slate-100 ${item.color.replace('bg-', '[&>div]:bg-')}`} />
                             <p className="text-right text-xs font-bold text-slate-400">{formatCurrency(item.nilai * (filters.provinceId === 'all' ? 1 : 0.3))}</p>
                          </div>
                       ))}
                    </div>
                    <div className="bg-slate-900 rounded-3xl p-6 text-white flex flex-col justify-center relative overflow-hidden">
                       <div className="absolute top-0 right-0 p-4 opacity-5">
                          <PieChart className="h-32 w-32" />
                       </div>
                       <p className="text-xs font-semibold text-slate-500  ">Gross Revenue Pool</p>
                       <p className="text-4xl font-semibold  mt-2">{formatCurrency(stats.totalRevenue)}</p>
                       <div className="mt-6 space-y-3">
                          <div className="flex items-center justify-between border-b border-white/10 pb-2">
                             <span className="text-xs font-bold text-slate-400 ">Operating Costs</span>
                             <span className="text-sm font-semibold text-rose-400">-{formatCurrency(stats.totalRevenue * 0.8)}</span>
                          </div>
                          <div className="flex items-center justify-between">
                             <span className="text-xs font-bold text-emerald-400 ">Net Surplus (SHU)</span>
                             <span className="text-sm font-semibold text-emerald-400">{formatCurrency(stats.totalMargin)}</span>
                          </div>
                       </div>
                    </div>
                 </div>
              </CardContent>
           </Card>

           {/* Member Level Distribution Table */}
           <Card className="border-none shadow-sm overflow-hidden">
              <CardHeader className="p-6 border-b border-slate-50">
                 <CardTitle className="text-xs font-semibold text-slate-900  ">Sample Distribusi Per Anggota</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                 <div className="overflow-x-auto">
                    <Table>
                       <TableHeader className="bg-slate-900">
                          <TableRow className="hover:bg-slate-900 border-none">
                             <TableHead className="h-10 text-xs font-semibold text-slate-400   px-6">PENERIMA</TableHead>
                             <TableHead className="h-10 text-xs font-semibold text-slate-400   px-6">WILAYAH</TableHead>
                             <TableHead className="h-10 text-xs font-semibold text-slate-400   px-6 text-right">SIMPANAN</TableHead>
                             <TableHead className="h-10 text-xs font-semibold text-slate-400   px-6 text-right">TRANSAKSI</TableHead>
                             <TableHead className="h-10 text-xs font-semibold text-slate-400   px-6 text-right">TOTAL SHU</TableHead>
                             <TableHead className="h-10 text-xs font-semibold text-slate-400   px-6"></TableHead>
                          </TableRow>
                       </TableHeader>
                       <TableBody>
                          {filteredSHU.map((item) => (
                             <TableRow key={item.nama} className="border-b border-slate-50 hover:bg-slate-50 transition-colors group">
                                <TableCell className="px-6 py-4">
                                   <span className="text-sm font-semibold text-slate-900  ">{item.nama}</span>
                                </TableCell>
                                <TableCell className="px-6 py-4">
                                   <Badge variant="outline" className="text-xs font-semibold  text-slate-400 border-slate-200">{item.region}</Badge>
                                </TableCell>
                                <TableCell className="px-6 py-4 text-right">
                                   <span className="text-xs font-bold text-slate-500">{formatCurrency(item.simpanan)}</span>
                                </TableCell>
                                <TableCell className="px-6 py-4 text-right">
                                   <span className="text-xs font-bold text-slate-500">{formatCurrency(item.transaksi)}</span>
                                </TableCell>
                                <TableCell className="px-6 py-4 text-right">
                                   <span className="text-sm font-semibold text-emerald-600">{formatCurrency(item.totalSHU)}</span>
                                </TableCell>
                                <TableCell className="px-6 py-4 text-right">
                                   <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 group-hover:text-slate-900">
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

        {/* Audit & Compliance Panel */}
        <div className="space-y-6">
           <Card className="border-none shadow-xl bg-slate-950 text-white overflow-hidden">
              <CardHeader className="p-5 border-b border-white/5 bg-slate-900/50">
                 <div className="flex items-center justify-between">
                    <CardTitle className="text-xs font-semibold   flex items-center gap-2">
                       <ShieldAlert className="h-4 w-4 text-rose-500" /> SURPLUS FEED
                    </CardTitle>
                    <div className="flex items-center gap-1.5">
                       <div className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-ping" />
                       <span className="text-xs font-semibold text-emerald-500  ">LIVE AUDIT</span>
                    </div>
                 </div>
              </CardHeader>
              <CardContent className="p-0">
                 <div className="divide-y divide-white/5">
                    {[
                      { time: '14:25', action: 'Dividend Pool Generated', status: 'SUCCESS', region: 'Nasional' },
                      { time: '14:12', action: 'Audit Kepatuhan Selesai', status: 'VERIFIED', region: 'Jawa Barat' },
                      { time: '13:45', action: 'Deviasi Margin Terdeteksi', status: 'WARNING', region: 'Bali' },
                      { time: '13:20', action: 'Settlement Transaksi Q4', status: 'PENDING', region: 'Sumatera' },
                    ].map((log, i) => (
                      <div key={i} className="p-5 hover:bg-white/5 transition-colors cursor-pointer group">
                         <div className="flex items-center justify-between mb-2">
                            <Badge className={`text-xs font-semibold  px-1.5 h-4 border-none ${
                              log.status === 'WARNING' ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-400'
                            }`}>
                               {log.status}
                            </Badge>
                            <span className="text-xs font-mono text-slate-600">{log.time}</span>
                         </div>
                         <p className="text-sm font-semibold text-slate-200  leading-tight group-hover:text-emerald-400 transition-colors">{log.action}</p>
                         <p className="text-xs font-bold text-slate-500  mt-1">WILAYAH: {log.region}</p>
                      </div>
                    ))}
                 </div>
                 <div className="p-4 bg-white/5 border-t border-white/5 text-center">
                    <Button variant="ghost" className="w-full text-xs font-semibold text-slate-500 hover:text-white   h-10">
                       Buka Konsol Keuangan →
                    </Button>
                 </div>
              </CardContent>
           </Card>

           <Card className="border-none shadow-sm bg-slate-50">
              <CardHeader className="p-4 border-b border-slate-200">
                 <CardTitle className="text-xs font-semibold   text-slate-900">Indeks Kinerja Keuangan</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                 {[
                   { label: 'Profitability Index', val: '1.24', trend: 'up' },
                   { label: 'Capital Reserve', val: 'Rp 42.8M', trend: 'stable' },
                   { label: 'Dividend Yield', val: '6.8%', trend: 'up' },
                 ].map((h, i) => (
                    <div key={i} className="flex items-center justify-between group">
                       <span className="text-xs font-bold text-slate-500 ">{h.label}</span>
                       <div className="text-right">
                          <p className="text-xs font-semibold text-slate-900 ">{h.val}</p>
                          {h.trend === 'up' ? (
                             <div className="flex items-center justify-end gap-1 text-xs font-semibold text-emerald-600 ">
                                <TrendingUp className="h-2 w-2" /> 12%
                             </div>
                          ) : (
                             <span className="text-xs font-semibold text-slate-400  ">TARGET MET</span>
                          )}
                       </div>
                    </div>
                 ))}
              </CardContent>
           </Card>
        </div>
      </div>

      {/* Global Financial Anomaly Banner */}
      <Card className="bg-rose-600 border-none overflow-hidden relative shadow-2xl shadow-rose-100 group cursor-pointer">
        <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform duration-700">
          <ShieldAlert className="h-32 w-32 text-white" />
        </div>
        <CardContent className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-8 relative">
          <div className="flex items-center gap-6">
             <div className="h-14 w-14 rounded-2xl bg-white/20 border border-white/10 flex items-center justify-center shrink-0">
                <DollarSign className="h-7 w-7 text-white animate-pulse" />
             </div>
             <div>
                <div className="flex items-center gap-3">
                   <Badge className="bg-white text-rose-600 font-semibold text-xs px-2 h-5 border-none">AUDIT ALERT</Badge>
                   <span className="text-xs font-semibold text-rose-100  ">Margin Variance Detect (&gt;15%)</span>
                </div>
                <p className="text-white text-base font-semibold  mt-2 ">Perhatian: Terdeteksi deviasi margin operasional di regional Bali. Segera lakukan audit transaksi.</p>
             </div>
          </div>
          <Button className="h-12 bg-white text-rose-600 hover:bg-slate-100 font-semibold text-sm   px-8 rounded-xl shadow-xl transition-all">
             Mulai Investigasi →
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
