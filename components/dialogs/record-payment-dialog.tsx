import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { CreditCard, CheckCircle2 } from 'lucide-react'

export function RecordPaymentDialog({ open, onOpenChange, onSave }) {
  const [formData, setFormData] = useState({
    invoiceId: '',
    amount: '',
    paymentDate: new Date().toISOString().split('T')[0],
    paymentMethod: 'transfer',
    reference: '',
    notes: '',
  })

  const invoices = [
    { id: 'INV001', customer: 'PT Retail Nusantara', amount: 15000000, outstanding: 15000000 },
    { id: 'INV002', customer: 'CV Sumber Makmur', amount: 8500000, outstanding: 8500000 },
    { id: 'INV003', customer: 'Toko Berkah Jaya', amount: 12000000, outstanding: 6000000 },
  ]

  const selectedInvoice = invoices.find(inv => inv.id === formData.invoiceId)
  const paymentAmount = parseFloat(formData.amount) || 0
  const remainingBalance = selectedInvoice ? selectedInvoice.outstanding - paymentAmount : 0

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.invoiceId || !formData.amount) {
      toast.error('Please fill in all required fields')
      return
    }

    if (paymentAmount > (selectedInvoice?.outstanding || 0)) {
      toast.error('Payment amount exceeds outstanding balance')
      return
    }

    const paymentData = {
      ...formData,
      id: `PAY${Date.now().toString().slice(-8)}`,
      status: remainingBalance <= 0 ? 'Paid' : 'Partial',
      remainingBalance,
      createdAt: new Date().toISOString(),
    }

    onSave?.(paymentData)
    toast.success('Payment recorded successfully!')
    onOpenChange(false)
    
    setFormData({
      invoiceId: '',
      amount: '',
      paymentDate: new Date().toISOString().split('T')[0],
      paymentMethod: 'transfer',
      reference: '',
      notes: '',
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-emerald-600" />
            Record Payment
          </DialogTitle>
          <DialogDescription>
            Record a payment received from customers
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="invoiceId">Invoice *</Label>
              <Select value={formData.invoiceId} onValueChange={(value) => setFormData({ ...formData, invoiceId: value })}>
                <SelectTrigger id="invoiceId">
                  <SelectValue placeholder="Select invoice" />
                </SelectTrigger>
                <SelectContent>
                  {invoices.map((inv) => (
                    <SelectItem key={inv.id} value={inv.id}>
                      {inv.id} - {inv.customer} (Outstanding: Rp {inv.outstanding.toLocaleString('id-ID')})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedInvoice && (
              <Card className="md:col-span-2 bg-slate-50 dark:bg-slate-900 border-2">
                <CardContent className="p-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Customer</p>
                      <p className="font-semibold">{selectedInvoice.customer}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Invoice Amount</p>
                      <p className="font-semibold">Rp {selectedInvoice.amount.toLocaleString('id-ID')}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Outstanding Balance</p>
                      <p className="font-bold text-orange-600">Rp {selectedInvoice.outstanding.toLocaleString('id-ID')}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Status</p>
                      <Badge variant="outline" className="bg-orange-100 text-orange-700">Unpaid</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="space-y-2">
              <Label htmlFor="amount">Payment Amount (Rp) *</Label>
              <Input
                id="amount"
                type="number"
                placeholder="e.g., 5000000"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              />
              {selectedInvoice && paymentAmount > 0 && (
                <p className="text-xs text-muted-foreground">
                  Remaining: Rp {remainingBalance.toLocaleString('id-ID')}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="paymentDate">Payment Date *</Label>
              <Input
                id="paymentDate"
                type="date"
                value={formData.paymentDate}
                onChange={(e) => setFormData({ ...formData, paymentDate: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="paymentMethod">Payment Method</Label>
              <Select value={formData.paymentMethod} onValueChange={(value) => setFormData({ ...formData, paymentMethod: value })}>
                <SelectTrigger id="paymentMethod">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="transfer">Bank Transfer</SelectItem>
                  <SelectItem value="check">Check</SelectItem>
                  <SelectItem value="card">Credit/Debit Card</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reference">Reference Number</Label>
              <Input
                id="reference"
                placeholder="e.g., TRF-2026-001"
                value={formData.reference}
                onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Payment notes..."
                rows={2}
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>
          </div>

          {selectedInvoice && paymentAmount > 0 && (
            <Card className={`border-2 ${
              remainingBalance <= 0 
                ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900' 
                : 'bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900'
            }`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Payment Status</p>
                    <p className={`text-lg font-bold ${
                      remainingBalance <= 0 ? 'text-emerald-600' : 'text-blue-600'
                    }`}>
                      {remainingBalance <= 0 ? 'Fully Paid' : 'Partial Payment'}
                    </p>
                  </div>
                  {remainingBalance <= 0 && (
                    <CheckCircle2 className="h-8 w-8 text-emerald-600" />
                  )}
                </div>
                {remainingBalance > 0 && (
                  <p className="text-sm text-muted-foreground mt-2">
                    Remaining balance: Rp {remainingBalance.toLocaleString('id-ID')}
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white">
              <CreditCard className="h-4 w-4 mr-1" />
              Record Payment
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
