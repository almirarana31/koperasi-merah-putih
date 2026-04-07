'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  ArrowRight,
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
  MapPin,
  Download,
  FileText,
  Search,
  Filter,
  BarChart3,
  History,
  Plus,
} from 'lucide-react'
import { useAuth } from '@/lib/auth/use-auth'
import { formatCurrency, formatDate, loans, members } from '@/lib/data'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useToast } from '@/components/ui/use-toast'
import { KementerianFilterBar } from '@/components/dashboard/kementerian-filter-bar'
import type { ScopeFilters } from '@/lib/kementerian-dashboard-data'

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
  const { toast } = useToast()
  const [search, setSearch] = useState('')
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
    const totalVolume = Math.ceil(4528000000 * scaleFactor)
    const activeApps = Math.ceil(124 * scaleFactor)
    const avgScore = 712
    const nplRate = (2.4).toFixed(1)
    return { totalVolume, activeApps, avgScore, nplRate }
  }, [scaleFactor])

  const filteredQueue = useMemo(() => {
    return REVIEWER_APPLICATIONS.filter((item) => {
      const matchesSearch = item.borrowerName.toLowerCase().includes(search.toLowerCase()) || 
                           item.id.toLowerCase().includes(search.toLowerCase())
      return matchesSearch
    })
  }, [search])

  if (!user) return null

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
            <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">NATIONAL CREDIT HUB</h1>
          </div>
          <p className="text-[10px] font-black text-slate-500 mt-1 uppercase tracking-widest leading-relaxed ml-12">
            CREDIT FLOW MONITORING & RISK ASSESSMENT • {stats.activeApps} ACTIVE APPLICATIONS • {formatCurrency(stats.totalVolume)} TOTAL VOLUME
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" className="h-9 text-[10px] font-black uppercase tracking-widest border-slate-200 text-slate-600 rounded-none" onClick={() => toast({ title: "Portfolio Sync", description: "Aggregating regional credit flows into national risk matrix..." })}>
            <History className="h-3.5 w-3.5 mr-2 text-blue-600" />
            HISTORY
          </Button>
          <Button size="sm" className="h-9 bg-slate-900 text-white hover:bg-slate-800 text-[10px] font-black uppercase tracking-widest px-6 rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] transition-all" onClick={() => toast({ title: "Audit Hub", description: "Generating cross-entity credit integrity report..." })}>
            <Download className="h-4 w-4 mr-2" />
            AUDIT HUB
          </Button>
        </div>
      </div>

      <KementerianFilterBar filters={filters} setFilters={setFilters} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'ANTRIAN APLIKASI', value: stats.activeApps, sub: 'PENDING REVIEW', icon: Clock3, tone: 'slate' },
          { label: 'VOLUME PENGAJUAN', value: (stats.totalVolume / 1000000000).toFixed(2) + ' B', sub: 'BILLION IDR', icon: CircleDollarSign, tone: 'emerald' },
          { label: 'AVG CREDIT SCORE', value: stats.avgScore, sub: 'NATIONAL RATING', icon: Activity, tone: 'blue' },
          { label: 'DEFAULT RISK', value: stats.nplRate + '%', sub: 'SYSTEMIC INDEX', icon: ShieldAlert, tone: 'rose' },
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
          <Card className="border-none bg-white shadow-sm overflow-hidden rounded-none">
            <div className="h-1 w-full bg-slate-900" />
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="SEARCH APPLICATIONS BY MEMBER NAME OR TRX ID..."
                  className="pl-9 h-11 text-[10px] font-black uppercase tracking-widest bg-slate-50 border-slate-100 rounded-none focus-visible:ring-slate-900"
                />
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            {filteredQueue.map((item) => {
              const status = reviewStatusMeta(item.status)
              return (
                <Card key={item.id} className="border-none shadow-sm hover:shadow-md transition-all group bg-white overflow-hidden rounded-none">
                  <div className={`h-1 w-full ${item.status === 'baru' ? 'bg-blue-500' : item.status === 'disetujui' ? 'bg-emerald-500' : 'bg-slate-900'}`} />
                  <CardHeader className="p-4 pb-2">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 bg-slate-100 flex items-center justify-center font-black text-[10px] text-slate-500 rounded-none">
                           {item.borrowerName.split(' ')[1]?.[0] || item.borrowerName[0]}
                        </div>
                        <div>
                           <CardTitle className="text-[11px] font-black text-slate-900 uppercase tracking-tight leading-tight">
                              {item.borrowerName}
                           </CardTitle>
                           <div className="flex items-center gap-2 mt-0.5">
                              <Badge className={`text-[8px] font-black border-none px-1.5 h-4 uppercase rounded-none tracking-tighter ${status.className}`}>
                                 {status.label}
                              </Badge>
                              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">#{item.id}</span>
                           </div>
                        </div>
                      </div>
                      <div className="text-right">
                         <p className="text-[10px] font-black text-slate-900">{formatCurrency(item.amount)}</p>
                         <p className="text-[8px] font-bold text-slate-400 uppercase">{item.tenor}M TENOR</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 space-y-4">
                    <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-50">
                       <div className="flex flex-col">
                          <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">REGION</span>
                          <span className="text-[9px] font-black text-slate-900 uppercase mt-0.5">{item.village}</span>
                       </div>
                       <div className="flex flex-col">
                          <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">COMMODITY</span>
                          <span className="text-[9px] font-black text-slate-900 uppercase mt-0.5">{item.commodity}</span>
                       </div>
                       <div className="flex flex-col text-right">
                          <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">SCORE</span>
                          <span className="text-[9px] font-black text-emerald-600 mt-0.5">{item.score}</span>
                       </div>
                    </div>
                    <div className="p-3 bg-slate-50 border border-slate-100 italic text-[9px] font-black text-slate-500 uppercase leading-relaxed tracking-wider">
                       "{item.recommendation}"
                    </div>
                    <div className="flex gap-2">
                       <Button variant="outline" className="flex-1 h-8 border-slate-200 text-slate-600 font-black text-[9px] uppercase tracking-widest rounded-none hover:bg-slate-50" onClick={() => toast({ title: "Document Review", description: "Loading electronic KYC and supporting documents for audit..." })}>
                          REVIEW DOCS
                       </Button>
                       <Button className="flex-1 h-8 bg-slate-900 text-white font-black text-[9px] uppercase tracking-widest rounded-none hover:bg-slate-800 transition-all" onClick={() => toast({ title: "Final Approval", description: "Submitting application " + item.id + " to national committee for final disbursement..." })}>
                          EXECUTE APPROVAL
                       </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>

        <div className="space-y-6">
          <Card className="border-none shadow-xl bg-slate-950 text-white overflow-hidden rounded-none">
            <CardHeader className="p-4 border-b border-white/5 bg-slate-900/50">
               <div className="flex items-center justify-between">
                  <CardTitle className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                     <Activity className="h-4 w-4 text-blue-500" /> CREDIT FEED
                  </CardTitle>
                  <div className="flex items-center gap-1.5">
                     <div className="h-1 w-1 bg-blue-500 rounded-full animate-ping" />
                     <span className="text-[9px] font-black text-blue-500 tracking-widest">LIVE</span>
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
                    <div key={i} className="p-4 hover:bg-white/5 transition-colors cursor-pointer group">
                       <div className="flex items-center justify-between mb-2">
                          <Badge className={`text-[8px] font-black px-1.5 h-4 border-none rounded-none tracking-widest ${
                            log.status === 'WARN' ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-400'
                          }`}>
                             {log.status}
                          </Badge>
                          <span className="text-[9px] font-mono text-slate-600 group-hover:text-slate-400">{log.time}</span>
                       </div>
                       <p className="text-xs font-black text-slate-200 uppercase tracking-tight leading-tight">{log.action}</p>
                       <p className="text-[9px] font-bold text-slate-500 mt-1 uppercase">REGION: {log.borrower}</p>
                    </div>
                  ))}
               </div>
               <div className="p-4 bg-white/5 border-t border-white/5">
                  <Button variant="ghost" className="w-full text-[10px] font-black text-slate-500 hover:text-white uppercase tracking-widest h-9 rounded-none" onClick={() => toast({ title: "Master Logs", description: "Loading national credit assessment logs..." })}>
                     FULL CREDIT LOGS →
                  </Button>
               </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-slate-50 rounded-none">
             <CardHeader className="p-4 border-b border-slate-200">
                <CardTitle className="text-[10px] font-black uppercase tracking-widest text-slate-900">RISK ASSESSMENT</CardTitle>
             </CardHeader>
             <CardContent className="p-4 space-y-4">
                {[
                  { label: 'COLLECTIBILITY INDEX', val: '98.2%', status: 'Optimal' },
                  { label: 'BRANCH LIQUIDITY', val: 'Rp 4.2B', status: 'Stable' },
                  { label: 'SECTOR CONCENTRATION', val: 'PADI', status: 'High' },
                ].map((h, i) => (
                   <div key={i} className="flex items-center justify-between">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{h.label}</span>
                      <div className="text-right">
                         <p className="text-[10px] font-black text-slate-900">{h.val}</p>
                         <p className="text-[9px] font-black text-emerald-600 uppercase tracking-tighter">{h.status}</p>
                      </div>
                   </div>
                ))}
                <Button className="w-full h-9 bg-white border border-slate-200 text-slate-900 font-black text-[9px] uppercase tracking-widest hover:bg-slate-50 shadow-sm rounded-none mt-2" onClick={() => toast({ title: "Risk Heatmap", description: "Visualizing regional default probabilities and systemic risk clusters..." })}>
                   VIEW RISK HEATMAP
                </Button>
             </CardContent>
          </Card>
        </div>
      </div>

      <Card className="border-none overflow-hidden relative group cursor-pointer bg-rose-50 border border-rose-100 rounded-none" onClick={() => toast({ title: "Audit Triggered", description: "Initiating forensic credit review for seasonal volatility in Jawa Timur region..." })}>
        <div className="absolute top-0 right-0 p-6 opacity-10 transition-transform duration-700 group-hover:scale-110">
          <ShieldAlert className="h-32 w-32 text-rose-900" />
        </div>
        <CardContent className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-8 relative">
          <div className="flex items-center gap-6">
             <div className="flex h-14 w-14 items-center justify-center rounded-none bg-rose-600 text-white shadow-xl shadow-rose-200 shrink-0">
                <FileWarning className="h-7 w-7" />
             </div>
             <div>
                <div className="flex items-center gap-3">
                   <Badge className="bg-rose-600 text-white text-[10px] font-black px-2 h-5 rounded-none tracking-widest border-none">SYSTEM ALERT</Badge>
                   <span className="text-[10px] font-black text-rose-900 uppercase tracking-widest">High Volatility Detected</span>
                </div>
                <p className="mt-2 text-lg font-black text-rose-900 uppercase tracking-tight">ALERT: Application surge detected in Jawa Timur (Planting Season Credit). Strict scoring audit recommended.</p>
             </div>
          </div>
          <Button className="bg-rose-900 text-white hover:bg-rose-800 h-12 rounded-none px-8 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-rose-200 transition-all">
             REGIONAL AUDIT
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
