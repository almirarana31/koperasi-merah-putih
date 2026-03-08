'use client'

import {
  MapPin,
  Navigation,
  Clock,
  Truck,
  ArrowRight,
  Plus,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const ruteData = [
  {
    id: 'RT001',
    nama: 'Rute Cianjur - Jakarta',
    jarak: '120 km',
    estimasiWaktu: '3-4 jam',
    titikAwal: 'Gudang Utama, Cianjur',
    titikAkhir: 'Jakarta Pusat',
    via: ['Tol Cipali', 'Tol Jakarta-Cikampek'],
    frekuensi: '3x/minggu',
    status: 'aktif',
    stops: [
      { nama: 'Gudang Utama', tipe: 'origin', alamat: 'Jl. Industri No. 1, Cianjur' },
      { nama: 'Tol Cipali Gate', tipe: 'checkpoint', alamat: 'Pintu Tol Cipali' },
      { nama: 'Rest Area KM 57', tipe: 'rest', alamat: 'Rest Area Cipali' },
      { nama: 'Tol Cikampek Gate', tipe: 'checkpoint', alamat: 'Pintu Tol Cikampek' },
      { nama: 'Gudang Transit Jakarta', tipe: 'destination', alamat: 'Jl. Pelabuhan No. 5' },
    ],
  },
  {
    id: 'RT002',
    nama: 'Rute Lembang - Cianjur',
    jarak: '45 km',
    estimasiWaktu: '1.5-2 jam',
    titikAwal: 'Cibodas, Lembang',
    titikAkhir: 'Gudang Utama, Cianjur',
    via: ['Jl. Raya Lembang', 'Jl. Raya Cianjur'],
    frekuensi: '2x/minggu',
    status: 'aktif',
    stops: [
      { nama: 'Lokasi Petani Lembang', tipe: 'origin', alamat: 'Cibodas, Lembang' },
      { nama: 'Pasar Lembang', tipe: 'pickup', alamat: 'Pasar Lembang' },
      { nama: 'Gudang Utama', tipe: 'destination', alamat: 'Jl. Industri No. 1, Cianjur' },
    ],
  },
  {
    id: 'RT003',
    nama: 'Rute Palabuhanratu - Cianjur',
    jarak: '80 km',
    estimasiWaktu: '2-3 jam',
    titikAwal: 'Pantai Indah, Palabuhanratu',
    titikAkhir: 'Cold Storage, Cianjur',
    via: ['Jl. Raya Sukabumi', 'Jl. Raya Cianjur'],
    frekuensi: '2x/minggu',
    status: 'aktif',
    stops: [
      { nama: 'TPI Palabuhanratu', tipe: 'origin', alamat: 'Tempat Pelelangan Ikan' },
      { nama: 'Checkpoint Sukabumi', tipe: 'checkpoint', alamat: 'Pos Polisi Sukabumi' },
      { nama: 'Cold Storage', tipe: 'destination', alamat: 'Jl. Industri No. 2, Cianjur' },
    ],
  },
]

export default function RutePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Rute Pengiriman</h1>
          <p className="text-muted-foreground">Manajemen rute logistik</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Tambah Rute
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Rute Aktif</CardDescription>
            <CardTitle className="text-3xl">{ruteData.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-emerald-500">Semua aktif</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Jarak</CardDescription>
            <CardTitle className="text-3xl">245 km</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Total jarak rute</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Pengiriman/Minggu</CardDescription>
            <CardTitle className="text-3xl">7</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Rata-rata trip</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {ruteData.map((rute) => (
          <Card key={rute.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <Navigation className="h-5 w-5 text-primary" />
                    <CardTitle className="text-lg">{rute.nama}</CardTitle>
                    <Badge variant="default" className="bg-emerald-500/10 text-emerald-500">
                      {rute.status}
                    </Badge>
                  </div>
                  <CardDescription className="mt-1">
                    {rute.titikAwal} → {rute.titikAkhir}
                  </CardDescription>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Frekuensi</p>
                  <p className="font-semibold">{rute.frekuensi}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-muted-foreground">Jarak</p>
                    <p className="font-semibold">{rute.jarak}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-muted-foreground">Estimasi</p>
                    <p className="font-semibold">{rute.estimasiWaktu}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Truck className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-muted-foreground">Via</p>
                    <p className="font-semibold text-xs">{rute.via.join(', ')}</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm font-medium mb-3">Titik Perjalanan</p>
                <div className="flex items-center gap-2 flex-wrap">
                  {rute.stops.map((stop, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm ${
                        stop.tipe === 'origin' ? 'bg-emerald-500/10 text-emerald-500' :
                        stop.tipe === 'destination' ? 'bg-blue-500/10 text-blue-500' :
                        stop.tipe === 'pickup' ? 'bg-amber-500/10 text-amber-500' :
                        'bg-muted'
                      }`}>
                        <MapPin className="h-3 w-3" />
                        <span>{stop.nama}</span>
                      </div>
                      {idx < rute.stops.length - 1 && (
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm">Lihat Peta</Button>
                <Button variant="outline" size="sm">Edit Rute</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
