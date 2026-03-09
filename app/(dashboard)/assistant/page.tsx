'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Send, Loader, Zap, MessageCircle } from 'lucide-react'

const exampleQuestions = [
  'Berapa estimasi revenue bulan depan?',
  'Apa rekomendasi harga Beras Grade A hari ini?',
  'Bagaimana performa pengiriman Rute Utama?',
  'Komoditas apa yang paling menguntungkan saat ini?',
]

const conversations = [
  {
    type: 'user',
    message: 'Halo, apa saran kamu untuk meningkatkan penjualan bulan ini?',
    time: '14:32',
  },
  {
    type: 'assistant',
    message: 'Berdasarkan analisis pasar terkini, saya merekomendasikan 3 strategi:\n\n1. **Fokus pada Beras Grade A** - Demand naik 176% dengan margin keuntungan optimal Rp 9.2k per kg\n\n2. **Ekspansi Wortel Organik** - Buyer baru mencari supplier dengan 53% kenaikan permintaan\n\n3. **Optimalkan Rute Pengiriman** - Hemat Rp 994k/bulan dengan 2 kendaraan alih-alih 3\n\nEstimasi peningkatan revenue: +Rp 12.5jt/bulan',
    time: '14:33',
  },
  {
    type: 'user',
    message: 'Berapa confidence level untuk forecast bulan depan?',
    time: '14:34',
  },
  {
    type: 'assistant',
    message: 'Confidence level forecast bulan depan adalah **89%** untuk Beras dan **87%** untuk Cabai.\n\nFaktor yang mempengaruhi:\n- Data historis: 35%\n- Tren pasar: 28%\n- Faktor seasonal: 22%\n- Berita pasar: 15%\n\nRekomendasi: Persiapkan stok dengan buffer 15-20% untuk mengurangi risiko stockout.',
    time: '14:35',
  },
]

function renderMessage(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={i}>{part.slice(2, -2)}</strong>
    }
    return part
  })
}

export default function AssistantPage() {
  const [messages, setMessages] = useState(conversations)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSend = () => {
    if (!input.trim()) return

    setMessages([...messages, { type: 'user', message: input, time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) }])
    setInput('')
    setLoading(true)

    setTimeout(() => {
      const responses = [
        'Berdasarkan data terkini, rekomendasi saya adalah fokus pada produk dengan margin tertinggi yaitu Beras Grade A dan Wortel Organik.',
        'Forecast menunjukkan peningkatan demand 45% bulan depan. Persiapkan stok dan jangan lupa proactive marketing.',
        'Rute pengiriman saat ini sudah optimal dengan efisiensi 22%. Pertahankan jadwal yang ada.',
      ]
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)]
      setMessages((prev) => [...prev, { type: 'assistant', message: randomResponse, time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) }])
      setLoading(false)
    }, 1000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">AI Assistant</h1>
        <p className="text-muted-foreground mt-2">Chat dengan AI untuk konsultasi bisnis dan pengambilan keputusan</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        <div className="lg:col-span-3">
          <Card className="flex flex-col h-[calc(100vh-220px)]">
            <CardHeader className="border-b shrink-0">
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-600" />
                KOPDES Smart Assistant
              </CardTitle>
              <CardDescription>Powered by AI Intelligence Engine</CardDescription>
            </CardHeader>
            
            <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
              <ScrollArea className="flex-1 min-h-0 p-4">
                <div className="space-y-4">
                  {messages.map((msg, idx) => (
                    <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs rounded-lg p-3 ${msg.type === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'}`}>
                        <div className="text-sm whitespace-pre-wrap">{renderMessage(msg.message)}</div>
                        <p className={`text-xs mt-1 ${msg.type === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                          {msg.time}
                        </p>
                      </div>
                    </div>
                  ))}
                  {loading && (
                    <div className="flex justify-start">
                      <div className="bg-muted rounded-lg p-3 flex items-center gap-2">
                        <Loader className="h-4 w-4 animate-spin" />
                        <span className="text-sm text-muted-foreground">Sedang berpikir...</span>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              <div className="border-t p-4 space-y-3 shrink-0">
              <div className="flex gap-2">
                <Input
                  placeholder="Tanya AI Assistant..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  disabled={loading}
                />
                <Button onClick={handleSend} disabled={loading} size="icon">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {exampleQuestions.map((q) => (
                  <Button
                    key={q}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                    onClick={() => { setInput(q); }}
                  >
                    {q}
                  </Button>
                ))}
              </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Kemampuan AI</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Badge variant="outline" className="w-full justify-start">
                📊 Analisis Data
              </Badge>
              <Badge variant="outline" className="w-full justify-start">
                💰 Rekomendasi Harga
              </Badge>
              <Badge variant="outline" className="w-full justify-start">
                📈 Forecast Demand
              </Badge>
              <Badge variant="outline" className="w-full justify-start">
                🗺️ Optimasi Rute
              </Badge>
              <Badge variant="outline" className="w-full justify-start">
                🎯 Strategi Bisnis
              </Badge>
              <Badge variant="outline" className="w-full justify-start">
                💡 Smart Insights
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Status AI</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm font-medium">Response Time</p>
                <p className="text-lg font-bold">0.8s</p>
              </div>
              <div>
                <p className="text-sm font-medium">Accuracy</p>
                <p className="text-lg font-bold">94.2%</p>
              </div>
              <div>
                <p className="text-sm font-medium">Knowledge</p>
                <Badge>Updated Daily</Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
