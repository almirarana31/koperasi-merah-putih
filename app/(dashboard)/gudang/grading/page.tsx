'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  ClipboardCheck,
  Droplets,
  History,
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
import { exportToPDF } from '@/lib/pdf-export'

const gradingQueue = [
  { id: 'GR001', batchCode: 'BP-2024-003', provinceId: 'p-jabar', regionId: 'r-cianjur', cooperativeId: 'coop-001', cooperative: 'KSP Bakti Mandiri', komoditas: 'Beras Premium', produsen: 'Pak Slamet Widodo', jumlah: 500, satuan: 'kg', tanggalMasuk: '2024-02-16', status: 'menunggu' },
  { id: 'GR002', batchCode: 'KT-2024-001', provinceId: 'p-jatim', regionId: 'r-malang', cooperativeId: 'coop-002', cooperative: 'KUD Tani Makmur', komoditas: 'Kentang', produsen: 'Pak Hendra Wijaya', jumlah: 400, satuan: 'kg', tanggalMasuk: '2024-02-16', status: 'proses', progress: 60 },
  { id: 'GR003', batchCode: 'CM-2024-002', provinceId: 'p-jateng', regionId: 'r-wonosobo', cooperativeId: 'coop-003', cooperative: 'Koptan Dieng Jaya', komoditas: 'Cabai Merah', produsen: 'Bu Sri Wahyuni', jumlah: 150, satuan: 'kg', tanggalMasuk: '2024-02-15', status: 'menunggu' },
]

const gradingHistory = [
  { id: 'GH001', batchCode: 'BP-2024-001', provinceId: 'p-jabar', regionId: 'r-cianjur', cooperativeId: 'coop-001', cooperative: 'KSP Bakti Mandiri', komoditas: 'Beras Premium', jumlah: 3000, satuan: 'kg', tanggalGrading: '2024-02-14', hasil: { gradeA: 2400, gradeB: 500, gradeC: 80, reject: 20 }, qcScore: 92, parameters: { kadarAir: 12.5, butirPatah: 8, butirMuda: 2, kotoran: 0.3 } },
  { id: 'GH002', batchCode: 'JP-2024-001', provinceId: 'p-jatim', regionId: 'r-malang', cooperativeId: 'coop-002', cooperative: 'KUD Tani Makmur', komoditas: 'Jagung Pipil', jumlah: 3500, satuan: 'kg', tanggalGrading: '2024-02-12', hasil: { gradeA: 2800, gradeB: 600, gradeC: 90, reject: 10 }, qcScore: 88, parameters: { kadarAir: 13.2, butirRusak: 5, kotoran: 0.5 } },
]

const provinceLabels: Record<string, string> = {
  'p-jabar': 'Jawa Barat',
  'p-jatim': 'Jawa Timur',
  'p-jateng': 'Jawa Tengah',
}

const regionLabels: Record<string, string> = {
  'r-cianjur': 'Cianjur',
  'r-malang': 'Malang',
  'r-wonosobo': 'Wonosobo',
}

function toTitleCase(value: string) {
  return value
    .replace(/[-_]/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map(segment => segment.charAt(0).toUpperCase() + segment.slice(1).toLowerCase())
    .join(' ')
}

function formatProvince(provinceId: string) {
  return provinceLabels[provinceId] ?? toTitleCase(provinceId.replace(/^p-/, ''))
}

function formatRegion(regionId: string) {
  return regionLabels[regionId] ?? toTitleCase(regionId.replace(/^r-/, ''))
}

function formatQueueStatus(status: string) {
  if (status === 'proses') return 'Processing'
  if (status === 'menunggu') return 'Pending Start'
  return toTitleCase(status)
}

function formatGradeLabel(grade: string) {
  if (grade === 'gradeA') return 'Grade A'
  if (grade === 'gradeB') return 'Grade B'
  if (grade === 'gradeC') return 'Grade C'
  return toTitleCase(grade)
}

function formatParameterLabel(key: string) {
  return key.replace(/([A-Z])/g, ' $1').replace(/^./, (char) => char.toUpperCase())
}

export default function GradingQCKementerianPage() {
  const router = useRouter()
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
        },
      })),
      pendingCount: Math.floor(14 * scaleFactor) + 2,
      processedToday: Math.floor(45 * scaleFactor) + 5,
    }
  }, [filters])

  const handleComplianceLogs = async () => {
    await exportToPDF({
      title: 'Compliance Logs',
      subtitle: 'National grading and quality control audit summary',
      filename: 'compliance-logs.pdf',
      data: processedData.history.map((item) => ({
        Batch: item.batchCode,
        Commodity: item.komoditas,
        Cooperative: item.cooperative,
        Region: `${formatProvince(item.provinceId)} - ${formatRegion(item.regionId)}`,
        'QC Score': `${item.qcScore}%`,
        Date: item.tanggalGrading,
      })),
    })
  }

  const handleTelemetryReport = async (item: (typeof processedData.history)[number]) => {
    await exportToPDF({
      title: `Telemetry Report ${item.batchCode}`,
      subtitle: `${item.komoditas} - ${item.cooperative}`,
      filename: `${item.batchCode.toLowerCase()}-telemetry-report.pdf`,
      data: Object.entries(item.parameters).map(([parameter, value]) => ({
        Parameter: formatParameterLabel(parameter),
        Value: `${value}%`,
      })),
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="flex items-center gap-2 text-2xl font-semibold leading-none text-slate-900">
              <ClipboardCheck className="h-6 w-6 text-[var(--dashboard-primary)]" />
              National Grading & QC Audit
            </h1>
            <p className="mt-2 text-sm text-slate-600">
              Monitoring standar kualitas dan verifikasi grading komoditas lintas regional.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              variant="outline"
              onClick={handleComplianceLogs}
              className="h-9 border-[var(--dashboard-surface-border-strong)] bg-white px-4 text-sm font-medium text-slate-700 hover:bg-[var(--dashboard-surface-subtle)]"
            >
              <History className="mr-1.5 h-4 w-4 text-[var(--dashboard-secondary)]" />
              Compliance Logs
            </Button>
            <Button
              onClick={() => router.push('/assistant?intent=global-regrade')}
              className="h-9 bg-[var(--dashboard-primary)] px-4 text-sm font-medium text-[var(--primary-foreground)] hover:bg-[var(--dashboard-primary-hover)]"
            >
              <Zap className="mr-1.5 h-4 w-4 text-amber-200" />
              Global Re-Grading
            </Button>
          </div>
        </div>

        <KementerianFilterBar filters={filters} setFilters={setFilters} />
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Card className="surface-card-strong">
          <CardContent className="space-y-1">
            <p className="text-sm font-medium text-slate-600">Aggregate Queue</p>
            <CardTitle className="text-3xl font-semibold text-slate-900">{processedData.pendingCount}</CardTitle>
            <p className="text-sm font-medium text-amber-700">Awaiting Verification</p>
          </CardContent>
        </Card>

        <Card className="surface-card-strong">
          <CardContent className="space-y-1">
            <p className="text-sm font-medium text-slate-600">Completed Today</p>
            <CardTitle className="text-3xl font-semibold text-slate-900">{processedData.processedToday}</CardTitle>
            <p className="text-sm font-medium text-emerald-700">Throughput Target Met</p>
          </CardContent>
        </Card>

        <Card className="surface-card-strong">
          <CardContent className="space-y-1">
            <p className="text-sm font-medium text-slate-600">Average Network QC Score</p>
            <CardTitle className="text-3xl font-semibold text-slate-900">91.4%</CardTitle>
            <div className="flex items-center gap-1 text-sm font-medium text-emerald-700">
              <Star className="h-3 w-3 fill-current" />
              High Consistency
            </div>
          </CardContent>
        </Card>

        <Card className="surface-card-strong">
          <CardContent className="space-y-1">
            <p className="text-sm font-medium text-slate-600">Reject Rate Index</p>
            <CardTitle className="text-3xl font-semibold text-rose-600">1.8%</CardTitle>
            <p className="text-sm font-medium text-slate-600">Below 2% global threshold</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="queue" className="w-full">
        <TabsList className="dashboard-inner-surface h-11 w-fit p-1">
          <TabsTrigger
            value="queue"
            className="h-9 px-5 text-sm font-medium text-slate-600 data-[state=active]:bg-[var(--dashboard-primary)] data-[state=active]:text-[var(--primary-foreground)]"
          >
            National Queue ({processedData.queue.length})
          </TabsTrigger>
          <TabsTrigger
            value="history"
            className="h-9 px-5 text-sm font-medium text-slate-600 data-[state=active]:bg-[var(--dashboard-primary)] data-[state=active]:text-[var(--primary-foreground)]"
          >
            Audit History
          </TabsTrigger>
        </TabsList>

        <TabsContent value="queue" className="mt-4">
          <div className="space-y-3">
            {processedData.queue.length > 0 ? (
              processedData.queue.map((item) => (
                <Card key={item.id} className="surface-card-strong overflow-hidden">
                  <div className="grid md:grid-cols-[260px_1fr_250px]">
                    <div className="dashboard-section-header space-y-3 p-5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--dashboard-secondary-soft)] text-[var(--dashboard-primary)] shadow-sm">
                          <Scale className="h-5 w-5" />
                        </div>
                        <div className="min-w-0">
                          <Badge variant="outline" className="border-[var(--dashboard-surface-border-strong)] bg-white text-xs font-medium text-slate-700">
                            {item.batchCode}
                          </Badge>
                          <p className="mt-2 truncate text-base font-semibold text-slate-900">{item.komoditas}</p>
                        </div>
                      </div>
                      <p className="text-sm text-slate-600">
                        {formatProvince(item.provinceId)} · {formatRegion(item.regionId)}
                      </p>
                    </div>

                    <div className="flex flex-col justify-center gap-3 p-5">
                      <div className="grid gap-2 text-sm sm:grid-cols-[160px_1fr] sm:items-center">
                        <p className="font-medium text-slate-600">Cooperative Node</p>
                        <p className="font-medium text-slate-900">{item.cooperative}</p>
                      </div>
                      <div className="grid gap-2 text-sm sm:grid-cols-[160px_1fr] sm:items-center">
                        <p className="font-medium text-slate-600">Producer Entity</p>
                        <p className="font-medium text-slate-900">{item.produsen}</p>
                      </div>
                      <div className="dashboard-inner-surface grid gap-2 rounded-2xl px-4 py-3 text-sm sm:grid-cols-[160px_1fr] sm:items-center">
                        <p className="font-medium text-slate-600">Volume Under Audit</p>
                        <p className="font-semibold text-slate-900">
                          {item.jumlah} {item.satuan}
                        </p>
                      </div>
                    </div>

                    <div className="dashboard-section-header flex flex-col justify-between gap-4 p-5">
                      {item.status === 'proses' ? (
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm font-medium">
                            <span className="text-[var(--dashboard-tertiary)]">{formatQueueStatus(item.status)}</span>
                            <span className="text-slate-900">{item.progress}%</span>
                          </div>
                          <Progress value={item.progress} className="h-2 bg-[var(--dashboard-tertiary-soft)]" />
                        </div>
                      ) : (
                        <Badge className="w-fit border-0 bg-amber-100 text-sm font-medium text-amber-700">
                          {formatQueueStatus(item.status)}
                        </Badge>
                      )}
                      <div className="flex flex-wrap gap-2">
                        <Button
                          variant="outline"
                          onClick={() => router.push(`/assistant?intent=audit-sensor&batch=${item.id}`)}
                          className="h-9 flex-1 border-[var(--dashboard-surface-border-strong)] bg-white text-sm font-medium text-slate-700 hover:bg-[var(--dashboard-surface-subtle)]"
                        >
                          Audit Sensor
                        </Button>
                        <Button
                          onClick={() => router.push(`/assistant?intent=start-qc&batch=${item.id}`)}
                          className="h-9 flex-1 bg-[var(--dashboard-primary)] text-sm font-medium text-[var(--primary-foreground)] hover:bg-[var(--dashboard-primary-hover)]"
                        >
                          Start QC
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <div className="dashboard-inner-surface rounded-2xl px-6 py-12 text-center">
                <p className="text-sm font-medium text-slate-600">No batches in queue for the selected scope.</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="history" className="mt-4">
          <div className="space-y-4">
            {processedData.history.map((item) => (
              <Card key={item.id} className="surface-card-strong overflow-hidden">
                <CardHeader className="dashboard-section-header">
                  <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--dashboard-tertiary-soft)] text-[var(--dashboard-tertiary)] shadow-sm">
                        <ShieldCheck className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="mb-1 flex flex-wrap items-center gap-2">
                          <Badge className="border-0 bg-[var(--dashboard-primary-soft)] text-sm font-medium text-[var(--dashboard-primary)]">
                            {item.batchCode}
                          </Badge>
                          <CardTitle className="text-base font-semibold text-slate-900">{item.komoditas}</CardTitle>
                        </div>
                        <p className="text-sm text-slate-600">
                          Completed {item.tanggalGrading} · {item.cooperative}
                        </p>
                      </div>
                    </div>
                    <div className="dashboard-inner-surface rounded-2xl px-4 py-3 text-right">
                      <p className="text-sm font-medium text-slate-600">Audit QC Score</p>
                      <p className={`text-3xl font-semibold ${item.qcScore >= 90 ? 'text-emerald-700' : 'text-amber-700'}`}>
                        {item.qcScore}%
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-2">
                  <div className="dashboard-inner-surface rounded-2xl p-4">
                    <p className="mb-4 text-sm font-medium text-slate-600">Grade Yield Analysis</p>
                    <div className="space-y-3">
                      {Object.entries(item.hasil).map(([grade, val]) => (
                        <div key={grade} className="grid items-center gap-3 sm:grid-cols-[auto_1fr_auto_120px]">
                          <div className={`h-2.5 w-2.5 rounded-full ${grade === 'gradeA' ? 'bg-emerald-500' : grade === 'gradeB' ? 'bg-[var(--dashboard-tertiary)]' : grade === 'gradeC' ? 'bg-amber-500' : 'bg-rose-500'}`} />
                          <span className="text-sm font-medium text-slate-700">{formatGradeLabel(grade)}</span>
                          <span className="text-sm font-semibold text-slate-900">{val} Kg</span>
                          <div className="h-2 overflow-hidden rounded-full bg-[var(--dashboard-surface-muted)]">
                            <div
                              className={`${grade === 'gradeA' ? 'bg-emerald-500' : grade === 'gradeB' ? 'bg-[var(--dashboard-tertiary)]' : grade === 'gradeC' ? 'bg-amber-500' : 'bg-rose-500'} h-full rounded-full`}
                              style={{ width: `${(val / item.jumlah) * 100}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="dashboard-inner-surface rounded-2xl p-4">
                    <p className="mb-4 text-sm font-medium text-slate-600">Telemetry Parameters</p>
                    <div className="grid grid-cols-2 gap-3">
                      {Object.entries(item.parameters).map(([key, value]) => (
                        <div key={key} className="rounded-2xl border border-[var(--dashboard-surface-border)] bg-white px-3 py-3 shadow-sm">
                          <div className="flex items-start gap-2.5">
                            {key.includes('air') ? (
                              <Droplets className="mt-0.5 h-4 w-4 text-[var(--dashboard-tertiary)]" />
                            ) : (
                              <ShieldCheck className="mt-0.5 h-4 w-4 text-emerald-600" />
                            )}
                            <div>
                              <p className="text-xs font-medium text-slate-600">{formatParameterLabel(key)}</p>
                              <p className="mt-1 text-sm font-semibold text-slate-900">{value}%</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <Button
                      variant="outline"
                      onClick={() => handleTelemetryReport(item)}
                      className="mt-4 h-9 w-full border-[var(--dashboard-surface-border-strong)] bg-white text-sm font-medium text-slate-700 hover:bg-[var(--dashboard-surface-subtle)]"
                    >
                      View Full Telemetry Report
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <Card className="surface-card-strong overflow-hidden">
        <div className="grid gap-0 md:grid-cols-[160px_1fr]">
          <div className="dashboard-section-header flex items-center justify-center p-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-[var(--dashboard-primary-soft)] text-[var(--dashboard-primary)] shadow-sm">
              <ShieldCheck className="h-8 w-8" />
            </div>
          </div>
          <div className="p-6">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <h3 className="text-lg font-semibold text-slate-900">National QC Standard Summary</h3>
              <Badge className="w-fit border-0 bg-emerald-100 text-sm font-medium text-emerald-700">
                All Regions Compliant
              </Badge>
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div className="dashboard-inner-surface rounded-2xl p-4">
                <p className="text-sm font-medium text-[var(--dashboard-primary)]">Standard Enforcement</p>
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  Automated grading has reduced grade misclassification across the national network by 14.5% this quarter.
                  Standardized pricing based on AI grading is fully enforced.
                </p>
              </div>
              <div className="dashboard-inner-surface rounded-2xl p-4">
                <p className="text-sm font-medium text-[var(--dashboard-tertiary)]">Regional Performance</p>
                <p className="mt-2 text-sm leading-6 text-slate-700">
                  West Java nodes are reporting the highest Grade A yield, currently 8% above the national average, with
                  varietal soil data under review for wider rollout.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
