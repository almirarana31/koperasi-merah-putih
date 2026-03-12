// ============================================================================
// RBAC Type Definitions — Koperasi Desa
// ============================================================================

/** All application roles */
export type Role =
  | 'petani'            // Farmer member
  | 'kasir'             // Koperasi staff / cashier
  | 'logistik_manager'  // Logistics manager
  | 'koperasi_manager'  // Koperasi manager
  | 'ketua'             // Koperasi chairman
  | 'pemda'             // Local government (Pemerintah Daerah)
  | 'bank'              // Bank / financial institution
  | 'kementerian'       // National government (Kementerian / Bappenas)
  | 'sysadmin'          // System administrator

/** Permission string — format: "category:action" */
export type Permission =
  // 8 Command Center panels
  | 'panel:produksi'
  | 'panel:stok'
  | 'panel:penjualan'
  | 'panel:logistik'
  | 'panel:cashflow'
  | 'panel:performa_anggota'
  | 'panel:performa_komoditas'
  | 'panel:risiko'
  // Export capabilities
  | 'export:pdf'
  | 'export:excel'
  | 'export:excel_logistics'
  // Special capabilities
  | 'capability:pos_transaction'
  | 'capability:cashflow_approval'
  | 'capability:configure_dashboard'
  | 'capability:set_alert_thresholds'
  | 'capability:manage_roles'
  | 'capability:manage_integrations'
  | 'capability:view_audit_logs'
  | 'capability:member_audit_trail'
  | 'capability:historical_trends'
  | 'capability:flag_escalation'
  | 'capability:export_templates'
  // View-level restrictions
  | 'view:individual_members'
  | 'view:aggregate_members'
  | 'view:commodity_prices'
  | 'view:credit_scoring'

/** Data scope determines how much data a role can query */
export type DataScope =
  | 'own'                  // Only own records (petani)
  | 'koperasi'             // Full koperasi-level data
  | 'district_aggregate'   // Aggregated at district level (pemda)
  | 'national_aggregate'   // Aggregated at national level (kementerian)
  | 'all_koperasi'         // Cross-koperasi access (sysadmin)

/** Granular access level per panel */
export type AccessLevel =
  | 'full'              // Full read/write access
  | 'view_only'         // Read-only, no modifications
  | 'aggregate'         // Only aggregated/summary data
  | 'own_only'          // Only own records
  | 'today_only'        // Only today's data
  | 'consent_required'  // Requires member consent to view
  | 'none'              // No access

/** Authenticated user object */
export interface User {
  id: string
  name: string
  email: string
  role: Role
  koperasiId?: string
  koperasiName?: string
  districtId?: string
  districtName?: string
  provinceId?: string
  provinceName?: string
  avatarUrl?: string
}

/** Configuration for a single role */
export interface RoleConfig {
  key: Role
  label: string
  labelEn: string
  description: string
  icon: string // emoji
  color: string // tailwind color class for badges
  permissions: Permission[]
  dataScope: DataScope
  panelAccess: Partial<Record<PanelKey, AccessLevel>>
}

/** Panel keys matching the 8 command center panels */
export type PanelKey =
  | 'produksi'
  | 'stok'
  | 'penjualan'
  | 'logistik'
  | 'cashflow'
  | 'performa_anggota'
  | 'performa_komoditas'
  | 'risiko'

/** Sidebar navigation item (matches sidebar.tsx structure) */
export interface NavItem {
  label: string
  icon: string // lucide icon name
  href?: string
  badge?: string
  tooltip?: string
  requiredPermissions?: Permission[]
  children?: {
    label: string
    href: string
    tooltip?: string
    requiredPermissions?: Permission[]
  }[]
}

export interface NavSection {
  section: string
  items: NavItem[]
}
