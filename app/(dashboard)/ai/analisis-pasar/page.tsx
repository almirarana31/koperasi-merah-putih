'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { TrendingUp, TrendingDown, AlertCircle, Lightbulb } from 'lucide-react'

const marketTrends = [
  { metrik: 'Demand Beras', tren: 'up', perubahan: '+34%', insight: 'Musim panen dimulai, demand tinggi' },
  { metrik: 'Harga Cabai', tren: 'down', perubahan: '-12%', insight: 'Oversupply dari kompetitor' },
  { metrik: 'Order Wortel', tren: 'up', perubahan: '+67%', insight: 'Pembeli baru bergabung' },
  { metrik: 'Kepuasan Buyer', tren: 'up', perubahan: '+8%', insight: 'Kualitas produk meningkat' },
]

const competitorData = [
  { minggu: 'Minggu 1', kami: 45, kompA: 38, kompB: 32, kompC: 28 },
  { minggu: 'Minggu 2', kami: 52, kompA: 41, kompB: 35, kompC: 31 },
  { minggu: 'Minggu 3', kami: 58, kompA: 39, kompB: 38, kompC: 34 },
  { minggu: 'Minggu 4', kami: 64, kompA: 42, kompB: 40, kompC: 36 },
]

const seasonalData = [
  { bulan: 'Jan', padi: 35, daging: 42, sayur: 38, buah: 28 },
  { bulan: 'Feb', padi: 38, daging: 45, sayur: 40, buah: 32 },
  { bulan: 'Mar', padi: 42, daging: 48, sayur: 45, buah: 38 },
  { bulan: 'Apr', padi: 48, daging: 50, sayur: 52, buah: 45 },
  { bulan: 'Mei', padi: 58, daging: 52, sayur: 68, buah: 58 },
  { bulan: 'Jun', padi: 72, daging: 54, sayur: 75, buah: 68 },
]

export default function MarketAnalysisPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Analisis Pasar & Kompetitor</h1>
        <p className="text-muted-foreground mt-2">Intelligence pasar real-time dengan AI sentiment analysis</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {marketTrends.map((trend) => (
          <Card key={trend.metrik}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <CardTitle className="text-sm font-medium">{trend.metrik}</CardTitle>
                {trend.tren === 'up' ? (
                  <TrendingUp className="h-5 w-5 text-green-600" />
                ) : (
                  <TrendingDown className="h-5 w-5 text-red-600" />
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className={`text-2xl font-bold ${trend.tren === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                {trend.perubahan}
              </div>
              <p className="text-xs text-muted-foreground">{trend.insight}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Posisi Kompetitif vs Kompetitor</CardTitle>
          <CardDescription>Market share berdasarkan volume transaksi bulanan</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={competitorData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="minggu" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="kami" stroke="var(--primary)" strokeWidth={3} name="KOPDES (Kami)" />
              <Line type="monotone" dataKey="kompA" stroke="#3b82f6" strokeWidth={2} name="Kompetitor A" />
              <Line type="monotone" dataKey="kompB" stroke="#f59e0b" strokeWidth={2} name="Kompetitor B" />
              <Line type="monotone" dataKey="kompC" stroke="#8b5cf6" strokeWidth={2} name="Kompetitor C" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pola Musiman & Forecast</CardTitle>
          <CardDescription>Tren permintaan berdasarkan kategori produk</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={seasonalData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="bulan" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="padi" fill="#10b981" name="Padi/Beras" />
              <Bar dataKey="daging" fill="#3b82f6" name="Daging" />
              <Bar dataKey="sayur" fill="#f59e0b" name="Sayur" />
              <Bar dataKey="buah" fill="#8b5cf6" name="Buah" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-600" />
              Market Opportunities
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="border-l-4 border-green-500 bg-green-50 p-3 rounded">
              <p className="font-medium text-sm">Permintaan Sayur Meningkat 75%</p>
              <p className="text-xs text-muted-foreground">Musim panen optimal di bulan Mei-Juni</p>
              <p className="text-sm font-bold text-green-700 mt-1">Estimasi Rp 8.2jt revenue tambahan</p>
            </div>
            <div className="border-l-4 border-blue-500 bg-blue-50 p-3 rounded">
              <p className="font-medium text-sm">Buyer Baru di Jawa Timur</p>
              <p className="text-xs text-muted-foreground">5 perusahaan baru mencari supplier</p>
              <p className="text-sm font-bold text-blue-700 mt-1">Potensi 3 kontrak baru</p>
            </div>
            <div className="border-l-4 border-purple-500 bg-purple-50 p-3 rounded">
              <p className="font-medium text-sm">Premium Product Trend</p>
              <p className="text-xs text-muted-foreground">Produk organik demand +45%</p>
              <p className="text-sm font-bold text-purple-700 mt-1">Margin keuntungan 2x lebih tinggi</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-600" />
              Strategi Kompetitif
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="font-medium text-sm">1. Agresif di Pasar Baru</p>
              <p className="text-xs text-muted-foreground">Target Jawa Timur dengan harga kompetitif</p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <p className="font-medium text-sm">2. Fokus Premium Quality</p>
              <p className="text-xs text-muted-foreground">Grade A + Organic certification</p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="font-medium text-sm">3. Expand Product Range</p>
              <p className="text-xs text-muted-foreground">Tambah sayur organik & produk processed</p>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
              <p className="font-medium text-sm">4. Partnership Program</p>
              <p className="text-xs text-muted-foreground">Kolaborasi dengan koperasi lain</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
