'use client'

import { useState } from 'react'
import { Search, ShoppingCart, Store, TrendingUp } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import { useAuth } from '@/lib/auth/use-auth'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { KementerianFilterBar } from '@/components/dashboard/kementerian-filter-bar'
import {
  filterListingsByScope,
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

export default function MarketplacePage() {
  const { user } = useAuth()
  const showHierarchyFilter = user?.role === 'kementerian' || user?.role === 'pemda' || user?.role === 'sysadmin'

  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [sortBy, setSortBy] = useState('stock')
  const [filters, setFilters] = useState<ScopeFilters>({
    provinceId: 'all',
    regionId: 'all',
    villageId: 'all',
    cooperativeId: 'all',
    commodityId: 'all',
  })

  const scopedFilters = resolveOperationalFilters(user, filters)
  const listings = filterListingsByScope(scopedFilters)
    .filter((listing) => {
      const keyword = search.toLowerCase()
      const matchesSearch =
        listing.commodityName.toLowerCase().includes(keyword) ||
        listing.cooperativeName.toLowerCase().includes(keyword) ||
        listing.regionName.toLowerCase().includes(keyword)
      const matchesCategory = category === 'all' || listing.category === category
      return matchesSearch && matchesCategory
    })
    .sort((left, right) => {
      if (sortBy === 'price-low') return left.price - right.price
      if (sortBy === 'price-high') return right.price - left.price
      if (sortBy === 'rating') return right.rating - left.rating
      return right.stockKg - left.stockKg
    })

  const totalStock = listings.reduce((total, listing) => total + listing.stockKg, 0)
  const totalValue = listings.reduce((total, listing) => total + listing.stockKg * listing.price, 0)
  const avgPrice = listings.length === 0 ? 0 : listings.reduce((total, listing) => total + listing.price, 0) / listings.length

  const regionalStock = [...new Map(
    listings.map((listing) => [
      listing.regionId,
      {
        region: listing.regionName,
        stock: listings.filter((item) => item.regionId === listing.regionId).reduce((total, item) => total + item.stockKg, 0),
      },
    ]),
  ).values()]

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Badge className="w-fit border border-emerald-200 bg-emerald-50 text-emerald-700">Marketplace Lintas Koperasi</Badge>
        <div>
          <h1 className="text-slate-900">Marketplace</h1>
          <p className="text-muted-foreground">
            Listing marketplace teragregasi untuk {getScopeCaption(scopedFilters)} dengan stok dan harga yang sinkron di seluruh widget.
          </p>
        </div>
      </div>

      {showHierarchyFilter && <KementerianFilterBar filters={filters} setFilters={setFilters} />}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="border-slate-200 bg-white">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Listing Aktif</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{listings.length}</p>
            <p className="mt-2 text-sm text-muted-foreground">Semua listing dalam scope ini</p>
          </CardContent>
        </Card>
        <Card className="border-slate-200 bg-white">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Stok Tersedia</p>
            <p className="mt-2 text-3xl font-semibold text-emerald-600">{(totalStock / 1000).toFixed(1)} ton</p>
            <p className="mt-2 text-sm text-muted-foreground">Akan berubah saat filter wilayah/koperasi diganti</p>
          </CardContent>
        </Card>
        <Card className="border-slate-200 bg-white">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Nilai Listing</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{formatCurrency(totalValue)}</p>
            <p className="mt-2 text-sm text-muted-foreground">Dihitung dari stok dan harga listing yang terlihat</p>
          </CardContent>
        </Card>
        <Card className="border-slate-200 bg-white">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Harga Rata-rata</p>
            <p className="mt-2 text-3xl font-semibold text-blue-600">{formatCurrency(avgPrice)}</p>
            <p className="mt-2 text-sm text-muted-foreground">Rata-rata harga per listing pada scope aktif</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-200 bg-white">
        <CardContent className="grid gap-3 p-4 lg:grid-cols-[1.1fr_220px_220px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Cari listing, koperasi, atau wilayah"
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
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger>
              <SelectValue placeholder="Urutkan" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="stock">Stok Terbesar</SelectItem>
              <SelectItem value="price-low">Harga Termurah</SelectItem>
              <SelectItem value="price-high">Harga Tertinggi</SelectItem>
              <SelectItem value="rating">Rating Tertinggi</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <div className="space-y-5">
        <Card className="border-slate-200 bg-white">
          <CardHeader>
            <CardTitle>Stok per Regional</CardTitle>
            <CardDescription>Perbandingan ketersediaan marketplace lintas wilayah dengan filter aktif.</CardDescription>
          </CardHeader>
          <CardContent className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regionalStock}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="region" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Bar dataKey="stock" fill="#16a34a" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white">
          <CardHeader>
            <CardTitle>Listing Terpilih</CardTitle>
            <CardDescription>Grid ini membaca listing lintas desa yang sama dengan chart dan KPI di atas.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {listings.slice(0, 6).map((listing) => (
              <div key={listing.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-slate-900">{listing.commodityName}</p>
                    <p className="text-sm text-muted-foreground">{listing.cooperativeName}</p>
                  </div>
                  {listing.featured && (
                    <Badge className="border border-amber-200 bg-amber-50 text-amber-700">Unggulan</Badge>
                  )}
                </div>
                <div className="mt-4 space-y-2">
                  <p className="text-2xl font-semibold text-slate-900">{formatCurrency(listing.price)}</p>
                  <p className="text-sm text-muted-foreground">
                    {listing.stockKg.toLocaleString('id-ID')} {listing.unit} · {listing.regionName}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline" className="border-slate-200 bg-white text-slate-700">
                      Rating {listing.rating}
                    </Badge>
                    <Badge variant="outline" className="border-slate-200 bg-white text-slate-700">
                      {listing.category}
                    </Badge>
                    {listing.organic && (
                      <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700">
                        Organik
                      </Badge>
                    )}
                  </div>
                </div>
                <Button className="mt-5 w-full bg-rose-600 text-white hover:bg-rose-700">
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Lihat Detail
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {listings.slice(6).map((listing) => (
          <Card key={listing.id} className="border-slate-200 bg-white">
            <CardContent className="p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-medium text-slate-900">{listing.commodityName}</p>
                  <p className="text-sm text-muted-foreground">{listing.villageName} · {listing.regionName}</p>
                </div>
                <Store className="h-5 w-5 text-rose-600" />
              </div>
              <div className="mt-4 grid gap-2 text-sm text-muted-foreground">
                <span>{listing.cooperativeName}</span>
                <span>Stok {listing.stockKg.toLocaleString('id-ID')} {listing.unit}</span>
                <span>Gudang {listing.warehouseName}</span>
              </div>
              <div className="mt-4 flex items-end justify-between">
                <p className="text-xl font-semibold text-slate-900">{formatCurrency(listing.price)}</p>
                <div className="flex items-center gap-1 text-sm text-emerald-600">
                  <TrendingUp className="h-4 w-4" />
                  <span>{listing.reviews} review</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
