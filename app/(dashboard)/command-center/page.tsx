"use client"

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

// Enhanced Mock Data for Cross-Entity Monitoring
const initialProductionData = [
  { month: "Jan", beras: 120, sayur: 45, buah: 30, region: "NASIONAL" },
  { month: "Feb", beras: 135, sayur: 52, buah: 35, region: "NASIONAL" },
  { month: "Mar", beras: 150, sayur: 48, buah: 38, region: "NASIONAL" },
  { month: "Apr", beras: 145, sayur: 55, buah: 42, region: "NASIONAL" },
  { month: "Mei", beras: 160, sayur: 60, buah: 45, region: "NASIONAL" },
  { month: "Jun", beras: 155, sayur: 58, buah: 48, region: "NASIONAL" },
]

const initialLogs = [
  { time: "14:20:05", role: "SYSADMIN", action: "Database scaling event", status: "success", entity: "Data Center" },
  { time: "14:18:22", role: "KEMENTERIAN", action: "NPL Audit: Koperasi Maju Jaya", status: "warning", entity: "Jawa Barat" },
  { time: "14:15:10", role: "BANK", action: "Credit Scoring generated (Batch 42)", status: "success", entity: "Bali" },
  { time: "14:10:45", role: "KASIR", action: "Large transaction alert (>Rp 100M)", status: "info", entity: "Sumatera Utara" },
]

export default function ExecutiveCommandCenterPage() {
  const { user } = useAuth()
  const isKementerian = user?.role === 'kementerian'
  
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
      { role: "PETANI", action: "Harvest report uploaded", status: "success", entity: "Jawa Timur" },
      { role: "LOGISTIK", action: "Route optimized", status: "success", entity: "Sulawesi" },
      { role: "BANK", action: "NPL Alert detected", status: "warning", entity: "Kalimantan" },
      { role: "KEMENTERIAN", action: "Policy update broadcasted", status: "info", entity: "Nasional" },
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
    setIsExporting(true)
    toast.info(`Generating Audit Report for ${filters.provinceId.toUpperCase()}...`)
    await new Promise(r => setTimeout(r, 2000))
    toast.success("Executive Audit PDF generated successfully.")
    setIsExporting(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--dashboard-secondary)] shadow-[0_12px_28px_-18px_rgba(69,90,100,0.7)]">
              <ShieldAlert className="h-6 w-6 text-[var(--dashboard-tertiary)]" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-slate-900 uppercase">Executive Command Center</h1>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
                Real-time Cross-Entity Visibility Hub • {filters.provinceId === 'all' ? 'National Scope' : `Regional: ${filters.provinceId}`}
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
           <div className="flex rounded-xl border border-[var(--dashboard-secondary)]/12 bg-white p-1 shadow-sm">
            <Button 
              size="sm" 
              variant={activeView === 'war-room' ? 'default' : 'ghost'} 
              onClick={() => setActiveView('war-room')}
              className={`h-8 rounded-lg px-4 text-[9px] font-black uppercase transition-all ${activeView === 'war-room' ? 'bg-[var(--dashboard-primary)] text-white shadow-sm' : 'text-[var(--dashboard-secondary)] hover:bg-[var(--dashboard-neutral)]'}`}
            >
              War Room
            </Button>
            <Button 
              size="sm" 
              variant={activeView === 'monitoring' ? 'default' : 'ghost'} 
              onClick={() => setActiveView('monitoring')}
              className={`h-8 rounded-lg px-4 text-[9px] font-black uppercase transition-all ${activeView === 'monitoring' ? 'bg-[var(--dashboard-primary)] text-white shadow-sm' : 'text-[var(--dashboard-secondary)] hover:bg-[var(--dashboard-neutral)]'}`}
            >
              Monitoring
            </Button>
            <Button 
              size="sm" 
              variant={activeView === 'audit' ? 'default' : 'ghost'} 
              onClick={() => setActiveView('audit')}
              className={`h-8 rounded-lg px-4 text-[9px] font-black uppercase transition-all ${activeView === 'audit' ? 'bg-[var(--dashboard-primary)] text-white shadow-sm' : 'text-[var(--dashboard-secondary)] hover:bg-[var(--dashboard-neutral)]'}`}
            >
              Audit Log
            </Button>
          </div>
          <Button onClick={handleExportPDF} variant="outline" size="sm" className="h-10 border-[var(--dashboard-secondary)]/18 text-[10px] font-black uppercase tracking-widest text-[var(--dashboard-secondary)]" disabled={isExporting}>
            <FileText className="mr-2 h-4 w-4 text-[var(--dashboard-primary)]" />
            Export Audit PDF
          </Button>
          <Button size="sm" className="h-10 bg-[var(--dashboard-secondary)] px-6 text-[10px] font-black uppercase tracking-widest text-white shadow-[0_10px_24px_-12px_rgba(69,90,100,0.45)] hover:bg-[#394B54]">
            <Download className="h-4 w-4 mr-2" />
            Global Report
          </Button>
        </div>
      </div>

      {/* Kementerian Hierarchical Filter Bar */}
      <KementerianFilterBar filters={filters} setFilters={setFilters} />

      {/* Real-time Status Banner */}
      <Card className="relative overflow-hidden border-none bg-[var(--dashboard-secondary)] shadow-[0_18px_40px_-24px_rgba(69,90,100,0.65)]">
        <div className="absolute top-0 right-0 p-4 opacity-5">
          <Globe className="h-24 w-24 text-white" />
        </div>
        <CardContent className="p-4 relative">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2.5">
                <div className="h-2 w-2 rounded-full bg-[var(--dashboard-tertiary)] animate-ping"></div>
                <div className="absolute h-2 w-2 rounded-full bg-[var(--dashboard-tertiary)]"></div>
                <span className="text-[10px] font-black text-white uppercase tracking-widest">System Active</span>
              </div>
              <div className="h-8 w-px bg-white/15" />
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-white/65 uppercase tracking-widest">Coverage</span>
                <span className="text-xs font-black text-white">{totals.activeUnits.toLocaleString()} Active Units</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[9px] font-black text-white/65 uppercase tracking-widest">Population</span>
                <span className="text-xs font-black text-white">{totals.totalMembers.toLocaleString()} Members Sync</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="h-6 border-white/15 bg-white/10 text-[9px] font-black uppercase tracking-widest text-[var(--dashboard-tertiary)]">99.9% Uptime</Badge>
              <span className="text-[9px] font-black text-white/70 uppercase tracking-widest">Last Update: {new Date().toLocaleTimeString("id-ID")}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="space-y-6">
          {/* Main Monitoring Panels */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Production Aggregation */}
            <Card className="border-none shadow-[0_4px_12px_-4px_rgba(0,0,0,0.05)] overflow-hidden">
              <CardHeader className="p-4 border-b border-slate-50 bg-slate-50/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-[var(--dashboard-secondary)]" />
                    <CardTitle className="text-xs font-black text-slate-900 uppercase tracking-tight">Agregasi Produksi</CardTitle>
                  </div>
                  <Badge className="border-none bg-[var(--dashboard-tertiary)]/20 text-[9px] font-black uppercase text-[#8A5F00]">+12.4% VOLUME</Badge>
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
                        contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontSize: '10px', fontWeight: 'bold' }}
                      />
                      <Bar dataKey="beras" fill="#455A64" name="Beras (T)" radius={[2, 2, 0, 0]} />
                      <Bar dataKey="sayur" fill="#D32F2F" name="Sayur (T)" radius={[2, 2, 0, 0]} />
                      <Bar dataKey="buah" fill="#FBC02D" name="Buah (T)" radius={[2, 2, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Financial Health Matrix */}
            <Card className="border-none shadow-[0_4px_12px_-4px_rgba(0,0,0,0.05)] overflow-hidden">
              <CardHeader className="p-4 border-b border-slate-50 bg-slate-50/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4 text-rose-600" />
                    <CardTitle className="text-xs font-black text-slate-900 uppercase tracking-tight">Likuiditas Keuangan</CardTitle>
                  </div>
                  <Badge className="border-none bg-[var(--dashboard-secondary)] text-[9px] font-black uppercase tracking-widest text-white">LIVE FLOW</Badge>
                </div>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                {[
                  { label: 'Inflow Nasional', val: totals.inflow, tone: 'secondary', trend: '+18%' },
                  { label: 'Outflow Operasional', val: totals.outflow, tone: 'rose', trend: '+4.2%' },
                  { label: 'Saldo Bersih', val: totals.net, tone: 'tertiary', trend: 'Stabil' },
                ].map((item, i) => (
                  <div key={i} className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{item.label}</p>
                      <p className={`mt-1 text-lg font-black tracking-tighter ${item.tone === 'rose' ? 'text-[var(--dashboard-primary)]' : item.tone === 'secondary' ? 'text-[var(--dashboard-secondary)]' : 'text-[#A57500]'}`}>
                        Rp {(item.val / 1000000).toFixed(1)} JT
                      </p>
                    </div>
                    <Badge variant="outline" className={`text-[9px] font-black ${item.tone === 'rose' ? 'border-[var(--dashboard-primary)]/15 text-[var(--dashboard-primary)]' : item.tone === 'secondary' ? 'border-[var(--dashboard-secondary)]/15 text-[var(--dashboard-secondary)]' : 'border-[var(--dashboard-tertiary)]/30 text-[#8A5F00]'}`}>
                      {item.trend}
                    </Badge>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Regional Performance Heatmap */}
          <Card className="border-none shadow-[0_4px_12px_-4px_rgba(0,0,0,0.05)] overflow-hidden">
             <CardHeader className="border-b border-[#394B54] bg-[var(--dashboard-secondary)] p-4">
               <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xs font-black text-white uppercase tracking-tight">Distribusi & Logistik Nasional</CardTitle>
                    <CardDescription className="text-[10px] font-bold text-white/70">Monitoring pengiriman lintas provinsi</CardDescription>
                  </div>
                  <Button size="sm" variant="outline" className="h-8 border-white/15 bg-white/10 text-[10px] font-black uppercase text-white hover:bg-white/15">Detail Rute</Button>
               </div>
             </CardHeader>
             <CardContent className="p-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[
                  { region: 'Jawa Barat', load: 85, status: 'On-Time', color: 'bg-[var(--dashboard-secondary)]' },
                  { region: 'Jawa Timur', load: 72, status: 'Delayed', color: 'bg-amber-500' },
                  { region: 'Sulawesi', load: 45, status: 'On-Time', color: 'bg-[var(--dashboard-secondary)]' },
                  { region: 'Sumatera Utara', load: 60, status: 'Delayed', color: 'bg-rose-500' },
                  { region: 'Bali', load: 92, status: 'On-Time', color: 'bg-[var(--dashboard-secondary)]' },
                  { region: 'Kalimantan', load: 38, status: 'On-Time', color: 'bg-[var(--dashboard-secondary)]' },
                ].map((reg, i) => (
                  <div key={i} className="p-4 rounded-xl border border-slate-100 bg-white hover:border-slate-300 transition-all group">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-black text-slate-900 uppercase tracking-tight">{reg.region}</span>
                      <div className={`h-2 w-2 rounded-full ${reg.color}`} />
                    </div>
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[9px] font-black text-slate-400 uppercase">
                        <span>Load</span>
                        <span>{reg.load}%</span>
                      </div>
                      <Progress value={reg.load} className="h-1 bg-slate-100" />
                      <p className={`text-[9px] font-black uppercase mt-2 ${reg.status === 'On-Time' ? 'text-[var(--dashboard-secondary)]' : 'text-[var(--dashboard-primary)]'}`}>{reg.status}</p>
                    </div>
                  </div>
                ))}
             </CardContent>
          </Card>
        </div>

        {/* War Room Side Panel */}
        <div className="space-y-6">
          <Card className="flex h-full max-h-[800px] flex-col overflow-hidden border-none bg-[var(--dashboard-secondary)] text-white shadow-[0_20px_40px_-16px_rgba(69,90,100,0.6)]">
            <CardHeader className="border-b border-white/10 bg-[#394B54] p-5">
              <div className="flex items-center justify-between">
                <CardTitle className="text-[11px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                  <Activity className="h-4 w-4 text-[var(--dashboard-tertiary)]" /> LIVE AUDIT FEED
                </CardTitle>
                <div className="flex items-center gap-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-[var(--dashboard-tertiary)] animate-pulse" />
                  <span className="text-[9px] font-black text-[var(--dashboard-tertiary)] uppercase">STREAMING</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0 flex-1 overflow-y-auto scrollbar-hide">
              <div className="divide-y divide-white/10">
                {logs.map((log, i) => (
                  <div key={i} className="group cursor-pointer p-5 transition-colors hover:bg-[#394B54]">
                    <div className="flex items-center justify-between mb-2">
                      <Badge className={`text-[8px] font-black uppercase h-4 px-1.5 rounded border-none ${
                        log.status === 'success' ? 'bg-white/10 text-white' :
                        log.status === 'warning' ? 'bg-[var(--dashboard-tertiary)]/18 text-[var(--dashboard-tertiary)]' :
                        'bg-white/10 text-white/70'
                      }`}>
                        {log.status}
                      </Badge>
                      <span className="text-[9px] font-mono text-white/45">{log.time}</span>
                    </div>
                    <p className="text-[11px] font-black text-white/90 uppercase leading-tight transition-colors group-hover:text-[var(--dashboard-tertiary)]">{log.action}</p>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-[9px] font-bold text-white/55 uppercase">USR: {log.role}</p>
                      <p className="text-[9px] font-black text-white/45 uppercase tracking-tighter">{log.entity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <div className="border-t border-white/10 bg-[#394B54] p-4">
              <Button variant="ghost" className="h-10 w-full text-[10px] font-black text-white/70 uppercase tracking-widest hover:text-white">
                Buka Konsol Audit Lengkap →
              </Button>
            </div>
          </Card>

          {/* Critical Risk Matrix */}
          <Card className="border-none shadow-[0_4px_12px_-4px_rgba(0,0,0,0.05)] bg-rose-50 overflow-hidden">
            <CardHeader className="p-4 bg-rose-600">
              <CardTitle className="text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-2">
                <AlertTriangle className="h-3.5 w-3.5" /> High-Impact Risks
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {[
                { label: 'Volatilitas Harga Jagung', scope: 'Lampung', impact: 'High' },
                { label: 'Logistik Terhambat', scope: 'Sumatera', impact: 'Medium' },
                { label: 'Anomali Kredit Baru', scope: 'Nasional', impact: 'Low' },
              ].map((risk, i) => (
                <div key={i} className="p-3 bg-white rounded-lg border border-rose-100 flex items-center justify-between shadow-sm">
                  <div>
                    <p className="text-[10px] font-black text-slate-900 uppercase tracking-tight">{risk.label}</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{risk.scope}</p>
                  </div>
                  <Badge variant="outline" className={`text-[8px] font-black uppercase ${risk.impact === 'High' ? 'text-rose-600 border-rose-100' : 'text-slate-500 border-slate-100'}`}>
                    {risk.impact}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
