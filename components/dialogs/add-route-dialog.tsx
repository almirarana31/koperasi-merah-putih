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
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { MapPin, Navigation, Plus, X, TrendingUp } from 'lucide-react'

export function AddRouteDialog({ open, onOpenChange, onSave }) {
  const [formData, setFormData] = useState({
    name: '',
    origin: '',
    destination: '',
    distance: '',
    estimatedTime: '',
    tollCost: '',
    fuelCost: '',
    notes: '',
  })

  const [waypoints, setWaypoints] = useState<string[]>([])
  const [newWaypoint, setNewWaypoint] = useState('')

  const addWaypoint = () => {
    if (newWaypoint.trim()) {
      setWaypoints([...waypoints, newWaypoint.trim()])
      setNewWaypoint('')
    }
  }

  const removeWaypoint = (index: number) => {
    setWaypoints(waypoints.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name || !formData.origin || !formData.destination || !formData.distance) {
      toast.error('Please fill in all required fields')
      return
    }

    const totalCost = (parseFloat(formData.tollCost) || 0) + (parseFloat(formData.fuelCost) || 0)

    const routeData = {
      ...formData,
      waypoints,
      totalCost,
      id: `RT${Date.now().toString().slice(-6)}`,
      status: 'Active',
      createdAt: new Date().toISOString(),
    }

    onSave?.(routeData)
    toast.success('Route created successfully!')
    onOpenChange(false)
    
    // Reset form
    setFormData({
      name: '',
      origin: '',
      destination: '',
      distance: '',
      estimatedTime: '',
      tollCost: '',
      fuelCost: '',
      notes: '',
    })
    setWaypoints([])
  }

  const totalCost = (parseFloat(formData.tollCost) || 0) + (parseFloat(formData.fuelCost) || 0)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Navigation className="h-5 w-5 text-orange-600" />
            Add Delivery Route
          </DialogTitle>
          <DialogDescription>
            Define a new delivery route with waypoints and cost estimates
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="name">Route Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Subang - Jakarta Express"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="origin">Origin *</Label>
              <Input
                id="origin"
                placeholder="e.g., Subang, Jawa Barat"
                value={formData.origin}
                onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="destination">Destination *</Label>
              <Input
                id="destination"
                placeholder="e.g., Jakarta Pusat"
                value={formData.destination}
                onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="distance">Distance (km) *</Label>
              <Input
                id="distance"
                type="number"
                placeholder="e.g., 150"
                value={formData.distance}
                onChange={(e) => setFormData({ ...formData, distance: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="estimatedTime">Estimated Time (hours)</Label>
              <Input
                id="estimatedTime"
                type="number"
                step="0.5"
                placeholder="e.g., 3.5"
                value={formData.estimatedTime}
                onChange={(e) => setFormData({ ...formData, estimatedTime: e.target.value })}
              />
            </div>
          </div>

          {/* Waypoints */}
          <Card className="border-2">
            <CardContent className="p-4">
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Waypoints (Optional)
              </h3>
              
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add waypoint (e.g., Rest Area KM 75)"
                    value={newWaypoint}
                    onChange={(e) => setNewWaypoint(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addWaypoint())}
                  />
                  <Button type="button" variant="outline" size="icon" onClick={addWaypoint}>
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                {waypoints.length > 0 && (
                  <div className="space-y-2">
                    {waypoints.map((waypoint, index) => (
                      <div key={index} className="flex items-center gap-2 p-2 bg-slate-50 dark:bg-slate-900 rounded-lg">
                        <MapPin className="h-3 w-3 text-slate-400" />
                        <span className="flex-1 text-sm">{waypoint}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => removeWaypoint(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Cost Estimates */}
          <Card className="border-2">
            <CardContent className="p-4">
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Cost Estimates
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tollCost">Toll Cost (Rp)</Label>
                  <Input
                    id="tollCost"
                    type="number"
                    placeholder="e.g., 75000"
                    value={formData.tollCost}
                    onChange={(e) => setFormData({ ...formData, tollCost: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="fuelCost">Estimated Fuel Cost (Rp)</Label>
                  <Input
                    id="fuelCost"
                    type="number"
                    placeholder="e.g., 200000"
                    value={formData.fuelCost}
                    onChange={(e) => setFormData({ ...formData, fuelCost: e.target.value })}
                  />
                </div>
              </div>

              {totalCost > 0 && (
                <div className="mt-4 p-3 bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Total Estimated Cost</span>
                    <span className="text-lg font-bold text-orange-600">
                      Rp {totalCost.toLocaleString('id-ID')}
                    </span>
                  </div>
                  {formData.distance && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Cost per km: Rp {(totalCost / parseFloat(formData.distance)).toLocaleString('id-ID', { maximumFractionDigits: 0 })}
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Route Notes</Label>
            <Textarea
              id="notes"
              placeholder="Road conditions, traffic patterns, recommended stops, etc..."
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-orange-600 hover:bg-orange-700 text-white">
              <Navigation className="h-4 w-4 mr-1" />
              Create Route
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
