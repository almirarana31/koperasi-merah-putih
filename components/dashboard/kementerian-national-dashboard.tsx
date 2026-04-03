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
import { StatsCard } from '@/components/stats-card'
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
  type EarlyWarningAlert,
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
  return 'bg-sky-500/10 text-sky-700 hover:bg-sky-500/10'
}

function severityAlertClass(severity: AlertSeverity) {
  if (severity === 'critical') return 'border-red-200 bg-red-50/70 text-red-900'
  if (severity === 'warning') return 'border-amber-200 bg-amber-50/70 text-amber-900'
  return 'border-sky-200 bg-sky-50/70 text-sky-900'
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
    <div className="space-y-6">
      <Card className="overflow-hidden border-none bg-[linear-gradient(135deg,#7a1215_0%,#be0817_52%,#d64b1e_100%)] text-primary-foreground shadow-[0_34px_90px_-42px_rgba(122,18,21,0.72)]">
        <CardContent className="relative p-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.16),transparent_34%),radial-gradient(circle_at_bottom_right,rgba(0,0,0,0.16),transparent_28%)]" />
          <div className="absolute -left-12 top-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -right-12 bottom-0 h-44 w-44 rounded-full bg-orange-200/15 blur-3xl" />
          <div className="relative grid gap-5 p-5 lg:grid-cols-[1.12fr_0.88fr] lg:p-6">
            <div className="space-y-5">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="border-none bg-white/18 text-white hover:bg-white/18">
                  Kementerian
                </Badge>
                <Badge className="border-none bg-white/18 text-white hover:bg-white/18">
                  Seluruh koperasi nasional
                </Badge>
                <Badge className="border-none bg-white/18 text-white hover:bg-white/18">
                  {toRelativeUpdateLabel(KEMENTERIAN_DASHBOARD_DATA.lastUpdated, clock)}
                </Badge>
              </div>

              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/88">
                  Dashboard Pengawasan Nasional
                </p>
                <div className="flex flex-col gap-3 xl:flex-row xl:items-end xl:justify-between">
                  <div>
                    <h1 className="text-[2rem] font-bold leading-tight tracking-tight sm:text-[2.5rem]">
                      Monitoring koperasi nasional dengan early warning dan insight AI
                    </h1>
                    <p className="mt-3 max-w-3xl text-sm leading-6 text-white/92">
                      {snapshot.aiSummary}
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-3xl border border-white/16 bg-white/14 p-4 backdrop-blur-sm">
                  <p className="text-xs uppercase tracking-[0.18em] text-white/84">Cakupan aktif</p>
                  <p className="mt-3 text-3xl font-bold">{snapshot.scopeLabel}</p>
                  <p className="mt-1 text-sm text-white/90">{snapshot.contextLabel}</p>
                </div>
                <div className="rounded-3xl border border-white/16 bg-black/14 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-white/84">Alert kritis</p>
                  <p className="mt-3 text-3xl font-bold">{snapshot.summary.criticalCount}</p>
                  <p className="mt-1 text-sm text-white/90">Prioritas nasional untuk intervensi cepat</p>
                </div>
                <div className="rounded-3xl border border-white/16 bg-white/14 p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-white/84">Skor kesehatan</p>
                  <p className="mt-3 text-3xl font-bold">{Math.round(snapshot.summary.overallScore)}/100</p>
                  <p className="mt-1 text-sm text-white/90">Status {snapshot.summary.overallHealth}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button asChild className="bg-white text-primary hover:bg-white/90">
                  <Link href="/keuangan/laporan">
                    <FileText className="mr-2 h-4 w-4" />
                    Laporan finansial
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="secondary"
                  className="border border-white/12 bg-white/10 text-primary-foreground hover:bg-white/16"
                >
                  <Link href="/ai/forecast">
                    <Brain className="mr-2 h-4 w-4" />
                    Forecast AI
                  </Link>
                </Button>
                <Button
                  variant="secondary"
                  className="border border-white/12 bg-white/10 text-primary-foreground hover:bg-white/16"
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

              <Card className="border-white/16 bg-white/12 text-white shadow-none backdrop-blur-sm">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <CardTitle className="text-lg text-white">AI Intelligence Layer</CardTitle>
                    <CardDescription className="text-white/88">
                      Ringkasan anomali, risiko, dan rekomendasi tindakan.
                    </CardDescription>
                  </div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/12">
                    <Sparkles className="h-5 w-5" />
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {snapshot.aiInsights.slice(0, 3).map((insight) => (
                  <div key={insight.id} className="rounded-2xl border border-white/16 bg-black/14 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold">{insight.title}</p>
                        <p className="mt-1 text-sm leading-6 text-white/90">{insight.description}</p>
                      </div>
                      <Badge className="border-none bg-white/18 text-white hover:bg-white/18">
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

      <Card className="border-white/80 bg-white shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Filter Hierarki Pengawasan</CardTitle>
          <CardDescription>
            Nasional - regional - desa - koperasi. Pilih cakupan untuk membandingkan kesejahteraan dan risiko.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
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
        <StatsCard
          title="Koperasi Terpantau"
          value={snapshot.summary.cooperatives.toLocaleString('id-ID')}
          description={`${snapshot.summary.regionCount} regional | ${snapshot.summary.villageCount} desa`}
          icon={Building2}
        />
        <StatsCard
          title="Total Anggota"
          value={snapshot.summary.totalMembers.toLocaleString('id-ID')}
          description="Member aktif dalam cakupan terpilih"
          icon={Users}
          trend={{ value: Math.abs(snapshot.summary.memberGrowthPct), isPositive: snapshot.summary.memberGrowthPct >= 0 }}
        />
        <StatsCard
          title="Pendapatan Anggota"
          value={formatCompactCurrency(snapshot.summary.avgIncomeAfter)}
          description="Rata-rata setelah bergabung koperasi"
          icon={Wallet}
          trend={{ value: snapshot.summary.incomeImprovementPct, isPositive: true }}
        />
        <StatsCard
          title="Pendapatan Koperasi"
          value={formatCompactCurrency(snapshot.summary.avgMonthlyRevenue)}
          description="Rata-rata pendapatan per koperasi"
          icon={BarChart3}
        />
        <StatsCard
          title="Rata-rata NPL"
          value={`${snapshot.summary.avgNpl.toFixed(1)}%`}
          description="Pemantauan kualitas pinjaman"
          icon={ShieldAlert}
        />
        <StatsCard
          title="Skor Kesehatan"
          value={`${Math.round(snapshot.summary.overallScore)}/100`}
          description={`Status ${snapshot.summary.overallHealth}`}
          icon={HeartPulse}
        />
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <Card className="border-white/80 bg-white shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Tren Anggota</CardTitle>
            <CardDescription>Total anggota dan pertumbuhan nasional saat ini.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={snapshot.trend}>
                  <defs>
                    <linearGradient id="membersFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#be0817" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#be0817" stopOpacity={0.03} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(15,23,42,0.08)" />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 12 }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12 }} tickFormatter={(value) => compactNumberFormatter.format(value)} />
                  <Tooltip formatter={(value) => [Number(value).toLocaleString('id-ID'), 'Anggota']} />
                  <Area type="monotone" dataKey="members" stroke="#be0817" fill="url(#membersFill)" strokeWidth={2.5} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/80 bg-white shadow-sm">
          <CardHeader className="pb-3">
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
                  <Line type="monotone" dataKey="avgIncome" stroke="#0f766e" strokeWidth={2.5} dot={{ fill: '#0f766e', r: 3 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-white/80 bg-white shadow-sm">
          <CardHeader className="pb-3">
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
            <AlertTitle className="flex items-center gap-2">
              {alert.title}
              <Badge className={severityBadgeClass(alert.severity)}>{alert.severity}</Badge>
              <Badge variant="outline" className="border-current/20 bg-white/60">
                {alert.scopeLabel}
              </Badge>
            </AlertTitle>
            <AlertDescription>
              <p>{alert.message}</p>
              <p className="font-medium">{alert.recommendation}</p>
            </AlertDescription>
          </Alert>
        ))}
      </div>

      <Tabs defaultValue="hierarki" className="space-y-4">
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="hierarki">Hierarki</TabsTrigger>
          <TabsTrigger value="welfare">Kesejahteraan</TabsTrigger>
          <TabsTrigger value="financial">Keuangan</TabsTrigger>
          <TabsTrigger value="records">Rekaman Data</TabsTrigger>
        </TabsList>

        <TabsContent value="hierarki" className="space-y-4">
          <div className="grid gap-4 xl:grid-cols-[1.18fr_0.82fr]">
            <Card className="border-white/80 bg-white shadow-sm">
              <CardHeader className="pb-3">
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
                <Table>
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
              </CardContent>
            </Card>

            <Card className="border-white/80 bg-white shadow-sm">
              <CardHeader className="pb-3">
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
                    <div className="rounded-3xl border bg-muted/30 p-4">
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
                        <div key={ratio.label} className="rounded-2xl border bg-background p-4">
                          <p className="text-sm text-muted-foreground">{ratio.label}</p>
                          <p className="mt-2 text-2xl font-bold">{Math.round(ratio.score)}/100</p>
                          <p className="text-sm text-muted-foreground">{ratio.valueLabel}</p>
                        </div>
                      ))}
                    </div>

                    <div className="space-y-3">
                      {snapshot.selectedCooperative.alerts.map((alert) => (
                        <div key={alert.id} className="rounded-2xl border bg-background p-4">
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
                      <div key={row.id} className="rounded-2xl border bg-background p-4">
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
            <Card className="border-white/80 bg-white shadow-sm">
              <CardHeader className="pb-2">
                <CardDescription>Sebelum bergabung</CardDescription>
                <CardTitle className="text-2xl">{formatCurrency(snapshot.summary.avgIncomeBefore)}</CardTitle>
              </CardHeader>
            </Card>
            <Card className="border-white/80 bg-white shadow-sm">
              <CardHeader className="pb-2">
                <CardDescription>Sesudah bergabung</CardDescription>
                <CardTitle className="text-2xl">{formatCurrency(snapshot.summary.avgIncomeAfter)}</CardTitle>
              </CardHeader>
            </Card>
            <Card className="border-white/80 bg-white shadow-sm">
              <CardHeader className="pb-2">
                <CardDescription>Peningkatan kesejahteraan</CardDescription>
                <CardTitle className="text-2xl text-emerald-600">{formatPercent(snapshot.summary.incomeImprovementPct)}</CardTitle>
              </CardHeader>
            </Card>
          </div>

          <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
            <Card className="border-white/80 bg-white shadow-sm">
              <CardHeader className="pb-3">
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

            <Card className="border-white/80 bg-white shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Gender dan Pekerjaan</CardTitle>
                <CardDescription>Insight demografi untuk perbandingan kesejahteraan.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="grid gap-3 sm:grid-cols-2">
                  {snapshot.genderDistribution.map((item) => {
                    const total = snapshot.genderDistribution.reduce((sum, entry) => sum + entry.value, 0)
                    const pct = total === 0 ? 0 : (item.value / total) * 100
                    return (
                      <div key={item.label} className="rounded-2xl border bg-background p-4">
                        <p className="text-sm text-muted-foreground">{item.label}</p>
                        <p className="mt-2 text-2xl font-bold">{item.value.toLocaleString('id-ID')}</p>
                        <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
                          <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
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
                        <div className="h-2 overflow-hidden rounded-full bg-muted">
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
            <Card className="border-white/80 bg-white shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Perbandingan Wilayah</CardTitle>
                <CardDescription>Peningkatan pendapatan anggota terbaik per regional.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {topGrowthRegions.map((row) => (
                  <div key={row.id} className="flex items-center justify-between rounded-2xl border bg-background p-4">
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

            <Card className="border-white/80 bg-white shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Koperasi Rentan Kesejahteraan</CardTitle>
                <CardDescription>Unit dengan skor terendah untuk pendampingan prioritas.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {weakestCooperatives.map((row) => (
                  <div key={row.id} className="flex items-center justify-between rounded-2xl border bg-background p-4">
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
              <Card key={ratio.label} className="border-white/80 bg-white shadow-sm">
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
            <Card className="border-white/80 bg-white shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Wilayah Risiko Finansial</CardTitle>
                <CardDescription>Regional dengan NPL dan skor kesehatan terburuk.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
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
              </CardContent>
            </Card>

            <Card className="border-white/80 bg-white shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Kinerja Finansial Koperasi</CardTitle>
                <CardDescription>Perbandingan koperasi berdasarkan pendapatan dan kesehatan.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
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
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="records" className="space-y-4">
          <div className="grid gap-4 xl:grid-cols-2">
            <Card className="border-white/80 bg-white shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Rekaman Keuangan</CardTitle>
                <CardDescription>Drill-down dari ringkasan ke dokumen dan catatan keuangan per koperasi.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
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
              </CardContent>
            </Card>

            <Card className="border-white/80 bg-white shadow-sm">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">Rekaman Anggota</CardTitle>
                <CardDescription>Data anggota, demografi, dan perubahan pendapatan pada cakupan terpilih.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
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
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
