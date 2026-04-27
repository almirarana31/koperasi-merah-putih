'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  BarChart3,
  Calendar,
  CheckCircle,
  ClipboardList,
  Eye,
  Filter,
  Leaf,
  MapPin,
  MoreHorizontal,
  Package,
  Plus,
  Search,
  TrendingUp,
  User,
  Activity,
  ShieldAlert,
  Download,
} from 'lucide-react'
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
import { DataTable, type DataTableColumn } from '@/components/ui/data-table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { HarvestDetailDialog } from '@/components/dialogs/harvest-detail-dialog'
import { toast } from 'sonner'
import {
  type ScopeFilters,
} from '@/lib/kementerian-dashboard-data'
import { KementerianFilterBar } from '@/components/dashboard/kementerian-filter-bar'
import { useAuth } from '@/lib/auth/use-auth'
import { productions, formatDate, getStatusColor } from '@/lib/data'
import { members } from '@/lib/mock-data'

const gradeColors: Record<string, string> = {
  A: 'bg-emerald-100 text-emerald-700',
  B: 'bg-blue-100 text-blue-700',
  C: 'bg-rose-100 text-rose-700',
}

export default function ProduksiPage() {
  const { user } = useAuth()
  const isKementerian = user?.role === 'kementerian'
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [filters, setFilters] = useState<ScopeFilters>({
    provinceId: 'all',
    regionId: 'all',
    villageId: 'all',
    cooperativeId: 'all',
    commodityId: 'all',
  })
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)
  const [selectedHarvest, setSelectedHarvest] = useState<(typeof productions)[number] | null>(null)

  const filteredProductions = useMemo(() => {
    return productions.filter((prod) => {
      const matchesSearch =
        prod.memberNama.toLowerCase().includes(search.toLowerCase()) ||
        prod.komoditasNama.toLowerCase().includes(search.toLowerCase())
      const matchesStatus = filterStatus === 'all' || prod.status === filterStatus

      if (isKementerian) {
        const member = members.find(m => m.id === prod.memberId)
        if (member) {
          const matchesProvince = filters.provinceId === 'all' || member.province.toUpperCase() === filters.provinceId
          const matchesRegion = filters.regionId === 'all' || member.district.toUpperCase().includes(filters.regionId.split('-')[0])
          const matchesVillage = filters.villageId === 'all' || member.village.toUpperCase().includes(filters.villageId.split('-').pop() || '')
          
          return matchesSearch && matchesStatus && matchesProvince && matchesRegion && matchesVillage
        }
      }

      return matchesSearch && matchesStatus
    })
  }, [search, filterStatus, filters, isKementerian])

  const totalHarvestVolume = useMemo(() => filteredProductions.reduce((sum, prod) => sum + prod.jumlah, 0), [filteredProductions])

  type Production = (typeof productions)[number]
  const productionColumns: DataTableColumn<Production>[] = [
    {
      key: 'id',
      header: 'ID Log',
      cell: (prod) => <span className="font-mono text-xs text-muted-foreground">{prod.id}</span>,
    },
    {
      key: 'producer',
      header: 'Produsen',
      cell: (prod) => <span className="text-sm font-semibold text-foreground">{prod.memberNama}</span>,
    },
    {
      key: 'commodity',
      header: 'Komoditas',
      cell: (prod) => <span className="text-sm">{prod.komoditasNama}</span>,
    },
    {
      key: 'volume',
      header: 'Volume',
      cell: (prod) => (
        <span className="tabular-nums">
          {Math.round(prod.jumlah * scaleFactor).toLocaleString('id-ID')} {prod.satuan}
        </span>
      ),
    },
    {
      key: 'grade',
      header: 'Kualitas',
      cell: (prod) => <Badge className={gradeColors[prod.grade]}>Grade {prod.grade}</Badge>,
    },
    {
      key: 'date',
      header: 'Tgl Panen',
      cell: (prod) => <span className="text-xs text-muted-foreground">{formatDate(prod.tanggalPanen)}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      align: 'center',
      cell: (prod) => <Badge variant="outline">{prod.status}</Badge>,
    },
    {
      key: 'actions',
      header: '',
      align: 'right',
      cell: (prod) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={(e) => e.stopPropagation()}
              aria-label={`Aksi untuk ${prod.id}`}
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
            <DropdownMenuItem
              onClick={() => {
                setSelectedHarvest(prod)
                setDetailDialogOpen(true)
              }}
            >
              <Eye className="mr-2 h-3.5 w-3.5" /> Lihat detail
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleAction(`Verifikasi ${prod.id}`)}
              className="text-[color:var(--success)]"
            >
              <CheckCircle className="mr-2 h-3.5 w-3.5" /> Verifikasi
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ]

  const scaleFactor = useMemo(() => {
    if (filters.cooperativeId !== 'all') return 0.05
    if (filters.villageId !== 'all') return 0.1
    if (filters.regionId !== 'all') return 0.25
    if (filters.provinceId !== 'all') return 0.5
    return 1.0
  }, [filters])

  const harvestTrendData = useMemo(() => {
    const data = Object.values(
      filteredProductions.reduce<Record<string, { label: string; total: number; entries: number }>>((acc, production) => {
        const date = new Date(production.tanggalPanen)
        const label = new Intl.DateTimeFormat('id-ID', {
          month: 'short',
        }).format(date)

        const current = acc[label] ?? { label, total: 0, entries: 0 }
        current.total += production.jumlah * scaleFactor
        current.entries += 1
        acc[label] = current
        return acc
      }, {}),
    )
    return data
  }, [filteredProductions, scaleFactor])

  const harvestLeaderboard = useMemo(() => {
    return Object.values(
      filteredProductions.reduce<Record<string, { name: string; total: number; commodity: string }>>((acc, production) => {
        const current = acc[production.memberNama] ?? {
          name: production.memberNama,
          total: 0,
          commodity: production.komoditasNama,
        }
        current.total += production.jumlah * scaleFactor
        acc[production.memberNama] = current
        return acc
      }, {}),
    ).sort((left, right) => right.total - left.total)
  }, [filteredProductions, scaleFactor])

  const handleAction = (action: string) => {
    toast.success(`Aksi ${action} berhasil diverifikasi secara nasional`)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-none bg-slate-900 flex items-center justify-center shadow-xl">
            <Leaf className="h-7 w-7 text-emerald-500" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Pusat Komando Produksi</h1>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">
              Monitoring Agregat Output Komoditas Strategis • {filteredProductions.length} Catatan Aktif
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleAction('Audit Produksi')}
            className="h-10 rounded-none text-[10px] font-black uppercase tracking-widest text-slate-600 border-slate-200 shadow-none"
          >
            <ShieldAlert className="h-4 w-4 mr-2 text-rose-600" />
            Audit Produksi
          </Button>
          <Button 
            size="sm" 
            onClick={() => handleAction('PDF')}
            className="h-10 rounded-none bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-black uppercase tracking-widest px-6 shadow-none"
          >
            <Download className="h-4 w-4 mr-2" />
            Eksport PDF
          </Button>
        </div>
      </div>

      <KementerianFilterBar filters={filters} setFilters={setFilters} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Wilayah Dipantau', value: Math.floor(12 * scaleFactor).toLocaleString(), sub: 'ENTITAS AKTIF', icon: MapPin, color: 'text-slate-900' },
          { label: 'Produksi Tercatat', value: (totalHarvestVolume * scaleFactor / 1000).toFixed(1), sub: 'METRIC TON (MT)', icon: Package, color: 'text-emerald-600' },
          { label: 'Komoditas Utama', value: 'Padi Premium', sub: 'OUTPUT DOMINAN', icon: Leaf, color: 'text-blue-600' },
          { label: 'Tren Produksi', value: '82.4', sub: 'INDEKS PERFORMA', icon: TrendingUp, color: 'text-blue-400' },
        ].map((s, i) => (
          <Card key={i} className="rounded-none border-none shadow-sm bg-white overflow-hidden">
            <div className={`h-1.5 w-full ${s.color.includes('emerald') ? 'bg-emerald-500' : s.color.includes('blue') ? 'bg-blue-500' : 'bg-slate-900'}`} />
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-10 w-10 rounded-none bg-slate-50 flex items-center justify-center border border-slate-100">
                <s.icon className={`h-5 w-5 ${s.color}`} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.label}</p>
                <div className="flex items-baseline gap-1 mt-1">
                  <span className={`text-xl font-black ${s.color}`}>{s.value}</span>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">{s.sub}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="rounded-none border-none shadow-sm bg-white overflow-hidden">
          <CardHeader className="p-5 border-b border-slate-50">
            <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-900">Grafik Hasil Panen Nasional</CardTitle>
          </CardHeader>
          <CardContent className="p-4 h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={harvestTrendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="label" fontSize={9} fontWeight={900} axisLine={false} tickLine={false} />
                <YAxis fontSize={9} fontWeight={900} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: '0px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', fontSize: '10px', fontWeight: 900 }}
                  formatter={(val: number) => [`${val.toLocaleString()} KG`, 'VOLUME']}
                />
                <Bar dataKey="total" fill="#0f172a" radius={[0, 0, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="rounded-none border-none shadow-sm bg-white overflow-hidden">
          <CardHeader className="p-5 border-b border-slate-50">
            <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-900">Kontributor Produksi Terbesar</CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            {harvestLeaderboard.slice(0, 4).map((row, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 bg-slate-50 rounded-none border border-slate-100">
                <div>
                  <p className="text-xs font-black text-slate-900 uppercase">{row.name}</p>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">{row.commodity}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-emerald-600">{row.total.toLocaleString()} KG</p>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-0.5">PERINGKAT {idx + 1}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-none border-none shadow-sm bg-slate-50/50">
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                placeholder="Cari anggota, komoditas, atau wilayah..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-none pl-9 bg-white border-slate-200 h-11 text-[10px] font-black uppercase tracking-widest focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>
            <div className="flex gap-2">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-[180px] rounded-none h-11 bg-white border-slate-200 text-[10px] font-black uppercase tracking-widest">
                  <SelectValue placeholder="STATUS" />
                </SelectTrigger>
                <SelectContent className="rounded-none border-slate-200">
                  <SelectItem value="all">SEMUA STATUS</SelectItem>
                  <SelectItem value="dicatat">DICATAT</SelectItem>
                  <SelectItem value="diverifikasi">DIVERIFIKASI</SelectItem>
                  <SelectItem value="disimpan">DISIMPAN</SelectItem>
                  <SelectItem value="terjual">TERJUAL</SelectItem>
                </SelectContent>
              </Select>
              <Button 
                onClick={() => handleAction('Tambah Catatan')}
                className="rounded-none h-11 bg-slate-900 text-white font-black text-[10px] uppercase tracking-widest px-6 shadow-none"
              >
                <Plus className="h-4 w-4 mr-2" /> Tambah Catatan
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <DataTable
            data={filteredProductions}
            columns={productionColumns}
            rowKey={(prod) => prod.id}
            empty="Tidak ada catatan produksi yang cocok dengan filter."
          />
        </CardContent>
      </Card>

      <HarvestDetailDialog
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
        harvest={selectedHarvest}
      />
    </div>
  )
}
