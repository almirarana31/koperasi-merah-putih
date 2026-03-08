'use client'

import {
  Calendar,
  Leaf,
  MapPin,
  User,
  Clock,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

const jadwalPanen = [
  {
    id: 'JP001',
    tanggal: '2024-02-18',
    hari: 'Minggu',
    items: [
      {
        komoditas: 'Kentang',
        produsen: 'Pak Hendra Wijaya',
        lokasi: 'Cibodas, Lembang',
        estimasi: '400 kg',
        waktu: '06:00 - 10:00',
        status: 'terkonfirmasi',
      },
      {
        komoditas: 'Wortel',
        produsen: 'Pak Hendra Wijaya',
        lokasi: 'Cibodas, Lembang',
        estimasi: '250 kg',
        waktu: '06:00 - 10:00',
        status: 'terkonfirmasi',
      },
    ],
  },
  {
    id: 'JP002',
    tanggal: '2024-02-20',
    hari: 'Selasa',
    items: [
      {
        komoditas: 'Cabai Merah',
        produsen: 'Bu Sri Wahyuni',
        lokasi: 'Sukamaju, Cianjur',
        estimasi: '150 kg',
        waktu: '07:00 - 09:00',
        status: 'terkonfirmasi',
      },
      {
        komoditas: 'Tomat',
        produsen: 'Bu Sri Wahyuni',
        lokasi: 'Sukamaju, Cianjur',
        estimasi: '200 kg',
        waktu: '07:00 - 09:00',
        status: 'terkonfirmasi',
      },
    ],
  },
  {
    id: 'JP003',
    tanggal: '2024-02-22',
    hari: 'Kamis',
    items: [
      {
        komoditas: 'Beras Premium',
        produsen: 'Pak Slamet Widodo',
        lokasi: 'Sukamaju, Cianjur',
        estimasi: '2000 kg',
        waktu: '06:00 - 12:00',
        status: 'menunggu',
      },
    ],
  },
  {
    id: 'JP004',
    tanggal: '2024-02-25',
    hari: 'Minggu',
    items: [
      {
        komoditas: 'Ikan Tongkol',
        produsen: 'Pak Ahmad Sudirman',
        lokasi: 'Pantai Indah, Palabuhanratu',
        estimasi: '300 kg',
        waktu: '05:00 - 08:00',
        status: 'menunggu',
      },
      {
        komoditas: 'Udang',
        produsen: 'Pak Ahmad Sudirman',
        lokasi: 'Pantai Indah, Palabuhanratu',
        estimasi: '100 kg',
        waktu: '05:00 - 08:00',
        status: 'menunggu',
      },
    ],
  },
]

const today = '2024-02-17'

export default function JadwalPanenPage() {
  const totalEstimasi = jadwalPanen.reduce((acc, j) => {
    return acc + j.items.reduce((sum, i) => sum + parseInt(i.estimasi), 0)
  }, 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Jadwal Panen</h1>
        <p className="text-muted-foreground">Timeline panen dari produsen</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Jadwal Minggu Ini</CardDescription>
            <CardTitle className="text-3xl">{jadwalPanen.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Dari 8 produsen</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Item Panen</CardDescription>
            <CardTitle className="text-3xl">
              {jadwalPanen.reduce((acc, j) => acc + j.items.length, 0)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Komoditas dijadwalkan</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Estimasi Total</CardDescription>
            <CardTitle className="text-3xl">{(totalEstimasi / 1000).toFixed(1)} ton</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-emerald-500">Hasil panen</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Terkonfirmasi</CardDescription>
            <CardTitle className="text-3xl">
              {jadwalPanen.reduce((acc, j) => acc + j.items.filter(i => i.status === 'terkonfirmasi').length, 0)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Item siap panen</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {jadwalPanen.map((jadwal, idx) => {
          const isToday = jadwal.tanggal === today
          const isPast = jadwal.tanggal < today
          
          return (
            <div key={jadwal.id} className="relative">
              {idx < jadwalPanen.length - 1 && (
                <div className="absolute left-[19px] top-12 bottom-0 w-0.5 bg-border" />
              )}
              
              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                    isToday ? 'border-primary bg-primary text-primary-foreground' : 
                    isPast ? 'border-muted bg-muted' : 'border-border bg-background'
                  }`}>
                    <Calendar className="h-5 w-5" />
                  </div>
                </div>
                
                <div className="flex-1 pb-8">
                  <div className="flex items-center gap-2 mb-3">
                    <h3 className="font-semibold">{jadwal.hari}, {jadwal.tanggal}</h3>
                    {isToday && (
                      <Badge className="bg-primary">Hari Ini</Badge>
                    )}
                  </div>
                  
                  <Card>
                    <CardContent className="p-0 divide-y">
                      {jadwal.items.map((item, itemIdx) => (
                        <div key={itemIdx} className="p-4 flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                              item.status === 'terkonfirmasi' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                            }`}>
                              <Leaf className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="font-medium">{item.komoditas}</p>
                              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <User className="h-3 w-3" />
                                  {item.produsen}
                                </span>
                                <span className="flex items-center gap-1">
                                  <MapPin className="h-3 w-3" />
                                  {item.lokasi}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-primary">{item.estimasi}</p>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Clock className="h-3 w-3" />
                              {item.waktu}
                              {item.status === 'terkonfirmasi' ? (
                                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                              ) : (
                                <AlertCircle className="h-4 w-4 text-amber-500" />
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
