"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Building2, Users, Wallet, ShieldAlert, AlertTriangle, ChevronRight, FileText, Activity } from 'lucide-react'
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid } from 'recharts'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'

interface AuditDetailDialogProps {
  cooperative: any
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AuditDetailDialog({ cooperative, open, onOpenChange }: AuditDetailDialogProps) {
  if (!cooperative) return null

  const cooperativeTrend = [
    { month: 'Jan', revenue: 450, members: 120, npl: 2.1 },
    { month: 'Feb', revenue: 520, members: 125, npl: 2.3 },
    { month: 'Mar', revenue: 480, members: 132, npl: 2.5 },
    { month: 'Apr', revenue: 610, members: 145, npl: 2.2 },
    { month: 'Mei', revenue: 590, members: 158, npl: 2.4 },
    { month: 'Jun', revenue: 720, members: 172, npl: 2.1 },
  ]

  const alerts = [
    { id: 1, type: 'Financial', severity: 'medium', title: 'NPL Ratio Trend', desc: 'Slight upward trend in non-performing loans over last 3 months.' },
    { id: 2, type: 'Operational', severity: 'low', title: 'Reporting Delay', desc: 'Monthly stock report submitted 2 days past deadline.' },
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[95vh] max-w-4xl flex-col gap-0 overflow-hidden border border-slate-200 p-0 shadow-[0_28px_60px_-40px_rgba(15,23,42,0.24)]">
        <DialogHeader className="border-b border-slate-200 bg-white p-5 text-slate-900">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-rose-50 p-2 text-rose-600">
                  <Building2 className="h-6 w-6" />
                </div>
                <div>
                  <DialogTitle className="text-[1.45rem] font-semibold text-slate-950">{cooperative.label}</DialogTitle>
                  <DialogDescription className="mt-0.5 flex items-center gap-2 text-xs text-slate-500">
                    ID: {cooperative.id} | {cooperative.village} | {cooperative.region}
                  </DialogDescription>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="mb-1 text-xs font-medium text-slate-500">Health score</p>
              <div className="flex items-center gap-3">
                <span
                  className={`text-4xl font-semibold ${
                    cooperative.overallScore > 80
                      ? 'text-emerald-500'
                      : cooperative.overallScore > 60
                        ? 'text-amber-500'
                        : 'text-rose-500'
                  }`}
                >
                  {Math.round(cooperative.overallScore)}
                </span>
                <Badge
                  className={`text-xs font-medium ${
                    cooperative.overallHealth === 'good'
                      ? 'bg-emerald-500'
                      : cooperative.overallHealth === 'warning'
                        ? 'bg-amber-500'
                        : 'bg-rose-500'
                  }`}
                >
                  {cooperative.overallHealth}
                </Badge>
              </div>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 bg-slate-50">
          <div className="space-y-5 p-5">
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              {[
                { label: 'Total anggota', value: cooperative.totalMembers.toLocaleString('id-ID'), icon: Users, tone: 'slate' },
                { label: 'Pendapatan / anggota', value: `Rp${(cooperative.avgIncomeAfter / 1000).toFixed(0)}K`, icon: Wallet, tone: 'emerald' },
                { label: 'Rasio NPL', value: `${cooperative.avgNpl.toFixed(1)}%`, icon: ShieldAlert, tone: cooperative.avgNpl > 3 ? 'rose' : 'emerald' },
                { label: 'Pendapatan / bulan', value: 'Rp42M', icon: Activity, tone: 'emerald' },
              ].map((kpi, idx) => (
                <div key={idx} className="rounded-xl border border-slate-200 bg-white p-4 shadow-[0_10px_22px_-18px_rgba(15,23,42,0.16)]">
                  <div className="mb-2 flex items-center gap-2">
                    <kpi.icon
                      className={`h-3.5 w-3.5 ${
                        kpi.tone === 'rose'
                          ? 'text-rose-500'
                          : kpi.tone === 'emerald'
                            ? 'text-emerald-500'
                            : 'text-slate-400'
                      }`}
                    />
                    <span className="text-xs font-medium text-slate-500">{kpi.label}</span>
                  </div>
                  <p className="text-xl font-semibold text-slate-900">{kpi.value}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              <div className="space-y-3">
                <h3 className="px-1 text-sm font-semibold text-slate-900">Financial momentum</h3>
                <div className="h-[200px] rounded-xl border border-slate-200 bg-white p-4 shadow-[0_10px_22px_-18px_rgba(15,23,42,0.16)]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={cooperativeTrend}>
                      <defs>
                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.1} />
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="month" fontSize={11} axisLine={false} tickLine={false} />
                      <YAxis hide />
                      <Tooltip />
                      <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} fill="url(#colorRev)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="px-1 text-sm font-semibold text-slate-900">Audit findings</h3>
                <div className="space-y-2">
                  {alerts.map((alert) => (
                    <div key={alert.id} className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-3 shadow-[0_10px_22px_-18px_rgba(15,23,42,0.16)]">
                      <div className={`mt-0.5 rounded-lg p-1.5 ${alert.severity === 'medium' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'}`}>
                        <AlertTriangle className="h-3.5 w-3.5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-xs font-semibold text-slate-900">{alert.title}</p>
                          <Badge variant="outline" className="h-4 px-1 text-xs font-medium">
                            {alert.type}
                          </Badge>
                        </div>
                        <p className="mt-1 text-xs leading-tight text-slate-500">{alert.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="px-1 text-sm font-semibold text-slate-900">Financial ratios</h3>
              <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-[0_10px_22px_-18px_rgba(15,23,42,0.16)]">
                <Table>
                  <TableHeader className="bg-slate-50">
                    <TableRow>
                      <TableHead className="h-8 text-xs font-medium text-slate-500">Ratio name</TableHead>
                      <TableHead className="h-8 text-center text-xs font-medium text-slate-500">Score</TableHead>
                      <TableHead className="h-8 text-right text-xs font-medium text-slate-500">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      { name: 'Likuiditas (Lancar)', score: 85, status: 'Sehat' },
                      { name: 'Solvabilitas (DER)', score: 72, status: 'Waspada' },
                      { name: 'Rentabilitas (ROI)', score: 88, status: 'Sangat sehat' },
                    ].map((ratio, i) => (
                      <TableRow key={i} className="h-10">
                        <TableCell className="text-xs font-medium text-slate-700">{ratio.name}</TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-2">
                            <div className="h-1 w-12 overflow-hidden rounded-full bg-slate-100">
                              <div
                                className={`h-full rounded-full ${ratio.score > 80 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                                style={{ width: `${ratio.score}%` }}
                              />
                            </div>
                            <span className="text-xs font-semibold text-slate-900">{ratio.score}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge
                            variant="outline"
                            className={`h-4 px-1 text-xs font-medium ${
                              ratio.status === 'Sehat' || ratio.status === 'Sangat sehat'
                                ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                                : 'border-amber-200 bg-amber-50 text-amber-700'
                            }`}
                          >
                            {ratio.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </ScrollArea>

        <div className="flex items-center justify-between border-t border-slate-200 bg-white p-4">
          <Button variant="outline" size="sm" className="h-10 rounded-xl border-slate-300 px-5 text-xs font-medium text-slate-700 hover:bg-slate-50">
            <FileText className="mr-2 h-3.5 w-3.5" />
            Full Audit Report
          </Button>
          <div className="flex gap-2">
            <Button size="sm" variant="ghost" className="h-10 rounded-xl px-4 text-xs font-medium text-slate-500" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            <Button size="sm" className="h-10 rounded-xl bg-rose-600 px-6 text-xs font-medium text-white shadow-[0_12px_24px_-18px_rgba(190,24,93,0.38)] hover:bg-rose-700">
              Intervene AI <ChevronRight className="ml-1 h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
