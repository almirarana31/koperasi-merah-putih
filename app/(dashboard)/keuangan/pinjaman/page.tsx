'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Calculator,
  CheckCircle,
  AlertTriangle,
  CreditCard,
  FileText,
  User,
  Clock,
  Wallet,
  Send,
  ChevronRight,
  Loader2,
  ShieldCheck,
  XCircle,
  Info,
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Slider } from '@/components/ui/slider'
import { Textarea } from '@/components/ui/textarea'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

// Tujuan pinjaman options
const tujuanPinjaman = [
  { value: 'modal-usaha', label: 'Modal Usaha/Pertanian' },
  { value: 'pembelian-alat', label: 'Pembelian Alat/Mesin' },
  { value: 'bibit-pupuk', label: 'Bibit & Pupuk' },
  { value: 'renovasi', label: 'Renovasi Tempat Usaha' },
  { value: 'darurat', label: 'Kebutuhan Darurat' },
  { value: 'pendidikan', label: 'Pendidikan' },
  { value: 'kesehatan', label: 'Kesehatan' },
  { value: 'lainnya', label: 'Lainnya' },
]

// Tenor options (months)
const tenorOptions = [3, 6, 12, 18, 24, 36]

// Mock member data (would come from auth/session)
const currentMember = {
  id: 'M001',
  nama: 'Pak Slamet Widodo',
  nik: '3201012345678901',
  tipe: 'petani',
  creditScore: 785,
  kycVerified: true,
  dukcapilVerified: true,
  simpanan: 15000000,
  pinjamanAktif: 3000000,
  maxPinjaman: 50000000,
  interestRate: 6,
}

// Pending loan applications
const pendingApplications = [
  {
    id: 'LA001',
    memberId: 'M002',
    memberNama: 'Bu Sri Wahyuni',
    creditScore: 692,
    jumlah: 15000000,
    tenor: 12,
    tujuan: 'Modal Usaha',
    tanggalAjuan: '2026-03-05',
    status: 'review',
  },
  {
    id: 'LA002',
    memberId: 'M003',
    memberNama: 'Pak Ahmad Sudirman',
    creditScore: 548,
    jumlah: 5000000,
    tenor: 6,
    tujuan: 'Bibit & Pupuk',
    tanggalAjuan: '2026-03-06',
    status: 'pending',
  },
]

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount)
}

const getScoreColor = (score: number) => {
  if (score >= 750) return 'text-emerald-500'
  if (score >= 650) return 'text-green-500'
  if (score >= 550) return 'text-amber-500'
  return 'text-red-500'
}

export default function PinjamanPage() {
  const [activeTab, setActiveTab] = useState('ajukan')
  const [step, setStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)
  
  // Form state
  const [jumlahPinjaman, setJumlahPinjaman] = useState(5000000)
  const [tenor, setTenor] = useState(12)
  const [tujuan, setTujuan] = useState('')
  const [deskripsi, setDeskripsi] = useState('')
  const [agunan, setAgunan] = useState('')

  // Calculate loan details
  const monthlyInterestRate = currentMember.interestRate / 100 / 12
  const totalInterest = jumlahPinjaman * monthlyInterestRate * tenor
  const totalPembayaran = jumlahPinjaman + totalInterest
  const angsuranBulanan = totalPembayaran / tenor
  const adminFee = jumlahPinjaman * 0.01 // 1% admin fee
  const totalDiterima = jumlahPinjaman - adminFee

  // Check eligibility
  const isEligible = currentMember.creditScore >= 550 && 
                     currentMember.kycVerified && 
                     currentMember.dukcapilVerified
  const availableCredit = currentMember.maxPinjaman - currentMember.pinjamanAktif

  const handleSubmit = async () => {
    setIsSubmitting(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsSubmitting(false)
    setShowSuccessDialog(true)
  }

  const resetForm = () => {
    setStep(1)
    setJumlahPinjaman(5000000)
    setTenor(12)
    setTujuan('')
    setDeskripsi('')
    setAgunan('')
    setShowSuccessDialog(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild className="shrink-0">
            <Link href="/keuangan">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Pengajuan Pinjaman</h1>
            <p className="text-sm text-muted-foreground">
              Ajukan pinjaman berdasarkan credit score
            </p>
          </div>
        </div>
        <Button variant="outline" asChild className="w-full sm:w-auto">
          <Link href="/keuangan/credit-scoring">
            <CreditCard className="mr-2 h-4 w-4" />
            Lihat Credit Score
          </Link>
        </Button>
      </div>

      {/* Member Credit Info */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-primary/10 text-primary">
                  {currentMember.nama.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{currentMember.nama}</p>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Badge variant="outline" className="text-xs capitalize">{currentMember.tipe}</Badge>
                  <span>NIK: {currentMember.nik}</span>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Credit Score</p>
                <p className={`text-2xl font-bold ${getScoreColor(currentMember.creditScore)}`}>
                  {currentMember.creditScore}
                </p>
              </div>
              <Separator orientation="vertical" className="h-10 hidden sm:block" />
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Limit Tersedia</p>
                <p className="text-lg font-bold text-emerald-600">{formatCurrency(availableCredit)}</p>
              </div>
              <Separator orientation="vertical" className="h-10 hidden sm:block" />
              <div className="text-center">
                <p className="text-xs text-muted-foreground">Bunga</p>
                <p className="text-lg font-bold">{currentMember.interestRate}%/thn</p>
              </div>
              <div className="flex items-center gap-1">
                {currentMember.kycVerified && <ShieldCheck className="h-5 w-5 text-emerald-500" title="KYC Verified" />}
                {currentMember.dukcapilVerified && <CheckCircle className="h-5 w-5 text-emerald-500" title="Dukcapil Verified" />}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="ajukan" className="gap-2">
            <FileText className="h-4 w-4" />
            <span className="hidden sm:inline">Ajukan Pinjaman</span>
            <span className="sm:hidden">Ajukan</span>
          </TabsTrigger>
          <TabsTrigger value="riwayat" className="gap-2">
            <Clock className="h-4 w-4" />
            <span className="hidden sm:inline">Riwayat Pengajuan</span>
            <span className="sm:hidden">Riwayat</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="ajukan" className="space-y-4 mt-4">
          {!isEligible ? (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertTitle>Tidak Memenuhi Syarat</AlertTitle>
              <AlertDescription>
                Anda belum memenuhi syarat untuk mengajukan pinjaman. Pastikan:
                <ul className="list-disc list-inside mt-2 space-y-1">
                  <li>Credit Score minimal 550</li>
                  <li>Verifikasi KYC sudah selesai</li>
                  <li>Verifikasi Dukcapil sudah selesai</li>
                </ul>
              </AlertDescription>
            </Alert>
          ) : (
            <>
              {/* Progress Steps */}
              <div className="flex items-center justify-between px-2">
                {[1, 2, 3].map((s) => (
                  <div key={s} className="flex items-center">
                    <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold ${
                      step >= s ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                    }`}>
                      {step > s ? <CheckCircle className="h-4 w-4" /> : s}
                    </div>
                    {s < 3 && (
                      <div className={`h-1 w-16 sm:w-24 mx-2 ${step > s ? 'bg-primary' : 'bg-muted'}`} />
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-xs text-muted-foreground px-0 sm:px-2">
                <span>Jumlah & Tenor</span>
                <span>Detail</span>
                <span>Konfirmasi</span>
              </div>

              {/* Step 1: Amount & Tenor */}
              {step === 1 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Jumlah & Tenor Pinjaman</CardTitle>
                    <CardDescription>Pilih jumlah dan jangka waktu pinjaman</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Loan Amount */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <Label>Jumlah Pinjaman</Label>
                        <span className="text-xl font-bold text-primary">{formatCurrency(jumlahPinjaman)}</span>
                      </div>
                      <Slider
                        value={[jumlahPinjaman]}
                        onValueChange={(value) => setJumlahPinjaman(value[0])}
                        min={1000000}
                        max={Math.min(availableCredit, 50000000)}
                        step={500000}
                        className="w-full"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>Rp 1 Juta</span>
                        <span>{formatCurrency(Math.min(availableCredit, 50000000))}</span>
                      </div>
                    </div>

                    {/* Tenor */}
                    <div className="space-y-3">
                      <Label>Tenor (Jangka Waktu)</Label>
                      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                        {tenorOptions.map((t) => (
                          <Button
                            key={t}
                            variant={tenor === t ? 'default' : 'outline'}
                            onClick={() => setTenor(t)}
                            className="w-full"
                          >
                            {t} bln
                          </Button>
                        ))}
                      </div>
                    </div>

                    {/* Quick Calculation Preview */}
                    <div className="rounded-lg bg-muted/50 p-4 space-y-2">
                      <h4 className="font-medium flex items-center gap-2">
                        <Calculator className="h-4 w-4" />
                        Estimasi Perhitungan
                      </h4>
                      <div className="grid gap-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Angsuran/Bulan</span>
                          <span className="font-semibold text-primary">{formatCurrency(angsuranBulanan)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Total Bunga</span>
                          <span>{formatCurrency(totalInterest)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Total Pembayaran</span>
                          <span className="font-semibold">{formatCurrency(totalPembayaran)}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" onClick={() => setStep(2)}>
                      Lanjutkan
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              )}

              {/* Step 2: Details */}
              {step === 2 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Detail Pinjaman</CardTitle>
                    <CardDescription>Lengkapi informasi pengajuan pinjaman</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="tujuan">Tujuan Pinjaman *</Label>
                      <Select value={tujuan} onValueChange={setTujuan}>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih tujuan pinjaman" />
                        </SelectTrigger>
                        <SelectContent>
                          {tujuanPinjaman.map((t) => (
                            <SelectItem key={t.value} value={t.value}>
                              {t.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="deskripsi">Deskripsi Kebutuhan</Label>
                      <Textarea
                        id="deskripsi"
                        placeholder="Jelaskan secara detail kebutuhan pinjaman Anda..."
                        value={deskripsi}
                        onChange={(e) => setDeskripsi(e.target.value)}
                        rows={4}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="agunan">Agunan/Jaminan (Opsional)</Label>
                      <Input
                        id="agunan"
                        placeholder="Contoh: Sertifikat tanah, BPKB, dll"
                        value={agunan}
                        onChange={(e) => setAgunan(e.target.value)}
                      />
                      <p className="text-xs text-muted-foreground">
                        Agunan dapat mempercepat proses persetujuan dan meningkatkan limit pinjaman
                      </p>
                    </div>
                  </CardContent>
                  <CardFooter className="flex gap-2">
                    <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
                      Kembali
                    </Button>
                    <Button 
                      onClick={() => setStep(3)} 
                      className="flex-1"
                      disabled={!tujuan}
                    >
                      Lanjutkan
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              )}

              {/* Step 3: Confirmation */}
              {step === 3 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Konfirmasi Pengajuan</CardTitle>
                    <CardDescription>Periksa kembali detail pinjaman Anda</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="rounded-lg border p-4 space-y-3">
                      <h4 className="font-semibold text-sm text-muted-foreground">RINGKASAN PINJAMAN</h4>
                      <Separator />
                      <div className="grid gap-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Jumlah Pinjaman</span>
                          <span className="font-semibold">{formatCurrency(jumlahPinjaman)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Biaya Admin (1%)</span>
                          <span className="text-destructive">-{formatCurrency(adminFee)}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Dana Diterima</span>
                          <span className="font-bold text-emerald-600">{formatCurrency(totalDiterima)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-lg border p-4 space-y-3">
                      <h4 className="font-semibold text-sm text-muted-foreground">DETAIL ANGSURAN</h4>
                      <Separator />
                      <div className="grid gap-2">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Tenor</span>
                          <span>{tenor} Bulan</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Bunga per Tahun</span>
                          <span>{currentMember.interestRate}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Total Bunga</span>
                          <span>{formatCurrency(totalInterest)}</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Angsuran/Bulan</span>
                          <span className="font-bold text-primary text-lg">{formatCurrency(angsuranBulanan)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Total Pembayaran</span>
                          <span className="font-semibold">{formatCurrency(totalPembayaran)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-lg border p-4 space-y-2">
                      <h4 className="font-semibold text-sm text-muted-foreground">TUJUAN</h4>
                      <p className="font-medium">{tujuanPinjaman.find(t => t.value === tujuan)?.label}</p>
                      {deskripsi && <p className="text-sm text-muted-foreground">{deskripsi}</p>}
                      {agunan && (
                        <div className="flex items-center gap-2 text-sm">
                          <Badge variant="outline">Agunan</Badge>
                          <span>{agunan}</span>
                        </div>
                      )}
                    </div>

                    <Alert>
                      <Info className="h-4 w-4" />
                      <AlertTitle>Informasi</AlertTitle>
                      <AlertDescription>
                        Dengan mengajukan pinjaman, Anda menyetujui syarat dan ketentuan yang berlaku.
                        Pengajuan akan diproses dalam 1-3 hari kerja.
                      </AlertDescription>
                    </Alert>
                  </CardContent>
                  <CardFooter className="flex gap-2">
                    <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                      Kembali
                    </Button>
                    <Button 
                      onClick={handleSubmit} 
                      className="flex-1"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Memproses...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" />
                          Ajukan Pinjaman
                        </>
                      )}
                    </Button>
                  </CardFooter>
                </Card>
              )}
            </>
          )}
        </TabsContent>

        <TabsContent value="riwayat" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Riwayat Pengajuan</CardTitle>
              <CardDescription>Daftar pengajuan pinjaman Anda</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Mobile View */}
              <div className="sm:hidden space-y-3">
                {pendingApplications.map((app) => (
                  <div key={app.id} className="rounded-lg border p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs text-muted-foreground">{app.id}</span>
                      <Badge variant={app.status === 'review' ? 'secondary' : 'outline'}>
                        {app.status === 'review' ? 'Dalam Review' : 'Pending'}
                      </Badge>
                    </div>
                    <div>
                      <p className="font-semibold">{formatCurrency(app.jumlah)}</p>
                      <p className="text-sm text-muted-foreground">{app.tenor} bulan • {app.tujuan}</p>
                    </div>
                    <p className="text-xs text-muted-foreground">Diajukan: {app.tanggalAjuan}</p>
                  </div>
                ))}
              </div>

              {/* Desktop View */}
              <div className="hidden sm:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Jumlah</TableHead>
                      <TableHead>Tenor</TableHead>
                      <TableHead>Tujuan</TableHead>
                      <TableHead>Tanggal</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingApplications.map((app) => (
                      <TableRow key={app.id}>
                        <TableCell className="font-mono text-xs">{app.id}</TableCell>
                        <TableCell className="font-semibold">{formatCurrency(app.jumlah)}</TableCell>
                        <TableCell>{app.tenor} bulan</TableCell>
                        <TableCell>{app.tujuan}</TableCell>
                        <TableCell>{app.tanggalAjuan}</TableCell>
                        <TableCell>
                          <Badge variant={app.status === 'review' ? 'secondary' : 'outline'}>
                            {app.status === 'review' ? 'Dalam Review' : 'Pending'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {pendingApplications.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <FileText className="mx-auto h-12 w-12 mb-3 opacity-50" />
                  <p>Belum ada riwayat pengajuan</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Success Dialog */}
      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-emerald-600">
              <CheckCircle className="h-5 w-5" />
              Pengajuan Berhasil
            </DialogTitle>
            <DialogDescription>
              Pengajuan pinjaman Anda telah dikirim dan sedang dalam proses review.
            </DialogDescription>
          </DialogHeader>
          <div className="rounded-lg bg-muted/50 p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Nomor Pengajuan</span>
              <span className="font-mono font-semibold">LA{Date.now().toString().slice(-6)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Jumlah</span>
              <span className="font-semibold">{formatCurrency(jumlahPinjaman)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Estimasi Waktu Review</span>
              <span>1-3 hari kerja</span>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={resetForm} className="w-full sm:w-auto">
              Ajukan Lagi
            </Button>
            <Button asChild className="w-full sm:w-auto">
              <Link href="/keuangan/simpan-pinjam">Lihat Status Pinjaman</Link>
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
