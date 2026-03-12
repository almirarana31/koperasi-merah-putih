'use client'

// ============================================================================
// RequirePermission — Renders children only if user has required permission(s)
// ============================================================================

import type { ReactNode } from 'react'
import type { Permission } from '@/lib/rbac'
import { useAuth } from '@/lib/auth'
import { AccessDenied } from './access-denied'

interface RequirePermissionProps {
  /** Single permission or array of permissions (ANY match = access granted) */
  permission: Permission | Permission[]
  /** Custom fallback when access is denied. Set to `null` to render nothing. */
  fallback?: ReactNode | null
  /** Children to render when access is granted */
  children: ReactNode
}

/**
 * Conditionally renders children based on the current user's permissions.
 * 
 * Usage:
 * ```tsx
 * <RequirePermission permission="panel:cashflow">
 *   <CashflowPanel />
 * </RequirePermission>
 * 
 * // Multiple permissions (OR logic):
 * <RequirePermission permission={['export:pdf', 'export:excel']}>
 *   <ExportButton />
 * </RequirePermission>
 * 
 * // Hide completely instead of showing AccessDenied:
 * <RequirePermission permission="panel:risiko" fallback={null}>
 *   <RiskPanel />
 * </RequirePermission>
 * ```
 */
export function RequirePermission({
  permission,
  fallback,
  children,
}: RequirePermissionProps) {
  const { user, can, canAny } = useAuth()

  // Not authenticated at all
  if (!user) {
    if (fallback === null) return null
    return fallback ?? <AccessDenied showLoginButton showBackButton={false} />
  }

  // Check permission(s)
  const hasAccess = Array.isArray(permission)
    ? canAny(permission)
    : can(permission)

  if (!hasAccess) {
    if (fallback === null) return null
    return fallback ?? <AccessDenied compact />
  }

  return <>{children}</>
}
