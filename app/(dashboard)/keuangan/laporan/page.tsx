'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Download,
  FileText,
  TrendingUp,
  TrendingDown,
  Calendar,
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useToast } from '@/components/ui/use-toast'
import { useAuth } from '@/lib/auth/use-auth'
import { KementerianFilterBar } from '@/components/dashboard/kementerian-filter-bar'
import type { ScopeFilters } from '@/lib/kementerian-dashboard-data'
import {
  transactions,
  monthlyRevenue,
  formatCurrency,
} from '@/lib/data'
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Line,
  LineChart,
  CartesianGrid,
} from 'recharts'

export default function LaporanPage() {
  const { toast } = useToast()
  const { user } = useAuth()
  const [filters, setFilters] = useState<ScopeFilters>({
    provinceId: 'all',
    regionId: 'all',
    villageId: 'all',
    cooperativeId: 'all',
    commodityId: 'all',
  })

  const scaleFactor = filters.provinceId === 'all' ? 1 : filters.regionId === 'all' ? 0.3 : 0.1

  const scaledMonthlyRevenue = useMemo(() => {
    return monthlyRevenue.map(m => ({
      ...m,
      pendapatan: m.pendapatan * scaleFactor,
      pengeluaran: m.pengeluaran * scaleFactor,
    }))
  }, [scaleFactor])

  const totalPemasukan = scaledMonthlyRevenue.reduce((sum, t) => sum + t.pendapatan, 0)
  const totalPengeluaran = scaledMonthlyRevenue.reduce((sum, t) => sum + t.pengeluaran, 0)
  const labaKotor = totalPemasukan - totalPengeluaran

  // Calculate cumulative balance for line chart
  const cumulativeData = scaledMonthlyRevenue.map((item, index) => {
    const prevTotal =
      index > 0
        ? scaledMonthlyRevenue
            .slice(0, index)
            .reduce((sum, m) => sum + (m.pendapatan - m.pengeluaran), 0)
        : 0
    return {
      ...item,
      saldo: (150000000 * scaleFactor) + prevTotal + (item.pendapatan - item.pengeluaran),
    }
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild className="shrink-0 h-8 w-8 hover:bg-slate-100">
            <Link href="/keuangan">
              <ArrowLeft className="h-4 w-4 text-slate-600" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">NATIONAL AUDIT LEDGER</h1>
            <p className="text-[10px] font-black text-slate-500 mt-1 uppercase tracking-widest leading-none">
              ANALISIS PERFORMA & AUDIT KEUANGAN NASIONAL • REAL-TIME ANALYSIS
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Select defaultValue="2024">
            <SelectTrigger className="h-9 w-[120px] text-[10px] font-black uppercase tracking-widest border-slate-200 rounded-none bg-white">
              <Calendar className="mr-2 h-3.5 w-3.5" />
              <SelectValue placeholder="Tahun" />
            </SelectTrigger>
            <SelectContent className="rounded-none border-slate-200">
              <SelectItem value="2024" className="text-[10px] font-black uppercase">TAHUN 2024</SelectItem>
              <SelectItem value="2023" className="text-[10px] font-black uppercase">TAHUN 2023</SelectItem>
            </SelectContent>
          </Select>
          <Button 
            className="h-9 bg-slate-900 text-white hover:bg-slate-800 text-[10px] font-black uppercase tracking-widest px-6 rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] transition-all"
            onClick={() => toast({ title: "Audit Export", description: "Menyiapkan dokumen audit PDF konsolidasi..." })}
          >
            <Download className="mr-2 h-3.5 w-3.5" />
            EXPORT AUDIT PDF
          </Button>
        </div>
      </div>

      <KementerianFilterBar filters={filters} setFilters={setFilters} />

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {[
          { label: 'TOTAL PEMASUKAN', value: formatCurrency(totalPemasukan), sub: '+18.4% ANOMALY DETECTED', icon: TrendingUp, tone: 'emerald' },
          { label: 'TOTAL PENGELUARAN', value: formatCurrency(totalPengeluaran), sub: 'WITHIN OPERATIONAL LIMITS', icon: TrendingDown, tone: 'rose' },
          { label: 'LABA BERSIH (EBITDA)', value: formatCurrency(labaKotor), sub: `MARGIN: ${((labaKotor / totalPemasukan) * 100).toFixed(1)}% PERFORMANCE INDEX`, icon: FileText, tone: 'slate' },
        ].map((stat, i) => (
          <Card key={i} className="border-none shadow-sm bg-white overflow-hidden rounded-none">
            <div className={`h-1 w-full border-t-4 ${
              stat.tone === 'emerald' ? 'border-emerald-500' : 
              stat.tone === 'rose' ? 'border-rose-500' : 'border-slate-900'
            }`} />
            <CardHeader className="p-4 pb-2">
              <div className="flex justify-between items-start">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{stat.label}</p>
                <stat.icon className={`h-4 w-4 ${stat.tone === 'rose' ? 'text-rose-500' : stat.tone === 'emerald' ? 'text-emerald-500' : 'text-slate-900'}`} />
              </div>
              <CardTitle className="text-xl font-black text-slate-900 mt-1">{stat.value}</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className={`text-[10px] font-black uppercase tracking-tighter ${stat.tone === 'rose' ? 'text-rose-600' : stat.tone === 'emerald' ? 'text-emerald-600' : 'text-slate-500'}`}>
                {stat.sub}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Revenue vs Expense Chart */}
        <Card className="border-none shadow-sm bg-white overflow-hidden rounded-none">
          <div className="h-1 w-full border-t-4 border-slate-900" />
          <CardHeader className="p-4 border-b border-slate-50">
            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-slate-900">PENDAPATAN VS PENGELUARAN</CardTitle>
            <CardDescription className="text-[10px] font-bold text-slate-500 mt-0.5 uppercase tracking-tight">ANALISIS KOMPARATIF BULANAN NASIONAL</CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={scaledMonthlyRevenue} margin={{ top: 0, right: 0, left: -10, bottom: 0 }}>
                  <XAxis
                    dataKey="bulan"
                    stroke="#0f172a"
                    fontSize={9}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontWeight: 900, fill: '#64748b' }}
                  />
                  <YAxis
                    stroke="#0f172a"
                    fontSize={9}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
                    tick={{ fontWeight: 900, fill: '#64748b' }}
                  />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="rounded-none border-none bg-slate-900 p-3 shadow-2xl">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 border-b border-white/10 pb-1">{label}</p>
                            <div className="space-y-1">
                              <p className="text-xs font-black text-emerald-400 uppercase">
                                REV: {formatCurrency(payload[0].value as number)}
                              </p>
                              <p className="text-xs font-black text-rose-400 uppercase">
                                EXP: {formatCurrency(payload[1].value as number)}
                              </p>
                            </div>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Bar
                    dataKey="pendapatan"
                    fill="#10b981"
                    radius={[0, 0, 0, 0]}
                    barSize={24}
                  />
                  <Bar
                    dataKey="pengeluaran"
                    fill="#0f172a"
                    radius={[0, 0, 0, 0]}
                    barSize={24}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Cash Flow Trend */}
        <Card className="border-none shadow-sm bg-white overflow-hidden rounded-none">
          <div className="h-1 w-full border-t-4 border-slate-900" />
          <CardHeader className="p-4 border-b border-slate-50">
            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-slate-900">TREN LIKUIDITAS KAS</CardTitle>
            <CardDescription className="text-[10px] font-bold text-slate-500 mt-0.5 uppercase tracking-tight">PROYEKSI SALDO AKUMULATIF KONSOLIDASI</CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={cumulativeData} margin={{ top: 0, right: 0, left: -10, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="bulan"
                    stroke="#0f172a"
                    fontSize={9}
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontWeight: 900, fill: '#64748b' }}
                  />
                  <YAxis
                    stroke="#0f172a"
                    fontSize={9}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${(value / 1000000).toFixed(1)}M`}
                    tick={{ fontWeight: 900, fill: '#64748b' }}
                  />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="rounded-none border-none bg-slate-900 p-3 shadow-2xl">
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 border-b border-white/10 pb-1">{label}</p>
                            <p className="text-xs font-black text-emerald-400 uppercase">
                              LIQUID CASH: {formatCurrency(payload[0].value as number)}
                            </p>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="saldo"
                    stroke="#0f172a"
                    strokeWidth={4}
                    dot={{ r: 0 }}
                    activeDot={{ r: 6, fill: '#10b981', strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Report Types */}
      <Card className="border-none shadow-sm bg-white overflow-hidden rounded-none">
        <div className="h-1 w-full border-t-4 border-slate-900" />
        <CardHeader className="p-4 border-b border-slate-50">
          <CardTitle className="text-[10px] font-black uppercase tracking-widest text-slate-900">ARSIP LAPORAN AUDIT KONSOLIDASI</CardTitle>
          <CardDescription className="text-[10px] font-bold text-slate-500 mt-0.5 uppercase tracking-tight">PILIH DOKUMEN STRATEGIS UNTUK DIUNDUH</CardDescription>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { title: 'NERACA SALDO', sub: 'BALANCE SHEET (NATIONAL)', color: 'bg-slate-900' },
              { title: 'LABA RUGI', sub: 'INCOME STATEMENT (CONSOLIDATED)', color: 'bg-emerald-600' },
              { title: 'ARUS KAS', sub: 'CASH FLOW (LIQUIDITY INDEX)', color: 'bg-blue-600' },
            ].map((report, i) => (
              <div key={i} className="flex items-center justify-between rounded-none border border-slate-100 p-4 hover:border-slate-900 transition-colors group bg-slate-50/30">
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-none shadow-sm ${report.color}`}>
                    <FileText className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-black text-slate-900 uppercase tracking-tight">{report.title}</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{report.sub}</p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 rounded-none hover:bg-slate-900 hover:text-white transition-all text-slate-400"
                  onClick={() => toast({ title: "Document Download", description: `Mengunduh laporan ${report.title}...` })}
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
