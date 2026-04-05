'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { CheckCircle, AlertCircle, Camera, Zap, BrainCircuit, Globe, ArrowUpRight, ShieldCheck, Microscope, History } from 'lucide-react'
import { KementerianFilterBar, type ScopeFilters } from '@/components/dashboard/kementerian-filter-bar'
import { Progress } from '@/components/ui/progress'

const gradingResults = [
  { batch: 'Batch 001 - Beras Grade A', province: 'JAWA BARAT', regency: 'CIANJUR', cooperative: 'KSP Bakti Mandiri', tanggal: '2024-03-05', jumlah: 500, gradingA: 485, gradingB: 12, gradingC: 3, accuracy: 97.8, waktu: '2.3 min', status: 'Selesai' },
  { batch: 'Batch 002 - Cabai Merah', province: 'JAWA TIMUR', regency: 'MALANG', cooperative: 'KUD Tani Makmur', tanggal: '2024-03-05', jumlah: 320, gradingA: 245, gradingB: 58, gradingC: 17, accuracy: 96.2, waktu: '1.8 min', status: 'Selesai' },
  { batch: 'Batch 003 - Wortel', province: 'JAWA TENGAH', regency: 'WONOSOBO', cooperative: 'Koptan Dieng Jaya', tanggal: '2024-03-06', jumlah: 650, gradingA: 568, gradingB: 72, gradingC: 10, accuracy: 98.1, waktu: '3.1 min', status: 'Selesai' },
]

const qualityMetrics = [
  { metrik: 'Size Consistency', nilai: 94 },
  { metrik: 'Color Spectrum', nilai: 92 },
  { metrik: 'Texture Density', nilai: 88 },
  { metrik: 'Surface Defects', nilai: 96 },
  { metrik: 'Freshness Index', nilai: 91 },
]

const timeComparison = [
  { metode: 'Manual Inspection', waktu: 45 },
  { metode: 'Semi-Automated', waktu: 28 },
  { metode: 'AI Computer Vision', waktu: 2.5 },
]

const gradingDistribution = [
  { name: 'Grade A', value: 72, fill: '#10b981' },
  { name: 'Grade B', value: 22, fill: '#f59e0b' },
  { name: 'Grade C', value: 6, fill: '#ef4444' },
]

export default function GradingKementerianPage() {
  const [filters, setFilters] = useState<ScopeFilters>({
    province: 'all',
    regency: 'all',
    village: 'all',
    cooperative: 'all',
  })

  const processedData = useMemo(() => {
    let scaleFactor = 1.0
    if (filters.cooperative !== 'all') scaleFactor = 0.05
    else if (filters.regency !== 'all') scaleFactor = 0.2
    else if (filters.province !== 'all') scaleFactor = 0.45

    const filtered = gradingResults.filter(item => {
      const matchProvince = filters.province === 'all' || item.province === filters.province
      const matchRegency = filters.regency === 'all' || item.regency === filters.regency
      const matchCoop = filters.cooperative === 'all' || item.cooperative === filters.cooperative
      return matchProvince && matchRegency && matchCoop
    })

    return {
      results: filtered.map(r => ({
        ...r,
        jumlah: Math.floor(r.jumlah * scaleFactor) + 1,
        gradingA: Math.floor(r.gradingA * scaleFactor) + 1,
        gradingB: Math.floor(r.gradingB * scaleFactor),
        gradingC: Math.floor(r.gradingC * scaleFactor),
      })),
      totalProcessed: Math.floor(1470 * scaleFactor) + 5,
      avgAccuracy: 97.4,
      gradeAPercent: 72,
    }
  }, [filters])

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tighter text-slate-900 uppercase flex items-center gap-2">
              <Microscope className="h-8 w-8 text-slate-900" />
              Automated QC & Grading Audit
            </h1>
            <p className="text-slate-500 font-medium">
              Sistem verifikasi kualitas komoditas nasional berbasis Computer Vision AI.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="font-bold border-2">
              <History className="mr-2 h-4 w-4" /> BATCH ARCHIVE
            </Button>
            <Button className="bg-slate-900 font-bold">
              <Camera className="mr-2 h-4 w-4" /> LIVE FEED
            </Button>
          </div>
        </div>

        <KementerianFilterBar onFilterChange={setFilters} />
      </div>

      {/* KPI Section */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-l-4 border-l-slate-900 shadow-sm">
          <CardHeader className="pb-2">
            <CardDescription className="text-[10px] font-black uppercase tracking-widest text-slate-500">Total Batches Audited</CardDescription>
            <CardTitle className="text-2xl font-black text-slate-900">{processedData.totalProcessed.toLocaleString()}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[10px] font-black text-slate-500 uppercase">National Quality Pipeline</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-500 shadow-sm">
          <CardHeader className="pb-2">
            <CardDescription className="text-[10px] font-black uppercase tracking-widest text-slate-500">Average AI Accuracy</CardDescription>
            <CardTitle className="text-2xl font-black text-slate-900">{processedData.avgAccuracy}%</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge className="bg-emerald-500 text-slate-900 font-black text-[10px] uppercase">
              <ShieldCheck className="mr-1 h-3 w-3" /> Certified Model
            </Badge>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500 shadow-sm">
          <CardHeader className="pb-2">
            <CardDescription className="text-[10px] font-black uppercase tracking-widest text-slate-500">Processing Speed</CardDescription>
            <CardTitle className="text-2xl font-black text-slate-900">2.4 <span className="text-sm font-bold text-slate-400">MIN</span></CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[10px] font-black text-blue-600 uppercase">18x Faster than Manual</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-slate-900 shadow-sm">
          <CardHeader className="pb-2">
            <CardDescription className="text-[10px] font-black uppercase tracking-widest text-slate-500">Premium Yield (A)</CardDescription>
            <CardTitle className="text-2xl font-black text-slate-900">{processedData.gradeAPercent}%</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={processedData.gradeAPercent} className="h-1.5 bg-slate-100" />
          </CardContent>
        </Card>
      </div>

      {/* Batch Results Table */}
      <Card className="border-2 shadow-sm overflow-hidden">
        <CardHeader className="border-b bg-slate-50/50">
          <CardTitle className="text-sm font-black uppercase tracking-tighter text-slate-900">Recent Automated Grading Batches</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100/50 border-b">
                  <th className="p-4 text-[10px] font-black uppercase text-slate-500">Batch Info</th>
                  <th className="p-4 text-[10px] font-black uppercase text-slate-500">Location</th>
                  <th className="p-4 text-[10px] font-black uppercase text-slate-500 text-center">Total Unit</th>
                  <th className="p-4 text-[10px] font-black uppercase text-slate-500 text-center text-emerald-600">Grade A</th>
                  <th className="p-4 text-[10px] font-black uppercase text-slate-500 text-center text-amber-600">Grade B</th>
                  <th className="p-4 text-[10px] font-black uppercase text-slate-500 text-center text-rose-600">Grade C</th>
                  <th className="p-4 text-[10px] font-black uppercase text-slate-500 text-right">Confidence</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {processedData.results.map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <p className="text-xs font-black text-slate-900 uppercase">{item.batch}</p>
                      <p className="text-[9px] font-bold text-slate-400 uppercase">{item.tanggal} • {item.waktu}</p>
                    </td>
                    <td className="p-4">
                      <p className="text-[10px] font-bold text-slate-700 uppercase">{item.province}</p>
                      <p className="text-[9px] font-bold text-slate-400 uppercase">{item.cooperative}</p>
                    </td>
                    <td className="p-4 text-center text-xs font-black text-slate-900">{item.jumlah}</td>
                    <td className="p-4 text-center text-xs font-black text-emerald-600">{item.gradingA}</td>
                    <td className="p-4 text-center text-xs font-black text-amber-600">{item.gradingB}</td>
                    <td className="p-4 text-center text-xs font-black text-rose-600">{item.gradingC}</td>
                    <td className="p-4 text-right">
                      <div className="flex flex-col items-end gap-1">
                        <span className="text-xs font-black text-slate-900">{item.accuracy}%</span>
                        <Progress value={item.accuracy} className="h-1 w-16" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Analysis Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-2 shadow-sm">
          <CardHeader className="border-b bg-slate-50/50">
            <CardTitle className="text-sm font-black uppercase tracking-tighter text-slate-900">AI Computer Vision Quality Metrics</CardTitle>
            <CardDescription className="text-[10px] font-bold uppercase text-slate-500">Model accuracy per assessment parameter</CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-5">
            {qualityMetrics.map((metric) => (
              <div key={metric.metrik} className="space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase text-slate-600">{metric.metrik}</span>
                  <span className="text-xs font-black text-slate-900">{metric.nilai}%</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-slate-900 transition-all duration-1000" 
                    style={{ width: `${metric.nilai}%` }}
                  />
                </div>
              </div>
            ))}
            <div className="pt-4 border-t mt-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-emerald-500" />
                <span className="text-[9px] font-black uppercase text-slate-500 tracking-widest">Model Compliance: ISO 9001-AI</span>
              </div>
              <Button variant="ghost" className="h-6 text-[9px] font-black uppercase text-slate-400">RECALIBRATE</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 shadow-sm">
          <CardHeader className="border-b bg-slate-50/50">
            <CardTitle className="text-sm font-black uppercase tracking-tighter text-slate-900">National Grade Distribution</CardTitle>
            <CardDescription className="text-[10px] font-bold uppercase text-slate-500">Aggregate quality breakdown across active regions</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={gradingDistribution}
                  cx="50%"
                  cy="45%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {gradingDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: "#0f172a", border: "none", borderRadius: "8px", color: "#fff" }}
                  itemStyle={{ fontSize: "10px", fontWeight: "900", textTransform: "uppercase" }}
                />
                <Legend verticalAlign="bottom" height={36} wrapperStyle={{ fontSize: "10px", fontWeight: "900", textTransform: "uppercase" }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Processing Comparison */}
      <Card className="border-2 shadow-sm">
        <CardHeader className="border-b bg-slate-50/50">
          <CardTitle className="text-sm font-black uppercase tracking-tighter text-slate-900">Processing Efficiency Analysis</CardTitle>
          <CardDescription className="text-[10px] font-bold uppercase text-slate-500">Audit of time-cost savings through AI integration</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={timeComparison} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
              <XAxis type="number" tick={{ fill: "#64748b", fontSize: 10, fontWeight: 800 }} axisLine={false} tickLine={false} />
              <YAxis dataKey="metode" type="category" tick={{ fill: "#64748b", fontSize: 10, fontWeight: 800 }} axisLine={false} tickLine={false} width={100} />
              <Tooltip 
                contentStyle={{ backgroundColor: "#0f172a", border: "none", borderRadius: "8px", color: "#fff" }}
                itemStyle={{ fontSize: "10px", fontWeight: "900", textTransform: "uppercase" }}
                formatter={(value: number) => `${value} MIN`}
              />
              <Bar dataKey="waktu" fill="#0f172a" radius={[0, 4, 4, 0]} name="PROCESSING TIME" barSize={32} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* AI Strategy Insights */}
      <Card className="border-2 border-slate-900 bg-slate-900 text-white overflow-hidden">
        <div className="flex">
          <div className="p-6 bg-purple-500 flex items-center justify-center">
            <Zap className="h-12 w-12 text-slate-900" />
          </div>
          <div className="p-6 flex-1 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black uppercase tracking-tighter">AI Quality Audit Summary</h3>
              <Badge className="bg-emerald-500 text-slate-900 font-black uppercase">Standard Compliant</Badge>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-3 bg-slate-800 rounded border border-slate-700">
                <p className="text-[10px] font-black text-purple-400 uppercase mb-1">Consistency Audit</p>
                <p className="text-xs font-medium text-slate-300">
                  Automated grading eliminated human bias in <span className="text-white font-bold">Grade B classification</span>. Standardized pricing enforcement is now possible across all cooperatives.
                </p>
              </div>
              <div className="p-3 bg-slate-800 rounded border border-slate-700">
                <p className="text-[10px] font-black text-emerald-400 uppercase mb-1">Economic Impact</p>
                <p className="text-xs font-medium text-slate-300">
                  Estimated Labor Savings: <span className="text-white font-bold">Rp 4.2jt/month/node</span>. Overall network quality trust index increased by <span className="text-white font-bold">22%</span>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

