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
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import {
  User,
  Phone,
  MapPin,
  Calendar,
  Wallet,
  TrendingUp,
  Package,
  Star,
  Edit,
  Trash2,
} from 'lucide-react'
import type { Member } from '@/lib/mock-data'

interface MemberDetailDialogProps {
  member: Member | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onEdit?: (member: Member) => void
  onDelete?: (memberId: string) => void
}

export function MemberDetailDialog({
  member,
  open,
  onOpenChange,
  onEdit,
  onDelete,
}: MemberDetailDialogProps) {
  if (!member) return null

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(val)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="text-lg">
                  {member.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <div>
                <DialogTitle className="text-2xl">{member.name}</DialogTitle>
                <DialogDescription className="flex items-center gap-2 mt-1">
                  <span>{member.memberNumber}</span>
                  <Badge variant={member.status === 'active' ? 'default' : 'secondary'}>
                    {member.status}
                  </Badge>
                  {member.verified && (
                    <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-200">
                      Terverifikasi
                    </Badge>
                  )}
                </DialogDescription>
              </div>
            </div>
          </div>
        </DialogHeader>

        <Tabs defaultValue="info" className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="info">Informasi</TabsTrigger>
            <TabsTrigger value="financial">Keuangan</TabsTrigger>
            <TabsTrigger value="production">Produksi</TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">NIK</p>
                <p className="font-medium">{member.ktp}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Role</p>
                <Badge variant="outline" className="capitalize">{member.role}</Badge>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Phone className="h-3 w-3" /> Telepon
                </p>
                <p className="font-medium">{member.phone}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <MapPin className="h-3 w-3" /> Desa
                </p>
                <p className="font-medium">{member.village}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Kecamatan</p>
                <p className="font-medium">{member.district}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Provinsi</p>
                <p className="font-medium">{member.province}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Calendar className="h-3 w-3" /> Bergabung
                </p>
                <p className="font-medium">{new Date(member.joinDate).toLocaleDateString('id-ID')}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Kelompok</p>
                <p className="font-medium">{member.group}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">Posisi</p>
                <Badge variant="secondary" className="capitalize">{member.position}</Badge>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground flex items-center gap-1">
                  <Star className="h-3 w-3" /> Rating
                </p>
                <p className="font-medium">{member.rating}/5</p>
              </div>
            </div>

            {member.role !== 'buyer' && (
              <div className="border-t pt-4">
                <h4 className="font-semibold mb-2">Informasi Lahan</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Luas Lahan</p>
                    <p className="font-medium">{member.landArea} hektar</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground">Komoditas Utama</p>
                    <p className="font-medium capitalize">{member.mainCommodity}</p>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="financial" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Wallet className="h-4 w-4 text-primary" />
                  <p className="text-sm text-muted-foreground">Total Simpanan</p>
                </div>
                <p className="text-2xl font-bold">{formatCurrency(member.financial.savings)}</p>
              </div>
              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Wallet className="h-4 w-4 text-amber-600" />
                  <p className="text-sm text-muted-foreground">Pinjaman Aktif</p>
                </div>
                <p className="text-2xl font-bold">{formatCurrency(member.financial.loans)}</p>
              </div>
              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="h-4 w-4 text-emerald-600" />
                  <p className="text-sm text-muted-foreground">SHU Tahun Ini</p>
                </div>
                <p className="text-2xl font-bold">{formatCurrency(member.financial.shu)}</p>
              </div>
              <div className="rounded-lg border p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Package className="h-4 w-4 text-blue-600" />
                  <p className="text-sm text-muted-foreground">Total Transaksi</p>
                </div>
                <p className="text-2xl font-bold">{member.financial.transactions}</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="production" className="space-y-4 mt-4">
            {member.role !== 'buyer' && (
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg border p-4">
                  <p className="text-sm text-muted-foreground mb-2">Produksi Bulanan</p>
                  <p className="text-2xl font-bold">{member.production.monthly.toLocaleString('id-ID')} kg</p>
                </div>
                <div className="rounded-lg border p-4">
                  <p className="text-sm text-muted-foreground mb-2">Produksi Tahunan</p>
                  <p className="text-2xl font-bold">{member.production.annual.toLocaleString('id-ID')} kg</p>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter className="flex gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => onEdit?.(member)}
            className="flex-1 sm:flex-none"
          >
            <Edit className="mr-2 h-4 w-4" />
            Edit Profil
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              if (confirm(`Hapus anggota ${member.name}?`)) {
                onDelete?.(member.id)
                onOpenChange(false)
              }
            }}
            className="flex-1 sm:flex-none"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Hapus
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
