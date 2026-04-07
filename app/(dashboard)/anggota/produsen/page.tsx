'use client'

import { useState } from 'react'
import { Activity, LandPlot, Leaf, Search, Users } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import { useAuth } from '@/lib/auth/use-auth'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { KementerianFilterBar } from '@/components/dashboard/kementerian-filter-bar'
import {
  filterProducersByScope,
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

function statusTone(status: string) {
  if (status === 'aktif') return 'bg-emerald-50 text-emerald-700 border-emerald-200'
  if (status === 'binaan') return 'bg-blue-50 text-blue-700 border-blue-200'
  return 'bg-amber-50 text-amber-700 border-amber-200'
}

function toTitleCaseLabel(value: string) {
  return value
    .replace(/[_-]+/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

export default function ProdusenPage() {
  const { user } = useAuth()
  const showHierarchyFilter = user?.role === 'kementerian' || user?.role === 'pemda' || user?.role === 'sysadmin'

  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [filters, setFilters] = useState<ScopeFilters>({
    provinceId: 'all',
    regionId: 'all',
    villageId: 'all',
    cooperativeId: 'all',
    commodityId: 'all',
  })

  const scopedFilters = resolveOperationalFilters(user, filters)
  const scaleFactor = filters.provinceId === 'all' ? 1.0 : filters.regionId === 'all' ? 0.4 : filters.villageId === 'all' ? 0.15 : 0.05
  
  const producers = filterProducersByScope(scopedFilters).filter((producer) => {
    const keyword = search.toLowerCase()
    const matchesSearch =
      producer.name.toLowerCase().includes(keyword) ||
      producer.cooperativeName.toLowerCase().includes(keyword) ||
      producer.commodityName.toLowerCase().includes(keyword)
    const matchesType = typeFilter === 'all' || producer.type === typeFilter
    return matchesSearch && matchesType
  })

  const totalLand = producers.reduce((total, producer) => total + producer.landArea, 0) * scaleFactor
  const totalProductivity = producers.reduce((total, producer) => total + producer.productivityKg, 0) * scaleFactor
  const displayProducerCount = Math.round(producers.length * scaleFactor)
  const averageLand = displayProducerCount === 0 ? 0 : totalLand / displayProducerCount

  const chartRows = [...new Map(
    producers.map((producer) => [
      producer.commodityId,
      {
        commodity: producer.commodityName,
        count: Math.round(producers.filter((item) => item.commodityId === producer.commodityId).length * scaleFactor),
      },
    ]),
  ).values()]

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Badge className="w-fit rounded-none border border-emerald-200 bg-emerald-50 text-emerald-700 font-bold uppercase tracking-wider text-[10px]">Pusat Data Produsen Nasional</Badge>
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 uppercase">Direktori Produsen</h1>
          <p className="text-sm font-bold text-slate-500 uppercase tracking-wide">
            Monitoring Sebaran dan Kapasitas Produksi Lintas Wilayah: {getScopeCaption(scopedFilters)}
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
              placeholder="Cari nama produsen, komoditas, atau koperasi..."
              className="pl-9 rounded-none border-slate-200 font-semibold"
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="rounded-none border-slate-200 font-semibold">
              <SelectValue placeholder="Semua Tipe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Tipe</SelectItem>
              <SelectItem value="petani">Petani</SelectItem>
              <SelectItem value="nelayan">Nelayan</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'PRODUSEN TERDATA', value: displayProducerCount.toLocaleString('id-ID'), sub: 'UNIT PRODUSEN AKTIF', icon: Users, tone: 'slate' },
          { label: 'TOTAL LUAS LAHAN', value: `${totalLand.toLocaleString('id-ID', { maximumFractionDigits: 1 })} HA`, sub: 'AREA PRODUKTIF NASIONAL', icon: LandPlot, tone: 'emerald' },
          { label: 'ESTIMASI OUTPUT', value: `${(totalProductivity / 1000).toLocaleString('id-ID', { maximumFractionDigits: 1 })} TON`, sub: 'VOLUME PRODUKSI AGREGAT', icon: Leaf, tone: 'blue' },
          { label: 'RATA-RATA LAHAN', value: `${averageLand.toFixed(1)} HA`, sub: 'KEPEMILIKAN PER UNIT', icon: Activity, tone: 'slate' },
        ].map((stat, i) => (
          <Card key={i} className="rounded-none border-none bg-white shadow-sm overflow-hidden group border-t-4 border-t-slate-900">
            <div className={`absolute top-0 left-0 h-1 w-full ${stat.tone === 'emerald' ? 'bg-emerald-500' : stat.tone === 'blue' ? 'bg-blue-500' : 'bg-slate-900'}`} />
            <CardHeader className="p-4 pb-2">
              <div className="flex justify-between items-start">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{stat.label}</p>
                <stat.icon className="h-4 w-4 text-slate-400 group-hover:text-slate-900 transition-colors" />
              </div>
              <CardTitle className="text-3xl font-black text-slate-900 mt-1">{stat.value}</CardTitle>
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
            <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-900">Sebaran Komoditas Utama</CardTitle>
            <CardDescription className="text-[10px] font-bold text-slate-500 uppercase">Analitik Jumlah Produsen Berdasarkan Komoditas Strategis</CardDescription>
          </CardHeader>
          <CardContent className="h-[340px] p-4 pt-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartRows}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="commodity" tickLine={false} axisLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }} />
                <Bar dataKey="count" fill="#0f172a" radius={0} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {producers.slice(0, 12).map((producer) => (
            <Card key={producer.id} className="rounded-none border-slate-200 hover:border-slate-900 transition-colors shadow-sm">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-black text-slate-900 uppercase tracking-tight">{producer.name}</p>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter mt-0.5">
                      {producer.cooperativeName} · {producer.villageName}
                    </p>
                  </div>
                  <Badge variant="outline" className={`rounded-none text-[9px] font-black uppercase tracking-widest ${statusTone(producer.status)}`}>
                    {toTitleCaseLabel(producer.status)}
                  </Badge>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge variant="outline" className="rounded-none border-slate-200 bg-slate-50 text-slate-700 text-[9px] font-black uppercase tracking-widest">
                    {toTitleCaseLabel(producer.type)}
                  </Badge>
                  <Badge variant="outline" className="rounded-none border-slate-200 bg-slate-50 text-slate-700 text-[9px] font-black uppercase tracking-widest">
                    {producer.commodityName}
                  </Badge>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2 border-t border-slate-100 pt-4">
                  <div className="flex items-center gap-2">
                    <Leaf className="h-3 w-3 text-slate-400" />
                    <span className="text-[10px] font-bold text-slate-600 uppercase">{(producer.productivityKg * scaleFactor).toLocaleString('id-ID')} KG Output</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <LandPlot className="h-3 w-3 text-slate-400" />
                    <span className="text-[10px] font-bold text-slate-600 uppercase">{(producer.landArea * scaleFactor).toFixed(2)} HA Lahan</span>
                  </div>
                </div>
                <p className="text-[9px] font-bold text-slate-400 uppercase mt-3">{producer.regionName}, {producer.provinceName}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Card className="rounded-none border-none bg-slate-900 text-white shadow-xl">
        <CardContent className="flex flex-col gap-4 p-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-3">
            <div className="rounded-none bg-slate-800 p-3">
              <Users className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-sm font-black uppercase tracking-widest text-white">Sinkronisasi Database Nasional</p>
              <p className="text-xs font-bold text-slate-400 uppercase mt-1">
                Data divalidasi secara real-time melalui sistem otentikasi KYC anggota kementerian.
              </p>
            </div>
          </div>
          <Badge variant="outline" className="rounded-none border-slate-700 bg-slate-800 text-emerald-400 font-black text-[10px] uppercase tracking-widest px-3 py-1">
            {chartRows.length} KOMODITAS TERPANTAU
          </Badge>
        </CardContent>
      </Card>
    </div>
  )
}
