// ============================================================================
// RBAC Barrel Export
// ============================================================================

export type {
  Role,
  Permission,
  DataScope,
  AccessLevel,
  PanelKey,
  User,
  RoleConfig,
  NavItem,
  NavSection,
} from './types'

export {
  ROLE_CONFIGS,
  ALL_ROLES,
  getRoleConfig,
  getRoleLabel,
  getRoleIcon,
  getRoleColor,
} from './roles'

export {
  hasPermission,
  hasAnyPermission,
  hasAllPermissions,
  canAccessPanel,
  canViewPanel,
  canExport,
  isExcelLogisticsOnly,
  getDataScope,
  canAccessRoute,
  filterNavigationForRole,
  getAdminNavItems,
} from './access-control'
