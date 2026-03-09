'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts'
import { 
  TrendingUp, 
  Brain, 
  Zap, 
  AlertCircle, 
  CheckCircle, 
  DollarSign,
  TrendingDown,
  Package,
  Route,
  Target,
  BarChart3,
  ArrowRight,
} from 'lucide-react'
import { aiAnalyses } from '@/lib/mock-data'

const aiModels = [
  {
    id: 'price-prediction',
    name: 'Prediksi Harga',
    status: 'Aktif',
    accuracy: '87%',
    description: 'Prediksi harga komoditas berdasarkan tren pasar',
    icon: DollarSign,
    color: 'bg-emerald-500/10 text-emerald-600 border-emerald-200',
    href: '/ai/rekomendasi-harga',
    analyses: aiAnalyses.filter(a => a.type === 'price_prediction').length,
  },
  {
    id: 'demand-forecast',
    name: 'Forecast Permintaan',
    status: 'Aktif',
    accuracy: '92%',
    description: 'Prediksi permintaan komoditas untuk 30 hari ke depan',
    icon: TrendingUp,
    color: 'bg-blue-500/10 text-blue-600 border-blue-200',
    href: '/ai/forecast',
    analyses: aiAnalyses.filter(a => a.type === 'demand_forecast').length,
  },
  {
    id: 'quality-grading',
    name: 'Grading Kualitas',
    status: 'Aktif',
    accuracy: '95%',
    description: 'Klasifikasi kualitas produk menggunakan AI',
    icon: Target,
    color: 'bg-amber-500/10 text-amber-600 border-amber-200',
    href: '/ai/grading',
    analyses: aiAnalyses.filter(a => a.type === 'quality_grading').length,
  },
  {
    id: 'route-optimization',
    name: 'Optimasi Rute',
    status: 'Aktif',
    accuracy: '88%',
    description: 'Kalkulasi rute pengiriman paling efisien',
    icon: Route,
    color: 'bg-purple-500/10 text-purple-600 border-purple-200',
    href: '/ai/optimasi-rute',
    analyses: aiAnalyses.filter(a => a.type === 'route_optimization').length,
  },
  {
    id: 'market-analysis',
    name: 'Analisis Pasar',
    status: 'Aktif',
    accuracy: '90%',
    description: 'Analisis tren dan peluang pasar real-time',
    icon: BarChart3,
    color: 'bg-cyan-500/10 text-cyan-600 border-cyan-200',
    href: '/ai/analisis-pasar',
    analyses: aiAnalyses.filter(a => a.type === 'market_analysis').length,
  },
]

const performanceData = [
  { model: 'Harga', accuracy: 87, confidence: 85, impact: 82 },
  { model: 'Demand', accuracy: 92, confidence: 90, impact: 88 },
  { model: 'Grading', accuracy: 95, confidence: 93, impact: 91 },
  { model: 'Rute', accuracy: 88, confidence: 86, impact: 84 },
  { model: 'Pasar', accuracy: 90, confidence: 88, impact: 86 },
]

const usageData = [
  { bulan: 'Jan', harga: 12, demand: 15, grading: 8, rute: 10, pasar: 6 },
  { bulan: 'Feb', harga: 15, demand: 18, grading: 12, rute: 14, pasar: 9 },
  { bulan: 'Mar', harga: 18, demand: 22, grading: 15, rute: 16, pasar: 12 },
]

const accuracyDistribution = [
  { name: 'Sangat Akurat (>90%)', value: 45, fill: '#10b981' },
  { name: 'Akurat (80-90%)', value: 40, fill: '#3b82f6' },
  { name: 'Perlu Review (<80%)', value: 15, fill: '#f59e0b' },
]

export default function AIDashboard() {
  const [selectedModel, setSelectedModel] = useState<string | null>(null)

  // Get recent analyses
  const recentAnalyses = aiAnalyses.slice(0, 5)

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(val)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-primary">AI Intelligence Hub</h1>
          <p className="text-muted-foreground mt-1">
            Sistem rekomendasi cerdas untuk optimasi operasional koperasi
          </p>
        </div>
        <Badge variant="outline" className="gap-2">
          <Brain className="h-3.5 w-3.5" />
          {aiAnalyses.length} Analisis Aktif
        </Badge>
      </div>

      {/* AI Models Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {aiModels.map((model) => (
          <Card
            key={model.id}
            className={`cursor-pointer transition-all hover:shadow-md hover:border-primary/50 ${
              selectedModel === model.id ? 'ring-2 ring-primary shadow-md' : ''
            }`}
            onClick={() => setSelectedModel(selectedModel === model.id ? null : model.id)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${model.color}`}>
                    <model.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <CardTitle className="text-base">{model.name}</CardTitle>
                    <CardDescription className="text-xs mt-0.5">
                      {model.analyses} analisis
                    </CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-xs text-muted-foreground">{model.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                    {model.status}
                  </Badge>
                  <Badge className="bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/10 text-[10px] px-1.5 py-0">
                    {model.accuracy}
                  </Badge>
                </div>
                <Button variant="ghost" size="sm" className="h-7 text-xs" asChild>
                  <Link href={model.href}>
                    Lihat <ArrowRight className="ml-1 h-3 w-3" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Performance Charts */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Performa Model AI</CardTitle>
            <CardDescription className="text-xs">
              Akurasi, Confidence, dan Impact setiap model
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                <XAxis dataKey="model" fontSize={11} />
                <YAxis fontSize={11} />
                <Tooltip 
                  contentStyle={{ fontSize: 12 }}
                  formatter={(value) => `${value}%`}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="accuracy" fill="#10b981" name="Akurasi" radius={[4, 4, 0, 0]} />
                <Bar dataKey="confidence" fill="#3b82f6" name="Confidence" radius={[4, 4, 0, 0]} />
                <Bar dataKey="impact" fill="#f59e0b" name="Impact" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Distribusi Akurasi</CardTitle>
            <CardDescription className="text-xs">Status keseluruhan prediksi</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={accuracyDistribution}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ value }) => `${value}%`}
                  outerRadius={70}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {accuracyDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-3 space-y-1.5">
              {accuracyDistribution.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.fill }} />
                    <span className="text-muted-foreground">{item.name}</span>
                  </div>
                  <span className="font-medium">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Usage Trend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Tren Penggunaan AI</CardTitle>
          <CardDescription className="text-xs">
            Jumlah analisis yang dijalankan per bulan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={usageData}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
              <XAxis dataKey="bulan" fontSize={11} />
              <YAxis fontSize={11} />
              <Tooltip contentStyle={{ fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Line type="monotone" dataKey="harga" stroke="#10b981" strokeWidth={2} name="Prediksi Harga" />
              <Line type="monotone" dataKey="demand" stroke="#3b82f6" strokeWidth={2} name="Forecast Demand" />
              <Line type="monotone" dataKey="grading" stroke="#f59e0b" strokeWidth={2} name="Grading" />
              <Line type="monotone" dataKey="rute" stroke="#8b5cf6" strokeWidth={2} name="Optimasi Rute" />
              <Line type="monotone" dataKey="pasar" stroke="#06b6d4" strokeWidth={2} name="Analisis Pasar" />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recent Analyses & Recommendations */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <CheckCircle className="h-4 w-4 text-emerald-600" />
              Analisis Terbaru
            </CardTitle>
            <CardDescription className="text-xs">
              {recentAnalyses.length} analisis terbaru dari AI
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentAnalyses.map((analysis) => (
              <div key={analysis.id} className="flex items-start justify-between border-b pb-2.5 last:border-0 last:pb-0">
                <div className="flex-1">
                  <p className="font-medium text-sm leading-tight">{analysis.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{analysis.description}</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    <Badge className="bg-blue-500/10 text-blue-600 hover:bg-blue-500/10 text-[10px] px-1.5 py-0">
                      {analysis.confidence}% confidence
                    </Badge>
                    <span className="text-[10px] text-muted-foreground">{analysis.createdAt}</span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <AlertCircle className="h-4 w-4 text-amber-600" />
              Rekomendasi Prioritas
            </CardTitle>
            <CardDescription className="text-xs">
              Action items berdasarkan analisis AI
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentAnalyses.slice(0, 4).map((analysis, idx) => (
              <div 
                key={analysis.id} 
                className={`rounded-lg border-l-4 p-3 ${
                  idx === 0 ? 'border-emerald-500 bg-emerald-50/50' :
                  idx === 1 ? 'border-blue-500 bg-blue-50/50' :
                  idx === 2 ? 'border-amber-500 bg-amber-50/50' :
                  'border-purple-500 bg-purple-50/50'
                }`}
              >
                <p className="text-sm font-medium leading-tight">
                  {analysis.recommendations[0]}
                </p>
                <p className="text-xs text-muted-foreground mt-1">
                  {analysis.impact}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
iv>
    </div>
  )
}
iv>
    </div>
  )
}
 </div>
  )
}
iv>
    </div>
  )
}
