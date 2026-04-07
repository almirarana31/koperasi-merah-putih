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
  const scaleFactor = filters.provinceId === 'all' ? 1.0 : filters.regionId === 'all' ? 0.4 : filters.villageId === 'all' ? 0.15 : 0.05

  const filteredPrices = filterPricesByScope(scopedFilters).filter((row) => {
    const keyword = search.toLowerCase()
    return (
      row.commodityName.toLowerCase().includes(keyword) ||
      row.cooperativeName.toLowerCase().includes(keyword) ||
      row.regionName.toLowerCase().includes(keyword)
    )
  })

  const naik = Math.round(filteredPrices.filter((row) => row.currentPrice > row.previousPrice).length * scaleFactor)
  const turun = Math.round(filteredPrices.filter((row) => row.currentPrice < row.previousPrice).length * scaleFactor)
  const stabil = Math.round((filteredPrices.length - (filteredPrices.filter((row) => row.currentPrice > row.previousPrice).length) - (filteredPrices.filter((row) => row.currentPrice < row.previousPrice).length)) * scaleFactor)
  const avgVolatility =
    filteredPrices.length === 0
      ? 0
      : filteredPrices.reduce((total, row) => total + Math.abs((row.currentPrice - row.previousPrice) / row.previousPrice), 0) /
        filteredPrices.length

  const regionalComparison = getPriceComparisonByRegion(filteredPrices).map((row) => ({
    ...row,
    avgPrice: Math.round((row.avgPrice) / 1000),
  }))

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Badge className="w-fit rounded-none border border-rose-200 bg-rose-50 text-rose-700 font-black uppercase tracking-widest text-[10px]">Indeks Harga Lintas Wilayah</Badge>
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 uppercase">Pusat Informasi Harga</h1>
          <p className="text-sm font-bold text-slate-500 uppercase tracking-wide">
            Monitoring Fluktuasi dan Agregasi Harga: {getScopeCaption(scopedFilters)}
          </p>
        </div>
      </div>

      {showHierarchyFilter && <KementerianFilterBar filters={filters} setFilters={setFilters} />}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'KOMODITAS TERPANTAU', value: Math.round(filteredPrices.length * scaleFactor).toLocaleString('id-ID'), sub: 'SKU DALAM SCOPE AKTIF', icon: TrendingUp, tone: 'slate' },
          { label: 'TREN HARGA NAIK', value: naik.toLocaleString('id-ID'), sub: 'KOMODITAS MENGALAMI KENAIKAN', icon: ArrowUpRight, tone: 'rose' },
          { label: 'TREN HARGA TURUN', value: turun.toLocaleString('id-ID'), sub: 'KOMODITAS MENGALAMI PENURUNAN', icon: ArrowDownRight, tone: 'emerald' },
          { label: 'VOLATILITAS RATA-RATA', value: `${(avgVolatility * 100).toFixed(1)}%`, sub: 'STABILITAS HARGA NASIONAL', icon: Minus, tone: 'blue' },
        ].map((stat, i) => (
          <Card key={i} className="rounded-none border-none bg-white shadow-sm overflow-hidden group border-t-4 border-t-slate-900">
            <div className={`absolute top-0 left-0 h-1 w-full ${stat.tone === 'rose' ? 'bg-rose-500' : stat.tone === 'emerald' ? 'bg-emerald-500' : stat.tone === 'blue' ? 'bg-blue-500' : 'bg-slate-900'}`} />
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
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Cari komoditas, koperasi, atau wilayah..."
              className="pl-9 rounded-none border-slate-200 font-semibold"
            />
          </div>
        </CardContent>
      </Card>

      <div className="space-y-5">
        <Card className="rounded-none border-slate-200 shadow-sm overflow-hidden border-t-4 border-t-slate-900">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100">
            <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-900">Perbandingan Harga Regional</CardTitle>
            <CardDescription className="text-[10px] font-bold text-slate-500 uppercase">Harga Rata-rata Komoditas Strategis (Ribuan IDR)</CardDescription>
          </CardHeader>
          <CardContent className="h-[320px] p-4 pt-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regionalComparison}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="region" tickLine={false} axisLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }} />
                <Bar dataKey="avgPrice" fill="#0f172a" radius={0} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="rounded-none border-slate-200 shadow-sm overflow-hidden border-t-4 border-t-slate-900">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100">
            <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-900">Feed Perubahan Harga Real-time</CardTitle>
            <CardDescription className="text-[10px] font-bold text-slate-500 uppercase">Log Perubahan Harga Lintas Koperasi Berdasarkan Filter Aktif</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 p-4 xl:grid-cols-2">
            {filteredPrices.slice(0, 8).map((row) => {
              const change = ((row.currentPrice - row.previousPrice) / row.previousPrice) * 100
              const positive = change > 0
              const negative = change < 0

              return (
                <div key={row.id} className="rounded-none border border-slate-100 bg-slate-50/50 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[11px] font-black text-slate-900 uppercase">{row.commodityName}</p>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">{row.regionName} · {row.cooperativeName}</p>
                    </div>
                    <div
                      className={`flex items-center gap-1 text-[11px] font-black uppercase ${
                        positive ? 'text-rose-600' : negative ? 'text-emerald-600' : 'text-slate-500'
                      }`}
                    >
                      {positive ? <ArrowUpRight className="h-4 w-4" /> : negative ? <ArrowDownRight className="h-4 w-4" /> : <Minus className="h-4 w-4" />}
                      {change.toFixed(1)}%
                    </div>
                  </div>
                  <div className="mt-3 grid gap-2 text-[10px] font-bold text-slate-500 uppercase md:grid-cols-3">
                    <span className="text-slate-900">SEKARANG {formatCurrency(row.currentPrice)}</span>
                    <span>MINGGUAN {formatCurrency(row.weeklyAverage)}</span>
                    <span>BULANAN {formatCurrency(row.monthlyAverage)}</span>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-none border-slate-200 shadow-sm overflow-hidden border-t-4 border-t-slate-900">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100">
          <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-900">Matriks Harga Pasar Terpadu</CardTitle>
          <CardDescription className="text-[10px] font-bold text-slate-500 uppercase">Data Agregasi Harga Berdasarkan Multi-entitas Koperasi</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="text-[10px] font-black uppercase tracking-widest">Komoditas/Desa</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest">Wilayah</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest">Koperasi</TableHead>
                <TableHead className="text-right text-[10px] font-black uppercase tracking-widest">Harga Kini</TableHead>
                <TableHead className="text-right text-[10px] font-black uppercase tracking-widest">Perubahan</TableHead>
                <TableHead className="text-right text-[10px] font-black uppercase tracking-widest">Rata Minggu</TableHead>
                <TableHead className="text-right text-[10px] font-black uppercase tracking-widest">Rata Bulan</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPrices.slice(0, 15).map((row) => {
                const change = ((row.currentPrice - row.previousPrice) / row.previousPrice) * 100

                return (
                  <TableRow key={row.id} className="hover:bg-slate-50/50 transition-colors">
                    <TableCell>
                      <div>
                        <p className="text-[11px] font-black text-slate-900 uppercase">{row.commodityName}</p>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">{row.villageName}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-[11px] font-bold uppercase">{row.regionName}</TableCell>
                    <TableCell className="text-[11px] font-bold uppercase">{row.cooperativeName}</TableCell>
                    <TableCell className="text-right text-[11px] font-black">{formatCurrency(row.currentPrice)}</TableCell>
                    <TableCell className={`text-right text-[11px] font-black ${change > 0 ? 'text-rose-600' : change < 0 ? 'text-emerald-600' : 'text-slate-500'}`}>
                      {change > 0 ? '+' : ''}
                      {change.toFixed(1)}%
                    </TableCell>
                    <TableCell className="text-right text-[11px] font-bold text-slate-500">{formatCurrency(row.weeklyAverage)}</TableCell>
                    <TableCell className="text-right text-[11px] font-bold text-slate-500">{formatCurrency(row.monthlyAverage)}</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="rounded-none border-none bg-slate-900 text-white shadow-xl">
        <CardContent className="flex flex-col gap-4 p-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-3">
            <div className="rounded-none bg-slate-800 p-3">
              <TrendingUp className="h-5 w-5 text-rose-400" />
            </div>
            <div>
              <p className="text-sm font-black uppercase tracking-widest text-white">Sinkronisasi Indeks Harga</p>
              <p className="text-xs font-bold text-slate-400 uppercase mt-1">
                Data harga diperbarui setiap 15 menit melalui jaringan input koperasi desa nasional.
              </p>
            </div>
          </div>
          <Badge variant="outline" className="rounded-none border-slate-700 bg-slate-800 text-slate-400 font-black text-[10px] uppercase tracking-widest px-3 py-1">
            {stabil} KOMODITAS STABIL
          </Badge>
        </CardContent>
      </Card>
    </div>
  )
}