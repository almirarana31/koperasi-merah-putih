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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
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

  const totalInvoices = Math.ceil(filteredInvoices.length * scaleFactor)
  const totalPending = (filteredInvoices.filter(i => i.status === 'pending' || i.status === 'dikirim').reduce((acc, i) => acc + i.total, 0) * scaleFactor)
  const totalOverdue = (filteredInvoices.filter(i => i.status === 'overdue').reduce((acc, i) => acc + i.total, 0) * scaleFactor)
  const totalLunas = (filteredInvoices.filter(i => i.status === 'lunas').reduce((acc, i) => acc + i.total, 0) * scaleFactor)

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-slate-900">INVOICE HUB</h1>
          <p className="text-xs font-bold text-slate-500 mt-1 uppercase tracking-widest">
            MONITORING TAGIHAN DAN PIUTANG PENJUALAN NASIONAL
          </p>
        </div>
        <Button 
          className="bg-slate-900 text-white hover:bg-slate-800 text-[10px] font-black uppercase tracking-widest h-9 px-6 rounded-none shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] transition-all"
          onClick={() => toast({ title: "Generator Hub", description: "Membuka formulir pembuatan invoice nasional..." })}
        >
          <Plus className="mr-2 h-3.5 w-3.5" />
          GENERASI INVOICE BARU
        </Button>
      </div>

      <KementerianFilterBar filters={filters} setFilters={setFilters} />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'TOTAL INVOICE', value: totalInvoices, sub: 'DOKUMEN TERBIT', icon: FileText, tone: 'slate' },
          { label: 'WAITING PAYMENT', value: formatCurrency(totalPending), sub: `${Math.ceil(filteredInvoices.filter(i => i.status === 'pending' || i.status === 'dikirim').length * scaleFactor)} INVOICE AKTIF`, icon: Clock, tone: 'amber' },
          { label: 'OVERDUE PIUTANG', value: formatCurrency(totalOverdue), sub: 'MEMBUTUHKAN TINDAKAN', icon: AlertCircle, tone: 'rose' },
          { label: 'TOTAL PELUNASAN', value: formatCurrency(totalLunas), sub: 'SUCCESSFUL REVENUE', icon: CheckCircle2, tone: 'emerald' },
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
              <CardTitle className="text-lg font-black text-slate-900 mt-1">{stat.value}</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <p className="text-[10px] font-bold text-slate-500 mt-1 uppercase tracking-tighter">{stat.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-none bg-white shadow-sm overflow-hidden">
        <div className="h-1 w-full bg-slate-900" />
        <CardContent className="p-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="CARI NOMOR INVOICE ATAU NAMA BUYER..."
              className="pl-9 h-10 text-xs font-semibold bg-slate-50 border-slate-100 rounded-none focus-visible:ring-slate-900"
            />
          </div>
        </CardContent>
      </Card>

      <Card className="border-none bg-white shadow-sm overflow-hidden">
        <div className="h-1 w-full bg-slate-900" />
        <CardHeader className="p-6 border-b border-slate-50">
          <CardTitle className="text-sm font-black uppercase tracking-widest text-slate-900">MANIFEST INVOICE PENJUALAN</CardTitle>
          <CardDescription className="text-[10px] font-bold text-slate-500 uppercase">AUDIT TRANSAKSI DAN STATUS PELUNASAN</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-slate-900">
              <TableRow className="hover:bg-slate-900 border-none">
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400 h-10 px-6">NO. INVOICE</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400 h-10 px-6">BUYER / ORDER</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400 h-10 px-6 text-right">NOMINAL</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400 h-10 px-6">JATUH TEMPO</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400 h-10 px-6 text-center">STATUS</TableHead>
                <TableHead className="text-[10px] font-black uppercase tracking-widest text-slate-400 h-10 px-6 text-right">AKSI</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredInvoices.map((invoice) => (
                <TableRow key={invoice.id} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors group">
                  <TableCell className="px-6 py-4 font-mono text-[10px] font-black text-slate-500">{invoice.nomorInvoice}</TableCell>
                  <TableCell className="px-6 py-4">
                    <div>
                      <p className="text-xs font-black text-slate-900 uppercase tracking-tight">{invoice.buyer}</p>
                      <p className="text-[10px] font-bold text-slate-400 mt-0.5 uppercase">REF: {invoice.orderRef}</p>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right">
                    <p className="text-xs font-black text-slate-900">{formatCurrency(invoice.total)}</p>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <p className="text-[10px] font-bold text-slate-500 uppercase">{formatDate(invoice.jatuhTempo)}</p>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-center">
                    <Badge className={`text-[10px] font-black border-none px-2 h-5 uppercase rounded-none ${
                      invoice.status === 'lunas' ? 'bg-emerald-100 text-emerald-700' :
                      invoice.status === 'overdue' ? 'bg-rose-100 text-rose-700' :
                      invoice.status === 'dikirim' ? 'bg-blue-100 text-blue-700' :
                      invoice.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {invoice.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 rounded-none group-hover:bg-white group-hover:shadow-sm"
                        onClick={() => toast({ title: "Audit Detail", description: `Membuka detail invoice ${invoice.nomorInvoice}` })}
                      >
                        <Eye className="h-3.5 w-3.5" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 rounded-none group-hover:bg-white group-hover:shadow-sm"
                        onClick={() => toast({ title: "Export Document", description: `Mengunduh file PDF invoice ${invoice.nomorInvoice}` })}
                      >
                        <Download className="h-3.5 w-3.5" />
                      </Button>
                      {invoice.status === 'draft' && (
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 rounded-none group-hover:bg-white group-hover:shadow-sm"
                          onClick={() => toast({ title: "Dispatch Hub", description: `Mengirim invoice ${invoice.nomorInvoice} ke buyer...` })}
                        >
                          <Send className="h-3.5 w-3.5" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

