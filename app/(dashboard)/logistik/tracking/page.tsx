'use client'

import Link from 'next/link'
import { useState } from 'react'
import {
  ArrowLeft,
  Truck,
  MapPin,
  Phone,
  Clock,
  CheckCircle,
  Navigation,
  Package,
} from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useAuth } from '@/lib/auth/use-auth'
import {
  KEMENTERIAN_DASHBOARD_DATA,
  type ScopeFilters,
} from '@/lib/kementerian-dashboard-data'
import { KementerianFilterBar } from '@/components/dashboard/kementerian-filter-bar'
import { ExportButton } from '@/components/dashboard/export-button'
import { shipments, orders, formatDate } from '@/lib/data'

const statusColors: Record<string, string> = {
  dijadwalkan: 'bg-gray-500',
  pickup: 'bg-amber-500',
  transit: 'bg-blue-500',
  delivered: 'bg-emerald-500',
}

export default function TrackingPage() {
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

  const activeShipments = shipments.filter((s) => {
    const isUnderway = s.status === 'transit' || s.status === 'pickup'
    const order = orders.find((o) => o.id === s.orderId)
    const matchesSearch = s.nomorResi.toLowerCase().includes(search.toLowerCase()) || 
                         s.driver.toLowerCase().includes(search.toLowerCase()) ||
                         order?.buyerNama.toLowerCase().includes(search.toLowerCase())
    
    if (isKementerian) {
      // Heuristic check for shipment/order location
      const buyerLoc = order?.buyerNama.toUpperCase() || ''
      const matchesProvince = filters.provinceId === 'all' || buyerLoc.includes(filters.provinceId)
      
      return isUnderway && matchesSearch && matchesProvince
    }

    return isUnderway && matchesSearch
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/logistik">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Live Tracking</h1>
          <p className="text-muted-foreground">
            Pantau pengiriman secara real-time
          </p>
        </div>
        <div className="ml-auto">
          {isKementerian && (
            <ExportButton
              title="Laporan Tracking Logistik Nasional"
              filename="KOPDES_Logistik_Tracking"
              data={activeShipments.map(s => ({
                'Resi': s.nomorResi,
                'Driver': s.driver,
                'Kendaraan': s.kendaraan,
                'Plat': s.platNomor,
                'Tanggal': s.tanggalBerangkat,
                'Status': s.status
              }))}
            />
          )}
        </div>
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

      {/* Map Placeholder */}
      <Card className="overflow-hidden">
        <div className="relative h-[400px] bg-muted">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <Navigation className="mx-auto h-16 w-16 text-muted-foreground/50" />
              <p className="mt-4 text-lg font-medium text-muted-foreground">
                Peta Tracking
              </p>
              <p className="text-sm text-muted-foreground">
                Integrasi dengan layanan peta akan ditampilkan di sini
              </p>
            </div>
          </div>
          {/* Simulated markers */}
          <div className="absolute left-[30%] top-[40%] flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-white shadow-lg">
            <Truck className="h-5 w-5" />
          </div>
          <div className="absolute left-[60%] top-[30%] flex h-10 w-10 items-center justify-center rounded-full bg-amber-500 text-white shadow-lg">
            <Truck className="h-5 w-5" />
          </div>
        </div>
      </Card>

      {/* Active Shipments */}
      <div className="grid gap-4 md:grid-cols-2">
        {activeShipments.length > 0 ? (
          activeShipments.map((shipment) => {
            const order = orders.find((o) => o.id === shipment.orderId)
            return (
              <Card key={shipment.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-full ${
                          statusColors[shipment.status]
                        } text-white`}
                      >
                        <Truck className="h-6 w-6" />
                      </div>
                      <div>
                        <CardTitle className="text-base">
                          {shipment.nomorResi}
                        </CardTitle>
                        <CardDescription>{order?.buyerNama}</CardDescription>
                      </div>
                    </div>
                    <Badge
                      className={
                        shipment.status === 'transit'
                          ? 'bg-blue-500/10 text-blue-500'
                          : 'bg-amber-500/10 text-amber-500'
                      }
                    >
                      {shipment.status === 'transit'
                        ? 'Dalam Perjalanan'
                        : 'Pickup'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-3 text-sm">
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{shipment.driver}</span>
                      <span className="text-muted-foreground">
                        ({shipment.noHpDriver})
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Truck className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {shipment.kendaraan} - {shipment.platNomor}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>Berangkat: {formatDate(shipment.tanggalBerangkat)}</span>
                    </div>
                  </div>

                  {/* Route Timeline */}
                  <div className="rounded-lg bg-muted p-3">
                    <p className="mb-2 text-xs font-medium text-muted-foreground">
                      RUTE PERJALANAN
                    </p>
                    <div className="flex items-center gap-2">
                      {shipment.rute.map((loc, idx) => (
                        <div key={idx} className="flex items-center">
                          <div
                            className={`flex h-8 w-8 items-center justify-center rounded-full ${
                              idx === 0
                                ? 'bg-emerald-500/10'
                                : idx === shipment.rute.length - 1
                                ? 'bg-primary/10'
                                : 'bg-muted-foreground/10'
                            }`}
                          >
                            {idx === 0 ? (
                              <Package className="h-4 w-4 text-emerald-500" />
                            ) : idx === shipment.rute.length - 1 ? (
                              <MapPin className="h-4 w-4 text-primary" />
                            ) : (
                              <Navigation className="h-4 w-4 text-muted-foreground" />
                            )}
                          </div>
                          <span className="ml-1 text-xs">{loc}</span>
                          {idx < shipment.rute.length - 1 && (
                            <div className="mx-2 h-0.5 w-4 bg-border" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button className="w-full" variant="outline">
                    <Phone className="mr-2 h-4 w-4" />
                    Hubungi Driver
                  </Button>
                </CardContent>
              </Card>
            )
          })
        ) : (
          <Card className="md:col-span-2">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <CheckCircle className="h-12 w-12 text-emerald-500" />
              <p className="mt-4 text-lg font-medium">
                Tidak ada pengiriman aktif
              </p>
              <p className="text-sm text-muted-foreground">
                Semua pengiriman telah selesai
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
