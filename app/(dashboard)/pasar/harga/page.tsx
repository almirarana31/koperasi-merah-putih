'use client'

import {
  ArrowDownRight,
  ArrowUpRight,
  Calendar,
  Minus,
  RefreshCw,
  TrendingDown,
  TrendingUp,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useAuth } from '@/lib/auth'
import { commodities, formatCurrency } from '@/lib/data'

const hargaPasar = commodities.map((commodity) => {
  const change = (Math.random() - 0.5) * 20
  return {
    ...commodity,
    hargaKemarin: commodity.hargaAcuan - commodity.hargaAcuan * (change / 100),
    perubahan: change,
    hargaMingguan: commodity.hargaAcuan * (0.95 + Math.random() * 0.1),
    hargaBulanan: commodity.hargaAcuan * (0.9 + Math.random() * 0.2),
  }
})

export default function HargaPasarPage() {
  const { user } = useAuth()

  if (!user) return null

  const naik = hargaPasar.filter((item) => item.perubahan > 0).length
  const turun = hargaPasar.filter((item) => item.perubahan < 0).length
  const stabil = hargaPasar.filter((item) => Math.abs(item.perubahan) < 1).length
  const strongestRise = [...hargaPasar].sort((a, b) => b.perubahan - a.perubahan)[0]
  const sharpestDrop = [...hargaPasar].sort((a, b) => a.perubahan - b.perubahan)[0]

  if (user.role === 'petani') {
    return (
      <div className="space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Harga Pasar untuk Petani</h1>
            <p className="text-muted-foreground">
              Lihat komoditas mana yang sedang menguat, mana yang sebaiknya ditahan dulu, dan gunakan data ini sebelum menjual hasil panen.
            </p>
          </div>
          <Badge variant="outline" className="gap-1 self-start">
            <Calendar className="h-3 w-3" />
            Update: 31 Mar 2026, 08:00
          </Badge>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Komoditas naik</CardDescription>
              <CardTitle className="text-3xl text-primary">{naik}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Peluang jual lebih baik</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Kenaikan terbaik</CardDescription>
              <CardTitle className="text-xl">{strongestRise.nama}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-primary">Naik {strongestRise.perubahan.toFixed(1)}%</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Penurunan terdalam</CardDescription>
              <CardTitle className="text-xl">{sharpestDrop.nama}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-destructive">{sharpestDrop.perubahan.toFixed(1)}%</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Saran cepat</CardDescription>
              <CardTitle className="text-xl">Bandingkan 3 hari</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground">Jangan hanya lihat perubahan harian</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.35fr_0.95fr]">
          <div className="grid gap-4">
            {hargaPasar
              .filter((item) => ['pangan', 'hortikultura'].includes(item.kategori))
              .slice(0, 5)
              .map((item) => (
                <Card key={item.id}>
                  <CardHeader className="pb-3">
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <CardTitle className="text-lg">{item.nama}</CardTitle>
                        <CardDescription>{formatCurrency(item.hargaAcuan)}/{item.satuan}</CardDescription>
                      </div>
                      <Badge className={item.perubahan > 0 ? 'bg-primary/10 text-primary' : item.perubahan < 0 ? 'bg-destructive/10 text-destructive' : 'bg-secondary text-secondary-foreground'}>
                        {item.perubahan > 0 ? '+' : ''}
                        {item.perubahan.toFixed(1)}%
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="grid gap-3 text-sm sm:grid-cols-3">
                    <div className="rounded-xl bg-secondary/35 p-3">
                      <p className="text-muted-foreground">Hari ini</p>
                      <p className="mt-1 font-semibold">{formatCurrency(item.hargaAcuan)}</p>
                    </div>
                    <div className="rounded-xl bg-secondary/35 p-3">
                      <p className="text-muted-foreground">Rata-rata mingguan</p>
                      <p className="mt-1 font-semibold">{formatCurrency(Math.round(item.hargaMingguan))}</p>
                    </div>
                    <div className="rounded-xl bg-secondary/35 p-3">
                      <p className="text-muted-foreground">Rata-rata bulanan</p>
                      <p className="mt-1 font-semibold">{formatCurrency(Math.round(item.hargaBulanan))}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>

          <Card className="h-fit border-dashed">
            <CardHeader>
              <CardTitle className="text-base">Cara Membaca Harga</CardTitle>
              <CardDescription>Supaya keputusan jual lebih aman.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="rounded-xl bg-secondary/35 p-3">
                <p className="font-medium">Lihat tren mingguan, bukan hanya hari ini</p>
                <p className="mt-1 text-muted-foreground">Pergerakan harian bisa terlalu sensitif untuk jadi satu-satunya acuan.</p>
              </div>
              <div className="rounded-xl bg-secondary/35 p-3">
                <p className="font-medium">Gabungkan dengan kualitas hasil panen</p>
                <p className="mt-1 text-muted-foreground">Harga bagus akan lebih optimal jika grade panen juga tinggi.</p>
              </div>
              <div className="rounded-xl bg-secondary/35 p-3">
                <p className="font-medium">Gunakan AI jika ragu kapan menjual</p>
                <p className="mt-1 text-muted-foreground">Rekomendasi AI membantu membaca pola harga yang tidak terlihat langsung.</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Harga Pasar</h1>
          <p className="text-muted-foreground">Monitoring harga komoditas real-time</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline" className="gap-1">
            <Calendar className="h-3 w-3" />
            Update: 31 Mar 2026, 08:00
          </Badge>
          <Button variant="outline" size="sm">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Komoditas</CardDescription>
            <CardTitle className="text-3xl">{hargaPasar.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Dipantau</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Harga Naik</CardDescription>
            <CardTitle className="text-3xl text-primary">{naik}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1 text-xs text-primary">
              <TrendingUp className="h-3 w-3" />
              Komoditas
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Harga Turun</CardDescription>
            <CardTitle className="text-3xl text-destructive">{turun}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1 text-xs text-destructive">
              <TrendingDown className="h-3 w-3" />
              Komoditas
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Stabil</CardDescription>
            <CardTitle className="text-3xl">{stabil}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Minus className="h-3 w-3" />
              Perubahan minimal
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Harga Komoditas</CardTitle>
          <CardDescription>Perbandingan harga harian, mingguan, dan bulanan</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Komoditas</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead className="text-right">Harga Saat Ini</TableHead>
                  <TableHead className="text-right">Perubahan Harian</TableHead>
                  <TableHead className="text-right">Rata-rata Mingguan</TableHead>
                  <TableHead className="text-right">Rata-rata Bulanan</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {hargaPasar.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.nama}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {item.kategori}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {formatCurrency(item.hargaAcuan)}/{item.satuan}
                    </TableCell>
                    <TableCell className="text-right">
                      <div
                        className={`flex items-center justify-end gap-1 ${
                          item.perubahan > 0
                            ? 'text-primary'
                            : item.perubahan < 0
                            ? 'text-destructive'
                            : 'text-muted-foreground'
                        }`}
                      >
                        {item.perubahan > 0 ? (
                          <ArrowUpRight className="h-4 w-4" />
                        ) : item.perubahan < 0 ? (
                          <ArrowDownRight className="h-4 w-4" />
                        ) : (
                          <Minus className="h-4 w-4" />
                        )}
                        <span className="font-medium">
                          {item.perubahan > 0 ? '+' : ''}
                          {item.perubahan.toFixed(1)}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {formatCurrency(Math.round(item.hargaMingguan))}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {formatCurrency(Math.round(item.hargaBulanan))}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
