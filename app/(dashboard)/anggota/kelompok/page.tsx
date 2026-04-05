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
      groups: filteredKelompok.length,
      members: filteredKelompok.reduce((acc, k) => acc + k.anggota, 0),
      land: filteredKelompok.reduce((acc, k) => acc + k.luasTotal, 0),
      avgProd: filteredKelompok.length ? Math.round(filteredKelompok.reduce((acc, k) => acc + k.produksi, 0) / filteredKelompok.length) : 0
    }
  }, [filteredKelompok])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900 uppercase">Kelompok Tani Nasional</h1>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
            Supervisi dan Monitoring Kelompok Produsen Lintas Wilayah
          </p>
        </div>
        <Button size="sm" className="h-10 bg-slate-900 text-white hover:bg-slate-800 text-[10px] font-black uppercase tracking-widest px-6 shadow-lg shadow-slate-200">
          <Plus className="mr-2 h-4 w-4" />
          Registrasi Kelompok
        </Button>
      </div>

      {/* Kementerian Filter Bar */}
      {isKementerian && <KementerianFilterBar filters={filters} setFilters={setFilters} search={search} setSearch={setSearch} />}

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: 'Total Kelompok', value: totals.groups, sub: `${filteredKelompok.filter(k => k.status === 'aktif').length} Unit Aktif`, icon: Building2, tone: 'slate' },
          { label: 'Total Anggota', value: totals.members.toLocaleString(), sub: 'Produsen Terdaftar', icon: Users, tone: 'emerald' },
          { label: 'Luas Lahan (Ha)', value: totals.land.toFixed(1), sub: 'Area Produktif', icon: Target, tone: 'emerald' },
          { label: 'Efisiensi Produksi', value: `${totals.avgProd}%`, sub: 'Rata-rata Output', icon: BarChart3, tone: 'emerald' },
        ].map((stat, i) => (
          <Card key={i} className="border-none shadow-[0_4px_12px_-4px_rgba(0,0,0,0.05)] overflow-hidden">
            <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <stat.icon className="h-3.5 w-3.5 text-slate-400" />
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="text-2xl font-black text-slate-900 tracking-tighter">{stat.value}</p>
              <p className="text-[10px] font-bold text-slate-500 uppercase mt-1 tracking-widest">{stat.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Kelompok List Grid */}
      <div className="grid gap-4 lg:grid-cols-2">
        {filteredKelompok.length === 0 ? (
          <div className="lg:col-span-2 py-20 text-center bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tidak ada kelompok ditemukan dalam scope ini</p>
          </div>
        ) : (
          filteredKelompok.map((kelompok) => (
            <Card key={kelompok.id} className="border-none shadow-[0_4px_12px_-4px_rgba(0,0,0,0.05)] overflow-hidden group hover:shadow-lg transition-all">
              <CardHeader className="p-4 border-b border-slate-50 bg-slate-50/50">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight group-hover:text-emerald-600 transition-colors">
                        {kelompok.nama}
                      </h3>
                      <Badge className={`text-[8px] font-black uppercase border-none px-1.5 h-4 ${kelompok.status === 'aktif' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-500'}`}>
                        {kelompok.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">KETUA:</p>
                      <p className="text-[9px] font-black text-slate-900 uppercase tracking-tight">{kelompok.ketua}</p>
                    </div>
                  </div>
                  <Link href={`/anggota/kelompok/${kelompok.id}`}>
                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-white hover:text-emerald-600">
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
                      <span className="text-[10px] font-black uppercase tracking-tight">{kelompok.desa} • {kelompok.koperasi}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <Users className="h-3.5 w-3.5 text-slate-400" />
                      <span className="text-[10px] font-black uppercase tracking-tight">{kelompok.anggota} ANGGOTA</span>
                    </div>
                    {kelompok.luasTotal > 0 && (
                      <div className="flex items-center gap-2 text-slate-600">
                        <Leaf className="h-3.5 w-3.5 text-slate-400" />
                        <span className="text-[10px] font-black uppercase tracking-tight">{kelompok.luasTotal} HA LAHAN</span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5">KOMODITAS UTAMA</p>
                      <div className="flex flex-wrap gap-1">
                        {kelompok.komoditas.map((k, i) => (
                          <Badge key={i} variant="outline" className="text-[8px] font-black uppercase border-slate-200 text-slate-600 bg-white">
                            {k}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-tight mb-1.5">
                        <span className="text-slate-400">OUTPUT PRODUKSI</span>
                        <span className="text-emerald-600">{kelompok.produksi}%</span>
                      </div>
                      <Progress value={kelompok.produksi} className="h-1 bg-slate-100" />
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
