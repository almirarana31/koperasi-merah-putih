"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import {
  Bot,
  Send,
  Sparkles,
  TrendingUp,
  AlertCircle,
  Lightbulb,
  X,
  Minimize2,
  Maximize2,
} from "lucide-react"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

interface AISuggestion {
  id: string
  type: "insight" | "recommendation" | "warning" | "opportunity"
  title: string
  description: string
  action?: string
}

interface AIAssistantProps {
  context?: string
  suggestions?: AISuggestion[]
  onClose?: () => void
}

export function AIAssistant({ context = "general", suggestions = [], onClose }: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: `Halo! Saya AI Assistant untuk DNA DESA. Saya dapat membantu Anda menganalisis data, memberikan rekomendasi, dan menjawab pertanyaan tentang ${context}. Ada yang bisa saya bantu?`,
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isMinimized, setIsMinimized] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSend = () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: generateAIResponse(input, context),
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiResponse])
      setIsLoading(false)
    }, 1500)
  }

  const handleSuggestionClick = (suggestion: AISuggestion) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: `Jelaskan lebih lanjut tentang: ${suggestion.title}`,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `${suggestion.description}\n\n${suggestion.action ? `Rekomendasi tindakan: ${suggestion.action}` : ""}`,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiResponse])
      setIsLoading(false)
    }, 1500)
  }

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsMinimized(false)}
          className="h-14 w-14 rounded-full bg-primary shadow-lg hover:bg-primary/90"
        >
          <Bot className="h-6 w-6" />
        </Button>
      </div>
    )
  }

  return (
    <Card className="fixed bottom-4 right-4 z-50 w-96 border-border bg-card shadow-2xl">
      <CardHeader className="flex flex-row items-center justify-between border-b border-border bg-primary/10 pb-4">
        <div className="flex items-center gap-2">
          <div className="rounded-full bg-primary p-2">
            <Bot className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="text-base text-card-foreground">AI Assistant</CardTitle>
            <p className="text-xs text-muted-foreground">Powered by GenAI</p>
          </div>
        </div>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMinimized(true)}
            className="h-8 w-8 p-0"
          >
            <Minimize2 className="h-4 w-4" />
          </Button>
          {onClose && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-0">
        {/* AI Suggestions */}
        {suggestions.length > 0 && (
          <div className="border-b border-border bg-secondary/30 p-4">
            <div className="mb-2 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-semibold text-foreground">AI Insights</span>
            </div>
            <div className="space-y-2">
              {suggestions.slice(0, 3).map((suggestion) => (
                <button
                  key={suggestion.id}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full rounded-lg border border-border bg-card p-3 text-left transition-colors hover:bg-secondary"
                >
                  <div className="flex items-start gap-2">
                    {suggestion.type === "insight" && (
                      <Lightbulb className="h-4 w-4 shrink-0 text-info" />
                    )}
                    {suggestion.type === "recommendation" && (
                      <TrendingUp className="h-4 w-4 shrink-0 text-success" />
                    )}
                    {suggestion.type === "warning" && (
                      <AlertCircle className="h-4 w-4 shrink-0 text-warning" />
                    )}
                    {suggestion.type === "opportunity" && (
                      <Sparkles className="h-4 w-4 shrink-0 text-primary" />
                    )}
                    <div className="flex-1">
                      <p className="text-sm font-medium text-foreground">{suggestion.title}</p>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {suggestion.description}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Messages */}
        <div className="h-96 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                <p className="mt-1 text-xs opacity-70">
                  {message.timestamp.toLocaleTimeString("id-ID", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-lg bg-secondary p-3">
                <div className="flex gap-1">
                  <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground" />
                  <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground delay-100" />
                  <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground delay-200" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="border-t border-border p-4">
          <div className="flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault()
                  handleSend()
                }
              }}
              placeholder="Tanyakan sesuatu..."
              className="min-h-[60px] resize-none"
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isLoading}
              className="shrink-0"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            Tekan Enter untuk kirim, Shift+Enter untuk baris baru
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

function generateAIResponse(input: string, context: string): string {
  const lowerInput = input.toLowerCase()

  // Context-specific responses
  if (context.includes("monitoring")) {
    if (lowerInput.includes("alert") || lowerInput.includes("warning")) {
      return "Berdasarkan analisis real-time, saya mendeteksi 4 alert aktif:\n\n1. pH Tanah Ekstrim di Sukamaju - Perlu tindakan segera dengan pemupukan kapur\n2. Penurunan Harga Cabai 25% - Rekomendasi aktifkan skema resi gudang\n3. Gangguan Irigasi di Pantai Indah - Jadwalkan pembersihan sedimen\n4. Keterlambatan Panen Padi - Update jadwal logistik\n\nApakah Anda ingin detail lebih lanjut untuk salah satu alert?"
    }
    if (lowerInput.includes("kpi") || lowerInput.includes("target")) {
      return "Analisis KPI menunjukkan:\n\n✅ 4 KPI On Track (IPD, Produktivitas, Internet, BUMDes)\n⚠️ 1 KPI Warning (Realisasi Dana Desa 87%)\n❌ 1 KPI Delayed (Angka Kemiskinan 9.2%)\n\nRekomendasi: Fokus pada percepatan realisasi dana desa dan program pengentasan kemiskinan."
    }
  }

  if (context.includes("desa") || context.includes("village")) {
    if (lowerInput.includes("terbaik") || lowerInput.includes("top")) {
      return "Desa dengan DNA Score tertinggi:\n\n1. Wisata Hijau (Bali) - Score 95\n2. Sukamaju (Jawa Barat) - Score 92\n3. Pantai Indah (Sulawesi Selatan) - Score 88\n\nFaktor kunci keberhasilan: Infrastruktur baik, SDM terlatih, ekonomi kuat, dan akses pasar optimal."
    }
    if (lowerInput.includes("prioritas") || lowerInput.includes("priority")) {
      return "Desa prioritas tinggi yang memerlukan perhatian khusus:\n\nTotal: 28 desa dengan score < 75\n\nMasalah utama:\n- Infrastruktur terbatas\n- Akses modal kurang\n- SDM perlu pelatihan\n\nRekomendasi: Program intervensi terpadu dengan fokus pada 3 pilar (infrastruktur, ekonomi, SDM)."
    }
  }

  if (context.includes("sensor") || context.includes("iot")) {
    if (lowerInput.includes("sensor") || lowerInput.includes("monitoring")) {
      return "Status Sensor Network:\n\n✅ Online: 47 sensor (94%)\n⚠️ Warning: 2 sensor (4%)\n❌ Offline: 1 sensor (2%)\n\nData real-time:\n- Suhu rata-rata: 28.5°C\n- Kelembaban: 72%\n- Curah hujan 24j: 15mm\n\nSemua sensor berfungsi normal kecuali SNS-004 (offline 2 jam) - perlu pengecekan baterai."
    }
  }

  // Generic helpful responses
  if (lowerInput.includes("rekomendasi") || lowerInput.includes("saran")) {
    return "Berdasarkan analisis AI, berikut rekomendasi prioritas:\n\n1. Tingkatkan produktivitas dengan teknologi pertanian presisi\n2. Perkuat infrastruktur cold storage untuk mengurangi waste\n3. Digitalisasi koperasi untuk akses pasar lebih luas\n4. Program pelatihan SDM untuk adopsi teknologi\n5. Diversifikasi komoditas untuk mitigasi risiko\n\nApakah Anda ingin detail implementasi untuk salah satu rekomendasi?"
  }

  if (lowerInput.includes("data") || lowerInput.includes("statistik")) {
    return "Ringkasan Data Terkini:\n\n📊 100 desa terdaftar\n👥 Total populasi: 350K+\n🌾 8 komoditas utama\n📡 50 sensor IoT aktif\n📈 DNA Score rata-rata: 79\n\nKualitas data: 98.5% lengkap, 95.2% fresh, 92.8% akurat\n\nSemua data terintegrasi dari 6 sumber (Kemendagri, BPS, Kemendes, Kementan, BMKG, IoT)."
  }

  // Default response
  return `Terima kasih atas pertanyaan Anda tentang "${input}".\n\nSebagai AI Assistant untuk ${context}, saya dapat membantu dengan:\n\n• Analisis data dan tren\n• Rekomendasi berbasis AI\n• Insight dan prediksi\n• Identifikasi masalah dan peluang\n\nSilakan tanyakan hal spesifik yang ingin Anda ketahui!`
}
