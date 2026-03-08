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
import { toast } from 'sonner'
import { ArrowRightLeft, ArrowDownToLine, ArrowUpFromLine, Package } from 'lucide-react'

export function StockMovementDialog({ open, onOpenChange, onSave }) {
  const [formData, setFormData] = useState({
    type: 'in',
    commodity: '',
    quantity: '',
    unit: 'kg',
    warehouse: '',
    source: '',
    destination: '',
    reference: '',
    notes: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.commodity || !formData.quantity || !formData.warehouse) {
      toast.error('Please fill in all required fields')
      return
    }

    const movementData = {
      ...formData,
      id: `MOV${Date.now().toString().slice(-8)}`,
      date: new Date().toISOString(),
      status: 'Completed',
    }

    onSave?.(movementData)
    toast.success(`Stock ${formData.type === 'in' ? 'received' : formData.type === 'out' ? 'dispatched' : 'transferred'} successfully!`)
    onOpenChange(false)
    
    // Reset form
    setFormData({
      type: 'in',
      commodity: '',
      quantity: '',
      unit: 'kg',
      warehouse: '',
      source: '',
      destination: '',
      reference: '',
      notes: '',
    })
  }

  const getTypeIcon = () => {
    switch (formData.type) {
      case 'in': return <ArrowDownToLine className="h-5 w-5 text-emerald-600" />
      case 'out': return <ArrowUpFromLine className="h-5 w-5 text-orange-600" />
      case 'transfer': return <ArrowRightLeft className="h-5 w-5 text-blue-600" />
      default: return <Package className="h-5 w-5" />
    }
  }

  const getTypeLabel = () => {
    switch (formData.type) {
      case 'in': return 'Stock In (Receiving)'
      case 'out': return 'Stock Out (Dispatch)'
      case 'transfer': return 'Stock Transfer'
      default: return 'Stock Movement'
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            {getTypeIcon()}
            Record Stock Movement
          </DialogTitle>
          <DialogDescription>
            Track inventory movements in and out of warehouses
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label htmlFor="type">Movement Type *</Label>
            <Select 
              value={formData.type} 
              onValueChange={(value) => setFormData({ ...formData, type: value })}
            >
              <SelectTrigger id="type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="in">
                  <div className="flex items-center gap-2">
                    <ArrowDownToLine className="h-4 w-4 text-emerald-600" />
                    Stock In (Receiving)
                  </div>
                </SelectItem>
                <SelectItem value="out">
                  <div className="flex items-center gap-2">
                    <ArrowUpFromLine className="h-4 w-4 text-orange-600" />
                    Stock Out (Dispatch)
                  </div>
                </SelectItem>
                <SelectItem value="transfer">
                  <div className="flex items-center gap-2">
                    <ArrowRightLeft className="h-4 w-4 text-blue-600" />
                    Stock Transfer
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="commodity">Commodity *</Label>
              <Select 
                value={formData.commodity} 
                onValueChange={(value) => setFormData({ ...formData, commodity: value })}
              >
                <SelectTrigger id="commodity">
                  <SelectValue placeholder="Select commodity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Padi">Padi (Rice)</SelectItem>
                  <SelectItem value="Jagung">Jagung (Corn)</SelectItem>
                  <SelectItem value="Kedelai">Kedelai (Soybean)</SelectItem>
                  <SelectItem value="Cabai">Cabai (Chili)</SelectItem>
                  <SelectItem value="Tomat">Tomat (Tomato)</SelectItem>
                  <SelectItem value="Kentang">Kentang (Potato)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="warehouse">
                {formData.type === 'transfer' ? 'From Warehouse *' : 'Warehouse *'}
              </Label>
              <Select 
                value={formData.warehouse} 
                onValueChange={(value) => setFormData({ ...formData, warehouse: value })}
              >
                <SelectTrigger id="warehouse">
                  <SelectValue placeholder="Select warehouse" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="WH001">Gudang Pusat Subang</SelectItem>
                  <SelectItem value="WH002">Gudang Karawang</SelectItem>
                  <SelectItem value="WH003">Cold Storage Bandung</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity *</Label>
              <Input
                id="quantity"
                type="number"
                placeholder="e.g., 500"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="unit">Unit</Label>
              <Select 
                value={formData.unit} 
                onValueChange={(value) => setFormData({ ...formData, unit: value })}
              >
                <SelectTrigger id="unit">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="kg">Kilogram (kg)</SelectItem>
                  <SelectItem value="ton">Ton</SelectItem>
                  <SelectItem value="sack">Sack</SelectItem>
                  <SelectItem value="box">Box</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.type === 'in' && (
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="source">Source/Supplier</Label>
                <Input
                  id="source"
                  placeholder="e.g., Kelompok Tani Subur Makmur"
                  value={formData.source}
                  onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                />
              </div>
            )}

            {formData.type === 'out' && (
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="destination">Destination/Customer</Label>
                <Input
                  id="destination"
                  placeholder="e.g., PT Retail Nusantara"
                  value={formData.destination}
                  onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                />
              </div>
            )}

            {formData.type === 'transfer' && (
              <div className="space-y-2">
                <Label htmlFor="destination">To Warehouse</Label>
                <Select 
                  value={formData.destination} 
                  onValueChange={(value) => setFormData({ ...formData, destination: value })}
                >
                  <SelectTrigger id="destination">
                    <SelectValue placeholder="Select destination" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="WH001">Gudang Pusat Subang</SelectItem>
                    <SelectItem value="WH002">Gudang Karawang</SelectItem>
                    <SelectItem value="WH003">Cold Storage Bandung</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="reference">Reference Number (PO/DO/Invoice)</Label>
              <Input
                id="reference"
                placeholder="e.g., PO-2026-03-001"
                value={formData.reference}
                onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                placeholder="Additional information about this movement..."
                rows={3}
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
              Record Movement
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
