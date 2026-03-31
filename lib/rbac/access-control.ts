// ============================================================================
// Access Control Functions - Core RBAC logic
// ============================================================================

import type { Role, Permission, AccessLevel, DataScope, PanelKey } from './types'
import { ROLE_CONFIGS } from './roles'

interface RouteAccessRule {
  route: string
  permissions?: Permission[]
  match?: 'any' | 'all'
}

// ============================================================================
// Permission checks
// ============================================================================

/** Check if a role has a specific permission */
export function hasPermission(role: Role, permission: Permission): boolean {
  const config = ROLE_CONFIGS[role]
  if (!config) return false
  return config.permissions.includes(permission)
}

/** Check if a role has ANY of the given permissions */
export function hasAnyPermission(role: Role, permissions: Permission[]): boolean {
  return permissions.some((permission) => hasPermission(role, permission))
}

/** Check if a role has ALL of the given permissions */
export function hasAllPermissions(role: Role, permissions: Permission[]): boolean {
  return permissions.every((permission) => hasPermission(role, permission))
}

// ============================================================================
// Panel access
// ============================================================================

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

// ============================================================================
// Export access
// ============================================================================

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

// ============================================================================
// Data scope
// ============================================================================

/** Get the data scope for a role */
export function getDataScope(role: Role): DataScope {
  const config = ROLE_CONFIGS[role]
  if (!config) return 'own'
  return config.dataScope
}

// ============================================================================
// Navigation filtering
// ============================================================================

/** Route access rules for the current dashboard app */
const ROUTE_ACCESS_RULES = [
  { route: '/', permissions: [] },
  { route: '/dashboard', permissions: [] },
  {
    route: '/command-center',
    permissions: [
      'panel:produksi',
      'panel:stok',
      'panel:penjualan',
      'panel:logistik',
      'panel:cashflow',
      'panel:performa_anggota',
      'panel:performa_komoditas',
      'panel:risiko',
    ],
    match: 'all',
  },
  { route: '/anggota/tambah', permissions: ['view:individual_members'] },
  { route: '/anggota/verifikasi', permissions: ['view:individual_members'] },
  {
    route: '/anggota',
    permissions: [
      'panel:performa_anggota',
      'view:individual_members',
      'view:aggregate_members',
      'view:credit_scoring',
    ],
  },
  { route: '/produksi', permissions: ['panel:produksi'] },
  { route: '/gudang', permissions: ['panel:stok'] },
  { route: '/pasar/harga', permissions: ['panel:penjualan', 'view:commodity_prices'] },
  { route: '/pasar/marketplace', permissions: ['panel:penjualan'] },
  { route: '/pasar', permissions: ['panel:penjualan'] },
  { route: '/marketplace', permissions: ['panel:penjualan'] },
  { route: '/logistik', permissions: ['panel:logistik'] },
  {
    route: '/keuangan/credit-scoring',
    permissions: ['view:credit_scoring', 'view:individual_members', 'panel:cashflow'],
  },
  { route: '/keuangan/laporan', permissions: ['export:pdf', 'panel:cashflow'] },
  { route: '/keuangan', permissions: ['panel:cashflow'] },
  { route: '/ai/optimasi-rute', permissions: ['panel:logistik'] },
  { route: '/ai/grading', permissions: ['panel:stok', 'panel:performa_komoditas'] },
  { route: '/ai/rekomendasi-harga', permissions: ['panel:performa_komoditas', 'view:commodity_prices'] },
  {
    route: '/ai/analisis-pasar',
    permissions: ['panel:penjualan', 'panel:performa_komoditas', 'view:commodity_prices'],
  },
  { route: '/ai/forecast', permissions: ['panel:produksi', 'panel:penjualan', 'panel:performa_komoditas'] },
  {
    route: '/ai/supply-demand',
    permissions: ['panel:produksi', 'panel:penjualan', 'panel:performa_komoditas'],
  },
  {
    route: '/ai',
    permissions: [
      'panel:produksi',
      'panel:logistik',
      'panel:stok',
      'panel:penjualan',
      'panel:performa_komoditas',
      'view:commodity_prices',
    ],
  },
  { route: '/assistant', permissions: [] },
  { route: '/notifications', permissions: [] },
  { route: '/settings', permissions: [] },
] satisfies RouteAccessRule[]

const SORTED_ROUTE_ACCESS_RULES = [...ROUTE_ACCESS_RULES].sort((a, b) => b.route.length - a.route.length)

function normalizeRoute(route: string): string {
  if (!route) return '/'
  const normalized = route.replace(/[?#].*$/, '').replace(/\/+$/, '')
  return normalized === '' ? '/' : normalized
}

function matchesRoute(route: string, pattern: string): boolean {
  if (pattern === '/') return route === '/'
  return route === pattern || route.startsWith(`${pattern}/`)
}

function canAccessByRule(role: Role, rule: RouteAccessRule): boolean {
  if (!rule.permissions || rule.permissions.length === 0) return true
  if (rule.match === 'all') return hasAllPermissions(role, rule.permissions)
  return hasAnyPermission(role, rule.permissions)
}

/** Check if a role can access a specific route */
export function canAccessRoute(role: Role, route: string): boolean {
  const normalizedRoute = normalizeRoute(route)
  const matchedRule = SORTED_ROUTE_ACCESS_RULES.find((rule) => matchesRoute(normalizedRoute, rule.route))

  if (!matchedRule) return false

  return canAccessByRule(role, matchedRule)
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
          if (item.children) {
            const filteredChildren = item.children.filter((child) => canAccessRoute(role, child.href))
            if (filteredChildren.length === 0) return null
            return { ...item, children: filteredChildren }
          }

          if (item.href && !canAccessRoute(role, item.href)) return null
          return item
        })
        .filter(Boolean) as typeof group.items,
    }))
    .filter((group) => group.items.length > 0)
}

// ============================================================================
// Admin-specific navigation section
// ============================================================================

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
