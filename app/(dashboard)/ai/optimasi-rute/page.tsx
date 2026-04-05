'use client'

import { useState, useMemo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { MapPin, Clock, Fuel, Truck, TrendingDown, Globe, Zap, Navigation, ArrowRight, ShieldCheck } from 'lucide-react'
import { KementerianFilterBar, type ScopeFilters } from '@/components/dashboard/kementerian-filter-bar'

const routeOptimizations = [
  { rute: 'Rute Utama (Medan - Bekasi)', jarak: 1250, waktuSebelum: 28, waktuSesudah: 22, biayaSebelum: 2500000, biayaSesudah: 1925000, penghematan: 575000, efisiensi: 23, status: 'Aktif' },
  { rute: 'Rute Timur (Surabaya - Jakarta)', jarak: 780, waktuSebelum: 18, waktuSesudah: 14, biayaSebelum: 1560000, biayaSesudah: 1216000, penghematan: 344000, efisiensi: 22, status: 'Aktif' },
  { rute: 'Rute Barat (Bandung - Jakarta)', jarak: 240, waktuSebelum: 6, waktuSesudah: 5, biayaSebelum: 480000, biayaSesudah: 405000, penghematan: 75000, efisiensi: 16, status: 'Pending' },
]

const trafficData = [
  { jam: '06:00', biayaSebelum: 450000, biayaSesudah: 380000 },
  { jam: '08:00', biayaSebelum: 580000, biayaSesudah: 465000 },
  { jam: '10:00', biayaSebelum: 520000, biayaSesudah: 425000 },
  { jam: '12:00', biayaSebelum: 490000, biayaSesudah: 405000 },
  { jam: '14:00', biayaSebelum: 510000, biayaSesudah: 420000 },
  { jam: '16:00', biayaSebelum: 620000, biayaSesudah: 510000 },
]

const stopPoints = [
  { nama: 'Gudang Pusat Regional', status: 'Origin', waktu: '06:00', index: 1 },
  { nama: 'Hub Logistik Province', status: 'Sorting', waktu: '07:30', index: 2 },
  { nama: 'Koperasi Produsen A', status: 'Pickup', waktu: '08:45', index: 3 },
  { nama: 'Koperasi Produsen B', status: 'Pickup', waktu: '10:15', index: 4 },
  { nama: 'Buyer Nasional (FMCG)', status: 'Dropoff', waktu: '12:00', index: 5 },
]

export default function RouteOptimizationKementerianPage() {
  const [filters, setFilters] = useState<ScopeFilters>({
    province: 'all',
    regency: 'all',
    village: 'all',
    cooperative: 'all',
  })

  const processedData = useMemo(() => {
    let scaleFactor = 1.0
    if (filters.cooperative !== 'all') scaleFactor = 0.1
    else if (filters.regency !== 'all') scaleFactor = 0.25
    else if (filters.province !== 'all') scaleFactor = 0.5

    return {
      optimizations: routeOptimizations.map(r => ({
        ...r,
        biayaSebelum: r.biayaSebelum * scaleFactor,
        biayaSesudah: r.biayaSesudah * scaleFactor,
        penghematan: r.penghematan * scaleFactor,
      })),
      traffic: trafficData.map(d => ({
        ...d,
        biayaSebelum: d.biayaSebelum * scaleFactor,
        biayaSesudah: d.biayaSesudah * scaleFactor,
      })),
      totalSavings: 994000 * scaleFactor,
      totalHours: 44 * scaleFactor,
      activeRoutes: Math.floor(12 * scaleFactor) + 1,
    }
  }, [filters])

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tighter text-slate-900 uppercase flex items-center gap-2">
              <Navigation className="h-8 w-8 text-slate-900" />
              National Logistics Optimizer
            </h1>
            <p className="text-slate-500 font-medium">
              Efisiensi rantai pasok nasional melalui algoritma optimasi rute dan armada.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="font-bold border-2">
              <Globe className="mr-2 h-4 w-4" /> FLEET MAP
            </Button>
            <Button className="bg-slate-900 font-bold">
              <Zap className="mr-2 h-4 w-4" /> RE-OPTIMIZE ALL
            </Button>
          </div>
        </div>

        <KementerianFilterBar onFilterChange={setFilters} />
      </div>

      {/* KPI Section */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="border-l-4 border-l-slate-900 shadow-sm">
          <CardHeader className="pb-2">
            <CardDescription className="text-[10px] font-black uppercase tracking-widest text-slate-500">Monthly Cost Savings</CardDescription>
            <CardTitle className="text-2xl font-black text-slate-900">
              Rp {processedData.totalSavings.toLocaleString()}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Badge className="bg-emerald-500 text-slate-900 font-black text-[10px] uppercase">
              <TrendingDown className="mr-1 h-3 w-3" /> -22% Cost Reduction
            </Badge>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500 shadow-sm">
          <CardHeader className="pb-2">
            <CardDescription className="text-[10px] font-black uppercase tracking-widest text-slate-500">Transit Time Reduction</CardDescription>
            <CardTitle className="text-2xl font-black text-slate-900">
              {processedData.totalHours.toFixed(1)} <span className="text-sm font-bold text-slate-400">HRS</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[10px] font-black text-slate-500 uppercase">Faster Delivery Cycles</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-emerald-500 shadow-sm">
          <CardHeader className="pb-2">
            <CardDescription className="text-[10px] font-black uppercase tracking-widest text-slate-500">Optimized Routes</CardDescription>
            <CardTitle className="text-2xl font-black text-slate-900">{processedData.activeRoutes}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[10px] font-black text-emerald-600 uppercase">Active Network Health: 100%</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-amber-500 shadow-sm">
          <CardHeader className="pb-2">
            <CardDescription className="text-[10px] font-black uppercase tracking-widest text-slate-500">Carbon Reduction</CardDescription>
            <CardTitle className="text-2xl font-black text-slate-900">14.2 <span className="text-sm font-bold text-slate-400">TONS</span></CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-[10px] font-black text-amber-600 uppercase">Estimated CO2 Saved</p>
          </CardContent>
        </Card>
      </div>

      {/* Optimized Routes Table */}
      <Card className="border-2 shadow-sm overflow-hidden">
        <CardHeader className="border-b bg-slate-50/50">
          <CardTitle className="text-sm font-black uppercase tracking-tighter text-slate-900">National Route Efficiency Matrix</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-100/50 border-b">
                  <th className="p-4 text-[10px] font-black uppercase text-slate-500">Strategic Route</th>
                  <th className="p-4 text-[10px] font-black uppercase text-slate-500">Distance</th>
                  <th className="p-4 text-[10px] font-black uppercase text-slate-500">Before (H)</th>
                  <th className="p-4 text-[10px] font-black uppercase text-slate-500">After (H)</th>
                  <th className="p-4 text-[10px] font-black uppercase text-slate-500 text-right">Cost Reduction</th>
                  <th className="p-4 text-[10px] font-black uppercase text-slate-500 text-right">Efficiency %</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {processedData.optimizations.map((route, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4">
                      <p className="text-xs font-black text-slate-900 uppercase">{route.rute}</p>
                    </td>
                    <td className="p-4 text-xs font-bold text-slate-700">{route.jarak} KM</td>
                    <td className="p-4 text-xs font-bold text-slate-400">{route.waktuSebelum}</td>
                    <td className="p-4 text-xs font-black text-emerald-600">{route.waktuSesudah}</td>
                    <td className="p-4 text-right text-xs font-black text-slate-900">
                      -Rp {route.penghematan.toLocaleString()}
                    </td>
                    <td className="p-4 text-right">
                      <Badge className="bg-slate-900 text-white font-black text-[10px]">
                        {route.efisiensi}%
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Analysis Charts Section */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2 border-2 shadow-sm">
          <CardHeader className="border-b bg-slate-50/50">
            <CardTitle className="text-sm font-black uppercase tracking-tighter text-slate-900">Cost Variance vs. Departure Time</CardTitle>
            <CardDescription className="text-[10px] font-bold uppercase text-slate-500">Optimizing dispatch windows to avoid congestion costs</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={processedData.traffic}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="jam" tick={{ fill: "#64748b", fontSize: 10, fontWeight: 800 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#64748b", fontSize: 10, fontWeight: 800 }} axisLine={false} tickLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: "#0f172a", border: "none", borderRadius: "8px", color: "#fff" }}
                  itemStyle={{ fontSize: "10px", fontWeight: "900", textTransform: "uppercase" }}
                  formatter={(value: number) => `Rp ${value.toLocaleString()}`}
                />
                <Legend iconType="rect" wrapperStyle={{ paddingTop: "20px", fontSize: "10px", fontWeight: "900", textTransform: "uppercase" }} />
                <Bar dataKey="biayaSebelum" fill="#cbd5e1" name="BEFORE OPTIMIZATION" radius={[2, 2, 0, 0]} />
                <Bar dataKey="biayaSesudah" fill="#0f172a" name="AFTER OPTIMIZATION" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-2 shadow-sm">
          <CardHeader className="border-b bg-slate-50/50">
            <CardTitle className="text-sm font-black uppercase tracking-tighter text-slate-900">Optimized Transit Logic</CardTitle>
            <CardDescription className="text-[10px] font-bold uppercase text-slate-500">Sequential stop-point intelligence</CardDescription>
          </CardHeader>
          <CardContent className="p-4">
            <div className="relative space-y-4">
              <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-slate-200 border-dashed" />
              {stopPoints.map((point, idx) => (
                <div key={idx} className="relative flex items-center gap-4 pl-8 group">
                  <div className="absolute left-2.5 h-3 w-3 rounded-full bg-slate-900 border-2 border-white ring-2 ring-slate-100 group-hover:scale-125 transition-transform" />
                  <div className="flex-1 p-2 bg-slate-50 rounded border group-hover:border-slate-900 transition-colors">
                    <div className="flex justify-between items-start">
                      <p className="text-[10px] font-black text-slate-900 uppercase">{point.nama}</p>
                      <span className="text-[9px] font-bold text-slate-400">{point.waktu}</span>
                    </div>
                    <Badge variant="outline" className="text-[8px] font-black uppercase border-slate-300 h-4">
                      {point.status}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 flex flex-col gap-2">
              <div className="flex items-center gap-2 p-3 bg-slate-900 text-white rounded-lg">
                <Truck className="h-4 w-4 text-emerald-400" />
                <div>
                  <p className="text-[9px] font-black uppercase text-slate-400 leading-none mb-1">Fleet Recommendation</p>
                  <p className="text-[11px] font-bold">Deploy 2 Large Freight Units (Consolidated)</p>
                </div>
              </div>
              <Button className="w-full font-black text-[10px] uppercase bg-slate-900">
                DISPATCH INSTRUCTION
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Performance Insight */}
      <Card className="border-2 border-slate-900 bg-slate-900 text-white overflow-hidden">
        <div className="flex">
          <div className="p-6 bg-blue-500 flex items-center justify-center">
            <Zap className="h-12 w-12 text-slate-900" />
          </div>
          <div className="p-6 flex-1 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black uppercase tracking-tighter">AI Network Optimization Summary</h3>
              <Badge className="bg-emerald-500 text-slate-900 font-black">EFFICIENCY GAIN: +23.4%</Badge>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-3 bg-slate-800 rounded border border-slate-700">
                <div className="flex items-center gap-2 mb-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" />
                  <p className="text-[10px] font-black text-slate-400 uppercase">Operational Integrity</p>
                </div>
                <p className="text-xs font-medium text-slate-300">
                  Consolidation logic successful. Estimated reduction of <span className="text-white font-bold">1,200KM</span> deadhead mileage across the filter scope this month.
                </p>
              </div>
              <div className="p-3 bg-slate-800 rounded border border-slate-700">
                <div className="flex items-center gap-2 mb-2">
                  <Fuel className="h-4 w-4 text-blue-400" />
                  <p className="text-[10px] font-black text-slate-400 uppercase">Resource Audit</p>
                </div>
                <p className="text-xs font-medium text-slate-300">
                   Fuel efficiency index improved by <span className="text-white font-bold">18.5%</span> through dynamic dispatching during non-peak congestion windows.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

