"use client"

import { useState } from 'react'
import { Camera, Upload, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface KTPData {
  nik: string
  name: string
  birthPlace: string
  birthDate: string
  address: string
  rt: string
  rw: string
  kelurahan: string
  kecamatan: string
  religion: string
  maritalStatus: string
  occupation: string
}

interface KTPScannerProps {
  onDataExtracted: (data: Partial<KTPData>) => void
}

export function KTPScanner({ onDataExtracted }: KTPScannerProps) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [preview, setPreview] = useState<string | null>(null)

  const handleImageCapture = async (file: File) => {
    setIsProcessing(true)
    setError(null)
    setProgress(0)

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => setPreview(e.target?.result as string)
    reader.readAsDataURL(file)

    try {
      // Simulate OCR processing (in production, use Tesseract.js or API)
      setProgress(25)
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setProgress(50)
      await new Promise(resolve => setTimeout(resolve, 500))
      
      setProgress(75)
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // Mock extracted data (replace with actual OCR)
      const mockData: Partial<KTPData> = {
        nik: '3201234567890123',
        name: 'NAMA LENGKAP',
        birthPlace: 'JAKARTA',
        birthDate: '01-01-1990',
        address: 'JL. CONTOH NO. 123',
        rt: '001',
        rw: '002',
        kelurahan: 'KELURAHAN',
        kecamatan: 'KECAMATAN',
        religion: 'ISLAM',
        maritalStatus: 'KAWIN',
        occupation: 'PETANI'
      }
      
      setProgress(100)
      onDataExtracted(mockData)
      
    } catch (err) {
      setError('Gagal memproses KTP. Pastikan foto jelas dan tidak blur.')
      console.error('OCR failed:', err)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="space-y-4">
      <input
        type="file"
        accept="image/*"
        capture="environment"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleImageCapture(file)
        }}
        className="hidden"
        id="ktp-upload"
        disabled={isProcessing}
      />
      
      {!preview && (
        <label
          htmlFor="ktp-upload"
          className="flex flex-col items-center justify-center h-64 border-2 border-dashed rounded-lg cursor-pointer hover:bg-accent transition-colors"
        >
          <Camera className="h-12 w-12 mb-4 text-muted-foreground" />
          <p className="text-lg font-medium">Foto KTP Anda</p>
          <p className="text-sm text-muted-foreground mt-2 text-center px-4">
            Pastikan foto jelas, tidak blur, dan semua teks terbaca
          </p>
          <Button variant="outline" className="mt-4" type="button">
            <Upload className="mr-2 h-4 w-4" />
            Pilih Foto
          </Button>
        </label>
      )}

      {preview && (
        <div className="space-y-4">
          <div className="relative rounded-lg overflow-hidden border">
            <img 
              src={preview} 
              alt="KTP Preview" 
              className="w-full h-auto"
            />
            {isProcessing && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Loader2 className="h-8 w-8 text-white animate-spin" />
              </div>
            )}
          </div>

          {!isProcessing && (
            <Button
              variant="outline"
              onClick={() => {
                setPreview(null)
                setError(null)
              }}
              className="w-full"
            >
              Foto Ulang
            </Button>
          )}
        </div>
      )}
      
      {isProcessing && (
        <div className="space-y-2">
          <Progress value={progress} />
          <p className="text-sm text-center text-muted-foreground">
            Memproses KTP... {progress}%
          </p>
        </div>
      )}

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="bg-muted p-4 rounded-lg">
        <h4 className="font-medium text-sm mb-2">Tips Foto KTP:</h4>
        <ul className="text-sm text-muted-foreground space-y-1">
          <li>• Pastikan pencahayaan cukup</li>
          <li>• Foto dari atas, tidak miring</li>
          <li>• Semua teks harus terbaca jelas</li>
          <li>• Tidak ada pantulan cahaya</li>
        </ul>
      </div>
    </div>
  )
}
