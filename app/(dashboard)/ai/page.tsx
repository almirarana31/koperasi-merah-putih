'use client'

import { useState, useMemo } from 'react'
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
} from 'lucide-react'
import { aiAnalyses } from '@/lib/mock-data'
import { KementerianFilterBar } from '@/components/dashboard/kementerian-filter-bar'
import { type ScopeFilters } from '@/lib/kementerian-dashboard-data'

const aiModels = [
  { id: 'price-prediction', name: 'Dynamic Pricing', status: 'Active', accuracy: '87%', description: 'National price optimization engine', icon: DollarSign, color: 'bg-emerald-500/10 text-emerald-600 border-emerald-200', href: '/ai/rekomendasi-harga' },
  { id: 'demand-forecast', name: 'Supply & Demand', status: 'Active', accuracy: '92%', description: 'Aggregate surplus/deficit prediction', icon: TrendingUp, color: 'bg-blue-500/10 text-blue-600 border-blue-200', href: '/ai/supply-demand' },
  { id: 'quality-grading', name: 'AI Grading Audit', status: 'Active', accuracy: '95%', description: 'Network-wide quality standard verification', icon: Target, color: 'bg-amber-500/10 text-amber-600 border-amber-200', href: '/ai/grading' },
  { id: 'route-optimization', name: 'Logistics Optimizer', status: 'Active', accuracy: '88%', description: 'Strategic freight route optimization', icon: Route, color: 'bg-purple-500/10 text-purple-600 border-purple-200', href: '/ai/optimasi-rute' },
  { id: 'market-analysis', name: 'Market Intel', status: 'Active', accuracy: '90%', description: 'National market sentiment & share audit', icon: BarChart3, color: 'bg-cyan-500/10 text-cyan-600 border-cyan-200', href: '/ai/analisis-pasar' },
]

const performanceData = [
  { model: 'Pricing', accuracy: 87, confidence: 85, impact: 82 },
  { model: 'Supply', accuracy: 92, confidence: 90, impact: 88 },
  { model: 'Grading', accuracy: 95, confidence: 93, impact: 91 },
  { model: 'Logistics', accuracy: 88, confidence: 86, impact: 84 },
  { model: 'Market', accuracy: 90, confidence: 88, impact: 86 },
]

const accuracyDistribution = [
  { name: 'High Precision (>90%)', value: 45, fill: '#10b981' },
  { name: 'Reliable (80-90%)', value: 40, fill: '#3b82f6' },
  { name: 'Audit Required (<80%)', value: 15, fill: '#f59e0b' },
]

export default function AIIntelligenceHubPage() {
  const [filters, setFilters] = useState<ScopeFilters>({
    provinceId: 'all',
    regionId: 'all',
    villageId: 'all',
    cooperativeId: 'all',
    commodityId: 'all',
  })

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black tracking-tighter text-slate-900 uppercase flex items-center gap-2">
              <BrainCircuit className="h-6 w-6 text-slate-900" />
              National AI Command Hub
            </h1>
            <p className="text-[10px] font-bold tracking-widest text-slate-500 uppercase mt-2">
              PUSAT KENDALI INTELIGENSI BUATAN UNTUK OPTIMASI EKOSISTEM KOPERASI NASIONAL
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="font-black border-2 text-[10px] uppercase h-8 tracking-widest border-slate-200">
              <Activity className="mr-2 h-4 w-4" /> SYSTEM HEALTH
            </Button>
            <Button className="bg-slate-900 font-black text-[10px] uppercase h-8 tracking-widest">
              <Zap className="mr-2 h-4 w-4" /> RETRAIN MODELS
            </Button>
          </div>
        </div>

        <KementerianFilterBar filters={filters} setFilters={setFilters} />
      </div>

      {/* AI Models Executive Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {aiModels.map((model) => (
          <Link href={model.href} key={model.id} className="group">
            <Card className="border-none group-hover:bg-slate-50 transition-all h-full shadow-sm overflow-hidden">
              <div className="h-1 w-full bg-slate-100 group-hover:bg-slate-900 transition-colors" />
              <CardHeader className="p-4 pb-2">
                <div className={`h-8 w-8 rounded-lg flex items-center justify-center mb-3 ${model.color}`}>
                  <model.icon className="h-4 w-4" />
                </div>
                <CardTitle className="text-[11px] font-black text-slate-900 uppercase tracking-tighter leading-tight">
                  {model.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 space-y-3">
                <p className="text-[9px] font-bold text-slate-400 uppercase leading-tight">{model.description}</p>
                <div className="flex items-center justify-between pt-2 border-t border-dashed border-slate-200">
                  <Badge variant="outline" className="text-[8px] font-black uppercase border-slate-900 px-1.5 h-4">ACC: {model.accuracy}</Badge>
                  <ArrowRight className="h-3 w-3 text-slate-300 group-hover:text-slate-900 group-hover:translate-x-1 transition-all" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Performance Matrix Section */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-none shadow-sm">
          <CardHeader className="border-b border-slate-100 bg-slate-50/50">
            <CardTitle className="text-xs font-black uppercase tracking-widest text-slate-900">Model Performance Matrix</CardTitle>
            <CardDescription className="text-[9px] font-bold uppercase text-slate-500 tracking-tighter">CROSS-FUNCTIONAL ACCURACY & IMPACT AUDIT</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="model" tick={{ fill: "#64748b", fontSize: 9, fontWeight: 900 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#64748b", fontSize: 9, fontWeight: 900 }} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#0f172a", border: "none", borderRadius: "8px", color: "#fff" }}
                  itemStyle={{ fontSize: "9px", fontWeight: "900", textTransform: "uppercase" }}
                  cursor={{ fill: '#f8fafc' }}
                />
                <Legend iconType="rect" wrapperStyle={{ paddingTop: "20px", fontSize: "9px", fontWeight: "900", textTransform: "uppercase" }} />
                <Bar dataKey="accuracy" fill="#0f172a" name="ACCURACY" radius={[2, 2, 0, 0]} barSize={32} />
                <Bar dataKey="confidence" fill="#3b82f6" name="CONFIDENCE" radius={[2, 2, 0, 0]} barSize={32} />
                <Bar dataKey="impact" fill="#10b981" name="IMPACT" radius={[2, 2, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardHeader className="border-b border-slate-100 bg-slate-50/50">
            <CardTitle className="text-xs font-black uppercase tracking-widest text-slate-900">Precision Distribution</CardTitle>
            <CardDescription className="text-[9px] font-bold uppercase text-slate-500 tracking-tighter">AGGREGATE MODEL RELIABILITY AUDIT</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={accuracyDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {accuracyDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: "#0f172a", border: "none", borderRadius: "8px", color: "#fff" }}
                  itemStyle={{ fontSize: "9px", fontWeight: "900", textTransform: "uppercase" }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-6 space-y-2">
              {accuracyDistribution.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between px-2">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: item.fill }} />
                    <span className="text-[9px] font-black text-slate-500 uppercase tracking-tighter">{item.name}</span>
                  </div>
                  <span className="text-xs font-black text-slate-900">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Strategic AI Insights Feed */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="border-none shadow-sm overflow-hidden">
          <CardHeader className="border-b border-slate-100 bg-slate-900 text-white">
            <CardTitle className="text-[11px] font-black uppercase tracking-widest flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-emerald-400" /> RECENT STRATEGIC AUDITS
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 divide-y divide-slate-100">
            {aiAnalyses.slice(0, 4).map((analysis) => (
              <div key={analysis.id} className="p-4 hover:bg-slate-50 transition-colors">
                <div className="flex justify-between items-start mb-1">
                  <p className="text-[10px] font-black text-slate-900 uppercase tracking-tight">{analysis.title}</p>
                  <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">{analysis.createdAt}</span>
                </div>
                <p className="text-[10px] font-bold text-slate-500 leading-tight mb-2 uppercase">{analysis.description}</p>
                <Badge className="bg-emerald-50 text-emerald-700 font-black text-[8px] uppercase border-emerald-100 px-1.5 h-4">
                  {analysis.confidence}% CONFIDENCE INDEX
                </Badge>
              </div>
            ))}
          </CardContent>
          <div className="p-3 bg-slate-50 border-t border-slate-100">
            <Button variant="ghost" className="w-full h-6 text-[9px] font-black text-slate-600 hover:text-slate-900 uppercase tracking-widest">
              VIEW NATIONAL ANALYSIS LOGS
            </Button>
          </div>
        </Card>

        <Card className="border-none shadow-sm bg-slate-900 text-white flex flex-col justify-between">
          <CardHeader className="border-b border-slate-800">
            <CardTitle className="text-[11px] font-black uppercase tracking-widest flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-amber-400" /> AI EXECUTIVE PRIORITY FEED
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4 flex-1">
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl relative group overflow-hidden">
              <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-20 transition-opacity">
                <DollarSign className="h-12 w-12" />
              </div>
              <p className="text-[9px] font-black text-emerald-400 uppercase mb-2 tracking-widest">REVENUE MAXIMIZATION</p>
              <p className="text-[10px] font-bold text-slate-200 uppercase leading-relaxed tracking-tight">
                Recommend shifting <span className="text-white font-black">Grade A Padi</span> pricing by +8.2% across West Java nodes to capture high seasonal inelasticity.
              </p>
            </div>
            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl relative group overflow-hidden">
              <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-20 transition-opacity">
                <Route className="h-12 w-12" />
              </div>
              <p className="text-[9px] font-black text-blue-400 uppercase mb-2 tracking-widest">LOGISTICS EFFICIENCY</p>
              <p className="text-[10px] font-bold text-slate-200 uppercase leading-relaxed tracking-tight">
                Freight consolidation in <span className="text-white font-black">East Java Hub</span> can reduce deadhead mileage by 22% this week. Initiate route batching.
              </p>
            </div>
            <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl relative group overflow-hidden">
              <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-20 transition-opacity">
                <AlertCircle className="h-12 w-12" />
              </div>
              <p className="text-[9px] font-black text-rose-400 uppercase mb-2 tracking-widest">RISK MITIGATION</p>
              <p className="text-[10px] font-bold text-slate-200 uppercase leading-relaxed tracking-tight">
                Predicted shortage of <span className="text-white font-black">Chili</span> in Central Java. Triggering strategic reserve movement from surplus nodes.
              </p>
            </div>
          </CardContent>
          <div className="p-4 border-t border-slate-800 bg-slate-900/50">
            <Button className="w-full bg-white text-slate-900 font-black text-[10px] uppercase h-10 hover:bg-slate-100 tracking-widest transition-all">
              DEPLOY NATIONAL AI PROTOCOLS
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}
der-amber-500 bg-amber-50/50' :
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
