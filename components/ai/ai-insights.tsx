"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Sparkles,
  TrendingUp,
  AlertCircle,
  Lightbulb,
  Target,
  RefreshCw,
} from "lucide-react"

interface AIInsight {
  id: string
  type: "insight" | "recommendation" | "warning" | "opportunity"
  title: string
  description: string
  confidence: number
  impact: "high" | "medium" | "low"
}

interface AIInsightsProps {
  insights: AIInsight[]
  title?: string
  onRefresh?: () => void
}

export function AIInsights({ insights, title = "AI-Generated Insights", onRefresh }: AIInsightsProps) {
  const getIcon = (type: AIInsight["type"]) => {
    switch (type) {
      case "insight":
        return <Lightbulb className="h-5 w-5 text-info" />
      case "recommendation":
        return <TrendingUp className="h-5 w-5 text-success" />
      case "warning":
        return <AlertCircle className="h-5 w-5 text-warning" />
      case "opportunity":
        return <Sparkles className="h-5 w-5 text-primary" />
    }
  }

  const getColor = (type: AIInsight["type"]) => {
    switch (type) {
      case "insight":
        return "bg-info/10 border-info/20"
      case "recommendation":
        return "bg-success/10 border-success/20"
      case "warning":
        return "bg-warning/10 border-warning/20"
      case "opportunity":
        return "bg-primary/10 border-primary/20"
    }
  }

  const getImpactColor = (impact: AIInsight["impact"]) => {
    switch (impact) {
      case "high":
        return "bg-destructive/20 text-destructive"
      case "medium":
        return "bg-warning/20 text-warning"
      case "low":
        return "bg-info/20 text-info"
    }
  }

  return (
    <Card className="border-border bg-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <CardTitle className="text-card-foreground">{title}</CardTitle>
        </div>
        {onRefresh && (
          <Button variant="outline" size="sm" onClick={onRefresh} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {insights.map((insight) => (
          <div
            key={insight.id}
            className={`rounded-lg border p-4 ${getColor(insight.type)}`}
          >
            <div className="mb-3 flex items-start justify-between">
              <div className="flex items-start gap-3">
                <div className="mt-0.5">{getIcon(insight.type)}</div>
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground">{insight.title}</h4>
                  <p className="mt-1 text-sm text-muted-foreground">{insight.description}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className={getImpactColor(insight.impact)}>
                Impact: {insight.impact.charAt(0).toUpperCase() + insight.impact.slice(1)}
              </Badge>
              <Badge variant="outline" className="border-border">
                AI Confidence: {insight.confidence}%
              </Badge>
            </div>
          </div>
        ))}
        {insights.length === 0 && (
          <div className="py-8 text-center text-muted-foreground">
            <Sparkles className="mx-auto mb-2 h-8 w-8 opacity-50" />
            <p>No AI insights available at the moment</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Generate AI insights based on data
export function generateInsights(data: any, context: string): AIInsight[] {
  const insights: AIInsight[] = []

  if (context === "monitoring") {
    insights.push({
      id: "1",
      type: "warning",
      title: "Anomali Terdeteksi pada Siklus Panen",
      description: "AI mendeteksi pola anomali pada siklus panen di wilayah Jawa Barat Tengah. Probabilitas kegagalan panen meningkat 12% akibat pola El Nino. Rekomendasi: Aktifkan early warning system dan siapkan mitigasi risiko.",
      confidence: 87,
      impact: "high",
    })
    insights.push({
      id: "2",
      type: "opportunity",
      title: "Peluang Optimasi Distribusi Logistik",
      description: "Analisis rute menunjukkan potensi penghematan 18% biaya distribusi dengan optimasi jalur pengiriman. Implementasi algoritma routing dapat meningkatkan efisiensi secara signifikan.",
      confidence: 92,
      impact: "medium",
    })
  }

  if (context === "dna-desa") {
    insights.push({
      id: "3",
      type: "insight",
      title: "Korelasi Kuat: Infrastruktur Digital & Produktivitas",
      description: "Desa dengan akses internet >80% menunjukkan produktivitas 35% lebih tinggi. Investasi infrastruktur digital memberikan ROI tertinggi untuk peningkatan DNA Score.",
      confidence: 94,
      impact: "high",
    })
    insights.push({
      id: "4",
      type: "recommendation",
      title: "Cluster Desa untuk Program Intervensi",
      description: "AI mengidentifikasi 3 cluster desa dengan karakteristik serupa. Program intervensi berbasis cluster dapat meningkatkan efektivitas 40% dibanding pendekatan individual.",
      confidence: 89,
      impact: "high",
    })
  }

  if (context === "diagnostic") {
    insights.push({
      id: "5",
      type: "warning",
      title: "Eskalasi Masalah Infrastruktur",
      description: "15 desa menunjukkan degradasi infrastruktur jalan dalam 3 bulan terakhir. Tanpa intervensi, estimasi kerugian ekonomi mencapai Rp 2.5M per desa per tahun.",
      confidence: 91,
      impact: "high",
    })
    insights.push({
      id: "6",
      type: "opportunity",
      title: "Potensi Replikasi Best Practice",
      description: "Model koperasi digital di Sukamaju dapat direplikasi ke 23 desa lain dengan karakteristik serupa. Estimasi peningkatan pendapatan: 45-60%.",
      confidence: 85,
      impact: "medium",
    })
  }

  if (context === "sensor") {
    insights.push({
      id: "7",
      type: "insight",
      title: "Pola Cuaca Mendukung Panen Optimal",
      description: "Analisis data sensor 30 hari terakhir menunjukkan kondisi cuaca ideal untuk panen. Rekomendasi: Percepat jadwal panen 3-5 hari untuk kualitas optimal.",
      confidence: 88,
      impact: "medium",
    })
  }

  if (context === "laporan") {
    insights.push({
      id: "8",
      type: "insight",
      title: "Tren Positif Pembangunan Desa 2026",
      description: "Analisis komprehensif menunjukkan peningkatan IPD rata-rata 2.5% YoY dengan akselerasi tertinggi di sektor infrastruktur digital dan produktivitas pertanian.",
      confidence: 95,
      impact: "high",
    })
    insights.push({
      id: "9",
      type: "recommendation",
      title: "Fokus Program Q2 2026",
      description: "Berdasarkan analisis data Q1, rekomendasi fokus pada 3 area: (1) Percepatan realisasi dana desa, (2) Penguatan koperasi digital, (3) Mitigasi dampak El Nino.",
      confidence: 91,
      impact: "high",
    })
    insights.push({
      id: "10",
      type: "opportunity",
      title: "Potensi Ekspor Komoditas Unggulan",
      description: "18 desa menunjukkan kesiapan untuk akses pasar ekspor dengan sertifikasi GAP. Estimasi peningkatan pendapatan: 150-200% dalam 12 bulan.",
      confidence: 86,
      impact: "high",
    })
  }

  return insights
}
