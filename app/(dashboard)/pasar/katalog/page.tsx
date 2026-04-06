'use client'

import { useState } from 'react'
import { Layers, Package, Search, Sparkles } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import { useAuth } from '@/lib/auth/use-auth'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { KementerianFilterBar } from '@/components/dashboard/kementerian-filter-bar'
import {
  filterListingsByScope,
  getCatalogAggregation,
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

function formatCurrency(value: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value)
}

export default function KatalogKementerianPage() {
  const { user } = useAuth()
  const showHierarchyFilter = user?.role === 'kementerian' || user?.role === 'pemda' || user?.role === 'sysadmin'

  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [filters, setFilters] = useState<ScopeFilters>({
    provinceId: 'all',
    regionId: 'all',
    villageId: 'all',
    cooperativeId: 'all',
    commodityId: 'all',
  })

  const scopedFilters = resolveOperationalFilters(user, filters)
  const listings = filterListingsByScope(scopedFilters)
  const catalogRows = getCatalogAggregation(listings).filter((row) => {
    const keyword = search.toLowerCase()
    const matchesSearch = row.commodityName.toLowerCase().includes(keyword) || row.category.toLowerCase().includes(keyword)
    const matchesCategory = category === 'all' || row.category === category
    return matchesSearch && matchesCategory
  })

  const totalStock = catalogRows.reduce((total, row) => total + row.stockKg, 0)
  const supplierCount = catalogRows.reduce((total, row) => total + row.supplierCount, 0)
  const regionCoverage = new Set(catalogRows.map((row) => row.regionCount)).size

  const chartRows = catalogRows.map((row) => ({
    name: row.commodityName.replace(' Premium', ''),
    stock: Math.round(row.stockKg / 100),
  }))

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Badge className="w-fit border border-amber-200 bg-amber-50 text-amber-700">Katalog Agregat</Badge>
        <div>
          <h1 className="text-slate-900">Katalog</h1>
          <p className="text-muted-foreground">
            SKU agregat lintas koperasi untuk {getScopeCaption(scopedFilters)}. Supplier, wilayah, dan stok dihitung dari listing aktif yang sama.
          </p>
        </div>
      </div>

      {showHierarchyFilter && <KementerianFilterBar filters={filters} setFilters={setFilters} />}

      <Card className="border-slate-200 bg-white">
        <CardContent className="grid gap-3 p-4 lg:grid-cols-[1.1fr_220px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Cari SKU, kategori, atau komoditas"
              className="pl-9"
            />
          </div>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Semua Kategori" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Kategori</SelectItem>
              <SelectItem value="Pangan">Pangan</SelectItem>
              <SelectItem value="Hortikultura">Hortikultura</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="border-slate-200 bg-white">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">SKU Agregat</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{catalogRows.length}</p>
            <p className="mt-2 text-sm text-muted-foreground">Komoditas yang tampil di katalog aktif</p>
          </CardContent>
        </Card>
        <Card className="border-slate-200 bg-white">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Volume Total</p>
            <p className="mt-2 text-3xl font-semibold text-emerald-600">{(totalStock / 1000).toFixed(1)} ton</p>
            <p className="mt-2 text-sm text-muted-foreground">Hasil agregasi seluruh listing tersaring</p>
          </CardContent>
        </Card>
        <Card className="border-slate-200 bg-white">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Supplier Terhubung</p>
            <p className="mt-2 text-3xl font-semibold text-blue-600">{supplierCount}</p>
            <p className="mt-2 text-sm text-muted-foreground">Koperasi pemasok dalam katalog saat ini</p>
          </CardContent>
        </Card>
        <Card className="border-slate-200 bg-white">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Cakupan Regional</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{regionCoverage}</p>
            <p className="mt-2 text-sm text-muted-foreground">Jumlah cakupan region dari SKU yang tampil</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-5 xl:grid-cols-[0.95fr_1.05fr]">
        <Card className="border-slate-200 bg-white">
          <CardHeader>
            <CardTitle>Volume per SKU</CardTitle>
            <CardDescription>Komoditas ditampilkan berdasarkan volume lintas supplier yang aktif pada scope sekarang.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartRows}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="name" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Bar dataKey="stock" fill="#ca8a04" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          {catalogRows.map((row) => (
            <Card key={row.commodityId} className="border-slate-200 bg-white">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-slate-900">{row.commodityName}</p>
                    <p className="text-sm text-muted-foreground">{row.category}</p>
                  </div>
                  <Sparkles className="h-5 w-5 text-amber-600" />
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge variant="outline" className="border-slate-200 bg-slate-50 text-slate-700">
                    {row.supplierCount} koperasi
                  </Badge>
                  <Badge variant="outline" className="border-slate-200 bg-slate-50 text-slate-700">
                    {row.regionCount} wilayah
                  </Badge>
                  <Badge variant="outline" className="border-slate-200 bg-slate-50 text-slate-700">
                    Rating {row.rating}
                  </Badge>
                </div>
                <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center justify-between">
                    <span>Harga rata-rata</span>
                    <span className="font-medium text-slate-900">{formatCurrency(row.avgPrice)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span>Volume total</span>
                    <span className="font-medium text-slate-900">{row.stockKg.toLocaleString('id-ID')} {row.unit}</span>
                  </div>
                </div>
                <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Layers className="h-4 w-4" />
                    <span>SKU ini disusun dari listing marketplace lintas koperasi yang aktif pada filter terpilih.</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Card className="border-slate-200 bg-slate-50">
        <CardContent className="flex flex-col gap-4 p-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-3">
            <div className="rounded-2xl bg-white p-3 shadow-sm">
              <Package className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <p className="font-medium text-slate-900">Katalog Tersinkron</p>
              <p className="text-sm text-muted-foreground">
                Halaman ini tidak menyimpan data lokal sendiri. Semua SKU diambil dari listing Pasar yang sama sehingga volume dan cakupan wilayah tetap konsisten.
              </p>
            </div>
          </div>
          <Badge variant="outline" className="w-fit border-slate-200 bg-white text-slate-700">
            {listings.length} listing sumber
          </Badge>
        </CardContent>
      </Card>
    </div>
  )
}
