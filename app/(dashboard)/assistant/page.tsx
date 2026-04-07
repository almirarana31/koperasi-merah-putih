'use client'

import { useState, useRef, useEffect } from 'react'
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
  Cpu
} from 'lucide-react'
import { KementerianFilterBar } from '@/components/dashboard/kementerian-filter-bar'
import { type ScopeFilters } from '@/lib/kementerian-dashboard-data'
import { getAIResponse } from '@/components/ai/chatbot/ai-logic'

type ChatMessage = {
  type: 'user' | 'assistant'
  message: string
  time: string
}

const strategicPrompts = [
  'Ringkasan Performa Nasional Hari Ini',
  'Audit Efisiensi Logistik Rute Nasional 04',
  'Forecast Ketahanan Pangan Q3 2026',
  'Analisis Anomali Stok Koperasi Sumatra',
]

const defaultFilters: ScopeFilters = {
  provinceId: 'all',
  regionId: 'all',
  villageId: 'all',
  cooperativeId: 'all',
  commodityId: 'all',
}

const formatTime = () =>
  new Date().toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
  })

function getScopeLabel(filters: ScopeFilters) {
  if (filters.cooperativeId !== 'all') return 'Koperasi Terpilih'
  if (filters.villageId !== 'all') return 'Desa Terpilih'
  if (filters.regionId !== 'all') return 'Wilayah Terpilih'
  if (filters.provinceId !== 'all') return 'Provinsi Terpilih'
  return 'Nasional'
}

function createWelcomeMessage(scopeLabel: string): ChatMessage {
  return {
    type: 'assistant',
    message: `Halo. Saya siap membantu analisis strategis untuk ${scopeLabel}. Anda dapat meminta ringkasan performa, prioritas audit, proyeksi harga, atau status stok lintas unit.`,
    time: formatTime(),
  }
}

function renderMessage(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index} className="text-slate-900 font-semibold">{part.slice(2, -2)}</strong>
    }
    return part
  })
}

export default function AssistantPage() {
  const [filters, setFilters] = useState<ScopeFilters>(defaultFilters)

  const [messages, setMessages] = useState<ChatMessage[]>(() => [createWelcomeMessage('Nasional')])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, loading])

  const scaleFactor = filters.provinceId === 'all' ? 1 : filters.regionId === 'all' ? 0.3 : 0.1
  const scopeLabel = getScopeLabel(filters)

  const aiStats = [
    { label: 'Cognitive Load', value: '42%', icon: Cpu, color: 'text-amber-500' },
    { label: 'Active Analytics', value: Math.floor(1250 * scaleFactor), icon: Activity, color: 'text-blue-600' },
    { label: 'Decision Support', value: Math.floor(842 * scaleFactor), icon: BrainCircuit, color: 'text-emerald-600' },
    { label: 'Audit Accuracy', value: '99.2%', icon: ShieldCheck, color: 'text-indigo-600' },
  ]

  const resetConversation = () => {
    setInput('')
    setLoading(false)
    setMessages([createWelcomeMessage(scopeLabel)])
  }

  const handleSend = (draft = input) => {
    const nextInput = draft.trim()
    if (!nextInput) return

    const nextUserMessage = {
      type: 'user' as const,
      message: nextInput,
      time: formatTime(),
    }

    setMessages((prev) => [...prev, nextUserMessage])
    setInput('')
    setLoading(true)

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          type: 'assistant',
          message: getAIResponse(nextInput, scopeLabel),
          time: formatTime(),
        },
      ])
      setLoading(false)
    }, 700)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 leading-none">
              AI Command Hub
            </h1>
            <p className="mt-2 text-xs font-medium text-slate-500">
              Pusat Komando Strategis dan Asisten Pengambilan Keputusan Nasional
            </p>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline" className="border-slate-300 bg-slate-50 text-xs font-semibold text-slate-700">
              Uptime 24/7
            </Badge>
            <Badge variant="outline" className="border-emerald-500/30 bg-emerald-50 text-xs font-semibold text-emerald-700">
              Scope: {scopeLabel}
            </Badge>
          </div>
        </div>

        <KementerianFilterBar filters={filters} setFilters={setFilters} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_350px]">
        {/* MAIN CHAT INTERFACE */}
        <div className="flex flex-col gap-4">
          <Card className="flex h-[calc(100vh-280px)] flex-col border-[var(--dashboard-secondary-border)] bg-white shadow-sm">
            <CardHeader className="py-3 px-4 border-b border-slate-100 flex-shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <CardTitle className="text-sm font-semibold text-slate-900">
                    Kopdes Smart Strategist
                  </CardTitle>
                </div>
                <Button variant="ghost" size="sm" onClick={resetConversation} className="h-7 text-xs font-semibold text-slate-400 hover:text-slate-900">
                  <History className="mr-1.5 h-3 w-3" /> Reset Session
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
                          <span className={`text-xs font-semibold ${message.type === 'user' ? 'text-slate-500' : 'text-emerald-600'}`}>
                            {message.type === 'user' ? 'Operator' : 'AI Strategist'}
                          </span>
                          <span className="text-xs font-bold text-slate-300">{message.time}</span>
                        </div>
                        <div className={`rounded-xl p-4 shadow-sm border ${
                          message.type === 'user' 
                          ? 'border-[var(--dashboard-primary)]/15 bg-[var(--dashboard-primary)] text-white'
                          : 'bg-white text-slate-700 border-slate-100'
                        }`}>
                          <div className="whitespace-pre-wrap text-sm leading-relaxed">
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
                          <span className="text-xs font-semibold text-emerald-600">AI Strategist</span>
                        </div>
                        <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-4 border border-slate-100">
                          <Loader className="h-3 w-3 animate-spin text-emerald-600" />
                          <span className="text-xs font-medium text-slate-500">Menganalisis Data untuk Scope Aktif...</span>
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
                      placeholder="Tulis Pertanyaan Strategis..."
                      value={input}
                      onChange={(event) => setInput(event.target.value)}
                      onKeyDown={(event) => event.key === 'Enter' && handleSend()}
                      disabled={loading}
                      className="h-10 pl-10 border-slate-200 bg-white text-sm focus-visible:ring-emerald-500"
                    />
                  </div>
                  <Button onClick={() => handleSend()} disabled={loading} className="h-10 w-10 shrink-0 bg-[var(--dashboard-primary)] p-0 hover:bg-[var(--dashboard-primary-hover)]">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex flex-wrap gap-1.5 mt-3">
                  {strategicPrompts.map((question) => (
                    <Button
                      key={question}
                      variant="outline"
                      size="sm"
                      className="h-6 border-slate-200 bg-white text-xs font-semibold transition-colors hover:bg-emerald-50 hover:text-emerald-700"
                      onClick={() => handleSend(question)}
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
          <Card className="overflow-hidden border-[var(--dashboard-secondary-border)] shadow-sm">
            <CardHeader className="py-3 px-4 bg-slate-50 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Zap className="h-3.5 w-3.5 text-amber-500" />
                <CardTitle className="text-xs font-semibold text-slate-900">
                  Engine Performance
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-4 grid gap-4">
              {aiStats.map((stat) => (
                <div key={stat.label} className="flex items-center justify-between p-2 bg-slate-50/50 rounded border border-slate-50">
                  <div className="flex items-center gap-2">
                    <stat.icon className={`h-3.5 w-3.5 ${stat.color}`} />
                    <span className="text-xs font-semibold text-slate-500">{stat.label}</span>
                  </div>
                  <span className="text-sm font-semibold text-slate-900">{stat.value}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="flex-1 overflow-hidden border-[var(--dashboard-secondary-border)] shadow-sm">
            <CardHeader className="py-3 px-4 bg-slate-50 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Search className="h-3.5 w-3.5 text-blue-500" />
                <CardTitle className="text-xs font-semibold text-slate-900">
                  Active Data Streams
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-4 flex flex-col gap-2">
              {[
                { label: 'Price Index Realtime', status: 'Synced', color: 'bg-emerald-500' },
                { label: 'Weather Satellite Feed', status: 'Synced', color: 'bg-emerald-500' },
                { label: 'Logistics Telemetry', status: 'Updating', color: 'bg-amber-500' },
                { label: 'Member Financial Hub', status: 'Synced', color: 'bg-emerald-500' },
                { label: 'Global Market Ticker', status: 'Delayed', color: 'bg-rose-500' },
              ].map((stream) => (
                <div key={stream.label} className="flex items-center justify-between p-2 bg-slate-50/30 rounded">
                  <span className="text-xs font-semibold text-slate-700">{stream.label}</span>
                  <div className="flex items-center gap-1.5">
                    <div className={`h-1.5 w-1.5 rounded-full ${stream.color}`} />
                    <span className="text-xs font-semibold text-slate-400">{stream.status}</span>
                  </div>
                </div>
              ))}

              <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
                <p className="px-1 text-xs font-semibold text-slate-400">Knowledge Base Status</p>
                <Badge className="w-full justify-between bg-[var(--dashboard-primary)] py-1.5 text-xs font-semibold text-white">
                  <span>Last Full Sync</span>
                  <span>Today 04:00</span>
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
