'use client'

import { useState } from 'react'
import Link from 'next/link'
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
  Loader2,
  ShieldCheck,
  AlertTriangle,
  ArrowLeft,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/ui/dialog'
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert'

interface VerifikasiItem {
  id: string
  memberId: string
  nama: string
  tipe: string
  tanggalDaftar: string
  status: 'pending' | 'approved' | 'ditolak'
  dokumen: Record<string, boolean>
  alamat: string
  alasanTolak?: string
  tanggalVerifikasi?: string
}

const initialVerifikasiData: VerifikasiItem[] = [
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

const initialRiwayatVerifikasi = [
  { id: 'V004', nama: 'Pak Slamet Widodo', tanggal: '2024-02-10', status: 'approved' },
  { id: 'V005', nama: 'Bu Sri Wahyuni', tanggal: '2024-02-08', status: 'approved' },
  { id: 'V006', nama: 'Pak Ahmad Sudirman', tanggal: '2024-02-05', status: 'approved' },
]

export default function VerifikasiPage() {
  const [verifikasiData, setVerifikasiData] = useState<VerifikasiItem[]>(initialVerifikasiData)
  const [riwayatVerifikasi, setRiwayatVerifikasi] = useState(initialRiwayatVerifikasi)
  const [selectedItem, setSelectedItem] = useState<VerifikasiItem | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [rejectReason, setRejectReason] = useState('')
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [openDialogId, setOpenDialogId] = useState<string | null>(null)

  const pendingCount = verifikasiData.filter(v => v.status === 'pending').length
  const rejectedCount = verifikasiData.filter(v => v.status === 'ditolak').length
  const approvedThisMonth = riwayatVerifikasi.length + verifikasiData.filter(v => v.status === 'approved').length

  // Handle approval
  const handleApprove = async (item: VerifikasiItem) => {
    setIsProcessing(true)
    
    // Simulate Dukcapil verification API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Update the item status
    setVerifikasiData(prev => 
      prev.map(v => 
        v.id === item.id 
          ? { ...v, status: 'approved' as const, tanggalVerifikasi: new Date().toISOString().split('T')[0] }
          : v
      )
    )
    
    // Add to history
    setRiwayatVerifikasi(prev => [
      { id: item.id, nama: item.nama, tanggal: new Date().toISOString().split('T')[0], status: 'approved' },
      ...prev
    ])
    
    setIsProcessing(false)
    setOpenDialogId(null)
    setSuccessMessage(`${item.nama} berhasil diverifikasi dan disetujui sebagai anggota koperasi.`)
    
    // Clear success message after 5 seconds
    setTimeout(() => setSuccessMessage(null), 5000)
  }

  // Handle rejection
  const handleReject = async (item: VerifikasiItem) => {
    if (!rejectReason.trim()) return
    
    setIsProcessing(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500))
    
    // Update the item status
    setVerifikasiData(prev => 
      prev.map(v => 
        v.id === item.id 
          ? { ...v, status: 'ditolak' as const, alasanTolak: rejectReason }
          : v
      )
    )
    
    setIsProcessing(false)
    setShowRejectDialog(false)
    setRejectReason('')
    setOpenDialogId(null)
    setSuccessMessage(`Pengajuan ${item.nama} telah ditolak. Notifikasi telah dikirim.`)
    
    // Clear success message after 5 seconds
    setTimeout(() => setSuccessMessage(null), 5000)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/anggota">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Verifikasi KYC</h1>
          <p className="text-sm text-muted-foreground">Verifikasi dokumen dan data anggota baru</p>
        </div>
      </div>

      {/* Success Alert */}
      {successMessage && (
        <Alert className="border-emerald-500 bg-emerald-500/10">
          <CheckCircle className="h-4 w-4 text-emerald-500" />
          <AlertTitle className="text-emerald-600">Berhasil</AlertTitle>
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Menunggu Verifikasi</CardDescription>
            <CardTitle className="text-2xl sm:text-3xl text-amber-500">{pendingCount}</CardTitle>
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
            <CardTitle className="text-2xl sm:text-3xl text-destructive">{rejectedCount}</CardTitle>
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
            <CardTitle className="text-2xl sm:text-3xl text-emerald-500">{approvedThisMonth}</CardTitle>
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
            <CardTitle className="text-2xl sm:text-3xl">2.5</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Hari proses verifikasi</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="pending">
        <TabsList className="grid w-full grid-cols-3 sm:w-auto sm:inline-flex">
          <TabsTrigger value="pending" className="gap-1 sm:gap-2 text-xs sm:text-sm">
            <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Pending</span> ({pendingCount})
          </TabsTrigger>
          <TabsTrigger value="rejected" className="gap-1 sm:gap-2 text-xs sm:text-sm">
            <XCircle className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Ditolak</span> ({rejectedCount})
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-1 sm:gap-2 text-xs sm:text-sm">
            <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Riwayat</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="space-y-4 mt-4">
          {verifikasiData.filter(v => v.status === 'pending').length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <CheckCircle className="mx-auto h-12 w-12 text-emerald-500 mb-3" />
                <p className="text-muted-foreground">Semua pengajuan sudah diverifikasi</p>
              </CardContent>
            </Card>
          ) : (
            verifikasiData.filter(v => v.status === 'pending').map((item) => (
              <Card key={item.id}>
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-10 w-10 sm:h-12 sm:w-12">
                        <AvatarFallback className="bg-amber-500/10 text-amber-500 text-sm">
                          {item.nama.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{item.nama}</p>
                        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                          <Badge variant="outline" className="text-xs capitalize">{item.tipe}</Badge>
                          <span className="text-xs">Daftar: {item.tanggalDaftar}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 justify-between sm:justify-end">
                      <div className="text-left sm:text-right">
                        <p className="text-xs sm:text-sm font-medium">Dokumen</p>
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
                      <Dialog open={openDialogId === item.id} onOpenChange={(open) => setOpenDialogId(open ? item.id : null)}>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="sm" onClick={() => setSelectedItem(item)}>
                            <Eye className="mr-1 sm:mr-2 h-4 w-4" />
                            <span className="hidden sm:inline">Review</span>
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                              <ShieldCheck className="h-5 w-5 text-primary" />
                              Review Verifikasi: {item.nama}
                            </DialogTitle>
                            <DialogDescription>
                              Periksa kelengkapan dokumen dan data anggota sebelum menyetujui
                            </DialogDescription>
                          </DialogHeader>
                          <div className="space-y-4 py-4">
                            <div className="grid gap-4 sm:grid-cols-2">
                              <div className="space-y-3">
                                <h4 className="font-semibold text-sm">Data Anggota</h4>
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
                                  <div className="flex items-start gap-2 text-sm">
                                    <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                                    <span className="text-muted-foreground">Alamat:</span>
                                    <span className="flex-1">{item.alamat}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="space-y-3">
                                <h4 className="font-semibold text-sm">Status Dokumen</h4>
                                <div className="space-y-2">
                                  {Object.entries(item.dokumen).map(([key, value]) => (
                                    <div key={key} className="flex items-center justify-between text-sm">
                                      <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                                      {value ? (
                                        <Badge className="bg-emerald-500/10 text-emerald-500 text-xs">
                                          <CheckCircle className="mr-1 h-3 w-3" />
                                          Lengkap
                                        </Badge>
                                      ) : (
                                        <Badge variant="destructive" className="text-xs">
                                          <XCircle className="mr-1 h-3 w-3" />
                                          Belum
                                        </Badge>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>

                            {/* Dukcapil Verification Note */}
                            <Alert>
                              <AlertTriangle className="h-4 w-4" />
                              <AlertTitle>Verifikasi Dukcapil</AlertTitle>
                              <AlertDescription>
                                Dengan menyetujui, data akan diverifikasi ke Dukcapil untuk memastikan kevalidan identitas.
                              </AlertDescription>
                            </Alert>
                          </div>
                          
                          {/* Reject Dialog */}
                          {showRejectDialog ? (
                            <div className="space-y-4 border-t pt-4">
                              <h4 className="font-semibold">Alasan Penolakan</h4>
                              <Textarea
                                placeholder="Masukkan alasan penolakan..."
                                value={rejectReason}
                                onChange={(e) => setRejectReason(e.target.value)}
                                rows={3}
                              />
                              <div className="flex gap-2">
                                <Button variant="outline" onClick={() => setShowRejectDialog(false)} className="flex-1">
                                  Batal
                                </Button>
                                <Button 
                                  variant="destructive" 
                                  onClick={() => handleReject(item)}
                                  disabled={!rejectReason.trim() || isProcessing}
                                  className="flex-1"
                                >
                                  {isProcessing ? (
                                    <>
                                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                      Memproses...
                                    </>
                                  ) : (
                                    <>
                                      <X className="mr-2 h-4 w-4" />
                                      Konfirmasi Tolak
                                    </>
                                  )}
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <DialogFooter className="flex-col sm:flex-row gap-2">
                              <Button 
                                variant="outline" 
                                className="text-destructive border-destructive/50 hover:bg-destructive/10 w-full sm:w-auto"
                                onClick={() => setShowRejectDialog(true)}
                              >
                                <X className="mr-2 h-4 w-4" />
                                Tolak
                              </Button>
                              <Button 
                                className="bg-emerald-600 hover:bg-emerald-700 w-full sm:w-auto"
                                onClick={() => handleApprove(item)}
                                disabled={isProcessing}
                              >
                                {isProcessing ? (
                                  <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Memverifikasi...
                                  </>
                                ) : (
                                  <>
                                    <Check className="mr-2 h-4 w-4" />
                                    Setujui
                                  </>
                                )}
                              </Button>
                            </DialogFooter>
                          )}
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="rejected" className="space-y-4 mt-4">
          {verifikasiData.filter(v => v.status === 'ditolak').length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <CheckCircle className="mx-auto h-12 w-12 text-emerald-500 mb-3" />
                <p className="text-muted-foreground">Tidak ada pengajuan yang ditolak</p>
              </CardContent>
            </Card>
          ) : (
            verifikasiData.filter(v => v.status === 'ditolak').map((item) => (
              <Card key={item.id} className="border-destructive/50">
                <CardContent className="p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-10 w-10 sm:h-12 sm:w-12">
                        <AvatarFallback className="bg-destructive/10 text-destructive text-sm">
                          {item.nama.split(' ').map(n => n[0]).join('').slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{item.nama}</p>
                        <p className="text-sm text-destructive">Alasan: {item.alasanTolak}</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" className="w-full sm:w-auto">Hubungi</Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="history" className="mt-4">
          <Card>
            <CardContent className="p-0">
              {riwayatVerifikasi.length === 0 ? (
                <div className="py-8 text-center">
                  <Clock className="mx-auto h-12 w-12 text-muted-foreground/50 mb-3" />
                  <p className="text-muted-foreground">Belum ada riwayat verifikasi</p>
                </div>
              ) : (
                <div className="divide-y">
                  {riwayatVerifikasi.map((item) => (
                    <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 p-4">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0" />
                        <div>
                          <p className="font-medium">{item.nama}</p>
                          <p className="text-xs sm:text-sm text-muted-foreground">{item.tanggal}</p>
                        </div>
                      </div>
                      <Badge className="bg-emerald-500/10 text-emerald-500 w-fit">Disetujui</Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
