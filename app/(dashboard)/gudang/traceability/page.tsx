'use client'

import { useState } from 'react'
import {
  QrCode,
  Search,
  MapPin,
  User,
  Calendar,
  Truck,
  Package,
  CheckCircle2,
  ArrowRight,
  Leaf,
  Warehouse,
  ShoppingCart,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const traceData = {
  batchCode: 'BP-2024-001',
  komoditas: 'Beras Premium',
  grade: 'A',
  jumlah: '3000 kg',
  timeline: [
    {
      step: 1,
      title: 'Produksi',
      icon: Leaf,
      date: '2024-01-15',
      location: 'Sukamaju, Cianjur',
      details: [
        { label: 'Produsen', value: 'Pak Slamet Widodo' },
        { label: 'Luas Panen', value: '2.5 Ha' },
        { label: 'Varietas', value: 'IR64' },
        { label: 'Hasil Panen', value: '3200 kg gabah' },
      ],
      status: 'completed',
    },
    {
      step: 2,
      title: 'Penggilingan',
      icon: Package,
      date: '2024-01-16',
      location: 'Penggilingan Jaya, Cianjur',
      details: [
        { label: 'Proses', value: 'Gabah → Beras' },
        { label: 'Hasil', value: '3000 kg beras' },
        { label: 'Rendemen', value: '62.5%' },
      ],
      status: 'completed',
    },
    {
      step: 3,
      title: 'Quality Control',
      icon: CheckCircle2,
      date: '2024-01-16',
      location: 'Gudang Utama KOPDES',
      details: [
        { label: 'Grade', value: 'A (Premium)' },
        { label: 'Kadar Air', value: '12.5%' },
        { label: 'Butir Patah', value: '8%' },
        { label: 'QC Score', value: '92/100' },
      ],
      status: 'completed',
    },
    {
      step: 4,
      title: 'Penyimpanan',
      icon: Warehouse,
      date: '2024-01-16',
      location: 'Gudang Utama KOPDES',
      details: [
        { label: 'Lokasi', value: 'Rak A-12' },
        { label: 'Suhu', value: '25°C' },
        { label: 'Kelembaban', value: '65%' },
      ],
      status: 'completed',
    },
    {
      step: 5,
      title: 'Penjualan',
      icon: ShoppingCart,
      date: '2024-02-01',
      location: 'Gudang Utama KOPDES',
      details: [
        { label: 'Buyer', value: 'Hotel Grand Hyatt' },
        { label: 'Jumlah', value: '500 kg' },
        { label: 'No. PO', value: 'PO-2024-001' },
      ],
      status: 'completed',
    },
    {
      step: 6,
      title: 'Pengiriman',
      icon: Truck,
      date: '2024-02-04',
      location: 'Jakarta',
      details: [
        { label: 'No. Resi', value: 'KPD-2024-0001' },
        { label: 'Driver', value: 'Pak Joko' },
        { label: 'Tujuan', value: 'Jl. Sudirman No. 1' },
      ],
      status: 'completed',
    },
  ],
}

export default function TraceabilityPage() {
  const [searchCode, setSearchCode] = useState('BP-2024-001')
  const [showResult, setShowResult] = useState(true)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Traceability</h1>
        <p className="text-muted-foreground">Lacak asal-usul dan perjalanan produk</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <QrCode className="h-5 w-5" />
            Cari Batch Code
          </CardTitle>
          <CardDescription>
            Masukkan batch code atau scan QR code untuk melacak produk
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Masukkan batch code (contoh: BP-2024-001)"
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value)}
                className="pl-9"
              />
            </div>
            <Button onClick={() => setShowResult(true)}>
              <Search className="mr-2 h-4 w-4" />
              Lacak
            </Button>
            <Button variant="outline">
              <QrCode className="mr-2 h-4 w-4" />
              Scan QR
            </Button>
          </div>
        </CardContent>
      </Card>

      {showResult && (
        <>
          <Card>
            <CardHeader className="border-b bg-primary/5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                      <QrCode className="h-6 w-6" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{traceData.batchCode}</CardTitle>
                      <CardDescription>{traceData.komoditas}</CardDescription>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Grade</p>
                    <Badge className="bg-emerald-500">{traceData.grade}</Badge>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Jumlah</p>
                    <p className="font-semibold">{traceData.jumlah}</p>
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>

          <div className="relative">
            {traceData.timeline.map((step, idx) => (
              <div key={step.step} className="relative flex gap-6 pb-8 last:pb-0">
                {idx < traceData.timeline.length - 1 && (
                  <div className="absolute left-[23px] top-12 bottom-0 w-0.5 bg-primary/30" />
                )}
                
                <div className="flex flex-col items-center">
                  <div className={`flex h-12 w-12 items-center justify-center rounded-full border-2 ${
                    step.status === 'completed' 
                      ? 'border-primary bg-primary text-primary-foreground' 
                      : 'border-muted bg-background'
                  }`}>
                    <step.icon className="h-5 w-5" />
                  </div>
                </div>

                <Card className="flex-1">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-base">Step {step.step}: {step.title}</CardTitle>
                          <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/30">
                            <CheckCircle2 className="mr-1 h-3 w-3" />
                            Selesai
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {step.date}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {step.location}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {step.details.map((detail, detailIdx) => (
                        <div key={detailIdx}>
                          <p className="text-xs text-muted-foreground">{detail.label}</p>
                          <p className="font-medium">{detail.value}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
