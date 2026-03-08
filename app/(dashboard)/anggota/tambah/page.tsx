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
          <h1 className="text-2xl font-bold tracking-tight">Tambah Anggota Baru</h1>
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
          <Card>
            <CardHeader>
              <CardTitle>Data Pribadi</CardTitle>
              <CardDescription>
                Informasi identitas anggota
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nik">NIK</Label>
                <Input
                  id="nik"
                  placeholder="Masukkan 16 digit NIK"
                  value={formData.nik}
                  onChange={(e) =>
                    setFormData({ ...formData, nik: e.target.value })
                  }
                  maxLength={16}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nama">Nama Lengkap</Label>
                <Input
                  id="nama"
                  placeholder="Masukkan nama lengkap"
                  value={formData.nama}
                  onChange={(e) =>
                    setFormData({ ...formData, nama: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tipe">Tipe Anggota</Label>
                <Select
                  value={formData.tipe}
                  onValueChange={(value) =>
                    setFormData({ ...formData, tipe: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih tipe anggota" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="petani">Petani</SelectItem>
                    <SelectItem value="nelayan">Nelayan</SelectItem>
                    <SelectItem value="umkm">UMKM</SelectItem>
                    <SelectItem value="pengepul">Pengepul</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="noHp">Nomor HP</Label>
                <Input
                  id="noHp"
                  placeholder="08xxxxxxxxxx"
                  value={formData.noHp}
                  onChange={(e) =>
                    setFormData({ ...formData, noHp: e.target.value })
                  }
                />
              </div>
            </CardContent>
          </Card>

          {/* Alamat */}
          <Card>
            <CardHeader>
              <CardTitle>Alamat</CardTitle>
              <CardDescription>
                Lokasi tempat tinggal anggota
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="alamat">Alamat Lengkap</Label>
                <Textarea
                  id="alamat"
                  placeholder="Jalan, nomor rumah, RT/RW"
                  value={formData.alamat}
                  onChange={(e) =>
                    setFormData({ ...formData, alamat: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="desa">Desa/Kelurahan</Label>
                  <Input
                    id="desa"
                    placeholder="Nama desa"
                    value={formData.desa}
                    onChange={(e) =>
                      setFormData({ ...formData, desa: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="kecamatan">Kecamatan</Label>
                  <Input
                    id="kecamatan"
                    placeholder="Nama kecamatan"
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
          <Card>
            <CardHeader>
              <CardTitle>Data Usaha</CardTitle>
              <CardDescription>
                Informasi usaha/lahan anggota
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="luasLahan">Luas Lahan (Hektar)</Label>
                <Input
                  id="luasLahan"
                  type="number"
                  step="0.1"
                  placeholder="0.0"
                  value={formData.luasLahan}
                  onChange={(e) =>
                    setFormData({ ...formData, luasLahan: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="komoditas">Komoditas Utama</Label>
                <Input
                  id="komoditas"
                  placeholder="Pisahkan dengan koma (Padi, Jagung)"
                  value={formData.komoditas}
                  onChange={(e) =>
                    setFormData({ ...formData, komoditas: e.target.value })
                  }
                />
                <p className="text-xs text-muted-foreground">
                  Contoh: Padi, Jagung, Cabai
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Simpanan */}
          <Card>
            <CardHeader>
              <CardTitle>Simpanan Awal</CardTitle>
              <CardDescription>
                Setoran simpanan saat pendaftaran
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="simpananPokok">Simpanan Pokok</Label>
                <Input
                  id="simpananPokok"
                  type="number"
                  value={formData.simpananPokok}
                  onChange={(e) =>
                    setFormData({ ...formData, simpananPokok: e.target.value })
                  }
                />
                <p className="text-xs text-muted-foreground">
                  Minimal Rp 500.000 (wajib)
                </p>
              </div>
              <div className="rounded-lg bg-muted p-4">
                <p className="text-sm font-medium">Informasi</p>
                <ul className="mt-2 space-y-1 text-sm text-muted-foreground">
                  <li>- Simpanan pokok dibayar sekali saat mendaftar</li>
                  <li>- Simpanan wajib dibayar setiap bulan</li>
                  <li>- Anggota berhak mendapat SHU tahunan</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Submit Button */}
        <div className="mt-6 flex justify-end gap-4">
          <Button variant="outline" asChild>
            <Link href="/anggota">Batal</Link>
          </Button>
          <Button type="submit">
            <Save className="mr-2 h-4 w-4" />
            Simpan Anggota
          </Button>
        </div>
      </form>
    </div>
  )
}
