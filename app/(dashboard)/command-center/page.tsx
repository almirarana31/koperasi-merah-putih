"use client"

import Link from "next/link"
import { useEffect, useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import {
  Download,
  FileText,
  TrendingUp,
  TrendingDown,
  Package,
  ShoppingCart,
  Truck,
  DollarSign,
  Users,
  AlertTriangle,
  CheckCircle,
  Activity,
  MapPin,
  RefreshCw,
  Globe,
  LayoutDashboard,
  ShieldAlert,
} from "lucide-react"
import { exportToPDF } from "@/lib/pdf-export"
import { toast } from "sonner"
import { useAuth } from "@/lib/auth/use-auth"
import { KementerianFilterBar } from "@/components/dashboard/kementerian-filter-bar"
import { ScopeFilters } from "@/lib/kementerian-dashboard-data"
import { canAccessRoute, canExport } from "@/lib/rbac"

// Enhanced Mock Data for Cross-Entity Monitoring
const initialProductionData = [
  { month: "Jan", beras: 120, sayur: 45, buah: 30, region: "Nasional" },
  { month: "Feb", beras: 135, sayur: 52, buah: 35, region: "Nasional" },
  { month: "Mar", beras: 150, sayur: 48, buah: 38, region: "Nasional" },
  { month: "Apr", beras: 145, sayur: 55, buah: 42, region: "Nasional" },
  { month: "Mei", beras: 160, sayur: 60, buah: 45, region: "Nasional" },
  { month: "Jun", beras: 155, sayur: 58, buah: 48, region: "Nasional" },
]

const initialLogs = [
  { time: "14:20:05", role: "SYSADMIN", action: "Database Scaling Event", status: "success", entity: "Data Center" },
  { time: "14:18:22", role: "KEMENTERIAN", action: "NPL Audit: Koperasi Maju Jaya", status: "warning", entity: "Jawa Barat" },
  { time: "14:15:10", role: "BANK", action: "Credit Scoring Generated (Batch 42)", status: "success", entity: "Bali" },
  { time: "14:10:45", role: "KASIR", action: "Large Transaction Alert (>Rp 100M)", status: "info", entity: "Sumatera Utara" },
]

const toTitleCase = (value: string) =>
  value
    .toLowerCase()
    .replace(/[_-]+/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

export default function ExecutiveCommandCenterPage() {
  const { user } = useAuth()
  const role = user?.role
  
  const [filters, setFilters] = useState<ScopeFilters>({
    provinceId: 'all',
    regionId: 'all',
    villageId: 'all',
    cooperativeId: 'all',
    commodityId: 'all',
  })

  const [activeView, setActiveView] = useState<"war-room" | "monitoring" | "audit">("war-room")
  const [isExporting, setIsExporting] = useState(false)
  const [logs, setLogs] = useState(initialLogs)
  const scopeLabel = filters.provinceId === 'all' ? 'National Scope' : `Regional Scope: ${toTitleCase(filters.provinceId)}`
  const canExportPdf = role ? canExport(role, 'pdf') : false
  const canViewRouteDetails = role ? canAccessRoute(role, '/logistik/rute') : false
  const canOpenAuditConsole = role ? canAccessRoute(role, '/assistant') : false
  const showMonitoringPanels = activeView !== 'audit'
  const showAuditPanels = activeView !== 'monitoring'

  // Dynamic Data Calculation based on Filters
  const productionData = useMemo(() => {
    // In a real app, this would be an API call with filters
    // For now, we simulate scaling the values based on scope
    const scale = filters.provinceId === 'all' ? 1 : filters.regionId === 'all' ? 0.3 : 0.1
    return initialProductionData.map(d => ({
      ...d,
      beras: Math.round(d.beras * scale),
      sayur: Math.round(d.sayur * scale),
      buah: Math.round(d.buah * scale),
    }))
  }, [filters])

  const totals = useMemo(() => {
    const scale = filters.provinceId === 'all' ? 1 : filters.regionId === 'all' ? 0.3 : 0.1
    return {
      inflow: 538090000 * scale,
      outflow: 126870000 * scale,
      net: 411220000 * scale,
      activeUnits: Math.round(1248 * scale),
      totalMembers: Math.round(45280 * scale)
    }
  }, [filters])

  useEffect(() => {
    const actions = [
      { role: "PETANI", action: "Harvest Report Uploaded", status: "success", entity: "Jawa Timur" },
      { role: "LOGISTIK", action: "Route Optimized", status: "success", entity: "Sulawesi" },
      { role: "BANK", action: "NPL Alert Detected", status: "warning", entity: "Kalimantan" },
      { role: "KEMENTERIAN", action: "Policy Update Broadcast", status: "info", entity: "Nasional" },
    ]

    const intervalId = setInterval(() => {
      const randomAction = actions[Math.floor(Math.random() * actions.length)]
      const newLog = {
        time: new Date().toLocaleTimeString("id-ID"),
        ...randomAction
      }
      setLogs(prev => [newLog, ...prev].slice(0, 12))
    }, 5000)

    return () => clearInterval(intervalId)
  }, [])

  const handleExportPDF = async () => {
    if (!canExportPdf) return

    setIsExporting(true)
    toast.info(`Generating Audit Report For ${scopeLabel}...`)

    const result = await exportToPDF({
      title: 'Executive Audit Report',
      subtitle: scopeLabel,
      filename: `executive-audit-${Date.now()}.pdf`,
      orientation: 'landscape',
      data: logs.map((log) => ({
        Time: log.time,
        User: toTitleCase(log.role),
        Action: log.action,
        Status: toTitleCase(log.status),
        Entity: log.entity,
      })),
    })

    if (result.success) {
      toast.success("Executive Audit PDF Generated Successfully.")
    } else {
      toast.error(result.error ?? "Executive Audit PDF Failed To Generate.")
    }

    setIsExporting(false)
  }

  const handleDownloadGlobalReport = async () => {
    if (!canExportPdf) return

    setIsExporting(true)
    toast.info(`Compiling Global Report For ${scopeLabel}...`)

    const summaryRows = [
      { Section: 'Summary', Metric: 'Active Units', Value: totals.activeUnits.toLocaleString('id-ID') },
      { Section: 'Summary', Metric: 'Total Members', Value: totals.totalMembers.toLocaleString('id-ID') },
      { Section: 'Summary', Metric: 'Inflow', Value: `Rp ${(totals.inflow / 1000000).toFixed(1)} JT` },
      { Section: 'Summary', Metric: 'Outflow', Value: `Rp ${(totals.outflow / 1000000).toFixed(1)} JT` },
      { Section: 'Summary', Metric: 'Net Position', Value: `Rp ${(totals.net / 1000000).toFixed(1)} JT` },
      ...productionData.map((row) => ({
        Section: 'Production Trend',
        Metric: row.month,
        Value: `Beras ${row.beras}T | Sayur ${row.sayur}T | Buah ${row.buah}T`,
      })),
    ]

    const result = await exportToPDF({
      title: 'Global Performance Report',
      subtitle: scopeLabel,
      filename: `global-report-${Date.now()}.pdf`,
      orientation: 'landscape',
      data: summaryRows,
    })

    if (result.success) {
      toast.success("Global Report Downloaded Successfully.")
    } else {
      toast.error(result.error ?? "Global Report Failed To Generate.")
    }

    setIsExporting(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--dashboard-secondary-border)] bg-white shadow-[0_12px_28px_-18px_rgba(137,114,111,0.24)]">
              <ShieldAlert className="h-5 w-5 text-[var(--dashboard-primary)]" />
            </div>
            <div>
              <h1 className="text-2xl font-semibold text-slate-900">Executive Command Center</h1>
              <p className="mt-1 text-xs font-medium text-slate-500">
                Real-Time Cross-Entity Visibility Hub | {scopeLabel}
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
           <div className="flex rounded-xl border border-[var(--dashboard-secondary-border)] bg-white p-1 shadow-sm">
            <Button 
              size="sm" 
              variant={activeView === 'war-room' ? 'default' : 'ghost'} 
              onClick={() => setActiveView('war-room')}
              className={`h-8 rounded-lg px-4 text-xs font-semibold transition-all ${activeView === 'war-room' ? 'bg-[var(--dashboard-primary)] text-white shadow-sm' : 'text-[var(--dashboard-secondary)] hover:bg-[var(--dashboard-secondary-muted)]'}`}
            >
              War Room
            </Button>
            <Button 
              size="sm" 
              variant={activeView === 'monitoring' ? 'default' : 'ghost'} 
              onClick={() => setActiveView('monitoring')}
              className={`h-8 rounded-lg px-4 text-xs font-semibold transition-all ${activeView === 'monitoring' ? 'bg-[var(--dashboard-primary)] text-white shadow-sm' : 'text-[var(--dashboard-secondary)] hover:bg-[var(--dashboard-secondary-muted)]'}`}
            >
              Monitoring
            </Button>
            <Button 
              size="sm" 
              variant={activeView === 'audit' ? 'default' : 'ghost'} 
              onClick={() => setActiveView('audit')}
              className={`h-8 rounded-lg px-4 text-xs font-semibold transition-all ${activeView === 'audit' ? 'bg-[var(--dashboard-primary)] text-white shadow-sm' : 'text-[var(--dashboard-secondary)] hover:bg-[var(--dashboard-secondary-muted)]'}`}
            >
              Audit Log
            </Button>
          </div>
          {canExportPdf && (
            <Button onClick={handleExportPDF} variant="outline" size="sm" className="h-10 border-[var(--dashboard-secondary-border)] bg-white text-xs font-semibold text-[var(--dashboard-secondary)] hover:bg-[var(--dashboard-secondary-muted)]" disabled={isExporting}>
              <FileText className="mr-2 h-4 w-4 text-[var(--dashboard-primary)]" />
              Export Audit PDF
            </Button>
          )}
          {canExportPdf && (
            <Button onClick={handleDownloadGlobalReport} size="sm" className="h-10 bg-[var(--dashboard-primary)] px-6 text-xs font-semibold text-white shadow-[0_10px_24px_-12px_rgba(190,24,93,0.35)] hover:bg-[var(--dashboard-primary-hover)]" disabled={isExporting}>
              <Download className="h-4 w-4 mr-2" />
              Global Report
            </Button>
          )}
        </div>
      </div>

      {/* Kementerian Hierarchical Filter Bar */}
      <KementerianFilterBar filters={filters} setFilters={setFilters} />

      {/* Real-time Status Banner */}
      <Card className="surface-card-strong relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5">
          <Globe className="h-24 w-24 text-[var(--dashboard-primary)]" />
        </div>
        <CardContent className="p-4 relative">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2.5">
                <div className="h-2 w-2 rounded-full bg-[var(--dashboard-tertiary)] animate-ping"></div>
                <div className="absolute h-2 w-2 rounded-full bg-[var(--dashboard-tertiary)]"></div>
                <span className="text-xs font-semibold text-slate-900">System Active</span>
              </div>
              <div className="h-8 w-px bg-slate-200" />
              <div className="flex flex-col">
                <span className="text-xs font-medium text-slate-500">Coverage</span>
                <span className="text-xs font-semibold text-slate-900">{totals.activeUnits.toLocaleString()} Active Units</span>
              </div>
              <div className="flex flex-col">
                <span className="text-xs font-medium text-slate-500">Population</span>
                <span className="text-xs font-semibold text-slate-900">{totals.totalMembers.toLocaleString()} Members Synced</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="h-6 border-[var(--dashboard-tertiary)]/15 bg-[var(--dashboard-tertiary)]/10 text-xs font-semibold text-[var(--dashboard-tertiary)]">99.9% Uptime</Badge>
              <span className="text-xs font-medium text-slate-500">Last Update: {new Date().toLocaleTimeString("id-ID")}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <div className={`grid gap-6 ${showMonitoringPanels && showAuditPanels ? 'xl:grid-cols-[minmax(0,1.22fr)_minmax(360px,0.88fr)]' : 'grid-cols-1'}`}>
        {showMonitoringPanels && (
        <div className="space-y-6">
          {/* Main Monitoring Panels */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Production Aggregation */}
            <Card className="surface-card-strong overflow-hidden">
              <CardHeader className="dashboard-section-header p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-[var(--dashboard-secondary)]" />
                    <CardTitle className="text-xs font-semibold text-slate-900">Agregasi Produksi</CardTitle>
                  </div>
                  <Badge className="border-none bg-[var(--dashboard-tertiary)]/10 text-xs font-semibold text-[var(--dashboard-tertiary)]">+12.4% Volume</Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={productionData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="month" fontSize={9} fontWeight={900} axisLine={false} tickLine={false} />
                      <YAxis fontSize={9} fontWeight={900} axisLine={false} tickLine={false} />
                      <Tooltip
                        contentStyle={{ borderRadius: '10px', border: '1px solid var(--dashboard-secondary-border)', boxShadow: '0 16px 28px -22px rgba(137,114,111,0.3)', fontSize: '11px', fontWeight: 600 }}
                      />
                      <Bar dataKey="beras" fill="var(--dashboard-secondary)" name="Beras (T)" radius={[2, 2, 0, 0]} />
                      <Bar dataKey="sayur" fill="var(--dashboard-primary)" name="Sayur (T)" radius={[2, 2, 0, 0]} />
                      <Bar dataKey="buah" fill="var(--dashboard-tertiary)" name="Buah (T)" radius={[2, 2, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Financial Health Matrix */}
            <Card className="surface-card-strong overflow-hidden">
              <CardHeader className="dashboard-section-header p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-[var(--dashboard-primary)]" />
                    <CardTitle className="text-xs font-semibold text-slate-900">Likuiditas Keuangan</CardTitle>
                  </div>
                  <Badge className="border-none bg-[var(--dashboard-primary)]/10 text-xs font-semibold text-[var(--dashboard-primary)]">Live Flow</Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                {[
                  { label: 'Inflow Nasional', val: totals.inflow, tone: 'secondary', trend: '+18%' },
                  { label: 'Outflow Operasional', val: totals.outflow, tone: 'rose', trend: '+4.2%' },
                  { label: 'Saldo Bersih', val: totals.net, tone: 'tertiary', trend: 'Stabil' },
                ].map((item, i) => (
                  <div key={i} className="dashboard-inner-surface flex items-center justify-between p-4">
                    <div>
                      <p className="text-xs font-semibold text-slate-500">{item.label}</p>
                      <p className={`mt-1 text-lg font-semibold ${item.tone === 'rose' ? 'text-[var(--dashboard-primary)]' : item.tone === 'secondary' ? 'text-[var(--dashboard-secondary)]' : 'text-[var(--dashboard-tertiary)]'}`}>
                        Rp {(item.val / 1000000).toFixed(1)} JT
                      </p>
                    </div>
                    <Badge variant="outline" className={`text-xs font-semibold ${item.tone === 'rose' ? 'border-[var(--dashboard-primary)]/15 text-[var(--dashboard-primary)]' : item.tone === 'secondary' ? 'border-[var(--dashboard-secondary)]/15 text-[var(--dashboard-secondary)]' : 'border-[var(--dashboard-tertiary)]/20 text-[var(--dashboard-tertiary)]'}`}>
                      {item.trend}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Regional Performance Heatmap */}
          <Card className="surface-card-strong overflow-hidden">
             <CardHeader className="dashboard-section-header p-4">
               <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xs font-semibold text-slate-900">Distribusi & Logistik Nasional</CardTitle>
                    <CardDescription className="text-xs font-medium text-slate-500">Monitoring pengiriman lintas provinsi</CardDescription>
                  </div>
                  {canViewRouteDetails && (
                    <Button size="sm" variant="outline" className="h-8 border-[var(--dashboard-secondary-border)] bg-white text-xs font-semibold text-[var(--dashboard-secondary)] hover:bg-[var(--dashboard-secondary-muted)]" asChild>
                      <Link href="/logistik/rute">Detail Rute</Link>
                    </Button>
                  )}
               </div>
             </CardHeader>
             <CardContent className="p-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[
                  { region: 'Jawa Barat', load: 85, status: 'On-Time', color: 'bg-[var(--dashboard-tertiary)]' },
                  { region: 'Jawa Timur', load: 72, status: 'Delayed', color: 'bg-amber-500' },
                  { region: 'Sulawesi', load: 45, status: 'On-Time', color: 'bg-[var(--dashboard-tertiary)]' },
                  { region: 'Sumatera Utara', load: 60, status: 'Delayed', color: 'bg-rose-500' },
                  { region: 'Bali', load: 92, status: 'On-Time', color: 'bg-[var(--dashboard-tertiary)]' },
                  { region: 'Kalimantan', load: 38, status: 'On-Time', color: 'bg-[var(--dashboard-tertiary)]' },
                ].map((reg, i) => (
                  <div key={i} className="dashboard-inner-surface group p-4 transition-all hover:border-[var(--dashboard-secondary)]/30">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-semibold text-slate-900">{reg.region}</span>
                      <div className={`h-2 w-2 rounded-full ${reg.color}`} />
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs font-semibold text-slate-500">
                        <span>Load</span>
                        <span>{reg.load}%</span>
                      </div>
                      <Progress value={reg.load} className="h-1 bg-slate-100" />
                      <p className={`mt-2 text-xs font-semibold ${reg.status === 'On-Time' ? 'text-[var(--dashboard-tertiary)]' : 'text-[var(--dashboard-primary)]'}`}>{reg.status}</p>
                    </div>
                  </div>
                ))}
             </CardContent>
          </Card>
        </div>
        )}

        {/* War Room Side Panel */}
        {showAuditPanels && (
        <div className="space-y-6">
          <Card className="surface-card-strong flex min-h-[440px] flex-col overflow-hidden">
            <CardHeader className="dashboard-section-header p-5">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                  <Activity className="h-4 w-4 text-[var(--dashboard-primary)]" /> Live Audit Feed
                </CardTitle>
                <div className="flex items-center gap-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-[var(--dashboard-primary)] animate-pulse" />
                  <span className="text-xs font-semibold text-[var(--dashboard-primary)]">Streaming</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0 flex-1 overflow-y-auto scrollbar-hide">
              <div className="divide-y divide-slate-100">
                {logs.map((log, i) => (
                  <div key={i} className="group cursor-pointer bg-[var(--dashboard-surface)] p-5 transition-colors hover:bg-[var(--dashboard-surface-muted)]">
                    <div className="flex items-center justify-between mb-2">
                      <Badge className={`h-4 rounded border-none px-1.5 text-xs font-semibold ${
                        log.status === 'success' ? 'bg-emerald-50 text-emerald-700' :
                        log.status === 'warning' ? 'bg-amber-50 text-amber-700' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {toTitleCase(log.status)}
                      </Badge>
                      <span className="text-xs font-mono text-slate-400">{log.time}</span>
                    </div>
                    <p className="text-sm font-semibold leading-tight text-slate-900 transition-colors group-hover:text-[var(--dashboard-primary)]">{log.action}</p>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-xs font-medium text-slate-500">User: {toTitleCase(log.role)}</p>
                      <p className="text-xs font-medium text-slate-400">{log.entity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <div className="border-t border-[var(--dashboard-secondary-border)] bg-white p-4">
              {canOpenAuditConsole && (
                <Button variant="ghost" className="h-10 w-full text-xs font-semibold text-slate-600 hover:bg-white hover:text-[var(--dashboard-primary)]" asChild>
                  <Link href="/assistant">Buka Konsol Audit Lengkap</Link>
                </Button>
              )}
            </div>
          </Card>
        </div>
        )}
        </div>

        {showAuditPanels && (
          <Card className="surface-card-strong overflow-hidden">
            <CardHeader className="dashboard-section-header p-4">
              <div className="flex flex-col gap-1.5 md:flex-row md:items-center md:justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-sm font-semibold text-rose-900">
                    <AlertTriangle className="h-3.5 w-3.5" /> High-Impact Risks
                  </CardTitle>
                  <CardDescription className="text-xs text-slate-500">
                    Strategic risks that need executive attention across the national network.
                  </CardDescription>
                </div>
                <Badge variant="outline" className="h-6 w-fit border-rose-200 bg-rose-50 text-xs font-semibold text-rose-700">
                  3 Active Risks
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="grid gap-4 p-4 md:grid-cols-2 xl:grid-cols-3">
              {[
                { label: 'Volatilitas Harga Jagung', scope: 'Lampung', impact: 'High', note: 'Harga bergerak 18% di atas baseline mingguan.' },
                { label: 'Logistik Terhambat', scope: 'Sumatera', impact: 'Medium', note: 'Lead time distribusi naik 9 jam pada koridor utama.' },
                { label: 'Anomali Kredit Baru', scope: 'Nasional', impact: 'Low', note: 'Pola approval baru perlu verifikasi tambahan batch ini.' },
              ].map((risk, i) => (
                <div key={i} className="dashboard-inner-surface flex h-full items-start justify-between gap-4 p-4">
                  <div className="space-y-1.5">
                    <p className="text-sm font-semibold text-slate-900">{risk.label}</p>
                    <p className="text-xs font-medium text-slate-500">{risk.scope}</p>
                    <p className="text-xs leading-relaxed text-slate-500">{risk.note}</p>
                  </div>
                  <Badge variant="outline" className={`shrink-0 text-xs font-semibold ${risk.impact === 'High' ? 'border-rose-200 bg-rose-50 text-rose-700' : risk.impact === 'Medium' ? 'border-amber-200 bg-amber-50 text-amber-700' : 'border-slate-200 bg-slate-50 text-slate-600'}`}>
                    {risk.impact}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

