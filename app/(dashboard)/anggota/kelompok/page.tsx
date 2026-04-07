'use client'

import { useState, useMemo } from 'react'
import { Users, MapPin, Leaf, ChevronRight, Plus, TrendingUp, Search, Building2, BarChart3, Target } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { useAuth } from '@/lib/auth/use-auth'
import { KementerianFilterBar } from '@/components/dashboard/kementerian-filter-bar'
import { ScopeFilters } from '@/lib/kementerian-dashboard-data'

const initialKelompokData = [
  {
    id: 'KT001',
    nama: 'Kelompok Tani Makmur Jaya',
    ketua: 'Pak Slamet Widodo',
    desa: 'SUKAMAJU',
    koperasi: 'KOP. MAJU JAYA',
    kecamatan: 'Cianjur',
    anggota: 25,
    luasTotal: 45.5,
    komoditas: ['Padi', 'Jagung', 'Kedelai'],
    produksi: 85,
    status: 'aktif',
  },
  {
    id: 'KT002',
    nama: 'Kelompok Tani Sumber Rezeki',
    ketua: 'Pak Hendra Wijaya',
    desa: 'CIBODAS',
    koperasi: 'KOP. MANDIRI',
    kecamatan: 'Lembang',
    anggota: 18,
    luasTotal: 32.0,
    komoditas: ['Kentang', 'Wortel', 'Kubis', 'Brokoli'],
    produksi: 92,
    status: 'aktif',
  },
  {
    id: 'KT003',
    nama: 'Kelompok Nelayan Bahari',
    ketua: 'Pak Ahmad Sudirman',
    desa: 'PANTAI INDAH',
    koperasi: 'KOP. BAHARI',
    kecamatan: 'Palabuhanratu',
    anggota: 15,
    luasTotal: 0,
    komoditas: ['Ikan Tongkol', 'Udang', 'Cumi', 'Kepiting'],
    produksi: 78,
    status: 'aktif',
  },
  {
    id: 'KT004',
    nama: 'Kelompok Tani Berkah',
    ketua: 'Bu Aminah',
    desa: 'KARAWANG',
    koperasi: 'KOP. MAJU JAYA',
    kecamatan: 'Karawang',
    anggota: 12,
    luasTotal: 22.0,
    komoditas: ['Padi'],
    produksi: 65,
    status: 'nonaktif',
  },
]

export default function KelompokTaniPage() {
  const { user } = useAuth()
  const isKementerian = user?.role === 'kementerian'

  const [filters, setFilters] = useState<ScopeFilters>({
    provinceId: 'all',
    regionId: 'all',
    villageId: 'all',
    cooperativeId: 'all',
    commodityId: 'all',
  })

  const [search, setSearch] = useState('')
  const scaleFactor = filters.provinceId === 'all' ? 1.0 : filters.regionId === 'all' ? 0.4 : filters.villageId === 'all' ? 0.15 : 0.05

  const filteredKelompok = useMemo(() => {
    return initialKelompokData.filter(k => {
      const matchesSearch = k.nama.toLowerCase().includes(search.toLowerCase()) || k.ketua.toLowerCase().includes(search.toLowerCase())
      if (!isKementerian) return matchesSearch

      const matchesVillage = filters.villageId === 'all' || k.desa.toUpperCase().includes(filters.villageId.split('-').pop() || '')
      const matchesKop = filters.cooperativeId === 'all' || k.koperasi.toUpperCase().includes(filters.cooperativeId.split('-').pop() || '')
      const matchesCommodity = filters.commodityId === 'all' || k.komoditas.some(c => c.toLowerCase().includes(filters.commodityId.toLowerCase()))

      return matchesSearch && matchesVillage && matchesKop && matchesCommodity
    })
  }, [search, filters, isKementerian])

  const totals = useMemo(() => {
    return {
      groups: Math.round(filteredKelompok.length * scaleFactor),
      members: Math.round(filteredKelompok.reduce((acc, k) => acc + k.anggota, 0) * scaleFactor),
      land: filteredKelompok.reduce((acc, k) => acc + k.luasTotal, 0) * scaleFactor,
      avgProd: filteredKelompok.length ? Math.round(filteredKelompok.reduce((acc, k) => acc + k.produksi, 0) / filteredKelompok.length) : 0
    }
  }, [filteredKelompok, scaleFactor])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Badge className="rounded-none border-none bg-emerald-500 text-white font-black uppercase tracking-widest text-[10px] mb-2 px-2 py-0.5">Database Kelompok Nasional</Badge>
          <h1 className="text-3xl font-black uppercase tracking-tight text-slate-900">Kelompok Produsen</h1>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mt-1">
            Monitoring Kapasitas Organisasi Produksi Lintas Wilayah
          </p>
        </div>
        <Button size="sm" className="h-10 bg-slate-900 text-white hover:bg-slate-800 text-[10px] font-black uppercase tracking-widest rounded-none px-6 shadow-xl">
          <Plus className="mr-2 h-4 w-4" />
          Registrasi Baru
        </Button>
      </div>

      {/* Kementerian Filter Bar */}
      {isKementerian && <KementerianFilterBar filters={filters} setFilters={setFilters} search={search} setSearch={setSearch} />}

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: 'TOTAL KELOMPOK', value: totals.groups.toLocaleString('id-ID'), sub: 'UNIT TERVERIFIKASI', icon: Building2, tone: 'slate' },
          { label: 'TOTAL ANGGOTA', value: totals.members.toLocaleString('id-ID'), sub: 'PRODUSEN AKTIF', icon: Users, tone: 'emerald' },
          { label: 'AKUMULASI LAHAN', value: `${totals.land.toLocaleString('id-ID', { maximumFractionDigits: 1 })} HA`, sub: 'AREA PRODUKTIF', icon: Target, tone: 'emerald' },
          { label: 'EFISIENSI OUTPUT', value: `${totals.avgProd}%`, sub: 'PRODUKTIVITAS AGREGAT', icon: BarChart3, tone: 'emerald' },
        ].map((stat, i) => (
          <Card key={i} className="rounded-none border-none bg-white shadow-sm overflow-hidden group border-t-4 border-t-slate-900">
            <div className={`absolute top-0 left-0 h-1 w-full ${stat.tone === 'emerald' ? 'bg-emerald-500' : 'bg-slate-900'}`} />
            <CardHeader className="p-4 pb-2">
              <div className="flex justify-between items-start">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{stat.label}</p>
                <stat.icon className="h-4 w-4 text-slate-400 group-hover:text-slate-900 transition-colors" />
              </div>
              <CardTitle className="text-3xl font-black text-slate-900 mt-1">{stat.value}</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="text-[10px] font-bold text-slate-500 mt-1 uppercase tracking-tighter">{stat.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Kelompok List Grid */}
      <div className="grid gap-4 lg:grid-cols-2">
        {filteredKelompok.length === 0 ? (
          <div className="lg:col-span-2 py-20 text-center bg-slate-50 rounded-none border-2 border-dashed border-slate-200">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Tidak ada kelompok dalam scope monitoring ini</p>
          </div>
        ) : (
          filteredKelompok.map((kelompok) => (
            <Card key={kelompok.id} className="rounded-none border-slate-200 shadow-sm overflow-hidden group hover:border-slate-900 transition-all">
              <CardHeader className="p-4 border-b border-slate-50 bg-slate-50/50">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-black uppercase tracking-tight text-slate-900 group-hover:text-emerald-600 transition-colors">
                        {kelompok.nama}
                      </h3>
                      <Badge className={`rounded-none text-[9px] font-black uppercase tracking-widest border-none px-1.5 h-4 ${kelompok.status === 'aktif' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-500'}`}>
                        {kelompok.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">KETUA:</p>
                      <p className="text-[10px] font-black uppercase text-slate-900">{kelompok.ketua}</p>
                    </div>
                  </div>
                  <Link href={`/anggota/kelompok/${kelompok.id}`}>
                    <Button variant="ghost" size="icon" className="h-8 w-8 rounded-none hover:bg-slate-900 hover:text-white">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-slate-600">
                      <MapPin className="h-3.5 w-3.5 text-slate-400" />
                      <span className="text-[10px] font-black uppercase tracking-tighter">{kelompok.desa} · {kelompok.koperasi}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <Users className="h-3.5 w-3.5 text-slate-400" />
                      <span className="text-[10px] font-black uppercase tracking-tighter">{Math.round(kelompok.anggota * scaleFactor)} ANGGOTA</span>
                    </div>
                    {kelompok.luasTotal > 0 && (
                      <div className="flex items-center gap-2 text-slate-600">
                        <Leaf className="h-3.5 w-3.5 text-slate-400" />
                        <span className="text-[10px] font-black uppercase tracking-tighter">{(kelompok.luasTotal * scaleFactor).toFixed(1)} HA LAHAN</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">KOMODITAS</p>
                      <div className="flex flex-wrap gap-1">
                        {kelompok.komoditas.map((k, i) => (
                          <Badge key={i} variant="outline" className="rounded-none text-[9px] font-black uppercase tracking-widest border-slate-200 text-slate-600 bg-white">
                            {k}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest mb-1.5">
                        <span className="text-slate-400">OUTPUT</span>
                        <span className="text-emerald-600">{kelompok.produksi}%</span>
                      </div>
                      <Progress value={kelompok.produksi} className="h-1 bg-slate-100 rounded-none" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
