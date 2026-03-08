'use client'

import { useState } from 'react'
import {
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  User,
  CreditCard,
  MapPin,
  Eye,
  Check,
  X,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'

const verifikasiData = [
  {
    id: 'V001',
    memberId: 'M009',
    nama: 'Pak Bambang Hartono',
    tipe: 'petani',
    tanggalDaftar: '2024-02-14',
    status: 'pending',
    dokumen: {
      ktp: true,
      foto: true,
      suratTanah: false,
      skck: true,
    },
    alamat: 'Jl. Persawahan No. 8, Subang',
  },
  {
    id: 'V002',
    memberId: 'M010',
    nama: 'Bu Dewi Lestari',
    tipe: 'umkm',
    tanggalDaftar: '2024-02-13',
    status: 'pending',
    dokumen: {
      ktp: true,
      foto: true,
      suratUsaha: true,
      npwp: true,
    },
    alamat: 'Jl. Pasar Baru No. 15, Bandung',
  },
  {
    id: 'V003',
    memberId: 'M011',
    nama: 'Pak Sugeng',
    tipe: 'nelayan',
    tanggalDaftar: '2024-02-12',
    status: 'ditolak',
    alasanTolak: 'Foto KTP tidak jelas',
    dokumen: {
      ktp: false,
      foto: true,
      suratNelayan: true,
    },
    alamat: 'Jl. Pantai No. 3, Pelabuhan Ratu',
  },
]

const riwayatVerifikasi = [
  { id: 'V004', nama: 'Pak Slamet Widodo', tanggal: '2024-02-10', status: 'approved' },
  { id: 'V005', nama: 'Bu Sri Wahyuni', tanggal: '2024-02-08', status: 'approved' },
  { id: 'V006', nama: 'Pak Ahmad Sudirman', tanggal: '2024-02-05', status: 'approved' },
]

export default function VerifikasiPage() {
  const [selectedItem, setSelectedItem] = useState<typeof verifikasiData[0] | null>(null)

  const pendingCount = verifikasiData.filter(v => v.status === 'pending').length
  const rejectedCount = verifikasiData.filter(v => v.status === 'ditolak').length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Verifikasi KYC</h1>
        <p className="text-muted-foreground">Verifikasi dokumen dan data anggota baru</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Menunggu Verifikasi</CardDescription>
            <CardTitle className="text-3xl text-amber-500">{pendingCount}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1 text-xs text-amber-500">
              <Clock className="h-3 w-3" />
              Perlu ditinjau
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Ditolak</CardDescription>
            <CardTitle className="text-3xl text-destructive">{rejectedCount}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1 text-xs text-destructive">
              <XCircle className="h-3 w-3" />
              Perlu perbaikan
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Disetujui Bulan Ini</CardDescription>
            <CardTitle className="text-3xl text-emerald-500">12</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1 text-xs text-emerald-500">
              <CheckCircle className="h-3 w-3" />
              Terverifikasi
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Rata-rata Waktu</CardDescription>
            <CardTitle className="text-3xl">2.5</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Hari proses verifikasi</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pending">
        <TabsList>
          <TabsTrigger value="pending" className="gap-2">
            <Clock className="h-4 w-4" />
            Pending ({pendingCount})
          </TabsTrigger>
          <TabsTrigger value="rejected" className="gap-2">
            <XCircle className="h-4 w-4" />
            Ditolak ({rejectedCount})
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-2">
            <CheckCircle className="h-4 w-4" />
            Riwayat
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4 mt-4">
          {verifikasiData.filter(v => v.status === 'pending').map((item) => (
            <Card key={item.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-amber-500/10 text-amber-500">
                        {item.nama.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{item.nama}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Badge variant="outline" className="text-xs capitalize">{item.tipe}</Badge>
                        <span>Daftar: {item.tanggalDaftar}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-medium">Dokumen</p>
                      <div className="flex items-center gap-1 mt-1">
                        {Object.entries(item.dokumen).map(([key, value]) => (
                          <div
                            key={key}
                            className={`h-2 w-2 rounded-full ${value ? 'bg-emerald-500' : 'bg-destructive'}`}
                            title={`${key}: ${value ? 'Lengkap' : 'Belum'}`}
                          />
                        ))}
                      </div>
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" onClick={() => setSelectedItem(item)}>
                          <Eye className="mr-2 h-4 w-4" />
                          Review
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Review Verifikasi: {item.nama}</DialogTitle>
                          <DialogDescription>
                            Periksa kelengkapan dokumen dan data anggota
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-sm">
                                <User className="h-4 w-4 text-muted-foreground" />
                                <span className="text-muted-foreground">Nama:</span>
                                <span className="font-medium">{item.nama}</span>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <CreditCard className="h-4 w-4 text-muted-foreground" />
                                <span className="text-muted-foreground">Tipe:</span>
                                <Badge variant="outline" className="capitalize">{item.tipe}</Badge>
                              </div>
                              <div className="flex items-center gap-2 text-sm">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                <span className="text-muted-foreground">Alamat:</span>
                                <span>{item.alamat}</span>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <p className="text-sm font-medium mb-2">Status Dokumen:</p>
                              {Object.entries(item.dokumen).map(([key, value]) => (
                                <div key={key} className="flex items-center justify-between text-sm">
                                  <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                                  {value ? (
                                    <Badge className="bg-emerald-500/10 text-emerald-500">
                                      <CheckCircle className="mr-1 h-3 w-3" />
                                      Lengkap
                                    </Badge>
                                  ) : (
                                    <Badge variant="destructive">
                                      <XCircle className="mr-1 h-3 w-3" />
                                      Belum
                                    </Badge>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                        <DialogFooter>
                          <Button variant="outline" className="text-destructive">
                            <X className="mr-2 h-4 w-4" />
                            Tolak
                          </Button>
                          <Button className="bg-emerald-600 hover:bg-emerald-700">
                            <Check className="mr-2 h-4 w-4" />
                            Setujui
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="rejected" className="space-y-4 mt-4">
          {verifikasiData.filter(v => v.status === 'ditolak').map((item) => (
            <Card key={item.id} className="border-destructive/50">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-destructive/10 text-destructive">
                        {item.nama.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{item.nama}</p>
                      <p className="text-sm text-destructive">Alasan: {item.alasanTolak}</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Hubungi</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="history" className="mt-4">
          <Card>
            <CardContent className="p-0">
              <div className="divide-y">
                {riwayatVerifikasi.map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                      <CheckCircle className="h-5 w-5 text-emerald-500" />
                      <div>
                        <p className="font-medium">{item.nama}</p>
                        <p className="text-sm text-muted-foreground">{item.tanggal}</p>
                      </div>
                    </div>
                    <Badge className="bg-emerald-500/10 text-emerald-500">Disetujui</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
