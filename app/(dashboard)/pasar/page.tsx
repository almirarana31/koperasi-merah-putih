'use client'

import { useState } from 'react'
import Link from 'next/link'
import { FileText, Search, ShoppingCart, Store, TrendingUp, Users } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import { useAuth } from '@/lib/auth/use-auth'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { KementerianFilterBar } from '@/components/dashboard/kementerian-filter-bar'
import {
  filterOrdersByScope,
  getBuyersFromOrders,
  getMonthlyOrderSeries,
  getScopeCaption,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

function formatCurrency(value: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value)
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function statusTone(status: string) {
  if (status === 'selesai') return 'bg-emerald-50 text-emerald-700 border-emerald-200'
  if (status === 'dikirim') return 'bg-blue-50 text-blue-700 border-blue-200'
  if (status === 'diproses') return 'bg-amber-50 text-amber-700 border-amber-200'
  return 'bg-slate-100 text-slate-700 border-slate-200'
}

export default function PasarPage() {
  const { user } = useAuth()
  const showHierarchyFilter = user?.role === 'kementerian' || user?.role === 'pemda' || user?.role === 'sysadmin'

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
  const scopedOrders = filterOrdersByScope(scopedFilters)
  const filteredOrders = scopedOrders.filter((order) => {
    const keyword = search.toLowerCase()
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(keyword) ||
      order.buyerName.toLowerCase().includes(keyword) ||
      order.cooperativeName.toLowerCase().includes(keyword)
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const monthlySeries = getMonthlyOrderSeries(filteredOrders).map((item) => ({
    name: item.month.replace(' 2026', ''),
    revenue: Math.round(item.revenue / 1_000_000),
  }))

  const regionalComparison = [...new Map(
    filteredOrders.map((order) => [
      order.regionId,
      {
        region: order.regionName,
        revenue: filteredOrders
          .filter((item) => item.regionId === order.regionId)
          .reduce((total, item) => total + item.totalValue, 0),
        orders: filteredOrders.filter((item) => item.regionId === order.regionId).length,
      },
    ]),
  ).values()].sort((left, right) => right.revenue - left.revenue)

  const buyers = getBuyersFromOrders(filteredOrders)
  const totalRevenue = filteredOrders.reduce((total, order) => total + order.totalValue, 0)
  const activeOrders = filteredOrders.filter((order) => order.status !== 'selesai').length
  const avgOrderValue = filteredOrders.length === 0 ? 0 : totalRevenue / filteredOrders.length

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <Badge className="w-fit border border-emerald-200 bg-emerald-50 text-emerald-700">Pasar Multi-Desa</Badge>
          <div>
            <h1 className="text-slate-900">Monitoring Order Pasar</h1>
            <p className="text-muted-foreground">
              Order, buyer aktif, dan pembanding wilayah untuk {getScopeCaption(scopedFilters)}.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" asChild>
            <Link href="/pasar/buyer">
              <Users className="mr-2 h-4 w-4" />
              Buyer
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/pasar/katalog">
              <Store className="mr-2 h-4 w-4" />
              Katalog
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/pasar/harga">
              <TrendingUp className="mr-2 h-4 w-4" />
              Harga Pasar
            </Link>
          </Button>
        </div>
      </div>

      {showHierarchyFilter && <KementerianFilterBar filters={filters} setFilters={setFilters} />}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="border-slate-200 bg-white">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Nilai Order</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{formatCurrency(totalRevenue)}</p>
            <p className="mt-2 text-sm text-muted-foreground">Seluruh order yang cocok dengan filter</p>
          </CardContent>
        </Card>
        <Card className="border-slate-200 bg-white">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Order Aktif</p>
            <p className="mt-2 text-3xl font-semibold text-blue-600">{activeOrders}</p>
            <p className="mt-2 text-sm text-muted-foreground">Belum selesai dipenuhi</p>
          </CardContent>
        </Card>
        <Card className="border-slate-200 bg-white">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Buyer Terhubung</p>
            <p className="mt-2 text-3xl font-semibold text-emerald-600">{buyers.length}</p>
            <p className="mt-2 text-sm text-muted-foreground">Buyer muncul dari transaksi dalam scope</p>
          </CardContent>
        </Card>
        <Card className="border-slate-200 bg-white">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Nilai Rata-rata</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{formatCurrency(avgOrderValue)}</p>
            <p className="mt-2 text-sm text-muted-foreground">Per order setelah kombinasi filter</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-200 bg-white">
        <CardContent className="p-4">
          <div className="grid gap-3 lg:grid-cols-[1.2fr_220px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Cari nomor PO, koperasi, atau buyer"
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Semua Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="diproses">Diproses</SelectItem>
                <SelectItem value="dikirim">Dikirim</SelectItem>
                <SelectItem value="selesai">Selesai</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-5">
        <Card className="border-slate-200 bg-white">
          <CardHeader>
            <CardTitle>Pendapatan Bulanan</CardTitle>
            <CardDescription>Agregat revenue Pasar berubah langsung sesuai filter desa, koperasi, dan komoditas.</CardDescription>
          </CardHeader>
          <CardContent className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlySeries}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="name" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Bar dataKey="revenue" fill="#16a34a" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white">
          <CardHeader>
            <CardTitle>Perbandingan Wilayah</CardTitle>
            <CardDescription>Wilayah dibangun dari order yang ada, bukan angka statis per halaman.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {regionalComparison.map((region) => (
              <div key={region.region} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-slate-900">{region.region}</p>
                  <Badge variant="outline" className="border-slate-200 bg-white text-slate-700">
                    {region.orders} order
                  </Badge>
                </div>
                <p className="mt-2 text-lg font-semibold text-slate-900">{formatCurrency(region.revenue)}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-200 bg-white">
        <CardHeader>
          <CardTitle>Daftar Order</CardTitle>
          <CardDescription>{filteredOrders.length} order tampil dari jaringan multi-desa yang sama.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No. PO</TableHead>
                <TableHead>Buyer</TableHead>
                <TableHead>Koperasi</TableHead>
                <TableHead>Komoditas</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead className="text-right">Volume</TableHead>
                <TableHead className="text-right">Nilai</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-mono text-sm">{order.orderNumber}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-slate-900">{order.buyerName}</p>
                      <p className="text-sm text-muted-foreground">{order.destinationRegion}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-slate-900">{order.cooperativeName}</p>
                      <p className="text-sm text-muted-foreground">{order.villageName}</p>
                    </div>
                  </TableCell>
                  <TableCell>{order.commodityName}</TableCell>
                  <TableCell>{formatDate(order.createdAt)}</TableCell>
                  <TableCell className="text-right font-medium">{order.quantityKg.toLocaleString('id-ID')} kg</TableCell>
                  <TableCell className="text-right">{formatCurrency(order.totalValue)}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={statusTone(order.status)}>
                      {order.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="border-slate-200 bg-slate-50">
        <CardContent className="flex flex-col gap-4 p-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-3">
            <div className="rounded-2xl bg-white p-3 shadow-sm">
              <ShoppingCart className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="font-medium text-slate-900">Pasar Tersinkron</p>
              <p className="text-sm text-muted-foreground">
                Overview order ini menjadi sumber pembanding yang sama untuk Harga, Buyer, Marketplace, dan Katalog.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <FileText className="h-4 w-4" />
            <span>{scopedOrders.length} order mentah tersambung ke scope</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
