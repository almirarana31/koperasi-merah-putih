'use client'

import {
  Calculator,
  Users,
  Wallet,
  PieChart,
  TrendingUp,
  Calendar,
  Download,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { formatCurrency } from '@/lib/data'

const shuData = {
  tahun: 2023,
  totalPendapatan: 850000000,
  totalBiaya: 680000000,
  labaKotor: 170000000,
  cadanganKoperasi: 25500000, // 15%
  danaKaryawan: 17000000, // 10%
  danaPendidikan: 8500000, // 5%
  danaSosial: 8500000, // 5%
  shuAnggota: 110500000, // 65%
}

const pembagianSHU = [
  { nama: 'Pak Slamet Widodo', simpanan: 1700000, transaksi: 45000000, shuSimpanan: 1850000, shuTransaksi: 2800000, totalSHU: 4650000 },
  { nama: 'Bu Sri Wahyuni', simpanan: 1300000, transaksi: 38000000, shuSimpanan: 1415000, shuTransaksi: 2365000, totalSHU: 3780000 },
  { nama: 'Pak Ahmad Sudirman', simpanan: 1100000, transaksi: 28000000, shuSimpanan: 1200000, shuTransaksi: 1740000, totalSHU: 2940000 },
  { nama: 'Bu Ratna Dewi', simpanan: 2000000, transaksi: 52000000, shuSimpanan: 2180000, shuTransaksi: 3235000, totalSHU: 5415000 },
  { nama: 'Pak Budi Santoso', simpanan: 2500000, transaksi: 65000000, shuSimpanan: 2725000, shuTransaksi: 4045000, totalSHU: 6770000 },
]

const alokasi = [
  { nama: 'SHU Anggota', persentase: 65, nilai: shuData.shuAnggota, color: 'bg-emerald-500' },
  { nama: 'Cadangan Koperasi', persentase: 15, nilai: shuData.cadanganKoperasi, color: 'bg-blue-500' },
  { nama: 'Dana Karyawan', persentase: 10, nilai: shuData.danaKaryawan, color: 'bg-amber-500' },
  { nama: 'Dana Pendidikan', persentase: 5, nilai: shuData.danaPendidikan, color: 'bg-violet-500' },
  { nama: 'Dana Sosial', persentase: 5, nilai: shuData.danaSosial, color: 'bg-pink-500' },
]

export default function SHUPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Sisa Hasil Usaha (SHU)</h1>
          <p className="text-muted-foreground">Perhitungan dan pembagian SHU anggota</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1">
            <Calendar className="h-3 w-3" />
            Tahun {shuData.tahun}
          </Badge>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Pendapatan</CardDescription>
            <CardTitle className="text-3xl">{formatCurrency(shuData.totalPendapatan)}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1 text-xs text-emerald-500">
              <TrendingUp className="h-3 w-3" />
              +18% dari tahun lalu
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Biaya</CardDescription>
            <CardTitle className="text-3xl">{formatCurrency(shuData.totalBiaya)}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">80% dari pendapatan</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Laba Kotor (SHU)</CardDescription>
            <CardTitle className="text-3xl text-primary">{formatCurrency(shuData.labaKotor)}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">20% margin</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>SHU per Anggota (Avg)</CardDescription>
            <CardTitle className="text-3xl text-emerald-500">
              {formatCurrency(Math.round(shuData.shuAnggota / pembagianSHU.length))}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Users className="h-3 w-3" />
              {pembagianSHU.length} anggota
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Alokasi SHU
            </CardTitle>
            <CardDescription>Pembagian sesuai AD/ART</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {alokasi.map((item) => (
              <div key={item.nama} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className={`h-3 w-3 rounded-full ${item.color}`} />
                    <span>{item.nama}</span>
                  </div>
                  <span className="font-medium">{item.persentase}%</span>
                </div>
                <Progress value={item.persentase} className="h-2" />
                <p className="text-xs text-muted-foreground text-right">{formatCurrency(item.nilai)}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Pembagian SHU Anggota
            </CardTitle>
            <CardDescription>Berdasarkan simpanan dan partisipasi transaksi</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama Anggota</TableHead>
                  <TableHead className="text-right">Simpanan</TableHead>
                  <TableHead className="text-right">Transaksi</TableHead>
                  <TableHead className="text-right">SHU Simpanan</TableHead>
                  <TableHead className="text-right">SHU Transaksi</TableHead>
                  <TableHead className="text-right">Total SHU</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pembagianSHU.map((anggota) => (
                  <TableRow key={anggota.nama}>
                    <TableCell className="font-medium">{anggota.nama}</TableCell>
                    <TableCell className="text-right">{formatCurrency(anggota.simpanan)}</TableCell>
                    <TableCell className="text-right">{formatCurrency(anggota.transaksi)}</TableCell>
                    <TableCell className="text-right text-blue-500">{formatCurrency(anggota.shuSimpanan)}</TableCell>
                    <TableCell className="text-right text-amber-500">{formatCurrency(anggota.shuTransaksi)}</TableCell>
                    <TableCell className="text-right font-bold text-emerald-500">{formatCurrency(anggota.totalSHU)}</TableCell>
                  </TableRow>
                ))}
                <TableRow className="bg-muted/50">
                  <TableCell className="font-bold">Total</TableCell>
                  <TableCell className="text-right font-bold">
                    {formatCurrency(pembagianSHU.reduce((acc, a) => acc + a.simpanan, 0))}
                  </TableCell>
                  <TableCell className="text-right font-bold">
                    {formatCurrency(pembagianSHU.reduce((acc, a) => acc + a.transaksi, 0))}
                  </TableCell>
                  <TableCell className="text-right font-bold text-blue-500">
                    {formatCurrency(pembagianSHU.reduce((acc, a) => acc + a.shuSimpanan, 0))}
                  </TableCell>
                  <TableCell className="text-right font-bold text-amber-500">
                    {formatCurrency(pembagianSHU.reduce((acc, a) => acc + a.shuTransaksi, 0))}
                  </TableCell>
                  <TableCell className="text-right font-bold text-emerald-500">
                    {formatCurrency(pembagianSHU.reduce((acc, a) => acc + a.totalSHU, 0))}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
