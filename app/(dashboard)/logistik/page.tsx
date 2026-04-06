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

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <Badge className="w-fit border border-blue-200 bg-blue-50 text-blue-700">Logistik Multi-Entitas</Badge>
          <div>
            <h1 className="text-slate-900">Pengiriman & Distribusi</h1>
            <p className="text-muted-foreground">
              Arus pengiriman dari {getScopeCaption(scopedFilters)} ditampilkan seragam pada KPI, chart, dan tabel.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" asChild>
            <Link href="/logistik/tracking">
              <Navigation className="mr-2 h-4 w-4" />
              Live Tracking
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/logistik/rute">
              <MapPin className="mr-2 h-4 w-4" />
              Rute
            </Link>
          </Button>
        </div>
      </div>

      {showHierarchyFilter && <KementerianFilterBar filters={filters} setFilters={setFilters} />}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="border-slate-200 bg-white">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Pengiriman Aktif</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{activeShipments}</p>
            <p className="mt-2 text-sm text-muted-foreground">Dalam pickup dan perjalanan</p>
          </CardContent>
        </Card>
        <Card className="border-slate-200 bg-white">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Pengiriman Selesai</p>
            <p className="mt-2 text-3xl font-semibold text-emerald-600">{deliveredShipments}</p>
            <p className="mt-2 text-sm text-muted-foreground">Tersampaikan ke buyer</p>
          </CardContent>
        </Card>
        <Card className="border-slate-200 bg-white">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">On-Time Rate</p>
            <p className="mt-2 text-3xl font-semibold text-blue-600">{onTimeRate}%</p>
            <p className="mt-2 text-sm text-muted-foreground">Rasio ketepatan waktu seluruh scope</p>
          </CardContent>
        </Card>
        <Card className="border-slate-200 bg-white">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Biaya Distribusi</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{formatCurrency(totalCost)}</p>
            <p className="mt-2 text-sm text-muted-foreground">{shipments.length} manifest tersinkron</p>
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
                placeholder="Cari nomor order, driver, buyer, atau tujuan"
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Semua Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="dijadwalkan">Dijadwalkan</SelectItem>
                <SelectItem value="pickup">Pickup</SelectItem>
                <SelectItem value="transit">Transit</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="border-slate-200 bg-white">
          <CardHeader>
            <CardTitle>Volume Distribusi Bulanan</CardTitle>
            <CardDescription>Order yang masuk dan beban logistik ikut berubah sesuai kombinasi filter saat ini.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlySeries}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="name" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Bar dataKey="volume" fill="#2563eb" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white">
          <CardHeader>
            <CardTitle>Performa Wilayah</CardTitle>
            <CardDescription>Ringkasan pengiriman per regional dalam scope yang sama.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {regionSeries.map((region) => (
              <div key={region.region} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-slate-900">{region.region}</p>
                  <Badge variant="outline" className="border-slate-200 bg-white text-slate-700">
                    {region.onTimeRate}% on-time
                  </Badge>
                </div>
                <div className="mt-3 grid gap-2 text-sm text-muted-foreground md:grid-cols-3">
                  <span>{region.delivered} selesai</span>
                  <span>{region.active} aktif</span>
                  <span>{region.onTime} manifest tepat waktu</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-200 bg-white">
        <CardHeader>
          <CardTitle>Manifest Pengiriman</CardTitle>
          <CardDescription>
            {shipments.length} manifest tampil. Tidak ada data statis yang terpisah dari filter wilayah.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No. Order</TableHead>
                <TableHead>Komoditas</TableHead>
                <TableHead>Koperasi</TableHead>
                <TableHead>Tujuan</TableHead>
                <TableHead>Driver</TableHead>
                <TableHead className="text-right">Volume</TableHead>
                <TableHead className="text-right">Biaya</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {shipments.map((shipment) => (
                <TableRow key={shipment.id}>
                  <TableCell className="font-mono text-sm">{shipment.orderNumber}</TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-slate-900">{shipment.commodityName}</p>
                      <p className="text-sm text-muted-foreground">{shipment.buyerName}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-slate-900">{shipment.cooperativeName}</p>
                      <p className="text-sm text-muted-foreground">{shipment.villageName}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-muted-foreground">
                      {shipment.routeFrom} → {shipment.routeTo}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-slate-900">{shipment.driver}</p>
                      <p className="text-sm text-muted-foreground">{shipment.driverPhone}</p>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-medium">{shipment.volumeKg.toLocaleString('id-ID')} kg</TableCell>
                  <TableCell className="text-right">{formatCurrency(shipment.cost)}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={statusTone(shipment.status)}>
                      {shipment.status}
                    </Badge>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {formatDate(shipment.departureDate)}
                      {shipment.arrivalDate ? ` · ${formatDate(shipment.arrivalDate)}` : ''}
                    </p>
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
              <Truck className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-slate-900">Sinkronisasi Logistik Aktif</p>
              <p className="text-sm text-muted-foreground">
                Manifest, biaya, dan performa wilayah di atas mengambil data dari shipment dan order lintas desa yang sama.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Navigation className="h-4 w-4" />
            <span>{orders.length} order sumber terhubung</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
