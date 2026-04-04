// ============================================================================
// Access Control Functions - Core RBAC logic
// ============================================================================

import type { Role, Permission, AccessLevel, DataScope, PanelKey } from './types'
import { ROLE_CONFIGS } from './roles'

interface RouteAccessRule {
  route: string
  roles?: Role[]
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
    roles: ['koperasi_manager', 'ketua', 'kementerian', 'sysadmin'],
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
  { route: '/anggota/tambah', roles: ['koperasi_manager', 'ketua', 'sysadmin'] },
  { route: '/anggota/onboarding', roles: ['koperasi_manager', 'ketua', 'sysadmin'] },
  { route: '/anggota/verifikasi', roles: ['koperasi_manager', 'ketua', 'kementerian', 'sysadmin'] },
  { route: '/anggota/profil', roles: ['petani', 'koperasi_manager', 'ketua', 'kementerian', 'sysadmin'] },
  { route: '/anggota/produsen', roles: ['koperasi_manager', 'ketua', 'kementerian', 'sysadmin'] },
  { route: '/anggota/kelompok', roles: ['koperasi_manager', 'ketua', 'kementerian', 'sysadmin'] },
  {
    route: '/anggota',
    roles: ['koperasi_manager', 'ketua', 'kementerian', 'sysadmin'],
  },
  { route: '/produksi/agregasi', roles: ['koperasi_manager', 'ketua', 'pemda', 'kementerian', 'sysadmin'] },
  { route: '/produksi/rencana', roles: ['petani', 'koperasi_manager', 'ketua', 'kementerian', 'sysadmin'] },
  { route: '/produksi/jadwal', roles: ['petani', 'koperasi_manager', 'ketua', 'kementerian', 'sysadmin'] },
  { route: '/produksi/komoditas', roles: ['petani', 'logistik_manager', 'koperasi_manager', 'ketua', 'pemda', 'kementerian', 'sysadmin'] },
  { route: '/produksi', roles: ['petani', 'koperasi_manager', 'ketua', 'pemda', 'kementerian', 'sysadmin'] },
  { route: '/gudang', roles: ['kasir', 'logistik_manager', 'koperasi_manager', 'ketua', 'kementerian', 'sysadmin'] },
  { route: '/pasar/harga', roles: ['petani', 'kasir', 'koperasi_manager', 'ketua', 'pemda', 'kementerian', 'sysadmin'] },
  { route: '/pasar/marketplace', roles: ['kasir', 'koperasi_manager', 'ketua', 'kementerian', 'sysadmin'] },
  { route: '/pasar/buyer', roles: ['kasir', 'koperasi_manager', 'ketua', 'kementerian', 'sysadmin'] },
  { route: '/pasar/katalog', roles: ['kasir', 'koperasi_manager', 'ketua', 'kementerian', 'sysadmin'] },
  { route: '/pasar/kontrak', roles: ['kasir', 'koperasi_manager', 'ketua', 'kementerian', 'sysadmin'] },
  { route: '/pasar', roles: ['kasir', 'koperasi_manager', 'ketua', 'kementerian', 'sysadmin'] },
  { route: '/marketplace', roles: ['kasir', 'koperasi_manager', 'ketua', 'kementerian', 'sysadmin'] },
  { route: '/logistik', roles: ['logistik_manager', 'koperasi_manager', 'ketua', 'pemda', 'kementerian', 'sysadmin'] },
  {
    route: '/keuangan/credit-scoring',
    roles: ['bank', 'koperasi_manager', 'ketua', 'kementerian', 'sysadmin'],
  },
  { route: '/keuangan/pinjaman', roles: ['petani', 'bank', 'koperasi_manager', 'ketua', 'kementerian', 'sysadmin'] },
  { route: '/keuangan/simpan-pinjam', roles: ['kasir', 'koperasi_manager', 'ketua', 'kementerian', 'sysadmin'] },
  { route: '/keuangan/invoice', roles: ['kasir', 'koperasi_manager', 'ketua', 'kementerian', 'sysadmin'] },
  { route: '/keuangan/pembayaran', roles: ['kasir', 'koperasi_manager', 'ketua', 'kementerian', 'sysadmin'] },
  { route: '/keuangan/shu', roles: ['petani', 'koperasi_manager', 'ketua', 'kementerian', 'sysadmin'] },
  { route: '/keuangan/laporan', roles: ['koperasi_manager', 'ketua', 'pemda', 'bank', 'kementerian', 'sysadmin'] },
  { route: '/keuangan', roles: ['kasir', 'koperasi_manager', 'ketua', 'kementerian', 'sysadmin'] },
  { route: '/ai/optimasi-rute', roles: ['logistik_manager', 'koperasi_manager', 'ketua', 'kementerian', 'sysadmin'] },
  { route: '/ai/grading', roles: ['kasir', 'logistik_manager', 'koperasi_manager', 'ketua', 'kementerian', 'sysadmin'] },
  { route: '/ai/rekomendasi-harga', roles: ['petani', 'kasir', 'koperasi_manager', 'ketua', 'pemda', 'kementerian', 'sysadmin'] },
  {
    route: '/ai/analisis-pasar',
    roles: ['koperasi_manager', 'ketua', 'pemda', 'kementerian', 'sysadmin'],
  },
  { route: '/ai/forecast', roles: ['koperasi_manager', 'ketua', 'pemda', 'kementerian', 'sysadmin'] },
  {
    route: '/ai/supply-demand',
    roles: ['kasir', 'koperasi_manager', 'ketua', 'kementerian', 'sysadmin'],
  },
  {
    route: '/ai',
    roles: ['petani', 'kasir', 'logistik_manager', 'koperasi_manager', 'ketua', 'pemda', 'kementerian', 'sysadmin'],
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
  if (rule.roles && !rule.roles.includes(role)) return false
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
