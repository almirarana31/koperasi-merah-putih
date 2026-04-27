'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { AlertTriangle, Package, QrCode, Search, Snowflake, Warehouse } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import { useAuth } from '@/lib/auth/use-auth'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { KementerianFilterBar } from '@/components/dashboard/kementerian-filter-bar'
import { useToast } from '@/components/ui/use-toast'
import { cn } from '@/lib/utils'
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
import { DataTable, type DataTableColumn } from '@/components/ui/data-table'

const REFERENCE_DATE = new Date('2026-04-06T00:00:00+07:00')

type InventoryRow = ReturnType<typeof filterInventoryByScope>[number]

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
  if (value === 'fresh' || value === 'A') return 'border-success/30 bg-success/10 text-[color:var(--success)]'
  if (value === 'good' || value === 'B') return 'border-warning/30 bg-warning/10 text-[color:var(--warning)]'
  return 'border-destructive/30 bg-destructive/10 text-destructive'
}

export default function GudangPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const showHierarchyFilter =
    user?.role === 'kementerian' || user?.role === 'pemda' || user?.role === 'sysadmin'

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

  const scaleFactor = filters.provinceId === 'all' ? 1.0 : filters.regionId === 'all' ? 0.4 : 0.1
  const scaleFactorValue = filters.provinceId === 'all' ? 100 : filters.regionId === 'all' ? 30 : 10

  const filteredInventory = useMemo(() => {
    return inventoryRows.filter((item) => {
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
  }, [inventoryRows, search, warehouseFilter, qualityFilter, statusFilter])

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
    stok: Number(((item.quantityKg * scaleFactor * 100) / 1000).toFixed(1)),
    nilai: Math.round((item.value * scaleFactor * 100) / 1_000_000),
  }))

  const kpis = [
    {
      label: 'Stok Tersedia',
      value: `${((totalStockKg * scaleFactorValue) / 1000).toLocaleString('id-ID')} ton`,
      sub: `${(filteredInventory.length * scaleFactorValue).toLocaleString('id-ID')} batch aktif`,
      icon: Package,
      tone: 'secondary' as const,
    },
    {
      label: 'Nilai Persediaan',
      value: formatCurrency(totalValue * scaleFactorValue),
      sub: `${filteredWarehouses.length} gudang terhubung`,
      icon: Warehouse,
      tone: 'success' as const,
    },
    {
      label: 'Batch Segera Keluar',
      value: (expiringBatches * scaleFactorValue).toLocaleString('id-ID'),
      sub: 'Masa simpan < 7 hari',
      icon: AlertTriangle,
      tone: 'warning' as const,
    },
    {
      label: 'Cold Chain Aktif',
      value: (coldStorageBatches * scaleFactorValue).toLocaleString('id-ID'),
      sub: 'Memerlukan rantai dingin',
      icon: Snowflake,
      tone: 'tertiary' as const,
    },
  ]

  const columns: DataTableColumn<InventoryRow>[] = [
    {
      key: 'batch',
      header: 'Batch ID',
      cell: (item) => (
        <div className="flex items-center gap-2">
          <QrCode className="h-3.5 w-3.5 text-muted-foreground" />
          <span className="font-mono text-xs">{item.batchCode}</span>
        </div>
      ),
    },
    {
      key: 'commodity',
      header: 'Komoditas / Koperasi',
      cell: (item) => (
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">{item.commodityName}</p>
          <p className="truncate text-xs text-muted-foreground">{item.cooperativeName}</p>
        </div>
      ),
    },
    {
      key: 'warehouse',
      header: 'Gudang / Wilayah',
      cell: (item) => (
        <div className="min-w-0">
          <p className="truncate text-sm text-foreground">{item.warehouseName}</p>
          <p className="truncate text-xs text-muted-foreground">
            {item.villageName}, {item.regionName}
          </p>
        </div>
      ),
    },
    {
      key: 'quantity',
      header: 'Jumlah',
      align: 'right',
      cell: (item) => (
        <span className="tabular-nums">{item.quantityKg.toLocaleString('id-ID')} kg</span>
      ),
    },
    {
      key: 'grade',
      header: 'Grade',
      align: 'center',
      cell: (item) => (
        <Badge variant="outline" className={badgeTone(item.quality)}>
          Grade {item.quality}
        </Badge>
      ),
    },
    {
      key: 'status',
      header: 'Kondisi',
      align: 'center',
      cell: (item) => (
        <Badge variant="outline" className={badgeTone(item.status)}>
          {item.status}
        </Badge>
      ),
    },
    {
      key: 'expiry',
      header: 'Kadaluarsa',
      align: 'right',
      cell: (item) => {
        const expiringSoon =
          (new Date(item.expiryDate).getTime() - REFERENCE_DATE.getTime()) / (1000 * 60 * 60 * 24) <= 7
        return (
          <div className="flex items-center justify-end gap-2">
            {expiringSoon && <AlertTriangle className="h-3.5 w-3.5 text-[color:var(--warning)]" />}
            <span
              className={cn(
                'tabular-nums',
                expiringSoon ? 'text-[color:var(--warning)] font-medium' : 'text-muted-foreground',
              )}
            >
              {formatDate(item.expiryDate)}
            </span>
          </div>
        )
      },
    },
  ]

  return (
    <div className="page-shell">
      {/* Header */}
      <div className="page-header surface-card flex flex-col gap-4 p-5 md:flex-row md:items-end md:justify-between">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="page-title">Manajemen Inventaris Nasional</h1>
            <Badge variant="outline" className="border-primary/30 bg-primary/10 text-primary">
              Gudang lintas desa
            </Badge>
          </div>
          <p className="page-subtitle">
            Monitoring stok, kapasitas, dan kesehatan batch untuk {getScopeCaption(scopedFilters)}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href="/gudang/traceability">
              <QrCode className="mr-2 h-3.5 w-3.5" /> Lacak batch
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href="/gudang/cold-storage">
              <Snowflake className="mr-2 h-3.5 w-3.5" /> Rantai dingin
            </Link>
          </Button>
        </div>
      </div>

      {showHierarchyFilter && <KementerianFilterBar filters={filters} setFilters={setFilters} />}

      {/* KPIs */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {kpis.map((stat) => (
          <Card key={stat.label} className={`card-accent card-accent-${stat.tone}`}>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <p className="metric-label">{stat.label}</p>
                <stat.icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <CardTitle className="metric-value mt-1">{stat.value}</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-xs text-muted-foreground">{stat.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filter bar */}
      <Card>
        <CardContent>
          <div className="grid gap-3 lg:grid-cols-[1.3fr_repeat(3,minmax(0,180px))]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari batch, komoditas, koperasi, atau desa…"
                className="pl-9"
              />
            </div>
            <Select value={warehouseFilter} onValueChange={setWarehouseFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Semua gudang" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua gudang</SelectItem>
                {warehouses.map((warehouse) => (
                  <SelectItem key={warehouse.id} value={warehouse.id}>
                    {warehouse.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={qualityFilter} onValueChange={setQualityFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Semua grade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua grade</SelectItem>
                <SelectItem value="A">Grade A</SelectItem>
                <SelectItem value="B">Grade B</SelectItem>
                <SelectItem value="C">Grade C</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Semua kondisi" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua kondisi</SelectItem>
                <SelectItem value="fresh">Fresh</SelectItem>
                <SelectItem value="good">Good</SelectItem>
                <SelectItem value="aging">Aging</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Charts */}
      <div className="grid gap-5 xl:grid-cols-[1.15fr_0.85fr]">
        <Card className="card-accent card-accent-secondary">
          <CardHeader>
            <CardTitle>Komposisi Stok per Komoditas</CardTitle>
            <CardDescription>Analisis volume stok terkonsolidasi nasional</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={commoditySeries}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} tickFormatter={(val) => `${val}t`} />
                <Bar dataKey="stok" fill="var(--dashboard-secondary)" barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="card-accent card-accent-tertiary">
          <CardHeader>
            <CardTitle>Utilisasi Gudang</CardTitle>
            <CardDescription>Perbandingan kapasitas aktif antar nodes</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {filteredWarehouses.slice(0, 4).map((warehouse) => (
              <div key={warehouse.id} className="surface-card-muted p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-foreground">{warehouse.name}</p>
                    <p className="truncate text-xs text-muted-foreground">
                      {warehouse.cooperativeName} · {warehouse.villageName}
                    </p>
                  </div>
                  <Badge
                    variant="outline"
                    className={
                      warehouse.type === 'cold'
                        ? 'border-tertiary/30 bg-[color:var(--dashboard-tertiary-soft)] text-[color:var(--dashboard-tertiary)]'
                        : ''
                    }
                  >
                    {warehouse.type === 'cold' ? 'Cold storage' : 'Reguler'}
                  </Badge>
                </div>
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className={cn(
                      'h-full',
                      warehouse.utilizationPct > 85 ? 'bg-destructive' : 'bg-[color:var(--success)]',
                    )}
                    style={{ width: `${Math.min(warehouse.utilizationPct, 100)}%` }}
                  />
                </div>
                <div className="mt-2 flex justify-between text-xs text-muted-foreground tabular-nums">
                  <span>{warehouse.utilizationPct}% terpakai</span>
                  <span>{warehouse.occupancyKg.toLocaleString('id-ID')} kg</span>
                  <span>{warehouse.batchCount} batch</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Inventory table */}
      <Card className="card-accent card-accent-primary">
        <CardHeader>
          <CardTitle>Manifest Batch Gudang</CardTitle>
          <CardDescription>Audit persediaan dan log traceability</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            data={filteredInventory}
            columns={columns}
            rowKey={(item) => item.id}
            empty="Tidak ada batch yang cocok dengan filter."
          />
        </CardContent>
      </Card>

      {/* Sync banner */}
      <Card className="card-accent card-accent-secondary">
        <CardContent className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="rounded-md bg-success/10 p-3 text-[color:var(--success)]">
              <Warehouse className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Sinkronisasi inventaris aktif</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Scope saat ini mencakup {filteredWarehouses.length} gudang, {commoditySeries.length} komoditas,
                dan seluruh ringkasan di atas bergerak bersama filter integritas data nasional.
              </p>
            </div>
          </div>
          <Button
            onClick={() =>
              toast({
                title: 'Inisiasi sinkronisasi',
                description: 'Menghubungkan ke node penyimpanan regional untuk pembaruan inventaris live…',
              })
            }
          >
            Sinkronisasi live
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
