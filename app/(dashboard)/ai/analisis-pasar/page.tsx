'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { TrendingUp, TrendingDown, AlertCircle, Lightbulb, BrainCircuit, Globe, Zap, History, BarChart3, Search, Share2, Target } from 'lucide-react'
import { KementerianFilterBar, type ScopeFilters } from '@/components/dashboard/kementerian-filter-bar'
import { Button } from '@/components/ui/button'

const marketTrends = [
  { metrik: 'National Rice Demand', tren: 'up', perubahan: '+34%', insight: 'Harvest season peak, surging B2B demand' },
  { metrik: 'Chili Price Index', tren: 'down', perubahan: '-12%', insight: 'Oversupply from non-member competitors' },
  { metrik: 'Carrot Export Orders', tren: 'up', perubahan: '+67%', insight: 'New international buyers onboarded' },
  { metrik: 'Buyer Trust Index', tren: 'up', perubahan: '+8%', insight: 'Quality consistency improvement' },
]

const competitorData = [
  { minggu: 'Week 1', kementerian: 45, corpA: 38, corpB: 32, corpC: 28 },
  { minggu: 'Week 2', kementerian: 52, corpA: 41, corpB: 35, corpC: 31 },
  { minggu: 'Week 3', kementerian: 58, corpA: 39, corpB: 38, corpC: 34 },
  { minggu: 'Week 4', kementerian: 64, corpA: 42, corpB: 40, corpC: 36 },
]

const seasonalData = [
  { bulan: 'Jan', paddy: 35, meat: 42, vegetable: 38, fruit: 28 },
  { bulan: 'Feb', paddy: 38, meat: 45, vegetable: 40, fruit: 32 },
  { bulan: 'Mar', paddy: 42, meat: 48, vegetable: 45, fruit: 38 },
  { bulan: 'Apr', paddy: 48, meat: 50, vegetable: 52, fruit: 45 },
  { bulan: 'May', paddy: 58, meat: 52, vegetable: 68, fruit: 58 },
  { bulan: 'Jun', paddy: 72, meat: 54, vegetable: 75, fruit: 68 },
]

export default function MarketAnalysisKementerianPage() {
  const [filters, setFilters] = useState<ScopeFilters>({
    provinceId: 'all',
    regionId: 'all',
    villageId: 'all',
    cooperativeId: 'all',
    commodityId: 'all',
  })

  const processedData = useMemo(() => {
    let scaleFactor = 1.0
    if (filters.cooperativeId !== 'all') scaleFactor = 0.1
    else if (filters.regionId !== 'all') scaleFactor = 0.3
    else if (filters.provinceId !== 'all') scaleFactor = 0.6

    return {
      trends: marketTrends.map(t => ({
        ...t,
        perubahan: t.tren === 'up' ? `+${(parseFloat(t.perubahan) * scaleFactor).toFixed(1)}%` : `-${(Math.abs(parseFloat(t.perubahan)) * scaleFactor).toFixed(1)}%`
      })),
      competitors: competitorData.map(d => ({
        ...d,
        kementerian: d.kementerian * scaleFactor,
        corpA: d.corpA * scaleFactor,
        corpB: d.corpB * scaleFactor,
        corpC: d.corpC * scaleFactor,
      })),
      seasonal: seasonalData.map(d => ({
        ...d,
        paddy: d.paddy * scaleFactor,
        meat: d.meat * scaleFactor,
        vegetable: d.vegetable * scaleFactor,
        fruit: d.fruit * scaleFactor,
      }))
    }
  }, [filters])

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-900 flex items-center gap-2">
              <BarChart3 className="h-8 w-8 text-slate-900" />
              Intelijen Pasar & Kompetitor Nasional
            </h1>
            <p className="text-slate-500 font-medium">
              Analisis sentimen pasar global dan audit kompetitif lintas korporasi secara real-time.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="font-bold border-2 rounded-none">
              <Share2 className="mr-2 h-4 w-4" /> Bagikan Laporan
            </Button>
            <Button className="bg-slate-900 font-bold rounded-none">
              <Search className="mr-2 h-4 w-4" /> Pencarian Mendalam
            </Button>
          </div>
        </div>

        <KementerianFilterBar filters={filters} setFilters={setFilters} />
      </div>

      {/* KPI Section - Market Health */}
      <div className="grid gap-4 md:grid-cols-4">
        {processedData.trends.map((trend) => (
          <Card key={trend.metrik} className="border-l-4 border-l-slate-900 shadow-sm rounded-none">
            <CardHeader className="pb-2 p-4">
              <div className="flex items-center justify-between mb-1">
                <CardDescription className="text-xs font-bold text-slate-500 uppercase tracking-wider">{trend.metrik}</CardDescription>
                {trend.tren === 'up' ? (
                  <TrendingUp className="h-4 w-4 text-emerald-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-rose-500" />
                )}
              </div>
              <CardTitle className={`text-2xl font-black ${trend.tren === 'up' ? 'text-emerald-600' : 'text-rose-600'}`}>
                {trend.perubahan}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="text-xs font-bold text-slate-400 leading-tight italic">
                "{trend.insight}"
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Competitive Analysis Section */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-2 shadow-sm rounded-none">
          <CardHeader className="border-b bg-slate-50/50">
            <CardTitle className="text-sm font-black text-slate-900">Dominasi Pangsa Pasar (vs Agregator Korporasi)</CardTitle>
            <CardDescription className="text-xs font-bold text-slate-500">Performa KOPDES dibandingkan Kompetitor Sektor Swasta</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={processedData.competitors}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="minggu" tick={{ fill: "#64748b", fontSize: 10, fontWeight: 800 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#64748b", fontSize: 10, fontWeight: 800 }} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#0f172a", border: "none", borderRadius: "0px", color: "#fff" }}
                  itemStyle={{ fontSize: "10px", fontWeight: "600", textTransform: "" }}
                />
                <Legend iconType="rect" wrapperStyle={{ paddingTop: "20px", fontSize: "10px", fontWeight: "600", textTransform: "" }} />
                <Line type="monotone" dataKey="kementerian" stroke="#0f172a" strokeWidth={4} dot={{ r: 6 }} name="KOPDES (Kementerian)" />
                <Line type="monotone" dataKey="corpA" stroke="#3b82f6" strokeWidth={2} name="KORPORASI A" />
                <Line type="monotone" dataKey="corpB" stroke="#f59e0b" strokeWidth={2} name="KORPORASI B" />
                <Line type="monotone" dataKey="corpC" stroke="#cbd5e1" strokeWidth={2} name="KORPORASI C" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-2 shadow-sm bg-slate-900 text-white rounded-none">
          <CardHeader className="border-b border-slate-800">
            <CardTitle className="text-sm font-black flex items-center gap-2">
              <Target className="h-4 w-4 text-emerald-400" />
              Target Pasar Strategis
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-3">
              <div className="p-3 bg-slate-800 rounded-none border border-slate-700">
                <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">Target 1: Premium Organik</p>
                <p className="text-xs font-medium text-slate-300">
                  Permintaan global untuk sertifikasi Organik melonjak <span className="text-white font-black">+45%</span>. AI menyarankan pengalihan 20% lahan koperasi ke Organik Tier-1.
                </p>
              </div>
              <div className="p-3 bg-slate-800 rounded-none border border-slate-700">
                <p className="text-xs font-bold text-blue-400 uppercase tracking-wider mb-1">Target 2: Hub Regional</p>
                <p className="text-xs font-medium text-slate-300">
                  Pangsa pasar <span className="text-white font-black">Jawa Timur</span> saat ini didominasi oleh Corp B. Rekomendasikan subsidi harga agresif untuk KUD lokal.
                </p>
              </div>
              <div className="p-3 bg-slate-800 rounded-none border border-slate-700">
                <p className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">Target 3: Pasokan Ekspor</p>
                <p className="text-xs font-medium text-slate-300">
                  Permintaan Timur Tengah untuk <span className="text-white font-black">Sayuran Olahan</span> belum terpenuhi. Peluang untuk fasilitas pengalengan berbasis koperasi.
                </p>
              </div>
            </div>
            <Button className="w-full bg-emerald-500 text-slate-900 font-bold text-xs h-10 hover:bg-emerald-600 rounded-none">
              UNDUH RINGKASAN STRATEGI
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Seasonal Analysis Section */}
      <Card className="border-2 shadow-sm rounded-none">
        <CardHeader className="border-b bg-slate-50/50">
          <CardTitle className="text-sm font-black text-slate-900">Siklus Permintaan & Produksi Musiman Nasional</CardTitle>
          <CardDescription className="text-xs font-bold text-slate-500">Menganalisis tren performa kategori selama 6 bulan</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={processedData.seasonal}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="bulan" tick={{ fill: "#64748b", fontSize: 10, fontWeight: 800 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#64748b", fontSize: 10, fontWeight: 800 }} axisLine={false} tickLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: "#0f172a", border: "none", borderRadius: "0px", color: "#fff" }}
                itemStyle={{ fontSize: "10px", fontWeight: "600", textTransform: "" }}
              />
              <Legend iconType="rect" wrapperStyle={{ paddingTop: "20px", fontSize: "10px", fontWeight: "600", textTransform: "" }} />
              <Bar dataKey="paddy" fill="#0f172a" name="PADI/BERAS" radius={[0, 0, 0, 0]} />
              <Bar dataKey="meat" fill="#3b82f6" name="DAGING/TERNAK" radius={[0, 0, 0, 0]} />
              <Bar dataKey="vegetable" fill="#10b981" name="SAYURAN" radius={[0, 0, 0, 0]} />
              <Bar dataKey="fruit" fill="#f59e0b" name="BUAH-BUAHAN" radius={[0, 0, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Footer AI Recommendation */}
      <Card className="border-2 border-slate-900 bg-slate-900 text-white rounded-none overflow-hidden">
        <div className="flex">
          <div className="p-6 bg-amber-500 flex items-center justify-center">
            <Lightbulb className="h-12 w-12 text-slate-900" />
          </div>
          <div className="p-6 flex-1 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black">Ringkasan Eksekutif AI: Sentimen Pasar</h3>
              <Badge className="bg-white text-slate-900 font-bold rounded-none">INTELIJEN TINDAKAN</Badge>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-3 bg-slate-800 rounded-none border border-slate-700">
                <p className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">Wawasan Kritis</p>
                <p className="text-xs font-medium text-slate-300">
                  <span className="text-white font-black">Permintaan Sayuran</span> diprediksi melonjak 75% dalam 60 hari ke depan. Produksi koperasi saat ini hanya di kapasitas 60%. AI menyarankan pemicuan insentif produksi darurat.
                </p>
              </div>
              <div className="p-3 bg-slate-800 rounded-none border border-slate-700">
                <p className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">Keunggulan Kompetitif</p>
                <p className="text-xs font-medium text-slate-300">
                  Efisiensi logistik KOPDES <span className="text-white font-black">14% lebih tinggi</span> dari Corp A. Gunakan keunggulan margin ini untuk mengamankan kontrak jangka panjang dengan jaringan Hotel & Restoran.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
