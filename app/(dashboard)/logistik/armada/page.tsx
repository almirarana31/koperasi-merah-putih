'use client'

import { useState, useMemo } from 'react'
import {
  Truck,
  Wrench,
  Fuel,
  Calendar,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Settings,
  Search,
  Filter,
  Download,
  Activity,
  History,
  ShieldAlert,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import { useAuth } from '@/lib/auth/use-auth'
import { KementerianFilterBar } from '@/components/dashboard/kementerian-filter-bar'
import { resolveOperationalFilters } from '@/lib/cross-entity-operations'
import type { ScopeFilters } from '@/lib/kementerian-dashboard-data'

const armadaData = [
  {
    id: 'ARM001',
    nama: 'Truk Box 1',
    tipe: 'Truk Box',
    platNomor: 'B 1234 XYZ',
    kapasitas: '5 ton',
    tahun: 2021,
    driver: 'Pak Joko',
    status: 'operasional',
    kondisi: 85,
    km: 45000,
    serviceBerikutnya: '2024-03-15',
    fuelEfficiency: '8 km/liter',
    lastTrip: '2024-02-16',
    provinceId: '32', // Jawa Barat
  },
  {
    id: 'ARM002',
    nama: 'Pickup 1',
    tipe: 'Pickup',
    platNomor: 'B 5678 ABC',
    kapasitas: '1.5 ton',
    tahun: 2022,
    driver: 'Pak Surya',
    status: 'operasional',
    kondisi: 92,
    km: 28000,
    serviceBerikutnya: '2024-04-01',
    fuelEfficiency: '12 km/liter',
    lastTrip: '2024-02-15',
    provinceId: '32',
  },
  {
    id: 'ARM003',
    nama: 'Truk Box 2',
    tipe: 'Truk Box',
    platNomor: 'B 9012 DEF',
    kapasitas: '5 ton',
    tahun: 2020,
    driver: 'Pak Budi',
    status: 'service',
    kondisi: 70,
    km: 62000,
    serviceBerikutnya: '2024-02-20',
    fuelEfficiency: '7.5 km/liter',
    lastTrip: '2024-02-10',
    provinceId: '31', // DKI Jakarta
  },
  {
    id: 'ARM004',
    nama: 'Refrigerated Truck',
    tipe: 'Truk Berpendingin',
    platNomor: 'B 3456 GHI',
    kapasitas: '3 ton',
    tahun: 2023,
    driver: 'Pak Doni',
    status: 'operasional',
    kondisi: 98,
    km: 12000,
    serviceBerikutnya: '2024-05-01',
    fuelEfficiency: '6 km/liter',
    lastTrip: '2024-02-16',
    provinceId: '31',
  },
]

export default function ArmadaPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [filters, setFilters] = useState<ScopeFilters>({
    provinceId: 'all',
    regionId: 'all',
    villageId: 'all',
    cooperativeId: 'all',
    commodityId: 'all',
  })
  const [search, setSearch] = useState('')

  const scopedFilters = resolveOperationalFilters(user, filters)
  
  const scaleFactor = useMemo(() => {
    if (filters.cooperativeId !== 'all') return 0.05
    if (filters.villageId !== 'all') return 0.15
    if (filters.regionId !== 'all') return 0.4
    if (filters.provinceId !== 'all') return 0.7
    return 1.0
  }, [filters])

  const stats = useMemo(() => {
    const total = Math.ceil(armadaData.length * scaleFactor * 25) // Multiplying by 25 to simulate national scale
    const ops = Math.ceil(total * 0.82)
    const maint = Math.ceil(total * 0.12)
    const alert = total - ops - maint
    const cap = (142.5 * scaleFactor * 10).toFixed(1)
    return { total, ops, maint, alert, cap }
  }, [scaleFactor])

  const filteredArmada = armadaData.filter(a => {
    const matchesSearch = a.nama.toLowerCase().includes(search.toLowerCase()) || 
                         a.platNomor.toLowerCase().includes(search.toLowerCase()) ||
                         a.driver.toLowerCase().includes(search.toLowerCase())
    const matchesScope = filters.provinceId === 'all' || a.provinceId === filters.provinceId
    return matchesSearch && matchesScope
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">FLEET COMMAND CENTER</h1>
          <p className="text-[10px] font-black text-slate-500 mt-1 uppercase tracking-widest leading-relaxed">
            STRATEGIC ASSET MONITORING & MAINTENANCE AUDIT • {stats.total} TOTAL UNITS IN NATIONAL NETWORK
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" className="h-9 text-[10px] font-black uppercase tracking-widest border-slate-200 text-slate-600 rounded-none" onClick={() => toast({ title: "Maintenance Sync", description: "Fetching real-time unit health data..." })}>
            <History className="h-3.5 w-3.5 mr-2 text-blue-600" />
            HISTORY
          </Button>
          <Button size="sm" className="h-9 bg-slate-900 text-white hover:bg-slate-800 text-[10px] font-black uppercase tracking-widest px-6 rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] transition-all" onClick={() => toast({ title: "Unit Registration", description: "Opening secure asset onboarding portal..." })}>
            <Plus className="h-4 w-4 mr-2" />
            REGISTER UNIT
          </Button>
        </div>
      </div>

      <KementerianFilterBar filters={filters} setFilters={setFilters} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'TOTAL ARMADA', value: stats.total, sub: 'UNITS ENROLLED', icon: Truck, tone: 'slate' },
          { label: 'UNIT OPERASIONAL', value: stats.ops, sub: 'MISSION READY', icon: CheckCircle2, tone: 'emerald' },
          { label: 'MAINTENANCE', value: stats.maint, sub: 'ACTIVE SERVICE', icon: Wrench, tone: 'blue' },
          { label: 'CRITICAL ALERT', value: stats.alert, sub: 'IMMEDIATE AUDIT', icon: AlertTriangle, tone: 'rose' },
        ].map((s, i) => (
          <Card key={i} className="border-none shadow-sm bg-white overflow-hidden">
             <div className={`h-1 w-full ${
              s.tone === 'emerald' ? 'bg-emerald-500' : 
              s.tone === 'blue' ? 'bg-blue-500' : 
              s.tone === 'rose' ? 'bg-rose-500' : 'bg-slate-900'
            }`} />
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-10 w-10 rounded-none bg-slate-50 flex items-center justify-center shrink-0 shadow-inner">
                <s.icon className={`h-5 w-5 ${
                  s.tone === 'emerald' ? 'text-emerald-500' : 
                  s.tone === 'blue' ? 'text-blue-500' : 
                  s.tone === 'rose' ? 'text-rose-500' : 'text-slate-900'
                }`} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.label}</p>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-xl font-black text-slate-900">{s.value}</span>
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">{s.sub}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_350px]">
        <div className="space-y-6">
          <Card className="border-none bg-white shadow-sm overflow-hidden rounded-none">
            <div className="h-1 w-full bg-slate-900" />
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="SEARCH BY ASSET ID, PLATE NUMBER, OR OPERATOR NAME..."
                  className="pl-9 h-11 text-[10px] font-black uppercase tracking-widest bg-slate-50 border-slate-100 rounded-none focus-visible:ring-slate-900"
                />
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            {filteredArmada.map((armada) => (
              <Card key={armada.id} className="border-none bg-white shadow-sm overflow-hidden group hover:shadow-md transition-all">
                <div className={`h-1 w-full ${armada.status === 'operasional' ? 'bg-emerald-500' : 'bg-blue-500'}`} />
                <CardHeader className="p-4 pb-2">
                   <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                         <div className={`h-10 w-10 rounded-none flex items-center justify-center shadow-inner ${
                            armada.status === 'operasional' ? 'bg-emerald-600 text-white' : 'bg-blue-600 text-white'
                         }`}>
                            <Truck className="h-5 w-5" />
                         </div>
                         <div>
                            <CardTitle className="text-[11px] font-black text-slate-900 uppercase tracking-tight leading-tight">
                               {armada.nama}
                            </CardTitle>
                            <div className="flex items-center gap-2 mt-0.5">
                               <span className="text-[9px] font-black bg-slate-900 text-white px-1 py-0.5 tracking-tighter">{armada.platNomor}</span>
                               <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{armada.tipe}</span>
                            </div>
                         </div>
                      </div>
                      <Badge className={`h-4 text-[9px] font-black px-1.5 rounded-none border-none ${
                        armada.status === 'operasional' ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {armada.status.toUpperCase()}
                      </Badge>
                   </div>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                  <div className="grid grid-cols-2 gap-y-4 pt-2 border-t border-slate-50">
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">CAPACITY</p>
                      <p className="text-[10px] font-black text-slate-900 mt-1 uppercase">{armada.kapasitas}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">OPERATOR</p>
                      <p className="text-[10px] font-black text-slate-900 mt-1 uppercase">{armada.driver}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">USAGE</p>
                      <p className="text-[10px] font-black text-slate-900 mt-1 uppercase">{armada.km.toLocaleString()} KM</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">NEXT SVC</p>
                      <p className="text-[10px] font-black text-blue-600 mt-1 uppercase">{armada.serviceBerikutnya}</p>
                    </div>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-50">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">HEALTH INDEX</span>
                      <span className={`text-[10px] font-black ${
                        armada.kondisi >= 90 ? 'text-emerald-600' :
                        armada.kondisi >= 70 ? 'text-blue-600' : 'text-rose-600'
                      }`}>{armada.kondisi}%</span>
                    </div>
                    <Progress value={armada.kondisi} className="h-1.5 bg-slate-100 rounded-none [&>div]:bg-slate-900" />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button className="flex-1 h-9 bg-slate-900 text-white font-black text-[10px] uppercase tracking-widest rounded-none hover:bg-slate-800 transition-all" onClick={() => toast({ title: "Audit Hub", description: "Generating maintenance diagnostic report for " + armada.id })}>
                      AUDIT UNIT
                    </Button>
                    <Button variant="outline" className="h-9 w-9 p-0 border-slate-200 rounded-none hover:bg-slate-50" onClick={() => toast({ title: "Unit Config", description: "Accessing technical parameters for " + armada.id })}>
                      <Settings className="h-4 w-4 text-slate-600" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <Card className="border-none shadow-xl bg-slate-950 text-white overflow-hidden rounded-none">
            <CardHeader className="p-4 border-b border-white/5 bg-slate-900/50">
               <div className="flex items-center justify-between">
                  <CardTitle className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                     <Activity className="h-4 w-4 text-blue-500" /> MAINTENANCE FEED
                  </CardTitle>
                  <div className="flex items-center gap-1.5">
                     <div className="h-1 w-1 bg-blue-500 rounded-full animate-ping" />
                     <span className="text-[9px] font-black text-blue-500 tracking-widest">SYNCING</span>
                  </div>
               </div>
            </CardHeader>
            <CardContent className="p-0">
               <div className="divide-y divide-white/5">
                  {[
                    { time: '14:20', action: 'Engine Diagnostic: TRK-012', status: 'HEALTHY', unit: 'PASSED' },
                    { time: '13:15', action: 'Oil Pressure Alert: TRK-005', status: 'CRITICAL', unit: 'SERVICE' },
                    { time: '12:58', action: 'Tire Replacement: TRK-022', status: 'SCHEDULED', unit: 'TOMORROW' },
                    { time: '11:42', action: 'GPS Module Reset: TRK-008', status: 'RESOLVED', unit: 'STABLE' },
                  ].map((log, i) => (
                    <div key={i} className="p-4 hover:bg-white/5 transition-colors cursor-pointer group">
                       <div className="flex items-center justify-between mb-2">
                          <Badge className={`text-[9px] font-black px-1.5 h-4 border-none rounded-none tracking-widest ${
                            log.status === 'CRITICAL' ? 'bg-rose-600 text-white' : 
                            log.status === 'HEALTHY' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
                          }`}>
                             {log.status}
                          </Badge>
                          <span className="text-[9px] font-mono text-slate-600 group-hover:text-slate-400">{log.time}</span>
                       </div>
                       <p className="text-xs font-black text-slate-200 uppercase tracking-tight leading-tight">{log.action}</p>
                       <p className="text-[9px] font-bold text-slate-500 mt-1 uppercase">ASSET STATUS: {log.unit}</p>
                    </div>
                  ))}
               </div>
               <div className="p-4 bg-white/5 border-t border-white/5">
                  <Button variant="ghost" className="w-full text-[10px] font-black text-slate-500 hover:text-white uppercase tracking-widest h-9 rounded-none" onClick={() => toast({ title: "Master Schedule", description: "Loading national maintenance calendar..." })}>
                     FULL MAINTENANCE LOG →
                  </Button>
               </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-slate-50 rounded-none">
             <CardHeader className="p-4 border-b border-slate-200">
                <CardTitle className="text-[10px] font-black uppercase tracking-widest text-slate-900">FLEET CAPABILITY</CardTitle>
             </CardHeader>
             <CardContent className="p-4 space-y-4">
                {[
                  { label: 'TOTAL VOLUME', val: stats.cap + ' T', status: 'Available' },
                  { label: 'FUEL EFFICIENCY', val: '8.4 km/L', status: 'Avg' },
                  { label: 'UTILIZATION', val: '88.2%', status: 'Optimal' },
                ].map((h, i) => (
                   <div key={i} className="flex items-center justify-between">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{h.label}</span>
                      <div className="text-right">
                         <p className="text-[10px] font-black text-slate-900">{h.val}</p>
                         <p className="text-[9px] font-black text-blue-600 uppercase tracking-tighter">{h.status}</p>
                      </div>
                   </div>
                ))}
             </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
