'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import {
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Brain,
  Building2,
  FileText,
  HeartPulse,
  RefreshCw,
  ShieldAlert,
  Sparkles,
  Users,
  Wallet,
  Info,
  ChevronRight,
  Zap,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
  Pie,
  PieChart,
} from 'recharts'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
  KEMENTERIAN_DASHBOARD_DATA,
  getKementerianDashboardSnapshot,
  type AlertSeverity,
  type GroupSummary,
  type ScopeFilters,
} from '@/lib/kementerian-dashboard-data'

const currencyFormatter = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
})

const compactNumberFormatter = new Intl.NumberFormat('id-ID', {
  notation: 'compact',
  maximumFractionDigits: 1,
})

function formatCompactCurrency(value: number) {
  const compact = compactNumberFormatter.format(value)
  return `Rp${compact}`
}

function formatPercent(value: number) {
  const sign = value > 0 ? '+' : ''
  return `${sign}${value.toFixed(1)}%`
}

function healthBadgeClass(status: string) {
  if (status === 'good') return 'bg-emerald-50 text-emerald-700 border-emerald-200'
  if (status === 'warning') return 'bg-amber-50 text-amber-700 border-amber-200'
  return 'bg-rose-50 text-rose-700 border-rose-200'
}

const SURFACE_CARD = 'overflow-hidden border border-slate-200 bg-white shadow-sm'

export function KementerianNationalDashboard() {
  const [filters, setFilters] = useState<ScopeFilters>({
    provinceId: 'all',
    regionId: 'all',
    villageId: 'all',
    cooperativeId: 'all',
    commodityId: 'all',
  })
  const [clock, setClock] = useState(() => Date.now())

  useEffect(() => {
    const intervalId = window.setInterval(() => setClock(Date.now()), 30000)
    return () => window.clearInterval(intervalId)
  }, [])

  const commodityOptions = [
    { id: 'all', label: 'Semua Komoditas' },
    { id: 'beras', label: 'Beras' },
    { id: 'jagung', label: 'Jagung' },
    { id: 'cabai', label: 'Cabai' },
    { id: 'bawang', label: 'Bawang' },
  ]

  const provinceOptions = KEMENTERIAN_DASHBOARD_DATA.provinceOptions
  const regionOptions = KEMENTERIAN_DASHBOARD_DATA.regionOptions.filter(
    (option) => filters.provinceId === 'all' || option.provinceId === filters.provinceId,
  )
  const villageOptions = KEMENTERIAN_DASHBOARD_DATA.villageOptions.filter((option) => {
    const matchesProvince = filters.provinceId === 'all' || option.provinceId === filters.provinceId
    const matchesRegion = filters.regionId === 'all' || option.regionId === filters.regionId
    return matchesProvince && matchesRegion
  })
  const cooperativeOptions = KEMENTERIAN_DASHBOARD_DATA.cooperativeOptions.filter((option) => {
    const matchesProvince = filters.provinceId === 'all' || option.provinceId === filters.provinceId
    const matchesRegion = filters.regionId === 'all' || option.regionId === filters.regionId
    const matchesVillage = filters.villageId === 'all' || option.villageId === filters.villageId
    return matchesProvince && matchesRegion && matchesVillage
  })

  const snapshot = getKementerianDashboardSnapshot(filters)

  const drillInto = (row: GroupSummary) => {
    if (row.level === 'region') {
      setFilters(prev => ({ ...prev, provinceId: row.province, regionId: row.id, villageId: 'all', cooperativeId: 'all' }))
    } else if (row.level === 'village') {
      setFilters(prev => ({ ...prev, regionId: row.region, villageId: row.id, cooperativeId: 'all' }))
    } else if (row.level === 'cooperative') {
      setFilters(prev => ({ ...prev, cooperativeId: row.id }))
    }
  }

  const rowContext = (row: GroupSummary) => {
    if (row.level === 'region') return row.province
    if (row.level === 'village') return `${row.province} / ${row.region}`
    if (row.level === 'cooperative') return `${row.region} / ${row.village}`
    return ''
  }

  const actionLabel = (row: GroupSummary) => {
    if (row.level === 'region') return 'Drill-down Desa'
    if (row.level === 'village') return 'Drill-down Koperasi'
    if (row.level === 'cooperative') return 'Buka Dashboard'
    return 'Lihat'
  }

  // Selected Comparison State
  const [villageComparisonIds, setVillageComparisonIds] = useState<string[]>([])
  const [cooperativeComparisonIds, setCooperativeComparisonIds] = useState<string[]>([])

  const toggleVillageComparison = (id: string) => {
    setVillageComparisonIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
  }
  const toggleCooperativeComparison = (id: string) => {
    setCooperativeComparisonIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id])
  }

  const villageComparisonOptions = snapshot.villageComparisons.slice(0, 10)
  const cooperativeComparisonOptions = snapshot.cooperativeComparisons.slice(0, 10)

  const selectedVillageComparisons = snapshot.villageComparisons.filter(v => villageComparisonIds.includes(v.id))
  const selectedCooperativeComparisons = snapshot.cooperativeComparisons.filter(c => cooperativeComparisonIds.includes(c.id))

  const weakestCooperatives = [...snapshot.cooperativeComparisons].sort((a, b) => a.overallScore - b.overallScore).slice(0, 5)
  const topGrowthRegions = [...snapshot.regionComparisons].sort((a, b) => b.incomeImprovementPct - a.incomeImprovementPct).slice(0, 5)

  const nplTone = snapshot.summary.avgNpl > 5 ? 'rose' : snapshot.summary.avgNpl > 3 ? 'sand' : 'emerald'
  const healthTone = snapshot.summary.overallScore > 80 ? 'emerald' : snapshot.summary.overallScore > 65 ? 'sand' : 'rose'

  const ratioOverview = snapshot.selectedCooperative 
    ? snapshot.selectedCooperative.ratioScores 
    : [
        { label: 'Likuiditas', score: snapshot.summary.avgLiquidityScore, status: scoreToStatus(snapshot.summary.avgLiquidityScore), valueLabel: 'Ratio Lancar' },
        { label: 'Solvabilitas', score: snapshot.summary.avgSolvencyScore, status: scoreToStatus(snapshot.summary.avgSolvencyScore), valueLabel: 'Debt/Equity' },
        { label: 'Rentabilitas', score: snapshot.summary.avgProfitabilityScore, status: scoreToStatus(snapshot.summary.avgProfitabilityScore), valueLabel: 'Margin Laba' },
      ]

  const formatCurrency = (val: number) => currencyFormatter.format(val)
  const insightToneClass = (idx: number) => {
    const tones = ['border-sky-100 bg-sky-50/30', 'border-emerald-100 bg-emerald-50/30', 'border-amber-100 bg-amber-50/30']
    return tones[idx % tones.length]
  }
  const severityAlertClass = (s: AlertSeverity) => s === 'critical' ? 'border-rose-100 bg-rose-50/50 text-rose-950' : 'border-amber-100 bg-amber-50/50 text-amber-950'
  const severityBadgeClass = (s: AlertSeverity) => s === 'critical' ? 'bg-rose-600' : 'bg-amber-600'

  const SUBTLE_PANEL = 'rounded-2xl border border-slate-100 bg-white shadow-sm'

  return (
    <div className="flex flex-col gap-4 p-4 lg:p-6 bg-slate-50 min-h-screen">
      {/* HEADER SECTION - COMPACT */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-slate-900 tracking-tight">KEMENTERIAN OVERVIEW</h1>
            <Badge variant="outline" className="bg-rose-50 text-rose-700 border-rose-200 font-bold px-2 py-0">LIVE</Badge>
          </div>
          <p className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
            <RefreshCw className="h-3 w-3 animate-spin-slow" /> 
            DATA TERPUSAT: {snapshot.scopeLabel} • Sinkron {Math.floor((Date.now() - clock)/60000)}m lalu
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-2 bg-white p-1.5 rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-1 px-2 border-r border-slate-100">
            <span className="text-[10px] font-black text-slate-400 uppercase">Prov</span>
            <Select value={filters.provinceId} onValueChange={(v) => setFilters(prev => ({...prev, provinceId: v, regionId: 'all', villageId: 'all', cooperativeId: 'all'}))}>
              <SelectTrigger className="h-8 border-none bg-transparent shadow-none w-[100px] text-xs font-bold p-0">
                <SelectValue placeholder="Semua" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua</SelectItem>
                {provinceOptions.map(opt => <SelectItem key={opt.id} value={opt.id}>{opt.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-1 px-2 border-r border-slate-100">
            <span className="text-[10px] font-black text-slate-400 uppercase">Reg</span>
            <Select value={filters.regionId} onValueChange={(v) => setFilters(prev => ({...prev, regionId: v, villageId: 'all', cooperativeId: 'all'}))}>
              <SelectTrigger className="h-8 border-none bg-transparent shadow-none w-[100px] text-xs font-bold p-0">
                <SelectValue placeholder="Semua" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua</SelectItem>
                {regionOptions.map(opt => <SelectItem key={opt.id} value={opt.id}>{opt.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-1 px-2 border-r border-slate-100">
            <span className="text-[10px] font-black text-slate-400 uppercase">Komoditas</span>
            <Select value={filters.commodityId} onValueChange={(v) => setFilters(prev => ({...prev, commodityId: v}))}>
              <SelectTrigger className="h-8 border-none bg-transparent shadow-none w-[100px] text-xs font-bold p-0">
                <SelectValue placeholder="Semua" />
              </SelectTrigger>
              <SelectContent>
                {commodityOptions.map(opt => <SelectItem key={opt.id} value={opt.id}>{opt.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <Button 
            size="sm" 
            variant="ghost" 
            className="h-8 w-8 p-0 hover:bg-rose-50 hover:text-rose-600"
            onClick={() => setFilters({provinceId: 'all', regionId: 'all', villageId: 'all', cooperativeId: 'all', commodityId: 'all'})}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* TOP ROW - KPI AGGREGATES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-3">
        {[
          { label: 'Total Koperasi', value: snapshot.summary.cooperatives.toLocaleString('id-ID'), icon: Building2, trend: '+12', tone: 'slate' },
          { label: 'Anggota Aktif', value: snapshot.summary.totalMembers.toLocaleString('id-ID'), icon: Users, trend: formatPercent(snapshot.summary.memberGrowthPct), tone: 'emerald' },
          { label: 'Inc / Member', value: formatCompactCurrency(snapshot.summary.avgIncomeAfter), icon: Wallet, trend: '+14%', tone: 'emerald' },
          { label: 'Rev / Kop', value: formatCompactCurrency(snapshot.summary.avgMonthlyRevenue), icon: BarChart3, trend: '+8.2%', tone: 'emerald' },
          { label: 'Avg NPL', value: `${snapshot.summary.avgNpl.toFixed(1)}%`, icon: ShieldAlert, trend: '-0.2%', tone: snapshot.summary.avgNpl > 3 ? 'rose' : 'emerald' },
          { label: 'Health Score', value: `${Math.round(snapshot.summary.overallScore)}`, icon: HeartPulse, trend: 'Optimal', tone: 'emerald' },
        ].map((kpi, idx) => (
          <Card key={idx} className={`${SURFACE_CARD} transition-all hover:border-rose-300 hover:shadow-md bg-white border-none shadow-[0_4px_12px_-4px_rgba(0,0,0,0.05)]`}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className={`p-2 rounded-xl bg-slate-50 text-slate-600`}>
                  <kpi.icon className="h-4 w-4" />
                </div>
                <Badge className={`text-[9px] font-black ${kpi.tone === 'rose' ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'}`}>
                  {kpi.trend}
                </Badge>
              </div>
              <div className="mt-3">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{kpi.label}</p>
                <p className="text-2xl font-black text-slate-900 tracking-tighter mt-0.5">{kpi.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* MIDDLE SECTION - CHARTS & EWS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* MAIN CHART - 8 COLS */}
        <Card className={`${SURFACE_CARD} lg:col-span-8 flex flex-col`}>
          <CardHeader className="p-4 border-b border-slate-100 flex flex-row items-center justify-between space-y-0">
            <div className="space-y-0.5">
              <CardTitle className="text-sm font-black text-slate-900 uppercase tracking-tight">Performa Pertumbuhan Nasional</CardTitle>
              <CardDescription className="text-[10px] font-bold text-slate-500">Korelasi anggota baru vs produksi beras (agregat)</CardDescription>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-1.5 text-[9px] font-black text-emerald-600">
                <div className="h-2 w-2 rounded-full bg-emerald-500" /> ANGGOTA
              </div>
              <div className="flex items-center gap-1.5 text-[9px] font-black text-rose-600">
                <div className="h-2 w-2 rounded-full bg-rose-500" /> PRODUKSI
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 flex-1">
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={snapshot.trend}>
                  <defs>
                    <linearGradient id="colorEmerald" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" fontSize={10} fontWeights="900" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} />
                  <YAxis yAxisId="left" hide />
                  <YAxis yAxisId="right" orientation="right" hide />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontSize: '12px' }} 
                    cursor={{ stroke: '#f1f5f9', strokeWidth: 2 }}
                  />
                  <Area yAxisId="left" type="monotone" dataKey="members" stroke="#10b981" strokeWidth={3} fill="url(#colorEmerald)" isAnimationActive={false} />
                  <Area yAxisId="right" type="monotone" dataKey="npl" stroke="#be0817" strokeWidth={2} fill="transparent" isAnimationActive={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* EWS - 4 COLS */}
        <Card className={`${SURFACE_CARD} lg:col-span-4 flex flex-col`}>
          <CardHeader className="p-4 border-b border-slate-100 flex flex-row items-center justify-between space-y-0 bg-slate-50/50">
            <CardTitle className="text-sm font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
              <ShieldAlert className="h-4 w-4 text-rose-600" /> EARLY WARNING
            </CardTitle>
            <Badge variant="destructive" className="h-5 px-2 text-[9px] font-black rounded-full">3 KRITIS</Badge>
          </CardHeader>
          <CardContent className="p-0 flex-1 overflow-y-auto">
            <div className="divide-y divide-slate-100">
              {snapshot.topAlerts.slice(0, 4).map((alert) => (
                <div key={alert.id} className="p-3.5 hover:bg-slate-50 transition-colors group cursor-pointer">
                  <div className="flex items-start gap-3">
                    <div className={`mt-0.5 p-1.5 rounded-lg ${alert.severity === 'critical' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'}`}>
                      <AlertTriangle className="h-3 w-3" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-[11px] font-black text-slate-900 truncate uppercase">{alert.title}</p>
                        <span className="text-[9px] font-bold text-slate-400 whitespace-nowrap">2H LALU</span>
                      </div>
                      <p className="text-[10px] text-slate-500 mt-1 font-semibold leading-tight line-clamp-2">{alert.message}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-[9px] font-black text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded uppercase tracking-tighter">{alert.scopeLabel}</span>
                        <ChevronRight className="h-3 w-3 text-slate-300 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <div className="p-3 border-t border-slate-100 bg-slate-50/30">
            <Button variant="ghost" className="w-full h-8 text-[10px] font-black text-slate-500 hover:text-rose-600 hover:bg-white uppercase tracking-widest transition-all">
              Buka Command Center <ArrowRight className="ml-2 h-3 w-3" />
            </Button>
          </div>
        </Card>
      </div>

      {/* BOTTOM SECTION - TABLES & ANALYTICS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* CROSS KOPERASI TABLE - 8 COLS */}
        <Card className={`${SURFACE_CARD} lg:col-span-8 flex flex-col`}>
          <CardHeader className="p-4 border-b border-slate-100 bg-slate-900">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <CardTitle className="text-sm font-black text-white uppercase tracking-widest">Audit Lintas Unit Kerja</CardTitle>
                <CardDescription className="text-[10px] font-bold text-slate-400">Monitoring 1,248 Unit Nasional • Filter Aktif: {snapshot.scopeLabel}</CardDescription>
              </div>
              <Button size="sm" className="h-8 bg-rose-600 hover:bg-rose-700 text-[10px] font-black text-white px-4 rounded-lg shadow-lg shadow-rose-900/20 uppercase tracking-tighter">
                Download Audit PDF
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow className="border-none hover:bg-transparent">
                  <TableHead className="text-[9px] font-black text-slate-400 uppercase px-4 h-10">Unit Koperasi</TableHead>
                  <TableHead className="text-[9px] font-black text-slate-400 uppercase text-center h-10">Status</TableHead>
                  <TableHead className="text-[9px] font-black text-slate-400 uppercase text-right h-10">Anggota</TableHead>
                  <TableHead className="text-[9px] font-black text-slate-400 uppercase text-right h-10">Inc / Mem</TableHead>
                  <TableHead className="text-[9px] font-black text-slate-400 uppercase text-right h-10">NPL Ratio</TableHead>
                  <TableHead className="text-[9px] font-black text-slate-400 uppercase text-right px-4 h-10">Skor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {snapshot.cooperativeComparisons.slice(0, 6).map((row) => (
                  <TableRow key={row.id} className="border-slate-100 hover:bg-slate-50 transition-colors group cursor-pointer">
                    <TableCell className="px-4 py-3">
                      <div className="min-w-[140px]">
                        <p className="text-xs font-black text-slate-900 group-hover:text-rose-600 transition-colors uppercase truncate">{row.label}</p>
                        <p className="text-[9px] font-bold text-slate-400 tracking-tighter">{row.village}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge className={`text-[8px] font-black h-4 px-1 ${healthBadgeClass(row.overallHealth)}`}>
                        {row.overallHealth.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right text-xs font-bold text-slate-600">{row.totalMembers.toLocaleString('id-ID')}</TableCell>
                    <TableCell className="text-right text-xs font-black text-emerald-600">{formatCompactCurrency(row.avgIncomeAfter)}</TableCell>
                    <TableCell className={`text-right text-xs font-black ${row.avgNpl > 3 ? 'text-rose-600' : 'text-slate-900'}`}>{row.avgNpl.toFixed(1)}%</TableCell>
                    <TableCell className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-12 h-1 bg-slate-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${row.overallScore > 80 ? 'bg-emerald-500' : row.overallScore > 60 ? 'bg-amber-500' : 'bg-rose-500'}`} style={{ width: `${row.overallScore}%` }} />
                        </div>
                        <span className="text-[10px] font-black text-slate-900">{Math.round(row.overallScore)}</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
          <div className="p-3 bg-slate-50/50 border-t border-slate-100 text-center">
            <Button variant="link" className="h-auto p-0 text-[10px] font-black text-rose-600 hover:no-underline uppercase tracking-widest" asChild>
              <Link href="/anggota">Audit Seluruh Database Unit (1,248) →</Link>
            </Button>
          </div>
        </Card>

        {/* DEMOGRAPHICS & HEALTH - 4 COLS */}
        <div className="lg:col-span-4 flex flex-col gap-4">
          <Card className={`${SURFACE_CARD} flex-1`}>
            <CardHeader className="p-4 border-b border-slate-100 pb-3">
              <CardTitle className="text-sm font-black text-slate-900 uppercase tracking-tight">Kesehatan Portfolio</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="h-[140px] w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Sehat', value: 450, color: '#10b981' },
                        { name: 'Waspada', value: 620, color: '#f59e0b' },
                        { name: 'Kritis', value: 178, color: '#be0817' },
                      ]}
                      innerRadius={45}
                      outerRadius={60}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {[0,1,2].map((_, i) => <Cell key={i} fill={['#10b981', '#f59e0b', '#be0817'][i]} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-lg font-black text-slate-900">1,248</span>
                  <span className="text-[8px] font-black text-slate-400 uppercase">Unit</span>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-1.5 mt-2">
                {[
                  { label: 'Sangat Sehat', count: '450', color: 'bg-emerald-500' },
                  { label: 'Waspada / Audit', count: '620', color: 'bg-amber-500' },
                  { label: 'Intervensi Segera', count: '178', color: 'bg-rose-500' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-slate-50 border border-slate-100 shadow-sm">
                    <div className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full ${item.color}`} />
                      <span className="text-[9px] font-black text-slate-600 uppercase tracking-tighter">{item.label}</span>
                    </div>
                    <span className="text-xs font-black text-slate-900">{item.count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className={`${SURFACE_CARD} bg-white border-rose-100`}>
            <CardHeader className="p-4 border-b border-rose-50 flex flex-row items-center justify-between space-y-0 bg-rose-50/20">
              <CardTitle className="text-sm font-black text-rose-900 uppercase tracking-tight flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-rose-600" /> AI INSIGHT
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <div className="space-y-1">
                <p className="text-xs font-black text-slate-900 leading-tight">DETEKSI ANOMALI PENDAPATAN</p>
                <p className="text-[10px] text-slate-600 font-medium leading-relaxed">
                  Tren pendapatan di Wilayah Timur melampaui forecast 12%. Disarankan alokasi modal tambahan untuk infrastruktur pasca-panen.
                </p>
              </div>
              <div className="pt-2 border-t border-rose-100">
                <Button className="w-full h-9 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-[10px] uppercase tracking-widest shadow-lg shadow-rose-200">
                  Konsultasi Strategi AI
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
ext-xs uppercase tracking-[0.16em] text-red-700">Alert kritis</p>
                      <p className="mt-2 font-display text-2xl font-bold text-slate-950">{snapshot.summary.criticalCount}</p>
                    </div>
                    <div className="rounded-2xl bg-[#fffaf1] p-4 shadow-[inset_0_0_0_1px_rgba(253,230,138,0.85)]">
                      <p className="text-xs uppercase tracking-[0.16em] text-amber-700">NPL rata-rata</p>
                      <p className="mt-2 font-display text-2xl font-bold text-slate-950">{snapshot.summary.avgNpl.toFixed(1)}%</p>
                    </div>
                  </div>

                  <div className="grid gap-2 sm:grid-cols-3">
                    <Button asChild variant="secondary" className="justify-between border border-[#ead8d6]/70 bg-white text-[#5f666d] hover:bg-[#fbf7f6]">
                      <Link href="/keuangan/laporan">
                        Laporan nasional
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                    <Button asChild variant="secondary" className="justify-between border border-[#ead8d6]/70 bg-white text-[#5f666d] hover:bg-[#fbf7f6]">
                      <Link href="/ai/forecast">
                        Forecast AI
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                    <Button asChild variant="secondary" className="justify-between border border-[#ead8d6]/70 bg-white text-[#5f666d] hover:bg-[#fbf7f6]">
                      <Link href="#records">
                        Rekaman data
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className={`${SURFACE_CARD} bg-[linear-gradient(180deg,#ffffff_0%,#f5f9ff_100%)] backdrop-blur-sm`}>
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <CardTitle className="text-lg text-slate-950">AI Intelligence Layer</CardTitle>
                      <CardDescription className="text-[#5f666d]">
                        Ringkasan anomali, risiko, dan rekomendasi tindakan.
                      </CardDescription>
                    </div>
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-50 shadow-[inset_0_0_0_1px_rgba(186,230,253,0.9)]">
                      <Sparkles className="h-5 w-5 text-sky-700" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  {snapshot.aiInsights.slice(0, 3).map((insight, index) => (
                    <div key={insight.id} className={`rounded-2xl border p-4 ${insightToneClass(index)}`}>
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900">{insight.title}</p>
                          <p className="mt-1 text-sm leading-6 text-slate-600">{insight.description}</p>
                        </div>
                        <Badge className="border border-stone-200 bg-white text-stone-700 hover:bg-white">
                          {insight.confidence}%
                        </Badge>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <OverviewMetricCard
          title="Koperasi Terpantau"
          value={snapshot.summary.cooperatives.toLocaleString('id-ID')}
          description={`${snapshot.summary.regionCount} regional | ${snapshot.summary.villageCount} desa`}
          icon={Building2}
          tone="neutral"
        />
        <OverviewMetricCard
          title="Total Anggota"
          value={snapshot.summary.totalMembers.toLocaleString('id-ID')}
          description="Member aktif dalam cakupan terpilih"
          icon={Users}
          tone="rose"
          trend={{ value: Math.abs(snapshot.summary.memberGrowthPct), isPositive: snapshot.summary.memberGrowthPct >= 0 }}
        />
        <OverviewMetricCard
          title="Pendapatan Anggota"
          value={formatCompactCurrency(snapshot.summary.avgIncomeAfter)}
          description="Rata-rata setelah bergabung koperasi"
          icon={Wallet}
          tone="sand"
          trend={{ value: snapshot.summary.incomeImprovementPct, isPositive: true }}
        />
        <OverviewMetricCard
          title="Pendapatan Koperasi"
          value={formatCompactCurrency(snapshot.summary.avgMonthlyRevenue)}
          description="Rata-rata pendapatan per koperasi"
          icon={BarChart3}
          tone="emerald"
        />
        <OverviewMetricCard
          title="Rata-rata NPL"
          value={`${snapshot.summary.avgNpl.toFixed(1)}%`}
          description="Pemantauan kualitas pinjaman"
          icon={ShieldAlert}
          tone={nplTone}
        />
        <OverviewMetricCard
          title="Skor Kesehatan"
          value={`${Math.round(snapshot.summary.overallScore)}/100`}
          description={`Status ${snapshot.summary.overallHealth}`}
          icon={HeartPulse}
          tone={healthTone}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-12">
        <Card className={`${SURFACE_CARD} xl:col-span-4`}>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Tren Anggota</CardTitle>
            <CardDescription>Total anggota dan pertumbuhan nasional saat ini.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[230px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={snapshot.trend}>
                  <defs>
                    <linearGradient id="membersFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#e11d48" stopOpacity={0.28} />
                      <stop offset="95%" stopColor="#e11d48" stopOpacity={0.04} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(15,23,42,0.08)" />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12 }} tickFormatter={(value) => compactNumberFormatter.format(value)} />
                  <Tooltip formatter={(value) => [Number(value).toLocaleString('id-ID'), 'Anggota']} />
                  <Area type="monotone" dataKey="members" stroke="#be123c" fill="url(#membersFill)" strokeWidth={2.5} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className={`${SURFACE_CARD} xl:col-span-4`}>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Tren Kesejahteraan</CardTitle>
            <CardDescription>Pendapatan rata-rata anggota sebelum dan sesudah intervensi koperasi.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[230px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={snapshot.trend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(15,23,42,0.08)" />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12 }} tickFormatter={(value) => formatCompactCurrency(Number(value))} />
                  <Tooltip formatter={(value) => [formatCurrency(Number(value)), 'Pendapatan']} />
                  <Line type="monotone" dataKey="avgIncome" stroke="#b45309" strokeWidth={2.5} dot={{ fill: '#f59e0b', r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className={`${SURFACE_CARD} xl:col-span-4`}>
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <CardTitle className="text-lg">Risiko & Early Warning</CardTitle>
                <CardDescription>NPL nasional dan alert prioritas untuk tindak lanjut cepat.</CardDescription>
              </div>
              <Badge className="border border-red-200 bg-red-50 text-red-700 hover:bg-red-50">
                {snapshot.topAlerts.length} alert
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="h-[170px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={snapshot.trend}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(15,23,42,0.08)" />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12 }} unit="%" />
                  <Tooltip formatter={(value) => [`${Number(value).toFixed(1)}%`, 'NPL']} />
                  <Bar dataKey="npl" radius={[10, 10, 0, 0]} fill="#dc2626" />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3">
              {snapshot.topAlerts.slice(0, 3).map((alert) => (
                <div key={alert.id} className={`rounded-2xl border px-4 py-3 ${severityAlertClass(alert.severity)}`}>
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-semibold">{alert.title}</p>
                        <Badge className={severityBadgeClass(alert.severity)}>{alert.severity}</Badge>
                      </div>
                      <p className="mt-1 text-sm font-medium">{alert.scopeLabel}</p>
                      <p className="mt-1 text-sm leading-6">{alert.message}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className={SURFACE_CARD}>
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-start xl:justify-between">
            <div>
              <CardTitle className="text-lg">Cakupan & Perbandingan Supervisi</CardTitle>
              <CardDescription>
                Atur cakupan pengawasan, bandingkan banyak desa dan koperasi, lalu lanjutkan drill-down ke detail records.
              </CardDescription>
            </div>
            <div className="grid gap-3 sm:grid-cols-3 xl:w-[30rem]">
              <div className={`${SUBTLE_PANEL} p-3`}>
                <p className="text-xs uppercase tracking-[0.16em] text-stone-500">Cakupan</p>
                <p className="mt-1 font-semibold text-slate-950">{snapshot.scopeLabel}</p>
              </div>
              <div className={`${SUBTLE_PANEL} p-3`}>
                <p className="text-xs uppercase tracking-[0.16em] text-stone-500">Desa aktif</p>
                <p className="mt-1 font-semibold text-slate-950">{selectedVillageComparisons.length}</p>
              </div>
              <div className={`${SUBTLE_PANEL} p-3`}>
                <p className="text-xs uppercase tracking-[0.16em] text-stone-500">Koperasi aktif</p>
                <p className="mt-1 font-semibold text-slate-950">{selectedCooperativeComparisons.length}</p>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-5 xl:grid-cols-[0.88fr_1.12fr]">
          <div className="space-y-4">
            <div className={`${SUBTLE_PANEL} p-4`}>
              <div className="mb-4">
                <p className="text-sm font-semibold text-slate-950">Filter Hierarki Pengawasan</p>
                <p className="mt-1 text-sm text-[#5f666d]">
                  Nasional - regional - desa - koperasi. Pilih cakupan tanpa meninggalkan halaman utama.
                </p>
              </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-12">
              <div className="space-y-2 xl:col-span-2">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7b5c57]">Provinsi</p>
                <Select value={filters.provinceId} onValueChange={(v) => setFilters(prev => ({...prev, provinceId: v, regionId: 'all', villageId: 'all', cooperativeId: 'all'}))}>
                  <SelectTrigger className="w-full min-w-0 border-[#ead8d6]/70 bg-white text-[#5f666d] shadow-none">
                    <SelectValue placeholder="Semua provinsi" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua provinsi</SelectItem>
                    {provinceOptions.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 xl:col-span-2">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7b5c57]">Regional</p>
                <Select value={filters.regionId} onValueChange={(v) => setFilters(prev => ({...prev, regionId: v, villageId: 'all', cooperativeId: 'all'}))}>
                  <SelectTrigger className="w-full min-w-0 border-[#ead8d6]/70 bg-white text-[#5f666d] shadow-none">
                    <SelectValue placeholder="Semua regional" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua regional</SelectItem>
                    {regionOptions.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 xl:col-span-2">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7b5c57]">Desa</p>
                <Select value={filters.villageId} onValueChange={(v) => setFilters(prev => ({...prev, villageId: v, cooperativeId: 'all'}))}>
                  <SelectTrigger className="w-full min-w-0 border-[#ead8d6]/70 bg-white text-[#5f666d] shadow-none">
                    <SelectValue placeholder="Semua desa" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua desa</SelectItem>
                    {villageOptions.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 xl:col-span-4">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7b5c57]">Koperasi</p>
                <Select value={filters.cooperativeId} onValueChange={(v) => setFilters(prev => ({...prev, cooperativeId: v}))}>
                  <SelectTrigger className="w-full min-w-0 border-[#ead8d6]/70 bg-white text-[#5f666d] shadow-none">
                    <SelectValue placeholder="Semua koperasi" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua koperasi</SelectItem>
                    {cooperativeOptions.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 xl:col-span-2">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#7b5c57]">Komoditas</p>
                <Select value={filters.commodityId} onValueChange={(v) => setFilters(prev => ({...prev, commodityId: v}))}>
                  <SelectTrigger className="w-full min-w-0 border-[#ead8d6]/70 bg-white text-[#5f666d] shadow-none">
                    <SelectValue placeholder="Semua komoditas" />
                  </SelectTrigger>
                  <SelectContent>
                    {commodityOptions.map((option) => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className={`${SUBTLE_PANEL} p-4`}>
                <p className="text-xs uppercase tracking-[0.16em] text-stone-500">Konteks</p>
                <p className="mt-2 font-semibold text-slate-950">{snapshot.contextLabel}</p>
                <p className="mt-1 text-sm text-slate-600">{snapshot.breadcrumb.join(' / ')}</p>
              </div>
              <div className="rounded-2xl border border-red-200 bg-red-50/85 p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-red-700">Intervensi prioritas</p>
                <p className="mt-2 font-semibold text-slate-950">
                  {snapshot.summary.criticalCount} alert kritis, {snapshot.summary.avgNpl.toFixed(1)}% NPL
                </p>
                <p className="mt-1 text-sm text-red-700/90">Fokuskan pengawasan pada unit dengan skor terendah.</p>
              </div>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <div className="space-y-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-950">Perbandingan Desa</p>
                  <p className="text-sm text-slate-600">Pilih desa untuk membandingkan kesejahteraan, NPL, dan kesehatan.</p>
                </div>
                <Badge variant="outline" className="w-fit border-stone-200 bg-stone-50">
                  {selectedVillageComparisons.length} desa dipilih
                </Badge>
              </div>
              <div className="flex flex-wrap gap-2">
                {villageComparisonOptions.map((row) => {
                  const isActive = villageComparisonIds.includes(row.id)
                  return (
                    <button
                      key={row.id}
                      type="button"
                      onClick={() => toggleVillageComparison(row.id)}
                      className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
                        isActive
                          ? 'border-rose-200 bg-rose-50 text-rose-700'
                          : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                      }`}
                    >
                      {row.label}
                    </button>
                  )
                })}
              </div>
              <div className="overflow-x-auto">
                <Table className="min-w-[560px]">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Desa</TableHead>
                      <TableHead className="text-right">Anggota</TableHead>
                      <TableHead className="text-right">NPL</TableHead>
                      <TableHead className="text-right">Skor</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedVillageComparisons.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{row.label}</p>
                            <p className="text-sm text-muted-foreground">{row.region}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">{row.totalMembers.toLocaleString('id-ID')}</TableCell>
                        <TableCell className="text-right">{row.avgNpl.toFixed(1)}%</TableCell>
                        <TableCell className="text-right">{Math.round(row.overallScore)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-950">Perbandingan Koperasi</p>
                  <p className="text-sm text-slate-600">Bandingkan beberapa koperasi untuk risiko, pendapatan, dan intervensi.</p>
                </div>
                <Badge variant="outline" className="w-fit border-stone-200 bg-stone-50">
                  {selectedCooperativeComparisons.length} koperasi dipilih
                </Badge>
              </div>
              <div className="flex flex-wrap gap-2">
                {cooperativeComparisonOptions.map((row) => {
                  const isActive = cooperativeComparisonIds.includes(row.id)
                  return (
                    <button
                      key={row.id}
                      type="button"
                      onClick={() => toggleCooperativeComparison(row.id)}
                      className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
                        isActive
                          ? 'border-rose-200 bg-rose-50 text-rose-700'
                          : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                      }`}
                    >
                      {row.label}
                    </button>
                  )
                })}
              </div>
              <div className="overflow-x-auto">
                <Table className="min-w-[560px]">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Koperasi</TableHead>
                      <TableHead className="text-right">Welfare</TableHead>
                      <TableHead className="text-right">NPL</TableHead>
                      <TableHead className="text-right">Skor</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {selectedCooperativeComparisons.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{row.label}</p>
                            <p className="text-sm text-muted-foreground">{row.village}</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-right text-emerald-600">{formatPercent(row.incomeImprovementPct)}</TableCell>
                        <TableCell className="text-right">{row.avgNpl.toFixed(1)}%</TableCell>
                        <TableCell className="text-right">{Math.round(row.overallScore)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="hierarki" className="space-y-4">
        <TabsList className="grid h-auto w-full grid-cols-2 gap-2 rounded-2xl border border-stone-200 bg-white p-2 xl:grid-cols-4">
          <TabsTrigger value="hierarki">Hierarki</TabsTrigger>
          <TabsTrigger value="welfare">Kesejahteraan</TabsTrigger>
          <TabsTrigger value="financial">Keuangan</TabsTrigger>
          <TabsTrigger value="records">Rekaman Data</TabsTrigger>
        </TabsList>

        <TabsContent value="hierarki" className="space-y-4">
          <div className="grid gap-4 xl:grid-cols-[1.18fr_0.82fr]">
            <Card className={SURFACE_CARD}>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <CardTitle className="text-lg">{snapshot.hierarchyTitle}</CardTitle>
                    <CardDescription>{snapshot.breadcrumb.join(' / ')}</CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setFilters({
                        provinceId: filters.provinceId,
                        regionId: 'all',
                        villageId: 'all',
                        cooperativeId: 'all',
                      })
                    }
                  >
                    Reset drill-down
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table className="min-w-[880px]">
                    <TableHeader>
                      <TableRow>
                        <TableHead>Cakupan</TableHead>
                        <TableHead>Lokasi</TableHead>
                        <TableHead className="text-right">Koperasi</TableHead>
                        <TableHead className="text-right">Anggota</TableHead>
                        <TableHead className="text-right">Growth</TableHead>
                        <TableHead className="text-right">Pendapatan</TableHead>
                        <TableHead className="text-right">NPL</TableHead>
                        <TableHead>Kesehatan</TableHead>
                        <TableHead className="text-right">Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {snapshot.hierarchyRows.map((row) => (
                        <TableRow key={row.id}>
                          <TableCell className="font-medium">{row.label}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{rowContext(row)}</TableCell>
                          <TableCell className="text-right">{row.cooperatives.toLocaleString('id-ID')}</TableCell>
                          <TableCell className="text-right">{row.totalMembers.toLocaleString('id-ID')}</TableCell>
                          <TableCell className={`text-right ${row.memberGrowthPct >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                            {formatPercent(row.memberGrowthPct)}
                          </TableCell>
                          <TableCell className="text-right">{formatCompactCurrency(row.avgIncomeAfter)}</TableCell>
                          <TableCell className="text-right">{row.avgNpl.toFixed(1)}%</TableCell>
                          <TableCell>
                            <Badge className={healthBadgeClass(row.overallHealth)}>{row.overallHealth}</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button variant="ghost" size="sm" onClick={() => drillInto(row)}>
                              {actionLabel(row)}
                              <ArrowRight className="ml-2 h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            <Card className={SURFACE_CARD}>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">
                  {snapshot.selectedCooperative ? 'Detail koperasi terpilih' : 'Prioritas pengawasan'}
                </CardTitle>
                <CardDescription>
                  {snapshot.selectedCooperative
                    ? 'Alert level koperasi dan skor rasio real-time.'
                    : 'Ringkasan wilayah atau koperasi yang perlu perhatian.'}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {snapshot.selectedCooperative ? (
                  <>
                    <div className={`${SUBTLE_PANEL} p-4`}>
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="text-sm font-medium text-muted-foreground">{snapshot.selectedCooperative.region}</p>
                          <h3 className="text-xl font-semibold">{snapshot.selectedCooperative.name}</h3>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {snapshot.selectedCooperative.village} | {snapshot.selectedCooperative.totalMembers.toLocaleString('id-ID')} anggota
                          </p>
                        </div>
                        <Badge className={healthBadgeClass(snapshot.selectedCooperative.healthStatus)}>
                          {snapshot.selectedCooperative.healthStatus}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-3">
                      {ratioOverview.map((ratio) => (
                        <div key={ratio.label} className={`${SUBTLE_PANEL} p-4`}>
                          <p className="text-sm text-muted-foreground">{ratio.label}</p>
                          <p className="mt-2 text-2xl font-bold">{Math.round(ratio.score)}/100</p>
                          <p className="text-sm text-muted-foreground">{ratio.valueLabel}</p>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-3">
                      {snapshot.selectedCooperative.alerts.map((alert) => (
                        <div key={alert.id} className={`${SUBTLE_PANEL} p-4`}>
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="font-medium">{alert.title}</p>
                              <p className="mt-1 text-sm text-muted-foreground">{alert.message}</p>
                            </div>
                            <Badge className={severityBadgeClass(alert.severity)}>{alert.severity}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="space-y-3">
                    {weakestCooperatives.slice(0, 3).map((row) => (
                      <div key={row.id} className={`${SUBTLE_PANEL} p-4`}>
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-medium">{row.label}</p>
                            <p className="mt-1 text-sm text-muted-foreground">
                              {row.region} | NPL {row.avgNpl.toFixed(1)}% | Skor {Math.round(row.overallScore)}
                            </p>
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => drillInto(row)}>
                            Fokus
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="welfare" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            <Card className={SURFACE_CARD}>
              <CardHeader className="pb-2">
                <CardDescription>Sebelum bergabung</CardDescription>
                <CardTitle className="text-2xl">{formatCurrency(snapshot.summary.avgIncomeBefore)}</CardTitle>
              </CardHeader>
            </Card>
            <Card className={SURFACE_CARD}>
              <CardHeader className="pb-2">
                <CardDescription>Sesudah bergabung</CardDescription>
                <CardTitle className="text-2xl">{formatCurrency(snapshot.summary.avgIncomeAfter)}</CardTitle>
              </CardHeader>
            </Card>
            <Card className={SURFACE_CARD}>
              <CardHeader className="pb-2">
                <CardDescription>Peningkatan kesejahteraan</CardDescription>
                <CardTitle className="text-2xl text-emerald-600">{formatPercent(snapshot.summary.incomeImprovementPct)}</CardTitle>
              </CardHeader>
            </Card>
          </div>

          <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
            <Card className={SURFACE_CARD}>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Distribusi Usia</CardTitle>
                <CardDescription>Komposisi anggota dalam cakupan terpilih.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[260px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={snapshot.ageDistribution}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(15,23,42,0.08)" />
                      <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                      <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12 }} tickFormatter={(value) => compactNumberFormatter.format(value)} />
                      <Tooltip formatter={(value) => [Number(value).toLocaleString('id-ID'), 'Anggota']} />
                      <Bar dataKey="value" fill="#be0817" radius={[10, 10, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card className={SURFACE_CARD}>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Gender dan Pekerjaan</CardTitle>
                <CardDescription>Insight demografi untuk perbandingan kesejahteraan.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="grid gap-3 sm:grid-cols-2">
                  {snapshot.genderDistribution.map((item) => {
                    const total = snapshot.genderDistribution.reduce((sum, entry) => sum + entry.value, 0)
                    const pct = total === 0 ? 0 : (item.value / total) * 100
                    return (
                      <div key={item.label} className={`${SUBTLE_PANEL} p-4`}>
                        <p className="text-sm text-muted-foreground">{item.label}</p>
                        <p className="mt-2 text-2xl font-bold">{item.value.toLocaleString('id-ID')}</p>
                        <div className="mt-3 h-2 overflow-hidden rounded-full bg-stone-200">
                          <div className="h-full rounded-full bg-rose-600" style={{ width: `${pct}%` }} />
                        </div>
                        <p className="mt-2 text-xs text-muted-foreground">{pct.toFixed(1)}% dari anggota</p>
                      </div>
                    )
                  })}
                </div>

                <div className="space-y-3">
                  {snapshot.occupationDistribution.map((item) => {
                    const total = snapshot.occupationDistribution.reduce((sum, entry) => sum + entry.value, 0)
                    const pct = total === 0 ? 0 : (item.value / total) * 100
                    return (
                      <div key={item.label}>
                        <div className="mb-1 flex items-center justify-between text-sm">
                          <span className="font-medium">{item.label}</span>
                          <span className="text-muted-foreground">{pct.toFixed(1)}%</span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-stone-200">
                          <div className="h-full rounded-full bg-emerald-500" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            <Card className={SURFACE_CARD}>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Perbandingan Wilayah</CardTitle>
                <CardDescription>Peningkatan pendapatan anggota terbaik per regional.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {topGrowthRegions.map((row) => (
                  <div key={row.id} className={`flex items-center justify-between gap-3 ${SUBTLE_PANEL} p-4`}>
                    <div>
                      <p className="font-medium">{row.label}</p>
                      <p className="text-sm text-muted-foreground">{row.totalMembers.toLocaleString('id-ID')} anggota</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-emerald-600">{formatPercent(row.incomeImprovementPct)}</p>
                      <p className="text-sm text-muted-foreground">{formatCompactCurrency(row.avgIncomeAfter)}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className={SURFACE_CARD}>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Koperasi Rentan Kesejahteraan</CardTitle>
                <CardDescription>Unit dengan skor terendah untuk pendampingan prioritas.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {weakestCooperatives.map((row) => (
                  <div key={row.id} className={`flex items-center justify-between gap-3 ${SUBTLE_PANEL} p-4`}>
                    <div>
                      <p className="font-medium">{row.label}</p>
                      <p className="text-sm text-muted-foreground">{row.region}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{Math.round(row.overallScore)}/100</p>
                      <p className="text-sm text-muted-foreground">{formatPercent(row.incomeImprovementPct)}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="financial" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-3">
            {ratioOverview.map((ratio) => (
              <Card key={ratio.label} className={SURFACE_CARD}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <CardDescription>{ratio.label}</CardDescription>
                      <CardTitle className="text-2xl">{Math.round(ratio.score)}/100</CardTitle>
                    </div>
                    <Badge className={healthBadgeClass(ratio.status)}>{ratio.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{ratio.valueLabel}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="grid gap-4 xl:grid-cols-2">
            <Card className={SURFACE_CARD}>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Wilayah Risiko Finansial</CardTitle>
                <CardDescription>Regional dengan NPL dan skor kesehatan terburuk.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table className="min-w-[640px]">
                    <TableHeader>
                      <TableRow>
                        <TableHead>Regional</TableHead>
                        <TableHead className="text-right">Anggota</TableHead>
                        <TableHead className="text-right">NPL</TableHead>
                        <TableHead className="text-right">Skor</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[...snapshot.regionComparisons]
                        .sort((left, right) => right.avgNpl - left.avgNpl || left.overallScore - right.overallScore)
                        .slice(0, 6)
                        .map((row) => (
                          <TableRow key={row.id}>
                            <TableCell>
                              <div>
                                <p className="font-medium">{row.label}</p>
                                <p className="text-sm text-muted-foreground">{row.province}</p>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">{row.totalMembers.toLocaleString('id-ID')}</TableCell>
                            <TableCell className="text-right">{row.avgNpl.toFixed(1)}%</TableCell>
                            <TableCell className="text-right">{Math.round(row.overallScore)}</TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            <Card className={SURFACE_CARD}>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Kinerja Finansial Koperasi</CardTitle>
                <CardDescription>Perbandingan koperasi berdasarkan pendapatan dan kesehatan.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table className="min-w-[760px]">
                    <TableHeader>
                      <TableRow>
                        <TableHead>Koperasi</TableHead>
                        <TableHead className="text-right">Pendapatan</TableHead>
                        <TableHead className="text-right">NPL</TableHead>
                        <TableHead className="text-right">Skor</TableHead>
                        <TableHead className="text-right">Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[...snapshot.cooperativeComparisons]
                        .sort((left, right) => left.overallScore - right.overallScore)
                        .slice(0, 8)
                        .map((row) => (
                          <TableRow key={row.id}>
                            <TableCell>
                              <div>
                                <p className="font-medium">{row.label}</p>
                                <p className="text-sm text-muted-foreground">{row.region}</p>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">{formatCompactCurrency(row.avgMonthlyRevenue)}</TableCell>
                            <TableCell className="text-right">{row.avgNpl.toFixed(1)}%</TableCell>
                            <TableCell className="text-right">{Math.round(row.overallScore)}</TableCell>
                            <TableCell className="text-right">
                              <Button variant="ghost" size="sm" onClick={() => drillInto(row)}>
                                Fokus
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
        </TabsContent>

        <TabsContent value="records" id="records" className="space-y-4">
          <div className="grid gap-4 xl:grid-cols-2">
            <Card className={SURFACE_CARD}>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Rekaman Keuangan</CardTitle>
                <CardDescription>Drill-down dari ringkasan ke dokumen dan catatan keuangan per koperasi.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table className="min-w-[760px]">
                    <TableHeader>
                      <TableRow>
                        <TableHead>Tanggal</TableHead>
                        <TableHead>Catatan</TableHead>
                        <TableHead>Koperasi</TableHead>
                        <TableHead className="text-right">Nilai</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {snapshot.financialRecords.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell>{record.date}</TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{record.type}</p>
                              <p className="text-sm text-muted-foreground">{record.report}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{record.cooperativeName}</p>
                              <p className="text-sm text-muted-foreground">{record.region}</p>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">{formatCompactCurrency(record.amount)}</TableCell>
                          <TableCell>
                            <Badge className={record.status === 'late' ? 'bg-red-500/10 text-red-700' : record.status === 'review' ? 'bg-amber-500/10 text-amber-700' : 'bg-emerald-500/10 text-emerald-700'}>
                              {record.status}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            <Card className={SURFACE_CARD}>
              <CardHeader className="pb-4">
                <CardTitle className="text-lg">Rekaman Anggota</CardTitle>
                <CardDescription>Data anggota, demografi, dan perubahan pendapatan pada cakupan terpilih.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table className="min-w-[760px]">
                    <TableHeader>
                      <TableRow>
                        <TableHead>Anggota</TableHead>
                        <TableHead>Demografi</TableHead>
                        <TableHead className="text-right">Sebelum</TableHead>
                        <TableHead className="text-right">Sesudah</TableHead>
                        <TableHead className="text-right">Delta</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {snapshot.memberRecords.map((member) => (
                        <TableRow key={member.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{member.name}</p>
                              <p className="text-sm text-muted-foreground">{member.cooperativeName}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{member.occupation}</p>
                              <p className="text-sm text-muted-foreground">
                                {member.gender} | {member.age} th
                              </p>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">{formatCompactCurrency(member.incomeBefore)}</TableCell>
                          <TableCell className="text-right">{formatCompactCurrency(member.incomeAfter)}</TableCell>
                          <TableCell className={`text-right ${member.incomeChangePct >= 10 ? 'text-emerald-600' : 'text-amber-600'}`}>
                            {formatPercent(member.incomeChangePct)}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
