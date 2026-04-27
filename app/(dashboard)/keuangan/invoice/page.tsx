'use client'

import { useState, useMemo } from 'react'
import { useToast } from '@/components/ui/use-toast'
import {
  FileText,
  Plus,
  Download,
  Send,
  CheckCircle2,
  Clock,
  AlertCircle,
  Eye,
  Search,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { DataTable, type DataTableColumn } from '@/components/ui/data-table'
import { useAuth } from '@/lib/auth/use-auth'
import { KementerianFilterBar } from '@/components/dashboard/kementerian-filter-bar'
import { resolveOperationalFilters } from '@/lib/cross-entity-operations'
import type { ScopeFilters } from '@/lib/kementerian-dashboard-data'
import { formatCurrency, formatDate } from '@/lib/data'

const invoiceData = [
  {
    id: 'INV001',
    nomorInvoice: 'INV/2024/02/001',
    tanggal: '2024-02-01',
    jatuhTempo: '2024-02-15',
    buyer: 'Hotel Grand Hyatt',
    orderRef: 'PO-2024-001',
    total: 9250000,
    status: 'lunas',
    tanggalBayar: '2024-02-10',
    provinceId: '32',
  },
  {
    id: 'INV002',
    nomorInvoice: 'INV/2024/02/002',
    tanggal: '2024-02-10',
    jatuhTempo: '2024-02-24',
    buyer: 'Superindo',
    orderRef: 'PO-2024-002',
    total: 20000000,
    status: 'pending',
    provinceId: '32',
  },
  {
    id: 'INV003',
    nomorInvoice: 'INV/2024/02/003',
    tanggal: '2024-02-12',
    jatuhTempo: '2024-02-26',
    buyer: 'Restoran Padang Sederhana',
    orderRef: 'PO-2024-003',
    total: 5025000,
    status: 'dikirim',
    tanggalKirim: '2024-02-13',
    provinceId: '31',
  },
  {
    id: 'INV004',
    nomorInvoice: 'INV/2024/02/004',
    tanggal: '2024-02-14',
    jatuhTempo: '2024-02-28',
    buyer: 'PT Indofood',
    orderRef: 'PO-2024-004',
    total: 11000000,
    status: 'draft',
    provinceId: '31',
  },
  {
    id: 'INV005',
    nomorInvoice: 'INV/2024/01/015',
    tanggal: '2024-01-20',
    jatuhTempo: '2024-02-03',
    buyer: 'CV Eksport Nusantara',
    orderRef: 'PO-2024-005',
    total: 15500000,
    status: 'overdue',
    provinceId: '32',
  },
]

export default function InvoicePage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [filters, setFilters] = useState<ScopeFilters>({
    provinceId: 'all',
    regionId: 'all',
    villageId: 'all',
    cooperativeId: 'all',
    commodityId: 'all',
  })
  const [search, setSearch] = useState('')

  const scopedFilters = resolveOperationalFilters(user, filters)
  const scaleFactor = filters.provinceId === 'all' ? 1 : filters.regionId === 'all' ? 0.3 : 0.1

  const filteredInvoices = useMemo(() => {
    return invoiceData.filter(i => {
      const matchesSearch = i.nomorInvoice.toLowerCase().includes(search.toLowerCase()) || 
                           i.buyer.toLowerCase().includes(search.toLowerCase())
      const matchesScope = filters.provinceId === 'all' || i.provinceId === filters.provinceId
      return matchesSearch && matchesScope
    })
  }, [search, filters])

  const totalInvoices = Math.ceil(filteredInvoices.length * scaleFactor * 50)
  const totalPending = (filteredInvoices.filter(i => i.status === 'pending' || i.status === 'dikirim').reduce((acc, i) => acc + i.total, 0) * scaleFactor * 100)
  const totalOverdue = (filteredInvoices.filter(i => i.status === 'overdue').reduce((acc, i) => acc + i.total, 0) * scaleFactor * 100)
  const totalLunas = (filteredInvoices.filter(i => i.status === 'lunas').reduce((acc, i) => acc + i.total, 0) * scaleFactor * 100)

  type Invoice = (typeof invoiceData)[number]
  const STATUS_BADGE: Record<string, string> = {
    lunas: 'border-success/30 bg-success/10 text-[color:var(--success)]',
    overdue: 'border-destructive/30 bg-destructive/10 text-destructive',
    dikirim: 'border-tertiary/30 bg-[color:var(--dashboard-tertiary-soft)] text-[color:var(--dashboard-tertiary)]',
    pending: 'border-warning/30 bg-warning/10 text-[color:var(--warning)]',
    draft: 'border-border bg-muted text-muted-foreground',
  }
  const STATUS_LABEL: Record<string, string> = {
    lunas: 'Lunas',
    overdue: 'Jatuh tempo',
    dikirim: 'Terkirim',
    pending: 'Pending',
    draft: 'Draft',
  }
  const invoiceColumns: DataTableColumn<Invoice>[] = [
    {
      key: 'nomor',
      header: 'No. Invoice',
      cell: (invoice) => <span className="font-mono text-xs text-muted-foreground">{invoice.nomorInvoice}</span>,
    },
    {
      key: 'buyer',
      header: 'Buyer / Order',
      cell: (invoice) => (
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-foreground">{invoice.buyer}</p>
          <p className="truncate text-xs text-muted-foreground">Ref: {invoice.orderRef}</p>
        </div>
      ),
    },
    {
      key: 'total',
      header: 'Nominal',
      align: 'right',
      cell: (invoice) => <span className="tabular-nums font-medium">{formatCurrency(invoice.total)}</span>,
    },
    {
      key: 'jatuhTempo',
      header: 'Jatuh tempo',
      cell: (invoice) => <span className="text-xs text-muted-foreground">{formatDate(invoice.jatuhTempo)}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      align: 'center',
      cell: (invoice) => (
        <Badge variant="outline" className={STATUS_BADGE[invoice.status]}>
          {STATUS_LABEL[invoice.status]}
        </Badge>
      ),
    },
    {
      key: 'actions',
      header: '',
      align: 'right',
      cell: (invoice) => (
        <div className="flex items-center justify-end gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={(e) => {
              e.stopPropagation()
              toast({ title: 'Detail Audit', description: `Membuka detail invoice ${invoice.nomorInvoice}` })
            }}
            aria-label={`Lihat ${invoice.nomorInvoice}`}
          >
            <Eye className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={(e) => {
              e.stopPropagation()
              toast({ title: 'Ekspor Dokumen', description: `Mengunduh PDF invoice ${invoice.nomorInvoice}` })
            }}
            aria-label={`Unduh ${invoice.nomorInvoice}`}
          >
            <Download className="h-3.5 w-3.5" />
          </Button>
          {invoice.status === 'draft' && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={(e) => {
                e.stopPropagation()
                toast({ title: 'Pusat Pengiriman', description: `Mengirim invoice ${invoice.nomorInvoice}…` })
              }}
              aria-label={`Kirim ${invoice.nomorInvoice}`}
            >
              <Send className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      ),
    },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Invoice Hub Nasional</h1>
          <p className="text-[10px] font-black text-slate-500 mt-1 uppercase tracking-widest leading-relaxed">
            Pemantauan Tagihan Dan Piutang Penjualan Nasional
          </p>
        </div>
        <Button 
          className="bg-slate-900 text-white hover:bg-slate-800 text-[10px] font-black uppercase tracking-widest h-9 px-6 rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] transition-all"
          onClick={() => toast({ title: "Generator Hub", description: "Membuka formulir pembuatan invoice nasional..." })}
        >
          <Plus className="mr-2 h-3.5 w-3.5" />
          Generasi Invoice Baru
        </Button>
      </div>

      <KementerianFilterBar filters={filters} setFilters={setFilters} />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Total Invoice', value: totalInvoices, sub: 'Dokumen Terbit', icon: FileText, tone: 'slate' },
          { label: 'Menunggu Pembayaran', value: formatCurrency(totalPending), sub: `${Math.ceil(filteredInvoices.filter(i => i.status === 'pending' || i.status === 'dikirim').length * scaleFactor * 50)} Invoice Aktif`, icon: Clock, tone: 'amber' },
          { label: 'Piutang Jatuh Tempo', value: formatCurrency(totalOverdue), sub: 'Membutuhkan Tindakan', icon: AlertCircle, tone: 'rose' },
          { label: 'Total Pelunasan', value: formatCurrency(totalLunas), sub: 'Pendapatan Berhasil', icon: CheckCircle2, tone: 'emerald' },
        ].map((stat, i) => (
          <Card key={i} className="border-none bg-white shadow-sm overflow-hidden rounded-none">
            <div className={`h-1 w-full border-t-4 ${
              stat.tone === 'emerald' ? 'border-emerald-500' : 
              stat.tone === 'rose' ? 'border-rose-500' : 
              stat.tone === 'amber' ? 'border-amber-500' : 'border-slate-900'
            }`} />
            <CardHeader className="p-4 pb-2">
              <div className="flex justify-between items-start">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{stat.label}</p>
                <stat.icon className={`h-4 w-4 ${
                  stat.tone === 'emerald' ? 'text-emerald-500' : 
                  stat.tone === 'rose' ? 'text-rose-500' : 
                  stat.tone === 'amber' ? 'text-amber-500' : 'text-slate-900'
                }`} />
              </div>
              <CardTitle className="text-xl font-black text-slate-900 mt-1">{stat.value}</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="text-[10px] font-black text-slate-500 mt-1 uppercase tracking-tighter">{stat.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-none bg-white shadow-sm overflow-hidden rounded-none">
        <div className="h-1 w-full bg-slate-900" />
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari Nomor Invoice Atau Nama Buyer..."
              className="pl-9 h-11 text-[10px] font-black uppercase tracking-widest bg-slate-50 border-slate-100 rounded-none focus-visible:ring-slate-900"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-none bg-white shadow-sm overflow-hidden rounded-none">
        <div className="h-1 w-full bg-slate-900" />
        <CardHeader className="p-6 border-b border-slate-50">
          <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-900">Manifest Invoice Penjualan</CardTitle>
          <CardDescription className="text-[10px] font-bold text-slate-500 uppercase">Audit Transaksi Dan Status Pelunasan</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            data={filteredInvoices}
            columns={invoiceColumns}
            rowKey={(invoice) => invoice.id}
            empty="Tidak ada invoice yang cocok dengan filter."
          />
        </CardContent>
      </Card>
    </div>
  )
}

