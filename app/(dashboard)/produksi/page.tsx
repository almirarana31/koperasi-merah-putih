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

  if (user.role === 'petani') {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold ">Panen Saya</h1>
            <p className="text-muted-foreground">
              Catat hasil panen pribadi, lihat status verifikasi, dan siapkan hasil terbaik untuk dijual lewat koperasi.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {canRoute('/produksi/rencana') && (
              <Button variant="outline" asChild>
                <Link href="/produksi/rencana">
                  <ClipboardList className="mr-2 h-4 w-4" />
                  Rencana Tanam
                </Link>
              </Button>
            )}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Catat Panen Saya
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Catat Panen Baru</DialogTitle>
                  <DialogDescription>
                    Isi hasil panen Anda untuk diproses koperasi dan diverifikasi petugas.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid gap-2">
                    <Label htmlFor="komoditas">Komoditas</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih komoditas" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="padi">Padi Premium</SelectItem>
                        <SelectItem value="jagung">Jagung Pipil</SelectItem>
                        <SelectItem value="gabah">Gabah Kering</SelectItem>
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
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Catatan panen aktif</p>
              <p className="mt-2 text-3xl font-bold">{personalHarvests.length}</p>
              <p className="mt-1 text-xs text-muted-foreground">Hanya panen milik Anda</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Estimasi total hasil</p>
              <p className="mt-2 text-3xl font-bold">2.9 ton</p>
              <p className="mt-1 text-xs text-primary">Siap dipasarkan lewat koperasi</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Panen siap verifikasi</p>
              <p className="mt-2 text-3xl font-bold">1</p>
              <p className="mt-1 text-xs text-muted-foreground">Petugas dijadwalkan datang besok</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Aksi berikutnya</p>
              <p className="mt-2 text-base font-semibold">Lengkapi data padi premium</p>
              <p className="mt-1 text-xs text-muted-foreground">Supaya koperasi bisa menyiapkan penawaran harga</p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-primary/15">
          <CardHeader>
            <CardTitle>Agenda Panen Pribadi</CardTitle>
            <CardDescription>
              Tampilan ini khusus anggota. Anda tidak dapat melihat atau mencatat panen milik anggota lain.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 lg:grid-cols-[1.35fr_0.95fr]">
            <div className="space-y-3">
              {personalHarvests.map((item) => (
                <div key={item.id} className="rounded-2xl border bg-card p-4 shadow-sm">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-lg font-semibold">{item.commodity}</h3>
                        <Badge className={gradeColors[item.grade]}>Grade {item.grade}</Badge>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{item.note}</p>
                    </div>
                    <Badge variant="outline">{item.status}</Badge>
                  </div>

                  <div className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
                    <div className="rounded-xl bg-secondary/35 p-3">
                      <p className="text-muted-foreground">Volume</p>
                      <p className="mt-1 font-semibold">{item.volume}</p>
                    </div>
                    <div className="rounded-xl bg-secondary/35 p-3">
                      <p className="text-muted-foreground">Jadwal</p>
                      <p className="mt-1 font-semibold">{item.schedule}</p>
                    </div>
                    <div className="rounded-xl bg-secondary/35 p-3">
                      <p className="text-muted-foreground">ID Catatan</p>
                      <p className="mt-1 font-semibold">{item.id}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Card className="h-fit border-dashed">
              <CardHeader>
                <CardTitle className="text-base">Langkah yang Disarankan</CardTitle>
                <CardDescription>Supaya panen Anda cepat diproses koperasi.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="rounded-xl bg-secondary/35 p-3">
                  <p className="font-medium">1. Catat panen segera setelah panen selesai</p>
                  <p className="mt-1 text-muted-foreground">Data awal membantu koperasi menyiapkan gudang dan pembeli.</p>
                </div>
                <div className="rounded-xl bg-secondary/35 p-3">
                  <p className="font-medium">2. Pastikan grade dan berat sudah benar</p>
                  <p className="mt-1 text-muted-foreground">Data yang lengkap mempercepat verifikasi dan pembayaran.</p>
                </div>
                <div className="rounded-xl bg-secondary/35 p-3">
                  <p className="font-medium">3. Pantau harga pasar sebelum menjual</p>
                  <p className="mt-1 text-muted-foreground">Gunakan fitur harga dan rekomendasi AI untuk memilih waktu jual.</p>
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                  {canRoute('/pasar/harga') && (
                    <Button variant="outline" asChild className="w-full sm:w-auto">
                      <Link href="/pasar/harga">
                        Lihat Harga Pasar
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  )}
                  {canRoute('/ai/rekomendasi-harga') && (
                    <Button asChild className="w-full sm:w-auto">
                      <Link href="/ai/rekomendasi-harga">
                        Buka AI Harga
                        <ArrowRight className="ml-2 h-4 w-4" />
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
          <div>
            <h1 className="text-2xl font-semibold  text-slate-900 ">Ringkasan Produksi Wilayah</h1>
            <p className="text-xs font-bold text-slate-500   mt-1">
              Pemantauan output komoditas strategis nasional
            </p>
          </div>
          <div className="flex gap-2">
            <ExportButton
              title="Ringkasan Produksi Wilayah"
              filename="KOPDES_Produksi_Wilayah"
              data={filteredProductions.map(p => ({
                'ID': p.id,
                'Anggota': p.memberNama,
                'Komoditas': p.komoditasNama,
                'Jumlah': `${p.jumlah} ${p.satuan}`,
                'Grade': p.grade,
                'Tanggal': p.tanggalPanen,
                'Status': p.status
              }))}
            />
            {canRoute('/produksi/agregasi') && (
              <Button variant="outline" size="sm" className="h-8 text-xs font-semibold   text-slate-600" asChild>
                <Link href="/produksi/agregasi">
                  <BarChart3 className="mr-2 h-3.5 w-3.5" />
                  Agregasi
                </Link>
              </Button>
            )}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[
            { label: 'Wilayah Dipantau', value: regionalSummaries.length.toLocaleString('id-ID'), icon: MapPin, tone: 'slate' },
            { label: 'Produksi Tercatat', value: `${totalHarvestVolume.toLocaleString('id-ID')} ton`, icon: Package, tone: 'emerald' },
            { label: 'Komoditas Utama', value: 'Padi', icon: Leaf, tone: 'emerald' },
            { label: 'Tren Produksi', value: 'Positif', icon: TrendingUp, tone: 'emerald' },
          ].map((stat, i) => (
            <Card key={i} className="border-none shadow-[0_4px_12px_-4px_rgba(0,0,0,0.05)] overflow-hidden">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${stat.tone === 'emerald' ? 'bg-emerald-50 text-emerald-600' : 'bg-slate-50 text-slate-600'}`}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-semibold text-slate-900 ">{stat.value}</p>
                    <p className="text-xs font-semibold text-slate-400  ">{stat.label}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {isKementerian && (
          <div className="mb-4">
            <KementerianFilterBar
              filters={filters}
              setFilters={setFilters}
              search={search}
              setSearch={setSearch}
            />
          </div>
        )}

        <div className="grid gap-4 lg:grid-cols-3">
          {regionalSummaries.map((item) => (
            <Card key={item.area} className="border-none shadow-[0_4px_12px_-4px_rgba(0,0,0,0.05)] overflow-hidden transition-all hover:border-emerald-200">
              <CardHeader className="p-4 pb-3 border-b border-slate-50">
                <CardTitle className="text-sm font-semibold text-slate-900  ">{item.area}</CardTitle>
                <CardDescription className="text-xs font-bold text-emerald-600  ">{item.commodity}</CardDescription>
              </CardHeader>
              <CardContent className="p-4 space-y-3">
                <div className="rounded-xl bg-slate-50 p-3">
                  <p className="text-xs font-semibold text-slate-400  ">Volume Agregat</p>
                  <p className="mt-1 text-2xl font-semibold text-slate-900 ">{item.volume}</p>
                </div>
                <div className="rounded-xl bg-emerald-50 p-3">
                  <p className="text-xs font-semibold text-emerald-600  ">Pertumbuhan</p>
                  <p className="mt-1 text-lg font-semibold text-emerald-700 ">{item.change}</p>
                </div>
                <p className="text-xs text-slate-500 font-bold  leading-relaxed leading-tight">{item.insight}</p>
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
