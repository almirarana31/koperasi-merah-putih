'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { TrendingUp, TrendingDown, AlertCircle } from 'lucide-react'

const forecastData = [
  { hari: 'Day 1', aktual: 450, prediksi: 448, confidence: 96 },
  { hari: 'Day 2', aktual: 520, prediksi: 535, confidence: 94 },
  { hari: 'Day 3', aktual: 480, prediksi: 482, confidence: 93 },
  { hari: 'Day 4', aktual: 610, prediksi: 605, confidence: 92 },
  { hari: 'Day 5', aktual: 540, prediksi: 545, confidence: 91 },
  { hari: 'Day 6', aktual: null, prediksi: 620, confidence: 89 },
  { hari: 'Day 7', aktual: null, prediksi: 680, confidence: 87 },
  { hari: 'Day 8', aktual: null, prediksi: 650, confidence: 85 },
  { hari: 'Day 9', aktual: null, prediksi: 720, confidence: 83 },
  { hari: 'Day 10', aktual: null, prediksi: 690, confidence: 81 },
]

const komoditasForecast = [
  {
    nama: 'Beras Grade A',
    current: 1250,
    forecast30: 3450,
    change: '+176%',
    trend: 'up',
  },
  {
    nama: 'Cabai Merah',
    current: 480,
    forecast30: 720,
    change: '+50%',
    trend: 'up',
  },
  {
    nama: 'Tomat',
    current: 320,
    forecast30: 280,
    change: '-12.5%',
    trend: 'down',
  },
  {
    nama: 'Wortel',
    current: 580,
    forecast30: 890,
    change: '+53%',
    trend: 'up',
  },
]

const monthlyForecast = [
  { bulan: 'Mei', forecast: 12500, confidence: 92 },
  { bulan: 'Jun', forecast: 14800, confidence: 89 },
  { bulan: 'Jul', forecast: 16200, confidence: 87 },
  { bulan: 'Agu', forecast: 15600, confidence: 85 },
  { bulan: 'Sep', forecast: 17900, confidence: 83 },
  { bulan: 'Okt', forecast: 19200, confidence: 81 },
]

export default function ForecastPage() {
  const [selectedKomoditas, setSelectedKomoditas] = useState('Beras Grade A')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Forecast Permintaan</h1>
        <p className="text-muted-foreground mt-2">Prediksi permintaan komoditas berdasarkan data historis dan tren pasar</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {komoditasForecast.map((item) => (
          <Card
            key={item.nama}
            className={`cursor-pointer transition-all ${selectedKomoditas === item.nama ? 'ring-2 ring-primary' : ''}`}
            onClick={() => setSelectedKomoditas(item.nama)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{item.nama}</CardTitle>
                  <CardDescription>Forecast 30 hari</CardDescription>
                </div>
                {item.trend === 'up' ? (
                  <TrendingUp className="h-5 w-5 text-green-600" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-red-600" />
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Permintaan Saat Ini</p>
                  <p className="text-xl font-bold">{item.current}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Forecast (30h)</p>
                  <p className="text-xl font-bold">{item.forecast30}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Perubahan</p>
                  <p className={`text-xl font-bold ${item.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {item.change}
                  </p>
                </div>
              </div>
              <Badge variant={item.trend === 'up' ? 'default' : 'secondary'}>
                {item.trend === 'up' ? 'Meningkat' : 'Menurun'}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tren Permintaan {selectedKomoditas}</CardTitle>
          <CardDescription>Data aktual vs prediksi dengan confidence interval</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={forecastData}>
              <defs>
                <linearGradient id="colorPrediksi" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hari" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="aktual" stroke="#3b82f6" fill="#3b82f6" />
              <Area type="monotone" dataKey="prediksi" stroke="#10b981" fillOpacity={1} fill="url(#colorPrediksi)" />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Forecast Bulanan</CardTitle>
          <CardDescription>Prediksi total permintaan per bulan</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyForecast}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="bulan" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="forecast" stroke="#10b981" strokeWidth={2} name="Forecast (Unit)" />
              <Line type="monotone" dataKey="confidence" stroke="#f59e0b" strokeWidth={2} name="Confidence (%)" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              Peluang Penjualan
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="border-l-4 border-green-500 bg-green-50 p-3 rounded">
              <p className="font-medium text-sm">Beras Grade A</p>
              <p className="text-xs text-muted-foreground">Potensi penjualan naik 176% bulan depan</p>
              <p className="text-sm font-bold text-green-700 mt-1">Estimasi Revenue: +Rp 12.5jt</p>
            </div>
            <div className="border-l-4 border-green-500 bg-green-50 p-3 rounded">
              <p className="font-medium text-sm">Wortel</p>
              <p className="text-xs text-muted-foreground">Permintaan meningkat signifikan</p>
              <p className="text-sm font-bold text-green-700 mt-1">Estimasi Revenue: +Rp 3.2jt</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-600" />
              Rekomendasi Aksi
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="border-l-4 border-orange-500 bg-orange-50 p-3 rounded">
              <p className="font-medium text-sm">Persiapkan Stok</p>
              <p className="text-xs text-muted-foreground">Tingkatkan produksi Beras Grade A 100%</p>
            </div>
            <div className="border-l-4 border-orange-500 bg-orange-50 p-3 rounded">
              <p className="font-medium text-sm">Proactive Marketing</p>
              <p className="text-xs text-muted-foreground">Hubungi buyer untuk order tambahan</p>
            </div>
            <div className="border-l-4 border-blue-500 bg-blue-50 p-3 rounded">
              <p className="font-medium text-sm">Monitor Pasar</p>
              <p className="text-xs text-muted-foreground">Tomato akan menurun, cari substitusi</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
