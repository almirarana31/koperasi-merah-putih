"use client"

import {
  TrendingUp,
  ShieldCheck,
  Wallet,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  Clock,
  ChevronRight,
  Zap,
  LineChart as LineChartIcon,
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
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import Link from "next/link"
import { DashboardLinks } from "./dashboard-shared"

const riskDistribution = [
  { name: "Low Risk", value: 75, color: "#10b981" },
  { name: "Medium Risk", value: 18, color: "#f59e0b" },
  { name: "High Risk", value: 7, color: "#ef4444" },
]

export function BankDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 px-1">
        <h2 className="text-2xl font-black tracking-tight text-slate-950 drop-shadow-sm">Analisis Pembiayaan & Risiko</h2>
        <p className="text-slate-700 text-sm font-semibold drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]">Monitor kelayakan kredit anggota dan performa portfolio pinjaman.</p>
      </div>


      <div className="grid gap-4 md:grid-cols-4">
        {[
          { title: "Total Portfolio", value: "Rp 12.4M", change: "+5.2%", trend: "up", icon: Wallet, color: "text-blue-600", bg: "bg-blue-50" },
          { title: "NPL Ratio", value: "1.8%", change: "-0.2%", trend: "down", icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
          { title: "Loan Pending", value: "16 Berkas", change: "4 Urgent", trend: "up", icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
          { title: "Avg Credit Score", value: "742", change: "+12 pts", trend: "up", icon: ShieldCheck, color: "text-purple-600", bg: "bg-purple-50" },
        ].map((kpi, idx) => (
          <Card key={idx} className="border-border/50 shadow-sm">
            <CardContent className="p-5">
              <div className="flex justify-between items-center">
                <div className={`p-2 rounded-xl ${kpi.bg} ${kpi.color}`}>
                  <kpi.icon className="h-5 w-5" />
                </div>
                <div className="flex items-center gap-1 text-[10px] font-bold">
                  {kpi.trend === 'up' ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                  {kpi.change}
                </div>
              </div>
              <div className="mt-4">
                <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wider drop-shadow-sm">{kpi.title}</p>
                <p className="text-3xl font-black mt-1 text-slate-950 drop-shadow-sm">{kpi.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        {/* Risk Profile Chart */}
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Profil Risiko Portfolio</CardTitle>
            <CardDescription className="text-xs">Distribusi profil risiko seluruh peminjam.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[220px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={riskDistribution}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {riskDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 mt-4">
              {riskDistribution.map((item) => (
                <div key={item.name} className="flex items-center justify-between text-xs px-3 py-2 rounded-lg bg-secondary/30">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="font-medium text-muted-foreground">{item.name}</span>
                  </div>
                  <span className="font-bold">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Loan Applications Table-like List */}
        <Card className="border-border/50 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Pengajuan Pinjaman Terbaru</CardTitle>
              <CardDescription className="text-xs">Menunggu review analis kredit.</CardDescription>
            </div>
            <Button size="sm" variant="outline" className="h-8 text-xs" asChild>
              <Link href="/keuangan/pinjaman">Semua Pengajuan</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {[
              { name: "Pak Budi Santoso", amount: "Rp 25.000.000", score: 785, status: "High Confidence", color: "text-emerald-600" },
              { name: "Ibu Siti Aminah", amount: "Rp 12.000.000", score: 690, status: "Medium Risk", color: "text-amber-600" },
              { name: "Kelompok Tani Merdeka", amount: "Rp 150.000.000", score: 812, status: "Priority", color: "text-blue-600" },
              { name: "Pak Ahmad Dahlan", amount: "Rp 8.500.000", score: 620, status: "Manual Review", color: "text-stone-500" },
            ].map((loan, idx) => (
              <div key={idx} className="flex items-center justify-between p-3.5 rounded-xl border border-border/50 bg-white hover:border-primary/30 transition-all cursor-pointer group">
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-slate-950 group-hover:text-primary transition-colors">{loan.name}</span>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-[10px] px-1.5 h-4">Score: {loan.score}</Badge>
                    <span className={`text-[10px] font-bold ${loan.color}`}>{loan.status}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-slate-950">{loan.amount}</p>
                  <p className="text-[10px] text-muted-foreground uppercase font-medium mt-1 tracking-wider">Investasi Modal</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* AI Credit Scoring Helper */}
      <Card className="border-primary/10 bg-primary/[0.02]">
        <CardContent className="p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 rounded-2xl bg-white flex items-center justify-center border border-primary/10 shadow-sm">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm font-bold">AI Insight: Credit Scoring Terkini</p>
              <p className="text-xs text-muted-foreground mt-0.5">Analisis behavior transaksi 500+ anggota menunjukkan tren perbaikan kolektibilitas.</p>
            </div>
          </div>
          <Button size="sm" className="w-full sm:w-auto h-9 text-xs" asChild>
            <Link href="/keuangan/credit-scoring">Buka Tool Analis</Link>
          </Button>
        </CardContent>
      </Card>
      <DashboardLinks />
    </div>
  )
}
