'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  ArrowLeft,
  Search,
  Plus,
  Building2,
  Mail,
  Phone,
  MapPin,
  TrendingUp,
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

const buyerTypeLabels: Record<string, string> = {
  hotel: 'Hotel',
  restoran: 'Restoran',
  retail: 'Retail',
  fmcg: 'FMCG',
  eksportir: 'Eksportir',
}

const buyerTypeColors: Record<string, string> = {
  hotel: 'bg-blue-500/10 text-blue-500',
  restoran: 'bg-amber-500/10 text-amber-500',
  retail: 'bg-emerald-500/10 text-emerald-500',
  fmcg: 'bg-violet-500/10 text-violet-500',
  eksportir: 'bg-cyan-500/10 text-cyan-500',
}

export default function BuyerPage() {
  const [search, setSearch] = useState('')

  const filteredBuyers = buyers.filter((buyer) =>
    buyer.nama.toLowerCase().includes(search.toLowerCase())
  )

  const totalBuyers = buyers.length
  const totalTransaksi = buyers.reduce((sum, b) => sum + b.totalTransaksi, 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/pasar">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Daftar Buyer</h1>
            <p className="text-muted-foreground">
              Kelola data pembeli B2B
            </p>
          </div>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Tambah Buyer
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <Building2 className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalBuyers}</p>
                <p className="text-xs text-muted-foreground">Total Buyer</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
                <TrendingUp className="h-5 w-5 text-emerald-500" />
              </div>
              <div>
                <p className="text-2xl font-bold">{formatCurrency(totalTransaksi)}</p>
                <p className="text-xs text-muted-foreground">Total Transaksi</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <Card>
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Cari buyer..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
        </CardContent>
      </Card>

      {/* Buyer Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredBuyers.map((buyer) => (
          <Card key={buyer.id} className="overflow-hidden">
            <CardHeader className="pb-3">
              <div className="flex items-start gap-4">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {buyer.nama
                      .split(' ')
                      .map((n) => n[0])
                      .slice(0, 2)
                      .join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <CardTitle className="text-base">{buyer.nama}</CardTitle>
                  <Badge className={buyerTypeColors[buyer.tipe]}>
                    {buyerTypeLabels[buyer.tipe]}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span className="truncate">{buyer.alamat}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-4 w-4" />
                  <span>{buyer.kontak}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span className="truncate">{buyer.email}</span>
                </div>
              </div>
              <div className="rounded-lg bg-muted p-3">
                <p className="text-xs text-muted-foreground">Total Transaksi</p>
                <p className="text-lg font-bold">
                  {formatCurrency(buyer.totalTransaksi)}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
