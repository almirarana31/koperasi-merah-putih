'use client'

import { useState, useMemo } from 'react'
import {
  CheckCircle2,
  Scale,
  Star,
  Eye,
  Globe,
  Zap,
  History,
  ShieldCheck,
  ClipboardCheck,
  Droplets,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { KementerianFilterBar } from '@/components/dashboard/kementerian-filter-bar'
import { type ScopeFilters } from '@/lib/kementerian-dashboard-data'

const gradingQueue = [
  { id: 'GR001', batchCode: 'BP-2024-003', provinceId: 'p-jabar', regionId: 'r-cianjur', cooperativeId: 'coop-001', cooperative: 'KSP Bakti Mandiri', komoditas: 'Beras Premium', produsen: 'Pak Slamet Widodo', jumlah: 500, satuan: 'kg', tanggalMasuk: '2024-02-16', status: 'menunggu' },
  { id: 'GR002', batchCode: 'KT-2024-001', provinceId: 'p-jatim', regionId: 'r-malang', cooperativeId: 'coop-002', cooperative: 'KUD Tani Makmur', komoditas: 'Kentang', produsen: 'Pak Hendra Wijaya', jumlah: 400, satuan: 'kg', tanggalMasuk: '2024-02-16', status: 'proses', progress: 60 },
  { id: 'GR003', batchCode: 'CM-2024-002', provinceId: 'p-jateng', regionId: 'r-wonosobo', cooperativeId: 'coop-003', cooperative: 'Koptan Dieng Jaya', komoditas: 'Cabai Merah', produsen: 'Bu Sri Wahyuni', jumlah: 150, satuan: 'kg', tanggalMasuk: '2024-02-15', status: 'menunggu' },
]

const gradingHistory = [
  { id: 'GH001', batchCode: 'BP-2024-001', provinceId: 'p-jabar', regionId: 'r-cianjur', cooperativeId: 'coop-001', cooperative: 'KSP Bakti Mandiri', komoditas: 'Beras Premium', jumlah: 3000, satuan: 'kg', tanggalGrading: '2024-02-14', hasil: { gradeA: 2400, gradeB: 500, gradeC: 80, reject: 20 }, qcScore: 92, parameters: { kadarAir: 12.5, butirPatah: 8, butirMuda: 2, kotoran: 0.3 } },
  { id: 'GH002', batchCode: 'JP-2024-001', provinceId: 'p-jatim', regionId: 'r-malang', cooperativeId: 'coop-002', cooperative: 'KUD Tani Makmur', komoditas: 'Jagung Pipil', jumlah: 3500, satuan: 'kg', tanggalGrading: '2024-02-12', hasil: { gradeA: 2800, gradeB: 600, gradeC: 90, reject: 10 }, qcScore: 88, parameters: { kadarAir: 13.2, butirRusak: 5, kotoran: 0.5 } },
]

export default function GradingQCKementerianPage() {
  const [filters, setFilters] = useState<ScopeFilters>({
    provinceId: 'all',
    regionId: 'all',
    villageId: 'all',
    cooperativeId: 'all',
    commodityId: 'all',
  })

  const processedData = useMemo(() => {
    let scaleFactor = 1.0
    if (filters.cooperativeId !== 'all') scaleFactor = 0.1
    else if (filters.regionId !== 'all') scaleFactor = 0.3
    else if (filters.provinceId !== 'all') scaleFactor = 0.6

    const filteredQueue = gradingQueue.filter(item => {
      const matchProvince = filters.provinceId === 'all' || item.provinceId === filters.provinceId
      const matchRegency = filters.regionId === 'all' || item.regionId === filters.regionId
      const matchCoop = filters.cooperativeId === 'all' || item.cooperativeId === filters.cooperativeId
      return matchProvince && matchRegency && matchCoop
    })

    const filteredHistory = gradingHistory.filter(item => {
      const matchProvince = filters.provinceId === 'all' || item.provinceId === filters.provinceId
      const matchRegency = filters.regionId === 'all' || item.regionId === filters.regionId
      const matchCoop = filters.cooperativeId === 'all' || item.cooperativeId === filters.cooperativeId
      return matchProvince && matchRegency && matchCoop
    })

    return {
      queue: filteredQueue.map(q => ({ ...q, jumlah: Math.floor(q.jumlah * scaleFactor) + 1 })),
      history: filteredHistory.map(h => ({ 
        ...h, 
        jumlah: Math.floor(h.jumlah * scaleFactor) + 1,
        hasil: {
          gradeA: Math.floor(h.hasil.gradeA * scaleFactor) + 1,
          gradeB: Math.floor(h.hasil.gradeB * scaleFactor),
          gradeC: Math.floor(h.hasil.gradeC * scaleFactor),
          reject: Math.floor(h.hasil.reject * scaleFactor),
        }
      })),
      pendingCount: Math.floor(14 * scaleFactor) + 2,
      processedToday: Math.floor(45 * scaleFactor) + 5,
    }
  }, [filters])

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold  text-slate-900  flex items-center gap-2 leading-none">
              <ClipboardCheck className="h-6 w-6 text-slate-900" />
              National Grading & QC Audit
            </h1>
            <p className="text-xs font-bold  text-slate-500  mt-2">
              MONITORING STANDAR KUALITAS DAN VERIFIKASI GRADING KOMODITAS LINTAS REGIONAL
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" className="font-semibold border-2 text-xs  h-8  border-slate-200 px-3">
              <History className="mr-1.5 h-3.5 w-3.5" /> COMPLIANCE LOGS
            </Button>
            <Button className="bg-slate-900 font-semibold text-xs  h-8  px-3">
              <Zap className="mr-1.5 h-3.5 w-3.5 text-amber-400" /> GLOBAL RE-GRADE
            </Button>
          </div>
        </div>

        <KementerianFilterBar filters={filters} setFilters={setFilters} />
      </div>

      {/* KPI Section */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Card className="border-none shadow-sm">
          <CardContent className="p-4">
            <p className="text-xs font-semibold   text-slate-500 mb-1">AGGREGATE QUEUE</p>
            <CardTitle className="text-xl font-semibold text-slate-900">{processedData.pendingCount}</CardTitle>
            <p className="text-xs font-semibold text-amber-600  mt-1">AWAITING VERIFICATION</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardContent className="p-4">
            <p className="text-xs font-semibold   text-slate-500 mb-1">COMPLETED TODAY</p>
            <CardTitle className="text-xl font-semibold text-slate-900">{processedData.processedToday}</CardTitle>
            <p className="text-xs font-semibold text-emerald-600  mt-1">THROUGHPUT TARGET: MET</p>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardContent className="p-4">
            <p className="text-xs font-semibold   text-slate-500 mb-1">AVG. NETWORK QC SCORE</p>
            <CardTitle className="text-xl font-semibold text-slate-900">91.4%</CardTitle>
            <div className="flex items-center gap-1 text-xs font-semibold text-emerald-600  mt-1">
              <Star className="h-2 w-2 fill-current" /> HIGH CONSISTENCY
            </div>
          </CardContent>
        </Card>

        <Card className="border-none shadow-sm">
          <CardContent className="p-4">
            <p className="text-xs font-semibold   text-slate-500 mb-1">REJECT RATE INDEX</p>
            <CardTitle className="text-xl font-semibold text-rose-600">1.8%</CardTitle>
            <p className="text-xs font-semibold text-slate-500  mt-1 ">BELOW 2% GLOBAL THRESHOLD</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="queue" className="w-full">
        <TabsList className="bg-slate-100 border-none p-1 h-10 shadow-inner">
          <TabsTrigger value="queue" className="font-semibold text-xs   data-[state=active]:bg-slate-900 data-[state=active]:text-white h-full px-6 transition-all">
            NATIONAL QUEUE ({processedData.queue.length})
          </TabsTrigger>
          <TabsTrigger value="history" className="font-semibold text-xs   data-[state=active]:bg-slate-900 data-[state=active]:text-white h-full px-6 transition-all">
            AUDIT HISTORY
          </TabsTrigger>
        </TabsList>

        <TabsContent value="queue" className="mt-4">
          <div className="space-y-3">
            {processedData.queue.length > 0 ? (
              processedData.queue.map((item) => (
                <Card key={item.id} className="border-none shadow-sm hover:bg-slate-50 transition-all overflow-hidden group">
                  <div className="grid md:grid-cols-[250px_1fr_220px] divide-x-2 divide-slate-100">
                    <div className="p-4 bg-slate-50/30">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`h-10 w-10 rounded-lg flex items-center justify-center shadow-sm ${item.status === 'proses' ? 'bg-slate-900 text-emerald-400' : 'bg-slate-200 text-slate-500'}`}>
                          <Scale className="h-5 w-5" />
                        </div>
                        <div>
                          <Badge variant="outline" className="font-semibold text-xs border-slate-900  px-1.5 h-4">{item.batchCode}</Badge>
                          <p className="text-xs font-semibold text-slate-900  leading-none mt-1  truncate max-w-[140px]">{item.komoditas}</p>
                        </div>
                      </div>
                      <p className="text-xs font-bold text-slate-400   truncate">{item.provinceId} • {item.regionId}</p>
                    </div>

                    <div className="p-4 flex flex-col justify-center gap-2">
                      <div className="flex justify-between items-center">
                        <p className="text-xs font-semibold text-slate-400  ">COOPERATIVE NODE</p>
                        <p className="text-xs font-semibold text-slate-700  truncate max-w-[200px]">{item.cooperative}</p>
                      </div>
                      <div className="flex justify-between items-center">
                        <p className="text-xs font-semibold text-slate-400  ">PRODUCER ENTITY</p>
                        <p className="text-xs font-bold text-slate-500  truncate max-w-[200px]">{item.produsen}</p>
                      </div>
                      <div className="mt-2 pt-2 border-t border-dashed border-slate-100">
                        <div className="flex justify-between items-center text-xs font-semibold ">
                          <span className="text-slate-400">VOLUME UNDER AUDIT</span>
                          <span className="text-slate-900">{item.jumlah} {item.satuan}</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-slate-50/10 flex flex-col justify-between items-end">
                      {item.status === 'proses' ? (
                        <div className="w-full space-y-1.5">
                          <div className="flex justify-between text-xs font-semibold ">
                            <span className="text-blue-600">PROCESSING</span>
                            <span className="text-slate-900">{item.progress}%</span>
                          </div>
                          <Progress value={item.progress} className="h-1 bg-blue-100" />
                        </div>
                      ) : (
                        <Badge className="bg-amber-100 text-amber-700 font-semibold text-xs   h-4 px-1.5">PENDING START</Badge>
                      )}
                      <div className="flex gap-1.5 mt-4 w-full">
                        <Button variant="outline" className="flex-1 h-7 font-semibold text-xs  border-2 border-slate-200">AUDIT SENSOR</Button>
                        <Button className="flex-1 h-7 font-semibold text-xs  bg-slate-900">START QC</Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <div className="p-12 text-center border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/20">
                <p className="text-slate-400 font-semibold  text-xs ">NO BATCHES IN QUEUE FOR SELECTED SCOPE</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="history" className="mt-4">
          <div className="space-y-4">
            {processedData.history.map((item) => (
              <Card key={item.id} className="border-none shadow-sm overflow-hidden">
                <CardHeader className="bg-slate-50/50 border-b border-slate-100 p-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 rounded-xl bg-slate-900 flex items-center justify-center text-emerald-400 shadow-sm">
                        <ShieldCheck className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <Badge className="bg-slate-900 font-semibold text-xs  h-4 px-1.5">{item.batchCode}</Badge>
                          <CardTitle className="text-xs font-semibold text-slate-900   leading-none">{item.komoditas}</CardTitle>
                        </div>
                        <p className="text-xs font-semibold text-slate-400  ">
                          COMPLETED: {item.tanggalGrading} • NODE: {item.cooperative}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-semibold text-slate-400  mb-1">AUDIT QC SCORE</p>
                      <p className={`text-xl font-semibold leading-none ${item.qcScore >= 90 ? 'text-emerald-600' : 'text-amber-600'}`}>{item.qcScore}%</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <div className="grid md:grid-cols-2 divide-x divide-slate-100">
                    <div className="p-4">
                      <p className="text-xs font-semibold text-slate-400   mb-4">GRADE YIELD ANALYSIS</p>
                      <div className="space-y-2.5">
                        {Object.entries(item.hasil).map(([grade, val]) => (
                          <div key={grade} className="flex items-center gap-3">
                            <div className={`h-2 w-2 rounded-full ${grade === 'gradeA' ? 'bg-emerald-500' : grade === 'gradeB' ? 'bg-blue-500' : grade === 'gradeC' ? 'bg-amber-500' : 'bg-rose-500'}`} />
                            <span className="text-xs font-semibold text-slate-500  flex-1">{grade.replace(/([A-Z])/g, ' $1')}</span>
                            <span className="text-xs font-semibold text-slate-900">{val} KG</span>
                            <div className="w-24 h-1 bg-slate-50 rounded-full overflow-hidden">
                              <div className={`h-full ${grade === 'gradeA' ? 'bg-emerald-500' : 'bg-slate-300'}`} style={{ width: `${(val / item.jumlah) * 100}%` }} />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="p-4 bg-slate-50/20">
                      <p className="text-xs font-semibold text-slate-400   mb-4">TELEMETRY PARAMETERS</p>
                      <div className="grid grid-cols-2 gap-3">
                        {Object.entries(item.parameters).map(([key, value]) => (
                          <div key={key} className="flex items-center gap-2.5 p-2 bg-white border border-slate-100 rounded shadow-sm">
                            {key.includes('air') ? <Droplets className="h-3 w-3 text-blue-500" /> : <ShieldCheck className="h-3 w-3 text-emerald-500" />}
                            <div>
                              <p className="text-[7px] font-semibold text-slate-400  leading-none mb-1">{key.replace(/([A-Z])/g, ' $1')}</p>
                              <p className="text-xs font-semibold text-slate-900 leading-none">{value}%</p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <Button variant="outline" className="w-full mt-4 h-8 font-semibold text-xs  border-2 border-slate-900 text-slate-900 ">
                        VIEW FULL TELEMETRY REPORT
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* AI Strategy Insights */}
      <Card className="border-none bg-slate-900 text-white overflow-hidden mt-2 relative">
        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
          <Globe className="h-24 w-24" />
        </div>
        <div className="flex flex-col md:flex-row">
          <div className="p-6 bg-emerald-600 flex items-center justify-center md:w-32 shrink-0">
            <ShieldCheck className="h-10 w-10 text-slate-900" />
          </div>
          <div className="p-6 flex-1 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold   leading-none">NATIONAL QC STANDARD COMPLIANCE SUMMARY</h3>
              <Badge className="bg-emerald-500 text-slate-900 font-semibold text-xs  px-2 h-5 border-0">ALL REGIONS COMPLIANT</Badge>
            </div>
            <div className="grid md:grid-cols-2 gap-6 pt-2">
              <div className="space-y-1.5">
                <p className="text-xs font-semibold text-emerald-400  ">STANDARD ENFORCEMENT</p>
                <p className="text-xs font-bold text-slate-300 leading-relaxed ">
                  AUTOMATED GRADING HAS REDUCED GRADE MISCLASSIFICATION ACROSS THE <span className="text-white font-semibold">NATIONAL NETWORK</span> BY 14.5% THIS QUARTER. Standardized pricing based on AI-grading is fully enforced.
                </p>
              </div>
              <div className="space-y-1.5">
                <p className="text-xs font-semibold text-blue-400  ">REGIONAL PERFORMANCE</p>
                <p className="text-xs font-bold text-slate-300 leading-relaxed ">
                  <span className="text-white font-semibold">WEST JAVA</span> NODES REPORTING HIGHEST GRADE A YIELD (+8% ABOVE NATIONAL AVG). ANALYZING VARIETAL SOIL DATA FOR NETWORK-WIDE SCALING.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
