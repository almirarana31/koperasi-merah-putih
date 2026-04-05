'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  LineChart, 
  Line, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts'
import { 
  TrendingUp, 
  TrendingDown, 
  AlertCircle, 
  Brain, 
  Globe, 
  Activity, 
  ShieldAlert,
  Download,
  FileText,
  PieChart,
  ArrowRight,
  Search,
} from 'lucide-react'
import { useAuth } from '@/lib/auth/use-auth'
import { KementerianFilterBar } from '@/components/dashboard/kementerian-filter-bar'
import { ScopeFilters } from '@/lib/kementerian-dashboard-data'

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
  { nama: 'Beras Grade A', current: 1250, forecast30: 3450, change: '+176%', trend: 'up', region: 'JAWA BARAT' },
  { nama: 'Cabai Merah', current: 480, forecast30: 720, change: '+50%', trend: 'up', region: 'SUMATERA UTARA' },
  { nama: 'Tomat', current: 320, forecast30: 280, change: '-12.5%', trend: 'down', region: 'BALI' },
  { nama: 'Wortel', current: 580, forecast30: 890, change: '+53%', trend: 'up', region: 'JAWA TENGAH' },
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
  const { user } = useAuth()
  const isKementerian = user?.role === 'kementerian'
  
  const [selectedKomoditas, setSelectedKomoditas] = useState('Beras Grade A')
  const [filters, setFilters] = useState<ScopeFilters>({
    provinceId: 'all',
    regionId: 'all',
    villageId: 'all',
    cooperativeId: 'all',
    commodityId: 'all',
  })

  const filteredForecast = useMemo(() => {
    return komoditasForecast.filter(item => {
      const matchesProvince = filters.provinceId === 'all' || item.region.includes(filters.provinceId.toUpperCase())
      const matchesCommodity = filters.commodityId === 'all' || item.nama.toUpperCase().includes(filters.commodityId.toUpperCase())
      return matchesProvince && matchesCommodity
    })
  }, [filters])

  const stats = useMemo(() => {
    const scale = filters.provinceId === 'all' ? 1 : 0.35
    return {
      nationalDemand: 42800 * scale,
      growthRate: 14.2,
      accuracy: 94.8
    }
  }, [filters])

  if (!user) return null

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-slate-900 flex items-center justify-center shadow-xl">
            <Brain className="h-6 w-6 text-emerald-500" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 uppercase">AI Demand Forecast</h1>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
              Predictive Market Intelligence • Data-Driven Supply Chain Management
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
           <Button variant="outline" size="sm" className="h-10 text-[10px] font-black uppercase tracking-widest text-slate-600 border-slate-200">
            <FileText className="h-4 w-4 mr-2 text-rose-600" />
            Forecast Report
          </Button>
          <Button size="sm" className="h-10 bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-black uppercase tracking-widest px-6 shadow-lg">
            <Activity className="h-4 w-4 mr-2" />
            Run Prediction
          </Button>
        </div>
      </div>

      {/* Kementerian Hierarchical Filter Bar */}
      <KementerianFilterBar filters={filters} setFilters={setFilters} />

      {/* High-Density KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Demand Agregat', value: stats.nationalDemand.toLocaleString(), sub: 'Unit/Bulan', icon: TrendingUp, color: 'text-slate-900' },
          { label: 'Proyeksi Pertumbuhan', value: stats.growthRate + '%', sub: 'YoY Forecast', icon: Activity, color: 'text-emerald-600' },
          { label: 'Model Accuracy', value: stats.accuracy + '%', sub: 'Confidence', icon: Brain, color: 'text-blue-600' },
          { label: 'Region Scope', value: filters.provinceId === 'all' ? 'Nasional' : filters.provinceId, sub: 'Coverage', icon: Globe, color: 'text-amber-600' },
        ].map((s, i) => (
          <Card key={i} className="border-none shadow-sm bg-white overflow-hidden">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg bg-slate-50 flex items-center justify-center">
                <s.icon className={`h-5 w-5 ${s.color}`} />
              </div>
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{s.label}</p>
                <div className="flex items-baseline gap-1">
                  <span className={`text-xl font-black tracking-tighter ${s.color}`}>{s.value}</span>
                  <span className="text-[10px] font-bold text-slate-500 uppercase">{s.sub}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
        <div className="space-y-6">
           {/* Forecast Area Chart */}
           <Card className="border-none shadow-sm overflow-hidden">
              <CardHeader className="p-6 border-b border-slate-50">
                 <div className="flex items-center justify-between">
                    <div>
                       <CardTitle className="text-xs font-black text-slate-900 uppercase tracking-widest">Analisis Tren & Proyeksi: {selectedKomoditas}</CardTitle>
                       <CardDescription className="text-[10px] font-bold text-slate-400 uppercase mt-1">Komparasi Data Aktual vs Machine Learning Prediction</CardDescription>
                    </div>
                    <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-100 text-[9px] font-black uppercase">MODEL: ARIMA-PROPHET</Badge>
                 </div>
              </CardHeader>
              <CardContent className="p-6">
                 <div className="h-[350px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={forecastData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorPrediksi" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="colorAktual" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#0f172a" stopOpacity={0.1} />
                            <stop offset="95%" stopColor="#0f172a" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                        <XAxis dataKey="hari" fontSize={9} fontWeight={900} axisLine={false} tickLine={false} />
                        <YAxis fontSize={9} fontWeight={900} axisLine={false} tickLine={false} />
                        <Tooltip 
                          contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', fontSize: '10px', fontWeight: 'bold' }}
                        />
                        <Area type="monotone" dataKey="aktual" stroke="#0f172a" strokeWidth={3} fill="url(#colorAktual)" name="Data Aktual" />
                        <Area type="monotone" dataKey="prediksi" stroke="#10b981" strokeWidth={3} fill="url(#colorPrediksi)" name="ML Forecast" />
                      </AreaChart>
                    </ResponsiveContainer>
                 </div>
              </CardContent>
           </Card>

           {/* Commodity Forecast Grid */}
           <div className="grid gap-4 md:grid-cols-2">
              {filteredForecast.map((item) => (
                <Card 
                  key={item.nama}
                  className={`group cursor-pointer border-none shadow-sm hover:shadow-xl transition-all border-t-4 ${
                    selectedKomoditas === item.nama ? 'border-t-emerald-500 bg-emerald-50/20' : 'border-t-slate-900 bg-white'
                  }`}
                  onClick={() => setSelectedKomoditas(item.nama)}
                >
                  <CardContent className="p-5">
                     <div className="flex items-start justify-between">
                        <div>
                           <h3 className="text-xs font-black text-slate-900 uppercase tracking-tight">{item.nama}</h3>
                           <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Region: {item.region}</p>
                        </div>
                        <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${item.trend === 'up' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                           {item.trend === 'up' ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                        </div>
                     </div>
                     
                     <div className="grid grid-cols-2 gap-4 mt-6">
                        <div>
                           <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Current Demand</p>
                           <p className="text-lg font-black text-slate-900 tracking-tighter">{item.current.toLocaleString()}</p>
                        </div>
                        <div className="text-right">
                           <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Forecast (30D)</p>
                           <p className={`text-lg font-black tracking-tighter ${item.trend === 'up' ? 'text-emerald-600' : 'text-rose-600'}`}>{item.forecast30.toLocaleString()}</p>
                        </div>
                     </div>

                     <div className="mt-4 flex items-center justify-between">
                        <Badge className={`text-[8px] font-black uppercase h-5 border-none ${
                          item.trend === 'up' ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
                        }`}>
                           GROWTH: {item.change}
                        </Badge>
                        <Button variant="ghost" className="h-6 text-[9px] font-black text-slate-400 group-hover:text-slate-900 transition-colors uppercase px-0">
                           Analyze Data <ArrowRight className="ml-1 h-3 w-3" />
                        </Button>
                     </div>
                  </CardContent>
                </Card>
              ))}
           </div>
        </div>

        {/* Intelligence Side Panel */}
        <div className="space-y-6">
           <Card className="border-none shadow-xl bg-slate-950 text-white overflow-hidden">
              <CardHeader className="p-5 border-b border-white/5 bg-slate-900/50">
                 <div className="flex items-center justify-between">
                    <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                       <PieChart className="h-4 w-4 text-emerald-500" /> INSIGHT FEED
                    </CardTitle>
                    <div className="flex items-center gap-1.5">
                       <div className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-ping" />
                       <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">LIVE</span>
                    </div>
                 </div>
              </CardHeader>
              <CardContent className="p-0">
                 <div className="divide-y divide-white/5">
                    {[
                      { type: 'OPPORTUNITY', title: 'Supply Gap: Beras A', region: 'Sumatera', impact: 'High' },
                      { type: 'RISK', title: 'Demand Drop: Tomat', region: 'Bali', impact: 'Medium' },
                      { type: 'ALERT', title: 'Price Volatility Spike', region: 'Jawa Timur', impact: 'High' },
                      { type: 'INSIGHT', title: 'Seasonal Trend Shift', region: 'Nasional', impact: 'Low' },
                    ].map((log, i) => (
                      <div key={i} className="p-5 hover:bg-white/5 transition-colors cursor-pointer group">
                         <div className="flex items-center justify-between mb-2">
                            <Badge className={`text-[8px] font-black uppercase px-1.5 h-4 border-none ${
                              log.type === 'RISK' || log.type === 'ALERT' ? 'bg-rose-600 text-white' : 'bg-emerald-600 text-white'
                            }`}>
                               {log.type}
                            </Badge>
                            <span className={`text-[8px] font-black uppercase ${log.impact === 'High' ? 'text-rose-400' : 'text-slate-500'}`}>IMPACT: {log.impact}</span>
                         </div>
                         <p className="text-[11px] font-black text-slate-200 uppercase leading-tight group-hover:text-emerald-400 transition-colors">{log.title}</p>
                         <p className="text-[9px] font-bold text-slate-500 uppercase mt-1 tracking-tighter">SCOPE: {log.region}</p>
                      </div>
                    ))}
                 </div>
                 <div className="p-4 bg-white/5 border-t border-white/5 text-center">
                    <Button variant="ghost" className="w-full text-[9px] font-black text-slate-500 hover:text-white uppercase tracking-widest h-10">
                       Buka Intelligence Center →
                    </Button>
                 </div>
              </CardContent>
           </Card>

           <Card className="border-none shadow-sm bg-slate-50">
              <CardHeader className="p-4 border-b border-slate-200">
                 <CardTitle className="text-[10px] font-black uppercase tracking-widest text-slate-900">AI Model Health</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                 {[
                   { label: 'MAE Score', val: '0.042', status: 'Stable' },
                   { label: 'Data Freshness', val: 'Real-time', status: 'Synced' },
                   { label: 'Processing Time', val: '124ms', status: 'Optimal' },
                 ].map((h, i) => (
                    <div key={i} className="flex items-center justify-between">
                       <span className="text-[10px] font-bold text-slate-500 uppercase">{h.label}</span>
                       <div className="text-right">
                          <p className="text-[10px] font-black text-slate-900 uppercase">{h.val}</p>
                          <p className="text-[8px] font-bold text-emerald-600 uppercase">{h.status}</p>
                       </div>
                    </div>
                 ))}
              </CardContent>
           </Card>
        </div>
      </div>

      {/* Critical AI Anomaly Banner */}
      <Card className="bg-rose-600 border-none overflow-hidden relative shadow-2xl shadow-rose-100 group cursor-pointer">
        <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform duration-700">
          <ShieldAlert className="h-32 w-32 text-white" />
        </div>
        <CardContent className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-8 relative">
          <div className="flex items-center gap-6">
             <div className="h-14 w-14 rounded-2xl bg-white/20 border border-white/10 flex items-center justify-center shrink-0">
                <Activity className="h-7 w-7 text-white animate-pulse" />
             </div>
             <div>
                <div className="flex items-center gap-3">
                   <Badge className="bg-white text-rose-600 font-black text-[9px] px-2 h-5 border-none">PREDICTIVE ALERT</Badge>
                   <span className="text-[10px] font-black text-rose-100 uppercase tracking-widest">Supply-Demand Mismatch Forecast (&gt;20%)</span>
                </div>
                <p className="text-white text-base font-black uppercase mt-2 tracking-tight">Perhatian: AI memprediksi kelangkaan stok Cabai Merah di wilayah Sumatera Utara dalam 14 hari ke depan.</p>
             </div>
          </div>
          <Button className="h-12 bg-white text-rose-600 hover:bg-slate-100 font-black text-[11px] uppercase tracking-widest px-8 rounded-xl shadow-xl transition-all">
             Optimasi Distribusi →
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
