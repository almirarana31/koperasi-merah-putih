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
} from 'recharts'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
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

function formatCurrency(value: number) {
  return currencyFormatter.format(value)
}

function formatCompactCurrency(value: number) {
  const compact = compactNumberFormatter.format(value)
  return `Rp${compact}`
}

function formatPercent(value: number) {
  const sign = value > 0 ? '+' : ''
  return `${sign}${value.toFixed(1)}%`
}

function scoreToHealth(score: number) {
  if (score >= 80) return 'good'
  if (score >= 65) return 'warning'
  return 'critical'
}

function healthBadgeClass(status: string) {
  if (status === 'good') return 'bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/10'
  if (status === 'warning') return 'bg-amber-500/10 text-amber-700 hover:bg-amber-500/10'
  return 'bg-red-500/10 text-red-700 hover:bg-red-500/10'
}

function severityBadgeClass(severity: AlertSeverity) {
  if (severity === 'critical') return 'bg-red-500/10 text-red-700 hover:bg-red-500/10'
  if (severity === 'warning') return 'bg-amber-500/10 text-amber-700 hover:bg-amber-500/10'
  return 'bg-stone-500/10 text-stone-700 hover:bg-stone-500/10'
}

function severityAlertClass(severity: AlertSeverity) {
  if (severity === 'critical') return 'border-red-200 bg-red-50/70 text-red-900'
  if (severity === 'warning') return 'border-amber-200 bg-amber-50/70 text-amber-900'
  return 'border-stone-200 bg-stone-50/80 text-stone-900'
}

function toRelativeUpdateLabel(lastUpdated: string, now: number) {
  const diffMinutes = Math.max(0, Math.round((now - new Date(lastUpdated).getTime()) / 60000))
  if (diffMinutes < 1) return 'Baru saja sinkron'
  if (diffMinutes < 60) return `Sinkron ${diffMinutes} menit lalu`
  const diffHours = Math.round(diffMinutes / 60)
  return `Sinkron ${diffHours} jam lalu`
}

function rowContext(row: GroupSummary) {
  if (row.level === 'region') return row.province
  if (row.level === 'village') return row.region
  if (row.level === 'cooperative') return row.village
  return row.province
}

function actionLabel(row: GroupSummary) {
  if (row.level === 'region') return 'Buka desa'
  if (row.level === 'village') return 'Buka koperasi'
  return 'Lihat detail'
}

type MetricTone = 'neutral' | 'rose' | 'sand' | 'amber' | 'crimson' | 'emerald'

const METRIC_TONES: Record<
  MetricTone,
  { card: string; label: string; value: string; iconWrap: string; icon: string; accent: string }
> = {
  neutral: {
    card: 'border-stone-200 bg-[linear-gradient(180deg,#ffffff_0%,#fafaf9_100%)]',
    label: 'text-stone-600',
    value: 'text-slate-950',
    iconWrap: 'border-stone-200 bg-stone-100',
    icon: 'text-stone-700',
    accent: 'bg-stone-700',
  },
  rose: {
    card: 'border-rose-200 bg-[linear-gradient(180deg,#fff8f8_0%,#fff2f3_100%)]',
    label: 'text-rose-700',
    value: 'text-slate-950',
    iconWrap: 'border-rose-200 bg-rose-100',
    icon: 'text-rose-700',
    accent: 'bg-rose-600',
  },
  sand: {
    card: 'border-orange-200 bg-[linear-gradient(180deg,#fffdf8_0%,#fff5ea_100%)]',
    label: 'text-orange-700',
    value: 'text-slate-950',
    iconWrap: 'border-orange-200 bg-orange-100',
    icon: 'text-orange-700',
    accent: 'bg-orange-500',
  },
  amber: {
    card: 'border-amber-200 bg-[linear-gradient(180deg,#fffdf7_0%,#fff7e6_100%)]',
    label: 'text-amber-700',
    value: 'text-slate-950',
    iconWrap: 'border-amber-200 bg-amber-100',
    icon: 'text-amber-700',
    accent: 'bg-amber-500',
  },
  crimson: {
    card: 'border-rose-200 bg-[linear-gradient(180deg,#fff8f8_0%,#fff0f0_100%)]',
    label: 'text-rose-700',
    value: 'text-slate-950',
    iconWrap: 'border-rose-200 bg-rose-100',
    icon: 'text-rose-700',
    accent: 'bg-rose-500',
  },
  emerald: {
    card: 'border-emerald-200 bg-[linear-gradient(180deg,#fbfffd_0%,#effcf4_100%)]',
    label: 'text-emerald-700',
    value: 'text-slate-950',
    iconWrap: 'border-emerald-200 bg-emerald-100',
    icon: 'text-emerald-700',
    accent: 'bg-emerald-500',
  },
}

function insightToneClass(index: number) {
  const variants = [
    'border-rose-200 bg-rose-50/85',
    'border-amber-200 bg-amber-50/85',
    'border-stone-200 bg-stone-50/85',
  ]
  return variants[index % variants.length]
}

const SURFACE_CARD = 'overflow-hidden border-stone-200/80 bg-white shadow-[0_18px_40px_-32px_rgba(15,23,42,0.28)]'
const SUBTLE_PANEL = 'rounded-2xl border border-stone-200 bg-stone-50/80'

function OverviewMetricCard({
  title,
  value,
  description,
  icon: Icon,
  tone,
  trend,
}: {
  title: string
  value: string
  description: string
  icon: LucideIcon
  tone: MetricTone
  trend?: { value: number; isPositive: boolean }
}) {
  const palette = METRIC_TONES[tone]

  return (
    <Card className={`${SURFACE_CARD} ${palette.card}`}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <p className={`text-xs font-semibold uppercase tracking-[0.18em] ${palette.label}`}>{title}</p>
            <p className={`mt-3 text-[2rem] font-bold leading-none tracking-tight ${palette.value}`}>{value}</p>
            <p className="mt-2 text-sm text-slate-600">{description}</p>
            {trend && (
              <p className={`mt-3 text-sm font-medium ${trend.isPositive ? 'text-emerald-700' : 'text-rose-700'}`}>
                {trend.isPositive ? '+' : ''}
                {trend.value.toFixed(1)}% dari periode sebelumnya
              </p>
            )}
          </div>
          <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border ${palette.iconWrap}`}>
            <Icon className={`h-5 w-5 ${palette.icon}`} />
          </div>
        </div>
        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-stone-200">
          <div className={`h-full w-[62%] rounded-full ${palette.accent}`} />
        </div>
      </CardContent>
    </Card>
  )
}

export function KementerianNationalDashboard() {
  const [filters, setFilters] = useState<ScopeFilters>({
    provinceId: 'all',
    regionId: 'all',
    villageId: 'all',
    cooperativeId: 'all',
  })
  const [clock, setClock] = useState(() => Date.now())

  useEffect(() => {
    const intervalId = window.setInterval(() => setClock(Date.now()), 30000)
    return () => window.clearInterval(intervalId)
  }, [])

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
  const ratioOverview = snapshot.selectedCooperative
    ? snapshot.selectedCooperative.ratioScores.map((ratio) => ({
        label: ratio.label,
        score: ratio.score,
        valueLabel: ratio.key === 'profitability' ? `${ratio.value}%` : `${ratio.value}x`,
        status: ratio.status,
      }))
    : [
        {
          label: 'Likuiditas',
          score: snapshot.summary.avgLiquidityScore,
          valueLabel: 'Skor rata-rata',
          status: scoreToHealth(snapshot.summary.avgLiquidityScore),
        },
        {
          label: 'Solvabilitas',
          score: snapshot.summary.avgSolvencyScore,
          valueLabel: 'Skor rata-rata',
          status: scoreToHealth(snapshot.summary.avgSolvencyScore),
        },
        {
          label: 'Rentabilitas',
          score: snapshot.summary.avgProfitabilityScore,
          valueLabel: 'Skor rata-rata',
          status: scoreToHealth(snapshot.summary.avgProfitabilityScore),
        },
      ]
  const topGrowthRegions = [...snapshot.regionComparisons]
    .sort((left, right) => right.incomeImprovementPct - left.incomeImprovementPct)
    .slice(0, 5)
  const weakestCooperatives = [...snapshot.cooperativeComparisons]
    .sort((left, right) => left.overallScore - right.overallScore)
    .slice(0, 5)
  const healthTone: MetricTone =
    snapshot.summary.overallHealth === 'good'
      ? 'emerald'
      : snapshot.summary.overallHealth === 'warning'
        ? 'amber'
        : 'crimson'
  const nplTone: MetricTone = snapshot.summary.avgNpl >= 6 ? 'crimson' : 'amber'

  const updateProvince = (provinceId: string) => {
    setFilters({
      provinceId,
      regionId: 'all',
      villageId: 'all',
      cooperativeId: 'all',
    })
  }

  const updateRegion = (regionId: string) => {
    setFilters((current) => ({
      ...current,
      regionId,
      villageId: 'all',
      cooperativeId: 'all',
    }))
  }

  const updateVillage = (villageId: string) => {
    setFilters((current) => ({
      ...current,
      villageId,
      cooperativeId: 'all',
    }))
  }

  const updateCooperative = (cooperativeId: string) => {
    setFilters((current) => ({
      ...current,
      cooperativeId,
    }))
  }

  const drillInto = (row: GroupSummary) => {
    if (row.level === 'region') {
      setFilters((current) => ({
        ...current,
        regionId: row.id,
        villageId: 'all',
        cooperativeId: 'all',
      }))
      return
    }

    if (row.level === 'village') {
      setFilters((current) => ({
        ...current,
        villageId: row.id,
        cooperativeId: 'all',
      }))
      return
    }

    if (row.level === 'cooperative') {
      setFilters((current) => ({
        ...current,
        cooperativeId: row.id,
      }))
    }
  }

  return (
    <div className="space-y-5 pb-6">
      <Card
        className={`${SURFACE_CARD} border-rose-200/70 bg-[linear-gradient(135deg,#fffdfd_0%,#fff8f8_58%,#fff4f1_100%)]`}
      >
        <CardContent className="relative p-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(244,63,94,0.1),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(251,191,36,0.12),transparent_28%)]" />
          <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(120,113,108,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(120,113,108,0.08)_1px,transparent_1px)] [background-size:32px_32px]" />
          <div className="relative grid gap-5 p-5 xl:grid-cols-[1.18fr_0.82fr] xl:p-6">
            <div className="min-w-0 space-y-5">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="border border-rose-200 bg-white/90 text-rose-700 hover:bg-white/90">
                  Kementerian
                </Badge>
                <Badge className="border border-stone-200 bg-stone-100/90 text-stone-700 hover:bg-stone-100/90">
                  Seluruh koperasi nasional
                </Badge>
                <Badge className="border border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-50">
                  {toRelativeUpdateLabel(KEMENTERIAN_DASHBOARD_DATA.lastUpdated, clock)}
                </Badge>
              </div>

              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-rose-700">
                  Dashboard Pengawasan Nasional
                </p>
                <div className="max-w-4xl">
                  <h1 className="text-3xl font-bold leading-tight tracking-tight text-slate-950 sm:text-[2.6rem]">
                    Monitoring koperasi nasional dengan alert dini dan insight yang siap dipresentasikan
                  </h1>
                  <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
                    {snapshot.aiSummary}
                  </p>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className={`${SUBTLE_PANEL} bg-white/88 p-4`}>
                  <p className="text-xs uppercase tracking-[0.18em] text-stone-500">Cakupan aktif</p>
                  <p className="mt-3 text-2xl font-bold text-slate-950">{snapshot.scopeLabel}</p>
                  <p className="mt-1 text-sm text-slate-600">{snapshot.contextLabel}</p>
                </div>
                <div className="rounded-2xl border border-red-200 bg-red-50/90 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-red-700">Alert kritis</p>
                  <p className="mt-3 text-2xl font-bold text-slate-950">{snapshot.summary.criticalCount}</p>
                  <p className="mt-1 text-sm text-red-700/90">Prioritas nasional untuk intervensi cepat</p>
                </div>
                <div className="rounded-2xl border border-amber-200 bg-amber-50/90 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-amber-700">Skor kesehatan</p>
                  <p className="mt-3 text-2xl font-bold text-slate-950">{Math.round(snapshot.summary.overallScore)}/100</p>
                  <p className="mt-1 text-sm text-amber-700/90">Status {snapshot.summary.overallHealth}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button asChild className="bg-rose-700 text-white hover:bg-rose-800">
                  <Link href="/keuangan/laporan">
                    <FileText className="mr-2 h-4 w-4" />
                    Laporan finansial
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="secondary"
                  className="border border-stone-200 bg-white text-slate-700 hover:bg-stone-50"
                >
                  <Link href="/ai/forecast">
                    <Brain className="mr-2 h-4 w-4" />
                    Forecast AI
                  </Link>
                </Button>
                <Button
                  variant="secondary"
                  className="border border-stone-200 bg-stone-100 text-slate-700 hover:bg-stone-200"
                  onClick={() =>
                    setFilters({
                      provinceId: 'all',
                      regionId: 'all',
                      villageId: 'all',
                      cooperativeId: 'all',
                    })
                  }
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Reset cakupan
                </Button>
              </div>
            </div>

            <Card className={`${SURFACE_CARD} border-rose-200/80 bg-white/92 backdrop-blur-sm`}>
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <CardTitle className="text-lg text-slate-950">AI Intelligence Layer</CardTitle>
                    <CardDescription className="text-slate-600">
                      Ringkasan anomali, risiko, dan rekomendasi tindakan.
                    </CardDescription>
                  </div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-rose-200 bg-rose-50">
                    <Sparkles className="h-5 w-5 text-rose-700" />
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
        </CardContent>
      </Card>

      <Card className={SURFACE_CARD}>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Filter Hierarki Pengawasan</CardTitle>
          <CardDescription>
            Nasional - regional - desa - koperasi. Pilih cakupan untuk membandingkan kesejahteraan dan risiko.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Select value={filters.provinceId} onValueChange={updateProvince}>
            <SelectTrigger>
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

          <Select value={filters.regionId} onValueChange={updateRegion}>
            <SelectTrigger>
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

          <Select value={filters.villageId} onValueChange={updateVillage}>
            <SelectTrigger>
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

          <Select value={filters.cooperativeId} onValueChange={updateCooperative}>
            <SelectTrigger>
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

      <div className="grid gap-4 xl:grid-cols-3">
        <Card className={SURFACE_CARD}>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Tren Anggota</CardTitle>
            <CardDescription>Total anggota dan pertumbuhan nasional saat ini.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
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

        <Card className={SURFACE_CARD}>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Tren Kesejahteraan</CardTitle>
            <CardDescription>Pendapatan rata-rata anggota sebelum dan sesudah intervensi koperasi.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
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

        <Card className={SURFACE_CARD}>
          <CardHeader className="pb-4">
            <CardTitle className="text-lg">Tren NPL</CardTitle>
            <CardDescription>Early warning kualitas pinjaman per periode.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
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
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-3">
        {snapshot.topAlerts.slice(0, 3).map((alert) => (
          <Alert key={alert.id} className={severityAlertClass(alert.severity)}>
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle className="flex flex-wrap items-center gap-2">
              {alert.title}
              <Badge className={severityBadgeClass(alert.severity)}>{alert.severity}</Badge>
              <Badge variant="outline" className="border-current/20 bg-white/60">
                {alert.scopeLabel}
              </Badge>
            </AlertTitle>
            <AlertDescription className="space-y-1.5">
              <p>{alert.message}</p>
              <p className="font-medium">{alert.recommendation}</p>
            </AlertDescription>
          </Alert>
        ))}
      </div>

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

        <TabsContent value="records" className="space-y-4">
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
