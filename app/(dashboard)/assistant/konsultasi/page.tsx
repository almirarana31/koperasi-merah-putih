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
  Scale
} from 'lucide-react'
import { KementerianFilterBar } from '@/components/dashboard/kementerian-filter-bar'
import { type ScopeFilters } from '@/lib/kementerian-dashboard-data'

const strategicTopics = [
  {
    kategori: 'STRATEGI NASIONAL & KETAHANAN PANGAN',
    priority: 'CRITICAL',
    topics: [
      'Waktu optimal untuk penanaman komoditas strategis nasional',
      'Mitigasi kegagalan panen lintas provinsi',
      'Stabilisasi pasokan pangan daerah remote',
      'Integrasi cadangan beras pemerintah (CBP)',
      'Program subsidi pupuk presisi berbasis data AI',
    ],
  },
  {
    kategori: 'OPTIMASI PASAR & INTERVENSI HARGA',
    priority: 'HIGH',
    topics: [
      'Analisis target harga jual komoditas Grade A nasional',
      'Efektivitas intervensi harga pada pasar lokal',
      'Negosiasi kontrak ekspor agregat koperasi',
      'Deteksi anomali harga di tingkat distributor',
      'Positioning produk unggulan daerah di pasar global',
    ],
  },
  {
    kategori: 'LOGISTIK NASIONAL & COLD CHAIN AUDIT',
    priority: 'MEDIUM',
    topics: [
      'Optimasi rute logistik nasional untuk efisiensi BBM',
      'Audit infrastruktur cold chain di wilayah Timur',
      'Standardisasi packaging ekspor berkelanjutan',
      'Manajemen risiko rantai pasok terhadap bencana',
      'Integrasi last-mile delivery antar koperasi unit desa',
    ],
  },
  {
    kategori: 'KEUANGAN MIKRO & INVESTASI STRATEGIS',
    priority: 'HIGH',
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
    status: 'RESOLVED',
    impact: 'HIGH',
    time: '12 MIN LALU',
  },
  {
    region: 'SULAWESI SELATAN',
    coop: 'KOPERASI TANI MAKMUR',
    topik: 'Optimasi Distribusi Beras Premium',
    jawaban: 'Rekomendasi: Alihkan 30% supply ke Balikpapan (Demand Gap 12%). Harga jual potensial: +Rp 800/kg. Efisiensi rute: 15%.',
    status: 'IN-PROGRESS',
    impact: 'MEDIUM',
    time: '45 MIN LALU',
  },
  {
    region: 'NASIONAL',
    coop: 'PUSAT DATA KEMENTERIAN',
    topik: 'Simulasi Dampak El Nino Q3',
    jawaban: 'Vulnerabilitas terdeteksi pada 12% lahan padi. Disarankan percepatan masa tanam 2 minggu & optimalisasi embung di 450 titik prioritas.',
    status: 'ADVISORY',
    impact: 'CRITICAL',
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
      label: 'STRATEGIC QUERIES', 
      value: Math.floor(1254 * scaleFactor), 
      trend: '+12%', 
      icon: MessageSquareText,
      color: 'text-emerald-600'
    },
    { 
      label: 'AI ACCURACY RATE', 
      value: '98.2%', 
      trend: 'STABLE', 
      icon: BrainCircuit,
      color: 'text-blue-600'
    },
    { 
      label: 'RESOLVED ISSUES', 
      value: Math.floor(892 * scaleFactor), 
      trend: '+5%', 
      icon: CheckCircle,
      color: 'text-emerald-500'
    },
    { 
      label: 'RISK ALERTS', 
      value: Math.floor(42 * scaleFactor), 
      trend: '-18%', 
      icon: ShieldAlert,
      color: 'text-rose-600'
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold  text-slate-900 ">
              STRATEGIC CONSULTATION HUB
            </h1>
            <p className="text-xs font-bold  text-slate-500 ">
              PUSAT KONSULTASI STRATEGIS & INTELEJEN AI NASIONAL
            </p>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="border-emerald-500/30 bg-emerald-50 text-xs font-semibold text-emerald-700">
              AI ENGINE: ACTIVE
            </Badge>
            <Badge variant="outline" className="border-slate-300 bg-slate-50 text-xs font-semibold text-slate-700 ">
              REFRESH: 60S
            </Badge>
          </div>
        </div>

        <KementerianFilterBar filters={filters} setFilters={setFilters} />
      </div>

      {/* KPI GRID */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-none bg-white shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
                <span className={`text-xs font-semibold  ${stat.trend.startsWith('+') ? 'text-emerald-600' : stat.trend.startsWith('-') ? 'text-rose-600' : 'text-slate-500'}`}>
                  {stat.trend}
                </span>
              </div>
              <div className="mt-2">
                <p className="text-xs font-semibold  text-slate-500 ">{stat.label}</p>
                <p className="text-xl font-semibold  text-slate-900">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
        {/* STRATEGIC KNOWLEDGE BASE */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
            <Scale className="h-4 w-4 text-slate-900" />
            <h2 className="text-xs font-semibold  text-slate-900 ">STRATEGIC KNOWLEDGE BASE</h2>
          </div>
          
          <div className="grid gap-3">
            {strategicTopics.map((group) => (
              <Card key={group.kategori} className="overflow-hidden border-none shadow-sm transition-all hover:shadow-md">
                <div className={`h-1 w-full ${group.priority === 'CRITICAL' ? 'bg-rose-600' : group.priority === 'HIGH' ? 'bg-amber-500' : 'bg-blue-500'}`} />
                <CardHeader className="py-3 px-4 bg-slate-50/50">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xs font-semibold  text-slate-900 ">
                      {group.kategori}
                    </CardTitle>
                    <Badge className={`text-xs font-semibold ${group.priority === 'CRITICAL' ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-700'}`}>
                      {group.priority}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4 grid grid-cols-1 gap-2">
                  {group.topics.map((q) => (
                    <Button
                      key={q}
                      variant="outline"
                      className="group justify-start h-auto p-3 text-left border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/30"
                    >
                      <div className="flex gap-3">
                        <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-slate-100 group-hover:bg-emerald-100 transition-colors">
                          <Lightbulb className="h-2.5 w-2.5 text-slate-600 group-hover:text-emerald-600" />
                        </div>
                        <span className="text-xs font-bold leading-tight text-slate-700 group-hover:text-slate-900">
                          {q.toUpperCase()}
                        </span>
                      </div>
                    </Button>
                  ))}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* LIVE STRATEGIC AUDIT FEED */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
            <History className="h-4 w-4 text-slate-900" />
            <h2 className="text-xs font-semibold  text-slate-900 ">LIVE STRATEGIC AUDIT</h2>
          </div>

          <div className="flex flex-col gap-3">
            {recentConsultations.map((cons, idx) => (
              <Card key={idx} className="border-none shadow-sm">
                <CardHeader className="p-4 pb-0">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold  text-emerald-600">{cons.region}</span>
                        <span className="text-xs font-bold text-slate-400">•</span>
                        <span className="text-xs font-semibold  text-slate-500">{cons.coop}</span>
                      </div>
                      <CardTitle className="text-sm font-semibold leading-tight text-slate-900 ">
                        {cons.topik}
                      </CardTitle>
                    </div>
                    <Badge className={`text-xs font-semibold ${
                      cons.status === 'RESOLVED' ? 'bg-emerald-100 text-emerald-700' : 
                      cons.status === 'ADVISORY' ? 'bg-blue-100 text-blue-700' : 
                      'bg-amber-100 text-amber-700'
                    }`}>
                      {cons.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4 space-y-3">
                  <div className="rounded border border-slate-100 bg-slate-50/50 p-3">
                    <p className="text-xs font-bold leading-relaxed text-slate-700  italic">
                      " {cons.jawaban} "
                    </p>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1">
                        <ShieldAlert className={`h-3 w-3 ${cons.impact === 'CRITICAL' ? 'text-rose-600' : 'text-slate-400'}`} />
                        <span className="text-xs font-semibold text-slate-500 ">IMPACT: {cons.impact}</span>
                      </div>
                      <span className="text-xs font-semibold text-slate-400">{cons.time}</span>
                    </div>
                    <Button variant="ghost" size="sm" className="h-6 text-xs font-semibold   hover:text-emerald-600">
                      AUDIT DETAIL
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="border-dashed border-2 border-slate-200 bg-transparent">
            <CardContent className="p-6 flex flex-col items-center justify-center text-center gap-3">
              <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center">
                <BrainCircuit className="h-5 w-5 text-slate-400" />
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-900 ">KONSULTASI STRATEGIS BARU</p>
                <p className="text-xs font-bold text-slate-500 mt-1 ">HUBUNGKAN AI DENGAN PARAMETER KEBIJAKAN TERBARU</p>
              </div>
              <Button size="sm" className="bg-slate-900 hover:bg-slate-800 text-xs font-semibold  ">
                LAUNCH STRATEGY SIMULATOR
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
