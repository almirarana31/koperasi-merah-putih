'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Clock, FileText, Search, ShoppingCart, Store, TrendingUp, Users } from 'lucide-react'
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
  const scaleFactor = filters.provinceId === 'all' ? 1.0 : filters.regionId === 'all' ? 0.4 : filters.villageId === 'all' ? 0.15 : 0.05
  
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
    revenue: Math.round((item.revenue * scaleFactor) / 1_000_000),
  }))

  const regionalComparison = [...new Map(
    filteredOrders.map((order) => [
      order.regionId,
      {
        region: order.regionName,
        revenue: filteredOrders
          .filter((item) => item.regionId === order.regionId)
          .reduce((total, item) => total + item.totalValue, 0) * scaleFactor,
        orders: Math.round(filteredOrders.filter((item) => item.regionId === order.regionId).length * scaleFactor),
      },
    ]),
  ).values()].sort((left, right) => right.revenue - left.revenue)

  const buyers = getBuyersFromOrders(filteredOrders)
  const totalRevenue = filteredOrders.reduce((total, order) => total + order.totalValue, 0) * scaleFactor
  const activeOrders = Math.round(filteredOrders.filter((order) => order.status !== 'selesai').length * scaleFactor)
  const displayOrderCount = Math.round(filteredOrders.length * scaleFactor)
  const avgOrderValue = displayOrderCount === 0 ? 0 : totalRevenue / displayOrderCount

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <Badge className="w-fit rounded-none border border-emerald-200 bg-emerald-50 text-emerald-700 font-bold uppercase tracking-wider text-[10px]">Pusat Niaga & Distribusi Nasional</Badge>
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 uppercase">Analitik Pasar Nasional</h1>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wide">
              Monitoring Arus Komoditas dan Valuasi Pasar: {getScopeCaption(scopedFilters)}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="rounded-none border-slate-200 font-black uppercase text-[10px] tracking-widest" asChild>
            <Link href="/pasar/buyer">
              <Users className="mr-2 h-3 w-3" />
              Direktori Buyer
            </Link>
          </Button>
          <Button variant="outline" className="rounded-none border-slate-200 font-black uppercase text-[10px] tracking-widest" asChild>
            <Link href="/pasar/katalog">
              <Store className="mr-2 h-3 w-3" />
              Katalog SKU
            </Link>
          </Button>
          <Button variant="outline" className="rounded-none border-slate-200 font-black uppercase text-[10px] tracking-widest" asChild>
            <Link href="/pasar/harga">
              <TrendingUp className="mr-2 h-3 w-3" />
              Indeks Harga
            </Link>
          </Button>
        </div>
      </div>

      {showHierarchyFilter && <KementerianFilterBar filters={filters} setFilters={setFilters} />}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'NILAI TRANSAKSI', value: formatCurrency(totalRevenue), sub: 'VALUASI PASAR AGREGAT', icon: ShoppingCart, tone: 'emerald' },
          { label: 'ORDER AKTIF', value: activeOrders.toLocaleString('id-ID'), sub: 'PESANAN DALAM PROSES', icon: Clock, tone: 'blue' },
          { label: 'BUYER TERHUBUNG', value: Math.round(buyers.length * scaleFactor).toLocaleString('id-ID'), sub: 'MITRA NIAGA STRATEGIS', icon: Users, tone: 'slate' },
          { label: 'RATA-RATA ORDER', value: formatCurrency(avgOrderValue), sub: 'NILAI TRANSAKSI PER PO', icon: FileText, tone: 'slate' },
        ].map((stat, i) => (
          <Card key={i} className="rounded-none border-none bg-white shadow-sm overflow-hidden group border-t-4 border-t-slate-900">
            <div className={`absolute top-0 left-0 h-1 w-full ${stat.tone === 'emerald' ? 'bg-emerald-500' : stat.tone === 'blue' ? 'bg-blue-500' : 'bg-slate-900'}`} />
            <CardHeader className="p-4 pb-2">
              <div className="flex justify-between items-start">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{stat.label}</p>
                <stat.icon className="h-4 w-4 text-slate-400 group-hover:text-slate-900 transition-colors" />
              </div>
              <CardTitle className="text-2xl font-black text-slate-900 mt-1">{stat.value}</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="text-[10px] font-bold text-slate-500 mt-1 uppercase tracking-tighter">{stat.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="rounded-none border-slate-200 shadow-sm">
        <CardContent className="p-4">
          <div className="grid gap-3 lg:grid-cols-[1.2fr_220px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Cari nomor PO, koperasi, atau buyer..."
                className="pl-9 rounded-none border-slate-200 font-semibold"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="rounded-none border-slate-200 font-semibold">
                <SelectValue placeholder="Semua Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="pending">Tertunda</SelectItem>
                <SelectItem value="diproses">Diproses</SelectItem>
                <SelectItem value="dikirim">Dikirim</SelectItem>
                <SelectItem value="selesai">Selesai</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card className="rounded-none border-slate-200 shadow-sm overflow-hidden border-t-4 border-t-slate-900">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100">
            <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-900">Trend Pendapatan Bulanan</CardTitle>
            <CardDescription className="text-[10px] font-bold text-slate-500 uppercase">Agregasi Omzet Pasar Nasional (Juta IDR)</CardDescription>
          </CardHeader>
          <CardContent className="h-[320px] p-4 pt-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlySeries}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }} />
                <Bar dataKey="revenue" fill="#16a34a" radius={0} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="rounded-none border-slate-200 shadow-sm overflow-hidden border-t-4 border-t-slate-900">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100">
            <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-900">Performa Wilayah Strategis</CardTitle>
            <CardDescription className="text-[10px] font-bold text-slate-500 uppercase">Perbandingan Omzet Lintas Kabupaten/Kota</CardDescription>
          </CardHeader>
          <CardContent className="p-4 overflow-y-auto max-h-[320px]">
            <div className="space-y-3">
              {regionalComparison.map((region) => (
                <div key={region.region} className="rounded-none border border-slate-100 bg-slate-50/50 p-3 flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-black text-slate-900 uppercase">{region.region}</p>
                    <p className="text-[10px] font-bold text-slate-500 uppercase mt-0.5">{region.orders} TRANSAKSI</p>
                  </div>
                  <p className="text-sm font-black text-slate-900">{formatCurrency(region.revenue)}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-none border-slate-200 shadow-sm overflow-hidden border-t-4 border-t-slate-900">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100">
          <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-900">Log Transaksi Pasar Terbaru</CardTitle>
          <CardDescription className="text-[10px] font-bold text-slate-500 uppercase">Daftar Purchase Order Jaringan Koperasi Nasional</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="text-[10px] font-black uppercase tracking-widest">No. PO</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest">Buyer/Tujuan</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest">Koperasi/Asal</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest">Komoditas</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest">Tanggal</TableHead>
                <TableHead className="text-right text-[10px] font-black uppercase tracking-widest">Volume</TableHead>
                <TableHead className="text-right text-[10px] font-black uppercase tracking-widest">Nilai</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.slice(0, 15).map((order) => (
                <TableRow key={order.id} className="hover:bg-slate-50/50 transition-colors">
                  <TableCell className="font-mono text-[11px] font-bold">{order.orderNumber}</TableCell>
                  <TableCell>
                    <div>
                      <p className="text-[11px] font-black text-slate-900 uppercase">{order.buyerName}</p>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">{order.destinationRegion}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="text-[11px] font-black text-slate-900 uppercase">{order.cooperativeName}</p>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">{order.villageName}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-[11px] font-bold uppercase">{order.commodityName}</TableCell>
                  <TableCell className="text-[11px] font-bold uppercase">{formatDate(order.createdAt)}</TableCell>
                  <TableCell className="text-right text-[11px] font-black">{(order.quantityKg * scaleFactor).toLocaleString('id-ID', { maximumFractionDigits: 1 })} KG</TableCell>
                  <TableCell className="text-right text-[11px] font-black">{formatCurrency(order.totalValue * scaleFactor)}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`rounded-none text-[9px] font-black uppercase tracking-widest ${statusTone(order.status)}`}>
                      {order.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="rounded-none border-none bg-slate-900 text-white shadow-xl">
        <CardContent className="flex flex-col gap-4 p-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-3">
            <div className="rounded-none bg-slate-800 p-3">
              <ShoppingCart className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-sm font-black uppercase tracking-widest text-white">Sinkronisasi Pasar Terintegrasi</p>
              <p className="text-xs font-bold text-slate-400 uppercase mt-1">
                Overview ini tersinkronisasi dengan modul Harga, Buyer, Marketplace, dan Katalog Nasional.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="rounded-none border-slate-700 bg-slate-800 text-slate-400 font-black text-[10px] uppercase tracking-widest px-3 py-1">
              {displayOrderCount} ORDER TERSAMBUNG
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}