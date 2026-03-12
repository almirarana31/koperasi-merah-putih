// ============================================================================
// Access Control Functions — Core RBAC logic
// ============================================================================

import type { Role, Permission, AccessLevel, DataScope, PanelKey } from './types'
import { ROLE_CONFIGS } from './roles'

// ─────────────────────────────────────────────────────────────────────────────
// Permission checks
// ─────────────────────────────────────────────────────────────────────────────

/** Check if a role has a specific permission */
export function hasPermission(role: Role, permission: Permission): boolean {
  const config = ROLE_CONFIGS[role]
  if (!config) return false
  return config.permissions.includes(permission)
}

/** Check if a role has ANY of the given permissions */
export function hasAnyPermission(role: Role, permissions: Permission[]): boolean {
  return permissions.some((p) => hasPermission(role, p))
}

/** Check if a role has ALL of the given permissions */
export function hasAllPermissions(role: Role, permissions: Permission[]): boolean {
  return permissions.every((p) => hasPermission(role, p))
}

// ─────────────────────────────────────────────────────────────────────────────
// Panel access
// ─────────────────────────────────────────────────────────────────────────────

/** Get the access level for a specific panel */
export function canAccessPanel(role: Role, panel: PanelKey): AccessLevel {
  const config = ROLE_CONFIGS[role]
  if (!config) return 'none'
  return config.panelAccess[panel] ?? 'none'
}

/** Check if a role can see a panel at all (any access level except 'none') */
export function canViewPanel(role: Role, panel: PanelKey): boolean {
  return canAccessPanel(role, panel) !== 'none'
}

// ─────────────────────────────────────────────────────────────────────────────
// Export access
// ─────────────────────────────────────────────────────────────────────────────

/** Check if a role can export in a given format */
export function canExport(role: Role, format: 'pdf' | 'excel'): boolean {
  if (format === 'pdf') return hasPermission(role, 'export:pdf')
  if (format === 'excel') {
    return hasPermission(role, 'export:excel') || hasPermission(role, 'export:excel_logistics')
  }
  return false
}

/** Check if Excel export is limited to logistics data only */
export function isExcelLogisticsOnly(role: Role): boolean {
  return hasPermission(role, 'export:excel_logistics') && !hasPermission(role, 'export:excel')
}

// ─────────────────────────────────────────────────────────────────────────────
// Data scope
// ─────────────────────────────────────────────────────────────────────────────

/** Get the data scope for a role */
export function getDataScope(role: Role): DataScope {
  const config = ROLE_CONFIGS[role]
  if (!config) return 'own'
  return config.dataScope
}

// ─────────────────────────────────────────────────────────────────────────────
// Navigation filtering
// ─────────────────────────────────────────────────────────────────────────────

/** Route → required permissions mapping */
const ROUTE_PERMISSIONS: Record<string, Permission[]> = {
  '/dashboard': [], // Everyone can see dashboard (filtered panels inside)
  '/notifications': [],
  // Data Layer
  '/data/master-desa': ['panel:produksi'],
  '/data/master-penduduk': ['panel:performa_anggota'],
  '/data/master-komoditas': ['panel:performa_komoditas'],
  '/data/sensor-iot': ['panel:produksi'],
  '/data/geospasial': ['panel:logistik'],
  '/data/integrasi': ['capability:manage_integrations'],
  // Analytics Layer
  '/analytics/dna-desa': ['panel:produksi'],
  '/analytics/diagnostic': ['panel:risiko'],
  '/analytics/planning': ['panel:produksi'],
  '/analytics/recommendation': ['panel:performa_komoditas'],
  '/analytics/monitoring': ['panel:produksi'],
  // Strategic Layer
  '/strategic/peta-dna': ['panel:logistik'],
  '/strategic/laporan': ['export:pdf'],
  // Admin
  '/admin/roles': ['capability:manage_roles'],
  '/admin/integrations': ['capability:manage_integrations'],
  '/admin/audit-logs': ['capability:view_audit_logs'],
  // Settings & Help — always accessible
  '/settings': [],
  '/help': [],
}

/** Check if a role can access a specific route */
export function canAccessRoute(role: Role, route: string): boolean {
  const requiredPerms = ROUTE_PERMISSIONS[route]
  // If route is not in the map, allow access (unknown routes)
  if (!requiredPerms) return true
  // If no permissions required, allow
  if (requiredPerms.length === 0) return true
  // Check if role has any of the required permissions
  return hasAnyPermission(role, requiredPerms)
}

/** 
 * Filter navigation sections for a given role.
 * Returns only sections/items the role can access.
 */
export function filterNavigationForRole(
  navigation: {
    section: string
    items: {
      label: string
      href?: string
      children?: { label: string; href: string }[]
      [key: string]: unknown
    }[]
  }[],
  role: Role
): typeof navigation {
  return navigation
    .map((group) => ({
      ...group,
      items: group.items
        .map((item) => {
          // If item has children, filter them
          if (item.children) {
            const filteredChildren = item.children.filter((child) =>
              canAccessRoute(role, child.href)
            )
            if (filteredChildren.length === 0) return null
            return { ...item, children: filteredChildren }
          }
          // If item has a direct href, check access
          if (item.href && !canAccessRoute(role, item.href)) return null
          return item
        })
        .filter(Boolean) as typeof group.items,
    }))
    .filter((group) => group.items.length > 0)
}

// ─────────────────────────────────────────────────────────────────────────────
// Admin-specific navigation section
// ─────────────────────────────────────────────────────────────────────────────

/** Get admin navigation items (only for sysadmin) */
export function getAdminNavItems(role: Role): { label: string; href: string; icon: string }[] {
  const items: { label: string; href: string; icon: string }[] = []

  if (hasPermission(role, 'capability:manage_roles')) {
    items.push({ label: 'Manajemen Role', href: '/admin/roles', icon: 'Shield' })
  }
  if (hasPermission(role, 'capability:manage_integrations')) {
    items.push({ label: 'Integrasi Data', href: '/admin/integrations', icon: 'Plug' })
  }
  if (hasPermission(role, 'capability:view_audit_logs')) {
    items.push({ label: 'Audit Log', href: '/admin/audit-logs', icon: 'ScrollText' })
  }
  if (hasPermission(role, 'capability:export_templates')) {
    items.push({ label: 'Template Ekspor', href: '/admin/export-templates', icon: 'FileOutput' })
  }

  return items
}
