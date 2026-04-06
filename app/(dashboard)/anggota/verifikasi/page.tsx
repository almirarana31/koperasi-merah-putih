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
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Menunggu Verifikasi', value: pendingItems.length, icon: Clock, tone: 'amber' },
          { label: 'Ditolak / Perbaikan', value: rejectedItems.length, icon: XCircle, tone: 'rose' },
          { label: 'Approved (Scope)', value: historyItems.length, icon: CheckCircle, tone: 'emerald' },
          { label: 'SLA Rata-rata', value: '1.2H', icon: Activity, tone: 'slate' },
        ].map((kpi, i) => (
          <Card key={i} className="border-none shadow-[0_4px_12px_-4px_rgba(0,0,0,0.05)]">
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
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-100 pb-2">
          <TabsList className="bg-transparent h-auto p-0 flex gap-6">
            {['pending', 'rejected', 'history'].map((tab) => (
              <TabsTrigger 
                key={tab} 
                value={tab} 
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-slate-900 data-[state=active]:bg-transparent h-10 px-0 text-xs font-semibold   text-slate-400 data-[state=active]:text-slate-900"
              >
                {tab} ({tab === 'pending' ? pendingItems.length : tab === 'rejected' ? rejectedItems.length : historyItems.length})
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
              <Card key={item.id} className="border-none shadow-[0_4px_12px_-4px_rgba(0,0,0,0.05)] hover:shadow-md transition-all group overflow-hidden">
                <CardContent className="p-0">
                  <div className="flex flex-col lg:flex-row lg:items-center">
                    <div className="flex-1 p-5 border-r border-slate-50">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-12 w-12 rounded-lg border-2 border-white shadow-sm">
                          <AvatarFallback className="bg-slate-900 text-white text-xs font-semibold">
                            {item.nama.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-semibold text-slate-900  ">{item.nama}</h3>
                            <Badge variant="outline" className="text-xs font-semibold  px-1.5 h-4 border-slate-200 text-slate-500">{item.tipe}</Badge>
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
                    
                    <div className="bg-slate-50/50 p-5 lg:w-80 flex items-center justify-between gap-4">
                      <div className="space-y-1.5">
                        <p className="text-xs font-semibold text-slate-400  ">Dokumen Fisik</p>
                        <div className="flex gap-1">
                          {Object.entries(item.dokumen).map(([key, val]) => (
                            <div key={key} title={key} className={`h-1.5 w-6 rounded-full ${val ? 'bg-emerald-500' : 'bg-slate-200'}`} />
                          ))}
                        </div>
                      </div>
                      
                      <Dialog open={openDialogId === item.id} onOpenChange={open => setOpenDialogId(open ? item.id : null)}>
                        <DialogTrigger asChild>
                          <Button size="sm" className="h-9 bg-slate-900 text-white text-xs font-semibold  px-6  hover:scale-105 transition-transform">
                            Review
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-xl bg-white border-none shadow-2xl rounded-none">
                          <DialogHeader className="border-b border-slate-100 pb-4">
                            <DialogTitle className="text-sm font-semibold   flex items-center gap-2">
                              <ShieldCheck className="h-4 w-4 text-emerald-500" /> Otentikasi KYC: {item.nama}
                            </DialogTitle>
                          </DialogHeader>
                          
                          <div className="py-6 space-y-6">
                            <div className="grid grid-cols-2 gap-6">
                              <div className="space-y-4">
                                <div>
                                  <p className="text-xs font-semibold text-slate-400  ">Profil Entitas</p>
                                  <div className="mt-2 space-y-1">
                                    <p className="text-xs font-semibold text-slate-900 ">{item.nama}</p>
                                    <p className="text-xs font-bold text-slate-500  ">{item.alamat}</p>
                                    <p className="text-xs font-semibold text-emerald-600  mt-1">{item.koperasi}</p>
                                  </div>
                                </div>
                              </div>
                              <div className="space-y-4">
                                <p className="text-xs font-semibold text-slate-400  ">Validasi Dokumen</p>
                                <div className="space-y-2">
                                  {Object.entries(item.dokumen).map(([k, v]) => (
                                    <div key={k} className="flex items-center justify-between p-2 bg-slate-50 rounded border border-slate-100">
                                      <span className="text-xs font-semibold  text-slate-600">{k}</span>
                                      {v ? <Check className="h-3 w-3 text-emerald-500" /> : <X className="h-3 w-3 text-rose-500" />}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>

                            {showRejectDialog && (
                              <div className="p-4 bg-rose-50 rounded-lg space-y-3">
                                <Label className="text-xs font-semibold  text-rose-700">Alasan Penolakan</Label>
                                <Textarea 
                                  className="text-xs border-rose-200 focus-visible:ring-rose-500" 
                                  placeholder="Contoh: Foto KTP terpotong..."
                                  value={rejectReason}
                                  onChange={e => setRejectReason(e.target.value)}
                                />
                              </div>
                            )}
                          </div>

                          <DialogFooter className="bg-slate-50 p-4 flex gap-3">
                            {showRejectDialog ? (
                              <>
                                <Button variant="ghost" onClick={() => setShowRejectDialog(false)} className="text-xs font-semibold ">Batal</Button>
                                <Button variant="destructive" onClick={() => handleReject(item)} disabled={!rejectReason || isProcessing} className="text-xs font-semibold  bg-rose-600">
                                  {isProcessing ? <Loader2 className="animate-spin h-3 w-3 mr-2" /> : <X className="h-3 w-3 mr-2" />}
                                  Kirim Penolakan
                                </Button>
                              </>
                            ) : (
                              <>
                                <Button variant="outline" onClick={() => setShowRejectDialog(true)} className="text-xs font-semibold  border-slate-300 text-rose-600 h-10">TOLAK</Button>
                                <Button onClick={() => handleApprove(item)} disabled={isProcessing} className="flex-1 bg-slate-900 text-white text-xs font-semibold  h-10 ">
                                  {isProcessing ? <Loader2 className="animate-spin h-3 w-3 mr-2" /> : <ShieldCheck className="h-3.5 w-3.5 mr-2 text-emerald-400" />}
                                  SETUJUI KEANGGOTAAN
                                </Button>
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
            <Card key={item.id} className="border-l-4 border-l-rose-500 border-none shadow-sm">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-rose-50 text-rose-600 text-xs font-semibold">{item.nama[0]}</AvatarFallback>
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
            <Card key={item.id} className="border-l-4 border-l-emerald-500 border-none shadow-sm">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-emerald-50 text-emerald-600 text-xs font-semibold">{item.nama[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-xs font-semibold  text-slate-900">{item.nama}</p>
                    <p className="text-xs font-bold text-slate-400   mt-0.5">Verified on: {item.tanggalVerifikasi?.split('T')[0]}</p>
                  </div>
                </div>
                <Badge className="bg-emerald-100 text-emerald-700 text-xs font-semibold  border-none">COMPLETED</Badge>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
