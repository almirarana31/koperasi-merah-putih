'use client'

import { useState } from 'react'
import { Activity, Clock, FileText, Search, ShieldCheck } from 'lucide-react'
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
  const scaleFactor = filters.provinceId === 'all' ? 1.0 : filters.regionId === 'all' ? 0.4 : filters.villageId === 'all' ? 0.15 : 0.05
  
  const orders = filterOrdersByScope(scopedFilters)

  const contracts = [...new Map(
    orders.map((order) => {
      const related = orders.filter((item) => item.buyerId === order.buyerId && item.cooperativeId === order.cooperativeId)
      const delivered = related.filter((item) => item.status === 'selesai').length
      const fulfillment = Math.round((delivered / related.length) * 100)
      const value = related.reduce((total, item) => total + item.totalValue, 0) * scaleFactor
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
          orderCount: Math.round(related.length * scaleFactor),
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
    <div className="space-y-5">
      <div className="space-y-2">
        <Badge className="w-fit rounded-none border border-blue-200 bg-blue-50 text-blue-700 font-black uppercase tracking-widest text-[10px]">Manajemen Kontrak Niaga Nasional</Badge>
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 uppercase">Monitoring Kontrak</h1>
          <p className="text-sm font-bold text-slate-500 uppercase tracking-wide">
            Pengawasan Pemenuhan Kontrak Jaringan Koperasi: {getScopeCaption(scopedFilters)}
          </p>
        </div>
      </div>

      {showHierarchyFilter && <KementerianFilterBar filters={filters} setFilters={setFilters} />}

      <Card className="rounded-none border-slate-200 shadow-sm">
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Cari nomor kontrak, buyer, atau koperasi..."
              className="pl-9 rounded-none border-slate-200 font-semibold"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'KONTRAK AKTIF', value: Math.round(contracts.length * scaleFactor).toLocaleString('id-ID'), sub: 'PERJANJIAN NIAGA BERJALAN', icon: FileText, tone: 'slate' },
          { label: 'NILAI PIPELINE', value: formatCurrency(activeValue), sub: 'VALUASI KONTRAK TERJAMIN', icon: ShieldCheck, tone: 'emerald' },
          { label: 'PERLU REVIEW', value: Math.round(contracts.filter((c) => c.status === 'review').length * scaleFactor).toLocaleString('id-ID'), sub: 'KONTRAK KRITIS / LOW FULFILLMENT', icon: Clock, tone: 'rose' },
          { label: 'RATA FULFILLMENT', value: `${contracts.length === 0 ? 0 : Math.round(contracts.reduce((t, c) => t + c.fulfillment, 0) / contracts.length)}%`, sub: 'EFEKTIVITAS PEMENUHAN NASIONAL', icon: Activity, tone: 'blue' },
        ].map((stat, i) => (
          <Card key={i} className="rounded-none border-none bg-white shadow-sm overflow-hidden group border-t-4 border-t-slate-900">
            <div className={`absolute top-0 left-0 h-1 w-full ${stat.tone === 'emerald' ? 'bg-emerald-500' : stat.tone === 'rose' ? 'bg-rose-500' : stat.tone === 'blue' ? 'bg-blue-500' : 'bg-slate-900'}`} />
            <CardHeader className="p-4 pb-2">
              <div className="flex justify-between items-start">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{stat.label}</p>
                <stat.icon className="h-4 w-4 text-slate-400 group-hover:text-slate-900 transition-colors" />
              </div>
              <CardTitle className="text-2xl font-black text-slate-900 mt-1">{stat.value}</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="text-[10px] font-bold text-slate-500 mt-1 uppercase tracking-tighter">{stat.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <Card className="rounded-none border-slate-200 shadow-sm overflow-hidden border-t-4 border-t-slate-900">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100">
            <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-900">Persentase Pemenuhan per Wilayah</CardTitle>
            <CardDescription className="text-[10px] font-bold text-slate-500 uppercase">Fulfillment Kontrak Berdasarkan Lokasi Produksi Koperasi</CardDescription>
          </CardHeader>
          <CardContent className="h-[320px] p-4 pt-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartRows}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }} />
                <Bar dataKey="fulfillment" fill="#2563eb" radius={0} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="rounded-none border-slate-200 shadow-sm overflow-hidden border-t-4 border-t-slate-900">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100">
            <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-900">Feed Pengawasan Kontrak Strategis</CardTitle>
            <CardDescription className="text-[10px] font-bold text-slate-500 uppercase">Prioritas Pemantauan Berdasarkan Status dan Progres</CardDescription>
          </CardHeader>
          <CardContent className="p-4 overflow-y-auto max-h-[320px]">
            <div className="space-y-3">
              {contracts.slice(0, 6).map((contract) => (
                <div key={contract.id} className="rounded-none border border-slate-100 bg-slate-50/50 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[11px] font-black text-slate-900 uppercase">{contract.contractNumber}</p>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">{contract.buyerName} · {contract.destinationRegion}</p>
                    </div>
                    <Badge variant="outline" className={`rounded-none text-[9px] font-black uppercase tracking-widest ${statusTone(contract.status)}`}>
                      {contract.status}
                    </Badge>
                  </div>
                  <div className="mt-3 space-y-1 text-[10px] font-bold text-slate-500 uppercase">
                    <p className="text-slate-900">{contract.cooperativeName}</p>
                    <p>{contract.commodityMix.join(', ')}</p>
                    <p>UPDATE TERAKHIR {formatDate(contract.lastUpdate)}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-none border-slate-200 shadow-sm overflow-hidden border-t-4 border-t-slate-900">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100">
          <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-900">Matriks Pemantauan Kontrak Nasional</CardTitle>
          <CardDescription className="text-[10px] font-bold text-slate-500 uppercase">Sinkronisasi Data Kontrak Berdasarkan Transaksi Riil</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-50">
              <TableRow>
                <TableHead className="text-[10px] font-black uppercase tracking-widest">No. Kontrak</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest">Buyer/Pembeli</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest">Koperasi/Pemasok</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest">Komoditas</TableHead>
                <TableHead className="text-right text-[10px] font-black uppercase tracking-widest">Nilai</TableHead>
                <TableHead className="text-right text-[10px] font-black uppercase tracking-widest">PO</TableHead>
                <TableHead className="text-right text-[10px] font-black uppercase tracking-widest">Fulfillment</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contracts.slice(0, 15).map((contract) => (
                <TableRow key={contract.id} className="hover:bg-slate-50/50 transition-colors">
                  <TableCell className="font-mono text-[11px] font-bold">{contract.contractNumber}</TableCell>
                  <TableCell className="text-[11px] font-black text-slate-900 uppercase">{contract.buyerName}</TableCell>
                  <TableCell className="text-[11px] font-bold text-slate-500 uppercase">{contract.cooperativeName}</TableCell>
                  <TableCell className="text-[11px] font-bold text-slate-500 uppercase">{contract.commodityMix.join(', ')}</TableCell>
                  <TableCell className="text-right text-[11px] font-black">{formatCurrency(contract.value)}</TableCell>
                  <TableCell className="text-right text-[11px] font-bold">{contract.orderCount}</TableCell>
                  <TableCell className="text-right text-[11px] font-black">{contract.fulfillment}%</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`rounded-none text-[9px] font-black uppercase tracking-widest ${statusTone(contract.status)}`}>
                      {contract.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="rounded-none border-none bg-slate-900 text-white shadow-xl">
        <CardContent className="flex flex-col gap-4 p-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-3">
            <div className="rounded-none bg-slate-800 p-3">
              <ShieldCheck className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-black uppercase tracking-widest text-white">Kontrak Terverifikasi Nasional</p>
              <p className="text-xs font-bold text-slate-400 uppercase mt-1">
                Data kontrak ini terintegrasi langsung dengan database logistik dan arus kas kementerian.
              </p>
            </div>
          </div>
          <Badge variant="outline" className="rounded-none border-slate-700 bg-slate-800 text-slate-400 font-black text-[10px] uppercase tracking-widest px-3 py-1">
            {Math.round(orders.length * scaleFactor)} ORDER TERHUBUNG
          </Badge>
        </CardContent>
      </Card>
    </div>
  )
}
