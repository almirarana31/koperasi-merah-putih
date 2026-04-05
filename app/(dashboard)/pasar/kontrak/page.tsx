'use client'

import { useState, useMemo } from 'react'
import {
  FileText,
  Calendar,
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  Eye,
  Download,
  ShieldCheck,
  Search,
  Filter,
  ArrowUpRight,
  TrendingUp,
  History,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import { formatCurrency } from '@/lib/data'
import { KementerianFilterBar } from '@/components/dashboard/kementerian-filter-bar'
import { type ScopeFilters } from '@/lib/kementerian-dashboard-data'

const kontrakData = [
  {
    id: 'KTR001',
    nomorKontrak: 'KTR/2024/001',
    buyer: 'Hotel Grand Hyatt',
    tipeBuyer: 'hotel',
    provinceId: 'p-jabar',
    regionId: 'r-cianjur',
    villageId: 'v-sukamaju',
    cooperativeId: 'coop-001',
    cooperative: 'KSP Bakti Mandiri',
    periode: 'Jan 2024 - Jun 2024',
    mulai: '2024-01-01',
    selesai: '2024-06-30',
    items: [
      { komoditas: 'Beras Premium', kuantitas: 3000, satuan: 'kg/bulan', harga: 14000 },
      { komoditas: 'Cabai Merah', kuantitas: 200, satuan: 'kg/bulan', harga: 45000 },
    ],
    nilaiKontrak: 307200000,
    terpenuhi: 75,
    status: 'aktif',
    urgency: 'low',
  },
  {
    id: 'KTR002',
    nomorKontrak: 'KTR/2024/002',
    buyer: 'PT Indofood',
    tipeBuyer: 'fmcg',
    provinceId: 'p-jatim',
    regionId: 'r-malang',
    villageId: 'v-purworejo',
    cooperativeId: 'coop-002',
    cooperative: 'KUD Tani Makmur',
    periode: 'Feb 2024 - Jul 2024',
    mulai: '2024-02-01',
    selesai: '2024-07-31',
    items: [
      { komoditas: 'Jagung Pipil', kuantitas: 5000, satuan: 'kg/bulan', harga: 5500 },
    ],
    nilaiKontrak: 165000000,
    terpenuhi: 40,
    status: 'aktif',
    urgency: 'high',
  },
  {
    id: 'KTR003',
    nomorKontrak: 'KTR/2024/003',
    buyer: 'Superindo',
    tipeBuyer: 'retail',
    provinceId: 'p-jateng',
    regionId: 'r-wonosobo',
    villageId: 'v-dieng',
    cooperativeId: 'coop-003',
    cooperative: 'Koptan Dieng Jaya',
    periode: 'Mar 2024 - Aug 2024',
    mulai: '2024-03-01',
    selesai: '2024-08-31',
    items: [
      { komoditas: 'Kentang', kuantitas: 1000, satuan: 'kg/bulan', harga: 15000 },
      { komoditas: 'Wortel', kuantitas: 800, satuan: 'kg/bulan', harga: 10000 },
      { komoditas: 'Bawang Merah', kuantitas: 500, satuan: 'kg/bulan', harga: 35000 },
    ],
    nilaiKontrak: 196500000,
    terpenuhi: 0,
    status: 'pending',
    urgency: 'medium',
  },
  {
    id: 'KTR004',
    nomorKontrak: 'KTR/2023/015',
    buyer: 'Restoran Padang Sederhana',
    tipeBuyer: 'restoran',
    provinceId: 'p-sumbar',
    regionId: 'r-padang',
    villageId: 'v-paukh',
    cooperativeId: 'coop-004',
    cooperative: 'KUD Minang Maju',
    periode: 'Jul 2023 - Des 2023',
    mulai: '2023-07-01',
    selesai: '2023-12-31',
    items: [
      { komoditas: 'Beras Premium', kuantitas: 500, satuan: 'kg/bulan', harga: 13500 },
    ],
    nilaiKontrak: 40500000,
    terpenuhi: 100,
    status: 'selesai',
    urgency: 'low',
  },
]

const auditFeed = [
  { id: 1, event: 'Kontrak Baru Disetujui', target: 'KTR/2024/001', actor: 'Sistem AI', time: '5m ago', status: 'success' },
  { id: 2, event: 'Keterlambatan Pengiriman', target: 'KTR/2024/002', actor: 'Gudang Malang', time: '15m ago', status: 'warning' },
  { id: 3, event: 'Revisi Nilai Kontrak', target: 'KTR/2024/003', actor: 'Koptan Dieng', time: '1h ago', status: 'info' },
  { id: 4, event: 'Audit Tahunan Selesai', target: 'KTR/2023/015', actor: 'Kementerian', time: '3h ago', status: 'success' },
]

export default function KontrakKementerianPage() {
  const [filters, setFilters] = useState<ScopeFilters>({
    provinceId: 'all',
    regionId: 'all',
    villageId: 'all',
    cooperativeId: 'all',
    commodityId: 'all',
  })
  const [searchQuery, setSearchQuery] = useState('')

  const processedData = useMemo(() => {
    let scaleFactor = 1.0
    if (filters.cooperativeId !== 'all') scaleFactor = 0.1
    else if (filters.regionId !== 'all') scaleFactor = 0.25
    else if (filters.provinceId !== 'all') scaleFactor = 0.5

    const filtered = kontrakData.filter(item => {
      const matchProvince = filters.provinceId === 'all' || item.provinceId === filters.provinceId
      const matchRegency = filters.regionId === 'all' || item.regionId === filters.regionId
      const matchCoop = filters.cooperativeId === 'all' || item.cooperativeId === filters.cooperativeId
      const matchSearch = item.nomorKontrak.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.buyer.toLowerCase().includes(searchQuery.toLowerCase())
      return matchProvince && matchRegency && matchCoop && matchSearch
    })

    return filtered.map(item => ({
      ...item,
      nilaiKontrak: item.nilaiKontrak * scaleFactor,
    }))
  }, [filters, searchQuery])

  const stats = useMemo(() => {
    const totalNilai = processedData.reduce((acc, k) => acc + (k.status !== 'selesai' ? k.nilaiKontrak : 0), 0)
    const activeCount = processedData.filter(k => k.status === 'aktif').length
    const pendingCount = processedData.filter(k => k.status === 'pending').length
    const avgCompliance = processedData.length > 0 
      ? processedData.reduce((acc, k) => acc + k.terpenuhi, 0) / processedData.length 
      : 0

    return { totalNilai, activeCount, pendingCount, avgCompliance }
  }, [processedData])

  return (
    <div className="flex flex-col gap-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black tracking-tighter text-slate-900 uppercase">
              National Contract Monitoring
            </h1>
            <p className="text-[10px] font-bold tracking-widest text-slate-500 uppercase mt-2">
              AUDIT DAN PENGAWASAN KONTRAK STRATEGIS ANTARA KOPERASI DAN BUYER NASIONAL
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="h-8 text-[9px] font-black uppercase tracking-widest border-2 border-slate-200">
              <Download className="mr-2 h-3.5 w-3.5" /> EXPORT REPORT
            </Button>
            <Button className="h-8 bg-slate-900 text-[9px] font-black uppercase tracking-widest">
              <Plus className="mr-2 h-3.5 w-3.5" /> NEW STRATEGIC CONTRACT
            </Button>
          </div>
        </div>

        <KementerianFilterBar filters={filters} setFilters={setFilters} />
      </div>

      {/* KPI Section */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Card className="border-none shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-[9px] font-black tracking-widest text-slate-500 uppercase">ACTIVE PIPELINE VALUE</p>
              <TrendingUp className="h-4 w-4 text-emerald-600" />
            </div>
            <CardTitle className="text-xl font-black text-slate-900 mt-2">
              {formatCurrency(stats.totalNilai).replace('Rp', 'IDR ')}
            </CardTitle>
            <p className="text-[8px] font-black text-emerald-600 uppercase mt-1">+12.4% FROM LAST QUARTER</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-[9px] font-black tracking-widest text-slate-500 uppercase">TOTAL ACTIVE CONTRACTS</p>
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            </div>
            <CardTitle className="text-xl font-black text-slate-900 mt-2">{stats.activeCount}</CardTitle>
            <p className="text-[8px] font-black text-slate-500 uppercase mt-1">OPERATIONAL STABILITY: HIGH</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-[9px] font-black tracking-widest text-slate-500 uppercase">PENDING REVIEW</p>
              <Clock className="h-4 w-4 text-amber-500" />
            </div>
            <CardTitle className="text-xl font-black text-amber-600 mt-2">{stats.pendingCount}</CardTitle>
            <p className="text-[8px] font-black text-amber-600 uppercase mt-1">REQUIRES MINISTRY CLEARANCE</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <p className="text-[9px] font-black tracking-widest text-slate-500 uppercase">AVG. FULFILLMENT RATE</p>
              <ShieldCheck className="h-4 w-4 text-blue-500" />
            </div>
            <CardTitle className="text-xl font-black text-slate-900 mt-2">{stats.avgCompliance.toFixed(1)}%</CardTitle>
            <Progress value={stats.avgCompliance} className="h-1 bg-slate-100 mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-[1fr_350px]">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="SEARCH CONTRACTS BY ID OR BUYER..."
                className="h-9 pl-9 text-[10px] font-black uppercase tracking-widest border-slate-200"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" className="h-9 text-[10px] font-black uppercase tracking-widest border-2">
              <Filter className="mr-2 h-3.5 w-3.5" /> ADVANCED FILTERS
            </Button>
          </div>

          <div className="space-y-3">
            {processedData.length > 0 ? (
              processedData.map((kontrak) => (
                <Card key={kontrak.id} className="border-none shadow-sm hover:bg-slate-50/50 transition-all overflow-hidden group">
                  <div className="h-1 w-full bg-slate-100 group-hover:bg-slate-900 transition-colors" />
                  <div className="grid md:grid-cols-[200px_1fr_200px] divide-x-2 divide-slate-100">
                    {/* Contract Entity */}
                    <div className="p-4 flex flex-col justify-between">
                      <div>
                        <Badge variant="outline" className="mb-2 font-black border-slate-900 text-[8px] uppercase px-1.5 h-4">
                          {kontrak.nomorKontrak}
                        </Badge>
                        <h3 className="text-[11px] font-black text-slate-900 uppercase leading-tight">{kontrak.buyer}</h3>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter mt-1">
                          {kontrak.id}
                        </p>
                      </div>
                      <div className="mt-4 pt-3 border-t border-dashed border-slate-100">
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">Provider Node</p>
                        <p className="text-[10px] font-black text-slate-700 uppercase leading-tight truncate">{kontrak.cooperative}</p>
                      </div>
                    </div>

                    {/* Contract Details */}
                    <div className="p-4 space-y-4">
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <p className="text-[8px] font-black text-slate-400 uppercase mb-1 tracking-widest">CONTRACT PERIOD</p>
                          <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-700">
                            <Calendar className="h-3 w-3 text-slate-400" /> {kontrak.periode}
                          </div>
                        </div>
                        <div>
                          <p className="text-[8px] font-black text-slate-400 uppercase mb-1 tracking-widest">COMMODITY MIX</p>
                          <div className="flex flex-wrap gap-1">
                            {kontrak.items.map((item, idx) => (
                              <Badge key={idx} variant="secondary" className="text-[8px] font-black bg-slate-100 text-slate-600 uppercase">
                                {item.komoditas}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="pt-2">
                        <div className="flex items-center justify-between mb-1 text-[8px] font-black uppercase tracking-widest">
                          <span className="text-slate-500">EXECUTION PROGRESS</span>
                          <span className={kontrak.terpenuhi < 50 ? 'text-rose-600' : 'text-emerald-600'}>
                            {kontrak.terpenuhi}% FULFILLED
                          </span>
                        </div>
                        <Progress 
                          value={kontrak.terpenuhi} 
                          className={`h-1 ${kontrak.terpenuhi < 50 ? 'bg-rose-100' : 'bg-emerald-100'}`} 
                        />
                      </div>
                    </div>

                    {/* Financials & Actions */}
                    <div className="p-4 flex flex-col justify-between items-end text-right">
                      <div className="space-y-1">
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">CONTRACT VALUE</p>
                        <p className="text-base font-black text-slate-900 leading-none">{formatCurrency(kontrak.nilaiKontrak)}</p>
                        <Badge className={`mt-2 font-black text-[8px] uppercase h-4 px-1.5 ${
                          kontrak.status === 'aktif' ? 'bg-emerald-500' : 
                          kontrak.status === 'pending' ? 'bg-amber-500' : 'bg-slate-500'
                        }`}>
                          {kontrak.status}
                        </Badge>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="h-7 text-[8px] font-black uppercase tracking-widest border-2">
                          <Eye className="h-3 w-3 mr-1" /> AUDIT
                        </Button>
                        <Button size="sm" className="h-7 text-[8px] font-black uppercase tracking-widest bg-slate-900">
                          <ArrowUpRight className="h-3 w-3 mr-1" /> ACTION
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <div className="p-12 text-center border-2 border-dashed rounded-xl">
                <AlertCircle className="h-10 w-10 mx-auto text-slate-300 mb-4" />
                <h3 className="text-xs font-black text-slate-900 uppercase">NO CONTRACTS FOUND</h3>
                <p className="text-[10px] font-bold text-slate-500 uppercase mt-1">ADJUST FILTERS TO BROADEN SCOPE</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Monitoring */}
        <div className="space-y-6">
          <Card className="border-none shadow-sm bg-slate-900 text-white overflow-hidden">
            <div className="h-1 w-full bg-emerald-500" />
            <CardHeader className="p-4 pb-2">
              <CardTitle className="text-[11px] font-black flex items-center gap-2 uppercase tracking-widest">
                <ShieldCheck className="h-4 w-4 text-emerald-400" /> AI RISK MONITOR
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              <div className="p-3 bg-slate-800 rounded border border-slate-700">
                <p className="text-[8px] font-black text-slate-400 uppercase mb-2 text-center tracking-widest">SUPPLY COMPLIANCE HEALTH</p>
                <div className="flex justify-around items-end h-12 gap-1.5">
                  <div className="w-full bg-emerald-500 h-[80%] rounded-t-sm" />
                  <div className="w-full bg-emerald-500 h-[95%] rounded-t-sm" />
                  <div className="w-full bg-emerald-500 h-[70%] rounded-t-sm" />
                  <div className="w-full bg-rose-500 h-[30%] rounded-t-sm" />
                  <div className="w-full bg-emerald-500 h-[85%] rounded-t-sm" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[9px] font-black p-2 bg-slate-800 rounded border border-slate-700 uppercase tracking-tighter">
                  <span className="text-slate-400">CONTRACT RISKS</span>
                  <span className="text-rose-400">02 DETECTED</span>
                </div>
                <div className="flex items-center justify-between text-[9px] font-black p-2 bg-slate-800 rounded border border-slate-700 uppercase tracking-tighter">
                  <span className="text-slate-400">NEW OPPORTUNITIES</span>
                  <span className="text-emerald-400">14 ANALYZED</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm">
            <CardHeader className="p-4 pb-2 border-b border-slate-50">
              <CardTitle className="text-[11px] font-black flex items-center gap-2 uppercase tracking-widest text-slate-900">
                <History className="h-4 w-4 text-slate-400" /> LIVE AUDIT FEED
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100">
                {auditFeed.map((item) => (
                  <div key={item.id} className="p-4 hover:bg-slate-50 transition-colors group">
                    <div className="flex justify-between items-start mb-1">
                      <span className="text-[9px] font-black text-slate-900 uppercase tracking-tight">{item.event}</span>
                      <span className="text-[8px] font-bold text-slate-300 uppercase">{item.time}</span>
                    </div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">REF: {item.target}</p>
                    <div className="flex items-center gap-1.5 font-black text-slate-300 uppercase text-[8px] mt-2 group-hover:text-slate-500 transition-colors">
                      BY {item.actor}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <div className="p-3 bg-slate-50 border-t border-slate-100">
              <Button variant="ghost" className="w-full h-7 text-[9px] font-black text-slate-500 hover:text-slate-900 uppercase tracking-widest">
                VIEW FULL AUDIT LOGS
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
