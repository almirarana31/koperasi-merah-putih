'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Save, Camera, Zap, ShieldCheck, UserPlus, Database, MapPin, Briefcase, Wallet } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert'
import { toast } from 'sonner'

export default function TambahAnggotaPage() {
  const [formData, setFormData] = useState({
    nik: '',
    nama: '',
    tipe: '',
    alamat: '',
    desa: '',
    kecamatan: '',
    noHp: '',
    luasLahan: '',
    komoditas: '',
    simpananPokok: '500000',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    toast.success('DATA ANGGOTA BERHASIL DISIMPAN KE DATABASE NASIONAL')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild className="shrink-0 h-10 w-10 rounded-none bg-white border border-slate-200 shadow-sm hover:bg-slate-50">
            <Link href="/anggota">
              <ArrowLeft className="h-5 w-5 text-slate-600" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Registrasi Manual Anggota</h1>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">
              Input Entitas Baru ke Database Koperasi Digital Nasional
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="h-10 rounded-none text-[10px] font-black uppercase tracking-widest text-slate-600 border-slate-200 bg-white shadow-none px-6"
            asChild
          >
            <Link href="/anggota">Batal</Link>
          </Button>
          <Button 
            onClick={handleSubmit}
            className="h-10 rounded-none bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-black uppercase tracking-widest px-8 shadow-xl"
          >
            <Save className="h-4 w-4 mr-2" />
            Simpan Data
          </Button>
        </div>
      </div>

      {/* OCR Suggestion */}
      <Alert className="rounded-none border-none border-l-4 border-emerald-500 bg-slate-900 text-white py-6 shadow-2xl overflow-hidden relative">
        <div className="absolute right-0 top-0 h-full w-32 bg-emerald-500/10 skew-x-12 translate-x-16" />
        <Camera className="h-5 w-5 text-emerald-400" />
        <AlertTitle className="text-[11px] font-black uppercase tracking-widest text-emerald-400 mb-2">Optimasi Registrasi: Gunakan Onboarding Digital</AlertTitle>
        <AlertDescription className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mt-3">
          <p className="text-[10px] font-bold uppercase text-slate-400 max-w-2xl leading-relaxed">
            Daftarkan anggota 75% lebih cepat dengan teknologi scan KTP otomatis (OCR) dan validasi biometrik yang terhubung langsung ke basis data kependudukan nasional.
          </p>
          <Button size="sm" className="w-fit rounded-none bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest h-10 px-6 shadow-lg shadow-emerald-500/20" asChild>
            <Link href="/anggota/onboarding">
              <Zap className="mr-2 h-4 w-4 fill-current" />
              AKTIFKAN OCR SEKARANG
            </Link>
          </Button>
        </AlertDescription>
      </Alert>

      <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-2">
        {/* Data Pribadi */}
        <Card className="rounded-none border-none shadow-sm overflow-hidden bg-white">
          <CardHeader className="bg-slate-900 py-4 px-6 border-none">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-none bg-white/10 flex items-center justify-center">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
              </div>
              <div>
                <CardTitle className="text-[10px] font-black uppercase tracking-widest text-white">Identitas Nasional</CardTitle>
                <CardDescription className="text-[9px] font-bold uppercase text-slate-400">Validasi Data Berbasis E-KTP</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="nik" className="text-[10px] font-black uppercase tracking-widest text-slate-400">Nomor Induk Kependudukan (NIK)</Label>
              <Input
                id="nik"
                placeholder="16 DIGIT NIK"
                className="h-11 text-xs font-black bg-slate-50 border-slate-200 rounded-none font-mono tracking-widest focus:ring-slate-900 focus:border-slate-900"
                value={formData.nik}
                onChange={(e) => setFormData({ ...formData, nik: e.target.value })}
                maxLength={16}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nama" className="text-[10px] font-black uppercase tracking-widest text-slate-400">Nama Lengkap (Sesuai KTP)</Label>
              <Input
                id="nama"
                placeholder="NAMA LENGKAP"
                className="h-11 text-xs font-black uppercase bg-slate-50 border-slate-200 rounded-none focus:ring-slate-900 focus:border-slate-900"
                value={formData.nama}
                onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="tipe" className="text-[10px] font-black uppercase tracking-widest text-slate-400">Tipe Keanggotaan</Label>
                <Select
                  value={formData.tipe}
                  onValueChange={(value) => setFormData({ ...formData, tipe: value })}
                >
                  <SelectTrigger className="h-11 text-xs font-black uppercase bg-slate-50 border-slate-200 rounded-none focus:ring-slate-900">
                    <SelectValue placeholder="PILIH TIPE" />
                  </SelectTrigger>
                  <SelectContent className="rounded-none border-slate-900">
                    <SelectItem value="petani" className="text-[10px] font-black uppercase">PRODUSEN (PETANI)</SelectItem>
                    <SelectItem value="nelayan" className="text-[10px] font-black uppercase">PRODUSEN (NELAYAN)</SelectItem>
                    <SelectItem value="umkm" className="text-[10px] font-black uppercase">UMKM PENGOLAH</SelectItem>
                    <SelectItem value="pengepul" className="text-[10px] font-black uppercase">PEMBELI (STAKEHOLDER)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="noHp" className="text-[10px] font-black uppercase tracking-widest text-slate-400">Nomor WhatsApp</Label>
                <Input
                  id="noHp"
                  placeholder="08XXXXXXXXXX"
                  className="h-11 text-xs font-black bg-slate-50 border-slate-200 rounded-none focus:ring-slate-900"
                  value={formData.noHp}
                  onChange={(e) => setFormData({ ...formData, noHp: e.target.value })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Alamat */}
        <Card className="rounded-none border-none shadow-sm overflow-hidden bg-white">
          <CardHeader className="bg-slate-900 py-4 px-6 border-none">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-none bg-white/10 flex items-center justify-center">
                <MapPin className="h-4 w-4 text-emerald-400" />
              </div>
              <div>
                <CardTitle className="text-[10px] font-black uppercase tracking-widest text-white">Geolokasi Operasional</CardTitle>
                <CardDescription className="text-[9px] font-bold uppercase text-slate-400">Domisili Berbasis Wilayah</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="alamat" className="text-[10px] font-black uppercase tracking-widest text-slate-400">Alamat Lengkap</Label>
              <Textarea
                id="alamat"
                placeholder="JALAN, NOMOR RUMAH, RT/RW..."
                className="text-xs font-black uppercase bg-slate-50 border-slate-200 rounded-none min-h-[92px] focus:ring-slate-900"
                value={formData.alamat}
                onChange={(e) => setFormData({ ...formData, alamat: e.target.value })}
              />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="desa" className="text-[10px] font-black uppercase tracking-widest text-slate-400">Desa / Kelurahan</Label>
                <Input
                  id="desa"
                  placeholder="NAMA DESA"
                  className="h-11 text-xs font-black uppercase bg-slate-50 border-slate-200 rounded-none focus:ring-slate-900"
                  value={formData.desa}
                  onChange={(e) => setFormData({ ...formData, desa: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="kecamatan" className="text-[10px] font-black uppercase tracking-widest text-slate-400">Kecamatan</Label>
                <Input
                  id="kecamatan"
                  placeholder="NAMA KECAMATAN"
                  className="h-11 text-xs font-black uppercase bg-slate-50 border-slate-200 rounded-none focus:ring-slate-900"
                  value={formData.kecamatan}
                  onChange={(e) => setFormData({ ...formData, kecamatan: e.target.value })}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Usaha */}
        <Card className="rounded-none border-none shadow-sm overflow-hidden bg-white">
          <CardHeader className="bg-emerald-600 py-4 px-6 border-none">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-none bg-white/10 flex items-center justify-center">
                <Briefcase className="h-4 w-4 text-white" />
              </div>
              <div>
                <CardTitle className="text-[10px] font-black uppercase tracking-widest text-white">Profil Komoditas</CardTitle>
                <CardDescription className="text-[9px] font-bold uppercase text-emerald-100">Kapasitas Produksi & Lahan</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="luasLahan" className="text-[10px] font-black uppercase tracking-widest text-slate-400">Estimasi Luas Lahan (Hektar)</Label>
              <div className="relative">
                <Input
                  id="luasLahan"
                  type="number"
                  step="0.1"
                  placeholder="0.0"
                  className="h-11 text-xs font-black bg-slate-50 border-slate-200 rounded-none pr-12 focus:ring-emerald-500 focus:border-emerald-500"
                  value={formData.luasLahan}
                  onChange={(e) => setFormData({ ...formData, luasLahan: e.target.value })}
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400 uppercase">HA</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="komoditas" className="text-[10px] font-black uppercase tracking-widest text-slate-400">Komoditas Utama</Label>
              <Input
                id="komoditas"
                placeholder="PADI, JAGUNG, KARET, SAWIT..."
                className="h-11 text-xs font-black uppercase bg-slate-50 border-slate-200 rounded-none focus:ring-emerald-500"
                value={formData.komoditas}
                onChange={(e) => setFormData({ ...formData, komoditas: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        {/* Simpanan */}
        <Card className="rounded-none border-none shadow-sm overflow-hidden bg-white">
          <CardHeader className="bg-emerald-600 py-4 px-6 border-none">
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 rounded-none bg-white/10 flex items-center justify-center">
                <Wallet className="h-4 w-4 text-white" />
              </div>
              <div>
                <CardTitle className="text-[10px] font-black uppercase tracking-widest text-white">Kontribusi Permodalan</CardTitle>
                <CardDescription className="text-[9px] font-bold uppercase text-emerald-100">Simpanan Pokok Awal</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6 space-y-5">
            <div className="space-y-2">
              <Label htmlFor="simpananPokok" className="text-[10px] font-black uppercase tracking-widest text-slate-400">Simpanan Pokok (Minimum IDR 500,000)</Label>
              <div className="relative">
                <Input
                  id="simpananPokok"
                  type="number"
                  className="h-11 text-xs font-black bg-slate-50 border-slate-200 rounded-none pl-12 focus:ring-emerald-500 focus:border-emerald-500"
                  value={formData.simpananPokok}
                  onChange={(e) => setFormData({ ...formData, simpananPokok: e.target.value })}
                />
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-black text-slate-400">RP</span>
              </div>
            </div>
            <div className="rounded-none bg-slate-900 p-5 text-white border-l-4 border-emerald-500 shadow-xl">
              <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400 flex items-center gap-2">
                <Database className="h-3 w-3" /> Protokol Koperasi Digital
              </p>
              <ul className="mt-4 space-y-3 text-[9px] font-bold uppercase text-slate-400 leading-none">
                <li className="flex gap-2 items-start"><span className="text-emerald-500">√</span> <span>Simpanan Pokok Merupakan Syarat Mutlak Keanggotaan</span></li>
                <li className="flex gap-2 items-start"><span className="text-emerald-500">√</span> <span>Data Anggota Terenkripsi & Terverifikasi Nasional</span></li>
                <li className="flex gap-2 items-start"><span className="text-emerald-500">√</span> <span>Berhak Atas Sisa Hasil Usaha (SHU) Akhir Tahun</span></li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </form>

      {/* Footer Actions */}
      <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-50 p-6 rounded-none border border-slate-200">
        <div className="flex items-center gap-4">
          <div className="h-10 w-10 rounded-none bg-slate-200 flex items-center justify-center">
            <UserPlus className="h-5 w-5 text-slate-600" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Siap Sinkronisasi Nasional</p>
            <p className="text-[9px] font-bold text-slate-400 uppercase">Pastikan semua data identitas telah sesuai dengan E-KTP fisik.</p>
          </div>
        </div>
        <div className="flex gap-3 w-full sm:w-auto">
          <Button variant="outline" className="flex-1 sm:flex-none h-11 rounded-none text-[10px] font-black uppercase tracking-widest border-slate-300 px-10 bg-white shadow-none" asChild>
            <Link href="/anggota">Batalkan</Link>
          </Button>
          <Button 
            onClick={handleSubmit}
            className="flex-1 sm:flex-none h-11 bg-slate-900 text-white hover:bg-slate-800 rounded-none text-[10px] font-black uppercase tracking-widest px-12 shadow-xl"
          >
            <Save className="mr-2 h-4 w-4" />
            Finalisasi Pendaftaran
          </Button>
        </div>
      </div>
    </div>
  )
}
