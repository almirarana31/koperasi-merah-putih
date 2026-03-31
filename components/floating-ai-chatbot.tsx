"use client"

import { useState, useRef, useEffect } from "react"
import { MessageCircle, X, Send, Minimize2, Maximize2, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

const quickActions = [
  "Berapa stok beras hari ini?",
  "Prediksi harga cabai minggu depan?",
  "Anggota dengan transaksi tertinggi?",
  "Rekomendasi komoditas untuk dijual?",
]

export function FloatingAIChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "Halo! Saya Asisten AI Koperasi Merah Putih. Ada yang bisa saya bantu hari ini?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  useEffect(() => {
    if (isOpen && !isMinimized && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen, isMinimized])

  const handleSend = async () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: getAIResponse(input),
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, aiResponse])
      setIsTyping(false)
    }, 1500)
  }

  const getAIResponse = (query: string): string => {
    const lowerQuery = query.toLowerCase()

    if (lowerQuery.includes("stok") || lowerQuery.includes("inventory")) {
      return `📦 **Status Stok Hari Ini:**

• Beras Grade A: 120 ton (Stok Aman ✓)
• Cabai Merah: 2.5 ton (Stok Menipis ⚠️)
• Tomat: 1.8 ton (Stok Aman ✓)
• Wortel: 3.2 ton (Stok Aman ✓)

**Rekomendasi:**
✓ Order cabai merah 1 ton dalam 2 hari
✓ Stok lainnya mencukupi untuk 5-7 hari`
    }

    if (lowerQuery.includes("harga") || lowerQuery.includes("prediksi")) {
      return `📈 **Prediksi Harga Cabai Merah (7 Hari):**

Harga Saat Ini: Rp 45,000/kg
Trend: ↗️ Naik 15%

**Prediksi:**
• 3 hari: Rp 48,000/kg (+7%)
• 7 hari: Rp 52,000/kg (+15%)

**Rekomendasi:**
✓ TAHAN stok 5-7 hari
✓ Potensi profit tambahan: Rp 7,000/kg
✓ Confidence: 87%`
    }

    if (lowerQuery.includes("anggota") || lowerQuery.includes("member")) {
      return `👥 **Top 5 Anggota (Bulan Ini):**

1. **Pak Budi Santoso**
   - Transaksi: Rp 45.5 juta
   - Volume: 2.5 ton
   - Komoditas: Beras, Cabai

2. **Ibu Siti Aminah**
   - Transaksi: Rp 38.2 juta
   - Volume: 1.8 ton
   - Komoditas: Sayuran

3. **Pak Ahmad Dahlan**
   - Transaksi: Rp 32.7 juta
   - Volume: 1.5 ton
   - Komoditas: Buah-buahan`
    }

    if (lowerQuery.includes("rekomendasi") || lowerQuery.includes("jual")) {
      return `💡 **Rekomendasi Komoditas Minggu Ini:**

🥇 **Cabai Merah** (Prioritas Tinggi)
- Demand: Tinggi (↗️ +25%)
- Margin: 42%
- Potensi profit: Rp 52.5 juta

🥈 **Beras Grade A** (Stabil)
- Demand: Sedang (→ Stabil)
- Margin: 18%
- Potensi profit: Rp 40.5 juta

🥉 **Tomat** (Perhatian)
- Demand: Menurun (↘️ -12%)
- Margin: 35%
- Rekomendasi: Kurangi stok 20%`
    }

    return `Terima kasih atas pertanyaan Anda. Saya sedang menganalisis data untuk memberikan jawaban terbaik. 

Beberapa hal yang bisa saya bantu:
• Cek stok dan inventory
• Prediksi harga komoditas
• Analisis performa anggota
• Rekomendasi penjualan
• Forecast demand & supply

Silakan tanyakan lebih spesifik! 😊`
  }

  const handleQuickAction = (action: string) => {
    setInput(action)
    setTimeout(() => handleSend(), 100)
  }

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-24 right-4 z-50 h-14 w-14 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 shadow-lg transition-all duration-200 hover:scale-110 hover:shadow-xl md:bottom-6 md:right-6"
        size="icon"
      >
        <MessageCircle className="h-6 w-6 text-white" />
        <span className="absolute -top-1 -right-1 flex h-5 w-5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-5 w-5 bg-emerald-500 items-center justify-center">
            <Sparkles className="h-3 w-3 text-white" />
          </span>
        </span>
      </Button>
    )
  }

  return (
    <div
      className={cn(
        "fixed bottom-24 right-4 z-50 flex flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-2xl transition-all duration-300 md:bottom-6 md:right-6",
        isMinimized ? "w-80 h-16" : "w-[90vw] sm:w-96 h-[80vh] sm:h-[600px] max-w-[400px]"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-t-2xl">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Avatar className="h-10 w-10 border-2 border-white">
              <AvatarFallback className="bg-white text-emerald-600 font-bold">
                AI
              </AvatarFallback>
            </Avatar>
            <span className="absolute bottom-0 right-0 h-3 w-3 bg-green-400 border-2 border-white rounded-full"></span>
          </div>
          <div>
            <h3 className="font-semibold text-white text-sm">Asisten AI Koperasi</h3>
            <p className="text-xs text-emerald-100">Online • Siap membantu</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMinimized(!isMinimized)}
            className="h-8 w-8 text-white hover:bg-emerald-600"
          >
            {isMinimized ? (
              <Maximize2 className="h-4 w-4" />
            ) : (
              <Minimize2 className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsOpen(false)}
            className="h-8 w-8 text-white hover:bg-emerald-600"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages */}
          <ScrollArea className="flex-1 p-4 overflow-x-hidden" ref={scrollRef}>
            <div className="space-y-4 w-full">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    "flex gap-3 w-full",
                    message.role === "user" ? "justify-end" : "justify-start"
                  )}
                >
                  {message.role === "assistant" && (
                    <Avatar className="h-8 w-8 shrink-0">
                      <AvatarFallback className="bg-emerald-100 text-emerald-600 text-xs font-bold">
                        AI
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div
                    className={cn(
                      "rounded-2xl px-4 py-2 max-w-[80%] break-words overflow-hidden",
                      message.role === "user"
                        ? "bg-emerald-500 text-white"
                        : "bg-secondary text-foreground"
                    )}
                  >
                    <div className="text-sm whitespace-pre-wrap break-words" style={{ wordBreak: "break-word", overflowWrap: "anywhere" }}>{message.content}</div>
                    <div
                      className={cn(
                        "text-xs mt-1",
                        message.role === "user" ? "text-emerald-100" : "text-muted-foreground"
                      )}
                    >
                      {message.timestamp.toLocaleTimeString("id-ID", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </div>
                  </div>
                  {message.role === "user" && (
                    <Avatar className="h-8 w-8 shrink-0">
                      <AvatarFallback className="bg-blue-100 text-blue-600 text-xs font-bold">
                        U
                      </AvatarFallback>
                    </Avatar>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-3 justify-start">
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarFallback className="bg-emerald-100 text-emerald-600 text-xs font-bold">
                      AI
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-secondary rounded-2xl px-4 py-3">
                    <div className="flex gap-1">
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                      <div className="w-2 h-2 bg-emerald-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          {/* Quick Actions */}
          {messages.length <= 1 && (
            <div className="px-4 pb-2">
              <p className="text-xs text-muted-foreground mb-2">Pertanyaan cepat:</p>
              <div className="flex flex-wrap gap-2">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickAction(action)}
                    className="text-xs px-3 py-1.5 bg-secondary hover:bg-secondary/80 rounded-full transition-colors"
                  >
                    {action}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-border">
            <div className="flex gap-2">
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ketik pertanyaan Anda..."
                className="flex-1"
              />
              <Button
                onClick={handleSend}
                disabled={!input.trim() || isTyping}
                className="bg-emerald-500 hover:bg-emerald-600"
                size="icon"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Powered by AI • Tekan Enter untuk kirim
            </p>
          </div>
        </>
      )}
    </div>
  )
}
