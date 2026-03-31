'use client'

import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  Clock,
  Leaf,
  MapPin,
  User,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/lib/auth'

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
] as const

const personalSchedule = [
  {
    id: 'PS-001',
    komoditas: 'Padi Premium',
    tanggal: '12 Apr 2026',
    waktu: '07:00 - 09:00',
    lokasi: 'Blok Sawah Timur',
    status: 'Petugas akan datang',
    detail: 'Siapkan gabah di area timbang sebelum pukul 07:00.',
  },
  {
    id: 'PS-002',
    komoditas: 'Jagung Pipil',
    tanggal: '20 Apr 2026',
    waktu: '08:00 - 10:30',
    lokasi: 'Lahan Bukit Barat',
    status: 'Menunggu konfirmasi',
    detail: 'Tim koperasi akan mengunci jadwal setelah cuaca stabil.',
  },
] as const

const today = '2024-02-17'

export default function JadwalPanenPage() {
  const { user } = useAuth()

  if (!user) return null

  const totalEstimasi = jadwalPanen.reduce((acc, item) => {
    return acc + item.items.reduce((sum, detail) => sum + Number.parseInt(detail.estimasi, 10), 0)
  }, 0)

  if (user.role === 'petani') {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Jadwal Panen Saya</h1>
          <p className="text-muted-foreground">
            Lihat kapan koperasi datang menjemput hasil panen Anda dan apa saja yang perlu disiapkan sebelumnya.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Jadwal aktif</CardDescription>
              <CardTitle className="text-3xl">{personalSchedule.length}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Semua untuk lahan Anda</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Panen terdekat</CardDescription>
              <CardTitle className="text-xl">12 Apr 2026</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-primary">Padi premium siap diproses</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Status konfirmasi</CardDescription>
              <CardTitle className="text-xl">1 jadwal final</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">1 jadwal masih menunggu cuaca</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Pengingat</CardDescription>
              <CardTitle className="text-xl">Siapkan area timbang</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Agar proses jemput hasil panen lebih cepat</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.35fr_0.95fr]">
          <div className="space-y-4">
            {personalSchedule.map((item) => (
              <Card key={item.id}>
                <CardHeader className="pb-3">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <CardTitle className="text-lg">{item.komoditas}</CardTitle>
                      <CardDescription>{item.detail}</CardDescription>
                    </div>
                    <Badge variant="outline">{item.status}</Badge>
                  </div>
                </CardHeader>
                <CardContent className="grid gap-3 text-sm sm:grid-cols-3">
                  <div className="rounded-xl bg-secondary/35 p-3">
                    <p className="text-muted-foreground">Tanggal</p>
                    <p className="mt-1 font-semibold">{item.tanggal}</p>
                  </div>
                  <div className="rounded-xl bg-secondary/35 p-3">
                    <p className="text-muted-foreground">Waktu</p>
                    <p className="mt-1 font-semibold">{item.waktu}</p>
                  </div>
                  <div className="rounded-xl bg-secondary/35 p-3">
                    <p className="text-muted-foreground">Lokasi</p>
                    <p className="mt-1 font-semibold">{item.lokasi}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="h-fit border-dashed">
            <CardHeader>
              <CardTitle className="text-base">Checklist Hari Panen</CardTitle>
              <CardDescription>Persiapan singkat agar serah terima hasil panen lancar.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="rounded-xl bg-secondary/35 p-3">
                <p className="font-medium">Pisahkan hasil berdasarkan grade</p>
                <p className="mt-1 text-muted-foreground">Memudahkan penilaian kualitas dan penawaran harga.</p>
              </div>
              <div className="rounded-xl bg-secondary/35 p-3">
                <p className="font-medium">Pastikan timbangan dan karung siap</p>
                <p className="mt-1 text-muted-foreground">Mengurangi waktu tunggu saat petugas datang.</p>
              </div>
              <div className="rounded-xl bg-secondary/35 p-3">
                <p className="font-medium">Buka notifikasi cuaca dan harga</p>
                <p className="mt-1 text-muted-foreground">Berguna jika jadwal perlu diubah atau hasil perlu ditahan dulu.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Jadwal Panen</h1>
        <p className="text-muted-foreground">Timeline panen dari produsen koperasi</p>
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
              {jadwalPanen.reduce((acc, item) => acc + item.items.length, 0)}
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
            <p className="text-xs text-primary">Hasil panen</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Terkonfirmasi</CardDescription>
            <CardTitle className="text-3xl">
              {jadwalPanen.reduce(
                (acc, item) => acc + item.items.filter((detail) => detail.status === 'terkonfirmasi').length,
                0
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Item siap panen</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {jadwalPanen.map((jadwal, index) => {
          const isToday = jadwal.tanggal === today
          const isPast = jadwal.tanggal < today

          return (
            <div key={jadwal.id} className="relative">
              {index < jadwalPanen.length - 1 && (
                <div className="absolute bottom-0 left-[19px] top-12 w-0.5 bg-border" />
              )}

              <div className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                      isToday
                        ? 'border-primary bg-primary text-primary-foreground'
                        : isPast
                        ? 'border-muted bg-muted'
                        : 'border-border bg-background'
                    }`}
                  >
                    <Calendar className="h-5 w-5" />
                  </div>
                </div>

                <div className="flex-1 pb-8">
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold">
                      {jadwal.hari}, {jadwal.tanggal}
                    </h3>
                    {isToday && <Badge className="bg-primary">Hari Ini</Badge>}
                  </div>

                  <Card>
                    <CardContent className="divide-y p-0">
                      {jadwal.items.map((item, itemIndex) => (
                        <div
                          key={itemIndex}
                          className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
                        >
                          <div className="flex items-start gap-4">
                            <div
                              className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                                item.status === 'terkonfirmasi'
                                  ? 'bg-primary/10 text-primary'
                                  : 'bg-amber-500/10 text-amber-600'
                              }`}
                            >
                              <Leaf className="h-5 w-5" />
                            </div>
                            <div>
                              <p className="font-medium">{item.komoditas}</p>
                              <div className="flex flex-col gap-1 text-sm text-muted-foreground sm:flex-row sm:items-center sm:gap-3">
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
                          <div className="text-left sm:text-right">
                            <p className="font-semibold text-primary">{item.estimasi}</p>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground sm:justify-end">
                              <Clock className="h-3 w-3" />
                              {item.waktu}
                              {item.status === 'terkonfirmasi' ? (
                                <CheckCircle2 className="h-4 w-4 text-primary" />
                              ) : (
                                <AlertCircle className="h-4 w-4 text-amber-600" />
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
