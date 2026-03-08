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
import { Separator } from '@/components/ui/separator'
import { CheckCircle, XCircle, Calendar, User, Package, Scale } from 'lucide-react'
import { toast } from 'sonner'

interface HarvestDetailDialogProps {
  harvest: any
  open: boolean
  onOpenChange: (open: boolean) => void
  onVerify?: (harvestId: string, approved: boolean) => void
}

export function HarvestDetailDialog({
  harvest,
  open,
  onOpenChange,
  onVerify,
}: HarvestDetailDialogProps) {
  if (!harvest) return null

  const handleVerify = (approved: boolean) => {
    onVerify?.(harvest.id, approved)
    toast.success(approved ? 'Panen berhasil diverifikasi' : 'Panen ditolak')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Detail Catatan Panen</DialogTitle>
          <DialogDescription>
            ID: {harvest.id}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Status Badge */}
          <div className="flex items-center justify-between">
            <Badge 
              variant={
                harvest.status === 'disimpan' ? 'default' :
                harvest.status === 'dicatat' ? 'secondary' :
                'outline'
              }
              className="text-sm px-3 py-1"
            >
              {harvest.status === 'disimpan' ? 'Disimpan di Gudang' :
               harvest.status === 'dicatat' ? 'Dicatat' :
               'Terjual'}
            </Badge>
            <Badge variant="outline" className={`text-sm px-3 py-1 ${
              harvest.grade === 'A' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
              harvest.grade === 'B' ? 'bg-amber-50 text-amber-700 border-amber-200' :
              'bg-red-50 text-red-700 border-red-200'
            }`}>
              Grade {harvest.grade}
            </Badge>
          </div>

          <Separator />

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Anggota</p>
                  <p className="font-medium">{harvest.memberNama}</p>
                  <p className="text-xs text-muted-foreground">{harvest.memberId}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Package className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Komoditas</p>
                  <p className="font-medium">{harvest.komoditasNama}</p>
                  <p className="text-xs text-muted-foreground">{harvest.komoditasId}</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Scale className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Jumlah</p>
                  <p className="font-medium text-2xl">{harvest.jumlah.toLocaleString('id-ID')} kg</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm text-muted-foreground">Tanggal Panen</p>
                  <p className="font-medium">{new Date(harvest.tanggalPanen).toLocaleDateString('id-ID', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</p>
                </div>
              </div>
            </div>
          </div>

          {harvest.catatan && (
            <>
              <Separator />
              <div>
                <p className="text-sm text-muted-foreground mb-2">Catatan</p>
                <p className="text-sm">{harvest.catatan}</p>
              </div>
            </>
          )}

          {harvest.status === 'dicatat' && (
            <>
              <Separator />
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-sm font-medium text-amber-900 mb-2">
                  Verifikasi Diperlukan
                </p>
                <p className="text-sm text-amber-700">
                  Catatan panen ini menunggu verifikasi sebelum dapat disimpan ke gudang.
                </p>
              </div>
            </>
          )}
        </div>

        <DialogFooter className="flex gap-2">
          {harvest.status === 'dicatat' && (
            <>
              <Button
                variant="outline"
                onClick={() => handleVerify(false)}
                className="flex-1"
              >
                <XCircle className="mr-2 h-4 w-4" />
                Tolak
              </Button>
              <Button
                onClick={() => handleVerify(true)}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700"
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                Verifikasi & Simpan
              </Button>
            </>
          )}
          {harvest.status !== 'dicatat' && (
            <Button variant="outline" onClick={() => onOpenChange(false)} className="w-full">
              Tutup
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
