'use client'

import { Users, MapPin, Leaf, ChevronRight, Plus, TrendingUp } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import Link from 'next/link'

const kelompokTani = [
  {
    id: 'KT001',
    nama: 'Kelompok Tani Makmur Jaya',
    ketua: 'Pak Slamet Widodo',
    desa: 'Sukamaju',
    kecamatan: 'Cianjur',
    anggota: 25,
    luasTotal: 45.5,
    komoditas: ['Padi', 'Jagung', 'Kedelai'],
    produksi: 85,
    status: 'aktif',
  },
  {
    id: 'KT002',
    nama: 'Kelompok Tani Sumber Rezeki',
    ketua: 'Pak Hendra Wijaya',
    desa: 'Cibodas',
    kecamatan: 'Lembang',
    anggota: 18,
    luasTotal: 32.0,
    komoditas: ['Kentang', 'Wortel', 'Kubis', 'Brokoli'],
    produksi: 92,
    status: 'aktif',
  },
  {
    id: 'KT003',
    nama: 'Kelompok Nelayan Bahari',
    ketua: 'Pak Ahmad Sudirman',
    desa: 'Pantai Indah',
    kecamatan: 'Palabuhanratu',
    anggota: 15,
    luasTotal: 0,
    komoditas: ['Ikan Tongkol', 'Udang', 'Cumi', 'Kepiting'],
    produksi: 78,
    status: 'aktif',
  },
  {
    id: 'KT004',
    nama: 'Kelompok Tani Berkah',
    ketua: 'Bu Aminah',
    desa: 'Karawang',
    kecamatan: 'Karawang',
    anggota: 12,
    luasTotal: 22.0,
    komoditas: ['Padi'],
    produksi: 65,
    status: 'nonaktif',
  },
]

export default function KelompokTaniPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Kelompok Tani</h1>
          <p className="text-muted-foreground">Manajemen kelompok tani dan nelayan</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Tambah Kelompok
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Kelompok</CardDescription>
            <CardTitle className="text-3xl">4</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">3 aktif, 1 nonaktif</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Anggota</CardDescription>
            <CardTitle className="text-3xl">70</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-emerald-500">+5 bulan ini</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Lahan</CardDescription>
            <CardTitle className="text-3xl">99.5 Ha</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Lahan produktif</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Rata-rata Produksi</CardDescription>
            <CardTitle className="text-3xl">80%</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-emerald-500">Target tercapai</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {kelompokTani.map((kelompok) => (
          <Card key={kelompok.id} className="overflow-hidden">
            <CardHeader className="border-b bg-muted/30">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    {kelompok.nama}
                    <Badge variant={kelompok.status === 'aktif' ? 'default' : 'secondary'}>
                      {kelompok.status}
                    </Badge>
                  </CardTitle>
                  <CardDescription className="mt-1">
                    Ketua: {kelompok.ketua}
                  </CardDescription>
                </div>
                <Link href={`/anggota/kelompok/${kelompok.id}`}>
                  <Button variant="ghost" size="icon">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{kelompok.desa}, {kelompok.kecamatan}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span>{kelompok.anggota} Anggota</span>
                  </div>
                  {kelompok.luasTotal > 0 && (
                    <div className="flex items-center gap-2 text-sm">
                      <Leaf className="h-4 w-4 text-muted-foreground" />
                      <span>{kelompok.luasTotal} Ha Lahan</span>
                    </div>
                  )}
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Komoditas</p>
                    <div className="flex flex-wrap gap-1">
                      {kelompok.komoditas.slice(0, 3).map((k, i) => (
                        <Badge key={i} variant="outline" className="text-xs">{k}</Badge>
                      ))}
                      {kelompok.komoditas.length > 3 && (
                        <Badge variant="outline" className="text-xs">+{kelompok.komoditas.length - 3}</Badge>
                      )}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-muted-foreground">Target Produksi</span>
                      <span className="font-medium">{kelompok.produksi}%</span>
                    </div>
                    <Progress value={kelompok.produksi} className="h-2" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
