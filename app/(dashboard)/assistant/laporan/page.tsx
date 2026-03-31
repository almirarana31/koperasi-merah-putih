'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Download, FileText, Mail } from 'lucide-react'
import { useAuth } from '@/lib/auth'

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
]

const templateLaporan = [
  {
    nama: 'Daily Brief',
    deskripsi: '1 halaman ringkasan harian',
    sections: ['Top metrics', 'Alert dan issues', 'Quick actions'],
  },
  {
    nama: 'Weekly Executive',
    deskripsi: '3-5 halaman dengan dashboard dan insight',
    sections: ['Performance summary', 'Forecast', 'Recommendations', 'Risk analysis'],
  },
  {
    nama: 'Monthly Deep Dive',
    deskripsi: 'Laporan komprehensif 8-10 halaman',
    sections: ['Financial analysis', 'Market trends', 'Competitor analysis', 'Strategic recommendations'],
  },
]

const scheduleOptions = [
  'Setiap hari pada jam tertentu',
  'Setiap Senin pukul 08:00',
  'Setiap 1 Mei dan 1 Oktober',
  'Custom schedule',
]

export default function LaporanOtomatisPage() {
  const { user } = useAuth()
  const canManageReports = user?.role !== 'petani'

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Laporan Otomatis</h1>
        <p className="mt-2 text-muted-foreground">
          {canManageReports
            ? 'Generate laporan berkala secara otomatis dengan AI insights'
            : 'Lihat laporan yang paling relevan untuk aktivitas anggota Anda'}
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">{canManageReports ? 'Laporan Aktif' : 'Laporan Tersedia'}</h2>
        {laporan.map((item) => (
          <Card key={item.nama}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <FileText className="mt-1 h-5 w-5 text-primary" />
                  <div>
                    <CardTitle className="text-lg">{item.nama}</CardTitle>
                    <CardDescription>{item.deskripsi}</CardDescription>
                  </div>
                </div>
                <Badge variant={item.status === 'Aktif' ? 'default' : 'secondary'}>{item.status}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid gap-4 text-sm md:grid-cols-3">
                <div>
                  <p className="text-muted-foreground">Frekuensi</p>
                  <p className="font-medium">{item.frekuensi}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Template</p>
                  <p className="font-medium">{item.template}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">{canManageReports ? 'Dikirim ke' : 'Akses'}</p>
                  <p className="text-xs font-medium">{canManageReports ? item.kirimKe : 'Tersedia untuk dibuka sesuai role Anda'}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 border-t pt-2">
                <Button size="sm" variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
                {canManageReports && (
                  <>
                    <Button size="sm" variant="outline">
                      <Mail className="mr-2 h-4 w-4" />
                      Kirim Sekarang
                    </Button>
                    <Button size="sm" variant="outline">Edit</Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {canManageReports && (
        <>
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Template Laporan</h2>
            <div className="grid gap-4 md:grid-cols-3">
              {templateLaporan.map((template) => (
                <Card key={template.nama}>
                  <CardHeader>
                    <CardTitle className="text-base">{template.nama}</CardTitle>
                    <CardDescription>{template.deskripsi}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      {template.sections.map((section) => (
                        <li key={section}>+ {section}</li>
                      ))}
                    </ul>
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
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium">Nama Laporan</label>
                  <input type="text" placeholder="Contoh: Weekly Sales Report" className="mt-1 w-full rounded-md border px-3 py-2" />
                </div>
                <div>
                  <label className="text-sm font-medium">Template</label>
                  <select className="mt-1 w-full rounded-md border px-3 py-2">
                    <option>Daily Brief</option>
                    <option>Weekly Executive</option>
                    <option>Monthly Deep Dive</option>
                  </select>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium">Jadwal Pengiriman</label>
                  <select className="mt-1 w-full rounded-md border px-3 py-2">
                    {scheduleOptions.map((option) => (
                      <option key={option}>{option}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Kirim ke Email</label>
                  <input type="email" placeholder="admin@kopdes.id" className="mt-1 w-full rounded-md border px-3 py-2" />
                </div>
              </div>
              <Button className="w-full">Buat Laporan Otomatis</Button>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}
