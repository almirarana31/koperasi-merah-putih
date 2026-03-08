'use client'

import { useState } from 'react'
import {
  Search,
  Filter,
  ShoppingCart,
  Star,
  Package,
  Leaf,
  ChevronRight,
} from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { commodities, formatCurrency } from '@/lib/data'

const katalogProducts = commodities.map(c => ({
  ...c,
  rating: (4 + Math.random()).toFixed(1),
  reviews: Math.floor(Math.random() * 50) + 10,
  minOrder: c.kategori === 'pangan' ? 100 : 50,
  available: c.stokTotal > 0,
  image: `/placeholder.svg?text=${encodeURIComponent(c.nama)}`,
}))

export default function KatalogPage() {
  const [search, setSearch] = useState('')
  const [filterKategori, setFilterKategori] = useState('semua')

  const filtered = katalogProducts.filter(p => {
    const matchSearch = p.nama.toLowerCase().includes(search.toLowerCase())
    const matchKategori = filterKategori === 'semua' || p.kategori === filterKategori
    return matchSearch && matchKategori
  })

  const categories = [...new Set(commodities.map(c => c.kategori))]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Katalog B2B</h1>
        <p className="text-muted-foreground">Katalog produk untuk buyer B2B</p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-2">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Cari produk..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={filterKategori} onValueChange={setFilterKategori}>
            <SelectTrigger className="w-[180px]">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Kategori" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="semua">Semua Kategori</SelectItem>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat} className="capitalize">{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <p className="text-sm text-muted-foreground">{filtered.length} produk</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((product) => (
          <Card key={product.id} className="overflow-hidden group">
            <div className="aspect-square bg-muted/50 relative flex items-center justify-center">
              <Leaf className="h-16 w-16 text-primary/30" />
              <Badge 
                className="absolute top-2 left-2 capitalize"
                variant="secondary"
              >
                {product.kategori}
              </Badge>
              {!product.available && (
                <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                  <Badge variant="destructive">Stok Habis</Badge>
                </div>
              )}
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-base line-clamp-1">{product.nama}</CardTitle>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  <span className="text-sm font-medium">{product.rating}</span>
                </div>
                <span className="text-sm text-muted-foreground">({product.reviews} reviews)</span>
              </div>
            </CardHeader>
            <CardContent className="pb-2">
              <div className="space-y-1">
                <p className="text-2xl font-bold text-primary">
                  {formatCurrency(product.hargaAcuan)}
                  <span className="text-sm font-normal text-muted-foreground">/{product.satuan}</span>
                </p>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Min. order: {product.minOrder} {product.satuan}</span>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <Package className="h-4 w-4 text-muted-foreground" />
                  <span className={product.stokTotal > 500 ? 'text-emerald-500' : 'text-amber-500'}>
                    Stok: {product.stokTotal.toLocaleString()} {product.satuan}
                  </span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              <Button className="w-full" disabled={!product.available}>
                <ShoppingCart className="mr-2 h-4 w-4" />
                Pesan
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
