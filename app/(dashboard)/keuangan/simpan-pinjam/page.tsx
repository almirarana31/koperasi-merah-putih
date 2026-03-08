'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Search,
  Plus,
  Wallet,
  CreditCard,
  AlertTriangle,
  CheckCircle,
  User,
  Calendar,
  Percent,
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import { loans, members, formatCurrency, formatDate, getStatusColor } from '@/lib/data'

export default function SimpanPinjamPage() {
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')

  const filteredLoans = loans.filter((loan) => {
    const matchesSearch = loan.memberNama
      .toLowerCase()
      .includes(search.toLowerCase())
    const matchesStatus = filterStatus === 'all' || loan.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const totalSimpanan = members.reduce(
    (sum, m) => sum + m.simpananPokok + m.simpananWajib,
    0
  )
  const totalPinjaman = loans.reduce((sum, l) => sum + l.jumlahPinjaman, 0)
  const sisaPinjaman = loans.reduce((sum, l) => sum + l.sisaPinjaman, 0)
  const pinjamanAktif = loans.filter((l) => l.status === 'aktif').length
  const pinjamanLunas = loans.filter((l) => l.status === 'lunas').length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/keuangan">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Simpan Pinjam</h1>
            <p className="text-muted-foreground">
              Kelola simpanan dan pinjaman anggota
            </p>
          </div>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Ajukan Pinjaman
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
                <Wallet className="h-5 w-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{formatCurrency(totalSimpanan)}</p>
                <p className="text-xs text-muted-foreground">Total Simpanan</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                <CreditCard className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{formatCurrency(totalPinjaman)}</p>
                <p className="text-xs text-muted-foreground">Total Pinjaman</p>
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
                <p className="text-2xl font-bold">{formatCurrency(sisaPinjaman)}</p>
                <p className="text-xs text-muted-foreground">Outstanding</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <CheckCircle className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {pinjamanLunas}/{pinjamanAktif + pinjamanLunas}
                </p>
                <p className="text-xs text-muted-foreground">Pinjaman Lunas</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="pinjaman" className="space-y-4">
        <TabsList>
          <TabsTrigger value="pinjaman">Pinjaman</TabsTrigger>
          <TabsTrigger value="simpanan">Simpanan Anggota</TabsTrigger>
        </TabsList>

        <TabsContent value="pinjaman" className="space-y-4">
          {/* Filters */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Cari anggota..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select value={filterStatus} onValueChange={setFilterStatus}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua</SelectItem>
                    <SelectItem value="aktif">Aktif</SelectItem>
                    <SelectItem value="lunas">Lunas</SelectItem>
                    <SelectItem value="menunggak">Menunggak</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Loans Table */}
          <Card>
            <CardHeader>
              <CardTitle>Daftar Pinjaman</CardTitle>
              <CardDescription>
                {filteredLoans.length} pinjaman
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Anggota</TableHead>
                    <TableHead>Jumlah Pinjaman</TableHead>
                    <TableHead>Bunga</TableHead>
                    <TableHead>Tenor</TableHead>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Progress</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLoans.map((loan) => {
                    const progressPercent =
                      ((loan.jumlahPinjaman - loan.sisaPinjaman) /
                        loan.jumlahPinjaman) *
                      100
                    return (
                      <TableRow key={loan.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{loan.memberNama}</span>
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">
                          {formatCurrency(loan.jumlahPinjaman)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Percent className="h-3 w-3 text-muted-foreground" />
                            {loan.bunga}% / tahun
                          </div>
                        </TableCell>
                        <TableCell>{loan.tenor} bulan</TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3 text-muted-foreground" />
                              {formatDate(loan.tanggalPinjam)}
                            </div>
                            <p className="text-xs text-muted-foreground">
                              JT: {formatDate(loan.tanggalJatuhTempo)}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="w-32 space-y-1">
                            <Progress value={progressPercent} className="h-2" />
                            <div className="flex justify-between text-xs text-muted-foreground">
                              <span>
                                {formatCurrency(
                                  loan.jumlahPinjaman - loan.sisaPinjaman
                                )}
                              </span>
                              <span>{Math.round(progressPercent)}%</span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getStatusColor(loan.status)}>
                            {loan.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="simpanan" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Simpanan Anggota</CardTitle>
              <CardDescription>
                Rekap simpanan pokok dan wajib
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Anggota</TableHead>
                    <TableHead className="text-right">Simpanan Pokok</TableHead>
                    <TableHead className="text-right">Simpanan Wajib</TableHead>
                    <TableHead className="text-right">Total Simpanan</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {members
                    .filter((m) => m.status === 'aktif')
                    .map((member) => (
                      <TableRow key={member.id}>
                        <TableCell className="font-medium">
                          {member.nama}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(member.simpananPokok)}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(member.simpananWajib)}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(
                            member.simpananPokok + member.simpananWajib
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
