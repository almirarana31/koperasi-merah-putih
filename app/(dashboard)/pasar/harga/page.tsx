'use client'

import { useState } from 'react'
import { ArrowDownRight, ArrowUpRight, Minus, Search, TrendingUp } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import { useAuth } from '@/lib/auth/use-auth'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { KementerianFilterBar } from '@/components/dashboard/kementerian-filter-bar'
import {
  filterPricesByScope,
  getPriceComparisonByRegion,
  getScopeCaption,
  resolveOperationalFilters,
} from '@/lib/cross-entity-operations'
import type { ScopeFilters } from '@/lib/kementerian-dashboard-data'
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

export default function HargaPasarPage() {
  const { user } = useAuth()
  const showHierarchyFilter = user?.role === 'kementerian' || user?.role === 'pemda' || user?.role === 'sysadmin'

  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState<ScopeFilters>({
    provinceId: 'all',
    regionId: 'all',
    villageId: 'all',
    cooperativeId: 'all',
    commodityId: 'all',
  })

  const scopedFilters = resolveOperationalFilters(user, filters)
  const filteredPrices = filterPricesByScope(scopedFilters).filter((row) => {
    const keyword = search.toLowerCase()
    return (
      row.commodityName.toLowerCase().includes(keyword) ||
      row.cooperativeName.toLowerCase().includes(keyword) ||
      row.regionName.toLowerCase().includes(keyword)
    )
  })

  const naik = filteredPrices.filter((row) => row.currentPrice > row.previousPrice).length
  const turun = filteredPrices.filter((row) => row.currentPrice < row.previousPrice).length
  const stabil = filteredPrices.length - naik - turun
  const avgVolatility =
    filteredPrices.length === 0
      ? 0
      : filteredPrices.reduce((total, row) => total + Math.abs((row.currentPrice - row.previousPrice) / row.previousPrice), 0) /
        filteredPrices.length

  const regionalComparison = getPriceComparisonByRegion(filteredPrices).map((row) => ({
    ...row,
    avgPrice: Math.round(row.avgPrice / 1000),
  }))

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Badge className="w-fit border border-rose-200 bg-rose-50 text-rose-700">Harga Lintas Wilayah</Badge>
        <div>
          <h1 className="text-slate-900">Harga Pasar</h1>
          <p className="text-muted-foreground">
            Agregasi harga pasar dari {getScopeCaption(scopedFilters)} dengan pembanding regional yang ikut bergerak saat filter berubah.
          </p>
        </div>
      </div>

      {showHierarchyFilter && <KementerianFilterBar filters={filters} setFilters={setFilters} />}

      <Card className="border-slate-200 bg-white">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Cari komoditas, koperasi, atau wilayah"
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="border-slate-200 bg-white">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Komoditas Tercatat</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{filteredPrices.length}</p>
            <p className="mt-2 text-sm text-muted-foreground">Baris harga dalam scope saat ini</p>
          </CardContent>
        </Card>
        <Card className="border-slate-200 bg-white">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Harga Naik</p>
            <p className="mt-2 text-3xl font-semibold text-emerald-600">{naik}</p>
            <p className="mt-2 text-sm text-muted-foreground">Dibanding harga sebelumnya</p>
          </CardContent>
        </Card>
        <Card className="border-slate-200 bg-white">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Harga Turun</p>
            <p className="mt-2 text-3xl font-semibold text-rose-600">{turun}</p>
            <p className="mt-2 text-sm text-muted-foreground">Memerlukan perhatian pasar</p>
          </CardContent>
        </Card>
        <Card className="border-slate-200 bg-white">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Volatilitas Rata-rata</p>
            <p className="mt-2 text-3xl font-semibold text-blue-600">{(avgVolatility * 100).toFixed(1)}%</p>
            <p className="mt-2 text-sm text-muted-foreground">Berasal dari harga dalam scope yang sama</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-5">
        <Card className="border-slate-200 bg-white">
          <CardHeader>
            <CardTitle>Perbandingan Harga Regional</CardTitle>
            <CardDescription>Harga rata-rata lintas wilayah menggunakan volume nyata dari data pasar yang difilter.</CardDescription>
          </CardHeader>
          <CardContent className="h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regionalComparison}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="region" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Bar dataKey="avgPrice" fill="#d32f2f" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white">
          <CardHeader>
            <CardTitle>Feed Perubahan Harga</CardTitle>
            <CardDescription>Semua catatan di bawah mengikuti kombinasi desa, koperasi, dan komoditas yang aktif.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 xl:grid-cols-2">
            {filteredPrices.slice(0, 8).map((row) => {
              const change = ((row.currentPrice - row.previousPrice) / row.previousPrice) * 100
              const positive = change > 0
              const negative = change < 0

              return (
                <div key={row.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="font-medium text-slate-900">{row.commodityName}</p>
                      <p className="text-sm text-muted-foreground">{row.regionName} · {row.cooperativeName}</p>
                    </div>
                    <div
                      className={`flex items-center gap-1 text-sm font-medium ${
                        positive ? 'text-emerald-600' : negative ? 'text-rose-600' : 'text-slate-500'
                      }`}
                    >
                      {positive ? <ArrowUpRight className="h-4 w-4" /> : negative ? <ArrowDownRight className="h-4 w-4" /> : <Minus className="h-4 w-4" />}
                      {change.toFixed(1)}%
                    </div>
                  </div>
                  <div className="mt-3 grid gap-2 text-sm text-muted-foreground md:grid-cols-3">
                    <span>Sekarang {formatCurrency(row.currentPrice)}</span>
                    <span>Mingguan {formatCurrency(row.weeklyAverage)}</span>
                    <span>Bulanan {formatCurrency(row.monthlyAverage)}</span>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-200 bg-white">
        <CardHeader>
          <CardTitle>Matriks Harga Pasar</CardTitle>
          <CardDescription>Tabel harga ini tidak memakai asumsi satu desa. Semua kolom disusun dari agregasi multi-entitas.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Komoditas</TableHead>
                <TableHead>Wilayah</TableHead>
                <TableHead>Koperasi</TableHead>
                <TableHead className="text-right">Harga Kini</TableHead>
                <TableHead className="text-right">Perubahan</TableHead>
                <TableHead className="text-right">Rata Minggu</TableHead>
                <TableHead className="text-right">Rata Bulan</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPrices.map((row) => {
                const change = ((row.currentPrice - row.previousPrice) / row.previousPrice) * 100

                return (
                  <TableRow key={row.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-slate-900">{row.commodityName}</p>
                        <p className="text-sm text-muted-foreground">{row.villageName}</p>
                      </div>
                    </TableCell>
                    <TableCell>{row.regionName}</TableCell>
                    <TableCell>{row.cooperativeName}</TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(row.currentPrice)}</TableCell>
                    <TableCell className={`text-right font-medium ${change > 0 ? 'text-emerald-600' : change < 0 ? 'text-rose-600' : 'text-slate-500'}`}>
                      {change > 0 ? '+' : ''}
                      {change.toFixed(1)}%
                    </TableCell>
                    <TableCell className="text-right">{formatCurrency(row.weeklyAverage)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(row.monthlyAverage)}</TableCell>
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
              <TrendingUp className="h-5 w-5 text-rose-600" />
            </div>
            <div>
              <p className="font-medium text-slate-900">Harga Tersinkron</p>
              <p className="text-sm text-muted-foreground">
                Chart, feed, dan tabel di atas memakai record harga yang sama, sehingga perubahan filter langsung mengubah seluruh tampilan.
              </p>
            </div>
          </div>
          <Badge variant="outline" className="w-fit border-slate-200 bg-white text-slate-700">
            {stabil} komoditas stabil pada scope ini
          </Badge>
        </CardContent>
      </Card>
    </div>
  )
}
