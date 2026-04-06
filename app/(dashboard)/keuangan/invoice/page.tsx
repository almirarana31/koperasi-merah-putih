'use client'

import {
  FileText,
  Plus,
  Download,
  Send,
  CheckCircle2,
  Clock,
  AlertCircle,
  Eye,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
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
  },
]

export default function InvoicePage() {
  const totalPending = invoiceData.filter(i => i.status === 'pending' || i.status === 'dikirim').reduce((acc, i) => acc + i.total, 0)
  const totalOverdue = invoiceData.filter(i => i.status === 'overdue').reduce((acc, i) => acc + i.total, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold ">Invoice</h1>
          <p className="text-muted-foreground">Manajemen invoice penjualan</p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Buat Invoice
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Invoice</CardDescription>
            <CardTitle className="text-3xl">{invoiceData.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">Bulan ini</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Menunggu Pembayaran</CardDescription>
            <CardTitle className="text-3xl">{formatCurrency(totalPending)}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1 text-xs text-amber-500">
              <Clock className="h-3 w-3" />
              {invoiceData.filter(i => i.status === 'pending' || i.status === 'dikirim').length} invoice
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Overdue</CardDescription>
            <CardTitle className="text-3xl text-destructive">{formatCurrency(totalOverdue)}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1 text-xs text-destructive">
              <AlertCircle className="h-3 w-3" />
              {invoiceData.filter(i => i.status === 'overdue').length} invoice
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Lunas Bulan Ini</CardDescription>
            <CardTitle className="text-3xl text-emerald-500">
              {formatCurrency(invoiceData.filter(i => i.status === 'lunas').reduce((acc, i) => acc + i.total, 0))}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-1 text-xs text-emerald-500">
              <CheckCircle2 className="h-3 w-3" />
              Terbayar
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Daftar Invoice</CardTitle>
          <CardDescription>Semua invoice penjualan</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>No. Invoice</TableHead>
                <TableHead>Tanggal</TableHead>
                <TableHead>Buyer</TableHead>
                <TableHead>Ref. Order</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead>Jatuh Tempo</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Aksi</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoiceData.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell className="font-medium">{invoice.nomorInvoice}</TableCell>
                  <TableCell>{formatDate(invoice.tanggal)}</TableCell>
                  <TableCell>{invoice.buyer}</TableCell>
                  <TableCell>
                    <Badge variant="outline">{invoice.orderRef}</Badge>
                  </TableCell>
                  <TableCell className="text-right font-semibold">{formatCurrency(invoice.total)}</TableCell>
                  <TableCell>{formatDate(invoice.jatuhTempo)}</TableCell>
                  <TableCell>
                    <Badge variant={
                      invoice.status === 'lunas' ? 'default' :
                      invoice.status === 'overdue' ? 'destructive' :
                      invoice.status === 'dikirim' ? 'default' :
                      'secondary'
                    } className={
                      invoice.status === 'lunas' ? 'bg-emerald-500/10 text-emerald-500' :
                      invoice.status === 'dikirim' ? 'bg-blue-500/10 text-blue-500' :
                      ''
                    }>
                      {invoice.status === 'lunas' ? 'Lunas' :
                       invoice.status === 'pending' ? 'Pending' :
                       invoice.status === 'dikirim' ? 'Terkirim' :
                       invoice.status === 'draft' ? 'Draft' :
                       'Overdue'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Download className="h-4 w-4" />
                      </Button>
                      {invoice.status === 'draft' && (
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Send className="h-4 w-4" />
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
