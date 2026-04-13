'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import {
  Activity,
  ArrowLeft,
  BarChart3,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Download,
  History,
  Search,
  ShieldCheck,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useToast } from '@/components/ui/use-toast'
import { KementerianFilterBar } from '@/components/dashboard/kementerian-filter-bar'
import { members, type Member } from '@/lib/mock-data'
import type { ScopeFilters } from '@/lib/kementerian-dashboard-data'

type CreditMember = {
  id: string
  memberNumber: string
  name: string
  nik: string
  typeLabel: string
  province: string
  district: string
  village: string
  group: string
  commodity: string
  creditScore: number
  kycVerified: boolean
  dukcapilVerified: boolean
}

const PAGE_SIZE_OPTIONS = ['10', '25', '50']

const getScoreColor = (score: number) => {
  if (score >= 750) return 'text-emerald-500'
  if (score >= 650) return 'text-blue-500'
  if (score >= 550) return 'text-amber-500'
  if (score >= 450) return 'text-orange-500'
  return 'text-rose-500'
}

const getScoreBadge = (score: number) => {
  if (score >= 750) return { label: 'Prime', color: 'bg-emerald-100 text-emerald-700' }
  if (score >= 650) return { label: 'Baik', color: 'bg-blue-100 text-blue-700' }
  if (score >= 550) return { label: 'Cukup', color: 'bg-amber-100 text-amber-700' }
  if (score >= 450) return { label: 'Rendah', color: 'bg-orange-100 text-orange-700' }
  return { label: 'Kritis', color: 'bg-rose-100 text-rose-700' }
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function hashString(value: string) {
  return value.split('').reduce((total, char) => total + char.charCodeAt(0), 0)
}

function normalizeValue(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]/g, '')
}

function matchesScope(filterValue: string, candidate: string) {
  if (filterValue === 'all') return true
  const filterKey = normalizeValue(filterValue)
  const candidateKey = normalizeValue(candidate)
  return candidateKey.includes(filterKey) || filterKey.includes(candidateKey)
}

function getMemberTypeLabel(role: Member['role']) {
  if (role === 'produsen') return 'Produsen'
  if (role === 'buyer') return 'Buyer'
  return 'Multi-Peran'
}

function buildCreditMember(member: Member, index: number): CreditMember {
  const seed = hashString(`${member.id}-${member.name}-${member.mainCommodity}-${index}`)
  const utilizationRatio = member.financial.savings > 0 ? member.financial.loans / member.financial.savings : 1
  const rawScore =
    495 +
    Math.round(member.rating * 18) +
    Math.round(Math.min(member.financial.savings / 300000, 65)) +
    Math.round(Math.min(member.financial.transactions, 75) * 0.8) +
    (member.verified ? 18 : -12) +
    (member.status === 'active' ? 22 : member.status === 'pending' ? -8 : -48) -
    Math.round((Math.round(utilizationRatio * 100) + 12 + (seed % 11)) * 1.12) +
    ((seed % 9) - 4)

  return {
    id: member.id,
    memberNumber: member.memberNumber,
    name: member.name,
    nik: member.ktp,
    typeLabel: getMemberTypeLabel(member.role),
    province: member.province,
    district: member.district,
    village: member.village,
    group: member.group,
    commodity: member.mainCommodity,
    creditScore: clamp(rawScore, 410, 825),
    kycVerified: member.verified,
    dukcapilVerified: member.verified || member.status !== 'pending',
  }
}

export default function CreditScoringPage() {
  const { toast } = useToast()
  const [filters, setFilters] = useState<ScopeFilters>({
    provinceId: 'all',
    regionId: 'all',
    villageId: 'all',
    cooperativeId: 'all',
    commodityId: 'all',
  })
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState('10')

  const scoredMembers = useMemo(() => members.map((member, index) => buildCreditMember(member, index)), [])

  const filteredMembers = useMemo(() => {
    const keyword = search.trim().toLowerCase()

    return scoredMembers.filter((member) => {
      const matchesSearch =
        keyword.length === 0 ||
        [member.name, member.nik, member.id, member.memberNumber, member.typeLabel, member.commodity]
          .some((value) => value.toLowerCase().includes(keyword))

      return (
        matchesSearch &&
        matchesScope(filters.provinceId, member.province) &&
        matchesScope(filters.regionId, member.district) &&
        matchesScope(filters.villageId, member.village) &&
        matchesScope(filters.cooperativeId, member.group) &&
        matchesScope(filters.commodityId, member.commodity)
      )
    })
  }, [filters, scoredMembers, search])

  useEffect(() => {
    setPage(1)
  }, [filters, pageSize, search])

  const pageSizeNumber = Number(pageSize)
  const totalPages = Math.max(1, Math.ceil(filteredMembers.length / pageSizeNumber))

  useEffect(() => {
    setPage((currentPage) => Math.min(currentPage, totalPages))
  }, [totalPages])

  const paginatedMembers = useMemo(() => {
    return filteredMembers.slice((page - 1) * pageSizeNumber, page * pageSizeNumber)
  }, [filteredMembers, page, pageSizeNumber])

  const stats = useMemo(() => {
    const totalMembers = filteredMembers.length
    const primeCount = filteredMembers.filter((member) => member.creditScore >= 750).length
    const eligibleCount = filteredMembers.filter((member) => member.creditScore >= 550).length
    const avgScore = totalMembers === 0 ? 0 : Math.round(filteredMembers.reduce((sum, member) => sum + member.creditScore, 0) / totalMembers)
    const defaultRisk = totalMembers === 0 ? '0.0' : ((filteredMembers.filter((member) => member.creditScore < 550).length / totalMembers) * 100).toFixed(1)

    return { totalMembers, primeCount, eligibleCount, avgScore, defaultRisk }
  }, [filteredMembers])

  const pageStart = filteredMembers.length === 0 ? 0 : (page - 1) * pageSizeNumber + 1
  const pageEnd = Math.min(page * pageSizeNumber, filteredMembers.length)

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild className="h-8 w-8 hover:bg-slate-100 rounded-none">
              <Link href="/keuangan">
                <ArrowLeft className="h-4 w-4 text-slate-600" />
              </Link>
            </Button>
            <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Pusat Rating Kredit</h1>
          </div>
          <p className="ml-12 text-[10px] font-black text-slate-500 mt-1 uppercase tracking-widest leading-relaxed">
            Penilaian risiko berbasis AI dan skoring seluruh anggota | {stats.totalMembers.toLocaleString('id-ID')} anggota terskor pada cakupan aktif
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-9 text-[10px] font-black uppercase tracking-widest border-slate-200 text-slate-600 rounded-none shadow-sm"
            onClick={() => toast({ title: 'Sinkronisasi Model', description: 'Memperbarui parameter risiko dengan data transaksional terbaru.' })}
          >
            <History className="h-3.5 w-3.5 mr-2 text-blue-600" />
            Skor Ulang Semua
          </Button>
          <Button
            size="sm"
            className="h-9 bg-slate-900 text-white hover:bg-slate-800 text-[10px] font-black uppercase tracking-widest px-6 rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] transition-all"
            onClick={() => toast({ title: 'Inisiasi Audit', description: 'Menghasilkan laporan integritas kredit lintas entitas.' })}
          >
            <Download className="h-4 w-4 mr-2" />
            Ekspor Audit
          </Button>
        </div>
      </div>

      <KementerianFilterBar filters={filters} setFilters={setFilters} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Rata-rata Skor', value: stats.avgScore, sub: 'Rating Anggota', icon: BarChart3, tone: 'blue' },
          { label: 'Anggota Prime', value: stats.primeCount, sub: 'Kepercayaan Tinggi', icon: ShieldCheck, tone: 'emerald' },
          { label: 'Layak Kredit', value: stats.eligibleCount, sub: 'Persetujuan Potensial', icon: CreditCard, tone: 'emerald' },
          { label: 'Risiko Gagal Bayar', value: `${stats.defaultRisk}%`, sub: 'Portofolio Aktif', icon: Activity, tone: 'rose' },
        ].map((stat) => (
          <Card key={stat.label} className="border-none shadow-sm bg-white overflow-hidden rounded-none">
            <div className={`h-1 w-full ${stat.tone === 'emerald' ? 'bg-emerald-500' : stat.tone === 'blue' ? 'bg-blue-500' : 'bg-rose-500'}`} />
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-10 w-10 rounded-none bg-slate-50 flex items-center justify-center shrink-0 shadow-inner">
                <stat.icon className={`h-5 w-5 ${stat.tone === 'emerald' ? 'text-emerald-500' : stat.tone === 'blue' ? 'text-blue-500' : 'text-rose-500'}`} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{stat.label}</p>
                <div className="flex flex-col">
                  <span className="text-sm font-black text-slate-900 leading-tight">{typeof stat.value === 'number' ? stat.value.toLocaleString('id-ID') : stat.value}</span>
                  <span className="text-[8px] font-bold text-slate-500 uppercase tracking-tighter">{stat.sub}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <Card className="border-none bg-white shadow-sm overflow-hidden rounded-none">
            <div className="h-1 w-full bg-slate-900" />
            <CardContent className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Cari anggota berdasarkan nama, NIK, ID, atau komoditas..."
                  className="pl-9 h-11 text-[10px] font-black uppercase tracking-widest bg-slate-50 border-slate-100 rounded-none focus-visible:ring-slate-900"
                />
              </div>
            </CardContent>
          </Card>

          <Card className="border-none bg-white shadow-sm overflow-hidden rounded-none">
            <div className="h-1 w-full bg-slate-900" />
            <CardHeader className="p-6 border-b border-slate-50">
              <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-900">Manifest Rating Anggota</CardTitle>
              <CardDescription className="text-[10px] font-bold text-slate-400 uppercase mt-1">
                Seluruh anggota yang sudah terskor pada cakupan aktif
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-slate-100">
                  <TableRow className="border-none bg-slate-100 hover:bg-slate-100">
                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-500 h-10 px-6">Anggota / Tipe</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-500 h-10 px-6 text-center">Skor</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-500 h-10 px-6 text-center">Status</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-500 h-10 px-6 text-center">Terverifikasi</TableHead>
                    <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-500 h-10 px-6 text-right">Audit</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedMembers.length === 0 ? (
                    <TableRow className="border-b border-slate-50">
                      <TableCell colSpan={5} className="px-6 py-12 text-center text-sm text-slate-500">
                        Tidak ada anggota yang cocok dengan filter aktif.
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedMembers.map((member) => (
                      <TableRow key={member.id} className="border-b border-slate-50 hover:bg-slate-50/70 transition-colors">
                        <TableCell className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 bg-slate-100 flex items-center justify-center font-black text-[10px] text-slate-500 rounded-none">
                              {member.name.split(' ').map((segment) => segment[0]).join('').slice(0, 2).toUpperCase()}
                            </div>
                            <div className="space-y-0.5">
                              <p className="text-xs font-black text-slate-900 uppercase tracking-tight">{member.name}</p>
                              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{member.typeLabel} | {member.memberNumber}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="px-6 py-4 text-center">
                          <span className={`text-lg font-black ${getScoreColor(member.creditScore)}`}>{member.creditScore}</span>
                        </TableCell>
                        <TableCell className="px-6 py-4 text-center">
                          <Badge className={`text-[9px] font-black border-none px-2 h-5 uppercase rounded-none ${getScoreBadge(member.creditScore).color}`}>
                            {getScoreBadge(member.creditScore).label}
                          </Badge>
                        </TableCell>
                        <TableCell className="px-6 py-4 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            {member.kycVerified && <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />}
                            {member.dukcapilVerified && <CheckCircle className="h-3.5 w-3.5 text-blue-500" />}
                          </div>
                        </TableCell>
                        <TableCell className="px-6 py-4 text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 text-[9px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-none"
                            onClick={() => toast({ title: 'Diagnostik Risiko', description: `Membuka analisis faktor untuk ${member.name}.` })}
                          >
                            Detail
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <div className="flex flex-col gap-4 rounded-none border border-slate-100 bg-white px-4 py-4 shadow-sm md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Menampilkan {pageStart}-{pageEnd} dari {filteredMembers.length} anggota | Halaman {page} dari {totalPages}
              </p>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tampilkan</span>
                <Select value={pageSize} onValueChange={setPageSize}>
                  <SelectTrigger className="h-9 w-[92px] rounded-none border-slate-200 bg-white text-[10px] font-black uppercase tracking-widest shadow-none">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-none">
                    {PAGE_SIZE_OPTIONS.map((option) => (
                      <SelectItem key={option} value={option} className="text-[10px] font-black uppercase tracking-widest">
                        {option} data
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage((currentPage) => currentPage - 1)}
                className="h-9 rounded-none text-[10px] font-black uppercase tracking-widest border-slate-200 px-4 bg-white shadow-none"
              >
                <ChevronLeft className="h-3.5 w-3.5 mr-1.5" />
                Sebelumnya
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page === totalPages}
                onClick={() => setPage((currentPage) => currentPage + 1)}
                className="h-9 rounded-none text-[10px] font-black uppercase tracking-widest border-slate-200 px-4 bg-white shadow-none"
              >
                Berikutnya
                <ChevronRight className="h-3.5 w-3.5 ml-1.5" />
              </Button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <Card className="border-none shadow-sm bg-white rounded-none">
            <CardHeader className="p-4 border-b border-slate-100">
              <CardTitle className="text-[10px] font-black uppercase tracking-widest text-slate-900">Distribusi Skor</CardTitle>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              {[
                { label: 'Prime', value: filteredMembers.filter((member) => member.creditScore >= 750).length, color: 'bg-emerald-500' },
                { label: 'Baik - Cukup', value: filteredMembers.filter((member) => member.creditScore >= 550 && member.creditScore < 750).length, color: 'bg-blue-500' },
                { label: 'Risiko Tinggi', value: filteredMembers.filter((member) => member.creditScore < 550).length, color: 'bg-rose-500' },
              ].map((item) => {
                const percentage = filteredMembers.length === 0 ? 0 : Math.round((item.value / filteredMembers.length) * 100)
                return (
                  <div key={item.label} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{item.label}</span>
                      <span className="text-[10px] font-black text-slate-900">{item.value} anggota</span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-200 rounded-none overflow-hidden">
                      <div className={`h-full ${item.color}`} style={{ width: `${percentage}%` }} />
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>

          <Card className="border-none shadow-sm bg-white rounded-none">
            <CardHeader className="p-4 border-b border-slate-100">
              <CardTitle className="text-[10px] font-black uppercase tracking-widest text-slate-900">Mesin Risiko</CardTitle>
              <CardDescription className="text-[10px] font-bold text-slate-400 uppercase">Sinkronisasi scoring aktif</CardDescription>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              {[
                'Batch scoring anggota aktif tersinkron.',
                'Verifikasi KYC ikut memengaruhi skor akhir.',
                'Portofolio risiko tinggi dipantau otomatis.',
              ].map((item) => (
                <div key={item} className="rounded-none border border-slate-100 bg-slate-50 px-3 py-3 text-[10px] font-black text-slate-600 uppercase tracking-widest leading-relaxed">
                  {item}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
