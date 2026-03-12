'use client'

// ============================================================================
// useAuth Hook — Access current user, role, and permission checks
// ============================================================================

import { useContext } from 'react'
import { AuthContext, type AuthContextValue } from './auth-context'
import {
  hasPermission,
  hasAnyPermission,
  canAccessPanel,
  canViewPanel,
  canExport,
  getDataScope,
  canAccessRoute,
  getRoleConfig,
  type Permission,
  type PanelKey,
  type AccessLevel,
  type DataScope,
  type RoleConfig,
} from '@/lib/rbac'

export interface UseAuthReturn extends AuthContextValue {
  /** Check if current user has a specific permission */
  can: (permission: Permission) => boolean
  /** Check if current user has any of the given permissions */
  canAny: (permissions: Permission[]) => boolean
  /** Get access level for a panel */
  panelAccess: (panel: PanelKey) => AccessLevel
  /** Check if a panel is visible at all */
  canSeePanel: (panel: PanelKey) => boolean
  /** Check if user can export in a given format */
  canExportAs: (format: 'pdf' | 'excel') => boolean
  /** Get data scope for the current role */
  dataScope: () => DataScope
  /** Check if user can access a route */
  canRoute: (route: string) => boolean
  /** Get role config for the current user */
  roleConfig: RoleConfig | null
}

export function useAuth(): UseAuthReturn {
  const context = useContext(AuthContext)

  const role = context.user?.role

  const can = (permission: Permission): boolean => {
    if (!role) return false
    return hasPermission(role, permission)
  }

  const canAny = (permissions: Permission[]): boolean => {
    if (!role) return false
    return hasAnyPermission(role, permissions)
  }

  const panelAccessFn = (panel: PanelKey): AccessLevel => {
    if (!role) return 'none'
    return canAccessPanel(role, panel)
  }

  const canSeePanel = (panel: PanelKey): boolean => {
    if (!role) return false
    return canViewPanel(role, panel)
  }

  const canExportAs = (format: 'pdf' | 'excel'): boolean => {
    if (!role) return false
    return canExport(role, format)
  }

  const dataScopeFn = (): DataScope => {
    if (!role) return 'own'
    return getDataScope(role)
  }

  const canRoute = (route: string): boolean => {
    if (!role) return false
    return canAccessRoute(role, route)
  }

  const roleConfigValue = role ? getRoleConfig(role) : null

  return {
    ...context,
    can,
    canAny,
    panelAccess: panelAccessFn,
    canSeePanel,
    canExportAs,
    dataScope: dataScopeFn,
    canRoute,
    roleConfig: roleConfigValue,
  }
}
