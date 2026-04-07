'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  ClipboardCheck,
  Droplets,
  History,
  MapPin,
  Scale,
  ShieldCheck,
  Star,
  Zap,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { KementerianFilterBar } from '@/components/dashboard/kementerian-filter-bar'
import { type ScopeFilters } from '@/lib/kementerian-dashboard-data'
import { toast } from 'sonner'

const baseGradingQueue = [
  { id: 'GR001', batchCode: 'BP-2026-003', provinceId: 'p-jabar', regionId: 'r-cianjur', cooperativeId: 'coop-001', cooperative: 'Koperasi Merah Putih Jabar', komoditas: 'Beras Premium IR64', produsen: 'Bpk. Slamet Widodo', jumlah: 500000, satuan: 'kg', tanggalMasuk: '2026-04-16', status: 'menunggu' },
  { id: 'GR002', batchCode: 'KT-2026-001', provinceId: 'p-jatim', regionId: 'r-malang', cooperativeId: 'coop-002', cooperative: 'Koperasi Merah Putih Jatim', komoditas: 'Kentang Granola G2', produsen: 'Bpk. Hendra Wijaya', jumlah: 400000, satuan: 'kg', tanggalMasuk: '2026-04-16', status: 'proses', progress: 60 },
  { id: 'GR003', batchCode: 'CM-2026-002', provinceId: 'p-jateng', regionId: 'r-wonosobo', cooperativeId: 'coop-003', cooperative: 'Koperasi Merah Putih Jateng', komoditas: 'Cabai Merah Keriting', produsen: 'Ibu Sri Wahyuni', jumlah: 150000, satuan: 'kg', tanggalMasuk: '2026-04-15', status: 'menunggu' },
]

const baseGradingHistory = [
  { id: 'GH001', batchCode: 'BP-2026-001', provinceId: 'p-jabar', regionId: 'r-cianjur', cooperativeId: 'coop-001', cooperative: 'Koperasi Merah Putih Jabar', komoditas: 'Beras Premium IR64', jumlah: 3000000, satuan: 'kg', tanggalGrading: '2026-04-14', hasil: { gradeA: 2400000, gradeB: 500000, gradeC: 80000, reject: 20000 }, qcScore: 92, parameters: { kadarAir: 12.5, butirPatah: 8, butirMuda: 2, kotoran: 0.3 } },
  { id: 'GH002', batchCode: 'JP-2026-001', provinceId: 'p-jatim', regionId: 'r-malang', cooperativeId: 'coop-002', cooperative: 'Koperasi Merah Putih Jatim', komoditas: 'Jagung Pipil Hibrida', jumlah: 3500000, satuan: 'kg', tanggalGrading: '2026-04-12', hasil: { gradeA: 2800000, gradeB: 600000, gradeC: 90000, reject: 10000 }, qcScore: 88, parameters: { kadarAir: 13.2, butirRusak: 5, kotoran: 0.5 } },
]

export default function GradingQCKementerianPage() {
  const router = useRouter()
  const [filters, setFilters] = useState<ScopeFilters>({
    provinceId: 'all',
    regionId: 'all',
    villageId: 'all',
    cooperativeId: 'all',
    commodityId: 'all',
  })

  const scaleFactor = useMemo(() => {
    if (filters.cooperativeId !== 'all') return 0.05
    if (filters.villageId !== 'all') return 0.1
    if (filters.regionId !== 'all') return 0.25
    if (filters.provinceId !== 'all') return 0.5
    return 1.0
  }, [filters])

  const processedData = useMemo(() => {
    const filteredQueue = baseGradingQueue.filter(item => {
      const matchProvince = filters.provinceId === 'all' || item.provinceId === filters.provinceId
      const matchRegency = filters.regionId === 'all' || item.regionId === filters.regionId
      const matchCoop = filters.cooperativeId === 'all' || item.cooperativeId === filters.cooperativeId
      return matchProvince && matchRegency && matchCoop
    })

    const filteredHistory = baseGradingHistory.filter(item => {
      const matchProvince = filters.provinceId === 'all' || item.provinceId === filters.provinceId
      const matchRegency = filters.regionId === 'all' || item.regionId === filters.regionId
      const matchCoop = filters.cooperativeId === 'all' || item.cooperativeId === filters.cooperativeId
      return matchProvince && matchRegency && matchCoop
    })

    return {
      queue: filteredQueue.map(q => ({ ...q, jumlah: q.jumlah * scaleFactor })),
      history: filteredHistory.map(h => ({
        ...h,
        jumlah: h.jumlah * scaleFactor,
        hasil: {
          gradeA: h.hasil.gradeA * scaleFactor,
          gradeB: h.hasil.gradeB * scaleFactor,
          gradeC: h.hasil.gradeC * scaleFactor,
          reject: h.hasil.reject * scaleFactor,
        },
      })),
      pendingCount: Math.round(140 * scaleFactor),
      processedToday: Math.round(450 * scaleFactor),
    }
  }, [filters, scaleFactor])

  const handleAction = (action: string) => {
    toast.success(`Audit ${action} berhasil dijalankan secara nasional`)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="flex items-center gap-3 text-2xl font-black text-slate-900 uppercase tracking-tight">
              <ClipboardCheck className="h-7 w-7 text-slate-900" />
              Audit Grading & QC Nasional
            </h1>
            <p className="mt-2 text-[10px] font-black text-slate-500 uppercase tracking-widest">
              Monitoring Standar Kualitas dan Verifikasi Grading Komoditas Strategis Lintas Wilayah
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              onClick={() => handleAction('Log Kepatuhan')}
              className="h-10 rounded-none border-2 border-slate-200 bg-white px-5 text-[10px] font-black uppercase tracking-widest text-slate-700 hover:bg-slate-50"
            >
              <History className="mr-2 h-4 w-4 text-slate-400" />
              Log Kepatuhan
            </Button>
            <Button
              onClick={() => handleAction('Re-Grading Global')}
              className="h-10 rounded-none bg-slate-900 px-6 text-[10px] font-black uppercase tracking-widest text-white hover:bg-slate-800"
            >
              <Zap className="mr-2 h-4 w-4 text-amber-400" />
              Re-Grading Global
            </Button>
          </div>
        </div>

        <KementerianFilterBar filters={filters} setFilters={setFilters} />
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          { label: 'ANTREAN AGREGAT', value: processedData.pendingCount, sub: 'MENUNGGU VERIFIKASI', tone: 'slate' },
          { label: 'SELESAI HARI INI', value: processedData.processedToday, sub: 'TARGET THROUGHPUT TERCAPAI', tone: 'emerald' },
          { label: 'SKOR QC JARINGAN', value: '91.4%', sub: 'KONSISTENSI TINGGI', tone: 'emerald', icon: Star },
          { label: 'INDEKS REJECT', value: '1.8%', sub: 'DI BAWAH AMBANG BATAS 2%', tone: 'rose' },
        ].map((stat, i) => (
          <Card key={i} className="rounded-none border-none shadow-sm bg-white overflow-hidden">
            <div className={`h-1.5 w-full ${stat.tone === 'emerald' ? 'bg-emerald-500' : stat.tone === 'rose' ? 'bg-rose-500' : 'bg-slate-900'}`} />
            <CardContent className="p-4 space-y-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <CardTitle className={`text-2xl font-black ${stat.tone === 'rose' ? 'text-rose-600' : 'text-slate-900'}`}>{stat.value}</CardTitle>
              <div className={`flex items-center gap-1.5 text-[10px] font-black uppercase tracking-tighter ${stat.tone === 'emerald' ? 'text-emerald-700' : stat.tone === 'rose' ? 'text-rose-700' : 'text-slate-500'}`}>
                {stat.icon && <stat.icon className="h-3 w-3 fill-current" />}
                {stat.sub}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="queue" className="w-full">
        <TabsList className="h-12 w-fit bg-slate-100 p-1 rounded-none">
          <TabsTrigger
            value="queue"
            className="rounded-none h-10 px-6 text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-slate-900 data-[state=active]:text-white"
          >
            Antrean Nasional ({processedData.queue.length})
          </TabsTrigger>
          <TabsTrigger
            value="history"
            className="rounded-none h-10 px-6 text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-slate-900 data-[state=active]:text-white"
          >
            Riwayat Audit QC
          </TabsTrigger>
        </TabsList>

        <TabsContent value="queue" className="mt-4">
          <div className="space-y-4">
            {processedData.queue.length > 0 ? (
              processedData.queue.map((item) => (
                <Card key={item.id} className="rounded-none border-none shadow-sm overflow-hidden border-l-4 border-l-slate-900 hover:shadow-md transition-all">
                  <div className="grid md:grid-cols-[300px_1fr_250px]">
                    <div className="p-6 space-y-4 border-r border-slate-50">
                      <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-none bg-slate-100 text-slate-900 border border-slate-200">
                          <Scale className="h-6 w-6" />
                        </div>
                        <div className="min-w-0">
                          <Badge className="rounded-none border-none bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest">
                            {item.batchCode}
                          </Badge>
                          <p className="mt-2 truncate text-base font-black text-slate-900 uppercase tracking-tight">{item.komoditas}</p>
                        </div>
                      </div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <MapPin className="h-3 w-3" /> {item.provinceId.replace('p-', '').toUpperCase()} · {item.regionId.replace('r-', '').toUpperCase()}
                      </p>
                    </div>

                    <div className="flex flex-col justify-center gap-4 p-6 bg-slate-50/30">
                      <div className="grid gap-2 text-[10px] font-black uppercase tracking-widest sm:grid-cols-[160px_1fr]">
                        <p className="text-slate-400">SIMPUL KOPERASI</p>
                        <p className="text-slate-900">{item.cooperative}</p>
                      </div>
                      <div className="grid gap-2 text-[10px] font-black uppercase tracking-widest sm:grid-cols-[160px_1fr]">
                        <p className="text-slate-400">ENTITAS PRODUSEN</p>
                        <p className="text-slate-900">{item.produsen}</p>
                      </div>
                      <div className="bg-white border border-slate-100 rounded-none px-4 py-3 text-[10px] font-black uppercase tracking-widest grid gap-2 sm:grid-cols-[160px_1fr]">
                        <p className="text-slate-400">VOLUME AUDIT</p>
                        <p className="text-sm font-black text-slate-900">
                          {(item.jumlah / 1000).toLocaleString()} TON
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col justify-between gap-4 p-6 border-l border-slate-50">
                      {item.status === 'proses' ? (
                        <div className="space-y-2">
                          <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                            <span className="text-blue-600">SEDANG DIPROSES</span>
                            <span className="text-slate-900">{item.progress}%</span>
                          </div>
                          <Progress value={item.progress} className="h-2 bg-blue-50 rounded-none" />
                        </div>
                      ) : (
                        <Badge className="rounded-none w-fit border-none bg-amber-100 text-[10px] font-black uppercase tracking-widest text-amber-700 h-6 px-3">
                          MENUNGGU START
                        </Badge>
                      )}
                      <div className="flex flex-col gap-2">
                        <Button
                          variant="outline"
                          onClick={() => handleAction(`Audit Sensor ${item.batchCode}`)}
                          className="h-10 rounded-none border-2 border-slate-200 bg-white text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-900 hover:text-white transition-all"
                        >
                          Audit Sensor
                        </Button>
                        <Button
                          onClick={() => handleAction(`Mulai QC ${item.batchCode}`)}
                          className="h-10 rounded-none bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 shadow-lg"
                        >
                          Mulai QC
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <div className="bg-slate-50 rounded-none border-2 border-dashed border-slate-200 px-6 py-12 text-center">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Tidak ada batch dalam antrean audit untuk scope ini.</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="history" className="mt-4">
          <div className="space-y-6">
            {processedData.history.map((item) => (
              <Card key={item.id} className="rounded-none border-none shadow-sm overflow-hidden border-t-4 border-t-emerald-500">
                <CardHeader className="p-6 border-b border-slate-50 bg-slate-50/30">
                  <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                    <div className="flex items-center gap-5">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-none bg-emerald-900 text-emerald-400 shadow-lg">
                        <ShieldCheck className="h-7 w-7" />
                      </div>
                      <div>
                        <div className="mb-2 flex flex-wrap items-center gap-3">
                          <Badge className="rounded-none border-none bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest h-6 px-3">
                            {item.batchCode}
                          </Badge>
                          <CardTitle className="text-xl font-black text-slate-900 uppercase tracking-tight">{item.komoditas}</CardTitle>
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          SELESAI {item.tanggalGrading} · {item.cooperative}
                        </p>
                      </div>
                    </div>
                    <div className="bg-white border border-slate-100 rounded-none px-6 py-4 text-right shadow-inner">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">SKOR AUDIT QC</p>
                      <p className={`text-3xl font-black ${item.qcScore >= 90 ? 'text-emerald-700' : 'text-amber-700'}`}>
                        {item.qcScore}%
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="grid gap-6 p-6 md:grid-cols-2">
                  <div className="bg-slate-50 rounded-none border border-slate-100 p-5">
                    <p className="mb-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-200 pb-2">Analisis Yield Per Grade</p>
                    <div className="space-y-4">
                      {Object.entries(item.hasil).map(([grade, val]) => (
                        <div key={grade} className="grid items-center gap-4 sm:grid-cols-[auto_1fr_auto_150px]">
                          <div className={`h-3 w-3 rounded-none ${grade === 'gradeA' ? 'bg-emerald-500' : grade === 'gradeB' ? 'bg-blue-500' : grade === 'gradeC' ? 'bg-amber-500' : 'bg-rose-500'}`} />
                          <span className="text-[10px] font-black text-slate-700 uppercase tracking-widest">{grade.replace('grade', 'GRADE ')}</span>
                          <span className="text-xs font-black text-slate-900">{(val / 1000).toLocaleString()} TON</span>
                          <div className="h-2 overflow-hidden rounded-none bg-slate-200">
                            <div
                              className={`${grade === 'gradeA' ? 'bg-emerald-500' : grade === 'gradeB' ? 'bg-blue-500' : grade === 'gradeC' ? 'bg-amber-500' : 'bg-rose-500'} h-full`}
                              style={{ width: `${(val / item.jumlah) * 100}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="bg-slate-50 rounded-none border border-slate-100 p-5">
                    <p className="mb-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-200 pb-2">Parameter Telemetri QC</p>
                    <div className="grid grid-cols-2 gap-4">
                      {Object.entries(item.parameters).map(([key, value]) => (
                        <div key={key} className="rounded-none border border-slate-200 bg-white p-4 shadow-sm hover:shadow-md transition-all">
                          <div className="flex items-start gap-3">
                            {key.toLowerCase().includes('air') ? (
                              <Droplets className="mt-0.5 h-4 w-4 text-blue-500" />
                            ) : (
                              <ShieldCheck className="mt-0.5 h-4 w-4 text-emerald-600" />
                            )}
                            <div>
                              <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{key.replace(/([A-Z])/g, ' $1').toUpperCase()}</p>
                              <p className="mt-1 text-sm font-black text-slate-900 uppercase">{value}%</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => handleAction(`Laporan Telemetri ${item.batchCode}`)}
                      className="mt-6 h-10 w-full rounded-none border-2 border-slate-200 bg-white text-[10px] font-black uppercase tracking-widest text-slate-700 hover:bg-slate-900 hover:text-white transition-all"
                    >
                      Lihat Laporan Telemetri Penuh
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <Card className="rounded-none border-none shadow-sm overflow-hidden border-t-4 border-t-slate-900 mt-6">
        <div className="grid gap-0 md:grid-cols-[200px_1fr]">
          <div className="bg-slate-900 flex items-center justify-center p-8">
            <div className="flex h-20 w-20 items-center justify-center rounded-none bg-slate-800 text-emerald-400 shadow-2xl border border-slate-700">
              <ShieldCheck className="h-10 w-10" />
            </div>
          </div>
          <div className="p-8 bg-white">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between mb-6">
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Ringkasan Standar QC Nasional</h3>
              <Badge className="rounded-none border-none bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest h-6 px-4">
                SEMUA WILAYAH PATUH STANDAR
              </Badge>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="bg-slate-50 rounded-none border-l-4 border-l-slate-900 p-5 shadow-sm">
                <p className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-3">PENEGAKAN STANDAR NASIONAL</p>
                <p className="text-xs font-black uppercase tracking-tight leading-relaxed text-slate-600">
                  SISTEM GRADING OTOMATIS TELAH MENGURANGI MISKLASIFIKASI GRADE DI SELURUH JARINGAN NASIONAL SEBESAR 14.5% KUARTAL INI. PENETAPAN HARGA BERDASARKAN HASIL QC AI TELAH DITEGAKKAN SEPENUHNYA.
                </p>
              </div>
              <div className="bg-slate-50 rounded-none border-l-4 border-l-blue-500 p-5 shadow-sm">
                <p className="text-[10px] font-black text-blue-900 uppercase tracking-widest mb-3">PERFORMA REGIONAL STRATEGIS</p>
                <p className="text-xs font-black uppercase tracking-tight leading-relaxed text-slate-600">
                  SIMPUL JAWA BARAT MELAPORKAN YIELD GRADE A TERTINGGI, SAAT INI 8% DI ATAS RATA-RATA NASIONAL. DATA VARIETAS DAN KONDISI TANAH SEDANG DIKAJI UNTUK REPLIKASI NASIONAL.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
