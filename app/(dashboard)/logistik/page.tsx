'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Activity, MapPin, Navigation, Search, Truck } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import { useAuth } from '@/lib/auth/use-auth'
import { useToast } from '@/components/ui/use-toast'
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
import { DataTable, type DataTableColumn } from '@/components/ui/data-table'

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
  const { toast } = useToast()
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

  type Shipment = (typeof shipments)[number]
  const shipmentColumns: DataTableColumn<Shipment>[] = [
    {
      key: 'order',
      header: 'No. Order',
      cell: (s) => <span className="font-mono text-xs text-muted-foreground">{s.orderNumber}</span>,
    },
    {
      key: 'commodity',
      header: 'Komoditas',
      cell: (s) => (
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">{s.commodityName}</p>
          <p className="truncate text-xs text-muted-foreground">{s.buyerName}</p>
        </div>
      ),
    },
    {
      key: 'entity',
      header: 'Entitas',
      cell: (s) => (
        <div className="min-w-0">
          <p className="truncate text-sm text-foreground">{s.cooperativeName}</p>
          <p className="truncate text-xs text-muted-foreground">{s.villageName}</p>
        </div>
      ),
    },
    {
      key: 'route',
      header: 'Rute',
      cell: (s) => (
        <span className="text-xs text-muted-foreground">
          {s.routeFrom} → {s.routeTo}
        </span>
      ),
    },
    {
      key: 'driver',
      header: 'Driver',
      cell: (s) => (
        <div>
          <p className="text-sm text-foreground">{s.driver}</p>
          <p className="text-xs text-muted-foreground">{s.driverPhone}</p>
        </div>
      ),
    },
    {
      key: 'volume',
      header: 'Volume',
      align: 'right',
      cell: (s) => (
        <div className="flex flex-col items-end">
          <span className="tabular-nums font-medium">{s.volumeKg.toLocaleString('id-ID')} kg</span>
          <span className="text-xs text-muted-foreground">{formatCurrency(s.cost)}</span>
        </div>
      ),
    },
    {
      key: 'status',
      header: 'Status',
      cell: (s) => (
        <div className="flex flex-col gap-1">
          <Badge variant="outline" className={statusTone(s.status)}>
            {s.status}
          </Badge>
          <span className="text-xs text-muted-foreground">{formatDate(s.departureDate)}</span>
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Pusat Komando Logistik</h1>
          <p className="text-[10px] font-black text-slate-500 mt-1 uppercase tracking-widest leading-relaxed">
            Pemantauan Arus Distribusi Komoditas Nasional
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" className="h-9 text-[10px] font-black uppercase tracking-widest border-slate-200 text-slate-600 rounded-none" asChild>
            <Link href="/logistik/tracking">
              <Navigation className="mr-2 h-3.5 w-3.5 text-blue-600" />
              Pelacakan Langsung
            </Link>
          </Button>
          <Button variant="outline" size="sm" className="h-9 text-[10px] font-black uppercase tracking-widest border-slate-200 text-slate-600 rounded-none" asChild>
            <Link href="/logistik/rute">
              <MapPin className="mr-2 h-3.5 w-3.5 text-emerald-600" />
              Rute Optimal
            </Link>
          </Button>
        </div>
      </div>

      <KementerianFilterBar filters={filters} setFilters={setFilters} />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Pengiriman Aktif', value: Math.floor(activeShipments * scaleFactor), sub: 'Unit Dalam Perjalanan', icon: Truck, tone: 'slate' },
          { label: 'Pengiriman Selesai', value: Math.floor(deliveredShipments * scaleFactor), sub: 'Pengiriman Berhasil', icon: Navigation, tone: 'emerald' },
          { label: 'On-Time Rate', value: `${onTimeRate}%`, sub: 'Skor Efisiensi', icon: Activity, tone: 'blue' },
          { label: 'Biaya Distribusi', value: formatCurrency(totalCost * scaleFactor), sub: 'Akumulasi Operasional', icon: Truck, tone: 'slate' },
        ].map((stat, i) => (
          <Card key={i} className="border-none bg-white shadow-sm overflow-hidden rounded-none">
            <div className={`h-1 w-full ${stat.tone === 'emerald' ? 'bg-emerald-500' : stat.tone === 'blue' ? 'bg-blue-500' : 'bg-slate-900'}`} />
            <CardHeader className="p-4 pb-2">
              <div className="flex justify-between items-start">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{stat.label}</p>
                <stat.icon className={`h-4 w-4 ${stat.tone === 'emerald' ? 'text-emerald-500' : stat.tone === 'blue' ? 'text-blue-500' : 'text-slate-900'}`} />
              </div>
              <CardTitle className="text-xl font-black text-slate-900 mt-1">{stat.value}</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="text-[8px] font-bold text-slate-500 uppercase tracking-tighter">{stat.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-none bg-white shadow-sm overflow-hidden rounded-none">
        <div className="h-1 w-full bg-slate-900" />
        <CardContent className="p-4">
          <div className="grid gap-3 lg:grid-cols-[1.2fr_220px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Cari Nomor Order, Driver, Atau Tujuan..."
                className="pl-9 h-10 text-[10px] font-black uppercase tracking-widest bg-slate-50 border-slate-100 rounded-none"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-10 text-[10px] font-black uppercase tracking-widest bg-slate-50 border-slate-100 rounded-none">
                <SelectValue placeholder="Semua Status" />
              </SelectTrigger>
              <SelectContent className="rounded-none border-slate-200">
                <SelectItem value="all" className="text-[10px] font-black uppercase tracking-widest">Semua Status</SelectItem>
                <SelectItem value="dijadwalkan" className="text-[10px] font-black uppercase tracking-widest">Dijadwalkan</SelectItem>
                <SelectItem value="pickup" className="text-[10px] font-black uppercase tracking-widest">Pickup</SelectItem>
                <SelectItem value="transit" className="text-[10px] font-black uppercase tracking-widest">Transit</SelectItem>
                <SelectItem value="delivered" className="text-[10px] font-black uppercase tracking-widest">Delivered</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-5 xl:grid-cols-[1.1fr_0.9fr]">
        <Card className="border-none bg-white shadow-sm overflow-hidden rounded-none">
          <div className="h-1 w-full bg-blue-500" />
          <CardHeader className="p-6 border-b border-slate-50">
            <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-900">Volume Distribusi Bulanan</CardTitle>
            <CardDescription className="text-[10px] font-bold text-slate-500 uppercase">Beban Logistik Lintas Wilayah</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] p-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlySeries}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="name" tickLine={false} axisLine={false} className="text-[10px] font-bold" />
                <YAxis tickLine={false} axisLine={false} className="text-[10px] font-bold" />
                <Bar dataKey="volume" fill="#2563eb" radius={[0, 0, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-none bg-white shadow-sm overflow-hidden rounded-none">
          <div className="h-1 w-full bg-slate-900" />
          <CardHeader className="p-6 border-b border-slate-50">
            <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-900">Performa Wilayah</CardTitle>
            <CardDescription className="text-[10px] font-bold text-slate-500 uppercase">Ringkasan Efisiensi Regional</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px] overflow-y-auto p-4 space-y-3">
            {regionSeries.map((region) => (
              <div key={region.region} className="rounded-none border border-slate-100 bg-slate-50/50 p-3 transition-all hover:bg-white hover:shadow-md">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-black text-slate-900 uppercase tracking-tight">{region.region}</p>
                  <Badge className="bg-emerald-100 text-emerald-700 text-[10px] font-black border-none px-1.5 h-4 rounded-none">
                    {region.onTimeRate}% On-Time
                  </Badge>
                </div>
                <div className="mt-3 grid gap-2 text-[10px] font-bold text-slate-500 md:grid-cols-3 uppercase tracking-widest">
                  <span>{region.delivered} Selesai</span>
                  <span>{region.active} Aktif</span>
                  <span>{region.onTime} Tepat Waktu</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="border-none bg-white shadow-sm overflow-hidden rounded-none">
        <div className="h-1 w-full bg-slate-900" />
        <CardHeader className="p-6 border-b border-slate-50">
          <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-900">Manifest Pengiriman Nasional</CardTitle>
          <CardDescription className="text-[10px] font-bold text-slate-500 uppercase">Audit Logistik Multi-Entitas</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            data={shipments}
            columns={shipmentColumns}
            rowKey={(s) => s.id}
            empty="Tidak ada pengiriman yang cocok dengan filter."
          />
        </CardContent>
      </Card>
    </div>
  )
}
