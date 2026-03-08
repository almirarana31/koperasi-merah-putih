'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Search,
  Plus,
  Filter,
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
import { shipments, orders, formatDate } from '@/lib/data'

const statusColors: Record<string, string> = {
  dijadwalkan: 'bg-gray-500/10 text-gray-500',
  pickup: 'bg-amber-500/10 text-amber-500',
  transit: 'bg-blue-500/10 text-blue-500',
  delivered: 'bg-emerald-500/10 text-emerald-500',
}

const statusLabels: Record<string, string> = {
  dijadwalkan: 'Dijadwalkan',
  pickup: 'Pickup',
  transit: 'Dalam Perjalanan',
  delivered: 'Terkirim',
}

export default function LogistikPage() {
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('all')

  const filteredShipments = shipments.filter((shipment) => {
    const matchesSearch =
      shipment.nomorResi.toLowerCase().includes(search.toLowerCase()) ||
      shipment.driver.toLowerCase().includes(search.toLowerCase())
    const matchesStatus =
      filterStatus === 'all' || shipment.status === filterStatus
    return matchesSearch && matchesStatus
  })

  const totalShipments = shipments.length
  const inTransit = shipments.filter((s) => s.status === 'transit').length
  const delivered = shipments.filter((s) => s.status === 'delivered').length
  const pendingPickup = shipments.filter(
    (s) => s.status === 'dijadwalkan' || s.status === 'pickup'
  ).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Pengiriman</h1>
          <p className="text-muted-foreground">
            Kelola pengiriman dan distribusi
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/logistik/tracking">
              <Navigation className="mr-2 h-4 w-4" />
              Live Tracking
            </Link>
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Buat Pengiriman
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Truck className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalShipments}</p>
                <p className="text-xs text-muted-foreground">Total Pengiriman</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/10">
                <Clock className="h-5 w-5 text-amber-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{pendingPickup}</p>
                <p className="text-xs text-muted-foreground">Menunggu Pickup</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                <Navigation className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{inTransit}</p>
                <p className="text-xs text-muted-foreground">Dalam Perjalanan</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
                <CheckCircle className="h-5 w-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{delivered}</p>
                <p className="text-xs text-muted-foreground">Terkirim</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Cari nomor resi atau driver..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="dijadwalkan">Dijadwalkan</SelectItem>
                <SelectItem value="pickup">Pickup</SelectItem>
                <SelectItem value="transit">Dalam Perjalanan</SelectItem>
                <SelectItem value="delivered">Terkirim</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Shipments Table */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Pengiriman</CardTitle>
          <CardDescription>
            {filteredShipments.length} pengiriman ditemukan
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No. Resi</TableHead>
                <TableHead>Order</TableHead>
                <TableHead>Driver</TableHead>
                <TableHead>Kendaraan</TableHead>
                <TableHead>Rute</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredShipments.map((shipment) => {
                const order = orders.find((o) => o.id === shipment.orderId)
                return (
                  <TableRow key={shipment.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <span className="font-mono text-sm">
                          {shipment.nomorResi}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{order?.nomorPO}</p>
                        <p className="text-xs text-muted-foreground">
                          {order?.buyerNama}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{shipment.driver}</p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Phone className="h-3 w-3" />
                          {shipment.noHpDriver}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="text-sm">{shipment.kendaraan}</p>
                        <p className="text-xs text-muted-foreground">
                          {shipment.platNomor}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">
                          {shipment.rute.join(' → ')}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <p>Berangkat: {formatDate(shipment.tanggalBerangkat)}</p>
                        {shipment.tanggalSampai && (
                          <p className="text-muted-foreground">
                            Sampai: {formatDate(shipment.tanggalSampai)}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={statusColors[shipment.status]}>
                        {statusLabels[shipment.status]}
                      </Badge>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
