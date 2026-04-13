'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Download, 
  FileText, 
  Mail, 
  Plus, 
  Clock, 
  BarChart3, 
  Globe, 
  ShieldCheck, 
  Filter,
  Send,
  History,
  Settings2
} from 'lucide-react'
import { KementerianFilterBar } from '@/components/dashboard/kementerian-filter-bar'
import { type ScopeFilters } from '@/lib/kementerian-dashboard-data'

const activeReports = [
  {
    nama: 'Laporan Densitas Pasar Nasional',
    deskripsi: 'Audit komprehensif densitas pasar, anomali harga, dan efisiensi serapan nasional.',
    frekuensi: 'HARIAN 06:00 WIB',
    template: 'AUDIT EKSEKUTIF',
    recipients: 'STRATEGIC.UNIT@KEMENTERIAN.GO.ID',
    status: 'AKTIF',
    lastGenerated: 'HARI INI 06:00',
  },
  {
    nama: 'Prakiraan Agregat Suplai-Permintaan',
    deskripsi: 'Proyeksi ketahanan pangan 3 bulan kedepan berdasarkan data AI antar-provinsi.',
    frekuensi: 'MINGGUAN (SEN) 08:00 WIB',
    template: 'MODEL PRAKIRAAN V5',
    recipients: 'PLANNING.DIV@KEMENTERIAN.GO.ID',
    status: 'AKTIF',
    lastGenerated: '30 MAR 2026',
  },
  {
    nama: 'Indeks Performa Koperasi',
    deskripsi: 'Ranking efisiensi dan kepatuhan audit 35.000+ koperasi unit desa (KUD).',
    frekuensi: 'BULANAN (AKHIR BULAN)',
    template: 'BEDAH KEPATUHAN',
    recipients: 'AUDIT.INTERNAL@KEMENTERIAN.GO.ID',
    status: 'AKTIF',
    lastGenerated: '31 MAR 2026',
  },
]

const reportTemplates = [
  {
    nama: 'Brief Strategis',
    deskripsi: '1 halaman ringkasan KPI kritis untuk level Menteri.',
    sections: ['METRIK NASIONAL TERATAS', 'PETA PANAS RISIKO', 'INTERVENSI SEGERA'],
    icon: ShieldCheck,
  },
  {
    nama: 'Ringkasan Eksekutif',
    deskripsi: 'Laporan 5-10 halaman dengan visualisasi tren & prakiraan.',
    sections: ['PERFORMA PROVINSI', 'ALUR KOMODITAS', 'EFISIENSI LOGISTIK', 'ANALISIS ROI'],
    icon: BarChart3,
  },
  {
    nama: 'Kepatuhan Regulasi',
    deskripsi: 'Laporan audit teknis untuk kepatuhan standar nasional.',
    sections: ['INTEGRITAS COLD CHAIN', 'AUDIT KONTRAKTUAL', 'INDEKS KESEJAHTERAAN ANGGOTA', 'KESEHATAN SISTEM'],
    icon: Globe,
  },
]

export default function LaporanOtomatisPage() {
  const [filters, setFilters] = useState<ScopeFilters>({
    provinceId: 'all',
    regionId: 'all',
    villageId: 'all',
    cooperativeId: 'all',
    commodityId: 'all',
  })

  const scaleFactor = filters.provinceId === 'all' ? 1 : filters.regionId === 'all' ? 0.3 : 0.1

  const stats = [
    { label: 'Laporan Dibuat', value: Math.floor(452 * scaleFactor), icon: FileText, color: 'text-blue-600', tone: 'blue' },
    { label: 'Distribusi Otomatis', value: '98%', icon: Send, color: 'text-emerald-600', tone: 'emerald' },
    { label: 'Integritas Data', value: '99.9%', icon: ShieldCheck, color: 'text-indigo-600', tone: 'blue' },
    { label: 'Waktu Aktif Sistem', value: '24/7', icon: Clock, color: 'text-emerald-500', tone: 'emerald' },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Pusat Pelaporan Nasional</h1>
          <p className="text-[10px] font-black text-slate-500 mt-1 uppercase tracking-widest leading-relaxed">
            Generasi Laporan Otomatis Berbasis AI & Audit Real-Time • Integritas Data Terjamin
          </p>
        </div>
        <Button className="h-9 bg-slate-900 text-white hover:bg-slate-800 text-[10px] font-black uppercase tracking-widest px-6 rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] transition-all">
          <Plus className="mr-2 h-4 w-4" /> Otomasi Baru
        </Button>
      </div>

      <KementerianFilterBar filters={filters} setFilters={setFilters} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s, i) => (
          <Card key={i} className="border-none shadow-sm bg-white overflow-hidden rounded-none">
             <div className={`h-1 w-full ${
              s.tone === 'emerald' ? 'bg-emerald-500' : 'bg-blue-500'
            }`} />
            <CardContent className="p-4 flex items-center gap-4">
              <div className="h-10 w-10 rounded-none bg-slate-50 flex items-center justify-center shrink-0 shadow-inner">
                <s.icon className={`h-5 w-5 ${s.color}`} />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">{s.label}</p>
                <span className="text-sm font-black text-slate-900 leading-tight">{s.value}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
            <History className="h-4 w-4 text-slate-900" />
            <h2 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Otomasi Aktif</h2>
          </div>

          <div className="flex flex-col gap-3">
            {activeReports.map((item) => (
              <Card key={item.nama} className="border-none shadow-sm bg-white overflow-hidden group rounded-none">
                <div className="h-1 w-full bg-slate-100 group-hover:bg-blue-600 transition-colors" />
                <CardHeader className="p-4 pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className="mt-1 h-8 w-8 bg-slate-900 flex items-center justify-center shrink-0">
                        <FileText className="h-4 w-4 text-white" />
                      </div>
                      <div className="space-y-1">
                        <CardTitle className="text-sm font-black text-slate-900 uppercase tracking-tight">
                          {item.nama}
                        </CardTitle>
                        <CardDescription className="text-[10px] font-bold text-slate-400 uppercase leading-relaxed tracking-widest max-w-md mt-1">
                          {item.deskripsi}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge className="text-[8px] font-black uppercase tracking-widest bg-emerald-100 text-emerald-700 rounded-none">
                      {item.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-2">
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-slate-50 border border-slate-100 mb-4">
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Frekuensi</p>
                      <p className="text-[10px] font-black text-slate-900 mt-1 uppercase">{item.frekuensi}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Template</p>
                      <p className="text-[10px] font-black text-slate-900 mt-1 uppercase">{item.template}</p>
                    </div>
                    <div className="lg:col-span-2">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Distribusi</p>
                      <p className="text-[10px] font-black text-slate-900 mt-1 truncate uppercase">{item.recipients}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Clock className="h-3 w-3" />
                      <span className="text-[9px] font-black uppercase tracking-widest">Terakhir Dibuat: {item.lastGenerated}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="h-7 text-[9px] font-black uppercase tracking-widest border-slate-200 text-slate-600 rounded-none hover:bg-slate-50">
                        <Download className="mr-1.5 h-3 w-3" /> Ekspor PDF
                      </Button>
                      <Button size="sm" variant="outline" className="h-7 text-[9px] font-black uppercase tracking-widest border-slate-200 text-slate-600 rounded-none hover:bg-slate-50">
                        <Mail className="mr-1.5 h-3 w-3" /> Push Sekarang
                      </Button>
                      <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-slate-300 hover:text-slate-900 rounded-none">
                        <Settings2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
            <Filter className="h-4 w-4 text-slate-900" />
            <h2 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Template Sistem</h2>
          </div>

          <div className="grid gap-3">
            {reportTemplates.map((template) => (
              <Card key={template.nama} className="border-none shadow-sm bg-white hover:border-blue-500/50 hover:border transition-all rounded-none overflow-hidden group">
                <CardHeader className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-slate-900 flex items-center justify-center shrink-0">
                      <template.icon className="h-5 w-5 text-white" />
                    </div>
                    <div className="space-y-1">
                      <CardTitle className="text-[10px] font-black text-slate-900 uppercase tracking-tight">{template.nama}</CardTitle>
                      <CardDescription className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{template.deskripsi}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="space-y-2 mb-4 p-3 bg-slate-50 border border-slate-100">
                    {template.sections.map((section) => (
                      <div key={section} className="flex items-center gap-2">
                        <div className="h-1 w-1 bg-emerald-500" />
                        <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{section}</span>
                      </div>
                    ))}
                  </div>
                  <Button className="w-full h-8 bg-transparent border border-slate-200 text-slate-600 hover:bg-slate-50 text-[9px] font-black uppercase tracking-widest rounded-none" variant="outline">
                    Gunakan Template
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="border-none bg-slate-950 text-white shadow-xl overflow-hidden relative rounded-none">
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <FileText className="h-24 w-24" />
            </div>
            <CardHeader className="p-6 border-b border-white/5 bg-slate-900/50">
              <CardTitle className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                Pembangun Laporan Kustom
              </CardTitle>
              <CardDescription className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mt-1">Konstruksi Parameter Audit Lanjutan</CardDescription>
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              <div className="space-y-3">
                <div className="space-y-2">
                  <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Kueri Sumber Data</p>
                  <div className="p-3 bg-slate-900 border border-white/10 text-[10px] font-bold font-mono text-blue-400">
                    SELECT national_kpi FROM kopdes_audit WHERE anomaly_score {'>'} 0.85
                  </div>
                </div>
                <Button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-black uppercase tracking-widest h-10 rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]">
                  Buat Kueri Kustom
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
