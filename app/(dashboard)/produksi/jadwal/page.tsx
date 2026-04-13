'use client'

import { useMemo, useState } from 'react'
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  MapPin,
  PackageCheck,
  Truck,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { KementerianFilterBar } from '@/components/dashboard/kementerian-filter-bar'
import { KEMENTERIAN_DASHBOARD_DATA, type ScopeFilters } from '@/lib/kementerian-dashboard-data'

type ViewMode = 'day' | 'week' | 'month' | 'year'
type Status = 'terkonfirmasi' | 'menunggu' | 'selesai'

type Schedule = {
  id: string
  date: string
  commodityId: string
  commodityName: string
  producer: string
  estimatedKg: number
  timeRange: string
  status: Status
  locationDetail: string
  pickupHub: string
  vehicle: string
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
  { value: 'year', label: 'Per Tahun' },
]

const COMMODITIES = [
  ['beras', 'Beras Premium IR64'],
  ['cabai', 'Cabai Merah Keriting'],
  ['jagung', 'Jagung Hibrida'],
  ['bawang', 'Bawang Merah Premium'],
] as const

const BLUEPRINTS: Array<
  [string, number, number, number, string, number, string, string, string, string, Status]
> = [
  ['JP001', -1, 0, 0, 'Kelompok Tani Lestari', 2400, '05.30 - 09.00', 'Hamparan sawah blok timur', 'Hub Rice Mill A', 'Truk Reefer 02', 'terkonfirmasi'],
  ['JP002', 0, 2, 1, 'Ibu Sri Wahyuni', 980, '06.00 - 08.30', 'Greenhouse sektor selatan', 'Hub Hortikultura Garut', 'Pickup Box 04', 'terkonfirmasi'],
  ['JP003', 1, 4, 2, 'Pak Bambang Nugroho', 3150, '07.00 - 11.30', 'Lahan panen jalur utara', 'Hub Pakan Delanggu', 'Tronton 01', 'menunggu'],
  ['JP004', 3, 6, 3, 'Kelompok Wanita Tani Maju', 1260, '06.30 - 09.30', 'Petak bawang lereng barat', 'Hub Sortir Kulon Progo', 'Van Pendingin 07', 'terkonfirmasi'],
  ['JP005', 5, 8, 0, 'Pak Rahmat Hidayat', 4200, '05.00 - 10.00', 'Persawahan aliran tengah', 'Hub Rice Mill Banjar', 'Truk Curah 03', 'terkonfirmasi'],
  ['JP006', 7, 10, 1, 'Pak Rizal Saputra', 760, '08.00 - 10.00', 'Kebun intensif cluster 5', 'Hub Distribusi Kutai', 'Pickup Box 11', 'menunggu'],
  ['JP007', 10, 12, 2, 'Koperasi Tani Maros', 2880, '06.00 - 10.45', 'Hamparan jagung blok tengah', 'Hub Pengering Maros', 'Truk Angkut 06', 'terkonfirmasi'],
  ['JP008', 12, 14, 3, 'Ibu Intan Fadilah', 1140, '07.30 - 10.00', 'Lahan kering cluster selatan', 'Hub Sortir Kupang', 'Pickup Box 09', 'selesai'],
  ['JP009', 15, 16, 0, 'Pak Yoseph Mandacan', 1600, '06.00 - 09.15', 'Sawah rawa dataran barat', 'Hub Prafi Barat', 'Truk Medium 05', 'terkonfirmasi'],
  ['JP010', 18, 3, 1, 'Pak Hendra Wijaya', 890, '05.45 - 08.00', 'Greenhouse intensif utama', 'Hub Hortikultura Cikondang', 'Pickup Box 02', 'terkonfirmasi'],
  ['JP011', 23, 5, 2, 'Pak Slamet Widodo', 2475, '06.15 - 11.00', 'Lahan benih jalur selatan', 'Hub Delanggu Utama', 'Tronton 04', 'menunggu'],
  ['JP012', 28, 7, 3, 'Kelompok Tani Hargotirto', 1050, '07.00 - 09.30', 'Terasering bawang jalur atas', 'Hub Sortir Banjaroyo', 'Van Pendingin 08', 'terkonfirmasi'],
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
  return new Intl.DateTimeFormat('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(date)
}

function formatShortDate(date: Date) {
  return new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'short' }).format(date)
}

function formatMonthLabel(date: Date) {
  return new Intl.DateTimeFormat('id-ID', { month: 'long', year: 'numeric' }).format(date)
}

function formatMonthOnly(date: Date) {
  return new Intl.DateTimeFormat('id-ID', { month: 'long' }).format(date)
}

function statusTone(status: Status) {
  if (status === 'selesai') return 'border-blue-200 bg-blue-50 text-blue-700'
  if (status === 'terkonfirmasi') return 'border-emerald-200 bg-emerald-50 text-emerald-700'
  return 'border-amber-200 bg-amber-50 text-amber-700'
}

function statusLabel(status: Status) {
  if (status === 'selesai') return 'Selesai'
  if (status === 'terkonfirmasi') return 'Terkonfirmasi'
  return 'Menunggu'
}

export default function JadwalPanenPage() {
  const [todayKey] = useState(() => getJakartaTodayKey())
  const [filters, setFilters] = useState<ScopeFilters>({
    provinceId: 'all',
    regionId: 'all',
    villageId: 'all',
    cooperativeId: 'all',
    commodityId: 'all',
  })
  const [search, setSearch] = useState('')
  const [viewMode, setViewMode] = useState<ViewMode>('month')
  const [selectedDate, setSelectedDate] = useState(todayKey)

  const schedules = useMemo<Schedule[]>(() => {
    const start = parseDate(todayKey)
    const provinceMap = new Map(KEMENTERIAN_DASHBOARD_DATA.provinceOptions.map((item) => [item.id, item.label]))
    const regionMap = new Map(KEMENTERIAN_DASHBOARD_DATA.regionOptions.map((item) => [item.id, item.label]))
    const villageMap = new Map(KEMENTERIAN_DASHBOARD_DATA.villageOptions.map((item) => [item.id, item.label]))

    return BLUEPRINTS.map(([id, offset, locationIndex, commodityIndex, producer, estimatedKg, timeRange, locationDetail, pickupHub, vehicle, status]) => {
      const cooperative =
        KEMENTERIAN_DASHBOARD_DATA.cooperativeOptions[
          locationIndex % KEMENTERIAN_DASHBOARD_DATA.cooperativeOptions.length
        ]
      const [commodityId, commodityName] = COMMODITIES[commodityIndex]

      return {
        id,
        date: formatDateKey(addDays(start, offset)),
        commodityId,
        commodityName,
        producer,
        estimatedKg,
        timeRange,
        status,
        locationDetail,
        pickupHub,
        vehicle,
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

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase()

    return schedules.filter((item) => {
      const matchesSearch =
        keyword.length === 0 ||
        [item.commodityName, item.producer, item.cooperativeName, item.villageName, item.regionName]
          .some((value) => value.toLowerCase().includes(keyword))

      return (
        matchesSearch &&
        (filters.provinceId === 'all' || item.provinceId === filters.provinceId) &&
        (filters.regionId === 'all' || item.regionId === filters.regionId) &&
        (filters.villageId === 'all' || item.villageId === filters.villageId) &&
        (filters.cooperativeId === 'all' || item.cooperativeId === filters.cooperativeId) &&
        (filters.commodityId === 'all' || item.commodityId === filters.commodityId)
      )
    })
  }, [filters, schedules, search])

  const selectedDateObject = useMemo(() => parseDate(selectedDate), [selectedDate])

  const range = useMemo(() => {
    const start =
      viewMode === 'day'
        ? selectedDateObject
        : viewMode === 'week'
          ? startOfWeek(selectedDateObject)
          : viewMode === 'month'
            ? new Date(selectedDateObject.getFullYear(), selectedDateObject.getMonth(), 1)
            : new Date(selectedDateObject.getFullYear(), 0, 1)

    const end =
      viewMode === 'day'
        ? selectedDateObject
        : viewMode === 'week'
          ? addDays(start, 6)
          : viewMode === 'month'
            ? new Date(selectedDateObject.getFullYear(), selectedDateObject.getMonth() + 1, 0)
            : new Date(selectedDateObject.getFullYear(), 11, 31)

    return { start, end }
  }, [selectedDateObject, viewMode])

  const byDay = useMemo(() => {
    const map = new Map<string, Schedule[]>()
    for (const item of filtered) {
      const current = map.get(item.date) ?? []
      current.push(item)
      map.set(item.date, current)
    }
    return map
  }, [filtered])

  const selectedDayItems = useMemo(
    () => (byDay.get(selectedDate) ?? []).sort((a, b) => a.timeRange.localeCompare(b.timeRange)),
    [byDay, selectedDate],
  )

  const periodItems = useMemo(() => {
    return filtered
      .filter((item) => {
        const date = parseDate(item.date)
        return date >= range.start && date <= range.end
      })
      .sort((a, b) => a.date.localeCompare(b.date) || a.timeRange.localeCompare(b.timeRange))
  }, [filtered, range.end, range.start])

  const monthGrid = useMemo(() => {
    const first = new Date(selectedDateObject.getFullYear(), selectedDateObject.getMonth(), 1)
    const gridStart = startOfWeek(first)
    return Array.from({ length: 42 }, (_, index) => addDays(gridStart, index))
  }, [selectedDateObject])

  const weekGrid = useMemo(() => {
    const weekStart = startOfWeek(selectedDateObject)
    return Array.from({ length: 7 }, (_, index) => addDays(weekStart, index))
  }, [selectedDateObject])

  const monthCards = useMemo(() => {
    return Array.from({ length: 12 }, (_, index) => {
      const monthDate = new Date(selectedDateObject.getFullYear(), index, 1)
      const items = filtered.filter((item) => {
        const date = parseDate(item.date)
        return date.getFullYear() === monthDate.getFullYear() && date.getMonth() === monthDate.getMonth()
      })
      return {
        key: formatDateKey(monthDate),
        monthDate,
        count: items.length,
        volume: items.reduce((sum, item) => sum + item.estimatedKg, 0),
      }
    })
  }, [filtered, selectedDateObject])

  const stats = useMemo(() => {
    const totalKg = filtered.reduce((sum, item) => sum + item.estimatedKg, 0)
    return {
      total: filtered.length,
      tonnage: totalKg / 1000,
      wilayah: new Set(filtered.map((item) => item.regionId)).size,
      confirmed: filtered.filter((item) => item.status !== 'menunggu').length,
    }
  }, [filtered])

  const activeLabel =
    viewMode === 'day'
      ? formatLongDate(selectedDateObject)
      : viewMode === 'week'
        ? `${formatShortDate(range.start)} - ${formatLongDate(range.end)}`
        : viewMode === 'month'
          ? formatMonthLabel(selectedDateObject)
          : String(selectedDateObject.getFullYear())

  function shift(direction: number) {
    setSelectedDate((current) => {
      const date = parseDate(current)
      if (viewMode === 'day') return formatDateKey(addDays(date, direction))
      if (viewMode === 'week') return formatDateKey(addDays(date, direction * 7))
      if (viewMode === 'month') return formatDateKey(addMonths(date, direction))
      return formatDateKey(new Date(date.getFullYear() + direction, date.getMonth(), date.getDate()))
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Jadwal Panen Terpadu</h1>
          <p className="text-[10px] font-black text-slate-500 mt-1 uppercase tracking-widest leading-relaxed">
            Kalender Panen Terkoordinasi • Monitoring Volume Proyeksi Nasional
          </p>
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
              } shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] transition-all`}
            >
              {option.label}
            </Button>
          ))}
        </div>
      </div>

      <KementerianFilterBar filters={filters} setFilters={setFilters} search={search} setSearch={setSearch} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Jadwal Aktif', value: stats.total.toLocaleString('id-ID'), sub: 'Batch Panen Terdaftar', icon: CalendarDays, tone: 'slate' },
          { label: 'Total Proyeksi', value: `${stats.tonnage.toLocaleString('id-ID', { maximumFractionDigits: 1 })} TON`, sub: 'Volume Panen Nasional', icon: PackageCheck, tone: 'emerald' },
          { label: 'Wilayah Aktif', value: stats.wilayah.toLocaleString('id-ID'), sub: 'Kabupaten Terdata', icon: MapPin, tone: 'blue' },
          { label: 'Terkonfirmasi', value: stats.confirmed.toLocaleString('id-ID'), sub: 'Siap Logistik', icon: Truck, tone: 'amber' },
        ].map((s, i) => (
          <Card key={i} className="border-none shadow-sm bg-white overflow-hidden rounded-none">
             <div className={`h-1 w-full ${
              s.tone === 'emerald' ? 'bg-emerald-500' : 
              s.tone === 'blue' ? 'bg-blue-500' : 
              s.tone === 'amber' ? 'bg-amber-500' : 'bg-slate-900'
            }`} />
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-10 w-10 rounded-none bg-slate-50 flex items-center justify-center shrink-0 shadow-inner">
                <s.icon className={`h-5 w-5 ${
                  s.tone === 'emerald' ? 'text-emerald-500' : 
                  s.tone === 'blue' ? 'text-blue-500' : 
                  s.tone === 'amber' ? 'text-amber-500' : 'text-slate-900'
                }`} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{s.label}</p>
                <div className="flex flex-col">
                  <span className="text-sm font-black text-slate-900 leading-tight">{s.value}</span>
                  <span className="text-[8px] font-bold text-slate-500 uppercase tracking-tighter">{s.sub}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Card className="rounded-none border-none shadow-sm overflow-hidden border-t-4 border-t-slate-900">
          <CardHeader className="border-b border-slate-100 bg-slate-50/70">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-1">
                <CardTitle className="text-sm font-black text-slate-900 uppercase tracking-tight">Kalender Operasional Nasional</CardTitle>
                <CardDescription className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Sinkronisasi Waktu Panen dan Pickup Logistik Real-Time
                </CardDescription>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <Button size="icon" variant="outline" onClick={() => shift(-1)} className="h-9 w-9 rounded-none border-slate-200">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="min-w-[190px] rounded-none border border-slate-200 bg-white px-4 py-2 text-center text-[10px] font-black uppercase tracking-widest text-slate-900 shadow-inner">
                  {activeLabel}
                </div>
                <Button size="icon" variant="outline" onClick={() => shift(1)} className="h-9 w-9 rounded-none border-slate-200">
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline" onClick={() => setSelectedDate(getJakartaTodayKey())} className="h-9 rounded-none border-slate-200 px-4 text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50">
                  Hari Ini
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4">
            {filtered.length === 0 ? (
              <div className="rounded-none border border-dashed border-slate-200 bg-slate-50 px-6 py-16 text-center">
                <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Belum ada jadwal pada cakupan ini.</p>
                <p className="mt-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Ubah filter untuk melihat kalender panen.</p>
              </div>
            ) : (
              <>
                {viewMode === 'month' && (
                  <div className="space-y-3">
                    <div className="grid grid-cols-7 gap-2">
                      {WEEKDAYS.map((label) => (
                        <div key={label} className="bg-slate-900 py-2 text-center text-[9px] font-black text-slate-400 uppercase tracking-widest">
                          {label}
                        </div>
                      ))}
                    </div>
                    <div className="grid grid-cols-7 gap-2">
                      {monthGrid.map((date) => {
                        const key = formatDateKey(date)
                        const items = byDay.get(key) ?? []
                        const selected = key === selectedDate

                        return (
                          <button
                            key={key}
                            type="button"
                            onClick={() => setSelectedDate(key)}
                            className={`min-h-[108px] rounded-none border p-2 text-left transition-all ${
                              selected
                                ? 'border-slate-900 bg-slate-900 text-white shadow-xl'
                                : sameMonth(date, selectedDateObject)
                                  ? 'border-slate-100 bg-white hover:border-slate-900'
                                  : 'border-slate-50 bg-slate-50 text-slate-300'
                            }`}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <span className={`text-[10px] font-black ${selected ? 'text-white' : 'text-slate-900'}`}>{date.getDate()}</span>
                              {key === todayKey && (
                                <Badge className={`rounded-none border-none px-1.5 text-[8px] font-black uppercase tracking-widest ${selected ? 'bg-white/20 text-white' : 'bg-emerald-50 text-emerald-700'}`}>
                                  T-DAY
                                </Badge>
                              )}
                            </div>
                            <div className="mt-4 space-y-1">
                              <p className={`text-[8px] font-black uppercase tracking-tighter ${selected ? 'text-white/60' : 'text-slate-400'}`}>
                                {items.length > 0 ? `${items.length} BATCH` : ''}
                              </p>
                              {items.slice(0, 2).map((item) => (
                                <div key={item.id} className={`rounded-none px-1.5 py-0.5 text-[8px] font-black uppercase tracking-tighter truncate ${selected ? 'bg-white/10 text-white' : 'bg-slate-50 text-slate-600 border border-slate-100'}`}>
                                  {item.commodityName}
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
                      const items = byDay.get(key) ?? []
                      const selected = key === selectedDate
                      const total = items.reduce((sum, item) => sum + item.estimatedKg, 0) / 1000

                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => setSelectedDate(key)}
                          className={`rounded-none border p-4 text-left transition-all ${
                            selected ? 'border-slate-900 bg-slate-900 text-white shadow-xl' : 'border-slate-100 bg-white hover:border-slate-900'
                          }`}
                        >
                          <p className={`text-[9px] font-black uppercase tracking-widest ${selected ? 'text-white/60' : 'text-slate-400'}`}>{WEEKDAYS[(date.getDay() + 6) % 7]}</p>
                          <p className={`mt-1 text-sm font-black uppercase tracking-tight ${selected ? 'text-white' : 'text-slate-900'}`}>{formatShortDate(date)}</p>
                          <p className={`mt-6 text-[9px] font-black uppercase tracking-widest ${selected ? 'text-white/70' : 'text-slate-500'}`}>{items.length} JADWAL</p>
                          <p className={`mt-1 text-xs font-black uppercase ${selected ? 'text-white' : 'text-slate-900'}`}>{total.toLocaleString('id-ID', { maximumFractionDigits: 1 })} TON</p>
                        </button>
                      )
                    })}
                  </div>
                )}

                {viewMode === 'day' && (
                  <div className="grid gap-3">
                    {selectedDayItems.length === 0 ? (
                      <div className="rounded-none border border-dashed border-slate-200 bg-slate-50 px-4 py-10 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Tidak ada panen pada hari ini.
                      </div>
                    ) : (
                      selectedDayItems.map((item) => (
                        <div key={item.id} className="rounded-none border border-slate-100 bg-white p-4 group hover:bg-slate-50 transition-all">
                          <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                            <div>
                              <p className="text-sm font-black text-slate-900 uppercase tracking-tight group-hover:text-emerald-600 transition-colors">{item.commodityName}</p>
                              <p className="mt-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.producer}</p>
                            </div>
                            <Badge variant="outline" className={`rounded-none text-[8px] font-black uppercase tracking-widest border-none h-5 px-2 ${statusTone(item.status)}`}>
                              {statusLabel(item.status)}
                            </Badge>
                          </div>
                          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="flex items-center gap-2 text-slate-600">
                               <Clock3 className="h-3.5 w-3.5 text-slate-300" />
                               <span className="text-[10px] font-black uppercase tracking-tighter">{item.timeRange}</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-600">
                               <MapPin className="h-3.5 w-3.5 text-slate-300" />
                               <span className="text-[10px] font-black uppercase tracking-tighter truncate">{item.locationDetail}</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-600">
                               <Truck className="h-3.5 w-3.5 text-slate-300" />
                               <span className="text-[10px] font-black uppercase tracking-tighter">{item.vehicle}</span>
                            </div>
                            <div className="flex items-center gap-2 text-slate-600">
                               <PackageCheck className="h-3.5 w-3.5 text-emerald-500" />
                               <span className="text-[10px] font-black uppercase tracking-tighter">{(item.estimatedKg / 1000).toFixed(1)} TON</span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {viewMode === 'year' && (
                  <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
                    {monthCards.map((item) => {
                      const active = item.monthDate.getMonth() === selectedDateObject.getMonth()

                      return (
                        <button
                          key={item.key}
                          type="button"
                          onClick={() => setSelectedDate(formatDateKey(new Date(selectedDateObject.getFullYear(), item.monthDate.getMonth(), 1)))}
                          className={`rounded-none border p-4 text-left transition-all ${
                            active ? 'border-slate-900 bg-slate-900 text-white shadow-xl' : 'border-slate-100 bg-white hover:border-slate-900'
                          }`}
                        >
                          <p className={`text-[10px] font-black uppercase tracking-widest ${active ? 'text-white/70' : 'text-slate-400'}`}>{formatMonthOnly(item.monthDate)}</p>
                          <p className={`mt-4 text-2xl font-black ${active ? 'text-white' : 'text-slate-900'}`}>{item.count}</p>
                          <p className={`text-[8px] font-black uppercase tracking-widest ${active ? 'text-white/60' : 'text-slate-400'}`}>BATCH PANEN</p>
                          <div className={`mt-4 rounded-none px-3 py-2 text-[10px] font-black uppercase tracking-widest border ${active ? 'bg-white/10 text-white border-white/20' : 'bg-slate-50 text-slate-600 border-slate-100'}`}>
                            {(item.volume / 1000).toLocaleString('id-ID', { maximumFractionDigits: 1 })} TON
                          </div>
                        </button>
                      )
                    })}
                  </div>
                )}
              </>
            )}
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card className="rounded-none border-none shadow-sm overflow-hidden border-t-4 border-t-emerald-500">
            <CardHeader className="border-b border-slate-100 bg-slate-50/70">
              <CardTitle className="text-sm font-black text-slate-900 uppercase tracking-tight">Ringkasan Periode Aktif</CardTitle>
              <CardDescription className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Metrik Agregat Hasil Panen Terpilih</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3 p-4">
              {[
                { label: 'Periode Terpilih', value: activeLabel, tone: 'slate' },
                { label: 'Volume Agregat', value: `${(periodItems.reduce((sum, item) => sum + item.estimatedKg, 0) / 1000).toLocaleString('id-ID', { maximumFractionDigits: 1 })} TON`, tone: 'emerald' },
                { label: 'Hari Penyerapan', value: `${new Set(periodItems.map((item) => item.date)).size} HARI`, tone: 'blue' },
                { label: 'Koperasi Kontributor', value: `${new Set(periodItems.map((item) => item.cooperativeId)).size} UNIT`, tone: 'slate' },
              ].map((s) => (
                <div key={s.label} className="rounded-none border border-slate-100 bg-white p-4 shadow-inner">
                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">{s.label}</p>
                  <p className={`mt-1 text-sm font-black uppercase tracking-tight ${s.tone === 'emerald' ? 'text-emerald-600' : 'text-slate-900'}`}>{s.value}</p>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="rounded-none border-none shadow-sm overflow-hidden border-t-4 border-t-blue-500">
            <CardHeader className="border-b border-slate-100 bg-slate-50/70">
              <CardTitle className="text-sm font-black text-slate-900 uppercase tracking-tight">Detail Agenda Harian</CardTitle>
              <CardDescription className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Monitoring Node Panen Spesifik</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3 p-4">
              <div className="rounded-none border border-slate-100 bg-slate-900 p-4 shadow-xl">
                <p className="text-[10px] font-black text-white uppercase tracking-widest">{formatLongDate(selectedDateObject)}</p>
                <p className="mt-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{selectedDayItems.length} Batch Aktif</p>
              </div>
              {selectedDayItems.length === 0 ? (
                <div className="rounded-none border border-dashed border-slate-200 bg-white px-4 py-8 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Tidak ada jadwal pada tanggal ini.
                </div>
              ) : (
                selectedDayItems.slice(0, 4).map((item) => (
                  <div key={item.id} className="rounded-none border border-slate-100 bg-white p-4 shadow-sm hover:bg-slate-50 transition-all">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <p className="text-sm font-black text-slate-900 uppercase tracking-tight">{item.commodityName}</p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{item.cooperativeName}</p>
                      </div>
                      <Badge variant="outline" className={`rounded-none text-[8px] font-black uppercase tracking-widest border-none h-5 px-2 ${statusTone(item.status)}`}>
                        {statusLabel(item.status)}
                      </Badge>
                    </div>
                    <div className="mt-4 flex flex-col gap-1">
                       <div className="flex items-center gap-2">
                          <Clock3 className="h-3 w-3 text-slate-300" />
                          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{item.timeRange}</span>
                       </div>
                       <div className="flex items-center gap-2">
                          <MapPin className="h-3 w-3 text-slate-300" />
                          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{item.villageName}, {item.regionName}</span>
                       </div>
                       <div className="flex items-center gap-2">
                          <PackageCheck className="h-3 w-3 text-emerald-500" />
                          <span className="text-[9px] font-black text-slate-900 uppercase tracking-widest">{(item.estimatedKg / 1000).toFixed(1)} TON</span>
                       </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <Card className="rounded-none border-none shadow-sm overflow-hidden">
        <CardHeader className="border-b border-slate-100 bg-slate-900">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div className="space-y-1">
              <CardTitle className="text-sm font-black text-white uppercase tracking-tight">Manifest Operasional Nasional</CardTitle>
              <CardDescription className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Logistik & Proyeksi Penyerapan Komoditas</CardDescription>
            </div>
            <Badge className="rounded-none border border-white/10 bg-white/5 text-white text-[10px] font-black uppercase tracking-widest px-3 h-7">
              {periodItems.length} JADWAL TERDATA
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-3 p-4">
          {periodItems.length === 0 ? (
            <div className="rounded-none border border-dashed border-slate-200 bg-slate-50 px-4 py-10 text-center text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Tidak ada manifest pada periode ini.
            </div>
          ) : (
            periodItems.slice(0, 10).map((item) => (
              <div key={item.id} className="grid gap-4 rounded-none border border-slate-100 bg-white p-4 lg:grid-cols-[0.9fr_1.3fr_0.8fr_auto] hover:bg-slate-50 transition-all shadow-sm">
                <div className="space-y-1">
                  <p className="text-xs font-black text-slate-900 uppercase tracking-tight">{formatLongDate(parseDate(item.date))}</p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{item.timeRange}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-black text-slate-900 uppercase tracking-tight">{item.commodityName}</p>
                  <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest leading-relaxed">
                    Produsen: {item.producer} • {item.locationDetail}
                  </p>
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                    {item.villageName}, {item.regionName}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-black text-slate-900 uppercase">{(item.estimatedKg / 1000).toLocaleString('id-ID', { maximumFractionDigits: 1 })} TON</p>
                  <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Armada: {item.vehicle}</p>
                  <p className="text-[9px] font-black text-blue-600 uppercase tracking-widest">via {item.pickupHub}</p>
                </div>
                <div className="flex items-start justify-end">
                  <Badge variant="outline" className={`rounded-none text-[8px] font-black uppercase tracking-widest border-none h-5 px-2 ${statusTone(item.status)}`}>
                    {statusLabel(item.status)}
                  </Badge>
                </div>
              </div>
            ))
          )}
          {periodItems.length > 10 && (
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest text-center mt-4">Menampilkan 10 dari {periodItems.length} jadwal pada periode ini.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
