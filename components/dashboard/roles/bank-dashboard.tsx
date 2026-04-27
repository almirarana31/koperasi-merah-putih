'use client'

import {
  Clock,
  ShieldCheck,
  TrendingUp,
  Wallet,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import Link from 'next/link'
import { DashboardLinks } from './dashboard-shared'
import { KpiCard } from '@/components/dashboard/kpi-card'
import { RoleHeader } from '@/components/dashboard/role-header'
import { AiInsightBanner } from '@/components/dashboard/ai-insight-banner'

const RISK_COLORS = {
  low: 'var(--success)',
  medium: 'var(--warning)',
  high: 'var(--destructive)',
}

const riskDistribution = [
  { name: 'Low Risk', value: 75, color: RISK_COLORS.low },
  { name: 'Medium Risk', value: 18, color: RISK_COLORS.medium },
  { name: 'High Risk', value: 7, color: RISK_COLORS.high },
]

const STATUS_BADGE: Record<string, string> = {
  high: 'border-success/30 bg-success/10 text-[color:var(--success)]',
  medium: 'border-warning/30 bg-warning/10 text-[color:var(--warning)]',
  priority: 'border-tertiary/30 bg-[color:var(--dashboard-tertiary-soft)] text-[color:var(--dashboard-tertiary)]',
  manual: 'border-border bg-muted text-muted-foreground',
}

const loanApplications = [
  { name: 'Pak Budi Santoso', amount: 'Rp 25.000.000', score: 785, status: 'High Confidence', tone: 'high' },
  { name: 'Ibu Siti Aminah', amount: 'Rp 12.000.000', score: 690, status: 'Medium Risk', tone: 'medium' },
  { name: 'Kelompok Tani Merdeka', amount: 'Rp 150.000.000', score: 812, status: 'Priority', tone: 'priority' },
  { name: 'Pak Ahmad Dahlan', amount: 'Rp 8.500.000', score: 620, status: 'Manual Review', tone: 'manual' },
]

export function BankDashboard() {
  return (
    <div className="page-shell">
      <RoleHeader
        title="Analisis Pembiayaan & Risiko"
        subtitle="Monitor kelayakan kredit anggota dan performa portfolio pinjaman."
      />

      <div className="grid gap-4 md:grid-cols-4">
        <KpiCard label="Total Portfolio" value="Rp 12.4M" change="+5.2%" trend="up" icon={Wallet} accent="tertiary" />
        <KpiCard label="NPL Ratio" value="1.8%" change="-0.2%" trend="down" icon={TrendingUp} accent="success" />
        <KpiCard label="Loan Pending" value="16 Berkas" change="4 Urgent" trend="up" icon={Clock} accent="warning" />
        <KpiCard label="Avg Credit Score" value="742" change="+12 pts" trend="up" icon={ShieldCheck} accent="secondary" />
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <Card className="card-accent card-accent-secondary">
          <CardHeader>
            <CardTitle>Profil Risiko Portfolio</CardTitle>
            <CardDescription>Distribusi profil risiko seluruh peminjam.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative flex h-[220px] items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={riskDistribution}
                    innerRadius={65}
                    outerRadius={85}
                    paddingAngle={8}
                    dataKey="value"
                    stroke="none"
                    isAnimationActive={false}
                  >
                    {riskDistribution.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="metric-value">742</span>
                <span className="text-xs text-muted-foreground">Avg Score</span>
              </div>
            </div>
            <div className="mt-6 space-y-2">
              {riskDistribution.map((item) => (
                <div key={item.name} className="surface-card-muted flex items-center justify-between p-2.5">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-sm text-foreground">{item.name}</span>
                  </div>
                  <span className="text-sm font-medium tabular-nums">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="card-accent card-accent-primary">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Pengajuan Pinjaman Terbaru</CardTitle>
              <CardDescription>Menunggu review analis kredit.</CardDescription>
            </div>
            <Button size="sm" variant="ghost" asChild>
              <Link href="/keuangan/pinjaman">Semua →</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-border">
              {loanApplications.map((loan) => (
                <div key={loan.name} className="group flex cursor-pointer items-center justify-between py-3 transition-colors hover:bg-muted/50">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
                      {loan.name}
                    </p>
                    <div className="mt-1 flex items-center gap-2">
                      <Badge variant="outline" className="text-xs">Score: {loan.score}</Badge>
                      <Badge variant="outline" className={STATUS_BADGE[loan.tone]}>{loan.status}</Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold tabular-nums">{loan.amount}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">Investasi modal</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <AiInsightBanner
        title="AI Insight: Credit Scoring Terkini"
        description="Analisis behavior transaksi 500+ anggota menunjukkan tren perbaikan kolektibilitas."
        action={
          <Button size="sm" asChild>
            <Link href="/keuangan/credit-scoring">Buka tool analis</Link>
          </Button>
        }
      />

      <DashboardLinks />
    </div>
  )
}
