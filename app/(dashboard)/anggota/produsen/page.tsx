'use client'

import { useMemo, useState } from 'react'
import {
  Activity,
  Eye,
  LandPlot,
  Leaf,
  MapPin,
  Phone,
  Search,
  Users,
} from 'lucide-react'
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Sector,
  Tooltip,
} from 'recharts'
import { useAuth } from '@/lib/auth/use-auth'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
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

const PIE_COLORS = ['#0f172a', '#10b981', '#2563eb', '#f59e0b', '#dc2626', '#7c3aed']

function statusTone(status: string) {
  if (status === 'aktif') return 'bg-emerald-50 text-emerald-700 border-emerald-200'
  if (status === 'binaan') return 'bg-blue-50 text-blue-700 border-blue-200'
  return 'bg-amber-50 text-amber-700 border-amber-200'
}

function statusLabel(status: string) {
  if (status === 'aktif') return 'AKTIF'
  if (status === 'binaan') return 'BINAAN'
  if (status === 'audit') return 'AUDIT'
  return status.toUpperCase()
}

function renderActiveShape(props: any) {
  const {
    cx,
    cy,
    innerRadius,
    outerRadius,
    startAngle,
    endAngle,
    fill,
  } = props

  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 10}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
      />
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={outerRadius + 13}
        outerRadius={outerRadius + 17}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        opacity={0.18}
      />
    </g>
  )
}

export default function ProdusenPage() {
  const { user } = useAuth()
  const showHierarchyFilter =
    user?.role === 'kementerian' || user?.role === 'pemda' || user?.role === 'sysadmin'

  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [filters, setFilters] = useState<ScopeFilters>({
    provinceId: 'all',
    regionId: 'all',
    villageId: 'all',
    cooperativeId: 'all',
    commodityId: 'all',
  })
  const [activeSlice, setActiveSlice] = useState(0)
  const [selectedProducerId, setSelectedProducerId] = useState<string | null>(null)

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

  const commodityMix = useMemo(() => {
    const grouped = new Map<string, { commodity: string; count: number }>()

    for (const producer of producers) {
      const current = grouped.get(producer.commodityId) ?? {
        commodity: producer.commodityName,
        count: 0,
      }
      current.count += 1
      grouped.set(producer.commodityId, current)
    }

    return [...grouped.values()].sort((left, right) => right.count - left.count)
  }, [producers])

  const selectedProducer = selectedProducerId
    ? producers.find((producer) => producer.id === selectedProducerId) ?? null
    : null
  const totalCommodityCount = commodityMix.reduce((sum, item) => sum + item.count, 0)

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Badge className="w-fit rounded-none border border-emerald-200 bg-emerald-50 text-emerald-700 font-black uppercase tracking-widest text-[10px]">
          Pusat Data Produsen Nasional
        </Badge>
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Direktori Produsen</h1>
          <p className="text-sm font-bold text-slate-500 uppercase tracking-wide">
            Monitoring Sebaran Dan Kapasitas Produksi Lintas Wilayah: {getScopeCaption(scopedFilters)}
          </p>
        </div>
      </div>

      {showHierarchyFilter && (
        <div className="space-y-3">
          <KementerianFilterBar
            filters={filters}
            setFilters={setFilters}
            search={search}
            setSearch={setSearch}
          />
          <Card className="rounded-none border-slate-200 shadow-sm">
            <CardContent className="grid gap-3 p-4 sm:grid-cols-[220px_minmax(0,1fr)] sm:items-center">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="rounded-none border-slate-200 font-black uppercase text-[10px] tracking-widest h-10">
                  <SelectValue placeholder="SEMUA TIPE" />
                </SelectTrigger>
                <SelectContent className="rounded-none">
                  <SelectItem value="all">SEMUA TIPE</SelectItem>
                  <SelectItem value="petani">PETANI</SelectItem>
                  <SelectItem value="nelayan">NELAYAN</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">
                Filter tambahan ini menjaga direktori produsen tetap spesifik sesuai klasifikasi profesi anggota.
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {!showHierarchyFilter && (
        <Card className="rounded-none border-slate-200 shadow-sm">
          <CardContent className="grid gap-3 p-4 lg:grid-cols-[1.1fr_220px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Cari nama produsen, komoditas, atau koperasi..."
                className="rounded-none border-slate-200 pl-9 font-semibold h-11"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="rounded-none border-slate-200 font-black uppercase text-[10px] tracking-widest h-11">
                <SelectValue placeholder="SEMUA TIPE" />
              </SelectTrigger>
              <SelectContent className="rounded-none">
                <SelectItem value="all">SEMUA TIPE</SelectItem>
                <SelectItem value="petani">PETANI</SelectItem>
                <SelectItem value="nelayan">NELAYAN</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'PRODUSEN TERDATA', value: producers.length.toLocaleString('id-ID'), sub: 'UNIT PRODUSEN AKTIF', icon: Users, tone: 'slate' },
          { label: 'TOTAL LUAS LAHAN', value: `${totalLand.toLocaleString('id-ID', { maximumFractionDigits: 1 })} HA`, sub: 'AREA PRODUKTIF NASIONAL', icon: LandPlot, tone: 'emerald' },
          { label: 'ESTIMASI OUTPUT', value: `${(totalProductivity / 1000).toLocaleString('id-ID', { maximumFractionDigits: 1 })} TON`, sub: 'VOLUME PRODUKSI AGREGAT', icon: Leaf, tone: 'blue' },
          { label: 'RATA-RATA LAHAN', value: `${averageLand.toFixed(1)} HA`, sub: 'KEPEMILIKAN PER UNIT', icon: Activity, tone: 'slate' },
        ].map((stat, index) => (
          <Card key={index} className="rounded-none border-none bg-white shadow-sm overflow-hidden group border-t-4 border-t-slate-900">
            <CardHeader className="p-4 pb-2">
              <div className="flex items-start justify-between">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{stat.label}</p>
                <stat.icon className="h-4 w-4 text-slate-400 transition-colors group-hover:text-slate-900" />
              </div>
              <CardTitle className="mt-1 text-3xl font-black text-slate-900">{stat.value}</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="text-[10px] font-bold uppercase tracking-tighter text-slate-500">{stat.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-5">
        <Card className="rounded-none border-slate-200 shadow-sm overflow-hidden border-t-4 border-t-slate-900">
          <CardHeader className="border-b border-slate-100 bg-slate-50/50">
            <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-900">Sebaran Komoditas Utama</CardTitle>
            <CardDescription className="text-[10px] font-bold text-slate-500 uppercase">
              Distribusi Produsen Berdasarkan Komoditas Strategis
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 p-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
            <div className="h-[340px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    activeIndex={activeSlice}
                    activeShape={renderActiveShape}
                    data={commodityMix}
                    dataKey="count"
                    nameKey="commodity"
                    innerRadius={68}
                    outerRadius={104}
                    paddingAngle={0}
                    onMouseEnter={(_, index) => setActiveSlice(index)}
                  >
                    {commodityMix.map((entry, index) => (
                      <Cell key={entry.commodity} fill={PIE_COLORS[index % PIE_COLORS.length]} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '0px', border: '1px solid #e2e8f0', fontSize: '12px', fontWeight: 'bold' }}
                    formatter={(value: number) => [`${value} Produsen`, 'Jumlah']} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-3">
              {commodityMix.map((item, index) => {
                const percentage =
                  totalCommodityCount === 0 ? 0 : Math.round((item.count / totalCommodityCount) * 100)
                return (
                  <button
                    key={item.commodity}
                    type="button"
                    onMouseEnter={() => setActiveSlice(index)}
                    className="flex w-full items-center justify-between rounded-none border border-slate-100 bg-white px-4 py-3 text-left transition-all hover:border-slate-900 hover:shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className="h-3 w-3 rounded-none"
                        style={{ backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }}
                      />
                      <div>
                        <p className="text-xs font-black text-slate-900 uppercase">{item.commodity}</p>
                        <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                          {percentage}% DARI TOTAL PRODUSEN
                        </p>
                      </div>
                    </div>
                    <span className="text-sm font-black text-slate-900">{item.count}</span>
                  </button>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-none border-slate-200 shadow-sm overflow-hidden border-t-4 border-t-emerald-500">
          <CardHeader className="border-b border-slate-100 bg-slate-50/50">
            <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-900">Produsen Dalam Fokus</CardTitle>
            <CardDescription className="text-[10px] font-bold text-slate-500 uppercase">
              Monitoring Detil Kapasitas Dan Status Verifikasi Produsen
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 p-4 md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-3">
            {producers.slice(0, 6).map((producer) => (
              <Card key={producer.id} className="rounded-none border-slate-200 shadow-sm transition-colors hover:border-slate-900 group">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-black tracking-tight text-slate-900 uppercase">{producer.name}</p>
                      <p className="mt-0.5 text-[9px] font-black uppercase tracking-widest text-slate-400">
                        {producer.cooperativeName}
                      </p>
                    </div>
                    <Badge variant="outline" className={`rounded-none text-[9px] font-black uppercase tracking-widest ${statusTone(producer.status)}`}>
                      {statusLabel(producer.status)}
                    </Badge>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Badge variant="outline" className="rounded-none border-slate-200 bg-slate-50 text-[9px] font-black uppercase tracking-widest text-slate-700">
                      {producer.type.toUpperCase()}
                    </Badge>
                    <Badge variant="outline" className="rounded-none border-slate-200 bg-slate-50 text-[9px] font-black uppercase tracking-widest text-slate-700">
                      {producer.commodityName.toUpperCase()}
                    </Badge>
                  </div>
                  <div className="mt-4 grid gap-2 border-t border-slate-100 pt-4 text-sm">
                    <div className="flex items-center gap-2 text-slate-600">
                      <Leaf className="h-3 w-3 text-slate-400" />
                      <span className="text-[10px] font-black uppercase tracking-widest">
                        {producer.productivityKg.toLocaleString('id-ID')} KG OUTPUT
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <LandPlot className="h-3 w-3 text-slate-400" />
                      <span className="text-[10px] font-black uppercase tracking-widest">
                        {producer.landArea.toFixed(1)} HA LAHAN
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <MapPin className="h-3 w-3 text-slate-400" />
                      <span className="text-[10px] font-black uppercase tracking-widest">
                        {producer.villageName}, {producer.regionName}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4 h-9 w-full rounded-none border-slate-200 text-[10px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all"
                    onClick={() => setSelectedProducerId(producer.id)}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    Lihat Profil Lengkap
                  </Button>
                </CardContent>
              </Card>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-none border-none bg-slate-900 text-white shadow-xl">
        <CardContent className="flex flex-col gap-4 p-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-3">
            <div className="rounded-none bg-slate-800 p-3">
              <Users className="h-5 w-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-sm font-black uppercase tracking-widest">Sinkronisasi Database Nasional</p>
              <p className="mt-1 text-xs font-bold uppercase text-slate-400">
                Data divalidasi secara real-time melalui sistem otentikasi KYC anggota kementerian.
              </p>
            </div>
          </div>
          <Badge variant="outline" className="rounded-none border-slate-700 bg-slate-800 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-emerald-400">
            {commodityMix.length} Komoditas Terpantau
          </Badge>
        </CardContent>
      </Card>

      <Dialog open={Boolean(selectedProducerId && selectedProducer)} onOpenChange={(open) => !open && setSelectedProducerId(null)}>
        <DialogContent className="max-w-2xl rounded-none border-slate-200">
          {selectedProducer && (
            <>
              <DialogHeader>
                <DialogTitle className="text-lg font-black uppercase tracking-tight text-slate-900">{selectedProducer.name}</DialogTitle>
                <DialogDescription className="text-[10px] font-bold uppercase text-slate-500">
                  Detail Kapasitas Produsen Pada Scope {getScopeCaption(scopedFilters)}.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-none border border-slate-100 bg-slate-50 p-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Komoditas Utama</p>
                  <p className="mt-1 text-base font-black text-slate-900 uppercase">{selectedProducer.commodityName}</p>
                </div>
                <div className="rounded-none border border-slate-100 bg-slate-50 p-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Tipe Produsen</p>
                  <p className="mt-1 text-base font-black text-slate-900 uppercase">{selectedProducer.type}</p>
                </div>
                <div className="rounded-none border border-slate-100 bg-slate-50 p-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Produktivitas</p>
                  <p className="mt-1 text-base font-black text-slate-900">
                    {selectedProducer.productivityKg.toLocaleString('id-ID')} KG
                  </p>
                </div>
                <div className="rounded-none border border-slate-100 bg-slate-50 p-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Luas Lahan</p>
                  <p className="mt-1 text-base font-black text-slate-900">{selectedProducer.landArea.toFixed(1)} HA</p>
                </div>
                <div className="rounded-none border border-slate-100 bg-slate-50 p-4 md:col-span-2">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Wilayah Sumber</p>
                  <p className="mt-1 text-base font-black text-slate-900 uppercase">
                    {selectedProducer.villageName}, {selectedProducer.regionName}, {selectedProducer.provinceName}
                  </p>
                </div>
                <div className="rounded-none border border-slate-100 bg-slate-50 p-4 md:col-span-2">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Kontak Verifikasi</p>
                  <div className="mt-1 flex items-center gap-2 text-base font-black text-slate-900">
                    <Phone className="h-4 w-4 text-slate-400" />
                    {selectedProducer.phone}
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
