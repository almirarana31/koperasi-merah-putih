'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  User,
  ShoppingCart,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Wallet,
  Calendar,
  MapPin,
  Phone,
  Mail,
  BarChart3,
  PieChart,
  Activity,
  Package,
  Clock,
  ChevronRight,
  Download,
  FileText,
  Award,
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

// Mock member profile data
const memberProfile = {
  id: 'M001',
  nama: 'Pak Slamet Widodo',
  nik: '3201012345678901',
  email: 'slamet.widodo@email.com',
  telepon: '081234567890',
  tipe: 'petani',
  alamat: 'Jl. Merdeka No. 45, Sukamaju, Bandung',
  tanggalDaftar: '2022-03-15',
  status: 'aktif',
  kycVerified: true,
  dukcapilVerified: true,
  creditScore: 785,
  tier: 'gold', // bronze, silver, gold, platinum
  avatar: '/images/members/slamet.jpg',
}

// Financial summary
const financialSummary = {
  totalSimpanan: 15000000,
  simpananPokok: 5000000,
  simpananWajib: 10000000,
  totalPinjaman: 10000000,
  sisaPinjaman: 3000000,
  shuDiterima: 2500000,
}

// Purchase behavior data
const purchaseBehavior = {
  totalTransaksi: 156,
  totalPembelian: 45000000,
  avgPerTransaksi: 288461,
  avgPerBulan: 2500000,
  frekuensiPerBulan: 8.7,
  lastPurchase: '2026-03-05',
  memberSince: '2022-03-15',
  loyaltyPoints: 4500,
}

// Purchase categories breakdown
const categoryBreakdown = [
  { category: 'Pupuk', amount: 18000000, percentage: 40, transactions: 62 },
  { category: 'Bibit', amount: 11250000, percentage: 25, transactions: 35 },
  { category: 'Peralatan', amount: 9000000, percentage: 20, transactions: 28 },
  { category: 'Pestisida', amount: 4500000, percentage: 10, transactions: 21 },
  { category: 'Lainnya', amount: 2250000, percentage: 5, transactions: 10 },
]

// Monthly purchase trend (last 6 months)
const monthlyTrend = [
  { month: 'Okt 2025', amount: 2100000, transactions: 7 },
  { month: 'Nov 2025', amount: 2800000, transactions: 9 },
  { month: 'Des 2025', amount: 3200000, transactions: 11 },
  { month: 'Jan 2026', amount: 2400000, transactions: 8 },
  { month: 'Feb 2026', amount: 2900000, transactions: 10 },
  { month: 'Mar 2026', amount: 1800000, transactions: 6 },
]

// Recent transactions
const recentTransactions = [
  { id: 'TRX001', date: '2026-03-05', items: ['Pupuk NPK 50kg x2', 'Bibit Padi 10kg'], total: 850000, status: 'selesai' },
  { id: 'TRX002', date: '2026-03-01', items: ['Cangkul', 'Sarung Tangan'], total: 275000, status: 'selesai' },
  { id: 'TRX003', date: '2026-02-25', items: ['Pupuk Organik 25kg x4'], total: 600000, status: 'selesai' },
  { id: 'TRX004', date: '2026-02-20', items: ['Pestisida 1L x3'], total: 450000, status: 'selesai' },
  { id: 'TRX005', date: '2026-02-15', items: ['Bibit Jagung 5kg', 'Pupuk Urea 50kg'], total: 525000, status: 'selesai' },
]

// Loan history
const loanHistory = [
  { id: 'L001', tanggal: '2024-01-15', jumlah: 5000000, tenor: 12, angsuran: 458333, sisaCicilan: 0, status: 'lunas' },
  { id: 'L002', tanggal: '2025-06-01', jumlah: 10000000, tenor: 24, angsuran: 458333, sisaCicilan: 3, status: 'aktif' },
]

// Payment history for credit score
const paymentHistory = [
  { bulan: 'Mar 2026', status: 'tepat-waktu', tanggal: '2026-03-05' },
  { bulan: 'Feb 2026', status: 'tepat-waktu', tanggal: '2026-02-03' },
  { bulan: 'Jan 2026', status: 'tepat-waktu', tanggal: '2026-01-05' },
  { bulan: 'Des 2025', status: 'tepat-waktu', tanggal: '2025-12-04' },
  { bulan: 'Nov 2025', status: 'terlambat', tanggal: '2025-11-12' },
  { bulan: 'Okt 2025', status: 'tepat-waktu', tanggal: '2025-10-05' },
]

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
  }).format(amount)
}

const getTierColor = (tier: string) => {
  switch (tier) {
    case 'platinum': return 'bg-gradient-to-r from-gray-400 to-gray-600 text-white'
    case 'gold': return 'bg-gradient-to-r from-amber-400 to-amber-600 text-white'
    case 'silver': return 'bg-gradient-to-r from-gray-300 to-gray-400 text-gray-800'
    default: return 'bg-gradient-to-r from-orange-300 to-orange-500 text-white'
  }
}

export default function MemberProfilPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild className="shrink-0">
            <Link href="/anggota">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Profil Anggota</h1>
            <p className="text-sm text-muted-foreground">
              Detail dan perilaku pembelian anggota
            </p>
          </div>
        </div>
        <Button variant="outline" className="w-full sm:w-auto">
          <Download className="mr-2 h-4 w-4" />
          Export Data
        </Button>
      </div>

      {/* Member Header Card */}
      <Card>
        <CardContent className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
            <Avatar className="h-20 w-20 mx-auto sm:mx-0">
              <AvatarImage src={memberProfile.avatar} />
              <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                {memberProfile.nama.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 text-center sm:text-left">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 justify-center sm:justify-start">
                <h2 className="text-xl font-bold">{memberProfile.nama}</h2>
                <Badge className={`${getTierColor(memberProfile.tier)} w-fit mx-auto sm:mx-0`}>
                  <Award className="mr-1 h-3 w-3" />
                  {memberProfile.tier.toUpperCase()}
                </Badge>
              </div>
              <div className="mt-2 space-y-1 text-sm text-muted-foreground">
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <CreditCard className="h-4 w-4" />
                  <span>NIK: {memberProfile.nik}</span>
                </div>
                <div className="flex items-center gap-2 justify-center sm:justify-start">
                  <MapPin className="h-4 w-4" />
                  <span>{memberProfile.alamat}</span>
                </div>
                <div className="flex flex-wrap items-center gap-4 justify-center sm:justify-start">
                  <div className="flex items-center gap-1">
                    <Phone className="h-4 w-4" />
                    <span>{memberProfile.telepon}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Mail className="h-4 w-4" />
                    <span>{memberProfile.email}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex flex-col items-center gap-2 border-t sm:border-t-0 sm:border-l pt-4 sm:pt-0 sm:pl-6">
              <p className="text-xs text-muted-foreground">Credit Score</p>
              <p className="text-4xl font-bold text-emerald-500">{memberProfile.creditScore}</p>
              <Badge className="bg-emerald-500">Sangat Baik</Badge>
              <Button size="sm" variant="outline" asChild>
                <Link href="/keuangan/credit-scoring">Detail</Link>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
                <Wallet className="h-5 w-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Simpanan</p>
                <p className="text-lg font-bold text-emerald-600">{formatCurrency(financialSummary.totalSimpanan)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
                <CreditCard className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Sisa Pinjaman</p>
                <p className="text-lg font-bold text-amber-600">{formatCurrency(financialSummary.sisaPinjaman)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <ShoppingCart className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Total Pembelian</p>
                <p className="text-lg font-bold">{formatCurrency(purchaseBehavior.totalPembelian)}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                <Award className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Loyalty Points</p>
                <p className="text-lg font-bold text-blue-600">{purchaseBehavior.loyaltyPoints.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="behavior" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="behavior" className="text-xs sm:text-sm">Pembelian</TabsTrigger>
          <TabsTrigger value="financial" className="text-xs sm:text-sm">Keuangan</TabsTrigger>
          <TabsTrigger value="loans" className="text-xs sm:text-sm">Pinjaman</TabsTrigger>
          <TabsTrigger value="history" className="text-xs sm:text-sm">Riwayat</TabsTrigger>
        </TabsList>

        {/* Purchase Behavior Tab */}
        <TabsContent value="behavior" className="space-y-4 mt-4">
          {/* Purchase Stats */}
          <div className="grid gap-4 sm:grid-cols-3">
            <Card>
              <CardContent className="p-4 text-center">
                <ShoppingCart className="h-8 w-8 mx-auto text-primary mb-2" />
                <p className="text-2xl font-bold">{purchaseBehavior.totalTransaksi}</p>
                <p className="text-xs text-muted-foreground">Total Transaksi</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <TrendingUp className="h-8 w-8 mx-auto text-emerald-500 mb-2" />
                <p className="text-2xl font-bold">{formatCurrency(purchaseBehavior.avgPerBulan)}</p>
                <p className="text-xs text-muted-foreground">Rata-rata/Bulan</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Activity className="h-8 w-8 mx-auto text-blue-500 mb-2" />
                <p className="text-2xl font-bold">{purchaseBehavior.frekuensiPerBulan}x</p>
                <p className="text-xs text-muted-foreground">Frekuensi/Bulan</p>
              </CardContent>
            </Card>
          </div>

          {/* Category Breakdown */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <PieChart className="h-4 w-4" />
                Kategori Pembelian
              </CardTitle>
              <CardDescription>Breakdown pembelian berdasarkan kategori</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {categoryBreakdown.map((cat) => (
                  <div key={cat.category} className="space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{cat.category}</span>
                        <Badge variant="outline" className="text-xs">{cat.transactions} transaksi</Badge>
                      </div>
                      <span className="font-semibold">{formatCurrency(cat.amount)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Progress value={cat.percentage} className="flex-1 h-2" />
                      <span className="text-xs text-muted-foreground w-10">{cat.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Monthly Trend */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Tren Pembelian Bulanan
              </CardTitle>
              <CardDescription>6 bulan terakhir</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {monthlyTrend.map((month) => (
                  <div key={month.month} className="flex items-center gap-4">
                    <span className="w-20 text-sm text-muted-foreground">{month.month}</span>
                    <div className="flex-1">
                      <Progress value={(month.amount / 3500000) * 100} className="h-3" />
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">{formatCurrency(month.amount)}</p>
                      <p className="text-xs text-muted-foreground">{month.transactions} transaksi</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Financial Tab */}
        <TabsContent value="financial" className="space-y-4 mt-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Wallet className="h-4 w-4 text-emerald-500" />
                  Simpanan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Simpanan Pokok</span>
                  <span className="font-semibold">{formatCurrency(financialSummary.simpananPokok)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Simpanan Wajib</span>
                  <span className="font-semibold">{formatCurrency(financialSummary.simpananWajib)}</span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="font-medium">Total Simpanan</span>
                  <span className="font-bold text-emerald-600">{formatCurrency(financialSummary.totalSimpanan)}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <CreditCard className="h-4 w-4 text-amber-500" />
                  Pinjaman
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total Pinjaman</span>
                  <span className="font-semibold">{formatCurrency(financialSummary.totalPinjaman)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sudah Dibayar</span>
                  <span className="font-semibold text-emerald-600">
                    {formatCurrency(financialSummary.totalPinjaman - financialSummary.sisaPinjaman)}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between">
                  <span className="font-medium">Sisa Pinjaman</span>
                  <span className="font-bold text-amber-600">{formatCurrency(financialSummary.sisaPinjaman)}</span>
                </div>
                <Progress 
                  value={((financialSummary.totalPinjaman - financialSummary.sisaPinjaman) / financialSummary.totalPinjaman) * 100} 
                  className="h-2" 
                />
                <p className="text-xs text-muted-foreground text-center">
                  {Math.round(((financialSummary.totalPinjaman - financialSummary.sisaPinjaman) / financialSummary.totalPinjaman) * 100)}% terbayar
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Award className="h-4 w-4 text-primary" />
                SHU (Sisa Hasil Usaha)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-4">
                <p className="text-3xl font-bold text-primary">{formatCurrency(financialSummary.shuDiterima)}</p>
                <p className="text-sm text-muted-foreground mt-1">Total SHU yang diterima</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Loans Tab */}
        <TabsContent value="loans" className="space-y-4 mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Riwayat Pinjaman</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {loanHistory.map((loan) => (
                  <div key={loan.id} className="rounded-lg border p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-mono text-xs text-muted-foreground">{loan.id}</p>
                        <p className="font-semibold">{formatCurrency(loan.jumlah)}</p>
                      </div>
                      <Badge className={loan.status === 'lunas' ? 'bg-emerald-500' : 'bg-amber-500'}>
                        {loan.status === 'lunas' ? 'Lunas' : 'Aktif'}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div>
                        <p className="text-xs text-muted-foreground">Tanggal</p>
                        <p>{loan.tanggal}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Tenor</p>
                        <p>{loan.tenor} bulan</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Angsuran</p>
                        <p>{formatCurrency(loan.angsuran)}</p>
                      </div>
                    </div>
                    {loan.status === 'aktif' && (
                      <>
                        <Progress value={((loan.tenor - loan.sisaCicilan) / loan.tenor) * 100} className="h-2" />
                        <p className="text-xs text-muted-foreground text-center">
                          {loan.tenor - loan.sisaCicilan} dari {loan.tenor} cicilan terbayar ({loan.sisaCicilan} tersisa)
                        </p>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Riwayat Pembayaran</CardTitle>
              <CardDescription>Ketepatan pembayaran cicilan</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {paymentHistory.map((payment, idx) => (
                  <div key={idx} className="flex items-center justify-between py-2 border-b last:border-0">
                    <div className="flex items-center gap-3">
                      {payment.status === 'tepat-waktu' ? (
                        <div className="h-8 w-8 rounded-full bg-emerald-500/10 flex items-center justify-center">
                          <Clock className="h-4 w-4 text-emerald-500" />
                        </div>
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-amber-500/10 flex items-center justify-center">
                          <Clock className="h-4 w-4 text-amber-500" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-sm">{payment.bulan}</p>
                        <p className="text-xs text-muted-foreground">Dibayar: {payment.tanggal}</p>
                      </div>
                    </div>
                    <Badge variant={payment.status === 'tepat-waktu' ? 'default' : 'secondary'} 
                           className={payment.status === 'tepat-waktu' ? 'bg-emerald-500' : 'bg-amber-500'}>
                      {payment.status === 'tepat-waktu' ? 'Tepat Waktu' : 'Terlambat'}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Transaction History Tab */}
        <TabsContent value="history" className="space-y-4 mt-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Transaksi Terakhir</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {/* Mobile View */}
              <div className="sm:hidden divide-y">
                {recentTransactions.map((trx) => (
                  <div key={trx.id} className="p-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs text-muted-foreground">{trx.id}</span>
                      <Badge variant="outline" className="text-xs">{trx.date}</Badge>
                    </div>
                    <div className="space-y-1">
                      {trx.items.map((item, idx) => (
                        <p key={idx} className="text-sm">{item}</p>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge className="bg-emerald-500">{trx.status}</Badge>
                      <span className="font-semibold">{formatCurrency(trx.total)}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop View */}
              <div className="hidden sm:block overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Tanggal</TableHead>
                      <TableHead>Items</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentTransactions.map((trx) => (
                      <TableRow key={trx.id}>
                        <TableCell className="font-mono text-xs">{trx.id}</TableCell>
                        <TableCell>{trx.date}</TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            {trx.items.map((item, idx) => (
                              <p key={idx} className="text-sm">{item}</p>
                            ))}
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-semibold">{formatCurrency(trx.total)}</TableCell>
                        <TableCell>
                          <Badge className="bg-emerald-500">{trx.status}</Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
