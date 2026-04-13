export type KelompokRecord = {
  id: string
  nama: string
  ketua: string
  desa: string
  koperasi: string
  kecamatan: string
  anggota: number
  luasTotal: number
  komoditas: string[]
  produksi: number
  status: 'aktif' | 'nonaktif'
  ringkasan: string
  kontakLapangan: string
  anggotaInti: Array<{
    nama: string
    peran: string
    fokus: string
  }>
}

export const kelompokData: KelompokRecord[] = [
  {
    id: 'KT001',
    nama: 'Kelompok Tani Makmur Jaya',
    ketua: 'Pak Slamet Widodo',
    desa: 'Sukamaju',
    koperasi: 'Kop. Maju Jaya',
    kecamatan: 'Cianjur',
    anggota: 25,
    luasTotal: 45.5,
    komoditas: ['Padi', 'Jagung', 'Kedelai'],
    produksi: 85,
    status: 'aktif',
    ringkasan:
      'Kelompok ini menjadi pusat produksi pangan utama dengan fokus pada sinkronisasi panen dan penyimpanan gudang desa.',
    kontakLapangan: '0812-3456-7801',
    anggotaInti: [
      { nama: 'Pak Slamet Widodo', peran: 'Ketua', fokus: 'Koordinasi panen dan kemitraan koperasi' },
      { nama: 'Bu Siti Aminah', peran: 'Sekretaris', fokus: 'Validasi data anggota dan pelaporan' },
      { nama: 'Pak Rudi Hartono', peran: 'Koordinator Produksi', fokus: 'Penjadwalan tanam dan monitoring hasil' },
    ],
  },
  {
    id: 'KT002',
    nama: 'Kelompok Tani Sumber Rezeki',
    ketua: 'Pak Hendra Wijaya',
    desa: 'Cibodas',
    koperasi: 'Kop. Mandiri',
    kecamatan: 'Lembang',
    anggota: 18,
    luasTotal: 32,
    komoditas: ['Kentang', 'Wortel', 'Kubis', 'Brokoli'],
    produksi: 92,
    status: 'aktif',
    ringkasan:
      'Kelompok hortikultura dengan fokus pada kualitas grade dan rotasi panen mingguan untuk memasok buyer regional.',
    kontakLapangan: '0812-3456-7802',
    anggotaInti: [
      { nama: 'Pak Hendra Wijaya', peran: 'Ketua', fokus: 'Koordinasi buyer dan distribusi pasca panen' },
      { nama: 'Bu Rina Permata', peran: 'Bendahara', fokus: 'Administrasi simpan pinjam kelompok' },
      { nama: 'Pak Ade Prasetyo', peran: 'Koordinator Lapangan', fokus: 'Pemetaan lahan dan kesiapan panen' },
    ],
  },
  {
    id: 'KT003',
    nama: 'Kelompok Nelayan Bahari',
    ketua: 'Pak Ahmad Sudirman',
    desa: 'Pantai Indah',
    koperasi: 'Kop. Bahari',
    kecamatan: 'Palabuhanratu',
    anggota: 15,
    luasTotal: 0,
    komoditas: ['Ikan Tongkol', 'Udang', 'Cumi', 'Kepiting'],
    produksi: 78,
    status: 'aktif',
    ringkasan:
      'Kelompok nelayan dengan pola operasi berbasis cuaca dan cold chain untuk menjaga kualitas hasil tangkap.',
    kontakLapangan: '0812-3456-7803',
    anggotaInti: [
      { nama: 'Pak Ahmad Sudirman', peran: 'Ketua', fokus: 'Sinkronisasi jadwal tangkap dan logistik' },
      { nama: 'Bu Dian Lestari', peran: 'Sekretaris', fokus: 'Pencatatan hasil tangkap dan mutu' },
      { nama: 'Pak Beni Surya', peran: 'Koordinator Cold Chain', fokus: 'Penanganan produk suhu dingin' },
    ],
  },
  {
    id: 'KT004',
    nama: 'Kelompok Tani Berkah',
    ketua: 'Bu Aminah',
    desa: 'Karawang',
    koperasi: 'Kop. Maju Jaya',
    kecamatan: 'Karawang',
    anggota: 12,
    luasTotal: 22,
    komoditas: ['Padi'],
    produksi: 65,
    status: 'nonaktif',
    ringkasan:
      'Kelompok sedang dalam fase reaktivasi setelah restrukturisasi internal dan validasi ulang data anggota.',
    kontakLapangan: '0812-3456-7804',
    anggotaInti: [
      { nama: 'Bu Aminah', peran: 'Ketua', fokus: 'Pemulihan operasional kelompok' },
      { nama: 'Pak Yusuf Darma', peran: 'Pendamping', fokus: 'Penguatan tata kelola dan administrasi' },
      { nama: 'Bu Nia Laras', peran: 'Koordinator Anggota', fokus: 'Verifikasi ulang anggota aktif' },
    ],
  },
]

export function getKelompokById(id: string) {
  return kelompokData.find((kelompok) => kelompok.id.toUpperCase() === id.toUpperCase())
}
