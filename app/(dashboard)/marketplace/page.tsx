"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
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
  Filter,
} from "lucide-react"
import { marketOrders, products, getStats } from "@/lib/mock-data"

// Filter orders by channel - PowerPoint Slide 8: 7 Market Channels
const tokopediaOrders = marketOrders.filter(o => o.channel === "tokopedia")
const shopeeOrders = marketOrders.filter(o => o.channel === "shopee")
const blibliOrders = marketOrders.filter(o => o.channel === "blibli")
const tiktokOrders = marketOrders.filter(o => o.channel === "tiktok")
const whatsappOrders = marketOrders.filter(o => o.channel === "whatsapp")
const websiteOrders = marketOrders.filter(o => o.channel === "website")
const offlineOrders = marketOrders.filter(o => o.channel === "offline")

// Calculate statistics
const stats = getStats()
const totalOrders = marketOrders.length
const totalRevenue = marketOrders.reduce((sum, o) => sum + o.total, 0)
const pendingOrders = marketOrders.filter(o => o.status === "new" || o.status === "confirmed").length
const deliveredOrders = marketOrders.filter(o => o.status === "delivered").length

// Channel configuration
const channelConfig = {
  tokopedia: {
    icon: Store,
    color: "success",
    name: "Tokopedia",
    count: tokopediaOrders.length,
    revenue: tokopediaOrders.reduce((sum, o) => sum + o.total, 0)
  },
  shopee: {
    icon: ShoppingCart,
    color: "destructive",
    name: "Shopee",
    count: shopeeOrders.length,
    revenue: shopeeOrders.reduce((sum, o) => sum + o.total, 0)
  },
  blibli: {
    icon: Package,
    color: "info",
    name: "Blibli",
    count: blibliOrders.length,
    revenue: blibliOrders.reduce((sum, o) => sum + o.total, 0)
  },
  tiktok: {
    icon: Smartphone,
    color: "chart-2",
    name: "TikTok Shop",
    count: tiktokOrders.length,
    revenue: tiktokOrders.reduce((sum, o) => sum + o.total, 0)
  },
  whatsapp: {
    icon: MessageCircle,
    color: "success",
    name: "WhatsApp",
    count: whatsappOrders.length,
    revenue: whatsappOrders.reduce((sum, o) => sum + o.total, 0)
  },
  website: {
    icon: Globe,
    color: "primary",
    name: "Website",
    count: websiteOrders.length,
    revenue: websiteOrders.reduce((sum, o) => sum + o.total, 0)
  },
  offline: {
    icon: Store,
    color: "warning",
    name: "Offline/Toko",
    count: offlineOrders.length,
    revenue: offlineOrders.reduce((sum, o) => sum + o.total, 0)
  }
}

export default function MarketplacePage() {
  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Pilar 4: Marketplace & Order Management</h1>
        <p className="mt-1 text-muted-foreground">
          Kelola penjualan di 7 channel marketplace dan order management terpadu
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="border-border bg-card">
          <CardContent className="py-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-primary/20 p-3">
                <ShoppingCart className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Order</p>
                <p className="text-2xl font-bold text-card-foreground">{totalOrders}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardContent className="py-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-success/20 p-3">
                <DollarSign className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold text-success">
                  Rp {(totalRevenue / 1000000).toFixed(1)}M
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardContent className="py-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-warning/20 p-3">
                <Clock className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Pending</p>
                <p className="text-2xl font-bold text-warning">{pendingOrders}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardContent className="py-6">
            <div className="flex items-center gap-3">
              <div className="rounded-lg bg-info/20 p-3">
                <CheckCircle2 className="h-6 w-6 text-info" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Delivered</p>
                <p className="text-2xl font-bold text-info">{deliveredOrders}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 7 Market Channels - PowerPoint Slide 8 */}
      <Card className="border-border bg-card">
        <CardHeader>
          <CardTitle className="text-card-foreground">7 Channel Marketplace</CardTitle>
          <CardDescription>Performance penjualan di berbagai platform</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {Object.entries(channelConfig).map(([key, config]) => {
              const Icon = config.icon
              return (
                <Card key={key} className={`border-${config.color}/30 bg-secondary/50`}>
                  <CardContent className="py-4">
                    <div className="flex items-center gap-3">
                      <div className={`rounded-lg bg-${config.color}/20 p-2`}>
                        <Icon className={`h-5 w-5 text-${config.color}`} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-card-foreground">{config.name}</h4>
                        <p className="text-xs text-muted-foreground">{config.count} orders</p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <p className="text-xs text-muted-foreground">Revenue</p>
                      <p className="text-lg font-bold text-card-foreground">
                        Rp {(config.revenue / 1000000).toFixed(1)}M
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* Orders by Channel */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="bg-secondary">
          <TabsTrigger value="all">Semua ({totalOrders})</TabsTrigger>
          <TabsTrigger value="tokopedia">Tokopedia ({tokopediaOrders.length})</TabsTrigger>
          <TabsTrigger value="shopee">Shopee ({shopeeOrders.length})</TabsTrigger>
          <TabsTrigger value="tiktok">TikTok ({tiktokOrders.length})</TabsTrigger>
          <TabsTrigger value="whatsapp">WhatsApp ({whatsappOrders.length})</TabsTrigger>
          <TabsTrigger value="website">Website ({websiteOrders.length})</TabsTrigger>
          <TabsTrigger value="offline">Offline ({offlineOrders.length})</TabsTrigger>
        </TabsList>

        {/* All Orders Tab */}
        <TabsContent value="all" className="space-y-4">
          {marketOrders.slice(0, 10).map((order) => (
            <Card key={order.id} className="border-border bg-card">
              <CardContent className="py-4">
                <div className="flex items-start gap-4">
                  <div className="rounded-lg bg-primary/20 p-3">
                    <ShoppingCart className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-card-foreground">{order.orderNumber}</h3>
                          <Badge variant="outline" className="border-primary text-primary ">
                            {order.channel}
                          </Badge>
                          <Badge
                            variant="outline"
                            className={
                              order.status === "delivered"
                                ? "border-success text-success"
                                : order.status === "shipped"
                                  ? "border-info text-info"
                                  : order.status === "confirmed"
                                    ? "border-warning text-warning"
                                    : "border-muted text-muted-foreground"
                            }
                          >
                            {order.status === "delivered" ? "Terkirim" : 
                             order.status === "shipped" ? "Dikirim" :
                             order.status === "confirmed" ? "Dikonfirmasi" : "Baru"}
                          </Badge>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {order.buyer.name} • {order.buyer.type}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Total</p>
                        <p className="text-xl font-bold text-card-foreground">
                          Rp {order.total.toLocaleString("id-ID")}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 rounded-lg bg-secondary/50 p-3">
                      <p className="text-xs font-medium text-muted-foreground">Items:</p>
                      <div className="mt-2 space-y-1">
                        {order.items.map((item, index) => (
                          <div key={index} className="flex items-center justify-between text-sm">
                            <span className="text-card-foreground">
                              {item.productName} × {item.quantity} kg
                            </span>
                            <span className="font-medium text-card-foreground">
                              Rp {item.subtotal.toLocaleString("id-ID")}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-3 gap-4">
                      <div className="rounded-lg bg-background/50 p-3">
                        <p className="text-xs text-muted-foreground">Payment</p>
                        <Badge
                          variant="outline"
                          className={
                            order.payment.status === "paid"
                              ? "border-success text-success"
                              : order.payment.status === "pending"
                                ? "border-warning text-warning"
                                : "border-destructive text-destructive"
                          }
                        >
                          {order.payment.status === "paid" ? "Lunas" : order.payment.status === "pending" ? "Pending" : "Gagal"}
                        </Badge>
                      </div>
                      <div className="rounded-lg bg-background/50 p-3">
                        <p className="text-xs text-muted-foreground">Shipping</p>
                        <p className="mt-1 text-sm font-semibold text-card-foreground">
                          {order.shipping.method}
                        </p>
                      </div>
                      <div className="rounded-lg bg-background/50 p-3">
                        <p className="text-xs text-muted-foreground">Created</p>
                        <p className="mt-1 text-sm font-semibold text-card-foreground">
                          {new Date(order.createdAt).toLocaleDateString("id-ID")}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex gap-2">
                      <Button size="sm" variant="default">
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        Proses Order
                      </Button>
                      <Button size="sm" variant="outline">
                        <Truck className="mr-2 h-4 w-4" />
                        Atur Pengiriman
                      </Button>
                      <Button size="sm" variant="outline">
                        Detail
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Tokopedia Tab */}
        <TabsContent value="tokopedia" className="space-y-4">
          {tokopediaOrders.slice(0, 6).map((order) => (
            <Card key={order.id} className="border-success/30 bg-card">
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-card-foreground">{order.orderNumber}</h3>
                    <p className="text-sm text-muted-foreground">{order.buyer.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-success">Rp {order.total.toLocaleString("id-ID")}</p>
                    <Badge variant="outline" className="border-success text-success">
                      {order.status}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Shopee Tab */}
        <TabsContent value="shopee" className="space-y-4">
          {shopeeOrders.slice(0, 6).map((order) => (
            <Card key={order.id} className="border-destructive/30 bg-card">
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-card-foreground">{order.orderNumber}</h3>
                    <p className="text-sm text-muted-foreground">{order.buyer.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-destructive">Rp {order.total.toLocaleString("id-ID")}</p>
                    <Badge variant="outline" className="border-destructive text-destructive">
                      {order.status}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* TikTok Tab */}
        <TabsContent value="tiktok" className="space-y-4">
          {tiktokOrders.slice(0, 6).map((order) => (
            <Card key={order.id} className="border-chart-2/30 bg-card">
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-card-foreground">{order.orderNumber}</h3>
                    <p className="text-sm text-muted-foreground">{order.buyer.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-chart-2">Rp {order.total.toLocaleString("id-ID")}</p>
                    <Badge variant="outline" className="border-chart-2 text-chart-2">
                      {order.status}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* WhatsApp Tab */}
        <TabsContent value="whatsapp" className="space-y-4">
          {whatsappOrders.slice(0, 6).map((order) => (
            <Card key={order.id} className="border-success/30 bg-card">
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-card-foreground">{order.orderNumber}</h3>
                    <p className="text-sm text-muted-foreground">{order.buyer.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-success">Rp {order.total.toLocaleString("id-ID")}</p>
                    <Badge variant="outline" className="border-success text-success">
                      {order.status}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Website Tab */}
        <TabsContent value="website" className="space-y-4">
          {websiteOrders.slice(0, 6).map((order) => (
            <Card key={order.id} className="border-primary/30 bg-card">
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-card-foreground">{order.orderNumber}</h3>
                    <p className="text-sm text-muted-foreground">{order.buyer.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-primary">Rp {order.total.toLocaleString("id-ID")}</p>
                    <Badge variant="outline" className="border-primary text-primary">
                      {order.status}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Offline Tab */}
        <TabsContent value="offline" className="space-y-4">
          {offlineOrders.slice(0, 6).map((order) => (
            <Card key={order.id} className="border-warning/30 bg-card">
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-card-foreground">{order.orderNumber}</h3>
                    <p className="text-sm text-muted-foreground">{order.buyer.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-warning">Rp {order.total.toLocaleString("id-ID")}</p>
                    <Badge variant="outline" className="border-warning text-warning">
                      {order.status}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </div>
  )
}
