'use client'

import {
  Truck,
  Wrench,
  Fuel,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Settings,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'

const armadaData = [
  {
    id: 'ARM001',
    nama: 'Truk Box 1',
    tipe: 'Truk Box',
    platNomor: 'B 1234 XYZ',
    kapasitas: '5 ton',
    tahun: 2021,
    driver: 'Pak Joko',
    status: 'operasional',
    kondisi: 85,
    km: 45000,
    serviceBerikutnya: '2024-03-15',
    fuelEfficiency: '8 km/liter',
    lastTrip: '2024-02-16',
  },
  {
    id: 'ARM002',
    nama: 'Pickup 1',
    tipe: 'Pickup',
    platNomor: 'B 5678 ABC',
    kapasitas: '1.5 ton',
    tahun: 2022,
    driver: 'Pak Surya',
    status: 'operasional',
    kondisi: 92,
    km: 28000,
    serviceBerikutnya: '2024-04-01',
    fuelEfficiency: '12 km/liter',
    lastTrip: '2024-02-15',
  },
  {
    id: 'ARM003',
    nama: 'Truk Box 2',
    tipe: 'Truk Box',
    platNomor: 'B 9012 DEF',
    kapasitas: '5 ton',
    tahun: 2020,
    driver: 'Pak Budi',
    status: 'service',
    kondisi: 70,
    km: 62000,
    serviceBerikutnya: '2024-02-20',
    fuelEfficiency: '7.5 km/liter',
    lastTrip: '2024-02-10',
  },
  {
    id: 'ARM004',
    nama: 'Refrigerated Truck',
    tipe: 'Truk Berpendingin',
    platNomor: 'B 3456 GHI',
    kapasitas: '3 ton',
    tahun: 2023,
    driver: 'Pak Doni',
    status: 'operasional',
    kondisi: 98,
    km: 12000,
    serviceBerikutnya: '2024-05-01',
    fuelEfficiency: '6 km/liter',
    lastTrip: '2024-02-16',
  },
]

export default function ArmadaPage() {
  const operasional = armadaData.filter(a => a.status === 'operasional').length
  const service = armadaData.filter(a => a.status === 'service').length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold ">Armada</h1>
          <p className="text-muted-foreground">Manajemen kendaraan logistik</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Tambah Kendaraan
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Armada</CardDescription>
            <CardTitle className="text-3xl">{armadaData.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Unit kendaraan</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Operasional</CardDescription>
            <CardTitle className="text-3xl text-emerald-500">{operasional}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1 text-xs text-emerald-500">
              <CheckCircle2 className="h-3 w-3" />
              Siap beroperasi
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Dalam Service</CardDescription>
            <CardTitle className="text-3xl text-amber-500">{service}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1 text-xs text-amber-500">
              <Wrench className="h-3 w-3" />
              Sedang diperbaiki
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Kapasitas</CardDescription>
            <CardTitle className="text-3xl">14.5 ton</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Kapasitas angkut</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {armadaData.map((armada) => (
          <Card key={armada.id} className={armada.status === 'service' ? 'border-amber-500/50' : ''}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className={`flex h-14 w-14 items-center justify-center rounded-lg ${
                    armada.status === 'operasional' ? 'bg-emerald-500/10 text-emerald-500' :
                    'bg-amber-500/10 text-amber-500'
                  }`}>
                    <Truck className="h-7 w-7" />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{armada.nama}</CardTitle>
                    <CardDescription>{armada.platNomor} | {armada.tipe}</CardDescription>
                  </div>
                </div>
                <Badge variant={armada.status === 'operasional' ? 'default' : 'secondary'} className={
                  armada.status === 'operasional' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                }>
                  {armada.status === 'operasional' ? 'Operasional' : 'Service'}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Kapasitas</p>
                  <p className="font-semibold">{armada.kapasitas}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Driver</p>
                  <p className="font-semibold">{armada.driver}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Tahun</p>
                  <p className="font-semibold">{armada.tahun}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Kilometer</p>
                  <p className="font-semibold">{armada.km.toLocaleString()} km</p>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="text-muted-foreground">Kondisi Kendaraan</span>
                  <span className={`font-semibold ${
                    armada.kondisi >= 90 ? 'text-emerald-500' :
                    armada.kondisi >= 70 ? 'text-amber-500' :
                    'text-destructive'
                  }`}>{armada.kondisi}%</span>
                </div>
                <Progress value={armada.kondisi} className="h-2" />
              </div>

              <div className="flex items-center justify-between text-sm pt-2 border-t">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Fuel className="h-4 w-4" />
                    {armada.fuelEfficiency}
                  </div>
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    Service: {armada.serviceBerikutnya}
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <Settings className="mr-2 h-4 w-4" />
                  Detail
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
