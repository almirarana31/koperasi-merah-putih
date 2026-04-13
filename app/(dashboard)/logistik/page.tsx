'use client'

import { useEffect, useState } from 'react'
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
  const { toast } = useToast()
  const showHierarchyFilter = user?.role === 'kementerian' || user?.role === 'pemda' || user?.role === 'sysadmin'

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState('10')
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
  const totalPages = Math.max(1, Math.ceil(shipments.length / Number(pageSize)))
  const currentPage = Math.min(page, totalPages)
  const startIndex = shipments.length === 0 ? 0 : (currentPage - 1) * Number(pageSize) + 1
  const endIndex = Math.min(currentPage * Number(pageSize), shipments.length)
  const paginatedShipments = shipments.slice(
    (currentPage - 1) * Number(pageSize),
    currentPage * Number(pageSize),
  )

  useEffect(() => {
    setPage(1)
  }, [search, statusFilter, filters, pageSize])

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages)
    }
  }, [page, totalPages])

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
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-100">
              <TableRow className="border-none bg-slate-100 hover:bg-slate-100">
                <TableHead className="h-10 px-6 text-[10px] font-black uppercase tracking-widest text-slate-500">No. Order</TableHead>
                <TableHead className="h-10 px-6 text-[10px] font-black uppercase tracking-widest text-slate-500">Komoditas</TableHead>
                <TableHead className="h-10 px-6 text-[10px] font-black uppercase tracking-widest text-slate-500">Entitas</TableHead>
                <TableHead className="h-10 px-6 text-[10px] font-black uppercase tracking-widest text-slate-500">Rute</TableHead>
                <TableHead className="h-10 px-6 text-[10px] font-black uppercase tracking-widest text-slate-500">Driver</TableHead>
                <TableHead className="h-10 px-6 text-right text-[10px] font-black uppercase tracking-widest text-slate-500">Volume</TableHead>
                <TableHead className="h-10 px-6 text-[10px] font-black uppercase tracking-widest text-slate-500">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedShipments.map((shipment) => (
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
                    <Badge variant="outline" className={`text-[10px] font-black border-none px-1.5 h-4 uppercase rounded-none ${statusTone(shipment.status)}`}>
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
        <div className="flex flex-col gap-4 border-t border-slate-100 bg-slate-50/70 px-6 py-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-col gap-1 text-sm text-slate-500">
            <span>
              Menampilkan {startIndex}-{endIndex} dari {shipments.length} pengiriman.
            </span>
            <span>
              Halaman {currentPage} dari {totalPages}
            </span>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2">
              <span className="text-sm text-slate-500">Tampilkan</span>
              <Select value={pageSize} onValueChange={setPageSize}>
                <SelectTrigger className="h-9 w-[110px] rounded-none border-slate-200 bg-white text-[10px] font-black uppercase tracking-widest">
                  <SelectValue placeholder="10 data" />
                </SelectTrigger>
                <SelectContent className="rounded-none">
                  <SelectItem value="10" className="text-[10px] font-black uppercase">10 data</SelectItem>
                  <SelectItem value="25" className="text-[10px] font-black uppercase">25 data</SelectItem>
                  <SelectItem value="50" className="text-[10px] font-black uppercase">50 data</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="h-9 rounded-none border-slate-200 px-4 text-[10px] font-black uppercase tracking-widest text-slate-600 disabled:opacity-40"
              >
                Sebelumnya
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="h-9 rounded-none border-slate-200 px-4 text-[10px] font-black uppercase tracking-widest text-slate-600 disabled:opacity-40"
              >
                Berikutnya
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
