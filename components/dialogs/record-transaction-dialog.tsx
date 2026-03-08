import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { DollarSign, TrendingUp, TrendingDown, Calendar, FileText } from 'lucide-react'

export function RecordTransactionDialog({ open, onOpenChange, onSave }) {
  const [formData, setFormData] = useState({
    type: 'income',
    category: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'cash',
    reference: '',
    description: '',
    relatedTo: '',
  })

  const incomeCategories = [
    'Penjualan Produk',
    'Iuran Anggota',
    'Subsidi Pemerintah',
    'Investasi',
    'Lain-lain',
  ]

  const expenseCategories = [
    'Pembelian Bahan',
    'Gaji Karyawan',
    'Operasional',
    'Transportasi',
    'Utilitas',
    'Pemeliharaan',
    'Lain-lain',
  ]

  const categories = formData.type === 'income' ? incomeCategories : expenseCategories

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.category || !formData.amount || !formData.date) {
      toast.error('Please fill in all required fields')
      return
    }

    const transactionData = {
      ...formData,
      id: `TRX${Date.now().toString().slice(-8)}`,
      status: 'Completed',
      createdAt: new Date().toISOString(),
    }

    onSave?.(transactionData)
    toast.success(`${formData.type === 'income' ? 'Income' : 'Expense'} recorded successfully!`)
    onOpenChange(false)
    
    // Reset form
    setFormData({
      type: 'income',
      category: '',
      amount: '',
      date: new Date().toISOString().split('T')[0],
      paymentMethod: 'cash',
      reference: '',
      description: '',
      relatedTo: '',
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <DollarSign className="h-5 w-5 text-emerald-600" />
            Record Transaction
          </DialogTitle>
          <DialogDescription>
            Record income or expense transactions for financial tracking
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="type">Transaction Type *</Label>
              <Select 
                value={formData.type} 
                onValueChange={(value) => setFormData({ ...formData, type: value, category: '' })}
              >
                <SelectTrigger id="type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-emerald-600" />
                      Income (Pemasukan)
                    </div>
                  </SelectItem>
                  <SelectItem value="expense">
                    <div className="flex items-center gap-2">
                      <TrendingDown className="h-4 w-4 text-red-600" />
                      Expense (Pengeluaran)
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount (Rp) *</Label>
              <Input
                id="amount"
                type="number"
                placeholder="e.g., 5000000"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              />
              {formData.amount && (
                <p className="text-xs text-muted-foreground">
                  Rp {parseFloat(formData.amount).toLocaleString('id-ID')}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="date" className="flex items-center gap-2">
                <Calendar className="h-3 w-3" />
                Transaction Date *
              </Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="paymentMethod">Payment Method</Label>
              <Select 
                value={formData.paymentMethod} 
                onValueChange={(value) => setFormData({ ...formData, paymentMethod: value })}
              >
                <SelectTrigger id="paymentMethod">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Cash (Tunai)</SelectItem>
                  <SelectItem value="transfer">Bank Transfer</SelectItem>
                  <SelectItem value="check">Check (Cek)</SelectItem>
                  <SelectItem value="credit">Credit (Tempo)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="reference" className="flex items-center gap-2">
                <FileText className="h-3 w-3" />
                Reference Number
              </Label>
              <Input
                id="reference"
                placeholder="e.g., INV-2026-001"
                value={formData.reference}
                onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="relatedTo">Related To (Optional)</Label>
              <Input
                id="relatedTo"
                placeholder="e.g., Order #ORD001, Member M001, etc."
                value={formData.relatedTo}
                onChange={(e) => setFormData({ ...formData, relatedTo: e.target.value })}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Transaction details..."
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </div>

          {/* Transaction Summary */}
          {formData.amount && formData.category && (
            <div className={`p-4 rounded-lg border-2 ${
              formData.type === 'income' 
                ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900' 
                : 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900'
            }`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {formData.type === 'income' ? 'Total Income' : 'Total Expense'}
                  </p>
                  <p className={`text-2xl font-bold ${
                    formData.type === 'income' ? 'text-emerald-600' : 'text-red-600'
                  }`}>
                    {formData.type === 'income' ? '+' : '-'} Rp {parseFloat(formData.amount).toLocaleString('id-ID')}
                  </p>
                </div>
                <Badge variant="outline" className={
                  formData.type === 'income' 
                    ? 'bg-emerald-100 text-emerald-700 border-emerald-300' 
                    : 'bg-red-100 text-red-700 border-red-300'
                }>
                  {formData.category}
                </Badge>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className={
              formData.type === 'income' 
                ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                : 'bg-red-600 hover:bg-red-700 text-white'
            }>
              <DollarSign className="h-4 w-4 mr-1" />
              Record Transaction
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
