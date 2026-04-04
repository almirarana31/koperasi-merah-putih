'use client'

import Link from 'next/link'
import {
  ArrowLeft,
  Plus,
  Warehouse,
  Thermometer,
  MapPin,
  Settings,
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
import { Progress } from '@/components/ui/progress'
import { useAuth } from '@/lib/auth/use-auth'
import {
  KEMENTERIAN_DASHBOARD_DATA,
  type ScopeFilters,
} from '@/lib/kementerian-dashboard-data'
import { KementerianFilterBar } from '@/components/dashboard/kementerian-filter-bar'
import { ExportButton } from '@/components/dashboard/export-button'
import { warehouses } from '@/lib/data'

export default function DaftarGudangPage() {
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

  const filteredWarehouses = warehouses.filter((warehouse) => {
    const matchesSearch = warehouse.nama.toLowerCase().includes(search.toLowerCase()) || 
                         warehouse.alamat.toLowerCase().includes(search.toLowerCase())
    
    if (isKementerian) {
      // Mapping warehouse address to regional filters (heuristic)
      const matchesProvince = filters.provinceId === 'all' || warehouse.alamat.toUpperCase().includes(filters.provinceId)
      const matchesRegion = filters.regionId === 'all' || warehouse.alamat.toUpperCase().includes(filters.regionId.split('-')[0])
      
      return matchesSearch && matchesProvince && matchesRegion
    }

    return matchesSearch
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/gudang">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Daftar Gudang</h1>
            <p className="text-muted-foreground">
              Kelola lokasi penyimpanan komoditas
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          {isKementerian && (
            <ExportButton
              title="Daftar Gudang Nasional"
              filename="KOPDES_Inventory_Gudang"
              data={filteredWarehouses.map(w => ({
                'Nama': w.nama,
                'Tipe': w.tipe,
                'Alamat': w.alamat,
                'Kapasitas (kg)': w.kapasitas,
                'Terpakai (kg)': w.kapasitasTerpakai,
                'Suhu': w.suhu ? `${w.suhu}°C` : '-',
                'Status': w.status
              }))}
            />
          )}
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Tambah Gudang
          </Button>
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

      {/* Warehouse Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredWarehouses.map((warehouse) => {
          const usagePercent = Math.round(
            (warehouse.kapasitasTerpakai / warehouse.kapasitas) * 100
          )
          return (
            <Card key={warehouse.id} className="relative overflow-hidden">
              <div
                className={`absolute left-0 top-0 h-1 w-full ${
                  usagePercent > 80
                    ? 'bg-red-500'
                    : usagePercent > 60
                    ? 'bg-amber-500'
                    : 'bg-emerald-500'
                }`}
              />
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-lg ${
                        warehouse.tipe === 'cold-storage'
                          ? 'bg-blue-500/10'
                          : 'bg-primary/10'
                      }`}
                    >
                      <Warehouse
                        className={`h-6 w-6 ${
                          warehouse.tipe === 'cold-storage'
                            ? 'text-blue-500'
                            : 'text-primary'
                        }`}
                      />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{warehouse.nama}</CardTitle>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {warehouse.alamat}
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Badge
                    variant={
                      warehouse.tipe === 'cold-storage' ? 'default' : 'secondary'
                    }
                  >
                    {warehouse.tipe === 'cold-storage' ? 'Cold Storage' : 'Reguler'}
                  </Badge>
                  <Badge
                    variant={warehouse.status === 'aktif' ? 'outline' : 'destructive'}
                  >
                    {warehouse.status === 'aktif' ? 'Aktif' : 'Maintenance'}
                  </Badge>
                </div>

                {warehouse.suhu && (
                  <div className="flex items-center gap-2 rounded-lg bg-blue-500/10 p-3">
                    <Thermometer className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="text-sm font-medium">Suhu Ruangan</p>
                      <p className="text-2xl font-bold text-blue-500">
                        {warehouse.suhu}°C
                      </p>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Kapasitas Terpakai</span>
                    <span className="font-medium">{usagePercent}%</span>
                  </div>
                  <Progress
                    value={usagePercent}
                    className={`h-3 ${
                      usagePercent > 80
                        ? '[&>div]:bg-red-500'
                        : usagePercent > 60
                        ? '[&>div]:bg-amber-500'
                        : ''
                    }`}
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{warehouse.kapasitasTerpakai.toLocaleString()} kg terpakai</span>
                    <span>{warehouse.kapasitas.toLocaleString()} kg total</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div className="rounded-lg bg-muted p-3 text-center">
                    <p className="text-2xl font-bold">
                      {(warehouse.kapasitas - warehouse.kapasitasTerpakai).toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">kg tersedia</p>
                  </div>
                  <div className="rounded-lg bg-muted p-3 text-center">
                    <p className="text-2xl font-bold">
                      {warehouse.kapasitasTerpakai.toLocaleString()}
                    </p>
                    <p className="text-xs text-muted-foreground">kg terisi</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
