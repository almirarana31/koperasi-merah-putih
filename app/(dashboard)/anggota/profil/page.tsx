'use client'

import { useMemo, useState } from 'react'
import { Activity, Mail, Phone, Search, ShieldCheck, UserRound, Users, History, FileText, Download } from 'lucide-react'
import { useAuth } from '@/lib/auth/use-auth'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
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
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

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
    return 1.0
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

  const activeProfile = useMemo(() => {
    return directory.find((profile) => profile.id === selectedProfileId) ?? directory[0]
  }, [directory, selectedProfileId])

  const handleAction = (action: string) => {
    toast.success(`Profil ${action} berhasil diverifikasi secara nasional`)
  }

  if (!user) return null

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Direktori Profil Nasional</h1>
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">
            Manajemen Identitas dan Perilaku Akun Lintas Entitas Koperasi
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleAction('Export')}
            className="h-10 rounded-none border-2 border-slate-200 text-[10px] font-black uppercase tracking-widest text-slate-600"
          >
            <Download className="mr-2 h-4 w-4" /> Export Data
          </Button>
          <Button 
            size="sm" 
            onClick={() => handleAction('Audit')}
            className="h-10 rounded-none bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest px-6"
          >
            <ShieldCheck className="mr-2 h-4 w-4 text-emerald-400" /> Audit Keamanan
          </Button>
        </div>
      </div>

      <KementerianFilterBar filters={filters} setFilters={setFilters} />

      {/* KPI Stats */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'AKUN AKTIF', value: healthStats.active.toLocaleString(), sub: 'TERVERIFIKASI SISTEM', tone: 'slate' },
          { label: 'PERLU REVIEW', value: healthStats.review.toLocaleString(), sub: 'JADWAL FOLLOW-UP', tone: 'amber' },
          { label: 'BUTUH AUDIT', value: healthStats.audit.toLocaleString(), sub: 'PENDING VERIFIKASI', tone: 'rose' },
          { label: 'INDEKS KEPATUHAN', value: `${healthStats.utilization}%`, sub: 'SKOR INTEGRITAS DATA', tone: 'blue' },
        ].map((stat, i) => (
          <Card key={i} className="rounded-none border-none bg-white shadow-sm overflow-hidden group">
            <div className={`h-1.5 w-full ${stat.tone === 'rose' ? 'bg-rose-500' : stat.tone === 'blue' ? 'bg-blue-500' : stat.tone === 'amber' ? 'bg-amber-500' : 'bg-slate-900'}`} />
            <CardHeader className="p-4 pb-2">
              <div className="flex justify-between items-start">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{stat.label}</p>
                <div className={`h-2 w-2 rounded-none ${stat.tone === 'rose' ? 'bg-rose-500' : stat.tone === 'blue' ? 'bg-blue-500' : stat.tone === 'amber' ? 'bg-amber-500' : 'bg-slate-900'}`} />
              </div>
              <CardTitle className="text-2xl font-black text-slate-900 mt-1">{stat.value}</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="text-[10px] font-black text-slate-500 mt-1 uppercase tracking-tighter">{stat.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search & Selector */}
      <Card className="rounded-none border-none shadow-sm bg-slate-50/50">
        <CardContent className="grid gap-4 p-4 lg:grid-cols-[1fr_300px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="CARI NAMA, KOPERASI, ATAU ROLE STRATEGIS..."
              className="rounded-none pl-10 border-slate-200 h-11 text-[10px] font-black uppercase tracking-widest"
            />
          </div>
          <Select value={selectedProfileId} onValueChange={setSelectedProfileId}>
            <SelectTrigger className="rounded-none h-11 border-slate-200 bg-white font-black text-[10px] uppercase tracking-widest">
              <SelectValue placeholder="PILIH PROFIL AUDIT" />
            </SelectTrigger>
            <SelectContent className="rounded-none font-black text-[10px] uppercase tracking-widest">
              {directory.slice(0, 10).map((profile) => (
                <SelectItem key={profile.id} value={profile.id}>
                  {profile.name.toUpperCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Profile Detail Grid */}
      <div className="grid gap-6 xl:grid-cols-[1fr_400px]">
        {activeProfile && (
          <Card className="rounded-none border-none shadow-sm overflow-hidden border-t-4 border-t-slate-900">
            <CardHeader className="p-6 border-b border-slate-50">
              <CardTitle className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Detail Entitas Terpilih</CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-8">
              <div className="flex items-start gap-6 bg-slate-50 p-6 rounded-none border border-slate-100 shadow-inner">
                <div className="h-20 w-20 rounded-none bg-white p-5 border border-slate-200 shadow-sm flex items-center justify-center">
                  <UserRound className="h-10 w-10 text-slate-900" />
                </div>
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="text-2xl font-black text-slate-900 uppercase tracking-tight">{activeProfile.name}</p>
                    <Badge className={`rounded-none border-none text-[10px] font-black uppercase tracking-widest px-2 h-6 ${
                      activeProfile.status === 'aktif' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                    }`}>
                      {activeProfile.status.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-xs font-black text-slate-500 uppercase tracking-widest">{activeProfile.role}</p>
                  <p className="text-xs font-black text-slate-900 uppercase tracking-tight">
                    {activeProfile.cooperativeName} · {activeProfile.regionName}
                  </p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="p-4 bg-white border border-slate-100 rounded-none hover:shadow-md transition-all">
                  <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                    <Mail className="h-3.5 w-3.5" /> KONTAK EMAIL
                  </div>
                  <p className="text-sm font-black text-slate-900 uppercase tracking-tight">{activeProfile.email}</p>
                </div>
                <div className="p-4 bg-white border border-slate-100 rounded-none hover:shadow-md transition-all">
                  <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                    <Phone className="h-3.5 w-3.5" /> TELEPON GENGGAM
                  </div>
                  <p className="text-sm font-black text-slate-900 uppercase tracking-tight">{activeProfile.phone}</p>
                </div>
                <div className="p-4 bg-white border border-slate-100 rounded-none hover:shadow-md transition-all">
                  <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                    WILAYAH KERJA
                  </div>
                  <p className="text-sm font-black text-slate-900 uppercase tracking-tight">
                    {activeProfile.villageName}, {activeProfile.regionName}
                  </p>
                </div>
                <div className="p-4 bg-white border border-slate-100 rounded-none hover:shadow-md transition-all">
                  <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                    AKTIVITAS TERAKHIR
                  </div>
                  <p className="text-sm font-black text-slate-900 uppercase tracking-tight">{activeProfile.lastActivity}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="rounded-none border-none shadow-sm overflow-hidden border-t-4 border-t-blue-500">
          <CardHeader className="p-6 border-b border-slate-50">
            <CardTitle className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Audit Behavior & Akses</CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            {[
              {
                icon: ShieldCheck,
                title: 'STATUS OTORISASI',
                description: `Hak akses mengikuti scope nasional dan role ${activeProfile?.role.toUpperCase()}.`,
                tone: 'blue'
              },
              {
                icon: Activity,
                title: 'CADENCE AKTIVITAS',
                description: `Terdeteksi aktivitas reguler pada node ${activeProfile?.cooperativeName.toUpperCase()}.`,
                tone: 'emerald'
              },
              {
                icon: History,
                title: 'LOG INTEGRITAS',
                description: `Verifikasi KYC terakhir dilakukan pada siklus audit nasional 2026.`,
                tone: 'slate'
              },
            ].map((item) => (
              <div key={item.title} className="p-4 bg-slate-50 border-l-4 border-l-slate-900 rounded-none shadow-sm">
                <div className="flex items-start gap-4">
                  <div className="rounded-none bg-white p-3 border border-slate-200 shadow-sm shrink-0">
                    <item.icon className={`h-5 w-5 ${item.tone === 'blue' ? 'text-blue-600' : item.tone === 'emerald' ? 'text-emerald-600' : 'text-slate-900'}`} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-1">{item.title}</p>
                    <p className="text-[10px] font-black text-slate-500 uppercase leading-relaxed tracking-tighter">{item.description}</p>
                  </div>
                </div>
              </div>
            ))}

            <div className="mt-6 pt-6 border-t border-slate-100">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Daftar Akun Dalam Scope</p>
              <div className="space-y-2">
                {directory.slice(0, 5).map((profile) => (
                  <div key={profile.id} className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-none hover:bg-slate-50 transition-colors">
                    <div>
                      <p className="text-xs font-black text-slate-900 uppercase tracking-tight">{profile.name}</p>
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{profile.cooperativeName}</p>
                    </div>
                    <Badge className="rounded-none border-none bg-slate-100 text-slate-600 text-[8px] font-black uppercase tracking-widest h-5 px-2">
                      {profile.status.toUpperCase()}
                    </Badge>
                  </div>
                ))}
              </div>
              <Button 
                variant="ghost" 
                onClick={() => handleAction('View All')}
                className="w-full mt-4 h-9 rounded-none text-[10px] font-black uppercase tracking-widest text-slate-500 hover:bg-slate-100"
              >
                Lihat Semua Direktori
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

