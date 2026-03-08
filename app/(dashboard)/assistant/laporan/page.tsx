'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { FileText, Download, Mail, BarChart3 } from 'lucide-react'

const laporan = [
  {
    nama: 'Daily Market Report',
    deskripsi: 'Ringkasan harga, demand, dan performa penjualan harian',
    frekuensi: 'Setiap hari 06:00',
    template: 'Standard',
    kirimKe: 'admin@kopdes.id',
    status: 'Aktif',
  },
  {
    nama: 'Weekly Forecast Report',
    deskripsi: 'Prediksi permintaan dan rekomendasi stok minggu depan',
    frekuensi: 'Setiap Senin 08:00',
    template: 'Executive',
    kirimKe: 'admin@kopdes.id, manajer@kopdes.id',
    status: 'Aktif',
  },
  {
    nama: 'Monthly Financial Report',
    deskripsi: 'Laporan keuangan, cash flow, dan profitabilitas bulanan',
    frekuensi: 'Akhir bulan',
    template: 'Detailed',
    kirimKe: 'admin@kopdes.id',
    status: 'Aktif',
  },
  {
    nama: 'Competitor Analysis Report',
    deskripsi: 'Analisis posisi kompetitif dan strategi kompetitor',
    frekuensi: 'Setiap 2 minggu',
    template: 'Strategic',
    kirimKe: 'admin@kopdes.id',
    status: 'Pending',
  },
]

const templateLaporan = [
  {
    nama: 'Daily Brief',
    deskripsi: '1 halaman ringkasan harian',
    sections: ['Top metrics', 'Alert & Issues', 'Quick Actions'],
  },
  {
    nama: 'Weekly Executive',
    deskripsi: '3-5 halaman dengan dashboard dan insight',
    sections: ['Performance summary', 'Forecast', 'Recommendations', 'Risk analysis'],
  },
  {
    nama: 'Monthly Deep Dive',
    deskripsi: 'Laporan komprehensif 8-10 halaman',
    sections: ['Financial analysis', 'Market trends', 'Competitor analysis', 'Strategic recommendations', 'Appendix'],
  },
]

const scheduleOptions = [
  'Setiap hari pada jam tertentu',
  'Setiap Senin pukul 08:00',
  'Setiap 1 Mei & 1 Oktober',
  'Custom schedule',
]

export default function LaporanOtomatisPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Laporan Otomatis</h1>
        <p className="text-muted-foreground mt-2">Generate laporan berkala secara otomatis dengan AI insights</p>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Laporan Aktif</h2>
        {laporan.map((l) => (
          <Card key={l.nama}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-blue-600 mt-1" />
                  <div>
                    <CardTitle className="text-lg">{l.nama}</CardTitle>
                    <CardDescription>{l.deskripsi}</CardDescription>
                  </div>
                </div>
                <Badge variant={l.status === 'Aktif' ? 'default' : 'secondary'}>{l.status}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Frekuensi</p>
                  <p className="font-medium">{l.frekuensi}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Template</p>
                  <p className="font-medium">{l.template}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Dikirim ke</p>
                  <p className="font-medium text-xs">{l.kirimKe}</p>
                </div>
              </div>
              <div className="flex gap-2 pt-2 border-t">
                <Button size="sm" variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
                <Button size="sm" variant="outline">
                  <Mail className="mr-2 h-4 w-4" />
                  Kirim Sekarang
                </Button>
                <Button size="sm" variant="outline">Edit</Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Template Laporan Tersedia</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {templateLaporan.map((tmpl) => (
            <Card key={tmpl.nama}>
              <CardHeader>
                <CardTitle className="text-base">{tmpl.nama}</CardTitle>
                <CardDescription>{tmpl.deskripsi}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <p className="text-sm font-medium mb-2">Bagian Laporan:</p>
                  <ul className="space-y-1">
                    {tmpl.sections.map((section) => (
                      <li key={section} className="text-sm text-muted-foreground flex items-center gap-2">
                        <span className="text-primary">✓</span> {section}
                      </li>
                    ))}
                  </ul>
                </div>
                <Button className="w-full" size="sm">Gunakan Template</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Buat Laporan Baru</CardTitle>
          <CardDescription>Schedule laporan otomatis dengan konfigurasi custom</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Nama Laporan</label>
              <input type="text" placeholder="Contoh: Weekly Sales Report" className="w-full border rounded-md px-3 py-2 mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium">Template</label>
              <select className="w-full border rounded-md px-3 py-2 mt-1">
                <option>Daily Brief</option>
                <option>Weekly Executive</option>
                <option>Monthly Deep Dive</option>
              </select>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Jadwal Pengiriman</label>
              <select className="w-full border rounded-md px-3 py-2 mt-1">
                {scheduleOptions.map((opt) => (
                  <option key={opt}>{opt}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Kirim ke Email</label>
              <input type="email" placeholder="admin@kopdes.id" className="w-full border rounded-md px-3 py-2 mt-1" />
            </div>
          </div>
          <Button className="w-full">Buat Laporan Otomatis</Button>
        </CardContent>
      </Card>
    </div>
  )
}
