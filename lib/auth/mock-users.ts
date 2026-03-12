// ============================================================================
// Mock Users — One user per role for testing
// ============================================================================

import type { User, Role } from '@/lib/rbac'

export const MOCK_USERS: Record<Role, User> = {
  petani: {
    id: 'USR-001',
    name: 'Pak Budi Santoso',
    email: 'budi.santoso@petani.desa.id',
    role: 'petani',
    koperasiId: 'KOP-001',
    koperasiName: 'Koperasi Merah Putih Sukamaju',
  },
  kasir: {
    id: 'USR-002',
    name: 'Ibu Siti Rahayu',
    email: 'siti.rahayu@koperasi.desa.id',
    role: 'kasir',
    koperasiId: 'KOP-001',
    koperasiName: 'Koperasi Merah Putih Sukamaju',
  },
  logistik_manager: {
    id: 'USR-003',
    name: 'Pak Andi Wijaya',
    email: 'andi.wijaya@koperasi.desa.id',
    role: 'logistik_manager',
    koperasiId: 'KOP-001',
    koperasiName: 'Koperasi Merah Putih Sukamaju',
  },
  koperasi_manager: {
    id: 'USR-004',
    name: 'Ibu Dewi Lestari',
    email: 'dewi.lestari@koperasi.desa.id',
    role: 'koperasi_manager',
    koperasiId: 'KOP-001',
    koperasiName: 'Koperasi Merah Putih Sukamaju',
  },
  ketua: {
    id: 'USR-005',
    name: 'Pak Haji Ahmad',
    email: 'ahmad@koperasi.desa.id',
    role: 'ketua',
    koperasiId: 'KOP-001',
    koperasiName: 'Koperasi Merah Putih Sukamaju',
  },
  pemda: {
    id: 'USR-006',
    name: 'Dr. Ratna Sari, M.Si',
    email: 'ratna.sari@pemda.garut.go.id',
    role: 'pemda',
    districtId: 'DIST-3201',
    districtName: 'Kabupaten Garut',
    provinceId: 'PROV-32',
    provinceName: 'Jawa Barat',
  },
  bank: {
    id: 'USR-007',
    name: 'Pak Irwan Setiawan',
    email: 'irwan.setiawan@bri.co.id',
    role: 'bank',
    koperasiId: 'KOP-001',
    koperasiName: 'Koperasi Merah Putih Sukamaju',
  },
  kementerian: {
    id: 'USR-008',
    name: 'Dr. Maya Indah, M.Sc',
    email: 'maya.indah@kemendesa.go.id',
    role: 'kementerian',
    provinceId: 'PROV-ALL',
    provinceName: 'Nasional',
  },
  sysadmin: {
    id: 'USR-009',
    name: 'Admin Sistem',
    email: 'admin@dnadesa.id',
    role: 'sysadmin',
  },
}

/** Get mock user for a given role */
export function getMockUser(role: Role): User {
  return MOCK_USERS[role]
}

/** Get all mock users as an array */
export function getAllMockUsers(): User[] {
  return Object.values(MOCK_USERS)
}
