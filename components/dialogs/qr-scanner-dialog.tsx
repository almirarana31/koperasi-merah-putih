import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import { 
  QrCode, 
  Camera, 
  CheckCircle2,
  Package,
  Calendar,
  MapPin,
  User,
  Scan
} from 'lucide-react'
import type { DialogOpenProps } from '@/components/dialogs/types'

type ScannedData = {
  id: string
  commodity: string
  quantity: string
  grade: string
  origin: string
  farmer: string
  harvestDate: string
  expiryDate: string
  batchNumber: string
  warehouse: string
  status: string
}

type QRScannerDialogProps = DialogOpenProps & {
  onScanComplete?: (data: ScannedData) => void
}

export function QRScannerDialog({ open, onOpenChange, onScanComplete }: QRScannerDialogProps) {
  const [isScanning, setIsScanning] = useState(false)
  const [scannedData, setScannedData] = useState<ScannedData | null>(null)

  const handleStartScan = () => {
    setIsScanning(true)
    
    // Simulate QR code scanning
    setTimeout(() => {
      const mockData = {
        id: 'PKG-2026-03-08-001',
        commodity: 'Tomat Segar',
        quantity: '150 kg',
        grade: 'A',
        origin: 'Subang, Jawa Barat',
        farmer: 'Budi Santoso',
        harvestDate: '2026-03-05',
        expiryDate: '2026-03-15',
        batchNumber: 'B2026030501',
        warehouse: 'Gudang Pusat',
        status: 'In Transit',
      }
      
      setScannedData(mockData)
      setIsScanning(false)
      toast.success('QR Code scanned successfully!')
    }, 2000)
  }

  const handleConfirm = () => {
    if (scannedData) {
      onScanComplete?.(scannedData)
      onOpenChange(false)
      setScannedData(null)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center gap-2">
            <QrCode className="h-5 w-5 text-blue-600" />
            QR Code Scanner
          </DialogTitle>
          <DialogDescription>
            Scan product QR code for instant tracking and verification
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {!scannedData ? (
            <div className="flex flex-col items-center justify-center py-8 space-y-6">
              {/* Scanner Interface */}
              <div className="relative">
                <div className={`w-64 h-64 rounded-2xl border-4 border-dashed border-blue-300 dark:border-blue-700 flex items-center justify-center ${isScanning ? 'animate-pulse bg-blue-50 dark:bg-blue-950/20' : 'bg-slate-50 dark:bg-slate-900'}`}>
                  {isScanning ? (
                    <div className="relative">
                      <Scan className="h-24 w-24 text-blue-600 animate-pulse" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-32 h-1 bg-blue-600 animate-scan" />
                      </div>
                    </div>
                  ) : (
                    <QrCode className="h-24 w-24 text-slate-300 dark:text-slate-700" />
                  )}
                </div>
                
                {/* Corner markers */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-blue-600 rounded-tl-2xl" />
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-blue-600 rounded-tr-2xl" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-blue-600 rounded-bl-2xl" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-blue-600 rounded-br-2xl" />
              </div>

              <div className="text-center space-y-2">
                <h3 className="text-lg font-semibold">
                  {isScanning ? 'Scanning QR Code...' : 'Position QR Code in Frame'}
                </h3>
                <p className="text-sm text-muted-foreground max-w-sm">
                  {isScanning 
                    ? 'Reading product information from QR code'
                    : 'Click the button below to activate camera and scan'
                  }
                </p>
              </div>

              <Button 
                onClick={handleStartScan}
                disabled={isScanning}
                className="bg-blue-600 hover:bg-blue-700 text-white"
                size="lg"
              >
                <Camera className="h-4 w-4 mr-2" />
                {isScanning ? 'Scanning...' : 'Start Scanning'}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Success Header */}
              <Card className="bg-emerald-50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-emerald-600">
                      <CheckCircle2 className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-emerald-900 dark:text-emerald-100">Scan Successful!</p>
                      <p className="text-sm text-emerald-700 dark:text-emerald-300">Product information retrieved</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Product Details */}
              <Card>
                <CardContent className="p-4 space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-lg font-bold">{scannedData.commodity}</p>
                      <p className="text-sm text-muted-foreground">ID: {scannedData.id}</p>
                    </div>
                    <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                      Grade {scannedData.grade}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div className="flex items-start gap-2">
                      <Package className="h-4 w-4 text-slate-400 mt-0.5" />
                      <div>
                        <p className="text-xs text-muted-foreground">Quantity</p>
                        <p className="text-sm font-semibold">{scannedData.quantity}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <User className="h-4 w-4 text-slate-400 mt-0.5" />
                      <div>
                        <p className="text-xs text-muted-foreground">Farmer</p>
                        <p className="text-sm font-semibold">{scannedData.farmer}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-slate-400 mt-0.5" />
                      <div>
                        <p className="text-xs text-muted-foreground">Origin</p>
                        <p className="text-sm font-semibold">{scannedData.origin}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Calendar className="h-4 w-4 text-slate-400 mt-0.5" />
                      <div>
                        <p className="text-xs text-muted-foreground">Harvest Date</p>
                        <p className="text-sm font-semibold">{scannedData.harvestDate}</p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 border-t space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Batch Number:</span>
                      <span className="font-mono font-semibold">{scannedData.batchNumber}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Current Location:</span>
                      <span className="font-semibold">{scannedData.warehouse}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Status:</span>
                      <Badge variant="outline" className="text-xs">{scannedData.status}</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Expiry Date:</span>
                      <span className="font-semibold text-orange-600">{scannedData.expiryDate}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => setScannedData(null)}
                >
                  Scan Another
                </Button>
                <Button 
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  onClick={handleConfirm}
                >
                  <CheckCircle2 className="h-4 w-4 mr-1" />
                  Confirm
                </Button>
              </div>
            </div>
          )}
        </div>

        <style jsx>{`
          @keyframes scan {
            0%, 100% { transform: translateY(-50px); }
            50% { transform: translateY(50px); }
          }
          .animate-scan {
            animation: scan 2s ease-in-out infinite;
          }
        `}</style>
      </DialogContent>
    </Dialog>
  )
}
