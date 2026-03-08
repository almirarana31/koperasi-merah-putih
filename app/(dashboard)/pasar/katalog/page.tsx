'use client'

import { useState } from 'react'
import Image from 'next/image'
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

// Stock images for different product categories - using Unsplash IDs
const productImages: Record<string, string> = {
  // Vegetables
  'Beras Premium': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop',
  'Beras Merah': 'https://images.unsplash.com/photo-1551811249-b10e8d5f6ec6?w=400&h=400&fit=crop',
  'Jagung': 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=400&h=400&fit=crop',
  'Kedelai': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop',
  'Kacang Tanah': 'https://images.unsplash.com/photo-1567892320421-1c657571ea4a?w=400&h=400&fit=crop',
  'Cabai Merah': 'https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=400&h=400&fit=crop',
  'Cabai Rawit': 'https://images.unsplash.com/photo-1583119022894-919a68a3d0e3?w=400&h=400&fit=crop',
  'Bawang Merah': 'https://images.unsplash.com/photo-1518977956812-cd3dbadaaf31?w=400&h=400&fit=crop',
  'Bawang Putih': 'https://images.unsplash.com/photo-1540148426945-6cf22a6b2f11?w=400&h=400&fit=crop',
  'Tomat': 'https://images.unsplash.com/photo-1546470427-e26264be0b0d?w=400&h=400&fit=crop',
  'Kentang': 'https://images.unsplash.com/photo-1518977676601-b53f82ber40d?w=400&h=400&fit=crop',
  'Wortel': 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400&h=400&fit=crop',
  'Kubis': 'https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?w=400&h=400&fit=crop',
  'Sawi': 'https://images.unsplash.com/photo-1574316071802-0d684efa7bf5?w=400&h=400&fit=crop',
  'Bayam': 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400&h=400&fit=crop',
  'Kangkung': 'https://images.unsplash.com/photo-1574316071802-0d684efa7bf5?w=400&h=400&fit=crop',
  'Terong': 'https://images.unsplash.com/photo-1541123603104-512919d6a96c?w=400&h=400&fit=crop',
  'Timun': 'https://images.unsplash.com/photo-1449300079323-02e209d9d3a6?w=400&h=400&fit=crop',
  // Fruits
  'Mangga': 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=400&h=400&fit=crop',
  'Pisang': 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=400&fit=crop',
  'Pepaya': 'https://images.unsplash.com/photo-1517282009859-f000ec3b26fe?w=400&h=400&fit=crop',
  'Jeruk': 'https://images.unsplash.com/photo-1547514701-42f6c4f83085?w=400&h=400&fit=crop',
  'Apel': 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=400&fit=crop',
  'Semangka': 'https://images.unsplash.com/photo-1563114773-84221bd62daa?w=400&h=400&fit=crop',
  'Melon': 'https://images.unsplash.com/photo-1571575173700-afb9492e6a50?w=400&h=400&fit=crop',
  'Nanas': 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=400&h=400&fit=crop',
  'Durian': 'https://images.unsplash.com/photo-1596363505729-4190a9506133?w=400&h=400&fit=crop',
  'Rambutan': 'https://images.unsplash.com/photo-1609201279471-0d7e31dea89a?w=400&h=400&fit=crop',
  // Fish & Seafood
  'Ikan Lele': 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=400&fit=crop',
  'Ikan Nila': 'https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?w=400&h=400&fit=crop',
  'Ikan Mas': 'https://images.unsplash.com/photo-1524704654690-b56c05c78a00?w=400&h=400&fit=crop',
  'Udang': 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=400&h=400&fit=crop',
  'Bandeng': 'https://images.unsplash.com/photo-1510130315046-1e47cc196aa0?w=400&h=400&fit=crop',
  // Livestock
  'Ayam Kampung': 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=400&h=400&fit=crop',
  'Telur Ayam': 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400&h=400&fit=crop',
  'Daging Sapi': 'https://images.unsplash.com/photo-1603048297172-c92544c54bdb?w=400&h=400&fit=crop',
  'Susu Sapi': 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=400&fit=crop',
  // Default fallback images by category
  'pangan': 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=400&fit=crop',
  'perikanan': 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=400&fit=crop',
  'perkebunan': 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400&h=400&fit=crop',
  'peternakan': 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=400&h=400&fit=crop',
  'sayuran': 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=400&fit=crop',
  'buah': 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=400&h=400&fit=crop',
  'default': 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=400&fit=crop',
}

const getProductImage = (productName: string, category: string): string => {
  // Try to get specific product image first
  if (productImages[productName]) {
    return productImages[productName]
  }
  // Fall back to category image
  if (productImages[category]) {
    return productImages[category]
  }
  // Default fallback
  return productImages['default']
}

const katalogProducts = commodities.map(c => ({
  ...c,
  rating: (4 + Math.random()).toFixed(1),
  reviews: Math.floor(Math.random() * 50) + 10,
  minOrder: c.kategori === 'pangan' ? 100 : 50,
  available: c.stokTotal > 0,
  image: getProductImage(c.nama, c.kategori),
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
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">Katalog B2B</h1>
        <p className="text-sm text-muted-foreground">Katalog produk untuk buyer B2B</p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col sm:flex-row flex-1 items-stretch sm:items-center gap-2">
          <div className="relative flex-1 sm:max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Cari produk..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={filterKategori} onValueChange={setFilterKategori}>
            <SelectTrigger className="w-full sm:w-[180px]">
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
        <p className="text-sm text-muted-foreground text-center sm:text-right">{filtered.length} produk</p>
      </div>

      <div className="grid gap-4 grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((product) => (
          <Card key={product.id} className="overflow-hidden group">
            <div className="aspect-square bg-muted/50 relative">
              <img
                src={product.image}
                alt={product.nama}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
              <Badge 
                className="absolute top-2 left-2 capitalize text-xs"
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
            <CardHeader className="p-3 pb-1 sm:p-4 sm:pb-2">
              <CardTitle className="text-sm sm:text-base line-clamp-1">{product.nama}</CardTitle>
              <div className="flex items-center gap-1 sm:gap-2">
                <div className="flex items-center gap-0.5 sm:gap-1">
                  <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-amber-400 text-amber-400" />
                  <span className="text-xs sm:text-sm font-medium">{product.rating}</span>
                </div>
                <span className="text-xs text-muted-foreground">({product.reviews})</span>
              </div>
            </CardHeader>
            <CardContent className="p-3 pt-0 sm:p-4 sm:pt-0 sm:pb-2">
              <div className="space-y-1">
                <p className="text-lg sm:text-2xl font-bold text-primary">
                  {formatCurrency(product.hargaAcuan)}
                  <span className="text-xs sm:text-sm font-normal text-muted-foreground">/{product.satuan}</span>
                </p>
                <div className="hidden sm:flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Min: {product.minOrder} {product.satuan}</span>
                </div>
                <div className="flex items-center gap-1 text-xs sm:text-sm">
                  <Package className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground" />
                  <span className={product.stokTotal > 500 ? 'text-emerald-500' : 'text-amber-500'}>
                    {product.stokTotal.toLocaleString()} {product.satuan}
                  </span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="p-3 pt-0 sm:p-4 sm:pt-0">
              <Button className="w-full text-xs sm:text-sm h-8 sm:h-10" disabled={!product.available}>
                <ShoppingCart className="mr-1 sm:mr-2 h-3 w-3 sm:h-4 sm:w-4" />
                Pesan
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
