'use client'

import { useMemo, useState } from 'react'
import { Activity, Mail, Phone, Search, ShieldCheck, UserRound, Users } from 'lucide-react'
import { useAuth } from '@/lib/auth/use-auth'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { KementerianFilterBar } from '@/components/dashboard/kementerian-filter-bar'
import {
  filterProfilesByScope,
  getScopeCaption,
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

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  })
}

function statusTone(status: string) {
  if (status === 'aktif') return 'bg-emerald-50 text-emerald-700 border-emerald-200'
  if (status === 'review') return 'bg-amber-50 text-amber-700 border-amber-200'
  return 'bg-rose-50 text-rose-700 border-rose-200'
}

function toTitleCaseLabel(value: string) {
  return value
    .replace(/[_-]+/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase())
}

function createFallbackProfile(user: NonNullable<ReturnType<typeof useAuth>['user']>) {
  return {
    id: user.id,
    name: user.name,
    role: 'Akun Operasional',
    email: user.email,
    phone: '-',
    provinceName: user.provinceName ?? 'Nasional',
    regionName: user.districtName ?? 'Wilayah Kerja',
    villageName: user.koperasiName ?? 'Unit Kerja',
    cooperativeName: user.koperasiName ?? 'Unit Kerja',
    status: 'aktif' as const,
    joinedAt: '2026-01-10',
    lastActivity: '2026-04-06',
  }
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

  if (!user) return null

  const scopedFilters = resolveOperationalFilters(user, filters)
  const directory = filterProfilesByScope(scopedFilters).filter((profile) => {
    const keyword = search.toLowerCase()
    return (
      profile.name.toLowerCase().includes(keyword) ||
      profile.cooperativeName.toLowerCase().includes(keyword) ||
      profile.role.toLowerCase().includes(keyword)
    )
  })

  const fallbackProfile = createFallbackProfile(user)
  const activeProfile =
    directory.find((profile) => profile.id === selectedProfileId) ??
    (isKementerian ? directory[0] : undefined) ??
    fallbackProfile

  const healthStats = useMemo(() => {
    const total = directory.length || 1
    return {
      active: directory.filter((profile) => profile.status === 'aktif').length,
      review: directory.filter((profile) => profile.status === 'review').length,
      audit: directory.filter((profile) => profile.status === 'audit').length,
      utilization: Math.round(((directory.filter((profile) => profile.status === 'aktif').length || 1) / total) * 100),
    }
  }, [directory])

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Badge className="w-fit border border-rose-200 bg-rose-50 text-rose-700">Profil & Behavior</Badge>
        <div>
          <h1 className="text-slate-900">{isKementerian ? 'Direktori Profil Lintas Entitas' : 'Profil Akun'}</h1>
          <p className="text-muted-foreground">
            Tampilan profil terang dengan ringkasan akses dan perilaku akun untuk {getScopeCaption(scopedFilters)}.
          </p>
        </div>
      </div>

      {isKementerian && <KementerianFilterBar filters={filters} setFilters={setFilters} />}

      <Card className="border-slate-200 bg-white">
        <CardContent className="grid gap-3 p-4 lg:grid-cols-[1.1fr_280px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Cari nama akun, koperasi, atau jabatan"
              className="pl-9"
            />
          </div>
          {isKementerian && (
            <Select value={selectedProfileId} onValueChange={setSelectedProfileId}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih profil" />
              </SelectTrigger>
              <SelectContent>
                {directory.map((profile) => (
                  <SelectItem key={profile.id} value={profile.id}>
                    {profile.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="border-slate-200 bg-white">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Akun Aktif</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{healthStats.active}</p>
            <p className="mt-2 text-sm text-muted-foreground">Dalam scope filter saat ini</p>
          </CardContent>
        </Card>
        <Card className="border-slate-200 bg-white">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Perlu Review</p>
            <p className="mt-2 text-3xl font-semibold text-amber-600">{healthStats.review}</p>
            <p className="mt-2 text-sm text-muted-foreground">Akun dengan follow-up terjadwal</p>
          </CardContent>
        </Card>
        <Card className="border-slate-200 bg-white">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Butuh Audit</p>
            <p className="mt-2 text-3xl font-semibold text-rose-600">{healthStats.audit}</p>
            <p className="mt-2 text-sm text-muted-foreground">Akun yang menunggu verifikasi lanjutan</p>
          </CardContent>
        </Card>
        <Card className="border-slate-200 bg-white">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Health Coverage</p>
            <p className="mt-2 text-3xl font-semibold text-blue-600">{healthStats.utilization}%</p>
            <p className="mt-2 text-sm text-muted-foreground">Rasio akun aktif terhadap direktori</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-5 xl:grid-cols-[0.9fr_1.1fr]">
        <Card className="border-slate-200 bg-white">
          <CardHeader>
            <CardTitle>Profil Terpilih</CardTitle>
            <CardDescription>Seluruh blok gelap di halaman profil diganti ke kartu terang dengan hierarki teks yang lebih mudah dibaca.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex items-start gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="rounded-2xl bg-white p-4 shadow-sm">
                <UserRound className="h-7 w-7 text-rose-600" />
              </div>
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-xl font-semibold text-slate-900">{activeProfile.name}</p>
                  <Badge variant="outline" className={statusTone(activeProfile.status)}>
                    {activeProfile.status}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{activeProfile.role}</p>
                <p className="text-sm text-muted-foreground">
                  {activeProfile.cooperativeName} · {activeProfile.regionName}
                </p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span>Email</span>
                </div>
                <p className="mt-2 font-medium text-slate-900">{activeProfile.email}</p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span>Telepon</span>
                </div>
                <p className="mt-2 font-medium text-slate-900">{activeProfile.phone}</p>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-sm text-muted-foreground">Wilayah Kerja</p>
                <p className="mt-2 font-medium text-slate-900">
                  {activeProfile.villageName}, {activeProfile.regionName}
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="text-sm text-muted-foreground">Aktivitas Terakhir</p>
                <p className="mt-2 font-medium text-slate-900">{formatDate(activeProfile.lastActivity)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white">
          <CardHeader>
            <CardTitle>Behavior & Akses</CardTitle>
            <CardDescription>Ringkasan perilaku akun dibangun dari status direktori dan scope aktif, tanpa panel gelap terpisah.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              {
                icon: ShieldCheck,
                title: 'Status akses',
                description: `Hak akses mengikuti scope ${getScopeCaption(scopedFilters)} dan role ${toTitleCaseLabel(activeProfile.role)}.`,
              },
              {
                icon: Activity,
                title: 'Cadence aktivitas',
                description: `Aktivitas terakhir tercatat pada ${formatDate(activeProfile.lastActivity)} dengan status ${toTitleCaseLabel(activeProfile.status)}.`,
              },
              {
                icon: Users,
                title: 'Konteks entitas',
                description: `${directory.length || 1} akun berada dalam direktori yang sama dan ikut terfilter secara dinamis.`,
              },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-white p-3 shadow-sm">
                    <item.icon className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-slate-900">{item.title}</p>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}

            {isKementerian && (
              <div className="rounded-2xl border border-slate-200 bg-white p-4">
                <p className="font-medium text-slate-900">Direktori Scope Saat Ini</p>
                <div className="mt-3 space-y-2">
                  {directory.slice(0, 6).map((profile) => (
                    <div key={profile.id} className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
                      <div>
                        <p className="text-sm font-medium text-slate-900">{profile.name}</p>
                        <p className="text-sm text-muted-foreground">{profile.cooperativeName}</p>
                      </div>
                      <Badge variant="outline" className={statusTone(profile.status)}>
                        {toTitleCaseLabel(profile.status)}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
