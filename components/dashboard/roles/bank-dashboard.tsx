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
        <h2 className="text-2xl font-semibold  text-slate-950 drop-shadow-sm">Analisis Pembiayaan & Risiko</h2>
        <p className="text-slate-700 text-sm font-semibold drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]">Monitor kelayakan kredit anggota dan performa portfolio pinjaman.</p>
      </div>


      <div className="grid gap-4 md:grid-cols-4">
        {[
          { title: "Total Portfolio", value: "Rp 12.4M", change: "+5.2%", trend: "up", icon: Wallet, color: "text-blue-600", bg: "bg-blue-50" },
          { title: "NPL Ratio", value: "1.8%", change: "-0.2%", trend: "down", icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-50" },
          { title: "Loan Pending", value: "16 Berkas", change: "4 Urgent", trend: "up", icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
          { title: "Avg Credit Score", value: "742", change: "+12 pts", trend: "up", icon: ShieldCheck, color: "text-purple-600", bg: "bg-purple-50" },
        ].map((kpi, idx) => (
          <Card key={idx} className="border-slate-200 bg-white shadow-sm overflow-hidden">
            <CardContent className="p-5">
              <div className="flex justify-between items-center">
                <div className={`p-2 rounded-xl ${kpi.bg} ${kpi.color}`}>
                  <kpi.icon className="h-5 w-5" />
                </div>
                <div className={`flex items-center gap-1 text-xs font-semibold   ${kpi.trend === 'up' ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {kpi.trend === 'up' ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                  {kpi.change}
                </div>
              </div>
              <div className="mt-4">
                <p className="text-xs font-semibold text-slate-400   drop-shadow-sm">{kpi.title}</p>
                <p className="text-3xl font-semibold mt-1 text-slate-950 drop-shadow-sm ">{kpi.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        {/* Risk Profile Chart */}
        <Card className="border-slate-200 bg-white shadow-sm overflow-hidden">
          <CardHeader className="pb-2 bg-slate-50/50 border-b border-slate-100">
            <CardTitle className="text-sm font-semibold   text-slate-900">Profil Risiko Portfolio</CardTitle>
            <CardDescription className="text-xs font-bold text-slate-500 ">Distribusi profil risiko seluruh peminjam.</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="h-[220px] flex items-center justify-center relative">
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
                    {riskDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontSize: '12px' }} 
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-semibold text-slate-900 ">742</span>
                <span className="text-xs font-semibold text-slate-400 ">Avg Score</span>
              </div>
            </div>
            <div className="space-y-2 mt-6">
              {riskDistribution.map((item) => (
                <div key={item.name} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100 shadow-sm">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-xs font-semibold text-slate-600  ">{item.name}</span>
                  </div>
                  <span className="text-xs font-semibold text-slate-900">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Loan Applications Table-like List */}
        <Card className="border-slate-200 bg-white shadow-sm overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between bg-slate-50/50 border-b border-slate-100 py-3">
            <div>
              <CardTitle className="text-sm font-semibold   text-slate-900">Pengajuan Pinjaman Terbaru</CardTitle>
              <CardDescription className="text-xs font-bold text-slate-500 ">Menunggu review analis kredit.</CardDescription>
            </div>
            <Button size="sm" variant="ghost" className="h-8 text-xs font-semibold text-rose-600 hover:bg-rose-50  " asChild>
              <Link href="/keuangan/pinjaman">Semua Pengajuan →</Link>
            </Button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-slate-100">
              {[
                { name: "Pak Budi Santoso", amount: "Rp 25.000.000", score: 785, status: "High Confidence", color: "text-emerald-600", bg: "bg-emerald-50" },
                { name: "Ibu Siti Aminah", amount: "Rp 12.000.000", score: 690, status: "Medium Risk", color: "text-amber-600", bg: "bg-amber-50" },
                { name: "Kelompok Tani Merdeka", amount: "Rp 150.000.000", score: 812, status: "Priority", color: "text-blue-600", bg: "bg-blue-50" },
                { name: "Pak Ahmad Dahlan", amount: "Rp 8.500.000", score: 620, status: "Manual Review", color: "text-slate-500", bg: "bg-slate-100" },
              ].map((loan, idx) => (
                <div key={idx} className="flex items-center justify-between p-4 hover:bg-slate-50 transition-colors group cursor-pointer">
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-slate-900 group-hover:text-rose-600 transition-colors  ">{loan.name}</span>
                    <div className="flex items-center gap-2 mt-1.5">
                      <Badge variant="outline" className="text-xs font-semibold  px-1.5 h-4 border-slate-200 text-slate-500">Score: {loan.score}</Badge>
                      <span className={`text-xs font-semibold  px-1.5 py-0.5 rounded-full ${loan.bg} ${loan.color}`}>{loan.status}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-900">{loan.amount}</p>
                    <p className="text-xs text-slate-400  font-semibold mt-1 ">Investasi Modal</p>
                  </div>
                </div>
              ))}
            </div>
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
