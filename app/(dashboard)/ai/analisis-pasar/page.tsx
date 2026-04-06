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
            <h1 className="text-3xl font-semibold  text-slate-900  flex items-center gap-2">
              <BarChart3 className="h-8 w-8 text-slate-900" />
              National Market & Competitor Intelligence
            </h1>
            <p className="text-slate-500 font-medium">
              Analisis sentimen pasar global dan audit kompetitif lintas korporasi.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="font-bold border-2">
              <Share2 className="mr-2 h-4 w-4" /> SHARE REPORT
            </Button>
            <Button className="bg-slate-900 font-bold">
              <Search className="mr-2 h-4 w-4" /> DEEP SEARCH
            </Button>
          </div>
        </div>

        <KementerianFilterBar filters={filters} setFilters={setFilters} />
      </div>

      {/* KPI Section - Market Health */}
      <div className="grid gap-4 md:grid-cols-4">
        {processedData.trends.map((trend) => (
          <Card key={trend.metrik} className="border-l-4 border-l-slate-900 shadow-sm">
            <CardHeader className="pb-2 p-4">
              <div className="flex items-center justify-between mb-1">
                <CardDescription className="text-xs font-semibold   text-slate-500">{trend.metrik}</CardDescription>
                {trend.tren === 'up' ? (
                  <TrendingUp className="h-4 w-4 text-emerald-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-rose-500" />
                )}
              </div>
              <CardTitle className={`text-2xl font-semibold ${trend.tren === 'up' ? 'text-emerald-600' : 'text-rose-600'}`}>
                {trend.perubahan}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="text-xs font-bold text-slate-400  leading-tight italic">
                "{trend.insight}"
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Competitive Analysis Section */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-2 shadow-sm">
          <CardHeader className="border-b bg-slate-50/50">
            <CardTitle className="text-sm font-semibold   text-slate-900">Market Share Dominance (vs. Corporate Aggregators)</CardTitle>
            <CardDescription className="text-xs font-bold  text-slate-500">KOPDES performance vs Private Sector Competitors</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={processedData.competitors}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="minggu" tick={{ fill: "#64748b", fontSize: 10, fontWeight: 800 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#64748b", fontSize: 10, fontWeight: 800 }} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#0f172a", border: "none", borderRadius: "8px", color: "#fff" }}
                  itemStyle={{ fontSize: "10px", fontWeight: "600", textTransform: "" }}
                />
                <Legend iconType="rect" wrapperStyle={{ paddingTop: "20px", fontSize: "10px", fontWeight: "600", textTransform: "" }} />
                <Line type="monotone" dataKey="kementerian" stroke="#0f172a" strokeWidth={4} dot={{ r: 6 }} name="KOPDES (MINISTRY)" />
                <Line type="monotone" dataKey="corpA" stroke="#3b82f6" strokeWidth={2} name="CORPORATE A" />
                <Line type="monotone" dataKey="corpB" stroke="#f59e0b" strokeWidth={2} name="CORPORATE B" />
                <Line type="monotone" dataKey="corpC" stroke="#cbd5e1" strokeWidth={2} name="CORPORATE C" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-2 shadow-sm bg-slate-900 text-white">
          <CardHeader className="border-b border-slate-800">
            <CardTitle className="text-sm font-semibold   flex items-center gap-2">
              <Target className="h-4 w-4 text-emerald-400" />
              Strategic Market Targets
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="space-y-3">
              <div className="p-3 bg-slate-800 rounded border border-slate-700">
                <p className="text-xs font-semibold text-emerald-400  mb-1">Target 1: Organic Premium</p>
                <p className="text-xs font-medium text-slate-300">
                  Global demand for Organic certification is surging <span className="text-white font-bold">+45%</span>. AI suggests shifting 20% of cooperative land to Organic Tier-1.
                </p>
              </div>
              <div className="p-3 bg-slate-800 rounded border border-slate-700">
                <p className="text-xs font-semibold text-blue-400  mb-1">Target 2: Regional Hubs</p>
                <p className="text-xs font-medium text-slate-300">
                  <span className="text-white font-bold">East Java</span> market share is currently dominated by Corp B. Recommend aggressive pricing subsidies for local KUDs.
                </p>
              </div>
              <div className="p-3 bg-slate-800 rounded border border-slate-700">
                <p className="text-xs font-semibold text-amber-400  mb-1">Target 3: Export Supply</p>
                <p className="text-xs font-medium text-slate-300">
                  Middle-East demand for <span className="text-white font-bold">Processed Vegetables</span> is unmet. Opportunity for cooperative-based canning facilities.
                </p>
              </div>
            </div>
            <Button className="w-full bg-emerald-500 text-slate-900 font-semibold text-xs  h-10 hover:bg-emerald-600">
              DOWNLOAD STRATEGY BRIEF
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Seasonal Analysis Section */}
      <Card className="border-2 shadow-sm">
        <CardHeader className="border-b bg-slate-50/50">
          <CardTitle className="text-sm font-semibold   text-slate-900">National Seasonal Demand & Production Cycles</CardTitle>
          <CardDescription className="text-xs font-bold  text-slate-500">Analyzing category performance trends over 6 months</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={processedData.seasonal}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="bulan" tick={{ fill: "#64748b", fontSize: 10, fontWeight: 800 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "#64748b", fontSize: 10, fontWeight: 800 }} axisLine={false} tickLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: "#0f172a", border: "none", borderRadius: "8px", color: "#fff" }}
                itemStyle={{ fontSize: "10px", fontWeight: "600", textTransform: "" }}
              />
              <Legend iconType="rect" wrapperStyle={{ paddingTop: "20px", fontSize: "10px", fontWeight: "600", textTransform: "" }} />
              <Bar dataKey="paddy" fill="#0f172a" name="PADDY/RICE" radius={[2, 2, 0, 0]} />
              <Bar dataKey="meat" fill="#3b82f6" name="MEAT/LIVESTOCK" radius={[2, 2, 0, 0]} />
              <Bar dataKey="vegetable" fill="#10b981" name="VEGETABLES" radius={[2, 2, 0, 0]} />
              <Bar dataKey="fruit" fill="#f59e0b" name="FRUITS" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Footer AI Recommendation */}
      <Card className="border-2 border-slate-900 bg-slate-900 text-white overflow-hidden">
        <div className="flex">
          <div className="p-6 bg-amber-500 flex items-center justify-center">
            <Lightbulb className="h-12 w-12 text-slate-900" />
          </div>
          <div className="p-6 flex-1 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold  ">AI Executive Summary: Market Sentiment</h3>
              <Badge className="bg-white text-slate-900 font-semibold">ACTIONABLE INTELLIGENCE</Badge>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-3 bg-slate-800 rounded border border-slate-700">
                <p className="text-xs font-semibold text-amber-400  mb-1">Critical Insight</p>
                <p className="text-xs font-medium text-slate-300">
                  <span className="text-white font-bold">Vegetable Demand</span> is predicted to surge 75% in the next 60 days. Current cooperative production is only at 60% capacity. AI recommends triggering emergency production incentives.
                </p>
              </div>
              <div className="p-3 bg-slate-800 rounded border border-slate-700">
                <p className="text-xs font-semibold text-emerald-400  mb-1">Competitive Edge</p>
                <p className="text-xs font-medium text-slate-300">
                  KOPDES logistics efficiency is <span className="text-white font-bold">14% higher</span> than Corp A. Use this margin advantage to secure long-term contracts with Hotel & Restaurant chains.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
