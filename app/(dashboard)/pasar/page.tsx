'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  Clock,
  Download,
  FileText,
  Search,
  ShieldAlert,
  ShoppingCart,
  Store,
  TrendingUp,
  Users,
} from 'lucide-react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useAuth } from '@/lib/auth/use-auth'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { KementerianFilterBar } from '@/components/dashboard/kementerian-filter-bar'
import {
  filterOrdersByScope,
  getBuyersFromOrders,
  getMonthlyOrderSeries,
  resolveOperationalFilters,
} from '@/lib/cross-entity-operations'
import type { ScopeFilters } from '@/lib/kementerian-dashboard-data'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { DataTable, type DataTableColumn } from '@/components/ui/data-table'
import { toast } from 'sonner'

type Order = ReturnType<typeof filterOrdersByScope>[number]

function formatCurrency(value: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value)
}

const STATUS_BADGE: Record<string, string> = {
  pending: 'border-warning/30 bg-warning/10 text-[color:var(--warning)]',
  diproses: 'border-tertiary/30 bg-[color:var(--dashboard-tertiary-soft)] text-[color:var(--dashboard-tertiary)]',
  dikirim: 'border-tertiary/30 bg-[color:var(--dashboard-tertiary-soft)] text-[color:var(--dashboard-tertiary)]',
  selesai: 'border-success/30 bg-success/10 text-[color:var(--success)]',
}

export default function PasarPage() {
  const { user } = useAuth()
  const isKementerian = user?.role === 'kementerian'
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [filters, setFilters] = useState<ScopeFilters>({
    provinceId: 'all',
    regionId: 'all',
    villageId: 'all',
    cooperativeId: 'all',
    commodityId: 'all',
  })

  const scopedFilters = resolveOperationalFilters(user, filters)
  const scaleFactor = useMemo(() => {
    if (filters.cooperativeId !== 'all') return 0.05
    if (filters.villageId !== 'all') return 0.1
    if (filters.regionId !== 'all') return 0.25
    if (filters.provinceId !== 'all') return 0.5
    return 1.0
  }, [filters])

  const scopedOrders = filterOrdersByScope(scopedFilters)
  const filteredOrders = useMemo(() => {
    return scopedOrders.filter((order) => {
      const keyword = search.toLowerCase()
      const matchesSearch =
        order.orderNumber.toLowerCase().includes(keyword) ||
        order.buyerName.toLowerCase().includes(keyword) ||
        order.cooperativeName.toLowerCase().includes(keyword)
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter
      return matchesSearch && matchesStatus
    })
  }, [scopedOrders, search, statusFilter])

  const monthlySeries = useMemo(() => {
    return getMonthlyOrderSeries(filteredOrders).map((item) => ({
      name: item.month.replace(' 2026', ''),
      revenue: Math.round((item.revenue * scaleFactor) / 1_000_000),
    }))
  }, [filteredOrders, scaleFactor])

  const regionalComparison = useMemo(() => {
    return [
      ...new Map(
        filteredOrders.map((order) => [
          order.regionId,
          {
            region: order.regionName,
            revenue:
              filteredOrders
                .filter((item) => item.regionId === order.regionId)
                .reduce((total, item) => total + item.totalValue, 0) * scaleFactor,
            orders: Math.round(
              filteredOrders.filter((item) => item.regionId === order.regionId).length * scaleFactor,
            ),
          },
        ]),
      ).values(),
    ].sort((left, right) => right.revenue - left.revenue)
  }, [filteredOrders, scaleFactor])

  const buyers = getBuyersFromOrders(filteredOrders)
  const totalRevenue = useMemo(
    () => filteredOrders.reduce((total, order) => total + order.totalValue, 0) * scaleFactor,
    [filteredOrders, scaleFactor],
  )
  const activeOrders = Math.round(
    filteredOrders.filter((order) => order.status !== 'selesai').length * scaleFactor,
  )
  const displayOrderCount = Math.round(filteredOrders.length * scaleFactor)
  const avgOrderValue = displayOrderCount === 0 ? 0 : totalRevenue / displayOrderCount

  const handleAction = (action: string) => {
    toast.success(`Aksi ${action} berhasil diverifikasi secara nasional.`)
  }

  const kpis = [
    {
      label: 'Nilai Transaksi',
      value: `${(totalRevenue / 1_000_000).toFixed(1)} Jt`,
      sub: 'IDR',
      icon: ShoppingCart,
      tone: 'secondary' as const,
    },
    {
      label: 'Order Aktif',
      value: activeOrders.toLocaleString('id-ID'),
      sub: 'pesanan berjalan',
      icon: Clock,
      tone: 'success' as const,
    },
    {
      label: 'Buyer Terhubung',
      value: Math.round(buyers.length * scaleFactor).toLocaleString('id-ID'),
      sub: 'mitra niaga',
      icon: Users,
      tone: 'tertiary' as const,
    },
    {
      label: 'Rata-rata Order',
      value: `${(avgOrderValue / 1_000_000).toFixed(1)} Jt`,
      sub: 'per PO',
      icon: FileText,
      tone: 'primary' as const,
    },
  ]

  const columns: DataTableColumn<Order>[] = [
    {
      key: 'orderNumber',
      header: 'No PO',
      cell: (order) => <span className="font-mono text-xs text-muted-foreground">{order.orderNumber}</span>,
    },
    {
      key: 'buyer',
      header: 'Buyer / Tujuan',
      cell: (order) => (
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">{order.buyerName}</p>
          <p className="truncate text-xs text-muted-foreground">{order.destinationRegion}</p>
        </div>
      ),
    },
    {
      key: 'cooperative',
      header: 'Koperasi / Asal',
      cell: (order) => (
        <div className="min-w-0">
          <p className="truncate text-sm text-foreground">{order.cooperativeName}</p>
          <p className="truncate text-xs text-muted-foreground">{order.villageName}</p>
        </div>
      ),
    },
    {
      key: 'commodity',
      header: 'Komoditas',
      cell: (order) => <span className="text-sm">{order.commodityName}</span>,
    },
    {
      key: 'volume',
      header: 'Volume',
      align: 'right',
      cell: (order) => (
        <span className="tabular-nums">{(order.quantityKg * scaleFactor).toLocaleString('id-ID')} kg</span>
      ),
    },
    {
      key: 'value',
      header: 'Nilai',
      align: 'right',
      cell: (order) => (
        <span className="tabular-nums font-medium">{formatCurrency(order.totalValue * scaleFactor)}</span>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      align: 'center',
      cell: (order) => (
        <Badge variant="outline" className={STATUS_BADGE[order.status] ?? ''}>
          {order.status}
        </Badge>
      ),
    },
  ]

  return (
    <div className="page-shell">
      {/* Header */}
      <div className="page-header surface-card flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary/10 text-primary">
            <Store className="h-6 w-6" />
          </div>
          <div>
            <h1 className="page-title">Analitik Pasar Nasional</h1>
            <p className="page-subtitle">
              Monitoring arus komoditas & valuasi niaga · {displayOrderCount.toLocaleString('id-ID')} purchase order
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => handleAction('Audit Pasar')}>
            <ShieldAlert className="mr-2 h-4 w-4 text-destructive" /> Audit pasar
          </Button>
          <Button size="sm" onClick={() => handleAction('Ekspor PDF')}>
            <Download className="mr-2 h-4 w-4" /> Ekspor PDF
          </Button>
        </div>
      </div>

      {isKementerian && <KementerianFilterBar filters={filters} setFilters={setFilters} />}

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {kpis.map((kpi) => (
          <Card key={kpi.label} className={`card-accent card-accent-${kpi.tone}`}>
            <CardContent className="flex items-center gap-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted">
                <kpi.icon className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="min-w-0">
                <p className="metric-label">{kpi.label}</p>
                <p className="metric-value mt-1 truncate">{kpi.value}</p>
                <p className="text-xs text-muted-foreground">{kpi.sub}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="card-accent card-accent-success">
          <CardHeader>
            <CardTitle>Tren Omzet Bulanan</CardTitle>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlySeries}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip formatter={(val: number) => [`${val.toLocaleString('id-ID')} Jt`, 'Revenue']} />
                <Bar dataKey="revenue" fill="var(--success)" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="card-accent card-accent-tertiary">
          <CardHeader>
            <CardTitle>Performa Wilayah Niaga</CardTitle>
          </CardHeader>
          <CardContent className="max-h-[300px] space-y-2 overflow-y-auto">
            {regionalComparison.map((region, idx) => (
              <div
                key={`${region.region}-${idx}`}
                className="surface-card-muted flex items-center justify-between p-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-foreground">{region.region}</p>
                  <p className="text-xs text-muted-foreground">{region.orders} PO selesai</p>
                </div>
                <p className="text-sm font-semibold tabular-nums">{(region.revenue / 1_000_000).toFixed(1)} Jt</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Filter bar */}
      <Card>
        <CardContent>
          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Cari nomor PO, buyer, atau koperasi…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua status</SelectItem>
                  <SelectItem value="pending">Tertunda</SelectItem>
                  <SelectItem value="diproses">Diproses</SelectItem>
                  <SelectItem value="dikirim">Dikirim</SelectItem>
                  <SelectItem value="selesai">Selesai</SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={() => handleAction('Buat Order')}>
                <ShoppingCart className="mr-2 h-4 w-4" /> Buat pesanan
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orders table */}
      <Card className="card-accent card-accent-primary">
        <CardHeader>
          <CardTitle>Daftar Purchase Order</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            data={filteredOrders}
            columns={columns}
            rowKey={(order) => order.id}
            empty="Tidak ada order yang cocok dengan filter."
          />
        </CardContent>
      </Card>

      {/* Footer nav */}
      <div className="grid gap-4 md:grid-cols-3">
        {[
          { label: 'Direktori Buyer', icon: Users, path: '/pasar/buyer' },
          { label: 'Katalog SKU', icon: Store, path: '/pasar/katalog' },
          { label: 'Indeks Harga', icon: TrendingUp, path: '/pasar/harga' },
        ].map((link) => (
          <Link key={link.path} href={link.path} className="group">
            <Card className="transition-colors hover:border-primary/40">
              <CardContent className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted text-muted-foreground transition-colors group-hover:text-primary">
                    <link.icon className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-semibold text-foreground">{link.label}</span>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
