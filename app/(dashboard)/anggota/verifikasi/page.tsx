'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  User,
  CreditCard,
  MapPin,
  Eye,
  Check,
  X,
  Loader2,
  ShieldCheck,
  AlertTriangle,
  Activity,
  ArrowLeft,
  Search,
  Filter,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert'
import { useAuth } from '@/lib/auth/use-auth'
import { KementerianFilterBar } from '@/components/dashboard/kementerian-filter-bar'
import { ScopeFilters } from '@/lib/kementerian-dashboard-data'

interface VerifikasiItem {
  id: string
  memberId: string
  nama: string
  tipe: string
  tanggalDaftar: string
  status: 'pending' | 'approved' | 'ditolak'
  dokumen: Record<string, boolean>
  alamat: string
  desa: string
  koperasi: string
  alasanTolak?: string
  tanggalVerifikasi?: string
}

const initialVerifikasiData: VerifikasiItem[] = [
  {
    id: 'V001',
    memberId: 'M009',
    nama: 'Pak Bambang Hartono',
    tipe: 'petani',
    tanggalDaftar: '2024-02-14',
    status: 'pending',
    dokumen: { ktp: true, foto: true, suratTanah: false, skck: true },
    alamat: 'Jl. Persawahan No. 8',
    desa: 'SUKAMAJU',
    koperasi: 'KOP. MAJU JAYA',
  },
  {
    id: 'V002',
    memberId: 'M010',
    nama: 'Bu Dewi Lestari',
    tipe: 'umkm',
    tanggalDaftar: '2024-02-13',
    status: 'pending',
    dokumen: { ktp: true, foto: true, suratUsaha: true, npwp: true },
    alamat: 'Jl. Pasar Baru No. 15',
    desa: 'DESA CIBIRU',
    koperasi: 'KOP. MANDIRI',
  },
  {
    id: 'V003',
    memberId: 'M011',
    nama: 'Pak Sugeng',
    tipe: 'nelayan',
    tanggalDaftar: '2024-02-12',
    status: 'ditolak',
    alasanTolak: 'Foto KTP tidak jelas',
    dokumen: { ktp: false, foto: true, suratNelayan: true },
    alamat: 'Jl. Pantai No. 3',
    desa: 'PELABUHAN RATU',
    koperasi: 'KOP. BAHARI',
  },
]

const TAB_META = {
  pending: 'Pending',
  rejected: 'Rejected',
  history: 'History',
} as const

function getInitials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
}

function getAvatarTone(name: string) {
  const tones = [
    'bg-emerald-100 text-emerald-700',
    'bg-sky-100 text-sky-700',
    'bg-amber-100 text-amber-700',
    'bg-rose-100 text-rose-700',
  ]

  const seed = name.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0)
  return tones[seed % tones.length]
}

function formatDocumentLabel(key: string) {
  const labels: Record<string, string> = {
    ktp: 'KTP',
    foto: 'Foto',
    suratTanah: 'Surat Tanah',
    skck: 'SKCK',
    suratUsaha: 'Surat Usaha',
    npwp: 'NPWP',
    suratNelayan: 'Surat Nelayan',
  }

  return labels[key] ?? key.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/\b\w/g, (char) => char.toUpperCase())
}

export default function VerifikasiPage() {
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
  const [verifikasiData, setVerifikasiData] = useState<VerifikasiItem[]>(initialVerifikasiData)
  const [selectedItem, setSelectedItem] = useState<VerifikasiItem | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [rejectReason, setRejectReason] = useState('')
  const [openDialogId, setOpenDialogId] = useState<string | null>(null)

  // Cross-entity filtering logic
  const filteredData = useMemo(() => {
    return verifikasiData.filter(v => {
      const matchesSearch = v.nama.toLowerCase().includes(search.toLowerCase()) || v.memberId.includes(search)
      if (!isKementerian) return matchesSearch

      const matchesVillage = filters.villageId === 'all' || v.desa.toUpperCase().includes(filters.villageId.split('-').pop() || '')
      // Simulated mapping for demo purposes
      const matchesKop = filters.cooperativeId === 'all' || v.koperasi.toUpperCase().includes(filters.cooperativeId.split('-').pop() || '')
      
      return matchesSearch && matchesVillage && matchesKop
    })
  }, [verifikasiData, search, filters, isKementerian])

  const pendingItems = filteredData.filter(v => v.status === 'pending')
  const rejectedItems = filteredData.filter(v => v.status === 'ditolak')
  const historyItems = filteredData.filter(v => v.status === 'approved')

  const handleApprove = async (item: VerifikasiItem) => {
    setIsProcessing(true)
    await new Promise(r => setTimeout(r, 1500))
    setVerifikasiData(prev => prev.map(v => v.id === item.id ? { ...v, status: 'approved', tanggalVerifikasi: new Date().toISOString() } : v))
    setIsProcessing(false)
    setOpenDialogId(null)
  }

  const handleReject = async (item: VerifikasiItem) => {
    setIsProcessing(true)
    await new Promise(r => setTimeout(r, 1000))
    setVerifikasiData(prev => prev.map(v => v.id === item.id ? { ...v, status: 'ditolak', alasanTolak: rejectReason } : v))
    setIsProcessing(false)
    setShowRejectDialog(false)
    setOpenDialogId(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild className="shrink-0 h-8 w-8">
            <Link href="/anggota">
              <ArrowLeft className="h-4 w-4 text-slate-600" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-semibold  text-slate-900 ">Verifikasi KYC Nasional</h1>
            <p className="text-xs font-bold text-slate-500   mt-1">
              Otentikasi Identitas Anggota Lintas Entitas Koperasi
            </p>
          </div>
        </div>
        {isKementerian && (
          <Badge className="bg-emerald-100 text-emerald-700 text-xs font-semibold  border-none  px-3 py-1">
            Mode Supervisi Nasional
          </Badge>
        )}
      </div>

      {/* Kementerian Filter Suite */}
      {isKementerian && <KementerianFilterBar filters={filters} setFilters={setFilters} search={search} setSearch={setSearch} />}

      {/* Stats KPI */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: 'Menunggu Verifikasi', value: pendingItems.length, icon: Clock, tone: 'amber' },
          { label: 'Ditolak / Perbaikan', value: rejectedItems.length, icon: XCircle, tone: 'rose' },
          { label: 'Approved (Scope)', value: historyItems.length, icon: CheckCircle, tone: 'emerald' },
          { label: 'SLA Rata-rata', value: '1.2H', icon: Activity, tone: 'slate' },
        ].map((kpi, i) => (
          <Card key={i} className="surface-card overflow-hidden">
            <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
              <p className="text-xs font-semibold text-slate-400  ">{kpi.label}</p>
              <kpi.icon className={`h-3.5 w-3.5 ${kpi.tone === 'rose' ? 'text-rose-500' : kpi.tone === 'emerald' ? 'text-emerald-500' : kpi.tone === 'amber' ? 'text-amber-500' : 'text-slate-400'}`} />
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="text-2xl font-semibold text-slate-900 ">{kpi.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="pending" className="w-full">
        <div className="flex flex-col gap-4 border-b border-[var(--dashboard-surface-border)] pb-3 sm:flex-row sm:items-center sm:justify-between">
          <TabsList className="dashboard-inner-surface h-auto gap-1 p-1">
            {(['pending', 'rejected', 'history'] as const).map((tab) => (
              <TabsTrigger 
                key={tab} 
                value={tab} 
                className="h-9 rounded-md px-4 text-sm font-semibold text-slate-500 data-[state=active]:border-[var(--dashboard-surface-border)] data-[state=active]:bg-[var(--dashboard-surface)] data-[state=active]:text-slate-900"
              >
                {TAB_META[tab]} ({tab === 'pending' ? pendingItems.length : tab === 'rejected' ? rejectedItems.length : historyItems.length})
              </TabsTrigger>
            ))}
          </TabsList>
          
          {!isKementerian && (
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
              <Input 
                placeholder="Cari NAMA/NIK..." 
                value={search} 
                onChange={e => setSearch(e.target.value)}
                className="pl-8 h-8 text-xs font-semibold   border-slate-200" 
              />
            </div>
          )}
        </div>

        <TabsContent value="pending" className="mt-6 space-y-4">
          {pendingItems.length === 0 ? (
            <div className="py-20 text-center bg-slate-50 rounded-xl border-2 border-dashed border-slate-200">
              <ShieldCheck className="mx-auto h-12 w-12 text-slate-200 mb-4" />
              <p className="text-xs font-semibold text-slate-400  ">Antrian Verifikasi Bersih</p>
            </div>
          ) : (
            pendingItems.map((item) => (
              <Card key={item.id} className="surface-card-strong group overflow-hidden transition-all hover:shadow-[0_20px_42px_-30px_rgba(137,114,111,0.32)]">
                <CardContent className="p-0">
                  <div className="flex flex-col lg:flex-row lg:items-center">
                    <div className="flex-1 p-5 lg:border-r lg:border-[var(--dashboard-surface-border)]">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12 rounded-lg border-2 border-white shadow-sm">
                          <AvatarFallback className={`text-xs font-semibold ${getAvatarTone(item.nama)}`}>
                            {getInitials(item.nama)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-semibold text-slate-900  ">{item.nama}</h3>
                            <Badge variant="outline" className="text-xs font-semibold px-1.5 h-4 border-slate-200 text-slate-500">{item.tipe.toUpperCase()}</Badge>
                          </div>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5">
                            <div className="flex items-center gap-1.5 text-slate-400">
                              <MapPin className="h-3 w-3" />
                              <span className="text-xs font-bold  ">{item.desa} • {item.koperasi}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-slate-400">
                              <Clock className="h-3 w-3" />
                              <span className="text-xs font-bold  ">Daftar: {item.tanggalDaftar}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="dashboard-section-header flex items-center justify-between gap-4 p-5 lg:w-[320px]">
                      <div className="space-y-2">
                        <p className="text-sm font-semibold text-slate-700">Dokumen Fisik</p>
                        <div className="flex gap-1.5">
                          {Object.entries(item.dokumen).map(([key, val]) => (
                            <div key={key} title={formatDocumentLabel(key)} className={`h-2 w-7 rounded-full ${val ? 'bg-emerald-500' : 'bg-slate-200'}`} />
                          ))}
                        </div>
                        <p className="text-xs text-slate-500">
                          {Object.values(item.dokumen).filter(Boolean).length} dari {Object.keys(item.dokumen).length} dokumen lolos pemeriksaan awal
                        </p>
                      </div>
                      
                      <Dialog
                        open={openDialogId === item.id}
                        onOpenChange={(open) => {
                          setOpenDialogId(open ? item.id : null)
                          if (!open) {
                            setShowRejectDialog(false)
                            setRejectReason('')
                          }
                        }}
                      >
                        <DialogTrigger asChild>
                          <Button size="sm" className="h-10 rounded-xl bg-[var(--dashboard-primary)] px-6 text-sm font-semibold text-white hover:bg-[var(--dashboard-primary-hover)]">
                            Review
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl overflow-hidden border-[var(--dashboard-surface-border-strong)] bg-[var(--dashboard-surface)] p-0 shadow-[0_24px_52px_-30px_rgba(137,114,111,0.32)]">
                          <DialogHeader className="dashboard-section-header gap-1 px-5 py-4 pr-12">
                            <DialogTitle className="flex items-center gap-2 text-base font-semibold text-slate-900">
                              <ShieldCheck className="h-4 w-4 text-emerald-500" /> Otentikasi KYC: {item.nama}
                            </DialogTitle>
                            <DialogDescription>
                              Tinjau profil entitas dan kelengkapan dokumen sebelum memberikan keputusan verifikasi.
                            </DialogDescription>
                          </DialogHeader>
                          
                          <div className="grid gap-5 p-5 md:grid-cols-[1.05fr_0.95fr]">
                            <div className="dashboard-inner-surface space-y-4 p-4">
                              <div className="flex items-center gap-3">
                                <Avatar className="h-14 w-14 rounded-xl border border-white/80 shadow-sm">
                                  <AvatarFallback className={`text-sm font-semibold ${getAvatarTone(item.nama)}`}>
                                    {getInitials(item.nama)}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="text-sm font-semibold text-slate-900">{item.nama}</p>
                                  <p className="text-sm text-slate-500">{item.alamat}</p>
                                </div>
                              </div>
                              <div className="grid gap-2 sm:grid-cols-2">
                                <div className="rounded-xl border border-[var(--dashboard-surface-border)] bg-white p-3">
                                  <p className="text-xs font-medium text-slate-500">Koperasi</p>
                                  <p className="mt-1 text-sm font-semibold text-emerald-700">{item.koperasi}</p>
                                </div>
                                <div className="rounded-xl border border-[var(--dashboard-surface-border)] bg-white p-3">
                                  <p className="text-xs font-medium text-slate-500">Lokasi</p>
                                  <p className="mt-1 text-sm font-semibold text-slate-900">{item.desa}</p>
                                </div>
                                <div className="rounded-xl border border-[var(--dashboard-surface-border)] bg-white p-3">
                                  <p className="text-xs font-medium text-slate-500">Tipe Entitas</p>
                                  <p className="mt-1 text-sm font-semibold text-slate-900">{item.tipe.toUpperCase()}</p>
                                </div>
                                <div className="rounded-xl border border-[var(--dashboard-surface-border)] bg-white p-3">
                                  <p className="text-xs font-medium text-slate-500">Tanggal Daftar</p>
                                  <p className="mt-1 text-sm font-semibold text-slate-900">{item.tanggalDaftar}</p>
                                </div>
                              </div>
                            </div>

                            <div className="dashboard-inner-surface space-y-3 p-4">
                              <div>
                                <p className="text-sm font-semibold text-slate-900">Validasi Dokumen</p>
                                <p className="text-xs text-slate-500">
                                  Periksa kelengkapan fisik sebelum menyetujui keanggotaan.
                                </p>
                              </div>
                              <div className="space-y-2">
                                {Object.entries(item.dokumen).map(([k, v]) => (
                                  <div key={k} className="flex items-center justify-between rounded-xl border border-[var(--dashboard-surface-border)] bg-white px-3 py-2.5">
                                    <span className="text-sm font-medium text-slate-700">{formatDocumentLabel(k)}</span>
                                    {v ? (
                                      <span className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-600">
                                        <Check className="h-3.5 w-3.5" /> Valid
                                      </span>
                                    ) : (
                                      <span className="inline-flex items-center gap-1 text-sm font-semibold text-rose-600">
                                        <X className="h-3.5 w-3.5" /> Perlu Perbaikan
                                      </span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>

                            {showRejectDialog && (
                              <div className="md:col-span-2 rounded-xl border border-rose-200 bg-rose-50/75 p-4 space-y-3">
                                <Label className="text-sm font-semibold text-rose-700">Alasan Penolakan</Label>
                                <Textarea 
                                  className="min-h-24 bg-white text-sm border-rose-200 focus-visible:ring-rose-500" 
                                  placeholder="Contoh: Foto KTP terpotong..."
                                  value={rejectReason}
                                  onChange={e => setRejectReason(e.target.value)}
                                />
                              </div>
                            )}
                          </div>

                          <DialogFooter className="border-t border-[var(--dashboard-surface-border)] bg-[var(--dashboard-surface-muted)] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
                            <p className="text-xs text-slate-500">
                              Pastikan identitas dan dokumen fisik sesuai sebelum memfinalkan keputusan.
                            </p>
                            {showRejectDialog ? (
                              <>
                                <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
                                  <Button variant="outline" onClick={() => setShowRejectDialog(false)} className="text-sm font-semibold">Batal</Button>
                                  <Button variant="destructive" onClick={() => handleReject(item)} disabled={!rejectReason || isProcessing} className="text-sm font-semibold bg-rose-600">
                                    {isProcessing ? <Loader2 className="animate-spin h-3 w-3 mr-2" /> : <X className="h-3 w-3 mr-2" />}
                                    Kirim Penolakan
                                  </Button>
                                </div>
                              </>
                            ) : (
                              <>
                                <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
                                  <Button variant="outline" onClick={() => setShowRejectDialog(true)} className="h-10 text-sm font-semibold border-rose-200 text-rose-600 hover:bg-rose-50">Tolak</Button>
                                  <Button onClick={() => handleApprove(item)} disabled={isProcessing} className="h-10 bg-[var(--dashboard-primary)] text-sm font-semibold text-white hover:bg-[var(--dashboard-primary-hover)]">
                                    {isProcessing ? <Loader2 className="animate-spin h-3 w-3 mr-2" /> : <ShieldCheck className="h-3.5 w-3.5 mr-2 text-emerald-200" />}
                                    Setujui Keanggotaan
                                  </Button>
                                </div>
                              </>
                            )}
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="rejected" className="mt-6 space-y-4">
          {rejectedItems.map(item => (
            <Card key={item.id} className="surface-card overflow-hidden border-l-4 border-l-rose-500">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className={`${getAvatarTone(item.nama)} text-xs font-semibold`}>{getInitials(item.nama)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-xs font-semibold  text-slate-900">{item.nama}</p>
                    <p className="text-xs font-bold text-rose-600   mt-0.5">Alasan: {item.alasanTolak}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="h-8 text-xs font-semibold  border-slate-200">Hubungi Pemohon</Button>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="history" className="mt-6 space-y-4">
          {historyItems.map(item => (
            <Card key={item.id} className="surface-card overflow-hidden border-l-4 border-l-emerald-500">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className={`${getAvatarTone(item.nama)} text-xs font-semibold`}>{getInitials(item.nama)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-xs font-semibold  text-slate-900">{item.nama}</p>
                    <p className="text-xs font-bold text-slate-400   mt-0.5">Verified on: {item.tanggalVerifikasi?.split('T')[0]}</p>
                  </div>
                </div>
                <Badge className="bg-emerald-100 text-emerald-700 text-xs font-semibold border-none">Completed</Badge>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
