'use client'

import Link from 'next/link'
import { useState } from 'react'
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
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
import { HarvestDetailDialog } from '@/components/dialogs/harvest-detail-dialog'
import { useToast } from '@/components/ui/use-toast'
import {
  KEMENTERIAN_DASHBOARD_DATA,
  type ScopeFilters,
} from '@/lib/kementerian-dashboard-data'
import { KementerianFilterBar } from '@/components/dashboard/kementerian-filter-bar'
import { ExportButton } from '@/components/dashboard/export-button'
import { useAuth } from '@/lib/auth/use-auth'
import { productions, formatDate, getStatusColor } from '@/lib/data'
import { members } from '@/lib/mock-data'

const gradeColors: Record<string, string> = {
  A: 'bg-primary/10 text-primary',
  B: 'bg-amber-500/10 text-amber-600',
  C: 'bg-destructive/10 text-destructive',
}

const personalHarvests = [
  {
    id: 'PH-001',
    commodity: 'Padi Premium',
    volume: '1.2 ton',
    schedule: '12 Apr 2026',
    status: 'Siap dicatat',
    note: 'Cuaca cerah, kadar air diperkirakan stabil.',
    grade: 'A',
  },
  {
    id: 'PH-002',
    commodity: 'Jagung Pipil',
    volume: '850 kg',
    schedule: '28 Mar 2026',
    status: 'Menunggu verifikasi',
    note: 'Petugas koperasi akan meninjau kualitas besok pagi.',
    grade: 'B',
  },
  {
    id: 'PH-003',
    commodity: 'Gabah Kering',
    volume: '900 kg',
    schedule: '16 Mar 2026',
    status: 'Sudah masuk gudang',
    note: 'Sudah diterima di gudang utama dan siap penawaran.',
    grade: 'A',
  },
] as const

const regionalSummaries = [
  {
    area: 'Kecamatan Sukamaju',
    commodity: 'Padi',
    volume: '124 ton',
    change: '+8.4%',
    insight: 'Peningkatan dipicu musim panen yang serempak di tiga desa.',
  },
  {
    area: 'Kecamatan Cibodas',
    commodity: 'Hortikultura',
    volume: '46 ton',
    change: '+3.1%',
    insight: 'Kentang dan wortel mendominasi pasokan minggu ini.',
  },
  {
    area: 'Kecamatan Pantai Indah',
    commodity: 'Perikanan',
    volume: '18 ton',
    change: '-2.2%',
    insight: 'Gelombang tinggi menekan hasil tangkap pada awal pekan.',
  },
] as const

export default function ProduksiPage() {
  const { user, canRoute } = useAuth()
  const { toast } = useToast()
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

  if (!user) return null

  const filteredProductions = productions.filter((prod) => {
    const matchesSearch =
      prod.memberNama.toLowerCase().includes(search.toLowerCase()) ||
      prod.komoditasNama.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = filterStatus === 'all' || prod.status === filterStatus

    if (isKementerian) {
      // Find the member associated with this production to get their location
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

  const totalHarvestVolume = filteredProductions.reduce((sum, prod) => sum + prod.jumlah, 0)
  const isAggregateViewer = user.role === 'pemda' || user.role === 'kementerian'

  const scaleFactor = filters.provinceId === 'all' ? 1 : filters.regionId === 'all' ? 0.3 : 0.1

  if (user.role === 'petani') {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">PANEN SAYA</h1>
            <p className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-widest">
              LOG AKTIVITAS PRODUKSI & VERIFIKASI HASIL BUMI
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {canRoute('/produksi/rencana') && (
              <Button variant="outline" size="sm" className="h-8 text-xs font-semibold text-slate-600 border-slate-200" asChild>
                <Link href="/produksi/rencana">
                  <ClipboardList className="mr-2 h-3.5 w-3.5" />
                  RENCANA TANAM
                </Link>
              </Button>
            )}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" className="h-8 bg-slate-900 text-white hover:bg-slate-800 text-xs font-semibold">
                  <Plus className="mr-2 h-3.5 w-3.5" />
                  CATAT PANEN
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle className="text-sm font-black uppercase tracking-widest text-slate-900">CATAT PANEN BARU</DialogTitle>
                  <DialogDescription className="text-xs font-bold text-slate-500 uppercase">
                    INPUT HASIL PRODUKSI UNTUK PROSES VERIFIKASI KOPERASI
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">KOMODITAS PRODUKSI</Label>
                    <Select>
                      <SelectTrigger className="h-10 text-xs font-semibold bg-slate-50 border-slate-100">
                        <SelectValue placeholder="PILIH KOMODITAS" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="padi">PADI PREMIUM</SelectItem>
                        <SelectItem value="jagung">JAGUNG PIPIL</SelectItem>
                        <SelectItem value="gabah">GABAH KERING</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">JUMLAH (KG)</Label>
                      <Input type="number" placeholder="0" className="h-10 text-xs font-semibold bg-slate-50 border-slate-100" />
                    </div>
                    <div className="grid gap-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">ESTIMASI GRADE</Label>
                      <Select>
                        <SelectTrigger className="h-10 text-xs font-semibold bg-slate-50 border-slate-100">
                          <SelectValue placeholder="PILIH" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="A">GRADE A</SelectItem>
                          <SelectItem value="B">GRADE B</SelectItem>
                          <SelectItem value="C">GRADE C</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid gap-2">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">TANGGAL PANEN</Label>
                    <Input type="date" className="h-10 text-xs font-semibold bg-slate-50 border-slate-100" />
                  </div>
                </div>
                <DialogFooter className="gap-2 sm:gap-0">
                  <Button variant="outline" className="text-xs font-semibold" onClick={() => setIsDialogOpen(false)}>
                    BATAL
                  </Button>
                  <Button className="bg-slate-900 text-white text-xs font-semibold" onClick={() => setIsDialogOpen(false)}>SIMPAN DATA</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { label: 'CATATAN PANEN AKTIF', value: personalHarvests.length, sub: 'UNIT DALAM PROSES', icon: ClipboardList, tone: 'slate' },
            { label: 'ESTIMASI TOTAL HASIL', value: '2.9 TON', sub: 'SIAP DIPASARKAN', icon: Package, tone: 'emerald' },
            { label: 'SIAP VERIFIKASI', value: '1', sub: 'SCHEDULED VISIT', icon: CheckCircle, tone: 'emerald' },
            { label: 'AKSI BERIKUTNYA', value: 'DATA PADI', sub: 'LENGKAPI PROFIL', icon: ArrowRight, tone: 'slate' },
          ].map((stat, i) => (
            <Card key={i} className="border-none bg-white shadow-sm overflow-hidden group">
              <div className={`h-1 w-full ${stat.tone === 'emerald' ? 'bg-emerald-500' : 'bg-slate-900'}`} />
              <CardHeader className="p-4 pb-2">
                <div className="flex justify-between items-start">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{stat.label}</p>
                  <stat.icon className={`h-4 w-4 ${stat.tone === 'emerald' ? 'text-emerald-500' : 'text-slate-900'}`} />
                </div>
                <CardTitle className="text-2xl font-black text-slate-900 mt-1">{stat.value}</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-[10px] font-bold text-slate-500 mt-1">{stat.sub}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="border-none bg-white shadow-sm overflow-hidden">
          <div className="h-1 w-full bg-slate-900" />
          <CardHeader className="p-6 border-b border-slate-50">
            <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-900">AGENDA PANEN PRIBADI</CardTitle>
            <CardDescription className="text-xs font-bold text-slate-500 uppercase">LOG PRODUKSI INDIVIDUAL TERVERIFIKASI</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-6 p-6 lg:grid-cols-[1.35fr_0.95fr]">
            <div className="space-y-3">
              {personalHarvests.map((item) => (
                <div key={item.id} className="rounded-2xl border border-slate-100 bg-slate-50/50 p-4 transition-all hover:bg-white hover:shadow-md group">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-black text-slate-900 group-hover:text-emerald-600 transition-colors uppercase tracking-tight">{item.commodity}</h3>
                        <Badge className={`text-[10px] font-black border-none px-1.5 h-4 ${gradeColors[item.grade]}`}>GRADE {item.grade}</Badge>
                      </div>
                      <p className="mt-1 text-xs font-bold text-slate-500 uppercase tracking-widest">{item.note}</p>
                    </div>
                    <Badge variant="outline" className="text-[10px] font-black border-slate-200 text-slate-600 uppercase">{item.status}</Badge>
                  </div>

                  <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
                    <div className="rounded-xl bg-white border border-slate-100 p-3 shadow-sm">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">VOLUME</p>
                      <p className="mt-1 text-sm font-black text-slate-900">{item.volume.toUpperCase()}</p>
                    </div>
                    <div className="rounded-xl bg-white border border-slate-100 p-3 shadow-sm">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">JADWAL</p>
                      <p className="mt-1 text-sm font-black text-slate-900">{item.schedule.toUpperCase()}</p>
                    </div>
                    <div className="rounded-xl bg-white border border-slate-100 p-3 shadow-sm">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ID CATATAN</p>
                      <p className="mt-1 text-sm font-black text-slate-900">{item.id}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Card className="h-fit border-2 border-dashed border-slate-200 bg-slate-50/30">
              <CardHeader className="p-5">
                <CardTitle className="text-xs font-black uppercase tracking-widest text-slate-900">PROTOKOL OPTIMALISASI</CardTitle>
                <CardDescription className="text-[10px] font-bold text-slate-500 uppercase">AKSELERASI PENYERAPAN HASIL PANEN</CardDescription>
              </CardHeader>
              <CardContent className="p-5 pt-0 space-y-3">
                {[
                  { title: 'PENCATATAN REAL-TIME', desc: 'DATA AWAL MEMBANTU KOPERASI MENYIAPKAN GUDANG DAN PEMBELI STRATEGIS.' },
                  { title: 'VALIDASI KUALITAS', desc: 'AKURASI GRADE DAN BERAT MEMPERCEPAT PROSES VERIFIKASI & PEMBAYARAN.' },
                  { title: 'MONITORING HARGA', desc: 'GUNAKAN AI HARGA UNTUK MENENTUKAN WAKTU JUAL TERBAIK DI PASAR NASIONAL.' },
                ].map((step, idx) => (
                  <div key={idx} className="rounded-xl bg-white border border-slate-100 p-3 shadow-sm">
                    <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">{idx + 1}. {step.title}</p>
                    <p className="mt-1 text-[10px] font-bold text-slate-500 leading-tight">{step.desc}</p>
                  </div>
                ))}
                <div className="flex flex-col gap-2 pt-2">
                  {canRoute('/pasar/harga') && (
                    <Button variant="outline" size="sm" asChild className="w-full h-8 text-[10px] font-black border-slate-200">
                      <Link href="/pasar/harga">
                        LIHAT HARGA PASAR
                        <ArrowRight className="ml-2 h-3 w-3" />
                      </Link>
                    </Button>
                  )}
                  {canRoute('/ai/rekomendasi-harga') && (
                    <Button size="sm" asChild className="w-full h-8 bg-slate-900 text-white text-[10px] font-black">
                      <Link href="/ai/rekomendasi-harga">
                        BUKA REKOMENDASI AI
                        <ArrowRight className="ml-2 h-3 w-3" />
                      </Link>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (isAggregateViewer) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="space-y-2">
            <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">PUSAT KOMANDO PRODUKSI NASIONAL</h1>
            <p className="text-[10px] font-black text-slate-500 mt-1 uppercase tracking-widest leading-relaxed">
              MONITORING AGREGAT OUTPUT KOMODITAS STRATEGIS NASIONAL
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              className="h-9 text-[10px] font-black uppercase tracking-widest border-slate-200 text-slate-600 rounded-none shadow-sm"
              onClick={() => toast({ title: "Inisiasi Audit Produksi", description: "Mengagregasi data panen regional ke dalam sistem pemantauan nasional..." })}
            >
              <ClipboardList className="mr-2 h-3.5 w-3.5" />
              AUDIT PRODUKSI
            </Button>
            {canRoute('/produksi/agregasi') && (
              <Button size="sm" className="h-9 bg-slate-900 text-white hover:bg-slate-800 text-[10px] font-black uppercase tracking-widest px-6 rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] transition-all" asChild>
                <Link href="/produksi/agregasi">
                  <BarChart3 className="mr-2 h-3.5 w-3.5" />
                  ANALITIK AGREGASI
                </Link>
              </Button>
            )}
          </div>
        </div>

        <KementerianFilterBar
          filters={filters}
          setFilters={setFilters}
          search={search}
          setSearch={setSearch}
        />

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { label: 'WILAYAH DIPANTAU', value: Math.floor(regionalSummaries.length * scaleFactor).toLocaleString('id-ID'), sub: 'ENTITAS TERVERIFIKASI', icon: MapPin, tone: 'slate' },
            { label: 'PRODUKSI TERCATAT', value: `${(totalHarvestVolume * scaleFactor * 100).toLocaleString('id-ID')} TON`, sub: 'VOLUME KONSOLIDASI', icon: Package, tone: 'emerald' },
            { label: 'KOMODITAS UTAMA', value: 'PADI PREMIUM', sub: 'OUTPUT DOMINAN', icon: Leaf, tone: 'emerald' },
            { label: 'TREN PRODUKSI', value: 'STABIL POSITIF', sub: 'INDEKS PERFORMA', icon: TrendingUp, tone: 'emerald' },
          ].map((stat, i) => (
            <Card key={i} className="border-none bg-white shadow-sm overflow-hidden rounded-none">
              <div className={`h-1 w-full border-t-4 ${stat.tone === 'emerald' ? 'border-emerald-500' : 'border-slate-900'}`} />
              <CardHeader className="p-4 pb-2">
                <div className="flex justify-between items-start">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{stat.label}</p>
                  <stat.icon className={`h-4 w-4 ${stat.tone === 'emerald' ? 'text-emerald-500' : 'text-slate-900'}`} />
                </div>
                <CardTitle className="text-xl font-black text-slate-900 mt-1">{stat.value}</CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <p className="text-[10px] font-black text-slate-500 mt-1 uppercase tracking-tighter">{stat.sub}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          {regionalSummaries.map((item) => (
            <Card key={item.area} className="border-none bg-white shadow-sm overflow-hidden transition-all hover:shadow-md group rounded-none">
              <div className="h-1 w-full bg-slate-100 border-t-4 border-slate-900 group-hover:border-emerald-500 transition-colors" />
              <CardHeader className="p-4 pb-3 border-b border-slate-50">
                <CardTitle className="text-sm font-black text-slate-900 uppercase tracking-tight">{item.area.toUpperCase()}</CardTitle>
                <CardDescription className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{item.commodity.toUpperCase()}</CardDescription>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-none bg-slate-50 border border-slate-100 p-3">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">VOLUME AGREGAT</p>
                    <p className="mt-1 text-lg font-black text-slate-900">{item.volume.toUpperCase()}</p>
                  </div>
                  <div className="rounded-none bg-emerald-50 border border-emerald-100 p-3">
                    <p className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">PERTUMBUHAN</p>
                    <p className="mt-1 text-lg font-black text-emerald-700">{item.change}</p>
                  </div>
                </div>
                <div className="rounded-none bg-slate-900 p-3 text-white">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">WAWASAN AI</p>
                  <p className="text-[10px] font-bold text-slate-300 leading-relaxed uppercase tracking-wider">{item.insight.toUpperCase()}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold ">Catatan Panen</h1>
          <p className="text-muted-foreground">Kelola data produksi dan panen anggota koperasi</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Catat Panen
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Catat Panen Baru</DialogTitle>
              <DialogDescription>Input data hasil panen dari anggota</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="anggota">Anggota</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih anggota" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="M001">Pak Slamet Widodo</SelectItem>
                    <SelectItem value="M002">Bu Sri Wahyuni</SelectItem>
                    <SelectItem value="M003">Pak Ahmad Sudirman</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="komoditas">Komoditas</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih komoditas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="C001">Beras Premium</SelectItem>
                    <SelectItem value="C003">Jagung Pipil</SelectItem>
                    <SelectItem value="C004">Cabai Merah</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="jumlah">Jumlah</Label>
                  <Input id="jumlah" type="number" placeholder="0" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="grade">Grade</Label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="A">Grade A</SelectItem>
                      <SelectItem value="B">Grade B</SelectItem>
                      <SelectItem value="C">Grade C</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tanggal">Tanggal Panen</Label>
                <Input id="tanggal" type="date" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Batal
              </Button>
              <Button onClick={() => setIsDialogOpen(false)}>Simpan</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Package className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{productions.length}</p>
                <p className="text-xs text-muted-foreground">Total Catatan</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <CheckCircle className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {productions.filter((p) => p.status === 'disimpan').length}
                </p>
                <p className="text-xs text-muted-foreground">Disimpan</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
                <Calendar className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {productions.filter((p) => p.status === 'dicatat').length}
                </p>
                <p className="text-xs text-muted-foreground">Menunggu Verifikasi</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                <User className="h-5 w-5 text-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {new Set(productions.map((p) => p.memberId)).size}
                </p>
                <p className="text-xs text-muted-foreground">Produsen Aktif</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Cari anggota atau komoditas..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="dicatat">Dicatat</SelectItem>
                <SelectItem value="diverifikasi">Diverifikasi</SelectItem>
                <SelectItem value="disimpan">Disimpan</SelectItem>
                <SelectItem value="terjual">Terjual</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Produksi</CardTitle>
          <CardDescription>
            {filteredProductions.length} catatan panen dengan total {totalHarvestVolume.toLocaleString()} kg hasil produksi.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Anggota</TableHead>
                  <TableHead>Komoditas</TableHead>
                  <TableHead>Jumlah</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead>Tanggal Panen</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[50px]" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProductions.map((prod) => (
                  <TableRow key={prod.id}>
                    <TableCell className="font-mono text-sm">{prod.id}</TableCell>
                    <TableCell className="font-medium">{prod.memberNama}</TableCell>
                    <TableCell>{prod.komoditasNama}</TableCell>
                    <TableCell>
                      {prod.jumlah} {prod.satuan}
                    </TableCell>
                    <TableCell>
                      <Badge className={gradeColors[prod.grade]}>Grade {prod.grade}</Badge>
                    </TableCell>
                    <TableCell>{formatDate(prod.tanggalPanen)}</TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(prod.status)}>{prod.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedHarvest(prod)
                              setDetailDialogOpen(true)
                            }}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            Lihat Detail
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Verifikasi
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
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
