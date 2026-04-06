'use client'

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
  const totalPemasukan = transactions.reduce((sum, t) => sum + t.kredit, 0)
  const totalPengeluaran = transactions.reduce((sum, t) => sum + t.debit, 0)
  const labaKotor = totalPemasukan - totalPengeluaran

  // Calculate cumulative balance for line chart
  const cumulativeData = monthlyRevenue.map((item, index) => {
    const prevTotal =
      index > 0
        ? monthlyRevenue
            .slice(0, index)
            .reduce((sum, m) => sum + (m.pendapatan - m.pengeluaran), 0)
        : 0
    return {
      ...item,
      saldo: 150000000 + prevTotal + (item.pendapatan - item.pengeluaran),
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
            <h1 className="text-2xl font-semibold  text-slate-900 ">Laporan Keuangan</h1>
            <p className="text-xs font-bold text-slate-500   mt-1">
              Analisis performa & audit keuangan nasional
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Select defaultValue="2024">
            <SelectTrigger className="h-8 w-[100px] text-xs font-semibold   border-slate-200">
              <Calendar className="mr-2 h-3 w-3" />
              <SelectValue placeholder="Tahun" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024" className="text-xs font-bold">2024</SelectItem>
              <SelectItem value="2023" className="text-xs font-bold">2023</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" className="h-8 text-xs font-semibold   text-slate-600">
            <Download className="mr-2 h-3.5 w-3.5" />
            Export Audit PDF
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {[
          { label: 'Total Pemasukan', value: formatCurrency(totalPemasukan), sub: '+18% vs bln lalu', icon: TrendingUp, tone: 'emerald' },
          { label: 'Total Pengeluaran', value: formatCurrency(totalPengeluaran), sub: '+8% vs bln lalu', icon: TrendingDown, tone: 'rose' },
          { label: 'Laba Bersih (EBITDA)', value: formatCurrency(labaKotor), sub: `Margin: ${((labaKotor / totalPemasukan) * 100).toFixed(1)}%`, icon: FileText, tone: 'slate' },
        ].map((stat, i) => (
          <Card key={i} className="border-none shadow-[0_4px_12px_-4px_rgba(0,0,0,0.05)] overflow-hidden">
            <CardHeader className="p-4 pb-2">
              <div className="flex justify-between items-start">
                <p className="text-xs font-semibold text-slate-400  ">{stat.label}</p>
                <stat.icon className={`h-4 w-4 ${stat.tone === 'rose' ? 'text-rose-500' : stat.tone === 'emerald' ? 'text-emerald-500' : 'text-slate-400'}`} />
              </div>
              <CardTitle className="text-2xl font-semibold text-slate-900  mt-1">{stat.value}</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className={`text-xs font-bold ${stat.tone === 'rose' ? 'text-rose-600' : stat.tone === 'emerald' ? 'text-emerald-600' : 'text-slate-500'}`}>
                {stat.sub}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Revenue vs Expense Chart */}
        <Card className="border-none shadow-[0_4px_12px_-4px_rgba(0,0,0,0.05)] overflow-hidden">
          <CardHeader className="p-4 border-b border-slate-50 bg-slate-50/50">
            <CardTitle className="text-xs font-semibold text-slate-900  ">Pendapatan vs Pengeluaran</CardTitle>
            <CardDescription className="text-xs font-bold text-slate-500   mt-0.5">Analisis Komparatif Bulanan</CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyRevenue} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <XAxis
                    dataKey="bulan"
                    stroke="#94a3b8"
                    fontSize={9}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#94a3b8"
                    fontSize={9}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value / 1000000}M`}
                  />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="rounded-none border-none bg-slate-900 p-2 shadow-xl">
                            <p className="text-xs font-semibold text-slate-400   mb-1">{label}</p>
                            <div className="space-y-0.5">
                              <p className="text-xs font-semibold text-emerald-400">
                                REV: {formatCurrency(payload[0].value as number)}
                              </p>
                              <p className="text-xs font-semibold text-rose-400">
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
                    radius={[2, 2, 0, 0]}
                    barSize={20}
                  />
                  <Bar
                    dataKey="pengeluaran"
                    fill="#0f172a"
                    radius={[2, 2, 0, 0]}
                    barSize={20}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Cash Flow Trend */}
        <Card className="border-none shadow-[0_4px_12px_-4px_rgba(0,0,0,0.05)] overflow-hidden">
          <CardHeader className="p-4 border-b border-slate-50 bg-slate-50/50">
            <CardTitle className="text-xs font-semibold text-slate-900  ">Tren Likuiditas Kas</CardTitle>
            <CardDescription className="text-xs font-bold text-slate-500   mt-0.5">Proyeksi Saldo Akumulatif</CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={cumulativeData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis
                    dataKey="bulan"
                    stroke="#94a3b8"
                    fontSize={9}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#94a3b8"
                    fontSize={9}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value / 1000000}M`}
                  />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="rounded-none border-none bg-slate-900 p-2 shadow-xl">
                            <p className="text-xs font-semibold text-slate-400   mb-1">{label}</p>
                            <p className="text-xs font-semibold text-emerald-400">
                              CASH: {formatCurrency(payload[0].value as number)}
                            </p>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                  <Line
                    type="stepAfter"
                    dataKey="saldo"
                    stroke="#0f172a"
                    strokeWidth={3}
                    dot={{ r: 3, fill: '#0f172a', strokeWidth: 0 }}
                    activeDot={{ r: 5, strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Report Types */}
      <Card className="border-none shadow-[0_4px_12px_-4px_rgba(0,0,0,0.05)] overflow-hidden">
        <CardHeader className="p-4 border-b border-slate-50 bg-slate-50/50">
          <CardTitle className="text-xs font-semibold text-slate-900  ">Arsip Laporan Audit</CardTitle>
          <CardDescription className="text-xs font-bold text-slate-500   mt-0.5">Pilih dokumen untuk diunduh</CardDescription>
        </CardHeader>
        <CardContent className="p-4">
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { title: 'Neraca Saldo', sub: 'Balance Sheet', color: 'bg-slate-900' },
              { title: 'Laba Rugi', sub: 'Income Statement', color: 'bg-emerald-600' },
              { title: 'Arus Kas', sub: 'Cash Flow', color: 'bg-cyan-600' },
            ].map((report, i) => (
              <div key={i} className="flex items-center justify-between rounded border border-slate-100 p-4 hover:border-slate-200 transition-colors group">
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded shadow-sm ${report.color}`}>
                    <FileText className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900  ">{report.title}</p>
                    <p className="text-xs font-bold text-slate-400  ">{report.sub}</p>
                  </div>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-slate-100 group-hover:text-slate-900 text-slate-400">
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
