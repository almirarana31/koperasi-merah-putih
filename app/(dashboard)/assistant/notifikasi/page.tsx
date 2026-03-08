'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Bell, AlertTriangle, TrendingUp, AlertCircle } from 'lucide-react'

const notifications = [
  {
    judul: 'Opportunity: Demand Beras Naik 176%',
    deskripsi: 'Forecast menunjukkan permintaan Beras Grade A akan naik signifikan bulan depan',
    tipe: 'opportunity',
    prioritas: 'high',
    waktu: '2 jam yang lalu',
    action: 'Lihat Forecast',
  },
  {
    judul: 'Alert: Stok Cabai Menipis',
    deskripsi: 'Inventaris Cabai Merah tinggal 120 kg. Lakukan reorder segera untuk menghindari stockout',
    tipe: 'alert',
    prioritas: 'high',
    waktu: '4 jam yang lalu',
    action: 'Lihat Stok',
  },
  {
    judul: 'Insight: Harga Wortel Optimal',
    deskripsi: 'Harga Wortel sudah mencapai level optimal dengan margin Rp 2.8k per kg',
    tipe: 'insight',
    prioritas: 'medium',
    waktu: '6 jam yang lalu',
    action: 'Lihat Rekomendasi',
  },
  {
    judul: 'Update: Kompetitor A Naikkan Harga',
    deskripsi: 'Kompetitor A baru saja menaikkan harga Beras 8%. Peluang untuk capture market share',
    tipe: 'update',
    prioritas: 'medium',
    waktu: '1 hari yang lalu',
    action: 'Analisis Kompetitor',
  },
  {
    judul: 'Forecast: Musim Panen Beras Dimulai',
    deskripsi: 'Prediksi musim panen optimal untuk Beras akan dimulai 15-20 Mei. Persiapkan gudang',
    tipe: 'forecast',
    prioritas: 'low',
    waktu: '2 hari yang lalu',
    action: 'Lihat Timeline',
  },
]

const notificationRules = [
  {
    nama: 'Price Alert - Beras Grade A',
    kondisi: 'Jika harga naik/turun > 5%',
    aksi: 'Kirim notifikasi + email',
    status: 'Aktif',
  },
  {
    nama: 'Stock Low Alert',
    kondisi: 'Jika stok < 20% dari target',
    aksi: 'Kirim notifikasi urgent',
    status: 'Aktif',
  },
  {
    nama: 'High Demand Alert',
    kondisi: 'Jika demand forecast > 80',
    aksi: 'Kirim notifikasi + suggestion',
    status: 'Aktif',
  },
  {
    nama: 'Delivery Delay Alert',
    kondisi: 'Jika shipment delay > 2 jam',
    aksi: 'Notifikasi + escalate ke manager',
    status: 'Aktif',
  },
]

function getIcon(tipe: string) {
  switch (tipe) {
    case 'opportunity':
      return <TrendingUp className="h-5 w-5 text-green-600" />
    case 'alert':
      return <AlertTriangle className="h-5 w-5 text-red-600" />
    case 'insight':
      return <AlertCircle className="h-5 w-5 text-blue-600" />
    case 'update':
      return <Bell className="h-5 w-5 text-yellow-600" />
    case 'forecast':
      return <TrendingUp className="h-5 w-5 text-purple-600" />
    default:
      return <Bell className="h-5 w-5" />
  }
}

function getColor(tipe: string) {
  switch (tipe) {
    case 'opportunity':
      return 'bg-green-50 border-green-200'
    case 'alert':
      return 'bg-red-50 border-red-200'
    case 'insight':
      return 'bg-blue-50 border-blue-200'
    case 'update':
      return 'bg-yellow-50 border-yellow-200'
    case 'forecast':
      return 'bg-purple-50 border-purple-200'
    default:
      return 'bg-muted'
  }
}

export default function NotifikasiPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Notifikasi Cerdas</h1>
        <p className="text-muted-foreground mt-2">Sistem alert otomatis berdasarkan business rules dan AI triggers</p>
      </div>

      <div className="space-y-3">
        <h2 className="text-xl font-semibold">Notifikasi Terbaru</h2>
        {notifications.map((notif, idx) => (
          <Card key={idx} className={`border-l-4 ${getColor(notif.tipe)}`}>
            <CardContent className="pt-6">
              <div className="flex items-start gap-4">
                {getIcon(notif.tipe)}
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold">{notif.judul}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{notif.deskripsi}</p>
                    </div>
                    <Badge variant={notif.prioritas === 'high' ? 'destructive' : 'secondary'}>
                      {notif.prioritas === 'high' ? 'Urgent' : notif.prioritas === 'medium' ? 'Medium' : 'Low'}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between mt-4 pt-3 border-t">
                    <span className="text-xs text-muted-foreground">{notif.waktu}</span>
                    <Button size="sm" variant="ghost">{notif.action}</Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Notifikasi Rules</h2>
        <div className="grid gap-4">
          {notificationRules.map((rule) => (
            <Card key={rule.nama}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-base">{rule.nama}</CardTitle>
                  <Badge>{rule.status}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground font-medium">Kondisi Trigger</p>
                    <p className="mt-1">{rule.kondisi}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground font-medium">Aksi</p>
                    <p className="mt-1">{rule.aksi}</p>
                  </div>
                </div>
                <div className="flex gap-2 pt-2 border-t">
                  <Button size="sm" variant="outline">Edit</Button>
                  <Button size="sm" variant="outline">Hapus</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Buat Rule Notifikasi Baru</CardTitle>
          <CardDescription>Setup alert otomatis sesuai kebutuhan bisnis</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Nama Rule</label>
              <input type="text" placeholder="Contoh: High Order Alert" className="w-full border rounded-md px-3 py-2 mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium">Trigger Parameter</label>
              <select className="w-full border rounded-md px-3 py-2 mt-1">
                <option>Harga</option>
                <option>Stok</option>
                <option>Order</option>
                <option>Pengiriman</option>
                <option>Demand</option>
              </select>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Kondisi</label>
              <input type="text" placeholder="Contoh: > 80" className="w-full border rounded-md px-3 py-2 mt-1" />
            </div>
            <div>
              <label className="text-sm font-medium">Notifikasi Ke</label>
              <select className="w-full border rounded-md px-3 py-2 mt-1">
                <option>Dashboard + Email</option>
                <option>Dashboard Only</option>
                <option>Email Only</option>
                <option>SMS + Email</option>
              </select>
            </div>
          </div>
          <Button className="w-full">Buat Rule</Button>
        </CardContent>
      </Card>
    </div>
  )
}
