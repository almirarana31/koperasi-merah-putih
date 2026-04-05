'use client'

import { useState, useMemo } from 'react'
import {
  Search,
  Filter,
  Star,
  Package,
  Globe,
  TrendingUp,
  AlertTriangle,
  BarChart3,
  MapPin,
  Layers,
  ArrowRight,
} from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
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
import { KementerianFilterBar } from '@/components/dashboard/kementerian-filter-bar'
import { type ScopeFilters } from '@/lib/kementerian-dashboard-data'

// Stock images for different product categories - using Unsplash IDs
const productImages: Record<string, string> = {
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
  ' Mangga': 'https://images.unsplash.com/photo-1553279768-865429fa0078?w=400&h=400&fit=crop',
  'Pisang': 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400&h=400&fit=crop',
  'Pepaya': 'https://images.unsplash.com/photo-1517282009859-f000ec3b26fe?w=400&h=400&fit=crop',
  'Jeruk': 'https://images.unsplash.com/photo-1547514701-42f6c4f83085?w=400&h=400&fit=crop',
  'Apel': 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=400&fit=crop',
  'Semangka': 'https://images.unsplash.com/photo-1563114773-84221bd62daa?w=400&h=400&fit=crop',
  'Melon': 'https://images.unsplash.com/photo-1571575173700-afb9492e6a50?w=400&h=400&fit=crop',
  'Nanas': 'https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=400&h=400&fit=crop',
  'Durian': 'https://images.unsplash.com/photo-1596363505729-4190a9506133?w=400&h=400&fit=crop',
  'Rambutan': 'https://images.unsplash.com/photo-1609201279471-0d7e31dea89a?w=400&h=400&fit=crop',
  'Ikan Lele': 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=400&fit=crop',
  'Ikan Nila': 'https://images.unsplash.com/photo-1534604973900-c43ab4c2e0ab?w=400&h=400&fit=crop',
  'Ikan Mas': 'https://images.unsplash.com/photo-1524704654690-b56c05c78a00?w=400&h=400&fit=crop',
  'Udang': 'https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=400&h=400&fit=crop',
  'Bandeng': 'https://images.unsplash.com/photo-1510130315046-1e47cc196aa0?w=400&h=400&fit=crop',
  'Ayam Kampung': 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?w=400&h=400&fit=crop',
  'Telur Ayam': 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400&h=400&fit=crop',
  'Daging Sapi': 'https://images.unsplash.com/photo-1603048297172-c92544c54bdb?w=400&h=400&fit=crop',
  'Susu Sapi': 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=400&fit=crop',
  'pangan': 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=400&fit=crop',
  'perikanan': 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=400&fit=crop',
  'perkebunan': 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400&h=400&fit=crop',
  'peternakan': 'https://images.unsplash.com/photo-1516467508483-a7212febe31a?w=400&h=400&fit=crop',
  'sayuran': 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400&h=400&fit=crop',
  'buah': 'https://images.unsplash.com/photo-1619566636858-adf3ef46400b?w=400&h=400&fit=crop',
  'default': 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=400&fit=crop',
}

const getProductImage = (productName: string, category: string): string => {
  if (productImages[productName]) return productImages[productName]
  if (productImages[category]) return productImages[category]
  return productImages['default']
}

export default function KatalogKementerianPage() {
  const [filters, setFilters] = useState<ScopeFilters>({
    provinceId: 'all',
    regionId: 'all',
    villageId: 'all',
    cooperativeId: 'all',
    commodityId: 'all',
  })
  const [search, setSearch] = useState('')
  const [filterKategori, setFilterKategori] = useState('semua')

  const processedProducts = useMemo(() => {
    let scaleFactor = 1.0
    if (filters.cooperativeId !== 'all') scaleFactor = 0.05
    else if (filters.regionId !== 'all') scaleFactor = 0.15
    else if (filters.provinceId !== 'all') scaleFactor = 0.4

    return commodities.map(c => {
      const scaledStok = Math.floor(c.stokTotal * scaleFactor)
      return {
        ...c,
        stokTotal: scaledStok,
        rating: (4 + Math.random()).toFixed(1),
        reviews: Math.floor(Math.random() * 500 * scaleFactor) + 10,
        minOrder: c.kategori === 'pangan' ? 100 : 50,
        available: scaledStok > 0,
        image: getProductImage(c.nama, c.kategori),
        coopCount: Math.floor(25 * scaleFactor) + 1,
        trend: Math.random() > 0.5 ? 'up' : 'down',
      }
    })
  }, [filters])

  const filtered = useMemo(() => {
    return processedProducts.filter(p => {
      const matchSearch = p.nama.toLowerCase().includes(search.toLowerCase())
      const matchKategori = filterKategori === 'semua' || p.kategori === filterKategori
      const matchCommodity = filters.commodityId === 'all' || p.nama.toLowerCase().includes(filters.commodityId)
      return matchSearch && matchKategori && matchCommodity
    })
  }, [processedProducts, search, filterKategori, filters.commodityId])

  const categories = [...new Set(commodities.map(c => c.kategori))]

  const totalSKU = filtered.length
  const totalVolume = filtered.reduce((acc, p) => acc + p.stokTotal, 0)
  const lowStockAlerts = filtered.filter(p => p.stokTotal < 100 && p.stokTotal > 0).length

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black tracking-tighter text-slate-900 uppercase">
              National Product Aggregator
            </h1>
            <p className="text-[10px] font-bold tracking-widest text-slate-500 uppercase mt-2">
              MONITORING KETERSEDIAAN KOMODITAS DAN KATALOG B2B LINTAS KOPERASI NASIONAL
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="h-8 text-[9px] font-black uppercase tracking-widest border-2 border-slate-200">
              <BarChart3 className="mr-2 h-3.5 w-3.5" /> ANALYSIS
            </Button>
            <Button className="h-8 bg-slate-900 text-[9px] font-black uppercase tracking-widest">
              <Globe className="mr-2 h-3.5 w-3.5" /> GLOBAL VIEW
            </Button>
          </div>
        </div>

        <KementerianFilterBar filters={filters} setFilters={setFilters} />
      </div>

      {/* KPI Section */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Card className="border-none shadow-sm">
          <CardContent className="p-4">
            <p className="text-[9px] font-black tracking-widest text-slate-500 uppercase mb-1">TOTAL ACTIVE SKUS</p>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-black text-slate-900">{totalSKU}</CardTitle>
              <Layers className="h-4 w-4 text-slate-400" />
            </div>
            <p className="text-[8px] font-black text-emerald-600 uppercase mt-1">DIVERSIFIED CATALOG</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardContent className="p-4">
            <p className="text-[9px] font-black tracking-widest text-slate-500 uppercase mb-1">AGGREGATE VOLUME</p>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-black text-slate-900">{totalVolume.toLocaleString()}</CardTitle>
              <Package className="h-4 w-4 text-emerald-500" />
            </div>
            <p className="text-[8px] font-black text-slate-500 uppercase mt-1">UNITS AVAILABLE</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardContent className="p-4">
            <p className="text-[9px] font-black tracking-widest text-slate-500 uppercase mb-1">LOW STOCK WARNINGS</p>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-black text-rose-600">{lowStockAlerts}</CardTitle>
              <AlertTriangle className="h-4 w-4 text-rose-500" />
            </div>
            <p className="text-[8px] font-black text-rose-600 uppercase mt-1">POTENTIAL SHORTAGE</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardContent className="p-4">
            <p className="text-[9px] font-black tracking-widest text-slate-500 uppercase mb-1">SUPPLIER COOPERATIVES</p>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl font-black text-slate-900">
                {filters.cooperativeId !== 'all' ? '01' : Math.floor(150 * (totalVolume/25000) + 5)}
              </CardTitle>
              <MapPin className="h-4 w-4 text-blue-500" />
            </div>
            <p className="text-[8px] font-black text-slate-500 uppercase mt-1">INTEGRATED ENTITIES</p>
          </CardContent>
        </Card>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between">
        <div className="flex flex-col md:flex-row flex-1 items-stretch md:items-center gap-2 max-w-2xl">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
            <Input
              placeholder="SEARCH AGGREGATE CATALOG..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 pl-9 text-[10px] font-black uppercase tracking-widest border-slate-200"
            />
          </div>
          <Select value={filterKategori} onValueChange={setFilterKategori}>
            <SelectTrigger className="w-full md:w-[180px] h-9 text-[10px] font-black uppercase tracking-widest border-2">
              <Filter className="mr-2 h-3.5 w-3.5" />
              <SelectValue placeholder="CATEGORY" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="semua" className="text-[10px] font-black uppercase tracking-widest">ALL CATEGORIES</SelectItem>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat} className="text-[10px] font-black uppercase tracking-widest">{cat}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{filtered.length} SKUS AGGREGATED</p>
      </div>

      {/* Catalog Grid */}
      <div className="grid gap-3 grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
        {filtered.map((product) => (
          <Card key={product.id} className="overflow-hidden group border-none shadow-sm hover:shadow-md transition-all">
            <div className="aspect-[4/3] bg-slate-100 relative overflow-hidden">
              <img
                src={product.image}
                alt={product.nama}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute top-2 left-2 flex flex-col gap-1">
                <Badge className="capitalize text-[8px] font-black bg-slate-900/90 backdrop-blur-sm px-1.5 h-4">
                  {product.kategori}
                </Badge>
                {product.trend === 'up' && (
                  <Badge className="text-[8px] font-black bg-emerald-600 text-white px-1.5 h-4 border-0">
                    TRENDING UP
                  </Badge>
                )}
              </div>
              {!product.available && (
                <div className="absolute inset-0 bg-white/70 flex items-center justify-center backdrop-blur-[1px]">
                  <Badge variant="destructive" className="text-[8px] font-black uppercase px-2 h-5">OUT OF STOCK</Badge>
                </div>
              )}
            </div>
            <CardHeader className="p-3 pb-1">
              <CardTitle className="text-[11px] font-black text-slate-900 uppercase leading-tight truncate">
                {product.nama}
              </CardTitle>
              <div className="flex items-center justify-between mt-1">
                <div className="flex items-center gap-1">
                  <Star className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
                  <span className="text-[10px] font-black text-slate-700">{product.rating}</span>
                </div>
                <div className="flex items-center gap-1 text-[8px] font-black text-slate-400 uppercase tracking-tighter">
                  <Layers className="h-3 w-3" /> {product.coopCount} COOPS
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-3 pt-0 pb-2">
              <div className="space-y-1">
                <p className="text-base font-black text-slate-900 leading-none">
                  {formatCurrency(product.hargaAcuan)}
                  <span className="text-[8px] font-bold text-slate-400 uppercase ml-1">/{product.satuan}</span>
                </p>
                <div className="flex items-center gap-1.5 pt-1">
                  <Package className="h-3 w-3 text-slate-300" />
                  <span className={`text-[10px] font-black uppercase tracking-tighter ${product.stokTotal > 500 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {product.stokTotal.toLocaleString()} {product.satuan}
                  </span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="p-2 pt-0 border-t border-slate-50">
              <div className="flex gap-1.5 w-full pt-2">
                <Button variant="outline" className="flex-1 h-7 text-[8px] font-black uppercase border-2 border-slate-200">
                  TRACE
                </Button>
                <Button className="flex-1 h-7 text-[8px] font-black uppercase bg-slate-900">
                  ORDER
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}
