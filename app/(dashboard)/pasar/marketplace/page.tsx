'use client'

import { useState, useMemo } from 'react'
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
  Globe,
  Download,
  FileText,
  Activity,
  ShieldAlert,
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

  const filteredProducts = useMemo(() => {
    return products
      .filter((product) => {
        const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase())
        const matchesCategory = category === 'all' || product.category === category

        // Hierarchical Filter Simulation
        const loc = product.location.toUpperCase()
        const matchesProvince = filters.provinceId === 'all' || loc.includes(filters.provinceId)
        const matchesRegion = filters.regionId === 'all' || loc.includes(filters.regionId.split('-')[0].toUpperCase())
        const matchesCommodity = filters.commodityId === 'all' || product.category.toUpperCase().includes(filters.commodityId.toUpperCase())

        return matchesSearch && matchesCategory && matchesProvince && matchesRegion && matchesCommodity
      })
      .sort((a, b) => {
        if (sortBy === 'price-low') return a.price - b.price
        if (sortBy === 'price-high') return b.price - a.price
        if (sortBy === 'rating') return b.rating - a.rating
        if (sortBy === 'featured') return (b.featured ? 1 : 0) - (a.featured ? 1 : 0)
        return 0
      })
  }, [search, category, sortBy, filters])

  const stats = useMemo(() => {
    const totalItems = filteredProducts.length
    const totalStock = filteredProducts.reduce((sum, p) => sum + p.stock, 0)
    const avgPrice = totalItems > 0 ? filteredProducts.reduce((sum, p) => sum + p.price, 0) / totalItems : 0
    return { totalItems, totalStock, avgPrice }
  }, [filteredProducts])

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-slate-900 flex items-center justify-center shadow-xl">
            <Store className="h-6 w-6 text-emerald-500" />
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-slate-900 uppercase">National Digital Marketplace</h1>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">
              Monitoring Transaksi & Distribusi Pangan Nasional • {stats.totalItems} Produk Terdaftar
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
           <Button variant="outline" size="sm" className="h-10 text-[10px] font-black uppercase tracking-widest text-slate-600 border-slate-200">
            <FileText className="h-4 w-4 mr-2 text-rose-600" />
            Audit Report
          </Button>
          <Button size="sm" className="h-10 bg-slate-900 hover:bg-slate-800 text-white text-[10px] font-black uppercase tracking-widest px-6 shadow-lg shadow-slate-200">
            <Download className="h-4 w-4 mr-2" />
            Export Catalog
          </Button>
        </div>
      </div>

      {/* Kementerian Hierarchical Filter Bar */}
      <KementerianFilterBar filters={filters} setFilters={setFilters} />

      {/* High-Density KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Produk Aktif', value: stats.totalItems.toLocaleString(), sub: 'SKU', icon: Store, color: 'text-slate-900' },
          { label: 'Volume Tersedia', value: (stats.totalStock / 1000).toFixed(1), sub: 'Metric Ton', icon: TrendingUp, color: 'text-emerald-600' },
          { label: 'Index Harga Rerata', value: Math.round(stats.avgPrice).toLocaleString(), sub: 'IDR/Kg', icon: Activity, color: 'text-blue-600' },
          { label: 'Market Coverage', value: '88%', sub: 'Nasional', icon: Globe, color: 'text-amber-600' },
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

      {/* Local Filters Card */}
      <Card className="border-none shadow-sm bg-slate-50/50">
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
             <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  placeholder="CARI NAMA PRODUK ATAU PENJUAL..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 bg-white border-slate-200 h-11 text-[11px] font-bold uppercase tracking-wider"
                />
             </div>
             <div className="flex flex-wrap items-center gap-3">
               <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger className="w-[180px] h-11 border-slate-200 bg-white font-black text-[10px] uppercase">
                    <SelectValue placeholder="KATEGORI" />
                  </SelectTrigger>
                  <SelectContent className="font-bold text-[10px] uppercase">
                    <SelectItem value="all">SEMUA KATEGORI</SelectItem>
                    <SelectItem value="Sayuran">SAYURAN</SelectItem>
                    <SelectItem value="Padi">PADI & BERAS</SelectItem>
                    <SelectItem value="Jagung">JAGUNG</SelectItem>
                    <SelectItem value="Kedelai">KEDELAI</SelectItem>
                  </SelectContent>
               </Select>
               <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-[180px] h-11 border-slate-200 bg-white font-black text-[10px] uppercase">
                    <SelectValue placeholder="URUTKAN" />
                  </SelectTrigger>
                  <SelectContent className="font-bold text-[10px] uppercase">
                    <SelectItem value="featured">UNGGULAN</SelectItem>
                    <SelectItem value="price-low">HARGA TERENDAH</SelectItem>
                    <SelectItem value="price-high">HARGA TERTINGGI</SelectItem>
                    <SelectItem value="rating">RATING TERTINGGI</SelectItem>
                  </SelectContent>
               </Select>
             </div>
          </div>
        </CardContent>
      </Card>

      {/* Product Grid - High Density Executive Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <Card key={product.id} className="group border-none shadow-sm hover:shadow-xl transition-all duration-300 bg-white overflow-hidden border-t-4 border-t-slate-900">
            <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
               {/* Note: Placeholder for actual image integration */}
               <div className="absolute inset-0 flex items-center justify-center bg-slate-50 group-hover:bg-slate-100 transition-colors">
                  <Store className="h-12 w-12 text-slate-200 group-hover:scale-110 transition-transform duration-500" />
               </div>
               <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                  {product.featured && (
                    <Badge className="bg-orange-500 text-white border-none font-black text-[8px] uppercase tracking-widest h-5">
                      <Award className="h-3 w-3 mr-1" /> UNGGULAN
                    </Badge>
                  )}
                  {product.organic && (
                    <Badge className="bg-emerald-500 text-white border-none font-black text-[8px] uppercase tracking-widest h-5">
                      <Leaf className="h-3 w-3 mr-1" /> ORGANIK
                    </Badge>
                  )}
               </div>
               <Button
                size="icon"
                variant="secondary"
                className="absolute bottom-3 right-3 h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-all bg-white shadow-lg"
              >
                <Heart className="h-4 w-4 text-rose-500" />
              </Button>
            </div>
            <CardContent className="p-5 space-y-4">
              <div>
                <h3 className="text-xs font-black text-slate-900 uppercase truncate tracking-tight">{product.name}</h3>
                <div className="flex items-center gap-2 mt-1.5">
                  <div className="flex items-center gap-0.5">
                    {[1,2,3,4,5].map(i => (
                      <Star key={i} className={`h-2.5 w-2.5 ${i <= Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-slate-200'}`} />
                    ))}
                  </div>
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">({product.reviews} AUDIT)</span>
                </div>
              </div>

              <div className="space-y-2 pt-3 border-t border-slate-50">
                <div className="flex items-center gap-2">
                   <div className="h-6 w-6 rounded bg-slate-50 flex items-center justify-center shrink-0">
                      <MapPin className="h-3 w-3 text-slate-400" />
                   </div>
                   <p className="text-[9px] font-bold text-slate-500 uppercase truncate leading-tight tracking-tight">
                     {product.seller} • {product.location}
                   </p>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900 text-white shadow-inner">
                   <div>
                      <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Harga Per {product.unit}</p>
                      <p className="text-xl font-black tracking-tighter text-emerald-400 mt-0.5">
                        IDR {product.price.toLocaleString('id-ID')}
                      </p>
                   </div>
                   <Button size="icon" className="h-8 w-8 bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-lg">
                      <ShoppingCart className="h-4 w-4" />
                   </Button>
                </div>
              </div>

              <div className="flex items-center justify-between text-[9px] font-black uppercase tracking-widest pt-1">
                 <span className="text-slate-400">Inventory Status:</span>
                 <span className={product.stock > 100 ? 'text-emerald-600' : 'text-rose-600'}>
                    {product.stock.toLocaleString()} {product.unit} AVAIL
                 </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <Card className="border-dashed py-24 bg-slate-50/50">
          <CardContent className="flex flex-col items-center justify-center text-center">
            <div className="h-20 w-20 rounded-full bg-slate-100 flex items-center justify-center mb-6">
              <Store className="h-10 w-10 text-slate-300" />
            </div>
            <h3 className="text-xl font-black text-slate-900 uppercase">Katalog Kosong</h3>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-2 max-w-sm">
              Tidak ada produk yang sesuai dengan kriteria filter hierarki atau kata kunci Anda saat ini.
            </p>
            <Button 
              variant="link" 
              onClick={() => {
                setSearch('')
                setCategory('all')
                setFilters({ provinceId: 'all', regionId: 'all', villageId: 'all', cooperativeId: 'all', commodityId: 'all' })
              }}
              className="mt-6 text-[10px] font-black uppercase text-emerald-600"
            >
              Reset Filter Global
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Market Stability Banner */}
      <Card className="bg-slate-900 border-none overflow-hidden relative group cursor-pointer shadow-2xl">
        <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:scale-110 transition-transform duration-700">
           <Activity className="h-32 w-32 text-white" />
        </div>
        <CardContent className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-8 relative">
           <div className="flex items-center gap-6">
              <div className="h-14 w-14 rounded-2xl bg-white/10 flex items-center justify-center shrink-0 border border-white/10 shadow-xl">
                 <ShieldAlert className="h-7 w-7 text-emerald-400" />
              </div>
              <div>
                 <div className="flex items-center gap-3">
                    <Badge className="bg-emerald-600 text-white font-black text-[9px] px-2 h-5 border-none">SYSTEM NORMAL</Badge>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Volatility Index: Low (1.2%)</span>
                 </div>
                 <p className="text-white text-base font-black uppercase mt-2 tracking-tight">Kestabilan Harga Nasional Terdeteksi Optimal • Monitor Supply-Demand Lintas Provinsi.</p>
              </div>
           </div>
           <Button className="h-12 bg-white text-slate-900 hover:bg-slate-100 font-black text-[11px] uppercase tracking-widest px-8 rounded-xl shadow-xl transition-all">
             Buka Forecast AI →
           </Button>
        </CardContent>
      </Card>
    </div>
  )
}
