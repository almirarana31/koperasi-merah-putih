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
} from 'lucide-react'
import { aiAnalyses } from '@/lib/mock-data'
import { KementerianFilterBar } from '@/components/dashboard/kementerian-filter-bar'
import { type ScopeFilters } from '@/lib/kementerian-dashboard-data'
import { useAuth } from '@/lib/auth/use-auth'
import { canAccessRoute } from '@/lib/rbac'

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
  { name: 'Presisi Tinggi (>90%)', value: 45, fill: '#DC3935' },
  { name: 'Stabil (80-90%)', value: 40, fill: '#006E9D' },
  { name: 'Perlu Audit (<80%)', value: 15, fill: '#BE5850' },
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
            <h1 className="text-2xl font-semibold  text-slate-900  flex items-center gap-2">
              <BrainCircuit className="h-6 w-6 text-slate-900" />
              National AI Command Hub
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Pusat Kendali Kecerdasan Buatan Untuk Optimasi Ekosistem Koperasi Nasional
            </p>
          </div>
          <div className="flex gap-2">
            {canOpenCommandCenter && (
              <Button
                variant="outline"
                className="h-9 border-[var(--dashboard-secondary-border)] bg-white px-4 text-xs font-semibold text-[var(--dashboard-secondary)] hover:bg-[var(--dashboard-secondary-muted)]"
                asChild
              >
                <Link href="/command-center">
                  <Activity className="mr-2 h-4 w-4" /> System Health
                </Link>
              </Button>
            )}
          </div>
        </div>

        <KementerianFilterBar filters={filters} setFilters={setFilters} />
      </div>

      {/* AI Models Executive Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {visibleAiModels.map((model) => (
          <Link href={model.href} key={model.id} className="group">
            <Card className="h-full overflow-hidden border border-[var(--dashboard-secondary-border)] bg-white shadow-[0_16px_30px_-24px_rgba(137,114,111,0.24)] transition-all group-hover:border-[var(--dashboard-secondary)]/30 group-hover:bg-white">
              <div className="h-1 w-full bg-[var(--dashboard-secondary-muted)] transition-colors group-hover:bg-[var(--dashboard-primary)]" />
              <CardHeader className="p-4 pb-2">
                <div className={`h-8 w-8 rounded-lg flex items-center justify-center mb-3 ${model.color}`}>
                  <model.icon className="h-4 w-4" />
                </div>
                <CardTitle className="text-sm font-semibold text-slate-900   leading-tight">
                  {model.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 pt-0 space-y-3">
                <p className="text-xs text-slate-500 leading-tight">{model.description}</p>
                <div className="flex items-center justify-between pt-2 border-t border-dashed border-slate-200">
                  <Badge variant="outline" className="h-5 border-[var(--dashboard-secondary-border)] px-1.5 text-xs font-semibold text-slate-700">Acc: {model.accuracy}</Badge>
                  <ArrowRight className="h-3 w-3 text-slate-300 transition-all group-hover:translate-x-1 group-hover:text-[var(--dashboard-primary)]" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Performance Matrix Section */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 border border-[var(--dashboard-secondary-border)] bg-white shadow-[0_16px_30px_-24px_rgba(137,114,111,0.24)]">
          <CardHeader className="border-b border-[var(--dashboard-secondary-border)] bg-[var(--dashboard-secondary-muted)]/45">
            <CardTitle className="text-sm font-semibold text-slate-900">Model Performance Matrix</CardTitle>
            <CardDescription className="text-xs text-slate-500">Cross-Functional Accuracy & Impact Audit</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="model" tick={{ fill: "#64748b", fontSize: 9, fontWeight: 600 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#64748b", fontSize: 9, fontWeight: 600 }} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#ffffff", border: "1px solid var(--dashboard-secondary-border)", borderRadius: "10px", color: "#0f172a", boxShadow: "0 18px 30px -24px rgba(137,114,111,0.28)" }}
                  itemStyle={{ fontSize: "10px", fontWeight: 600, color: "#334155" }}
                  cursor={{ fill: '#f8fafc' }}
                />
                <Legend iconType="rect" wrapperStyle={{ paddingTop: "20px", fontSize: "10px", fontWeight: 600, color: "#64748b" }} />
                <Bar dataKey="accuracy" fill="#DC3935" name="Accuracy" radius={[2, 2, 0, 0]} barSize={32} />
                <Bar dataKey="confidence" fill="#006E9D" name="Confidence" radius={[2, 2, 0, 0]} barSize={32} />
                <Bar dataKey="impact" fill="#BE5850" name="Impact" radius={[2, 2, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border border-[var(--dashboard-secondary-border)] bg-white shadow-[0_16px_30px_-24px_rgba(137,114,111,0.24)]">
          <CardHeader className="border-b border-[var(--dashboard-secondary-border)] bg-[var(--dashboard-secondary-muted)]/45">
            <CardTitle className="text-sm font-semibold text-slate-900">Precision Distribution</CardTitle>
            <CardDescription className="text-xs text-slate-500">Aggregate Model Reliability Audit</CardDescription>
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
                  contentStyle={{ backgroundColor: "#ffffff", border: "1px solid var(--dashboard-secondary-border)", borderRadius: "10px", color: "#0f172a", boxShadow: "0 18px 30px -24px rgba(137,114,111,0.28)" }}
                  itemStyle={{ fontSize: "10px", fontWeight: 600, color: "#334155" }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-6 space-y-2">
              {accuracyDistribution.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between px-2">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full" style={{ backgroundColor: item.fill }} />
                    <span className="text-xs font-semibold text-slate-500">{item.name}</span>
                  </div>
                  <span className="text-xs font-semibold text-slate-900">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Strategic AI Insights Feed */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="overflow-hidden border border-[var(--dashboard-secondary-border)] bg-white shadow-[0_16px_30px_-24px_rgba(137,114,111,0.24)]">
          <CardHeader className="border-b border-[var(--dashboard-secondary-border)] bg-white">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold text-slate-900">
              <CheckCircle className="h-4 w-4 text-emerald-500" /> Recent Strategic Audits
            </CardTitle>
          </CardHeader>
          <CardContent className="divide-y divide-slate-100 bg-white p-0">
            {aiAnalyses.slice(0, 4).map((analysis) => (
              <div key={analysis.id} className="bg-white p-4 transition-colors hover:bg-slate-50">
                <div className="flex justify-between items-start mb-1">
                  <p className="text-xs font-semibold text-slate-900">{analysis.title}</p>
                  <span className="text-xs font-medium text-slate-400">{analysis.createdAt}</span>
                </div>
                <p className="mb-2 text-xs leading-tight text-slate-500">{analysis.description}</p>
                <Badge className="h-5 border-emerald-100 bg-emerald-50 px-1.5 text-xs font-semibold text-emerald-700">
                  {analysis.confidence}% Confidence Index
                </Badge>
              </div>
            ))}
          </CardContent>
          <div className="border-t border-[var(--dashboard-secondary-border)] bg-white p-3">
            <Button variant="ghost" className="h-8 w-full text-xs font-semibold text-slate-600 hover:bg-[var(--dashboard-secondary-muted)] hover:text-[var(--dashboard-primary)]" asChild>
              <Link href="/assistant">View National Analysis Logs</Link>
            </Button>
          </div>
        </Card>

        <Card className="flex flex-col justify-between border border-[var(--dashboard-secondary-border)] bg-white shadow-[0_16px_30px_-24px_rgba(137,114,111,0.24)]">
          <CardHeader className="border-b border-[var(--dashboard-secondary-border)] bg-[var(--dashboard-secondary-muted)]/45">
            <CardTitle className="flex items-center gap-2 text-sm font-semibold text-slate-900">
              <AlertCircle className="h-4 w-4 text-amber-500" /> AI Executive Priority Feed
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4 flex-1">
            <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl relative group overflow-hidden">
              <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-20 transition-opacity">
                <DollarSign className="h-12 w-12" />
              </div>
              <p className="mb-2 text-xs font-semibold text-emerald-600">Revenue Maximization</p>
              <p className="text-xs leading-relaxed text-slate-600">
                Recommend shifting <span className="font-semibold text-slate-900">Grade A Padi</span> pricing by +8.2% across West Java nodes to capture high seasonal inelasticity.
              </p>
            </div>
            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl relative group overflow-hidden">
              <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-20 transition-opacity">
                <Route className="h-12 w-12" />
              </div>
              <p className="mb-2 text-xs font-semibold text-blue-600">Logistics Efficiency</p>
              <p className="text-xs leading-relaxed text-slate-600">
                Freight consolidation in <span className="font-semibold text-slate-900">East Java Hub</span> can reduce deadhead mileage by 22% this week. Initiate route batching.
              </p>
            </div>
            <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl relative group overflow-hidden">
              <div className="absolute top-0 right-0 p-2 opacity-5 group-hover:opacity-20 transition-opacity">
                <AlertCircle className="h-12 w-12" />
              </div>
              <p className="mb-2 text-xs font-semibold text-rose-600">Risk Mitigation</p>
              <p className="text-xs leading-relaxed text-slate-600">
                Predicted shortage of <span className="font-semibold text-slate-900">Chili</span> in Central Java. Triggering strategic reserve movement from surplus nodes.
              </p>
            </div>
          </CardContent>
          <div className="border-t border-[var(--dashboard-secondary-border)] bg-white px-6 py-4">
            <p className="text-xs text-slate-500">
              Priority recommendations are updated automatically from the shared national analysis pipeline.
            </p>
          </div>
        </Card>
      </div>
    </div>
  )
}
