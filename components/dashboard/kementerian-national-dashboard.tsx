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
import { AuditDetailDialog } from '@/components/dialogs/audit-detail-dialog'

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

function scoreToStatus(score: number) {
  if (score >= 80) return 'good'
  if (score >= 65) return 'warning'
  return 'critical'
}

const SURFACE_CARD = 'overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_10px_24px_-18px_rgba(15,23,42,0.18)]'

export function KementerianNationalDashboard() {
  const [filters, setFilters] = useState<ScopeFilters>({
    provinceId: 'all',
    regionId: 'all',
    villageId: 'all',
    cooperativeId: 'all',
    commodityId: 'all',
  })
  const [clock, setClock] = useState(() => Date.now())
  const [selectedCooperative, setSelectedCooperative] = useState<any>(null)
  const [isAuditDialogOpen, setIsAuditDialogOpen] = useState(false)

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
      setSelectedCooperative(row)
      setIsAuditDialogOpen(true)
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

  const SUBTLE_PANEL = 'rounded-xl border border-slate-200 bg-white shadow-[0_8px_18px_-16px_rgba(15,23,42,0.16)]'

  return (
    <div className="flex min-h-screen flex-col gap-4 bg-[var(--dashboard-neutral)] p-4 lg:p-5">
      {/* HEADER SECTION - COMPACT */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-[1.45rem] font-semibold text-[var(--dashboard-secondary)]">Ringkasan Kementerian</h1>
            <Badge variant="outline" className="border-[var(--dashboard-primary)]/20 bg-[var(--dashboard-primary)]/8 px-2 py-0 text-xs font-medium text-[var(--dashboard-primary)]">Live</Badge>
          </div>
          <p className="flex items-center gap-2 text-sm text-[var(--dashboard-secondary)]/70">
            <RefreshCw className="h-3 w-3 animate-spin-slow" /> 
            Data terpusat: {snapshot.scopeLabel} | Sinkron {Math.floor((Date.now() - clock)/60000)} m lalu
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-1.5 rounded-xl border border-slate-200 bg-white p-1.5 shadow-[0_10px_22px_-18px_rgba(15,23,42,0.16)]">
          <div className="flex items-center gap-1.5 border-r border-slate-200 px-2">
            <span className="text-xs font-medium text-slate-500">Provinsi</span>
            <Select value={filters.provinceId} onValueChange={(v) => setFilters(prev => ({...prev, provinceId: v, regionId: 'all', villageId: 'all', cooperativeId: 'all'}))}>
              <SelectTrigger className="h-8 w-[120px] border-none bg-transparent px-0 text-sm font-medium shadow-none">
                <SelectValue placeholder="Semua" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua</SelectItem>
                {provinceOptions.map(opt => <SelectItem key={opt.id} value={opt.id}>{opt.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-1.5 border-r border-slate-200 px-2">
            <span className="text-xs font-medium text-slate-500">Kab/Kota</span>
            <Select value={filters.regionId} onValueChange={(v) => setFilters(prev => ({...prev, regionId: v, villageId: 'all', cooperativeId: 'all'}))}>
              <SelectTrigger className="h-8 w-[120px] border-none bg-transparent px-0 text-sm font-medium shadow-none">
                <SelectValue placeholder="Semua" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua</SelectItem>
                {regionOptions.map(opt => <SelectItem key={opt.id} value={opt.id}>{opt.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-1.5 border-r border-slate-200 px-2">
            <span className="text-xs font-medium text-slate-500">Komoditas</span>
            <Select value={filters.commodityId} onValueChange={(v) => setFilters(prev => ({...prev, commodityId: v}))}>
              <SelectTrigger className="h-8 w-[120px] border-none bg-transparent px-0 text-sm font-medium shadow-none">
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
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
        {[
          { label: 'Total Koperasi', value: snapshot.summary.cooperatives.toLocaleString('id-ID'), icon: Building2, trend: '+12', tone: 'secondary' },
          { label: 'Anggota Aktif', value: snapshot.summary.totalMembers.toLocaleString('id-ID'), icon: Users, trend: formatPercent(snapshot.summary.memberGrowthPct), tone: 'secondary' },
          { label: 'Inc / Member', value: formatCompactCurrency(snapshot.summary.avgIncomeAfter), icon: Wallet, trend: '+14%', tone: 'tertiary' },
          { label: 'Rev / Kop', value: formatCompactCurrency(snapshot.summary.avgMonthlyRevenue), icon: BarChart3, trend: '+8.2%', tone: 'tertiary' },
          { label: 'Avg NPL', value: `${snapshot.summary.avgNpl.toFixed(1)}%`, icon: ShieldAlert, trend: '-0.2%', tone: snapshot.summary.avgNpl > 3 ? 'primary' : 'secondary' },
          { label: 'Health Score', value: `${Math.round(snapshot.summary.overallScore)}`, icon: HeartPulse, trend: 'Optimal', tone: 'secondary' },
        ].map((kpi, idx) => (
          <Card key={idx} className={`${SURFACE_CARD} transition-all hover:border-rose-200 hover:shadow-[0_14px_26px_-18px_rgba(15,23,42,0.18)]`}>
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className={`rounded-xl p-2 ${
                  kpi.tone === 'primary'
                    ? 'bg-[var(--dashboard-primary)]/10 text-[var(--dashboard-primary)]'
                    : kpi.tone === 'tertiary'
                      ? 'bg-[var(--dashboard-tertiary)]/20 text-[#8A5F00]'
                      : 'bg-[var(--dashboard-secondary)]/10 text-[var(--dashboard-secondary)]'
                }`}>
                  <kpi.icon className="h-4 w-4" />
                </div>
                <Badge className={`text-[10px] font-medium ${
                  kpi.tone === 'primary'
                    ? 'bg-[var(--dashboard-primary)]/10 text-[var(--dashboard-primary)]'
                    : kpi.tone === 'tertiary'
                      ? 'bg-[var(--dashboard-tertiary)]/20 text-[#8A5F00]'
                      : 'bg-[var(--dashboard-secondary)]/10 text-[var(--dashboard-secondary)]'
                }`}>
                  {kpi.trend}
                </Badge>
              </div>
              <div className="mt-3">
                <p className="text-xs font-medium text-slate-500">{kpi.label}</p>
                <p className="mt-0.5 text-[1.55rem] font-semibold text-slate-900">{kpi.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* MIDDLE SECTION - CHARTS & EWS */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        {/* MAIN CHART - 8 COLS */}
        <Card className={`${SURFACE_CARD} lg:col-span-8 flex flex-col`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b border-slate-200 p-4">
            <div className="space-y-0.5">
              <CardTitle className="text-sm font-semibold text-slate-900">Performa pertumbuhan nasional</CardTitle>
              <CardDescription className="text-xs text-slate-500">Korelasi anggota baru vs produksi beras secara agregat</CardDescription>
            </div>
            <div className="flex gap-4">
              <div className="flex items-center gap-1.5 text-[10px] font-medium text-[var(--dashboard-secondary)]">
                <div className="h-2 w-2 rounded-full bg-[var(--dashboard-secondary)]" /> Anggota
              </div>
              <div className="flex items-center gap-1.5 text-[10px] font-medium text-[var(--dashboard-primary)]">
                <div className="h-2 w-2 rounded-full bg-[var(--dashboard-primary)]" /> Risiko
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 flex-1">
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={snapshot.trend}>
                  <defs>
                    <linearGradient id="colorMembers" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#455A64" stopOpacity={0.16}/>
                      <stop offset="95%" stopColor="#455A64" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" fontSize={11} axisLine={false} tickLine={false} tick={{ fontSize: 11 }} />
                  <YAxis yAxisId="left" hide />
                  <YAxis yAxisId="right" orientation="right" hide />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontSize: '12px' }} 
                    cursor={{ stroke: '#f1f5f9', strokeWidth: 2 }}
                  />
                  <Area yAxisId="left" type="monotone" dataKey="members" stroke="#455A64" strokeWidth={3} fill="url(#colorMembers)" isAnimationActive={false} />
                  <Area yAxisId="right" type="monotone" dataKey="npl" stroke="#D32F2F" strokeWidth={2} fill="transparent" isAnimationActive={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* EWS - 4 COLS */}
        <Card className={`${SURFACE_CARD} lg:col-span-4 flex flex-col`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b border-slate-200 bg-slate-50/70 p-4">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold text-slate-900">
              <ShieldAlert className="h-4 w-4 text-rose-600" /> Early warning
            </CardTitle>
            <Badge variant="destructive" className="h-5 rounded-full px-2 text-[10px] font-medium">3 kritis</Badge>
          </CardHeader>
          <CardContent className="p-0 flex-1 overflow-y-auto">
            <div className="divide-y divide-slate-100">
              {snapshot.topAlerts.slice(0, 4).map((alert) => (
                <div key={alert.id} className="group cursor-pointer p-3.5 transition-colors hover:bg-slate-50">
                  <div className="flex items-start gap-3">
                    <div className={`mt-0.5 p-1.5 rounded-lg ${alert.severity === 'critical' ? 'bg-rose-50 text-rose-600' : 'bg-amber-50 text-amber-600'}`}>
                      <AlertTriangle className="h-3 w-3" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-sm font-semibold text-slate-900">{alert.title}</p>
                        <span className="whitespace-nowrap text-[10px] text-slate-400">2 jam lalu</span>
                      </div>
                      <p className="mt-1 text-xs font-medium leading-tight text-slate-500 line-clamp-2">{alert.message}</p>
                      <div className="mt-2 flex items-center gap-2">
                        <span className="rounded bg-rose-50 px-1.5 py-0.5 text-[10px] font-medium text-rose-700">{alert.scopeLabel}</span>
                        <ChevronRight className="h-3 w-3 text-slate-300 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <div className="border-t border-slate-200 bg-slate-50/30 p-3">
            <Button variant="ghost" className="h-8 w-full text-xs font-medium text-slate-600 transition-all hover:bg-white hover:text-rose-600">
              Buka Command Center <ArrowRight className="ml-2 h-3 w-3" />
            </Button>
          </div>
        </Card>
      </div>

      {/* BOTTOM SECTION - TABLES & ANALYTICS */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        {/* CROSS KOPERASI TABLE - 8 COLS */}
        <Card className={`${SURFACE_CARD} lg:col-span-8 flex flex-col`}>
          <CardHeader className="border-b border-slate-200 bg-slate-50/70 p-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <CardTitle className="text-sm font-semibold text-slate-900">Audit lintas unit kerja</CardTitle>
                <CardDescription className="text-xs text-slate-500">Monitoring 1,248 unit nasional. Filter aktif: {snapshot.scopeLabel}</CardDescription>
              </div>
              <Button size="sm" className="h-9 rounded-lg bg-[var(--dashboard-primary)] px-4 text-xs font-medium text-white shadow-[0_12px_24px_-18px_rgba(145,0,15,0.42)] hover:bg-[#B82A2A]">
                Download Audit PDF
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <div className="min-w-[800px]">
              <Table>
                <TableHeader className="bg-slate-50">
                <TableRow className="border-none hover:bg-transparent">
                  <TableHead className="h-10 px-4 text-xs font-medium text-slate-500">Unit koperasi</TableHead>
                  <TableHead className="h-10 text-center text-xs font-medium text-slate-500">Status</TableHead>
                  <TableHead className="h-10 text-right text-xs font-medium text-slate-500">Anggota</TableHead>
                  <TableHead className="h-10 text-right text-xs font-medium text-slate-500">Pendapatan / anggota</TableHead>
                  <TableHead className="h-10 text-right text-xs font-medium text-slate-500">Rasio NPL</TableHead>
                  <TableHead className="h-10 px-4 text-right text-xs font-medium text-slate-500">Skor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {snapshot.cooperativeComparisons.slice(0, 6).map((row) => (
                  <TableRow key={row.id} className="border-slate-100 hover:bg-slate-50 transition-colors group cursor-pointer">
                    <TableCell className="px-4 py-3">
                      <div className="min-w-[140px]">
                        <p className="truncate text-sm font-semibold text-slate-900 transition-colors group-hover:text-rose-600">{row.label}</p>
                        <p className="text-[10px] text-slate-400">{row.village}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge className={`h-5 px-1.5 text-[10px] font-medium ${healthBadgeClass(row.overallHealth)}`}>
                        {row.overallHealth}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right text-sm font-medium text-slate-600">{row.totalMembers.toLocaleString('id-ID')}</TableCell>
                    <TableCell className="text-right text-sm font-semibold text-[var(--dashboard-secondary)]">{formatCompactCurrency(row.avgIncomeAfter)}</TableCell>
                    <TableCell className={`text-right text-sm font-semibold ${row.avgNpl > 3 ? 'text-rose-600' : 'text-slate-900'}`}>{row.avgNpl.toFixed(1)}%</TableCell>
                    <TableCell className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-12 h-1 bg-slate-100 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${row.overallScore > 80 ? 'bg-[var(--dashboard-secondary)]' : row.overallScore > 60 ? 'bg-[var(--dashboard-tertiary)]' : 'bg-[var(--dashboard-primary)]'}`} style={{ width: `${row.overallScore}%` }} />
                        </div>
                        <span className="text-xs font-semibold text-slate-900">{Math.round(row.overallScore)}</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
              </Table>
            </div>
          </CardContent>
          <div className="border-t border-slate-200 bg-slate-50/50 p-3 text-center">

            <Button variant="link" className="h-auto p-0 text-xs font-medium text-rose-600 hover:no-underline" asChild>
              <Link href="/anggota">Audit seluruh database unit (1,248)</Link>
            </Button>
          </div>
        </Card>

        {/* DEMOGRAPHICS & HEALTH - 4 COLS */}
        <div className="flex flex-col gap-4 lg:col-span-4">
          <Card className={`${SURFACE_CARD} flex-1`}>
            <CardHeader className="border-b border-slate-200 p-4 pb-3">
              <CardTitle className="text-sm font-semibold text-slate-900">Kesehatan portofolio</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="h-[140px] w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Sehat', value: 450, color: '#455A64' },
                        { name: 'Waspada', value: 620, color: '#FBC02D' },
                        { name: 'Kritis', value: 178, color: '#D32F2F' },
                      ]}
                      innerRadius={45}
                      outerRadius={60}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {[0,1,2].map((_, i) => <Cell key={i} fill={['#455A64', '#FBC02D', '#D32F2F'][i]} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-lg font-semibold text-slate-900">1,248</span>
                  <span className="text-[10px] font-medium text-slate-400">Unit</span>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-1.5 mt-2">
                {[
                  { label: 'Sangat Sehat', count: '450', color: 'bg-[var(--dashboard-secondary)]' },
                  { label: 'Waspada / Audit', count: '620', color: 'bg-[var(--dashboard-tertiary)]' },
                  { label: 'Intervensi Segera', count: '178', color: 'bg-[var(--dashboard-primary)]' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between rounded-lg border border-slate-200 bg-slate-50 p-2 shadow-[0_8px_18px_-18px_rgba(15,23,42,0.18)]">
                    <div className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full ${item.color}`} />
                      <span className="text-[11px] font-medium text-slate-600">{item.label}</span>
                    </div>
                    <span className="text-sm font-semibold text-slate-900">{item.count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className={`${SURFACE_CARD} border-rose-200 bg-white`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 border-b border-rose-100 bg-rose-50/25 p-4">
              <CardTitle className="flex items-center gap-2 text-sm font-semibold text-rose-900">
                <Sparkles className="h-4 w-4 text-rose-600" /> Insight AI
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <div className="space-y-1">
                <p className="text-sm font-semibold leading-tight text-slate-900">Deteksi anomali pendapatan</p>
                <p className="text-xs leading-relaxed text-slate-600">
                  Tren pendapatan di Wilayah Timur melampaui forecast 12%. Disarankan alokasi modal tambahan untuk infrastruktur pasca-panen.
                </p>
              </div>
              <div className="border-t border-rose-100 pt-2">
                <Button className="h-9 w-full rounded-xl bg-rose-600 text-xs font-medium text-white shadow-[0_12px_22px_-18px_rgba(190,24,93,0.38)] hover:bg-rose-700">
                  Konsultasi Strategi AI
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <AuditDetailDialog 
        cooperative={selectedCooperative} 
        open={isAuditDialogOpen} 
        onOpenChange={setIsAuditDialogOpen} 
      />
    </div>
  )
}
