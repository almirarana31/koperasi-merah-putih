'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { KopdesLayout } from '@/components/kopdes-layout'
import { useAuth } from '@/lib/auth'
import { canAccessRoute } from '@/lib/rbac'
import { AccessDenied } from '@/components/auth/access-denied'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const { user, isLoading } = useAuth()

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!isLoading && !user) {
      router.push('/login')
    }
  }, [user, isLoading, router])

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // Redirect if not authenticated
  if (!user) {
    return null
  }

  // Check route access
  const hasAccess = canAccessRoute(user.role, pathname)

  if (!hasAccess) {
    return (
      <KopdesLayout>
        <AccessDenied />
      </KopdesLayout>
    )
  }

  return <KopdesLayout>{children}</KopdesLayout>
}
