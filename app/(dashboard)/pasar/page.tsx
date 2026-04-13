'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { 
  Clock, 
  FileText, 
  Search, 
  ShoppingCart, 
  Store, 
  TrendingUp, 
  Users,
  Package,
  Activity,
  ShieldAlert,
  Download,
  ArrowRight
} from 'lucide-react'
import { 
  Bar, 
  BarChart, 
  CartesianGrid, 
  ResponsiveContainer, 
  XAxis, 
  YAxis,
  Tooltip
} from 'recharts'
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
import { toast } from 'sonner'

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
  })
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
      name: item.month.replace(' 2026', '').toUpperCase(),
      revenue: Math.round((item.revenue * scaleFactor) / 1_000_000),
    }))
  }, [filteredOrders, scaleFactor])

  const regionalComparison = useMemo(() => {
    return [...new Map(
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
  }, [filteredOrders, scaleFactor])

  const buyers = getBuyersFromOrders(filteredOrders)
  const totalRevenue = useMemo(() => filteredOrders.reduce((total, order) => total + order.totalValue, 0) * scaleFactor, [filteredOrders, scaleFactor])
  const activeOrders = Math.round(filteredOrders.filter((order) => order.status !== 'selesai').length * scaleFactor)
  const displayOrderCount = Math.round(filteredOrders.length * scaleFactor)
  const avgOrderValue = displayOrderCount === 0 ? 0 : totalRevenue / displayOrderCount

  const handleAction = (action: string) => {
    toast.success(`Aksi ${action} berhasil diverifikasi secara nasional`)
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-none bg-slate-900 flex items-center justify-center shadow-xl">
            <Store className="h-7 w-7 text-emerald-500" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Analitik Pasar Nasional</h1>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">
              Monitoring Arus Komoditas & Valuasi Niaga • {displayOrderCount} Purchase Order
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleAction('Audit Pasar')}
            className="h-10 rounded-none text-[10px] font-black uppercase tracking-widest text-slate-600 border-slate-200 shadow-none"
          >
            <ShieldAlert className="h-4 w-4 mr-2 text-rose-600" />
            Audit Pasar
          </Button>
          <Button 
            size="sm" 
            onClick={() => handleAction('PDF')}
            className="h-10 rounded-none bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-black uppercase tracking-widest px-6 shadow-none"
          >
            <Download className="h-4 w-4 mr-2" />
            Eksport PDF
          </Button>
        </div>
      </div>

      <KementerianFilterBar filters={filters} setFilters={setFilters} />

      {/* High-Density KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Nilai Transaksi', value: (totalRevenue / 1000000).toFixed(1), sub: 'JUTA IDR', icon: ShoppingCart, color: 'text-slate-900' },
          { label: 'Order Aktif', value: activeOrders.toLocaleString(), sub: 'PESANAN BERJALAN', icon: Clock, color: 'text-emerald-600' },
          { label: 'Buyer Terhubung', value: Math.round(buyers.length * scaleFactor).toLocaleString(), sub: 'MITRA NIAGA', icon: Users, color: 'text-blue-600' },
          { label: 'Rata-Rata Order', value: (avgOrderValue / 1000000).toFixed(1), sub: 'JUTA PER PO', icon: FileText, color: 'text-blue-400' },
        ].map((s, i) => (
          <Card key={i} className="rounded-none border-none shadow-sm bg-white overflow-hidden">
            <div className={`h-1.5 w-full ${s.color.includes('emerald') ? 'bg-emerald-500' : s.color.includes('blue') ? 'bg-blue-500' : 'bg-slate-900'}`} />
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-10 w-10 rounded-none bg-slate-50 flex items-center justify-center border border-slate-100">
                <s.icon className={`h-5 w-5 ${s.color}`} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.label}</p>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className={`text-xl font-black ${s.color}`}>{s.value}</span>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">{s.sub}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="rounded-none border-none shadow-sm bg-white overflow-hidden">
          <CardHeader className="p-5 border-b border-slate-50">
            <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-900">Tren Omzet Bulanan</CardTitle>
          </CardHeader>
          <CardContent className="p-4 h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlySeries}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" fontSize={9} fontWeight={900} axisLine={false} tickLine={false} />
                <YAxis fontSize={9} fontWeight={900} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: '0px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontSize: '10px', fontWeight: 900 }}
                  formatter={(val: number) => [`${val.toLocaleString()} JT`, 'REVENUE']}
                />
                <Bar dataKey="revenue" fill="#16a34a" radius={[0, 0, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="rounded-none border-none shadow-sm bg-white overflow-hidden">
          <CardHeader className="p-5 border-b border-slate-50">
            <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-900">Performa Wilayah Niaga</CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-3 max-h-[300px] overflow-y-auto">
            {regionalComparison.map((region, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-none border border-slate-100">
                <div>
                  <p className="text-xs font-black text-slate-900 uppercase">{region.region}</p>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">{region.orders} PO SELESAI</p>
                </div>
                <p className="text-sm font-black text-slate-900">{(region.revenue / 1000000).toFixed(1)} JT</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Search & Action Bar */}
      <Card className="rounded-none border-none shadow-sm bg-slate-50/50">
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                placeholder="Cari nomor PO, buyer, atau koperasi..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-none pl-9 bg-white border-slate-200 h-11 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px] rounded-none h-11 bg-white border-slate-200 text-[10px] font-black uppercase tracking-widest">
                  <SelectValue placeholder="STATUS" />
                </SelectTrigger>
                <SelectContent className="rounded-none border-slate-200">
                  <SelectItem value="all">SEMUA STATUS</SelectItem>
                  <SelectItem value="pending">TERTUNDA</SelectItem>
                  <SelectItem value="diproses">DIPROSES</SelectItem>
                  <SelectItem value="dikirim">DIKIRIM</SelectItem>
                  <SelectItem value="selesai">SELESAI</SelectItem>
                </SelectContent>
              </Select>
              <Button 
                onClick={() => handleAction('Buat Order')}
                className="rounded-none h-11 bg-slate-900 text-white font-black text-[10px] uppercase tracking-widest px-6 shadow-none"
              >
                <ShoppingCart className="h-4 w-4 mr-2" /> Buat Pesanan
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Data Table */}
      <Card className="rounded-none border-none shadow-sm overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-100">
              <TableRow className="border-none bg-slate-100 hover:bg-slate-100">
                <TableHead className="h-12 px-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">NO PO</TableHead>
                <TableHead className="h-12 px-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">BUYER / TUJUAN</TableHead>
                <TableHead className="h-12 px-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">KOPERASI / ASAL</TableHead>
                <TableHead className="h-12 px-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">KOMODITAS</TableHead>
                <TableHead className="h-12 px-6 text-right text-[10px] font-black text-slate-500 uppercase tracking-widest">VOLUME</TableHead>
                <TableHead className="h-12 px-6 text-right text-[10px] font-black text-slate-500 uppercase tracking-widest">NILAI</TableHead>
                <TableHead className="h-12 px-6 text-center text-[10px] font-black text-slate-500 uppercase tracking-widest">STATUS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.slice(0, 15).map((order) => (
                <TableRow key={order.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                  <TableCell className="px-6 py-4 font-mono text-[10px] font-black text-slate-400">{order.orderNumber}</TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-xs font-black text-slate-900 uppercase tracking-tight">{order.buyerName}</span>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{order.destinationRegion}</span>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-xs font-black text-slate-600 uppercase tracking-tight">{order.cooperativeName}</span>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{order.villageName}</span>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-xs font-black text-slate-900 uppercase">{order.commodityName}</TableCell>
                  <TableCell className="px-6 py-4 text-right">
                    <span className="text-xs font-black text-slate-900">{(order.quantityKg * scaleFactor).toLocaleString()} KG</span>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right text-xs font-black text-slate-900">
                    {formatCurrency(order.totalValue * scaleFactor)}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-center">
                    <Badge className="rounded-none border-none shadow-none text-[9px] font-black uppercase tracking-widest px-2 h-5 bg-slate-100 text-slate-700">
                      {order.status.toUpperCase()}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Navigation Footer */}
      <div className="grid gap-4 md:grid-cols-3">
        {[
          { label: 'Direktori Buyer', icon: Users, path: '/pasar/buyer' },
          { label: 'Katalog SKU', icon: Store, path: '/pasar/katalog' },
          { label: 'Indeks Harga', icon: TrendingUp, path: '/pasar/harga' },
        ].map((link) => (
          <Link key={link.path} href={link.path} className="group">
            <Card className="rounded-none border-slate-200 hover:border-slate-900 transition-all bg-white overflow-hidden">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 bg-slate-50 flex items-center justify-center border border-slate-100 text-slate-400 group-hover:text-slate-900 transition-colors">
                    <link.icon className="h-5 w-5" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-600 group-hover:text-slate-900">{link.label}</span>
                </div>
                <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-slate-900 group-hover:translate-x-1 transition-all" />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
