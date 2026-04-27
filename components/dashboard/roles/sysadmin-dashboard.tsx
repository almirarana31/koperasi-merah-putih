'use client'

import {
  AlertCircle,
  ArrowRight,
  Settings,
  ShieldCheck,
  Users,
  Zap,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { DashboardLinks } from './dashboard-shared'
import { KpiCard } from '@/components/dashboard/kpi-card'
import { RoleHeader } from '@/components/dashboard/role-header'

const systemHealth = [
  { module: 'Auth', status: 100, latency: '12ms' },
  { module: 'DB', status: 98, latency: '42ms' },
  { module: 'AI', status: 100, latency: '156ms' },
  { module: 'Storage', status: 95, latency: '85ms' },
]

const auditLogs = [
  { user: 'Sysadmin', action: 'Role update', target: 'Ketua', time: '5 mnt lalu' },
  { user: 'AI Worker', action: 'Sync complete', target: 'Price Data', time: '12 mnt lalu' },
  { user: 'Manager A', action: 'Export PDF', target: 'Q1 Report', time: '45 mnt lalu' },
  { user: 'System', action: 'Auto-backup', target: 'Postgres', time: '1 jam lalu' },
]

export function SysadminDashboard() {
  return (
    <div className="page-shell">
      <RoleHeader
        title="Pusat Kontrol Sistem & Platform"
        subtitle="Monitor stabilitas, audit akses, dan performa lintas modul."
      />

      <div className="grid gap-4 md:grid-cols-4">
        <KpiCard label="Sistem Status" value="Optimal" change="99.9%" trend="up" icon={ShieldCheck} accent="success" />
        <KpiCard label="User Online" value="142" change="+12" trend="up" icon={Users} accent="tertiary" />
        <KpiCard label="API Latency" value="42ms" change="Stable" trend="neutral" icon={Zap} accent="warning" />
        <KpiCard label="Error Logs" value="0" change="Last 24h" trend="down" icon={AlertCircle} accent="primary" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_0.7fr]">
        <Card className="card-accent card-accent-secondary">
          <CardHeader>
            <CardTitle>Kesehatan Modul Platform</CardTitle>
            <CardDescription>Uptime dan responsivitas per layanan inti.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            {systemHealth.map((module) => (
              <div key={module.module} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-foreground">{module.module} Service</span>
                    <Badge variant="outline" className="text-xs">Latency: {module.latency}</Badge>
                  </div>
                  <span className="font-medium text-[color:var(--success)] tabular-nums">
                    {module.status}% uptime
                  </span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-[color:var(--success)]"
                    style={{ width: `${module.status}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="card-accent card-accent-tertiary">
          <CardHeader>
            <CardTitle>Audit Log Terbaru</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-border">
              {auditLogs.map((log, idx) => (
                <div key={idx} className="group flex cursor-pointer items-start gap-3 py-3 transition-colors hover:bg-muted/50">
                  <div className="mt-1.5 h-2 w-2 rounded-full bg-[color:var(--dashboard-tertiary)]" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground transition-colors group-hover:text-primary">
                      {log.user} performed {log.action}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      Target: {log.target} · {log.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3">
              <Button variant="ghost" className="w-full" asChild>
                <Link href="/command-center">Buka konsol kendali →</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Link href="/ai" className="group">
          <Card className="transition-colors hover:border-primary/40">
            <CardContent className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-warning/10 text-[color:var(--warning)]">
                  <Zap className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Maintenance AI Engine</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">Cek utilisasi GPU & token usage.</p>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
            </CardContent>
          </Card>
        </Link>
        <Link href="/anggota" className="group">
          <Card className="transition-colors hover:border-primary/40">
            <CardContent className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-md bg-[color:var(--dashboard-tertiary-soft)] text-[color:var(--dashboard-tertiary)]">
                  <Settings className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">Konfigurasi Hak Akses</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">Edit permission matrix lintas role.</p>
                </div>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
            </CardContent>
          </Card>
        </Link>
      </div>

      <DashboardLinks />
    </div>
  )
}
