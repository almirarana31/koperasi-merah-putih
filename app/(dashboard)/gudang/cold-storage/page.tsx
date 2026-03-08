'use client'

import {
  Thermometer,
  Droplets,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Package,
  TrendingDown,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

const coldStorageUnits = [
  {
    id: 'CS001',
    nama: 'Cold Room A',
    suhuTarget: 4,
    suhuAktual: 4.2,
    kelembaban: 85,
    kapasitas: 1000,
    terpakai: 650,
    status: 'normal',
    items: [
      { nama: 'Cabai Merah', jumlah: 300, satuan: 'kg', masuk: '2024-02-14', kadaluarsa: '2024-02-28' },
      { nama: 'Tomat', jumlah: 200, satuan: 'kg', masuk: '2024-02-15', kadaluarsa: '2024-02-25' },
      { nama: 'Wortel', jumlah: 150, satuan: 'kg', masuk: '2024-02-13', kadaluarsa: '2024-03-05' },
    ],
  },
  {
    id: 'CS002',
    nama: 'Cold Room B',
    suhuTarget: 2,
    suhuAktual: 2.1,
    kelembaban: 90,
    kapasitas: 500,
    terpakai: 300,
    status: 'normal',
    items: [
      { nama: 'Ikan Tongkol', jumlah: 100, satuan: 'kg', masuk: '2024-02-16', kadaluarsa: '2024-02-23' },
      { nama: 'Udang Vaname', jumlah: 80, satuan: 'kg', masuk: '2024-02-16', kadaluarsa: '2024-02-21' },
      { nama: 'Cumi', jumlah: 120, satuan: 'kg', masuk: '2024-02-15', kadaluarsa: '2024-02-22' },
    ],
  },
  {
    id: 'CS003',
    nama: 'Freezer Room',
    suhuTarget: -18,
    suhuAktual: -17.5,
    kelembaban: 70,
    kapasitas: 500,
    terpakai: 180,
    status: 'warning',
    warningMessage: 'Suhu sedikit di atas target',
    items: [
      { nama: 'Daging Ayam', jumlah: 100, satuan: 'kg', masuk: '2024-02-10', kadaluarsa: '2024-04-10' },
      { nama: 'Ikan Beku', jumlah: 80, satuan: 'kg', masuk: '2024-02-08', kadaluarsa: '2024-04-08' },
    ],
  },
]

const expiringItems = [
  { nama: 'Udang Vaname', lokasi: 'Cold Room B', kadaluarsa: '2024-02-21', sisaHari: 4 },
  { nama: 'Cumi', lokasi: 'Cold Room B', kadaluarsa: '2024-02-22', sisaHari: 5 },
  { nama: 'Ikan Tongkol', lokasi: 'Cold Room B', kadaluarsa: '2024-02-23', sisaHari: 6 },
  { nama: 'Tomat', lokasi: 'Cold Room A', kadaluarsa: '2024-02-25', sisaHari: 8 },
]

export default function ColdStoragePage() {
  const totalKapasitas = coldStorageUnits.reduce((acc, u) => acc + u.kapasitas, 0)
  const totalTerpakai = coldStorageUnits.reduce((acc, u) => acc + u.terpakai, 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Cold Storage</h1>
        <p className="text-muted-foreground">Monitoring dan manajemen cold storage</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Unit</CardDescription>
            <CardTitle className="text-3xl">{coldStorageUnits.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Cold storage aktif</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Kapasitas Terpakai</CardDescription>
            <CardTitle className="text-3xl">{((totalTerpakai / totalKapasitas) * 100).toFixed(0)}%</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={(totalTerpakai / totalKapasitas) * 100} className="h-2" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Status Normal</CardDescription>
            <CardTitle className="text-3xl text-emerald-500">
              {coldStorageUnits.filter(u => u.status === 'normal').length}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1 text-xs text-emerald-500">
              <CheckCircle2 className="h-3 w-3" />
              Operasional baik
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Segera Kadaluarsa</CardDescription>
            <CardTitle className="text-3xl text-amber-500">{expiringItems.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1 text-xs text-amber-500">
              <AlertTriangle className="h-3 w-3" />
              Dalam 7 hari
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {coldStorageUnits.map((unit) => (
          <Card key={unit.id} className={unit.status === 'warning' ? 'border-amber-500/50' : ''}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">{unit.nama}</CardTitle>
                <Badge variant={unit.status === 'normal' ? 'default' : 'destructive'} className={unit.status === 'normal' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500 border-amber-500/50'}>
                  {unit.status === 'normal' ? 'Normal' : 'Warning'}
                </Badge>
              </div>
              {unit.warningMessage && (
                <p className="text-xs text-amber-500 flex items-center gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  {unit.warningMessage}
                </p>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-500/10">
                  <Thermometer className="h-8 w-8 text-blue-500" />
                  <div>
                    <p className="text-xs text-muted-foreground">Suhu</p>
                    <p className="text-xl font-bold">{unit.suhuAktual}°C</p>
                    <p className="text-xs text-muted-foreground">Target: {unit.suhuTarget}°C</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-cyan-500/10">
                  <Droplets className="h-8 w-8 text-cyan-500" />
                  <div>
                    <p className="text-xs text-muted-foreground">Kelembaban</p>
                    <p className="text-xl font-bold">{unit.kelembaban}%</p>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Kapasitas</span>
                  <span>{unit.terpakai} / {unit.kapasitas} kg</span>
                </div>
                <Progress value={(unit.terpakai / unit.kapasitas) * 100} className="h-2" />
              </div>

              <div className="border-t pt-4">
                <p className="text-sm font-medium mb-2">Isi Penyimpanan</p>
                <div className="space-y-2">
                  {unit.items.map((item, idx) => (
                    <div key={idx} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <span>{item.nama}</span>
                      </div>
                      <span className="text-muted-foreground">{item.jumlah} {item.satuan}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            Item Segera Kadaluarsa
          </CardTitle>
          <CardDescription>Produk yang akan kadaluarsa dalam 7 hari ke depan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {expiringItems.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-amber-500/5 border border-amber-500/20">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
                    <Clock className="h-5 w-5 text-amber-500" />
                  </div>
                  <div>
                    <p className="font-medium">{item.nama}</p>
                    <p className="text-sm text-muted-foreground">{item.lokasi}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-amber-500 font-medium">{item.sisaHari} hari lagi</p>
                  <p className="text-xs text-muted-foreground">Exp: {item.kadaluarsa}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
