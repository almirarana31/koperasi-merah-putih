'use client'

import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Send, 
  Loader, 
  Zap, 
  BrainCircuit, 
  ShieldCheck, 
  Activity, 
  History, 
  Search,
  MessageSquareText,
  Terminal,
  Cpu
} from 'lucide-react'
import { KementerianFilterBar } from '@/components/dashboard/kementerian-filter-bar'
import { type ScopeFilters } from '@/lib/kementerian-dashboard-data'

const strategicPrompts = [
  'SIMULASI INTERVENSI HARGA BERAS JAWA BARAT',
  'AUDIT EFISIENSI LOGISTIK RUTE NASIONAL 04',
  'FORECAST KETAHANAN PANGAN Q3 2026',
  'ANALISIS ANOMALI STOK KOPERASI SUMATERA',
]

const initialConversations = [
  {
    type: 'user',
    message: 'HALO AI, ANALISIS DAMPAK KENAIKAN HARGA BBM TERHADAP MARGIN PETANI PADI DI JAWA TENGAH.',
    time: '14:32',
  },
  {
    type: 'assistant',
    message: 'BERDASARKAN ANALISIS DATA LOGISTIK & PRODUKSI TERKINI:\n\n1. **KENAIKAN LOGISTIK (+12%)**: BIAYA TRANSPORTASI GABAH KE PENGGILINGAN NAIK RP 150/KG.\n2. **PENURUNAN MARGIN (-4.5%)**: JIKA HARGA JUAL TETAP, MARGIN BERSIH PETANI TURUN KE RP 1.200/KG.\n3. **INTERVENSI STRATEGIS**: DISARANKAN SUBSIDI BIAYA ANGKUTAN KOPERASI (BPDPB) SEBESAR RP 100/KG UNTUK MENJAGA DAYA BELI.\n\nESTIMASI BIAYA INTERVENSI NASIONAL: RP 4.5M/BULAN.',
    time: '14:33',
  },
]

function renderMessage(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index} className="text-slate-900 font-black">{part.slice(2, -2)}</strong>
    }
    return part
  })
}

export default function AssistantPage() {
  const [filters, setFilters] = useState<ScopeFilters>({
    provinceId: 'all',
    regionId: 'all',
    villageId: 'all',
    cooperativeId: 'all',
    commodityId: 'all',
  })

  const [messages, setMessages] = useState(initialConversations)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, loading])

  const scaleFactor = filters.provinceId === 'all' ? 1 : filters.regionId === 'all' ? 0.3 : 0.1

  const aiStats = [
    { label: 'COGNITIVE LOAD', value: '42%', icon: Cpu, color: 'text-amber-500' },
    { label: 'ACTIVE ANALYTICS', value: Math.floor(1250 * scaleFactor), icon: Activity, color: 'text-blue-600' },
    { label: 'DECISION SUPPORT', value: Math.floor(842 * scaleFactor), icon: BrainCircuit, color: 'text-emerald-600' },
    { label: 'AUDIT ACCURACY', value: '99.2%', icon: ShieldCheck, color: 'text-indigo-600' },
  ]

  const handleSend = () => {
    if (!input.trim()) return

    const nextUserMessage = {
      type: 'user' as const,
      message: input.toUpperCase(),
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    }

    setMessages((prev) => [...prev, nextUserMessage])
    setInput('')
    setLoading(true)

    setTimeout(() => {
      const responses = [
        'BERDASARKAN DATA AGREGAT DI [SCOPE], REKOMENDASI SAYA ADALAH FOKUS PADA KOMODITAS DENGAN ANOMALI HARGA TERTINGGI. ANALISIS AI MENUNJUKKAN POTENSI PENSTABILAN MELALUI MOBILISASI STOK LINTAS DAERAH.',
        'SISTEM MENDETEKSI GAP SUPPLY PADA WILAYAH TERPILIH. DISARANKAN PENINGKATAN AUDIT COLD CHAIN UNTUK MEMINIMALISIR WASTE PASCA PANEN (+15% SAVINGS POTENTIAL).',
        'STRATEGI INTERVENSI HARGA DAPAT DIAKTIVASI. PARAMETER AI MENUNJUKKAN TINGKAT KEBERHASILAN 89% DENGAN DISTRIBUSI LOGISTIK YANG TERINTEGRASI.',
      ]

      const randomResponse = responses[Math.floor(Math.random() * responses.length)]
      setMessages((prev) => [
        ...prev,
        {
          type: 'assistant',
          message: randomResponse,
          time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
        },
      ])
      setLoading(false)
    }, 1200)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black tracking-tighter text-slate-900 uppercase leading-none">
              AI COMMAND HUB
            </h1>
            <p className="text-[10px] font-bold tracking-widest text-slate-500 uppercase mt-2">
              PUSAT KOMANDO STRATEGIS & ASISTEN PENGAMBILAN KEPUTUSAN NASIONAL
            </p>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="border-slate-300 bg-slate-50 text-[10px] font-black text-slate-700 uppercase">
              Uptime: 24/7/365
            </Badge>
            <Badge variant="outline" className="border-emerald-500/30 bg-emerald-50 text-[10px] font-black text-emerald-700">
              V.3.5.2-LATEST
            </Badge>
          </div>
        </div>

        <KementerianFilterBar filters={filters} setFilters={setFilters} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_350px]">
        {/* MAIN CHAT INTERFACE */}
        <div className="flex flex-col gap-4">
          <Card className="flex flex-col border-none bg-white shadow-sm h-[calc(100vh-280px)]">
            <CardHeader className="py-3 px-4 border-b border-slate-100 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <CardTitle className="text-[11px] font-black tracking-widest text-slate-900 uppercase">
                    KOPDES SMART STRATEGIST
                  </CardTitle>
                </div>
                <Button variant="ghost" size="sm" className="h-7 text-[8px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900">
                  <History className="mr-1.5 h-3 w-3" /> SESSION LOGS
                </Button>
              </div>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col p-0 overflow-hidden relative">
              <ScrollArea className="flex-1 px-4 py-6" ref={scrollRef}>
                <div className="space-y-6">
                  {messages.map((message, index) => (
                    <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[85%] group`}>
                        <div className="flex items-center gap-2 mb-1 px-1">
                          <span className={`text-[8px] font-black uppercase tracking-widest ${message.type === 'user' ? 'text-slate-500' : 'text-emerald-600'}`}>
                            {message.type === 'user' ? 'COMMANDER' : 'AI.STRATEGIST'}
                          </span>
                          <span className="text-[8px] font-bold text-slate-300">{message.time}</span>
                        </div>
                        <div className={`rounded-xl p-4 shadow-sm border ${
                          message.type === 'user' 
                          ? 'bg-slate-900 text-slate-50 border-slate-800' 
                          : 'bg-white text-slate-700 border-slate-100'
                        }`}>
                          <div className="whitespace-pre-wrap text-[11px] font-bold leading-relaxed tracking-tight uppercase">
                            {renderMessage(message.message)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {loading && (
                    <div className="flex justify-start">
                      <div className="max-w-[85%]">
                        <div className="flex items-center gap-2 mb-1 px-1">
                          <span className="text-[8px] font-black uppercase tracking-widest text-emerald-600">AI.STRATEGIST</span>
                        </div>
                        <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4 border border-slate-100">
                          <Loader className="h-3 w-3 animate-spin text-emerald-600" />
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Processing Data Matrices...</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              <div className="p-4 border-t border-slate-100 bg-slate-50/30 flex-shrink-0">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Terminal className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                    <Input
                      placeholder="ENTER STRATEGIC COMMAND..."
                      value={input}
                      onChange={(event) => setInput(event.target.value.toUpperCase())}
                      onKeyPress={(event) => event.key === 'Enter' && handleSend()}
                      disabled={loading}
                      className="h-10 pl-10 border-slate-200 bg-white text-[10px] font-black tracking-widest uppercase focus-visible:ring-emerald-500"
                    />
                  </div>
                  <Button onClick={handleSend} disabled={loading} className="bg-slate-900 hover:bg-slate-800 h-10 w-10 p-0 shrink-0">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex flex-wrap gap-1.5 mt-3">
                  {strategicPrompts.map((question) => (
                    <Button
                      key={question}
                      variant="outline"
                      size="sm"
                      className="h-6 text-[8px] font-black uppercase tracking-tighter border-slate-200 bg-white hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
                      onClick={() => setInput(question)}
                    >
                      {question}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* SIDEBAR ANALYTICS */}
        <div className="flex flex-col gap-4">
          <Card className="border-none shadow-sm overflow-hidden">
            <CardHeader className="py-3 px-4 bg-slate-50 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Zap className="h-3.5 w-3.5 text-amber-500" />
                <CardTitle className="text-[10px] font-black tracking-widest text-slate-900 uppercase">
                  ENGINE PERFORMANCE
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-4 grid gap-4">
              {aiStats.map((stat) => (
                <div key={stat.label} className="flex items-center justify-between p-2 bg-slate-50/50 rounded border border-slate-50">
                  <div className="flex items-center gap-2">
                    <stat.icon className={`h-3.5 w-3.5 ${stat.color}`} />
                    <span className="text-[9px] font-black text-slate-500 uppercase">{stat.label}</span>
                  </div>
                  <span className="text-[11px] font-black text-slate-900">{stat.value}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm overflow-hidden flex-1">
            <CardHeader className="py-3 px-4 bg-slate-50 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Search className="h-3.5 w-3.5 text-blue-500" />
                <CardTitle className="text-[10px] font-black tracking-widest text-slate-900 uppercase">
                  ACTIVE DATA STREAMS
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-4 flex flex-col gap-2">
              {[
                { label: 'PRICE_INDEX_REALTIME', status: 'SYNCED', color: 'bg-emerald-500' },
                { label: 'WEATHER_SAT_FEED', status: 'SYNCED', color: 'bg-emerald-500' },
                { label: 'LOGISTICS_TELEMETRY', status: 'UPDATING', color: 'bg-amber-500' },
                { label: 'MEMBER_FINANCIAL_HUB', status: 'SYNCED', color: 'bg-emerald-500' },
                { label: 'GLOBAL_MARKET_TICKER', status: 'DELAYED', color: 'bg-rose-500' },
              ].map((stream) => (
                <div key={stream.label} className="flex items-center justify-between p-2 bg-slate-50/30 rounded">
                  <span className="text-[9px] font-black text-slate-700 tracking-tighter uppercase">{stream.label}</span>
                  <div className="flex items-center gap-1.5">
                    <div className={`h-1.5 w-1.5 rounded-full ${stream.color}`} />
                    <span className="text-[8px] font-black text-slate-400 uppercase">{stream.status}</span>
                  </div>
                </div>
              ))}

              <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
                <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest px-1">KNOWLEDGE BASE STATUS</p>
                <Badge className="w-full justify-between py-1.5 bg-slate-900 text-white font-black text-[9px]">
                  <span>LAST FULL SYNC</span>
                  <span>TODAY 04:00 AM</span>
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
