'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import {
  BarChart3,
  Building2,
  ChevronRight,
  Leaf,
  MapPin,
  Plus,
  Target,
  Users,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { useAuth } from '@/lib/auth/use-auth'
import { KementerianFilterBar } from '@/components/dashboard/kementerian-filter-bar'
import type { ScopeFilters } from '@/lib/kementerian-dashboard-data'
import { kelompokData } from '@/lib/kelompok-data'

const toTitleCase = (value: string) =>
  value
    .replace(/[_-]+/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase())

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

  const scaleFactor =
    filters.provinceId === 'all' ? 1 : filters.regionId === 'all' ? 0.4 : filters.villageId === 'all' ? 0.15 : 0.05

  const filteredKelompok = useMemo(() => {
    return kelompokData.filter((kelompok) => {
      const matchesSearch =
        kelompok.nama.toLowerCase().includes(search.toLowerCase()) ||
        kelompok.ketua.toLowerCase().includes(search.toLowerCase())

      if (!isKementerian) return matchesSearch

      const matchesVillage =
        filters.villageId === 'all' ||
        kelompok.desa.toUpperCase().includes(filters.villageId.split('-').pop() || '')
      const matchesKop =
        filters.cooperativeId === 'all' ||
        kelompok.koperasi.toUpperCase().includes(filters.cooperativeId.split('-').pop() || '')
      const matchesCommodity =
        filters.commodityId === 'all' ||
        kelompok.komoditas.some((commodity) => commodity.toLowerCase().includes(filters.commodityId.toLowerCase()))

      return matchesSearch && matchesVillage && matchesKop && matchesCommodity
    })
  }, [search, filters, isKementerian])

  const totals = useMemo(() => {
    return {
      groups: Math.round(filteredKelompok.length * scaleFactor),
      members: Math.round(filteredKelompok.reduce((acc, kelompok) => acc + kelompok.anggota, 0) * scaleFactor),
      land: filteredKelompok.reduce((acc, kelompok) => acc + kelompok.luasTotal, 0) * scaleFactor,
      avgProd: filteredKelompok.length
        ? Math.round(filteredKelompok.reduce((acc, kelompok) => acc + kelompok.produksi, 0) / filteredKelompok.length)
        : 0,
    }
  }, [filteredKelompok, scaleFactor])

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Badge className="mb-2 rounded-none border-none bg-emerald-500 px-2 py-0.5 text-[10px] font-black uppercase tracking-widest text-white shadow-sm">
            Database Kelompok Produsen
          </Badge>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Kelompok Produsen Nasional</h1>
          <p className="mt-1 text-sm font-bold text-slate-500 uppercase tracking-wide">
            Monitoring Kapasitas Organisasi Produksi Lintas Wilayah
          </p>
        </div>
        <Button size="sm" className="h-10 rounded-none bg-slate-900 px-6 text-[10px] font-black uppercase tracking-widest text-white shadow-xl hover:bg-slate-800 transition-all">
          <Plus className="mr-2 h-4 w-4" />
          Registrasi Kelompok Baru
        </Button>
      </div>

      {isKementerian && (
        <KementerianFilterBar
          filters={filters}
          setFilters={setFilters}
          search={search}
          setSearch={setSearch}
        />
      )}

      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: 'Total Kelompok', value: totals.groups.toLocaleString('id-ID'), sub: 'Unit Terverifikasi Sistem', icon: Building2, tone: 'slate' },
          { label: 'Total Anggota', value: totals.members.toLocaleString('id-ID'), sub: 'Produsen Aktif Terdata', icon: Users, tone: 'emerald' },
          { label: 'Akumulasi Lahan', value: `${totals.land.toLocaleString('id-ID', { maximumFractionDigits: 1 })} HA`, sub: 'Area Produksi Efektif', icon: Target, tone: 'emerald' },
          { label: 'Efisiensi Output', value: `${totals.avgProd}%`, sub: 'Produktivitas Agregat', icon: BarChart3, tone: 'emerald' },
        ].map((stat, index) => (
          <Card key={index} className="rounded-none border-none bg-white shadow-sm overflow-hidden border-t-4 border-t-slate-900">
            <CardHeader className="p-4 pb-2">
              <div className="flex items-start justify-between">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{stat.label}</p>
                <stat.icon className="h-4 w-4 text-slate-400" />
              </div>
              <CardTitle className="mt-1 text-3xl font-black text-slate-900">{stat.value}</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="text-[10px] font-bold uppercase tracking-tighter text-slate-500">{stat.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {filteredKelompok.length === 0 ? (
          <div className="lg:col-span-2 rounded-none border-2 border-dashed border-slate-200 bg-slate-50 py-20 text-center">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Tidak ada kelompok dalam cakupan monitoring ini
            </p>
          </div>
        ) : (
          filteredKelompok.map((kelompok) => (
            <Card key={kelompok.id} className="rounded-none border-slate-200 shadow-sm transition-all hover:border-slate-900 group">
              <CardHeader className="border-b border-slate-50 bg-slate-50/50 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-black tracking-tight text-slate-900 uppercase">{kelompok.nama}</h3>
                      <Badge className={`h-4 rounded-none border-none px-1.5 text-[9px] font-black uppercase tracking-widest ${
                        kelompok.status === 'aktif' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-200 text-slate-600'
                      }`}>
                        {kelompok.status === 'aktif' ? 'AKTIF' : 'AUDIT'}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Ketua Kelompok:</p>
                      <p className="text-sm font-black text-slate-900 uppercase">{kelompok.ketua}</p>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" className="h-8 w-8 rounded-none hover:bg-slate-900 hover:text-white transition-colors" asChild>
                    <Link href={`/anggota/kelompok/${kelompok.id}`}>
                      <ChevronRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="p-4">
                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-slate-600">
                      <MapPin className="h-3.5 w-3.5 text-slate-400" />
                      <span className="text-[10px] font-black uppercase tracking-tighter">
                        {kelompok.desa} · {kelompok.koperasi}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-600">
                      <Users className="h-3.5 w-3.5 text-slate-400" />
                      <span className="text-[10px] font-black uppercase tracking-tighter">
                        {Math.round(kelompok.anggota * scaleFactor)} Anggota Terdaftar
                      </span>
                    </div>
                    {kelompok.luasTotal > 0 && (
                      <div className="flex items-center gap-2 text-slate-600">
                        <Leaf className="h-3.5 w-3.5 text-slate-400" />
                        <span className="text-[10px] font-black uppercase tracking-tighter">
                          {(kelompok.luasTotal * scaleFactor).toFixed(1)} Ha Area Produksi
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-4">
                    <div>
                      <p className="mb-2 text-[9px] font-black uppercase tracking-widest text-slate-400">Komoditas Fokus</p>
                      <div className="flex flex-wrap gap-1">
                        {kelompok.komoditas.map((komoditas) => (
                          <Badge key={komoditas} variant="outline" className="rounded-none border-slate-200 bg-white text-[9px] font-black uppercase tracking-widest text-slate-600">
                            {komoditas}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="mb-1.5 flex items-center justify-between text-[9px] font-black uppercase tracking-widest">
                        <span className="text-slate-400">Skor Output</span>
                        <span className="text-emerald-600">{kelompok.produksi}%</span>
                      </div>
                      <Progress value={kelompok.produksi} className="h-1 bg-slate-100 rounded-none shadow-inner" />
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
