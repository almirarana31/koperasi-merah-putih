'use client'

import {
  Package,
  TrendingUp,
  Users,
  Warehouse,
  ArrowRight,
  Plus,
  Target,
  BarChart3,
  Calendar,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'

const agregasiData = [
  {
    id: 'AGR001',
    komoditas: 'Beras Premium',
    target: 5000,
    terkumpul: 3500,
    satuan: 'kg',
    kontributor: 8,
    gudang: 'Gudang Utama',
    deadline: '2024-02-28',
    buyer: 'Hotel Grand Hyatt',
    hargaTarget: 14000,
    status: 'berjalan',
  },
  {
    id: 'AGR002',
    komoditas: 'Jagung Pipil',
    target: 3000,
    terkumpul: 3000,
    satuan: 'kg',
    kontributor: 5,
    gudang: 'Gudang Utama',
    deadline: '2024-02-25',
    buyer: 'PT Indofood',
    hargaTarget: 5500,
    status: 'selesai',
  },
  {
    id: 'AGR003',
    komoditas: 'Kentang',
    target: 2000,
    terkumpul: 1200,
    satuan: 'kg',
    kontributor: 3,
    gudang: 'Cold Storage',
    deadline: '2024-03-05',
    buyer: 'Superindo',
    hargaTarget: 15000,
    status: 'berjalan',
  },
  {
    id: 'AGR004',
    komoditas: 'Cabai Merah',
    target: 500,
    terkumpul: 150,
    satuan: 'kg',
    kontributor: 2,
    gudang: 'Cold Storage',
    deadline: '2024-03-10',
    buyer: 'Restoran Padang Sederhana',
    hargaTarget: 45000,
    status: 'berjalan',
  },
]

export default function AgregasiPage() {
  const totalTarget = agregasiData.reduce((acc, a) => acc + a.target, 0)
  const totalTerkumpul = agregasiData.reduce((acc, a) => acc + a.terkumpul, 0)
  const totalNilai = agregasiData.reduce((acc, a) => acc + (a.terkumpul * a.hargaTarget), 0)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold  text-slate-900 ">Agregasi Komoditas</h1>
          <p className="text-xs font-bold text-slate-500   mt-1">
            Monitoring pengumpulan hasil panen kolektif nasional
          </p>
        </div>
        <Button size="sm" className="h-8 bg-slate-900 text-white hover:bg-slate-800 text-xs font-semibold  ">
          <Plus className="mr-2 h-3.5 w-3.5" />
          Buat Agregasi Baru
        </Button>
      </div>

      {/* Summary Metrics */}
      <div className="grid gap-4 md:grid-cols-4">
        {[
          { label: 'Agregasi Aktif', value: agregasiData.filter(a => a.status === 'berjalan').length.toString(), sub: 'Batch berjalan', icon: Target, tone: 'emerald' },
          { label: 'Volume Target', value: `${(totalTarget / 1000).toFixed(1)} TON`, sub: 'Akumulasi Nasional', icon: BarChart3, tone: 'slate' },
          { label: 'Total Terkumpul', value: `${(totalTerkumpul / 1000).toFixed(1)} TON`, sub: `${((totalTerkumpul / totalTarget) * 100).toFixed(0)}% Progress`, icon: Package, tone: 'emerald' },
          { label: 'Nilai Ekonomi', value: `Rp ${(totalNilai / 1000000).toFixed(0)} JT`, sub: 'Estimasi Valuasi', icon: TrendingUp, tone: 'emerald' },
        ].map((stat, i) => (
          <Card key={i} className="border-none shadow-[0_4px_12px_-4px_rgba(0,0,0,0.05)] overflow-hidden">
            <CardHeader className="p-4 pb-2">
              <div className="flex justify-between items-start">
                <p className="text-xs font-semibold text-slate-400  ">{stat.label}</p>
                <stat.icon className={`h-4 w-4 ${stat.tone === 'rose' ? 'text-rose-500' : stat.tone === 'emerald' ? 'text-emerald-500' : 'text-slate-400'}`} />
              </div>
              <CardTitle className="text-2xl font-semibold text-slate-900  mt-1">{stat.value}</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              {stat.label === 'Total Terkumpul' ? (
                <div className="space-y-1.5">
                  <Progress value={(totalTerkumpul / totalTarget) * 100} className="h-1 bg-slate-100" />
                  <p className="text-xs font-bold text-emerald-600">{stat.sub}</p>
                </div>
              ) : (
                <p className={`text-xs font-bold ${stat.tone === 'rose' ? 'text-rose-600' : stat.tone === 'emerald' ? 'text-emerald-600' : 'text-slate-500'}`}>
                  {stat.sub}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Agregasi List */}
      <div className="space-y-4">
        <h2 className="text-xs font-semibold text-slate-400   px-1">Daftar Batch Pengumpulan</h2>
        {agregasiData.map((agregasi) => {
          const progress = (agregasi.terkumpul / agregasi.target) * 100
          
          return (
            <Card key={agregasi.id} className="border-none shadow-[0_4px_12px_-4px_rgba(0,0,0,0.05)] overflow-hidden hover:shadow-lg transition-all group">
              <CardContent className="p-0">
                <div className="flex flex-col lg:flex-row">
                  <div className="flex-1 p-5">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-6">
                      <div className="flex items-start gap-3">
                        <div className="h-10 w-10 rounded bg-slate-100 flex items-center justify-center shrink-0 border border-slate-200">
                          <Package className="h-5 w-5 text-slate-900" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm font-semibold text-slate-900   group-hover:text-emerald-600 transition-colors">{agregasi.komoditas}</h3>
                            <Badge className={`text-xs font-semibold  px-1.5 py-0 border-none ${
                              agregasi.status === 'selesai' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                            }`}>
                              {agregasi.status === 'selesai' ? 'CLOSED' : 'OPEN'}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            <p className="text-xs font-bold text-slate-400  ">BUYER:</p>
                            <p className="text-xs font-semibold text-slate-900  ">{agregasi.buyer}</p>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <div className="flex items-center gap-1.5 text-slate-400">
                          <Calendar className="h-3 w-3" />
                          <p className="text-xs font-semibold  ">Deadline Pengiriman</p>
                        </div>
                        <p className="text-xs font-semibold text-slate-900  ">{agregasi.deadline}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs font-semibold  ">
                        <span className="text-slate-400">Pencapaian Volume</span>
                        <span className="text-slate-900">
                          {agregasi.terkumpul.toLocaleString()} / {agregasi.target.toLocaleString()} {agregasi.satuan.toUpperCase()}
                        </span>
                      </div>
                      <Progress value={progress} className="h-1.5 bg-slate-100" />
                      <div className="flex justify-between items-center">
                         <p className="text-xs font-bold text-slate-500  ">{progress.toFixed(0)}% Kapasitas Terisi</p>
                         <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1.5">
                              <Users className="h-3 w-3 text-slate-400" />
                              <span className="text-xs font-semibold text-slate-600  ">{agregasi.kontributor} PRODUSEN</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Warehouse className="h-3 w-3 text-slate-400" />
                              <span className="text-xs font-semibold text-slate-600  ">{agregasi.gudang.toUpperCase()}</span>
                            </div>
                         </div>
                      </div>
                    </div>
                  </div>

                  <div className="lg:w-56 bg-slate-50 p-6 flex flex-col items-center justify-center border-t lg:border-t-0 lg:border-l border-slate-100">
                    <p className="text-xs font-semibold text-slate-400   mb-1">Nilai Batch Aktif</p>
                    <p className="text-2xl font-semibold text-slate-900 ">
                      Rp {((agregasi.terkumpul * agregasi.hargaTarget) / 1000000).toFixed(1)} JT
                    </p>
                    <p className="text-xs font-bold text-emerald-600   mt-0.5">
                      Target: Rp {agregasi.hargaTarget.toLocaleString()}/{agregasi.satuan}
                    </p>
                    <Button variant="outline" size="sm" className="mt-6 w-full h-8 text-xs font-semibold   border-slate-200 text-slate-600 hover:bg-white hover:text-slate-900">
                      Kelola Kontribusi
                      <ArrowRight className="ml-2 h-3.5 w-3.5" />
                    </Button>
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
