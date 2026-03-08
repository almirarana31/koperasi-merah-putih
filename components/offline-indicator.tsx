"use client"

import { useState, useEffect } from 'react'
import { WifiOff, Wifi, Cloud, CloudOff } from 'lucide-react'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { syncOfflineData } from '@/lib/offline-db'

export function OfflineIndicator() {
  const [isOnline, setIsOnline] = useState(true)
  const [isSyncing, setIsSyncing] = useState(false)

  useEffect(() => {
    setIsOnline(navigator.onLine)

    const handleOnline = async () => {
      setIsOnline(true)
      setIsSyncing(true)
      try {
        await syncOfflineData()
      } finally {
        setIsSyncing(false)
      }
    }

    const handleOffline = () => {
      setIsOnline(false)
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  if (isOnline && !isSyncing) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      {!isOnline && (
        <Alert variant="destructive" className="shadow-lg">
          <WifiOff className="h-4 w-4" />
          <AlertDescription className="ml-2">
            <strong>Mode Offline</strong>
            <p className="text-sm mt-1">
              Data akan disimpan secara lokal dan disinkronkan saat online kembali.
            </p>
          </AlertDescription>
        </Alert>
      )}

      {isSyncing && (
        <Alert className="shadow-lg bg-primary text-primary-foreground">
          <Cloud className="h-4 w-4 animate-pulse" />
          <AlertDescription className="ml-2">
            <strong>Menyinkronkan data...</strong>
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
