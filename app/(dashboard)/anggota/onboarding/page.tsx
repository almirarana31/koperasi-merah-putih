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
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild className="shrink-0 h-8 w-8 rounded-none hover:bg-slate-100">
            <Link href="/anggota">
              <ArrowLeft className="h-4 w-4 text-slate-600" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-black uppercase tracking-tight text-slate-900">Registrasi Mandiri</h1>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mt-1">
              Verifikasi Identitas Kependudukan Nasional (E-KTP)
            </p>
          </div>
        </div>
        <Badge variant="outline" className="h-7 rounded-none text-[9px] font-black uppercase tracking-widest border-slate-200 text-slate-600">
          <Shield className="mr-1.5 h-3 w-3 text-emerald-500" />
          Enkripsi End-to-End
        </Badge>
      </div>

      {/* Progress Indicator */}
      <Card className="rounded-none border-slate-200 shadow-sm overflow-hidden border-t-4 border-t-slate-900">
        <CardContent className="p-4 bg-slate-50/50">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Tahapan Onboarding</span>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-900 bg-white px-2 py-0.5 border border-slate-100 shadow-sm">{getStepProgress()}% SELESAI</span>
            </div>
            <Progress value={getStepProgress()} className="h-1.5 bg-slate-200 rounded-none" />
            <div className="flex justify-between text-[9px] font-black uppercase tracking-widest text-slate-400">
              <span className={step === 'upload' ? 'text-emerald-600' : ''}>01. UNGGAH</span>
              <span className={step === 'scanning' ? 'text-emerald-600' : ''}>02. SCAN OCR</span>
              <span className={step === 'review' ? 'text-emerald-600' : ''}>03. TINJAU</span>
              <span className={step === 'verify' ? 'text-emerald-600' : ''}>04. VERIFIKASI</span>
              <span className={step === 'complete' ? 'text-emerald-600' : ''}>05. SELESAI</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step: Upload */}
      {step === 'upload' && (
        <div className="grid gap-6 lg:grid-cols-2">
          {/* KTP Upload */}
          <Card className="rounded-none border-slate-200 shadow-sm">
            <CardHeader className="p-4 pb-2 bg-slate-50 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-none bg-slate-900">
                  <CreditCard className="h-4 w-4 text-white" />
                </div>
                <div>
                  <CardTitle className="text-[10px] font-black uppercase tracking-widest text-slate-900">Kartu Identitas (KTP)</CardTitle>
                  <CardDescription className="text-[9px] font-bold uppercase text-slate-500">Pastikan dokumen terbaca tajam</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              {ktpImage ? (
                <div className="relative group">
                  <img
                    src={ktpImage}
                    alt="KTP Preview"
                    className="w-full rounded-none border border-slate-100 object-cover aspect-[16/10] shadow-sm"
                  />
                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="h-8 rounded-none text-[10px] font-black uppercase tracking-widest"
                      onClick={() => setKtpImage(null)}
                    >
                      <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
                      Ganti Foto
                    </Button>
                  </div>
                  <div className="absolute bottom-2 left-2">
                    <Badge className="bg-emerald-500 text-white text-[9px] font-black uppercase tracking-widest rounded-none border-none">
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                      SIAP
                    </Badge>
                  </div>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-slate-200 rounded-none cursor-pointer bg-slate-50/50 hover:bg-white hover:border-slate-900 transition-all">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4 text-center">
                    <Upload className="w-8 h-8 mb-3 text-slate-400" />
                    <p className="mb-1 text-[10px] font-black uppercase tracking-widest text-slate-900">Klik untuk unggah</p>
                    <p className="text-[9px] font-bold uppercase text-slate-500">Mendukung format JPG/PNG</p>
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
                  size="sm"
                  className="flex-1 h-9 rounded-none text-[10px] font-black uppercase tracking-widest text-slate-600 border-slate-200"
                  onClick={() => document.querySelector<HTMLInputElement>('input[type="file"]')?.click()}
                >
                  <Camera className="mr-2 h-4 w-4" />
                  Kamera
                </Button>
                <Button variant="outline" size="sm" className="flex-1 h-9 rounded-none text-[10px] font-black uppercase tracking-widest text-slate-600 border-slate-200">
                  <Upload className="mr-2 h-4 w-4" />
                  Galeri
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Selfie Upload */}
          <Card className="rounded-none border-slate-200 shadow-sm">
            <CardHeader className="p-4 pb-2 bg-slate-50 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-none bg-slate-900">
                  <User className="h-4 w-4 text-white" />
                </div>
                <div>
                  <CardTitle className="text-[10px] font-black uppercase tracking-widest text-slate-900">Verifikasi Wajah (Liveness)</CardTitle>
                  <CardDescription className="text-[9px] font-bold uppercase text-slate-500">Selfie dengan memegang KTP</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              {selfieImage ? (
                <div className="relative group">
                  <img
                    src={selfieImage}
                    alt="Selfie Preview"
                    className="w-full rounded-none border border-slate-100 object-cover aspect-[4/3] shadow-sm"
                  />
                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="h-8 rounded-none text-[10px] font-black uppercase tracking-widest"
                      onClick={() => setSelfieImage(null)}
                    >
                      <RotateCcw className="mr-1.5 h-3.5 w-3.5" />
                      Ganti Foto
                    </Button>
                  </div>
                  <div className="absolute bottom-2 left-2">
                    <Badge className="bg-emerald-500 text-white text-[9px] font-black uppercase tracking-widest rounded-none border-none">
                      <CheckCircle2 className="mr-1 h-3 w-3" />
                      SIAP
                    </Badge>
                  </div>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-slate-200 rounded-none cursor-pointer bg-slate-50/50 hover:bg-white hover:border-slate-900 transition-all">
                  <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4 text-center">
                    <Smartphone className="w-8 h-8 mb-3 text-slate-400" />
                    <p className="mb-1 text-[10px] font-black uppercase tracking-widest text-slate-900">Ambil Foto Selfie</p>
                    <p className="text-[9px] font-bold uppercase text-slate-500">Wajah & KTP harus sejajar</p>
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

              <Button variant="outline" size="sm" className="w-full h-9 rounded-none text-[10px] font-black uppercase tracking-widest text-slate-600 border-slate-200">
                <Camera className="mr-2 h-4 w-4" />
                Buka Kamera Depan
              </Button>
            </CardContent>
          </Card>

          {/* Tips */}
          <Card className="lg:col-span-2 rounded-none border-none shadow-xl bg-slate-900 text-white overflow-hidden">
            <CardHeader className="p-4 bg-slate-800/50">
              <CardTitle className="text-[10px] font-black uppercase tracking-widest text-slate-400">Protokol Pemindaian Optimal</CardTitle>
            </CardHeader>
            <CardContent className="p-4">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { id: '01', title: 'Pencahayaan', desc: 'Hindari bayangan & silau flash' },
                  { id: '02', title: 'Presisi', desc: 'Posisi KTP lurus dan simetris' },
                  { id: '03', title: 'Resolusi', desc: 'Teks harus terbaca tajam' },
                  { id: '04', title: 'Komposisi', desc: 'Seluruh KTP masuk dalam frame' },
                ].map((tip) => (
                  <div key={tip.id} className="flex items-start gap-3">
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-none bg-slate-800 text-[10px] font-black text-emerald-400 border border-slate-700">
                      {tip.id}
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-white">{tip.title}</p>
                      <p className="text-[9px] font-bold uppercase text-slate-400 mt-0.5">{tip.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter className="p-4 bg-slate-800/80 border-t border-slate-800">
              <Button
                className="w-full sm:w-auto ml-auto bg-emerald-500 hover:bg-emerald-600 text-white rounded-none border-none text-[10px] font-black uppercase tracking-widest h-10 shadow-lg"
                disabled={!ktpImage}
                onClick={simulateOCR}
              >
                Mulai Ekstraksi Data (OCR)
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </CardFooter>
          </Card>
        </div>
      )}

      {/* Step: Scanning */}
      {step === 'scanning' && (
        <Card className="rounded-none border-slate-200 shadow-xl overflow-hidden">
          <CardContent className="py-24 bg-slate-50/30">
            <div className="flex flex-col items-center justify-center text-center space-y-6">
              <div className="relative">
                <div className="h-24 w-24 rounded-none bg-slate-900 flex items-center justify-center shadow-2xl border-4 border-white">
                  <Loader2 className="h-10 w-10 text-emerald-400 animate-spin" />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-1.5 rounded-none border-2 border-white">
                  <Shield className="h-3 w-3" />
                </div>
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">Sistem Sedang Memproses Dokumen</h3>
                <p className="text-[10px] font-bold uppercase text-slate-500 max-w-xs mx-auto">
                  Algoritma kecerdasan buatan sedang mengekstrak bio-data dari identitas kependudukan nasional
                </p>
              </div>
              <div className="w-full max-w-xs space-y-3">
                <Progress value={66} className="h-1 bg-slate-200 rounded-none" />
                <p className="text-[9px] font-black uppercase tracking-widest text-emerald-600 animate-pulse">Menganalisis NIK & Data Otentikasi...</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step: Review */}
      {step === 'review' && extractedData && (
        <div className="space-y-6">
          <Alert className="bg-slate-900 border-none rounded-none border-l-4 border-emerald-500 text-white py-5 shadow-2xl">
            <Eye className="h-4 w-4 text-emerald-500" />
            <AlertTitle className="text-[10px] font-black uppercase tracking-widest text-emerald-500">Audit Hasil Ekstraksi</AlertTitle>
            <AlertDescription className="text-[9px] font-bold uppercase text-slate-400 mt-1 tracking-tight">
              Tinjau akurasi data yang terbaca. Lakukan koreksi manual pada field yang kurang presisi untuk sinkronisasi database 100%.
            </AlertDescription>
          </Alert>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* KTP Preview */}
            <Card className="rounded-none border-slate-200 shadow-sm h-fit border-t-4 border-t-slate-900">
              <CardHeader className="p-4 bg-slate-50">
                <CardTitle className="text-[10px] font-black uppercase tracking-widest text-slate-900">Referensi Dokumen</CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                {ktpImage && (
                  <img
                    src={ktpImage}
                    alt="KTP"
                    className="w-full rounded-none border border-slate-100 object-cover shadow-sm"
                  />
                )}
              </CardContent>
            </Card>

            {/* Extracted Data */}
            <Card className="lg:col-span-2 rounded-none border-slate-200 shadow-xl border-t-4 border-t-slate-900">
              <CardHeader className="p-4 border-b border-slate-50 flex flex-row items-center justify-between bg-slate-50/50">
                <div>
                  <CardTitle className="text-[10px] font-black uppercase tracking-widest text-slate-900">Database Hasil Ekstraksi</CardTitle>
                  <CardDescription className="text-[9px] font-bold uppercase text-slate-500">Sinkronisasi data sistem kependudukan nasional</CardDescription>
                </div>
                <Button
                  variant={editMode ? 'default' : 'outline'}
                  size="sm"
                  className={`h-8 rounded-none text-[9px] font-black uppercase tracking-widest ${editMode ? 'bg-emerald-600 hover:bg-emerald-700' : ''}`}
                  onClick={() => setEditMode(!editMode)}
                >
                  {editMode ? 'Simpan' : 'Edit Manual'}
                </Button>
              </CardHeader>
              <CardContent className="p-6 space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Nomor Induk Kependudukan (NIK)</Label>
                    <Input
                      value={extractedData.nik}
                      onChange={(e) => updateField('nik', e.target.value)}
                      disabled={!editMode}
                      className="font-mono text-xs font-black bg-slate-50/50 border-slate-200 rounded-none h-10 tracking-widest"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Nama Lengkap (Sesuai KTP)</Label>
                    <Input
                      value={extractedData.nama}
                      onChange={(e) => updateField('nama', e.target.value)}
                      disabled={!editMode}
                      className="text-xs font-black uppercase bg-slate-50/50 border-slate-200 rounded-none h-10"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Tempat Lahir</Label>
                    <Input
                      value={extractedData.tempatLahir}
                      onChange={(e) => updateField('tempatLahir', e.target.value)}
                      disabled={!editMode}
                      className="text-xs font-black uppercase bg-slate-50/50 border-slate-200 rounded-none h-10"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Tanggal Lahir</Label>
                    <Input
                      value={extractedData.tanggalLahir}
                      onChange={(e) => updateField('tanggalLahir', e.target.value)}
                      disabled={!editMode}
                      className="text-xs font-black uppercase bg-slate-50/50 border-slate-200 rounded-none h-10"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Jenis Kelamin</Label>
                    <Input
                      value={extractedData.jenisKelamin}
                      onChange={(e) => updateField('jenisKelamin', e.target.value)}
                      disabled={!editMode}
                      className="text-xs font-black uppercase bg-slate-50/50 border-slate-200 rounded-none h-10"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Pekerjaan Utama</Label>
                    <Input
                      value={extractedData.pekerjaan}
                      onChange={(e) => updateField('pekerjaan', e.target.value)}
                      disabled={!editMode}
                      className="text-xs font-black uppercase bg-slate-50/50 border-slate-200 rounded-none h-10"
                    />
                  </div>
                </div>

                <div className="p-5 bg-slate-900 rounded-none space-y-4 shadow-inner">
                  <div className="space-y-1.5">
                    <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Alamat Domisili Tetap</Label>
                    <Input
                      value={extractedData.alamat}
                      onChange={(e) => updateField('alamat', e.target.value)}
                      disabled={!editMode}
                      className="text-xs font-black uppercase bg-slate-800 border-slate-700 text-white rounded-none h-10"
                    />
                  </div>

                  <div className="grid gap-4 sm:grid-cols-4">
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">RT</Label>
                      <Input
                        value={extractedData.rt}
                        onChange={(e) => updateField('rt', e.target.value)}
                        disabled={!editMode}
                        className="text-xs font-black uppercase bg-slate-800 border-slate-700 text-white rounded-none h-10"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">RW</Label>
                      <Input
                        value={extractedData.rw}
                        onChange={(e) => updateField('rw', e.target.value)}
                        disabled={!editMode}
                        className="text-xs font-black uppercase bg-slate-800 border-slate-700 text-white rounded-none h-10"
                      />
                    </div>
                    <div className="space-y-1.5 sm:col-span-2">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Kelurahan / Desa</Label>
                      <Input
                        value={extractedData.kelurahan}
                        onChange={(e) => updateField('kelurahan', e.target.value)}
                        disabled={!editMode}
                        className="text-xs font-black uppercase bg-slate-800 border-slate-700 text-white rounded-none h-10"
                      />
                    </div>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-3">
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Kecamatan</Label>
                      <Input
                        value={extractedData.kecamatan}
                        onChange={(e) => updateField('kecamatan', e.target.value)}
                        disabled={!editMode}
                        className="text-xs font-black uppercase bg-slate-800 border-slate-700 text-white rounded-none h-10"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Kabupaten / Kota</Label>
                      <Input
                        value={extractedData.kabupaten}
                        onChange={(e) => updateField('kabupaten', e.target.value)}
                        disabled={!editMode}
                        className="text-xs font-black uppercase bg-slate-800 border-slate-700 text-white rounded-none h-10"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Provinsi</Label>
                      <Input
                        value={extractedData.provinsi}
                        onChange={(e) => updateField('provinsi', e.target.value)}
                        disabled={!editMode}
                        className="text-xs font-black uppercase bg-slate-800 border-slate-700 text-white rounded-none h-10"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-4 bg-slate-50 flex flex-col sm:flex-row gap-3 border-t border-slate-200">
                <Button variant="outline" size="sm" onClick={() => setStep('upload')} className="w-full sm:w-auto rounded-none text-[10px] font-black uppercase tracking-widest border-slate-300 h-10">
                  <ArrowLeft className="mr-1.5 h-4 w-4" />
                  Ganti Dokumen
                </Button>
                <Button onClick={handleVerify} className="w-full sm:w-auto sm:ml-auto bg-slate-900 hover:bg-slate-800 text-white rounded-none text-[10px] font-black uppercase tracking-widest h-10 shadow-lg">
                  Verifikasi Dukcapil Nasional
                  <Shield className="ml-2 h-4 w-4 text-emerald-400" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      )}

      {/* Step: Verify */}
      {step === 'verify' && (
        <Card className="rounded-none border-slate-200 shadow-xl overflow-hidden">
          <CardContent className="py-24 bg-slate-50/30">
            <div className="flex flex-col items-center justify-center text-center space-y-6">
              {verificationStatus === 'verifying' && (
                <>
                  <div className="relative">
                    <div className="h-24 w-24 rounded-none bg-slate-900 flex items-center justify-center shadow-2xl border-4 border-white">
                      <Shield className="h-10 w-10 text-emerald-400 animate-pulse" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-sm font-black uppercase tracking-widest text-slate-900">Sinkronisasi Database Nasional</h3>
                    <p className="text-[10px] font-bold uppercase text-slate-500 max-w-xs mx-auto">
                      Menghubungi Server Kependudukan KOPDES x Dukcapil Nasional
                    </p>
                  </div>
                  <div className="w-full max-w-xs space-y-3">
                    <Progress value={50} className="h-1 bg-slate-200 rounded-none" />
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-900 animate-pulse">Requesting Secure Token...</p>
                  </div>
                </>
              )}

              {verificationStatus === 'failed' && (
                <>
                  <div className="h-24 w-24 rounded-none bg-rose-50 flex items-center justify-center border-4 border-white shadow-xl">
                    <AlertCircle className="h-10 w-10 text-rose-500" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-sm font-black uppercase tracking-widest text-rose-600">Otentikasi Gagal</h3>
                    <p className="text-[10px] font-bold uppercase text-slate-500 max-w-xs mx-auto">
                      Data NIK tidak sinkron dengan Database Nasional. Periksa kembali NIK atau pastikan KTP adalah e-KTP asli.
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => setStep('review')} className="rounded-none text-[10px] font-black uppercase tracking-widest border-slate-200 h-9">
                      <ArrowLeft className="mr-1.5 h-4 w-4" />
                      Koreksi Data
                    </Button>
                    <Button size="sm" onClick={handleVerify} className="rounded-none bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest h-9">
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
          <Card className="rounded-none border-none bg-emerald-500 text-white overflow-hidden relative shadow-2xl">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <Shield className="h-32 w-32" />
            </div>
            <CardContent className="py-16 relative">
              <div className="flex flex-col items-center justify-center text-center space-y-6">
                <div className="h-20 w-20 rounded-none bg-white/20 flex items-center justify-center border-4 border-white/50 shadow-inner">
                  <CheckCircle2 className="h-10 w-10 text-white" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-3xl font-black uppercase tracking-tight">Verifikasi Tervalidasi</h3>
                  <p className="text-[10px] font-black uppercase tracking-widest text-emerald-100 opacity-90">
                    Identitas Terintegrasi dengan Ekosistem Digital Koperasi Merah Putih
                  </p>
                </div>
                <Badge className="bg-white text-emerald-600 text-[10px] font-black uppercase tracking-widest rounded-none border-none px-6 py-2 shadow-xl mt-4">
                  <FileCheck className="mr-2 h-4 w-4" />
                  STATUS: TERVERIFIKASI NASIONAL
                </Badge>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-none border-slate-200 shadow-xl overflow-hidden border-t-4 border-t-slate-900">
            <CardHeader className="p-4 bg-slate-50/50 border-b border-slate-100">
              <CardTitle className="text-[10px] font-black uppercase tracking-widest text-slate-900">Sertifikat Digital Anggota</CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid gap-12 sm:grid-cols-2">
                <div className="space-y-8">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-none bg-slate-100">
                      <User className="h-5 w-5 text-slate-900" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Nama Lengkap</p>
                      <p className="text-sm font-black uppercase text-slate-900 mt-1">{extractedData.nama}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-none bg-slate-100">
                      <CreditCard className="h-5 w-5 text-slate-900" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Nomor NIK</p>
                      <p className="text-sm font-black font-mono tracking-widest text-slate-900 mt-1">{extractedData.nik}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-none bg-slate-100">
                      <Calendar className="h-5 w-5 text-slate-900" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Data Kelahiran</p>
                      <p className="text-sm font-black uppercase text-slate-900 mt-1">{extractedData.tempatLahir}, {extractedData.tanggalLahir}</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-8">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-none bg-slate-100">
                      <MapPin className="h-5 w-5 text-slate-900" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Koordinat Domisili</p>
                      <div className="mt-2 space-y-1.5">
                        <p className="text-sm font-black uppercase text-slate-900 leading-tight">
                          {extractedData.alamat}, RT {extractedData.rt}/RW {extractedData.rw}
                        </p>
                        <p className="text-[10px] font-bold uppercase text-slate-500">
                          {extractedData.kelurahan}, {extractedData.kecamatan}
                        </p>
                        <p className="text-[10px] font-bold uppercase text-slate-500">
                          {extractedData.kabupaten}, {extractedData.provinsi}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="p-6 bg-slate-50/50 border-t border-slate-100 flex flex-col sm:flex-row gap-4">
              <Button variant="outline" size="sm" asChild className="w-full sm:w-auto rounded-none text-[10px] font-black uppercase tracking-widest border-slate-300 h-10">
                <Link href="/anggota">
                  Kembali ke Dashboard
                </Link>
              </Button>
              <Button asChild size="sm" className="w-full sm:w-auto sm:ml-auto bg-slate-900 hover:bg-slate-800 text-white rounded-none text-[10px] font-black uppercase tracking-widest h-10 shadow-xl">
                <Link href="/keuangan/simpan-pinjam">
                  Aktifkan Layanan Finansial
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