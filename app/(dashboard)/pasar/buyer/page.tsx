'use client'

import { useState } from 'react'
import { Building2, Mail, Phone, Search, Users } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import { useAuth } from '@/lib/auth/use-auth'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { KementerianFilterBar } from '@/components/dashboard/kementerian-filter-bar'
import {
  filterOrdersByScope,
  getBuyersFromOrders,
  getScopeCaption,
  resolveOperationalFilters,
} from '@/lib/cross-entity-operations'
import type { ScopeFilters } from '@/lib/kementerian-dashboard-data'

function formatCurrency(value: number) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(value)
}

export default function BuyerPage() {
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
  const buyers = getBuyersFromOrders(orders).filter((buyer) => {
    const keyword = search.toLowerCase()
    return (
      buyer.name.toLowerCase().includes(keyword) ||
      buyer.regionName.toLowerCase().includes(keyword) ||
      buyer.address.toLowerCase().includes(keyword)
    )
  })

  const totalBuyerValue = buyers.reduce((total, buyer) => total + buyer.totalValue, 0)
  const avgContribution = buyers.length === 0 ? 0 : totalBuyerValue / buyers.length

  const buyerTypeSeries = [...new Map(
    buyers.map((buyer) => [
      buyer.type,
      {
        type: buyer.type,
        total: buyers.filter((item) => item.type === buyer.type).length,
      },
    ]),
  ).values()]

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Badge className="w-fit border border-blue-200 bg-blue-50 text-blue-700">Buyer Aktif Lintas Wilayah</Badge>
        <div>
          <h1 className="text-slate-900">Buyer</h1>
          <p className="text-muted-foreground">
            Direktori buyer dibangun dari order pada {getScopeCaption(scopedFilters)}, bukan dari daftar statis per halaman.
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
              placeholder="Cari buyer, wilayah, atau alamat"
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card className="border-slate-200 bg-white">
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Buyer Tampil</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{buyers.length}</p>
            <p className="mt-2 text-sm text-muted-foreground">Akan berubah ketika filter pasar berubah</p>
          </CardContent>
        </Card>
        <Card className="border-slate-200 bg-white">
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Nilai Transaksi</p>
            <p className="mt-2 text-3xl font-semibold text-emerald-600">{formatCurrency(totalBuyerValue)}</p>
            <p className="mt-2 text-sm text-muted-foreground">Akumulasi transaksi buyer aktif</p>
          </CardContent>
        </Card>
        <Card className="border-slate-200 bg-white">
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Order Aktif</p>
            <p className="mt-2 text-3xl font-semibold text-blue-600">
              {buyers.reduce((total, buyer) => total + buyer.activeOrders, 0)}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">Pesanan yang masih berjalan</p>
          </CardContent>
        </Card>
        <Card className="border-slate-200 bg-white">
          <CardContent className="p-5">
            <p className="text-sm text-muted-foreground">Kontribusi Rata-rata</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{formatCurrency(avgContribution)}</p>
            <p className="mt-2 text-sm text-muted-foreground">Nilai transaksi per buyer di scope ini</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card className="border-slate-200 bg-white">
          <CardHeader>
            <CardTitle>Distribusi Tipe Buyer</CardTitle>
            <CardDescription>Komposisi buyer dihitung dari transaksi aktif pada scope pasar yang sama.</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={buyerTypeSeries}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="type" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Bar dataKey="total" fill="#2563eb" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {buyers.map((buyer) => (
            <Card key={buyer.id} className="border-slate-200 bg-white">
              <CardContent className="p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-medium text-slate-900">{buyer.name}</p>
                    <p className="text-sm text-muted-foreground">{buyer.regionName}</p>
                  </div>
                  <Building2 className="h-5 w-5 text-blue-600" />
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge variant="outline" className="border-slate-200 bg-slate-50 text-slate-700">
                    {buyer.type}
                  </Badge>
                  <Badge variant="outline" className="border-slate-200 bg-slate-50 text-slate-700">
                    {buyer.cooperativeCount} koperasi
                  </Badge>
                </div>
                <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span>{buyer.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <span>{buyer.phone}</span>
                  </div>
                  <div>{buyer.address}</div>
                </div>
                <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm text-muted-foreground">Kontribusi Transaksi</p>
                  <p className="mt-2 text-xl font-semibold text-slate-900">{formatCurrency(buyer.totalValue)}</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {buyer.totalTransactions} transaksi · {buyer.activeOrders} order aktif
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Card className="border-slate-200 bg-slate-50">
        <CardContent className="flex flex-col gap-4 p-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-3">
            <div className="rounded-2xl bg-white p-3 shadow-sm">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-slate-900">Buyer Tersinkron</p>
              <p className="text-sm text-muted-foreground">
                Buyer ini muncul dari order yang sama dengan overview Pasar, jadi filter desa dan koperasi selalu ikut memengaruhi direktori.
              </p>
            </div>
          </div>
          <Badge variant="outline" className="w-fit border-slate-200 bg-white text-slate-700">
            {orders.length} order terhubung
          </Badge>
        </CardContent>
      </Card>
    </div>
  )
}
