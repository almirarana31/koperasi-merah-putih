'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { CheckCircle, AlertCircle, Lightbulb } from 'lucide-react'
import { useAuth } from '@/lib/auth'

const konsultasiTopics = [
  {
    kategori: 'Teknik Pertanian',
    pertanyaan: [
      'Waktu optimal untuk menanam Beras',
      'Cara meningkatkan hasil panen Cabai',
      'Manajemen kesehatan tanaman Wortel',
      'Irigasi & pengairan efisien',
      'Pengendalian hama organik',
    ],
  },
  {
    kategori: 'Pasar & Penjualan',
    pertanyaan: [
      'Target harga jual Beras Grade A',
      'Strategi penetrasi pasar baru',
      'Negosiasi kontrak dengan buyer',
      'Program loyalitas pembeli',
      'Positioning produk premium',
    ],
  },
  {
    kategori: 'Logistik & Distribusi',
    pertanyaan: [
      'Optimasi rute pengiriman',
      'Manajemen cold chain',
      'Packaging produk aman',
      'Supply chain risk management',
      'Last mile delivery strategy',
    ],
  },
  {
    kategori: 'Keuangan & Bisnis',
    pertanyaan: [
      'Break even analysis produk',
      'Cash flow management',
      'Pembiayaan ekspansi',
      'Margin keuntungan optimal',
      'ROI perhitungan investasi',
    ],
  },
]

const recentConsultations = [
  {
    topik: 'Cara meningkatkan hasil panen Cabai',
    jawaban: 'Untuk meningkatkan hasil panen cabai sebaiknya fokus pada 3 hal:\n1. Pemilihan benih unggul (varietas Keriting/Rawit)\n2. Nutrisi tanaman (pupuk NPK seimbang)\n3. Manajemen air (irigasi drip)\n\nPotensi peningkatan: 25-30% dengan investasi minimal.',
    status: 'Terjawab',
    rating: 5,
  },
  {
    topik: 'Strategi penetrasi pasar Jawa Timur',
    jawaban: 'Rekomendasi 3 fase:\nPhase 1: Partnership dengan distributor lokal\nPhase 2: Direct sales ke buyer institutional\nPhase 3: Brand establishment & premium positioning\n\nTimeline: 6-9 bulan\nEstimasi revenue: Rp 5jt/bulan',
    status: 'Terjawab',
    rating: 4,
  },
]

export default function KonsultasiPage() {
  const { user } = useAuth()
  const isPetaniView = user?.role === 'petani'

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {isPetaniView ? 'Konsultasi Tani AI' : 'Konsultasi AI Pertanian & Bisnis'}
        </h1>
        <p className="text-muted-foreground mt-2">
          {isPetaniView
            ? 'Tanya jawab dengan AI untuk keputusan usaha tani, harga, dan pembiayaan pribadi.'
            : 'Tanya jawab dengan AI expert di berbagai topik pertanian dan bisnis'}
        </p>
      </div>

      <div className="grid gap-4">
        {konsultasiTopics.map((topic) => (
          <Card key={topic.kategori}>
            <CardHeader>
              <CardTitle className="text-lg">{topic.kategori}</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {topic.pertanyaan.map((q) => (
                <Button
                  key={q}
                  variant="outline"
                  className="justify-start h-auto p-3 text-left"
                >
                  <Lightbulb className="mr-2 h-4 w-4 flex-shrink-0 text-yellow-600" />
                  <span className="text-sm">{q}</span>
                </Button>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Konsultasi Terakhir</h2>
        {recentConsultations.map((cons, idx) => (
          <Card key={idx}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{cons.topik}</CardTitle>
                  <Badge className="mt-2">{cons.status}</Badge>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">Rating</p>
                  <p className="text-lg font-bold text-yellow-600">{'★'.repeat(cons.rating)}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-muted rounded-lg p-4">
                <p className="text-sm whitespace-pre-wrap">{cons.jawaban}</p>
              </div>
              <div className="flex gap-2">
                <Button size="sm">Lihat Detail</Button>
                <Button size="sm" variant="outline">Tanya Lanjut</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
