'use client'

import { useState, useMemo } from 'react'
import {
  Truck,
  MapPin,
  Clock,
  User,
  Phone,
  Package,
  CheckCircle2,
  AlertCircle,
  Plus,
  Calendar,
  Search,
  Activity,
  Download,
  ShieldAlert,
  ClipboardList,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import { useAuth } from '@/lib/auth/use-auth'
import { KementerianFilterBar } from '@/components/dashboard/kementerian-filter-bar'
import { resolveOperationalFilters } from '@/lib/cross-entity-operations'
import type { ScopeFilters } from '@/lib/kementerian-dashboard-data'

const pickupSchedule = [
  {
    id: 'PU001',
    tanggal: '2026-04-07',
    hari: 'SELASA',
    isToday: true,
    provinceId: '32',
    pickups: [
      {
        waktu: '06:00 - 08:00',
        produsen: 'Pak Hendra Wijaya',
        lokasi: 'Cibodas, Lembang',
        komoditas: ['Kentang 400kg', 'Wortel 250kg'],
        driver: 'Pak Joko',
        noHp: '081111222333',
        status: 'sedang_jalan',
      },
      {
        waktu: '09:00 - 11:00',
        produsen: 'Bu Sri Wahyuni',
        lokasi: 'Sukamaju, Cianjur',
        komoditas: ['Cabai Merah 150kg', 'Tomat 200kg'],
        driver: 'Pak Surya',
        noHp: '081222333444',
        status: 'dijadwalkan',
      },
    ],
  },
  {
    id: 'PU002',
    tanggal: '2026-04-08',
    hari: 'RABU',
    isToday: false,
    provinceId: '32',
    pickups: [
      {
        waktu: '05:00 - 07:00',
        produsen: 'Pak Ahmad Sudirman',
        lokasi: 'Pantai Indah, Palabuhanratu',
        komoditas: ['Ikan Tongkol 300kg', 'Udang 100kg'],
        driver: 'Pak Joko',
        noHp: '081111222333',
        status: 'dijadwalkan',
      },
    ],
  },
  {
    id: 'PU003',
    tanggal: '2026-04-09',
    hari: 'KAMIS',
    isToday: false,
    provinceId: '31',
    pickups: [
      {
        waktu: '06:00 - 10:00',
        produsen: 'Pak Slamet Widodo',
        lokasi: 'Sukamaju, Jakarta',
        komoditas: ['Beras Premium 2000kg'],
        driver: 'Pak Budi',
        noHp: '081333444555',
        status: 'dijadwalkan',
      },
    ],
  },
]

const drivers = [
  { nama: 'Pak Joko', kendaraan: 'Truk Box', plat: 'B 1234 XYZ', status: 'aktif', tugas: 2, provinceId: '32' },
  { nama: 'Pak Surya', kendaraan: 'Pickup', plat: 'B 5678 ABC', status: 'aktif', tugas: 1, provinceId: '32' },
  { nama: 'Pak Budi', kendaraan: 'Truk Box', plat: 'B 9012 DEF', status: 'standby', tugas: 1, provinceId: '31' },
]

export default function PickupPage() {
  const { user } = useAuth()
  const { toast } = useToast()
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
    if (filters.villageId !== 'all') return 0.15
    if (filters.regionId !== 'all') return 0.4
    if (filters.provinceId !== 'all') return 0.7
    return 1.0
  }, [filters])

  const stats = useMemo(() => {
    const totalWeekly = Math.ceil(84 * scaleFactor)
    const todayActive = Math.ceil(12 * scaleFactor)
    const driversOnMission = Math.ceil(42 * scaleFactor)
    const readiness = (94.5).toFixed(1)
    return { totalWeekly, todayActive, driversOnMission, readiness }
  }, [scaleFactor])

  const filteredSchedule = pickupSchedule.filter(s => {
     const matchesScope = filters.provinceId === 'all' || s.provinceId === filters.provinceId
     return matchesScope
  })

  const filteredDrivers = drivers.filter(d => {
     const matchesScope = filters.provinceId === 'all' || d.provinceId === filters.provinceId
     return matchesScope
  })

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">PUSAT KOMANDO PENJEMPUTAN</h1>
          <p className="text-[10px] font-black text-slate-500 mt-1 uppercase tracking-widest leading-relaxed">
            MONITORING AGREGASI HULU & PENJADWALAN LOGISTIK • {stats.todayActive} MISI AKTIF HARI INI
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" className="h-9 text-[10px] font-black uppercase tracking-widest border-slate-200 text-slate-600 rounded-none" onClick={() => toast({ title: "Sinkronisasi Jadwal", description: "Menghitung ulang jendela penjemputan optimal untuk klaster aktif..." })}>
            <ClipboardList className="h-3.5 w-3.5 mr-2 text-blue-600" />
            AUDIT JADWAL
          </Button>
          <Button size="sm" className="h-9 bg-slate-900 text-white hover:bg-slate-800 text-[10px] font-black uppercase tracking-widest px-6 rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] transition-all" onClick={() => toast({ title: "Penugasan Baru", description: "Membuka dispatcher misi untuk hub hilir..." })}>
            <Plus className="h-4 w-4 mr-2" />
            DISPATCH MISI
          </Button>
        </div>
      </div>

      <KementerianFilterBar filters={filters} setFilters={setFilters} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'PENJEMPUTAN HARI INI', value: stats.todayActive, sub: 'MISI AKTIF', icon: Truck, tone: 'emerald' },
          { label: 'RENCANA MINGGUAN', value: stats.totalWeekly, sub: 'SLOT TERJADWAL', icon: Calendar, tone: 'slate' },
          { label: 'OPERATOR AKTIF', value: stats.driversOnMission, sub: 'PERSONEL LAPANGAN', icon: User, tone: 'blue' },
          { label: 'KESIAPAN JARINGAN', value: stats.readiness + '%', sub: 'UPTIME ARMADA', icon: Activity, tone: 'slate' },
        ].map((s, i) => (
          <Card key={i} className="border-none shadow-sm bg-white overflow-hidden">
             <div className={`h-1 w-full ${
              s.tone === 'emerald' ? 'bg-emerald-500' : 
              s.tone === 'blue' ? 'bg-blue-500' : 'bg-slate-900'
            }`} />
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-10 w-10 rounded-none bg-slate-50 flex items-center justify-center shrink-0 shadow-inner">
                <s.icon className={`h-5 w-5 ${
                  s.tone === 'emerald' ? 'text-emerald-500' : 
                  s.tone === 'blue' ? 'text-blue-500' : 'text-slate-900'
                }`} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.label}</p>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-xl font-black text-slate-900">{s.value}</span>
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">{s.sub}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_350px]">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">LINI MASA MISI NASIONAL</h2>
            <Button variant="ghost" size="sm" className="h-7 text-[9px] font-black uppercase tracking-widest text-blue-600 hover:text-blue-700" onClick={() => toast({ title: "Perluas Pandangan", description: "Memuat tampilan agregasi bulanan lengkap..." })}>
              PERLUAS PANDANGAN
            </Button>
          </div>
          
          {filteredSchedule.map((schedule) => (
            <Card key={schedule.id} className={`border-none shadow-sm overflow-hidden rounded-none ${schedule.isToday ? 'ring-1 ring-slate-900' : ''}`}>
              <div className={`h-1 w-full ${schedule.isToday ? 'bg-slate-900' : 'bg-slate-200'}`} />
              <CardHeader className="p-4 bg-slate-50/50 border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    <CardTitle className="text-[10px] font-black text-slate-900 uppercase tracking-widest">
                      {schedule.hari}, {schedule.tanggal}
                    </CardTitle>
                    {schedule.isToday && (
                      <Badge className="bg-slate-900 text-white text-[9px] font-black px-1.5 h-4 border-none rounded-none tracking-widest">HARI INI</Badge>
                    )}
                  </div>
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                    {Math.ceil(schedule.pickups.length * scaleFactor)} MISI TERDAFTAR
                  </span>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-slate-100">
                  {schedule.pickups.map((pickup, idx) => (
                    <div key={idx} className="p-4 hover:bg-slate-50/50 transition-all cursor-pointer group">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`flex h-12 w-12 items-center justify-center shadow-inner rounded-none ${
                            pickup.status === 'sedang_jalan' ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'
                          }`}>
                            <Truck className="h-6 w-6" />
                          </div>
                          <div>
                            <p className="text-[11px] font-black text-slate-900 uppercase tracking-tight">{pickup.produsen}</p>
                            <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400 uppercase mt-0.5 tracking-wide">
                              <MapPin className="h-3 w-3" />
                              {pickup.lokasi}
                            </div>
                          </div>
                        </div>
                        <Badge className={`h-4 text-[9px] font-black px-1.5 rounded-none border-none tracking-widest ${
                          pickup.status === 'sedang_jalan' ? 'bg-blue-100 text-blue-700' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {pickup.status.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-slate-50">
                        <div>
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">JENDELA WAKTU</p>
                          <div className="flex items-center gap-1.5 mt-1">
                             <Clock className="h-3 w-3 text-slate-400" />
                             <p className="text-[10px] font-black text-slate-900 uppercase">{pickup.waktu}</p>
                          </div>
                        </div>
                        <div>
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">OPERATOR DITUGASKAN</p>
                          <div className="flex items-center gap-1.5 mt-1">
                             <User className="h-3 w-3 text-slate-400" />
                             <p className="text-[10px] font-black text-slate-900 uppercase">{pickup.driver}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1.5 mt-4">
                        {pickup.komoditas.map((k, kIdx) => (
                          <Badge key={kIdx} className="bg-slate-50 text-slate-500 text-[8px] font-black border border-slate-100 px-1.5 h-4 rounded-none tracking-tighter">
                            <Package className="mr-1 h-2.5 w-2.5" />
                            {k.toUpperCase()}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="space-y-6">
          <Card className="border-none shadow-xl bg-slate-950 text-white overflow-hidden rounded-none">
            <CardHeader className="p-4 border-b border-white/5 bg-slate-900/50">
               <div className="flex items-center justify-between">
                  <CardTitle className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                     <ShieldAlert className="h-4 w-4 text-emerald-500" /> NETWORK OPS
                  </CardTitle>
                  <div className="flex items-center gap-1.5">
                     <div className="h-1 w-1 bg-emerald-500 rounded-full animate-ping" />
                     <span className="text-[9px] font-black text-emerald-500 tracking-widest">LIVE</span>
                  </div>
               </div>
            </CardHeader>
            <CardContent className="p-0">
               <div className="divide-y divide-white/5">
                  {filteredDrivers.map((driver, idx) => (
                    <div key={idx} className="p-4 hover:bg-white/5 transition-colors cursor-pointer group">
                       <div className="flex items-center gap-3">
                          <div className={`h-8 w-8 rounded-none flex items-center justify-center font-black text-[10px] ${
                             driver.status === 'aktif' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-500'
                          }`}>
                             {driver.nama.split(' ')[1]?.[0] || driver.nama[0]}
                          </div>
                          <div className="flex-1">
                             <p className="text-[10px] font-black text-slate-200 uppercase tracking-tight">{driver.nama}</p>
                             <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">{driver.plat}</p>
                          </div>
                          <Badge className={`h-4 text-[8px] font-black px-1 rounded-none border-none tracking-tighter ${
                             driver.status === 'aktif' ? 'bg-emerald-900/40 text-emerald-400' : 'bg-slate-800 text-slate-600'
                          }`}>
                             {driver.status.toUpperCase()}
                          </Badge>
                       </div>
                    </div>
                  ))}
               </div>
               <div className="p-4 bg-white/5 border-t border-white/5">
                  <Button variant="ghost" className="w-full text-[10px] font-black text-slate-500 hover:text-white uppercase tracking-widest h-9 rounded-none" onClick={() => toast({ title: "Personnel Roster", description: "Loading national driver availability matrix..." })}>
                     FULL ROSTER ANALYTICS →
                  </Button>
               </div>
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-slate-50 rounded-none">
             <CardHeader className="p-4 border-b border-slate-200">
                <CardTitle className="text-[10px] font-black uppercase tracking-widest text-slate-900">HEALTH: HULU AGGREGATION</CardTitle>
             </CardHeader>
             <CardContent className="p-4 space-y-4">
                {[
                  { label: 'AVG PICKUP LAG', val: '12 MIN', status: 'Optimal' },
                  { label: 'SPOILAGE RISK', val: '0.2%', status: 'Minimal' },
                  { label: 'CAPACITY LOAD', val: '92.4%', status: 'High' },
                ].map((h, i) => (
                   <div key={i} className="flex items-center justify-between">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{h.label}</span>
                      <div className="text-right">
                         <p className="text-[10px] font-black text-slate-900">{h.val}</p>
                         <p className="text-[9px] font-black text-emerald-600 uppercase tracking-tighter">{h.status}</p>
                      </div>
                   </div>
                ))}
             </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
