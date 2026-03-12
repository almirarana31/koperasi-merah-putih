// ============================================================================
// Role Configurations — Complete role→permission mapping for all 9 roles
// ============================================================================

import type { Role, RoleConfig } from './types'

export const ROLE_CONFIGS: Record<Role, RoleConfig> = {
  // ─────────────────────────────────────────────────────────────────────────
  // 👨‍🌾 Petani Anggota (Farmer)
  // ─────────────────────────────────────────────────────────────────────────
  petani: {
    key: 'petani',
    label: 'Petani Anggota',
    labelEn: 'Farmer Member',
    description: 'Anggota koperasi — akses data produksi, performa, dan cashflow pribadi',
    icon: '👨‍🌾',
    color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    dataScope: 'own',
    permissions: [
      'panel:produksi',
      'panel:cashflow',
      'panel:performa_anggota',
      'panel:performa_komoditas',
      'view:commodity_prices',
    ],
    panelAccess: {
      produksi: 'own_only',
      stok: 'none',
      penjualan: 'none',
      logistik: 'none',
      cashflow: 'own_only',
      performa_anggota: 'own_only',
      performa_komoditas: 'view_only',
      risiko: 'none',
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 🏪 Kasir / Operator (Koperasi Staff)
  // ─────────────────────────────────────────────────────────────────────────
  kasir: {
    key: 'kasir',
    label: 'Kasir / Operator',
    labelEn: 'Koperasi Staff',
    description: 'Operator harian — akses penjualan, stok, dan performa komoditas',
    icon: '🏪',
    color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    dataScope: 'koperasi',
    permissions: [
      'panel:penjualan',
      'panel:stok',
      'panel:performa_komoditas',
      'capability:pos_transaction',
    ],
    panelAccess: {
      produksi: 'none',
      stok: 'view_only',
      penjualan: 'today_only',
      logistik: 'none',
      cashflow: 'none',
      performa_anggota: 'none',
      performa_komoditas: 'view_only',
      risiko: 'none',
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 📦 Manajer Logistik (Logistics Manager)
  // ─────────────────────────────────────────────────────────────────────────
  logistik_manager: {
    key: 'logistik_manager',
    label: 'Manajer Logistik',
    labelEn: 'Logistics Manager',
    description: 'Manajemen distribusi — akses logistik, stok, komoditas, dan risiko',
    icon: '📦',
    color: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400',
    dataScope: 'koperasi',
    permissions: [
      'panel:logistik',
      'panel:stok',
      'panel:performa_komoditas',
      'panel:risiko',
      'export:excel_logistics',
    ],
    panelAccess: {
      produksi: 'none',
      stok: 'full',
      penjualan: 'none',
      logistik: 'full',
      cashflow: 'none',
      performa_anggota: 'none',
      performa_komoditas: 'view_only',
      risiko: 'view_only',
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 💼 Manajer Koperasi (Koperasi Manager)
  // ─────────────────────────────────────────────────────────────────────────
  koperasi_manager: {
    key: 'koperasi_manager',
    label: 'Manajer Koperasi',
    labelEn: 'Koperasi Manager',
    description: 'Akses penuh 8 panel Command Center, ekspor PDF & Excel, view-only cashflow',
    icon: '💼',
    color: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
    dataScope: 'koperasi',
    permissions: [
      'panel:produksi',
      'panel:stok',
      'panel:penjualan',
      'panel:logistik',
      'panel:cashflow',
      'panel:performa_anggota',
      'panel:performa_komoditas',
      'panel:risiko',
      'export:pdf',
      'export:excel',
      'view:individual_members',
      'capability:set_alert_thresholds',
    ],
    panelAccess: {
      produksi: 'full',
      stok: 'full',
      penjualan: 'full',
      logistik: 'full',
      cashflow: 'view_only',
      performa_anggota: 'full',
      performa_komoditas: 'full',
      risiko: 'full',
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 🏦 Ketua Koperasi (Chairman)
  // ─────────────────────────────────────────────────────────────────────────
  ketua: {
    key: 'ketua',
    label: 'Ketua Koperasi',
    labelEn: 'Koperasi Chairman',
    description: 'Akses penuh + persetujuan cashflow, konfigurasi dashboard, audit trail anggota',
    icon: '🏦',
    color: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
    dataScope: 'koperasi',
    permissions: [
      'panel:produksi',
      'panel:stok',
      'panel:penjualan',
      'panel:logistik',
      'panel:cashflow',
      'panel:performa_anggota',
      'panel:performa_komoditas',
      'panel:risiko',
      'export:pdf',
      'export:excel',
      'view:individual_members',
      'capability:cashflow_approval',
      'capability:configure_dashboard',
      'capability:set_alert_thresholds',
      'capability:flag_escalation',
      'capability:historical_trends',
      'capability:member_audit_trail',
    ],
    panelAccess: {
      produksi: 'full',
      stok: 'full',
      penjualan: 'full',
      logistik: 'full',
      cashflow: 'full',
      performa_anggota: 'full',
      performa_komoditas: 'full',
      risiko: 'full',
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 🏛️ Pemerintah Daerah (Local Government)
  // ─────────────────────────────────────────────────────────────────────────
  pemda: {
    key: 'pemda',
    label: 'Pemerintah Daerah',
    labelEn: 'Local Government',
    description: 'Read-only agregat tingkat kabupaten — produksi, logistik, performa anggota',
    icon: '🏛️',
    color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    dataScope: 'district_aggregate',
    permissions: [
      'panel:produksi',
      'panel:logistik',
      'panel:performa_anggota',
      'panel:performa_komoditas',
      'export:pdf',
      'view:aggregate_members',
    ],
    panelAccess: {
      produksi: 'aggregate',
      stok: 'none',
      penjualan: 'none',
      logistik: 'view_only',
      cashflow: 'none',
      performa_anggota: 'aggregate',
      performa_komoditas: 'aggregate',
      risiko: 'none',
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 🏦 Bank / Lembaga Keuangan
  // ─────────────────────────────────────────────────────────────────────────
  bank: {
    key: 'bank',
    label: 'Bank / Lembaga Keuangan',
    labelEn: 'Bank / Financial Institution',
    description: 'Read-only cashflow, credit scoring, performa komoditas, dan risiko',
    icon: '💰',
    color: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400',
    dataScope: 'koperasi',
    permissions: [
      'panel:cashflow',
      'panel:performa_anggota',
      'panel:performa_komoditas',
      'panel:risiko',
      'export:pdf',
      'view:credit_scoring',
    ],
    panelAccess: {
      produksi: 'none',
      stok: 'none',
      penjualan: 'none',
      logistik: 'none',
      cashflow: 'aggregate',
      performa_anggota: 'consent_required',
      performa_komoditas: 'view_only',
      risiko: 'view_only',
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 🏢 Kementerian / Bappenas (National Government)
  // ─────────────────────────────────────────────────────────────────────────
  kementerian: {
    key: 'kementerian',
    label: 'Kementerian / Bappenas',
    labelEn: 'National Government',
    description: 'Agregat nasional — produksi, komoditas, logistik untuk kebijakan & SDGs',
    icon: '🏢',
    color: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400',
    dataScope: 'national_aggregate',
    permissions: [
      'panel:produksi',
      'panel:performa_komoditas',
      'panel:logistik',
      'export:pdf',
      'export:excel',
    ],
    panelAccess: {
      produksi: 'aggregate',
      stok: 'none',
      penjualan: 'none',
      logistik: 'view_only',
      cashflow: 'none',
      performa_anggota: 'none',
      performa_komoditas: 'aggregate',
      risiko: 'none',
    },
  },

  // ─────────────────────────────────────────────────────────────────────────
  // 🔧 System Administrator
  // ─────────────────────────────────────────────────────────────────────────
  sysadmin: {
    key: 'sysadmin',
    label: 'System Administrator',
    labelEn: 'System Administrator',
    description: 'Akses penuh semua panel & koperasi, manajemen role, audit log, integrasi',
    icon: '🔧',
    color: 'bg-slate-100 text-slate-800 dark:bg-slate-900/30 dark:text-slate-400',
    dataScope: 'all_koperasi',
    permissions: [
      'panel:produksi',
      'panel:stok',
      'panel:penjualan',
      'panel:logistik',
      'panel:cashflow',
      'panel:performa_anggota',
      'panel:performa_komoditas',
      'panel:risiko',
      'export:pdf',
      'export:excel',
      'view:individual_members',
      'capability:manage_roles',
      'capability:manage_integrations',
      'capability:view_audit_logs',
      'capability:set_alert_thresholds',
      'capability:export_templates',
    ],
    panelAccess: {
      produksi: 'full',
      stok: 'full',
      penjualan: 'full',
      logistik: 'full',
      cashflow: 'view_only', // No financial approval (separation of duties)
      performa_anggota: 'full',
      performa_komoditas: 'full',
      risiko: 'full',
    },
  },
}

/** All available roles as an ordered array (for login selector) */
export const ALL_ROLES: Role[] = [
  'petani',
  'kasir',
  'logistik_manager',
  'koperasi_manager',
  'ketua',
  'pemda',
  'bank',
  'kementerian',
  'sysadmin',
]

/** Get role config by key */
export function getRoleConfig(role: Role): RoleConfig {
  return ROLE_CONFIGS[role]
}

/** Get role display label */
export function getRoleLabel(role: Role): string {
  return ROLE_CONFIGS[role].label
}

/** Get role icon emoji */
export function getRoleIcon(role: Role): string {
  return ROLE_CONFIGS[role].icon
}

/** Get role badge color class */
export function getRoleColor(role: Role): string {
  return ROLE_CONFIGS[role].color
}
or(role: Role): string {
  return ROLE_CONFIGS[role].color
}
