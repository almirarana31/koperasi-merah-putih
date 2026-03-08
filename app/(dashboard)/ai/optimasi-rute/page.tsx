'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { MapPin, Clock, Fuel, Truck, TrendingDown } from 'lucide-react'

const routeOptimizations = [
  {
    rute: 'Rute Utama (Medan - Bekasi)',
    jarak: 1250,
    waktuSebelum: 28,
    waktuSesudah: 22,
    biayaSebelum: 2500000,
    biayaSesudah: 1925000,
    penghematan: 575000,
    efisiensi: 23,
    status: 'Aktif',
  },
  {
    rute: 'Rute Timur (Surabaya - Jakarta)',
    jarak: 780,
    waktuSebelum: 18,
    waktuSesudah: 14,
    biayaSebelum: 1560000,
    biayaSesudah: 1216000,
    penghematan: 344000,
    efisiensi: 22,
    status: 'Aktif',
  },
  {
    rute: 'Rute Barat (Bandung - Jakarta)',
    jarak: 240,
    waktuSebelum: 6,
    waktuSesudah: 5,
    biayaSebelum: 480000,
    biayaSesudah: 405000,
    penghematan: 75000,
    efisiensi: 16,
    status: 'Pending',
  },
]

const trafficData = [
  { jam: '06:00', biayaSebelum: 450000, biayaSesudah: 380000 },
  { jam: '08:00', biayaSebelum: 580000, biayaSesudah: 465000 },
  { jam: '10:00', biayaSebelum: 520000, biayaSesudah: 425000 },
  { jam: '12:00', biayaSebelum: 490000, biayaSesudah: 405000 },
  { jam: '14:00', biayaSebelum: 510000, biayaSesudah: 420000 },
  { jam: '16:00', biayaSebelum: 620000, biayaSesudah: 510000 },
]

const stopPoints = [
  { nama: 'Gudang Pusat', status: 'Start', waktu: '06:00', index: 1 },
  { nama: 'Pembeli A (Hotel)', status: 'Buka', waktu: '07:30', index: 2 },
  { nama: 'Pembeli B (Restoran)', status: 'Buka', waktu: '08:45', index: 3 },
  { nama: 'Pembeli C (Pasar)', status: 'Buka', waktu: '10:15', index: 4 },
  { nama: 'Pembeli D (FMCG)', status: 'Buka', waktu: '12:00', index: 5 },
]

export default function OptimationRoutePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Optimasi Rute Pengiriman</h1>
        <p className="text-muted-foreground mt-2">Kalkulasi rute paling efisien menggunakan algoritma TSP dan machine learning</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Penghematan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Rp 994k</div>
            <p className="text-xs text-muted-foreground">Per bulan</p>
            <Badge className="mt-2 bg-green-100 text-green-800">
              <TrendingDown className="mr-1 h-3 w-3" />
              -22%
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pengurangan Waktu</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">44 jam</div>
            <p className="text-xs text-muted-foreground">Per bulan</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Rute Aktif</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">Sudah optimal</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Kepuasan Pengemudi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">4.7/5</div>
            <p className="text-xs text-muted-foreground">Rating rata-rata</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4">
        {routeOptimizations.map((route, idx) => (
          <Card key={route.rute}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{route.rute}</CardTitle>
                  <CardDescription className="flex gap-2 mt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {route.jarak} km
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {route.waktuSesudah}h (sebelum: {route.waktuSebelum}h)
                    </span>
                  </CardDescription>
                </div>
                <Badge variant={route.status === 'Aktif' ? 'default' : 'secondary'}>{route.status}</Badge>
              </div>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Biaya Sebelum</p>
                <p className="font-semibold">Rp {(route.biayaSebelum / 1000000).toFixed(2)}jt</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Biaya Sesudah</p>
                <p className="font-semibold text-green-600">Rp {(route.biayaSesudah / 1000000).toFixed(2)}jt</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Penghematan</p>
                <p className="font-bold text-green-700">Rp {(route.penghematan / 1000).toFixed(0)}k</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Efisiensi</p>
                <p className="font-bold text-primary">{route.efisiensi}%</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Perbandingan Biaya Per Jam Keberangkatan</CardTitle>
          <CardDescription>Rute Utama - Sebelum vs Sesudah Optimasi</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={trafficData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="jam" />
              <YAxis />
              <Tooltip formatter={(value) => `Rp ${value.toLocaleString()}`} />
              <Legend />
              <Bar dataKey="biayaSebelum" fill="var(--chart-2)" name="Biaya Sebelum" />
              <Bar dataKey="biayaSesudah" fill="var(--chart-1)" name="Biaya Sesudah" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Titik Pengiriman Rute Utama
            </CardTitle>
            <CardDescription>Urutan optimal untuk mengunjungi pembeli</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {stopPoints.map((point, idx) => (
              <div key={point.nama} className="flex items-center gap-4 pb-3 border-b last:border-b-0">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold text-sm">
                  {point.index}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm">{point.nama}</p>
                  <p className="text-xs text-muted-foreground">{point.status}</p>
                </div>
                <div className="flex items-center gap-1 text-sm font-medium">
                  <Clock className="h-4 w-4" />
                  {point.waktu}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Truck className="h-5 w-5" />
              Rekomendasi Armada
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="font-medium">Gunakan 2 Kendaraan</p>
                  <p className="text-xs text-muted-foreground">Alih-alih 3 kendaraan</p>
                </div>
                <Badge className="bg-green-100 text-green-800">Hemat 1 Unit</Badge>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Penghematan Operasional</span>
                  <span className="font-semibold">Rp 3.5jt/bulan</span>
                </div>
                <div className="flex justify-between">
                  <span>Penghematan BBM</span>
                  <span className="font-semibold">Rp 1.2jt/bulan</span>
                </div>
              </div>
            </div>
            <Button className="w-full">Terapkan Rekomendasi</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
