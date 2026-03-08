'use client'

import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Star,
  Scale,
  Thermometer,
  Droplets,
  Eye,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

const gradingQueue = [
  {
    id: 'GR001',
    batchCode: 'BP-2024-003',
    komoditas: 'Beras Premium',
    produsen: 'Pak Slamet Widodo',
    jumlah: 500,
    satuan: 'kg',
    tanggalMasuk: '2024-02-16',
    status: 'menunggu',
  },
  {
    id: 'GR002',
    batchCode: 'KT-2024-001',
    komoditas: 'Kentang',
    produsen: 'Pak Hendra Wijaya',
    jumlah: 400,
    satuan: 'kg',
    tanggalMasuk: '2024-02-16',
    status: 'proses',
    progress: 60,
  },
  {
    id: 'GR003',
    batchCode: 'CM-2024-002',
    komoditas: 'Cabai Merah',
    produsen: 'Bu Sri Wahyuni',
    jumlah: 150,
    satuan: 'kg',
    tanggalMasuk: '2024-02-15',
    status: 'menunggu',
  },
]

const gradingHistory = [
  {
    id: 'GH001',
    batchCode: 'BP-2024-001',
    komoditas: 'Beras Premium',
    jumlah: 3000,
    satuan: 'kg',
    tanggalGrading: '2024-02-14',
    hasil: {
      gradeA: 2400,
      gradeB: 500,
      gradeC: 80,
      reject: 20,
    },
    qcScore: 92,
    parameters: {
      kadarAir: 12.5,
      butirPatah: 8,
      butirMuda: 2,
      kotoran: 0.3,
    },
  },
  {
    id: 'GH002',
    batchCode: 'JP-2024-001',
    komoditas: 'Jagung Pipil',
    jumlah: 3500,
    satuan: 'kg',
    tanggalGrading: '2024-02-12',
    hasil: {
      gradeA: 2800,
      gradeB: 600,
      gradeC: 90,
      reject: 10,
    },
    qcScore: 88,
    parameters: {
      kadarAir: 13.2,
      butirRusak: 5,
      kotoran: 0.5,
    },
  },
]

export default function GradingQCPage() {
  const pendingCount = gradingQueue.filter(g => g.status === 'menunggu').length
  const processCount = gradingQueue.filter(g => g.status === 'proses').length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Grading & Quality Control</h1>
        <p className="text-muted-foreground">Pemeriksaan kualitas dan grading komoditas</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Antrian Grading</CardDescription>
            <CardTitle className="text-3xl">{pendingCount}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-amber-500">Menunggu proses</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Sedang Diproses</CardDescription>
            <CardTitle className="text-3xl">{processCount}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-blue-500">Dalam pengerjaan</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Selesai Hari Ini</CardDescription>
            <CardTitle className="text-3xl">5</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-emerald-500">Batch tergrading</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Rata-rata QC Score</CardDescription>
            <CardTitle className="text-3xl">90%</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1 text-xs text-emerald-500">
              <Star className="h-3 w-3 fill-current" />
              Kualitas baik
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="queue">
        <TabsList>
          <TabsTrigger value="queue">Antrian ({gradingQueue.length})</TabsTrigger>
          <TabsTrigger value="history">Riwayat</TabsTrigger>
        </TabsList>

        <TabsContent value="queue" className="space-y-4 mt-4">
          {gradingQueue.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${
                      item.status === 'proses' ? 'bg-blue-500/10 text-blue-500' : 'bg-amber-500/10 text-amber-500'
                    }`}>
                      <Scale className="h-6 w-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold">{item.komoditas}</p>
                        <Badge variant="outline">{item.batchCode}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {item.produsen} - {item.jumlah} {item.satuan}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    {item.status === 'proses' && item.progress && (
                      <div className="w-32">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span>Progress</span>
                          <span>{item.progress}%</span>
                        </div>
                        <Progress value={item.progress} className="h-2" />
                      </div>
                    )}
                    <Badge variant={item.status === 'proses' ? 'default' : 'secondary'}>
                      {item.status === 'proses' ? 'Sedang Diproses' : 'Menunggu'}
                    </Badge>
                    <Button variant="outline" size="sm">
                      <Eye className="mr-2 h-4 w-4" />
                      {item.status === 'proses' ? 'Lanjutkan' : 'Mulai Grading'}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="history" className="space-y-4 mt-4">
          {gradingHistory.map((item) => {
            const total = item.hasil.gradeA + item.hasil.gradeB + item.hasil.gradeC + item.hasil.reject
            
            return (
              <Card key={item.id}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-lg">{item.komoditas}</CardTitle>
                        <Badge variant="outline">{item.batchCode}</Badge>
                      </div>
                      <CardDescription>
                        {item.jumlah} {item.satuan} - Grading: {item.tanggalGrading}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">QC Score</p>
                      <p className={`text-2xl font-bold ${item.qcScore >= 90 ? 'text-emerald-500' : item.qcScore >= 80 ? 'text-amber-500' : 'text-destructive'}`}>
                        {item.qcScore}%
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm font-medium mb-3">Hasil Grading</p>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-emerald-500" />
                            <span className="text-sm">Grade A</span>
                          </div>
                          <span className="text-sm font-medium">{item.hasil.gradeA} kg ({((item.hasil.gradeA / total) * 100).toFixed(0)}%)</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-blue-500" />
                            <span className="text-sm">Grade B</span>
                          </div>
                          <span className="text-sm font-medium">{item.hasil.gradeB} kg ({((item.hasil.gradeB / total) * 100).toFixed(0)}%)</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-amber-500" />
                            <span className="text-sm">Grade C</span>
                          </div>
                          <span className="text-sm font-medium">{item.hasil.gradeC} kg ({((item.hasil.gradeC / total) * 100).toFixed(0)}%)</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full bg-destructive" />
                            <span className="text-sm">Reject</span>
                          </div>
                          <span className="text-sm font-medium">{item.hasil.reject} kg ({((item.hasil.reject / total) * 100).toFixed(0)}%)</span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium mb-3">Parameter QC</p>
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(item.parameters).map(([key, value]) => (
                          <div key={key} className="flex items-center gap-2 text-sm">
                            {key.includes('air') && <Droplets className="h-4 w-4 text-blue-500" />}
                            {key.includes('suhu') && <Thermometer className="h-4 w-4 text-amber-500" />}
                            {!key.includes('air') && !key.includes('suhu') && <CheckCircle2 className="h-4 w-4 text-muted-foreground" />}
                            <span className="text-muted-foreground capitalize">{key.replace(/([A-Z])/g, ' $1')}: </span>
                            <span className="font-medium">{value}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </TabsContent>
      </Tabs>
    </div>
  )
}
