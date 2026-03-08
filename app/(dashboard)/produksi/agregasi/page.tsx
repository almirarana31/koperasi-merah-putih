'use client'

import {
  Package,
  TrendingUp,
  Users,
  Warehouse,
  ArrowRight,
  Plus,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'

const agregasiData = [
  {
    id: 'AGR001',
    komoditas: 'Beras Premium',
    target: 5000,
    terkumpul: 3500,
    satuan: 'kg',
    kontributor: 8,
    gudang: 'Gudang Utama',
    deadline: '2024-02-28',
    buyer: 'Hotel Grand Hyatt',
    hargaTarget: 14000,
    status: 'berjalan',
  },
  {
    id: 'AGR002',
    komoditas: 'Jagung Pipil',
    target: 3000,
    terkumpul: 3000,
    satuan: 'kg',
    kontributor: 5,
    gudang: 'Gudang Utama',
    deadline: '2024-02-25',
    buyer: 'PT Indofood',
    hargaTarget: 5500,
    status: 'selesai',
  },
  {
    id: 'AGR003',
    komoditas: 'Kentang',
    target: 2000,
    terkumpul: 1200,
    satuan: 'kg',
    kontributor: 3,
    gudang: 'Cold Storage',
    deadline: '2024-03-05',
    buyer: 'Superindo',
    hargaTarget: 15000,
    status: 'berjalan',
  },
  {
    id: 'AGR004',
    komoditas: 'Cabai Merah',
    target: 500,
    terkumpul: 150,
    satuan: 'kg',
    kontributor: 2,
    gudang: 'Cold Storage',
    deadline: '2024-03-10',
    buyer: 'Restoran Padang Sederhana',
    hargaTarget: 45000,
    status: 'berjalan',
  },
]

export default function AgregasiPage() {
  const totalTarget = agregasiData.reduce((acc, a) => acc + a.target, 0)
  const totalTerkumpul = agregasiData.reduce((acc, a) => acc + a.terkumpul, 0)
  const totalNilai = agregasiData.reduce((acc, a) => acc + (a.terkumpul * a.hargaTarget), 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Agregasi Produk</h1>
          <p className="text-muted-foreground">Pengumpulan produk dari multiple produsen</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Buat Agregasi
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Agregasi Aktif</CardDescription>
            <CardTitle className="text-3xl">{agregasiData.filter(a => a.status === 'berjalan').length}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Sedang berjalan</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Target Total</CardDescription>
            <CardTitle className="text-3xl">{(totalTarget / 1000).toFixed(1)} ton</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Semua agregasi</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Terkumpul</CardDescription>
            <CardTitle className="text-3xl">{(totalTerkumpul / 1000).toFixed(1)} ton</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={(totalTerkumpul / totalTarget) * 100} className="h-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Nilai Agregasi</CardDescription>
            <CardTitle className="text-3xl">Rp {(totalNilai / 1000000).toFixed(0)}jt</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1 text-xs text-emerald-500">
              <TrendingUp className="h-3 w-3" />
              Estimasi nilai jual
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {agregasiData.map((agregasi) => {
          const progress = (agregasi.terkumpul / agregasi.target) * 100
          
          return (
            <Card key={agregasi.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex flex-col lg:flex-row">
                  <div className="flex-1 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <Package className="h-5 w-5 text-primary" />
                          <h3 className="font-semibold text-lg">{agregasi.komoditas}</h3>
                          <Badge variant={agregasi.status === 'selesai' ? 'default' : 'secondary'}>
                            {agregasi.status === 'selesai' ? 'Selesai' : 'Berjalan'}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          Untuk: {agregasi.buyer}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Deadline</p>
                        <p className="font-semibold">{agregasi.deadline}</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span>Progress Pengumpulan</span>
                        <span className="font-semibold">
                          {agregasi.terkumpul.toLocaleString()} / {agregasi.target.toLocaleString()} {agregasi.satuan}
                        </span>
                      </div>
                      <Progress value={progress} className="h-3" />
                      <p className="text-sm text-muted-foreground">{progress.toFixed(0)}% tercapai</p>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t">
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span>{agregasi.kontributor} Kontributor</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Warehouse className="h-4 w-4 text-muted-foreground" />
                        <span>{agregasi.gudang}</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground">Harga: </span>
                        <span className="font-semibold text-primary">
                          Rp {agregasi.hargaTarget.toLocaleString()}/{agregasi.satuan}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="lg:w-48 bg-muted/30 p-6 flex flex-col items-center justify-center border-t lg:border-t-0 lg:border-l">
                    <p className="text-sm text-muted-foreground mb-2">Nilai Terkumpul</p>
                    <p className="text-2xl font-bold text-primary">
                      Rp {((agregasi.terkumpul * agregasi.hargaTarget) / 1000000).toFixed(1)}jt
                    </p>
                    <Button variant="outline" size="sm" className="mt-4">
                      Detail
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
