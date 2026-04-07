"use client"

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import {
  ShoppingCart,
  Package,
  TrendingUp,
  DollarSign,
  Users,
  Store,
  Smartphone,
  Globe,
  MessageCircle,
  CheckCircle2,
  Clock,
  Truck,
  Search,
} from "lucide-react"
import { marketOrders } from "@/lib/mock-data"
import { KementerianFilterBar } from '@/components/dashboard/kementerian-filter-bar'
import { resolveOperationalFilters, getScopeCaption } from '@/lib/cross-entity-operations'
import { useAuth } from '@/lib/auth/use-auth'
import type { ScopeFilters } from '@/lib/kementerian-dashboard-data'

export default function MarketplacePage() {
  const { user } = useAuth()
  const [filters, setFilters] = useState<ScopeFilters>({
    provinceId: 'all',
    regionId: 'all',
    villageId: 'all',
    cooperativeId: 'all',
    commodityId: 'all',
  })

  const scopedFilters = resolveOperationalFilters(user, filters)
  const scaleFactor = filters.provinceId === 'all' ? 1.0 : filters.regionId === 'all' ? 0.4 : filters.villageId === 'all' ? 0.15 : 0.05

  // Filter orders by channel
  const filteredOrders = marketOrders.slice(0, Math.round(marketOrders.length * scaleFactor))
  const tokopediaOrders = filteredOrders.filter(o => o.channel === "tokopedia")
  const shopeeOrders = filteredOrders.filter(o => o.channel === "shopee")
  const blibliOrders = filteredOrders.filter(o => o.channel === "blibli")
  const tiktokOrders = filteredOrders.filter(o => o.channel === "tiktok")
  const whatsappOrders = filteredOrders.filter(o => o.channel === "whatsapp")
  const websiteOrders = filteredOrders.filter(o => o.channel === "website")
  const offlineOrders = filteredOrders.filter(o => o.channel === "offline")

  const totalOrders = filteredOrders.length
  const totalRevenue = filteredOrders.reduce((sum, o) => sum + o.total, 0)
  const pendingOrders = filteredOrders.filter(o => o.status === "new" || o.status === "confirmed").length
  const deliveredOrders = filteredOrders.filter(o => o.status === "delivered").length

  const channelConfig = {
    tokopedia: { icon: Store, color: "emerald", name: "Tokopedia", count: tokopediaOrders.length, revenue: tokopediaOrders.reduce((sum, o) => sum + o.total, 0) },
    shopee: { icon: ShoppingCart, color: "rose", name: "Shopee", count: shopeeOrders.length, revenue: shopeeOrders.reduce((sum, o) => sum + o.total, 0) },
    blibli: { icon: Package, color: "blue", name: "Blibli", count: blibliOrders.length, revenue: blibliOrders.reduce((sum, o) => sum + o.total, 0) },
    tiktok: { icon: Smartphone, color: "slate", name: "TikTok Shop", count: tiktokOrders.length, revenue: tiktokOrders.reduce((sum, o) => sum + o.total, 0) },
    whatsapp: { icon: MessageCircle, color: "emerald", name: "WhatsApp", count: whatsappOrders.length, revenue: whatsappOrders.reduce((sum, o) => sum + o.total, 0) },
    website: { icon: Globe, color: "blue", name: "Website", count: websiteOrders.length, revenue: websiteOrders.reduce((sum, o) => sum + o.total, 0) },
    offline: { icon: Store, color: "amber", name: "Offline/Toko", count: offlineOrders.length, revenue: offlineOrders.reduce((sum, o) => sum + o.total, 0) }
  }

  return (
    <div className="flex-1 space-y-6 p-6 bg-slate-50/30">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <Badge className="w-fit rounded-none border border-slate-200 bg-slate-900 text-white font-black uppercase tracking-widest text-[10px]">Pilar 4: B2B Hub Nasional</Badge>
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900 uppercase">Marketplace & Order Hub</h1>
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wide">
              Manajemen Penjualan Omni-channel: {getScopeCaption(scopedFilters)}
            </p>
          </div>
        </div>
      </div>

      <KementerianFilterBar filters={filters} setFilters={setFilters} />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'TOTAL ORDER', value: totalOrders.toLocaleString('id-ID'), sub: 'PESANAN TERINTEGRASI', icon: ShoppingCart, tone: 'slate' },
          { label: 'TOTAL REVENUE', value: `Rp ${(totalRevenue / 1000000).toFixed(1)}M`, sub: 'OMZET OMNI-CHANNEL', icon: DollarSign, tone: 'emerald' },
          { label: 'PENDING ORDER', value: pendingOrders.toLocaleString('id-ID'), sub: 'PERLU KONFIRMASI', icon: Clock, tone: 'amber' },
          { label: 'TERKIRIM', value: deliveredOrders.toLocaleString('id-ID'), sub: 'PESANAN SELESAI', icon: CheckCircle2, tone: 'blue' },
        ].map((stat, i) => (
          <Card key={i} className="rounded-none border-none bg-white shadow-sm overflow-hidden group border-t-4 border-t-slate-900">
            <div className={`absolute top-0 left-0 h-1 w-full ${stat.tone === 'emerald' ? 'bg-emerald-500' : stat.tone === 'blue' ? 'bg-blue-500' : stat.tone === 'amber' ? 'bg-amber-500' : 'bg-slate-900'}`} />
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

      <Card className="rounded-none border-slate-200 shadow-sm overflow-hidden border-t-4 border-t-slate-900">
        <CardHeader className="bg-slate-50/50 border-b border-slate-100">
          <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-900">7 Channel Marketplace Utama</CardTitle>
          <CardDescription className="text-[10px] font-bold text-slate-500 uppercase">Monitoring Performa Penjualan Lintas Platform</CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {Object.entries(channelConfig).map(([key, config]) => {
              const Icon = config.icon
              return (
                <div key={key} className="rounded-none border border-slate-100 bg-slate-50/50 p-4 transition-all hover:bg-white hover:shadow-md">
                  <div className="flex items-center gap-3">
                    <div className="rounded-none bg-slate-900 p-2">
                      <Icon className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-[11px] font-black text-slate-900 uppercase tracking-tight">{config.name}</h4>
                      <p className="text-[10px] font-bold text-slate-500 uppercase">{config.count} ORDERS</p>
                    </div>
                  </div>
                  <div className="mt-4 border-t border-slate-100 pt-3">
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Revenue</p>
                    <p className="text-lg font-black text-slate-900">
                      Rp {(config.revenue / 1000000).toFixed(1)}M
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="bg-slate-100 rounded-none p-1 h-12">
          {[
            { id: 'all', label: 'SEMUA', count: totalOrders },
            { id: 'tokopedia', label: 'TOKOPEDIA', count: tokopediaOrders.length },
            { id: 'shopee', label: 'SHOPEE', count: shopeeOrders.length },
            { id: 'tiktok', label: 'TIKTOK', count: tiktokOrders.length },
            { id: 'whatsapp', label: 'WHATSAPP', count: whatsappOrders.length },
            { id: 'website', label: 'WEBSITE', count: websiteOrders.length },
            { id: 'offline', label: 'OFFLINE', count: offlineOrders.length },
          ].map((tab) => (
            <TabsTrigger 
              key={tab.id} 
              value={tab.id} 
              className="rounded-none data-[state=active]:bg-slate-900 data-[state=active]:text-white font-black text-[10px] uppercase tracking-widest px-6 h-full"
            >
              {tab.label} ({tab.count})
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {filteredOrders.slice(0, 10).map((order) => (
              <Card key={order.id} className="rounded-none border-slate-200 shadow-sm hover:border-slate-900 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-start gap-4">
                    <div className="rounded-none bg-slate-100 p-3">
                      <ShoppingCart className="h-5 w-5 text-slate-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">{order.orderNumber}</h3>
                            <Badge variant="outline" className="rounded-none border-slate-900 text-slate-900 text-[9px] font-black uppercase tracking-widest">
                              {order.channel}
                            </Badge>
                            <Badge
                              variant="outline"
                              className={`rounded-none text-[9px] font-black uppercase tracking-widest ${
                                order.status === "delivered" ? "border-emerald-500 text-emerald-600" : 
                                order.status === "shipped" ? "border-blue-500 text-blue-600" :
                                order.status === "confirmed" ? "border-amber-500 text-amber-600" : "border-slate-300 text-slate-500"
                              }`}
                            >
                              {order.status === "delivered" ? "Terkirim" : 
                               order.status === "shipped" ? "Dikirim" :
                               order.status === "confirmed" ? "Dikonfirmasi" : "Baru"}
                            </Badge>
                          </div>
                          <p className="mt-1 text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
                            {order.buyer.name} • {order.buyer.type}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Total</p>
                          <p className="text-lg font-black text-slate-900">
                            Rp {order.total.toLocaleString("id-ID")}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 rounded-none bg-slate-50 p-3 border border-slate-100">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Items:</p>
                        <div className="space-y-1">
                          {order.items.map((item, index) => (
                            <div key={index} className="flex items-center justify-between text-[11px] font-bold uppercase">
                              <span className="text-slate-700">
                                {item.productName} × {item.quantity} kg
                              </span>
                              <span className="text-slate-900">
                                Rp {item.subtotal.toLocaleString("id-ID")}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="mt-4 grid grid-cols-3 gap-3 border-t border-slate-100 pt-4">
                        <div>
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Payment</p>
                          <p className="text-[11px] font-black text-slate-900 uppercase mt-0.5">
                            {order.payment.status === "paid" ? "LUNAS" : order.payment.status === "pending" ? "PENDING" : "GAGAL"}
                          </p>
                        </div>
                        <div>
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Shipping</p>
                          <p className="text-[11px] font-black text-slate-900 uppercase mt-0.5">
                            {order.shipping.method}
                          </p>
                        </div>
                        <div>
                          <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Created</p>
                          <p className="text-[11px] font-black text-slate-900 uppercase mt-0.5">
                            {new Date(order.createdAt).toLocaleDateString("id-ID")}
                          </p>
                        </div>
                      </div>

                      <div className="mt-4 flex gap-2">
                        <Button size="sm" className="rounded-none bg-slate-900 text-white font-black text-[10px] uppercase tracking-widest hover:bg-slate-800">
                          PROSES ORDER
                        </Button>
                        <Button size="sm" variant="outline" className="rounded-none border-slate-200 font-black text-[10px] uppercase tracking-widest">
                          DETAIL
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <Card className="rounded-none border-none bg-slate-900 text-white shadow-xl">
        <CardContent className="flex flex-col gap-4 p-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-3">
            <div className="rounded-none bg-slate-800 p-3">
              <Smartphone className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-black uppercase tracking-widest text-white">Aggregator Marketplace Nasional</p>
              <p className="text-xs font-bold text-slate-400 uppercase mt-1">
                Data divalidasi dan disinkronkan secara otomatis dari API platform marketplace utama.
              </p>
            </div>
          </div>
          <Badge variant="outline" className="rounded-none border-slate-700 bg-slate-800 text-slate-400 font-black text-[10px] uppercase tracking-widest px-3 py-1">
            7 CHANNEL AKTIF
          </Badge>
        </CardContent>
      </Card>
    </div>
  )
}