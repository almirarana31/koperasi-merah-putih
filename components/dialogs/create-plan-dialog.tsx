"use client"

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'

interface CreatePlanDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd?: (plan: any) => void
}

export function CreatePlanDialog({ open, onOpenChange, onAdd }: CreatePlanDialogProps) {
  const [formData, setFormData] = useState({
    commodity: '',
    targetArea: 0,
    targetProduction: 0,
    plantingDate: '',
    estimatedHarvest: '',
    season: '',
    notes: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const newPlan = {
      id: `PLAN-${Date.now()}`,
      ...formData,
      createdAt: new Date().toISOString(),
      status: 'planned',
    }

    onAdd?.(newPlan)
    toast.success('Rencana tanam berhasil dibuat')
    onOpenChange(false)
    
    // Reset form
    setFormData({
      commodity: '',
      targetArea: 0,
      targetProduction: 0,
      plantingDate: '',
      estimatedHarvest: '',
      season: '',
      notes: '',
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Buat Rencana Tanam</DialogTitle>
          <DialogDescription>
            Rencanakan jadwal tanam dan target produksi
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="commodity">Komoditas *</Label>
                <Select
                  value={formData.commodity}
                  onValueChange={(value) => setFormData({ ...formData, commodity: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih komoditas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="padi">Padi</SelectItem>
                    <SelectItem value="jagung">Jagung</SelectItem>
                    <SelectItem value="cabai">Cabai Merah</SelectItem>
                    <SelectItem value="tomat">Tomat</SelectItem>
                    <SelectItem value="kentang">Kentang</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="season">Musim *</Label>
                <Select
                  value={formData.season}
                  onValueChange={(value) => setFormData({ ...formData, season: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih musim" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hujan">Musim Hujan</SelectItem>
                    <SelectItem value="kemarau">Musim Kemarau</SelectItem>
                    <SelectItem value="sepanjang_tahun">Sepanjang Tahun</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="targetArea">Target Luas Tanam (ha) *</Label>
                <Input
                  id="targetArea"
                  type="number"
                  step="0.1"
                  min="0"
                  value={formData.targetArea}
                  onChange={(e) => setFormData({ ...formData, targetArea: parseFloat(e.target.value) || 0 })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="targetProduction">Target Produksi (kg) *</Label>
                <Input
                  id="targetProduction"
                  type="number"
                  min="0"
                  value={formData.targetProduction}
                  onChange={(e) => setFormData({ ...formData, targetProduction: parseInt(e.target.value) || 0 })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="plantingDate">Tanggal Tanam *</Label>
                <Input
                  id="plantingDate"
                  type="date"
                  value={formData.plantingDate}
                  onChange={(e) => setFormData({ ...formData, plantingDate: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="estimatedHarvest">Estimasi Panen *</Label>
                <Input
                  id="estimatedHarvest"
                  type="date"
                  value={formData.estimatedHarvest}
                  onChange={(e) => setFormData({ ...formData, estimatedHarvest: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Catatan</Label>
              <Textarea
                id="notes"
                placeholder="Catatan tambahan, varietas, teknik budidaya..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button type="submit">
              Buat Rencana
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
