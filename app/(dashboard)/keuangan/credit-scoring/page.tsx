'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Search,
  TrendingUp,
  TrendingDown,
  Users,
  AlertTriangle,
  CheckCircle,
  XCircle,
  BarChart3,
  PieChart,
  Activity,
  ShieldCheck,
  FileText,
  CreditCard,
  Wallet,
  ShoppingCart,
  Calendar,
  ChevronRight,
  Info,
  Download,
  History,
  ShieldAlert,
  AuditSquare,
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useToast } from '@/components/ui/use-toast'
import { useAuth } from '@/lib/auth/use-auth'
import { KementerianFilterBar } from '@/components/dashboard/kementerian-filter-bar'
import type { ScopeFilters } from '@/lib/kementerian-dashboard-data'

// Credit Score Ranges
const getScoreColor = (score: number) => {
  if (score >= 750) return 'text-emerald-500'
  if (score >= 650) return 'text-blue-500'
  if (score >= 550) return 'text-amber-500'
  if (score >= 450) return 'text-orange-500'
  return 'text-rose-500'
}

const getScoreBadge = (score: number) => {
  if (score >= 750) return { label: 'PRIME', color: 'bg-emerald-100 text-emerald-700' }
  if (score >= 650) return { label: 'GOOD', color: 'bg-blue-100 text-blue-700' }
  if (score >= 550) return { label: 'FAIR', color: 'bg-amber-100 text-amber-700' }
  if (score >= 450) return { label: 'LOW', color: 'bg-orange-100 text-orange-700' }
  return { label: 'CRITICAL', color: 'bg-rose-100 text-rose-700' }
}

const getLoanEligibility = (score: number) => {
  if (score >= 750) return { eligible: true, maxLoan: 50000000, interestRate: 6, message: 'Eligible for Premium Credit' }
  if (score >= 650) return { eligible: true, maxLoan: 25000000, interestRate: 8, message: 'Eligible for Standard Credit' }
  if (score >= 550) return { eligible: true, maxLoan: 10000000, interestRate: 10, message: 'Limited Credit Eligibility' }
  if (score >= 450) return { eligible: false, maxLoan: 5000000, interestRate: 12, message: 'Manual Review Required' }
  return { eligible: false, maxLoan: 0, interestRate: 0, message: 'Not Eligible for Credit' }
}

// Mock member credit data
const memberCreditData = [
  { id: 'M001', nama: 'Pak Slamet Widodo', nik: '3201012345678901', tipe: 'petani', creditScore: 785, lastUpdated: '2026-03-01', kycVerified: true, dukcapilVerified: true, factors: { paymentHistory: 95, creditUtilization: 25, creditAge: 48, totalAccounts: 3, recentInquiries: 1 }, financials: { totalSimpanan: 15000000, totalPinjaman: 10000000, sisaPinjaman: 3000000, pendapatanBulanan: 8500000, pengeluaranBulanan: 5200000 }, purchaseHistory: { totalTransactions: 156, avgMonthlySpend: 2500000, topCategories: ['Pupuk', 'Bibit', 'Peralatan'], lastPurchase: '2026-03-05' }, loanHistory: [{ id: 'L001', amount: 5000000, status: 'lunas', date: '2024-01-15' }, { id: 'L002', amount: 10000000, status: 'aktif', date: '2025-06-01' }] },
  { id: 'M002', nama: 'Bu Sri Wahyuni', nik: '3201019876543210', tipe: 'umkm', creditScore: 692, lastUpdated: '2026-03-02', kycVerified: true, dukcapilVerified: true, factors: { paymentHistory: 88, creditUtilization: 35, creditAge: 36, totalAccounts: 2, recentInquiries: 2 }, financials: { totalSimpanan: 8500000, totalPinjaman: 15000000, sisaPinjaman: 8000000, pendapatanBulanan: 12000000, pengeluaranBulanan: 8500000 }, purchaseHistory: { totalTransactions: 89, avgMonthlySpend: 4200000, topCategories: ['Bahan Makanan', 'Packaging', 'Bumbu'], lastPurchase: '2026-03-06' }, loanHistory: [{ id: 'L003', amount: 15000000, status: 'aktif', date: '2025-08-01' }] },
  { id: 'M003', nama: 'Pak Ahmad Sudirman', nik: '3201015555666677', tipe: 'petani', creditScore: 548, lastUpdated: '2026-03-01', kycVerified: true, dukcapilVerified: true, factors: { paymentHistory: 72, creditUtilization: 65, creditAge: 18, totalAccounts: 1, recentInquiries: 4 }, financials: { totalSimpanan: 3200000, totalPinjaman: 8000000, sisaPinjaman: 6500000, pendapatanBulanan: 5000000, pengeluaranBulanan: 4200000 }, purchaseHistory: { totalTransactions: 45, avgMonthlySpend: 1200000, topCategories: ['Pupuk', 'Pestisida'], lastPurchase: '2026-02-28' }, loanHistory: [{ id: 'L004', amount: 8000000, status: 'aktif', date: '2025-11-01' }] },
]

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount)
}

export default function CreditScoringPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [filters, setFilters] = useState<ScopeFilters>({ provinceId: 'all', regionId: 'all', villageId: 'all', cooperativeId: 'all', commodityId: 'all' })
  const [search, setSearch] = useState('')

  const scaleFactor = useMemo(() => {
    if (filters.cooperativeId !== 'all') return 0.05
    if (filters.villageId !== 'all') return 0.15
    if (filters.regionId !== 'all') return 0.4
    if (filters.provinceId !== 'all') return 0.7
    return 1.0
  }, [filters])

  const stats = useMemo(() => {
    const totalMembers = Math.ceil(12480 * scaleFactor)
    const primeCount = Math.ceil(totalMembers * 0.22)
    const avgScore = 684
    const defaultRisk = (2.4).toFixed(1)
    return { totalMembers, primeCount, avgScore, defaultRisk }
  }, [scaleFactor])

  const filteredMembers = memberCreditData.filter((m) => m.nama.toLowerCase().includes(search.toLowerCase()) || m.nik.includes(search))

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
            <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">CREDIT RATING HUB</h1>
          </div>
          <p className="text-[10px] font-black text-slate-500 mt-1 uppercase tracking-widest leading-relaxed ml-12">
            AI-DRIVEN RISK ASSESSMENT & MEMBER SCORING • {stats.totalMembers} AUDITED MEMBERS IN NETWORK
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" className="h-9 text-[10px] font-black uppercase tracking-widest border-slate-200 text-slate-600 rounded-none" onClick={() => toast({ title: "Model Sync", description: "Updating risk parameters with latest transactional data..." })}>
            <History className="h-3.5 w-3.5 mr-2 text-blue-600" />
            RE-SCORE ALL
          </Button>
          <Button size="sm" className="h-9 bg-slate-900 text-white hover:bg-slate-800 text-[10px] font-black uppercase tracking-widest px-6 rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] transition-all" onClick={() => toast({ title: "Audit Initiation", description: "Generating cross-entity credit integrity report..." })}>
            <Download className="h-4 w-4 mr-2" />
            EXPORT AUDIT
          </Button>
        </div>
      </div>

      <KementerianFilterBar filters={filters} setFilters={setFilters} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'RATA-RATA SKOR', value: stats.avgScore, sub: 'NATIONAL RATING', icon: BarChart3, tone: 'blue' },
          { label: 'MEMBER PRIME', value: stats.primeCount, sub: 'HIGH TRUST ASSETS', icon: ShieldCheck, tone: 'emerald' },
          { label: 'ELIGIBLE CREDIT', value: Math.ceil(stats.totalMembers * 0.84), sub: 'MARKET REACH', icon: CreditCard, tone: 'emerald' },
          { label: 'DEFAULT RISK', value: stats.defaultRisk + '%', sub: 'SYSTEMIC INDEX', icon: Activity, tone: 'rose' },
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
                  placeholder="SEARCH MEMBER BY NAME, NIK, OR ENTITY ID..."
                  className="pl-9 h-11 text-[10px] font-black uppercase tracking-widest bg-slate-50 border-slate-100 rounded-none focus-visible:ring-slate-900"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-none bg-white shadow-sm overflow-hidden rounded-none">
            <div className="h-1 w-full bg-slate-900" />
            <CardHeader className="p-6 border-b border-slate-50">
              <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-900">MEMBER RATING MANIFEST</CardTitle>
              <CardDescription className="text-[10px] font-bold text-slate-400 uppercase mt-1">COMPREHENSIVE CREDIT AUDIT LOG</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-slate-900">
                  <TableRow className="hover:bg-slate-900 border-none">
                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400 h-10 px-6">MEMBER / TYPE</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400 h-10 px-6 text-center">SCORE</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400 h-10 px-6 text-center">STATUS</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400 h-10 px-6 text-center">VERIFIED</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400 h-10 px-6 text-right">AUDIT</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMembers.map((m) => (
                    <TableRow key={m.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors group">
                      <TableCell className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 bg-slate-100 flex items-center justify-center font-black text-[10px] text-slate-500 rounded-none">
                             {m.nama.split(' ')[1]?.[0] || m.nama[0]}
                          </div>
                          <div>
                             <p className="text-xs font-black text-slate-900 uppercase tracking-tight">{m.nama}</p>
                             <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{m.tipe}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4 text-center">
                        <span className={`text-lg font-black ${getScoreColor(m.creditScore)}`}>{m.creditScore}</span>
                      </TableCell>
                      <TableCell className="px-6 py-4 text-center">
                        <Badge className={`text-[9px] font-black border-none px-2 h-5 uppercase rounded-none ${getScoreBadge(m.creditScore).color}`}>
                           {getScoreBadge(m.creditScore).label}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                           {m.kycVerified && <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />}
                           {m.dukcapilVerified && <CheckCircle className="h-3.5 w-3.5 text-blue-500" />}
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4 text-right">
                        <Button variant="ghost" size="sm" className="h-8 text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 hover:bg-white rounded-none group-hover:shadow-sm" onClick={() => toast({ title: "Risk Diagnostic", description: "Opening factor analysis for " + m.nama })}>
                           DETAIL
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
                     <Activity className="h-4 w-4 text-blue-500" /> RISK ENGINE FEED
                  </CardTitle>
                  <div className="flex items-center gap-1.5">
                     <div className="h-1 w-1 bg-blue-500 rounded-full animate-ping" />
                     <span className="text-[9px] font-black text-blue-500 tracking-widest">ACTIVE</span>
                  </div>
               </div>
            </CardHeader>
            <CardContent className="p-0">
               <div className="divide-y divide-white/5">
                  {[
                    { time: '14:20', action: 'KYC Sync: JKT-042', status: 'VERIFIED', val: 'PASSED' },
                    { time: '13:15', action: 'Anomaly: RT-992', status: 'CRITICAL', val: 'AUDIT' },
                    { time: '12:58', action: 'New Score: RT-124', status: 'PRIME', val: '812' },
                    { time: '11:42', action: 'Batch Re-Rating Q1', status: 'COMPLETE', val: '1.2K' },
                  ].map((log, i) => (
                    <div key={i} className="p-4 hover:bg-white/5 transition-colors cursor-pointer group">
                       <div className="flex items-center justify-between mb-2">
                          <Badge className={`text-[9px] font-black px-1.5 h-4 border-none rounded-none tracking-widest ${
                            log.status === 'CRITICAL' ? 'bg-rose-600 text-white' : 
                            log.status === 'VERIFIED' || log.status === 'PRIME' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
                          }`}>
                             {log.status}
                          </Badge>
                          <span className="text-[9px] font-mono text-slate-600 group-hover:text-slate-400">{log.time}</span>
                       </div>
                       <p className="text-xs font-black text-slate-200 uppercase tracking-tight leading-tight">{log.action}</p>
                       <p className="text-[9px] font-bold text-slate-500 mt-1 uppercase">NODE STATUS: {log.val}</p>
                    </div>
                  ))}
               </div>
               <div className="p-4 bg-white/5 border-t border-white/5">
                  <Button variant="ghost" className="w-full text-[10px] font-black text-slate-500 hover:text-white uppercase tracking-widest h-9 rounded-none" onClick={() => toast({ title: "Master Logs", description: "Loading national risk assessment logs..." })}>
                     FULL RISK LOGS →
                  </Button>
               </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-slate-50 rounded-none">
             <CardHeader className="p-4 border-b border-slate-200">
                <CardTitle className="text-[10px] font-black uppercase tracking-widest text-slate-900">RATING COMPOSITION</CardTitle>
             </CardHeader>
             <CardContent className="p-4 space-y-4">
                {[
                  { label: 'PRIME ASSETS', val: '22.4%', color: 'bg-emerald-500' },
                  { label: 'STANDARD TRUST', val: '62.1%', color: 'bg-blue-500' },
                  { label: 'HIGH RISK', val: '15.5%', color: 'bg-rose-500' },
                ].map((h, i) => (
                   <div key={i} className="space-y-2">
                      <div className="flex items-center justify-between">
                         <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{h.label}</span>
                         <span className="text-[10px] font-black text-slate-900">{h.val}</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-200 rounded-none overflow-hidden">
                         <div className={`h-full ${h.color}`} style={{ width: h.val }} />
                      </div>
                   </div>
                ))}
             </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
                  <TableCell className="text-center">
                        <Badge className={`${scoreBadge.color} text-white`}>
                          {scoreBadge.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          {member.kycVerified ? (
                            <ShieldCheck className="h-4 w-4 text-emerald-500" aria-label="KYC Verified" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500" aria-label="KYC Pending" />
                          )}
                          {member.dukcapilVerified ? (
                            <CheckCircle className="h-4 w-4 text-emerald-500" aria-label="Dukcapil Verified" />
                          ) : (
                            <AlertTriangle className="h-4 w-4 text-amber-500" aria-label="Dukcapil Pending" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        {eligibility.eligible ? (
                          <span className="font-medium text-emerald-600">
                            {formatCurrency(eligibility.maxLoan)}
                          </span>
                        ) : (
                          <span className="text-muted-foreground text-sm">Tidak Eligible</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              Detail
                              <ChevronRight className="ml-1 h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Detail Credit Score</DialogTitle>
                              <DialogDescription>{member.nama}</DialogDescription>
                            </DialogHeader>
                            <MemberCreditDetail member={member} />
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Member Credit Detail Component
function MemberCreditDetail({ member }: { member: typeof memberCreditData[0] }) {
  const scoreBadge = getScoreBadge(member.creditScore)
  const eligibility = getLoanEligibility(member.creditScore)

  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="overview" className="text-xs sm:text-sm">Overview</TabsTrigger>
        <TabsTrigger value="factors" className="text-xs sm:text-sm">Faktor Skor</TabsTrigger>
        <TabsTrigger value="history" className="text-xs sm:text-sm">Riwayat</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-4 mt-4">
        {/* Credit Score Gauge */}
        <div className="text-center p-4 rounded-lg bg-muted/50">
          <p className={`text-5xl font-bold ${getScoreColor(member.creditScore)}`}>
            {member.creditScore}
          </p>
          <Badge className={`${scoreBadge.color} text-white mt-2`}>
            {scoreBadge.label}
          </Badge>
          <p className="text-sm text-muted-foreground mt-2">
            Update terakhir: {member.lastUpdated}
          </p>
        </div>

        {/* Eligibility Status */}
        <Card className={eligibility.eligible ? 'border-emerald-500/50' : 'border-amber-500/50'}>
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              {eligibility.eligible ? (
                <CheckCircle className="h-5 w-5 text-emerald-500 mt-0.5" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
              )}
              <div>
                <p className={`font-semibold ${eligibility.eligible ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {eligibility.message}
                </p>
                {eligibility.eligible && (
                  <div className="mt-2 grid gap-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Maksimal Pinjaman:</span>
                      <span className="font-medium">{formatCurrency(eligibility.maxLoan)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Bunga:</span>
                      <span className="font-medium">{eligibility.interestRate}% per tahun</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Financial Summary */}
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border p-3">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Wallet className="h-4 w-4" />
              <span className="text-xs">Total Simpanan</span>
            </div>
            <p className="text-lg font-bold text-emerald-600">
              {formatCurrency(member.financials.totalSimpanan)}
            </p>
          </div>
          <div className="rounded-lg border p-3">
            <div className="flex items-center gap-2 text-muted-foreground">
              <CreditCard className="h-4 w-4" />
              <span className="text-xs">Sisa Pinjaman</span>
            </div>
            <p className="text-lg font-bold text-amber-600">
              {formatCurrency(member.financials.sisaPinjaman)}
            </p>
          </div>
          <div className="rounded-lg border p-3">
            <div className="flex items-center gap-2 text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              <span className="text-xs">Pendapatan/Bulan</span>
            </div>
            <p className="text-lg font-bold">
              {formatCurrency(member.financials.pendapatanBulanan)}
            </p>
          </div>
          <div className="rounded-lg border p-3">
            <div className="flex items-center gap-2 text-muted-foreground">
              <TrendingDown className="h-4 w-4" />
              <span className="text-xs">Pengeluaran/Bulan</span>
            </div>
            <p className="text-lg font-bold">
              {formatCurrency(member.financials.pengeluaranBulanan)}
            </p>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="factors" className="space-y-4 mt-4">
        <div className="space-y-3">
          <div className="rounded-lg border p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Riwayat Pembayaran</span>
              </div>
              <span className="text-sm font-bold text-emerald-600">{member.factors.paymentHistory}%</span>
            </div>
            <Progress value={member.factors.paymentHistory} className="h-2" />
            <p className="text-xs text-muted-foreground mt-1">Bobot: 35% dari total skor</p>
          </div>

          <div className="rounded-lg border p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <PieChart className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Utilisasi Kredit</span>
              </div>
              <span className={`text-sm font-bold ${member.factors.creditUtilization <= 30 ? 'text-emerald-600' : member.factors.creditUtilization <= 50 ? 'text-amber-600' : 'text-red-600'}`}>
                {member.factors.creditUtilization}%
              </span>
            </div>
            <Progress value={member.factors.creditUtilization} className="h-2" />
            <p className="text-xs text-muted-foreground mt-1">Bobot: 30% dari total skor (lebih rendah = lebih baik)</p>
          </div>

          <div className="rounded-lg border p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Usia Kredit</span>
              </div>
              <span className="text-sm font-bold">{member.factors.creditAge} bulan</span>
            </div>
            <Progress value={Math.min(member.factors.creditAge / 60 * 100, 100)} className="h-2" />
            <p className="text-xs text-muted-foreground mt-1">Bobot: 15% dari total skor</p>
          </div>

          <div className="rounded-lg border p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Total Akun</span>
              </div>
              <span className="text-sm font-bold">{member.factors.totalAccounts}</span>
            </div>
            <Progress value={member.factors.totalAccounts / 5 * 100} className="h-2" />
            <p className="text-xs text-muted-foreground mt-1">Bobot: 10% dari total skor</p>
          </div>

          <div className="rounded-lg border p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Inquiry Terakhir</span>
              </div>
              <span className={`text-sm font-bold ${member.factors.recentInquiries <= 2 ? 'text-emerald-600' : 'text-amber-600'}`}>
                {member.factors.recentInquiries}
              </span>
            </div>
            <Progress value={(5 - Math.min(member.factors.recentInquiries, 5)) / 5 * 100} className="h-2" />
            <p className="text-xs text-muted-foreground mt-1">Bobot: 10% dari total skor (lebih sedikit = lebih baik)</p>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="history" className="space-y-4 mt-4">
        {/* Purchase Behavior */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              Perilaku Pembelian
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-muted/50 p-3">
                <p className="text-xs text-muted-foreground">Total Transaksi</p>
                <p className="text-xl font-bold">{member.purchaseHistory.totalTransactions}</p>
              </div>
              <div className="rounded-lg bg-muted/50 p-3">
                <p className="text-xs text-muted-foreground">Rata-rata/Bulan</p>
                <p className="text-lg font-bold">{formatCurrency(member.purchaseHistory.avgMonthlySpend)}</p>
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-2">Kategori Teratas</p>
              <div className="flex flex-wrap gap-1">
                {member.purchaseHistory.topCategories.map((cat) => (
                  <Badge key={cat} variant="secondary" className="text-xs">{cat}</Badge>
                ))}
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Pembelian terakhir: {member.purchaseHistory.lastPurchase}
            </p>
          </CardContent>
        </Card>

        {/* Loan History */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Riwayat Pinjaman
            </CardTitle>
          </CardHeader>
          <CardContent>
            {member.loanHistory.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">Belum ada riwayat pinjaman</p>
            ) : (
              <div className="space-y-2">
                {member.loanHistory.map((loan) => (
                  <div key={loan.id} className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <p className="font-medium">{formatCurrency(loan.amount)}</p>
                      <p className="text-xs text-muted-foreground">{loan.date}</p>
                    </div>
                    <Badge variant={loan.status === 'lunas' ? 'default' : 'secondary'} className={loan.status === 'lunas' ? 'bg-emerald-500' : ''}>
                      {loan.status === 'lunas' ? 'Lunas' : 'Aktif'}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
