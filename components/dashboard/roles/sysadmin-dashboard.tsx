"use client"

import {
  BarChart3,
  Users,
  Wallet,
  ShieldCheck,
  Zap,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  AlertCircle,
  Clock,
  ArrowRight,
  Settings,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts"
import Link from "next/link"
import { DashboardLinks } from "./dashboard-shared"

const systemHealth = [
  { module: "Auth", status: 100, latency: "12ms" },
  { module: "DB", status: 98, latency: "42ms" },
  { module: "AI", status: 100, latency: "156ms" },
  { module: "Storage", status: 95, latency: "85ms" },
]

export function SysadminDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 px-1">
        <h2 className="text-2xl font-black tracking-tight text-slate-950 drop-shadow-sm">Pusat Kontrol Sistem & Platform</h2>
        <p className="text-slate-700 text-sm font-semibold drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]">Monitor stabilitas, audit akses, dan performa lintas modul.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {[
          { title: "Sistem Status", value: "Optimal", change: "99.9%", trend: "up", icon: ShieldCheck, color: "text-emerald-600", bg: "bg-emerald-50" },
          { title: "User Online", value: "142", change: "+12", trend: "up", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
          { title: "API Latency", value: "42ms", change: "Stable", trend: "up", icon: Zap, color: "text-amber-600", bg: "bg-amber-50" },
          { title: "Error Logs", value: "0", change: "Last 24h", trend: "down", icon: AlertCircle, color: "text-primary", bg: "bg-primary/5" },
        ].map((kpi, idx) => (
          <Card key={idx} className="border-border/50 shadow-sm">
            <CardContent className="p-5">
              <div className="flex justify-between items-center">
                <div className={`p-2 rounded-xl ${kpi.bg} ${kpi.color}`}>
                  <kpi.icon className="h-5 w-5" />
                </div>
                <div className="text-[10px] font-bold text-muted-foreground uppercase">{kpi.change}</div>
              </div>
              <div className="mt-4">
                <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wider drop-shadow-sm">{kpi.title}</p>
                <p className="text-3xl font-black mt-1 text-slate-950 drop-shadow-sm">{kpi.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        {/* Module Performance */}
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Kesehatan Modul Platform</CardTitle>
            <CardDescription className="text-xs">Uptime dan responsivitas per layanan inti.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6 mt-4">
              {systemHealth.map((module) => (
                <div key={module.module} className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-bold">{module.module} Service</span>
                      <Badge variant="outline" className="text-[9px] h-4">Latency: {module.latency}</Badge>
                    </div>
                    <span className="font-medium text-emerald-600">{module.status}% Uptime</span>
                  </div>
                  <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${module.status}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Alerts & Audits */}
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Audit Log Terbaru</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { user: "Sysadmin", action: "Role update", target: "Ketua", time: "5 mnt lalu" },
              { user: "AI Worker", action: "Sync complete", target: "Price Data", time: "12 mnt lalu" },
              { user: "Manager A", action: "Export PDF", target: "Q1 Report", time: "45 mnt lalu" },
              { user: "System", action: "Auto-backup", target: "Postgres", time: "1 jam lalu" },
            ].map((log, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 rounded-xl border border-border/50 bg-secondary/10">
                <div className="mt-1 h-2 w-2 rounded-full bg-blue-500" />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-slate-950 truncate">{log.user} performed {log.action}</p>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Target: {log.target} • {log.time}</p>
                </div>
              </div>
            ))}
            <Button variant="ghost" className="w-full text-xs font-bold text-primary" asChild>
              <Link href="/command-center">Buka Konsol Kendali →</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Admin Quick Settings */}
      <div className="grid gap-4 md:grid-cols-2">
        <Link href="/ai" className="group">
          <Card className="border-border/50 bg-stone-50 group-hover:bg-stone-100 transition-all">
            <CardContent className="p-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center border border-stone-200">
                  <Zap className="h-6 w-6 text-amber-500" />
                </div>
                <div>
                  <p className="text-sm font-bold">Maintenance AI Engine</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Cek utilisasi GPU & token usage.</p>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
            </CardContent>
          </Card>
        </Link>
        <Link href="/anggota" className="group">
          <Card className="border-border/50 bg-stone-50 group-hover:bg-stone-100 transition-all">
            <CardContent className="p-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center border border-stone-200">
                  <Settings className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm font-bold">Konfigurasi Hak Akses</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Edit permission matrix lintas role.</p>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
            </CardContent>
          </Card>
        </Link>
      </div>
      <DashboardLinks />
    </div>
  )
}
