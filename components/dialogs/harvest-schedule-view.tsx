import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Clock, 
  MapPin, 
  Sprout,
  Filter,
  Download
} from 'lucide-react'

export function HarvestScheduleView({ open, onOpenChange }) {
  const [view, setView] = useState('Month')
  const [currentDate, setCurrentDate] = useState(new Date(2026, 2, 8)) // March 2026

  const views = ['Day', 'Week', 'Month', 'Year']

  const harvestEvents = [
    { id: 1, title: 'Harvest Padi Ciherang', date: '2026-03-12', location: 'Blok A', color: 'bg-emerald-500' },
    { id: 2, title: 'Harvest Jagung Hybrid', date: '2026-03-15', location: 'Blok B', color: 'bg-orange-500' },
    { id: 3, title: 'Harvest Kedelai', date: '2026-03-22', location: 'Blok C', color: 'bg-yellow-500' },
    { id: 4, title: 'Planting Season Start', date: '2026-03-05', location: 'All Blocks', color: 'bg-blue-500' },
  ]

  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  // Simple calendar grid for March 2026 (Starts on Sunday)
  const calendarDays = Array.from({ length: 31 }, (_, i) => i + 1)

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col p-0">
        <DialogHeader className="p-6 pb-2 border-b">
          <div className="flex justify-between items-center">
            <DialogTitle className="text-xl font-bold flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-emerald-600" />
              Harvest & Activity Schedule
            </DialogTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" className="h-8 gap-1">
                <Filter className="h-3 w-3" /> Filter
              </Button>
              <Button variant="outline" size="sm" className="h-8 gap-1">
                <Download className="h-3 w-3" /> Export
              </Button>
            </div>
          </div>
          
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-4">
              <h3 className="text-lg font-semibold">{months[currentDate.getMonth()]} {currentDate.getFullYear()}</h3>
              <div className="flex items-center border rounded-md">
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-none border-r">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="h-8 rounded-none px-3 text-xs font-medium">
                  Today
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-none border-l">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-lg">
              {views.map((v) => (
                <Button
                  key={v}
                  variant={view === v ? 'secondary' : 'ghost'}
                  size="sm"
                  className={`h-7 px-3 text-xs ${view === v ? 'bg-white dark:bg-slate-900 shadow-sm' : ''}`}
                  onClick={() => setView(v)}
                >
                  {v}
                </Button>
              ))}
            </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50 dark:bg-slate-950/50">
          {view === 'Month' ? (
            <div className="grid grid-cols-7 gap-px bg-slate-200 dark:bg-slate-800 border rounded-xl overflow-hidden shadow-sm">
              {days.map(day => (
                <div key={day} className="bg-white dark:bg-slate-900 p-2 text-center text-[10px] font-bold uppercase text-slate-400">
                  {day}
                </div>
              ))}
              
              {calendarDays.map(day => {
                const dateStr = `2026-03-${day.toString().padStart(2, '0')}`
                const dayEvents = harvestEvents.filter(e => e.date === dateStr)
                const isToday = day === 8
                
                return (
                  <div key={day} className="bg-white dark:bg-slate-900 min-h-[100px] p-2 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    <span className={`text-sm font-medium ${isToday ? 'bg-emerald-600 text-white w-6 h-6 flex items-center justify-center rounded-full' : ''}`}>
                      {day}
                    </span>
                    <div className="mt-1 space-y-1">
                      {dayEvents.map(event => (
                        <div key={event.id} className={`${event.color} text-white text-[9px] px-1.5 py-0.5 rounded shadow-sm flex items-center gap-1 cursor-pointer truncate`}>
                          <Sprout className="h-2 w-2" />
                          {event.title}
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
              
              {/* Fill padding days for April */}
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={`pad-${i}`} className="bg-slate-50 dark:bg-slate-900/50 min-h-[100px] p-2 opacity-50 text-slate-300">
                  {i + 1}
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full text-muted-foreground py-12">
              <Clock className="h-12 w-12 opacity-20 mb-4" />
              <p>{view} view is under development</p>
              <Button variant="link" onClick={() => setView('Month')}>Switch to Month view</Button>
            </div>
          )}
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="border-none shadow-sm bg-white dark:bg-slate-900">
              <CardContent className="p-4">
                <h4 className="text-xs font-bold uppercase text-slate-400 mb-3">Upcoming Highlights</h4>
                <div className="space-y-3">
                  {harvestEvents.slice(0, 3).map(event => (
                    <div key={event.id} className="flex items-center gap-3 p-2 rounded-lg border border-slate-100 dark:border-slate-800 hover:border-emerald-200 dark:hover:border-emerald-900/50 transition-colors cursor-pointer group">
                      <div className={`w-1 h-8 rounded-full ${event.color}`} />
                      <div className="flex-1">
                        <p className="text-sm font-semibold group-hover:text-emerald-600 transition-colors">{event.title}</p>
                        <div className="flex items-center gap-3 mt-0.5 text-[10px] text-muted-foreground">
                          <span className="flex items-center gap-1"><CalendarIcon className="h-2.5 w-2.5" /> {event.date}</span>
                          <span className="flex items-center gap-1"><MapPin className="h-2.5 w-2.5" /> {event.location}</span>
                        </div>
                      </div>
                      <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-emerald-400" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-none shadow-sm bg-white dark:bg-slate-900">
              <CardContent className="p-4">
                <h4 className="text-xs font-bold uppercase text-slate-400 mb-3">Schedule Legend</h4>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-3 h-3 rounded-full bg-emerald-500" />
                    <span>Harvesting</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                    <span>Planting</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-3 h-3 rounded-full bg-orange-500" />
                    <span>Fertilizing</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <span>Maintenance</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <span>Pest Control</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <div className="w-3 h-3 rounded-full bg-slate-400" />
                    <span>General</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="p-4 border-t bg-white dark:bg-slate-900 flex justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Close Schedule</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
