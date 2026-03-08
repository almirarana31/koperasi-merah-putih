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
import { Warehouse, MapPin, Thermometer, Droplets, Plus } from 'lucide-react'

export function AddWarehouseDialog({ open, onOpenChange, onSave }) {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    capacity: '',
    type: 'cold',
    temperature: '',
    humidity: '',
    manager: '',
    phone: '',
    address: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.location || !formData.capacity) {
      toast.error('Please fill in all required fields')
      return
    }

    const warehouseData = {
      ...formData,
      id: `WH${Date.now().toString().slice(-6)}`,
      status: 'Active',
      currentStock: 0,
      createdAt: new Date().toISOString(),
    }

    onSave?.(warehouseData)
    toast.success('Warehouse added successfully!')
    onOpenChange(false)
    
    // Reset form
    setFormData({
      name: '',
      location: '',
      capacity: '',
      type: 'cold',
      temperature: '',
      humidity: '',
      manager: '',
      phone: '',
      address: '',
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Warehouse className="h-5 w-5 text-blue-600" />
            Add New Warehouse
          </DialogTitle>
          <DialogDescription>
            Register a new storage facility for agricultural products
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="name">Warehouse Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Gudang Pusat Subang"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                placeholder="e.g., Subang, Jawa Barat"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="capacity">Capacity (tons) *</Label>
              <Input
                id="capacity"
                type="number"
                placeholder="e.g., 500"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Storage Type</Label>
              <Select 
                value={formData.type} 
                onValueChange={(value) => setFormData({ ...formData, type: value })}
              >
                <SelectTrigger id="type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cold">Cold Storage</SelectItem>
                  <SelectItem value="dry">Dry Storage</SelectItem>
                  <SelectItem value="controlled">Climate Controlled</SelectItem>
                  <SelectItem value="open">Open Storage</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="manager">Manager Name</Label>
              <Input
                id="manager"
                placeholder="e.g., Pak Budi"
                value={formData.manager}
                onChange={(e) => setFormData({ ...formData, manager: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="temperature" className="flex items-center gap-1">
                <Thermometer className="h-3 w-3" />
                Temperature (°C)
              </Label>
              <Input
                id="temperature"
                type="number"
                placeholder="e.g., 4"
                value={formData.temperature}
                onChange={(e) => setFormData({ ...formData, temperature: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="humidity" className="flex items-center gap-1">
                <Droplets className="h-3 w-3" />
                Humidity (%)
              </Label>
              <Input
                id="humidity"
                type="number"
                placeholder="e.g., 85"
                value={formData.humidity}
                onChange={(e) => setFormData({ ...formData, humidity: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Contact Phone</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="e.g., 0812-3456-7890"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">Full Address</Label>
              <Textarea
                id="address"
                placeholder="Complete warehouse address..."
                rows={3}
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="h-4 w-4 mr-1" />
              Add Warehouse
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
