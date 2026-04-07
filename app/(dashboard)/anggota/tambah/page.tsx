'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Save, Camera, Zap } from 'lucide-react'
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
    // Handle form submission
    alert('Data anggota berhasil disimpan!')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild className="shrink-0 h-8 w-8 rounded-none">
          <Link href="/anggota">
            <ArrowLeft className="h-4 w-4 text-slate-600" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-slate-900">Registrasi Manual</h1>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mt-1">
            Input Data Anggota Baru ke Database Nasional
          </p>
        </div>
      </div>

      {/* OCR Suggestion */}
      <Alert className="rounded-none border-none border-l-4 border-emerald-500 bg-slate-900 text-white py-5 shadow-xl">
        <Camera className="h-4 w-4 text-emerald-400" />
        <AlertTitle className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Efisiensi Registrasi: Gunakan Onboarding Digital</AlertTitle>
        <AlertDescription className="flex flex-col sm:flex-row sm:items-center gap-4 mt-2">
          <span className="text-[10px] font-bold uppercase text-slate-400">Daftarkan anggota lebih cepat dengan scan KTP otomatis (OCR) dan verifikasi identitas Dukcapil Nasional.</span>
          <Button size="sm" className="w-fit rounded-none bg-emerald-500 hover:bg-emerald-600 text-white text-[9px] font-black uppercase tracking-widest h-8" asChild>
            <Link href="/anggota/onboarding">
              <Zap className="mr-2 h-3.5 w-3.5" />
              AKTIFKAN OCR
            </Link>
          </Button>
        </AlertDescription>
      </Alert>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Data Pribadi */}
          <Card className="rounded-none border-slate-200 shadow-sm overflow-hidden border-t-4 border-t-slate-900">
            <CardHeader className="bg-slate-50 border-b border-slate-100">
              <CardTitle className="text-[10px] font-black uppercase tracking-widest text-slate-900">Data Pribadi Anggota</CardTitle>
              <CardDescription className="text-[9px] font-bold uppercase text-slate-500">
                IDENTITAS RESMI BERDASARKAN E-KTP
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nik" className="text-[10px] font-black uppercase tracking-widest text-slate-400">Nomor Induk Kependudukan (NIK)</Label>
                <Input
                  id="nik"
                  placeholder="16 DIGIT NIK"
                  className="h-10 text-xs font-black bg-slate-50/50 border-slate-200 rounded-none font-mono tracking-widest"
                  value={formData.nik}
                  onChange={(e) =>
                    setFormData({ ...formData, nik: e.target.value })
                  }
                  maxLength={16}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nama" className="text-[10px] font-black uppercase tracking-widest text-slate-400">Nama Lengkap (Sesuai KTP)</Label>
                <Input
                  id="nama"
                  placeholder="NAMA LENGKAP"
                  className="h-10 text-xs font-black uppercase bg-slate-50/50 border-slate-200 rounded-none"
                  value={formData.nama}
                  onChange={(e) =>
                    setFormData({ ...formData, nama: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tipe" className="text-[10px] font-black uppercase tracking-widest text-slate-400">Tipe Keanggotaan</Label>
                <Select
                  value={formData.tipe}
                  onValueChange={(value) =>
                    setFormData({ ...formData, tipe: value })
                  }
                >
                  <SelectTrigger className="h-10 text-xs font-black uppercase bg-slate-50/50 border-slate-200 rounded-none">
                    <SelectValue placeholder="PILIH TIPE" />
                  </SelectTrigger>
                  <SelectContent className="rounded-none border-slate-900">
                    <SelectItem value="petani" className="text-[10px] font-black uppercase">PETANI</SelectItem>
                    <SelectItem value="nelayan" className="text-[10px] font-black uppercase">NELAYAN</SelectItem>
                    <SelectItem value="umkm" className="text-[10px] font-black uppercase">UMKM</SelectItem>
                    <SelectItem value="pengepul" className="text-[10px] font-black uppercase">PENGEPUL</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="noHp" className="text-[10px] font-black uppercase tracking-widest text-slate-400">Nomor Telepon / WhatsApp</Label>
                <Input
                  id="noHp"
                  placeholder="08XXXXXXXXXX"
                  className="h-10 text-xs font-black bg-slate-50/50 border-slate-200 rounded-none"
                  value={formData.noHp}
                  onChange={(e) =>
                    setFormData({ ...formData, noHp: e.target.value })
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Alamat */}
          <Card className="rounded-none border-slate-200 shadow-sm overflow-hidden border-t-4 border-t-slate-900">
            <CardHeader className="bg-slate-50 border-b border-slate-100">
              <CardTitle className="text-[10px] font-black uppercase tracking-widest text-slate-900">Geolokasi & Alamat</CardTitle>
              <CardDescription className="text-[9px] font-bold uppercase text-slate-500">
                DOMISILI OPERASIONAL ANGGOTA
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="alamat" className="text-[10px] font-black uppercase tracking-widest text-slate-400">Alamat Lengkap (Domisili)</Label>
                <Textarea
                  id="alamat"
                  placeholder="JALAN, NO, RT/RW"
                  className="text-xs font-black uppercase bg-slate-50/50 border-slate-200 rounded-none min-h-[80px]"
                  value={formData.alamat}
                  onChange={(e) =>
                    setFormData({ ...formData, alamat: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="desa" className="text-[10px] font-black uppercase tracking-widest text-slate-400">Desa / Kelurahan</Label>
                  <Input
                    id="desa"
                    placeholder="NAMA DESA"
                    className="h-10 text-xs font-black uppercase bg-slate-50/50 border-slate-200 rounded-none"
                    value={formData.desa}
                    onChange={(e) =>
                      setFormData({ ...formData, desa: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="kecamatan" className="text-[10px] font-black uppercase tracking-widest text-slate-400">Kecamatan</Label>
                  <Input
                    id="kecamatan"
                    placeholder="NAMA KECAMATAN"
                    className="h-10 text-xs font-black uppercase bg-slate-50/50 border-slate-200 rounded-none"
                    value={formData.kecamatan}
                    onChange={(e) =>
                      setFormData({ ...formData, kecamatan: e.target.value })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Usaha */}
          <Card className="rounded-none border-slate-200 shadow-sm overflow-hidden border-t-4 border-t-emerald-500">
            <CardHeader className="bg-slate-50 border-b border-slate-100">
              <CardTitle className="text-[10px] font-black uppercase tracking-widest text-slate-900">Profil Komoditas</CardTitle>
              <CardDescription className="text-[9px] font-bold uppercase text-slate-500">
                KAPASITAS PRODUKSI & LUAS LAHAN
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="luasLahan" className="text-[10px] font-black uppercase tracking-widest text-slate-400">Estimasi Luas Lahan (HA)</Label>
                <Input
                  id="luasLahan"
                  type="number"
                  step="0.1"
                  placeholder="0.0"
                  className="h-10 text-xs font-black bg-slate-50/50 border-slate-200 rounded-none"
                  value={formData.luasLahan}
                  onChange={(e) =>
                    setFormData({ ...formData, luasLahan: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="komoditas" className="text-[10px] font-black uppercase tracking-widest text-slate-400">Komoditas Utama</Label>
                <Input
                  id="komoditas"
                  placeholder="PADI, JAGUNG, CABAI..."
                  className="h-10 text-xs font-black uppercase bg-slate-50/50 border-slate-200 rounded-none"
                  value={formData.komoditas}
                  onChange={(e) =>
                    setFormData({ ...formData, komoditas: e.target.value })
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Simpanan */}
          <Card className="rounded-none border-slate-200 shadow-sm overflow-hidden border-t-4 border-t-emerald-500">
            <CardHeader className="bg-slate-50 border-b border-slate-100">
              <CardTitle className="text-[10px] font-black uppercase tracking-widest text-slate-900">Kontribusi Awal</CardTitle>
              <CardDescription className="text-[9px] font-bold uppercase text-slate-500">
                PERMODALAN AWAL ANGGOTA
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="simpananPokok" className="text-[10px] font-black uppercase tracking-widest text-slate-400">Simpanan Pokok (Min RP 500.000)</Label>
                <Input
                  id="simpananPokok"
                  type="number"
                  className="h-10 text-xs font-black bg-slate-50/50 border-slate-200 rounded-none"
                  value={formData.simpananPokok}
                  onChange={(e) =>
                    setFormData({ ...formData, simpananPokok: e.target.value })
                  }
                />
              </div>
              <div className="rounded-none bg-slate-900 p-5 text-white shadow-xl">
                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Protokol Koperasi</p>
                <ul className="mt-3 space-y-2 text-[10px] font-bold uppercase text-slate-400 leading-tight">
                  <li className="flex gap-2"><span>•</span> <span>Simpanan Pokok Bersifat Wajib Sekali Daftar</span></li>
                  <li className="flex gap-2"><span>•</span> <span>Anggota Berhak atas Pembagian SHU Tahunan</span></li>
                  <li className="flex gap-2"><span>•</span> <span>Akses Penuh ke Ekosistem Pasar & Gudang</span></li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Submit Button */}
        <div className="mt-8 flex justify-end gap-4 border-t border-slate-100 pt-6">
          <Button variant="outline" className="h-10 rounded-none text-[10px] font-black uppercase tracking-widest border-slate-300 px-10" asChild>
            <Link href="/anggota">Batal</Link>
          </Button>
          <Button type="submit" className="h-10 bg-slate-900 text-white hover:bg-slate-800 rounded-none text-[10px] font-black uppercase tracking-widest px-12 shadow-xl">
            <Save className="mr-2 h-4 w-4" />
            Simpan ke Database
          </Button>
        </div>
      </form>
    </div>
  )
}
