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
        <Button variant="ghost" size="icon" asChild>
          <Link href="/anggota">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold ">Tambah Anggota Baru</h1>
          <p className="text-muted-foreground">
            Daftarkan anggota baru ke koperasi
          </p>
        </div>
      </div>

      {/* OCR Suggestion */}
      <Alert className="border-primary/50 bg-primary/5">
        <Camera className="h-4 w-4 text-primary" />
        <AlertTitle className="text-primary">Gunakan Onboarding KTP dengan OCR</AlertTitle>
        <AlertDescription className="flex flex-col sm:flex-row sm:items-center gap-2">
          <span>Daftarkan anggota lebih cepat dengan scan KTP otomatis dan verifikasi Dukcapil.</span>
          <Button size="sm" className="w-fit" asChild>
            <Link href="/anggota/onboarding">
              <Zap className="mr-2 h-4 w-4" />
              Gunakan OCR
            </Link>
          </Button>
        </AlertDescription>
      </Alert>

      <form onSubmit={handleSubmit}>
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Data Pribadi */}
          <Card className="border-none bg-white shadow-sm overflow-hidden">
            <div className="h-1 w-full bg-slate-900" />
            <CardHeader>
              <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-900">DATA PRIBADI ANGGOTA</CardTitle>
              <CardDescription className="text-xs font-bold text-slate-500">
                IDENTITAS RESMI BERDASARKAN E-KTP
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nik" className="text-[10px] font-black uppercase tracking-widest text-slate-400">NOMOR INDUK KEPENDUDUKAN (NIK)</Label>
                <Input
                  id="nik"
                  placeholder="16 DIGIT NIK"
                  className="h-10 text-xs font-semibold bg-slate-50 border-slate-100"
                  value={formData.nik}
                  onChange={(e) =>
                    setFormData({ ...formData, nik: e.target.value })
                  }
                  maxLength={16}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nama" className="text-[10px] font-black uppercase tracking-widest text-slate-400">NAMA LENGKAP</Label>
                <Input
                  id="nama"
                  placeholder="NAMA SESUAI IDENTITAS"
                  className="h-10 text-xs font-semibold bg-slate-50 border-slate-100"
                  value={formData.nama}
                  onChange={(e) =>
                    setFormData({ ...formData, nama: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tipe" className="text-[10px] font-black uppercase tracking-widest text-slate-400">TIPE KEANGGOTAAN</Label>
                <Select
                  value={formData.tipe}
                  onValueChange={(value) =>
                    setFormData({ ...formData, tipe: value })
                  }
                >
                  <SelectTrigger className="h-10 text-xs font-semibold bg-slate-50 border-slate-100">
                    <SelectValue placeholder="PILIH TIPE" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="petani">PETANI</SelectItem>
                    <SelectItem value="nelayan">NELAYAN</SelectItem>
                    <SelectItem value="umkm">UMKM</SelectItem>
                    <SelectItem value="pengepul">PENGEPUL</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="noHp" className="text-[10px] font-black uppercase tracking-widest text-slate-400">NOMOR TELEPON / WA</Label>
                <Input
                  id="noHp"
                  placeholder="08XXXXXXXXXX"
                  className="h-10 text-xs font-semibold bg-slate-50 border-slate-100"
                  value={formData.noHp}
                  onChange={(e) =>
                    setFormData({ ...formData, noHp: e.target.value })
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Alamat */}
          <Card className="border-none bg-white shadow-sm overflow-hidden">
            <div className="h-1 w-full bg-slate-900" />
            <CardHeader>
              <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-900">GEOLOKASI & ALAMAT</CardTitle>
              <CardDescription className="text-xs font-bold text-slate-500">
                DOMISILI OPERASIONAL ANGGOTA
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="alamat" className="text-[10px] font-black uppercase tracking-widest text-slate-400">ALAMAT LENGKAP</Label>
                <Textarea
                  id="alamat"
                  placeholder="JALAN, NO, RT/RW"
                  className="text-xs font-semibold bg-slate-50 border-slate-100 min-h-[80px]"
                  value={formData.alamat}
                  onChange={(e) =>
                    setFormData({ ...formData, alamat: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="desa" className="text-[10px] font-black uppercase tracking-widest text-slate-400">DESA / KELURAHAN</Label>
                  <Input
                    id="desa"
                    placeholder="NAMA DESA"
                    className="h-10 text-xs font-semibold bg-slate-50 border-slate-100"
                    value={formData.desa}
                    onChange={(e) =>
                      setFormData({ ...formData, desa: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="kecamatan" className="text-[10px] font-black uppercase tracking-widest text-slate-400">KECAMATAN</Label>
                  <Input
                    id="kecamatan"
                    placeholder="NAMA KECAMATAN"
                    className="h-10 text-xs font-semibold bg-slate-50 border-slate-100"
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
          <Card className="border-none bg-white shadow-sm overflow-hidden">
            <div className="h-1 w-full bg-emerald-500" />
            <CardHeader>
              <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-900">PROFIL KOMODITAS</CardTitle>
              <CardDescription className="text-xs font-bold text-slate-500">
                KAPASITAS PRODUKSI & LUAS LAHAN
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="luasLahan" className="text-[10px] font-black uppercase tracking-widest text-slate-400">ESTIMASI LUAS LAHAN (HA)</Label>
                <Input
                  id="luasLahan"
                  type="number"
                  step="0.1"
                  placeholder="0.0"
                  className="h-10 text-xs font-semibold bg-slate-50 border-slate-100"
                  value={formData.luasLahan}
                  onChange={(e) =>
                    setFormData({ ...formData, luasLahan: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="komoditas" className="text-[10px] font-black uppercase tracking-widest text-slate-400">KOMODITAS UTAMA</Label>
                <Input
                  id="komoditas"
                  placeholder="PADI, JAGUNG, CABAI"
                  className="h-10 text-xs font-semibold bg-slate-50 border-slate-100"
                  value={formData.komoditas}
                  onChange={(e) =>
                    setFormData({ ...formData, komoditas: e.target.value })
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Simpanan */}
          <Card className="border-none bg-white shadow-sm overflow-hidden">
            <div className="h-1 w-full bg-emerald-500" />
            <CardHeader>
              <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-900">KONTRIBUSI AWAL</CardTitle>
              <CardDescription className="text-xs font-bold text-slate-500">
                PERMODALAN AWAL ANGGOTA
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="simpananPokok" className="text-[10px] font-black uppercase tracking-widest text-slate-400">SIMPANAN POKOK (MIN RP 500.000)</Label>
                <Input
                  id="simpananPokok"
                  type="number"
                  className="h-10 text-xs font-semibold bg-slate-50 border-slate-100"
                  value={formData.simpananPokok}
                  onChange={(e) =>
                    setFormData({ ...formData, simpananPokok: e.target.value })
                  }
                />
              </div>
              <div className="rounded-xl bg-slate-900 p-4 text-white">
                <p className="text-[10px] font-black uppercase tracking-widest text-emerald-400">REGULASI KOPERASI</p>
                <ul className="mt-2 space-y-1 text-[10px] font-bold text-slate-400 leading-tight">
                  <li>• SIMPANAN POKOK BERSIFAT WAJIB SEKALI DAFTAR</li>
                  <li>• ANGGOTA BERHAK ATAS PEMBAGIAN SHU TAHUNAN</li>
                  <li>• AKSES PENUH KE EKOSISTEM PASAR & GUDANG</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Submit Button */}
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" className="h-10 text-xs font-semibold border-slate-200" asChild>
            <Link href="/anggota">BATAL</Link>
          </Button>
          <Button type="submit" className="h-10 bg-slate-900 text-white hover:bg-slate-800 text-xs font-semibold px-8">
            <Save className="mr-2 h-4 w-4" />
            SIMPAN DATABASE
          </Button>
        </div>
      </form>
    </div>
  )
}
