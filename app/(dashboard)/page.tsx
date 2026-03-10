'use client'

import Link from 'next/link'
import {
  Users,
  Package,
  Warehouse,
  TrendingUp,
  ShoppingCart,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  CreditCard,
  UserPlus,
  ShieldCheck,
  BarChart3,
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { StatsCard } from '@/components/stats-card'
import {
  dashboardStats,
  monthlyRevenue,
  commodityDistribution,
  recentActivities,
  formatCurrency,
} from '@/lib/data'
import {
  Bar,
  BarChart,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Pie,
  PieChart,
  Cell,
  Legend,
} from 'recharts'

const COLORS = [
  'var(--chart-1)',
  'var(--chart-2)',
  'var(--chart-3)',
  'var(--chart-4)',
  'var(--chart-5)',
]

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Selamat datang di KOPDES - Koperasi Digital Operating System
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Anggota"
          value={dashboardStats.totalAnggota.toString()}
          description="Petani, nelayan, UMKM"
          icon={Users}
          trend={{ value: 12, isPositive: true }}
        />
        <StatsCard
          title="Total Komoditas"
          value={dashboardStats.totalKomoditas.toString()}
          description="Jenis komoditas aktif"
          icon={Package}
        />
        <StatsCard
          title="Stok Gudang"
          value={`${(dashboardStats.totalStok / 1000).toFixed(1)} ton`}
          description={`Nilai: ${formatCurrency(dashboardStats.nilaiStok)}`}
          icon={Warehouse}
        />
        <StatsCard
          title="Pendapatan Bulan Ini"
          value={formatCurrency(dashboardStats.pendapatanBulanIni)}
          icon={TrendingUp}
          trend={{ value: 18, isPositive: true }}
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid gap-4 grid-cols-2 sm:grid-cols-3">
        <StatsCard
          title="Order Aktif"
          value={dashboardStats.orderAktif.toString()}
          description="Sedang diproses"
          icon={ShoppingCart}
        />
        <StatsCard
          title="Total Simpanan"
          value={formatCurrency(dashboardStats.simpananTotal)}
          description="Simpanan anggota"
          icon={Wallet}
        />
        <StatsCard
          title="Pinjaman Aktif"
          value={formatCurrency(dashboardStats.pinjamanAktif)}
          description="Outstanding pinjaman"
          icon={Wallet}
        />
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base sm:text-lg">Aksi Cepat</CardTitle>
          <CardDescription className="text-xs sm:text-sm">
            Akses cepat ke fitur utama koperasi
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
              <Link href="/anggota/onboarding">
                <CreditCard className="h-5 w-5 text-primary" />
                <span className="text-xs text-center">Onboarding KTP</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
              <Link href="/anggota/verifikasi">
                <ShieldCheck className="h-5 w-5 text-primary" />
                <span className="text-xs text-center">Verifikasi KYC</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
              <Link href="/keuangan/credit-scoring">
                <BarChart3 className="h-5 w-5 text-primary" />
                <span className="text-xs text-center">Credit Scoring</span>
              </Link>
            </Button>
            <Button variant="outline" className="h-auto py-4 flex-col gap-2" asChild>
              <Link href="/keuangan/pinjaman">
                <Wallet className="h-5 w-5 text-primary" />
                <span className="text-xs text-center">Ajukan Pinjaman</span>
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Charts Row */}
      <div className="grid gap-4 lg:grid-cols-7">
        {/* Revenue Chart */}
        <Card className="lg:col-span-4">
          <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-4">
            <CardTitle className="text-base sm:text-lg">Pendapatan & Pengeluaran</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              Tren pendapatan dan pengeluaran 6 bulan terakhir
            </CardDescription>
          </CardHeader>
          <CardContent className="p-2 sm:p-6 pt-0">
            <div className="h-[250px] sm:h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyRevenue}>
                  <XAxis
                    dataKey="bulan"
                    stroke="var(--muted-foreground)"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="var(--muted-foreground)"
                    fontSize={10}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `${value / 1000000}jt`}
                    width={40}
                  />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="rounded-lg border bg-background p-2 sm:p-3 shadow-sm text-xs sm:text-sm">
                            <p className="font-medium">{label}</p>
                            <div className="mt-1 sm:mt-2 space-y-1">
                              <p className="text-chart-1">
                                Pendapatan: {formatCurrency(payload[0].value as number)}
                              </p>
                              <p className="text-chart-2">
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
                    fill="#3b82f6"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Commodity Distribution */}
        <Card className="lg:col-span-3">
          <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-4">
            <CardTitle className="text-base sm:text-lg">Distribusi Komoditas</CardTitle>
            <CardDescription className="text-xs sm:text-sm">Berdasarkan kategori</CardDescription>
          </CardHeader>
          <CardContent className="p-2 sm:p-6 pt-0">
            <div className="h-[250px] sm:h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={commodityDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={70}
                    paddingAngle={2}
                    dataKey="nilai"
                    nameKey="nama"
                  >
                    {commodityDistribution.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    formatter={(value) => (
                      <span className="text-sm text-foreground">{value}</span>
                    )}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="rounded-lg border bg-background p-3 shadow-sm">
                            <p className="font-medium">{payload[0].name}</p>
                            <p className="text-sm text-muted-foreground">
                              {payload[0].value}%
                            </p>
                          </div>
                        )
                      }
                      return null
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Aktivitas Terbaru</CardTitle>
          <CardDescription>
            Update terkini dari sistem KOPDES
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div
                key={activity.id}
                className="flex items-center justify-between border-b border-border/50 pb-4 last:border-0 last:pb-0"
              >
                <div className="flex items-center gap-4">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                      activity.tipe === 'order'
                        ? 'bg-blue-500/10 text-blue-500'
                        : activity.tipe === 'produksi'
                        ? 'bg-emerald-500/10 text-emerald-500'
                        : activity.tipe === 'logistik'
                        ? 'bg-violet-500/10 text-violet-500'
                        : activity.tipe === 'keuangan'
                        ? 'bg-amber-500/10 text-amber-500'
                        : 'bg-primary/10 text-primary'
                    }`}
                  >
                    {activity.tipe === 'order' && <ShoppingCart className="h-5 w-5" />}
                    {activity.tipe === 'produksi' && <Package className="h-5 w-5" />}
                    {activity.tipe === 'logistik' && (
                      <ArrowUpRight className="h-5 w-5" />
                    )}
                    {activity.tipe === 'keuangan' && <Wallet className="h-5 w-5" />}
                    {activity.tipe === 'gudang' && <Warehouse className="h-5 w-5" />}
                  </div>
                  <div>
                    <p className="text-sm font-medium">{activity.aksi}</p>
                    <p className="text-xs text-muted-foreground">
                      {activity.waktu}
                    </p>
                  </div>
                </div>
                <Badge
                  variant="secondary"
                  className="capitalize"
                >
                  {activity.tipe}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
