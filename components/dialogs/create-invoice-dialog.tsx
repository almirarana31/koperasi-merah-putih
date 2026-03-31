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
import { FileText, Plus, Trash2 } from 'lucide-react'
import type { DialogSaveProps } from '@/components/dialogs/types'

export function CreateInvoiceDialog({ open, onOpenChange, onSave }: DialogSaveProps) {
  const [formData, setFormData] = useState({
    customer: '',
    dueDate: '',
    paymentTerms: '30',
    notes: '',
  })

  const [items, setItems] = useState([
    { id: 1, description: '', quantity: '', price: '', subtotal: 0 }
  ])

  const addItem = () => {
    setItems([...items, { id: Date.now(), description: '', quantity: '', price: '', subtotal: 0 }])
  }

  const removeItem = (id: number) => {
    if (items.length > 1) setItems(items.filter(item => item.id !== id))
  }

  const updateItem = (id: number, field: string, value: string) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value }
        if (field === 'quantity' || field === 'price') {
          updated.subtotal = (parseFloat(updated.quantity) || 0) * (parseFloat(updated.price) || 0)
        }
        return updated
      }
      return item
    }))
  }

  const total = items.reduce((sum, item) => sum + item.subtotal, 0)
  const tax = total * 0.11 // 11% PPN
  const grandTotal = total + tax

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.customer || items.some(item => !item.description)) {
      toast.error('Please fill in all required fields')
      return
    }

    const invoiceData = {
      ...formData,
      items,
      total,
      tax,
      grandTotal,
      id: `INV${Date.now().toString().slice(-8)}`,
      status: 'Unpaid',
      createdAt: new Date().toISOString(),
    }

    onSave?.(invoiceData)
    toast.success('Invoice created successfully!')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <FileText className="h-5 w-5 text-purple-600" />
            Create Invoice
          </DialogTitle>
          <DialogDescription>Generate an invoice for customer orders</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="customer">Customer *</Label>
              <Select value={formData.customer} onValueChange={(value) => setFormData({ ...formData, customer: value })}>
                <SelectTrigger id="customer">
                  <SelectValue placeholder="Select customer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PT Retail Nusantara">PT Retail Nusantara</SelectItem>
                  <SelectItem value="CV Sumber Makmur">CV Sumber Makmur</SelectItem>
                  <SelectItem value="Toko Berkah Jaya">Toko Berkah Jaya</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input id="dueDate" type="date" value={formData.dueDate} onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="paymentTerms">Payment Terms (days)</Label>
              <Select value={formData.paymentTerms} onValueChange={(value) => setFormData({ ...formData, paymentTerms: value })}>
                <SelectTrigger id="paymentTerms">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Cash</SelectItem>
                  <SelectItem value="7">Net 7</SelectItem>
                  <SelectItem value="30">Net 30</SelectItem>
                  <SelectItem value="60">Net 60</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">Invoice Items *</Label>
              <Button type="button" variant="outline" size="sm" onClick={addItem}>
                <Plus className="h-4 w-4 mr-1" />
                Add Item
              </Button>
            </div>

            <div className="space-y-3 max-h-[300px] overflow-y-auto">
              {items.map((item) => (
                <Card key={item.id} className="border-2">
                  <CardContent className="p-3">
                    <div className="grid grid-cols-12 gap-2 items-end">
                      <div className="col-span-5 space-y-1">
                        <Label className="text-xs">Description</Label>
                        <Input className="h-9" placeholder="Item description" value={item.description} onChange={(e) => updateItem(item.id, 'description', e.target.value)} />
                      </div>
                      <div className="col-span-2 space-y-1">
                        <Label className="text-xs">Qty</Label>
                        <Input className="h-9" type="number" placeholder="0" value={item.quantity} onChange={(e) => updateItem(item.id, 'quantity', e.target.value)} />
                      </div>
                      <div className="col-span-3 space-y-1">
                        <Label className="text-xs">Price (Rp)</Label>
                        <Input className="h-9" type="number" placeholder="0" value={item.price} onChange={(e) => updateItem(item.id, 'price', e.target.value)} />
                      </div>
                      <div className="col-span-2 flex items-center justify-between">
                        <Badge variant="secondary" className="text-xs">Rp {item.subtotal.toLocaleString('id-ID')}</Badge>
                        {items.length > 1 && (
                          <Button type="button" variant="ghost" size="icon" className="h-7 w-7" onClick={() => removeItem(item.id)}>
                            <Trash2 className="h-3 w-3 text-red-500" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="bg-slate-50 dark:bg-slate-900 border-2">
              <CardContent className="p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span className="font-semibold">Rp {total.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax (PPN 11%)</span>
                  <span className="font-semibold">Rp {tax.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-2 border-t">
                  <span>Grand Total</span>
                  <span className="text-purple-600">Rp {grandTotal.toLocaleString('id-ID')}</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea id="notes" placeholder="Payment instructions, terms, etc..." rows={2} value={formData.notes} onChange={(e) => setFormData({ ...formData, notes: e.target.value })} />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white">
              <FileText className="h-4 w-4 mr-1" />
              Create Invoice
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
