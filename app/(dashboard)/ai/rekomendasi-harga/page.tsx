'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { BarChart, Bar, LineChart, Line, ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { ArrowUp, ArrowDown, DollarSign } from 'lucide-react'

const priceRecommendations = [
  {
    komoditas: 'Beras Grade A',
    hargaSaat: 8500,
    rekomendasi: 9200,
    min: 8200,
    max: 9800,
    demand: 'Tinggi',
    supply: 'Terbatas',
    action: 'Naik',
    potensialKenaikan: 8.2,
  },
  {
    komoditas: 'Cabai Merah',
    hargaSaat: 24000,
    rekomendasi: 22500,
    min: 21000,
    max: 26000,
    demand: 'Sedang',
    supply: 'Normal',
    action: 'Turun',
    potensialKenaikan: -6.25,
  },
  {
    komoditas: 'Wortel',
    hargaSaat: 5000,
    rekomendasi: 5800,
    min: 4800,
    max: 6500,
    demand: 'Tinggi',
    supply: 'Kurang',
    action: 'Naik',
    potensialKenaikan: 16.0,
  },
  {
    komoditas: 'Tomat',
    hargaSaat: 3500,
    rekomendasi: 3200,
    min: 2800,
    max: 4200,
    demand: 'Rendah',
    supply: 'Tinggi',
    action: 'Turun',
    potensialKenaikan: -8.57,
  },
]

const marketTrendData = [
  { periode: 'Minggu 1', beras: 8200, cabai: 25000, wortel: 4800, tomat: 3800 },
  { periode: 'Minggu 2', beras: 8400, cabai: 24500, wortel: 5000, tomat: 3600 },
  { periode: 'Minggu 3', beras: 8700, cabai: 24000, wortel: 5300, tomat: 3400 },
  { periode: 'Minggu 4', beras: 8500, cabai: 23500, wortel: 5100, tomat: 3300 },
  { periode: 'Minggu 5', beras: 9000, cabai: 23000, wortel: 5500, tomat: 3200 },
  { periode: 'Minggu 6', beras: 9200, cabai: 22500, wortel: 5800, tomat: 3100 },
]

const demandSupplyData = [
  { komoditas: 'Beras A', demand: 85, supply: 45, optimal: 65 },
  { komoditas: 'Cabai', demand: 72, supply: 68, optimal: 70 },
  { komoditas: 'Wortel', demand: 90, supply: 40, optimal: 65 },
  { komoditas: 'Tomat', demand: 35, supply: 95, optimal: 65 },
]

export default function HargaRecommendationPage() {
  const [selectedKomoditas, setSelectedKomoditas] = useState(0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Rekomendasi Harga Dinamis</h1>
        <p className="text-muted-foreground mt-2">Analisis pasar real-time dengan AI untuk optimasi pricing</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {priceRecommendations.map((item, idx) => (
          <Card
            key={item.komoditas}
            className={`cursor-pointer transition-all ${selectedKomoditas === idx ? 'ring-2 ring-primary' : ''}`}
            onClick={() => setSelectedKomoditas(idx)}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{item.komoditas}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-xs text-muted-foreground">Harga Saat Ini</p>
                <p className="text-xl font-bold">Rp {item.hargaSaat.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Rekomendasi</p>
                <p className="text-xl font-bold text-primary">Rp {item.rekomendasi.toLocaleString()}</p>
              </div>
              <div className="flex items-center justify-between">
                {item.action === 'Naik' ? (
                  <>
                    <Badge className="bg-green-100 text-green-800">
                      <ArrowUp className="mr-1 h-3 w-3" />
                      Naik {item.potensialKenaikan}%
                    </Badge>
                  </>
                ) : (
                  <>
                    <Badge className="bg-red-100 text-red-800">
                      <ArrowDown className="mr-1 h-3 w-3" />
                      Turun {Math.abs(item.potensialKenaikan)}%
                    </Badge>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Tren Harga Komoditas</CardTitle>
            <CardDescription>Pergerakan harga 6 minggu terakhir</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={marketTrendData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="periode" />
                <YAxis />
                <Tooltip formatter={(value) => `Rp ${value.toLocaleString()}`} />
                <Legend />
                <Line type="monotone" dataKey="beras" stroke="var(--chart-1)" strokeWidth={2} name="Beras Grade A" />
                <Line type="monotone" dataKey="cabai" stroke="var(--chart-2)" strokeWidth={2} name="Cabai Merah" />
                <Line type="monotone" dataKey="wortel" stroke="var(--chart-3)" strokeWidth={2} name="Wortel" />
                <Line type="monotone" dataKey="tomat" stroke="var(--chart-4)" strokeWidth={2} name="Tomat" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Range Harga Optimal</CardTitle>
            <CardDescription>{priceRecommendations[selectedKomoditas].komoditas}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Min</span>
                <span className="font-semibold">Rp {priceRecommendations[selectedKomoditas].min.toLocaleString()}</span>
              </div>
              <div className="h-2 rounded-full bg-gradient-to-r from-red-400 to-green-400" />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Harga Saat Ini</span>
                <span>Rekomendasi</span>
                <span>Max</span>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Harga Saat Ini</span>
                  <span>Rp {priceRecommendations[selectedKomoditas].hargaSaat.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-primary">
                  <span>Rekomendasi</span>
                  <span>Rp {priceRecommendations[selectedKomoditas].rekomendasi.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Max</span>
                  <span>Rp {priceRecommendations[selectedKomoditas].max.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Analisis Demand & Supply</CardTitle>
          <CardDescription>Keseimbangan pasar dan indeks harga optimal</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={demandSupplyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="komoditas" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="demand" fill="var(--chart-1)" name="Demand Index" />
              <Bar dataKey="supply" fill="var(--chart-2)" name="Supply Index" />
              <Bar dataKey="optimal" fill="var(--chart-3)" name="Optimal Price Index" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              Impact Finansial
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="border-l-4 border-green-500 bg-green-50 p-3 rounded">
              <p className="font-medium text-sm">Peningkatan Revenue</p>
              <p className="text-2xl font-bold text-green-700">+Rp 8.4jt</p>
              <p className="text-xs text-muted-foreground">Jika implementasi semua rekomendasi</p>
            </div>
            <div className="space-y-2 mt-4">
              <div className="flex justify-between text-sm">
                <span>Beras Grade A (Naik 8.2%)</span>
                <span className="font-semibold text-green-600">+Rp 3.2jt</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Wortel (Naik 16%)</span>
                <span className="font-semibold text-green-600">+Rp 4.1jt</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Faktor Mempengaruhi Harga</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between pb-2 border-b">
              <span className="text-sm">Demand Pasar</span>
              <span className="font-semibold">35%</span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b">
              <span className="text-sm">Supply Kompetitor</span>
              <span className="font-semibold">28%</span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b">
              <span className="text-sm">Tren Historis</span>
              <span className="font-semibold">22%</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm">Faktor Seasonal</span>
              <span className="font-semibold">15%</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
