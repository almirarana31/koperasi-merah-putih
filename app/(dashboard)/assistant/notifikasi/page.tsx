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
    judul: 'KRITIS: LONJAKAN PERMINTAAN NASIONAL +176%',
    deskripsi: 'Proyeksi demand Beras Grade A melonjak drastis di 12 provinsi. Segera aktivasi cadangan pangan nasional.',
    tipe: 'PELUANG',
    priority: 'TINGGI',
    waktu: '12 MENIT LALU',
    region: 'NASIONAL',
    action: 'LIHAT PRAKIRAAN',
    anomalyScore: 0.92,
  },
  {
    judul: 'PERINGATAN: RISIKO STOK CABAI HABIS',
    deskripsi: 'Stok Cabai Merah di 15 Koperasi Jawa Timur berada di level kritis (120 kg). Potensi inflasi lokal terdeteksi.',
    tipe: 'PERINGATAN',
    priority: 'TINGGI',
    waktu: '45 MENIT LALU',
    region: 'JAWA TIMUR',
    action: 'MOBILISASI STOK',
    anomalyScore: 0.88,
  },
  {
    judul: 'WAWASAN: HARGA OPTIMAL TERCAPAI',
    deskripsi: 'Wortel mencapai equilibrium harga optimal dengan margin agregat Rp 2.8k/kg di wilayah Barat.',
    tipe: 'WAWASAN',
    priority: 'SEDANG',
    waktu: '2 JAM LALU',
    region: 'SUMATERA',
    action: 'KUNCI MARGIN',
    anomalyScore: 0.15,
  },
  {
    judul: 'UPDATE KOMPETITOR: KENAIKAN HARGA 8%',
    deskripsi: 'Kompetitor eksternal menaikkan harga Beras. Rekomendasi: Pertahankan harga KOPDES untuk capture market share.',
    tipe: 'UPDATE',
    priority: 'SEDANG',
    waktu: '4 JAM LALU',
    region: 'NASIONAL',
    action: 'ANALISIS HARGA',
    anomalyScore: 0.45,
  },
  {
    judul: 'PRAKIRAAN: AKTIVASI MUSIM PANEN',
    deskripsi: 'Masa panen raya Beras diprediksi mulai 15-20 Mei. Pastikan audit kapasitas gudang Cold Storage selesai h-7.',
    tipe: 'PRAKIRAAN',
    priority: 'RENDAH',
    waktu: '1 HARI LALU',
    region: 'SULAWESI SELATAN',
    action: 'AUDIT GUDANG',
    anomalyScore: 0.05,
  },
]

const notificationRules = [
  {
    nama: 'Monitor Volatilitas - Beras Grade A',
    kondisi: 'DELTA HARGA > 5% DALAM 24 JAM',
    aksi: 'PEMICU INTERVENSI STRATEGIS',
    status: 'AKTIF',
    severity: 'TINGGI',
  },
  {
    nama: 'Ambang Batas Stok Kritis',
    kondisi: 'INVENTORI < 20% DARI TARGET (SEMUA KOMODITAS)',
    aksi: 'AUTO-REORDER & PERINGATAN LOGISTIK',
    status: 'AKTIF',
    severity: 'KRITIS',
  },
  {
    nama: 'Prediksi Lonjakan Permintaan',
    kondisi: 'PRAKIRAAN AI > 0.80 KEPERCAYAAN',
    aksi: 'PUSH PERINGATAN PELUANG PASAR',
    status: 'AKTIF',
    severity: 'SEDANG',
  },
  {
    nama: 'Eskalasi Keterlambatan Logistik',
    kondisi: 'KETERLAMBATAN PENGIRIMAN > 2 JAM LINTAS PROVINSI',
    aksi: 'NOTIFIKASI MANAJER REGIONAL + ESKALASI',
    status: 'AKTIF',
    severity: 'SEDANG',
  },
]

function getIcon(tipe: string) {
  switch (tipe) {
    case 'PELUANG': return <TrendingUp className="h-4 w-4 text-emerald-600" />
    case 'PERINGATAN': return <AlertTriangle className="h-4 w-4 text-rose-600" />
    case 'WAWASAN': return <AlertCircle className="h-4 w-4 text-blue-600" />
    case 'UPDATE': return <Bell className="h-4 w-4 text-amber-600" />
    case 'PRAKIRAAN': return <Zap className="h-4 w-4 text-purple-600" />
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
    { label: 'Peringatan Aktif', value: Math.floor(154 * scaleFactor), icon: Activity, color: 'text-rose-600', tone: 'rose' },
    { label: 'Selesai (24 Jam)', value: Math.floor(89 * scaleFactor), icon: CheckCircle2, color: 'text-emerald-600', tone: 'emerald' },
    { label: 'Dipicu AI', value: '72%', icon: Zap, color: 'text-amber-500', tone: 'amber' },
    { label: 'Rata-rata Respon', value: '8.4m', icon: Clock, color: 'text-blue-600', tone: 'blue' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Hub Notifikasi Strategis</h1>
          <p className="text-[10px] font-black text-slate-500 mt-1 uppercase tracking-widest leading-relaxed">
            Sistem Peringatan Nasional Berdasarkan Business Rules & AI Triggers
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="h-9 text-[10px] font-black uppercase tracking-widest border-slate-200 text-slate-600 rounded-none hover:bg-slate-50">
            Tandai Semua Dibaca
          </Button>
          <Button className="h-9 bg-slate-900 text-white hover:bg-slate-800 text-[10px] font-black uppercase tracking-widest px-6 rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] transition-all">
            Pengaturan Notifikasi
          </Button>
        </div>
      </div>

      <KementerianFilterBar filters={filters} setFilters={setFilters} />

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {stats.map((s, i) => (
          <Card key={i} className="border-none shadow-sm bg-white overflow-hidden rounded-none">
             <div className={`h-1 w-full ${
              s.tone === 'emerald' ? 'bg-emerald-500' : 
              s.tone === 'blue' ? 'bg-blue-500' : 
              s.tone === 'rose' ? 'bg-rose-500' : 'bg-slate-900'
            }`} />
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-10 w-10 rounded-none bg-slate-50 flex items-center justify-center shrink-0 shadow-inner">
                <s.icon className={`h-5 w-5 ${s.color}`} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{s.label}</p>
                <span className="text-sm font-black text-slate-900 leading-tight">{s.value}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
            <History className="h-4 w-4 text-slate-900" />
            <h2 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Feed Peringatan Langsung</h2>
          </div>

          <div className="flex flex-col gap-3">
            {strategicNotifications.map((notif, idx) => (
              <Card key={idx} className="border-none shadow-sm bg-white overflow-hidden rounded-none group hover:bg-slate-50/50 transition-all">
                <div className={`h-1 w-full ${
                  notif.priority === 'TINGGI' ? 'bg-rose-600' : 
                  notif.priority === 'SEDANG' ? 'bg-amber-500' : 'bg-slate-300'
                }`} />
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className={`mt-1 h-12 w-12 shrink-0 rounded-none flex items-center justify-center shadow-inner ${
                      notif.tipe === 'PERINGATAN' ? 'bg-rose-50' : 
                      notif.tipe === 'PELUANG' ? 'bg-emerald-50' : 'bg-slate-50'
                    }`}>
                      {getIcon(notif.tipe)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black text-slate-900 uppercase tracking-widest">[{notif.region}]</span>
                            <span className="text-[10px] font-black text-slate-300">•</span>
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{notif.tipe}</span>
                          </div>
                          <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight leading-tight">
                            {notif.judul}
                          </h3>
                        </div>
                        <Badge variant={notif.priority === 'TINGGI' ? 'destructive' : 'secondary'} className="text-[8px] font-black uppercase tracking-widest rounded-none h-5">
                          {notif.priority}
                        </Badge>
                      </div>
                      <p className="text-[10px] font-bold text-slate-500 uppercase leading-relaxed mt-2 max-w-2xl tracking-wide">
                        {notif.deskripsi}
                      </p>

                      <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1.5 text-slate-400">
                            <Clock className="h-3 w-3" />
                            <span className="text-[9px] font-black uppercase tracking-widest">{notif.waktu}</span>
                          </div>
                          {notif.anomalyScore > 0 && (
                            <div className="flex items-center gap-1.5">
                              <ShieldAlert className="h-3 w-3 text-rose-500" />
                              <span className="text-[9px] font-black text-rose-600 uppercase tracking-widest">Anomali: {Math.floor(notif.anomalyScore * 100)}%</span>
                            </div>
                          )}
                        </div>
                        <Button size="sm" variant="ghost" className="h-7 text-[9px] font-black uppercase tracking-widest text-blue-600 hover:text-blue-700 p-0">
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

        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
            <Filter className="h-4 w-4 text-slate-900" />
            <h2 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Mesin Business Rules</h2>
          </div>

          <div className="flex flex-col gap-3">
            {notificationRules.map((rule) => (
              <Card key={rule.nama} className="border-none shadow-sm bg-white overflow-hidden rounded-none">
                <CardHeader className="p-4 pb-2">
                  <div className="flex items-start justify-between">
                    <CardTitle className="text-[10px] font-black text-slate-900 uppercase tracking-tight max-w-[80%] leading-tight">
                      {rule.nama}
                    </CardTitle>
                    <Badge className="text-[8px] font-black uppercase tracking-widest bg-emerald-100 text-emerald-700 rounded-none">
                      {rule.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-2">
                  <div className="p-3 bg-slate-50 border border-slate-100 space-y-3 mb-3">
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Kondisi</p>
                      <p className="text-[10px] font-black text-slate-900 mt-1 uppercase">{rule.kondisi}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Aksi Sistem</p>
                      <p className="text-[10px] font-black text-slate-900 mt-1 uppercase">{rule.aksi}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between border-t border-slate-50 pt-2">
                    <Badge variant="outline" className={`text-[8px] font-black uppercase tracking-widest rounded-none ${
                      rule.severity === 'KRITIS' ? 'border-rose-300 text-rose-600 bg-rose-50' : 'border-slate-300 text-slate-600'
                    }`}>
                      Keparahan: {rule.severity}
                    </Badge>
                    <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-slate-300 hover:text-slate-900 rounded-none">
                      <MoreVertical className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="border-2 border-dashed border-slate-200 bg-transparent rounded-none">
            <CardHeader className="p-4 text-center">
              <CardTitle className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Konfigurasi Trigger Nasional Baru</CardTitle>
              <CardDescription className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Petakan Wawasan AI ke Peringatan Eksekutif</CardDescription>
            </CardHeader>
            <CardContent className="p-4 pt-0 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Parameter</label>
                  <select className="w-full h-8 text-[10px] font-bold bg-white rounded-none border border-slate-200 px-2 uppercase shadow-sm">
                    <option>NATIONAL_PRICE</option>
                    <option>STOCK_DENSITY</option>
                    <option>LOGISTICS_LATENCY</option>
                    <option>AI_FORECAST_ERR</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Ambang Batas</label>
                  <input type="text" placeholder="MISAL. > 5%" className="w-full h-8 text-[10px] font-bold bg-white rounded-none border border-slate-200 px-2 uppercase shadow-sm" />
                </div>
              </div>
              <Button className="w-full bg-slate-900 text-white hover:bg-slate-800 text-[10px] font-black uppercase tracking-widest h-10 rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]">
                Aktivasi Mesin Trigger
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
