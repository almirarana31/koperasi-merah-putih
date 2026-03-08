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
import { toast } from 'sonner'

interface AddGroupDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd?: (group: any) => void
}

export function AddGroupDialog({ open, onOpenChange, onAdd }: AddGroupDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    village: '',
    chairman: '',
    memberCount: 0,
    mainCommodity: '',
    description: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const newGroup = {
      id: `GRP-${Date.now()}`,
      ...formData,
      createdAt: new Date().toISOString(),
      status: 'active',
    }

    onAdd?.(newGroup)
    toast.success(`Kelompok ${formData.name} berhasil ditambahkan`)
    onOpenChange(false)
    
    // Reset form
    setFormData({
      name: '',
      village: '',
      chairman: '',
      memberCount: 0,
      mainCommodity: '',
      description: '',
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Tambah Kelompok Tani</DialogTitle>
          <DialogDescription>
            Buat kelompok tani baru untuk mengorganisir anggota produsen
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nama Kelompok *</Label>
                <Input
                  id="name"
                  placeholder="Kelompok Tani Makmur"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="village">Desa *</Label>
                <Input
                  id="village"
                  placeholder="Desa Sukamaju"
                  value={formData.village}
                  onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="chairman">Ketua Kelompok *</Label>
                <Input
                  id="chairman"
                  placeholder="Nama Ketua"
                  value={formData.chairman}
                  onChange={(e) => setFormData({ ...formData, chairman: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="memberCount">Jumlah Anggota</Label>
                <Input
                  id="memberCount"
                  type="number"
                  min="0"
                  value={formData.memberCount}
                  onChange={(e) => setFormData({ ...formData, memberCount: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mainCommodity">Komoditas Utama *</Label>
              <Input
                id="mainCommodity"
                placeholder="Padi, Jagung, Cabai, dll"
                value={formData.mainCommodity}
                onChange={(e) => setFormData({ ...formData, mainCommodity: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi</Label>
              <Textarea
                id="description"
                placeholder="Deskripsi singkat tentang kelompok..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Batal
            </Button>
            <Button type="submit">
              Tambah Kelompok
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
