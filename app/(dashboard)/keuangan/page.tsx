'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Search,
  Plus,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Wallet,
  TrendingUp,
  CreditCard,
  FileText,
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
import { useAuth } from '@/lib/auth/use-auth'
import {
  KEMENTERIAN_DASHBOARD_DATA,
  type ScopeFilters,
} from '@/lib/kementerian-dashboard-data'
import { KementerianFilterBar } from '@/components/dashboard/kementerian-filter-bar'
import { ExportButton } from '@/components/dashboard/export-button'
import { transactions, formatCurrency, formatDate } from '@/lib/data'
import { members } from '@/lib/mock-data'

export default function KeuanganPage() {
  const { user } = useAuth()
  const isKementerian = user?.role === 'kementerian'
  const [search, setSearch] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [filters, setFilters] = useState<ScopeFilters>({
    provinceId: 'all',
    regionId: 'all',
    villageId: 'all',
    cooperativeId: 'all',
    commodityId: 'all',
  })

  const filteredTransactions = transactions.filter((tx) => {
    const matchesSearch = tx.deskripsi
      .toLowerCase()
      .includes(search.toLowerCase())
    const matchesType = filterType === 'all' || tx.tipe === filterType

    if (isKementerian) {
      // In a real app, transactions would be linked to cooperatives/villages
      // For this mock, we'll assume they are linked to members, and we filter by member location
      const member = members.find(m => m.name === tx.kategori || m.id === tx.id.replace('TX', 'M'))
      if (member) {
        const matchesProvince = filters.provinceId === 'all' || member.province.toUpperCase() === filters.provinceId
        const matchesRegion = filters.regionId === 'all' || member.district.toUpperCase().includes(filters.regionId.split('-')[0])
        const matchesVillage = filters.villageId === 'all' || member.village.toUpperCase().includes(filters.villageId.split('-').pop() || '')
        
        return matchesSearch && matchesType && matchesProvince && matchesRegion && matchesVillage
      }
    }

    return matchesSearch && matchesType
  })

  const totalKredit = filteredTransactions.reduce((sum, t) => sum + t.kredit, 0)
  const totalDebit = filteredTransactions.reduce((sum, t) => sum + t.debit, 0)
  const currentSaldo = filteredTransactions[filteredTransactions.length - 1]?.saldo || 0


  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Transaksi Keuangan</h1>
          <p className="text-muted-foreground">
            Kelola arus kas koperasi
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {isKementerian && (
            <ExportButton
              title="Laporan Transaksi Keuangan Nasional"
              filename="KOPDES_Keuangan_Nasional"
              data={filteredTransactions.map(tx => ({
                'Tanggal': tx.tanggal,
                'Tipe': tx.tipe,
                'Kategori': tx.kategori,
                'Deskripsi': tx.deskripsi,
                'Debit': tx.debit,
                'Kredit': tx.kredit,
                'Saldo': tx.saldo
              }))}
            />
          )}
          <Button variant="outline" asChild>
            <Link href="/keuangan/credit-scoring">
              <TrendingUp className="mr-2 h-4 w-4" />
              Credit Scoring
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/keuangan/pinjaman">
              <Wallet className="mr-2 h-4 w-4" />
              Ajukan Pinjaman
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/keuangan/simpan-pinjam">
              <CreditCard className="mr-2 h-4 w-4" />
              Simpan Pinjam
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/keuangan/laporan">
              <FileText className="mr-2 h-4 w-4" />
              Laporan
            </Link>
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Catat Transaksi
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Wallet className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{formatCurrency(currentSaldo)}</p>
                <p className="text-xs text-muted-foreground">Saldo Kas</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
                <ArrowDownRight className="h-5 w-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{formatCurrency(totalKredit)}</p>
                <p className="text-xs text-muted-foreground">Total Pemasukan</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-red-500/10">
                <ArrowUpRight className="h-5 w-5 text-red-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{formatCurrency(totalDebit)}</p>
                <p className="text-xs text-muted-foreground">Total Pengeluaran</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                <TrendingUp className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {formatCurrency(totalKredit - totalDebit)}
                </p>
                <p className="text-xs text-muted-foreground">Net Cashflow</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {isKementerian && (
        <div className="mb-4">
          <KementerianFilterBar
            filters={filters}
            setFilters={setFilters}
            search={search}
            setSearch={setSearch}
            showCommodity={false}
          />
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            {!isKementerian && (
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Cari transaksi..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
            )}
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[160px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Tipe" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Tipe</SelectItem>
                <SelectItem value="simpanan">Simpanan</SelectItem>
                <SelectItem value="pinjaman">Pinjaman</SelectItem>
                <SelectItem value="penjualan">Penjualan</SelectItem>
                <SelectItem value="pembelian">Pembelian</SelectItem>
                <SelectItem value="operasional">Operasional</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Riwayat Transaksi</CardTitle>
          <CardDescription>
            {filteredTransactions.length} transaksi ditemukan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tanggal</TableHead>
                <TableHead>Tipe</TableHead>
                <TableHead>Kategori</TableHead>
                <TableHead>Deskripsi</TableHead>
                <TableHead className="text-right">Debit</TableHead>
                <TableHead className="text-right">Kredit</TableHead>
                <TableHead className="text-right">Saldo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredTransactions.map((tx) => (
                <TableRow key={tx.id}>
                  <TableCell>{formatDate(tx.tanggal)}</TableCell>
                  <TableCell>
                    <Badge className={typeColors[tx.tipe]}>
                      {typeLabels[tx.tipe]}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">{tx.kategori}</TableCell>
                  <TableCell className="max-w-[300px] truncate text-sm">
                    {tx.deskripsi}
                  </TableCell>
                  <TableCell className="text-right">
                    {tx.debit > 0 ? (
                      <span className="text-red-500">
                        -{formatCurrency(tx.debit)}
                      </span>
                    ) : (
                      '-'
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {tx.kredit > 0 ? (
                      <span className="text-emerald-500">
                        +{formatCurrency(tx.kredit)}
                      </span>
                    ) : (
                      '-'
                    )}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(tx.saldo)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
