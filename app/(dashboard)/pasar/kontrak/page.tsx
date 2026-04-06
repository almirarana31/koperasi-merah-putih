'use client'

import { useState } from 'react'
import { FileText, Search, ShieldCheck } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import { useAuth } from '@/lib/auth/use-auth'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { KementerianFilterBar } from '@/components/dashboard/kementerian-filter-bar'
import {
  filterOrdersByScope,
  getScopeCaption,
  resolveOperationalFilters,
} from '@/lib/cross-entity-operations'
import type { ScopeFilters } from '@/lib/kementerian-dashboard-data'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

function formatCurrency(value: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value)
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

function statusTone(status: string) {
  if (status === 'aktif') return 'bg-emerald-50 text-emerald-700 border-emerald-200'
  if (status === 'review') return 'bg-amber-50 text-amber-700 border-amber-200'
  return 'bg-blue-50 text-blue-700 border-blue-200'
}

export default function KontrakKementerianPage() {
  const { user } = useAuth()
  const showHierarchyFilter = user?.role === 'kementerian' || user?.role === 'pemda' || user?.role === 'sysadmin'

  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState<ScopeFilters>({
    provinceId: 'all',
    regionId: 'all',
    villageId: 'all',
    cooperativeId: 'all',
    commodityId: 'all',
  })

  const scopedFilters = resolveOperationalFilters(user, filters)
  const orders = filterOrdersByScope(scopedFilters)

  const contracts = [...new Map(
    orders.map((order) => {
      const related = orders.filter((item) => item.buyerId === order.buyerId && item.cooperativeId === order.cooperativeId)
      const delivered = related.filter((item) => item.status === 'selesai').length
      const fulfillment = Math.round((delivered / related.length) * 100)
      const value = related.reduce((total, item) => total + item.totalValue, 0)
      const key = `${order.buyerId}-${order.cooperativeId}`

      return [
        key,
        {
          id: key,
          contractNumber: `KTR-${order.cooperativeId.slice(-4)}-${order.buyerId.slice(-2)}`,
          buyerName: order.buyerName,
          cooperativeName: order.cooperativeName,
          regionName: order.regionName,
          destinationRegion: order.destinationRegion,
          commodityMix: [...new Set(related.map((item) => item.commodityName))],
          value,
          orderCount: related.length,
          fulfillment,
          status: fulfillment === 100 ? 'selesai' : fulfillment >= 60 ? 'aktif' : 'review',
          lastUpdate: related.sort((left, right) => right.createdAt.localeCompare(left.createdAt))[0]?.createdAt ?? order.createdAt,
        },
      ] as const
    }),
  ).values()].filter((contract) => {
    const keyword = search.toLowerCase()
    return (
      contract.contractNumber.toLowerCase().includes(keyword) ||
      contract.buyerName.toLowerCase().includes(keyword) ||
      contract.cooperativeName.toLowerCase().includes(keyword)
    )
  })

  const activeValue = contracts.reduce((total, contract) => total + contract.value, 0)
  const chartRows = contracts.map((contract) => ({
    name: contract.regionName,
    fulfillment: contract.fulfillment,
  }))

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Badge className="w-fit border border-blue-200 bg-blue-50 text-blue-700">Kontrak Lintas Wilayah</Badge>
        <div>
          <h1 className="text-slate-900">Kontrak</h1>
          <p className="text-muted-foreground">
            Monitoring kontrak dibentuk dari order buyer pada {getScopeCaption(scopedFilters)} sehingga progres dan nilainya selalu sinkron dengan section Pasar lainnya.
          </p>
        </div>
      </div>

      {showHierarchyFilter && <KementerianFilterBar filters={filters} setFilters={setFilters} />}

      <Card className="border-slate-200 bg-white">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Cari nomor kontrak, buyer, atau koperasi"
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="border-slate-200 bg-white">
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Kontrak Aktif</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{contracts.length}</p>
            <p className="mt-2 text-sm text-muted-foreground">Semua kontrak yang terbentuk dari transaksi aktif</p>
          </CardContent>
        </Card>
        <Card className="border-slate-200 bg-white">
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Nilai Pipeline</p>
            <p className="mt-2 text-3xl font-semibold text-emerald-600">{formatCurrency(activeValue)}</p>
            <p className="mt-2 text-sm text-muted-foreground">Akumulasi seluruh kontrak dalam scope ini</p>
          </CardContent>
        </Card>
        <Card className="border-slate-200 bg-white">
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Perlu Review</p>
            <p className="mt-2 text-3xl font-semibold text-amber-600">
              {contracts.filter((contract) => contract.status === 'review').length}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">Kontrak dengan fulfillment rendah</p>
          </CardContent>
        </Card>
        <Card className="border-slate-200 bg-white">
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Fulfillment Rata-rata</p>
            <p className="mt-2 text-3xl font-semibold text-blue-600">
              {contracts.length === 0 ? 0 : Math.round(contracts.reduce((total, contract) => total + contract.fulfillment, 0) / contracts.length)}%
            </p>
            <p className="mt-2 text-sm text-muted-foreground">Dihitung dari order yang sama dengan dashboard pasar</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <Card className="border-slate-200 bg-white">
          <CardHeader>
            <CardTitle>Fulfillment per Kontrak</CardTitle>
            <CardDescription>Progress kontrak ikut berubah saat filter scope pasar berubah.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartRows}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="name" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Bar dataKey="fulfillment" fill="#2563eb" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-slate-200 bg-white">
          <CardHeader>
            <CardTitle>Feed Pengawasan</CardTitle>
            <CardDescription>Ringkasan kontrak prioritas tanpa panel gelap.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {contracts.slice(0, 6).map((contract) => (
              <div key={contract.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="font-medium text-slate-900">{contract.contractNumber}</p>
                    <p className="text-sm text-muted-foreground">{contract.buyerName} · {contract.destinationRegion}</p>
                  </div>
                  <Badge variant="outline" className={statusTone(contract.status)}>
                    {contract.status}
                  </Badge>
                </div>
                <div className="mt-3 grid gap-2 text-sm text-muted-foreground">
                  <span>{contract.cooperativeName}</span>
                  <span>{contract.commodityMix.join(', ')}</span>
                  <span>Update terakhir {formatDate(contract.lastUpdate)}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="border-slate-200 bg-white">
        <CardHeader>
          <CardTitle>Daftar Kontrak</CardTitle>
          <CardDescription>Nilai, fulfillment, dan komoditas kontrak mengikuti transaksi Pasar yang sama.</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No. Kontrak</TableHead>
                <TableHead>Buyer</TableHead>
                <TableHead>Koperasi</TableHead>
                <TableHead>Komoditas</TableHead>
                <TableHead className="text-right">Nilai</TableHead>
                <TableHead className="text-right">Order</TableHead>
                <TableHead className="text-right">Fulfillment</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contracts.map((contract) => (
                <TableRow key={contract.id}>
                  <TableCell className="font-mono text-sm">{contract.contractNumber}</TableCell>
                  <TableCell>{contract.buyerName}</TableCell>
                  <TableCell>{contract.cooperativeName}</TableCell>
                  <TableCell>{contract.commodityMix.join(', ')}</TableCell>
                  <TableCell className="text-right">{formatCurrency(contract.value)}</TableCell>
                  <TableCell className="text-right">{contract.orderCount}</TableCell>
                  <TableCell className="text-right">{contract.fulfillment}%</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={statusTone(contract.status)}>
                      {contract.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="border-slate-200 bg-slate-50">
        <CardContent className="flex flex-col gap-4 p-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-3">
            <div className="rounded-2xl bg-white p-3 shadow-sm">
              <ShieldCheck className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-slate-900">Kontrak Tersinkron</p>
              <p className="text-sm text-muted-foreground">
                Halaman kontrak kini ikut memakai data order lintas desa yang sama dengan Buyer, Harga, Marketplace, dan Katalog.
              </p>
            </div>
          </div>
          <Badge variant="outline" className="w-fit border-slate-200 bg-white text-slate-700">
            {orders.length} order sumber
          </Badge>
        </CardContent>
      </Card>
    </div>
  )
}
