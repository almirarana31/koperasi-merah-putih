'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  BarChart, 
  Bar, 
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
  Zap, 
  AlertCircle, 
  CheckCircle, 
  DollarSign,
  Route,
  Target,
  BarChart3,
  ArrowRight,
  BrainCircuit,
  Activity,
  History,
  ArrowUpRight,
  ShieldCheck,
  Truck,
  Microscope,
} from 'lucide-react'
import { aiAnalyses } from '@/lib/mock-data'
import { KementerianFilterBar } from '@/components/dashboard/kementerian-filter-bar'
import { type ScopeFilters } from '@/lib/kementerian-dashboard-data'
import { useAuth } from '@/lib/auth/use-auth'
import { canAccessRoute } from '@/lib/rbac'

const aiModels = [
  { id: 'price-reco', name: 'Rekomendasi Harga', status: 'Aktif', accuracy: '92%', description: 'Optimasi harga berdasarkan tren pasar', icon: DollarSign, color: 'bg-emerald-500/10 text-emerald-600 border-emerald-200', href: '/ai/rekomendasi-harga' },
  { id: 'supply-demand', name: 'Supply & Demand', status: 'Aktif', accuracy: '88%', description: 'Analisis keseimbangan pasokan & permintaan', icon: BrainCircuit, color: 'bg-blue-500/10 text-blue-600 border-blue-200', href: '/ai/supply-demand' },
  { id: 'grading', name: 'Grading Otomatis', status: 'Aktif', accuracy: '97%', description: 'QC otomatis berbasis Computer Vision', icon: Microscope, color: 'bg-rose-500/10 text-rose-600 border-rose-200', href: '/ai/grading' },
  { id: 'route-opt', name: 'Optimasi Rute', status: 'Aktif', accuracy: '95%', description: 'Efisiensi logistik & rute armada', icon: Truck, color: 'bg-purple-500/10 text-purple-600 border-purple-200', href: '/ai/optimasi-rute' },
  { id: 'market-analysis', name: 'Intelijen Pasar', status: 'Aktif', accuracy: '90%', description: 'Audit sentimen pasar & pangsa pasar nasional', icon: BarChart3, color: 'bg-cyan-500/10 text-cyan-600 border-cyan-200', href: '/ai/analisis-pasar' },
  { id: 'forecast', name: 'Prediksi Permintaan', status: 'Aktif', accuracy: '94%', description: 'Prakiraan kebutuhan komoditas masa depan', icon: TrendingUp, color: 'bg-emerald-500/10 text-emerald-600 border-emerald-200', href: '/ai/forecast' },
]

const performanceData = [
  { model: 'Harga', accuracy: 92, confidence: 90, impact: 88 },
  { model: 'Pasokan', accuracy: 88, confidence: 86, impact: 84 },
  { model: 'Grading', accuracy: 97, confidence: 95, impact: 93 },
  { model: 'Logistik', accuracy: 95, confidence: 93, impact: 91 },
  { model: 'Pasar', accuracy: 90, confidence: 88, impact: 86 },
]

const accuracyDistribution = [
  { name: 'Presisi Tinggi (>90%)', value: 45, fill: '#DC3935' },
  { name: 'Stabil (80-90%)', value: 40, fill: '#006E9D' },
  { name: 'Perlu Audit (<80%)', value: 15, fill: '#BE5850' },
]

const recentAnalyses = [
  { id: 1, title: 'Prediksi Panen Raya Beras', time: '2 jam yang lalu', confidence: 96, impact: 'Tinggi', category: 'Produksi' },
  { id: 2, title: 'Optimasi Rute Distribusi Jawa', time: '5 jam yang lalu', confidence: 92, impact: 'Sedang', category: 'Logistik' },
  { id: 3, title: 'Analisis Harga Cabai Nasional', time: 'Kemarin', confidence: 88, impact: 'Tinggi', category: 'Harga' },
]

export default function AIIntelligenceHubPage() {
  const { user } = useAuth()
  const [filters, setFilters] = useState<ScopeFilters>({
    provinceId: 'all',
    regionId: 'all',
    villageId: 'all',
    cooperativeId: 'all',
    commodityId: 'all',
  })
  
  const canOpenCommandCenter = user?.role ? canAccessRoute(user.role, '/command-center') : false
  const visibleAiModels = useMemo(
    () => (user?.role ? aiModels.filter((model) => canAccessRoute(user.role, model.href)) : aiModels),
    [user?.role],
  )

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 flex items-center gap-2 uppercase tracking-tight">
              <BrainCircuit className="h-8 w-8 text-slate-900" />
              Pusat Intelijen AI Nasional
            </h1>
            <p className="mt-2 text-sm font-medium text-slate-500">
              Monitoring performa model dan wawasan strategis di seluruh ekosistem KOPDES.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="font-bold rounded-none border-2">
              <History className="mr-2 h-4 w-4" /> RIWAYAT MODEL
            </Button>
            <Button className="bg-slate-900 font-bold rounded-none">
              <Zap className="mr-2 h-4 w-4" /> JALANKAN SEMUA
            </Button>
          </div>
        </div>

        <KementerianFilterBar filters={filters} setFilters={setFilters} />
      </div>

      {/* AI Models Executive Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {visibleAiModels.map((model) => (
          <Link href={model.href} key={model.id} className="group">
            <Card className="h-full overflow-hidden border-2 shadow-sm rounded-none hover:border-slate-900 transition-colors">
              <CardHeader className="p-4 pb-2">
                <div className="flex items-center justify-between mb-3">
                  <div className={`h-8 w-8 rounded-none flex items-center justify-center ${model.color}`}>
                    <model.icon className="h-4 w-4" />
                  </div>
                  <Badge variant="outline" className="rounded-none font-bold uppercase text-[10px]">{model.status}</Badge>
                </div>
                <CardTitle className="text-lg font-black text-slate-900 uppercase tracking-wider leading-tight">
                  {model.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 space-y-3">
                <p className="text-xs text-slate-500 font-medium leading-tight line-clamp-1">{model.description}</p>
                <div className="flex items-end justify-between pt-2 border-t border-dashed border-slate-200">
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 text-left">Akurasi</p>
                    <p className="text-2xl font-black text-slate-900">{model.accuracy}</p>
                  </div>
                  <Button variant="ghost" size="sm" className="font-bold text-xs group-hover:text-slate-900 px-0 rounded-none">
                    BUKA MODUL <ArrowUpRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Performance Matrix Section */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-2 shadow-sm rounded-none">
          <CardHeader className="border-b bg-slate-50/50">
            <CardTitle className="text-sm font-black text-slate-900 uppercase tracking-wider">Benchmark Akurasi Lintas Model</CardTitle>
            <CardDescription className="text-xs font-bold text-slate-500">Performa tingkat kepercayaan real-time per modul</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="model" tick={{ fill: "#64748b", fontSize: 10, fontWeight: 800 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#64748b", fontSize: 10, fontWeight: 800 }} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#0f172a", border: "none", borderRadius: "0px", color: "#fff" }}
                  itemStyle={{ fontSize: "10px", fontWeight: "600" }}
                />
                <Legend iconType="rect" wrapperStyle={{ paddingTop: "20px", fontSize: "10px", fontWeight: 600, color: "#64748b" }} />
                <Bar dataKey="accuracy" fill="#DC3935" name="Akurasi" radius={[0, 0, 0, 0]} barSize={32} />
                <Bar dataKey="confidence" fill="#006E9D" name="Kepercayaan" radius={[0, 0, 0, 0]} barSize={32} />
                <Bar dataKey="impact" fill="#BE5850" name="Dampak" radius={[0, 0, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-2 shadow-sm rounded-none flex flex-col">
          <CardHeader className="border-b bg-slate-50/50">
            <CardTitle className="text-sm font-black text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <BrainCircuit className="h-4 w-4 text-slate-900" /> Wawasan AI Strategis
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 p-0 overflow-y-auto">
            <div className="divide-y border-b">
              {recentAnalyses.map((analysis) => (
                <div key={analysis.id} className="p-4 hover:bg-slate-50 transition-colors cursor-pointer group">
                  <div className="flex items-center justify-between mb-1">
                    <Badge className="bg-slate-100 text-slate-600 rounded-none text-[9px] font-bold uppercase border-none">{analysis.category}</Badge>
                    <span className="text-[10px] font-bold text-slate-400">{analysis.time}</span>
                  </div>
                  <p className="text-sm font-black text-slate-900 leading-tight group-hover:text-blue-600 transition-colors mb-2">{analysis.title}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      Indeks Kepercayaan {analysis.confidence}%
                    </span>
                    <Badge className={`rounded-none font-bold uppercase text-[9px] border-none ${
                      analysis.impact === 'Tinggi' ? 'bg-rose-500 text-white' : 'bg-amber-500 text-slate-900'
                    }`}>
                      DAMPAK {analysis.impact}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 bg-slate-50">
              <Button variant="outline" className="w-full font-black text-xs h-10 border-2 rounded-none hover:bg-slate-900 hover:text-white transition-colors">
                PUSAT LAPORAN LENGKAP
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Recommendation Banners */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="bg-slate-900 text-white rounded-none border-none overflow-hidden relative group cursor-pointer shadow-xl">
          <div className="absolute top-0 right-0 p-6 opacity-10 transition-transform duration-700 group-hover:scale-110">
            <AlertCircle className="h-32 w-32" />
          </div>
          <CardContent className="p-6 relative">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="h-4 w-4 text-amber-500" />
              <h3 className="text-xs font-black uppercase tracking-widest text-amber-500">Alur Prioritas Eksekutif AI</h3>
            </div>
            <p className="text-lg font-black leading-tight mb-4">
              Deteksi Kelangkaan Stok: Wilayah Sumatera Utara diprediksi mengalami defisit beras sebesar 15% pada Q3.
            </p>
            <div className="flex items-center justify-between">
              <div>
                <p className="mb-2 text-xs font-bold text-blue-400 uppercase tracking-wider text-left">Efisiensi Logistik</p>
                <p className="text-xs font-medium text-slate-400">Rekomendasi: Alihkan pasokan dari Sulawesi Tengah.</p>
              </div>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white font-black text-xs rounded-none px-6 shadow-lg">
                OPTIMASI SEKARANG
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 text-white rounded-none border-none overflow-hidden relative group cursor-pointer shadow-xl">
          <div className="absolute top-0 right-0 p-6 opacity-10 transition-transform duration-700 group-hover:scale-110">
            <Zap className="h-32 w-32" />
          </div>
          <CardContent className="p-6 relative">
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              <h3 className="text-xs font-black uppercase tracking-widest text-emerald-500">Audit Integritas Jaringan</h3>
            </div>
            <p className="text-lg font-black leading-tight mb-4">
              Anomali Harga Terdeteksi: 3 koperasi di Jawa Timur melaporkan harga beli di bawah batas equilibrium AI.
            </p>
            <div className="flex items-center justify-between">
              <div>
                <p className="mb-2 text-xs font-bold text-rose-400 uppercase tracking-wider text-left">Mitigasi Risiko</p>
                <p className="text-xs font-medium text-slate-400">Tindakan: Verifikasi batch pembelian manual diperlukan.</p>
              </div>
              <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-none px-6 shadow-lg">
                AUDIT BATCH
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
