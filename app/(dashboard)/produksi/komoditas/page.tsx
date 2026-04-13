'use client'

import { useMemo, useState } from 'react'
import {
  Activity,
  ArrowRight,
  Download,
  FileText,
  Globe,
  Package,
  PieChart as PieChartIcon,
  Search,
  ShieldAlert,
  Sprout,
  TrendingUp,
} from 'lucide-react'
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Sector,
  Tooltip,
} from 'recharts'
import { toast } from 'sonner'
import { useAuth } from '@/lib/auth/use-auth'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { KementerianFilterBar } from '@/components/dashboard/kementerian-filter-bar'
import type { ScopeFilters } from '@/lib/kementerian-dashboard-data'
import { commodities, formatCurrency } from '@/lib/data'
import {
  filterListingsByScope,
  resolveOperationalFilters,
} from '@/lib/cross-entity-operations'

const categoryLabels: Record<string, string> = {
  pangan: 'Pangan',
  hortikultura: 'Hortikultura',
  perkebunan: 'Perkebunan',
  peternakan: 'Peternakan',
  perikanan: 'Perikanan',
}

const categoryColors: Record<string, string> = {
  pangan: 'bg-emerald-100 text-emerald-700',
  hortikultura: 'bg-amber-100 text-amber-700',
  perkebunan: 'bg-slate-100 text-slate-700',
  peternakan: 'bg-rose-100 text-rose-700',
  perikanan: 'bg-blue-100 text-blue-700',
}

const chartColors = ['#0f172a', '#10b981', '#2563eb', '#f59e0b', '#dc2626']
const mapPositions = [
  { top: '22%', left: '10%' },
  { top: '42%', left: '25%' },
  { top: '36%', left: '46%' },
  { top: '26%', left: '62%' },
  { top: '52%', left: '72%' },
  { top: '64%', left: '50%' },
]

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

export default function KomoditasPage() {
  const { user } = useAuth()
  const [search, setSearch] = useState('')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [filters, setFilters] = useState<ScopeFilters>({
    provinceId: 'all',
    regionId: 'all',
    villageId: 'all',
    cooperativeId: 'all',
    commodityId: 'all',
  })
  const [activeMixIndex, setActiveMixIndex] = useState(0)

  const scaleFactor = useMemo(() => {
    if (filters.cooperativeId !== 'all') return 0.05
    if (filters.villageId !== 'all') return 0.1
    if (filters.regionId !== 'all') return 0.25
    if (filters.provinceId !== 'all') return 0.5
    return 1
  }, [filters])

  const filteredCommodities = useMemo(() => {
    return commodities.filter((commodity) => {
      const matchesSearch = commodity.nama.toLowerCase().includes(search.toLowerCase())
      const matchesCategory = filterCategory === 'all' || commodity.kategori === filterCategory
      const matchesFilterId = filters.commodityId === 'all' || commodity.id === filters.commodityId
      return matchesSearch && matchesCategory && matchesFilterId
    })
  }, [search, filterCategory, filters])

  const scopedOperationalFilters = useMemo(
    () => resolveOperationalFilters(user, filters),
    [user, filters],
  )
  const listingRows = useMemo(
    () => filterListingsByScope(scopedOperationalFilters),
    [scopedOperationalFilters],
  )

  const stats = useMemo(() => {
    const count = filteredCommodities.length
    const totalStock = filteredCommodities.reduce((sum, item) => sum + item.stokTotal * scaleFactor, 0)
    const totalValue = filteredCommodities.reduce(
      (sum, item) => sum + item.stokTotal * scaleFactor * item.hargaAcuan,
      0,
    )

    return {
      count,
      totalStock,
      totalValue,
      isNational: filters.provinceId === 'all',
    }
  }, [filteredCommodities, scaleFactor, filters.provinceId])

  const categoryMix = useMemo(() => {
    const grouped = new Map<string, { name: string; value: number; key: string }>()

    for (const commodity of filteredCommodities) {
      const current = grouped.get(commodity.kategori) ?? {
        key: commodity.kategori,
        name: categoryLabels[commodity.kategori] ?? commodity.kategori,
        value: 0,
      }
      current.value += commodity.stokTotal * scaleFactor
      grouped.set(commodity.kategori, current)
    }

    return [...grouped.values()].sort((left, right) => right.value - left.value)
  }, [filteredCommodities, scaleFactor])

  const spreadByRegion = useMemo(() => {
    const grouped = new Map<string, { region: string; stockKg: number; listings: number }>()

    for (const listing of listingRows) {
      const current = grouped.get(listing.regionName) ?? {
        region: listing.regionName,
        stockKg: 0,
        listings: 0,
      }
      current.stockKg += listing.stockKg
      current.listings += 1
      grouped.set(listing.regionName, current)
    }

    return [...grouped.values()]
      .sort((left, right) => right.stockKg - left.stockKg)
      .slice(0, 6)
  }, [listingRows])

  const handleAction = (action: string) => {
    toast.success(`Aksi ${action} sedang diproses secara nasional`)
  }

  if (!user) return null

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Master Komoditas & Cadangan</h1>
          <p className="text-[10px] font-black text-slate-500 mt-1 uppercase tracking-widest leading-relaxed">
            Monitoring Agregat Cadangan Pangan Nasional • Audit Inventori Lintas Wilayah
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleAction('Analisis Mix')}
            className="h-9 rounded-none border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50"
          >
            <PieChartIcon className="mr-2 h-4 w-4 text-blue-600" />
            Analisis Mix
          </Button>
          <Button
            size="sm"
            onClick={() => handleAction('Audit PDF')}
            className="h-9 rounded-none bg-slate-900 px-6 text-[10px] font-black uppercase tracking-widest text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] transition-all hover:bg-slate-800"
          >
            <Download className="mr-2 h-4 w-4" />
            Audit Stok PDF
          </Button>
        </div>
      </div>

      <KementerianFilterBar filters={filters} setFilters={setFilters} />

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {[
          { label: 'Varietas Aktif', value: stats.count, sub: 'SKU Terdaftar Nasional', icon: Package, tone: 'slate' },
          { label: 'Agregat Volume', value: (stats.totalStock / 1000).toLocaleString('id-ID'), sub: 'Metric Ton (MT)', icon: TrendingUp, tone: 'emerald' },
          { label: 'Valuasi Cadangan', value: `RP ${(stats.totalValue / 1000000000).toFixed(2)} M`, sub: 'Estimasi Nilai Pasar', icon: Globe, tone: 'blue' },
        ].map((s, i) => (
          <Card key={i} className="border-none shadow-sm bg-white overflow-hidden rounded-none">
             <div className={`h-1 w-full ${
              s.tone === 'emerald' ? 'bg-emerald-500' : 
              s.tone === 'blue' ? 'bg-blue-500' : 'bg-slate-900'
            }`} />
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-10 w-10 rounded-none bg-slate-50 flex items-center justify-center shrink-0 shadow-inner">
                <s.icon className={`h-5 w-5 ${
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

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <Card className="rounded-none border-none shadow-sm overflow-hidden border-t-4 border-t-slate-900 bg-white">
          <CardHeader className="border-b border-slate-100 bg-slate-50/50">
            <CardTitle className="text-sm font-black text-slate-900 uppercase tracking-tight">Peta Sebaran Komoditas</CardTitle>
            <CardDescription className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Konsentrasi Stok dan Listing Komoditas Utama Per Wilayah
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            <div className="relative min-h-[340px] rounded-none border border-slate-100 bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.08),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(37,99,235,0.08),transparent_24%),linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)]">
              <div className="absolute inset-x-6 top-6">
                <div className="rounded-none border border-slate-100 bg-white/90 px-4 py-3 shadow-sm backdrop-blur">
                  <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Cluster Wilayah Terkuat</p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                    Hover pada node untuk membaca data spesifik
                  </p>
                </div>
              </div>
              {spreadByRegion.map((region, index) => (
                <div
                  key={region.region}
                  className="absolute w-[140px] rounded-none border border-slate-200 bg-white/95 p-3 shadow-xl transition-transform hover:-translate-y-1"
                  style={mapPositions[index]}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="space-y-0.5">
                      <p className="text-[10px] font-black text-slate-900 uppercase truncate">{region.region}</p>
                      <p className="text-[8px] font-black uppercase tracking-widest text-slate-400">
                        {region.listings} LISTING
                      </p>
                    </div>
                    <div className="flex h-7 w-7 items-center justify-center bg-emerald-50 text-emerald-600 shadow-inner">
                      <Sprout className="h-3.5 w-3.5" />
                    </div>
                  </div>
                  <p className="mt-3 text-lg font-black text-slate-900 uppercase">
                    {(region.stockKg / 1000).toLocaleString('id-ID', { maximumFractionDigits: 1 })} T
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-none border-none shadow-sm overflow-hidden border-t-4 border-t-emerald-500 bg-white">
          <CardHeader className="border-b border-slate-100 bg-slate-50/50">
            <CardTitle className="text-sm font-black text-slate-900 uppercase tracking-tight">Grafik Mix Komoditas</CardTitle>
            <CardDescription className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Komposisi Kategori Komoditas Nasional Berbasis Stok
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 p-4 lg:grid-cols-[1fr_0.88fr]">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    activeIndex={activeMixIndex}
                    activeShape={renderActiveShape}
                    data={categoryMix}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={62}
                    outerRadius={96}
                    paddingAngle={2}
                    onMouseEnter={(_, index) => setActiveMixIndex(index)}
                  >
                    {categoryMix.map((entry, index) => (
                      <Cell key={entry.key} fill={chartColors[index % chartColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => [`${value.toLocaleString('id-ID')} kg`, 'Volume']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2">
              {categoryMix.map((item, index) => (
                <button
                  key={item.key}
                  type="button"
                  onMouseEnter={() => setActiveMixIndex(index)}
                  className="flex w-full items-center justify-between rounded-none border border-slate-100 bg-white px-4 py-3 text-left transition-all hover:border-slate-900 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: chartColors[index % chartColors.length] }}
                    />
                    <div className="space-y-0.5">
                      <p className="text-[10px] font-black text-slate-900 uppercase">{item.name}</p>
                      <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                        {item.value.toLocaleString('id-ID')} KG
                      </p>
                    </div>
                  </div>
                  <Badge className={`rounded-none border-none px-1.5 h-5 text-[8px] font-black uppercase tracking-widest ${categoryColors[item.key] ?? 'bg-slate-100 text-slate-700'}`}>
                    {item.name}
                  </Badge>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-none border-none shadow-sm bg-slate-900 p-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <Input
              placeholder="CARI KOMODITAS ATAU SKU ID STRATEGIS..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="h-10 rounded-none border-slate-800 bg-slate-950 text-white pl-9 text-[10px] font-black uppercase tracking-widest focus:ring-emerald-500"
            />
          </div>
          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="h-10 w-full rounded-none border-slate-800 bg-slate-950 text-white font-black text-[10px] uppercase tracking-widest sm:w-[220px]">
              <SelectValue placeholder="SEMUA KATEGORI" />
            </SelectTrigger>
            <SelectContent className="rounded-none bg-slate-900 border-slate-800 text-white font-black text-[10px] uppercase tracking-widest">
              <SelectItem value="all">SEMUA KATEGORI</SelectItem>
              <SelectItem value="pangan">PANGAN</SelectItem>
              <SelectItem value="hortikultura">HORTIKULTURA</SelectItem>
              <SelectItem value="perkebunan">PERKEBUNAN</SelectItem>
              <SelectItem value="peternakan">PETERNAKAN</SelectItem>
              <SelectItem value="perikanan">PERIKANAN</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      <Card className="rounded-none border-none shadow-sm overflow-hidden bg-white">
        <CardHeader className="border-b border-slate-50 p-6 bg-slate-50/30">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="text-sm font-black text-slate-900 uppercase tracking-tight">Database Inventaris Komoditas</CardTitle>
              <CardDescription className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Audit Stok Terkini Berdasarkan Filter Hierarki Kementerian
              </CardDescription>
            </div>
            <Badge variant="outline" className="h-6 rounded-none border-slate-200 bg-white text-[10px] font-black uppercase tracking-widest px-3">
              {filteredCommodities.length} ITEMS
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-slate-100">
                <TableRow className="border-none bg-slate-100 hover:bg-slate-100">
                  <TableHead className="h-10 px-6 text-[10px] font-black uppercase tracking-widest text-slate-500">ID SKU</TableHead>
                  <TableHead className="h-10 px-6 text-[10px] font-black uppercase tracking-widest text-slate-500">Nama Komoditas</TableHead>
                  <TableHead className="h-10 px-6 text-[10px] font-black uppercase tracking-widest text-slate-500">Kategori</TableHead>
                  <TableHead className="h-10 px-6 text-[10px] font-black uppercase tracking-widest text-slate-500">Satuan</TableHead>
                  <TableHead className="h-10 px-6 text-right text-[10px] font-black uppercase tracking-widest text-slate-500">Harga Acuan</TableHead>
                  <TableHead className="h-10 px-6 text-right text-[10px] font-black uppercase tracking-widest text-slate-500">Stok Agregat</TableHead>
                  <TableHead className="h-10 px-6 text-right text-[10px] font-black uppercase tracking-widest text-slate-500">Valuasi</TableHead>
                  <TableHead className="h-10 px-6" />
                </TableRow>
              </TableHeader>
              <TableBody className="[&_tr]:border-slate-100">
                {filteredCommodities.map((commodity) => {
                  const displayStock = Math.round(commodity.stokTotal * scaleFactor)
                  const displayValue = displayStock * commodity.hargaAcuan

                  return (
                    <TableRow key={commodity.id} className="group transition-colors hover:bg-slate-50">
                      <TableCell className="px-6 py-4 font-mono text-[10px] font-black uppercase text-slate-400">
                        {commodity.id}
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-none border border-emerald-100 bg-emerald-50 shadow-inner">
                            <Sprout className="h-4 w-4 text-emerald-600" />
                          </div>
                          <span className="text-xs font-black text-slate-900 uppercase tracking-tight">{commodity.nama}</span>
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4">
                        <Badge className={`h-5 rounded-none border-none px-2 text-[8px] font-black uppercase tracking-widest ${categoryColors[commodity.kategori]}`}>
                          {categoryLabels[commodity.kategori]}
                        </Badge>
                      </TableCell>
                      <TableCell className="px-6 py-4 text-[10px] font-black uppercase text-slate-400">{commodity.satuan}</TableCell>
                      <TableCell className="px-6 py-4 text-right text-xs font-black text-slate-900">
                        {formatCurrency(commodity.hargaAcuan)}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-right">
                        <div className="flex flex-col items-end">
                          <span className="text-xs font-black text-slate-900 uppercase">{displayStock.toLocaleString()}</span>
                          <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">{commodity.satuan}</span>
                        </div>
                      </TableCell>
                      <TableCell className="px-6 py-4 text-right text-xs font-black text-emerald-600">
                        {formatCurrency(displayValue)}
                      </TableCell>
                      <TableCell className="px-6 py-4 text-right">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleAction(`Detail ${commodity.nama}`)}
                          className="h-8 w-8 rounded-none text-slate-300 transition-colors group-hover:text-slate-900"
                        >
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
        {filteredCommodities.length > 0 && (
          <div className="flex flex-col gap-4 bg-slate-900 p-4 md:flex-row md:items-center md:justify-between border-t border-white/5">
            <div className="flex items-center gap-8 px-2">
              <div className="flex flex-col">
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Total Agregat Stok</span>
                <span className="text-xs font-black text-white uppercase mt-0.5">
                  {Math.round(filteredCommodities.reduce((sum, item) => sum + item.stokTotal * scaleFactor, 0)).toLocaleString()} Unit
                </span>
              </div>
              <div className="h-8 w-px bg-slate-800" />
              <div className="flex flex-col">
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">Total Valuasi Cadangan</span>
                <span className="text-xs font-black text-emerald-400 uppercase mt-0.5">
                  {formatCurrency(filteredCommodities.reduce((sum, item) => sum + item.stokTotal * scaleFactor * item.hargaAcuan, 0))}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleAction('Download Table')}
                className="h-9 rounded-none text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:bg-white/5"
              >
                <FileText className="mr-2 h-4 w-4" />
                Ekspor Tabel
              </Button>
              <Button
                size="sm"
                onClick={() => handleAction('Market Insights')}
                className="h-9 rounded-none bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest px-6 shadow-xl hover:bg-emerald-500"
              >
                <Activity className="mr-2 h-4 w-4" />
                Analisis Pasar
              </Button>
            </div>
          </div>
        )}
      </Card>

      {filteredCommodities.length === 0 && (
        <Card className="rounded-none border-2 border-dashed border-slate-200 bg-slate-50/50 py-20">
          <CardContent className="flex flex-col items-center justify-center text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center bg-slate-200 text-slate-400">
              <Package className="h-8 w-8" />
            </div>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Komoditas Tidak Ditemukan</h3>
            <p className="mt-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              Sesuaikan kata kunci atau filter hierarki kementerian Anda
            </p>
            <Button
              variant="link"
              onClick={() => {
                setSearch('')
                setFilterCategory('all')
                setFilters({
                  provinceId: 'all',
                  regionId: 'all',
                  villageId: 'all',
                  cooperativeId: 'all',
                  commodityId: 'all',
                })
              }}
              className="mt-4 text-[10px] font-black uppercase tracking-widest text-emerald-600"
            >
              Reset Semua Filter
            </Button>
          </CardContent>
        </Card>
      )}

      <Card className="bg-slate-950 text-white overflow-hidden rounded-none border-none shadow-2xl">
        <div className="absolute right-0 top-0 p-4 opacity-5 pointer-events-none">
          <ShieldAlert className="h-24 w-24" />
        </div>
        <CardContent className="relative flex flex-col md:flex-row items-center gap-6 p-6">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center bg-slate-900 border border-white/10 shadow-inner">
            <Activity className="h-7 w-7 text-rose-500" />
          </div>
          <div className="flex-1 text-center md:text-left space-y-1">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <Badge className="bg-rose-600 text-white h-5 rounded-none px-2 text-[8px] font-black uppercase tracking-widest border-none">
                Priority Alert
              </Badge>
              <span className="text-[9px] font-black uppercase tracking-widest text-slate-500">
                Deteksi Anomali Stok Nasional
              </span>
            </div>
            <p className="text-base font-black uppercase tracking-tight">
              Beberapa wilayah melaporkan stok kritis untuk Padi Premium pada scope Sumatera Utara.
            </p>
          </div>
          <Button className="bg-white text-slate-900 hover:bg-slate-100 h-10 rounded-none px-8 text-[10px] font-black uppercase tracking-widest shadow-xl shrink-0">
            Lihat Detail Audit
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
