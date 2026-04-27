'use client'

import { useState } from 'react'
import { ArrowDownRight, ArrowUpRight, Minus, Search, TrendingUp } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts'
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
import { DataTable, type DataTableColumn } from '@/components/ui/data-table'

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

  type PriceRow = (typeof filteredPrices)[number]
  const priceColumns: DataTableColumn<PriceRow>[] = [
    {
      key: 'commodity',
      header: 'Komoditas / Desa',
      cell: (row) => (
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">{row.commodityName}</p>
          <p className="truncate text-xs text-muted-foreground">{row.villageName}</p>
        </div>
      ),
    },
    { key: 'region', header: 'Wilayah', cell: (row) => <span className="text-sm">{row.regionName}</span> },
    { key: 'cooperative', header: 'Koperasi', cell: (row) => <span className="text-sm">{row.cooperativeName}</span> },
    {
      key: 'price',
      header: 'Harga Kini',
      align: 'right',
      cell: (row) => <span className="tabular-nums font-medium">{formatCurrency(row.currentPrice)}</span>,
    },
    {
      key: 'change',
      header: 'Perubahan',
      align: 'right',
      cell: (row) => {
        const change = ((row.currentPrice - row.previousPrice) / row.previousPrice) * 100
        return (
          <span
            className={`tabular-nums font-medium ${
              change > 0 ? 'text-destructive' : change < 0 ? 'text-[color:var(--success)]' : 'text-muted-foreground'
            }`}
          >
            {change > 0 ? '+' : ''}
            {change.toFixed(1)}%
          </span>
        )
      },
    },
    {
      key: 'weekly',
      header: 'Rata Minggu',
      align: 'right',
      cell: (row) => <span className="tabular-nums text-muted-foreground">{formatCurrency(row.weeklyAverage)}</span>,
    },
    {
      key: 'monthly',
      header: 'Rata Bulan',
      align: 'right',
      cell: (row) => <span className="tabular-nums text-muted-foreground">{formatCurrency(row.monthlyAverage)}</span>,
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Pusat Informasi Harga</h1>
          <p className="text-[10px] font-black text-slate-500 mt-1 uppercase tracking-widest leading-relaxed">
            Indeks Harga Lintas Wilayah • Monitoring Fluktuasi & Agregasi Pasar: {getScopeCaption(scopedFilters)}
          </p>
        </div>
        <Badge variant="outline" className="h-6 rounded-none border-rose-200 bg-rose-50 text-rose-700 font-black uppercase tracking-widest text-[8px] px-3">
          Update: 15 Menit Lalu
        </Badge>
      </div>

      {showHierarchyFilter && <KementerianFilterBar filters={filters} setFilters={setFilters} />}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Komoditas Terpantau', value: Math.round(filteredPrices.length * scaleFactor).toLocaleString('id-ID'), sub: 'SKU Aktif', icon: TrendingUp, tone: 'slate' },
          { label: 'Tren Harga Naik', value: naik.toLocaleString('id-ID'), sub: 'Kenaikan Terdeteksi', icon: ArrowUpRight, tone: 'rose' },
          { label: 'Tren Harga Turun', value: turun.toLocaleString('id-ID'), sub: 'Penurunan Terdata', icon: ArrowDownRight, tone: 'emerald' },
          { label: 'Volatilitas Rata-Rata', value: `${(avgVolatility * 100).toFixed(1)}%`, sub: 'Indeks Stabilitas', icon: Minus, tone: 'blue' },
        ].map((s, i) => (
          <Card key={i} className="border-none shadow-sm bg-white overflow-hidden rounded-none">
             <div className={`h-1 w-full ${
              s.tone === 'rose' ? 'bg-rose-500' : 
              s.tone === 'emerald' ? 'bg-emerald-500' : 
              s.tone === 'blue' ? 'bg-blue-500' : 'bg-slate-900'
            }`} />
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-10 w-10 rounded-none bg-slate-50 flex items-center justify-center shrink-0 shadow-inner">
                <s.icon className={`h-5 w-5 ${
                  s.tone === 'rose' ? 'text-rose-500' : 
                  s.tone === 'emerald' ? 'text-emerald-500' : 
                  s.tone === 'blue' ? 'text-blue-500' : 'text-slate-900'
                }`} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{s.label}</p>
                <div className="flex flex-col">
                  <span className="text-sm font-black text-slate-900 leading-tight">{s.value}</span>
                  <span className="text-[8px] font-bold text-slate-500 uppercase tracking-tighter">{s.sub}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="rounded-none border-none shadow-sm bg-slate-900 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="CARI KOMODITAS, KOPERASI, ATAU WILAYAH STRATEGIS..."
            className="pl-9 h-10 rounded-none border-slate-800 bg-slate-950 text-white text-[10px] font-black uppercase tracking-widest focus:ring-rose-500"
          />
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="rounded-none border-none shadow-sm overflow-hidden border-t-4 border-t-slate-900 bg-white">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-4">
            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-slate-900">Perbandingan Harga Regional</CardTitle>
            <CardDescription className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Rata-rata Harga Komoditas Strategis (Ribuan IDR)</CardDescription>
          </CardHeader>
          <CardContent className="h-[320px] p-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regionalComparison}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="region" tickLine={false} axisLine={false} tick={{ fontSize: 9, fontWeight: 900, fill: '#94a3b8' }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 9, fontWeight: 900, fill: '#94a3b8' }} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '0px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '10px', fontWeight: 'bold' }} />
                <Bar dataKey="avgPrice" fill="#0f172a" radius={0} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="rounded-none border-none shadow-sm overflow-hidden border-t-4 border-t-rose-600 bg-white">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-4">
            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-slate-900">Log Perubahan Harga Real-Time</CardTitle>
            <CardDescription className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Audit Fluktuasi Lintas Koperasi Desa</CardDescription>
          </CardHeader>
          <CardContent className="p-4 overflow-y-auto max-h-[320px] space-y-3">
            {filteredPrices.slice(0, 8).map((row) => {
              const change = ((row.currentPrice - row.previousPrice) / row.previousPrice) * 100
              const positive = change > 0
              const negative = change < 0

              return (
                <div key={row.id} className="rounded-none border border-slate-100 bg-white p-4 group hover:bg-slate-50 transition-all shadow-sm">
                  <div className="flex items-center justify-between gap-3">
                    <div className="space-y-1">
                      <p className="text-[11px] font-black text-slate-900 uppercase group-hover:text-rose-600 transition-colors">{row.commodityName}</p>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{row.regionName} • {row.cooperativeName}</p>
                    </div>
                    <div
                      className={`flex items-center gap-1 text-[10px] font-black uppercase ${
                        positive ? 'text-rose-600' : negative ? 'text-emerald-600' : 'text-slate-500'
                      }`}
                    >
                      {positive ? <ArrowUpRight className="h-3.5 w-3.5" /> : negative ? <ArrowDownRight className="h-3.5 w-3.5" /> : <Minus className="h-3.5 w-3.5" />}
                      {change.toFixed(1)}%
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-2 border-t border-slate-50 pt-3">
                    <div className="space-y-0.5">
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">Sekarang</p>
                      <p className="text-[9px] font-black text-slate-900 uppercase">{formatCurrency(row.currentPrice)}</p>
                    </div>
                    <div className="space-y-0.5 text-center">
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">Rata Minggu</p>
                      <p className="text-[9px] font-black text-slate-500 uppercase">{formatCurrency(row.weeklyAverage)}</p>
                    </div>
                    <div className="space-y-0.5 text-right">
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">Rata Bulan</p>
                      <p className="text-[9px] font-black text-slate-500 uppercase">{formatCurrency(row.monthlyAverage)}</p>
                    </div>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-none border-none shadow-sm overflow-hidden bg-white">
        <CardHeader className="bg-slate-900 p-4">
          <CardTitle className="text-[10px] font-black uppercase tracking-widest text-white">Matriks Harga Pasar Terpadu Nasional</CardTitle>
          <CardDescription className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Data Agregasi Harga Berdasarkan Multi-entitas Koperasi</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            data={filteredPrices}
            columns={priceColumns}
            rowKey={(row) => row.id}
            empty="Tidak ada data harga yang cocok dengan filter."
          />
        </CardContent>
      </Card>

      <Card className="rounded-none border-none bg-slate-950 text-white shadow-2xl overflow-hidden relative">
        <div className="absolute right-0 top-0 p-4 opacity-5 pointer-events-none">
          <TrendingUp className="h-24 w-24" />
        </div>
        <CardContent className="relative flex flex-col md:flex-row items-center gap-6 p-6">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center bg-slate-900 border border-white/10 shadow-inner">
            <TrendingUp className="h-6 w-6 text-rose-400" />
          </div>
          <div className="flex-1 text-center md:text-left space-y-1">
            <p className="text-sm font-black uppercase tracking-tight">Sinkronisasi Indeks Harga Nasional</p>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Data harga diagregasi dari seluruh node koperasi desa dan diperbarui setiap 15 menit.
            </p>
          </div>
          <Badge variant="outline" className="rounded-none border-white/10 bg-white/5 text-white font-black text-[10px] uppercase tracking-widest px-4 h-8 flex items-center justify-center">
            {stabil} KOMODITAS STABIL
          </Badge>
        </CardContent>
      </Card>
    </div>
  )
}
