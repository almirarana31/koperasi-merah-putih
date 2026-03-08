import type {
  Member,
  Commodity,
  Production,
  Warehouse,
  Stock,
  Buyer,
  Order,
  Shipment,
  Transaction,
  Loan,
  DashboardStats,
} from './types'

// Mock Members
export const members: Member[] = [
  {
    id: 'M001',
    nik: '3201234567890001',
    nama: 'Pak Slamet Widodo',
    tipe: 'petani',
    alamat: 'Jl. Sawah Indah No. 12',
    desa: 'Sukamaju',
    kecamatan: 'Cianjur',
    noHp: '081234567890',
    tanggalDaftar: '2023-01-15',
    status: 'aktif',
    komoditas: ['Padi', 'Jagung'],
    luasLahan: 2.5,
    simpananPokok: 500000,
    simpananWajib: 1200000,
  },
  {
    id: 'M002',
    nik: '3201234567890002',
    nama: 'Bu Sri Wahyuni',
    tipe: 'petani',
    alamat: 'Jl. Kebun Raya No. 5',
    desa: 'Sukamaju',
    kecamatan: 'Cianjur',
    noHp: '081234567891',
    tanggalDaftar: '2023-02-20',
    status: 'aktif',
    komoditas: ['Cabai', 'Tomat', 'Bawang Merah'],
    luasLahan: 1.2,
    simpananPokok: 500000,
    simpananWajib: 800000,
  },
  {
    id: 'M003',
    nik: '3201234567890003',
    nama: 'Pak Ahmad Sudirman',
    tipe: 'nelayan',
    alamat: 'Jl. Pantai Selatan No. 8',
    desa: 'Pantai Indah',
    kecamatan: 'Palabuhanratu',
    noHp: '081234567892',
    tanggalDaftar: '2023-03-10',
    status: 'aktif',
    komoditas: ['Ikan Tongkol', 'Udang', 'Cumi'],
    simpananPokok: 500000,
    simpananWajib: 600000,
  },
  {
    id: 'M004',
    nik: '3201234567890004',
    nama: 'Bu Ratna Dewi',
    tipe: 'umkm',
    alamat: 'Jl. Pasar Baru No. 23',
    desa: 'Pasar Minggu',
    kecamatan: 'Bogor',
    noHp: '081234567893',
    tanggalDaftar: '2023-04-05',
    status: 'aktif',
    komoditas: ['Keripik Singkong', 'Dodol'],
    simpananPokok: 500000,
    simpananWajib: 1500000,
  },
  {
    id: 'M005',
    nik: '3201234567890005',
    nama: 'Pak Budi Santoso',
    tipe: 'pengepul',
    alamat: 'Jl. Gudang No. 1',
    desa: 'Cikupa',
    kecamatan: 'Tangerang',
    noHp: '081234567894',
    tanggalDaftar: '2023-05-12',
    status: 'aktif',
    komoditas: ['Beras', 'Gabah'],
    simpananPokok: 500000,
    simpananWajib: 2000000,
  },
  {
    id: 'M006',
    nik: '3201234567890006',
    nama: 'Pak Hendra Wijaya',
    tipe: 'petani',
    alamat: 'Jl. Perkebunan No. 7',
    desa: 'Cibodas',
    kecamatan: 'Lembang',
    noHp: '081234567895',
    tanggalDaftar: '2023-06-18',
    status: 'aktif',
    komoditas: ['Kentang', 'Wortel', 'Kubis'],
    luasLahan: 3.0,
    simpananPokok: 500000,
    simpananWajib: 900000,
  },
  {
    id: 'M007',
    nik: '3201234567890007',
    nama: 'Bu Aminah',
    tipe: 'petani',
    alamat: 'Jl. Sawah Luas No. 15',
    desa: 'Karawang',
    kecamatan: 'Karawang',
    noHp: '081234567896',
    tanggalDaftar: '2023-07-22',
    status: 'nonaktif',
    komoditas: ['Padi'],
    luasLahan: 1.8,
    simpananPokok: 500000,
    simpananWajib: 400000,
  },
  {
    id: 'M008',
    nik: '3201234567890008',
    nama: 'Pak Darmawan',
    tipe: 'peternakan' as any,
    alamat: 'Jl. Peternakan No. 3',
    desa: 'Cisarua',
    kecamatan: 'Bogor',
    noHp: '081234567897',
    tanggalDaftar: '2023-08-30',
    status: 'aktif',
    komoditas: ['Telur Ayam', 'Ayam Potong'],
    simpananPokok: 500000,
    simpananWajib: 1100000,
  },
]

// Mock Commodities
export const commodities: Commodity[] = [
  { id: 'C001', nama: 'Beras Premium', kategori: 'pangan', satuan: 'kg', hargaAcuan: 14000, stokTotal: 5000 },
  { id: 'C002', nama: 'Gabah Kering', kategori: 'pangan', satuan: 'kg', hargaAcuan: 6500, stokTotal: 8000 },
  { id: 'C003', nama: 'Jagung Pipil', kategori: 'pangan', satuan: 'kg', hargaAcuan: 5500, stokTotal: 3500 },
  { id: 'C004', nama: 'Cabai Merah', kategori: 'hortikultura', satuan: 'kg', hargaAcuan: 45000, stokTotal: 800 },
  { id: 'C005', nama: 'Bawang Merah', kategori: 'hortikultura', satuan: 'kg', hargaAcuan: 35000, stokTotal: 1200 },
  { id: 'C006', nama: 'Tomat', kategori: 'hortikultura', satuan: 'kg', hargaAcuan: 12000, stokTotal: 600 },
  { id: 'C007', nama: 'Kentang', kategori: 'hortikultura', satuan: 'kg', hargaAcuan: 15000, stokTotal: 2000 },
  { id: 'C008', nama: 'Wortel', kategori: 'hortikultura', satuan: 'kg', hargaAcuan: 10000, stokTotal: 1500 },
  { id: 'C009', nama: 'Ikan Tongkol', kategori: 'perikanan', satuan: 'kg', hargaAcuan: 28000, stokTotal: 400 },
  { id: 'C010', nama: 'Udang Vaname', kategori: 'perikanan', satuan: 'kg', hargaAcuan: 85000, stokTotal: 200 },
  { id: 'C011', nama: 'Telur Ayam', kategori: 'peternakan', satuan: 'kg', hargaAcuan: 28000, stokTotal: 1000 },
  { id: 'C012', nama: 'Kopi Arabika', kategori: 'perkebunan', satuan: 'kg', hargaAcuan: 120000, stokTotal: 500 },
]

// Mock Productions
export const productions: Production[] = [
  { id: 'P001', memberId: 'M001', memberNama: 'Pak Slamet Widodo', komoditasId: 'C001', komoditasNama: 'Beras Premium', jumlah: 500, satuan: 'kg', tanggalPanen: '2024-01-15', grade: 'A', status: 'disimpan', lokasiGudang: 'Gudang Utama' },
  { id: 'P002', memberId: 'M001', memberNama: 'Pak Slamet Widodo', komoditasId: 'C003', komoditasNama: 'Jagung Pipil', jumlah: 300, satuan: 'kg', tanggalPanen: '2024-01-20', grade: 'B', status: 'disimpan', lokasiGudang: 'Gudang Utama' },
  { id: 'P003', memberId: 'M002', memberNama: 'Bu Sri Wahyuni', komoditasId: 'C004', komoditasNama: 'Cabai Merah', jumlah: 150, satuan: 'kg', tanggalPanen: '2024-02-01', grade: 'A', status: 'terjual' },
  { id: 'P004', memberId: 'M002', memberNama: 'Bu Sri Wahyuni', komoditasId: 'C006', komoditasNama: 'Tomat', jumlah: 200, satuan: 'kg', tanggalPanen: '2024-02-05', grade: 'A', status: 'disimpan', lokasiGudang: 'Cold Storage' },
  { id: 'P005', memberId: 'M003', memberNama: 'Pak Ahmad Sudirman', komoditasId: 'C009', komoditasNama: 'Ikan Tongkol', jumlah: 100, satuan: 'kg', tanggalPanen: '2024-02-10', grade: 'A', status: 'disimpan', lokasiGudang: 'Cold Storage' },
  { id: 'P006', memberId: 'M006', memberNama: 'Pak Hendra Wijaya', komoditasId: 'C007', komoditasNama: 'Kentang', jumlah: 400, satuan: 'kg', tanggalPanen: '2024-02-12', grade: 'A', status: 'dicatat' },
  { id: 'P007', memberId: 'M006', memberNama: 'Pak Hendra Wijaya', komoditasId: 'C008', komoditasNama: 'Wortel', jumlah: 250, satuan: 'kg', tanggalPanen: '2024-02-14', grade: 'B', status: 'diverifikasi' },
]

// Mock Warehouses
export const warehouses: Warehouse[] = [
  { id: 'W001', nama: 'Gudang Utama', alamat: 'Jl. Industri No. 1, Cianjur', kapasitas: 10000, kapasitasTerpakai: 6500, tipe: 'reguler', status: 'aktif' },
  { id: 'W002', nama: 'Cold Storage', alamat: 'Jl. Industri No. 2, Cianjur', kapasitas: 2000, kapasitasTerpakai: 800, tipe: 'cold-storage', suhu: 4, status: 'aktif' },
  { id: 'W003', nama: 'Gudang Transit', alamat: 'Jl. Pelabuhan No. 5, Jakarta', kapasitas: 5000, kapasitasTerpakai: 1200, tipe: 'reguler', status: 'aktif' },
]

// Mock Stock
export const stocks: Stock[] = [
  { id: 'S001', komoditasId: 'C001', komoditasNama: 'Beras Premium', gudangId: 'W001', gudangNama: 'Gudang Utama', jumlah: 3000, satuan: 'kg', grade: 'A', tanggalMasuk: '2024-01-16', batchCode: 'BP-2024-001' },
  { id: 'S002', komoditasId: 'C001', komoditasNama: 'Beras Premium', gudangId: 'W001', gudangNama: 'Gudang Utama', jumlah: 2000, satuan: 'kg', grade: 'B', tanggalMasuk: '2024-01-20', batchCode: 'BP-2024-002' },
  { id: 'S003', komoditasId: 'C003', komoditasNama: 'Jagung Pipil', gudangId: 'W001', gudangNama: 'Gudang Utama', jumlah: 3500, satuan: 'kg', grade: 'A', tanggalMasuk: '2024-01-22', batchCode: 'JP-2024-001' },
  { id: 'S004', komoditasId: 'C004', komoditasNama: 'Cabai Merah', gudangId: 'W002', gudangNama: 'Cold Storage', jumlah: 300, satuan: 'kg', grade: 'A', tanggalMasuk: '2024-02-02', tanggalKadaluarsa: '2024-02-16', batchCode: 'CM-2024-001' },
  { id: 'S005', komoditasId: 'C006', komoditasNama: 'Tomat', gudangId: 'W002', gudangNama: 'Cold Storage', jumlah: 200, satuan: 'kg', grade: 'A', tanggalMasuk: '2024-02-06', tanggalKadaluarsa: '2024-02-20', batchCode: 'TM-2024-001' },
  { id: 'S006', komoditasId: 'C009', komoditasNama: 'Ikan Tongkol', gudangId: 'W002', gudangNama: 'Cold Storage', jumlah: 100, satuan: 'kg', grade: 'A', tanggalMasuk: '2024-02-11', tanggalKadaluarsa: '2024-02-18', batchCode: 'IT-2024-001' },
]

// Mock Buyers
export const buyers: Buyer[] = [
  { id: 'B001', nama: 'Hotel Grand Hyatt', tipe: 'hotel', alamat: 'Jl. Sudirman No. 1, Jakarta', kontak: '021-1234567', email: 'procurement@grandhyatt.com', totalTransaksi: 450000000 },
  { id: 'B002', nama: 'Restoran Padang Sederhana', tipe: 'restoran', alamat: 'Jl. Sabang No. 15, Jakarta', kontak: '021-2345678', email: 'order@padasederhana.com', totalTransaksi: 85000000 },
  { id: 'B003', nama: 'Superindo', tipe: 'retail', alamat: 'Jl. Gatot Subroto No. 10, Jakarta', kontak: '021-3456789', email: 'supplier@superindo.co.id', totalTransaksi: 320000000 },
  { id: 'B004', nama: 'PT Indofood', tipe: 'fmcg', alamat: 'Jl. Industri Raya, Tangerang', kontak: '021-4567890', email: 'procurement@indofood.com', totalTransaksi: 1200000000 },
  { id: 'B005', nama: 'CV Eksport Nusantara', tipe: 'eksportir', alamat: 'Jl. Pelabuhan No. 20, Jakarta', kontak: '021-5678901', email: 'order@eksportnusantara.com', totalTransaksi: 750000000 },
]

// Mock Orders
export const orders: Order[] = [
  {
    id: 'O001',
    nomorPO: 'PO-2024-001',
    buyerId: 'B001',
    buyerNama: 'Hotel Grand Hyatt',
    tanggalOrder: '2024-02-01',
    tanggalKirim: '2024-02-05',
    items: [
      { komoditasId: 'C001', komoditasNama: 'Beras Premium', jumlah: 500, satuan: 'kg', hargaSatuan: 14000, grade: 'A' },
      { komoditasId: 'C004', komoditasNama: 'Cabai Merah', jumlah: 50, satuan: 'kg', hargaSatuan: 45000, grade: 'A' },
    ],
    totalHarga: 9250000,
    status: 'selesai',
    alamatKirim: 'Jl. Sudirman No. 1, Jakarta',
  },
  {
    id: 'O002',
    nomorPO: 'PO-2024-002',
    buyerId: 'B003',
    buyerNama: 'Superindo',
    tanggalOrder: '2024-02-10',
    items: [
      { komoditasId: 'C001', komoditasNama: 'Beras Premium', jumlah: 1000, satuan: 'kg', hargaSatuan: 13500, grade: 'B' },
      { komoditasId: 'C007', komoditasNama: 'Kentang', jumlah: 300, satuan: 'kg', hargaSatuan: 15000, grade: 'A' },
      { komoditasId: 'C008', komoditasNama: 'Wortel', jumlah: 200, satuan: 'kg', hargaSatuan: 10000, grade: 'A' },
    ],
    totalHarga: 20000000,
    status: 'diproses',
    alamatKirim: 'Jl. Gatot Subroto No. 10, Jakarta',
  },
  {
    id: 'O003',
    nomorPO: 'PO-2024-003',
    buyerId: 'B002',
    buyerNama: 'Restoran Padang Sederhana',
    tanggalOrder: '2024-02-12',
    items: [
      { komoditasId: 'C001', komoditasNama: 'Beras Premium', jumlah: 200, satuan: 'kg', hargaSatuan: 14000, grade: 'A' },
      { komoditasId: 'C004', komoditasNama: 'Cabai Merah', jumlah: 30, satuan: 'kg', hargaSatuan: 45000, grade: 'A' },
      { komoditasId: 'C005', komoditasNama: 'Bawang Merah', jumlah: 25, satuan: 'kg', hargaSatuan: 35000, grade: 'A' },
    ],
    totalHarga: 5025000,
    status: 'dikirim',
    alamatKirim: 'Jl. Sabang No. 15, Jakarta',
  },
  {
    id: 'O004',
    nomorPO: 'PO-2024-004',
    buyerId: 'B004',
    buyerNama: 'PT Indofood',
    tanggalOrder: '2024-02-14',
    items: [
      { komoditasId: 'C003', komoditasNama: 'Jagung Pipil', jumlah: 2000, satuan: 'kg', hargaSatuan: 5500, grade: 'A' },
    ],
    totalHarga: 11000000,
    status: 'pending',
    alamatKirim: 'Jl. Industri Raya, Tangerang',
  },
]

// Mock Shipments
export const shipments: Shipment[] = [
  { id: 'SH001', orderId: 'O001', nomorResi: 'KPD-2024-0001', driver: 'Pak Joko', noHpDriver: '081111222333', kendaraan: 'Truk Box', platNomor: 'B 1234 XYZ', tanggalBerangkat: '2024-02-04', tanggalSampai: '2024-02-05', status: 'delivered', rute: ['Gudang Utama', 'Tol Cipali', 'Jakarta'] },
  { id: 'SH002', orderId: 'O003', nomorResi: 'KPD-2024-0002', driver: 'Pak Surya', noHpDriver: '081222333444', kendaraan: 'Pickup', platNomor: 'B 5678 ABC', tanggalBerangkat: '2024-02-13', status: 'transit', rute: ['Gudang Utama', 'Tol Jagorawi', 'Jakarta Pusat'] },
]

// Mock Transactions
export const transactions: Transaction[] = [
  { id: 'T001', tanggal: '2024-02-01', tipe: 'penjualan', kategori: 'Penjualan Komoditas', deskripsi: 'Penjualan ke Hotel Grand Hyatt - PO-2024-001', debit: 0, kredit: 9250000, saldo: 159250000, referensi: 'O001' },
  { id: 'T002', tanggal: '2024-02-02', tipe: 'pembelian', kategori: 'Pembelian dari Anggota', deskripsi: 'Pembelian cabai dari Bu Sri Wahyuni', debit: 6750000, kredit: 0, saldo: 152500000, referensi: 'P003' },
  { id: 'T003', tanggal: '2024-02-05', tipe: 'operasional', kategori: 'Biaya Logistik', deskripsi: 'Biaya pengiriman ke Jakarta', debit: 500000, kredit: 0, saldo: 152000000 },
  { id: 'T004', tanggal: '2024-02-08', tipe: 'simpanan', kategori: 'Simpanan Wajib', deskripsi: 'Setoran simpanan wajib bulan Februari', debit: 0, kredit: 4000000, saldo: 156000000 },
  { id: 'T005', tanggal: '2024-02-10', tipe: 'pinjaman', kategori: 'Pencairan Pinjaman', deskripsi: 'Pencairan pinjaman Pak Slamet Widodo', debit: 10000000, kredit: 0, saldo: 146000000, referensi: 'L001' },
  { id: 'T006', tanggal: '2024-02-12', tipe: 'penjualan', kategori: 'Penjualan Komoditas', deskripsi: 'Penjualan ke Restoran Padang - PO-2024-003', debit: 0, kredit: 5025000, saldo: 151025000, referensi: 'O003' },
]

// Mock Loans
export const loans: Loan[] = [
  { id: 'L001', memberId: 'M001', memberNama: 'Pak Slamet Widodo', jumlahPinjaman: 10000000, bunga: 12, tenor: 12, tanggalPinjam: '2024-02-10', tanggalJatuhTempo: '2025-02-10', sisaPinjaman: 10000000, status: 'aktif' },
  { id: 'L002', memberId: 'M002', memberNama: 'Bu Sri Wahyuni', jumlahPinjaman: 5000000, bunga: 12, tenor: 6, tanggalPinjam: '2023-12-01', tanggalJatuhTempo: '2024-06-01', sisaPinjaman: 2500000, status: 'aktif' },
  { id: 'L003', memberId: 'M004', memberNama: 'Bu Ratna Dewi', jumlahPinjaman: 15000000, bunga: 10, tenor: 18, tanggalPinjam: '2023-08-15', tanggalJatuhTempo: '2025-02-15', sisaPinjaman: 8000000, status: 'aktif' },
  { id: 'L004', memberId: 'M006', memberNama: 'Pak Hendra Wijaya', jumlahPinjaman: 8000000, bunga: 12, tenor: 12, tanggalPinjam: '2023-06-01', tanggalJatuhTempo: '2024-06-01', sisaPinjaman: 0, status: 'lunas' },
]

// Dashboard Stats
export const dashboardStats: DashboardStats = {
  totalAnggota: 8,
  totalKomoditas: 12,
  totalStok: 9100,
  nilaiStok: 245500000,
  pendapatanBulanIni: 45275000,
  orderAktif: 3,
  simpananTotal: 8500000,
  pinjamanAktif: 20500000,
}

// Monthly revenue data for charts
export const monthlyRevenue = [
  { bulan: 'Jan', pendapatan: 38500000, pengeluaran: 25000000 },
  { bulan: 'Feb', pendapatan: 45275000, pengeluaran: 28000000 },
  { bulan: 'Mar', pendapatan: 52000000, pengeluaran: 31000000 },
  { bulan: 'Apr', pendapatan: 48000000, pengeluaran: 29000000 },
  { bulan: 'Mei', pendapatan: 55000000, pengeluaran: 33000000 },
  { bulan: 'Jun', pendapatan: 62000000, pengeluaran: 35000000 },
]

// Commodity distribution for pie chart
export const commodityDistribution = [
  { nama: 'Pangan', nilai: 45, fill: 'var(--chart-1)' },
  { nama: 'Hortikultura', nilai: 30, fill: 'var(--chart-2)' },
  { nama: 'Perikanan', nilai: 12, fill: 'var(--chart-3)' },
  { nama: 'Peternakan', nilai: 8, fill: 'var(--chart-4)' },
  { nama: 'Perkebunan', nilai: 5, fill: 'var(--chart-5)' },
]

// Recent activities
export const recentActivities = [
  { id: 1, waktu: '10 menit lalu', aksi: 'Order baru dari Superindo', tipe: 'order' },
  { id: 2, waktu: '25 menit lalu', aksi: 'Pak Hendra mencatat panen kentang 400kg', tipe: 'produksi' },
  { id: 3, waktu: '1 jam lalu', aksi: 'Pengiriman PO-2024-003 dalam perjalanan', tipe: 'logistik' },
  { id: 4, waktu: '2 jam lalu', aksi: 'Bu Sri menyetor simpanan wajib', tipe: 'keuangan' },
  { id: 5, waktu: '3 jam lalu', aksi: 'Stok cabai merah diperbarui', tipe: 'gudang' },
]

// Helper functions
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export function getMemberTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    petani: 'Petani',
    nelayan: 'Nelayan',
    umkm: 'UMKM',
    pengepul: 'Pengepul',
  }
  return labels[type] || type
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    aktif: 'bg-emerald-500/10 text-emerald-500',
    nonaktif: 'bg-gray-500/10 text-gray-500',
    pending: 'bg-amber-500/10 text-amber-500',
    diproses: 'bg-blue-500/10 text-blue-500',
    dikirim: 'bg-violet-500/10 text-violet-500',
    selesai: 'bg-emerald-500/10 text-emerald-500',
    dibatalkan: 'bg-red-500/10 text-red-500',
    lunas: 'bg-emerald-500/10 text-emerald-500',
    menunggak: 'bg-red-500/10 text-red-500',
  }
  return colors[status] || 'bg-gray-500/10 text-gray-500'
}
