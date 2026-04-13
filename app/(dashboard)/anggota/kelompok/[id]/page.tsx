import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  ArrowLeft,
  BarChart3,
  Leaf,
  MapPin,
  Phone,
  Users,
  ShieldCheck,
  TrendingUp,
  Activity,
  UserCheck,
  Building2,
  Calendar,
  Layers,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { getKelompokById } from '@/lib/kelompok-data'

const toTitleCase = (value: string) =>
  value
    .replace(/[_-]+/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase())

export default async function KelompokDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const kelompok = getKelompokById(id)

  if (!kelompok) {
    notFound()
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild className="shrink-0 h-10 w-10 rounded-none bg-white border border-slate-200 shadow-sm hover:bg-slate-50">
            <Link href="/anggota/kelompok">
              <ArrowLeft className="h-5 w-5 text-slate-600" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Badge className="rounded-none border-none bg-slate-900 text-[9px] font-black uppercase tracking-widest text-emerald-500 px-2 py-0.5">
                Profil Kelompok Produksi
              </Badge>
              <Badge className={`rounded-none border-none px-2 py-0.5 text-[9px] font-black uppercase tracking-widest ${
                kelompok.status === 'aktif' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'
              }`}>
                {kelompok.status === 'aktif' ? 'OPERASIONAL AKTIF' : 'DALAM AUDIT'}
              </Badge>
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight uppercase">{kelompok.nama}</h1>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-0.5">
              SENTRA PRODUKSI WILAYAH {kelompok.desa}, {kelompok.kecamatan} • ID: {id.toUpperCase()}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="h-10 rounded-none text-[10px] font-black uppercase tracking-widest text-slate-600 border-slate-200 shadow-none bg-white">
            <ShieldCheck className="h-4 w-4 mr-2 text-emerald-600" />
            Verifikasi Integritas
          </Button>
          <Button size="sm" className="h-10 rounded-none bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest px-6 shadow-none">
            <TrendingUp className="h-4 w-4 mr-2 text-emerald-500" />
            Analisis Produktivitas
          </Button>
        </div>
      </div>

      {/* High-Density KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Anggota', value: kelompok.anggota, sub: 'PERSONEL', icon: Users, color: 'text-slate-900' },
          { label: 'Luas Kelolaan', value: kelompok.luasTotal.toFixed(1), sub: 'HEKTAR (HA)', icon: Leaf, color: 'text-emerald-600' },
          { label: 'Skor Produksi', value: kelompok.produksi, sub: 'PERSENTASE', icon: BarChart3, color: 'text-blue-600' },
          { label: 'Komoditas Utama', value: kelompok.komoditas[0].toUpperCase(), sub: 'VARIAN UTAMA', icon: Layers, color: 'text-amber-600' },
        ].map((item, i) => (
          <Card key={i} className="rounded-none border-none shadow-sm bg-white overflow-hidden">
            <div className={`h-1.5 w-full ${item.color.includes('emerald') ? 'bg-emerald-500' : item.color.includes('blue') ? 'bg-blue-500' : item.color.includes('amber') ? 'bg-amber-500' : 'bg-slate-900'}`} />
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-10 w-10 rounded-none bg-slate-50 flex items-center justify-center border border-slate-100">
                <item.icon className={`h-5 w-5 ${item.color}`} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">{item.label}</p>
                <div className="flex items-baseline gap-1 mt-1.5">
                  <span className={`text-xl font-black ${item.color} leading-none uppercase`}>{item.value}</span>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">{item.sub}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          {/* Main Info Card */}
          <Card className="rounded-none border-none shadow-sm overflow-hidden bg-white">
            <CardHeader className="bg-slate-900 py-4 px-6 border-none">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-none bg-white/10 flex items-center justify-center">
                  <Activity className="h-4 w-4 text-emerald-400" />
                </div>
                <div>
                  <CardTitle className="text-[10px] font-black uppercase tracking-widest text-white">Ringkasan Operasional Kelompok</CardTitle>
                  <CardDescription className="text-[9px] font-bold uppercase text-slate-400 tracking-widest">Informasi Inti Strategis</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="rounded-none border-l-4 border-slate-200 bg-slate-50 p-5 shadow-inner">
                <p className="text-[11px] font-bold uppercase leading-relaxed text-slate-600 tracking-wide">{kelompok.ringkasan}</p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {[
                  { label: 'Ketua Kelompok', value: kelompok.ketua, icon: UserCheck },
                  { label: 'Kontak Lapangan', value: kelompok.kontakLapangan, icon: Phone },
                  { label: 'Lokasi Wilayah', value: `${kelompok.desa}, ${kelompok.kecamatan}`, icon: MapPin },
                  { label: 'Induk Koperasi', value: kelompok.koperasi, icon: Building2 },
                ].map((info, i) => (
                  <div key={i} className="rounded-none border border-slate-100 bg-white p-4 shadow-sm group hover:border-slate-300 transition-colors">
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 mb-2">
                      <info.icon className="h-3 w-3" /> {info.label}
                    </p>
                    <p className="text-xs font-black text-slate-900 uppercase tracking-tight">{info.value}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-3 rounded-none border border-slate-100 bg-slate-50 p-5">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3.5 w-3.5 text-emerald-600" />
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-900">Indikator Kesiapan Produksi</p>
                  </div>
                  <span className="text-xs font-black text-emerald-600 uppercase tracking-widest">{kelompok.produksi}% SIAP</span>
                </div>
                <Progress value={kelompok.produksi} className="h-2 rounded-none bg-slate-200" />
                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest text-right italic">Sinkronisasi Terakhir: {new Date().toLocaleDateString('id-ID')} 09:00 WIB</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Commodities & Team Card */}
          <Card className="rounded-none border-none shadow-sm overflow-hidden bg-white">
            <CardHeader className="bg-emerald-600 py-4 px-6 border-none">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-none bg-white/10 flex items-center justify-center">
                  <Layers className="h-4 w-4 text-white" />
                </div>
                <div>
                  <CardTitle className="text-[10px] font-black uppercase tracking-widest text-white">Komoditas & Tim Inti</CardTitle>
                  <CardDescription className="text-[9px] font-bold uppercase text-emerald-100 tracking-widest">Aset Produksi & Sumber Daya Manusia</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-3">Varian Komoditas Terdaftar</p>
                <div className="flex flex-wrap gap-2">
                  {kelompok.komoditas.map((komoditas) => (
                    <Badge
                      key={komoditas}
                      className="rounded-none border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-[9px] font-black uppercase tracking-widest text-emerald-700 shadow-sm"
                    >
                      {komoditas}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Personel Inti Operasional</p>
                {kelompok.anggotaInti.map((anggota) => (
                  <div key={anggota.nama} className="rounded-none border border-slate-100 bg-white p-4 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                    <div className="absolute left-0 top-0 h-full w-1 bg-emerald-500 transform -translate-x-full group-hover:translate-x-0 transition-transform" />
                    <div className="flex items-center justify-between gap-3 mb-3">
                      <div>
                        <p className="text-xs font-black text-slate-900 uppercase tracking-tight">{anggota.nama}</p>
                        <p className="text-[9px] font-black uppercase tracking-widest text-emerald-600 mt-1">{anggota.peran}</p>
                      </div>
                      <Badge className="rounded-none border-none bg-slate-900 px-2 py-0.5 text-[8px] font-black uppercase tracking-widest text-white">
                        TERVERIFIKASI
                      </Badge>
                    </div>
                    <div className="bg-slate-50 p-3 rounded-none">
                      <p className="text-[9px] font-bold uppercase text-slate-500 leading-tight tracking-wider">{anggota.fokus}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Button variant="outline" className="w-full h-10 rounded-none border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-600 shadow-none bg-white hover:bg-slate-50">
                <Users className="h-3.5 w-3.5 mr-2" />
                Lihat Seluruh Anggota ({kelompok.anggota})
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
