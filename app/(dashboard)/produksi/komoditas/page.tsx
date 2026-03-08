'use client'

import { useState } from 'react'
import { Search, Plus, Package, TrendingUp } from 'lucide-react'
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
import { commodities, formatCurrency } from '@/lib/data'

const categoryLabels: Record<string, string> = {
  pangan: 'Pangan',
  hortikultura: 'Hortikultura',
  perkebunan: 'Perkebunan',
  peternakan: 'Peternakan',
  perikanan: 'Perikanan',
}

const categoryColors: Record<string, string> = {
  pangan: 'bg-emerald-500/10 text-emerald-500',
  hortikultura: 'bg-amber-500/10 text-amber-500',
  perkebunan: 'bg-violet-500/10 text-violet-500',
  peternakan: 'bg-blue-500/10 text-blue-500',
  perikanan: 'bg-cyan-500/10 text-cyan-500',
}

export default function KomoditasPage() {
  const [search, setSearch] = useState('')
  const [filterCategory, setFilterCategory] = useState<string>('all')

  const filteredCommodities = commodities.filter((commodity) => {
    const matchesSearch = commodity.nama
      .toLowerCase()
      .includes(search.toLowerCase())
    const matchesCategory =
      filterCategory === 'all' || commodity.kategori === filterCategory
    return matchesSearch && matchesCategory
  })

  const totalStock = commodities.reduce((sum, c) => sum + c.stokTotal, 0)
  const totalValue = commodities.reduce(
    (sum, c) => sum + c.stokTotal * c.hargaAcuan,
    0
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Daftar Komoditas</h1>
          <p className="text-muted-foreground">
            Kelola master data komoditas
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Tambah Komoditas
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Package className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{commodities.length}</p>
                <p className="text-xs text-muted-foreground">Jenis Komoditas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
                <TrendingUp className="h-5 w-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {(totalStock / 1000).toFixed(1)} ton
                </p>
                <p className="text-xs text-muted-foreground">Total Stok</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
                <TrendingUp className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{formatCurrency(totalValue)}</p>
                <p className="text-xs text-muted-foreground">Estimasi Nilai</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Cari komoditas..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kategori</SelectItem>
                <SelectItem value="pangan">Pangan</SelectItem>
                <SelectItem value="hortikultura">Hortikultura</SelectItem>
                <SelectItem value="perkebunan">Perkebunan</SelectItem>
                <SelectItem value="peternakan">Peternakan</SelectItem>
                <SelectItem value="perikanan">Perikanan</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Master Komoditas</CardTitle>
          <CardDescription>
            {filteredCommodities.length} komoditas terdaftar
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nama Komoditas</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>Satuan</TableHead>
                <TableHead>Harga Acuan</TableHead>
                <TableHead>Stok Total</TableHead>
                <TableHead>Nilai Stok</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCommodities.map((commodity) => (
                <TableRow key={commodity.id}>
                  <TableCell className="font-mono text-sm">
                    {commodity.id}
                  </TableCell>
                  <TableCell className="font-medium">{commodity.nama}</TableCell>
                  <TableCell>
                    <Badge className={categoryColors[commodity.kategori]}>
                      {categoryLabels[commodity.kategori]}
                    </Badge>
                  </TableCell>
                  <TableCell>{commodity.satuan}</TableCell>
                  <TableCell>{formatCurrency(commodity.hargaAcuan)}</TableCell>
                  <TableCell>
                    {commodity.stokTotal.toLocaleString()} {commodity.satuan}
                  </TableCell>
                  <TableCell className="font-medium">
                    {formatCurrency(commodity.stokTotal * commodity.hargaAcuan)}
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
