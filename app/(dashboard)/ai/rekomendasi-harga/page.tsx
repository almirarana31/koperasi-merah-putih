'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { ArrowUp, ArrowDown, DollarSign, BrainCircuit, TrendingUp, Zap, History, Scale, ArrowUpRight } from 'lucide-react'
import { KementerianFilterBar } from '@/components/dashboard/kementerian-filter-bar'
import { type ScopeFilters } from '@/lib/kementerian-dashboard-data'
import { Progress } from '@/components/ui/progress'

const priceRecommendations = [
  { komoditas: 'Beras Grade A', hargaSaat: 8500, rekomendasi: 9200, min: 8200, max: 9800, demand: 'Tinggi', supply: 'Terbatas', action: 'Naik', potensialKenaikan: 8.2 },
  { komoditas: 'Cabai Merah', hargaSaat: 24000, rekomendasi: 22500, min: 21000, max: 26000, demand: 'Sedang', supply: 'Normal', action: 'Turun', potensialKenaikan: -6.25 },
  { komoditas: 'Wortel', hargaSaat: 5000, rekomendasi: 5800, min: 4800, max: 6500, demand: 'Tinggi', supply: 'Kurang', action: 'Naik', potensialKenaikan: 16.0 },
  { komoditas: 'Tomat', hargaSaat: 3500, rekomendasi: 3200, min: 2800, max: 4200, demand: 'Rendah', supply: 'Tinggi', action: 'Turun', potensialKenaikan: -8.57 },
]

const marketTrendData = [
  { periode: 'Week 1', beras: 8200, cabai: 25000, wortel: 4800, tomat: 3800 },
  { periode: 'Week 2', beras: 8400, cabai: 24500, wortel: 5000, tomat: 3600 },
  { periode: 'Week 3', beras: 8700, cabai: 24000, wortel: 5300, tomat: 3400 },
  { periode: 'Week 4', beras: 8500, cabai: 23500, wortel: 5100, tomat: 3300 },
  { periode: 'Week 5', beras: 9000, cabai: 23000, wortel: 5500, tomat: 3200 },
  { periode: 'Week 6', beras: 9200, cabai: 22500, wortel: 5800, tomat: 3100 },
]

const demandSupplyData = [
  { komoditas: 'Beras A', demand: 85, supply: 45, optimal: 65 },
  { komoditas: 'Cabai', demand: 72, supply: 68, optimal: 70 },
  { komoditas: 'Wortel', demand: 90, supply: 40, optimal: 65 },
  { komoditas: 'Tomat', demand: 35, supply: 95, optimal: 65 },
]

export default function HargaRecommendationKementerianPage() {
  const [filters, setFilters] = useState<ScopeFilters>({
    provinceId: 'all',
    regionId: 'all',
    villageId: 'all',
    cooperativeId: 'all',
    commodityId: 'all',
  })
  const [selectedIdx, setSelectedIdx] = useState(0)

  const processedData = useMemo(() => {
    let priceShift = 1.0
    if (filters.provinceId !== 'all') priceShift = 1.05
    if (filters.regionId !== 'all') priceShift = 1.12
    if (filters.cooperativeId !== 'all') priceShift = 1.18

    return {
      recommendations: priceRecommendations.map(item => ({
        ...item,
        hargaSaat: item.hargaSaat * priceShift,
        rekomendasi: item.rekomendasi * priceShift,
        min: item.min * priceShift,
        max: item.max * priceShift,
      })),
      trends: marketTrendData.map(d => ({
        ...d,
        beras: d.beras * priceShift,
        cabai: d.cabai * priceShift,
        wortel: d.wortel * priceShift,
        tomat: d.tomat * priceShift,
      })),
      demandSupply: demandSupplyData.map(d => ({
        ...d,
        demand: Math.min(100, d.demand * priceShift),
        supply: Math.min(100, d.supply * priceShift),
        optimal: Math.min(100, d.optimal * priceShift),
      }))
    }
  }, [filters])

  const selectedItem = processedData.recommendations[selectedIdx]

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold  text-slate-900  flex items-center gap-2 leading-none">
              <Scale className="h-6 w-6 text-slate-900" />
              Dynamic Pricing Intelligence
            </h1>
            <p className="text-xs font-bold  text-slate-500  mt-2">
              REKOMENDASI HARGA STRATEGIS NASIONAL BERDASARKAN INDEKS SUPPLY-DEMAND REGIONAL
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="font-semibold border-2 text-xs  h-8  border-slate-200 px-3">
              <History className="mr-1.5 h-3.5 w-3.5" /> PRICE HISTORY
            </Button>
            <Button className="bg-slate-900 font-semibold text-xs  h-8  px-3">
              <Zap className="mr-1.5 h-3.5 w-3.5 text-amber-400" /> APPLY GLOBAL PRICING
            </Button>
          </div>
        </div>

        <KementerianFilterBar filters={filters} setFilters={setFilters} />
      </div>

      {/* KPI Section */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {processedData.recommendations.map((item, idx) => (
          <Card 
            key={item.komoditas} 
            className={`border-none transition-all cursor-pointer hover:bg-slate-50 group overflow-hidden ${selectedIdx === idx ? 'ring-2 ring-slate-900 bg-white shadow-md' : 'bg-white shadow-sm'}`}
            onClick={() => setSelectedIdx(idx)}
          >
            <div className={`h-1 w-full ${item.action === 'Naik' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
            <CardHeader className="pb-2 p-4">
              <CardDescription className="text-xs font-semibold   text-slate-500">{item.komoditas}</CardDescription>
              <CardTitle className="text-xl font-semibold text-slate-900 mt-1">
                Rp {Math.floor(item.rekomendasi).toLocaleString()}
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="flex items-center justify-between">
                <Badge className={`text-xs font-semibold  h-4 px-1.5 border-0 ${item.action === 'Naik' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                  {item.action === 'Naik' ? <ArrowUp className="h-2 w-2 mr-1" /> : <ArrowDown className="h-2 w-2 mr-1" />}
                  {Math.abs(item.potensialKenaikan).toFixed(1)}%
                </Badge>
                <span className="text-xs font-semibold text-slate-300  ">vs Rp {Math.floor(item.hargaSaat).toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-none shadow-sm">
          <CardHeader className="border-b border-slate-100 bg-slate-50/50">
            <CardTitle className="text-xs font-semibold   text-slate-900">National Market Price Trends</CardTitle>
            <CardDescription className="text-xs font-bold  text-slate-500 ">WEEKLY AGGREGATE PRICE MOVEMENT ACROSS REGIONS</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={processedData.trends}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="periode" tick={{ fill: "#64748b", fontSize: 9, fontWeight: 600 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#64748b", fontSize: 9, fontWeight: 600 }} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#0f172a", border: "none", borderRadius: "8px", color: "#fff" }}
                  itemStyle={{ fontSize: "9px", fontWeight: "600", textTransform: "" }}
                  formatter={(value: number) => `Rp ${Math.floor(value).toLocaleString()}`}
                />
                <Legend iconType="rect" wrapperStyle={{ paddingTop: "20px", fontSize: "9px", fontWeight: "600", textTransform: "" }} />
                <Line type="monotone" dataKey="beras" stroke="#0f172a" strokeWidth={3} dot={{ r: 4 }} name="BERAS" />
                <Line type="monotone" dataKey="cabai" stroke="#10b981" strokeWidth={3} dot={{ r: 4 }} name="CABAI" />
                <Line type="monotone" dataKey="wortel" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4 }} name="WORTEL" />
                <Line type="monotone" dataKey="tomat" stroke="#6366f1" strokeWidth={3} dot={{ r: 4 }} name="TOMAT" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm flex flex-col bg-white">
          <CardHeader className="border-b border-slate-100 bg-slate-50/50">
            <CardTitle className="text-xs font-semibold   text-slate-900">Optimization Matrix</CardTitle>
            <CardDescription className="text-xs font-bold  text-slate-500 ">SELECTED: {selectedItem.komoditas}</CardDescription>
          </CardHeader>
          <CardContent className="p-6 flex-1 flex flex-col justify-between">
            <div className="space-y-8">
              <div className="space-y-3">
                <div className="flex justify-between text-xs font-semibold  text-slate-400 ">
                  <span>PRICE FLOOR</span>
                  <span>CEILING</span>
                </div>
                <div className="h-4 w-full bg-slate-50 rounded-lg border border-slate-100 relative overflow-hidden">
                  <div className="absolute inset-y-0 bg-emerald-100 border-x border-emerald-200" style={{ left: '20%', right: '20%' }} />
                  <div className="absolute inset-y-0 w-1 bg-slate-900 z-10" style={{ left: '50%' }} />
                </div>
                <div className="flex justify-between text-xs font-semibold text-slate-900">
                  <span>RP {Math.floor(selectedItem.min).toLocaleString()}</span>
                  <span>RP {Math.floor(selectedItem.max).toLocaleString()}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="p-3 bg-slate-50/50 border border-slate-100 rounded-xl flex items-center justify-between group-hover:bg-white transition-colors">
                  <span className="text-xs font-semibold  text-slate-400 ">CURRENT MARKET</span>
                  <span className="text-xs font-semibold text-slate-900 leading-none">RP {Math.floor(selectedItem.hargaSaat).toLocaleString()}</span>
                </div>
                <div className="p-3 bg-slate-900 text-white rounded-xl flex items-center justify-between shadow-lg">
                  <span className="text-xs font-semibold  text-slate-400 ">AI RECOMMENDATION</span>
                  <span className="text-xs font-semibold text-emerald-400 leading-none">RP {Math.floor(selectedItem.rekomendasi).toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className="mt-8 space-y-4 pt-6 border-t border-slate-50">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 bg-emerald-50 rounded-xl flex items-center justify-center border border-emerald-100 shrink-0">
                  <DollarSign className="h-4 w-4 text-emerald-600" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-slate-400   leading-none mb-1">IMPACT ANALYSIS</p>
                  <p className="text-xs font-bold text-slate-700 leading-tight ">PROJECTED +RP {Math.floor(selectedItem.rekomendasi - selectedItem.hargaSaat).toLocaleString()}/UNIT IMPROVEMENT</p>
                </div>
              </div>
              <Button className="w-full font-semibold text-xs  bg-slate-900 h-10  hover:bg-slate-800 transition-all">
                IMPLEMENT STRATEGY
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-none shadow-sm overflow-hidden bg-white">
          <CardHeader className="border-b border-slate-100 bg-slate-50/50 p-4">
            <CardTitle className="text-xs font-semibold   text-slate-900 leading-none">Demand-Supply Equilibrium</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={processedData.demandSupply}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="komoditas" tick={{ fill: "#64748b", fontSize: 9, fontWeight: 600 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#64748b", fontSize: 9, fontWeight: 600 }} axisLine={false} tickLine={false} />
                <Tooltip 
                   contentStyle={{ backgroundColor: "#0f172a", border: "none", borderRadius: "8px", color: "#fff" }}
                   itemStyle={{ fontSize: "9px", fontWeight: "600", textTransform: "" }}
                />
                <Legend iconType="rect" wrapperStyle={{ paddingTop: "20px", fontSize: "9px", fontWeight: "600", textTransform: "" }} />
                <Bar dataKey="demand" fill="#10b981" name="DEMAND" radius={[2, 2, 0, 0]} barSize={24} />
                <Bar dataKey="supply" fill="#0f172a" name="SUPPLY" radius={[2, 2, 0, 0]} barSize={24} />
                <Bar dataKey="optimal" fill="#f59e0b" name="OPTIMAL" radius={[2, 2, 0, 0]} barSize={24} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-none bg-slate-900 text-white p-6 flex flex-col justify-between shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
            <BrainCircuit className="h-32 w-32 text-emerald-400" />
          </div>
          <div className="space-y-6 relative z-10">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-sm font-semibold   flex items-center gap-2 leading-none">
                <BrainCircuit className="h-5 w-5 text-emerald-400" />
                AI STRATEGY INSIGHT
              </h3>
              <Badge className="bg-emerald-500 text-slate-900 font-semibold text-xs  px-2 h-5 border-0">HIGH IMPACT</Badge>
            </div>
            <div className="space-y-4">
              <div className="space-y-1.5">
                <p className="text-xs font-semibold text-emerald-400  ">PRIMARY STRATEGY</p>
                <p className="text-xs font-bold text-slate-300 leading-relaxed  ">
                  <span className="text-white font-semibold underline decoration-emerald-400/50 underline-offset-2">BERAS GRADE A</span> SHOWS HIGH PRICE INELASTICITY IN CURRENT FILTER SCOPE. RECOMMEND +8% PRICE ADJUSTMENT TO CAPTURE CONSUMER SURPLUS WITHOUT VOLUME DROP.
                </p>
              </div>
              <div className="space-y-1.5">
                <p className="text-xs font-semibold text-amber-400  ">DEFENSIVE PLAY</p>
                <p className="text-xs font-bold text-slate-300 leading-relaxed  ">
                  <span className="text-white font-semibold underline decoration-amber-400/50 underline-offset-2">CABAI MERAH</span> SUPPLY IS PEAKING IN NEIGHBORING REGIONS. LOWER PRICE BY 6% PREEMPTIVELY TO PREVENT INVENTORY STALE-MATE.
                </p>
              </div>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between relative z-10">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-emerald-400" />
              <span className="text-xs font-semibold   text-emerald-400">AGGREGATE MARGIN LIFT: +14.2%</span>
            </div>
            <ArrowUpRight className="h-4 w-4 text-slate-500" />
          </div>
        </Card>
      </div>
    </div>
  )
}
