'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Send, Loader, Zap } from 'lucide-react'
import { useAuth } from '@/lib/auth'

const exampleQuestions = [
  'Berapa estimasi revenue bulan depan?',
  'Apa rekomendasi harga Beras Grade A hari ini?',
  'Bagaimana performa pengiriman Rute Utama?',
  'Komoditas apa yang paling menguntungkan saat ini?',
]

const farmerQuestions = [
  'Kapan waktu terbaik menjual hasil panen saya?',
  'Berapa harga acuan cabai minggu ini?',
  'Apa saran AI untuk rencana tanam berikutnya?',
  'Bagaimana peluang pinjaman untuk anggota saya?',
]

const conversations = [
  {
    type: 'user',
    message: 'Halo, apa saran kamu untuk meningkatkan penjualan bulan ini?',
    time: '14:32',
  },
  {
    type: 'assistant',
    message: 'Berdasarkan analisis pasar terkini, saya merekomendasikan 3 strategi:\n\n1. **Fokus pada Beras Grade A** untuk margin terbaik.\n2. **Perbaiki distribusi** agar tidak ada keterlambatan pengiriman.\n3. **Gunakan insight AI** untuk membaca demand mingguan.\n\nEstimasi peningkatan revenue: +Rp 12.5jt/bulan.',
    time: '14:33',
  },
]

function renderMessage(text: string) {
  const parts = text.split(/(\*\*[^*]+\*\*)/g)
  return parts.map((part, index) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return <strong key={index}>{part.slice(2, -2)}</strong>
    }
    return part
  })
}

export default function AssistantPage() {
  const { user } = useAuth()
  const [messages, setMessages] = useState(conversations)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const isPetaniView = user?.role === 'petani'
  const title = isPetaniView ? 'Asisten Tani AI' : 'AI Assistant'
  const subtitle = isPetaniView
    ? 'Tanya soal panen, harga, pembiayaan, dan langkah usaha tani berikutnya.'
    : 'Chat dengan AI untuk konsultasi bisnis dan pengambilan keputusan'
  const promptSuggestions = isPetaniView ? farmerQuestions : exampleQuestions
  const capabilityBadges = isPetaniView
    ? ['Harga Komoditas', 'Rencana Tanam', 'Pinjaman Anggota', 'Konsultasi Tani', 'Notifikasi Panen', 'Insight Komoditas']
    : ['Analisis Data', 'Rekomendasi Harga', 'Forecast Demand', 'Optimasi Rute', 'Strategi Bisnis', 'Smart Insights']

  const handleSend = () => {
    if (!input.trim()) return

    const nextUserMessage = {
      type: 'user' as const,
      message: input,
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    }

    setMessages((prev) => [...prev, nextUserMessage])
    setInput('')
    setLoading(true)

    setTimeout(() => {
      const responses = isPetaniView
        ? [
            'Untuk posisi Anda sebagai petani, saya sarankan fokus pada harga pasar harian, waktu panen, dan kesiapan pembiayaan. Mulai dari halaman Harga Pasar dan Pinjaman Saya.',
            'AI melihat peluang terbaik ada pada komoditas dengan permintaan stabil dan margin sehat. Pantau rekomendasi harga dan jadwal panen sebelum menentukan waktu jual.',
            'Langkah aman berikutnya adalah periksa hasil panen, lihat harga acuan, lalu cocokkan dengan kebutuhan pinjaman atau modal musim berikutnya.',
          ]
        : [
            'Berdasarkan data terkini, rekomendasi saya adalah fokus pada produk dengan margin tertinggi dan jalur distribusi yang paling efisien.',
            'Forecast menunjukkan peningkatan demand bulan depan. Persiapkan stok dan penjadwalan operasional lebih awal.',
            'AI menyarankan Anda memprioritaskan modul dengan bottleneck tertinggi minggu ini untuk meningkatkan efisiensi tim.',
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
    }, 1000)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="mt-2 text-muted-foreground">{subtitle}</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        <div className="lg:col-span-3">
          <Card className="flex h-[calc(100vh-220px)] flex-col">
            <CardHeader className="shrink-0 border-b">
              <CardTitle className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                {isPetaniView ? 'Pendamping Digital Petani' : 'KOPDES Smart Assistant'}
              </CardTitle>
              <CardDescription>
                {isPetaniView ? 'Jawaban difokuskan pada kebutuhan anggota dan usaha tani pribadi.' : 'Powered by AI Intelligence Engine'}
              </CardDescription>
            </CardHeader>

            <CardContent className="flex flex-1 flex-col overflow-hidden p-0">
              <ScrollArea className="min-h-0 flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((message, index) => (
                    <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-xs rounded-lg p-3 sm:max-w-md ${message.type === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'}`}>
                        <div className="whitespace-pre-wrap text-sm">{renderMessage(message.message)}</div>
                        <p className={`mt-1 text-xs ${message.type === 'user' ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                          {message.time}
                        </p>
                      </div>
                    </div>
                  ))}

                  {loading && (
                    <div className="flex justify-start">
                      <div className="flex items-center gap-2 rounded-lg bg-muted p-3">
                        <Loader className="h-4 w-4 animate-spin" />
                        <span className="text-sm text-muted-foreground">Sedang berpikir...</span>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>

              <div className="shrink-0 space-y-3 border-t p-4">
                <div className="flex gap-2">
                  <Input
                    placeholder={isPetaniView ? 'Tanya soal panen, harga, atau pinjaman...' : 'Tanya AI Assistant...'}
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    onKeyPress={(event) => event.key === 'Enter' && handleSend()}
                    disabled={loading}
                  />
                  <Button onClick={handleSend} disabled={loading} size="icon">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {promptSuggestions.map((question) => (
                    <Button
                      key={question}
                      variant="outline"
                      size="sm"
                      className="text-xs"
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

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Kemampuan AI</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {capabilityBadges.map((badge) => (
                <Badge key={badge} variant="outline" className="w-full justify-start">
                  {badge}
                </Badge>
              ))}
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
