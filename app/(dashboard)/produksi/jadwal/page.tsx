'use client'

import { useState, useMemo } from 'react'
import {
  AlertCircle,
  Calendar,
  CheckCircle2,
  Clock,
  Leaf,
  MapPin,
  User,
  Search,
  Building2,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/lib/auth/use-auth'
import { KementerianFilterBar } from '@/components/dashboard/kementerian-filter-bar'
import { ScopeFilters } from '@/lib/kementerian-dashboard-data'

const initialJadwalPanen = [
  {
    id: 'JP001',
    tanggal: '2024-02-18',
    hari: 'Minggu',
    desa: 'CIBODAS',
    koperasi: 'KOP. MANDIRI',
    items: [
      {
        komoditas: 'Kentang',
        produsen: 'Pak Hendra Wijaya',
        lokasi: 'Blok Utara',
        estimasi: '400 kg',
        waktu: '06:00 - 10:00',
        status: 'terkonfirmasi',
      },
      {
        komoditas: 'Wortel',
        produsen: 'Pak Hendra Wijaya',
        lokasi: 'Blok Utara',
        estimasi: '250 kg',
        waktu: '06:00 - 10:00',
        status: 'terkonfirmasi',
      },
    ],
  },
  {
    id: 'JP002',
    tanggal: '2024-02-20',
    hari: 'Selasa',
    desa: 'SUKAMAJU',
    koperasi: 'KOP. MAJU JAYA',
    items: [
      {
        komoditas: 'Cabai Merah',
        produsen: 'Bu Sri Wahyuni',
        lokasi: 'Lahan A1',
        estimasi: '150 kg',
        waktu: '07:00 - 09:00',
        status: 'terkonfirmasi',
      },
    ],
  },
  {
    id: 'JP003',
    tanggal: '2024-02-22',
    hari: 'Kamis',
    desa: 'SUKAMAJU',
    koperasi: 'KOP. MAJU JAYA',
    items: [
      {
        komoditas: 'Beras Premium',
        produsen: 'Pak Slamet Widodo',
        lokasi: 'Blok Sawah Tengah',
        estimasi: '2000 kg',
        waktu: '06:00 - 12:00',
        status: 'menunggu',
      },
    ],
  },
]

const today: string = '2024-02-17'

export default function JadwalPanenPage() {
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

  const filteredJadwal = useMemo(() => {
    return initialJadwalPanen.filter(j => {
      const matchesSearch = j.items.some(i => i.komoditas.toLowerCase().includes(search.toLowerCase()) || i.produsen.toLowerCase().includes(search.toLowerCase()))
      if (!isKementerian) return matchesSearch

      const matchesVillage = filters.villageId === 'all' || j.desa.toUpperCase().includes(filters.villageId.split('-').pop() || '')
      const matchesKop = filters.cooperativeId === 'all' || j.koperasi.toUpperCase().includes(filters.cooperativeId.split('-').pop() || '')
      const matchesCommodity = filters.commodityId === 'all' || j.items.some(i => i.komoditas.toLowerCase().includes(filters.commodityId.toLowerCase()))

      return matchesSearch && matchesVillage && matchesKop && matchesCommodity
    })
  }, [search, filters, isKementerian])

  const totals = useMemo(() => {
    let est = 0
    let itemsCount = 0
    filteredJadwal.forEach(j => {
      j.items.forEach(i => {
        est += parseInt(i.estimasi)
        itemsCount++
      })
    })
    return { est, itemsCount, schedules: filteredJadwal.length }
  }, [filteredJadwal])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold  text-slate-900 ">Logistik Panen Nasional</h1>
          <p className="text-xs font-bold text-slate-500   mt-1">
            Sinkronisasi Jadwal Penjemputan Hasil Bumi Lintas Entitas
          </p>
        </div>
      </div>

      {/* Kementerian Filter Bar */}
      {isKementerian && <KementerianFilterBar filters={filters} setFilters={setFilters} search={search} setSearch={setSearch} />}

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: 'Total Jadwal', value: totals.schedules, sub: 'Batch Penjemputan', icon: Calendar, tone: 'slate' },
          { label: 'Item Panen', value: totals.itemsCount, sub: 'Komoditas Terdata', icon: Leaf, tone: 'emerald' },
          { label: 'Volume Estimasi', value: `${(totals.est / 1000).toFixed(1)} TON`, sub: 'Proyeksi Beban Logistik', icon: Clock, tone: 'emerald' },
          { label: 'Status Hub', value: 'OPTIMAL', sub: 'Kesiapan Armada', icon: CheckCircle2, tone: 'emerald' },
        ].map((stat, i) => (
          <Card key={i} className="border-none shadow-[0_4px_12px_-4px_rgba(0,0,0,0.05)]">
            <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
              <p className="text-xs font-semibold text-slate-400  ">{stat.label}</p>
              <stat.icon className="h-3.5 w-3.5 text-slate-400" />
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="text-2xl font-semibold text-slate-900 ">{stat.value}</p>
              <p className="text-xs font-bold text-slate-500  mt-1 ">{stat.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Timeline View */}
      <div className="space-y-8 relative">
        {filteredJadwal.length === 0 ? (
          <div className="py-20 text-center bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
            <p className="text-xs font-semibold text-slate-400  ">Tidak ada jadwal dalam scope filter ini</p>
          </div>
        ) : (
          filteredJadwal.map((jadwal, index) => {
            const isToday = jadwal.tanggal === today
            return (
              <div key={jadwal.id} className="relative pl-12 group">
                {/* Timeline Line */}
                {index < filteredJadwal.length - 1 && (
                  <div className="absolute left-5 top-10 bottom-0 w-0.5 bg-slate-100 group-hover:bg-emerald-100 transition-colors" />
                )}
                
                {/* Timeline Dot */}
                <div className={`absolute left-0 top-0 h-10 w-10 rounded-xl border-4 border-white shadow-lg flex items-center justify-center transition-all z-10 ${
                  isToday ? 'bg-slate-900 scale-110' : 'bg-white'
                }`}>
                  <Calendar className={`h-4 w-4 ${isToday ? 'text-emerald-400' : 'text-slate-400'}`} />
                </div>

                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <h3 className="text-sm font-semibold text-slate-900  ">{jadwal.hari}, {jadwal.tanggal}</h3>
                      {isToday && <Badge className="bg-emerald-500 text-white text-xs font-semibold  border-none">HARI INI</Badge>}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3 w-3 text-slate-400" />
                      <span className="text-xs font-semibold text-slate-500  ">{jadwal.desa} • {jadwal.koperasi}</span>
                    </div>
                  </div>

                  <Card className="border-none shadow-[0_4px_12px_-4px_rgba(0,0,0,0.05)] overflow-hidden">
                    <CardContent className="p-0 divide-y divide-slate-50">
                      {jadwal.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
                          <div className="flex items-start gap-4">
                            <div className="h-10 w-10 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                              <Leaf className="h-5 w-5 text-slate-900" />
                            </div>
                            <div className="space-y-1">
                              <p className="text-xs font-semibold text-slate-900  ">{item.komoditas}</p>
                              <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1.5">
                                  <User className="h-3 w-3 text-slate-400" />
                                  <span className="text-xs font-bold text-slate-500  ">{item.produsen}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <MapPin className="h-3 w-3 text-slate-400" />
                                  <span className="text-xs font-bold text-slate-500  ">{item.lokasi}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between sm:justify-end gap-8 bg-slate-50 sm:bg-transparent p-3 sm:p-0 rounded-lg border sm:border-none border-slate-100">
                            <div className="text-left sm:text-right">
                              <p className="text-sm font-semibold text-emerald-600 ">{item.estimasi.toUpperCase()}</p>
                              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400   mt-0.5 sm:justify-end">
                                <Clock className="h-3 w-3" />
                                {item.waktu}
                              </div>
                            </div>
                            <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                              item.status === 'terkonfirmasi' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
                            }`}>
                              {item.status === 'terkonfirmasi' ? <CheckCircle2 className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                            </div>
                          </div>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
