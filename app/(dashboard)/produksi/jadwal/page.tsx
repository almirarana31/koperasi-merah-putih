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
import { toast } from 'sonner'

const baseJadwalPanen = [
  {
    id: 'JP001',
    tanggal: '2026-05-18',
    hari: 'Senin',
    desa: 'CIBODAS',
    koperasi: 'KOP. MANDIRI SEJAHTERA',
    items: [
      {
        komoditas: 'Kentang Granola',
        produsen: 'Bpk. Hendra Wijaya',
        lokasi: 'Sektor Utara Nasional',
        estimasi: 400000,
        waktu: '06:00 - 10:00',
        status: 'terkonfirmasi',
      },
      {
        komoditas: 'Wortel Import',
        produsen: 'Bpk. Hendra Wijaya',
        lokasi: 'Sektor Utara Nasional',
        estimasi: 250000,
        waktu: '06:00 - 10:00',
        status: 'terkonfirmasi',
      },
    ],
  },
  {
    id: 'JP002',
    tanggal: '2026-05-20',
    hari: 'Rabu',
    desa: 'SUKAMAJU',
    koperasi: 'KOP. MERAH PUTIH JAYA',
    items: [
      {
        komoditas: 'Cabai Merah Keriting',
        produsen: 'Ibu Sri Wahyuni',
        lokasi: 'Zona Produksi A1',
        estimasi: 150000,
        waktu: '07:00 - 09:00',
        status: 'terkonfirmasi',
      },
    ],
  },
  {
    id: 'JP003',
    tanggal: '2026-05-22',
    hari: 'Jumat',
    desa: 'SUKAMAJU',
    koperasi: 'KOP. MERAH PUTIH JAYA',
    items: [
      {
        komoditas: 'Beras Premium IR64',
        produsen: 'Bpk. Slamet Widodo',
        lokasi: 'Sentra Sawah Tengah',
        estimasi: 2000000,
        waktu: '06:00 - 12:00',
        status: 'menunggu',
      },
    ],
  },
]

const today: string = '2026-05-17'

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

  const scaleFactor = useMemo(() => {
    if (filters.cooperativeId !== 'all') return 0.05
    if (filters.villageId !== 'all') return 0.1
    if (filters.regionId !== 'all') return 0.25
    if (filters.provinceId !== 'all') return 0.5
    return 1.0
  }, [filters])

  const filteredJadwal = useMemo(() => {
    return baseJadwalPanen.map(j => ({
      ...j,
      items: j.items.map(i => ({
        ...i,
        estimasi: i.estimasi * scaleFactor
      }))
    })).filter(j => {
      const matchesSearch = j.items.some(i => i.komoditas.toLowerCase().includes(search.toLowerCase()) || i.produsen.toLowerCase().includes(search.toLowerCase()))
      return matchesSearch
    })
  }, [search, scaleFactor])

  const totals = useMemo(() => {
    let est = 0
    let itemsCount = 0
    filteredJadwal.forEach(j => {
      j.items.forEach(i => {
        est += i.estimasi
        itemsCount++
      })
    })
    return { est, itemsCount, schedules: filteredJadwal.length }
  }, [filteredJadwal])

  const handleAction = (action: string) => {
    toast.success(`Sinkronisasi ${action} berhasil diverifikasi`)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Logistik Panen Nasional</h1>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">
            Sinkronisasi Jadwal Penjemputan Hasil Bumi Strategis Lintas Entitas
          </p>
        </div>
      </div>

      <KementerianFilterBar filters={filters} setFilters={setFilters} search={search} setSearch={setSearch} />

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: 'BATCH LOGISTIK', value: totals.schedules, sub: 'JADWAL PENJEMPUTAN', icon: Calendar, tone: 'slate' },
          { label: 'ITEM KOMODITAS', value: totals.itemsCount, sub: 'VARIETAS TERDATA', icon: Leaf, tone: 'emerald' },
          { label: 'PROYEKSI VOLUME', value: `${(totals.est / 1000).toLocaleString()} TON`, sub: 'TOTAL VOLUME LOGISTIK', icon: Clock, tone: 'emerald' },
          { label: 'KESIAPAN HUB', value: 'OPTIMAL', sub: 'STATUS ARMADA NASIONAL', icon: CheckCircle2, tone: 'emerald' },
        ].map((stat, i) => (
          <Card key={i} className="rounded-none border-none bg-white shadow-sm overflow-hidden group">
            <div className={`h-1.5 w-full ${stat.tone === 'emerald' ? 'bg-emerald-500' : 'bg-slate-900'}`} />
            <CardHeader className="p-4 pb-2">
              <div className="flex justify-between items-start">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{stat.label}</p>
                <stat.icon className={`h-4 w-4 ${stat.tone === 'emerald' ? 'text-emerald-500' : 'text-slate-900'}`} />
              </div>
              <CardTitle className="text-2xl font-black text-slate-900 mt-1">{stat.value}</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="text-[10px] font-black text-slate-500 mt-1 uppercase tracking-tighter">{stat.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Timeline View */}
      <div className="space-y-8 relative mt-8">
        {filteredJadwal.length === 0 ? (
          <div className="py-20 text-center bg-slate-50 rounded-none border-2 border-dashed border-slate-200">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Tidak ada jadwal dalam scope audit ini</p>
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
                <div className={`absolute left-0 top-0 h-10 w-10 rounded-none border-4 border-white shadow-lg flex items-center justify-center transition-all z-10 ${
                  isToday ? 'bg-slate-900 scale-110' : 'bg-white'
                }`}>
                  <Calendar className={`h-4 w-4 ${isToday ? 'text-emerald-400' : 'text-slate-400'}`} />
                </div>

                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">{jadwal.hari}, {jadwal.tanggal}</h3>
                      {isToday && <Badge className="rounded-none bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest border-none">HARI INI</Badge>}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-3 w-3 text-slate-400" />
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{jadwal.desa} • {jadwal.koperasi}</span>
                    </div>
                  </div>

                  <Card className="rounded-none border-none shadow-sm overflow-hidden border-t-4 border-t-emerald-500">
                    <CardContent className="p-0 divide-y divide-slate-50">
                      {jadwal.items.map((item, itemIndex) => (
                        <div key={itemIndex} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors">
                          <div className="flex items-start gap-4">
                            <div className="h-10 w-10 rounded-none bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                              <Leaf className="h-5 w-5 text-slate-900" />
                            </div>
                            <div className="space-y-1">
                              <p className="text-sm font-black text-slate-900 uppercase tracking-tight">{item.komoditas}</p>
                              <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1.5">
                                  <User className="h-3 w-3 text-slate-400" />
                                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{item.produsen}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <MapPin className="h-3 w-3 text-slate-400" />
                                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{item.lokasi}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between sm:justify-end gap-8 bg-slate-50 sm:bg-transparent p-3 sm:p-0 rounded-none border sm:border-none border-slate-100">
                            <div className="text-left sm:text-right">
                              <p className="text-sm font-black text-emerald-600 uppercase tracking-tighter">{(item.estimasi / 1000).toLocaleString()} TON</p>
                              <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5 sm:justify-end">
                                <Clock className="h-3 w-3" />
                                {item.waktu}
                              </div>
                            </div>
                            <div 
                              onClick={() => handleAction(`Status ${jadwal.id}`)}
                              className={`h-10 w-10 rounded-none cursor-pointer flex items-center justify-center transition-all ${
                                item.status === 'terkonfirmasi' ? 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200' : 'bg-amber-100 text-amber-600 hover:bg-amber-200'
                              }`}
                            >
                              {item.status === 'terkonfirmasi' ? <CheckCircle2 className="h-5 w-5" /> : <Clock className="h-5 w-5" />}
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

