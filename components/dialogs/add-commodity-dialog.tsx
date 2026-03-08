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

interface AddCommodityDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAdd?: (commodity: any) => void
}

export function AddCommodityDialog({ open, onOpenChange, onAdd }: AddCommodityDialogProps) {
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    unit: 'kg',
    minPrice: 0,
    maxPrice: 0,
    description: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const newCommodity = {
      id: `COM-${Date.now()}`,
      sku: `SKU-${Date.now()}`,
      ...formData,
      createdAt: new Date().toISOString(),
      status: 'active',
    }

    onAdd?.(newCommodity)
    toast.success(`Komoditas ${formData.name} berhasil ditambahkan`)
    onOpenChange(false)
    
    // Reset form
    setFormData({
      name: '',
      category: '',
      unit: 'kg',
      minPrice: 0,
      maxPrice: 0,
      description: '',
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Tambah Komoditas Baru</DialogTitle>
          <DialogDescription>
            Daftarkan komoditas baru yang akan diproduksi oleh anggota
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nama Komoditas *</Label>
                <Input
                  id="name"
                  placeholder="Beras Premium, Cabai Merah, dll"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Kategori *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sayuran">Sayuran</SelectItem>
                    <SelectItem value="buah">Buah</SelectItem>
                    <SelectItem value="biji-bijian">Biji-bijian</SelectItem>
                    <SelectItem value="ternak">Ternak</SelectItem>
                    <SelectItem value="perikanan">Perikanan</SelectItem>
                    <SelectItem value="olahan">Produk Olahan</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="unit">Satuan *</Label>
                <Select
                  value={formData.unit}
                  onValueChange={(value) => setFormData({ ...formData, unit: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kg">Kilogram (kg)</SelectItem>
                    <SelectItem value="ton">Ton</SelectItem>
                    <SelectItem value="pcs">Pieces (pcs)</SelectItem>
                    <SelectItem value="liter">Liter</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="minPrice">Harga Min (Rp/unit)</Label>
                <Input
                  id="minPrice"
                  type="number"
                  min="0"
                  value={formData.minPrice}
                  onChange={(e) => setFormData({ ...formData, minPrice: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxPrice">Harga Max (Rp/unit)</Label>
                <Input
                  id="maxPrice"
                  type="number"
                  min="0"
                  value={formData.maxPrice}
                  onChange={(e) => setFormData({ ...formData, maxPrice: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi</Label>
              <Textarea
                id="description"
                placeholder="Deskripsi komoditas, varietas, karakteristik khusus..."
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
              Tambah Komoditas
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
