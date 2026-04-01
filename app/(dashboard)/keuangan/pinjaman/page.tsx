'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  FileCheck2,
  FileWarning,
  PiggyBank,
  Sparkles,
  TrendingUp,
  Wallet,
} from 'lucide-react'
import { useAuth } from '@/lib/auth'
import { formatCurrency, formatDate, loans, members } from '@/lib/data'
import type { Role, User } from '@/lib/rbac'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'

type PersonalLoanStatus = 'review' | 'active' | 'repaid'
type ReviewStatus = 'baru' | 'analisis' | 'komite' | 'disetujui' | 'perlu_dokumen'

type PersonalLoanRecord = {
  id: string
  purpose: string
  amount: number
  tenor: number
  submittedAt: string
  status: PersonalLoanStatus
  remainingBalance: number
  note: string
}

type SelfLoanProfile = {
  memberId: string
  nik: string
  village: string
  commodity: string
  creditScore: number
  savingsBalance: number
  activeLoanBalance: number
  maxLoanAmount: number
  interestRate: number
  recommendedTenor: number
  history: PersonalLoanRecord[]
}

type ReviewerApplication = {
  id: string
  borrowerName: string
  village: string
  commodity: string
  amount: number
  tenor: number
  score: number
  submittedAt: string
  status: ReviewStatus
  recommendation: string
  assignedRoles: Role[]
}

const tujuanPinjaman = ['Modal tanam', 'Pupuk dan bibit', 'Alat panen', 'Perbaikan irigasi']
const tenorOptions = [3, 6, 9, 12, 18]

const SELF_SERVICE_PROFILES: Record<string, SelfLoanProfile> = {
  'USR-001': {
    memberId: 'M005',
    nik: '3201234567890005',
    village: 'Cikupa, Tangerang',
    commodity: 'Padi dan gabah',
    creditScore: 742,
    savingsBalance: 8500000,
    activeLoanBalance: 4500000,
    maxLoanAmount: 35000000,
    interestRate: 6,
    recommendedTenor: 12,
    history: [
      { id: 'APL-2602-014', purpose: 'Modal pupuk musim tanam', amount: 12000000, tenor: 12, submittedAt: '2026-02-10', status: 'active', remainingBalance: 4500000, note: 'Pembayaran lancar dan diprioritaskan untuk panen April.' },
      { id: 'APL-2508-003', purpose: 'Perbaikan pompa air', amount: 7000000, tenor: 6, submittedAt: '2025-08-05', status: 'repaid', remainingBalance: 0, note: 'Lunas tepat waktu pada Januari 2026.' },
    ],
  },
}

const REVIEWER_APPLICATIONS: ReviewerApplication[] = [
  { id: 'APL-2603-031', borrowerName: 'Pak Budi Santoso', village: 'Cikupa', commodity: 'Padi', amount: 18000000, tenor: 12, score: 742, submittedAt: '2026-03-28', status: 'analisis', recommendation: 'Riwayat pembayaran baik. Siap final approval.', assignedRoles: ['bank', 'koperasi_manager', 'ketua', 'sysadmin'] },
  { id: 'APL-2603-028', borrowerName: 'Bu Sri Wahyuni', village: 'Sukamaju', commodity: 'Cabai', amount: 9000000, tenor: 9, score: 701, submittedAt: '2026-03-25', status: 'baru', recommendation: 'Dokumen lengkap, perlu scoring awal.', assignedRoles: ['bank', 'koperasi_manager', 'ketua', 'sysadmin'] },
  { id: 'APL-2603-025', borrowerName: 'Pak Hendra Wijaya', village: 'Cibodas', commodity: 'Kentang', amount: 14000000, tenor: 12, score: 733, submittedAt: '2026-03-21', status: 'komite', recommendation: 'Menunggu persetujuan komite.', assignedRoles: ['bank', 'ketua', 'sysadmin'] },
]

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

function createFallbackProfile(user: User): SelfLoanProfile {
  const member = members.find((item) => item.nama === user.name)
  const loan = loans.find((item) => item.memberNama === user.name || item.memberId === member?.id)
  const savings = (member?.simpananPokok ?? 500000) + (member?.simpananWajib ?? 1500000)
  return {
    memberId: member?.id ?? user.id,
    nik: member?.nik ?? '-',
    village: [member?.desa, member?.kecamatan].filter(Boolean).join(', ') || 'Wilayah koperasi',
    commodity: member?.komoditas?.join(', ') || 'Usaha anggota',
    creditScore: loan ? 710 : 690,
    savingsBalance: savings,
    activeLoanBalance: loan?.sisaPinjaman ?? 0,
    maxLoanAmount: Math.max(savings * 4, 10000000),
    interestRate: 6.5,
    recommendedTenor: 12,
    history: loan
      ? [{ id: loan.id, purpose: 'Pinjaman produktif anggota', amount: loan.jumlahPinjaman, tenor: loan.tenor, submittedAt: loan.tanggalPinjam, status: loan.status === 'lunas' ? 'repaid' : 'active', remainingBalance: loan.sisaPinjaman, note: loan.status === 'lunas' ? 'Pinjaman telah selesai dibayarkan.' : `Jatuh tempo ${formatDate(loan.tanggalJatuhTempo)}.` }]
      : [],
  }
}

function personalStatusMeta(status: PersonalLoanStatus) {
  const map = {
    review: { label: 'Dalam review', className: 'border-amber-200 bg-amber-50 text-amber-700' },
    active: { label: 'Berjalan', className: 'border-blue-200 bg-blue-50 text-blue-700' },
    repaid: { label: 'Lunas', className: 'border-emerald-200 bg-emerald-50 text-emerald-700' },
  }
  return map[status]
}

function reviewStatusMeta(status: ReviewStatus) {
  const map = {
    baru: { label: 'Baru masuk', className: 'border-slate-200 bg-slate-50 text-slate-700' },
    analisis: { label: 'Analisis', className: 'border-blue-200 bg-blue-50 text-blue-700' },
    komite: { label: 'Komite', className: 'border-violet-200 bg-violet-50 text-violet-700' },
    disetujui: { label: 'Disetujui', className: 'border-emerald-200 bg-emerald-50 text-emerald-700' },
    perlu_dokumen: { label: 'Butuh dokumen', className: 'border-red-200 bg-red-50 text-red-700' },
  }
  return map[status]
}

export default function PinjamanPage() {
  const { user, canRoute } = useAuth()
  const isPetaniView = user?.role === 'petani'
  const canSeeCreditScoring = canRoute('/keuangan/credit-scoring')
  const backHref = canRoute('/keuangan') ? '/keuangan' : '/dashboard'
  const profile = useMemo(() => (user ? SELF_SERVICE_PROFILES[user.id] ?? createFallbackProfile(user) : null), [user])
  const initialQueue = useMemo(
    () => (user && !isPetaniView ? REVIEWER_APPLICATIONS.filter((item) => item.assignedRoles.includes(user.role)) : []),
    [isPetaniView, user],
  )
  const [requestedAmount, setRequestedAmount] = useState(5000000)
  const [selectedPurpose, setSelectedPurpose] = useState(tujuanPinjaman[0])
  const [selectedTenor, setSelectedTenor] = useState('12')
  const [notes, setNotes] = useState('')
  const [loanHistory, setLoanHistory] = useState<PersonalLoanRecord[]>([])
  const [reviewerQueue, setReviewerQueue] = useState<ReviewerApplication[]>([])
  const [showSuccessDialog, setShowSuccessDialog] = useState(false)

  useEffect(() => {
    if (!profile) return
    setRequestedAmount(clamp(Math.min(profile.maxLoanAmount, 8000000), 1000000, profile.maxLoanAmount))
    setSelectedPurpose(tujuanPinjaman[0])
    setSelectedTenor(String(profile.recommendedTenor))
    setNotes('')
    setLoanHistory(profile.history)
  }, [profile])

  useEffect(() => {
    setReviewerQueue(initialQueue)
  }, [initialQueue])

  const monthlyInstallment = useMemo(() => {
    if (!profile) return 0
    const tenor = Number(selectedTenor)
    const interest = requestedAmount * (profile.interestRate / 100) * (tenor / 12)
    return Math.round((requestedAmount + interest) / tenor)
  }, [profile, requestedAmount, selectedTenor])

  const approvalChance = useMemo(() => {
    if (!profile) return 0
    const scoreWeight = profile.creditScore * 0.08
    const limitWeight = 35 - (requestedAmount / profile.maxLoanAmount) * 20
    return clamp(Math.round(scoreWeight + limitWeight), 45, 95)
  }, [profile, requestedAmount])

  const processedQueue = useMemo(
    () => reviewerQueue.filter((item) => item.status === 'disetujui' || item.status === 'perlu_dokumen'),
    [reviewerQueue],
  )

  const queueTotal = useMemo(() => reviewerQueue.reduce((sum, item) => sum + item.amount, 0), [reviewerQueue])

  const handleAmountInput = (value: string) => {
    if (!profile) return
    const numericValue = Number(value.replace(/[^\d]/g, ''))
    setRequestedAmount(clamp(Number.isNaN(numericValue) ? 0 : numericValue, 1000000, profile.maxLoanAmount))
  }

  const handleSubmit = () => {
    if (!profile || !user) return
    setLoanHistory((current) => [
      {
        id: `APL-${Date.now().toString().slice(-6)}`,
        purpose: selectedPurpose,
        amount: requestedAmount,
        tenor: Number(selectedTenor),
        submittedAt: new Date().toISOString().slice(0, 10),
        status: 'review',
        remainingBalance: requestedAmount,
        note: `Ajuan baru oleh ${user.name}. Menunggu verifikasi koperasi.`,
      },
      ...current,
    ])
    setNotes('')
    setShowSuccessDialog(true)
  }

  const updateApplicationStatus = (id: string, status: ReviewStatus) => {
    setReviewerQueue((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              status,
              recommendation:
                status === 'disetujui'
                  ? `Disetujui oleh ${user?.name}. Siap ke tahap pencairan.`
                  : `Dokumen tambahan diminta oleh ${user?.name}.`,
            }
          : item,
      ),
    )
  }

  if (!user) {
    return (
      <Alert>
        <FileWarning className="h-4 w-4" />
        <AlertTitle>Sesi tidak ditemukan</AlertTitle>
        <AlertDescription>Silakan kembali ke login untuk memilih role dan akun.</AlertDescription>
      </Alert>
    )
  }

  if (isPetaniView && !profile) {
    return (
      <Alert>
        <FileWarning className="h-4 w-4" />
        <AlertTitle>Profil pinjaman belum tersedia</AlertTitle>
        <AlertDescription>Data untuk akun ini belum siap. Coba pilih akun lain atau kembali ke dashboard.</AlertDescription>
      </Alert>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-3">
          <Button variant="ghost" size="sm" asChild className="w-fit px-0 hover:bg-transparent">
            <Link href={backHref}>
              <ArrowLeft className="h-4 w-4" />
              Kembali
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              {isPetaniView ? 'Pinjaman Saya' : 'Review Pengajuan Pinjaman'}
            </h1>
            <p className="text-muted-foreground">
              {isPetaniView
                ? `Semua data di halaman ini mengikuti akun ${user.name}.`
                : `Halaman ini berubah ke mode reviewer untuk role ${user.role}.`}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {canSeeCreditScoring && (
            <Button variant="outline" asChild>
              <Link href="/keuangan/credit-scoring">
                <TrendingUp className="h-4 w-4" />
                Credit Scoring
              </Link>
            </Button>
          )}
          {canRoute('/keuangan/shu') && (
            <Button variant="outline" asChild>
              <Link href="/keuangan/shu">
                <PiggyBank className="h-4 w-4" />
                Lihat SHU
              </Link>
            </Button>
          )}
          <Button asChild>
            <Link href="/assistant">
              <Sparkles className="h-4 w-4" />
              Tanya Assistant
            </Link>
          </Button>
        </div>
      </div>

      {isPetaniView && profile ? (
        <>
          <div className="grid gap-4 xl:grid-cols-[1.3fr_1fr]">
            <Card className="border-red-200/70 bg-gradient-to-br from-red-600 via-red-500 to-red-700 text-white shadow-lg shadow-red-200/60">
              <CardContent className="space-y-4 p-6">
                <Badge className="border-white/20 bg-white/15 text-white hover:bg-white/15">Akun aktif: {user.name}</Badge>
                <div>
                  <p className="text-sm text-red-50/80">Limit pinjaman untuk akun ini</p>
                  <h2 className="mt-2 text-3xl font-bold">{formatCurrency(profile.maxLoanAmount)}</h2>
                  <p className="mt-2 text-sm text-red-50/90">
                    Profil usaha {profile.commodity.toLowerCase()} di {profile.village} dengan skor {profile.creditScore}.
                  </p>
                </div>
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-2xl border border-white/15 bg-white/10 p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-red-50/75">Simpanan</p>
                    <p className="mt-2 font-semibold">{formatCurrency(profile.savingsBalance)}</p>
                  </div>
                  <div className="rounded-2xl border border-white/15 bg-white/10 p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-red-50/75">Pinjaman aktif</p>
                    <p className="mt-2 font-semibold">{formatCurrency(profile.activeLoanBalance)}</p>
                  </div>
                  <div className="rounded-2xl border border-white/15 bg-white/10 p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-red-50/75">Bunga</p>
                    <p className="mt-2 font-semibold">{profile.interestRate}% per tahun</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Ringkasan akun</CardTitle>
                <CardDescription>Data anggota ditampilkan sesuai profil akun yang aktif.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border bg-secondary/35 p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">ID anggota</p>
                  <p className="mt-2 font-semibold">{profile.memberId}</p>
                </div>
                <div className="rounded-2xl border bg-secondary/35 p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">NIK</p>
                  <p className="mt-2 font-semibold">{profile.nik}</p>
                </div>
                <div className="rounded-2xl border bg-secondary/35 p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Komoditas</p>
                  <p className="mt-2 font-semibold">{profile.commodity}</p>
                </div>
                <div className="rounded-2xl border bg-secondary/35 p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Tenor saran</p>
                  <p className="mt-2 font-semibold">{profile.recommendedTenor} bulan</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="ajukan" className="space-y-4">
            <TabsList className="grid h-auto w-full grid-cols-2 rounded-2xl bg-secondary/50 p-1">
              <TabsTrigger value="ajukan" className="rounded-xl py-2">Ajukan pinjaman</TabsTrigger>
              <TabsTrigger value="riwayat" className="rounded-xl py-2">Riwayat akun ini</TabsTrigger>
            </TabsList>

            <TabsContent value="ajukan" className="space-y-4">
              <div className="grid gap-4 xl:grid-cols-[1.3fr_0.9fr]">
                <Card>
                  <CardHeader>
                    <CardTitle>Form pembiayaan usaha</CardTitle>
                    <CardDescription>Pengajuan akan tercatat atas akun {user.name}.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-5">
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="tujuan">Tujuan pinjaman</Label>
                        <Select value={selectedPurpose} onValueChange={setSelectedPurpose}>
                          <SelectTrigger id="tujuan" className="w-full"><SelectValue placeholder="Pilih tujuan" /></SelectTrigger>
                          <SelectContent>
                            {tujuanPinjaman.map((purpose) => <SelectItem key={purpose} value={purpose}>{purpose}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="tenor">Tenor</Label>
                        <Select value={selectedTenor} onValueChange={setSelectedTenor}>
                          <SelectTrigger id="tenor" className="w-full"><SelectValue placeholder="Pilih tenor" /></SelectTrigger>
                          <SelectContent>
                            {tenorOptions.map((tenor) => <SelectItem key={tenor} value={String(tenor)}>{tenor} bulan</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between gap-3">
                        <Label htmlFor="nominal">Nominal pinjaman</Label>
                        <span className="text-sm font-medium text-primary">{formatCurrency(requestedAmount)}</span>
                      </div>
                      <Slider value={[requestedAmount]} min={1000000} max={profile.maxLoanAmount} step={500000} onValueChange={(value) => setRequestedAmount(value[0] ?? requestedAmount)} />
                      <Input id="nominal" inputMode="numeric" value={requestedAmount.toString()} onChange={(event) => handleAmountInput(event.target.value)} />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="catatan">Catatan usaha</Label>
                      <Textarea id="catatan" value={notes} onChange={(event) => setNotes(event.target.value)} placeholder="Ceritakan kebutuhan modal Anda." className="min-h-28" />
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Button onClick={handleSubmit}>
                        <Wallet className="h-4 w-4" />
                        Kirim pengajuan
                      </Button>
                      <Button variant="outline" asChild>
                        <Link href="/dashboard">Kembali ke dashboard</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CircleDollarSign className="h-5 w-5 text-primary" />
                        Simulasi otomatis
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="rounded-2xl border bg-secondary/35 p-4">
                        <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Estimasi cicilan</p>
                        <p className="mt-2 text-3xl font-bold">{formatCurrency(monthlyInstallment)}</p>
                      </div>
                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="rounded-2xl border p-4">
                          <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Peluang lolos</p>
                          <p className="mt-2 text-2xl font-semibold">{approvalChance}%</p>
                        </div>
                        <div className="rounded-2xl border p-4">
                          <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Sisa limit</p>
                          <p className="mt-2 text-2xl font-semibold">{formatCurrency(Math.max(profile.maxLoanAmount - requestedAmount, 0))}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Alert className="border-red-200 bg-red-50/80">
                    <CheckCircle2 className="h-4 w-4 text-red-600" />
                    <AlertTitle className="text-red-900">Sudah sinkron ke akun aktif</AlertTitle>
                    <AlertDescription className="text-red-900/80">
                      Data anggota, limit, dan riwayat di halaman ini mengikuti akun {user.name}.
                    </AlertDescription>
                  </Alert>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="riwayat">
              <Card>
                <CardHeader>
                  <CardTitle>Riwayat pinjaman akun {user.name}</CardTitle>
                  <CardDescription>Setiap pengajuan baru langsung muncul untuk akun yang sedang login.</CardDescription>
                </CardHeader>
                <CardContent>
                  {loanHistory.length === 0 ? (
                    <Alert>
                      <Clock3 className="h-4 w-4" />
                      <AlertTitle>Belum ada riwayat pinjaman</AlertTitle>
                      <AlertDescription>Mulai dari form pengajuan untuk membuat riwayat pertama pada akun ini.</AlertDescription>
                    </Alert>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>ID</TableHead>
                            <TableHead>Tujuan</TableHead>
                            <TableHead>Tanggal</TableHead>
                            <TableHead className="text-right">Nominal</TableHead>
                            <TableHead className="text-right">Tenor</TableHead>
                            <TableHead className="text-right">Sisa</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {loanHistory.map((item) => {
                            const status = personalStatusMeta(item.status)
                            return (
                              <TableRow key={item.id}>
                                <TableCell className="font-medium">{item.id}</TableCell>
                                <TableCell>{item.purpose}</TableCell>
                                <TableCell>{formatDate(item.submittedAt)}</TableCell>
                                <TableCell className="text-right">{formatCurrency(item.amount)}</TableCell>
                                <TableCell className="text-right">{item.tenor} bulan</TableCell>
                                <TableCell className="text-right">{formatCurrency(item.remainingBalance)}</TableCell>
                                <TableCell><Badge className={status.className}>{status.label}</Badge></TableCell>
                              </TableRow>
                            )
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            <Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">Antrian role</p><p className="mt-2 text-3xl font-bold">{reviewerQueue.length}</p></CardContent></Card>
            <Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">Nominal ditinjau</p><p className="mt-2 text-3xl font-bold">{formatCurrency(queueTotal)}</p></CardContent></Card>
            <Card><CardContent className="p-5"><p className="text-sm text-muted-foreground">Keputusan selesai</p><p className="mt-2 text-3xl font-bold">{processedQueue.length}</p></CardContent></Card>
          </div>

          <Card className="border-red-200/70 bg-gradient-to-br from-red-600 via-red-500 to-red-700 text-white shadow-lg shadow-red-200/60">
            <CardContent className="space-y-3 p-6">
              <Badge className="border-white/20 bg-white/15 text-white hover:bg-white/15">Workflow {user.role.replace('_', ' ')}</Badge>
              <h2 className="text-3xl font-bold">Mode reviewer aktif untuk {user.name}</h2>
              <p className="max-w-2xl text-sm text-red-50/90">
                Role reviewer melihat antrian verifikasi dan aksi keputusan, bukan data pribadi anggota.
              </p>
            </CardContent>
          </Card>

          <Tabs defaultValue="antrian" className="space-y-4">
            <TabsList className="grid h-auto w-full grid-cols-2 rounded-2xl bg-secondary/50 p-1">
              <TabsTrigger value="antrian" className="rounded-xl py-2">Antrian review</TabsTrigger>
              <TabsTrigger value="riwayat" className="rounded-xl py-2">Riwayat keputusan</TabsTrigger>
            </TabsList>

            <TabsContent value="antrian">
              <Card>
                <CardHeader>
                  <CardTitle>Antrian pengajuan sesuai role</CardTitle>
                  <CardDescription>Aksi di bawah langsung mengubah status antrian untuk role {user.role}.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {reviewerQueue.length === 0 ? (
                    <Alert>
                      <Clock3 className="h-4 w-4" />
                      <AlertTitle>Tidak ada antrian</AlertTitle>
                      <AlertDescription>Belum ada pengajuan yang masuk ke role ini.</AlertDescription>
                    </Alert>
                  ) : (
                    reviewerQueue.map((item) => {
                      const status = reviewStatusMeta(item.status)
                      const isFinal = item.status === 'disetujui' || item.status === 'perlu_dokumen'
                      return (
                        <Card key={item.id} className="border-dashed">
                          <CardContent className="space-y-4 p-5">
                            <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                              <div>
                                <div className="flex flex-wrap items-center gap-2">
                                  <p className="text-lg font-semibold">{item.borrowerName}</p>
                                  <Badge className={status.className}>{status.label}</Badge>
                                  <Badge variant="outline">{item.id}</Badge>
                                </div>
                                <p className="mt-2 text-sm text-muted-foreground">{item.village} | {item.commodity} | Diajukan {formatDate(item.submittedAt)}</p>
                              </div>
                              <div className="grid gap-2 sm:grid-cols-3">
                                <div className="rounded-2xl border bg-secondary/35 p-3"><p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Nominal</p><p className="mt-2 font-semibold">{formatCurrency(item.amount)}</p></div>
                                <div className="rounded-2xl border bg-secondary/35 p-3"><p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Tenor</p><p className="mt-2 font-semibold">{item.tenor} bulan</p></div>
                                <div className="rounded-2xl border bg-secondary/35 p-3"><p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Skor</p><p className="mt-2 font-semibold">{item.score}</p></div>
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground">{item.recommendation}</p>
                            {!isFinal && (
                              <div className="flex flex-wrap gap-2">
                                <Button onClick={() => updateApplicationStatus(item.id, 'disetujui')}>
                                  <FileCheck2 className="h-4 w-4" />
                                  Setujui
                                </Button>
                                <Button variant="outline" onClick={() => updateApplicationStatus(item.id, 'perlu_dokumen')}>
                                  <FileWarning className="h-4 w-4" />
                                  Minta dokumen
                                </Button>
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      )
                    })
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="riwayat">
              <Card>
                <CardHeader>
                  <CardTitle>Riwayat keputusan role {user.role}</CardTitle>
                  <CardDescription>Daftar ini ikut berubah setelah Anda menekan aksi pada antrian review.</CardDescription>
                </CardHeader>
                <CardContent>
                  {processedQueue.length === 0 ? (
                    <Alert>
                      <Clock3 className="h-4 w-4" />
                      <AlertTitle>Belum ada keputusan final</AlertTitle>
                      <AlertDescription>Aplikasi yang disetujui atau diminta revisi akan muncul di sini.</AlertDescription>
                    </Alert>
                  ) : (
                    <div className="overflow-x-auto">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Pemohon</TableHead>
                            <TableHead>Tanggal</TableHead>
                            <TableHead className="text-right">Nominal</TableHead>
                            <TableHead className="text-right">Skor</TableHead>
                            <TableHead>Status</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {processedQueue.map((item) => {
                            const status = reviewStatusMeta(item.status)
                            return (
                              <TableRow key={item.id}>
                                <TableCell><div><p className="font-medium">{item.borrowerName}</p><p className="text-xs text-muted-foreground">{item.id}</p></div></TableCell>
                                <TableCell>{formatDate(item.submittedAt)}</TableCell>
                                <TableCell className="text-right">{formatCurrency(item.amount)}</TableCell>
                                <TableCell className="text-right">{item.score}</TableCell>
                                <TableCell><Badge className={status.className}>{status.label}</Badge></TableCell>
                              </TableRow>
                            )
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      )}

      <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Pengajuan berhasil dibuat</DialogTitle>
            <DialogDescription>Ajuan baru sudah tersimpan ke riwayat akun {user.name} dan siap diproses reviewer.</DialogDescription>
          </DialogHeader>
          <div className="rounded-2xl border bg-secondary/35 p-4">
            <p className="text-sm font-medium">Ringkasan pengajuan</p>
            <p className="mt-2 text-2xl font-bold">{formatCurrency(requestedAmount)}</p>
            <p className="mt-2 text-sm text-muted-foreground">{selectedPurpose} | {selectedTenor} bulan</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSuccessDialog(false)}>Tutup</Button>
            <Button onClick={() => setShowSuccessDialog(false)}>Lanjut</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
