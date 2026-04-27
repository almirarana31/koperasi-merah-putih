'use client'

import { useEffect, useState } from 'react'
import {
  AlertTriangle,
  BarChart3,
  Building2,
  ChevronRight,
  HeartPulse,
  RefreshCw,
  ShieldAlert,
  Users,
  Wallet,
} from 'lucide-react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { DataTable, type DataTableColumn } from '@/components/ui/data-table'
import { cn } from '@/lib/utils'
import { exportToPDF } from '@/lib/pdf-export'
import { toast } from 'sonner'
import {
  KEMENTERIAN_DASHBOARD_DATA,
  getKementerianDashboardSnapshot,
  type AlertSeverity,
  type GroupSummary,
  type ScopeFilters,
} from '@/lib/kementerian-dashboard-data'
import { AuditDetailDialog } from '@/components/dialogs/audit-detail-dialog'

const LAST_UPDATED_MS = new Date(KEMENTERIAN_DASHBOARD_DATA.lastUpdated).getTime()

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

const PORTFOLIO_HEALTH_COLORS = {
  healthy: 'var(--success)',
  warning: 'var(--warning)',
  critical: 'var(--destructive)',
} as const

type AccentTone = 'primary' | 'secondary' | 'tertiary'
const ACCENT_CLASS: Record<AccentTone, string> = {
  primary: 'card-accent card-accent-primary',
  secondary: 'card-accent card-accent-secondary',
  tertiary: 'card-accent card-accent-tertiary',
}

export function KementerianNationalDashboard() {
  const [filters, setFilters] = useState<ScopeFilters>({
    provinceId: 'all',
    regionId: 'all',
    villageId: 'all',
    cooperativeId: 'all',
    commodityId: 'all',
  })
  const [clock, setClock] = useState(() => Date.now())
  const [selectedCooperative, setSelectedCooperative] = useState<GroupSummary | null>(null)
  const [isAuditDialogOpen, setIsAuditDialogOpen] = useState(false)
  const [isDownloadingAudit, setIsDownloadingAudit] = useState(false)

  useEffect(() => {
    const intervalId = window.setInterval(() => setClock(Date.now()), 30000)
    return () => window.clearInterval(intervalId)
  }, [])

  const provinceOptions = KEMENTERIAN_DASHBOARD_DATA.provinceOptions
  const regionOptions = KEMENTERIAN_DASHBOARD_DATA.regionOptions.filter(
    (option) => filters.provinceId === 'all' || option.provinceId === filters.provinceId,
  )

  const snapshot = getKementerianDashboardSnapshot(filters)

  const healthCounts = snapshot.cooperativeComparisons.reduce(
    (acc, row) => {
      acc[row.overallHealth] += 1
      return acc
    },
    { good: 0, warning: 0, critical: 0 },
  )
  const portfolioHealthData = [
    { label: 'Sangat Sehat', count: healthCounts.good, color: PORTFOLIO_HEALTH_COLORS.healthy },
    { label: 'Waspada / Audit', count: healthCounts.warning, color: PORTFOLIO_HEALTH_COLORS.warning },
    { label: 'Intervensi Segera', count: healthCounts.critical, color: PORTFOLIO_HEALTH_COLORS.critical },
  ]
  const portfolioTotal = portfolioHealthData.reduce((sum, item) => sum + item.count, 0)
  const minutesSinceSync = Math.max(0, Math.floor((clock - LAST_UPDATED_MS) / 60000))

  const handleAuditRowClick = (row: GroupSummary) => {
    setSelectedCooperative(row)
    setIsAuditDialogOpen(true)
  }

  const handleDownloadAuditPdf = async () => {
    setIsDownloadingAudit(true)
    toast.info(`Menyiapkan Audit PDF Untuk ${snapshot.scopeLabel}...`)

    const result = await exportToPDF({
      title: 'Audit Lintas Unit Kerja Nasional',
      subtitle: `Ringkasan Strategis ${snapshot.scopeLabel}`,
      filename: `audit-nasional-${filters.provinceId}-${Date.now()}.pdf`,
      orientation: 'landscape',
      data: snapshot.cooperativeComparisons.slice(0, 12).map((row) => ({
        'Unit Koperasi': row.label,
        Desa: row.village,
        Status: row.overallHealth === 'good' ? 'SEHAT' : row.overallHealth === 'warning' ? 'WASPADA' : 'KRITIS',
        Anggota: row.totalMembers.toLocaleString('id-ID'),
        'Pendapatan / Anggota': formatCompactCurrency(row.avgIncomeAfter),
        'Rasio NPL': `${row.avgNpl.toFixed(1)}%`,
        Skor: Math.round(row.overallScore),
      })),
    })

    if (result.success) {
      toast.success('Audit PDF Berhasil Diunduh.')
    } else {
      toast.error(result.error ?? 'Audit PDF Gagal Dibuat.')
    }

    setIsDownloadingAudit(false)
  }

  const severityAlertClass = (s: AlertSeverity) =>
    s === 'critical'
      ? 'bg-destructive/10 text-destructive'
      : 'bg-warning/10 text-[color:var(--warning)]'

  const auditColumns: DataTableColumn<GroupSummary>[] = [
    {
      key: 'unit',
      header: 'Unit Koperasi',
      cell: (row) => (
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">{row.label}</p>
          <p className="truncate text-xs text-muted-foreground">
            {row.village}, {row.region}
          </p>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      align: 'center',
      cell: (row) => (
        <Badge variant="outline" className={healthBadgeClass(row.overallHealth)}>
          {row.overallHealth === 'good' ? 'Sehat' : row.overallHealth === 'warning' ? 'Waspada' : 'Kritis'}
        </Badge>
      ),
    },
    {
      key: 'members',
      header: 'Anggota',
      align: 'right',
      cell: (row) => <span className="tabular-nums">{row.totalMembers.toLocaleString('id-ID')}</span>,
    },
    {
      key: 'income',
      header: 'Pendapatan / Anggota',
      align: 'right',
      cell: (row) => <span className="tabular-nums">{formatCompactCurrency(row.avgIncomeAfter)}</span>,
    },
    {
      key: 'npl',
      header: 'Rasio NPL',
      align: 'right',
      cell: (row) => (
        <span
          className={cn(
            'tabular-nums font-medium',
            row.avgNpl > 5 ? 'text-destructive' : row.avgNpl > 3 ? 'text-[color:var(--warning)]' : 'text-[color:var(--success)]',
          )}
        >
          {row.avgNpl.toFixed(1)}%
        </span>
      ),
    },
    {
      key: 'score',
      header: 'Skor Audit',
      align: 'right',
      cell: (row) => <span className="tabular-nums font-semibold">{Math.round(row.overallScore)}</span>,
    },
  ]

  return (
    <div className="page-shell">
      {/* HEADER SECTION */}
      <div className="page-header surface-card flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="page-title">Pusat Komando Kementerian</h1>
            <Badge variant="outline" className="border-success/30 bg-success/10 text-success">
              Live
            </Badge>
          </div>
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <RefreshCw className="h-3.5 w-3.5" />
            Data terpusat: {snapshot.scopeLabel} · sinkron {minutesSinceSync} menit lalu
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground">Provinsi</span>
            <Select
              value={filters.provinceId}
              onValueChange={(v) =>
                setFilters((prev) => ({ ...prev, provinceId: v, regionId: 'all', villageId: 'all', cooperativeId: 'all' }))
              }
            >
              <SelectTrigger className="h-9 w-[160px]">
                <SelectValue placeholder="Semua" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua provinsi</SelectItem>
                {provinceOptions.map((opt) => (
                  <SelectItem key={opt.id} value={opt.id}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground">Kab/Kota</span>
            <Select
              value={filters.regionId}
              onValueChange={(v) =>
                setFilters((prev) => ({ ...prev, regionId: v, villageId: 'all', cooperativeId: 'all' }))
              }
            >
              <SelectTrigger className="h-9 w-[160px]">
                <SelectValue placeholder="Semua" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua kab/kota</SelectItem>
                {regionOptions.map((opt) => (
                  <SelectItem key={opt.id} value={opt.id}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button
            size="icon"
            variant="outline"
            className="h-9 w-9"
            onClick={() =>
              setFilters({ provinceId: 'all', regionId: 'all', villageId: 'all', cooperativeId: 'all', commodityId: 'all' })
            }
            aria-label="Reset filter"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* KPI SECTION */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {[
          { label: 'Total Koperasi', value: snapshot.summary.cooperatives.toLocaleString('id-ID'), icon: Building2, tone: 'secondary' as const, sub: 'Unit terdata' },
          { label: 'Anggota Aktif', value: snapshot.summary.totalMembers.toLocaleString('id-ID'), icon: Users, tone: 'secondary' as const, sub: `Pertumbuhan ${formatPercent(snapshot.summary.memberGrowthPct)}` },
          { label: 'Pendapatan / Anggota', value: formatCompactCurrency(snapshot.summary.avgIncomeAfter), icon: Wallet, tone: 'tertiary' as const, sub: 'Rata-rata kesejahteraan' },
          { label: 'Omzet / Koperasi', value: formatCompactCurrency(snapshot.summary.avgMonthlyRevenue), icon: BarChart3, tone: 'tertiary' as const, sub: 'Produktivitas agregat' },
          { label: 'Rasio NPL', value: `${snapshot.summary.avgNpl.toFixed(1)}%`, icon: ShieldAlert, tone: 'primary' as const, sub: 'Tingkat risiko kredit' },
          { label: 'Skor Kesehatan', value: Math.round(snapshot.summary.overallScore), icon: HeartPulse, tone: 'secondary' as const, sub: 'Indeks stabilitas unit' },
        ].map((kpi, idx) => (
          <Card key={idx} className={cn('group', ACCENT_CLASS[kpi.tone])}>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <p className="metric-label">{kpi.label}</p>
                <kpi.icon className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-foreground" />
              </div>
              <CardTitle className="metric-value mt-1">{kpi.value}</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-xs text-muted-foreground">{kpi.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* MIDDLE SECTION */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <Card className={cn('lg:col-span-8', ACCENT_CLASS.secondary)}>
          <CardHeader>
            <CardTitle>Performa Pertumbuhan Anggota Nasional</CardTitle>
            <CardDescription>Tren akumulasi personel terverifikasi vs kapasitas produksi</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={snapshot.trend}>
                <defs>
                  <linearGradient id="colorMembers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--dashboard-secondary)" stopOpacity={0.18} />
                    <stop offset="95%" stopColor="var(--dashboard-secondary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip />
                <Area
                  name="Total anggota"
                  type="monotone"
                  dataKey="members"
                  stroke="var(--dashboard-secondary)"
                  strokeWidth={2.5}
                  fill="url(#colorMembers)"
                  isAnimationActive={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className={cn('lg:col-span-4', ACCENT_CLASS.tertiary)}>
          <CardHeader>
            <CardTitle>Segmentasi Kesehatan Portofolio</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative h-[140px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={portfolioHealthData} innerRadius={45} outerRadius={60} paddingAngle={5} dataKey="count">
                    {portfolioHealthData.map((item) => (
                      <Cell key={item.label} fill={item.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="metric-value">{portfolioTotal.toLocaleString('id-ID')}</span>
                <span className="text-xs text-muted-foreground">unit</span>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-1 gap-1.5">
              {portfolioHealthData.map((item) => (
                <div key={item.label} className="flex items-center justify-between border-b border-border py-2 last:border-b-0">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm text-foreground">{item.label}</span>
                  </div>
                  <span className="text-sm font-medium tabular-nums">{item.count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* TABLE SECTION */}
      <Card className={ACCENT_CLASS.primary}>
        <CardHeader>
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <CardTitle>Audit Kepatuhan Unit Kerja Nasional</CardTitle>
              <CardDescription>Monitor integritas data & rasio keuangan unit terpusat</CardDescription>
            </div>
            <Button size="sm" onClick={handleDownloadAuditPdf} disabled={isDownloadingAudit}>
              {isDownloadingAudit ? 'Menyiapkan…' : 'Ekspor laporan audit'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <DataTable
            data={snapshot.cooperativeComparisons}
            rowKey={(row) => row.id}
            onRowClick={handleAuditRowClick}
            pageSize={10}
            columns={auditColumns}
          />
        </CardContent>
      </Card>

      {/* AUDIT FEED */}
      <Card className={ACCENT_CLASS.secondary}>
        <CardHeader>
          <CardTitle>Umpan Audit & Monitoring Real-Time</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
            {snapshot.topAlerts.slice(0, 4).map((alert) => (
              <div
                key={alert.id}
                className={cn(
                  'surface-card-muted card-accent group p-4 transition-colors',
                  alert.severity === 'critical' ? 'card-accent-danger' : 'card-accent-warning',
                )}
              >
                <div className="flex items-start gap-3">
                  <div className={cn('mt-0.5 rounded-md p-2', severityAlertClass(alert.severity))}>
                    <AlertTriangle className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex items-center justify-between gap-2">
                      <p className="truncate text-sm font-semibold text-foreground">{alert.title}</p>
                      <span className="whitespace-nowrap text-xs text-muted-foreground">Aktif</span>
                    </div>
                    <p className="line-clamp-2 text-xs leading-snug text-muted-foreground">{alert.message}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        {alert.scopeLabel}
                      </Badge>
                      <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <AuditDetailDialog cooperative={selectedCooperative} open={isAuditDialogOpen} onOpenChange={setIsAuditDialogOpen} />
    </div>
  )
}
