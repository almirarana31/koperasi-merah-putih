'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Search,
  Filter,
  Package,
  Warehouse,
  AlertTriangle,
  QrCode,
  TrendingUp,
  Thermometer,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { inventory } from '@/lib/mock-data'

export default function GudangPage() {
  const [search, setSearch] = useState('')
  const [filterWarehouse, setFilterWarehouse] = useState<string>('all')
  const [filterQuality, setFilterQuality] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')

  const filteredInventory = inventory.filter((item) => {
    const matchesSearch = item.productName.toLowerCase().includes(search.toLowerCase()) ||
                         item.batch.toLowerCase().includes(search.toLowerCase())
    const matchesWarehouse = filterWarehouse === 'all' || item.warehouse === filterWarehouse
    const matchesQuality = filterQuality === 'all' || item.quality === filterQuality
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus
    return matchesSearch && matchesWarehouse && matchesQuality && matchesStatus
  })

  // Calculate stats
  const totalStock = inventory.reduce((sum, item) => sum + item.quantity, 0)
  const warehouses = Array.from(new Set(inventory.map(item => item.warehouse)))
  
  const expiringStock = inventory.filter((item) => {
    const expDate = new Date(item.expiryDate)
    const today = new Date()
    const diff = (expDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    return diff <= 7 && diff > 0
  }).length

  const freshStock = inventory.filter(item => item.status === 'fresh').length
  const agingStock = inventory.filter(item => item.status === 'aging').length

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(val)
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-primary">Manajemen Gudang</h1>
          <p className="text-muted-foreground">
            Kelola inventaris, traceability, dan cold storage
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/gudang/traceability">
              <QrCode className="mr-2 h-4 w-4" />
              Traceability
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/gudang/cold-storage">
              <Thermometer className="mr-2 h-4 w-4" />
              Cold Storage
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Stok</CardDescription>
            <CardTitle className="text-2xl">{(totalStock / 1000).toFixed(1)} ton</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-xs text-emerald-600">
              <TrendingUp className="mr-1 h-3 w-3" />
              +12% dari bulan lalu
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Lokasi Gudang</CardDescription>
            <CardTitle className="text-2xl">{warehouses.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-xs text-muted-foreground">
              <Warehouse className="mr-1 h-3 w-3" />
              {inventory.length} batch tersimpan
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Segera Kadaluarsa</CardDescription>
            <CardTitle className="text-2xl text-amber-600">{expiringStock}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center text-xs text-amber-600">
              <AlertTriangle className="mr-1 h-3 w-3" />
              Dalam 7 hari ke depan
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Kondisi Stok</CardDescription>
            <CardTitle className="text-2xl text-emerald-600">{freshStock}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              Fresh: {freshStock} | Aging: {agingStock}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Warehouse Capacity Overview */}
      <div className="grid gap-4 md:grid-cols-3">
        {warehouses.map((warehouse) => {
          const warehouseItems = inventory.filter(item => item.warehouse === warehouse)
          const warehouseStock = warehouseItems.reduce((sum, item) => sum + item.quantity, 0)
          const capacity = 10000 // Assume 10 ton capacity per warehouse
          const utilizationPercent = (warehouseStock / capacity) * 100
          const avgTemp = warehouseItems.reduce((sum, item) => sum + item.temperature, 0) / warehouseItems.length
          const avgHumidity = warehouseItems.reduce((sum, item) => sum + item.humidity, 0) / warehouseItems.length

          return (
            <Card key={warehouse}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">{warehouse}</CardTitle>
                  <Badge variant={warehouse.includes('WH-002') ? 'default' : 'secondary'} className="text-[10px]">
                    {warehouse.includes('WH-002') ? 'Cold Storage' : 'Regular'}
                  </Badge>
                </div>
                <CardDescription className="text-xs">{warehouseItems.length} batch items</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <span className="text-muted-foreground text-xs">Kapasitas Terpakai</span>
                    <span className="font-medium text-xs">{utilizationPercent.toFixed(0)}%</span>
                  </div>
                  <Progress value={utilizationPercent} className="h-1.5" />
                  <p className="text-xs text-muted-foreground mt-1">
                    {warehouseStock.toLocaleString()} / {capacity.toLocaleString()} kg
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2 pt-2 border-t">
                  <div className="flex items-center gap-1.5">
                    <Thermometer className="h-3.5 w-3.5 text-blue-500" />
                    <div>
                      <p className="text-[10px] text-muted-foreground">Avg Temp</p>
                      <p className="text-xs font-medium">{avgTemp.toFixed(1)}°C</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Package className="h-3.5 w-3.5 text-cyan-500" />
                    <div>
                      <p className="text-[10px] text-muted-foreground">Humidity</p>
                      <p className="text-xs font-medium">{avgHumidity.toFixed(0)}%</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Cari produk atau batch code..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              <Select value={filterWarehouse} onValueChange={setFilterWarehouse}>
                <SelectTrigger className="w-[140px]">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Gudang" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Gudang</SelectItem>
                  {warehouses.map((w) => (
                    <SelectItem key={w} value={w}>{w}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterQuality} onValueChange={setFilterQuality}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Kualitas" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua</SelectItem>
                  <SelectItem value="A">Grade A</SelectItem>
                  <SelectItem value="B">Grade B</SelectItem>
                  <SelectItem value="C">Grade C</SelectItem>
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua</SelectItem>
                  <SelectItem value="fresh">Fresh</SelectItem>
                  <SelectItem value="good">Good</SelectItem>
                  <SelectItem value="aging">Aging</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Inventaris</CardTitle>
          <CardDescription>
            Menampilkan {filteredInventory.length} dari {inventory.length} batch
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Batch Code</TableHead>
                <TableHead>Produk</TableHead>
                <TableHead>Gudang / Lokasi</TableHead>
                <TableHead className="text-right">Jumlah</TableHead>
                <TableHead>Kualitas</TableHead>
                <TableHead>Kondisi</TableHead>
                <TableHead>Panen</TableHead>
                <TableHead>Kadaluarsa</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInventory.slice(0, 20).map((item) => {
                const isExpiring = new Date(item.expiryDate).getTime() - new Date().getTime() < 7 * 24 * 60 * 60 * 1000
                const isExpired = new Date(item.expiryDate) < new Date()
                
                return (
                  <TableRow key={item.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <QrCode className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="font-mono text-xs">{item.batch}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium text-sm">{item.productName}</TableCell>
                    <TableCell>
                      <div className="text-xs">
                        <p className="font-medium">{item.warehouse}</p>
                        <p className="text-muted-foreground">{item.location}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium text-sm">
                      {item.quantity.toLocaleString()} kg
                    </TableCell>
                    <TableCell>
                      <Badge 
                        className={`text-[10px] px-1.5 py-0 ${
                          item.quality === 'A' ? 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/10' :
                          item.quality === 'B' ? 'bg-amber-500/10 text-amber-600 hover:bg-amber-500/10' :
                          'bg-slate-100 text-slate-600 hover:bg-slate-100'
                        }`}
                      >
                        Grade {item.quality}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge 
                        className={`text-[10px] px-1.5 py-0 ${
                          item.status === 'fresh' ? 'bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/10' :
                          item.status === 'good' ? 'bg-blue-500/10 text-blue-600 hover:bg-blue-500/10' :
                          'bg-amber-500/10 text-amber-600 hover:bg-amber-500/10'
                        }`}
                      >
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {formatDate(item.harvestDate)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-xs">
                        {isExpiring && !isExpired && (
                          <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                        )}
                        <span className={isExpiring && !isExpired ? 'text-amber-600 font-medium' : 'text-muted-foreground'}>
                          {formatDate(item.expiryDate)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="icon" className="h-7 w-7" asChild>
                        <Link href={`/gudang/traceability?batch=${item.batch}`}>
                          <QrCode className="h-3.5 w-3.5" />
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
