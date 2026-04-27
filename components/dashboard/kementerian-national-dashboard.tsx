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
  healthy: '#10b981',
  warning: '#f59e0b',
  critical: '#ef4444',
} as const

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

  const severityAlertClass = (s: AlertSeverity) => s === 'critical' ? 'border-rose-100 bg-rose-50/50 text-rose-900' : 'border-amber-100 bg-amber-50/50 text-amber-900'

  return (
    <div className="flex min-h-screen flex-col gap-4 bg-slate-50 p-4 lg:p-5">
      {/* HEADER SECTION */}
      <div className="flex flex-col justify-between gap-4 rounded-none border border-slate-200 bg-white p-4 shadow-sm md:flex-row md:items-center">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Pusat Komando Kementerian</h1>
            <Badge variant="outline" className="border-emerald-500 bg-emerald-50 px-2 py-0 text-[10px] font-black uppercase tracking-widest text-emerald-700">Live</Badge>
          </div>
          <p className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
            <RefreshCw className="h-3 w-3 animate-spin-slow" />
            DATA TERPUSAT: {snapshot.scopeLabel.toUpperCase()} | SINKRONISASI {minutesSinceSync} MENIT LALU
          </p>
        </div>
        
        <div className="flex flex-wrap items-center gap-1.5 rounded-none border border-slate-200 bg-white p-1.5 shadow-sm">
          <div className="flex items-center gap-1.5 border-r border-slate-200 px-3">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Provinsi</span>
            <Select value={filters.provinceId} onValueChange={(v) => setFilters(prev => ({...prev, provinceId: v, regionId: 'all', villageId: 'all', cooperativeId: 'all'}))}>
              <SelectTrigger className="h-8 w-[140px] border-none bg-transparent px-0 text-[11px] font-black uppercase tracking-tight shadow-none rounded-none">
                <SelectValue placeholder="SEMUA" />
              </SelectTrigger>
              <SelectContent className="rounded-none">
                <SelectItem value="all" className="text-[10px] font-black uppercase tracking-widest">SEMUA</SelectItem>
                {provinceOptions.map(opt => <SelectItem key={opt.id} value={opt.id} className="text-[10px] font-black uppercase tracking-widest">{opt.label.toUpperCase()}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-1.5 px-3">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Kab/Kota</span>
            <Select value={filters.regionId} onValueChange={(v) => setFilters(prev => ({...prev, regionId: v, villageId: 'all', cooperativeId: 'all'}))}>
              <SelectTrigger className="h-8 w-[140px] border-none bg-transparent px-0 text-[11px] font-black uppercase tracking-tight shadow-none rounded-none">
                <SelectValue placeholder="SEMUA" />
              </SelectTrigger>
              <SelectContent className="rounded-none">
                <SelectItem value="all" className="text-[10px] font-black uppercase tracking-widest">SEMUA</SelectItem>
                {regionOptions.map(opt => <SelectItem key={opt.id} value={opt.id} className="text-[10px] font-black uppercase tracking-widest">{opt.label.toUpperCase()}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <Button 
            size="sm" 
            variant="ghost" 
            className="h-8 w-8 p-0 hover:bg-slate-100 rounded-none border-l border-slate-200"
            onClick={() => setFilters({provinceId: 'all', regionId: 'all', villageId: 'all', cooperativeId: 'all', commodityId: 'all'})}
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* KPI SECTION */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
        {[
          { label: 'Total Koperasi', value: snapshot.summary.cooperatives.toLocaleString('id-ID'), icon: Building2, trend: '+12', tone: 'secondary', sub: 'UNIT TERDATA' },
          { label: 'Anggota Aktif', value: snapshot.summary.totalMembers.toLocaleString('id-ID'), icon: Users, trend: formatPercent(snapshot.summary.memberGrowthPct), tone: 'secondary', sub: 'PERSONEL KYC' },
          { label: 'Pendapatan / Anggota', value: formatCompactCurrency(snapshot.summary.avgIncomeAfter), icon: Wallet, trend: '+14%', tone: 'tertiary', sub: 'RATA-RATA KESEJAHTERAAN' },
          { label: 'Omzet / Koperasi', value: formatCompactCurrency(snapshot.summary.avgMonthlyRevenue), icon: BarChart3, trend: '+8.2%', tone: 'tertiary', sub: 'PRODUKTIVITAS AGREGAT' },
          { label: 'Rasio NPL', value: snapshot.summary.avgNpl.toFixed(1) + '%', icon: ShieldAlert, trend: '-0.2%', tone: 'primary', sub: 'TINGKAT RISIKO KREDIT' },
          { label: 'Skor Kesehatan', value: Math.round(snapshot.summary.overallScore), icon: HeartPulse, trend: 'Optimal', tone: 'secondary', sub: 'INDEX STABILITAS UNIT' },
        ].map((kpi, idx) => (
          <Card key={idx} className="rounded-none border-none bg-white shadow-sm overflow-hidden group border-t-4 border-t-slate-900">
            <CardHeader className="p-4 pb-2">
              <div className="flex justify-between items-start">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-none">{kpi.label}</p>
                <kpi.icon className="h-4 w-4 text-slate-300 group-hover:text-slate-900 transition-colors" />
              </div>
              <CardTitle className="text-2xl font-black text-slate-900 mt-2 leading-none uppercase">{kpi.value}</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="text-[9px] font-black text-slate-500 mt-1.5 uppercase tracking-tighter leading-none">{kpi.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* MIDDLE SECTION */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <Card className="rounded-none border-none shadow-sm lg:col-span-8 overflow-hidden border-t-4 border-t-slate-900 bg-white">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100">
            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-slate-900">Performa Pertumbuhan Anggota Nasional</CardTitle>
            <CardDescription className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">Tren Akumulasi Personel Terverifikasi vs Kapasitas Produksi</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] p-6">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={snapshot.trend}>
                <defs>
                  <linearGradient id="colorMembers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0f172a" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#0f172a" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" fontSize={10} axisLine={false} tickLine={false} tick={{ fontSize: 9, fontWeight: 900, fill: '#64748b' }} />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ borderRadius: '0', border: '1px solid #e2e8f0', boxShadow: 'none', fontSize: '9px', fontWeight: '900', textTransform: 'uppercase', letterSpacing: '0.05em' }} 
                  labelStyle={{ color: '#94a3b8', marginBottom: '4px' }}
                />
                <Area name="TOTAL ANGGOTA" type="monotone" dataKey="members" stroke="#0f172a" strokeWidth={3} fill="url(#colorMembers)" isAnimationActive={false} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="lg:col-span-4 flex flex-col gap-4">
          <Card className="rounded-none border-none shadow-sm flex-1 border-t-4 border-t-slate-900 bg-white">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100">
              <CardTitle className="text-[10px] font-black uppercase tracking-widest text-slate-900">Segmentasi Kesehatan Portofolio</CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="h-[140px] w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={portfolioHealthData} innerRadius={45} outerRadius={60} paddingAngle={5} dataKey="count">
                      {portfolioHealthData.map((item) => <Cell key={item.label} fill={item.color} />)}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-xl font-black text-slate-900 leading-none">{portfolioTotal.toLocaleString('id-ID')}</span>
                  <span className="text-[9px] font-black text-slate-400 uppercase mt-1">UNIT</span>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-1.5 mt-4">
                {portfolioHealthData.map((item) => (
                  <div key={item.label} className="flex items-center justify-between border-b border-slate-50 py-2">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-2 rounded-none" style={{ backgroundColor: item.color }} />
                      <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{item.label}</span>
                    </div>
                    <span className="text-[10px] font-black text-slate-900 uppercase">{item.count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* TABLE SECTION */}
      <Card className="rounded-none border-none shadow-sm overflow-hidden border-t-4 border-t-slate-900 bg-white">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100 px-6 py-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-[10px] font-black uppercase tracking-widest text-slate-900">Audit Kepatuhan Unit Kerja Nasional</CardTitle>
              <CardDescription className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">Monitor Integritas Data & Rasio Keuangan Unit Terpusat</CardDescription>
            </div>
            <Button size="sm" className="rounded-none bg-slate-900 hover:bg-slate-800 text-white font-black text-[10px] uppercase tracking-widest h-9 px-6 shadow-xl" onClick={handleDownloadAuditPdf}>
              EKSPOR LAPORAN AUDIT NASIONAL
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-50 transition-none">
                <TableRow className="border-none">
                  <TableHead className="text-[10px] font-black uppercase tracking-widest h-12 px-6">Unit Koperasi</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-center h-12 px-6">Status Kesehatan</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-right h-12 px-6">Total Anggota</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-right h-12 px-6">Pendapatan / Personel</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-right h-12 px-6">Rasio NPL</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest text-right h-12 px-6">Skor Audit</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {snapshot.cooperativeComparisons.slice(0, 10).map((row) => (
                  <TableRow
                    key={row.id}
                    onClick={() => handleAuditRowClick(row)}
                    className="cursor-pointer hover:bg-slate-50 transition-colors border-b border-slate-50"
                  >
                    <TableCell className="px-6 py-4">
                      <p className="text-[11px] font-black text-slate-900 uppercase leading-none">{row.label}</p>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">{row.village}, {row.region}</p>
                    </TableCell>
                    <TableCell className="text-center px-6 py-4">
                      <Badge className={`rounded-none border-none shadow-none text-[9px] font-black uppercase tracking-widest px-2 h-5 ${
                        row.overallHealth === 'good' ? 'bg-emerald-100 text-emerald-700' : row.overallHealth === 'warning' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'
                      }`}>
                        {row.overallHealth === 'good' ? 'SEHAT' : row.overallHealth === 'warning' ? 'WASPADA' : 'KRITIS'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right px-6 py-4 text-[11px] font-black text-slate-900">{row.totalMembers.toLocaleString('id-ID')}</TableCell>
                    <TableCell className="text-right px-6 py-4 text-[11px] font-black text-slate-900">{formatCompactCurrency(row.avgIncomeAfter)}</TableCell>
                    <TableCell className={`text-right px-6 py-4 text-[11px] font-black ${row.avgNpl > 5 ? 'text-rose-600' : row.avgNpl > 3 ? 'text-amber-600' : 'text-emerald-600'}`}>{row.avgNpl.toFixed(1)}%</TableCell>
                    <TableCell className="text-right px-6 py-4 text-[11px] font-black text-slate-900">{Math.round(row.overallScore)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* HORIZONTAL AUDIT FEED AT BOTTOM */}
      <Card className="rounded-none border-none shadow-sm overflow-hidden border-t-4 border-t-slate-900 bg-white">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100 px-6 py-4">
          <CardTitle className="text-[10px] font-black uppercase tracking-widest text-slate-900">UMPAN AUDIT & MONITORING REAL-TIME</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 divide-x divide-slate-50">
            {snapshot.topAlerts.slice(0, 4).map((alert) => (
              <div key={alert.id} className="group p-5 transition-colors hover:bg-slate-50 relative overflow-hidden">
                <div className={`absolute left-0 top-0 h-full w-1 ${alert.severity === 'critical' ? 'bg-rose-500' : 'bg-amber-500'}`} />
                <div className="flex items-start gap-4">
                  <div className={`mt-0.5 rounded-none p-2 shadow-sm ${severityAlertClass(alert.severity)}`}>
                    <AlertTriangle className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <p className="truncate text-[10px] font-black text-slate-900 uppercase tracking-tight">{alert.title}</p>
                      <span className="whitespace-nowrap text-[8px] font-black text-slate-400 uppercase">AKTIF</span>
                    </div>
                    <p className="text-[10px] font-bold leading-tight text-slate-500 uppercase tracking-tighter line-clamp-2">{alert.message}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <Badge className="rounded-none border-none bg-slate-100 text-[8px] font-black text-slate-500 uppercase px-1.5 py-0.5">{alert.scopeLabel.toUpperCase()}</Badge>
                      <Button variant="ghost" size="icon" className="h-5 w-5 p-0 hover:bg-slate-200 rounded-none">
                        <ChevronRight className="h-3 w-3 text-slate-400" />
                      </Button>
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
