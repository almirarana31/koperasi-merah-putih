'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { CheckCircle, AlertCircle, Camera, Zap } from 'lucide-react'

const gradingResults = [
  {
    batch: 'Batch 001 - Beras Grade A',
    tanggal: '2024-03-05',
    jumlah: 500,
    gradingA: 485,
    gradingB: 12,
    gradingC: 3,
    accuracy: 97.8,
    waktu: '2.3 menit',
    status: 'Selesai',
  },
  {
    batch: 'Batch 002 - Cabai Merah',
    tanggal: '2024-03-05',
    jumlah: 320,
    gradingA: 245,
    gradingB: 58,
    gradingC: 17,
    accuracy: 96.2,
    waktu: '1.8 menit',
    status: 'Selesai',
  },
  {
    batch: 'Batch 003 - Wortel',
    tanggal: '2024-03-06',
    jumlah: 650,
    gradingA: 568,
    gradingB: 72,
    gradingC: 10,
    accuracy: 98.1,
    waktu: '3.1 menit',
    status: 'Selesai',
  },
]

const qualityMetrics = [
  { metrik: 'Ukuran', nilai: 94 },
  { metrik: 'Warna', nilai: 92 },
  { metrik: 'Tekstur', nilai: 88 },
  { metrik: 'Cacat', nilai: 96 },
  { metrik: 'Kesegaran', nilai: 91 },
]

const timeComparison = [
  { metode: 'Manual', waktu: 45 },
  { metode: 'Semi-Auto', waktu: 28 },
  { metode: 'AI Full', waktu: 2.5 },
]

const gradingDistribution = [
  { name: 'Grade A (90-100)', value: 72, fill: 'var(--success)' },
  { name: 'Grade B (75-89)', value: 22, fill: 'var(--warning)' },
  { name: 'Grade C (<75)', value: 6, fill: 'var(--destructive)' },
]

export default function GradingPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Grading & QC Otomatis</h1>
        <p className="text-muted-foreground mt-2">Klasifikasi otomatis kualitas produk menggunakan computer vision AI</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Batch Diproses</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,470</div>
            <p className="text-xs text-muted-foreground">Bulan ini</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Akurasi Rata-rata</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">97.4%</div>
            <Badge className="mt-2 bg-green-100 text-green-800">
              <CheckCircle className="mr-1 h-3 w-3" />
              Sangat Baik
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Waktu Pemrosesan</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">2.4 menit</div>
            <p className="text-xs text-muted-foreground">Rata-rata per batch</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Grade A %</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">72%</div>
            <p className="text-xs text-muted-foreground">Standar premium</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4">
        {gradingResults.map((result) => (
          <Card key={result.batch}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{result.batch}</CardTitle>
                  <CardDescription>{result.tanggal}</CardDescription>
                </div>
                <div className="flex items-center gap-4">
                  <Badge variant="outline">{result.status}</Badge>
                  <div className="text-right">
                    <p className="font-semibold text-sm">{result.accuracy}%</p>
                    <p className="text-xs text-muted-foreground">Akurasi</p>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div>
                <p className="text-xs text-muted-foreground">Total Unit</p>
                <p className="font-bold text-lg">{result.jumlah}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Grade A</p>
                <p className="font-bold text-lg text-green-600">{result.gradingA}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Grade B</p>
                <p className="font-bold text-lg text-orange-600">{result.gradingB}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Grade C</p>
                <p className="font-bold text-lg text-red-600">{result.gradingC}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Waktu</p>
                <p className="font-bold text-lg">{result.waktu}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Parameter Penilaian Kualitas</CardTitle>
            <CardDescription>Skor akurasi setiap metrik kualitas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {qualityMetrics.map((metric) => (
                <div key={metric.metrik}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">{metric.metrik}</span>
                    <span className="text-sm font-semibold">{metric.nilai}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-muted">
                    <div
                      className="h-2 rounded-full bg-primary transition-all"
                      style={{ width: `${metric.nilai}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribusi Grade</CardTitle>
            <CardDescription>Breakdown hasil grading otomatis</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={gradingDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name} ${value}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {gradingDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Perbandingan Waktu Pemrosesan</CardTitle>
          <CardDescription>Manual vs Semi-Otomatis vs Full AI</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={timeComparison}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="metode" />
              <YAxis label={{ value: 'Waktu (menit)', angle: -90, position: 'insideLeft' }} />
              <Tooltip formatter={(value) => `${value} menit`} />
              <Legend />
              <Bar dataKey="waktu" fill="#10b981" name="Waktu Pemrosesan" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-600" />
              Keuntungan Operasional
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="border-l-4 border-green-500 bg-green-50 p-3 rounded">
              <p className="font-medium text-sm">Kecepatan Meningkat</p>
              <p className="text-xs text-muted-foreground">18x lebih cepat dari manual</p>
              <p className="text-sm font-bold text-green-700 mt-1">Rp 4.2jt/bulan hemat labor</p>
            </div>
            <div className="border-l-4 border-green-500 bg-green-50 p-3 rounded">
              <p className="font-medium text-sm">Konsistensi Tinggi</p>
              <p className="text-xs text-muted-foreground">97.4% akurasi standar</p>
            </div>
            <div className="border-l-4 border-blue-500 bg-blue-50 p-3 rounded">
              <p className="font-medium text-sm">Kapasitas Unlimited</p>
              <p className="text-xs text-muted-foreground">Proses 24/7 tanpa henti</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="h-5 w-5 text-purple-600" />
              Setup Kamera AI
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="bg-muted rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Kamera 1 (Ruang Grading)</span>
                <Badge variant="outline">Aktif</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Kamera 2 (Kemasan)</span>
                <Badge variant="outline">Aktif</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Sensor Suhu/Lembab</span>
                <Badge variant="outline">Aktif</Badge>
              </div>
            </div>
            <Button className="w-full" variant="outline">
              Konfigurasi Kamera
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
