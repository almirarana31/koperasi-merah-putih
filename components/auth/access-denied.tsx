'use client'

// ============================================================================
// AccessDenied — Styled card shown when user lacks permission
// ============================================================================

import { ShieldX, ArrowLeft, LogIn } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import { useAuth } from '@/lib/auth'

interface AccessDeniedProps {
  /** Custom title */
  title?: string
  /** Custom message */
  message?: string
  /** Show "Back to Dashboard" button */
  showBackButton?: boolean
  /** Show "Login" button (for unauthenticated users) */
  showLoginButton?: boolean
  /** Compact mode — smaller card for inline use */
  compact?: boolean
}

export function AccessDenied({
  title = 'Akses Ditolak',
  message,
  showBackButton = true,
  showLoginButton = false,
  compact = false,
}: AccessDeniedProps) {
  const { user, roleConfig } = useAuth()

  const defaultMessage = user
    ? `Role "${roleConfig?.label ?? user.role}" tidak memiliki izin untuk mengakses fitur ini.`
    : 'Anda harus login terlebih dahulu untuk mengakses fitur ini.'

  if (compact) {
    return (
      <Card className="border-dashed border-2 border-muted-foreground/20">
        <CardContent className="flex items-center gap-3 p-4">
          <ShieldX className="h-5 w-5 text-muted-foreground/50 shrink-0" />
          <div className="min-w-0">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-xs text-muted-foreground/70 truncate">
              {message ?? defaultMessage}
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="flex items-center justify-center py-16">
      <Card className="max-w-md w-full border-2">
        <CardContent className="flex flex-col items-center text-center p-8 space-y-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            <ShieldX className="h-8 w-8 text-destructive" />
          </div>
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-foreground">{title}</h2>
            <p className="text-sm text-muted-foreground">
              {message ?? defaultMessage}
            </p>
          </div>
          {user && roleConfig && (
            <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2">
              <span className="text-lg">{roleConfig.icon}</span>
              <div className="text-left">
                <p className="text-xs font-medium text-foreground">{user.name}</p>
                <p className="text-xs text-muted-foreground">{roleConfig.label}</p>
              </div>
            </div>
          )}
          <div className="flex gap-3 pt-2">
            {showBackButton && (
              <Link href="/dashboard">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Kembali ke Dashboard
                </Button>
              </Link>
            )}
            {showLoginButton && (
              <Link href="/login">
                <Button size="sm">
                  <LogIn className="h-4 w-4 mr-2" />
                  Login
                </Button>
              </Link>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
