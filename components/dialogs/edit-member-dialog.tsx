"use client"

import { useState, useEffect } from 'react'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import type { Member } from '@/lib/mock-data'

interface EditMemberDialogProps {
  member: Member | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave?: (member: Member) => void
}

export function EditMemberDialog({
  member,
  open,
  onOpenChange,
  onSave,
}: EditMemberDialogProps) {
  const [formData, setFormData] = useState<Partial<Member>>({})

  useEffect(() => {
    if (member) {
      setFormData(member)
    }
  }, [member])

  const handleSave = () => {
    if (!member) return

    const updatedMember = { ...member, ...formData }
    onSave?.(updatedMember)
    toast.success('Data anggota berhasil diperbarui')
    onOpenChange(false)
  }

  if (!member) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Profil Anggota</DialogTitle>
          <DialogDescription>
            Perbarui informasi anggota {member.name}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nama Lengkap</Label>
              <Input
                id="name"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Nomor Telepon</Label>
              <Input
                id="phone"
                value={formData.phone || ''}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email || ''}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="ktp">NIK</Label>
              <Input
                id="ktp"
                value={formData.ktp || ''}
                onChange={(e) => setFormData({ ...formData, ktp: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="village">Desa</Label>
              <Input
                id="village"
                value={formData.village || ''}
                onChange={(e) => setFormData({ ...formData, village: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="district">Kecamatan</Label>
              <Input
                id="district"
                value={formData.district || ''}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="province">Provinsi</Label>
              <Input
                id="province"
                value={formData.province || ''}
                onChange={(e) => setFormData({ ...formData, province: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select
                value={formData.role}
                onValueChange={(value: any) => setFormData({ ...formData, role: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="produsen">Produsen</SelectItem>
                  <SelectItem value="buyer">Buyer</SelectItem>
                  <SelectItem value="both">Keduanya</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: any) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="position">Posisi</Label>
              <Select
                value={formData.position}
                onValueChange={(value: any) => setFormData({ ...formData, position: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ketua">Ketua</SelectItem>
                  <SelectItem value="pengurus">Pengurus</SelectItem>
                  <SelectItem value="anggota">Anggota</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {formData.role !== 'buyer' && (
            <div className="grid grid-cols-2 gap-4 border-t pt-4">
              <div className="space-y-2">
                <Label htmlFor="landArea">Luas Lahan (hektar)</Label>
                <Input
                  id="landArea"
                  type="number"
                  step="0.1"
                  value={formData.landArea || 0}
                  onChange={(e) => setFormData({ ...formData, landArea: parseFloat(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="mainCommodity">Komoditas Utama</Label>
                <Input
                  id="mainCommodity"
                  value={formData.mainCommodity || ''}
                  onChange={(e) => setFormData({ ...formData, mainCommodity: e.target.value })}
                />
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Batal
          </Button>
          <Button onClick={handleSave}>
            Simpan Perubahan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
