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
import { 
  Building2, 
  Users, 
  Wallet, 
  ShieldAlert, 
  HeartPulse, 
  TrendingUp, 
  TrendingDown,
  AlertTriangle,
  ArrowRight,
  ChevronRight,
  FileText,
  Activity
} from 'lucide-react'
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid
} from 'recharts'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'

interface AuditDetailDialogProps {
  cooperative: any
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AuditDetailDialog({ cooperative, open, onOpenChange }: AuditDetailDialogProps) {
  if (!cooperative) return null

  // Mock trend data for the specific cooperative
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
    { id: 2, type: 'Operational', severity: 'low', title: 'Reporting Delay', desc: 'Monthly stock report submitted 2 days past deadline.' }
  ]

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[95vh] p-0 overflow-hidden flex flex-col gap-0 border-none shadow-2xl">
        <DialogHeader className="p-6 bg-slate-900 text-white">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-rose-600 rounded-lg">
                  <Building2 className="h-6 w-6 text-white" />
                </div>
                <div>
                  <DialogTitle className="text-2xl font-black tracking-tight uppercase">{cooperative.label}</DialogTitle>
                  <DialogDescription className="text-slate-400 font-bold uppercase text-[10px] tracking-widest flex items-center gap-2 mt-0.5">
                    ID: {cooperative.id} • {cooperative.village} • {cooperative.region}
                  </DialogDescription>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Health Score</p>
              <div className="flex items-center gap-3">
                <span className={`text-4xl font-black tracking-tighter ${cooperative.overallScore > 80 ? 'text-emerald-400' : cooperative.overallScore > 60 ? 'text-amber-400' : 'text-rose-400'}`}>
                  {Math.round(cooperative.overallScore)}
                </span>
                <Badge className={`uppercase font-black text-[9px] ${cooperative.overallHealth === 'good' ? 'bg-emerald-500' : cooperative.overallHealth === 'warning' ? 'bg-amber-500' : 'bg-rose-500'}`}>
                  {cooperative.overallHealth}
                </Badge>
              </div>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="flex-1 bg-slate-50">
          <div className="p-6 space-y-6">
            {/* KPI Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { label: 'Total Anggota', value: cooperative.totalMembers.toLocaleString('id-ID'), icon: Users, tone: 'slate' },
                { label: 'Inc / Member', value: `Rp${(cooperative.avgIncomeAfter / 1000).toFixed(0)}K`, icon: Wallet, tone: 'emerald' },
                { label: 'NPL Ratio', value: `${cooperative.avgNpl.toFixed(1)}%`, icon: ShieldAlert, tone: cooperative.avgNpl > 3 ? 'rose' : 'emerald' },
                { label: 'Rev / Mo', value: 'Rp42M', icon: Activity, tone: 'emerald' },
              ].map((kpi, idx) => (
                <div key={idx} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-2 mb-2">
                    <kpi.icon className={`h-3.5 w-3.5 ${kpi.tone === 'rose' ? 'text-rose-500' : kpi.tone === 'emerald' ? 'text-emerald-500' : 'text-slate-400'}`} />
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{kpi.label}</span>
                  </div>
                  <p className="text-xl font-black text-slate-900 tracking-tighter">{kpi.value}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Financial Trend */}
              <div className="space-y-3">
                <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] px-1">Financial Momentum</h3>
                <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={cooperativeTrend}>
                      <defs>
                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.1}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                      <XAxis dataKey="month" fontSize={10} fontWeight={900} axisLine={false} tickLine={false} />
                      <YAxis hide />
                      <Tooltip />
                      <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} fill="url(#colorRev)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Active Alerts */}
              <div className="space-y-3">
                <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] px-1">Audit Findings</h3>
                <div className="space-y-2">
                  {alerts.map((alert) => (
                    <div key={alert.id} className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm flex items-start gap-3">
                      <div className={`mt-0.5 p-1.5 rounded-lg ${alert.severity === 'medium' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'}`}>
                        <AlertTriangle className="h-3.5 w-3.5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="text-[10px] font-black text-slate-900 uppercase">{alert.title}</p>
                          <Badge variant="outline" className="text-[8px] font-black h-4 px-1 uppercase">{alert.type}</Badge>
                        </div>
                        <p className="text-[10px] text-slate-500 font-medium mt-1 leading-tight">{alert.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Detailed Ratios Table */}
            <div className="space-y-3">
              <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] px-1">Financial Ratios</h3>
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <Table>
                  <TableHeader className="bg-slate-50">
                    <TableRow>
                      <TableHead className="text-[9px] font-black text-slate-400 uppercase h-8">Ratio Name</TableHead>
                      <TableHead className="text-[9px] font-black text-slate-400 uppercase h-8 text-center">Score</TableHead>
                      <TableHead className="text-[9px] font-black text-slate-400 uppercase h-8 text-right">Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      { name: 'Likuiditas (Lancar)', score: 85, status: 'Sehat' },
                      { name: 'Solvabilitas (DER)', score: 72, status: 'Waspada' },
                      { name: 'Rentabilitas (ROI)', score: 88, status: 'Sangat Sehat' },
                    ].map((ratio, i) => (
                      <TableRow key={i} className="h-10">
                        <TableCell className="text-xs font-bold text-slate-700">{ratio.name}</TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-12 h-1 bg-slate-100 rounded-full overflow-hidden">
                              <div className={`h-full rounded-full ${ratio.score > 80 ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${ratio.score}%` }} />
                            </div>
                            <span className="text-[10px] font-black text-slate-900">{ratio.score}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge variant="outline" className={`text-[8px] font-black h-4 px-1 uppercase ${ratio.status === 'Sehat' || ratio.status === 'Sangat Sehat' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
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

        <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-between">
          <Button variant="outline" size="sm" className="rounded-xl font-black text-[10px] uppercase tracking-widest h-10 px-6 border-slate-200 text-slate-600 hover:bg-slate-50">
            <FileText className="h-3.5 w-3.5 mr-2" />
            Full Audit Report
          </Button>
          <div className="flex gap-2">
            <Button size="sm" variant="ghost" className="rounded-xl font-black text-[10px] uppercase tracking-widest h-10 px-4 text-slate-400" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            <Button size="sm" className="rounded-xl font-black text-[10px] uppercase tracking-widest h-10 px-6 bg-rose-600 hover:bg-rose-700 text-white shadow-lg shadow-rose-200">
              Intervene AI <ChevronRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
