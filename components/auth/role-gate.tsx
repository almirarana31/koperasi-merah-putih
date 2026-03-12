'use client'

// ============================================================================
// RoleGate — Renders children only if user has one of the specified roles
// ============================================================================

import type { ReactNode } from 'react'
import type { Role } from '@/lib/rbac'
import { useAuth } from '@/lib/auth'
import { AccessDenied } from './access-denied'

interface RoleGateProps {
  /** Array of roles that can access this content */
  roles: Role[]
  /** Custom fallback when access is denied. Set to `null` to render nothing. */
  fallback?: ReactNode | null
  /** Children to render when access is granted */
  children: ReactNode
}

/**
 * Conditionally renders children based on the current user's role.
 * 
 * Usage:
 * ```tsx
 * <RoleGate roles={['ketua', 'sysadmin']}>
 *   <ApprovalWorkflow />
 * </RoleGate>
 * ```
 */
export function RoleGate({ roles, fallback, children }: RoleGateProps) {
  const { user } = useAuth()

  if (!user) {
    if (fallback === null) return null
    return fallback ?? <AccessDenied showLoginButton showBackButton={false} />
  }

  if (!roles.includes(user.role)) {
    if (fallback === null) return null
    return fallback ?? <AccessDenied compact />
  }

  return <>{children}</>
}
