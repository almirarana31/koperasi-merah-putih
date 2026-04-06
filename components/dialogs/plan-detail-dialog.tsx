import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { 
  Calendar, 
  MapPin, 
  Sprout, 
  Droplets, 
  Thermometer, 
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock
} from 'lucide-react'
import type { DialogOpenProps } from '@/components/dialogs/types'

type PlanSummary = {
  commodity?: string
  location?: string
  status?: string
  startDate?: string
  expectedHarvest?: string
  progress?: number
}

type PlanDetailDialogProps = DialogOpenProps & {
  plan?: PlanSummary | null
}

export function PlanDetailDialog({ open, onOpenChange, plan }: PlanDetailDialogProps) {
  if (!plan) return null

  // Mock data for the plan if not fully provided
  const details = {
    commodity: plan.commodity || 'Padi Ciherang',
    location: plan.location || 'Blok Sawah Tengah, Subang',
    status: plan.status || 'Vegetative',
    startDate: plan.startDate || '2026-02-15',
    expectedHarvest: plan.expectedHarvest || '2026-06-10',
    progress: plan.progress || 35,
    health: 'Good',
    soilMoisture: '78%',
    temperature: '28°C',
    activities: [
      { id: 1, title: 'Land Preparation', date: '2026-02-10', status: 'Completed' },
      { id: 2, title: 'Sowing/Planting', date: '2026-02-15', status: 'Completed' },
      { id: 3, title: 'First Fertilization', date: '2026-03-01', status: 'Completed' },
      { id: 4, title: 'Weeding Phase 1', date: '2026-03-15', status: 'Upcoming' },
      { id: 5, title: 'Second Fertilization', date: '2026-04-10', status: 'Upcoming' },
    ]
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
      case 'in progress':
      case 'upcoming': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
      case 'delayed': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
      default: return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-400'
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex justify-between items-start pr-8">
            <div>
              <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                <Sprout className="h-6 w-6 text-emerald-500" />
                Planting Plan: {details.commodity}
              </DialogTitle>
              <DialogDescription className="flex items-center gap-1 mt-1">
                <MapPin className="h-3 w-3" />
                {details.location}
              </DialogDescription>
            </div>
            <Badge variant="outline" className={getStatusColor(details.status)}>
              {details.status}
            </Badge>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <Card className="md:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium flex items-center gap-2">
                <Activity className="h-4 w-4 text-emerald-500" />
                Growth Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-end">
                  <span className="text-2xl font-bold">{details.progress}%</span>
                  <span className="text-xs text-muted-foreground">Day 22 of 115</span>
                </div>
                <Progress value={details.progress} className="h-3 bg-slate-100 dark:bg-slate-800" />
                
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-slate-400" />
                    <div>
                      <p className="text-xs  text-muted-foreground font-semibold">Started</p>
                      <p className="text-sm font-medium">{details.startDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-slate-400" />
                    <div>
                      <p className="text-xs  text-muted-foreground font-semibold">Exp. Harvest</p>
                      <p className="text-sm font-medium">{details.expectedHarvest}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Field Conditions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Droplets className="h-4 w-4 text-blue-500" />
                  <span className="text-xs">Moisture</span>
                </div>
                <span className="text-sm font-bold">{details.soilMoisture}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Thermometer className="h-4 w-4 text-orange-500" />
                  <span className="text-xs">Temp</span>
                </div>
                <span className="text-sm font-bold">{details.temperature}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="h-4 w-4 text-emerald-500" />
                  <span className="text-xs">Health</span>
                </div>
                <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                  {details.health}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-6">
          <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Activity Timeline
          </h3>
          <div className="space-y-3 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100 dark:before:bg-slate-800">
            {details.activities.map((activity) => (
              <div key={activity.id} className="flex gap-4 items-start relative pl-8">
                <div className={`absolute left-0 top-1 w-[24px] h-[24px] rounded-full border-4 border-white dark:border-slate-950 flex items-center justify-center z-10 ${
                  activity.status === 'Completed' ? 'bg-emerald-500 text-white' : 'bg-slate-200 dark:bg-slate-700'
                }`}>
                  {activity.status === 'Completed' ? (
                    <CheckCircle2 className="h-3 w-3" />
                  ) : (
                    <div className="h-2 w-2 rounded-full bg-slate-400" />
                  )}
                </div>
                <div className="flex-1 bg-slate-50 dark:bg-slate-900 p-3 rounded-lg border border-slate-100 dark:border-slate-800">
                  <div className="flex justify-between items-center">
                    <p className={`text-sm font-semibold ${activity.status === 'Completed' ? '' : 'text-slate-500'}`}>
                      {activity.title}
                    </p>
                    <Badge variant="secondary" className="text-xs h-5">
                      {activity.date}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {activity.status === 'Completed' ? 'Successfully performed on schedule.' : 'Scheduled activity.'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
          <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">Edit Plan</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
