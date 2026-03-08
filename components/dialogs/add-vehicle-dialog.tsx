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
import { Truck, Calendar, Wrench, Fuel, Plus } from 'lucide-react'

export function AddVehicleDialog({ open, onOpenChange, onSave }) {
  const [formData, setFormData] = useState({
    type: 'truck',
    licensePlate: '',
    brand: '',
    model: '',
    year: '',
    capacity: '',
    fuelType: 'diesel',
    fuelConsumption: '',
    lastMaintenance: '',
    nextMaintenance: '',
    insurance: '',
    insuranceExpiry: '',
    notes: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.licensePlate || !formData.brand || !formData.capacity) {
      toast.error('Please fill in all required fields')
      return
    }

    const vehicleData = {
      ...formData,
      id: `VEH${Date.now().toString().slice(-6)}`,
      status: 'Available',
      createdAt: new Date().toISOString(),
      totalDistance: 0,
      totalTrips: 0,
    }

    onSave?.(vehicleData)
    toast.success('Vehicle registered successfully!')
    onOpenChange(false)
    
    // Reset form
    setFormData({
      type: 'truck',
      licensePlate: '',
      brand: '',
      model: '',
      year: '',
      capacity: '',
      fuelType: 'diesel',
      fuelConsumption: '',
      lastMaintenance: '',
      nextMaintenance: '',
      insurance: '',
      insuranceExpiry: '',
      notes: '',
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Truck className="h-5 w-5 text-blue-600" />
            Register New Vehicle
          </DialogTitle>
          <DialogDescription>
            Add a new vehicle to the fleet for delivery operations
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <Truck className="h-4 w-4" />
              Vehicle Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Vehicle Type *</Label>
                <Select 
                  value={formData.type} 
                  onValueChange={(value) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger id="type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="truck">Truck</SelectItem>
                    <SelectItem value="van">Van</SelectItem>
                    <SelectItem value="pickup">Pickup</SelectItem>
                    <SelectItem value="motorcycle">Motorcycle</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="licensePlate">License Plate *</Label>
                <Input
                  id="licensePlate"
                  placeholder="e.g., B 1234 XYZ"
                  value={formData.licensePlate}
                  onChange={(e) => setFormData({ ...formData, licensePlate: e.target.value.toUpperCase() })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="brand">Brand *</Label>
                <Input
                  id="brand"
                  placeholder="e.g., Mitsubishi"
                  value={formData.brand}
                  onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="model">Model</Label>
                <Input
                  id="model"
                  placeholder="e.g., Colt Diesel FE 74"
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  type="number"
                  placeholder="e.g., 2020"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="capacity">Capacity (tons) *</Label>
                <Input
                  id="capacity"
                  type="number"
                  step="0.5"
                  placeholder="e.g., 5"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Fuel Information */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <Fuel className="h-4 w-4" />
              Fuel Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fuelType">Fuel Type</Label>
                <Select 
                  value={formData.fuelType} 
                  onValueChange={(value) => setFormData({ ...formData, fuelType: value })}
                >
                  <SelectTrigger id="fuelType">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="diesel">Diesel</SelectItem>
                    <SelectItem value="gasoline">Gasoline</SelectItem>
                    <SelectItem value="electric">Electric</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="fuelConsumption">Fuel Consumption (km/L)</Label>
                <Input
                  id="fuelConsumption"
                  type="number"
                  step="0.1"
                  placeholder="e.g., 8.5"
                  value={formData.fuelConsumption}
                  onChange={(e) => setFormData({ ...formData, fuelConsumption: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Maintenance */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <Wrench className="h-4 w-4" />
              Maintenance Schedule
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="lastMaintenance">Last Maintenance</Label>
                <Input
                  id="lastMaintenance"
                  type="date"
                  value={formData.lastMaintenance}
                  onChange={(e) => setFormData({ ...formData, lastMaintenance: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="nextMaintenance">Next Maintenance</Label>
                <Input
                  id="nextMaintenance"
                  type="date"
                  value={formData.nextMaintenance}
                  onChange={(e) => setFormData({ ...formData, nextMaintenance: e.target.value })}
                />
              </div>
            </div>

            {formData.nextMaintenance && new Date(formData.nextMaintenance) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) && (
              <div className="p-3 bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900 rounded-lg">
                <p className="text-sm text-orange-700 dark:text-orange-400 flex items-center gap-2">
                  <Wrench className="h-4 w-4" />
                  Maintenance due soon! Schedule service within 7 days.
                </p>
              </div>
            )}
          </div>

          {/* Insurance */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Insurance Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="insurance">Insurance Provider</Label>
                <Input
                  id="insurance"
                  placeholder="e.g., Asuransi Jasa Indonesia"
                  value={formData.insurance}
                  onChange={(e) => setFormData({ ...formData, insurance: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="insuranceExpiry">Insurance Expiry</Label>
                <Input
                  id="insuranceExpiry"
                  type="date"
                  value={formData.insuranceExpiry}
                  onChange={(e) => setFormData({ ...formData, insuranceExpiry: e.target.value })}
                />
              </div>
            </div>

            {formData.insuranceExpiry && new Date(formData.insuranceExpiry) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) && (
              <div className="p-3 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 rounded-lg">
                <p className="text-sm text-red-700 dark:text-red-400 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Insurance expiring soon! Renew within 30 days.
                </p>
              </div>
            )}
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              placeholder="Special features, modifications, known issues, etc..."
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
              <Plus className="h-4 w-4 mr-1" />
              Register Vehicle
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
