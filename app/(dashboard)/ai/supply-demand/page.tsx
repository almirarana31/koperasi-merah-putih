'use client'

import { useMemo, useState } from 'react'
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import {
  AlertTriangle,
  BrainCircuit,
  Download,
  Package,
  ShoppingCart,
  Zap,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { KementerianFilterBar } from '@/components/dashboard/kementerian-filter-bar'
import type { ScopeFilters } from '@/lib/kementerian-dashboard-data'

const supplyDemandTrend = [
  { week: 'M1', supply: 120, demand: 109, gap: 11 },
  { week: 'M2', supply: 116, demand: 112, gap: 4 },
  { week: 'M3', supply: 110, demand: 124, gap: -14 },
  { week: 'M4', supply: 104, demand: 131, gap: -27 },
  { week: 'M5', supply: 100, demand: 134, gap: -34 },
  { week: 'M6', supply: 112, demand: 123, gap: -11 },
]

const commodityForecasts = [
  { name: 'Beras Grade A', supply: 120, demand: 138, gap: -18, confidence: 89, recommendation: 'Alihkan pasokan antar wilayah dan aktifkan cadangan.' },
  { name: 'Cabai Merah', supply: 28, demand: 22, gap: 6, confidence: 91, recommendation: 'Arahkan surplus ke wilayah defisit dan pasar modern.' },
  { name: 'Jagung', supply: 84, demand: 96, gap: -12, confidence: 86, recommendation: 'Percepat kontrak pasok dan pengiriman lintas provinsi.' },
  { name: 'Tomat', supply: 21, demand: 18, gap: 3, confidence: 80, recommendation: 'Dorong promo retail untuk menjaga perputaran stok.' },
]

const scenarioImpact = [
  { scenario: 'Surplus 20%', priceChange: -14, revenueIndex: 86 },
  { scenario: 'Surplus 10%', priceChange: -7, revenueIndex: 94 },
  { scenario: 'Seimbang', priceChange: 0, revenueIndex: 100 },
  { scenario: 'Defisit 10%', priceChange: 11, revenueIndex: 113 },
  { scenario: 'Defisit 20%', priceChange: 23, revenueIndex: 127 },
]

export default function SupplyDemandForecastKementerianPage() {
  const [filters, setFilters] = useState<ScopeFilters>({
    provinceId: 'all',
    regionId: 'all',
    villageId: 'all',
    cooperativeId: 'all',
    commodityId: 'all',
  })

  const scaleFactor = useMemo(() => {
    if (filters.cooperativeId !== 'all') return 0.08
    if (filters.villageId !== 'all') return 0.16
    if (filters.regionId !== 'all') return 0.32
    if (filters.provinceId !== 'all') return 0.5
    return 1
  }, [filters])

  const projectedData = useMemo(
    () => supplyDemandTrend.map((item) => ({
      ...item,
      supply: Math.round(item.supply * scaleFactor),
      demand: Math.round(item.demand * scaleFactor),
      gap: Math.round((item.supply - item.demand) * scaleFactor),
    })),
    [scaleFactor],
  )

  const commodityCards = useMemo(
    () =>
      commodityForecasts.map((item) => {
        const supply = Math.round(item.supply * scaleFactor)
        const demand = Math.round(item.demand * scaleFactor)
        const gap = supply - demand
        return { ...item, supply, demand, gap }
      }),
    [scaleFactor],
  )

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="flex items-center gap-2 text-3xl font-black tracking-tighter text-slate-900 uppercase">
              <BrainCircuit className="h-8 w-8 text-[var(--dashboard-secondary)]" />
              Supply & Demand Intelligence
            </h1>
            <p className="font-medium text-slate-500">
              Forecast nasional untuk keseimbangan pasokan, defisit komoditas, dan dampak harga.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="border-2 font-bold">
              <Download className="mr-2 h-4 w-4" /> Export Forecast
            </Button>
            <Button className="bg-[var(--dashboard-secondary)] font-bold text-white hover:bg-[#394B54]">
              <Zap className="mr-2 h-4 w-4" /> Recalculate AI
            </Button>
          </div>
        </div>

        <KementerianFilterBar filters={filters} setFilters={setFilters} />
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: 'Supply Nasional', value: `${projectedData.reduce((sum, item) => sum + item.supply, 0)} T`, icon: Package, tone: 'secondary' },
          { label: 'Demand Forecast', value: `${projectedData.reduce((sum, item) => sum + item.demand, 0)} T`, icon: ShoppingCart, tone: 'tertiary' },
          { label: 'Gap Bersih', value: `${projectedData.reduce((sum, item) => sum + item.gap, 0)} T`, icon: AlertTriangle, tone: 'primary' },
          { label: 'AI Confidence', value: '88%', icon: BrainCircuit, tone: 'secondary' },
        ].map((item) => (
          <Card key={item.label} className="border-slate-200 bg-white shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div className={`rounded-xl p-2 ${
                  item.tone === 'primary'
                    ? 'bg-[var(--dashboard-primary)]/10 text-[var(--dashboard-primary)]'
                    : item.tone === 'tertiary'
                      ? 'bg-[var(--dashboard-tertiary)]/20 text-[#8A5F00]'
                      : 'bg-[var(--dashboard-secondary)]/10 text-[var(--dashboard-secondary)]'
                }`}>
                  <item.icon className="h-5 w-5" />
                </div>
                <Badge className="border-none bg-slate-100 text-slate-600">{item.label}</Badge>
              </div>
              <p className="mt-4 text-3xl font-black tracking-tighter text-slate-950">{item.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <Card className="border-slate-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle>Neraca Supply vs Demand</CardTitle>
            <CardDescription>Proyeksi 6 minggu berdasarkan cakupan filter aktif.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={projectedData}>
                  <defs>
                    <linearGradient id="supplyArea" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#455A64" stopOpacity={0.2} />
                      <stop offset="95%" stopColor="#455A64" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="demandArea" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#D32F2F" stopOpacity={0.18} />
                      <stop offset="95%" stopColor="#D32F2F" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="week" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Area type="monotone" dataKey="supply" stroke="#455A64" fill="url(#supplyArea)" strokeWidth={3} />
                  <Area type="monotone" dataKey="demand" stroke="#D32F2F" fill="url(#demandArea)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white shadow-sm">
          <CardHeader>
            <CardTitle>Skenario Dampak Harga</CardTitle>
            <CardDescription>Model respons harga terhadap surplus dan defisit pasokan.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[320px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={scenarioImpact}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="scenario" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Bar dataKey="priceChange" name="Price Change (%)" radius={[8, 8, 0, 0]}>
                    {scenarioImpact.map((entry) => (
                      <Cell
                        key={entry.scenario}
                        fill={entry.priceChange > 0 ? '#D32F2F' : entry.priceChange < 0 ? '#FBC02D' : '#455A64'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-200 bg-white shadow-sm">
        <CardHeader>
          <CardTitle>Prioritas Komoditas</CardTitle>
          <CardDescription>AI menilai gap pasokan, keyakinan model, dan tindakan yang disarankan.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 lg:grid-cols-2">
          {commodityCards.map((commodity) => {
            const critical = commodity.gap < 0

            return (
              <div
                key={commodity.name}
                className={`rounded-2xl border p-5 ${
                  critical
                    ? 'border-[var(--dashboard-primary)]/20 bg-[var(--dashboard-primary)]/5'
                    : 'border-[var(--dashboard-secondary)]/15 bg-[var(--dashboard-secondary)]/5'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-sm font-black uppercase text-slate-900">{commodity.name}</h3>
                    <p className="mt-1 text-xs font-medium text-slate-500">{commodity.recommendation}</p>
                  </div>
                  <Badge className={critical ? 'bg-[var(--dashboard-primary)] text-white' : 'bg-[var(--dashboard-secondary)] text-white'}>
                    {critical ? 'Defisit' : 'Terkendali'}
                  </Badge>
                </div>

                <div className="mt-4 grid grid-cols-3 gap-3">
                  <div className="rounded-xl bg-white p-3">
                    <p className="text-[10px] font-black uppercase text-slate-400">Supply</p>
                    <p className="mt-1 text-lg font-black text-slate-900">{commodity.supply} T</p>
                  </div>
                  <div className="rounded-xl bg-white p-3">
                    <p className="text-[10px] font-black uppercase text-slate-400">Demand</p>
                    <p className="mt-1 text-lg font-black text-slate-900">{commodity.demand} T</p>
                  </div>
                  <div className="rounded-xl bg-white p-3">
                    <p className="text-[10px] font-black uppercase text-slate-400">Gap</p>
                    <p className={`mt-1 text-lg font-black ${critical ? 'text-[var(--dashboard-primary)]' : 'text-[var(--dashboard-secondary)]'}`}>
                      {commodity.gap > 0 ? '+' : ''}
                      {commodity.gap} T
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <p className="mb-2 text-[10px] font-black uppercase text-slate-400">Confidence</p>
                    <Progress value={commodity.confidence} className="h-2" />
                  </div>
                  <span className="text-sm font-black text-slate-900">{commodity.confidence}%</span>
                </div>
              </div>
            )
          })}
        </CardContent>
      </Card>
    </div>
  )
}
