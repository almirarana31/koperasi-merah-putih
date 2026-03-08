'use client'

import {
  Truck,
  MapPin,
  Clock,
  User,
  Phone,
  Package,
  CheckCircle2,
  AlertCircle,
  Plus,
  Calendar,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

const pickupSchedule = [
  {
    id: 'PU001',
    tanggal: '2024-02-17',
    hari: 'Sabtu',
    isToday: true,
    pickups: [
      {
        waktu: '06:00 - 08:00',
        produsen: 'Pak Hendra Wijaya',
        lokasi: 'Cibodas, Lembang',
        komoditas: ['Kentang 400kg', 'Wortel 250kg'],
        driver: 'Pak Joko',
        noHp: '081111222333',
        status: 'sedang_jalan',
      },
      {
        waktu: '09:00 - 11:00',
        produsen: 'Bu Sri Wahyuni',
        lokasi: 'Sukamaju, Cianjur',
        komoditas: ['Cabai Merah 150kg', 'Tomat 200kg'],
        driver: 'Pak Surya',
        noHp: '081222333444',
        status: 'dijadwalkan',
      },
    ],
  },
  {
    id: 'PU002',
    tanggal: '2024-02-18',
    hari: 'Minggu',
    isToday: false,
    pickups: [
      {
        waktu: '05:00 - 07:00',
        produsen: 'Pak Ahmad Sudirman',
        lokasi: 'Pantai Indah, Palabuhanratu',
        komoditas: ['Ikan Tongkol 300kg', 'Udang 100kg'],
        driver: 'Pak Joko',
        noHp: '081111222333',
        status: 'dijadwalkan',
      },
    ],
  },
  {
    id: 'PU003',
    tanggal: '2024-02-19',
    hari: 'Senin',
    isToday: false,
    pickups: [
      {
        waktu: '06:00 - 10:00',
        produsen: 'Pak Slamet Widodo',
        lokasi: 'Sukamaju, Cianjur',
        komoditas: ['Beras Premium 2000kg'],
        driver: 'Pak Budi',
        noHp: '081333444555',
        status: 'dijadwalkan',
      },
    ],
  },
]

const drivers = [
  { nama: 'Pak Joko', kendaraan: 'Truk Box', plat: 'B 1234 XYZ', status: 'aktif', tugas: 2 },
  { nama: 'Pak Surya', kendaraan: 'Pickup', plat: 'B 5678 ABC', status: 'aktif', tugas: 1 },
  { nama: 'Pak Budi', kendaraan: 'Truk Box', plat: 'B 9012 DEF', status: 'standby', tugas: 1 },
]

export default function PickupPage() {
  const todayPickups = pickupSchedule.find(p => p.isToday)?.pickups.length || 0
  const totalPickups = pickupSchedule.reduce((acc, p) => acc + p.pickups.length, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Jadwal Pickup</h1>
          <p className="text-muted-foreground">Jadwal pengambilan dari produsen</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Tambah Jadwal
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Pickup Hari Ini</CardDescription>
            <CardTitle className="text-3xl">{todayPickups}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-primary">1 sedang berjalan</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Minggu Ini</CardDescription>
            <CardTitle className="text-3xl">{totalPickups}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Jadwal pickup</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Driver Aktif</CardDescription>
            <CardTitle className="text-3xl">{drivers.filter(d => d.status === 'aktif').length}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-emerald-500">Sedang bertugas</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Driver Standby</CardDescription>
            <CardTitle className="text-3xl">{drivers.filter(d => d.status === 'standby').length}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Tersedia</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-semibold">Jadwal Pickup</h2>
          {pickupSchedule.map((schedule) => (
            <Card key={schedule.id} className={schedule.isToday ? 'border-primary' : ''}>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <CardTitle className="text-base">
                      {schedule.hari}, {schedule.tanggal}
                    </CardTitle>
                    {schedule.isToday && <Badge>Hari Ini</Badge>}
                  </div>
                  <Badge variant="outline">{schedule.pickups.length} pickup</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {schedule.pickups.map((pickup, idx) => (
                  <div key={idx} className="p-4 rounded-lg bg-muted/50 space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                          pickup.status === 'sedang_jalan' ? 'bg-blue-500/10 text-blue-500' :
                          pickup.status === 'selesai' ? 'bg-emerald-500/10 text-emerald-500' :
                          'bg-muted text-muted-foreground'
                        }`}>
                          <Truck className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="font-medium">{pickup.produsen}</p>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            {pickup.lokasi}
                          </div>
                        </div>
                      </div>
                      <Badge variant={
                        pickup.status === 'sedang_jalan' ? 'default' :
                        pickup.status === 'selesai' ? 'default' : 'secondary'
                      } className={
                        pickup.status === 'sedang_jalan' ? 'bg-blue-500' :
                        pickup.status === 'selesai' ? 'bg-emerald-500' : ''
                      }>
                        {pickup.status === 'sedang_jalan' ? 'Sedang Jalan' :
                         pickup.status === 'selesai' ? 'Selesai' : 'Dijadwalkan'}
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Waktu</p>
                        <p className="font-medium flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {pickup.waktu}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Driver</p>
                        <p className="font-medium flex items-center gap-1">
                          <User className="h-3 w-3" />
                          {pickup.driver}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {pickup.komoditas.map((k, kIdx) => (
                        <Badge key={kIdx} variant="outline" className="text-xs">
                          <Package className="mr-1 h-3 w-3" />
                          {k}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Status Driver</h2>
          {drivers.map((driver, idx) => (
            <Card key={idx}>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback className={driver.status === 'aktif' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-muted'}>
                      {driver.nama.split(' ')[1]?.[0] || driver.nama[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-medium">{driver.nama}</p>
                    <p className="text-sm text-muted-foreground">{driver.kendaraan} - {driver.plat}</p>
                  </div>
                  <div className="text-right">
                    <Badge variant={driver.status === 'aktif' ? 'default' : 'secondary'} className={driver.status === 'aktif' ? 'bg-emerald-500/10 text-emerald-500' : ''}>
                      {driver.status === 'aktif' ? 'Aktif' : 'Standby'}
                    </Badge>
                    <p className="text-xs text-muted-foreground mt-1">{driver.tugas} tugas</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
