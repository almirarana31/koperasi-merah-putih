'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Search,
  TrendingUp,
  TrendingDown,
  Users,
  AlertTriangle,
  CheckCircle,
  XCircle,
  BarChart3,
  PieChart,
  Activity,
  ShieldCheck,
  FileText,
  CreditCard,
  Wallet,
  ShoppingCart,
  Calendar,
  ChevronRight,
  Info,
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

// Credit Score Ranges
const getScoreColor = (score: number) => {
  if (score >= 750) return 'text-emerald-500'
  if (score >= 650) return 'text-green-500'
  if (score >= 550) return 'text-amber-500'
  if (score >= 450) return 'text-orange-500'
  return 'text-red-500'
}

const getScoreBadge = (score: number) => {
  if (score >= 750) return { label: 'Sangat Baik', variant: 'default' as const, color: 'bg-emerald-500' }
  if (score >= 650) return { label: 'Baik', variant: 'default' as const, color: 'bg-green-500' }
  if (score >= 550) return { label: 'Cukup', variant: 'secondary' as const, color: 'bg-amber-500' }
  if (score >= 450) return { label: 'Kurang', variant: 'outline' as const, color: 'bg-orange-500' }
  return { label: 'Buruk', variant: 'destructive' as const, color: 'bg-red-500' }
}

const getLoanEligibility = (score: number) => {
  if (score >= 750) return { eligible: true, maxLoan: 50000000, interestRate: 6, message: 'Eligible untuk pinjaman premium' }
  if (score >= 650) return { eligible: true, maxLoan: 25000000, interestRate: 8, message: 'Eligible untuk pinjaman standar' }
  if (score >= 550) return { eligible: true, maxLoan: 10000000, interestRate: 10, message: 'Eligible untuk pinjaman terbatas' }
  if (score >= 450) return { eligible: false, maxLoan: 5000000, interestRate: 12, message: 'Perlu peninjauan tambahan' }
  return { eligible: false, maxLoan: 0, interestRate: 0, message: 'Tidak eligible untuk pinjaman' }
}

// Mock member credit data
const memberCreditData = [
  {
    id: 'M001',
    nama: 'Pak Slamet Widodo',
    nik: '3201012345678901',
    tipe: 'petani',
    creditScore: 785,
    lastUpdated: '2026-03-01',
    avatar: '/images/members/slamet.jpg',
    kycVerified: true,
    dukcapilVerified: true,
    factors: {
      paymentHistory: 95, // 35% weight
      creditUtilization: 25, // 30% weight - lower is better
      creditAge: 48, // months - 15% weight
      totalAccounts: 3, // 10% weight
      recentInquiries: 1, // 10% weight - lower is better
    },
    financials: {
      totalSimpanan: 15000000,
      totalPinjaman: 10000000,
      sisaPinjaman: 3000000,
      pendapatanBulanan: 8500000,
      pengeluaranBulanan: 5200000,
    },
    purchaseHistory: {
      totalTransactions: 156,
      avgMonthlySpend: 2500000,
      topCategories: ['Pupuk', 'Bibit', 'Peralatan'],
      lastPurchase: '2026-03-05',
    },
    loanHistory: [
      { id: 'L001', amount: 5000000, status: 'lunas', date: '2024-01-15' },
      { id: 'L002', amount: 10000000, status: 'aktif', date: '2025-06-01' },
    ],
  },
  {
    id: 'M002',
    nama: 'Bu Sri Wahyuni',
    nik: '3201019876543210',
    tipe: 'umkm',
    creditScore: 692,
    lastUpdated: '2026-03-02',
    avatar: '/images/members/sri.jpg',
    kycVerified: true,
    dukcapilVerified: true,
    factors: {
      paymentHistory: 88,
      creditUtilization: 35,
      creditAge: 36,
      totalAccounts: 2,
      recentInquiries: 2,
    },
    financials: {
      totalSimpanan: 8500000,
      totalPinjaman: 15000000,
      sisaPinjaman: 8000000,
      pendapatanBulanan: 12000000,
      pengeluaranBulanan: 8500000,
    },
    purchaseHistory: {
      totalTransactions: 89,
      avgMonthlySpend: 4200000,
      topCategories: ['Bahan Makanan', 'Packaging', 'Bumbu'],
      lastPurchase: '2026-03-06',
    },
    loanHistory: [
      { id: 'L003', amount: 15000000, status: 'aktif', date: '2025-08-01' },
    ],
  },
  {
    id: 'M003',
    nama: 'Pak Ahmad Sudirman',
    nik: '3201015555666677',
    tipe: 'petani',
    creditScore: 548,
    lastUpdated: '2026-03-01',
    avatar: '/images/members/ahmad.jpg',
    kycVerified: true,
    dukcapilVerified: true,
    factors: {
      paymentHistory: 72,
      creditUtilization: 65,
      creditAge: 18,
      totalAccounts: 1,
      recentInquiries: 4,
    },
    financials: {
      totalSimpanan: 3200000,
      totalPinjaman: 8000000,
      sisaPinjaman: 6500000,
      pendapatanBulanan: 5000000,
      pengeluaranBulanan: 4200000,
    },
    purchaseHistory: {
      totalTransactions: 45,
      avgMonthlySpend: 1200000,
      topCategories: ['Pupuk', 'Pestisida'],
      lastPurchase: '2026-02-28',
    },
    loanHistory: [
      { id: 'L004', amount: 8000000, status: 'aktif', date: '2025-11-01' },
    ],
  },
  {
    id: 'M004',
    nama: 'Bu Dewi Lestari',
    nik: '3201017777888899',
    tipe: 'nelayan',
    creditScore: 425,
    lastUpdated: '2026-02-28',
    avatar: '/images/members/dewi.jpg',
    kycVerified: true,
    dukcapilVerified: false,
    factors: {
      paymentHistory: 58,
      creditUtilization: 85,
      creditAge: 6,
      totalAccounts: 1,
      recentInquiries: 6,
    },
    financials: {
      totalSimpanan: 1500000,
      totalPinjaman: 5000000,
      sisaPinjaman: 4800000,
      pendapatanBulanan: 3500000,
      pengeluaranBulanan: 3200000,
    },
    purchaseHistory: {
      totalTransactions: 23,
      avgMonthlySpend: 800000,
      topCategories: ['Jaring', 'BBM'],
      lastPurchase: '2026-02-20',
    },
    loanHistory: [
      { id: 'L005', amount: 5000000, status: 'aktif', date: '2026-01-15' },
    ],
  },
  {
    id: 'M005',
    nama: 'Pak Bambang Hartono',
    nik: '3201013333444455',
    tipe: 'peternak',
    creditScore: 820,
    lastUpdated: '2026-03-05',
    avatar: '/images/members/bambang.jpg',
    kycVerified: true,
    dukcapilVerified: true,
    factors: {
      paymentHistory: 98,
      creditUtilization: 15,
      creditAge: 72,
      totalAccounts: 4,
      recentInquiries: 0,
    },
    financials: {
      totalSimpanan: 45000000,
      totalPinjaman: 20000000,
      sisaPinjaman: 0,
      pendapatanBulanan: 25000000,
      pengeluaranBulanan: 15000000,
    },
    purchaseHistory: {
      totalTransactions: 312,
      avgMonthlySpend: 8500000,
      topCategories: ['Pakan Ternak', 'Obat Hewan', 'Peralatan'],
      lastPurchase: '2026-03-07',
    },
    loanHistory: [
      { id: 'L006', amount: 10000000, status: 'lunas', date: '2023-03-01' },
      { id: 'L007', amount: 20000000, status: 'lunas', date: '2024-06-01' },
    ],
  },
]

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount)
}

export default function CreditScoringPage() {
  const [search, setSearch] = useState('')
  const [selectedMember, setSelectedMember] = useState<typeof memberCreditData[0] | null>(null)

  const filteredMembers = memberCreditData.filter((member) =>
    member.nama.toLowerCase().includes(search.toLowerCase()) ||
    member.nik.includes(search)
  )

  // Statistics
  const avgScore = Math.round(memberCreditData.reduce((sum, m) => sum + m.creditScore, 0) / memberCreditData.length)
  const excellentCount = memberCreditData.filter(m => m.creditScore >= 750).length
  const goodCount = memberCreditData.filter(m => m.creditScore >= 650 && m.creditScore < 750).length
  const fairCount = memberCreditData.filter(m => m.creditScore >= 550 && m.creditScore < 650).length
  const poorCount = memberCreditData.filter(m => m.creditScore < 550).length
  const eligibleCount = memberCreditData.filter(m => m.creditScore >= 550).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild className="shrink-0">
            <Link href="/keuangan">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Credit Scoring</h1>
            <p className="text-sm text-muted-foreground">
              Analisis kelayakan kredit anggota koperasi
            </p>
          </div>
        </div>
        <Button asChild className="w-full sm:w-auto">
          <Link href="/keuangan/pinjaman">
            <CreditCard className="mr-2 h-4 w-4" />
            Pengajuan Pinjaman
          </Link>
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <BarChart3 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Rata-rata Skor</p>
                <p className={`text-xl sm:text-2xl font-bold ${getScoreColor(avgScore)}`}>{avgScore}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
                <TrendingUp className="h-5 w-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Skor Excellent</p>
                <p className="text-xl sm:text-2xl font-bold text-emerald-500">{excellentCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                <CheckCircle className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Eligible Pinjaman</p>
                <p className="text-xl sm:text-2xl font-bold text-green-500">{eligibleCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
                <AlertTriangle className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Perlu Review</p>
                <p className="text-xl sm:text-2xl font-bold text-amber-500">{poorCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Score Distribution */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Distribusi Credit Score</CardTitle>
          <CardDescription>Sebaran skor kredit anggota koperasi</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-4">
            <div className="flex items-center gap-3 rounded-lg border p-3">
              <div className="h-3 w-3 rounded-full bg-emerald-500" />
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Sangat Baik (750+)</p>
                <p className="font-semibold">{excellentCount} anggota</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border p-3">
              <div className="h-3 w-3 rounded-full bg-green-500" />
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Baik (650-749)</p>
                <p className="font-semibold">{goodCount} anggota</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border p-3">
              <div className="h-3 w-3 rounded-full bg-amber-500" />
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Cukup (550-649)</p>
                <p className="font-semibold">{fairCount} anggota</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-lg border p-3">
              <div className="h-3 w-3 rounded-full bg-red-500" />
              <div className="flex-1">
                <p className="text-xs text-muted-foreground">Kurang (&lt;550)</p>
                <p className="font-semibold">{poorCount} anggota</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Search and Member List */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <CardTitle className="text-base">Daftar Credit Score Anggota</CardTitle>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Cari nama atau NIK..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {/* Mobile View */}
          <div className="sm:hidden divide-y">
            {filteredMembers.map((member) => {
              const scoreBadge = getScoreBadge(member.creditScore)
              const eligibility = getLoanEligibility(member.creditScore)
              return (
                <Dialog key={member.id}>
                  <DialogTrigger asChild>
                    <div className="flex items-center justify-between p-4 hover:bg-muted/50 cursor-pointer">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className="bg-primary/10 text-primary text-sm">
                            {member.nama.split(' ').map(n => n[0]).join('').slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-sm">{member.nama}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Badge variant="outline" className="text-[10px] capitalize">{member.tipe}</Badge>
                            {member.kycVerified && <ShieldCheck className="h-3 w-3 text-emerald-500" />}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`text-lg font-bold ${getScoreColor(member.creditScore)}`}>
                          {member.creditScore}
                        </p>
                        <Badge className={`${scoreBadge.color} text-white text-[10px]`}>
                          {scoreBadge.label}
                        </Badge>
                      </div>
                    </div>
                  </DialogTrigger>
                  <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>Detail Credit Score</DialogTitle>
                      <DialogDescription>{member.nama}</DialogDescription>
                    </DialogHeader>
                    <MemberCreditDetail member={member} />
                  </DialogContent>
                </Dialog>
              )
            })}
          </div>

          {/* Desktop View */}
          <div className="hidden sm:block overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Anggota</TableHead>
                  <TableHead>NIK</TableHead>
                  <TableHead className="text-center">Credit Score</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-center">Verifikasi</TableHead>
                  <TableHead className="text-center">Max Pinjaman</TableHead>
                  <TableHead></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMembers.map((member) => {
                  const scoreBadge = getScoreBadge(member.creditScore)
                  const eligibility = getLoanEligibility(member.creditScore)
                  return (
                    <TableRow key={member.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarFallback className="bg-primary/10 text-primary text-xs">
                              {member.nama.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{member.nama}</p>
                            <Badge variant="outline" className="text-xs capitalize">{member.tipe}</Badge>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-xs">{member.nik}</TableCell>
                      <TableCell className="text-center">
                        <span className={`text-xl font-bold ${getScoreColor(member.creditScore)}`}>
                          {member.creditScore}
                        </span>
                      </TableCell>
                      <TableCell className="text-center">
                        <Badge className={`${scoreBadge.color} text-white`}>
                          {scoreBadge.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          {member.kycVerified ? (
                            <ShieldCheck className="h-4 w-4 text-emerald-500" aria-label="KYC Verified" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-500" aria-label="KYC Pending" />
                          )}
                          {member.dukcapilVerified ? (
                            <CheckCircle className="h-4 w-4 text-emerald-500" aria-label="Dukcapil Verified" />
                          ) : (
                            <AlertTriangle className="h-4 w-4 text-amber-500" aria-label="Dukcapil Pending" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-center">
                        {eligibility.eligible ? (
                          <span className="font-medium text-emerald-600">
                            {formatCurrency(eligibility.maxLoan)}
                          </span>
                        ) : (
                          <span className="text-muted-foreground text-sm">Tidak Eligible</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm">
                              Detail
                              <ChevronRight className="ml-1 h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Detail Credit Score</DialogTitle>
                              <DialogDescription>{member.nama}</DialogDescription>
                            </DialogHeader>
                            <MemberCreditDetail member={member} />
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Member Credit Detail Component
function MemberCreditDetail({ member }: { member: typeof memberCreditData[0] }) {
  const scoreBadge = getScoreBadge(member.creditScore)
  const eligibility = getLoanEligibility(member.creditScore)

  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="overview" className="text-xs sm:text-sm">Overview</TabsTrigger>
        <TabsTrigger value="factors" className="text-xs sm:text-sm">Faktor Skor</TabsTrigger>
        <TabsTrigger value="history" className="text-xs sm:text-sm">Riwayat</TabsTrigger>
      </TabsList>

      <TabsContent value="overview" className="space-y-4 mt-4">
        {/* Credit Score Gauge */}
        <div className="text-center p-4 rounded-lg bg-muted/50">
          <p className={`text-5xl font-bold ${getScoreColor(member.creditScore)}`}>
            {member.creditScore}
          </p>
          <Badge className={`${scoreBadge.color} text-white mt-2`}>
            {scoreBadge.label}
          </Badge>
          <p className="text-sm text-muted-foreground mt-2">
            Update terakhir: {member.lastUpdated}
          </p>
        </div>

        {/* Eligibility Status */}
        <Card className={eligibility.eligible ? 'border-emerald-500/50' : 'border-amber-500/50'}>
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              {eligibility.eligible ? (
                <CheckCircle className="h-5 w-5 text-emerald-500 mt-0.5" />
              ) : (
                <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
              )}
              <div>
                <p className={`font-semibold ${eligibility.eligible ? 'text-emerald-600' : 'text-amber-600'}`}>
                  {eligibility.message}
                </p>
                {eligibility.eligible && (
                  <div className="mt-2 grid gap-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Maksimal Pinjaman:</span>
                      <span className="font-medium">{formatCurrency(eligibility.maxLoan)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Bunga:</span>
                      <span className="font-medium">{eligibility.interestRate}% per tahun</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Financial Summary */}
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border p-3">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Wallet className="h-4 w-4" />
              <span className="text-xs">Total Simpanan</span>
            </div>
            <p className="text-lg font-bold text-emerald-600">
              {formatCurrency(member.financials.totalSimpanan)}
            </p>
          </div>
          <div className="rounded-lg border p-3">
            <div className="flex items-center gap-2 text-muted-foreground">
              <CreditCard className="h-4 w-4" />
              <span className="text-xs">Sisa Pinjaman</span>
            </div>
            <p className="text-lg font-bold text-amber-600">
              {formatCurrency(member.financials.sisaPinjaman)}
            </p>
          </div>
          <div className="rounded-lg border p-3">
            <div className="flex items-center gap-2 text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              <span className="text-xs">Pendapatan/Bulan</span>
            </div>
            <p className="text-lg font-bold">
              {formatCurrency(member.financials.pendapatanBulanan)}
            </p>
          </div>
          <div className="rounded-lg border p-3">
            <div className="flex items-center gap-2 text-muted-foreground">
              <TrendingDown className="h-4 w-4" />
              <span className="text-xs">Pengeluaran/Bulan</span>
            </div>
            <p className="text-lg font-bold">
              {formatCurrency(member.financials.pengeluaranBulanan)}
            </p>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="factors" className="space-y-4 mt-4">
        <div className="space-y-3">
          <div className="rounded-lg border p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Riwayat Pembayaran</span>
              </div>
              <span className="text-sm font-bold text-emerald-600">{member.factors.paymentHistory}%</span>
            </div>
            <Progress value={member.factors.paymentHistory} className="h-2" />
            <p className="text-xs text-muted-foreground mt-1">Bobot: 35% dari total skor</p>
          </div>

          <div className="rounded-lg border p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <PieChart className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Utilisasi Kredit</span>
              </div>
              <span className={`text-sm font-bold ${member.factors.creditUtilization <= 30 ? 'text-emerald-600' : member.factors.creditUtilization <= 50 ? 'text-amber-600' : 'text-red-600'}`}>
                {member.factors.creditUtilization}%
              </span>
            </div>
            <Progress value={member.factors.creditUtilization} className="h-2" />
            <p className="text-xs text-muted-foreground mt-1">Bobot: 30% dari total skor (lebih rendah = lebih baik)</p>
          </div>

          <div className="rounded-lg border p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Activity className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Usia Kredit</span>
              </div>
              <span className="text-sm font-bold">{member.factors.creditAge} bulan</span>
            </div>
            <Progress value={Math.min(member.factors.creditAge / 60 * 100, 100)} className="h-2" />
            <p className="text-xs text-muted-foreground mt-1">Bobot: 15% dari total skor</p>
          </div>

          <div className="rounded-lg border p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Total Akun</span>
              </div>
              <span className="text-sm font-bold">{member.factors.totalAccounts}</span>
            </div>
            <Progress value={member.factors.totalAccounts / 5 * 100} className="h-2" />
            <p className="text-xs text-muted-foreground mt-1">Bobot: 10% dari total skor</p>
          </div>

          <div className="rounded-lg border p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Inquiry Terakhir</span>
              </div>
              <span className={`text-sm font-bold ${member.factors.recentInquiries <= 2 ? 'text-emerald-600' : 'text-amber-600'}`}>
                {member.factors.recentInquiries}
              </span>
            </div>
            <Progress value={(5 - Math.min(member.factors.recentInquiries, 5)) / 5 * 100} className="h-2" />
            <p className="text-xs text-muted-foreground mt-1">Bobot: 10% dari total skor (lebih sedikit = lebih baik)</p>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="history" className="space-y-4 mt-4">
        {/* Purchase Behavior */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              Perilaku Pembelian
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-lg bg-muted/50 p-3">
                <p className="text-xs text-muted-foreground">Total Transaksi</p>
                <p className="text-xl font-bold">{member.purchaseHistory.totalTransactions}</p>
              </div>
              <div className="rounded-lg bg-muted/50 p-3">
                <p className="text-xs text-muted-foreground">Rata-rata/Bulan</p>
                <p className="text-lg font-bold">{formatCurrency(member.purchaseHistory.avgMonthlySpend)}</p>
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-2">Kategori Teratas</p>
              <div className="flex flex-wrap gap-1">
                {member.purchaseHistory.topCategories.map((cat) => (
                  <Badge key={cat} variant="secondary" className="text-xs">{cat}</Badge>
                ))}
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Pembelian terakhir: {member.purchaseHistory.lastPurchase}
            </p>
          </CardContent>
        </Card>

        {/* Loan History */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Riwayat Pinjaman
            </CardTitle>
          </CardHeader>
          <CardContent>
            {member.loanHistory.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">Belum ada riwayat pinjaman</p>
            ) : (
              <div className="space-y-2">
                {member.loanHistory.map((loan) => (
                  <div key={loan.id} className="flex items-center justify-between rounded-lg border p-3">
                    <div>
                      <p className="font-medium">{formatCurrency(loan.amount)}</p>
                      <p className="text-xs text-muted-foreground">{loan.date}</p>
                    </div>
                    <Badge variant={loan.status === 'lunas' ? 'default' : 'secondary'} className={loan.status === 'lunas' ? 'bg-emerald-500' : ''}>
                      {loan.status === 'lunas' ? 'Lunas' : 'Aktif'}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}
