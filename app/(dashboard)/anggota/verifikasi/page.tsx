'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  CheckCircle,
  XCircle,
  Clock,
  User,
  CreditCard,
  MapPin,
  Check,
  X,
  Loader2,
  ShieldCheck,
  Activity,
  ArrowLeft,
  Search,
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
    foto: 'FOTO',
    suratTanah: 'SURAT TANAH',
    skck: 'SKCK',
    suratUsaha: 'SURAT USAHA',
    npwp: 'NPWP',
    suratNelayan: 'SURAT NELAYAN',
  }

  return labels[key] ?? key.replace(/([a-z])([A-Z])/g, '$1 $2').toUpperCase()
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
  const [isProcessing, setIsProcessing] = useState(false)
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [rejectReason, setRejectReason] = useState('')
  const [openDialogId, setOpenDialogId] = useState<string | null>(null)

  const filteredData = useMemo(() => {
    return verifikasiData.filter(v => {
      const matchesSearch = v.nama.toLowerCase().includes(search.toLowerCase()) || v.memberId.includes(search)
      if (!isKementerian) return matchesSearch

      const matchesVillage = filters.villageId === 'all' || v.desa.toUpperCase().includes(filters.villageId.split('-').pop() || '')
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
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild className="shrink-0 h-8 w-8 rounded-none transition-colors hover:bg-slate-100">
            <Link href="/anggota">
              <ArrowLeft className="h-4 w-4 text-slate-600" />
            </Link>
          </Button>
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900">Otentikasi KYC Nasional</h1>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mt-1">
              Verifikasi Identitas Anggota Lintas Entitas Koperasi
            </p>
          </div>
        </div>
        {isKementerian && (
          <Badge className="bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-none border-none px-4 py-1 shadow-lg">
            Supervisi Nasional
          </Badge>
        )}
      </div>

      {isKementerian && <KementerianFilterBar filters={filters} setFilters={setFilters} search={search} setSearch={setSearch} />}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {[
          { label: 'MENUNGGU VERIFIKASI', value: pendingItems.length, icon: Clock, tone: 'amber' },
          { label: 'DITOLAK / PERBAIKAN', value: rejectedItems.length, icon: XCircle, tone: 'rose' },
          { label: 'VERIFIKASI SELESAI', value: historyItems.length, icon: CheckCircle, tone: 'emerald' },
          { label: 'SLA RATA-RATA (JAM)', value: '1.2', icon: Activity, tone: 'slate' },
        ].map((stat, i) => (
          <Card key={i} className="rounded-none border-none bg-white shadow-sm overflow-hidden group border-t-4 border-t-slate-900">
            <div className={`absolute top-0 left-0 h-1 w-full ${stat.tone === 'rose' ? 'bg-rose-500' : stat.tone === 'emerald' ? 'bg-emerald-500' : stat.tone === 'amber' ? 'bg-amber-500' : 'bg-slate-900'}`} />
            <CardHeader className="p-4 pb-2">
              <div className="flex justify-between items-start">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{stat.label}</p>
                <stat.icon className={`h-4 w-4 ${stat.tone === 'rose' ? 'text-rose-500' : stat.tone === 'emerald' ? 'text-emerald-500' : stat.tone === 'amber' ? 'text-amber-500' : 'text-slate-900'}`} />
              </div>
              <CardTitle className="text-3xl font-black text-slate-900 mt-1">{stat.value}</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="text-[10px] font-bold text-slate-500 mt-1 uppercase tracking-tighter">Real-time Audit Data</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="pending" className="w-full">
        <div className="flex flex-col gap-4 border-b border-slate-200 pb-3 sm:flex-row sm:items-center sm:justify-between">
          <TabsList className="bg-slate-100 h-auto gap-1 p-1 rounded-none border border-slate-200 shadow-inner">
            {(['pending', 'rejected', 'history'] as const).map((tab) => (
              <TabsTrigger 
                key={tab} 
                value={tab} 
                className="h-9 rounded-none px-6 text-[10px] font-black uppercase tracking-widest text-slate-500 data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm transition-all"
              >
                {tab === 'pending' ? 'TERTUNDA' : tab === 'rejected' ? 'DITOLAK' : 'RIWAYAT'} ({tab === 'pending' ? pendingItems.length : tab === 'rejected' ? rejectedItems.length : historyItems.length})
              </TabsTrigger>
            ))}
          </TabsList>
          
          {!isKementerian && (
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input 
                placeholder="CARI NAMA / NIK ANGGOTA..." 
                value={search} 
                onChange={e => setSearch(e.target.value)}
                className="pl-9 h-10 text-[10px] font-black uppercase tracking-widest border-slate-200 rounded-none bg-white focus:ring-1 focus:ring-slate-900" 
              />
            </div>
          )}
        </div>

        <TabsContent value="pending" className="mt-6 space-y-4">
          {pendingItems.length === 0 ? (
            <div className="py-24 text-center bg-slate-50 rounded-none border-2 border-dashed border-slate-200">
              <ShieldCheck className="mx-auto h-12 w-12 text-slate-200 mb-4" />
              <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Antrian Verifikasi KYC Bersih</p>
            </div>
          ) : (
            pendingItems.map((item) => (
              <Card key={item.id} className="rounded-none border-slate-200 group overflow-hidden transition-all hover:border-slate-900 shadow-sm border-l-4 border-l-amber-500">
                <CardContent className="p-0">
                  <div className="flex flex-col lg:flex-row lg:items-center">
                    <div className="flex-1 p-5 lg:border-r lg:border-slate-100">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12 rounded-none border border-slate-200 shadow-sm">
                          <AvatarFallback className={`text-xs font-black ${getAvatarTone(item.nama)}`}>
                            {getInitials(item.nama)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">{item.nama}</h3>
                            <Badge variant="outline" className="text-[9px] font-black uppercase tracking-widest px-2 h-5 rounded-none border-slate-200 text-slate-500 bg-white shadow-sm">{item.tipe.toUpperCase()}</Badge>
                          </div>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5">
                            <div className="flex items-center gap-1.5 text-slate-400">
                              <MapPin className="h-3 w-3" />
                              <span className="text-[10px] font-bold uppercase tracking-tighter text-slate-500">{item.desa} · {item.koperasi}</span>
                            </div>
                            <div className="flex items-center gap-1.5 text-slate-400">
                              <Clock className="h-3 w-3" />
                              <span className="text-[10px] font-bold uppercase tracking-tighter text-slate-500">PENDAFTARAN: {item.tanggalDaftar}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-slate-50/50 flex items-center justify-between gap-4 p-5 lg:w-[360px]">
                      <div className="space-y-2">
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-900">Validasi Dokumen</p>
                        <div className="flex gap-1">
                          {Object.entries(item.dokumen).map(([key, val]) => (
                            <div key={key} title={formatDocumentLabel(key)} className={`h-1.5 w-6 rounded-none ${val ? 'bg-emerald-500' : 'bg-slate-200'}`} />
                          ))}
                        </div>
                        <p className="text-[9px] font-bold text-slate-500 uppercase tracking-tighter">
                          {Object.values(item.dokumen).filter(Boolean).length} / {Object.keys(item.dokumen).length} DOKUMEN OK
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
                          <Button size="sm" className="h-10 rounded-none bg-slate-900 px-8 text-[10px] font-black uppercase tracking-widest text-white hover:bg-slate-800 shadow-lg">
                            Review
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl overflow-hidden rounded-none border border-slate-200 p-0 shadow-2xl">
                          <DialogHeader className="gap-1 bg-slate-900 px-6 py-5 text-white">
                            <DialogTitle className="flex items-center gap-2 text-lg font-black uppercase tracking-tight">
                              <ShieldCheck className="h-5 w-5 text-emerald-400" /> Otentikasi KYC: {item.nama}
                            </DialogTitle>
                            <DialogDescription className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                              Audit Kelengkapan Dokumen Dan Profil Anggota Nasional
                            </DialogDescription>
                          </DialogHeader>
                          
                          <div className="grid gap-6 p-6 md:grid-cols-[1.05fr_0.95fr]">
                            <div className="space-y-4 rounded-none border border-slate-100 bg-slate-50 p-5 shadow-inner">
                              <div className="flex items-center gap-4">
                                <Avatar className="h-16 w-14 rounded-none border border-white shadow-md">
                                  <AvatarFallback className={`text-sm font-black ${getAvatarTone(item.nama)}`}>
                                    {getInitials(item.nama)}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="text-sm font-black uppercase text-slate-900 tracking-tight">{item.nama}</p>
                                  <p className="text-[10px] font-bold uppercase text-slate-500 leading-tight mt-1">{item.alamat}</p>
                                </div>
                              </div>
                              <div className="grid gap-2 sm:grid-cols-2">
                                <div className="rounded-none border border-slate-200 bg-white p-3 shadow-sm">
                                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Koperasi</p>
                                  <p className="mt-1 text-xs font-black uppercase text-emerald-700 tracking-tighter">{item.koperasi}</p>
                                </div>
                                <div className="rounded-none border border-slate-200 bg-white p-3 shadow-sm">
                                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Wilayah</p>
                                  <p className="mt-1 text-xs font-black uppercase text-slate-900 tracking-tighter">{item.desa}</p>
                                </div>
                                <div className="rounded-none border border-slate-200 bg-white p-3 shadow-sm">
                                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Klasifikasi</p>
                                  <p className="mt-1 text-xs font-black uppercase text-slate-900 tracking-tighter">{item.tipe}</p>
                                </div>
                                <div className="rounded-none border border-slate-200 bg-white p-3 shadow-sm">
                                  <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">Tgl Daftar</p>
                                  <p className="mt-1 text-xs font-black uppercase text-slate-900 tracking-tighter">{item.tanggalDaftar}</p>
                                </div>
                              </div>
                            </div>

                            <div className="space-y-4 rounded-none border border-slate-100 bg-slate-50 p-5 shadow-inner">
                              <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-900">Validasi Fisik Dokumen</p>
                                <p className="text-[9px] font-bold uppercase text-slate-500 mt-1 leading-tight">
                                  Pemeriksaan Integritas Citra Dan Keaslian Data Nasional.
                                </p>
                              </div>
                              <div className="space-y-2">
                                {Object.entries(item.dokumen).map(([k, v]) => (
                                  <div key={k} className="flex items-center justify-between rounded-none border border-slate-200 bg-white px-3 py-2.5 shadow-sm transition-colors hover:border-slate-400">
                                    <span className="text-[10px] font-black uppercase text-slate-700 tracking-tight">{formatDocumentLabel(k)}</span>
                                    {v ? (
                                      <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase text-emerald-600">
                                        <Check className="h-3 w-3" /> VALID
                                      </span>
                                    ) : (
                                      <span className="inline-flex items-center gap-1 text-[9px] font-black uppercase text-rose-600 animate-pulse">
                                        <X className="h-3 w-3" /> PERBAIKAN
                                      </span>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>

                            {showRejectDialog && (
                              <div className="md:col-span-2 space-y-3 rounded-none border border-rose-200 bg-rose-50 p-5 shadow-inner">
                                <Label className="text-[10px] font-black uppercase tracking-widest text-rose-700">Justifikasi Penolakan Dokumen</Label>
                                <Textarea 
                                  className="min-h-24 rounded-none border-rose-200 bg-white text-[11px] font-black uppercase tracking-tight focus-visible:ring-rose-500 placeholder:text-slate-300 shadow-sm" 
                                  placeholder="MASUKKAN ALASAN PENOLAKAN (MISAL: KTP KABUR / TIDAK ASLI)..."
                                  value={rejectReason}
                                  onChange={e => setRejectReason(e.target.value)}
                                />
                              </div>
                            )}
                          </div>

                          <DialogFooter className="border-t border-slate-100 bg-slate-50 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                            <p className="max-w-[240px] text-[9px] font-bold uppercase text-slate-400 leading-relaxed tracking-tighter">
                              Audit KYC Ini Bersifat Final Dan Akan Tercatat Permanen Pada Log Audit Kementerian.
                            </p>
                            {showRejectDialog ? (
                              <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
                                <button 
                                  onClick={() => setShowRejectDialog(false)} 
                                  className="h-10 rounded-none border border-slate-300 bg-white px-6 text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50 transition-all"
                                >
                                  BATAL
                                </button>
                                <button 
                                  onClick={() => handleReject(item)} 
                                  disabled={!rejectReason || isProcessing} 
                                  className="h-10 rounded-none bg-rose-600 px-8 text-[10px] font-black uppercase tracking-widest text-white shadow-lg hover:bg-rose-700 disabled:opacity-50 transition-all"
                                >
                                  {isProcessing ? <Loader2 className="animate-spin h-3.5 w-3.5 mr-2 inline" /> : <X className="h-3.5 w-3.5 mr-2 inline" />}
                                  KONFIRMASI TOLAK
                                </button>
                              </div>
                            ) : (
                              <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
                                <button 
                                  onClick={() => setShowRejectDialog(true)} 
                                  className="h-10 rounded-none border border-rose-200 bg-white px-8 text-[10px] font-black uppercase tracking-widest text-rose-600 hover:bg-rose-50 transition-all"
                                >
                                  TOLAK
                                </button>
                                <button 
                                  onClick={() => handleApprove(item)} 
                                  disabled={isProcessing} 
                                  className="h-10 rounded-none bg-slate-900 px-10 text-[10px] font-black uppercase tracking-widest text-white shadow-xl hover:bg-slate-800 disabled:opacity-50 transition-all"
                                >
                                  {isProcessing ? <Loader2 className="animate-spin h-3.5 w-3.5 mr-2 inline" /> : <ShieldCheck className="h-4 w-4 mr-2 text-emerald-400 inline" />}
                                  SETUJUI ANGGOTA
                                </button>
                              </div>
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
            <Card key={item.id} className="rounded-none border-slate-200 border-l-4 border-l-rose-500 shadow-sm group">
              <CardContent className="p-5 flex items-center justify-between bg-white">
                <div className="flex items-center gap-4">
                  <Avatar className="h-11 w-11 rounded-none border border-slate-100 shadow-sm">
                    <AvatarFallback className={`${getAvatarTone(item.nama)} text-[10px] font-black`}>{getInitials(item.nama)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-black text-slate-900 uppercase tracking-tight">{item.nama}</p>
                    <p className="text-[10px] font-black text-rose-600 uppercase tracking-widest mt-1">ALASAN: {item.alasanTolak}</p>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="h-9 rounded-none text-[9px] font-black uppercase tracking-widest border-slate-200 shadow-none hover:bg-slate-50">HUBUNGI ANGGOTA</Button>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="history" className="mt-6 space-y-4">
          {historyItems.map(item => (
            <Card key={item.id} className="rounded-none border-slate-200 border-l-4 border-l-emerald-500 shadow-sm group">
              <CardContent className="p-5 flex items-center justify-between bg-white">
                <div className="flex items-center gap-4">
                  <Avatar className="h-11 w-11 rounded-none border border-slate-100 shadow-sm">
                    <AvatarFallback className={`${getAvatarTone(item.nama)} text-[10px] font-black`}>{getInitials(item.nama)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-black text-slate-900 uppercase tracking-tight">{item.nama}</p>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">DIVERIFIKASI PADA: {item.tanggalVerifikasi?.split('T')[0]}</p>
                  </div>
                </div>
                <Badge className="bg-emerald-100 text-emerald-700 text-[9px] font-black uppercase tracking-widest border-none h-6 px-3 rounded-none">SELESAI</Badge>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
