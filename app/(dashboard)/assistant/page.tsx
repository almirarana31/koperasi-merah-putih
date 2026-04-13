'use client'

import { useState, useRef, useEffect, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
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
  Terminal,
  Cpu,
  Download
} from 'lucide-react'
import { KementerianFilterBar } from '@/components/dashboard/kementerian-filter-bar'
import { type ScopeFilters } from '@/lib/kementerian-dashboard-data'
import { getAIResponse } from '@/components/ai/chatbot/ai-logic'
import { toast } from 'sonner'

type ChatMessage = {
  type: 'user' | 'assistant'
  message: string
  time: string
}

const strategicPrompts = [
  'Ringkasan Performa Nasional Hari Ini',
  'Audit Efisiensi Logistik Rute 04',
  'Forecast Ketahanan Pangan Q3 2026',
  'Analisis Anomali Stok Koperasi Sumatra',
]

const formatTime = () =>
  new Date().toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  })

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

  const [messages, setMessages] = useState<ChatMessage[]>(() => [{
    type: 'assistant',
    message: 'Halo. Saya siap membantu analisis strategis nasional. Anda dapat meminta ringkasan performa, prioritas audit, atau status stok lintas unit.',
    time: formatTime(),
  }])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, loading])

  const scaleFactor = useMemo(() => {
    if (filters.cooperativeId !== 'all') return 0.05
    if (filters.villageId !== 'all') return 0.1
    if (filters.regionId !== 'all') return 0.25
    if (filters.provinceId !== 'all') return 0.5
    return 1.0
  }, [filters])

  const handleSend = (draft = input) => {
    const nextInput = draft.trim()
    if (!nextInput) return

    setMessages((prev) => [...prev, { type: 'user', message: nextInput, time: formatTime() }])
    setInput('')
    setLoading(true)

    setTimeout(() => {
      setMessages((prev) => [...prev, {
        type: 'assistant',
        message: getAIResponse(nextInput, 'Nasional'),
        time: formatTime(),
      }])
      setLoading(false)
    }, 700)
  }

  const handleAction = (action: string) => {
    toast.success(`Aksi ${action} berhasil diverifikasi secara nasional`)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-none bg-slate-900 flex items-center justify-center shadow-xl">
            <BrainCircuit className="h-7 w-7 text-emerald-500" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Pusat Komando AI</h1>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">
              Asisten Strategis Nasional • Analisis Big Data Real-Time
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setMessages([{ type: 'assistant', message: 'Sesi direset. Siap menerima instruksi baru.', time: formatTime() }])}
            className="h-10 rounded-none text-[10px] font-black uppercase tracking-widest text-slate-600 border-slate-200 shadow-none"
          >
            <History className="h-4 w-4 mr-2 text-blue-600" />
            Reset Sesi
          </Button>
          <Button 
            size="sm" 
            onClick={() => handleAction('PDF')}
            className="h-10 rounded-none bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-black uppercase tracking-widest px-6 shadow-none"
          >
            <Download className="h-4 w-4 mr-2" />
            Ekspor Log
          </Button>
        </div>
      </div>

      <KementerianFilterBar filters={filters} setFilters={setFilters} />

      <div className="grid gap-6 lg:grid-cols-[1fr_350px]">
        <Card className="rounded-none border-none shadow-sm bg-white flex flex-col h-[calc(100vh-280px)]">
          <div className="h-1.5 w-full bg-emerald-500" />
          <CardHeader className="py-3 px-5 border-b border-slate-50 flex-shrink-0 bg-slate-50/50">
            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-slate-900 flex items-center gap-2">
              <Terminal className="h-3.5 w-3.5" /> Terminal Instruksi AI
            </CardTitle>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col p-0 overflow-hidden relative">
            <ScrollArea className="flex-1 px-5 py-6" ref={scrollRef}>
              <div className="space-y-8">
                {messages.map((message, index) => (
                  <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className="max-w-[85%]">
                      <div className="flex items-center gap-2 mb-2 px-1">
                        <span className={`text-[9px] font-black uppercase tracking-widest ${message.type === 'user' ? 'text-slate-400' : 'text-emerald-600'}`}>
                          {message.type === 'user' ? 'OPERATOR' : 'AI STRATEGIST'}
                        </span>
                        <span className="text-[9px] font-black text-slate-300">{message.time}</span>
                      </div>
                      <div className={`p-4 rounded-none border ${
                        message.type === 'user' 
                        ? 'bg-slate-900 text-white border-slate-800 shadow-xl'
                        : 'bg-slate-50 text-slate-700 border-slate-100'
                      }`}>
                        <div className="text-xs font-bold leading-relaxed uppercase tracking-wide">
                          {renderMessage(message.message)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {loading && (
                  <div className="flex justify-start">
                    <div className="flex items-center gap-3 p-4 bg-slate-50 border border-slate-100 rounded-none">
                      <Loader className="h-3.5 w-3.5 animate-spin text-emerald-600" />
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Menganalisis Parameter Nasional...</span>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            <div className="p-5 border-t border-slate-100 bg-slate-50/50 flex-shrink-0">
              <div className="flex gap-2">
                <input
                  placeholder="Tulis Instruksi Strategis..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  disabled={loading}
                  className="flex-1 h-11 px-4 rounded-none border border-slate-200 bg-white text-[10px] font-black uppercase tracking-widest focus:outline-none focus:ring-1 focus:ring-slate-900"
                />
                <Button 
                  onClick={() => handleSend()} 
                  disabled={loading}
                  className="h-11 w-11 rounded-none bg-slate-900 hover:bg-slate-800 p-0 shadow-none"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-4">
                {strategicPrompts.map((q) => (
                  <Button
                    key={q}
                    variant="outline"
                    onClick={() => handleSend(q)}
                    className="h-7 rounded-none border-slate-200 bg-white text-[9px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-900 hover:text-white transition-colors"
                  >
                    {q}
                  </Button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="rounded-none border-none shadow-sm bg-white overflow-hidden">
            <CardHeader className="p-4 border-b border-slate-50 bg-slate-50/50">
              <CardTitle className="text-[10px] font-black uppercase tracking-widest text-slate-900 flex items-center gap-2">
                <Cpu className="h-3.5 w-3.5 text-amber-500" /> Metrik Mesin
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              {[
                { label: 'Beban Kognitif', value: '42%', icon: Activity, color: 'text-blue-600' },
                { label: 'Analitik Aktif', value: Math.floor(1250 * scaleFactor), icon: Search, color: 'text-emerald-600' },
                { label: 'Akurasi Audit', value: '99.2%', icon: ShieldCheck, color: 'text-indigo-600' },
              ].map((s, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-none">
                  <div className="flex items-center gap-2">
                    <s.icon className={`h-3.5 w-3.5 ${s.color}`} />
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.label}</span>
                  </div>
                  <span className="text-xs font-black text-slate-900">{s.value}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="rounded-none border-none shadow-sm bg-slate-900 text-white overflow-hidden">
            <CardHeader className="p-4 border-b border-white/5 bg-slate-800/50">
              <CardTitle className="text-[10px] font-black uppercase tracking-widest text-white flex items-center gap-2">
                <Activity className="h-3.5 w-3.5 text-emerald-400" /> Aliran Data
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {[
                { label: 'Indeks Harga Realtime', status: 'SYNCED', color: 'bg-emerald-500' },
                { label: 'Satelit Cuaca Nasional', status: 'SYNCED', color: 'bg-emerald-500' },
                { label: 'Telemetri Logistik', status: 'UPDATE', color: 'bg-amber-500' },
                { label: 'Hub Finansial Anggota', status: 'SYNCED', color: 'bg-emerald-500' },
              ].map((stream, i) => (
                <div key={i} className="flex items-center justify-between p-2.5 bg-white/5 rounded-none border border-white/5">
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">{stream.label}</span>
                  <Badge className={`rounded-none border-none text-[8px] font-black px-1.5 h-4 ${stream.color} text-white`}>{stream.status}</Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
