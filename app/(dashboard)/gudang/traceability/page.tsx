'use client'

import { useState, useMemo } from 'react'
import {
  QrCode,
  Search,
  MapPin,
  Calendar,
  Truck,
  Package,
  CheckCircle2,
  Leaf,
  Warehouse,
  ShoppingCart,
  Globe,
  Zap,
  ShieldCheck,
  History,
  FileText,
  BarChart3,
  ExternalLink,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { KementerianFilterBar } from '@/components/dashboard/kementerian-filter-bar'
import { type ScopeFilters } from '@/lib/kementerian-dashboard-data'
import { toast } from 'sonner'

const baseTraceData = {
  batchCode: 'BP-2026-001',
  komoditas: 'Beras Premium IR64',
  grade: 'A',
  jumlah: 3000000,
  timeline: [
    { step: 1, title: 'Produksi Nasional', icon: Leaf, date: '2026-04-15', location: 'Sukamaju, Cianjur, JAWA BARAT', details: [{ label: 'PRODUSEN UTAMA', value: 'Bpk. Slamet Widodo' }, { label: 'LUAS PANEN', value: '250 Ha' }, { label: 'VARIETAS', value: 'IR64 Unggul' }, { label: 'TOTAL GABAH', value: '3,200 Ton' }], status: 'completed' },
    { step: 2, title: 'Proses Penggilingan', icon: Package, date: '2026-04-16', location: 'Regional Milling Hub, JAWA BARAT', details: [{ label: 'PROSES', value: 'Gabah → Beras' }, { label: 'HASIL BERSIH', value: '3,000 Ton' }, { label: 'RENDEMEN', value: '62.5%' }], status: 'completed' },
    { step: 3, title: 'Audit Kualitas QC', icon: CheckCircle2, date: '2026-04-16', location: 'Pusat Laboratorium Nasional', details: [{ label: 'SERTIFIKASI', value: 'A (Premium)' }, { label: 'KADAR AIR', value: '12.5%' }, { label: 'BUTIR PATAH', value: '8%' }, { label: 'SKOR AUDIT', value: '92/100' }], status: 'completed' },
    { step: 4, title: 'Penyimpanan Nasional', icon: Warehouse, date: '2026-04-16', location: 'Gudang Strategis A-1', details: [{ label: 'SEKSI', value: 'Rak A-12' }, { label: 'SUHU', value: '25°C' }, { label: 'KELEMBABAN', value: '65%' }], status: 'completed' },
    { step: 5, title: 'Penyelesaian Pasar', icon: ShoppingCart, date: '2026-05-01', location: 'B2B Marketplace Nasional', details: [{ label: 'PEMBELI', value: 'Bulog / Retail Center' }, { label: 'KONTRAK', value: 'PO-2026-001' }], status: 'completed' },
    { step: 6, title: 'Pengiriman Logistik', icon: Truck, date: '2026-05-04', location: 'DKI Jakarta & Sekitarnya', details: [{ label: 'ID TRANSIT', value: 'KPD-2026-0001' }, { label: 'ARMADA', value: 'Logistik Nasional' }, { label: 'TARGET HUB', value: 'Pusat Distribusi' }], status: 'completed' },
  ],
}

export default function TraceabilityKementerianPage() {
  const [filters, setFilters] = useState<ScopeFilters>({
    provinceId: 'all',
    regionId: 'all',
    villageId: 'all',
    cooperativeId: 'all',
    commodityId: 'all',
  })
  const [searchCode, setSearchCode] = useState('BP-2026-001')
  const [showResult, setShowResult] = useState(true)

  const scaleFactor = useMemo(() => {
    if (filters.cooperativeId !== 'all') return 0.05
    if (filters.villageId !== 'all') return 0.1
    if (filters.regionId !== 'all') return 0.25
    if (filters.provinceId !== 'all') return 0.5
    return 1.0
  }, [filters])

  const traceData = useMemo(() => {
    return {
      ...baseTraceData,
      jumlah: baseTraceData.jumlah * scaleFactor,
    }
  }, [scaleFactor])

  const handleAction = (action: string) => {
    toast.success(`Audit ${action} berhasil diverifikasi secara digital`)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight flex items-center gap-2">
              <QrCode className="h-7 w-7 text-slate-900" />
              Audit Traceability Nasional
            </h1>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-2">
              Audit Digital Asal-Usul dan Rantai Pasok Komoditas Strategis Nasional
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              onClick={() => handleAction('Sertifikat')}
              className="rounded-none font-black border-2 text-[10px] uppercase tracking-widest h-10 border-slate-200 px-4"
            >
              <FileText className="mr-2 h-4 w-4" /> Sertifikat Batch
            </Button>
            <Button 
              onClick={() => handleAction('Blockchain')}
              className="rounded-none bg-slate-900 font-black text-[10px] uppercase tracking-widest h-10 px-6 text-white"
            >
              <Zap className="mr-2 h-4 w-4 text-amber-400" /> Verifikasi Blockchain
            </Button>
          </div>
        </div>

        <KementerianFilterBar filters={filters} setFilters={setFilters} />
      </div>

      {/* Global Search Tool */}
      <Card className="rounded-none border-none shadow-sm overflow-hidden bg-white border-t-4 border-t-slate-900">
        <CardHeader className="bg-slate-900 text-white p-4">
          <CardTitle className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
            <Search className="h-4 w-4 text-emerald-400" /> Eksplorasi Batch Global
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="MASUKKAN ID BATCH NASIONAL (MISAL: BP-2026-001)..."
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value.toUpperCase())}
                className="rounded-none pl-10 font-black border-2 border-slate-100 h-12 text-sm uppercase tracking-widest focus-visible:ring-slate-900"
              />
            </div>
            <Button 
              className="rounded-none h-12 px-10 font-black text-[10px] uppercase tracking-widest bg-slate-900 hover:bg-slate-800 text-white" 
              onClick={() => {
                setShowResult(true)
                handleAction('Trace')
              }}
            >
              Jalankan Audit
            </Button>
            <Button 
              variant="outline" 
              onClick={() => handleAction('QR Scan')}
              className="rounded-none h-12 px-6 font-black text-[10px] uppercase tracking-widest border-2 border-slate-200 hover:bg-slate-50"
            >
              <QrCode className="mr-2 h-4 w-4" /> Scan QR
            </Button>
          </div>
        </CardContent>
      </Card>

      {showResult && (
        <div className="grid gap-6 lg:grid-cols-[1fr_350px]">
          {/* Timeline View */}
          <div className="space-y-6">
            <Card className="rounded-none border-none shadow-sm overflow-hidden bg-white border-t-4 border-t-emerald-500">
              <CardHeader className="border-b border-slate-100 bg-slate-50/30 flex flex-row items-center justify-between p-6">
                <div className="flex items-center gap-4">
                  <div className="h-14 w-14 rounded-none bg-slate-900 flex items-center justify-center shadow-lg">
                    <Package className="h-7 w-7 text-emerald-400" />
                  </div>
                  <div>
                    <Badge className="rounded-none bg-slate-900 text-white font-black mb-1 h-5 px-2 text-[10px] uppercase tracking-widest">BATCH TERVERIFIKASI</Badge>
                    <CardTitle className="text-2xl font-black text-slate-900 uppercase tracking-tight">{traceData.batchCode}</CardTitle>
                    <p className="text-[10px] font-black text-slate-400 mt-1 uppercase tracking-widest">{traceData.komoditas}</p>
                  </div>
                </div>
                <div className="flex gap-10">
                  <div className="text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">STANDAR MUTU</p>
                    <Badge className="rounded-none bg-emerald-600 text-white font-black h-6 text-[10px] uppercase tracking-widest px-3 border-0">GRADE {traceData.grade}</Badge>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">VOLUME AGREGAT</p>
                    <p className="text-2xl font-black text-slate-900 uppercase tracking-tight">{(traceData.jumlah / 1000).toLocaleString()} TON</p>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <div className="relative pl-6">
              <div className="absolute left-[31px] top-4 bottom-4 w-0.5 bg-slate-100 border-dashed" />
              <div className="space-y-6">
                {traceData.timeline.map((step, idx) => (
                  <div key={idx} className="relative flex gap-10 group">
                    <div className={`z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-none border-4 border-white ring-4 ring-slate-50/50 shadow-sm transition-transform group-hover:scale-105 ${
                      step.status === 'completed' ? 'bg-slate-900 text-emerald-400' : 'bg-slate-200 text-slate-400'
                    }`}>
                      <step.icon className="h-5 w-5" />
                    </div>

                    <Card className="rounded-none flex-1 border-none shadow-sm hover:bg-slate-50/50 transition-all group-hover:ring-1 group-hover:ring-slate-200">
                      <CardHeader className="p-5 pb-3 bg-slate-50/20">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-3 mb-1">
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">TAHAP {step.step}</span>
                              <CardTitle className="text-sm font-black text-slate-900 uppercase tracking-tight">{step.title}</CardTitle>
                            </div>
                            <div className="flex items-center gap-5 text-[10px] font-black text-slate-400 uppercase tracking-widest mt-2">
                              <span className="flex items-center gap-1.5">
                                <Calendar className="h-3 w-3" /> {step.date}
                              </span>
                              <span className="flex items-center gap-1.5">
                                <MapPin className="h-3 w-3" /> {step.location}
                              </span>
                            </div>
                          </div>
                          <Badge className="rounded-none bg-emerald-50 text-emerald-700 font-black text-[10px] uppercase tracking-widest h-5 px-2 border-emerald-100 border">
                            <CheckCircle2 className="mr-1.5 h-3 w-3" /> TERVERIFIKASI
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="p-5 pt-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                          {step.details.map((detail, detailIdx) => (
                            <div key={detailIdx}>
                              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest mb-1">{detail.label}</p>
                              <p className="text-xs font-black text-slate-700 uppercase tracking-tight truncate">{detail.value}</p>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Audit */}
          <div className="space-y-6">
            <Card className="rounded-none border-none shadow-sm bg-white overflow-hidden border-t-4 border-t-slate-900">
              <CardHeader className="border-b border-slate-100 bg-slate-900 text-white p-4">
                <CardTitle className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" /> INTEGRITAS DIGITAL
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-5">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
                    <span className="text-slate-400">VALIDASI NODE</span>
                    <span className="text-emerald-600">SECURE / AMAN</span>
                  </div>
                  <Progress value={100} className="h-1.5 bg-slate-100 rounded-none" />
                </div>
                <div className="p-4 bg-slate-50 rounded-none border border-slate-100">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">HASH BLOCKCHAIN</p>
                  <p className="text-[10px] font-mono break-all text-slate-500 leading-relaxed font-bold">0X7A250D5630B4CF539739DF2C5DACB4C659F2488D</p>
                </div>
                <Button 
                  onClick={() => handleAction('Ledger')}
                  className="w-full bg-slate-900 text-white font-black text-[10px] uppercase tracking-widest h-11 hover:bg-slate-800 transition-all rounded-none"
                >
                  EKSPLORASI BUKU BESAR
                </Button>
              </CardContent>
            </Card>

            <Card className="rounded-none border-none shadow-sm overflow-hidden bg-white border-t-4 border-t-blue-500">
              <CardHeader className="border-b border-slate-100 bg-slate-50 p-4">
                <CardTitle className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2 text-slate-900">
                  <BarChart3 className="h-4 w-4 text-slate-400" /> STATISTIK BATCH
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 divide-y divide-slate-100">
                <div className="p-5 hover:bg-slate-50/50 transition-colors">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">NODE JARINGAN DILALUI</p>
                  <div className="flex justify-between items-center">
                    <p className="text-2xl font-black text-slate-900 uppercase tracking-tight">08 TITIK</p>
                    <Globe className="h-6 w-6 text-slate-200" />
                  </div>
                </div>
                <div className="p-5 hover:bg-slate-50/50 transition-colors">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">TOTAL WAKTU TRANSIT</p>
                  <div className="flex justify-between items-center">
                    <p className="text-2xl font-black text-slate-900 uppercase tracking-tight">22.4 JAM</p>
                    <History className="h-6 w-6 text-slate-200" />
                  </div>
                </div>
                <div className="p-5 hover:bg-slate-50/50 transition-colors">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">JEJAK KARBON (EST)</p>
                  <div className="flex justify-between items-center">
                    <p className="text-2xl font-black text-slate-900 uppercase tracking-tight">1.2 TON</p>
                    <Leaf className="h-6 w-6 text-slate-200" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-none border-none bg-emerald-900 text-white p-6 shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Zap className="h-16 w-16" />
              </div>
              <h4 className="text-[10px] font-black uppercase tracking-widest mb-3 border-b border-emerald-800 pb-3">AI VERIFICATION INSIGHT</h4>
              <p className="text-xs font-black uppercase tracking-tight leading-relaxed text-emerald-100">
                ANALISIS MODEL MENGONFIRMASI BATCH <span className="text-white underline decoration-emerald-400/50 underline-offset-4">BP-2026-001</span> MEMENUHI 100% STANDAR PREMIUM IR64 NASIONAL. ASAL GEOGRAFIS TERVERIFIKASI MELALUI DATA SATELIT PANEN.
              </p>
              <Button 
                variant="link" 
                onClick={() => handleAction('Satellite')}
                className="p-0 h-auto text-[10px] font-black uppercase tracking-widest text-emerald-300 flex items-center gap-2 mt-6 hover:no-underline hover:text-white transition-all"
              >
                LIHAT BUKTI SATELIT <ExternalLink className="h-3 w-3" />
              </Button>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}

