'use client'

import { useState, useMemo } from 'react'
import {
  Thermometer,
  Droplets,
  CheckCircle2,
  Warehouse,
  Zap,
  ShieldCheck,
  Snowflake,
  Activity,
  MapPin,
  AlertTriangle,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { KementerianFilterBar } from '@/components/dashboard/kementerian-filter-bar'
import { type ScopeFilters } from '@/lib/kementerian-dashboard-data'
import { Button } from '@/components/ui/button'

const coldStorageUnits = [
  { id: 'CS001', nama: 'Cold Room A', provinceId: 'p-jabar', regionId: 'r-cianjur', cooperativeId: 'coop-001', cooperative: 'KSP Bakti Mandiri', suhuTarget: 4, suhuAktual: 4.2, kelembaban: 85, kapasitas: 1000, terpakai: 650, status: 'normal', items: [{ nama: 'Cabai Merah', jumlah: 300, satuan: 'kg', masuk: '2024-02-14', kadaluarsa: '2024-02-28' }, { nama: 'Tomat', jumlah: 200, satuan: 'kg', masuk: '2024-02-15', kadaluarsa: '2024-02-25' }] },
  { id: 'CS002', nama: 'Cold Room B', provinceId: 'p-jatim', regionId: 'r-malang', cooperativeId: 'coop-002', cooperative: 'KUD Tani Makmur', suhuTarget: 2, suhuAktual: 2.1, kelembaban: 90, kapasitas: 500, terpakai: 300, status: 'normal', items: [{ nama: 'Ikan Tongkol', jumlah: 100, satuan: 'kg', masuk: '2024-02-16', kadaluarsa: '2024-02-23' }, { nama: 'Udang Vaname', jumlah: 80, satuan: 'kg', masuk: '2024-02-16', kadaluarsa: '2024-02-21' }] },
  { id: 'CS003', nama: 'Freezer Room', provinceId: 'p-jateng', regionId: 'r-wonosobo', cooperativeId: 'coop-003', cooperative: 'Koptan Dieng Jaya', suhuTarget: -18, suhuAktual: -17.5, kelembaban: 70, kapasitas: 500, terpakai: 180, status: 'warning', warningMessage: 'Suhu sedikit di atas target', items: [{ nama: 'Daging Ayam', jumlah: 100, satuan: 'kg', masuk: '2024-02-10', kadaluarsa: '2024-04-10' }] },
]

const expiringItems = [
  { nama: 'UDANG VANAME', lokasi: 'COLD ROOM B', node: 'KUD TANI MAKMUR', sisaHari: 4 },
  { nama: 'CUMI', lokasi: 'COLD ROOM B', node: 'KUD TANI MAKMUR', sisaHari: 5 },
  { nama: 'IKAN TONGKOL', lokasi: 'COLD ROOM B', node: 'KUD TANI MAKMUR', sisaHari: 6 },
  { nama: 'TOMAT', lokasi: 'COLD ROOM A', node: 'KSP BAKTI MANDIRI', sisaHari: 8 },
]

export default function ColdStorageKementerianPage() {
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

    const filteredUnits = coldStorageUnits.filter(u => {
      const matchProvince = filters.provinceId === 'all' || u.provinceId === filters.provinceId
      const matchRegency = filters.regionId === 'all' || u.regionId === filters.regionId
      const matchCoop = filters.cooperativeId === 'all' || u.cooperativeId === filters.cooperativeId
      return matchProvince && matchRegency && matchCoop
    })

    const totalKapasitas = Math.floor(2000 * scaleFactor) + 100
    const totalTerpakai = Math.floor(1130 * scaleFactor) + 50

    return {
      units: filteredUnits.map(u => ({ ...u, kapasitas: Math.floor(u.kapasitas * scaleFactor) + 10, terpakai: Math.floor(u.terpakai * scaleFactor) + 5 })),
      totalKapasitas,
      totalTerpakai,
      normalCount: filteredUnits.filter(u => u.status === 'normal').length,
      warningCount: filteredUnits.filter(u => u.status === 'warning').length,
    }
  }, [filters])

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black tracking-tighter text-slate-900 uppercase flex items-center gap-2 leading-none">
              <Snowflake className="h-6 w-6 text-slate-900" />
              National Cold-Storage Monitoring
            </h1>
            <p className="text-[10px] font-bold tracking-widest text-slate-500 uppercase mt-2">
              MONITORING SUHU DAN INTEGRITAS RANTAI DINGIN KOMODITAS SEGAR NASIONAL
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="font-black border-2 text-[9px] uppercase h-8 tracking-widest border-slate-200 px-3">
              <Activity className="mr-1.5 h-3.5 w-3.5 text-emerald-600" /> REAL-TIME SENSORS
            </Button>
            <Button className="bg-slate-900 font-black text-[9px] uppercase h-8 tracking-widest px-3">
              <Zap className="mr-1.5 h-3.5 w-3.5 text-amber-400" /> ENERGY AUDIT
            </Button>
          </div>
        </div>

        <KementerianFilterBar filters={filters} setFilters={setFilters} />
      </div>

      {/* KPI Section */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Card className="border-none shadow-sm">
          <CardContent className="p-4">
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1">ACTIVE FACILITIES</p>
            <CardTitle className="text-xl font-black text-slate-900">{processedData.units.length}</CardTitle>
            <p className="text-[8px] font-black text-slate-400 uppercase mt-1">NATIONAL COOLING NETWORK</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardContent className="p-4">
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1">AGGREGATE OCCUPANCY</p>
            <CardTitle className="text-xl font-black text-slate-900">
              {((processedData.totalTerpakai / processedData.totalKapasitas) * 100).toFixed(1)}%
            </CardTitle>
            <Progress value={(processedData.totalTerpakai / processedData.totalKapasitas) * 100} className="h-1 bg-blue-100 mt-2" />
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardContent className="p-4">
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1">THERMAL COMPLIANCE</p>
            <CardTitle className="text-xl font-black text-emerald-600">{processedData.normalCount}</CardTitle>
            <div className="flex items-center gap-1 text-[8px] font-black text-emerald-600 uppercase mt-1">
              <CheckCircle2 className="h-2 w-2" /> STABILIZED LOAD
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardContent className="p-4">
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-500 mb-1">ANOMALY ALERTS</p>
            <CardTitle className="text-xl font-black text-rose-600">{processedData.warningCount}</CardTitle>
            <p className="text-[8px] font-black text-rose-600 uppercase mt-1 tracking-tighter">REQUIRES IMMEDIATE CHECK</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid */}
      <div className="grid gap-6 lg:grid-cols-[1fr_350px]">
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
            <Warehouse className="h-4 w-4 text-slate-900" />
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-900">STRATEGIC COOLING NODES</h3>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            {processedData.units.map((unit) => (
              <Card key={unit.id} className={`border-none shadow-sm hover:bg-slate-50 transition-all overflow-hidden group ${unit.status === 'warning' ? 'ring-1 ring-rose-200' : ''}`}>
                <div className={`h-1 w-full ${unit.status === 'normal' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                <CardHeader className="p-4 bg-slate-50/30 border-b border-slate-100">
                  <div className="flex justify-between items-start">
                    <div>
                      <Badge className="bg-slate-900 text-white font-black text-[8px] uppercase mb-1 h-4 px-1.5">{unit.id}</Badge>
                      <CardTitle className="text-sm font-black text-slate-900 uppercase tracking-tighter leading-none">{unit.nama}</CardTitle>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">{unit.cooperative}</p>
                    </div>
                    <Badge className={`text-[8px] font-black uppercase h-4 px-1.5 border-0 ${unit.status === 'normal' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                      {unit.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-2.5 bg-blue-50/50 border border-blue-100 rounded-lg flex items-center gap-3 group-hover:bg-white transition-colors">
                      <Thermometer className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="text-[7px] font-black text-blue-400 uppercase leading-none mb-1">THERMAL</p>
                        <p className="text-xs font-black text-blue-900 leading-none">{unit.suhuAktual}°C</p>
                      </div>
                    </div>
                    <div className="p-2.5 bg-cyan-50/50 border border-cyan-100 rounded-lg flex items-center gap-3 group-hover:bg-white transition-colors">
                      <Droplets className="h-5 w-5 text-cyan-600" />
                      <div>
                        <p className="text-[7px] font-black text-cyan-400 uppercase leading-none mb-1">HUMIDITY</p>
                        <p className="text-xs font-black text-cyan-900 leading-none">{unit.kelembaban}%</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between text-[8px] font-black uppercase text-slate-400 tracking-widest">
                      <span>OCCUPANCY</span>
                      <span className="text-slate-900">{unit.terpakai} / {unit.kapasitas} KG</span>
                    </div>
                    <Progress value={(unit.terpakai / unit.kapasitas) * 100} className="h-1 bg-slate-100" />
                  </div>

                  <div className="pt-3 border-t border-dashed border-slate-100">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-2.5">STORED INVENTORY</p>
                    <div className="space-y-1.5">
                      {unit.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center text-[9px] font-bold text-slate-600 uppercase">
                          <span>{item.nama}</span>
                          <span className="text-slate-400 font-black tracking-tighter">{item.jumlah} {item.satuan}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Sidebar Monitoring */}
        <div className="space-y-6">
          <Card className="border-none shadow-sm overflow-hidden bg-white">
            <CardHeader className="bg-rose-50/50 border-b border-rose-100 p-4">
              <CardTitle className="text-[10px] font-black uppercase tracking-widest text-rose-900 flex items-center gap-2 leading-none">
                <AlertTriangle className="h-4 w-4 text-rose-600" /> CRITICAL EXPIRY WATCH
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100">
                {expiringItems.map((item, idx) => (
                  <div key={idx} className="p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex justify-between items-start mb-1.5">
                      <p className="text-[10px] font-black text-slate-900 uppercase tracking-tight leading-none">{item.nama}</p>
                      <Badge className="text-[8px] font-black text-rose-700 bg-rose-100 h-4 px-1.5 border-0 uppercase">{item.sisaHari} DAYS LEFT</Badge>
                    </div>
                    <div className="flex items-center gap-1.5 text-[8px] font-bold text-slate-400 uppercase tracking-tighter">
                      <MapPin className="h-2.5 w-2.5 text-slate-300" /> {item.lokasi} • {item.node}
                    </div>
                    <div className="mt-3 flex gap-1.5">
                      <Button variant="outline" className="h-7 flex-1 font-black text-[8px] uppercase border-2 border-slate-200">TRACING</Button>
                      <Button className="h-7 flex-1 font-black text-[8px] uppercase bg-slate-900">MARKET PUSH</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <div className="p-3 bg-slate-50 border-t border-slate-100">
              <Button variant="ghost" className="w-full h-7 text-[9px] font-black text-slate-500 hover:text-slate-900 uppercase tracking-widest">
                VIEW ALL EXPIRING STOCKS
              </Button>
            </div>
          </Card>

          <Card className="border-none bg-slate-900 text-white p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <ShieldCheck className="h-24 w-24 text-emerald-400" />
            </div>
            <div className="space-y-4 relative z-10">
              <h3 className="text-[11px] font-black uppercase tracking-widest flex items-center gap-2 leading-none border-b border-slate-800 pb-3">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                AI INTEGRITY AUDIT
              </h3>
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <p className="text-[8px] font-black text-emerald-400 uppercase tracking-widest">EFFICIENCY METRIC</p>
                  <p className="text-[10px] font-bold text-slate-300 leading-relaxed uppercase">
                    NATIONAL POWER CONSUMPTION IS <span className="text-white font-black">12% BELOW</span> LAST YEAR THROUGH AI CYCLING.
                  </p>
                </div>
                <div className="space-y-1.5">
                  <p className="text-[8px] font-black text-amber-400 uppercase tracking-widest">WASTE PREVENTION</p>
                  <p className="text-[10px] font-bold text-slate-300 leading-relaxed uppercase">
                    AI PREVENTED <span className="text-white font-black">1.4 TONS</span> OF WASTE THIS MONTH BY TRIGGERING EARLY PUSH.
                  </p>
                </div>
              </div>
              <Button className="w-full bg-emerald-500 text-slate-900 font-black text-[9px] uppercase h-9 hover:bg-emerald-400 mt-2 transition-all">
                ACCESS FULL NETWORK TELEMETRY
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
