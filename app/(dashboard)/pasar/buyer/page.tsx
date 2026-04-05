'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  Search,
  Plus,
  Building2,
  Mail,
  Phone,
  MapPin,
  TrendingUp,
  Globe,
  ShieldAlert,
  Download,
  FileText,
  Activity,
  ArrowRight,
  Store,
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
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { buyers, formatCurrency } from '@/lib/data'
import { useAuth } from '@/lib/auth/use-auth'
import { KementerianFilterBar } from '@/components/dashboard/kementerian-filter-bar'
import { ScopeFilters } from '@/lib/kementerian-dashboard-data'

const buyerTypeLabels: Record<string, string> = {
  hotel: 'Hotel',
  restoran: 'Restoran',
  retail: 'Retail',
  fmcg: 'FMCG',
  eksportir: 'Eksportir',
}

const buyerTypeColors: Record<string, string> = {
  hotel: 'bg-blue-100 text-blue-700',
  restoran: 'bg-amber-100 text-amber-700',
  retail: 'bg-emerald-100 text-emerald-700',
  fmcg: 'bg-violet-100 text-violet-700',
  eksportir: 'bg-cyan-100 text-cyan-700',
}

export default function BuyerPage() {
  const { user } = useAuth()
  const isKementerian = user?.role === 'kementerian'
  
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState<ScopeFilters>({
    provinceId: 'all',
    regionId: 'all',
    villageId: 'all',
    cooperativeId: 'all',
    commodityId: 'all',
  })

  const filteredBuyers = useMemo(() => {
    return buyers.filter((buyer) => {
      const matchesSearch = buyer.nama.toLowerCase().includes(search.toLowerCase())
      const loc = buyer.alamat.toUpperCase()
      const matchesProvince = filters.provinceId === 'all' || loc.includes(filters.provinceId)
      return matchesSearch && matchesProvince
    })
  }, [search, filters])

  const stats = useMemo(() => {
    const scale = filters.provinceId === 'all' ? 1 : 0.3
    const totalCount = filteredBuyers.length
    const totalTrx = filteredBuyers.reduce((sum, b) => sum + b.totalTransaksi, 0)
    return {
      totalCount,
      totalTrx,
      nationalScale: Math.round(1240 * scale)
    }
  }, [filteredBuyers, filters])

  if (!user) return null

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-slate-900 flex items-center justify-center shadow-xl">
            <Building2 className="h-6 w-6 text-emerald-500" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 uppercase">National Buyer Directory</h1>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
              B2B Partner Monitoring & National Sales Volume Tracking
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
           <Button variant="outline" size="sm" className="h-10 text-[10px] font-black uppercase tracking-widest text-slate-600 border-slate-200">
            <FileText className="h-4 w-4 mr-2 text-rose-600" />
            Acquisition Report
          </Button>
          <Button size="sm" className="h-10 bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-black uppercase tracking-widest px-6 shadow-lg">
            <Download className="h-4 w-4 mr-2" />
            Export Database
          </Button>
        </div>
      </div>

      {/* Kementerian Hierarchical Filter Bar */}
      <KementerianFilterBar filters={filters} setFilters={setFilters} />

      {/* High-Density KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Mitra Terdaftar', value: stats.totalCount, sub: 'Entitas B2B', icon: Building2, color: 'text-slate-900' },
          { label: 'Volume Transaksi', value: (stats.totalTrx / 1000000).toFixed(1), sub: 'Juta IDR', icon: TrendingUp, color: 'text-emerald-600' },
          { label: 'Sales Growth', value: '+12.4%', sub: 'MoM National', icon: Activity, color: 'text-blue-600' },
          { label: 'Market Reach', value: stats.nationalScale, sub: 'Active Channels', icon: Globe, color: 'text-amber-600' },
        ].map((s, i) => (
          <Card key={i} className="border-none shadow-sm bg-white overflow-hidden">
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg bg-slate-50 flex items-center justify-center">
                <s.icon className={`h-5 w-5 ${s.color}`} />
              </div>
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{s.label}</p>
                <div className="flex items-baseline gap-1">
                  <span className={`text-xl font-black tracking-tighter ${s.color}`}>{s.value}</span>
                  <span className="text-[10px] font-bold text-slate-500 uppercase">{s.sub}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search & Action Bar */}
      <Card className="border-none shadow-sm bg-slate-50/50">
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="CARI NAMA BUYER, EMAIL, ATAU LOKASI..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-white border-slate-200 h-11 text-[11px] font-bold uppercase tracking-wider focus:ring-slate-900"
              />
            </div>
            {!isKementerian && (
              <Button className="h-11 bg-slate-900 text-white font-black text-[10px] uppercase tracking-widest px-6 shadow-lg">
                <Plus className="h-4 w-4 mr-2" /> TAMBAH MITRA
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Buyer Grid - High Density Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredBuyers.map((buyer) => (
          <Card key={buyer.id} className="group border-none shadow-sm hover:shadow-xl transition-all duration-300 bg-white overflow-hidden border-t-4 border-t-slate-900">
            <CardHeader className="p-5 pb-2">
              <div className="flex items-start gap-4">
                <Avatar className="h-12 w-12 rounded-xl border-2 border-slate-50 shadow-sm shrink-0">
                  <AvatarFallback className="bg-slate-900 text-white font-black text-sm uppercase">
                    {buyer.nama.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1 space-y-1">
                  <CardTitle className="text-xs font-black text-slate-900 uppercase truncate tracking-tight">{buyer.nama}</CardTitle>
                  <Badge className={`h-5 text-[8px] font-black uppercase px-2 rounded border-none ${buyerTypeColors[buyer.tipe]}`}>
                    {buyerTypeLabels[buyer.tipe]}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-5 pt-3 space-y-4">
              <div className="space-y-2.5">
                <div className="flex items-center gap-2.5">
                   <div className="h-6 w-6 rounded bg-slate-50 flex items-center justify-center shrink-0">
                      <MapPin className="h-3 w-3 text-slate-400" />
                   </div>
                   <p className="text-[9px] font-bold text-slate-500 uppercase truncate tracking-tight leading-tight">{buyer.alamat}</p>
                </div>
                <div className="flex items-center gap-2.5">
                   <div className="h-6 w-6 rounded bg-slate-50 flex items-center justify-center shrink-0">
                      <Phone className="h-3 w-3 text-slate-400" />
                   </div>
                   <p className="text-[9px] font-black text-slate-900 tracking-widest">{buyer.kontak}</p>
                </div>
                <div className="flex items-center gap-2.5">
                   <div className="h-6 w-6 rounded bg-slate-50 flex items-center justify-center shrink-0">
                      <Mail className="h-3 w-3 text-slate-400" />
                   </div>
                   <p className="text-[9px] font-bold text-slate-500 truncate lowercase">{buyer.email}</p>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-900 text-white shadow-lg">
                 <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Total Kontribusi Transaksi</p>
                 <div className="flex items-center justify-between mt-1">
                    <p className="text-lg font-black tracking-tighter text-emerald-400">{formatCurrency(buyer.totalTransaksi)}</p>
                    <Activity className="h-4 w-4 text-slate-700" />
                 </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                 <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">KYC Status: Verified</span>
                 <Button variant="ghost" className="h-6 px-0 text-[9px] font-black text-slate-900 hover:text-emerald-600 uppercase tracking-tight">
                    LIHAT LEDGER <ArrowRight className="ml-1 h-3 w-3" />
                 </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredBuyers.length === 0 && (
        <Card className="border-dashed py-24 bg-slate-50/50">
          <CardContent className="flex flex-col items-center justify-center text-center">
            <div className="h-20 w-20 rounded-full bg-slate-100 flex items-center justify-center mb-6 text-slate-300">
              <Building2 className="h-10 w-10" />
            </div>
            <h3 className="text-xl font-black text-slate-900 uppercase">Mitra Tidak Ditemukan</h3>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-2">Gunakan filter wilayah atau sesuaikan kata kunci Anda.</p>
            <Button 
              variant="link" 
              onClick={() => {
                setSearch('')
                setFilters({ provinceId: 'all', regionId: 'all', villageId: 'all', cooperativeId: 'all', commodityId: 'all' })
              }}
              className="mt-6 text-[10px] font-black uppercase text-emerald-600"
            >
              Reset Filter Global
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Market Expansion Alert Banner */}
      <Card className="bg-slate-900 border-none overflow-hidden relative shadow-2xl group cursor-pointer">
        <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform duration-700">
          <Globe className="h-32 w-32 text-white" />
        </div>
        <CardContent className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-8 relative">
          <div className="flex items-center gap-6">
             <div className="h-14 w-14 rounded-2xl bg-white/10 border border-white/10 flex items-center justify-center shrink-0">
                <ShieldAlert className="h-7 w-7 text-emerald-400" />
             </div>
             <div>
                <div className="flex items-center gap-3">
                   <Badge className="bg-emerald-600 text-white font-black text-[9px] px-2 h-5 border-none">SYSTEM NORMAL</Badge>
                   <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active Retention Rate: 94.2%</span>
                </div>
                <p className="text-white text-base font-black uppercase mt-2 tracking-tight">Kesehatan Ekosistem Buyer Terdeteksi Optimal • Monitor Piutang Lintas Mitra.</p>
             </div>
          </div>
          <Button className="h-12 bg-white text-slate-900 hover:bg-slate-100 font-black text-[11px] uppercase tracking-widest px-8 rounded-xl shadow-xl transition-all">
             Analisis Portofolio →
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
