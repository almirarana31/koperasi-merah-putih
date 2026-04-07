'use client'

import { useState } from 'react'
import Link from 'next/link'
import { MapPin, Navigation, Search, Truck } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import { useAuth } from '@/lib/auth/use-auth'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { KementerianFilterBar } from '@/components/dashboard/kementerian-filter-bar'
import {
  filterOrdersByScope,
  filterShipmentsByScope,
  getMonthlyOrderSeries,
  getScopeCaption,
  getShipmentPerformanceByRegion,
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
  if (status === 'delivered') return 'bg-emerald-50 text-emerald-700 border-emerald-200'
  if (status === 'transit') return 'bg-blue-50 text-blue-700 border-blue-200'
  if (status === 'pickup') return 'bg-amber-50 text-amber-700 border-amber-200'
  return 'bg-slate-100 text-slate-700 border-slate-200'
}

export default function LogistikPage() {
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
  const shipments = filterShipmentsByScope(scopedFilters).filter((shipment) => {
    const keyword = search.toLowerCase()
    const matchesSearch =
      shipment.orderNumber.toLowerCase().includes(keyword) ||
      shipment.driver.toLowerCase().includes(keyword) ||
      shipment.buyerName.toLowerCase().includes(keyword) ||
      shipment.routeTo.toLowerCase().includes(keyword)
    const matchesStatus = statusFilter === 'all' || shipment.status === statusFilter
    return matchesSearch && matchesStatus
  })
  const orders = filterOrdersByScope(scopedFilters)

  const activeShipments = shipments.filter((shipment) => shipment.status !== 'delivered').length
  const deliveredShipments = shipments.filter((shipment) => shipment.status === 'delivered').length
  const onTimeRate = shipments.length === 0 ? 0 : Math.round((shipments.filter((shipment) => shipment.onTime).length / shipments.length) * 100)
  const totalCost = shipments.reduce((total, shipment) => total + shipment.cost, 0)

  const monthlySeries = getMonthlyOrderSeries(orders).map((item) => ({
    name: item.month.replace(' 2026', ''),
    volume: Math.round(item.volumeKg / 100),
    orders: item.orders,
  }))

  const regionSeries = getShipmentPerformanceByRegion(shipments)

  const scaleFactor = filters.provinceId === 'all' ? 1 : filters.regionId === 'all' ? 0.3 : 0.1

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-slate-900">LOGISTICS COMMAND CENTER</h1>
          <p className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-widest">
            MONITORING ARUS DISTRIBUSI KOMODITAS NASIONAL
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" className="h-8 text-[10px] font-black border-slate-200" asChild>
            <Link href="/logistik/tracking">
              <Navigation className="mr-2 h-3.5 w-3.5" />
              LIVE TRACKING
            </Link>
          </Button>
          <Button variant="outline" size="sm" className="h-8 text-[10px] font-black border-slate-200" asChild>
            <Link href="/logistik/rute">
              <MapPin className="mr-2 h-3.5 w-3.5" />
              OPTIMAL ROUTE
            </Link>
          </Button>
        </div>
      </div>

      <KementerianFilterBar filters={filters} setFilters={setFilters} />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'PENGIRIMAN AKTIF', value: Math.floor(activeShipments * scaleFactor), sub: 'UNIT DALAM PERJALANAN', icon: Truck, tone: 'slate' },
          { label: 'PENGIRIMAN SELESAI', value: Math.floor(deliveredShipments * scaleFactor), sub: 'SUCCESSFUL DELIVERY', icon: Navigation, tone: 'emerald' },
          { label: 'ON-TIME RATE', value: `${onTimeRate}%`, sub: 'EFFICIENCY SCORE', icon: Activity, tone: 'blue' },
          { label: 'BIAYA DISTRIBUSI', value: formatCurrency(totalCost * scaleFactor), sub: 'AKUMULASI OPERASIONAL', icon: Truck, tone: 'slate' },
        ].map((stat, i) => (
          <Card key={i} className="border-none bg-white shadow-sm overflow-hidden group">
            <div className={`h-1 w-full ${stat.tone === 'emerald' ? 'bg-emerald-500' : stat.tone === 'blue' ? 'bg-blue-500' : 'bg-slate-900'}`} />
            <CardHeader className="p-4 pb-2">
              <div className="flex justify-between items-start">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{stat.label}</p>
                <stat.icon className={`h-4 w-4 ${stat.tone === 'emerald' ? 'text-emerald-500' : stat.tone === 'blue' ? 'text-blue-500' : 'text-slate-900'}`} />
              </div>
              <CardTitle className="text-2xl font-black text-slate-900 mt-1">{stat.value}</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="text-[10px] font-bold text-slate-500 mt-1">{stat.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-none bg-white shadow-sm overflow-hidden">
        <div className="h-1 w-full bg-slate-900" />
        <CardContent className="p-4">
          <div className="grid gap-3 lg:grid-cols-[1.2fr_220px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="CARI NOMOR ORDER, DRIVER, ATAU TUJUAN..."
                className="pl-9 h-10 text-xs font-semibold bg-slate-50 border-slate-100"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-10 text-xs font-semibold bg-slate-50 border-slate-100">
                <SelectValue placeholder="SEMUA STATUS" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">SEMUA STATUS</SelectItem>
                <SelectItem value="dijadwalkan">DIJADWALKAN</SelectItem>
                <SelectItem value="pickup">PICKUP</SelectItem>
                <SelectItem value="transit">TRANSIT</SelectItem>
                <SelectItem value="delivered">DELIVERED</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="border-none bg-white shadow-sm overflow-hidden">
          <div className="h-1 w-full bg-blue-500" />
          <CardHeader className="p-6 border-b border-slate-50">
            <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-900">VOLUME DISTRIBUSI BULANAN</CardTitle>
            <CardDescription className="text-[10px] font-bold text-slate-500 uppercase">BEBAN LOGISTIK LINTAS WILAYAH</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] p-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlySeries}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="name" tickLine={false} axisLine={false} className="text-[10px] font-bold" />
                <YAxis tickLine={false} axisLine={false} className="text-[10px] font-bold" />
                <Bar dataKey="volume" fill="#2563eb" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-none bg-white shadow-sm overflow-hidden">
          <div className="h-1 w-full bg-slate-900" />
          <CardHeader className="p-6 border-b border-slate-50">
            <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-900">PERFORMA WILAYAH</CardTitle>
            <CardDescription className="text-[10px] font-bold text-slate-500 uppercase">RINGKASAN EFISIENSI REGIONAL</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {regionSeries.map((region) => (
              <div key={region.region} className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4 transition-all hover:bg-white hover:shadow-md">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-black text-slate-900 uppercase tracking-tight">{region.region}</p>
                  <Badge className="bg-emerald-100 text-emerald-700 text-[10px] font-black border-none px-1.5 h-4">
                    {region.onTimeRate}% ON-TIME
                  </Badge>
                </div>
                <div className="mt-3 grid gap-2 text-[10px] font-bold text-slate-500 md:grid-cols-3 uppercase tracking-widest">
                  <span>{region.delivered} SELESAI</span>
                  <span>{region.active} AKTIF</span>
                  <span>{region.onTime} TEPAT WAKTU</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="border-none bg-white shadow-sm overflow-hidden">
        <div className="h-1 w-full bg-slate-900" />
        <CardHeader className="p-6 border-b border-slate-50">
          <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-900">MANIFEST PENGIRIMAN NASIONAL</CardTitle>
          <CardDescription className="text-[10px] font-bold text-slate-500 uppercase">AUDIT LOGISTIK MULTI-ENTITAS</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-900">
              <TableRow className="hover:bg-slate-900 border-none">
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400 h-10 px-6">NO. ORDER</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400 h-10 px-6">KOMODITAS</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400 h-10 px-6">ENTITAS</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400 h-10 px-6">RUTE</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400 h-10 px-6">DRIVER</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400 h-10 px-6 text-right">VOLUME</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400 h-10 px-6">STATUS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {shipments.map((shipment) => (
                <TableRow key={shipment.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                  <TableCell className="px-6 py-4 font-mono text-[10px] font-black text-slate-500">{shipment.orderNumber}</TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="min-w-[120px]">
                      <p className="text-xs font-black text-slate-900 uppercase tracking-tight">{shipment.commodityName}</p>
                      <p className="text-[10px] font-bold text-slate-400 mt-0.5 uppercase">{shipment.buyerName}</p>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="min-w-[120px]">
                      <p className="text-xs font-black text-slate-900 uppercase tracking-tight">{shipment.cooperativeName}</p>
                      <p className="text-[10px] font-bold text-slate-400 mt-0.5 uppercase">{shipment.villageName}</p>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                      {shipment.routeFrom} → {shipment.routeTo}
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div>
                      <p className="text-xs font-black text-slate-900 uppercase">{shipment.driver}</p>
                      <p className="text-[10px] font-bold text-slate-400 mt-0.5">{shipment.driverPhone}</p>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right">
                    <p className="text-xs font-black text-slate-900">{shipment.volumeKg.toLocaleString('id-ID')} KG</p>
                    <p className="text-[10px] font-bold text-slate-400 mt-0.5">{formatCurrency(shipment.cost)}</p>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <Badge variant="outline" className={`text-[10px] font-black border-none px-1.5 h-4 uppercase ${statusTone(shipment.status)}`}>
                      {shipment.status}
                    </Badge>
                    <p className="mt-1 text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
                      {formatDate(shipment.departureDate)}
                    </p>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
