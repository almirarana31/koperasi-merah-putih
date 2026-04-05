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
    nama: 'NATIONAL MARKET DENSITY REPORT',
    deskripsi: 'Audit komprehensif densitas pasar, anomali harga, dan efisiensi serapan nasional.',
    frekuensi: 'DAILY 06:00 WIB',
    template: 'EXECUTIVE AUDIT',
    recipients: 'STRATEGIC.UNIT@KEMENTERIAN.GO.ID',
    status: 'ACTIVE',
    lastGenerated: 'TODAY 06:00',
  },
  {
    nama: 'AGGREGATE SUPPLY-DEMAND FORECAST',
    deskripsi: 'Proyeksi ketahanan pangan 3 bulan kedepan berdasarkan data AI antar-provinsi.',
    frekuensi: 'WEEKLY (MON) 08:00 WIB',
    template: 'FORECAST MODEL V5',
    recipients: 'PLANNING.DIV@KEMENTERIAN.GO.ID',
    status: 'ACTIVE',
    lastGenerated: '30 MAR 2026',
  },
  {
    nama: 'COOPERATIVE PERFORMANCE INDEX',
    deskripsi: 'Ranking efisiensi dan kepatuhan audit 35.000+ koperasi unit desa (KUD).',
    frekuensi: 'MONTHLY (EOM)',
    template: 'COMPLIANCE DEEP-DIVE',
    recipients: 'AUDIT.INTERNAL@KEMENTERIAN.GO.ID',
    status: 'ACTIVE',
    lastGenerated: '31 MAR 2026',
  },
]

const reportTemplates = [
  {
    nama: 'STRATEGIC BRIEF',
    deskripsi: '1 halaman ringkasan KPI kritis untuk level Menteri.',
    sections: ['TOP NATIONAL METRICS', 'RISK HEATMAP', 'IMMEDIATE INTERVENTIONS'],
    icon: ShieldCheck,
  },
  {
    nama: 'EXECUTIVE SUMMARY',
    deskripsi: 'Laporan 5-10 halaman dengan visualisasi trend & forecast.',
    sections: ['PROVINCIAL PERFORMANCE', 'COMMODITY FLOW', 'LOGISTICS EFFICIENCY', 'ROI ANALYSIS'],
    icon: BarChart3,
  },
  {
    nama: 'REGULATORY COMPLIANCE',
    deskripsi: 'Laporan audit teknis untuk kepatuhan standar nasional.',
    sections: ['COLD CHAIN INTEGRITY', 'CONTRACTUAL AUDIT', 'MEMBER WELFARE INDEX', 'SYSTEM HEALTH'],
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
    { label: 'REPORTS GENERATED', value: Math.floor(452 * scaleFactor), icon: FileText, color: 'text-blue-600' },
    { label: 'AUTO-DISTRIBUTION', value: '98%', icon: Send, color: 'text-emerald-600' },
    { label: 'DATA INTEGRITY', value: '99.9%', icon: ShieldCheck, color: 'text-indigo-600' },
    { label: 'SYSTEM UPTIME', value: '24/7', icon: Clock, color: 'text-emerald-500' },
  ]

  return (
    <div className="flex flex-col gap-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black tracking-tighter text-slate-900 uppercase">
              NATIONAL REPORTING CENTER
            </h1>
            <p className="text-[10px] font-bold tracking-widest text-slate-500 uppercase">
              GENERASI LAPORAN OTOMATIS BERBASIS AI & AUDIT REAL-TIME
            </p>
          </div>
          <Button className="bg-slate-900 hover:bg-slate-800 text-[9px] font-black uppercase tracking-widest h-8 px-4">
            <Plus className="mr-2 h-3.5 w-3.5" /> NEW AUTOMATION
          </Button>
        </div>

        <KementerianFilterBar filters={filters} setFilters={setFilters} />
      </div>

      {/* STATS GRID */}
      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="border-none bg-white shadow-sm">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className={`h-8 w-8 rounded-lg bg-slate-50 flex items-center justify-center`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-[9px] font-black tracking-widest text-slate-500 uppercase">{stat.label}</p>
                  <p className="text-lg font-black tracking-tight text-slate-900">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
        {/* ACTIVE AUTOMATIONS */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
            <History className="h-4 w-4 text-slate-900" />
            <h2 className="text-xs font-black tracking-widest text-slate-900 uppercase">ACTIVE AUTOMATIONS</h2>
          </div>

          <div className="flex flex-col gap-3">
            {activeReports.map((item) => (
              <Card key={item.nama} className="border-none shadow-sm overflow-hidden group">
                <div className="h-1 w-full bg-slate-100 group-hover:bg-emerald-500 transition-colors" />
                <CardHeader className="p-4 pb-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className="mt-1 h-5 w-5 rounded-md bg-slate-900 flex items-center justify-center shrink-0">
                        <FileText className="h-3 w-3 text-white" />
                      </div>
                      <div className="space-y-1">
                        <CardTitle className="text-[11px] font-black tracking-widest text-slate-900 uppercase leading-tight">
                          {item.nama}
                        </CardTitle>
                        <CardDescription className="text-[9px] font-bold text-slate-500 uppercase leading-relaxed max-w-md">
                          {item.deskripsi}
                        </CardDescription>
                      </div>
                    </div>
                    <Badge className="text-[8px] font-black bg-emerald-100 text-emerald-700 tracking-widest uppercase">
                      {item.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-2">
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-3 bg-slate-50 rounded border border-slate-100 mb-4">
                    <div>
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">FREQUENCY</p>
                      <p className="text-[10px] font-black text-slate-900 mt-0.5 uppercase">{item.frekuensi}</p>
                    </div>
                    <div>
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">TEMPLATE</p>
                      <p className="text-[10px] font-black text-slate-900 mt-0.5 uppercase">{item.template}</p>
                    </div>
                    <div className="lg:col-span-2">
                      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">DISTRIBUTION</p>
                      <p className="text-[10px] font-black text-slate-900 mt-0.5 truncate uppercase">{item.recipients}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                    <div className="flex items-center gap-2">
                      <Clock className="h-3 w-3 text-slate-400" />
                      <span className="text-[9px] font-black text-slate-400 uppercase">LAST GENERATED: {item.lastGenerated}</span>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="h-7 text-[8px] font-black uppercase tracking-widest border-slate-200">
                        <Download className="mr-1.5 h-3 w-3" /> EXPORT PDF
                      </Button>
                      <Button size="sm" variant="outline" className="h-7 text-[8px] font-black uppercase tracking-widest border-slate-200">
                        <Mail className="mr-1.5 h-3 w-3" /> PUSH NOW
                      </Button>
                      <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-slate-400 hover:text-slate-900">
                        <Settings2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* REPORT TEMPLATES */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
            <Filter className="h-4 w-4 text-slate-900" />
            <h2 className="text-xs font-black tracking-widest text-slate-900 uppercase">SYSTEM TEMPLATES</h2>
          </div>

          <div className="grid gap-3">
            {reportTemplates.map((template) => (
              <Card key={template.nama} className="border-none shadow-sm hover:border-emerald-500/50 hover:border transition-all">
                <CardHeader className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-slate-900 flex items-center justify-center">
                      <template.icon className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-[10px] font-black tracking-widest text-slate-900 uppercase">{template.nama}</CardTitle>
                      <CardDescription className="text-[8px] font-bold text-slate-500 uppercase">{template.deskripsi}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <div className="space-y-2 mb-4">
                    {template.sections.map((section) => (
                      <div key={section} className="flex items-center gap-2">
                        <div className="h-1 w-1 rounded-full bg-emerald-500" />
                        <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">{section}</span>
                      </div>
                    ))}
                  </div>
                  <Button className="w-full h-8 text-[9px] font-black uppercase tracking-widest border-slate-200" variant="outline">
                    DEPLOY TEMPLATE
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="border-none bg-slate-900 text-white shadow-xl overflow-hidden relative">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <FileText className="h-24 w-24" />
            </div>
            <CardHeader className="p-6">
              <CardTitle className="text-[12px] font-black tracking-widest uppercase">CUSTOM REPORT BUILDER</CardTitle>
              <CardDescription className="text-[9px] font-bold text-slate-400 uppercase">CONSTRUCT ADVANCED AUDIT PARAMETERS</CardDescription>
            </CardHeader>
            <CardContent className="p-6 pt-0 space-y-4">
              <div className="space-y-3">
                <div className="space-y-1">
                  <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">QUERY DATA SOURCE</p>
                  <div className="flex gap-2 p-2 bg-slate-800 rounded border border-slate-700 text-[10px] font-bold">
                    SELECT national_kpi FROM kopdes_audit WHERE anomaly_score {'>'} 0.85
                  </div>
                </div>
                <Button className="w-full bg-emerald-500 hover:bg-emerald-400 text-white text-[9px] font-black uppercase tracking-widest h-9">
                  GENERATE CUSTOM QUERY
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
