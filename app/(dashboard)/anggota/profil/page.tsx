'use client'

import { useMemo, useState } from 'react'
import {
  Activity,
  Download,
  History,
  Mail,
  Phone,
  Search,
  ShieldCheck,
  UserRound,
} from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '@/lib/auth/use-auth'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { KementerianFilterBar } from '@/components/dashboard/kementerian-filter-bar'
import {
  filterProfilesByScope,
  resolveOperationalFilters,
} from '@/lib/cross-entity-operations'
import type { ScopeFilters } from '@/lib/kementerian-dashboard-data'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

const toTitleCase = (value: string) =>
  value
    .replace(/[_-]+/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase())

function statusTone(status: string) {
  if (status === 'aktif') return 'bg-emerald-100 text-emerald-700'
  if (status === 'review') return 'bg-amber-100 text-amber-700'
  return 'bg-rose-100 text-rose-700'
}

function statusLabel(status: string) {
  if (status === 'aktif') return 'AKTIF'
  if (status === 'review') return 'TINJAUAN'
  if (status === 'audit') return 'AUDIT'
  return status.toUpperCase()
}

export default function MemberProfilPage() {
  const { user } = useAuth()
  const isKementerian = user?.role === 'kementerian' || user?.role === 'sysadmin'

  const [search, setSearch] = useState('')
  const [selectedProfileId, setSelectedProfileId] = useState<string>('')
  const [filters, setFilters] = useState<ScopeFilters>({
    provinceId: 'all',
    regionId: 'all',
    villageId: 'all',
    cooperativeId: 'all',
    commodityId: 'all',
  })

  const scaleFactor = useMemo(() => {
    if (filters.cooperativeId !== 'all') return 0.05
    if (filters.villageId !== 'all') return 0.1
    if (filters.regionId !== 'all') return 0.25
    if (filters.provinceId !== 'all') return 0.5
    return 1
  }, [filters])

  const scopedFilters = useMemo(() => resolveOperationalFilters(user!, filters), [user, filters])
  const directory = useMemo(() => {
    return filterProfilesByScope(scopedFilters).filter((profile) => {
      const keyword = search.toLowerCase()
      return (
        profile.name.toLowerCase().includes(keyword) ||
        profile.cooperativeName.toLowerCase().includes(keyword) ||
        profile.role.toLowerCase().includes(keyword)
      )
    })
  }, [scopedFilters, search])

  const healthStats = useMemo(() => {
    const baseTotal = 1250 * scaleFactor
    return {
      active: Math.round(baseTotal * 0.85),
      review: Math.round(baseTotal * 0.1),
      audit: Math.round(baseTotal * 0.05),
      utilization: 92,
    }
  }, [scaleFactor])

  const activeProfile = useMemo(
    () => directory.find((profile) => profile.id === selectedProfileId) ?? directory[0],
    [directory, selectedProfileId],
  )

  if (!user) return null

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 rounded-none bg-slate-900 flex items-center justify-center shadow-xl">
            <UserRound className="h-7 w-7 text-emerald-500" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Audit Profil & Behavior</h1>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">
              Manajemen Identitas Dan Integritas Akun Lintas Entitas Koperasi
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast.success('Profil berhasil diekspor untuk kebutuhan audit nasional')}
            className="h-10 rounded-none border-2 border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-600 shadow-none"
          >
            <Download className="mr-2 h-4 w-4 text-slate-400" />
            Eksport Profil
          </Button>
          <Button
            size="sm"
            onClick={() => toast.success('Audit keamanan profil dimulai')}
            className="h-10 rounded-none bg-slate-900 px-6 text-[10px] font-black uppercase tracking-widest text-white shadow-xl hover:bg-slate-800 transition-all"
          >
            <ShieldCheck className="mr-2 h-4 w-4 text-emerald-400" />
            Jalankan Audit Keamanan
          </Button>
        </div>
      </div>

      {isKementerian && <KementerianFilterBar filters={filters} setFilters={setFilters} />}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Akun Aktif', value: healthStats.active.toLocaleString(), sub: 'Terverifikasi Sistem', tone: 'slate' },
          { label: 'Perlu Review', value: healthStats.review.toLocaleString(), sub: 'Jadwal Follow-Up', tone: 'amber' },
          { label: 'Butuh Audit', value: healthStats.audit.toLocaleString(), sub: 'Pending Verifikasi', tone: 'rose' },
          { label: 'Indeks Kepatuhan', value: `${healthStats.utilization}%`, sub: 'Skor Integritas Data', tone: 'blue' },
        ].map((stat, index) => (
          <Card key={index} className="rounded-none border-none bg-white shadow-sm overflow-hidden border-t-4 border-t-slate-900">
            <div className={`absolute top-0 left-0 h-1 w-full ${stat.tone === 'rose' ? 'bg-rose-500' : stat.tone === 'blue' ? 'bg-blue-500' : stat.tone === 'amber' ? 'bg-amber-500' : 'bg-slate-900'}`} />
            <CardHeader className="p-4 pb-2">
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{stat.label}</p>
              <CardTitle className="mt-1 text-2xl font-black text-slate-900">{stat.value}</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="text-[10px] font-black uppercase tracking-tighter text-slate-500">{stat.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="rounded-none border-none shadow-sm bg-slate-50/50">
        <CardContent className="grid gap-4 p-4 lg:grid-cols-[1fr_320px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Cari nama, koperasi, atau role strategis..."
              className="rounded-none h-11 border-slate-200 pl-10 font-semibold focus:ring-1 focus:ring-slate-900 shadow-none"
            />
          </div>
          <Select value={selectedProfileId} onValueChange={setSelectedProfileId}>
            <SelectTrigger className="rounded-none h-11 border-slate-200 bg-white font-black text-[10px] uppercase tracking-widest shadow-none">
              <SelectValue placeholder="PILIH PROFIL UNTUK AUDIT" />
            </SelectTrigger>
            <SelectContent className="rounded-none font-black text-[10px] uppercase tracking-widest">
              {directory.slice(0, 20).map((profile) => (
                <SelectItem key={profile.id} value={profile.id}>
                  {profile.name.toUpperCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        {activeProfile && (
          <Card className="rounded-none border-none shadow-sm overflow-hidden border-t-4 border-t-slate-900">
            <CardHeader className="border-b border-slate-50 p-6 bg-slate-50/30">
              <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-900">Detail Audit Profil</CardTitle>
              <CardDescription className="text-[10px] font-bold uppercase text-slate-500">
                Ringkasan Profil Utama Dan Jejak Digital Akun Terpilih
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 p-6">
              <div className="flex items-start gap-6 rounded-none border border-slate-100 bg-slate-50 p-6 shadow-inner">
                <div className="flex h-20 w-20 items-center justify-center rounded-none border border-slate-200 bg-white p-5 shadow-sm">
                  <UserRound className="h-10 w-10 text-slate-900" />
                </div>
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="text-2xl font-black tracking-tight text-slate-900 uppercase">{activeProfile.name}</p>
                    <Badge className={`h-6 rounded-none border-none px-2 text-[10px] font-black uppercase tracking-widest ${statusTone(activeProfile.status)} shadow-sm`}>
                      {statusLabel(activeProfile.status)}
                    </Badge>
                  </div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 bg-emerald-50 px-2 py-0.5 w-fit border border-emerald-100">{activeProfile.role}</p>
                  <p className="text-sm font-black text-slate-900 uppercase">
                    {activeProfile.cooperativeName} · {activeProfile.regionName}
                  </p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {[
                  { icon: Mail, label: 'Alamat Email', value: activeProfile.email },
                  { icon: Phone, label: 'Kontak Seluler', value: activeProfile.phone },
                  { icon: Activity, label: 'Wilayah Operasional', value: `${activeProfile.villageName}, ${activeProfile.regionName}` },
                  { icon: History, label: 'Aktivitas Terakhir', value: activeProfile.lastActivity },
                ].map((info, idx) => (
                  <div key={idx} className="rounded-none border border-slate-100 bg-white p-4 transition-all hover:border-slate-900 group shadow-sm">
                    <div className="mb-2 flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-slate-400 group-hover:text-slate-900 transition-colors">
                      <info.icon className="h-3 w-3" />
                      {info.label}
                    </div>
                    <p className="text-xs font-black text-slate-900 uppercase tracking-tight">{info.value}</p>
                  </div>
                ))}
              </div>

              <div className="space-y-4 border-t border-slate-100 pt-6">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-900">Daftar Profil Lintas Scope</p>
                  <p className="text-[9px] font-bold uppercase text-slate-500 mt-1">
                    Akses Langsung Ke Profil Lain Dalam Jangkauan Monitoring Anda.
                  </p>
                </div>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-slate-50">
                      <TableRow className="border-slate-100 hover:bg-transparent">
                        <TableHead className="text-[9px] font-black uppercase tracking-widest h-10">Nama Profil</TableHead>
                        <TableHead className="text-[9px] font-black uppercase tracking-widest h-10">Koperasi</TableHead>
                        <TableHead className="text-[9px] font-black uppercase tracking-widest h-10">Update</TableHead>
                        <TableHead className="text-[9px] font-black uppercase tracking-widest h-10">Status</TableHead>
                        <TableHead className="text-right text-[9px] font-black uppercase tracking-widest h-10">Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody className="[&_tr]:border-slate-100">
                      {directory.slice(0, 8).map((profile) => (
                        <TableRow key={profile.id} className="hover:bg-slate-50/50 transition-colors">
                          <TableCell className="font-black text-xs text-slate-900 uppercase tracking-tight">{profile.name}</TableCell>
                          <TableCell className="text-[10px] font-bold text-slate-500 uppercase">{profile.cooperativeName}</TableCell>
                          <TableCell className="text-[10px] font-bold text-slate-500 uppercase">{profile.lastActivity}</TableCell>
                          <TableCell>
                            <Badge className={`h-5 rounded-none border-none px-2 text-[8px] font-black uppercase tracking-widest ${statusTone(profile.status)} shadow-none`}>
                              {statusLabel(profile.status)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="outline"
                              size="sm"
                              className="h-7 rounded-none border-slate-200 text-[9px] font-black uppercase tracking-widest hover:bg-slate-900 hover:text-white transition-all shadow-none"
                              onClick={() => setSelectedProfileId(profile.id)}
                            >
                              AUDIT
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="rounded-none border-none shadow-sm overflow-hidden border-t-4 border-t-blue-500">
          <CardHeader className="border-b border-slate-50 p-6 bg-slate-50/30">
            <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-900">Matriks Kepatuhan & Akses</CardTitle>
            <CardDescription className="text-[10px] font-bold uppercase text-slate-500">
              Ringkasan Kepatuhan Protokol Keamanan Profil Akun
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 p-6">
            {[
              {
                icon: ShieldCheck,
                title: 'Otorisasi Scope',
                description: `Hak akses mengikuti protokol monitoring nasional berbasis role ${activeProfile?.role.toUpperCase()}.`,
                tone: 'blue',
              },
              {
                icon: Activity,
                title: 'Cadence Aktivitas',
                description: `Pola interaksi terdeteksi konsisten pada node ${activeProfile?.cooperativeName.toUpperCase()}.`,
                tone: 'emerald',
              },
              {
                icon: History,
                title: 'Log Integritas KYC',
                description: 'Verifikasi identitas terakhir tervalidasi pada siklus audit kementerian periode 2026.',
                tone: 'slate',
              },
            ].map((item) => (
              <div key={item.title} className="rounded-none border-l-4 border-l-slate-900 bg-slate-50 p-4 shadow-sm border border-slate-100">
                <div className="flex items-start gap-4">
                  <div className="shrink-0 rounded-none border border-slate-200 bg-white p-3 shadow-sm">
                    <item.icon className={`h-5 w-5 ${item.tone === 'blue' ? 'text-blue-600' : item.tone === 'emerald' ? 'text-emerald-600' : 'text-slate-900'}`} />
                  </div>
                  <div>
                    <p className="mb-1 text-[10px] font-black uppercase tracking-widest text-slate-900">{item.title}</p>
                    <p className="text-[11px] font-bold uppercase leading-relaxed text-slate-500 tracking-tight">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}

            <div className="border-t border-slate-100 pt-6">
              <p className="mb-4 text-[10px] font-black uppercase tracking-widest text-slate-900">Direktori Ringkas Wilayah</p>
              <div className="space-y-2">
                {directory.slice(0, 5).map((profile) => (
                  <button
                    key={profile.id}
                    type="button"
                    onClick={() => setSelectedProfileId(profile.id)}
                    className="flex w-full items-center justify-between rounded-none border border-slate-100 bg-white p-3 text-left transition-all hover:border-slate-900 hover:shadow-sm group"
                  >
                    <div>
                      <p className="text-xs font-black text-slate-900 uppercase group-hover:text-emerald-600 transition-colors">{profile.name}</p>
                      <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400">{profile.cooperativeName}</p>
                    </div>
                    <Badge className="h-5 rounded-none border-none bg-slate-100 px-2 text-[8px] font-black uppercase tracking-widest text-slate-600 shadow-none">
                      {statusLabel(profile.status)}
                    </Badge>
                  </button>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
