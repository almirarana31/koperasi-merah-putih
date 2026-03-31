'use client'

import { useState } from 'react'
import { Package, Plus, Search, Sprout, TrendingUp } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useAuth } from '@/lib/auth'
import { commodities, formatCurrency } from '@/lib/data'

const categoryLabels: Record<string, string> = {
  pangan: 'Pangan',
  hortikultura: 'Hortikultura',
  perkebunan: 'Perkebunan',
  peternakan: 'Peternakan',
  perikanan: 'Perikanan',
}

const categoryColors: Record<string, string> = {
  pangan: 'bg-primary/10 text-primary',
  hortikultura: 'bg-amber-500/10 text-amber-600',
  perkebunan: 'bg-stone-200 text-stone-700',
  peternakan: 'bg-secondary text-secondary-foreground',
  perikanan: 'bg-sky-100 text-sky-700',
}

const personalCommodityWatch = [
  {
    nama: 'Padi Premium',
    fokus: 'Komoditas utama Anda',
    harga: 'Rp14.500/kg',
    insight: 'Permintaan stabil, cocok untuk penjualan bertahap minggu ini.',
  },
  {
    nama: 'Jagung Pipil',
    fokus: 'Cadangan panen berikutnya',
    harga: 'Rp5.900/kg',
    insight: 'Tren naik tipis, pantau lagi 2-3 hari sebelum lepas stok.',
  },
  {
    nama: 'Gabah Kering',
    fokus: 'Alternatif penjualan cepat',
    harga: 'Rp6.700/kg',
    insight: 'Harga aman untuk cashflow cepat bila perlu modal musim berikutnya.',
  },
] as const

export default function KomoditasPage() {
  const { user } = useAuth()
  const [search, setSearch] = useState('')
  const [filterCategory, setFilterCategory] = useState<string>('all')

  if (!user) return null

  const filteredCommodities = commodities.filter((commodity) => {
    const matchesSearch = commodity.nama.toLowerCase().includes(search.toLowerCase())
    const matchesCategory =
      filterCategory === 'all' || commodity.kategori === filterCategory
    return matchesSearch && matchesCategory
  })

  const totalStock = commodities.reduce((sum, item) => sum + item.stokTotal, 0)
  const totalValue = commodities.reduce(
    (sum, item) => sum + item.stokTotal * item.hargaAcuan,
    0
  )
  const isAggregateViewer = user.role === 'pemda' || user.role === 'kementerian'

  if (user.role === 'petani') {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Komoditas Saya</h1>
          <p className="text-muted-foreground">
            Fokus pada komoditas yang relevan dengan usaha tani Anda, lengkap dengan harga acuan dan arahan penjualan.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Komoditas dipantau</p>
              <p className="mt-2 text-3xl font-bold">{personalCommodityWatch.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Harga terbaik hari ini</p>
              <p className="mt-2 text-2xl font-bold">Rp14.500/kg</p>
              <p className="mt-1 text-xs text-primary">Padi premium</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Komoditas prioritas</p>
              <p className="mt-2 text-2xl font-bold">Jagung Pipil</p>
              <p className="mt-1 text-xs text-muted-foreground">Naik tipis dan stabil</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">Saran minggu ini</p>
              <p className="mt-2 text-base font-semibold">Tahan gabah 2 hari</p>
              <p className="mt-1 text-xs text-muted-foreground">Menunggu harga lebih baik</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.35fr_0.95fr]">
          <div className="space-y-4">
            {personalCommodityWatch.map((item) => (
              <Card key={item.nama}>
                <CardHeader className="pb-3">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <CardTitle className="text-lg">{item.nama}</CardTitle>
                      <CardDescription>{item.fokus}</CardDescription>
                    </div>
                    <Badge className="bg-primary/10 text-primary">{item.harga}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{item.insight}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="h-fit border-dashed">
            <CardHeader>
              <CardTitle className="text-base">Cara Memakai Data Komoditas</CardTitle>
              <CardDescription>Ringkas dan langsung relevan untuk petani anggota.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="rounded-xl bg-secondary/35 p-3">
                <p className="font-medium">Bandingkan harga sebelum melepas hasil panen</p>
                <p className="mt-1 text-muted-foreground">Harga acuan membantu menentukan kapan jual lewat koperasi.</p>
              </div>
              <div className="rounded-xl bg-secondary/35 p-3">
                <p className="font-medium">Pantau komoditas pengganti untuk musim berikutnya</p>
                <p className="mt-1 text-muted-foreground">Berguna jika satu komoditas sedang lesu tetapi alternatif naik.</p>
              </div>
              <div className="rounded-xl bg-secondary/35 p-3">
                <p className="font-medium">Gabungkan dengan rekomendasi AI harga</p>
                <p className="mt-1 text-muted-foreground">Supaya keputusan jual tidak hanya berdasarkan feeling.</p>
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
          <h1 className="text-2xl font-bold tracking-tight">
            {isAggregateViewer ? 'Ringkasan Komoditas' : 'Daftar Komoditas'}
          </h1>
          <p className="text-muted-foreground">
            {isAggregateViewer
              ? 'Tampilan baca-saja untuk memantau komoditas lintas koperasi tanpa mengubah master data.'
              : 'Kelola master data komoditas dan stok acuan koperasi.'}
          </p>
        </div>
        {!isAggregateViewer && (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Tambah Komoditas
          </Button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Package className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{commodities.length}</p>
                <p className="text-xs text-muted-foreground">Jenis Komoditas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{(totalStock / 1000).toFixed(1)} ton</p>
                <p className="text-xs text-muted-foreground">Total Stok</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                <Sprout className="h-5 w-5 text-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold">{formatCurrency(totalValue)}</p>
                <p className="text-xs text-muted-foreground">Estimasi Nilai</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Cari komoditas..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kategori</SelectItem>
                <SelectItem value="pangan">Pangan</SelectItem>
                <SelectItem value="hortikultura">Hortikultura</SelectItem>
                <SelectItem value="perkebunan">Perkebunan</SelectItem>
                <SelectItem value="peternakan">Peternakan</SelectItem>
                <SelectItem value="perikanan">Perikanan</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{isAggregateViewer ? 'Monitoring Komoditas' : 'Master Komoditas'}</CardTitle>
          <CardDescription>
            {filteredCommodities.length} komoditas tersedia dalam tampilan ini.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Nama Komoditas</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Satuan</TableHead>
                  <TableHead>Harga Acuan</TableHead>
                  <TableHead>Stok Total</TableHead>
                  <TableHead>Nilai Stok</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCommodities.map((commodity) => (
                  <TableRow key={commodity.id}>
                    <TableCell className="font-mono text-sm">{commodity.id}</TableCell>
                    <TableCell className="font-medium">{commodity.nama}</TableCell>
                    <TableCell>
                      <Badge className={categoryColors[commodity.kategori]}>
                        {categoryLabels[commodity.kategori]}
                      </Badge>
                    </TableCell>
                    <TableCell>{commodity.satuan}</TableCell>
                    <TableCell>{formatCurrency(commodity.hargaAcuan)}</TableCell>
                    <TableCell>
                      {commodity.stokTotal.toLocaleString()} {commodity.satuan}
                    </TableCell>
                    <TableCell className="font-medium">
                      {formatCurrency(commodity.stokTotal * commodity.hargaAcuan)}
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
