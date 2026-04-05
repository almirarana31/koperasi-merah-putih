'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Bell, 
  AlertTriangle, 
  TrendingUp, 
  AlertCircle, 
  ShieldAlert, 
  Zap, 
  Clock, 
  History,
  Filter,
  CheckCircle2,
  MoreVertical,
  Activity
} from 'lucide-react'
import { KementerianFilterBar } from '@/components/dashboard/kementerian-filter-bar'
import { type ScopeFilters } from '@/lib/kementerian-dashboard-data'

const strategicNotifications = [
  {
    judul: 'CRITICAL: NATIONAL DEMAND SPIKE +176%',
    deskripsi: 'Proyeksi demand Beras Grade A melonjak drastis di 12 provinsi. Segera aktivasi cadangan pangan nasional.',
    tipe: 'OPPORTUNITY',
    priority: 'HIGH',
    waktu: '12 MIN AGO',
    region: 'NATIONAL',
    action: 'VIEW FORECAST',
    anomalyScore: 0.92,
  },
  {
    judul: 'ALERT: CABAI STOCKOUT RISK',
    deskripsi: 'Stok Cabai Merah di 15 Koperas Jawa Timur berada di level kritis (120 kg). Potensi inflasi lokal terdeteksi.',
    tipe: 'ALERT',
    priority: 'HIGH',
    waktu: '45 MIN AGO',
    region: 'JAWA TIMUR',
    action: 'MOBILIZE STOCK',
    anomalyScore: 0.88,
  },
  {
    judul: 'INSIGHT: OPTIMAL PRICING ACHIEVED',
    deskripsi: 'Wortel mencapai equilibrium harga optimal dengan margin agregat Rp 2.8k/kg di wilayah Barat.',
    tipe: 'INSIGHT',
    priority: 'MEDIUM',
    waktu: '2 HOURS AGO',
    region: 'SUMATERA',
    action: 'LOCK MARGIN',
    anomalyScore: 0.15,
  },
  {
    judul: 'COMPETITOR UPDATE: PRICE HIKE 8%',
    deskripsi: 'Kompetitor eksternal menaikkan harga Beras. Rekomendasi: Pertahankan harga KOPDES untuk capture market share.',
    tipe: 'UPDATE',
    priority: 'MEDIUM',
    waktu: '4 HOURS AGO',
    region: 'NASIONAL',
    action: 'PRICE ANALYSIS',
    anomalyScore: 0.45,
  },
  {
    judul: 'FORECAST: HARVEST SEASON ACTIVATION',
    deskripsi: 'Masa panen raya Beras diprediksi mulai 15-20 Mei. Pastikan audit kapasitas gudang Cold Storage selesai h-7.',
    tipe: 'FORECAST',
    priority: 'LOW',
    waktu: '1 DAY AGO',
    region: 'SULAWESI SELATAN',
    action: 'AUDIT GUDANG',
    anomalyScore: 0.05,
  },
]

const notificationRules = [
  {
    nama: 'VOLATILITY MONITOR - BERAS GRADE A',
    kondisi: 'DELTA PRICE > 5% WITHIN 24H',
    aksi: 'TRIGGER STRATEGIC INTERVENTION',
    status: 'ACTIVE',
    severity: 'HIGH',
  },
  {
    nama: 'STOCK CRITICAL THRESHOLD',
    kondisi: 'INVENTORY < 20% OF TARGET (ALL COMMODITIES)',
    aksi: 'AUTO-REORDER & ALERT LOGISTICS',
    status: 'ACTIVE',
    severity: 'CRITICAL',
  },
  {
    nama: 'DEMAND SURGE PREDICTOR',
    kondisi: 'AI FORECAST > 0.80 CONFIDENCE',
    aksi: 'PUSH MARKET OPPORTUNITY ALERT',
    status: 'ACTIVE',
    severity: 'MEDIUM',
  },
  {
    nama: 'LOGISTICS DELAY ESCALATION',
    kondisi: 'SHIPMENT DELAY > 2H LINTAS PROVINSI',
    aksi: 'NOTIFY REGIONAL MANAGER + ESCALATE',
    status: 'ACTIVE',
    severity: 'MEDIUM',
  },
]

function getIcon(tipe: string) {
  switch (tipe) {
    case 'OPPORTUNITY': return <TrendingUp className="h-4 w-4 text-emerald-600" />
    case 'ALERT': return <AlertTriangle className="h-4 w-4 text-rose-600" />
    case 'INSIGHT': return <AlertCircle className="h-4 w-4 text-blue-600" />
    case 'UPDATE': return <Bell className="h-4 w-4 text-amber-600" />
    case 'FORECAST': return <Zap className="h-4 w-4 text-purple-600" />
    default: return <Bell className="h-4 w-4 text-slate-400" />
  }
}

export default function NotifikasiPage() {
  const [filters, setFilters] = useState<ScopeFilters>({
    provinceId: 'all',
    regionId: 'all',
    villageId: 'all',
    cooperativeId: 'all',
    commodityId: 'all',
  })

  const scaleFactor = filters.provinceId === 'all' ? 1 : filters.regionId === 'all' ? 0.3 : 0.1

  const stats = [
    { label: 'ACTIVE ALERTS', value: Math.floor(154 * scaleFactor), icon: Activity, color: 'text-rose-600' },
    { label: 'RESOLVED (24H)', value: Math.floor(89 * scaleFactor), icon: CheckCircle2, color: 'text-emerald-600' },
    { label: 'AI TRIGGERED', value: '72%', icon: Zap, color: 'text-amber-500' },
    { label: 'AVG RESPONSE', value: '8.4m', icon: Clock, color: 'text-blue-600' },
  ]

  return (
    <div className="flex flex-col gap-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black tracking-tighter text-slate-900 uppercase">
              STRATEGIC NOTIFICATION HUB
            </h1>
            <p className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">
              SISTEM ALERT NASIONAL BERDASARKAN BUSINESS RULES & AI TRIGGERS
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="h-8 text-[9px] font-black uppercase tracking-widest border-slate-200">
              MARK ALL READ
            </Button>
            <Button className="h-8 bg-slate-900 hover:bg-slate-800 text-[9px] font-black uppercase tracking-widest">
              NOTIFICATION SETTINGS
            </Button>
          </div>
        </div>

        <KementerianFilterBar filters={filters} setFilters={setFilters} />
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-none bg-white shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
                <span className="text-[10px] font-black text-slate-900">{stat.value}</span>
              </div>
              <p className="text-[9px] font-black tracking-widest text-slate-500 uppercase mt-2">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
        {/* RECENT NOTIFICATIONS */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
            <History className="h-4 w-4 text-slate-900" />
            <h2 className="text-xs font-black tracking-widest text-slate-900 uppercase">LIVE ALERT FEED</h2>
          </div>

          <div className="flex flex-col gap-3">
            {strategicNotifications.map((notif, idx) => (
              <Card key={idx} className={`border-none shadow-sm overflow-hidden group transition-all hover:bg-slate-50/50`}>
                <div className={`h-1 w-full ${
                  notif.priority === 'HIGH' ? 'bg-rose-600' : 
                  notif.priority === 'MEDIUM' ? 'bg-amber-500' : 'bg-slate-300'
                }`} />
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className={`mt-1 h-10 w-10 shrink-0 rounded-lg flex items-center justify-center ${
                      notif.tipe === 'ALERT' ? 'bg-rose-50' : 
                      notif.tipe === 'OPPORTUNITY' ? 'bg-emerald-50' : 'bg-slate-50'
                    }`}>
                      {getIcon(notif.tipe)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] font-black tracking-tighter text-slate-900 uppercase">[{notif.region}]</span>
                            <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest">• {notif.tipe}</span>
                          </div>
                          <h3 className="text-[11px] font-black leading-tight text-slate-900 uppercase tracking-tight">
                            {notif.judul}
                          </h3>
                        </div>
                        <Badge variant={notif.priority === 'HIGH' ? 'destructive' : 'secondary'} className="text-[8px] font-black uppercase tracking-widest">
                          {notif.priority}
                        </Badge>
                      </div>
                      <p className="text-[10px] font-bold text-slate-500 uppercase leading-relaxed mt-1.5 max-w-2xl">
                        {notif.deskripsi}
                      </p>

                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1.5">
                            <Clock className="h-3 w-3 text-slate-400" />
                            <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{notif.waktu}</span>
                          </div>
                          {notif.anomalyScore > 0 && (
                            <div className="flex items-center gap-1.5">
                              <ShieldAlert className="h-3 w-3 text-rose-500" />
                              <span className="text-[8px] font-black text-rose-600 uppercase tracking-widest">ANOMALY: {Math.floor(notif.anomalyScore * 100)}%</span>
                            </div>
                          )}
                        </div>
                        <Button size="sm" variant="ghost" className="h-7 text-[8px] font-black uppercase tracking-widest hover:text-emerald-600">
                          {notif.action}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* NOTIFICATION RULES */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
            <Filter className="h-4 w-4 text-slate-900" />
            <h2 className="text-xs font-black tracking-widest text-slate-900 uppercase">BUSINESS RULES ENGINE</h2>
          </div>

          <div className="flex flex-col gap-3">
            {notificationRules.map((rule) => (
              <Card key={rule.nama} className="border-none shadow-sm group">
                <CardHeader className="p-4 pb-2">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-[10px] font-black tracking-widest text-slate-900 uppercase max-w-[80%] leading-tight">
                      {rule.nama}
                    </CardTitle>
                    <Badge className="text-[8px] font-black bg-emerald-100 text-emerald-700 uppercase">
                      {rule.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-2">
                  <div className="p-3 bg-slate-50 rounded border border-slate-100 space-y-2 mb-3">
                    <div>
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">CONDITION</p>
                      <p className="text-[9px] font-black text-slate-900 mt-0.5 uppercase">{rule.kondisi}</p>
                    </div>
                    <div>
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">SYSTEM ACTION</p>
                      <p className="text-[9px] font-black text-slate-900 mt-0.5 uppercase">{rule.aksi}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between border-t border-slate-50 pt-2">
                    <Badge variant="outline" className={`text-[8px] font-black uppercase ${
                      rule.severity === 'CRITICAL' ? 'border-rose-300 text-rose-600 bg-rose-50' : 'border-slate-300 text-slate-600'
                    }`}>
                      {rule.severity}
                    </Badge>
                    <div className="flex gap-1">
                      <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-slate-400 hover:text-slate-900">
                        <MoreVertical className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="border-dashed border-2 border-slate-200 bg-transparent">
            <CardHeader className="p-4 text-center">
              <CardTitle className="text-[11px] font-black tracking-widest text-slate-900 uppercase">CONFIGURE NEW NATIONAL TRIGGER</CardTitle>
              <CardDescription className="text-[9px] font-bold text-slate-500 uppercase mt-1">MAP AI INSIGHTS TO EXECUTIVE ALERTS</CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">PARAMETER</label>
                  <select className="w-full h-8 text-[9px] font-black bg-white rounded border border-slate-200 px-2 uppercase">
                    <option>NATIONAL_PRICE</option>
                    <option>STOCK_DENSITY</option>
                    <option>LOGISTICS_LATENCY</option>
                    <option>AI_FORECAST_ERR</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-[8px] font-black text-slate-400 uppercase tracking-widest">THRESHOLD</label>
                  <input type="text" placeholder="E.G. > 5%" className="w-full h-8 text-[9px] font-black bg-white rounded border border-slate-200 px-2 uppercase" />
                </div>
              </div>
              <Button className="w-full bg-slate-900 hover:bg-slate-800 text-[9px] font-black uppercase tracking-widest h-9">
                ACTIVATE TRIGGER ENGINE
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
