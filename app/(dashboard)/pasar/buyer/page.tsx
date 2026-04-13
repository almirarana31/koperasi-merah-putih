'use client'

import { useState } from 'react'
import { Building2, Clock, Mail, Phone, Search, ShoppingCart, Users } from 'lucide-react'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts'
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
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Analitik Pembeli Strategis</h1>
          <p className="text-[10px] font-black text-slate-500 mt-1 uppercase tracking-widest leading-relaxed">
            Direktori Pembeli Strategis Nasional • Monitoring Profil & Kontribusi Ekonomi: {getScopeCaption(scopedFilters)}
          </p>
        </div>
        <Badge variant="outline" className="h-6 rounded-none border-blue-200 bg-blue-50 text-blue-700 font-black uppercase tracking-widest text-[8px] px-3">
          Otentikasi Buyer Terintegrasi
        </Badge>
      </div>

      {showHierarchyFilter && <KementerianFilterBar filters={filters} setFilters={setFilters} />}

      <Card className="rounded-none border-none shadow-sm bg-slate-900 p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="CARI BUYER, WILAYAH, ATAU ALAMAT STRATEGIS..."
            className="pl-9 h-10 rounded-none border-slate-800 bg-slate-950 text-white text-[10px] font-black uppercase tracking-widest focus:ring-blue-500"
          />
        </div>
      </Card>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Buyer Terdata', value: displayBuyerCount.toLocaleString('id-ID'), sub: 'Unit Pembeli Aktif', icon: Users, tone: 'slate' },
          { label: 'Nilai Transaksi', value: formatCurrency(totalBuyerValue), sub: 'Akumulasi Belanja', icon: ShoppingCart, tone: 'emerald' },
          { label: 'Order Berjalan', value: Math.round(buyers.reduce((total, buyer) => total + buyer.activeOrders, 0) * scaleFactor).toLocaleString('id-ID'), sub: 'Pesanan Aktif', icon: Clock, tone: 'blue' },
          { label: 'Rata Kontribusi', value: formatCurrency(avgContribution), sub: 'Nilai Per Buyer', icon: Building2, tone: 'slate' },
        ].map((s, i) => (
          <Card key={i} className="border-none shadow-sm bg-white overflow-hidden rounded-none">
             <div className={`h-1 w-full ${
              s.tone === 'emerald' ? 'bg-emerald-500' : 
              s.tone === 'blue' ? 'bg-blue-500' : 'bg-slate-900'
            }`} />
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-10 w-10 rounded-none bg-slate-50 flex items-center justify-center shrink-0 shadow-inner">
                <s.icon className={`h-5 w-5 ${
                  s.tone === 'emerald' ? 'text-emerald-500' : 
                  s.tone === 'blue' ? 'text-blue-500' : 'text-slate-900'
                }`} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{s.label}</p>
                <div className="flex flex-col">
                  <span className="text-sm font-black text-slate-900 leading-tight">{s.value}</span>
                  <span className="text-[8px] font-bold text-slate-500 uppercase tracking-tighter">{s.sub}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="rounded-none border-none shadow-sm overflow-hidden border-t-4 border-t-slate-900 bg-white">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-4">
            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-slate-900">Distribusi Tipe Pembeli</CardTitle>
            <CardDescription className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Komposisi Profil Pembeli Nasional</CardDescription>
          </CardHeader>
          <CardContent className="h-[320px] p-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={buyerTypeSeries}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="type" tickLine={false} axisLine={false} tick={{ fontSize: 9, fontWeight: 900, fill: '#94a3b8' }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 9, fontWeight: 900, fill: '#94a3b8' }} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '0px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontSize: '10px', fontWeight: 'bold' }} />
                <Bar dataKey="total" fill="#0f172a" radius={0} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="rounded-none border-none shadow-sm overflow-hidden border-t-4 border-t-blue-600 bg-white">
          <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-4">
            <CardTitle className="text-[10px] font-black uppercase tracking-widest text-slate-900">Direktori Pembeli Utama</CardTitle>
            <CardDescription className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Profil Pembeli dengan Valuasi Tertinggi</CardDescription>
          </CardHeader>
          <CardContent className="p-4 overflow-y-auto max-h-[320px] space-y-3">
            {buyers.slice(0, 8).map((buyer) => (
              <div key={buyer.id} className="rounded-none border border-slate-100 bg-white p-4 group hover:bg-slate-50 transition-all shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <p className="text-[11px] font-black text-slate-900 uppercase group-hover:text-blue-600 transition-colors">{buyer.name}</p>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{buyer.regionName} • {buyer.type}</p>
                  </div>
                  <Building2 className="h-4 w-4 text-slate-200 group-hover:text-blue-500 transition-colors" />
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4 border-t border-slate-50 pt-3">
                  <div className="space-y-0.5">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">Valuasi</p>
                    <p className="text-[10px] font-black text-slate-900 uppercase">{formatCurrency(buyer.totalValue * scaleFactor)}</p>
                  </div>
                  <div className="space-y-0.5 text-right">
                    <p className="text-[8px] font-black text-slate-400 uppercase tracking-tighter">Order Aktif</p>
                    <p className="text-[10px] font-black text-blue-600 uppercase">{Math.round(buyer.activeOrders * scaleFactor)} BATCH</p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-none border-none bg-slate-950 text-white shadow-2xl overflow-hidden relative">
        <div className="absolute right-0 top-0 p-4 opacity-5 pointer-events-none">
          <Users className="h-24 w-24" />
        </div>
        <CardContent className="relative flex flex-col md:flex-row items-center gap-6 p-6">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center bg-slate-900 border border-white/10 shadow-inner">
            <ShoppingCart className="h-6 w-6 text-blue-400" />
          </div>
          <div className="flex-1 text-center md:text-left space-y-1">
            <p className="text-sm font-black uppercase tracking-tight">Infrastruktur Niaga Terintegrasi</p>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Data pembeli divalidasi melalui jaringan logistik dan sistem kliring kementerian.
            </p>
          </div>
          <Badge variant="outline" className="rounded-none border-white/10 bg-white/5 text-white font-black text-[10px] uppercase tracking-widest px-4 h-8 flex items-center justify-center">
            {Math.round(orders.length * scaleFactor)} ORDER TERHUBUNG
          </Badge>
        </CardContent>
      </Card>
    </div>
  )
}
