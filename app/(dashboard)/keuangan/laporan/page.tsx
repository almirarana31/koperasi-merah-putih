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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/keuangan">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Laporan Keuangan</h1>
            <p className="text-muted-foreground">
              Ringkasan dan analisis keuangan koperasi
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Select defaultValue="2024">
            <SelectTrigger className="w-[120px]">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Tahun" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2024">2024</SelectItem>
              <SelectItem value="2023">2023</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export PDF
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Pemasukan</CardDescription>
            <CardTitle className="flex items-center gap-2 text-2xl text-emerald-500">
              <TrendingUp className="h-5 w-5" />
              {formatCurrency(totalPemasukan)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              +18% dari periode sebelumnya
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Pengeluaran</CardDescription>
            <CardTitle className="flex items-center gap-2 text-2xl text-red-500">
              <TrendingDown className="h-5 w-5" />
              {formatCurrency(totalPengeluaran)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              +8% dari periode sebelumnya
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Laba Kotor</CardDescription>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <FileText className="h-5 w-5 text-primary" />
              {formatCurrency(labaKotor)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">
              Margin: {((labaKotor / totalPemasukan) * 100).toFixed(1)}%
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Revenue vs Expense Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Pendapatan vs Pengeluaran</CardTitle>
            <CardDescription>Perbandingan bulanan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyRevenue}>
                  <XAxis
                    dataKey="bulan"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value / 1000000}jt`}
                  />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="rounded-lg border bg-background p-3 shadow-sm">
                            <p className="font-medium">{label}</p>
                            <div className="mt-2 space-y-1 text-sm">
                              <p className="text-emerald-500">
                                Pendapatan: {formatCurrency(payload[0].value as number)}
                              </p>
                              <p className="text-red-500">
                                Pengeluaran: {formatCurrency(payload[1].value as number)}
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
                    radius={[4, 4, 0, 0]}
                  />
                  <Bar
                    dataKey="pengeluaran"
                    fill="#06b6d4"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Cash Flow Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Tren Saldo Kas</CardTitle>
            <CardDescription>Perkembangan saldo bulanan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={cumulativeData}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="hsl(var(--border))"
                  />
                  <XAxis
                    dataKey="bulan"
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="hsl(var(--muted-foreground))"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value / 1000000}jt`}
                  />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="rounded-lg border bg-background p-3 shadow-sm">
                            <p className="font-medium">{label}</p>
                            <p className="text-sm text-primary">
                              Saldo: {formatCurrency(payload[0].value as number)}
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
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                    dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Report Types */}
      <Card>
        <CardHeader>
          <CardTitle>Jenis Laporan</CardTitle>
          <CardDescription>
            Pilih dan unduh laporan yang dibutuhkan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Neraca</p>
                  <p className="text-xs text-muted-foreground">Balance Sheet</p>
                </div>
              </div>
              <Button variant="ghost" size="icon">
                <Download className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
                  <FileText className="h-5 w-5 text-emerald-500" />
                </div>
                <div>
                  <p className="font-medium">Laba Rugi</p>
                  <p className="text-xs text-muted-foreground">Income Statement</p>
                </div>
              </div>
              <Button variant="ghost" size="icon">
                <Download className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center justify-between rounded-lg border p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                  <FileText className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="font-medium">Arus Kas</p>
                  <p className="text-xs text-muted-foreground">Cash Flow Statement</p>
                </div>
              </div>
              <Button variant="ghost" size="icon">
                <Download className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
