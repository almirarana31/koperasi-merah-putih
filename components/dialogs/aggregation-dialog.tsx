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
import { Card, CardContent } from '@/components/ui/card'
import { toast } from 'sonner'
import { 
  Package, 
  Users, 
  Calendar, 
  Weight, 
  TrendingUp,
  Plus,
  X,
  CheckCircle2
} from 'lucide-react'

export function AggregationDialog({ open, onOpenChange, onSave }) {
  const [formData, setFormData] = useState({
    commodity: '',
    targetQuantity: '',
    deadline: '',
    minQuality: 'A',
    pricePerKg: '',
    notes: '',
  })

  const [selectedFarmers, setSelectedFarmers] = useState<string[]>([])

  const availableFarmers = [
    { id: '1', name: 'Budi Santoso', location: 'Subang', available: '500 kg' },
    { id: '2', name: 'Siti Aminah', location: 'Karawang', available: '350 kg' },
    { id: '3', name: 'Ahmad Yani', location: 'Purwakarta', available: '420 kg' },
    { id: '4', name: 'Dewi Lestari', location: 'Bandung Barat', available: '280 kg' },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.commodity || !formData.targetQuantity || !formData.deadline) {
      toast.error('Please fill in all required fields')
      return
    }

    if (selectedFarmers.length === 0) {
      toast.error('Please select at least one farmer')
      return
    }

    const aggregationData = {
      ...formData,
      farmers: selectedFarmers,
      status: 'Active',
      createdAt: new Date().toISOString(),
    }

    onSave?.(aggregationData)
    toast.success('Aggregation created successfully!')
    onOpenChange(false)
    
    // Reset form
    setFormData({
      commodity: '',
      targetQuantity: '',
      deadline: '',
      minQuality: 'A',
      pricePerKg: '',
      notes: '',
    })
    setSelectedFarmers([])
  }

  const toggleFarmer = (farmerId: string) => {
    setSelectedFarmers(prev => 
      prev.includes(farmerId) 
        ? prev.filter(id => id !== farmerId)
        : [...prev, farmerId]
    )
  }

  const totalAvailable = selectedFarmers.reduce((sum, id) => {
    const farmer = availableFarmers.find(f => f.id === id)
    return sum + (farmer ? parseInt(farmer.available) : 0)
  }, 0)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Package className="h-5 w-5 text-emerald-600" />
            Create New Aggregation
          </DialogTitle>
          <DialogDescription>
            Collect produce from multiple farmers to meet buyer demand
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
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
              <Label htmlFor="targetQuantity">Target Quantity (kg) *</Label>
              <Input
                id="targetQuantity"
                type="number"
                placeholder="e.g., 1500"
                value={formData.targetQuantity}
                onChange={(e) => setFormData({ ...formData, targetQuantity: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="deadline">Deadline *</Label>
              <Input
                id="deadline"
                type="date"
                value={formData.deadline}
                onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="minQuality">Minimum Quality Grade</Label>
              <Select 
                value={formData.minQuality} 
                onValueChange={(value) => setFormData({ ...formData, minQuality: value })}
              >
                <SelectTrigger id="minQuality">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A">Grade A (Premium)</SelectItem>
                  <SelectItem value="B">Grade B (Standard)</SelectItem>
                  <SelectItem value="C">Grade C (Economy)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="pricePerKg">Price per Kg (Rp)</Label>
              <Input
                id="pricePerKg"
                type="number"
                placeholder="e.g., 8500"
                value={formData.pricePerKg}
                onChange={(e) => setFormData({ ...formData, pricePerKg: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Select Participating Farmers *
              </Label>
              <Badge variant="secondary" className="text-xs">
                {selectedFarmers.length} selected
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[200px] overflow-y-auto p-1">
              {availableFarmers.map(farmer => (
                <Card 
                  key={farmer.id}
                  className={`cursor-pointer transition-all hover:shadow-md ${
                    selectedFarmers.includes(farmer.id) 
                      ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/20' 
                      : 'border-slate-200 dark:border-slate-800'
                  }`}
                  onClick={() => toggleFarmer(farmer.id)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-semibold text-sm">{farmer.name}</p>
                        <p className="text-xs text-muted-foreground">{farmer.location}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Weight className="h-3 w-3 text-emerald-600" />
                          <span className="text-xs font-medium text-emerald-600">{farmer.available}</span>
                        </div>
                      </div>
                      {selectedFarmers.includes(farmer.id) && (
                        <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {selectedFarmers.length > 0 && (
              <Card className="bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="h-4 w-4 text-emerald-600" />
                      <span className="text-sm font-medium">Total Available from Selected Farmers</span>
                    </div>
                    <span className="text-lg font-bold text-emerald-600">{totalAvailable} kg</span>
                  </div>
                  {formData.targetQuantity && (
                    <div className="mt-2 text-xs text-muted-foreground">
                      {totalAvailable >= parseInt(formData.targetQuantity) ? (
                        <span className="text-emerald-600 font-medium">✓ Target quantity can be met</span>
                      ) : (
                        <span className="text-orange-600 font-medium">⚠ Need {parseInt(formData.targetQuantity) - totalAvailable} kg more</span>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Additional requirements, delivery instructions, etc."
              rows={3}
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white">
              <Plus className="h-4 w-4 mr-1" />
              Create Aggregation
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
