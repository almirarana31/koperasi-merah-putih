'use client'

import { useState } from 'react'
import Image from 'next/image'
import {
  Search,
  Filter,
  ShoppingCart,
  Heart,
  Star,
  MapPin,
  TrendingUp,
  Leaf,
  Award,
  ChevronDown,
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { useAuth } from '@/lib/auth/use-auth'
import {
  KEMENTERIAN_DASHBOARD_DATA,
  type ScopeFilters,
} from '@/lib/kementerian-dashboard-data'
import { KementerianFilterBar } from '@/components/dashboard/kementerian-filter-bar'
import { ExportButton } from '@/components/dashboard/export-button'

const products = [
  {
    id: 1,
    name: 'Tomat Segar Premium',
    category: 'Sayuran',
    price: 15000,
    unit: 'kg',
    image: '/images/tomat.jpg',
    rating: 4.8,
    reviews: 124,
    seller: 'Kelompok Tani Subur',
    location: 'Subang, Jawa Barat',
    stock: 500,
    organic: true,
    featured: true,
  },
  {
    id: 2,
    name: 'Kentang Granola',
    category: 'Sayuran',
    price: 12000,
    unit: 'kg',
    image: '/images/kentang.jpg',
    rating: 4.6,
    reviews: 89,
    seller: 'Koperasi Maju Bersama',
    location: 'Bandung, Jawa Barat',
    stock: 750,
    organic: false,
    featured: true,
  },
  {
    id: 3,
    name: 'Beras Premium Ciherang',
    category: 'Padi',
    price: 13500,
    unit: 'kg',
    rating: 4.9,
    reviews: 256,
    seller: 'Kelompok Tani Sejahtera',
    location: 'Karawang, Jawa Barat',
    stock: 2000,
    organic: true,
    featured: false,
  },
  {
    id: 4,
    name: 'Cabai Merah Keriting',
    category: 'Sayuran',
    price: 45000,
    unit: 'kg',
    rating: 4.7,
    reviews: 178,
    seller: 'Koperasi Tani Makmur',
    location: 'Garut, Jawa Barat',
    stock: 150,
    organic: false,
    featured: true,
  },
  {
    id: 5,
    name: 'Jagung Manis',
    category: 'Jagung',
    price: 8000,
    unit: 'kg',
    rating: 4.5,
    reviews: 92,
    seller: 'Kelompok Tani Harapan',
    location: 'Purwakarta, Jawa Barat',
    stock: 800,
    organic: true,
    featured: false,
  },
  {
    id: 6,
    name: 'Kedelai Organik',
    category: 'Kedelai',
    price: 18000,
    unit: 'kg',
    rating: 4.8,
    reviews: 145,
    seller: 'Koperasi Organik Nusantara',
    location: 'Tasikmalaya, Jawa Barat',
    stock: 600,
    organic: true,
    featured: false,
  },
]

export default function MarketplacePage() {
  const { user } = useAuth()
  const isKementerian = user?.role === 'kementerian'
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [sortBy, setSortBy] = useState('featured')
  const [filters, setFilters] = useState<ScopeFilters>({
    provinceId: 'all',
    regionId: 'all',
    villageId: 'all',
    cooperativeId: 'all',
    commodityId: 'all',
  })

  const filteredProducts = products
    .filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase())
      const matchesCategory = category === 'all' || product.category === category

      if (isKementerian) {
        // Filter by location
        const loc = product.location.toUpperCase()
        const matchesProvince = filters.provinceId === 'all' || loc.includes(filters.provinceId)
        const matchesRegion = filters.regionId === 'all' || loc.includes(filters.regionId.split('-')[0])
        
        return matchesSearch && matchesCategory && matchesProvince && matchesRegion
      }

      return matchesSearch && matchesCategory
    })
    .sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price
      if (sortBy === 'price-high') return b.price - a.price
      if (sortBy === 'rating') return b.rating - a.rating
      if (sortBy === 'featured') return (b.featured ? 1 : 0) - (a.featured ? 1 : 0)
      return 0
    })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Marketplace</h1>
            <p className="text-muted-foreground">
              Belanja langsung dari petani lokal - Segar, Berkualitas, Terpercaya
            </p>
          </div>
          {isKementerian && (
            <ExportButton
              title="Laporan Marketplace Nasional"
              filename="KOPDES_Marketplace_Summary"
              data={filteredProducts.map(p => ({
                'Produk': p.name,
                'Kategori': p.category,
                'Harga': p.price,
                'Unit': p.unit,
                'Penjual': p.seller,
                'Lokasi': p.location,
                'Stok': p.stock,
                'Rating': p.rating
              }))}
            />
          )}
        </div>

        {/* Featured Banner */}
        <Card className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white border-none">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  <h3 className="text-lg font-bold">Promo Hari Ini!</h3>
                </div>
                <p className="text-sm text-emerald-50">
                  Diskon hingga 20% untuk produk organik pilihan
                </p>
              </div>
              <Button variant="secondary" size="sm">
                Lihat Promo
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {isKementerian && (
        <div className="mb-4">
          <KementerianFilterBar
            filters={filters}
            setFilters={setFilters}
            search={search}
            setSearch={setSearch}
          />
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            {!isKementerian && (
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Cari produk..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
            )}
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-[180px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kategori</SelectItem>
                <SelectItem value="Sayuran">Sayuran</SelectItem>
                <SelectItem value="Padi">Padi & Beras</SelectItem>
                <SelectItem value="Jagung">Jagung</SelectItem>
                <SelectItem value="Kedelai">Kedelai</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <ChevronDown className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Urutkan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Unggulan</SelectItem>
                <SelectItem value="price-low">Harga Terendah</SelectItem>
                <SelectItem value="price-high">Harga Tertinggi</SelectItem>
                <SelectItem value="rating">Rating Tertinggi</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="group hover:shadow-lg transition-shadow overflow-hidden">
            <div className="relative aspect-square overflow-hidden bg-slate-100 dark:bg-slate-800">
              <Image
                src={product.image || '/placeholder.png'}
                alt={product.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              {product.featured && (
                <Badge className="absolute top-3 left-3 bg-orange-500 text-white">
                  <Award className="h-3 w-3 mr-1" />
                  Unggulan
                </Badge>
              )}
              {product.organic && (
                <Badge className="absolute top-3 right-3 bg-emerald-500 text-white">
                  <Leaf className="h-3 w-3 mr-1" />
                  Organik
                </Badge>
              )}
              <Button
                size="icon"
                variant="secondary"
                className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Heart className="h-4 w-4" />
              </Button>
            </div>
            <CardContent className="p-4 space-y-3">
              <div>
                <h3 className="font-semibold text-lg line-clamp-1">{product.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{product.rating}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">({product.reviews} ulasan)</span>
                </div>
              </div>

              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" />
                <span className="line-clamp-1">{product.seller} • {product.location}</span>
              </div>

              <div className="flex items-end justify-between pt-2 border-t">
                <div>
                  <p className="text-2xl font-bold text-emerald-600">
                    Rp {product.price.toLocaleString('id-ID')}
                  </p>
                  <p className="text-xs text-muted-foreground">per {product.unit}</p>
                </div>
                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                  <ShoppingCart className="h-4 w-4 mr-1" />
                  Beli
                </Button>
              </div>

              <div className="text-xs text-muted-foreground">
                Stok: <span className="font-medium text-foreground">{product.stock} {product.unit}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground">Tidak ada produk yang ditemukan</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
