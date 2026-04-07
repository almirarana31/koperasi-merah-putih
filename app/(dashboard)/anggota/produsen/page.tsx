'use client'

import { useState } from 'react'
import { LandPlot, Leaf, Search, Users } from 'lucide-react'
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
  const producers = filterProducersByScope(scopedFilters).filter((producer) => {
    const keyword = search.toLowerCase()
    const matchesSearch =
      producer.name.toLowerCase().includes(keyword) ||
      producer.cooperativeName.toLowerCase().includes(keyword) ||
      producer.commodityName.toLowerCase().includes(keyword)
    const matchesType = typeFilter === 'all' || producer.type === typeFilter
    return matchesSearch && matchesType
  })

  const totalLand = producers.reduce((total, producer) => total + producer.landArea, 0)
  const totalProductivity = producers.reduce((total, producer) => total + producer.productivityKg, 0)
  const averageLand = producers.length === 0 ? 0 : totalLand / producers.length

  const chartRows = [...new Map(
    producers.map((producer) => [
      producer.commodityId,
      {
        commodity: producer.commodityName,
        count: producers.filter((item) => item.commodityId === producer.commodityId).length,
      },
    ]),
  ).values()]

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Badge className="w-fit border border-emerald-200 bg-emerald-50 text-emerald-700">Produsen Lintas Desa</Badge>
        <div>
          <h1 className="text-slate-900">Produsen</h1>
          <p className="text-muted-foreground">
            Direktori produsen terang dan konsisten untuk {getScopeCaption(scopedFilters)} dengan filter wilayah yang benar-benar memengaruhi isi daftar.
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
              placeholder="Cari nama produsen, komoditas, atau koperasi"
              className="pl-9"
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger>
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
        <Card className="border-slate-200 bg-white">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Produsen Aktif</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{producers.length}</p>
            <p className="mt-2 text-sm text-muted-foreground">Direktori tersaring pada scope saat ini</p>
          </CardContent>
        </Card>
        <Card className="border-slate-200 bg-white">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Luas Lahan</p>
            <p className="mt-2 text-3xl font-semibold text-emerald-600">{totalLand.toFixed(1)} ha</p>
            <p className="mt-2 text-sm text-muted-foreground">Total lahan produsen tersaring</p>
          </CardContent>
        </Card>
        <Card className="border-slate-200 bg-white">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Produktivitas</p>
            <p className="mt-2 text-3xl font-semibold text-blue-600">{(totalProductivity / 1000).toFixed(1)} ton</p>
            <p className="mt-2 text-sm text-muted-foreground">Volume dari produsen di scope aktif</p>
          </CardContent>
        </Card>
        <Card className="border-slate-200 bg-white">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Rata-rata Lahan</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{averageLand.toFixed(1)} ha</p>
            <p className="mt-2 text-sm text-muted-foreground">Per produsen dalam direktori terpilih</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <Card className="border-slate-200 bg-white">
          <CardHeader>
            <CardTitle>Komoditas Utama</CardTitle>
            <CardDescription>Jumlah produsen per komoditas mengikuti filter wilayah dan koperasi yang sama.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartRows}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="commodity" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Bar dataKey="count" fill="#16a34a" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {producers.map((producer) => (
            <Card key={producer.id} className="border-slate-200 bg-white">
              <CardContent className="p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-slate-900">{producer.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {producer.cooperativeName} · {producer.villageName}
                    </p>
                  </div>
                  <Badge variant="outline" className={statusTone(producer.status)}>
                    {toTitleCaseLabel(producer.status)}
                  </Badge>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge variant="outline" className="border-slate-200 bg-slate-50 text-slate-700">
                    {toTitleCaseLabel(producer.type)}
                  </Badge>
                  <Badge variant="outline" className="border-slate-200 bg-slate-50 text-slate-700">
                    {producer.commodityName}
                  </Badge>
                </div>
                <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Leaf className="h-4 w-4" />
                    <span>{producer.productivityKg.toLocaleString('id-ID')} kg produktivitas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <LandPlot className="h-4 w-4" />
                    <span>{producer.landArea.toFixed(1)} ha lahan aktif</span>
                  </div>
                  <div>{producer.regionName}, {producer.provinceName}</div>
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
              <Users className="h-5 w-5 text-emerald-600" />
            </div>
            <div>
              <p className="font-medium text-slate-900">Direktori Produsen Tersinkron</p>
              <p className="text-sm text-muted-foreground">
                Halaman ini tidak lagi mengandalkan pencarian alamat manual. Seluruh daftar dibaca dari record produsen yang sudah memiliki scope desa dan koperasi.
              </p>
            </div>
          </div>
          <Badge variant="outline" className="w-fit border-slate-200 bg-white text-slate-700">
            {chartRows.length} komoditas aktif
          </Badge>
        </CardContent>
      </Card>
    </div>
  )
}
