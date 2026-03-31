'use client'

import { useState } from 'react'
import {
  AlertTriangle,
  Calendar,
  ChevronRight,
  Leaf,
  Plus,
  TrendingUp,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useAuth } from '@/lib/auth'

const rencanaTanam = [
  {
    id: 'RT001',
    komoditas: 'Padi',
    varietas: 'IR64',
    luasHa: 15.5,
    kelompok: 'Kelompok Tani Makmur Jaya',
    musim: 'MT1 2024',
    tanggalMulai: '2024-01-15',
    tanggalPanen: '2024-04-15',
    progress: 65,
    status: 'berjalan',
    estimasiHasil: '85 ton',
  },
  {
    id: 'RT002',
    komoditas: 'Jagung',
    varietas: 'Hibrida',
    luasHa: 8.0,
    kelompok: 'Kelompok Tani Makmur Jaya',
    musim: 'MT1 2024',
    tanggalMulai: '2024-02-01',
    tanggalPanen: '2024-05-01',
    progress: 40,
    status: 'berjalan',
    estimasiHasil: '32 ton',
  },
  {
    id: 'RT003',
    komoditas: 'Kentang',
    varietas: 'Granola',
    luasHa: 5.0,
    kelompok: 'Kelompok Tani Sumber Rezeki',
    musim: 'MT1 2024',
    tanggalMulai: '2024-01-20',
    tanggalPanen: '2024-04-20',
    progress: 80,
    status: 'berjalan',
    estimasiHasil: '75 ton',
  },
  {
    id: 'RT004',
    komoditas: 'Cabai Merah',
    varietas: 'TM999',
    luasHa: 3.2,
    kelompok: 'Kelompok Tani Makmur Jaya',
    musim: 'MT2 2024',
    tanggalMulai: '2024-03-01',
    tanggalPanen: '2024-06-15',
    progress: 0,
    status: 'dijadwalkan',
    estimasiHasil: '28 ton',
  },
] as const

const personalPlans = [
  {
    id: 'PR-001',
    komoditas: 'Padi Premium',
    musim: 'Musim Gadu 2026',
    luas: '1.5 Ha',
    tanggalMulai: '8 Apr 2026',
    targetPanen: '18 Jul 2026',
    progress: 35,
    status: 'Pembibitan selesai',
    catatan: 'Benih sudah siap, tinggal penjadwalan pemupukan pertama.',
  },
  {
    id: 'PR-002',
    komoditas: 'Jagung Pipil',
    musim: 'Musim Gadu 2026',
    luas: '0.8 Ha',
    tanggalMulai: '20 Apr 2026',
    targetPanen: '12 Agu 2026',
    progress: 10,
    status: 'Lahan disiapkan',
    catatan: 'Menunggu hujan ringan sebelum tanam serentak.',
  },
] as const

const musimOptions = ['MT1 2024', 'MT2 2024', 'MT1 2025']

export default function RencanaTanamPage() {
  const { user } = useAuth()
  const [filterMusim, setFilterMusim] = useState('semua')

  if (!user) return null

  if (user.role === 'petani') {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Rencana Tanam Saya</h1>
            <p className="text-muted-foreground">
              Atur musim tanam Anda sendiri, pantau progres lahan, dan siapkan target panen tanpa melihat data anggota lain.
            </p>
          </div>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Tambah Rencana Saya
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Rencana Aktif</CardDescription>
              <CardTitle className="text-3xl">{personalPlans.length}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Semua milik Anda</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Luas Lahan Direncanakan</CardDescription>
              <CardTitle className="text-3xl">2.3 Ha</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-primary">Siap untuk musim gadu</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Target Panen</CardDescription>
              <CardTitle className="text-3xl">4.1 ton</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-1 text-xs text-primary">
                <TrendingUp className="h-3 w-3" />
                Berdasarkan kondisi lahan saat ini
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Perhatian Minggu Ini</CardDescription>
              <CardTitle className="text-3xl text-amber-600">1</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-1 text-xs text-amber-600">
                <AlertTriangle className="h-3 w-3" />
                Pemupukan tahap awal
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.35fr_0.95fr]">
          <div className="space-y-4">
            {personalPlans.map((plan) => (
              <Card key={plan.id} className="overflow-hidden">
                <CardHeader className="pb-3">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <Leaf className="h-5 w-5 text-primary" />
                        <CardTitle className="text-lg">{plan.komoditas}</CardTitle>
                        <Badge variant="outline">{plan.musim}</Badge>
                      </div>
                      <CardDescription className="mt-1">{plan.status}</CardDescription>
                    </div>
                    <Badge className="bg-primary/10 text-primary">{plan.id}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-3 text-sm sm:grid-cols-3">
                    <div className="rounded-xl bg-secondary/35 p-3">
                      <p className="text-muted-foreground">Luas</p>
                      <p className="mt-1 font-semibold">{plan.luas}</p>
                    </div>
                    <div className="rounded-xl bg-secondary/35 p-3">
                      <p className="text-muted-foreground">Mulai</p>
                      <p className="mt-1 font-semibold">{plan.tanggalMulai}</p>
                    </div>
                    <div className="rounded-xl bg-secondary/35 p-3">
                      <p className="text-muted-foreground">Target Panen</p>
                      <p className="mt-1 font-semibold">{plan.targetPanen}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Progres lahan</span>
                      <span className="font-medium">{plan.progress}%</span>
                    </div>
                    <Progress value={plan.progress} className="h-2" />
                  </div>

                  <p className="text-sm text-muted-foreground">{plan.catatan}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="h-fit border-dashed">
            <CardHeader>
              <CardTitle className="text-base">Checklist Petani</CardTitle>
              <CardDescription>Supaya rencana tanam lebih siap dieksekusi.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="rounded-xl bg-secondary/35 p-3">
                <p className="font-medium">Pastikan jadwal pupuk awal sudah dibuat</p>
                <p className="mt-1 text-muted-foreground">Jadwal yang rapi membantu prediksi panen dan kebutuhan pembiayaan.</p>
              </div>
              <div className="rounded-xl bg-secondary/35 p-3">
                <p className="font-medium">Sinkronkan rencana dengan jadwal panen</p>
                <p className="mt-1 text-muted-foreground">Supaya koperasi bisa menyiapkan gudang dan pembeli lebih cepat.</p>
              </div>
              <div className="rounded-xl bg-secondary/35 p-3">
                <p className="font-medium">Pantau kondisi harga sebelum menentukan luas tanam</p>
                <p className="mt-1 text-muted-foreground">Komoditas dengan tren harga baik bisa diprioritaskan di musim berikutnya.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const filtered =
    filterMusim === 'semua'
      ? rencanaTanam
      : rencanaTanam.filter((item) => item.musim === filterMusim)

  const totalLuas = rencanaTanam.reduce((acc, item) => acc + item.luasHa, 0)
  const berjalan = rencanaTanam.filter((item) => item.status === 'berjalan').length

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Rencana Tanam</h1>
          <p className="text-muted-foreground">Perencanaan dan monitoring musim tanam koperasi</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Buat Rencana
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Rencana</CardDescription>
            <CardTitle className="text-3xl">{rencanaTanam.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">{berjalan} sedang berjalan</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Luas Tanam</CardDescription>
            <CardTitle className="text-3xl">{totalLuas.toFixed(1)} Ha</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-primary">Musim ini</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Estimasi Hasil</CardDescription>
            <CardTitle className="text-3xl">220 ton</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1 text-xs text-primary">
              <TrendingUp className="h-3 w-3" />
              +15% dari target
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Perlu Perhatian</CardDescription>
            <CardTitle className="text-3xl text-amber-600">1</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1 text-xs text-amber-600">
              <AlertTriangle className="h-3 w-3" />
              Terlambat jadwal
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center gap-2">
        <Select value={filterMusim} onValueChange={setFilterMusim}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <Calendar className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Pilih Musim" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="semua">Semua Musim</SelectItem>
            {musimOptions.map((musim) => (
              <SelectItem key={musim} value={musim}>
                {musim}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {filtered.map((rencana) => (
          <Card key={rencana.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Leaf className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">{rencana.komoditas}</CardTitle>
                    <Badge variant="outline">{rencana.varietas}</Badge>
                  </div>
                  <CardDescription className="mt-1">{rencana.kelompok}</CardDescription>
                </div>
                <Badge
                  variant={rencana.status === 'berjalan' ? 'default' : 'secondary'}
                  className={rencana.status === 'berjalan' ? 'bg-primary/10 text-primary' : ''}
                >
                  {rencana.status === 'berjalan' ? 'Berjalan' : 'Dijadwalkan'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-3">
                <div>
                  <p className="text-muted-foreground">Luas</p>
                  <p className="font-semibold">{rencana.luasHa} Ha</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Musim</p>
                  <p className="font-semibold">{rencana.musim}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Est. Hasil</p>
                  <p className="font-semibold text-primary">{rencana.estimasiHasil}</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Calendar className="h-3 w-3" />
                    {rencana.tanggalMulai} - {rencana.tanggalPanen}
                  </span>
                  <span className="font-medium">{rencana.progress}%</span>
                </div>
                <Progress value={rencana.progress} className="h-2" />
              </div>

              <div className="flex justify-end border-t pt-2">
                <Button variant="ghost" size="sm">
                  Detail
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
