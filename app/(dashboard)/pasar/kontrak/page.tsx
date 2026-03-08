'use client'

import {
  FileText,
  Calendar,
  Building,
  Package,
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  Eye,
  Download,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { formatCurrency } from '@/lib/data'

const kontrakData = [
  {
    id: 'KTR001',
    nomorKontrak: 'KTR/2024/001',
    buyer: 'Hotel Grand Hyatt',
    tipeBuyer: 'hotel',
    periode: 'Jan 2024 - Jun 2024',
    mulai: '2024-01-01',
    selesai: '2024-06-30',
    items: [
      { komoditas: 'Beras Premium', kuantitas: 3000, satuan: 'kg/bulan', harga: 14000 },
      { komoditas: 'Cabai Merah', kuantitas: 200, satuan: 'kg/bulan', harga: 45000 },
    ],
    nilaiKontrak: 307200000,
    terpenuhi: 75,
    status: 'aktif',
  },
  {
    id: 'KTR002',
    nomorKontrak: 'KTR/2024/002',
    buyer: 'PT Indofood',
    tipeBuyer: 'fmcg',
    periode: 'Feb 2024 - Jul 2024',
    mulai: '2024-02-01',
    selesai: '2024-07-31',
    items: [
      { komoditas: 'Jagung Pipil', kuantitas: 5000, satuan: 'kg/bulan', harga: 5500 },
    ],
    nilaiKontrak: 165000000,
    terpenuhi: 40,
    status: 'aktif',
  },
  {
    id: 'KTR003',
    nomorKontrak: 'KTR/2024/003',
    buyer: 'Superindo',
    tipeBuyer: 'retail',
    periode: 'Mar 2024 - Aug 2024',
    mulai: '2024-03-01',
    selesai: '2024-08-31',
    items: [
      { komoditas: 'Kentang', kuantitas: 1000, satuan: 'kg/bulan', harga: 15000 },
      { komoditas: 'Wortel', kuantitas: 800, satuan: 'kg/bulan', harga: 10000 },
      { komoditas: 'Bawang Merah', kuantitas: 500, satuan: 'kg/bulan', harga: 35000 },
    ],
    nilaiKontrak: 196500000,
    terpenuhi: 0,
    status: 'pending',
  },
  {
    id: 'KTR004',
    nomorKontrak: 'KTR/2023/015',
    buyer: 'Restoran Padang Sederhana',
    tipeBuyer: 'restoran',
    periode: 'Jul 2023 - Des 2023',
    mulai: '2023-07-01',
    selesai: '2023-12-31',
    items: [
      { komoditas: 'Beras Premium', kuantitas: 500, satuan: 'kg/bulan', harga: 13500 },
    ],
    nilaiKontrak: 40500000,
    terpenuhi: 100,
    status: 'selesai',
  },
]

export default function KontrakPage() {
  const totalNilaiAktif = kontrakData.filter(k => k.status === 'aktif').reduce((acc, k) => acc + k.nilaiKontrak, 0)
  const aktifCount = kontrakData.filter(k => k.status === 'aktif').length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Kontrak</h1>
          <p className="text-muted-foreground">Manajemen kontrak dengan buyer</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Buat Kontrak
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Kontrak Aktif</CardDescription>
            <CardTitle className="text-3xl">{aktifCount}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1 text-xs text-emerald-500">
              <CheckCircle2 className="h-3 w-3" />
              Sedang berjalan
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Nilai Kontrak Aktif</CardDescription>
            <CardTitle className="text-3xl">{formatCurrency(totalNilaiAktif).replace('Rp', 'Rp ')}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Total nilai</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Menunggu Approval</CardDescription>
            <CardTitle className="text-3xl text-amber-500">
              {kontrakData.filter(k => k.status === 'pending').length}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1 text-xs text-amber-500">
              <Clock className="h-3 w-3" />
              Perlu ditinjau
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Selesai Tahun Ini</CardDescription>
            <CardTitle className="text-3xl">8</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Kontrak tuntas</p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        {kontrakData.map((kontrak) => (
          <Card key={kontrak.id} className={kontrak.status === 'pending' ? 'border-amber-500/50' : ''}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${
                    kontrak.status === 'aktif' ? 'bg-emerald-500/10 text-emerald-500' :
                    kontrak.status === 'pending' ? 'bg-amber-500/10 text-amber-500' :
                    'bg-muted text-muted-foreground'
                  }`}>
                    <FileText className="h-6 w-6" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{kontrak.nomorKontrak}</CardTitle>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Building className="h-4 w-4" />
                      <span>{kontrak.buyer}</span>
                      <Badge variant="outline" className="capitalize text-xs">{kontrak.tipeBuyer}</Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={
                    kontrak.status === 'aktif' ? 'default' :
                    kontrak.status === 'pending' ? 'secondary' :
                    'outline'
                  } className={
                    kontrak.status === 'aktif' ? 'bg-emerald-500/10 text-emerald-500' :
                    kontrak.status === 'pending' ? 'bg-amber-500/10 text-amber-500' :
                    ''
                  }>
                    {kontrak.status === 'aktif' ? 'Aktif' : kontrak.status === 'pending' ? 'Pending' : 'Selesai'}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 lg:grid-cols-3">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>Periode: {kontrak.periode}</span>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Item Kontrak</p>
                    <div className="space-y-1">
                      {kontrak.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm">
                          <Package className="h-3 w-3 text-primary" />
                          <span>{item.komoditas} - {item.kuantitas} {item.satuan}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Nilai Kontrak</p>
                    <p className="text-xl font-bold text-primary">{formatCurrency(kontrak.nilaiKontrak)}</p>
                  </div>
                  {kontrak.status !== 'pending' && (
                    <div>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-muted-foreground">Pemenuhan</span>
                        <span className="font-medium">{kontrak.terpenuhi}%</span>
                      </div>
                      <Progress value={kontrak.terpenuhi} className="h-2" />
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-end gap-2">
                  <Button variant="outline" size="sm">
                    <Eye className="mr-2 h-4 w-4" />
                    Detail
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
