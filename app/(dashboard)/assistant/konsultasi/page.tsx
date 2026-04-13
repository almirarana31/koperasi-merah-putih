'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  CheckCircle, 
  AlertCircle, 
  Lightbulb, 
  BrainCircuit, 
  ShieldAlert, 
  Search,
  MessageSquareText,
  TrendingUp,
  History,
  Scale,
  ArrowUpRight
} from 'lucide-react'
import { KementerianFilterBar } from '@/components/dashboard/kementerian-filter-bar'
import { type ScopeFilters } from '@/lib/kementerian-dashboard-data'

const strategicTopics = [
  {
    kategori: 'Strategi Nasional & Ketahanan Pangan',
    priority: 'KRITIS',
    topics: [
      'Waktu optimal untuk penanaman komoditas strategis nasional',
      'Mitigasi kegagalan panen lintas provinsi',
      'Stabilisasi pasokan pangan daerah remote',
      'Integrasi cadangan beras pemerintah (CBP)',
      'Program subsidi pupuk presisi berbasis data AI',
    ],
  },
  {
    kategori: 'Optimasi Pasar & Intervensi Harga',
    priority: 'TINGGI',
    topics: [
      'Analisis target harga jual komoditas Grade A nasional',
      'Efektivitas intervensi harga pada pasar lokal',
      'Negosiasi kontrak ekspor agregat koperasi',
      'Deteksi anomali harga di tingkat distributor',
      'Positioning produk unggulan daerah di pasar global',
    ],
  },
  {
    kategori: 'Logistik Nasional & Audit Cold Chain',
    priority: 'SEDANG',
    topics: [
      'Optimasi rute logistik nasional untuk efisiensi BBM',
      'Audit infrastruktur cold chain di wilayah Timur',
      'Standardisasi packaging ekspor berkelanjutan',
      'Manajemen risiko rantai pasok terhadap bencana',
      'Integrasi last-mile delivery antar koperasi unit desa',
    ],
  },
  {
    kategori: 'Keuangan Mikro & Investasi Strategis',
    priority: 'TINGGI',
    topics: [
      'Analisis kelayakan kredit usaha rakyat (KUR) massal',
      'Manajemen arus kas agregat ekosistem KOPDES',
      'Pembiayaan ekspansi infrastruktur pasca panen',
      'Optimasi margin keuntungan produsen vs distributor',
      'Evaluasi ROI teknologi pertanian digital (AgriTech)',
    ],
  },
]

const recentConsultations = [
  {
    region: 'JAWA BARAT',
    coop: 'KUD MANDIRI SEJAHTERA',
    topik: 'Anomali Harga Cabai di Pasar Induk',
    jawaban: 'Intervensi disarankan: Mobilisasi stok dari Jawa Tengah (Surplus 15%). Gunakan armada Logistik Nasional rute 04. Estimasi normalisasi harga: 48 jam.',
    status: 'SELESAI',
    impact: 'TINGGI',
    time: '12 MENIT LALU',
  },
  {
    region: 'SULAWESI SELATAN',
    coop: 'KOPERASI TANI MAKMUR',
    topik: 'Optimasi Distribusi Beras Premium',
    jawaban: 'Rekomendasi: Alihkan 30% supply ke Balikpapan (Demand Gap 12%). Harga jual potensial: +Rp 800/kg. Efisiensi rute: 15%.',
    status: 'PROSES',
    impact: 'SEDANG',
    time: '45 MENIT LALU',
  },
  {
    region: 'NASIONAL',
    coop: 'PUSAT DATA KEMENTERIAN',
    topik: 'Simulasi Dampak El Nino Q3',
    jawaban: 'Vulnerabilitas terdeteksi pada 12% lahan padi. Disarankan percepatan masa tanam 2 minggu & optimalisasi embung di 450 titik prioritas.',
    status: 'SARAN',
    impact: 'KRITIS',
    time: '2 JAM LALU',
  },
]

export default function KonsultasiPage() {
  const [filters, setFilters] = useState<ScopeFilters>({
    provinceId: 'all',
    regionId: 'all',
    villageId: 'all',
    cooperativeId: 'all',
    commodityId: 'all',
  })

  const scaleFactor = filters.provinceId === 'all' ? 1 : filters.regionId === 'all' ? 0.3 : 0.1

  const stats = [
    { 
      label: 'Kueri Strategis', 
      value: Math.floor(1254 * scaleFactor), 
      trend: '+12%', 
      icon: MessageSquareText,
      color: 'text-emerald-600',
      tone: 'emerald'
    },
    { 
      label: 'Tingkat Akurasi AI', 
      value: '98.2%', 
      trend: 'STABIL', 
      icon: BrainCircuit,
      color: 'text-blue-600',
      tone: 'blue'
    },
    { 
      label: 'Isu Terselesaikan', 
      value: Math.floor(892 * scaleFactor), 
      trend: '+5%', 
      icon: CheckCircle,
      color: 'text-emerald-500',
      tone: 'emerald'
    },
    { 
      label: 'Peringatan Risiko', 
      value: Math.floor(42 * scaleFactor), 
      trend: '-18%', 
      icon: ShieldAlert,
      color: 'text-rose-600',
      tone: 'rose'
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Hub Konsultasi Strategis</h1>
          <p className="text-[10px] font-black text-slate-500 mt-1 uppercase tracking-widest leading-relaxed">
            Pusat Konsultasi Strategis & Intelijen AI Nasional • Mesin AI: Aktif • Refresh: 60s
          </p>
        </div>
        <div className="flex gap-2">
            <Badge variant="outline" className="border-emerald-500/30 bg-emerald-50 text-[10px] font-black uppercase tracking-widest text-emerald-700 rounded-none">
              AI ENGINE: ACTIVE
            </Badge>
            <Button size="sm" className="h-9 bg-slate-900 text-white hover:bg-slate-800 text-[10px] font-black uppercase tracking-widest px-6 rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] transition-all">
               Simulator Strategi
            </Button>
        </div>
      </div>

      <KementerianFilterBar filters={filters} setFilters={setFilters} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
                <div className="flex flex-col">
                  <span className="text-sm font-black text-slate-900 leading-tight">{s.value}</span>
                  <span className={`text-[8px] font-bold uppercase tracking-tighter ${s.trend.startsWith('+') ? 'text-emerald-600' : s.trend.startsWith('-') ? 'text-rose-600' : 'text-slate-500'}`}>{s.trend}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
             <div className="flex items-center gap-2">
                <Scale className="h-4 w-4 text-slate-900" />
                <h2 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Basis Pengetahuan Strategis</h2>
             </div>
          </div>
          
          <div className="grid gap-4">
            {strategicTopics.map((group) => (
              <Card key={group.kategori} className="border-none shadow-sm bg-white overflow-hidden rounded-none">
                <div className={`h-1 w-full ${group.priority === 'KRITIS' ? 'bg-rose-600' : group.priority === 'TINGGI' ? 'bg-amber-500' : 'bg-blue-500'}`} />
                <CardHeader className="py-3 px-4 bg-slate-50/50 border-b border-slate-100">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-[10px] font-black text-slate-900 uppercase tracking-tight">
                      {group.kategori}
                    </CardTitle>
                    <Badge className={`text-[8px] font-black uppercase tracking-widest rounded-none ${group.priority === 'KRITIS' ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-700'}`}>
                      {group.priority}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4 grid grid-cols-1 gap-2">
                  {group.topics.map((q) => (
                    <Button
                      key={q}
                      variant="outline"
                      className="group justify-start h-auto p-3 text-left border-slate-200 hover:border-blue-500 hover:bg-blue-50/30 rounded-none transition-all"
                    >
                      <div className="flex gap-3 items-center">
                        <div className="flex h-6 w-6 shrink-0 items-center justify-center bg-slate-100 group-hover:bg-blue-100 transition-colors">
                          <Lightbulb className="h-3 w-3 text-slate-600 group-hover:text-blue-600" />
                        </div>
                        <span className="text-[10px] font-bold leading-tight text-slate-700 group-hover:text-slate-900 uppercase tracking-wide">
                          {q}
                        </span>
                      </div>
                    </Button>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
            <History className="h-4 w-4 text-slate-900" />
            <h2 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Audit Strategis Langsung</h2>
          </div>

          <div className="flex flex-col gap-3">
            {recentConsultations.map((cons, idx) => (
              <Card key={idx} className="border-none shadow-sm bg-white rounded-none overflow-hidden">
                <CardHeader className="p-4 pb-0">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">{cons.region}</span>
                        <span className="text-[10px] font-black text-slate-300">•</span>
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{cons.coop}</span>
                      </div>
                      <CardTitle className="text-xs font-black leading-tight text-slate-900 uppercase tracking-tight">
                        {cons.topik}
                      </CardTitle>
                    </div>
                    <Badge className={`text-[8px] font-black uppercase tracking-widest rounded-none ${
                      cons.status === 'SELESAI' ? 'bg-emerald-100 text-emerald-700' : 
                      cons.status === 'SARAN' ? 'bg-blue-100 text-blue-700' : 
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {cons.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                  <div className="p-3 bg-slate-50 border border-slate-100">
                    <p className="text-[10px] font-bold leading-relaxed text-slate-600 italic">
                      " {cons.jawaban} "
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between pt-3 border-t border-slate-50">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5">
                        <ShieldAlert className={`h-3 w-3 ${cons.impact === 'KRITIS' ? 'text-rose-600' : 'text-slate-400'}`} />
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Dampak: {cons.impact}</span>
                      </div>
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{cons.time}</span>
                    </div>
                    <Button variant="ghost" size="sm" className="h-6 text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 p-0">
                      Detail Audit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="border-2 border-dashed border-slate-200 bg-transparent rounded-none">
            <CardContent className="p-6 flex flex-col items-center justify-center text-center gap-4">
              <div className="h-12 w-12 bg-slate-100 flex items-center justify-center">
                <BrainCircuit className="h-6 w-6 text-slate-400" />
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Konsultasi Strategis Baru</p>
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">Hubungkan AI dengan parameter kebijakan terbaru</p>
              </div>
              <Button size="sm" className="bg-slate-900 text-white hover:bg-slate-800 text-[10px] font-black uppercase tracking-widest px-8 h-9 rounded-none">
                Luncurkan Simulator Strategi
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
