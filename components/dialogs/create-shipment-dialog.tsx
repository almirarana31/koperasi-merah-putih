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
import { Truck, Package, MapPin, Calendar, User } from 'lucide-react'
import type { DialogSaveProps } from '@/components/dialogs/types'

export function CreateShipmentDialog({ open, onOpenChange, onSave }: DialogSaveProps) {
  const [formData, setFormData] = useState({
    orderId: '',
    destination: '',
    recipient: '',
    phone: '',
    address: '',
    deliveryDate: '',
    vehicle: '',
    driver: '',
    commodity: '',
    quantity: '',
    notes: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.orderId || !formData.destination || !formData.deliveryDate) {
      toast.error('Please fill in all required fields')
      return
    }

    const shipmentData = {
      ...formData,
      id: `SHP${Date.now().toString().slice(-8)}`,
      status: 'Scheduled',
      createdAt: new Date().toISOString(),
      trackingNumber: `TRK${Date.now().toString().slice(-10)}`,
    }

    onSave?.(shipmentData)
    toast.success('Shipment created successfully!')
    onOpenChange(false)
    
    // Reset form
    setFormData({
      orderId: '',
      destination: '',
      recipient: '',
      phone: '',
      address: '',
      deliveryDate: '',
      vehicle: '',
      driver: '',
      commodity: '',
      quantity: '',
      notes: '',
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Truck className="h-5 w-5 text-blue-600" />
            Create New Shipment
          </DialogTitle>
          <DialogDescription>
            Schedule a delivery shipment for customer orders
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Order Information */}
          <Card className="border-2">
            <CardContent className="p-4">
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Package className="h-4 w-4" />
                Order Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="orderId">Order ID *</Label>
                  <Select 
                    value={formData.orderId} 
                    onValueChange={(value) => setFormData({ ...formData, orderId: value })}
                  >
                    <SelectTrigger id="orderId">
                      <SelectValue placeholder="Select order" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ORD20260308001">ORD20260308001 - PT Retail Nusantara</SelectItem>
                      <SelectItem value="ORD20260308002">ORD20260308002 - CV Sumber Makmur</SelectItem>
                      <SelectItem value="ORD20260308003">ORD20260308003 - Toko Berkah Jaya</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="commodity">Commodity</Label>
                  <Input
                    id="commodity"
                    placeholder="e.g., Beras Premium"
                    value={formData.commodity}
                    onChange={(e) => setFormData({ ...formData, commodity: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity (kg)</Label>
                  <Input
                    id="quantity"
                    type="number"
                    placeholder="e.g., 500"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  />
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
              </div>
            </CardContent>
          </Card>

          {/* Destination Information */}
          <Card className="border-2">
            <CardContent className="p-4">
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Destination Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="destination">Destination City *</Label>
                  <Input
                    id="destination"
                    placeholder="e.g., Jakarta"
                    value={formData.destination}
                    onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="recipient">Recipient Name</Label>
                  <Input
                    id="recipient"
                    placeholder="e.g., Pak Budi"
                    value={formData.recipient}
                    onChange={(e) => setFormData({ ...formData, recipient: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="e.g., 0812-3456-7890"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Delivery Address</Label>
                  <Textarea
                    id="address"
                    placeholder="Complete delivery address..."
                    rows={2}
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Vehicle & Driver */}
          <Card className="border-2">
            <CardContent className="p-4">
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <User className="h-4 w-4" />
                Vehicle & Driver Assignment
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="vehicle">Vehicle</Label>
                  <Select 
                    value={formData.vehicle} 
                    onValueChange={(value) => setFormData({ ...formData, vehicle: value })}
                  >
                    <SelectTrigger id="vehicle">
                      <SelectValue placeholder="Select vehicle" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="TRK001">TRK001 - Truck 5 Ton (B 1234 XYZ)</SelectItem>
                      <SelectItem value="TRK002">TRK002 - Truck 3 Ton (B 5678 ABC)</SelectItem>
                      <SelectItem value="VAN001">VAN001 - Van Pickup (B 9012 DEF)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="driver">Driver</Label>
                  <Select 
                    value={formData.driver} 
                    onValueChange={(value) => setFormData({ ...formData, driver: value })}
                  >
                    <SelectTrigger id="driver">
                      <SelectValue placeholder="Select driver" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="DRV001">Pak Joko - 0812-1111-2222</SelectItem>
                      <SelectItem value="DRV002">Pak Andi - 0813-3333-4444</SelectItem>
                      <SelectItem value="DRV003">Pak Rudi - 0814-5555-6666</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Special Instructions</Label>
            <Textarea
              id="notes"
              placeholder="Handling instructions, delivery notes, etc..."
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
              <Truck className="h-4 w-4 mr-1" />
              Create Shipment
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
