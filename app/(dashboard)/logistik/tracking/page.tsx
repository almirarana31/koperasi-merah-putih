'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Truck,
  MapPin,
  Phone,
  Clock,
  CheckCircle,
  Navigation,
  Package,
  Globe,
  ShieldAlert,
  Download,
  FileText,
  Activity,
  Layers,
  ArrowRight,
  Search,
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/lib/auth/use-auth'
import {
  type ScopeFilters,
} from '@/lib/kementerian-dashboard-data'
import { KementerianFilterBar } from '@/components/dashboard/kementerian-filter-bar'
import { shipments, orders, formatDate } from '@/lib/data'

const statusColors: Record<string, string> = {
  dijadwalkan: 'bg-slate-500',
  pickup: 'bg-amber-500',
  transit: 'bg-blue-600',
  delivered: 'bg-emerald-600',
}

export default function TrackingPage() {
  const { user } = useAuth()
  const isKementerian = user?.role === 'kementerian'
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState<ScopeFilters>({
    provinceId: 'all',
    regionId: 'all',
    villageId: 'all',
    cooperativeId: 'all',
    commodityId: 'all',
  })

  const filteredShipments = useMemo(() => {
    return shipments.filter((s) => {
      const isUnderway = s.status === 'transit' || s.status === 'pickup'
      const order = orders.find((o) => o.id === s.orderId)
      const matchesSearch = s.nomorResi.toLowerCase().includes(search.toLowerCase()) || 
                           s.driver.toLowerCase().includes(search.toLowerCase()) ||
                           order?.buyerNama.toLowerCase().includes(search.toLowerCase())
      
      // Hierarchical Filter Simulation
      const buyerLoc = order?.buyerNama.toUpperCase() || ''
      const matchesProvince = filters.provinceId === 'all' || buyerLoc.includes(filters.provinceId)
      
      return isUnderway && matchesSearch && matchesProvince
    })
  }, [search, filters])

  const stats = useMemo(() => {
    const activeCount = filteredShipments.length
    const transitCount = filteredShipments.filter(s => s.status === 'transit').length
    const pickupCount = filteredShipments.filter(s => s.status === 'pickup').length
    return { activeCount, transitCount, pickupCount }
  }, [filteredShipments])

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-slate-900 flex items-center justify-center shadow-xl">
            <Truck className="h-6 w-6 text-emerald-500" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 uppercase">National Logistics Tracking</h1>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
              Real-time Fleet Monitoring & Supply Chain Visibility • {stats.activeCount} Units Underway
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
           <Button variant="outline" size="sm" className="h-10 text-[10px] font-black uppercase tracking-widest text-slate-600 border-slate-200">
            <ShieldAlert className="h-4 w-4 mr-2 text-rose-600" />
            Delay Alerts
          </Button>
          <Button size="sm" className="h-10 bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-black uppercase tracking-widest px-6 shadow-lg shadow-slate-200">
            <Download className="h-4 w-4 mr-2" />
            Logistic PDF
          </Button>
        </div>
      </div>

      {/* Kementerian Hierarchical Filter Bar */}
      <KementerianFilterBar filters={filters} setFilters={setFilters} />

      {/* High-Density KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Underway', value: stats.activeCount.toLocaleString(), sub: 'Shipments', icon: Truck, color: 'text-slate-900' },
          { label: 'In-Transit', value: stats.transitCount.toLocaleString(), sub: 'On Road', icon: Navigation, color: 'text-blue-600' },
          { label: 'Waiting Pickup', value: stats.pickupCount.toLocaleString(), sub: 'Pending', icon: Package, color: 'text-amber-600' },
          { label: 'On-Time Rate', value: '96.2%', sub: 'Nasional', icon: Activity, color: 'text-emerald-600' },
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
           {/* Map Monitoring - Executive Style */}
           <Card className="border-none shadow-xl overflow-hidden bg-slate-900 h-[500px] relative">
              <div className="absolute top-0 right-0 p-6 opacity-5">
                 <Globe className="h-64 w-64 text-white" />
              </div>
              <div className="absolute inset-0 flex items-center justify-center p-8">
                 <div className="text-center z-10">
                    <div className="h-20 w-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-6">
                       <Navigation className="h-10 w-10 text-emerald-500 animate-pulse" />
                    </div>
                    <h3 className="text-xl font-black text-white uppercase tracking-[0.2em]">Peta Logistik Nasional</h3>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-2 max-w-sm mx-auto">
                       Integrasi satelit real-time untuk pemantauan rute dan optimasi distribusi armada lintas wilayah.
                    </p>
                    <div className="mt-8 flex flex-wrap justify-center gap-3">
                       <Badge className="bg-blue-600 text-white font-black text-[9px] uppercase tracking-widest h-6 border-none">32 TRANSIT</Badge>
                       <Badge className="bg-amber-600 text-white font-black text-[9px] uppercase tracking-widest h-6 border-none">12 PICKUP</Badge>
                    </div>
                 </div>
              </div>
              {/* Simulated Points */}
              <div className="absolute left-[25%] top-[45%] h-8 w-8 bg-blue-600 rounded-full border-4 border-white/20 shadow-2xl animate-bounce flex items-center justify-center">
                 <Truck className="h-4 w-4 text-white" />
              </div>
              <div className="absolute right-[30%] top-[35%] h-8 w-8 bg-amber-600 rounded-full border-4 border-white/20 shadow-2xl animate-pulse flex items-center justify-center">
                 <Package className="h-4 w-4 text-white" />
              </div>
              
              <div className="absolute bottom-6 left-6 flex items-center gap-4 bg-slate-950/80 p-3 rounded-2xl border border-white/10 backdrop-blur-md">
                 <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                    <span className="text-[9px] font-black text-white uppercase tracking-widest">Live Feed Active</span>
                 </div>
                 <div className="h-4 w-px bg-slate-800" />
                 <span className="text-[9px] font-black text-slate-500 uppercase">Last Sync: {new Date().toLocaleTimeString()}</span>
              </div>
           </Card>

           {/* Shipment Cards Grid */}
           <div className="grid gap-4 md:grid-cols-2">
              {filteredShipments.map((shipment) => {
                const order = orders.find((o) => o.id === shipment.orderId)
                return (
                  <Card key={shipment.id} className="group border-none shadow-sm hover:shadow-xl transition-all duration-300 bg-white overflow-hidden border-t-4 border-t-slate-900">
                    <CardHeader className="p-4 pb-2">
                       <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                             <div className={`h-12 w-12 rounded-xl flex items-center justify-center shadow-inner text-white ${statusColors[shipment.status]}`}>
                                <Truck className="h-6 w-6" />
                             </div>
                             <div className="min-w-0">
                                <CardTitle className="text-xs font-black text-slate-900 uppercase truncate leading-tight tracking-tight">
                                   {shipment.nomorResi}
                                </CardTitle>
                                <p className="text-[10px] font-bold text-slate-500 uppercase mt-1 truncate max-w-[140px]">{order?.buyerNama}</p>
                             </div>
                          </div>
                          <Badge className={`h-5 text-[8px] font-black uppercase px-2 rounded border-none ${
                            shipment.status === 'transit' ? 'bg-blue-100 text-blue-700' : 'bg-amber-100 text-amber-700'
                          }`}>
                            {shipment.status === 'transit' ? 'IN TRANSIT' : 'PICKUP'}
                          </Badge>
                       </div>
                    </CardHeader>
                    <CardContent className="p-4 space-y-4">
                       <div className="grid grid-cols-2 gap-4">
                          <div className="flex items-center gap-2.5">
                             <div className="h-6 w-6 rounded bg-slate-50 flex items-center justify-center shrink-0">
                                <Phone className="h-3 w-3 text-slate-400" />
                             </div>
                             <div>
                                <p className="text-[9px] font-black text-slate-900 tracking-widest">{shipment.driver}</p>
                                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">{shipment.noHpDriver}</p>
                             </div>
                          </div>
                          <div className="flex items-center gap-2.5">
                             <div className="h-6 w-6 rounded bg-slate-50 flex items-center justify-center shrink-0">
                                <Activity className="h-3 w-3 text-slate-400" />
                             </div>
                             <div>
                                <p className="text-[9px] font-black text-slate-900 tracking-widest">{shipment.platNomor}</p>
                                <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">{shipment.kendaraan}</p>
                             </div>
                          </div>
                       </div>

                       <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                          <div className="flex items-center justify-between mb-3 text-[9px] font-black uppercase tracking-widest text-slate-400">
                             <span>Rute Optimal</span>
                             <Clock className="h-3 w-3" />
                          </div>
                          <div className="flex items-center gap-2">
                             {shipment.rute.map((loc, idx) => (
                                <div key={idx} className="flex items-center">
                                   <div className={`h-6 w-6 rounded-lg flex items-center justify-center ${
                                     idx === 0 ? 'bg-emerald-600 text-white' : idx === shipment.rute.length - 1 ? 'bg-slate-900 text-white' : 'bg-slate-200 text-slate-500'
                                   }`}>
                                      {idx === 0 ? <Package className="h-3 w-3" /> : idx === shipment.rute.length - 1 ? <MapPin className="h-3 w-3" /> : <Navigation className="h-3 w-3" />}
                                   </div>
                                   {idx < shipment.rute.length - 1 && (
                                      <div className="mx-1 h-0.5 w-4 bg-slate-200" />
                                   )}
                                </div>
                             ))}
                          </div>
                          <p className="mt-3 text-[9px] font-bold text-slate-600 uppercase">ETA: {formatDate(shipment.tanggalBerangkat)}</p>
                       </div>

                       <Button className="w-full h-10 bg-slate-900 text-white font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-slate-800 transition-all shadow-lg">
                         BUKA KONSOL KOMUNIKASI
                       </Button>
                    </CardContent>
                  </Card>
                )
              })}
           </div>
        </div>

        {/* Side Audit Panel */}
        <div className="space-y-6">
           <Card className="border-none shadow-xl bg-slate-950 text-white overflow-hidden">
              <CardHeader className="p-5 border-b border-white/5 bg-slate-900/50">
                 <div className="flex items-center justify-between">
                    <CardTitle className="text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-2">
                       <Activity className="h-4 w-4 text-emerald-500" /> LOGISTIK FEED
                    </CardTitle>
                    <div className="flex items-center gap-1.5">
                       <div className="h-1.5 w-1.5 bg-emerald-500 rounded-full animate-ping" />
                       <span className="text-[9px] font-black text-emerald-500 uppercase">SYNCING</span>
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
                      <div key={i} className="p-5 hover:bg-white/5 transition-colors cursor-pointer">
                         <div className="flex items-center justify-between mb-2">
                            <Badge className={`text-[8px] font-black uppercase px-1.5 h-4 border-none ${
                              log.status === 'WARNING' ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-400'
                            }`}>
                               {log.status}
                            </Badge>
                            <span className="text-[9px] font-mono text-slate-600">{log.time}</span>
                         </div>
                         <p className="text-[11px] font-black text-slate-200 uppercase leading-tight">{log.action}</p>
                         <p className="text-[9px] font-bold text-slate-500 uppercase mt-1">ID UNIT: {log.unit}</p>
                      </div>
                    ))}
                 </div>
                 <div className="p-4 bg-white/5 border-t border-white/5">
                    <Button variant="ghost" className="w-full text-[9px] font-black text-slate-500 hover:text-white uppercase tracking-widest h-10">
                       Buka Pusat Logistik →
                    </Button>
                 </div>
              </CardContent>
           </Card>

           <Card className="border-none shadow-sm bg-slate-50">
              <CardHeader className="p-4 border-b border-slate-200">
                 <CardTitle className="text-[10px] font-black uppercase tracking-widest text-slate-900">Health Check: Fleet</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                 {[
                   { label: 'GPS Uptime', val: '99.8%', status: 'Stable' },
                   { label: 'Network Latency', val: '24ms', status: 'Low' },
                   { label: 'Cloud Sync', val: 'Active', status: 'Live' },
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

      {filteredShipments.length === 0 && (
        <Card className="border-dashed py-24 bg-slate-50/50">
          <CardContent className="flex flex-col items-center justify-center text-center">
            <div className="h-20 w-20 rounded-full bg-slate-100 flex items-center justify-center mb-6 text-slate-300">
              <Truck className="h-10 w-10" />
            </div>
            <h3 className="text-xl font-black text-slate-900 uppercase">Tidak Ada Pengiriman Aktif</h3>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-2 max-w-sm mx-auto">
              Saat ini tidak ada armada yang sedang beroperasi di wilayah yang dipilih.
            </p>
            <Button 
              variant="link" 
              onClick={() => {
                setSearch('')
                setFilters({ provinceId: 'all', regionId: 'all', villageId: 'all', cooperativeId: 'all', commodityId: 'all' })
              }}
              className="mt-6 text-[10px] font-black uppercase text-emerald-600"
            >
              Lihat Seluruh Nasional
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
