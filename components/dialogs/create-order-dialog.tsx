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
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { ShoppingCart, Plus, Minus, Trash2, Package } from 'lucide-react'
import type { DialogSaveProps } from '@/components/dialogs/types'

export function CreateOrderDialog({ open, onOpenChange, onSave }: DialogSaveProps) {
  const [orderItems, setOrderItems] = useState([
    { id: 1, commodity: '', quantity: '', price: '', subtotal: 0 }
  ])
  const [formData, setFormData] = useState({
    buyer: '',
    deliveryDate: '',
    deliveryAddress: '',
    paymentMethod: 'transfer',
    notes: '',
  })

  const addItem = () => {
    setOrderItems([...orderItems, { 
      id: Date.now(), 
      commodity: '', 
      quantity: '', 
      price: '', 
      subtotal: 0 
    }])
  }

  const removeItem = (id: number) => {
    if (orderItems.length > 1) {
      setOrderItems(orderItems.filter(item => item.id !== id))
    }
  }

  const updateItem = (id: number, field: string, value: string) => {
    setOrderItems(orderItems.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value }
        if (field === 'quantity' || field === 'price') {
          const qty = parseFloat(updated.quantity) || 0
          const price = parseFloat(updated.price) || 0
          updated.subtotal = qty * price
        }
        return updated
      }
      return item
    }))
  }

  const totalAmount = orderItems.reduce((sum, item) => sum + item.subtotal, 0)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.buyer || orderItems.some(item => !item.commodity || !item.quantity)) {
      toast.error('Please fill in all required fields')
      return
    }

    const orderData = {
      ...formData,
      items: orderItems,
      totalAmount,
      id: `ORD${Date.now().toString().slice(-8)}`,
      status: 'Pending',
      createdAt: new Date().toISOString(),
    }

    onSave?.(orderData)
    toast.success('Order created successfully!')
    onOpenChange(false)
    
    // Reset form
    setOrderItems([{ id: 1, commodity: '', quantity: '', price: '', subtotal: 0 }])
    setFormData({
      buyer: '',
      deliveryDate: '',
      deliveryAddress: '',
      paymentMethod: 'transfer',
      notes: '',
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-blue-600" />
            Create New Order
          </DialogTitle>
          <DialogDescription>
            Create a sales order for buyers
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="buyer">Buyer/Customer *</Label>
              <Select 
                value={formData.buyer} 
                onValueChange={(value) => setFormData({ ...formData, buyer: value })}
              >
                <SelectTrigger id="buyer">
                  <SelectValue placeholder="Select buyer" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PT Retail Nusantara">PT Retail Nusantara</SelectItem>
                  <SelectItem value="CV Sumber Makmur">CV Sumber Makmur</SelectItem>
                  <SelectItem value="Toko Berkah Jaya">Toko Berkah Jaya</SelectItem>
                  <SelectItem value="Pasar Modern">Pasar Modern</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="deliveryDate">Delivery Date *</Label>
              <Input
                id="deliveryDate"
                type="date"
                value={formData.deliveryDate}
                onChange={(e) => setFormData({ ...formData, deliveryDate: e.target.value })}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="deliveryAddress">Delivery Address</Label>
              <Textarea
                id="deliveryAddress"
                placeholder="Complete delivery address..."
                rows={2}
                value={formData.deliveryAddress}
                onChange={(e) => setFormData({ ...formData, deliveryAddress: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-base font-semibold">Order Items *</Label>
              <Button type="button" variant="outline" size="sm" onClick={addItem}>
                <Plus className="h-4 w-4 mr-1" />
                Add Item
              </Button>
            </div>

            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
              {orderItems.map((item, index) => (
                <Card key={item.id} className="border-2">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-3">
                        <div className="md:col-span-2 space-y-1">
                          <Label className="text-xs">Commodity</Label>
                          <Select 
                            value={item.commodity} 
                            onValueChange={(value) => updateItem(item.id, 'commodity', value)}
                          >
                            <SelectTrigger className="h-9">
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Padi">Padi (Rice)</SelectItem>
                              <SelectItem value="Jagung">Jagung (Corn)</SelectItem>
                              <SelectItem value="Kedelai">Kedelai (Soybean)</SelectItem>
                              <SelectItem value="Cabai">Cabai (Chili)</SelectItem>
                              <SelectItem value="Tomat">Tomat (Tomato)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Quantity (kg)</Label>
                          <Input
                            type="number"
                            placeholder="0"
                            className="h-9"
                            value={item.quantity}
                            onChange={(e) => updateItem(item.id, 'quantity', e.target.value)}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs">Price/kg (Rp)</Label>
                          <Input
                            type="number"
                            placeholder="0"
                            className="h-9"
                            value={item.price}
                            onChange={(e) => updateItem(item.id, 'price', e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="flex flex-col items-end gap-2 pt-5">
                        <Badge variant="secondary" className="text-xs">
                          Rp {item.subtotal.toLocaleString('id-ID')}
                        </Badge>
                        {orderItems.length > 1 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 text-red-500 hover:text-red-600 hover:bg-red-50"
                            onClick={() => removeItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="bg-slate-50 dark:bg-slate-900 border-2">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-semibold">Total Amount</span>
                  <span className="text-2xl font-bold text-blue-600">
                    Rp {totalAmount.toLocaleString('id-ID')}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <SelectItem value="transfer">Bank Transfer</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                  <SelectItem value="credit">Credit (Tempo)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Input
                id="notes"
                placeholder="Additional notes..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
              <Package className="h-4 w-4 mr-1" />
              Create Order
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
