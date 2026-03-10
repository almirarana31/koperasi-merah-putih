"use client"

import { Bell, TrendingUp, TrendingDown, AlertTriangle, CheckCircle, Info, Sparkles } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface SmartNotification {
  id: string
  type: "opportunity" | "warning" | "success" | "info"
  title: string
  message: string
  action?: string
  timestamp: string
  priority: "high" | "medium" | "low"
}

const notifications: SmartNotification[] = [
  {
    id: "1",
    type: "opportunity",
    title: "Peluang Profit Tinggi - Cabai Merah",
    message: "Harga cabai merah diprediksi naik 15% dalam 7 hari. Tahan stok untuk profit maksimal Rp 7,000/kg.",
    action: "Lihat Analisis",
    timestamp: "5 menit lalu",
    priority: "high",
  },
  {
    id: "2",
    type: "warning",
    title: "Stok Menipis - Beras Grade A",
    message: "Stok beras Grade A tersisa 45 ton, cukup untuk 3 hari. Rekomendasi order 50 ton segera.",
    action: "Order Sekarang",
    timestamp: "15 menit lalu",
    priority: "high",
  },
  {
    id: "3",
    type: "success",
    title: "Target Penjualan Tercapai",
    message: "Penjualan bulan ini mencapai Rp 2.8M (112% dari target). Luar biasa!",
    action: "Lihat Detail",
    timestamp: "1 jam lalu",
    priority: "medium",
  },
  {
    id: "4",
    type: "info",
    title: "Tren Permintaan Tomat Menurun",
    message: "Demand tomat turun 12% minggu ini. Pertimbangkan kurangi stok 20% untuk minimalisir waste.",
    action: "Lihat Forecast",
    timestamp: "2 jam lalu",
    priority: "medium",
  },
  {
    id: "5",
    type: "opportunity",
    title: "Anggota Baru Potensial",
    message: "5 petani baru mendaftar dengan lahan total 12 hektar. Potensi supply tambahan 15 ton/bulan.",
    action: "Review Anggota",
    timestamp: "3 jam lalu",
    priority: "low",
  },
]

const typeConfig = {
  opportunity: {
    icon: TrendingUp,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    badge: "bg-emerald-100 text-emerald-700",
  },
  warning: {
    icon: AlertTriangle,
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-200",
    badge: "bg-amber-100 text-amber-700",
  },
  success: {
    icon: CheckCircle,
    color: "text-green-600",
    bg: "bg-green-50",
    border: "border-green-200",
    badge: "bg-green-100 text-green-700",
  },
  info: {
    icon: Info,
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
    badge: "bg-blue-100 text-blue-700",
  },
}

export function AISmartNotifications() {
  const highPriorityCount = notifications.filter((n) => n.priority === "high").length

  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 p-2">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-card-foreground flex items-center gap-2">
                Notifikasi Cerdas AI
                {highPriorityCount > 0 && (
                  <Badge variant="destructive" className="ml-2">
                    {highPriorityCount} Prioritas
                  </Badge>
                )}
              </CardTitle>
              <CardDescription>Insight dan rekomendasi real-time dari AI</CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {notifications.map((notification) => {
            const config = typeConfig[notification.type]
            const Icon = config.icon

            return (
              <div
                key={notification.id}
                className={cn(
                  "rounded-lg border p-4 transition-all hover:shadow-md",
                  config.bg,
                  config.border
                )}
              >
                <div className="flex gap-3">
                  <div className={cn("shrink-0 mt-0.5", config.color)}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h4 className="font-semibold text-sm text-card-foreground">
                        {notification.title}
                      </h4>
                      {notification.priority === "high" && (
                        <Badge variant="destructive" className="shrink-0 text-xs">
                          Urgent
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{notification.message}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">{notification.timestamp}</span>
                      {notification.action && (
                        <button
                          className={cn(
                            "text-xs font-medium hover:underline",
                            config.color
                          )}
                        >
                          {notification.action} →
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-4 pt-4 border-t border-border">
          <button className="text-sm text-emerald-600 hover:text-emerald-700 font-medium w-full text-center">
            Lihat Semua Notifikasi →
          </button>
        </div>
      </CardContent>
    </Card>
  )
}
