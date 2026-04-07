'use client'

import { useMemo, useState } from 'react'
import {
  Truck,
  MapPin,
  Clock,
  Navigation,
  Package,
  Globe,
  ShieldAlert,
  Download,
  Activity,
  Search,
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import { useAuth } from '@/lib/auth/use-auth'
import { KementerianFilterBar } from '@/components/dashboard/kementerian-filter-bar'
import {
  filterShipmentsByScope,
  resolveOperationalFilters,
} from '@/lib/cross-entity-operations'
import type { ScopeFilters } from '@/lib/kementerian-dashboard-data'

  const statusColors: Record<string, string> = {
  pickup: 'bg-amber-500',
  transit: 'bg-blue-500',
  delivered: 'bg-emerald-500',
  dijadwalkan: 'bg-slate-500',
}

export default function TrackingPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState<ScopeFilters>({
    provinceId: 'all',
    regionId: 'all',
    villageId: 'all',
    cooperativeId: 'all',
    commodityId: 'all',
  })

  const scaleFactor = useMemo(() => {
    if (filters.cooperativeId !== 'all') return 0.05
    if (filters.villageId !== 'all') return 0.15
    if (filters.regionId !== 'all') return 0.4
    if (filters.provinceId !== 'all') return 0.7
    return 1.0
  }, [filters])

  const scopedFilters = resolveOperationalFilters(user, filters)
  const allShipments = filterShipmentsByScope(scopedFilters)
  
  const filteredShipments = useMemo(() => {
    return allShipments.filter((s) => {
      const isUnderway = s.status === 'transit' || s.status === 'pickup'
      const matchesSearch = s.orderNumber.toLowerCase().includes(search.toLowerCase()) || 
                           s.driver.toLowerCase().includes(search.toLowerCase()) ||
                           s.buyerName.toLowerCase().includes(search.toLowerCase())
      return isUnderway && matchesSearch
    })
  }, [search, allShipments])

  const stats = useMemo(() => {
    const activeCount = Math.ceil(filteredShipments.length * scaleFactor * 20)
    const transitCount = Math.ceil(activeCount * 0.7)
    const pickupCount = Math.ceil(activeCount * 0.3)
    return { activeCount, transitCount, pickupCount }
  }, [filteredShipments, scaleFactor])

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">PUSAT PELACAKAN LANGSUNG</h1>
          <p className="text-[10px] font-black text-slate-500 mt-1 uppercase tracking-widest leading-relaxed">
            PEMANTAUAN ARMADA REAL-TIME & VISIBILITAS RANTAI PASOK • {stats.activeCount} UNIT DALAM PERJALANAN
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
           <Button variant="outline" size="sm" className="h-9 text-[10px] font-black uppercase tracking-widest border-slate-200 text-slate-600 rounded-none">
            <ShieldAlert className="h-3.5 w-3.5 mr-2 text-rose-600" />
            PERINGATAN KETERLAMBATAN
          </Button>
          <Button size="sm" className="h-9 bg-slate-900 text-white hover:bg-slate-800 text-[10px] font-black uppercase tracking-widest px-6 rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] transition-all" onClick={() => toast({ title: "Pusat Audit Diinisiasi", description: "Menghasilkan laporan armada lintas entitas..." })}>
            <Download className="h-4 w-4 mr-2" />
            Pusat Audit
          </Button>
        </div>
      </div>

      <KementerianFilterBar filters={filters} setFilters={setFilters} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'TOTAL DALAM PERJALANAN', value: stats.activeCount, sub: 'PENGIRIMAN AKTIF', icon: Truck, tone: 'slate' },
          { label: 'DALAM TRANSIT', value: stats.transitCount, sub: 'DI JARINGAN JALAN', icon: Navigation, tone: 'blue' },
          { label: 'MENUNGGU PENJEMPUTAN', value: stats.pickupCount, sub: 'DALAM ANTREAN MUAT', icon: Package, tone: 'amber' },
          { label: 'TINGKAT TEPAT WAKTU', value: '96.2%', sub: 'RATA-RATA NASIONAL', icon: Activity, tone: 'emerald' },
        ].map((s, i) => (
          <Card key={i} className="border-none shadow-sm bg-white overflow-hidden">
             <div className={`h-1 w-full ${
              s.tone === 'emerald' ? 'bg-emerald-500' : 
              s.tone === 'blue' ? 'bg-blue-500' : 
              s.tone === 'amber' ? 'bg-amber-500' : 'bg-slate-900'
            }`} />
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-10 w-10 rounded-none bg-slate-50 flex items-center justify-center shrink-0 shadow-inner">
                <s.icon className={`h-5 w-5 ${
                  s.tone === 'emerald' ? 'text-emerald-500' : 
                  s.tone === 'blue' ? 'text-blue-500' : 
                  s.tone === 'amber' ? 'text-amber-500' : 'text-slate-900'
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
           <Card className="border-none shadow-xl overflow-hidden bg-slate-950 h-[450px] relative rounded-none">
              <div className="absolute top-0 right-0 p-6 opacity-5">
                 <Globe className="h-64 w-64 text-white" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center p-8">
                 <div className="text-center z-10">
                    <div className="h-16 w-16 rounded-none bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6 shadow-2xl backdrop-blur-sm">
                       <Navigation className="h-8 w-8 text-emerald-500 animate-pulse" />
                    </div>
                    <h3 className="text-lg font-black text-white uppercase tracking-widest">Peta Logistik Nasional</h3>
                    <p className="text-[10px] font-bold text-slate-500 uppercase mt-2 max-w-sm mx-auto tracking-widest leading-relaxed">
                       INTEGRASI SATELIT REAL-TIME PEMANTAUAN RUTE DISTRIBUSI MULTI-WILAYAH.
                    </p>
                    <div className="mt-8 flex flex-wrap justify-center gap-2">
                       <Badge className="bg-blue-600 text-white font-black text-[9px] h-5 border-none rounded-none px-2 tracking-widest">32 TRANSIT</Badge>
                       <Badge className="bg-amber-600 text-white font-black text-[9px] h-5 border-none rounded-none px-2 tracking-widest">12 PICKUP</Badge>
                    </div>
                 </div>
              </div>
              
              <div className="absolute bottom-6 left-6 flex items-center gap-4 bg-slate-900/90 p-3 rounded-none border border-white/10 backdrop-blur-md">
                 <div className="flex items-center gap-2">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping" />
                    <span className="text-[9px] font-black text-white uppercase tracking-widest">Live Feed Active</span>
                 </div>
                 <div className="h-3 w-px bg-slate-700" />
                 <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Last Sync: {new Date().toLocaleTimeString()}</span>
              </div>
           </Card>

           <div className="grid gap-4 md:grid-cols-2">
              {filteredShipments.map((shipment) => (
                  <Card key={shipment.id} className="border-none bg-white shadow-sm overflow-hidden group hover:shadow-md transition-all">
                    <div className={`h-1 w-full ${shipment.status === 'transit' ? 'bg-blue-500' : 'bg-amber-500'}`} />
                    <CardHeader className="p-4 pb-2">
                       <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                             <div className={`h-10 w-10 rounded-none flex items-center justify-center shadow-inner text-white ${statusColors[shipment.status]}`}>
                                <Truck className="h-5 w-5" />
                             </div>
                             <div>
                                <CardTitle className="text-[11px] font-black text-slate-900 uppercase tracking-tight leading-tight">
                                   {shipment.orderNumber}
                                </CardTitle>
                                <p className="text-[10px] font-bold text-slate-400 uppercase mt-0.5 truncate max-w-[150px]">{shipment.buyerName}</p>
                             </div>
                          </div>
                          <Badge className={`h-4 text-[9px] font-black px-1.5 rounded-none border-none ${
                            shipment.status === 'transit' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                          }`}>
                            {shipment.status.toUpperCase()}
                          </Badge>
                       </div>
                    </CardHeader>
                    <CardContent className="p-4 space-y-4">
                       <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-50">
                          <div>
                             <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">DRIVER</p>
                             <p className="text-[10px] font-black text-slate-900 mt-1">{shipment.driver}</p>
                             <p className="text-[9px] font-bold text-slate-400 mt-0.5">{shipment.driverPhone}</p>
                          </div>
                          <div>
                             <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">UNIT</p>
                             <p className="text-[10px] font-black text-slate-900 mt-1">{shipment.vehicle.toUpperCase()}</p>
                          </div>
                       </div>

                       <div className="p-3 rounded-none bg-slate-50 border border-slate-100">
                          <div className="flex items-center justify-between mb-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">
                             <span>Rute Distribusi</span>
                             <Clock className="h-3 w-3" />
                          </div>
                          <div className="flex items-center gap-2">
                              <div className="h-6 w-6 bg-emerald-600 text-white flex items-center justify-center">
                                  <Package className="h-3 w-3" />
                              </div>
                              <div className="h-px flex-1 bg-slate-200" />
                              <div className="h-6 w-6 bg-slate-200 text-slate-500 flex items-center justify-center">
                                  <Navigation className="h-3 w-3" />
                              </div>
                              <div className="h-px flex-1 bg-slate-200" />
                              <div className="h-6 w-6 bg-slate-900 text-white flex items-center justify-center">
                                  <MapPin className="h-3 w-3" />
                              </div>
                          </div>
                          <div className="flex justify-between mt-2 text-[9px] font-black uppercase text-slate-500">
                             <span>HUB</span>
                             <span>TRANSIT</span>
                             <span>DEST</span>
                          </div>
                       </div>

                       <Button 
                         className="w-full h-9 bg-slate-900 text-white font-black text-[10px] uppercase tracking-widest rounded-none hover:bg-slate-800 transition-all"
                         onClick={() => toast({ title: "Konsol Komunikasi", description: `Menghubungi pengemudi ${shipment.driver} (${shipment.driverPhone})...` })}
                       >
                         KONSOL KOMUNIKASI
                       </Button>
                    </CardContent>
                  </Card>
                )
              )}
           </div>
        </div>

        <div className="space-y-6">
           <Card className="border-none shadow-xl bg-slate-950 text-white overflow-hidden rounded-none">
               <CardHeader className="p-4 border-b border-white/5 bg-slate-900/50">
                  <div className="flex items-center justify-between">
                     <CardTitle className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                        <Activity className="h-4 w-4 text-emerald-500" /> FEED LOGISTIK
                     </CardTitle>
                     <div className="flex items-center gap-1.5">
                        <div className="h-1 w-1 bg-emerald-500 rounded-full animate-ping" />
                        <span className="text-[9px] font-black text-emerald-500 tracking-widest">SINKRONISASI</span>
                     </div>
                  </div>
               </CardHeader>
              <CardContent className="p-0">
                 <div className="divide-y divide-white/5">
                    {[
                      { time: '14:20', action: 'Tangerang -> Karawang', status: 'IN TRANSIT', unit: 'TRK-012' },
                      { time: '14:15', action: 'Pickup Selesai: Subang', status: 'ON ROAD', unit: 'TRK-005' },
                      { time: '13:58', action: 'Anomali Rute Terdeteksi', status: 'WARNING', unit: 'TRK-022' },
                      { time: '13:42', action: 'Armada Siaga: Bandung', status: 'IDLE', unit: 'TRK-008' },
                    ].map((log, i) => (
                      <div key={i} className="p-4 hover:bg-white/5 transition-colors cursor-pointer group">
                         <div className="flex items-center justify-between mb-2">
                            <Badge className={`text-[9px] font-black px-1.5 h-4 border-none rounded-none tracking-widest ${
                              log.status === 'WARNING' ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-400'
                            }`}>
                               {log.status}
                            </Badge>
                            <span className="text-[9px] font-mono text-slate-600 group-hover:text-slate-400">{log.time}</span>
                         </div>
                         <p className="text-xs font-black text-slate-200 uppercase tracking-tight leading-tight">{log.action}</p>
                         <p className="text-[9px] font-bold text-slate-500 mt-1 uppercase">ID UNIT: {log.unit}</p>
                      </div>
                    ))}
                 </div>
                 <div className="p-4 bg-white/5 border-t border-white/5">
                    <Button 
                      variant="ghost" 
                      className="w-full text-[10px] font-black text-slate-500 hover:text-white uppercase tracking-widest h-9 rounded-none"
                      onClick={() => toast({ title: "Distribution Center", description: "Membuka pusat kontrol distribusi nasional..." })}
                    >
                       Pusat Kontrol Distribusi →
                    </Button>
                 </div>
              </CardContent>
           </Card>

            <Card className="border-none shadow-sm bg-slate-50 rounded-none">
               <CardHeader className="p-4 border-b border-slate-200">
                  <CardTitle className="text-[10px] font-black uppercase tracking-widest text-slate-900">PEMERIKSAAN KESEHATAN: JARINGAN</CardTitle>
               </CardHeader>
               <CardContent className="p-4 space-y-4">
                  {[
                    { label: 'GPS UPTIME', val: '99.8%', status: 'Stabil' },
                    { label: 'LATENSI', val: '24ms', status: 'Rendah' },
                    { label: 'SINKRONISASI CLOUD', val: 'AKTIF', status: 'Langsung' },
                  ].map((h, i) => (
                    <div key={i} className="flex items-center justify-between">
                       <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{h.label}</span>
                       <div className="text-right">
                          <p className="text-[10px] font-black text-slate-900">{h.val}</p>
                          <p className="text-[9px] font-black text-emerald-600 uppercase tracking-tighter">{h.status}</p>
                       </div>
                    </div>
                 ))}
              </CardContent>
           </Card>
        </div>
      </div>

      {filteredShipments.length === 0 && (
        <Card className="border-dashed py-24 bg-slate-50/50 rounded-none">
          <CardContent className="flex flex-col items-center justify-center text-center">
            <div className="h-20 w-20 rounded-none bg-slate-100 flex items-center justify-center mb-6 text-slate-300">
              <Truck className="h-10 w-10" />
            </div>
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Tidak Ada Pengiriman Aktif</h3>
            <p className="text-[10px] font-bold text-slate-500 uppercase mt-2 max-w-sm mx-auto tracking-widest">
              Saat ini tidak ada armada yang sedang beroperasi di wilayah yang dipilih.
            </p>
            <Button 
              variant="link" 
              onClick={() => {
                setSearch('')
                setFilters({ provinceId: 'all', regionId: 'all', villageId: 'all', cooperativeId: 'all', commodityId: 'all' })
              }}
              className="mt-6 text-[10px] font-black uppercase tracking-widest text-emerald-600 hover:text-emerald-700"
            >
              Lihat Seluruh Nasional
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

