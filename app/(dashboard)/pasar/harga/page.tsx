'use client'

import {
  TrendingUp,
  TrendingDown,
  Minus,
  RefreshCw,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
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
import { commodities, formatCurrency } from '@/lib/data'

const hargaPasar = commodities.map(c => {
  const change = (Math.random() - 0.5) * 20
  return {
    ...c,
    hargaKemarin: c.hargaAcuan - (c.hargaAcuan * (change / 100)),
    perubahan: change,
    hargaMingguan: c.hargaAcuan * (0.95 + Math.random() * 0.1),
    hargaBulanan: c.hargaAcuan * (0.9 + Math.random() * 0.2),
  }
})

export default function HargaPasarPage() {
  const naik = hargaPasar.filter(h => h.perubahan > 0).length
  const turun = hargaPasar.filter(h => h.perubahan < 0).length
  const stabil = hargaPasar.filter(h => Math.abs(h.perubahan) < 1).length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Harga Pasar</h1>
          <p className="text-muted-foreground">Monitoring harga komoditas real-time</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gap-1">
            <Calendar className="h-3 w-3" />
            Update: 17 Feb 2024, 08:00
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
            <CardTitle className="text-3xl text-emerald-500">{naik}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1 text-xs text-emerald-500">
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
                    <Badge variant="outline" className="capitalize">{item.kategori}</Badge>
                  </TableCell>
                  <TableCell className="text-right font-semibold">
                    {formatCurrency(item.hargaAcuan)}/{item.satuan}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className={`flex items-center justify-end gap-1 ${
                      item.perubahan > 0 ? 'text-emerald-500' : 
                      item.perubahan < 0 ? 'text-destructive' : 
                      'text-muted-foreground'
                    }`}>
                      {item.perubahan > 0 ? (
                        <ArrowUpRight className="h-4 w-4" />
                      ) : item.perubahan < 0 ? (
                        <ArrowDownRight className="h-4 w-4" />
                      ) : (
                        <Minus className="h-4 w-4" />
                      )}
                      <span className="font-medium">
                        {item.perubahan > 0 ? '+' : ''}{item.perubahan.toFixed(1)}%
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
        </CardContent>
      </Card>
    </div>
  )
}
