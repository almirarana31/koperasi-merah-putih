'use client'

import { useState } from 'react'
import { DollarSign, Package, Search, ShoppingCart, Store, TrendingUp } from 'lucide-react'
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
  const scaleFactor = filters.provinceId === 'all' ? 1.0 : filters.regionId === 'all' ? 0.4 : filters.villageId === 'all' ? 0.15 : 0.05

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

  const totalStock = listings.reduce((total, listing) => total + listing.stockKg, 0) * scaleFactor
  const totalValue = listings.reduce((total, listing) => total + listing.stockKg * listing.price, 0) * scaleFactor
  const avgPrice = listings.length === 0 ? 0 : listings.reduce((total, listing) => total + listing.price, 0) / listings.length

  const regionalStock = [...new Map(
    listings.map((listing) => [
      listing.regionId,
      {
        region: listing.regionName,
        stock: Math.round(listings.filter((item) => item.regionId === listing.regionId).reduce((total, item) => total + item.stockKg, 0) * scaleFactor),
      },
    ]),
  ).values()]

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Badge className="w-fit rounded-none border border-emerald-200 bg-emerald-50 text-emerald-700 font-black uppercase tracking-widest text-[10px]">Integrasi Niaga & Marketplace Nasional</Badge>
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 uppercase">Hub Marketplace</h1>
          <p className="text-sm font-bold text-slate-500 uppercase tracking-wide">
            Monitoring Listing Komoditas Lintas Koperasi: {getScopeCaption(scopedFilters)}
          </p>
        </div>
      </div>

      {showHierarchyFilter && <KementerianFilterBar filters={filters} setFilters={setFilters} />}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'LISTING AKTIF', value: Math.round(listings.length * scaleFactor).toLocaleString('id-ID'), sub: 'SKU TERPUBLIKASI', icon: Store, tone: 'slate' },
          { label: 'STOK TERSEDIA', value: `${(totalStock / 1000).toLocaleString('id-ID', { maximumFractionDigits: 1 })} TON`, sub: 'VOLUME SIAP DISTRIBUSI', icon: Package, tone: 'emerald' },
          { label: 'NILAI LISTING', value: formatCurrency(totalValue), sub: 'VALUASI ASSET NIAGA', icon: DollarSign, tone: 'blue' },
          { label: 'HARGA RATA-RATA', value: formatCurrency(avgPrice), sub: 'INDEX HARGA KATALOG', icon: TrendingUp, tone: 'slate' },
        ].map((stat, i) => (
          <Card key={i} className="rounded-none border-none bg-white shadow-sm overflow-hidden group border-t-4 border-t-slate-900">
            <div className={`absolute top-0 left-0 h-1 w-full ${stat.tone === 'emerald' ? 'bg-emerald-500' : stat.tone === 'blue' ? 'bg-blue-500' : 'bg-slate-900'}`} />
            <CardHeader className="p-4 pb-2">
              <div className="flex justify-between items-start">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{stat.label}</p>
                <stat.icon className="h-4 w-4 text-slate-400 group-hover:text-slate-900 transition-colors" />
              </div>
              <CardTitle className="text-2xl font-black text-slate-900 mt-1">{stat.value}</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="text-[10px] font-bold text-slate-500 mt-1 uppercase tracking-tighter">{stat.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="rounded-none border-slate-200 shadow-sm">
        <CardContent className="grid gap-3 p-4 lg:grid-cols-[1.1fr_220px_220px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Cari listing, koperasi, atau wilayah..."
              className="pl-9 rounded-none border-slate-200 font-semibold"
            />
          </div>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="rounded-none border-slate-200 font-semibold">
              <SelectValue placeholder="Semua Kategori" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Kategori</SelectItem>
              <SelectItem value="Pangan">Pangan</SelectItem>
              <SelectItem value="Hortikultura">Hortikultura</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="rounded-none border-slate-200 font-semibold">
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

      <div className="grid gap-5 lg:grid-cols-2">
        <Card className="rounded-none border-slate-200 shadow-sm overflow-hidden border-t-4 border-t-slate-900">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100">
            <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-900">Sebaran Stok Regional</CardTitle>
            <CardDescription className="text-[10px] font-bold text-slate-500 uppercase">Ketersediaan Komoditas Marketplace Lintas Kabupaten/Kota</CardDescription>
          </CardHeader>
          <CardContent className="h-[320px] p-4 pt-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regionalStock}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="region" tickLine={false} axisLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }} />
                <Bar dataKey="stock" fill="#16a34a" radius={0} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="rounded-none border-slate-200 shadow-sm overflow-hidden border-t-4 border-t-slate-900">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100">
            <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-900">Listing Komoditas Unggulan</CardTitle>
            <CardDescription className="text-[10px] font-bold text-slate-500 uppercase">Produk dengan Rating dan Ketersediaan Stok Tertinggi</CardDescription>
          </CardHeader>
          <CardContent className="p-4 overflow-y-auto max-h-[320px]">
            <div className="space-y-3">
              {listings.slice(0, 10).map((listing) => (
                <div key={listing.id} className="rounded-none border border-slate-100 bg-slate-50/50 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[11px] font-black text-slate-900 uppercase tracking-tight">{listing.commodityName}</p>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">{listing.cooperativeName}</p>
                    </div>
                    {listing.featured && (
                      <Badge className="rounded-none border border-amber-200 bg-amber-50 text-amber-700 text-[9px] font-black uppercase px-2 py-0">Unggulan</Badge>
                    )}
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-2 text-[10px] font-bold text-slate-500 uppercase">
                    <p className="text-slate-900">{formatCurrency(listing.price)} / {listing.unit}</p>
                    <p className="text-right">STOK {(listing.stockKg * scaleFactor).toLocaleString('id-ID')} KG</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-none border-none bg-slate-900 text-white shadow-xl">
        <CardContent className="flex flex-col gap-4 p-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-3">
            <div className="rounded-none bg-slate-800 p-3">
              <ShoppingCart className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-sm font-black uppercase tracking-widest text-white">Ekosistem Marketplace Terintegrasi</p>
              <p className="text-xs font-bold text-slate-400 uppercase mt-1">
                Seluruh listing divalidasi dan disinkronkan secara real-time dengan stok gudang koperasi desa.
              </p>
            </div>
          </div>
          <Badge variant="outline" className="rounded-none border-slate-700 bg-slate-800 text-slate-400 font-black text-[10px] uppercase tracking-widest px-3 py-1">
            {Math.round(listings.length * scaleFactor)} LISTING TERSAMBUNG
          </Badge>
        </CardContent>
      </Card>
    </div>
  )
}
