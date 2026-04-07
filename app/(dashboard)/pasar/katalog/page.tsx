'use client'

import { useState } from 'react'
import { Layers, Package, Search, Sparkles, Users } from 'lucide-react'
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
  const scaleFactor = filters.provinceId === 'all' ? 1.0 : filters.regionId === 'all' ? 0.4 : filters.villageId === 'all' ? 0.15 : 0.05

  const listings = filterListingsByScope(scopedFilters)
  const catalogRows = getCatalogAggregation(listings).filter((row) => {
    const keyword = search.toLowerCase()
    const matchesSearch = row.commodityName.toLowerCase().includes(keyword) || row.category.toLowerCase().includes(keyword)
    const matchesCategory = category === 'all' || row.category === category
    return matchesSearch && matchesCategory
  })

  const totalStock = catalogRows.reduce((total, row) => total + row.stockKg, 0) * scaleFactor
  const supplierCount = Math.round(catalogRows.reduce((total, row) => total + row.supplierCount, 0) * scaleFactor)
  const regionCoverage = Math.max(1, Math.round(new Set(catalogRows.map((row) => row.regionCount)).size * scaleFactor))

  const chartRows = catalogRows.map((row) => ({
    name: row.commodityName.replace(' Premium', ''),
    stock: Math.round((row.stockKg * scaleFactor) / 100),
  }))

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Badge className="w-fit rounded-none border border-amber-200 bg-amber-50 text-amber-700 font-black uppercase tracking-widest text-[10px]">Katalog Komoditas Nasional</Badge>
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 uppercase">Katalog Agregat</h1>
          <p className="text-sm font-bold text-slate-500 uppercase tracking-wide">
            SKU Agregat Lintas Koperasi Desa: {getScopeCaption(scopedFilters)}
          </p>
        </div>
      </div>

      {showHierarchyFilter && <KementerianFilterBar filters={filters} setFilters={setFilters} />}

      <Card className="rounded-none border-slate-200 shadow-sm">
        <CardContent className="grid gap-3 p-4 lg:grid-cols-[1.1fr_220px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Cari SKU, kategori, atau komoditas..."
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
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'SKU AGREGAT', value: Math.round(catalogRows.length * scaleFactor).toLocaleString('id-ID'), sub: 'KOMODITAS AKTIF DI KATALOG', icon: Package, tone: 'slate' },
          { label: 'VOLUME TOTAL', value: `${(totalStock / 1000).toLocaleString('id-ID', { maximumFractionDigits: 1 })} TON`, sub: 'AGREGASI LISTING TERSEDIA', icon: Layers, tone: 'emerald' },
          { label: 'SUPPLIER TERHUBUNG', value: supplierCount.toLocaleString('id-ID'), sub: 'KOPERASI PEMASOK AKTIF', icon: Users, tone: 'blue' },
          { label: 'CAKUPAN REGIONAL', value: regionCoverage.toLocaleString('id-ID'), sub: 'WILAYAH SUMBER KOMODITAS', icon: Sparkles, tone: 'slate' },
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

      <div className="space-y-5">
        <Card className="rounded-none border-slate-200 shadow-sm overflow-hidden border-t-4 border-t-slate-900">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100">
            <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-900">Volume per SKU Agregat</CardTitle>
            <CardDescription className="text-[10px] font-bold text-slate-500 uppercase">Ketersediaan Komoditas Lintas Supplier (Unit: 100 KG)</CardDescription>
          </CardHeader>
          <CardContent className="h-[320px] p-4 pt-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartRows}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }} />
                <Bar dataKey="stock" fill="#ca8a04" radius={0} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {catalogRows.slice(0, 12).map((row) => (
            <Card key={row.commodityId} className="rounded-none border-slate-200 hover:border-slate-900 transition-colors shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-black text-slate-900 uppercase tracking-tight">{row.commodityName}</p>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter mt-0.5">{row.category}</p>
                  </div>
                  <Sparkles className="h-4 w-4 text-amber-500" />
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge variant="outline" className="rounded-none border-slate-200 bg-slate-50 text-slate-700 text-[9px] font-black uppercase tracking-widest">
                    {Math.max(1, Math.round(row.supplierCount * scaleFactor))} KOPERASI
                  </Badge>
                  <Badge variant="outline" className="rounded-none border-slate-200 bg-slate-50 text-slate-700 text-[9px] font-black uppercase tracking-widest">
                    {Math.max(1, Math.round(row.regionCount * scaleFactor))} WILAYAH
                  </Badge>
                  <Badge variant="outline" className="rounded-none border-slate-200 bg-slate-50 text-slate-700 text-[9px] font-black uppercase tracking-widest">
                    RATING {row.rating}
                  </Badge>
                </div>
                <div className="mt-4 space-y-2 border-t border-slate-100 pt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Harga rata-rata</span>
                    <span className="text-sm font-black text-slate-900">{formatCurrency(row.avgPrice)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Volume total</span>
                    <span className="text-sm font-black text-slate-900">{(row.stockKg * scaleFactor).toLocaleString('id-ID', { maximumFractionDigits: 1 })} {row.unit}</span>
                  </div>
                </div>
                <div className="mt-4 rounded-none border border-slate-100 bg-slate-50/50 p-3">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase">
                    <Layers className="h-3 w-3" />
                    <span>Sinkronisasi Marketplace Nasional</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Card className="rounded-none border-none bg-slate-900 text-white shadow-xl">
        <CardContent className="flex flex-col gap-4 p-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-3">
            <div className="rounded-none bg-slate-800 p-3">
              <Package className="h-5 w-5 text-amber-400" />
            </div>
            <div>
              <p className="text-sm font-black uppercase tracking-widest text-white">Katalog Terpusat & Akurat</p>
              <p className="text-xs font-bold text-slate-400 uppercase mt-1">
                Data katalog dihitung dari seluruh listing aktif pada jaringan marketplace yang tersinkron.
              </p>
            </div>
          </div>
          <Badge variant="outline" className="rounded-none border-slate-700 bg-slate-800 text-slate-400 font-black text-[10px] uppercase tracking-widest px-3 py-1">
            {Math.round(listings.length * scaleFactor)} LISTING SUMBER
          </Badge>
        </CardContent>
      </Card>
    </div>
  )
}
