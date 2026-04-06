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

const traceData = {
  batchCode: 'BP-2024-001',
  komoditas: 'Beras Premium',
  grade: 'A',
  jumlah: '3000 kg',
  timeline: [
    { step: 1, title: 'National Production', icon: Leaf, date: '2024-01-15', location: 'Sukamaju, Cianjur, JAWA BARAT', details: [{ label: 'Producer', value: 'Pak Slamet Widodo' }, { label: 'Harvest Area', value: '2.5 Ha' }, { label: 'Variety', value: 'IR64' }, { label: 'Yield', value: '3200 kg gabah' }], status: 'completed' },
    { step: 2, title: 'Milling Process', icon: Package, date: '2024-01-16', location: 'Regional Milling Hub, JAWA BARAT', details: [{ label: 'Process', value: 'Gabah → Beras' }, { label: 'Result', value: '3000 kg beras' }, { label: 'Yield Rate', value: '62.5%' }], status: 'completed' },
    { step: 3, title: 'Quality Control Audit', icon: CheckCircle2, date: '2024-01-16', location: 'Kementerian Central Lab', details: [{ label: 'Certified Grade', value: 'A (Premium)' }, { label: 'Moisture', value: '12.5%' }, { label: 'Broken Grain', value: '8%' }, { label: 'Audit Score', value: '92/100' }], status: 'completed' },
    { step: 4, title: 'National Storage', icon: Warehouse, date: '2024-01-16', location: 'Strategic Warehouse A-1', details: [{ label: 'Section', value: 'Rak A-12' }, { label: 'Temp', value: '25°C' }, { label: 'Humidity', value: '65%' }], status: 'completed' },
    { step: 5, title: 'Market Settlement', icon: ShoppingCart, date: '2024-02-01', location: 'B2B National Marketplace', details: [{ label: 'Buyer', value: 'Hotel Grand Hyatt' }, { label: 'Settlement', value: 'PO-2024-001' }], status: 'completed' },
    { step: 6, title: 'Logistics Dispatch', icon: Truck, date: '2024-02-04', location: 'Jakarta Metropolitan Area', details: [{ label: 'Transit ID', value: 'KPD-2024-0001' }, { label: 'Fleet Driver', value: 'Pak Joko' }, { label: 'Target Hub', value: 'Jl. Sudirman No. 1' }], status: 'completed' },
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
  const [searchCode, setSearchCode] = useState('BP-2024-001')
  const [showResult, setShowResult] = useState(true)

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold  text-slate-900  flex items-center gap-2 leading-none">
              <QrCode className="h-6 w-6 text-slate-900" />
              National Traceability Audit
            </h1>
            <p className="text-xs font-bold  text-slate-500  mt-2">
              AUDIT DIGITAL ASAL-USUL DAN RANTAI PASOK KOMODITAS DARI HULU KE HILIR
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="font-semibold border-2 text-xs  h-8  border-slate-200 px-3">
              <FileText className="mr-1.5 h-3.5 w-3.5" /> BATCH CERTIFICATE
            </Button>
            <Button className="bg-slate-900 font-semibold text-xs  h-8  px-3">
              <Zap className="mr-1.5 h-3.5 w-3.5 text-amber-400" /> VERIFY BLOCKCHAIN
            </Button>
          </div>
        </div>

        <KementerianFilterBar filters={filters} setFilters={setFilters} />
      </div>

      {/* Global Search Tool */}
      <Card className="border-none shadow-sm overflow-hidden bg-white">
        <CardHeader className="bg-slate-900 text-white pb-4">
          <CardTitle className="text-xs font-semibold   flex items-center gap-2 leading-none">
            <Search className="h-4 w-4 text-emerald-400" /> GLOBAL BATCH EXPLORER
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                placeholder="ENTER NATIONAL BATCH ID (E.G., BP-2024-001)..."
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value.toUpperCase())}
                className="pl-10 font-semibold border-2 border-slate-100 h-11 text-base  focus-visible:ring-emerald-500"
              />
            </div>
            <Button className="h-11 px-8 font-semibold   bg-slate-900 hover:bg-slate-800" onClick={() => setShowResult(true)}>
              EXECUTE TRACE
            </Button>
            <Button variant="outline" className="h-11 px-6 font-semibold  border-2 border-slate-200 hover:bg-slate-50">
              <QrCode className="mr-2 h-4 w-4" /> SCAN QR
            </Button>
          </div>
        </CardContent>
      </Card>

      {showResult && (
        <div className="grid gap-6 lg:grid-cols-[1fr_350px]">
          {/* Timeline View */}
          <div className="space-y-6">
            <Card className="border-none shadow-sm overflow-hidden bg-white">
              <CardHeader className="border-b border-slate-100 bg-slate-50/30 flex flex-row items-center justify-between p-6">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-slate-900 flex items-center justify-center shadow-lg">
                    <Package className="h-6 w-6 text-emerald-400" />
                  </div>
                  <div>
                    <Badge className="bg-slate-900 text-white font-semibold mb-1   h-4 px-1.5 text-xs">VERIFIED BATCH</Badge>
                    <CardTitle className="text-xl font-semibold text-slate-900  leading-none ">{traceData.batchCode}</CardTitle>
                    <p className="text-xs font-bold text-slate-400 mt-1.5  ">{traceData.komoditas}</p>
                  </div>
                </div>
                <div className="flex gap-8">
                  <div className="text-right">
                    <p className="text-xs font-semibold text-slate-400  mb-1 ">STANDARD</p>
                    <Badge className="bg-emerald-600 text-white font-semibold h-5 text-xs  px-2 border-0">GRADE {traceData.grade}</Badge>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-semibold text-slate-400  mb-1 ">VOLUME</p>
                    <p className="text-lg font-semibold text-slate-900 leading-none">{traceData.jumlah}</p>
                  </div>
                </div>
              </CardHeader>
            </Card>

            <div className="relative pl-4">
              <div className="absolute left-[31px] top-4 bottom-4 w-0.5 bg-slate-100 border-dashed" />
              <div className="space-y-4">
                {traceData.timeline.map((step, idx) => (
                  <div key={idx} className="relative flex gap-8 group">
                    <div className={`z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-4 border-white ring-4 ring-slate-50/50 shadow-sm transition-transform group-hover:scale-105 ${
                      step.status === 'completed' ? 'bg-slate-900 text-emerald-400' : 'bg-slate-200 text-slate-400'
                    }`}>
                      <step.icon className="h-4 w-4" />
                    </div>

                    <Card className="flex-1 border-none shadow-sm hover:bg-slate-50/50 transition-all group-hover:ring-1 group-hover:ring-slate-200">
                      <CardHeader className="p-4 pb-2 bg-slate-50/20">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-semibold text-slate-400   leading-none">STEP {step.step}</span>
                              <CardTitle className="text-xs font-semibold text-slate-900   leading-none">{step.title}</CardTitle>
                            </div>
                            <div className="flex items-center gap-4 text-xs font-semibold text-slate-400   mt-1.5">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-2.5 w-2.5" /> {step.date}
                              </span>
                              <span className="flex items-center gap-1">
                                <MapPin className="h-2.5 w-2.5" /> {step.location}
                              </span>
                            </div>
                          </div>
                          <Badge className="bg-emerald-50 text-emerald-700 font-semibold text-xs  h-4 px-1.5 border-emerald-100 border leading-none">
                            <CheckCircle2 className="mr-1 h-2 w-2" /> AUDITED
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="p-4 pt-3">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {step.details.map((detail, detailIdx) => (
                            <div key={detailIdx}>
                              <p className="text-[7px] font-semibold text-slate-400  mb-0.5  leading-none">{detail.label}</p>
                              <p className="text-xs font-bold text-slate-700  leading-tight truncate">{detail.value}</p>
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
            <Card className="border-none shadow-sm bg-white overflow-hidden">
              <CardHeader className="border-b border-slate-100 bg-slate-900 text-white p-4">
                <CardTitle className="text-xs font-semibold   flex items-center gap-2 leading-none">
                  <ShieldCheck className="h-4 w-4 text-emerald-400" /> DIGITAL INTEGRITY
                </CardTitle>
              </CardHeader>
              <CardContent className="p-5 space-y-4">
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-semibold  ">
                    <span className="text-slate-400">NODE VALIDATION</span>
                    <span className="text-emerald-600">SECURE</span>
                  </div>
                  <Progress value={100} className="h-1 bg-slate-100" />
                </div>
                <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <p className="text-xs font-semibold text-slate-400  mb-1.5  leading-none">BLOCKCHAIN HASH</p>
                  <p className="text-xs font-mono break-all text-slate-500 leading-relaxed ">0X7A250D5630B4CF539739DF2C5DACB4C659F2488D</p>
                </div>
                <Button className="w-full bg-slate-900 font-semibold text-xs  h-9 hover:bg-slate-800 transition-all ">
                  EXPLORE LEDGER
                </Button>
              </CardContent>
            </Card>

            <Card className="border-none shadow-sm overflow-hidden bg-white">
              <CardHeader className="border-b border-slate-100 bg-slate-50 p-4">
                <CardTitle className="text-xs font-semibold   flex items-center gap-2 leading-none text-slate-900">
                  <BarChart3 className="h-4 w-4 text-slate-400" /> BATCH STATISTICS
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0 divide-y divide-slate-100">
                <div className="p-4 hover:bg-slate-50/50 transition-colors">
                  <p className="text-xs font-semibold text-slate-400  mb-2 ">NETWORK NODES TRAVERSED</p>
                  <div className="flex justify-between items-center">
                    <p className="text-xl font-semibold text-slate-900 leading-none">08</p>
                    <Globe className="h-5 w-5 text-slate-200" />
                  </div>
                </div>
                <div className="p-4 hover:bg-slate-50/50 transition-colors">
                  <p className="text-xs font-semibold text-slate-400  mb-2 ">TOTAL TRANSIT TIME</p>
                  <div className="flex justify-between items-center">
                    <p className="text-xl font-semibold text-slate-900 leading-none">22.4H</p>
                    <History className="h-5 w-5 text-slate-200" />
                  </div>
                </div>
                <div className="p-4 hover:bg-slate-50/50 transition-colors">
                  <p className="text-xs font-semibold text-slate-400  mb-2 ">CARBON FOOTPRINT</p>
                  <div className="flex justify-between items-center">
                    <p className="text-xl font-semibold text-slate-900 leading-none">1.2 KG</p>
                    <Leaf className="h-5 w-5 text-slate-200" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none bg-emerald-50 text-emerald-900 p-5 shadow-sm relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
                <Zap className="h-12 w-12" />
              </div>
              <h4 className="text-xs font-semibold   mb-2 leading-none border-b border-emerald-200 pb-2">AI VERIFICATION INSIGHT</h4>
              <p className="text-xs font-bold text-emerald-800 leading-relaxed  ">
                MODEL ANALYSIS CONFIRMS BATCH <span className="text-emerald-900 font-semibold underline decoration-emerald-400/50 underline-offset-2">BP-2024-001</span> IS 100% COMPLIANT WITH PREMIUM IR64 STANDARDS. GEOGRAPHICAL ORIGIN CONFIRMED VIA SATELLITE HARVEST DATA.
              </p>
              <Button variant="link" className="p-0 h-auto text-xs font-semibold  text-emerald-900 flex items-center gap-1.5 mt-4 hover:no-underline hover:text-emerald-700">
                VIEW SATELLITE PROOF <ExternalLink className="h-2.5 w-2.5" />
              </Button>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
