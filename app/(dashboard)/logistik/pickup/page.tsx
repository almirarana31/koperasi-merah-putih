'use client'

import { useMemo, useState } from 'react'
import {
  Activity,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Clock,
  MapPin,
  Package,
  Phone,
  Plus,
  ShieldAlert,
  Truck,
  User,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import { useAuth } from '@/lib/auth/use-auth'
import { KementerianFilterBar } from '@/components/dashboard/kementerian-filter-bar'
import {
  getScopeCaption,
  resolveOperationalFilters,
} from '@/lib/cross-entity-operations'
import {
  KEMENTERIAN_DASHBOARD_DATA,
  type ScopeFilters,
} from '@/lib/kementerian-dashboard-data'

type ViewMode = 'day' | 'week' | 'month'
type PickupStatus = 'dijadwalkan' | 'sedang_jalan' | 'selesai'

type PickupMission = {
  id: string
  date: string
  timeRange: string
  producer: string
  locationDetail: string
  hubName: string
  vehicle: string
  driver: string
  driverPhone: string
  commodityId: string
  commodityName: string
  pickupItems: string[]
  estimatedKg: number
  status: PickupStatus
  provinceId: string
  provinceName: string
  regionId: string
  regionName: string
  villageId: string
  villageName: string
  cooperativeId: string
  cooperativeName: string
}

const WEEKDAYS = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min']
const VIEW_OPTIONS: Array<{ value: ViewMode; label: string }> = [
  { value: 'day', label: 'Per Hari' },
  { value: 'week', label: 'Per Minggu' },
  { value: 'month', label: 'Per Bulan' },
]

const MISSION_BLUEPRINTS = [
  {
    id: 'PU001',
    offsetDays: 0,
    locationIndex: 0,
    commodityId: 'beras',
    commodityName: 'Beras Premium IR64',
    producer: 'Pak Hendra Wijaya',
    locationDetail: 'Cibodas, Lembang',
    hubName: 'Hub Lembang Utara',
    timeRange: '06.00 - 08.00',
    vehicle: 'Truk Box',
    driver: 'Pak Joko',
    driverPhone: '081111222333',
    pickupItems: ['Beras Premium 420kg', 'Gabah Kering 180kg'],
    estimatedKg: 600,
    status: 'sedang_jalan' as const,
  },
  {
    id: 'PU002',
    offsetDays: 0,
    locationIndex: 1,
    commodityId: 'cabai',
    commodityName: 'Cabai Merah Keriting',
    producer: 'Bu Sri Wahyuni',
    locationDetail: 'Sukamaju, Cianjur',
    hubName: 'Hub Hortikultura Cianjur',
    timeRange: '09.00 - 11.00',
    vehicle: 'Van Distribusi',
    driver: 'Pak Surya',
    driverPhone: '081222333444',
    pickupItems: ['Cabai Merah 150kg', 'Tomat 200kg'],
    estimatedKg: 350,
    status: 'dijadwalkan' as const,
  },
  {
    id: 'PU003',
    offsetDays: 1,
    locationIndex: 2,
    commodityId: 'jagung',
    commodityName: 'Jagung Hibrida',
    producer: 'Pak Ahmad Sudirman',
    locationDetail: 'Pantai Indah, Palabuhanratu',
    hubName: 'Hub Palabuhanratu Selatan',
    timeRange: '05.00 - 07.00',
    vehicle: 'Truk Box',
    driver: 'Pak Joko',
    driverPhone: '081111222333',
    pickupItems: ['Jagung Hibrida 300kg', 'Pakan 90kg'],
    estimatedKg: 390,
    status: 'dijadwalkan' as const,
  },
  {
    id: 'PU004',
    offsetDays: 2,
    locationIndex: 3,
    commodityId: 'beras',
    commodityName: 'Beras Organik',
    producer: 'Pak Slamet Widodo',
    locationDetail: 'Sukamaju, Jakarta',
    hubName: 'Hub Jakarta Timur',
    timeRange: '06.00 - 10.00',
    vehicle: 'Truk Wingbox',
    driver: 'Pak Budi',
    driverPhone: '081333444555',
    pickupItems: ['Beras Organik 820kg'],
    estimatedKg: 820,
    status: 'dijadwalkan' as const,
  },
  {
    id: 'PU005',
    offsetDays: 3,
    locationIndex: 4,
    commodityId: 'bawang',
    commodityName: 'Bawang Merah',
    producer: 'Ibu Ratna Kurnia',
    locationDetail: 'Delanggu, Klaten',
    hubName: 'Hub Klaten Tengah',
    timeRange: '07.30 - 09.00',
    vehicle: 'Pickup Box',
    driver: 'Bu Nita',
    driverPhone: '081444555666',
    pickupItems: ['Bawang Merah 240kg', 'Cabai Rawit 75kg'],
    estimatedKg: 315,
    status: 'dijadwalkan' as const,
  },
  {
    id: 'PU006',
    offsetDays: 4,
    locationIndex: 5,
    commodityId: 'jagung',
    commodityName: 'Jagung Pakan',
    producer: 'Pak Wawan Pratama',
    locationDetail: 'Banjaroyo, Kulon Progo',
    hubName: 'Hub Kulon Progo Barat',
    timeRange: '06.30 - 08.30',
    vehicle: 'Truk Box',
    driver: 'Pak Rian',
    driverPhone: '081555666777',
    pickupItems: ['Jagung Pakan 500kg'],
    estimatedKg: 500,
    status: 'dijadwalkan' as const,
  },
  {
    id: 'PU007',
    offsetDays: 5,
    locationIndex: 6,
    commodityId: 'beras',
    commodityName: 'Gabah Kering Giling',
    producer: 'Pak Rahmat Hidayat',
    locationDetail: 'Sungai Tabuk, Banjar',
    hubName: 'Hub Banjar Utama',
    timeRange: '05.45 - 09.30',
    vehicle: 'Tronton',
    driver: 'Pak Dimas',
    driverPhone: '081666777888',
    pickupItems: ['Gabah Kering 1200kg'],
    estimatedKg: 1200,
    status: 'dijadwalkan' as const,
  },
  {
    id: 'PU008',
    offsetDays: 6,
    locationIndex: 7,
    commodityId: 'cabai',
    commodityName: 'Cabai Rawit',
    producer: 'Ibu Intan Fadilah',
    locationDetail: 'Loa Duri Ilir, Kutai',
    hubName: 'Hub Kutai Timur',
    timeRange: '08.00 - 10.30',
    vehicle: 'Pickup Box',
    driver: 'Bu Nita',
    driverPhone: '081444555666',
    pickupItems: ['Cabai Rawit 125kg', 'Tomat 140kg'],
    estimatedKg: 265,
    status: 'dijadwalkan' as const,
  },
  {
    id: 'PU009',
    offsetDays: 8,
    locationIndex: 8,
    commodityId: 'jagung',
    commodityName: 'Jagung Konsumsi',
    producer: 'Koperasi Tani Maros',
    locationDetail: 'Bontoa, Maros',
    hubName: 'Hub Maros Selatan',
    timeRange: '06.15 - 09.45',
    vehicle: 'Van Distribusi',
    driver: 'Pak Fajar',
    driverPhone: '081777888999',
    pickupItems: ['Jagung Konsumsi 640kg'],
    estimatedKg: 640,
    status: 'dijadwalkan' as const,
  },
  {
    id: 'PU010',
    offsetDays: 11,
    locationIndex: 9,
    commodityId: 'bawang',
    commodityName: 'Bawang Merah Premium',
    producer: 'Ibu Maya Kusuma',
    locationDetail: 'Naibonat, Kupang',
    hubName: 'Hub Kupang Timur',
    timeRange: '07.00 - 09.00',
    vehicle: 'Pickup Box',
    driver: 'Pak Rian',
    driverPhone: '081555666777',
    pickupItems: ['Bawang Merah 210kg'],
    estimatedKg: 210,
    status: 'selesai' as const,
  },
  {
    id: 'PU011',
    offsetDays: 14,
    locationIndex: 10,
    commodityId: 'beras',
    commodityName: 'Beras Papua',
    producer: 'Pak Yoseph Mandacan',
    locationDetail: 'Amban, Manokwari',
    hubName: 'Hub Manokwari Barat',
    timeRange: '06.00 - 08.45',
    vehicle: 'Truk Box',
    driver: 'Pak Dimas',
    driverPhone: '081666777888',
    pickupItems: ['Beras Papua 390kg'],
    estimatedKg: 390,
    status: 'dijadwalkan' as const,
  },
]

function parseDate(value: string) {
  const [year, month, day] = value.split('-').map(Number)
  return new Date(year, month - 1, day)
}

function formatDateKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

function getJakartaTodayKey() {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Jakarta',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
  const parts = formatter.formatToParts(new Date())
  const year = parts.find((part) => part.type === 'year')?.value ?? '2026'
  const month = parts.find((part) => part.type === 'month')?.value ?? '01'
  const day = parts.find((part) => part.type === 'day')?.value ?? '01'
  return `${year}-${month}-${day}`
}

function addDays(date: Date, days: number) {
  const next = new Date(date)
  next.setDate(next.getDate() + days)
  return next
}

function addMonths(date: Date, months: number) {
  return new Date(date.getFullYear(), date.getMonth() + months, Math.min(date.getDate(), 28))
}

function startOfWeek(date: Date) {
  const day = date.getDay()
  return addDays(date, day === 0 ? -6 : 1 - day)
}

function sameMonth(left: Date, right: Date) {
  return left.getFullYear() === right.getFullYear() && left.getMonth() === right.getMonth()
}

function formatLongDate(date: Date) {
  return new Intl.DateTimeFormat('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

function formatShortDate(date: Date) {
  return new Intl.DateTimeFormat('id-ID', {
    day: 'numeric',
    month: 'short',
  }).format(date)
}

function formatMonthLabel(date: Date) {
  return new Intl.DateTimeFormat('id-ID', {
    month: 'long',
    year: 'numeric',
  }).format(date)
}

function statusTone(status: PickupStatus) {
  if (status === 'selesai') return 'border-emerald-200 bg-emerald-50 text-emerald-700'
  if (status === 'sedang_jalan') return 'border-blue-200 bg-blue-50 text-blue-700'
  return 'border-amber-200 bg-amber-50 text-amber-700'
}

function statusLabel(status: PickupStatus) {
  if (status === 'selesai') return 'Selesai'
  if (status === 'sedang_jalan') return 'Sedang Jalan'
  return 'Dijadwalkan'
}

export default function PickupPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [todayKey] = useState(() => getJakartaTodayKey())
  const [filters, setFilters] = useState<ScopeFilters>({
    provinceId: 'all',
    regionId: 'all',
    villageId: 'all',
    cooperativeId: 'all',
    commodityId: 'all',
  })
  const [search, setSearch] = useState('')
  const [viewMode, setViewMode] = useState<ViewMode>('week')
  const [selectedDate, setSelectedDate] = useState(todayKey)

  const scopedFilters = resolveOperationalFilters(user, filters)

  const missions = useMemo<PickupMission[]>(() => {
    const start = parseDate(todayKey)
    const provinceMap = new Map(KEMENTERIAN_DASHBOARD_DATA.provinceOptions.map((item) => [item.id, item.label]))
    const regionMap = new Map(KEMENTERIAN_DASHBOARD_DATA.regionOptions.map((item) => [item.id, item.label]))
    const villageMap = new Map(KEMENTERIAN_DASHBOARD_DATA.villageOptions.map((item) => [item.id, item.label]))

    return MISSION_BLUEPRINTS.map((blueprint) => {
      const cooperative =
        KEMENTERIAN_DASHBOARD_DATA.cooperativeOptions[
          blueprint.locationIndex % KEMENTERIAN_DASHBOARD_DATA.cooperativeOptions.length
        ]

      return {
        id: blueprint.id,
        date: formatDateKey(addDays(start, blueprint.offsetDays)),
        timeRange: blueprint.timeRange,
        producer: blueprint.producer,
        locationDetail: blueprint.locationDetail,
        hubName: blueprint.hubName,
        vehicle: blueprint.vehicle,
        driver: blueprint.driver,
        driverPhone: blueprint.driverPhone,
        commodityId: blueprint.commodityId,
        commodityName: blueprint.commodityName,
        pickupItems: blueprint.pickupItems,
        estimatedKg: blueprint.estimatedKg,
        status: blueprint.status,
        cooperativeId: cooperative.id,
        cooperativeName: cooperative.label,
        provinceId: cooperative.provinceId ?? 'all',
        provinceName: provinceMap.get(cooperative.provinceId ?? 'all') ?? 'Nasional',
        regionId: cooperative.regionId ?? 'all',
        regionName: regionMap.get(cooperative.regionId ?? 'all') ?? 'Kabupaten',
        villageId: cooperative.villageId ?? 'all',
        villageName: villageMap.get(cooperative.villageId ?? 'all') ?? 'Desa',
      }
    })
  }, [todayKey])

  const filteredMissions = useMemo(() => {
    const keyword = search.trim().toLowerCase()

    return missions.filter((mission) => {
      const matchesSearch =
        keyword.length === 0 ||
        [
          mission.producer,
          mission.driver,
          mission.commodityName,
          mission.cooperativeName,
          mission.villageName,
          mission.regionName,
        ].some((value) => value.toLowerCase().includes(keyword))

      return (
        matchesSearch &&
        (scopedFilters.provinceId === 'all' || mission.provinceId === scopedFilters.provinceId) &&
        (scopedFilters.regionId === 'all' || mission.regionId === scopedFilters.regionId) &&
        (scopedFilters.villageId === 'all' || mission.villageId === scopedFilters.villageId) &&
        (scopedFilters.cooperativeId === 'all' || mission.cooperativeId === scopedFilters.cooperativeId) &&
        (scopedFilters.commodityId === 'all' || mission.commodityId === scopedFilters.commodityId)
      )
    })
  }, [missions, scopedFilters, search])

  const selectedDateObject = useMemo(() => parseDate(selectedDate), [selectedDate])

  const range = useMemo(() => {
    const start =
      viewMode === 'day'
        ? selectedDateObject
        : viewMode === 'week'
          ? startOfWeek(selectedDateObject)
          : new Date(selectedDateObject.getFullYear(), selectedDateObject.getMonth(), 1)

    const end =
      viewMode === 'day'
        ? selectedDateObject
        : viewMode === 'week'
          ? addDays(start, 6)
          : new Date(selectedDateObject.getFullYear(), selectedDateObject.getMonth() + 1, 0)

    return { start, end }
  }, [selectedDateObject, viewMode])

  const dayMap = useMemo(() => {
    const map = new Map<string, PickupMission[]>()

    for (const mission of filteredMissions) {
      const current = map.get(mission.date) ?? []
      current.push(mission)
      map.set(mission.date, current)
    }

    return map
  }, [filteredMissions])

  const selectedDayMissions = useMemo(
    () => (dayMap.get(selectedDate) ?? []).sort((a, b) => a.timeRange.localeCompare(b.timeRange)),
    [dayMap, selectedDate],
  )

  const periodMissions = useMemo(() => {
    return filteredMissions
      .filter((mission) => {
        const date = parseDate(mission.date)
        return date >= range.start && date <= range.end
      })
      .sort((a, b) => a.date.localeCompare(b.date) || a.timeRange.localeCompare(b.timeRange))
  }, [filteredMissions, range.end, range.start])

  const monthGrid = useMemo(() => {
    const first = new Date(selectedDateObject.getFullYear(), selectedDateObject.getMonth(), 1)
    const gridStart = startOfWeek(first)
    return Array.from({ length: 42 }, (_, index) => addDays(gridStart, index))
  }, [selectedDateObject])

  const weekGrid = useMemo(() => {
    const weekStart = startOfWeek(selectedDateObject)
    return Array.from({ length: 7 }, (_, index) => addDays(weekStart, index))
  }, [selectedDateObject])

  const driverRoster = useMemo(() => {
    const grouped = new Map<string, { name: string; phone: string; vehicle: string; tasks: number; underway: number }>()

    for (const mission of periodMissions) {
      const key = `${mission.driver}-${mission.driverPhone}`
      const current = grouped.get(key) ?? {
        name: mission.driver,
        phone: mission.driverPhone,
        vehicle: mission.vehicle,
        tasks: 0,
        underway: 0,
      }
      current.tasks += 1
      if (mission.status === 'sedang_jalan') current.underway += 1
      grouped.set(key, current)
    }

    return [...grouped.values()].sort((a, b) => b.tasks - a.tasks).slice(0, 5)
  }, [periodMissions])

  const stats = useMemo(() => {
    const todayMissions = filteredMissions.filter((mission) => mission.date === todayKey).length
    const weekStart = startOfWeek(parseDate(todayKey))
    const weekEnd = addDays(weekStart, 6)
    const weeklyMissions = filteredMissions.filter((mission) => {
      const date = parseDate(mission.date)
      return date >= weekStart && date <= weekEnd
    }).length
    const activeDrivers = new Set(
      filteredMissions
        .filter((mission) => mission.status === 'sedang_jalan' || mission.status === 'dijadwalkan')
        .map((mission) => mission.driver),
    ).size
    const readiness =
      filteredMissions.length === 0
        ? 100
        : Math.round(
            ((filteredMissions.filter((mission) => mission.status !== 'dijadwalkan').length || 1) /
              filteredMissions.length) *
              100,
          )

    return {
      todayMissions,
      weeklyMissions,
      activeDrivers,
      readiness,
    }
  }, [filteredMissions, todayKey])

  const activeLabel =
    viewMode === 'day'
      ? formatLongDate(selectedDateObject)
      : viewMode === 'week'
        ? `${formatShortDate(range.start)} - ${formatLongDate(range.end)}`
        : formatMonthLabel(selectedDateObject)

  function shift(direction: number) {
    setSelectedDate((current) => {
      const date = parseDate(current)
      if (viewMode === 'day') return formatDateKey(addDays(date, direction))
      if (viewMode === 'week') return formatDateKey(addDays(date, direction * 7))
      return formatDateKey(addMonths(date, direction))
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Pusat Komando Penjemputan</h1>
          <p className="text-[10px] font-black text-slate-500 mt-1 uppercase tracking-widest leading-relaxed">
            Penjadwalan pickup harian, mingguan, dan bulanan untuk {getScopeCaption(scopedFilters)}.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-9 text-[10px] font-black uppercase tracking-widest border-slate-200 text-slate-600 rounded-none"
            onClick={() =>
              toast({
                title: 'Audit Jadwal',
                description: 'Menghitung ulang jendela penjemputan optimal untuk pickup aktif.',
              })
            }
          >
            <ClipboardList className="h-3.5 w-3.5 mr-2 text-blue-600" />
            Audit Jadwal
          </Button>
          <Button
            size="sm"
            className="h-9 bg-slate-900 text-white hover:bg-slate-800 text-[10px] font-black uppercase tracking-widest px-6 rounded-none"
            onClick={() =>
              toast({
                title: 'Dispatch Misi',
                description: 'Membuka dispatcher misi untuk hub pickup terpilih.',
              })
            }
          >
            <Plus className="h-4 w-4 mr-2" />
            Dispatch Misi
          </Button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {VIEW_OPTIONS.map((option) => (
          <Button
            key={option.value}
            size="sm"
            variant={viewMode === option.value ? 'default' : 'outline'}
            onClick={() => setViewMode(option.value)}
            className={`h-9 rounded-none px-4 text-[10px] font-black uppercase tracking-widest ${
              viewMode === option.value
                ? 'bg-slate-900 text-white hover:bg-slate-800'
                : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
            }`}
          >
            {option.label}
          </Button>
        ))}
      </div>

      <KementerianFilterBar
        filters={filters}
        setFilters={setFilters}
        search={search}
        setSearch={setSearch}
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Penjemputan Hari Ini', value: stats.todayMissions, sub: 'Misi Aktif', icon: Truck, tone: 'emerald' },
          { label: 'Rencana Mingguan', value: stats.weeklyMissions, sub: 'Slot Terjadwal', icon: CalendarDays, tone: 'slate' },
          { label: 'Operator Aktif', value: stats.activeDrivers, sub: 'Personel Lapangan', icon: User, tone: 'blue' },
          { label: 'Kesiapan Jaringan', value: `${stats.readiness}%`, sub: 'Uptime Armada', icon: Activity, tone: 'slate' },
        ].map((stat) => (
          <Card key={stat.label} className="border-none shadow-sm bg-white overflow-hidden rounded-none">
            <div className={`h-1 w-full ${stat.tone === 'emerald' ? 'bg-emerald-500' : stat.tone === 'blue' ? 'bg-blue-500' : 'bg-slate-900'}`} />
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-10 w-10 rounded-none bg-slate-50 flex items-center justify-center shrink-0 shadow-inner">
                <stat.icon className={`h-5 w-5 ${stat.tone === 'emerald' ? 'text-emerald-500' : stat.tone === 'blue' ? 'text-blue-500' : 'text-slate-900'}`} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-xl font-black text-slate-900">{stat.value}</span>
                  <span className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">{stat.sub}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <Card className="border-none bg-white shadow-sm overflow-hidden rounded-none xl:col-span-2">
          <div className="h-1 w-full bg-slate-900" />
          <CardHeader className="p-6 border-b border-slate-50">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-900">Kalender Pickup</CardTitle>
                <CardDescription className="text-[10px] font-bold text-slate-500 uppercase">
                  Jadwal operasional pickup berdasarkan tanggal dan cakupan aktif
                </CardDescription>
              </div>
              <div className="flex flex-wrap items-center gap-2 lg:justify-end">
                <Button size="icon" variant="outline" onClick={() => shift(-1)} className="h-9 w-9 rounded-none border-slate-200">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="min-w-[190px] flex-1 rounded-none border border-slate-200 bg-white px-4 py-2 text-center text-sm font-semibold text-slate-900 sm:min-w-[240px] lg:flex-none">
                  {activeLabel}
                </div>
                <Button size="icon" variant="outline" onClick={() => shift(1)} className="h-9 w-9 rounded-none border-slate-200">
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setSelectedDate(getJakartaTodayKey())}
                  className="h-9 rounded-none border-slate-200 px-4 text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50"
                >
                  Hari Ini
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            {filteredMissions.length === 0 ? (
              <div className="rounded-none border border-dashed border-slate-200 bg-slate-50 px-6 py-16 text-center">
                <p className="text-sm font-semibold text-slate-900">Belum ada pickup pada cakupan ini.</p>
                <p className="mt-1 text-sm text-slate-500">Sesuaikan filter untuk menampilkan jadwal pickup.</p>
              </div>
            ) : (
              <>
                {viewMode === 'month' && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-7 gap-2">
                      {WEEKDAYS.map((label) => (
                        <div key={label} className="rounded-none bg-slate-100 px-3 py-2 text-center text-xs font-semibold text-slate-500">
                          {label}
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-7 gap-2">
                      {monthGrid.map((date) => {
                        const key = formatDateKey(date)
                        const items = dayMap.get(key) ?? []
                        const selected = key === selectedDate

                        return (
                          <button
                            key={key}
                            type="button"
                            onClick={() => setSelectedDate(key)}
                            className={`min-h-[108px] rounded-none border p-3 text-left transition-all ${
                              selected
                                ? 'border-slate-900 bg-slate-900 text-white shadow-lg shadow-slate-200'
                                : sameMonth(date, selectedDateObject)
                                  ? 'border-slate-200 bg-white hover:border-slate-900'
                                  : 'border-slate-100 bg-slate-50 text-slate-400'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <span className={`text-sm font-semibold ${selected ? 'text-white' : 'text-slate-900'}`}>{date.getDate()}</span>
                              {key === todayKey && (
                                <Badge className={`rounded-none border-none px-2 text-[10px] font-semibold ${selected ? 'bg-white/15 text-white' : 'bg-emerald-50 text-emerald-700'}`}>
                                  Hari Ini
                                </Badge>
                              )}
                            </div>
                            <div className="mt-5 space-y-1.5">
                              <p className={`text-xs ${selected ? 'text-white/75' : 'text-slate-500'}`}>
                                {items.length > 0 ? `${items.length} pickup` : 'Belum ada pickup'}
                              </p>
                              {items.slice(0, 2).map((item) => (
                                <div key={item.id} className={`rounded-none px-2 py-1 text-[11px] ${selected ? 'bg-white/10 text-white' : 'bg-slate-100 text-slate-600'}`}>
                                  {item.producer}
                                </div>
                              ))}
                            </div>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}

                {viewMode === 'week' && (
                  <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-7">
                    {weekGrid.map((date) => {
                      const key = formatDateKey(date)
                      const items = dayMap.get(key) ?? []
                      const selected = key === selectedDate
                      const totalKg = items.reduce((sum, item) => sum + item.estimatedKg, 0)

                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setSelectedDate(key)}
                          className={`rounded-none border p-4 text-left transition-all ${
                            selected ? 'border-slate-900 bg-slate-900 text-white shadow-lg shadow-slate-200' : 'border-slate-200 bg-white hover:border-slate-900'
                          }`}
                        >
                          <p className={`text-xs font-semibold ${selected ? 'text-white/70' : 'text-slate-500'}`}>{WEEKDAYS[(date.getDay() + 6) % 7]}</p>
                          <p className={`mt-1 text-base font-semibold ${selected ? 'text-white' : 'text-slate-900'}`}>{formatShortDate(date)}</p>
                          <div className="mt-5 space-y-2">
                            <p className={`text-sm ${selected ? 'text-white/80' : 'text-slate-500'}`}>{items.length} misi</p>
                            <p className={`text-sm font-semibold ${selected ? 'text-white' : 'text-slate-900'}`}>
                              {(totalKg / 1000).toLocaleString('id-ID', { maximumFractionDigits: 1 })} ton
                            </p>
                            {items.slice(0, 2).map((item) => (
                              <div key={item.id} className={`rounded-none px-2 py-1 text-[11px] ${selected ? 'bg-white/10 text-white' : 'bg-slate-100 text-slate-600'}`}>
                                {item.driver}
                              </div>
                            ))}
                          </div>
                        </button>
                      )
                    })}
                  </div>
                )}

                {viewMode === 'day' && (
                  <div className="grid gap-3">
                    {selectedDayMissions.length === 0 ? (
                      <div className="rounded-none border border-dashed border-slate-200 bg-slate-50 px-4 py-10 text-center text-sm text-slate-500">
                        Tidak ada pickup pada hari ini.
                      </div>
                    ) : (
                      selectedDayMissions.map((mission) => (
                        <div key={mission.id} className="rounded-none border border-slate-200 bg-white p-4">
                          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                            <div>
                              <p className="text-sm font-black text-slate-900">{mission.producer}</p>
                              <p className="mt-1 text-sm text-slate-500">{mission.locationDetail}</p>
                            </div>
                            <Badge variant="outline" className={`rounded-none text-[10px] font-black uppercase ${statusTone(mission.status)}`}>
                              {statusLabel(mission.status)}
                            </Badge>
                          </div>
                          <div className="mt-4 grid gap-2 text-sm text-slate-600">
                            <p className="flex items-center gap-2"><Clock className="h-4 w-4 text-slate-400" />{mission.timeRange}</p>
                            <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-slate-400" />{mission.hubName} • {mission.villageName}</p>
                            <p className="flex items-center gap-2"><User className="h-4 w-4 text-slate-400" />{mission.driver}</p>
                            <p className="flex items-center gap-2"><Phone className="h-4 w-4 text-slate-400" />{mission.driverPhone}</p>
                          </div>
                          <div className="mt-4 flex flex-wrap gap-2">
                            {mission.pickupItems.map((item) => (
                              <Badge key={item} className="rounded-none border border-slate-100 bg-slate-50 text-slate-600 text-[10px] font-black shadow-none">
                                <Package className="mr-1 h-3 w-3" />
                                {item}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        <div className="grid gap-5 xl:col-span-2 xl:grid-cols-[0.85fr_1.15fr]">
          <Card className="border-none bg-white shadow-sm overflow-hidden rounded-none">
            <div className="h-1 w-full bg-blue-500" />
            <CardHeader className="p-4 border-b border-slate-50">
              <CardTitle className="text-[10px] font-black uppercase tracking-widest text-slate-900">Ringkasan Periode</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-3 p-4">
              {[
                ['Periode Aktif', activeLabel],
                ['Total Pickup', `${periodMissions.length} misi`],
                ['Volume Pickup', `${(periodMissions.reduce((sum, mission) => sum + mission.estimatedKg, 0) / 1000).toLocaleString('id-ID', { maximumFractionDigits: 1 })} ton`],
                ['Operator Bertugas', `${driverRoster.length} personel`],
              ].map(([label, value]) => (
                <div key={String(label)} className="rounded-none border border-slate-100 bg-slate-50 p-4">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
                  <p className="mt-1 text-sm font-black text-slate-900">{value}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="border-none shadow-xl bg-slate-950 text-white overflow-hidden rounded-none">
            <CardHeader className="p-4 border-b border-white/5 bg-slate-900/50">
              <div className="flex items-center justify-between">
                <CardTitle className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                  <ShieldAlert className="h-4 w-4 text-emerald-500" /> Operasi Jaringan
                </CardTitle>
                <div className="flex items-center gap-1.5">
                  <div className="h-1 w-1 bg-emerald-500 rounded-full animate-ping" />
                  <span className="text-[9px] font-black text-emerald-500 tracking-widest">LIVE</span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-white/5">
                {driverRoster.map((driver) => (
                  <div key={`${driver.name}-${driver.phone}`} className="p-4 hover:bg-white/5 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`h-8 w-8 rounded-none flex items-center justify-center font-black text-[10px] ${driver.underway > 0 ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-500'}`}>
                        {driver.name.split(' ')[1]?.[0] || driver.name[0]}
                      </div>
                      <div className="flex-1">
                        <p className="text-[10px] font-black text-slate-200 uppercase tracking-tight">{driver.name}</p>
                        <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">{driver.vehicle} • {driver.phone}</p>
                      </div>
                      <Badge className={`h-4 text-[8px] font-black px-1 rounded-none border-none tracking-tighter ${driver.underway > 0 ? 'bg-emerald-900/40 text-emerald-400' : 'bg-slate-800 text-slate-500'}`}>
                        {driver.tasks} tugas
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-4 bg-white/5 border-t border-white/5">
                <Button
                  variant="ghost"
                  className="w-full text-[10px] font-black text-slate-500 hover:text-white uppercase tracking-widest h-9 rounded-none"
                  onClick={() =>
                    toast({
                      title: 'Pusat Audit',
                      description: 'Memuat dispatcher personel untuk jadwal pickup aktif.',
                    })
                  }
                >
                  Analitik Personel Lengkap
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="border-none bg-white shadow-sm overflow-hidden rounded-none">
        <div className="h-1 w-full bg-slate-900" />
        <CardHeader className="p-6 border-b border-slate-50">
          <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-900">Manifest Jadwal Pickup</CardTitle>
          <CardDescription className="text-[10px] font-bold text-slate-500 uppercase">Ringkasan pickup pada periode aktif</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 p-4">
          {periodMissions.slice(0, 8).map((mission) => (
            <div key={mission.id} className="grid gap-4 rounded-none border border-slate-100 bg-white p-4 lg:grid-cols-[0.95fr_1.3fr_0.8fr_auto]">
              <div>
                <p className="text-sm font-black text-slate-900">{formatLongDate(parseDate(mission.date))}</p>
                <p className="mt-1 text-sm text-slate-500">{mission.timeRange}</p>
              </div>
              <div>
                <p className="text-sm font-black text-slate-900">{mission.producer}</p>
                <p className="mt-1 text-sm text-slate-500">{mission.locationDetail} • {mission.hubName}</p>
                <p className="mt-1 text-sm text-slate-500">{mission.cooperativeName}</p>
              </div>
              <div>
                <p className="text-sm font-black text-slate-900">{(mission.estimatedKg / 1000).toLocaleString('id-ID', { maximumFractionDigits: 1 })} ton</p>
                <p className="mt-1 text-sm text-slate-500">{mission.driver}</p>
                <p className="mt-1 text-sm text-slate-500">{mission.vehicle}</p>
              </div>
              <div className="flex items-start justify-end">
                <Badge variant="outline" className={`rounded-none text-[10px] font-black uppercase ${statusTone(mission.status)}`}>
                  {statusLabel(mission.status)}
                </Badge>
              </div>
            </div>
          ))}
          {periodMissions.length > 8 && (
            <p className="text-sm text-slate-500">Menampilkan 8 dari {periodMissions.length} jadwal pickup pada periode ini.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
