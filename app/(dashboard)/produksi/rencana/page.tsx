'use client'

import { useState } from 'react'
import {
  Calendar,
  Leaf,
  MapPin,
  Plus,
  ChevronRight,
  TrendingUp,
  AlertTriangle,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
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
]

const musimOptions = ['MT1 2024', 'MT2 2024', 'MT1 2025']

export default function RencanaTanamPage() {
  const [filterMusim, setFilterMusim] = useState('semua')

  const filtered = filterMusim === 'semua' 
    ? rencanaTanam 
    : rencanaTanam.filter(r => r.musim === filterMusim)

  const totalLuas = rencanaTanam.reduce((acc, r) => acc + r.luasHa, 0)
  const berjalan = rencanaTanam.filter(r => r.status === 'berjalan').length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Rencana Tanam</h1>
          <p className="text-muted-foreground">Perencanaan dan monitoring musim tanam</p>
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
            <p className="text-xs text-emerald-500">Musim ini</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Estimasi Hasil</CardDescription>
            <CardTitle className="text-3xl">220 ton</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1 text-xs text-emerald-500">
              <TrendingUp className="h-3 w-3" />
              +15% dari target
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Perlu Perhatian</CardDescription>
            <CardTitle className="text-3xl text-amber-500">1</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1 text-xs text-amber-500">
              <AlertTriangle className="h-3 w-3" />
              Terlambat jadwal
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center gap-2">
        <Select value={filterMusim} onValueChange={setFilterMusim}>
          <SelectTrigger className="w-[180px]">
            <Calendar className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Pilih Musim" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="semua">Semua Musim</SelectItem>
            {musimOptions.map(m => (
              <SelectItem key={m} value={m}>{m}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {filtered.map((rencana) => (
          <Card key={rencana.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Leaf className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">{rencana.komoditas}</CardTitle>
                    <Badge variant="outline">{rencana.varietas}</Badge>
                  </div>
                  <CardDescription className="mt-1">{rencana.kelompok}</CardDescription>
                </div>
                <Badge 
                  variant={rencana.status === 'berjalan' ? 'default' : 'secondary'}
                  className={rencana.status === 'berjalan' ? 'bg-emerald-500/10 text-emerald-500' : ''}
                >
                  {rencana.status === 'berjalan' ? 'Berjalan' : 'Dijadwalkan'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4 text-sm">
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
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {rencana.tanggalMulai} - {rencana.tanggalPanen}
                  </span>
                  <span className="font-medium">{rencana.progress}%</span>
                </div>
                <Progress value={rencana.progress} className="h-2" />
              </div>

              <div className="flex justify-end pt-2 border-t">
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
