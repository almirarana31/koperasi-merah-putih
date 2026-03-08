'use client'

import { useState, useCallback } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Camera,
  Upload,
  CheckCircle2,
  AlertCircle,
  Loader2,
  User,
  CreditCard,
  MapPin,
  Calendar,
  Shield,
  FileCheck,
  ArrowRight,
  Smartphone,
  Eye,
  RotateCcw,
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
import { Separator } from '@/components/ui/separator'
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert'

interface KTPData {
  nik: string
  nama: string
  tempatLahir: string
  tanggalLahir: string
  jenisKelamin: string
  alamat: string
  rt: string
  rw: string
  kelurahan: string
  kecamatan: string
  kabupaten: string
  provinsi: string
  agama: string
  statusPerkawinan: string
  pekerjaan: string
  kewarganegaraan: string
  berlakuHingga: string
}

type OnboardingStep = 'upload' | 'scanning' | 'review' | 'verify' | 'complete'

export default function OnboardingPage() {
  const [step, setStep] = useState<OnboardingStep>('upload')
  const [ktpImage, setKtpImage] = useState<string | null>(null)
  const [selfieImage, setSelfieImage] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [extractedData, setExtractedData] = useState<KTPData | null>(null)
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'verifying' | 'verified' | 'failed'>('pending')
  const [editMode, setEditMode] = useState(false)

  // Simulated OCR extraction
  const simulateOCR = useCallback(async () => {
    setIsProcessing(true)
    setStep('scanning')

    // Simulate OCR processing time
    await new Promise(resolve => setTimeout(resolve, 3000))

    // Simulated extracted data
    const mockData: KTPData = {
      nik: '3201012345678901',
      nama: 'AHMAD SUDIRMAN',
      tempatLahir: 'BANDUNG',
      tanggalLahir: '15-05-1985',
      jenisKelamin: 'LAKI-LAKI',
      alamat: 'JL. MERDEKA NO. 45',
      rt: '03',
      rw: '05',
      kelurahan: 'SUKAMAJU',
      kecamatan: 'CIBEUNYING KALER',
      kabupaten: 'KOTA BANDUNG',
      provinsi: 'JAWA BARAT',
      agama: 'ISLAM',
      statusPerkawinan: 'KAWIN',
      pekerjaan: 'PETANI',
      kewarganegaraan: 'WNI',
      berlakuHingga: 'SEUMUR HIDUP',
    }

    setExtractedData(mockData)
    setIsProcessing(false)
    setStep('review')
  }, [])

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'ktp' | 'selfie') => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        if (type === 'ktp') {
          setKtpImage(event.target?.result as string)
        } else {
          setSelfieImage(event.target?.result as string)
        }
      }
      reader.readAsDataURL(file)
    }
  }

  // Handle Dukcapil verification
  const handleVerify = async () => {
    setStep('verify')
    setVerificationStatus('verifying')

    // Simulate Dukcapil API verification
    await new Promise(resolve => setTimeout(resolve, 4000))

    // Simulate successful verification (90% success rate)
    if (Math.random() > 0.1) {
      setVerificationStatus('verified')
      await new Promise(resolve => setTimeout(resolve, 1500))
      setStep('complete')
    } else {
      setVerificationStatus('failed')
    }
  }

  // Update extracted data
  const updateField = (field: keyof KTPData, value: string) => {
    if (extractedData) {
      setExtractedData({ ...extractedData, [field]: value })
    }
  }

  const getStepProgress = () => {
    switch (step) {
      case 'upload': return 20
      case 'scanning': return 40
      case 'review': return 60
      case 'verify': return 80
      case 'complete': return 100
    }
  }

  return (
    <div className="min-h-screen space-y-6 pb-24">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild className="shrink-0">
            <Link href="/anggota">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-primary">
              Pendaftaran Anggota Baru
            </h1>
            <p className="text-sm text-muted-foreground">
              Verifikasi identitas dengan KTP (e-KTP)
            </p>
          </div>
        </div>
        <Badge variant="outline" className="w-fit">
          <Shield className="mr-1 h-3 w-3" />
          Terenkripsi & Aman
        </Badge>
      </div>

      {/* Progress Indicator */}
      <Card>
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="font-medium">Progres Pendaftaran</span>
              <span className="text-muted-foreground">{getStepProgress()}%</span>
            </div>
            <Progress value={getStepProgress()} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span className={step === 'upload' ? 'text-primary font-medium' : ''}>Upload</span>
              <span className={step === 'scanning' ? 'text-primary font-medium' : ''}>Scan OCR</span>
              <span className={step === 'review' ? 'text-primary font-medium' : ''}>Review</span>
              <span className={step === 'verify' ? 'text-primary font-medium' : ''}>Verifikasi</span>
              <span className={step === 'complete' ? 'text-primary font-medium' : ''}>Selesai</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step: Upload */}
      {step === 'upload' && (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* KTP Upload */}
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                Upload Foto KTP
              </CardTitle>
              <CardDescription>
                Pastikan foto KTP terlihat jelas dan tidak terpotong
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {ktpImage ? (
                <div className="relative">
                  <img
                    src={ktpImage}
                    alt="KTP Preview"
                    className="w-full rounded-lg border object-cover aspect-[16/10]"
                  />
                  <Button
                    variant="secondary"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => setKtpImage(null)}
                  >
                    <RotateCcw className="mr-1 h-3 w-3" />
                    Ganti
                  </Button>
                  <div className="absolute bottom-2 left-2">
                    <Badge className="bg-primary">
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                      Foto siap
                    </Badge>
                  </div>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-muted/30 hover:bg-muted/50 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4 text-center">
                    <Upload className="w-10 h-10 mb-3 text-muted-foreground" />
                    <p className="mb-2 text-sm text-muted-foreground">
                      <span className="font-semibold">Klik untuk upload</span> atau drag & drop
                    </p>
                    <p className="text-xs text-muted-foreground">PNG, JPG (MAX. 5MB)</p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e, 'ktp')}
                  />
                </label>
              )}

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => document.querySelector<HTMLInputElement>('input[type="file"]')?.click()}
                >
                  <Camera className="mr-2 h-4 w-4" />
                  Ambil Foto
                </Button>
                <Button variant="outline" className="flex-1">
                  <Upload className="mr-2 h-4 w-4" />
                  Pilih File
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Selfie Upload */}
          <Card className="overflow-hidden">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Foto Selfie dengan KTP
              </CardTitle>
              <CardDescription>
                Ambil foto selfie sambil memegang KTP di samping wajah
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {selfieImage ? (
                <div className="relative">
                  <img
                    src={selfieImage}
                    alt="Selfie Preview"
                    className="w-full rounded-lg border object-cover aspect-[4/3]"
                  />
                  <Button
                    variant="secondary"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={() => setSelfieImage(null)}
                  >
                    <RotateCcw className="mr-1 h-3 w-3" />
                    Ganti
                  </Button>
                  <div className="absolute bottom-2 left-2">
                    <Badge className="bg-primary">
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                      Foto siap
                    </Badge>
                  </div>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer bg-muted/30 hover:bg-muted/50 transition-colors">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4 text-center">
                    <Smartphone className="w-10 h-10 mb-3 text-muted-foreground" />
                    <p className="mb-2 text-sm text-muted-foreground">
                      <span className="font-semibold">Foto selfie</span> dengan KTP
                    </p>
                    <p className="text-xs text-muted-foreground">Pastikan wajah & KTP terlihat jelas</p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    capture="user"
                    onChange={(e) => handleImageUpload(e, 'selfie')}
                  />
                </label>
              )}

              <Button variant="outline" className="w-full">
                <Camera className="mr-2 h-4 w-4" />
                Buka Kamera
              </Button>
            </CardContent>
          </Card>

          {/* Tips */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="text-base">Tips untuk Hasil Scan Optimal</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    1
                  </div>
                  <div>
                    <p className="font-medium text-sm">Pencahayaan Baik</p>
                    <p className="text-xs text-muted-foreground">Hindari bayangan & silau</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    2
                  </div>
                  <div>
                    <p className="font-medium text-sm">Posisi Lurus</p>
                    <p className="text-xs text-muted-foreground">KTP tidak miring/terbalik</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    3
                  </div>
                  <div>
                    <p className="font-medium text-sm">Fokus Jelas</p>
                    <p className="text-xs text-muted-foreground">Teks harus terbaca jelas</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                    4
                  </div>
                  <div>
                    <p className="font-medium text-sm">Tidak Terpotong</p>
                    <p className="text-xs text-muted-foreground">Seluruh KTP masuk frame</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                className="w-full sm:w-auto ml-auto"
                disabled={!ktpImage}
                onClick={simulateOCR}
              >
                Lanjut Scan OCR
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}

      {/* Step: Scanning */}
      {step === 'scanning' && (
        <Card>
          <CardContent className="py-16">
            <div className="flex flex-col items-center justify-center text-center space-y-6">
              <div className="relative">
                <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center">
                  <Loader2 className="h-12 w-12 text-primary animate-spin" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">Memproses KTP...</h3>
                <p className="text-muted-foreground max-w-md">
                  Sistem sedang membaca data dari foto KTP Anda menggunakan teknologi OCR
                </p>
              </div>
              <div className="w-full max-w-xs space-y-2">
                <Progress value={66} className="h-2" />
                <p className="text-sm text-muted-foreground">Mengekstrak data identitas...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step: Review */}
      {step === 'review' && extractedData && (
        <div className="space-y-6">
          <Alert>
            <Eye className="h-4 w-4" />
            <AlertTitle>Periksa Data Hasil OCR</AlertTitle>
            <AlertDescription>
              Pastikan semua data berikut sesuai dengan KTP Anda. Anda dapat mengedit jika ada kesalahan.
            </AlertDescription>
          </Alert>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* KTP Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Foto KTP</CardTitle>
              </CardHeader>
              <CardContent>
                {ktpImage && (
                  <img
                    src={ktpImage}
                    alt="KTP"
                    className="w-full rounded-lg border object-cover"
                  />
                )}
              </CardContent>
            </Card>

            {/* Extracted Data */}
            <Card className="lg:col-span-2">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <div>
                  <CardTitle>Data Hasil Ekstraksi</CardTitle>
                  <CardDescription>Verifikasi dan edit bila diperlukan</CardDescription>
                </div>
                <Button
                  variant={editMode ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setEditMode(!editMode)}
                >
                  {editMode ? 'Selesai Edit' : 'Edit Data'}
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="nik">NIK</Label>
                    <Input
                      id="nik"
                      value={extractedData.nik}
                      onChange={(e) => updateField('nik', e.target.value)}
                      disabled={!editMode}
                      className="font-mono"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nama">Nama Lengkap</Label>
                    <Input
                      id="nama"
                      value={extractedData.nama}
                      onChange={(e) => updateField('nama', e.target.value)}
                      disabled={!editMode}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tempatLahir">Tempat Lahir</Label>
                    <Input
                      id="tempatLahir"
                      value={extractedData.tempatLahir}
                      onChange={(e) => updateField('tempatLahir', e.target.value)}
                      disabled={!editMode}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tanggalLahir">Tanggal Lahir</Label>
                    <Input
                      id="tanggalLahir"
                      value={extractedData.tanggalLahir}
                      onChange={(e) => updateField('tanggalLahir', e.target.value)}
                      disabled={!editMode}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="jenisKelamin">Jenis Kelamin</Label>
                    <Input
                      id="jenisKelamin"
                      value={extractedData.jenisKelamin}
                      onChange={(e) => updateField('jenisKelamin', e.target.value)}
                      disabled={!editMode}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pekerjaan">Pekerjaan</Label>
                    <Input
                      id="pekerjaan"
                      value={extractedData.pekerjaan}
                      onChange={(e) => updateField('pekerjaan', e.target.value)}
                      disabled={!editMode}
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <Label htmlFor="alamat">Alamat</Label>
                  <Input
                    id="alamat"
                    value={extractedData.alamat}
                    onChange={(e) => updateField('alamat', e.target.value)}
                    disabled={!editMode}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-4">
                  <div className="space-y-2">
                    <Label htmlFor="rt">RT</Label>
                    <Input
                      id="rt"
                      value={extractedData.rt}
                      onChange={(e) => updateField('rt', e.target.value)}
                      disabled={!editMode}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rw">RW</Label>
                    <Input
                      id="rw"
                      value={extractedData.rw}
                      onChange={(e) => updateField('rw', e.target.value)}
                      disabled={!editMode}
                    />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label htmlFor="kelurahan">Kelurahan/Desa</Label>
                    <Input
                      id="kelurahan"
                      value={extractedData.kelurahan}
                      onChange={(e) => updateField('kelurahan', e.target.value)}
                      disabled={!editMode}
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="space-y-2">
                    <Label htmlFor="kecamatan">Kecamatan</Label>
                    <Input
                      id="kecamatan"
                      value={extractedData.kecamatan}
                      onChange={(e) => updateField('kecamatan', e.target.value)}
                      disabled={!editMode}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="kabupaten">Kabupaten/Kota</Label>
                    <Input
                      id="kabupaten"
                      value={extractedData.kabupaten}
                      onChange={(e) => updateField('kabupaten', e.target.value)}
                      disabled={!editMode}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="provinsi">Provinsi</Label>
                    <Input
                      id="provinsi"
                      value={extractedData.provinsi}
                      onChange={(e) => updateField('provinsi', e.target.value)}
                      disabled={!editMode}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex flex-col sm:flex-row gap-3 pt-6">
                <Button variant="outline" onClick={() => setStep('upload')} className="w-full sm:w-auto">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Kembali
                </Button>
                <Button onClick={handleVerify} className="w-full sm:w-auto sm:ml-auto">
                  Verifikasi dengan Dukcapil
                  <Shield className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      )}

      {/* Step: Verify */}
      {step === 'verify' && (
        <Card>
          <CardContent className="py-16">
            <div className="flex flex-col items-center justify-center text-center space-y-6">
              {verificationStatus === 'verifying' && (
                <>
                  <div className="relative">
                    <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center">
                      <Shield className="h-12 w-12 text-primary animate-pulse" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold">Memverifikasi dengan Dukcapil...</h3>
                    <p className="text-muted-foreground max-w-md">
                      Sistem sedang mencocokkan data NIK dengan database Kependudukan Nasional
                    </p>
                  </div>
                  <div className="w-full max-w-xs space-y-2">
                    <Progress value={50} className="h-2" />
                    <p className="text-sm text-muted-foreground">Menghubungi server Dukcapil...</p>
                  </div>
                </>
              )}

              {verificationStatus === 'failed' && (
                <>
                  <div className="h-24 w-24 rounded-full bg-destructive/10 flex items-center justify-center">
                    <AlertCircle className="h-12 w-12 text-destructive" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-semibold text-destructive">Verifikasi Gagal</h3>
                    <p className="text-muted-foreground max-w-md">
                      Data NIK tidak ditemukan atau tidak cocok dengan database Dukcapil.
                      Silakan periksa kembali data Anda.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <Button variant="outline" onClick={() => setStep('review')}>
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Periksa Data
                    </Button>
                    <Button onClick={handleVerify}>
                      Coba Lagi
                    </Button>
                  </div>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step: Complete */}
      {step === 'complete' && extractedData && (
        <div className="space-y-6">
          <Card className="border-primary/50 bg-primary/5">
            <CardContent className="py-10">
              <div className="flex flex-col items-center justify-center text-center space-y-4">
                <div className="h-20 w-20 rounded-full bg-primary/20 flex items-center justify-center">
                  <CheckCircle2 className="h-10 w-10 text-primary" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-2xl font-bold text-primary">Verifikasi Berhasil!</h3>
                  <p className="text-muted-foreground max-w-md">
                    Data identitas Anda telah berhasil diverifikasi dengan Dukcapil.
                    Akun koperasi Anda siap digunakan.
                  </p>
                </div>
                <Badge className="bg-primary text-lg px-4 py-2">
                  <FileCheck className="mr-2 h-4 w-4" />
                  Status: Terverifikasi
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ringkasan Data Anggota</CardTitle>
              <CardDescription>Informasi yang terdaftar di sistem koperasi</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Nama Lengkap</p>
                      <p className="font-medium">{extractedData.nama}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <CreditCard className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">NIK</p>
                      <p className="font-medium font-mono">{extractedData.nik}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Tanggal Lahir</p>
                      <p className="font-medium">{extractedData.tempatLahir}, {extractedData.tanggalLahir}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                    <div>
                      <p className="text-sm text-muted-foreground">Alamat</p>
                      <p className="font-medium">
                        {extractedData.alamat}, RT {extractedData.rt}/RW {extractedData.rw}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {extractedData.kelurahan}, {extractedData.kecamatan}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {extractedData.kabupaten}, {extractedData.provinsi}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-3">
              <Button variant="outline" asChild className="w-full sm:w-auto">
                <Link href="/anggota">
                  Lihat Daftar Anggota
                </Link>
              </Button>
              <Button asChild className="w-full sm:w-auto sm:ml-auto">
                <Link href="/keuangan/simpan-pinjam">
                  Ajukan Pinjaman
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  )
}
