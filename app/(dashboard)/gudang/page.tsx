'use client'

import { useState } from 'react'
import Link from 'next/link'
import { AlertTriangle, Package, QrCode, Search, Snowflake, Warehouse } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import { useAuth } from '@/lib/auth/use-auth'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { KementerianFilterBar } from '@/components/dashboard/kementerian-filter-bar'
import {
  filterInventoryByScope,
  getInventoryByCommodity,
  getScopeCaption,
  getWarehousesForInventory,
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

const REFERENCE_DATE = new Date('2026-04-06T00:00:00+07:00')

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

function badgeTone(value: string) {
  if (value === 'fresh' || value === 'A') return 'bg-emerald-50 text-emerald-700 border-emerald-200'
  if (value === 'good' || value === 'B') return 'bg-amber-50 text-amber-700 border-amber-200'
  return 'bg-rose-50 text-rose-700 border-rose-200'
}

export default function GudangPage() {
  const { user } = useAuth()
  const showHierarchyFilter = user?.role === 'kementerian' || user?.role === 'pemda' || user?.role === 'sysadmin'

  const [search, setSearch] = useState('')
  const [warehouseFilter, setWarehouseFilter] = useState('all')
  const [qualityFilter, setQualityFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [filters, setFilters] = useState<ScopeFilters>({
    provinceId: 'all',
    regionId: 'all',
    villageId: 'all',
    cooperativeId: 'all',
    commodityId: 'all',
  })

  const scopedFilters = resolveOperationalFilters(user, filters)
  const inventoryRows = filterInventoryByScope(scopedFilters)
  const warehouses = getWarehousesForInventory(inventoryRows)

  const filteredInventory = inventoryRows.filter((item) => {
    const keyword = search.toLowerCase()
    const matchesSearch =
      item.commodityName.toLowerCase().includes(keyword) ||
      item.batchCode.toLowerCase().includes(keyword) ||
      item.cooperativeName.toLowerCase().includes(keyword) ||
      item.villageName.toLowerCase().includes(keyword)
    const matchesWarehouse = warehouseFilter === 'all' || item.warehouseId === warehouseFilter
    const matchesQuality = qualityFilter === 'all' || item.quality === qualityFilter
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter
    return matchesSearch && matchesWarehouse && matchesQuality && matchesStatus
  })

  const filteredWarehouses = warehouses.filter((warehouse) => {
    if (warehouseFilter === 'all') return true
    return warehouse.id === warehouseFilter
  })

  const totalStockKg = filteredInventory.reduce((total, item) => total + item.quantityKg, 0)
  const totalValue = filteredInventory.reduce((total, item) => total + item.quantityKg * item.unitPrice, 0)
  const expiringBatches = filteredInventory.filter((item) => {
    const expiry = new Date(item.expiryDate)
    const diff = (expiry.getTime() - REFERENCE_DATE.getTime()) / (1000 * 60 * 60 * 24)
    return diff >= 0 && diff <= 7
  }).length
  const coldStorageBatches = filteredInventory.filter((item) => item.warehouseType === 'cold').length

  const commoditySeries = getInventoryByCommodity(filteredInventory).map((item) => ({
    name: item.commodity.replace(' Premium', ''),
    stok: Number((item.quantityKg / 1000).toFixed(1)),
    nilai: Math.round(item.value / 1_000_000),
  }))

  const warehouseSeries = filteredWarehouses.map((item) => ({
    name: item.villageName,
    utilization: item.utilizationPct,
    batch: item.batchCount,
  }))

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <Badge className="w-fit border border-rose-200 bg-rose-50 text-rose-700">Gudang Lintas Desa</Badge>
          <div>
            <h1 className="text-slate-900">Manajemen Gudang</h1>
            <p className="text-muted-foreground">
              Monitoring stok, kapasitas, dan kesehatan batch untuk {getScopeCaption(scopedFilters)}.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" asChild>
            <Link href="/gudang/traceability">
              <QrCode className="mr-2 h-4 w-4" />
              Traceability
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/gudang/cold-storage">
              <Snowflake className="mr-2 h-4 w-4" />
              Cold Storage
            </Link>
          </Button>
        </div>
      </div>

      {showHierarchyFilter && <KementerianFilterBar filters={filters} setFilters={setFilters} />}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="border-slate-200 bg-white">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Stok Tersedia</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{(totalStockKg / 1000).toFixed(1)} ton</p>
            <p className="mt-2 text-sm text-muted-foreground">{filteredInventory.length} batch aktif dalam scope ini</p>
          </CardContent>
        </Card>
        <Card className="border-slate-200 bg-white">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Nilai Persediaan</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{formatCurrency(totalValue)}</p>
            <p className="mt-2 text-sm text-muted-foreground">{filteredWarehouses.length} gudang terhubung</p>
          </CardContent>
        </Card>
        <Card className="border-slate-200 bg-white">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Batch Segera Keluar</p>
            <p className="mt-2 text-3xl font-semibold text-amber-600">{expiringBatches}</p>
            <p className="mt-2 text-sm text-muted-foreground">Masa simpan kurang dari 7 hari</p>
          </CardContent>
        </Card>
        <Card className="border-slate-200 bg-white">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Cold Chain Aktif</p>
            <p className="mt-2 text-3xl font-semibold text-blue-600">{coldStorageBatches}</p>
            <p className="mt-2 text-sm text-muted-foreground">Batch memerlukan rantai dingin</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-200 bg-white">
        <CardContent className="p-4">
          <div className="grid gap-3 lg:grid-cols-[1.3fr_repeat(3,220px)]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Cari batch, komoditas, koperasi, atau desa"
                className="pl-9"
              />
            </div>
            <Select value={warehouseFilter} onValueChange={setWarehouseFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Semua Gudang" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Gudang</SelectItem>
                {warehouses.map((warehouse) => (
                  <SelectItem key={warehouse.id} value={warehouse.id}>
                    {warehouse.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={qualityFilter} onValueChange={setQualityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Semua Grade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Grade</SelectItem>
                <SelectItem value="A">Grade A</SelectItem>
                <SelectItem value="B">Grade B</SelectItem>
                <SelectItem value="C">Grade C</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Semua Kondisi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kondisi</SelectItem>
                <SelectItem value="fresh">Fresh</SelectItem>
                <SelectItem value="good">Good</SelectItem>
                <SelectItem value="aging">Aging</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <Card className="border-slate-200 bg-white">
          <CardHeader>
            <CardTitle>Komposisi Stok per Komoditas</CardTitle>
            <CardDescription>Volume stok yang ikut berubah mengikuti filter wilayah dan koperasi.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={commoditySeries}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="name" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Bar dataKey="stok" fill="#d32f2f" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white">
          <CardHeader>
            <CardTitle>Utilisasi Gudang</CardTitle>
            <CardDescription>Perbandingan kapasitas aktif antar gudang dalam scope terpilih.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {filteredWarehouses.map((warehouse) => (
              <div key={warehouse.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-medium text-slate-900">{warehouse.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {warehouse.cooperativeName} · {warehouse.villageName}
                    </p>
                  </div>
                  <Badge variant="outline" className="border-slate-200 bg-white text-slate-700">
                    {warehouse.type === 'cold' ? 'Cold Storage' : 'Reguler'}
                  </Badge>
                </div>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-200">
                  <div
                    className="h-full rounded-full bg-rose-500"
                    style={{ width: `${Math.min(warehouse.utilizationPct, 100)}%` }}
                  />
                </div>
                <div className="mt-3 grid gap-2 text-sm text-muted-foreground md:grid-cols-3">
                  <span>{warehouse.utilizationPct}% terpakai</span>
                  <span>{warehouse.occupancyKg.toLocaleString('id-ID')} kg tersimpan</span>
                  <span>{warehouse.batchCount} batch aktif</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-200 bg-white">
        <CardHeader>
          <CardTitle>Daftar Batch Gudang</CardTitle>
          <CardDescription>
            {filteredInventory.length} batch tampil. KPI, gudang, dan tabel memakai sumber data yang sama.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Batch</TableHead>
                <TableHead>Komoditas</TableHead>
                <TableHead>Gudang</TableHead>
                <TableHead>Wilayah</TableHead>
                <TableHead className="text-right">Jumlah</TableHead>
                <TableHead>Grade</TableHead>
                <TableHead>Kondisi</TableHead>
                <TableHead>Harvest</TableHead>
                <TableHead>Kadaluarsa</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInventory.map((item) => {
                const expiringSoon =
                  (new Date(item.expiryDate).getTime() - REFERENCE_DATE.getTime()) / (1000 * 60 * 60 * 24) <= 7

                return (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <QrCode className="h-4 w-4 text-muted-foreground" />
                        <span className="font-mono text-sm">{item.batchCode}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium text-slate-900">{item.commodityName}</p>
                        <p className="text-sm text-muted-foreground">{item.cooperativeName}</p>
                      </div>
                    </TableCell>
                    <TableCell>{item.warehouseName}</TableCell>
                    <TableCell>
                      <div className="text-sm text-muted-foreground">
                        {item.villageName}, {item.regionName}
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium">{item.quantityKg.toLocaleString('id-ID')} kg</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={badgeTone(item.quality)}>
                        Grade {item.quality}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={badgeTone(item.status)}>
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDate(item.harvestDate)}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {expiringSoon && <AlertTriangle className="h-4 w-4 text-amber-500" />}
                        <span className={expiringSoon ? 'font-medium text-amber-700' : 'text-muted-foreground'}>
                          {formatDate(item.expiryDate)}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="border-slate-200 bg-slate-50">
        <CardContent className="flex flex-col gap-4 p-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-3">
            <div className="rounded-2xl bg-white p-3 shadow-sm">
              <Warehouse className="h-5 w-5 text-rose-600" />
            </div>
            <div>
              <p className="font-medium text-slate-900">Sinkronisasi Gudang Aktif</p>
              <p className="text-sm text-muted-foreground">
                Scope saat ini mencakup {filteredWarehouses.length} gudang, {commoditySeries.length} komoditas, dan seluruh ringkasan di atas bergerak bersama filter yang sama.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 text-sm text-muted-foreground">
            <Package className="h-4 w-4" />
            <span>{warehouseSeries.length} node tersinkron lintas desa</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
