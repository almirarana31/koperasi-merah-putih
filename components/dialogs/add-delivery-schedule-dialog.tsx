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
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { Calendar, Clock, MapPin, Repeat } from 'lucide-react'
import type { DialogSaveProps } from '@/components/dialogs/types'

export function AddDeliveryScheduleDialog({ open, onOpenChange, onSave }: DialogSaveProps) {
  const [formData, setFormData] = useState({
    route: '',
    frequency: 'weekly',
    dayOfWeek: '',
    time: '',
    vehicle: '',
    driver: '',
    startDate: '',
    endDate: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.route || !formData.startDate) {
      toast.error('Please fill in all required fields')
      return
    }

    const scheduleData = {
      ...formData,
      id: `SCH${Date.now().toString().slice(-8)}`,
      status: 'Active',
      createdAt: new Date().toISOString(),
    }

    onSave?.(scheduleData)
    toast.success('Delivery schedule created successfully!')
    onOpenChange(false)
    
    // Reset form
    setFormData({
      route: '',
      frequency: 'weekly',
      dayOfWeek: '',
      time: '',
      vehicle: '',
      driver: '',
      startDate: '',
      endDate: '',
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <Calendar className="h-5 w-5 text-emerald-600" />
            Add Delivery Schedule
          </DialogTitle>
          <DialogDescription>
            Create a recurring delivery schedule for regular routes
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="route">Delivery Route *</Label>
              <Select 
                value={formData.route} 
                onValueChange={(value) => setFormData({ ...formData, route: value })}
              >
                <SelectTrigger id="route">
                  <SelectValue placeholder="Select route" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="RT001">RT001 - Subang → Jakarta (150 km)</SelectItem>
                  <SelectItem value="RT002">RT002 - Subang → Bandung (80 km)</SelectItem>
                  <SelectItem value="RT003">RT003 - Subang → Karawang (45 km)</SelectItem>
                  <SelectItem value="RT004">RT004 - Subang → Purwakarta (60 km)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="frequency" className="flex items-center gap-2">
                <Repeat className="h-3 w-3" />
                Frequency *
              </Label>
              <Select 
                value={formData.frequency} 
                onValueChange={(value) => setFormData({ ...formData, frequency: value })}
              >
                <SelectTrigger id="frequency">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="biweekly">Bi-weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.frequency === 'weekly' && (
              <div className="space-y-2">
                <Label htmlFor="dayOfWeek">Day of Week</Label>
                <Select 
                  value={formData.dayOfWeek} 
                  onValueChange={(value) => setFormData({ ...formData, dayOfWeek: value })}
                >
                  <SelectTrigger id="dayOfWeek">
                    <SelectValue placeholder="Select day" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monday">Monday</SelectItem>
                    <SelectItem value="tuesday">Tuesday</SelectItem>
                    <SelectItem value="wednesday">Wednesday</SelectItem>
                    <SelectItem value="thursday">Thursday</SelectItem>
                    <SelectItem value="friday">Friday</SelectItem>
                    <SelectItem value="saturday">Saturday</SelectItem>
                    <SelectItem value="sunday">Sunday</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="time" className="flex items-center gap-2">
                <Clock className="h-3 w-3" />
                Departure Time
              </Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="vehicle">Assigned Vehicle</Label>
              <Select 
                value={formData.vehicle} 
                onValueChange={(value) => setFormData({ ...formData, vehicle: value })}
              >
                <SelectTrigger id="vehicle">
                  <SelectValue placeholder="Select vehicle" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="TRK001">TRK001 - Truck 5 Ton</SelectItem>
                  <SelectItem value="TRK002">TRK002 - Truck 3 Ton</SelectItem>
                  <SelectItem value="VAN001">VAN001 - Van Pickup</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="driver">Assigned Driver</Label>
              <Select 
                value={formData.driver} 
                onValueChange={(value) => setFormData({ ...formData, driver: value })}
              >
                <SelectTrigger id="driver">
                  <SelectValue placeholder="Select driver" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DRV001">Pak Joko</SelectItem>
                  <SelectItem value="DRV002">Pak Andi</SelectItem>
                  <SelectItem value="DRV003">Pak Rudi</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date *</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate">End Date (Optional)</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              />
            </div>
          </div>

          {/* Schedule Preview */}
          {formData.route && formData.frequency && (
            <div className="p-4 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900 rounded-lg">
              <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
                <Calendar className="h-4 w-4 text-emerald-600" />
                Schedule Preview
              </h4>
              <div className="space-y-1 text-sm">
                <p>
                  <span className="text-muted-foreground">Route:</span>{' '}
                  <span className="font-medium">{formData.route}</span>
                </p>
                <p>
                  <span className="text-muted-foreground">Frequency:</span>{' '}
                  <Badge variant="secondary" className="ml-1">
                    {formData.frequency.charAt(0).toUpperCase() + formData.frequency.slice(1)}
                  </Badge>
                </p>
                {formData.dayOfWeek && (
                  <p>
                    <span className="text-muted-foreground">Day:</span>{' '}
                    <span className="font-medium capitalize">{formData.dayOfWeek}</span>
                  </p>
                )}
                {formData.time && (
                  <p>
                    <span className="text-muted-foreground">Time:</span>{' '}
                    <span className="font-medium">{formData.time}</span>
                  </p>
                )}
                <p>
                  <span className="text-muted-foreground">Period:</span>{' '}
                  <span className="font-medium">
                    {formData.startDate} {formData.endDate ? `to ${formData.endDate}` : '(ongoing)'}
                  </span>
                </p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700 text-white">
              <Calendar className="h-4 w-4 mr-1" />
              Create Schedule
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
