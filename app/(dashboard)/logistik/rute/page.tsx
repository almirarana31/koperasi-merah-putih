'use client'

import { useState, useMemo } from 'react'
import {
  MapPin,
  Navigation,
  Clock,
  Truck,
  ArrowRight,
  Plus,
  Search,
  Activity,
  Maximize2,
  Settings,
  ShieldCheck,
  Zap,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import { useAuth } from '@/lib/auth/use-auth'
import { KementerianFilterBar } from '@/components/dashboard/kementerian-filter-bar'
import { resolveOperationalFilters } from '@/lib/cross-entity-operations'
import type { ScopeFilters } from '@/lib/kementerian-dashboard-data'

const ruteData = [
  {
    id: 'RT001',
    nama: 'Rute Cianjur - Jakarta',
    jarak: '120 km',
    estimasiWaktu: '3-4 jam',
    titikAwal: 'Gudang Utama, Cianjur',
    titikAkhir: 'Jakarta Pusat',
    via: ['Tol Cipali', 'Tol Jakarta-Cikampek'],
    frekuensi: '3x/minggu',
    status: 'aktif',
    provinceId: '32',
    stops: [
      { nama: 'Gudang Utama', tipe: 'origin', alamat: 'Jl. Industri No. 1, Cianjur' },
      { nama: 'Tol Cipali Gate', tipe: 'checkpoint', alamat: 'Pintu Tol Cipali' },
      { nama: 'Rest Area KM 57', tipe: 'rest', alamat: 'Rest Area Cipali' },
      { nama: 'Tol Cikampek Gate', tipe: 'checkpoint', alamat: 'Pintu Tol Cikampek' },
      { nama: 'Gudang Transit Jakarta', tipe: 'destination', alamat: 'Jl. Pelabuhan No. 5' },
    ],
  },
  {
    id: 'RT002',
    nama: 'Rute Lembang - Cianjur',
    jarak: '45 km',
    estimasiWaktu: '1.5-2 jam',
    titikAwal: 'Cibodas, Lembang',
    titikAkhir: 'Gudang Utama, Cianjur',
    via: ['Jl. Raya Lembang', 'Jl. Raya Cianjur'],
    frekuensi: '2x/minggu',
    status: 'aktif',
    provinceId: '32',
    stops: [
      { nama: 'Lokasi Petani Lembang', tipe: 'origin', alamat: 'Cibodas, Lembang' },
      { nama: 'Pasar Lembang', tipe: 'pickup', alamat: 'Pasar Lembang' },
      { nama: 'Gudang Utama', tipe: 'destination', alamat: 'Jl. Industri No. 1, Cianjur' },
    ],
  },
  {
    id: 'RT003',
    nama: 'Rute Palabuhanratu - Cianjur',
    jarak: '80 km',
    estimasiWaktu: '2-3 jam',
    titikAwal: 'Pantai Indah, Palabuhanratu',
    titikAkhir: 'Cold Storage, Cianjur',
    via: ['Jl. Raya Sukabumi', 'Jl. Raya Cianjur'],
    frekuensi: '2x/minggu',
    status: 'aktif',
    provinceId: '32',
    stops: [
      { nama: 'TPI Palabuhanratu', tipe: 'origin', alamat: 'Tempat Pelelangan Ikan' },
      { nama: 'Checkpoint Sukabumi', tipe: 'checkpoint', alamat: 'Pos Polisi Sukabumi' },
      { nama: 'Cold Storage', tipe: 'destination', alamat: 'Jl. Industri No. 2, Cianjur' },
    ],
  },
]

export default function RutePage() {
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

  const scaleFactor = useMemo(() => {
    if (filters.cooperativeId !== 'all') return 0.05
    if (filters.villageId !== 'all') return 0.15
    if (filters.regionId !== 'all') return 0.4
    if (filters.provinceId !== 'all') return 0.7
    return 1.0
  }, [filters])

  const stats = useMemo(() => {
    const activeCorridors = Math.ceil(215 * scaleFactor)
    const totalDistance = Math.ceil(8420 * scaleFactor)
    const tripFreq = Math.ceil(1250 * scaleFactor)
    const efficiency = (88.4).toFixed(1)
    return { activeCorridors, totalDistance, tripFreq, efficiency }
  }, [scaleFactor])

  const filteredRute = ruteData.filter(r => {
    const matchesSearch = r.nama.toLowerCase().includes(search.toLowerCase()) || 
                         r.titikAwal.toLowerCase().includes(search.toLowerCase()) ||
                         r.titikAkhir.toLowerCase().includes(search.toLowerCase())
    const matchesScope = filters.provinceId === 'all' || r.provinceId === filters.provinceId
    return matchesSearch && matchesScope
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">KOMANDO JARINGAN RUTE</h1>
          <p className="text-[10px] font-black text-slate-500 mt-1 uppercase tracking-widest leading-relaxed">
            OPTIMASI KORIDOR & ANALITIK TOPOLOGI LOGISTIK • {stats.activeCorridors} KORIDOR NASIONAL AKTIF
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" className="h-9 text-[10px] font-black uppercase tracking-widest border-slate-200 text-slate-600 rounded-none" onClick={() => toast({ title: "Pemindaian Topologi", description: "Memetakan koridor distribusi nasional dan titik hambatan..." })}>
            <Maximize2 className="h-3.5 w-3.5 mr-2 text-blue-600" />
            PANDANGAN TOPOLOGI
          </Button>
          <Button size="sm" className="h-9 bg-slate-900 text-white hover:bg-slate-800 text-[10px] font-black uppercase tracking-widest px-6 rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] transition-all" onClick={() => toast({ title: "Pembuatan Koridor", description: "Membuka suite desain rute untuk koneksi klaster baru..." })}>
            <Plus className="h-4 w-4 mr-2" />
            DEFINISI KORIDOR
          </Button>
        </div>
      </div>

      <KementerianFilterBar filters={filters} setFilters={setFilters} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'KORIDOR AKTIF', value: stats.activeCorridors, sub: 'JALUR TERVERIFIKASI', icon: Navigation, tone: 'emerald' },
          { label: 'TOTAL JARINGAN', value: stats.totalDistance + ' KM', sub: 'JANGKAUAN OPERASIONAL', icon: MapPin, tone: 'blue' },
          { label: 'FREKUENSI PERJALANAN', value: stats.tripFreq, sub: 'MISI MINGGUAN', icon: Activity, tone: 'slate' },
          { label: 'EFISIENSI JARINGAN', value: stats.efficiency + '%', sub: 'OPTIMASI MUATAN', icon: Zap, tone: 'emerald' },
        ].map((s, i) => (
          <Card key={i} className="border-none shadow-sm bg-white overflow-hidden">
             <div className={`h-1 w-full ${
              s.tone === 'emerald' ? 'bg-emerald-500' : 
              s.tone === 'blue' ? 'bg-blue-500' : 'bg-slate-900'
            }`} />
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-10 w-10 rounded-none bg-slate-50 flex items-center justify-center shrink-0 shadow-inner">
                <s.icon className={`h-5 w-5 ${
                  s.tone === 'emerald' ? 'text-emerald-500' : 
                  s.tone === 'blue' ? 'text-blue-500' : 'text-slate-900'
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
                  placeholder="SEARCH CORRIDORS BY NAME, ORIGIN, OR DESTINATION POINT..."
                  className="pl-9 h-11 text-[10px] font-black uppercase tracking-widest bg-slate-50 border-slate-100 rounded-none focus-visible:ring-slate-900"
                />
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            {filteredRute.map((rute) => (
              <Card key={rute.id} className="border-none bg-white shadow-sm overflow-hidden hover:shadow-md transition-all group">
                <div className="h-1 w-full bg-slate-900" />
                <CardHeader className="p-4 pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-slate-900 text-white flex items-center justify-center rounded-none shadow-lg">
                        <Navigation className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle className="text-[11px] font-black text-slate-900 uppercase tracking-tight leading-tight">
                           {rute.nama}
                        </CardTitle>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                           {rute.titikAwal} → {rute.titikAkhir}
                        </p>
                      </div>
                    </div>
                    <Badge className="bg-emerald-100 text-emerald-700 text-[9px] font-black border-none px-2 h-4 uppercase rounded-none tracking-widest">
                       {rute.status.toUpperCase()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4 space-y-6">
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-50">
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">JARAK</p>
                      <p className="text-[10px] font-black text-slate-900 mt-1 uppercase">{rute.jarak}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">EST. WAKTU</p>
                      <p className="text-[10px] font-black text-slate-900 mt-1 uppercase">{rute.estimasiWaktu}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">FREKUENSI</p>
                      <p className="text-[10px] font-black text-slate-900 mt-1 uppercase">{rute.frekuensi}</p>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-100 space-y-3">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">TOPOLOGI JARINGAN</p>
                    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                      {rute.stops.map((stop, idx) => (
                        <div key={idx} className="flex items-center gap-2 shrink-0">
                          <div className={`flex items-center gap-2 px-2 py-1 rounded-none text-[9px] font-black uppercase tracking-tighter ${
                            stop.tipe === 'origin' ? 'bg-emerald-600 text-white' :
                            stop.tipe === 'destination' ? 'bg-blue-600 text-white' :
                            stop.tipe === 'pickup' ? 'bg-amber-600 text-white' :
                            'bg-slate-200 text-slate-500'
                          }`}>
                            <span>{stop.nama}</span>
                          </div>
                          {idx < rute.stops.length - 1 && (
                            <ArrowRight className="h-3 w-3 text-slate-300" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1 h-9 border-slate-200 text-slate-600 font-black text-[10px] uppercase tracking-widest rounded-none hover:bg-slate-50" onClick={() => toast({ title: "Visualisasi Peta", description: "Memproyeksikan koridor " + rute.id + " ke lapisan GIS nasional..." })}>
                       VISUALISASI PETA
                    </Button>
                    <Button className="flex-1 h-9 bg-slate-900 text-white font-black text-[10px] uppercase tracking-widest rounded-none hover:bg-slate-800 transition-all" onClick={() => toast({ title: "Re-Optimasi Rute", description: "Menghitung ulang parameter misi untuk koridor " + rute.id })}>
                       RE-OPTIMASI
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
                     <ShieldCheck className="h-4 w-4 text-emerald-500" /> NETWORK HEALTH
                  </CardTitle>
                  <div className="flex items-center gap-1.5">
                     <div className="h-1 w-1 bg-emerald-500 rounded-full animate-ping" />
                     <span className="text-[9px] font-black text-emerald-500 tracking-widest">STABLE</span>
                  </div>
               </div>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
               {[
                 { label: 'NODE UPTIME', val: '99.9%', status: 'Normal' },
                 { label: 'TRAFFIC LATENCY', val: '14 MIN', status: 'Low' },
                 { label: 'THROUGHPUT', val: '240 T/Day', status: 'Active' },
               ].map((h, i) => (
                  <div key={i} className="flex items-center justify-between">
                     <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{h.label}</span>
                     <div className="text-right">
                        <p className="text-[10px] font-black text-slate-200">{h.val}</p>
                        <p className="text-[8px] font-black text-emerald-500 uppercase tracking-tighter">{h.status}</p>
                     </div>
                  </div>
               ))}
               <div className="pt-4 border-t border-white/5">
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mb-3">ACTIVE NODES</p>
                  <div className="flex flex-wrap gap-1.5">
                     {['JKT-HUB', 'BDG-AGR', 'CJR-STO', 'SUB-HUB'].map(n => (
                        <Badge key={n} className="bg-slate-900 text-slate-400 text-[8px] font-black border border-white/10 rounded-none h-4">
                           {n}
                        </Badge>
                     ))}
                  </div>
               </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-slate-50 rounded-none">
             <CardHeader className="p-4 border-b border-slate-200">
                <CardTitle className="text-[10px] font-black uppercase tracking-widest text-slate-900">INFRASTRUCTURE AUDIT</CardTitle>
             </CardHeader>
             <CardContent className="p-4 space-y-4">
                <div className="flex items-center gap-3">
                   <div className="h-8 w-8 bg-slate-200 flex items-center justify-center text-slate-500">
                      <Settings className="h-4 w-4" />
                   </div>
                   <div className="flex-1">
                      <p className="text-[10px] font-black text-slate-900 uppercase">GIS ENGINE</p>
                      <p className="text-[9px] font-bold text-slate-500 uppercase">V2.4.0 ACTIVE</p>
                   </div>
                </div>
                <Button variant="outline" className="w-full h-8 text-[9px] font-black uppercase tracking-widest border-slate-200 rounded-none text-slate-600" onClick={() => toast({ title: "Infrastructure Report", description: "Generating national logistics asset inventory..." })}>
                   FULL SYSTEM REPORT
                </Button>
             </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
