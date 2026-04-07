'use client'

import { useState } from 'react'
import { Building2, Clock, Mail, Phone, Search, ShoppingCart, Users } from 'lucide-react'
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
  const scaleFactor = filters.provinceId === 'all' ? 1.0 : filters.regionId === 'all' ? 0.4 : filters.villageId === 'all' ? 0.15 : 0.05
  
  const orders = filterOrdersByScope(scopedFilters)
  const buyers = getBuyersFromOrders(orders).filter((buyer) => {
    const keyword = search.toLowerCase()
    return (
      buyer.name.toLowerCase().includes(keyword) ||
      buyer.regionName.toLowerCase().includes(keyword) ||
      buyer.address.toLowerCase().includes(keyword)
    )
  })

  const totalBuyerValue = buyers.reduce((total, buyer) => total + buyer.totalValue, 0) * scaleFactor
  const displayBuyerCount = Math.round(buyers.length * scaleFactor)
  const avgContribution = displayBuyerCount === 0 ? 0 : totalBuyerValue / displayBuyerCount

  const buyerTypeSeries = [...new Map(
    buyers.map((buyer) => [
      buyer.type,
      {
        type: buyer.type,
        total: Math.round(buyers.filter((item) => item.type === buyer.type).length * scaleFactor),
      },
    ]),
  ).values()]

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Badge className="w-fit rounded-none border border-blue-200 bg-blue-50 text-blue-700 font-black uppercase tracking-widest text-[10px]">Direktori Pembeli Strategis Nasional</Badge>
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 uppercase">Analitik Buyer</h1>
          <p className="text-sm font-bold text-slate-500 uppercase tracking-wide">
            Monitoring Profil dan Kontribusi Buyer: {getScopeCaption(scopedFilters)}
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
              placeholder="Cari buyer, wilayah, atau alamat..."
              className="pl-9 rounded-none border-slate-200 font-semibold"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'BUYER TERDATA', value: displayBuyerCount.toLocaleString('id-ID'), sub: 'UNIT PEMBELI AKTIF', icon: Users, tone: 'slate' },
          { label: 'NILAI TRANSAKSI', value: formatCurrency(totalBuyerValue), sub: 'AKUMULASI BELANJA BUYER', icon: ShoppingCart, tone: 'emerald' },
          { label: 'ORDER BERJALAN', value: Math.round(buyers.reduce((total, buyer) => total + buyer.activeOrders, 0) * scaleFactor).toLocaleString('id-ID'), sub: 'PESANAN DALAM PENGIRIMAN', icon: Clock, tone: 'blue' },
          { label: 'RATA KONTRIBUSI', value: formatCurrency(avgContribution), sub: 'NILAI RATA-RATA PER BUYER', icon: Building2, tone: 'slate' },
        ].map((stat, i) => (
          <Card key={i} className="rounded-none border-none bg-white shadow-sm overflow-hidden group border-t-4 border-t-slate-900">
            <div className={`absolute top-0 left-0 h-1 w-full ${stat.tone === 'emerald' ? 'bg-emerald-500' : stat.tone === 'blue' ? 'bg-blue-500' : 'bg-slate-900'}`} />
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
            <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-900">Distribusi Tipe Buyer</CardTitle>
            <CardDescription className="text-[10px] font-bold text-slate-500 uppercase">Komposisi Profil Pembeli Berdasarkan Transaksi Aktif</CardDescription>
          </CardHeader>
          <CardContent className="h-[320px] p-4 pt-6">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={buyerTypeSeries}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="type" tickLine={false} axisLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 10, fontWeight: 700, fill: '#64748b' }} />
                <Bar dataKey="total" fill="#0f172a" radius={0} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="rounded-none border-slate-200 shadow-sm overflow-hidden border-t-4 border-t-slate-900">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100">
            <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-900">Direktori Buyer Strategis</CardTitle>
            <CardDescription className="text-[10px] font-bold text-slate-500 uppercase">Profil Pembeli dengan Volume Transaksi Tertinggi</CardDescription>
          </CardHeader>
          <CardContent className="p-4 overflow-y-auto max-h-[320px]">
            <div className="space-y-3">
              {buyers.slice(0, 8).map((buyer) => (
                <div key={buyer.id} className="rounded-none border border-slate-100 bg-slate-50/50 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[11px] font-black text-slate-900 uppercase">{buyer.name}</p>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">{buyer.regionName} · {buyer.type}</p>
                    </div>
                    <Building2 className="h-4 w-4 text-blue-500" />
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-[10px] font-bold text-slate-500 uppercase">
                    <p className="text-slate-900">{formatCurrency(buyer.totalValue * scaleFactor)} VALUASI</p>
                    <p className="text-right">{Math.round(buyer.activeOrders * scaleFactor)} ORDER AKTIF</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-none border-none bg-slate-900 text-white shadow-xl">
        <CardContent className="flex flex-col gap-4 p-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-3">
            <div className="rounded-none bg-slate-800 p-3">
              <Users className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-black uppercase tracking-widest text-white">Otentikasi Buyer Terintegrasi</p>
              <p className="text-xs font-bold text-slate-400 uppercase mt-1">
                Data buyer divalidasi melalui jaringan logistik dan sistem pembayaran terpusat kementerian.
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
