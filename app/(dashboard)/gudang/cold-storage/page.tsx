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
import { toast } from 'sonner'

const coldStorageUnits = [
  { id: 'CS-001', nama: 'Cold Room Alpha', provinceId: 'p-jabar', regionId: 'r-cianjur', cooperativeId: 'coop-001', cooperative: 'Koperasi Merah Putih Jabar', suhuTarget: 4, suhuAktual: 4.2, kelembaban: 85, kapasitas: 1000000, terpakai: 650000, status: 'normal', items: [{ nama: 'Cabai Merah', jumlah: 300000, satuan: 'kg', masuk: '2026-04-14', kadaluarsa: '2026-04-28' }, { nama: 'Tomat Kurma', jumlah: 200000, satuan: 'kg', masuk: '2026-04-15', kadaluarsa: '2026-04-25' }] },
  { id: 'CS-002', nama: 'Cold Room Beta', provinceId: 'p-jatim', regionId: 'r-malang', cooperativeId: 'coop-002', cooperative: 'Koperasi Merah Putih Jatim', suhuTarget: 2, suhuAktual: 2.1, kelembaban: 90, kapasitas: 500000, terpakai: 300000, status: 'normal', items: [{ nama: 'Ikan Tongkol', jumlah: 100000, satuan: 'kg', masuk: '2026-04-16', kadaluarsa: '2026-04-23' }, { nama: 'Udang Vaname', jumlah: 80000, satuan: 'kg', masuk: '2026-04-16', kadaluarsa: '2026-04-21' }] },
  { id: 'CS-003', nama: 'Freezer Room Omega', provinceId: 'p-jateng', regionId: 'r-wonosobo', cooperativeId: 'coop-003', cooperative: 'Koperasi Merah Putih Jateng', suhuTarget: -18, suhuAktual: -17.5, kelembaban: 70, kapasitas: 500000, terpakai: 180000, status: 'warning', warningMessage: 'Suhu sedikit di atas target nasional', items: [{ nama: 'Daging Ayam Karkas', jumlah: 100000, satuan: 'kg', masuk: '2026-04-10', kadaluarsa: '2026-06-10' }] },
]

const expiringItems = [
  { nama: 'UDANG VANAME EXPORT', lokasi: 'COLD ROOM BETA', node: 'HUB JATIM', sisaHari: 4 },
  { nama: 'CUMI-CUMI FILLET', lokasi: 'COLD ROOM BETA', node: 'HUB JATIM', sisaHari: 5 },
  { nama: 'IKAN TONGKOL SEGAR', lokasi: 'COLD ROOM BETA', node: 'HUB JATIM', sisaHari: 6 },
  { nama: 'TOMAT KURMA', lokasi: 'COLD ROOM ALPHA', node: 'HUB JABAR', sisaHari: 8 },
]

export default function ColdStorageKementerianPage() {
  const [filters, setFilters] = useState<ScopeFilters>({
    provinceId: 'all',
    regionId: 'all',
    villageId: 'all',
    cooperativeId: 'all',
    commodityId: 'all',
  })

  const scaleFactor = useMemo(() => {
    if (filters.cooperativeId !== 'all') return 0.05
    if (filters.villageId !== 'all') return 0.1
    if (filters.regionId !== 'all') return 0.25
    if (filters.provinceId !== 'all') return 0.5
    return 1.0
  }, [filters])

  const processedData = useMemo(() => {
    const filteredUnits = coldStorageUnits.filter(u => {
      const matchProvince = filters.provinceId === 'all' || u.provinceId === filters.provinceId
      const matchRegency = filters.regionId === 'all' || u.regionId === filters.regionId
      const matchCoop = filters.cooperativeId === 'all' || u.cooperativeId === filters.cooperativeId
      return matchProvince && matchRegency && matchCoop
    })

    const totalKapasitas = coldStorageUnits.reduce((acc, u) => acc + u.kapasitas, 0) * scaleFactor
    const totalTerpakai = coldStorageUnits.reduce((acc, u) => acc + u.terpakai, 0) * scaleFactor

    return {
      units: filteredUnits.map(u => ({ 
        ...u, 
        kapasitas: u.kapasitas * scaleFactor, 
        terpakai: u.terpakai * scaleFactor,
        items: u.items.map(i => ({ ...i, jumlah: i.jumlah * scaleFactor }))
      })),
      totalKapasitas,
      totalTerpakai,
      normalCount: filteredUnits.filter(u => u.status === 'normal').length,
      warningCount: filteredUnits.filter(u => u.status === 'warning').length,
    }
  }, [filters, scaleFactor])

  const handleAction = (action: string) => {
    toast.success(`Audit ${action} berhasil disinkronisasi ke pusat`)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
              <Snowflake className="h-7 w-7 text-slate-900" />
              Monitoring Rantai Dingin Nasional
            </h1>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-2">
              Audit Integritas Termal dan Kelembaban Komoditas Strategis Nasional
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              onClick={() => handleAction('Sensor')}
              className="rounded-none font-black border-2 text-[10px] uppercase tracking-widest h-10 border-slate-200 px-4"
            >
              <Activity className="mr-2 h-4 w-4 text-emerald-600" /> Sensor Real-Time
            </Button>
            <Button 
              onClick={() => handleAction('Energi')}
              className="rounded-none bg-slate-900 font-black text-[10px] uppercase tracking-widest h-10 px-6 text-white"
            >
              <Zap className="mr-2 h-4 w-4 text-amber-400" /> Audit Energi
            </Button>
          </div>
        </div>

        <KementerianFilterBar filters={filters} setFilters={setFilters} />
      </div>

      {/* KPI Section */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          { label: 'FASILITAS AKTIF', value: processedData.units.length, sub: 'SIMPUL PENDINGINAN NASIONAL', tone: 'slate' },
          { label: 'OKUPANSI AGREGAT', value: `${((processedData.totalTerpakai / processedData.totalKapasitas) * 100).toFixed(1)}%`, sub: 'PEMANFAATAN KAPASITAS', tone: 'blue', progress: (processedData.totalTerpakai / processedData.totalKapasitas) * 100 },
          { label: 'KEPATUHAN TERMAL', value: processedData.normalCount, sub: 'ZONA SUHU STABIL', tone: 'emerald' },
          { label: 'ALERTI ANOMALI', value: processedData.warningCount, sub: 'MEMBUTUHKAN TINDAKAN', tone: 'rose' },
        ].map((stat, i) => (
          <Card key={i} className="rounded-none border-none shadow-sm bg-white overflow-hidden">
            <div className={`h-1.5 w-full ${stat.tone === 'emerald' ? 'bg-emerald-500' : stat.tone === 'blue' ? 'bg-blue-500' : stat.tone === 'rose' ? 'bg-rose-500' : 'bg-slate-900'}`} />
            <CardContent className="p-4">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
              <CardTitle className={`text-2xl font-black ${stat.tone === 'emerald' ? 'text-emerald-600' : stat.tone === 'rose' ? 'text-rose-600' : 'text-slate-900'}`}>{stat.value}</CardTitle>
              {stat.progress !== undefined ? (
                <Progress value={stat.progress} className="h-1 bg-blue-100 mt-2 rounded-none" />
              ) : (
                <p className="text-[10px] font-black text-slate-400 mt-1 uppercase tracking-tighter">{stat.sub}</p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid gap-6 lg:grid-cols-[1fr_350px]">
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
            <Warehouse className="h-4 w-4 text-slate-900" />
            <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Simpul Pendinginan Strategis</h3>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2">
            {processedData.units.map((unit) => (
              <Card key={unit.id} className={`rounded-none border-none shadow-sm hover:shadow-md transition-all overflow-hidden group ${unit.status === 'warning' ? 'ring-2 ring-rose-500' : ''}`}>
                <div className={`h-1.5 w-full ${unit.status === 'normal' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                <CardHeader className="p-5 bg-slate-50/30 border-b border-slate-100">
                  <div className="flex justify-between items-start">
                    <div>
                      <Badge className="rounded-none bg-slate-900 text-white font-black text-[10px] uppercase tracking-widest mb-1 h-5 px-2">{unit.id}</Badge>
                      <CardTitle className="text-sm font-black text-slate-900 uppercase tracking-tight">{unit.nama}</CardTitle>
                      <p className="text-[10px] font-black text-slate-400 mt-1 uppercase tracking-widest">{unit.cooperative}</p>
                    </div>
                    <Badge className={`rounded-none text-[10px] font-black uppercase tracking-widest h-5 px-2 border-none ${unit.status === 'normal' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                      {unit.status.toUpperCase()}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-5 space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-blue-50/50 border border-blue-100 rounded-none flex items-center gap-3 group-hover:bg-white transition-colors">
                      <Thermometer className="h-6 w-6 text-blue-600" />
                      <div>
                        <p className="text-[8px] font-black text-blue-400 uppercase tracking-widest mb-1">SUHU AKTUAL</p>
                        <p className="text-sm font-black text-blue-900">{unit.suhuAktual}°C</p>
                      </div>
                    </div>
                    <div className="p-3 bg-cyan-50/50 border border-cyan-100 rounded-none flex items-center gap-3 group-hover:bg-white transition-colors">
                      <Droplets className="h-6 w-6 text-cyan-600" />
                      <div>
                        <p className="text-[8px] font-black text-cyan-400 uppercase tracking-widest mb-1">KELEMBABAN</p>
                        <p className="text-sm font-black text-cyan-900">{unit.kelembaban}%</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-400">
                      <span>OKUPANSI VOLUME</span>
                      <span className="text-slate-900">{(unit.terpakai / 1000).toLocaleString()} / {(unit.kapasitas / 1000).toLocaleString()} TON</span>
                    </div>
                    <Progress value={(unit.terpakai / unit.kapasitas) * 100} className="h-1.5 bg-slate-100 rounded-none" />
                  </div>

                  <div className="pt-4 border-t border-dashed border-slate-100">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3">INVENTARIS TERSIMPAN</p>
                    <div className="space-y-2">
                      {unit.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center text-[10px] font-black text-slate-600 uppercase tracking-tight">
                          <span>{item.nama}</span>
                          <span className="text-slate-400 font-black">{(item.jumlah / 1000).toLocaleString()} TON</span>
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
          <Card className="rounded-none border-none shadow-sm overflow-hidden bg-white border-t-4 border-t-rose-500">
            <CardHeader className="bg-rose-50/50 border-b border-rose-100 p-4">
              <CardTitle className="text-[10px] font-black text-rose-900 uppercase tracking-widest flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-rose-600" /> MONITORING KADALUARSA KRITIS
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100">
                {expiringItems.map((item, idx) => (
                  <div key={idx} className="p-5 hover:bg-slate-50 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <p className="text-xs font-black text-slate-900 uppercase tracking-tight">{item.nama}</p>
                      <Badge className="rounded-none text-[8px] font-black text-rose-700 bg-rose-100 h-5 px-2 border-none uppercase tracking-widest">{item.sisaHari} HARI LAGI</Badge>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      <MapPin className="h-3 w-3 text-slate-300" /> {item.lokasi} • {item.node}
                    </div>
                    <div className="mt-4 flex gap-2">
                      <Button 
                        variant="outline" 
                        onClick={() => handleAction('Tracing')}
                        className="h-9 flex-1 rounded-none font-black text-[10px] uppercase tracking-widest border-2 border-slate-200"
                      >TRACING</Button>
                      <Button 
                        onClick={() => handleAction('Market Push')}
                        className="h-9 flex-1 rounded-none font-black text-[10px] uppercase tracking-widest bg-slate-900 text-white"
                      >MARKET PUSH</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <div className="p-4 bg-slate-50 border-t border-slate-100">
              <Button 
                variant="ghost" 
                onClick={() => handleAction('View All')}
                className="w-full h-8 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-900"
              >
                LIHAT SEMUA STOK KADALUARSA
              </Button>
            </div>
          </Card>

          <Card className="rounded-none bg-slate-900 text-white p-6 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <ShieldCheck className="h-24 w-24 text-emerald-400" />
            </div>
            <div className="space-y-5 relative z-10">
              <h3 className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border-b border-slate-800 pb-4">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                AUDIT INTEGRITAS AI
              </h3>
              <div className="space-y-5">
                <div className="space-y-2">
                  <p className="text-[8px] font-black text-emerald-400 uppercase tracking-widest">METRIK EFISIENSI</p>
                  <p className="text-xs font-black uppercase tracking-tight leading-relaxed text-slate-300">
                    KONSUMSI DAYA NASIONAL <span className="text-white">12% DI BAWAH</span> TAHUN LALU MELALUI OPTIMASI CYCLING AI.
                  </p>
                </div>
                <div className="space-y-2">
                  <p className="text-[8px] font-black text-amber-400 uppercase tracking-widest">PENCEGAHAN LIMBAH</p>
                  <p className="text-xs font-black uppercase tracking-tight leading-relaxed text-slate-300">
                    SISTEM AI MENCEGAH <span className="text-white">1.4 TON</span> LIMBAH BULAN INI MELALUI MEKANISME EARLY PUSH.
                  </p>
                </div>
              </div>
              <Button 
                onClick={() => handleAction('Telemetry')}
                className="w-full rounded-none bg-emerald-500 text-slate-900 font-black text-[10px] uppercase tracking-widest h-11 hover:bg-emerald-400 mt-4 transition-all"
              >
                AKSES TELEMETRI JARINGAN PENUH
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

