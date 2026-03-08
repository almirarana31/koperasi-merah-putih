'use client'

import {
  ArrowDownLeft,
  ArrowUpRight,
  CreditCard,
  Building,
  Banknote,
  CheckCircle2,
  Clock,
  Plus,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { formatCurrency, formatDate } from '@/lib/data'

const pembayaranMasuk = [
  {
    id: 'PM001',
    tanggal: '2024-02-10',
    dari: 'Hotel Grand Hyatt',
    invoice: 'INV/2024/02/001',
    metode: 'Transfer Bank',
    bank: 'BCA',
    jumlah: 9250000,
    status: 'verified',
  },
  {
    id: 'PM002',
    tanggal: '2024-02-14',
    dari: 'Restoran Padang Sederhana',
    invoice: 'INV/2024/01/012',
    metode: 'Transfer Bank',
    bank: 'Mandiri',
    jumlah: 4500000,
    status: 'verified',
  },
  {
    id: 'PM003',
    tanggal: '2024-02-16',
    dari: 'PT Indofood',
    invoice: 'INV/2024/01/015',
    metode: 'Transfer Bank',
    bank: 'BCA',
    jumlah: 11000000,
    status: 'pending',
  },
]

const pembayaranKeluar = [
  {
    id: 'PK001',
    tanggal: '2024-02-02',
    kepada: 'Bu Sri Wahyuni',
    tipe: 'Pembelian Komoditas',
    deskripsi: 'Pembelian cabai merah 150kg',
    metode: 'Transfer Bank',
    jumlah: 6750000,
    status: 'completed',
  },
  {
    id: 'PK002',
    tanggal: '2024-02-05',
    kepada: 'Pak Joko (Driver)',
    tipe: 'Biaya Operasional',
    deskripsi: 'Biaya BBM & tol Jakarta',
    metode: 'Cash',
    jumlah: 500000,
    status: 'completed',
  },
  {
    id: 'PK003',
    tanggal: '2024-02-10',
    kepada: 'Pak Slamet Widodo',
    tipe: 'Pencairan Pinjaman',
    deskripsi: 'Pinjaman modal usaha',
    metode: 'Transfer Bank',
    jumlah: 10000000,
    status: 'completed',
  },
  {
    id: 'PK004',
    tanggal: '2024-02-15',
    kepada: 'PLN',
    tipe: 'Utilitas',
    deskripsi: 'Tagihan listrik gudang',
    metode: 'Virtual Account',
    jumlah: 2500000,
    status: 'pending',
  },
]

export default function PembayaranPage() {
  const totalMasuk = pembayaranMasuk.reduce((acc, p) => acc + p.jumlah, 0)
  const totalKeluar = pembayaranKeluar.reduce((acc, p) => acc + p.jumlah, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Pembayaran</h1>
          <p className="text-muted-foreground">Transaksi pembayaran masuk dan keluar</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Catat Pembayaran
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Masuk Bulan Ini</CardDescription>
            <CardTitle className="text-3xl text-emerald-500">{formatCurrency(totalMasuk)}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1 text-xs text-emerald-500">
              <ArrowDownLeft className="h-3 w-3" />
              {pembayaranMasuk.length} transaksi
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Keluar Bulan Ini</CardDescription>
            <CardTitle className="text-3xl text-destructive">{formatCurrency(totalKeluar)}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1 text-xs text-destructive">
              <ArrowUpRight className="h-3 w-3" />
              {pembayaranKeluar.length} transaksi
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Pending Verifikasi</CardDescription>
            <CardTitle className="text-3xl text-amber-500">
              {pembayaranMasuk.filter(p => p.status === 'pending').length}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1 text-xs text-amber-500">
              <Clock className="h-3 w-3" />
              Perlu konfirmasi
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Net Cashflow</CardDescription>
            <CardTitle className={`text-3xl ${totalMasuk - totalKeluar >= 0 ? 'text-emerald-500' : 'text-destructive'}`}>
              {formatCurrency(totalMasuk - totalKeluar)}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Bulan ini</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="masuk">
        <TabsList>
          <TabsTrigger value="masuk" className="gap-2">
            <ArrowDownLeft className="h-4 w-4" />
            Pembayaran Masuk
          </TabsTrigger>
          <TabsTrigger value="keluar" className="gap-2">
            <ArrowUpRight className="h-4 w-4" />
            Pembayaran Keluar
          </TabsTrigger>
        </TabsList>

        <TabsContent value="masuk" className="space-y-4 mt-4">
          {pembayaranMasuk.map((payment) => (
            <Card key={payment.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
                      <ArrowDownLeft className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-medium">{payment.dari}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Badge variant="outline">{payment.invoice}</Badge>
                        <span>{formatDate(payment.tanggal)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-xl font-bold text-emerald-500">+{formatCurrency(payment.jumlah)}</p>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Building className="h-3 w-3" />
                        {payment.metode} ({payment.bank})
                      </div>
                    </div>
                    <Badge variant={payment.status === 'verified' ? 'default' : 'secondary'} className={payment.status === 'verified' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}>
                      {payment.status === 'verified' ? (
                        <><CheckCircle2 className="mr-1 h-3 w-3" />Verified</>
                      ) : (
                        <><Clock className="mr-1 h-3 w-3" />Pending</>
                      )}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="keluar" className="space-y-4 mt-4">
          {pembayaranKeluar.map((payment) => (
            <Card key={payment.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
                      <ArrowUpRight className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-medium">{payment.kepada}</p>
                      <p className="text-sm text-muted-foreground">{payment.deskripsi}</p>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                        <Badge variant="outline" className="text-xs">{payment.tipe}</Badge>
                        <span>{formatDate(payment.tanggal)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-xl font-bold text-destructive">-{formatCurrency(payment.jumlah)}</p>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        {payment.metode === 'Cash' ? <Banknote className="h-3 w-3" /> : <CreditCard className="h-3 w-3" />}
                        {payment.metode}
                      </div>
                    </div>
                    <Badge variant={payment.status === 'completed' ? 'default' : 'secondary'} className={payment.status === 'completed' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'}>
                      {payment.status === 'completed' ? 'Selesai' : 'Pending'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
