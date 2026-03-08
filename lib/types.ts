// KOPDES - Koperasi Digital Operating System Types

// Member Types
export type MemberType = 'petani' | 'nelayan' | 'umkm' | 'pengepul'
export type MemberStatus = 'aktif' | 'nonaktif' | 'pending'

export interface Member {
  id: string
  nik: string
  nama: string
  tipe: MemberType
  alamat: string
  desa: string
  kecamatan: string
  noHp: string
  tanggalDaftar: string
  status: MemberStatus
  fotoUrl?: string
  komoditas: string[]
  luasLahan?: number // in hectares
  simpananPokok: number
  simpananWajib: number
}

// Commodity Types
export type CommodityCategory = 'pangan' | 'hortikultura' | 'perkebunan' | 'peternakan' | 'perikanan'
export type QualityGrade = 'A' | 'B' | 'C'

export interface Commodity {
  id: string
  nama: string
  kategori: CommodityCategory
  satuan: string
  hargaAcuan: number
  stokTotal: number
  gambarUrl?: string
}

// Production/Harvest Types
export interface Production {
  id: string
  memberId: string
  memberNama: string
  komoditasId: string
  komoditasNama: string
  jumlah: number
  satuan: string
  tanggalPanen: string
  grade: QualityGrade
  status: 'dicatat' | 'diverifikasi' | 'disimpan' | 'terjual'
  lokasiGudang?: string
}

// Warehouse & Stock Types
export interface Warehouse {
  id: string
  nama: string
  alamat: string
  kapasitas: number
  kapasitasTerpakai: number
  tipe: 'reguler' | 'cold-storage'
  suhu?: number
  status: 'aktif' | 'maintenance'
}

export interface Stock {
  id: string
  komoditasId: string
  komoditasNama: string
  gudangId: string
  gudangNama: string
  jumlah: number
  satuan: string
  grade: QualityGrade
  tanggalMasuk: string
  tanggalKadaluarsa?: string
  batchCode: string
}

// Order & Market Types
export type OrderStatus = 'pending' | 'diproses' | 'dikirim' | 'selesai' | 'dibatalkan'
export type BuyerType = 'hotel' | 'restoran' | 'retail' | 'fmcg' | 'eksportir'

export interface Buyer {
  id: string
  nama: string
  tipe: BuyerType
  alamat: string
  kontak: string
  email: string
  totalTransaksi: number
}

export interface Order {
  id: string
  nomorPO: string
  buyerId: string
  buyerNama: string
  tanggalOrder: string
  tanggalKirim?: string
  items: OrderItem[]
  totalHarga: number
  status: OrderStatus
  alamatKirim: string
}

export interface OrderItem {
  komoditasId: string
  komoditasNama: string
  jumlah: number
  satuan: string
  hargaSatuan: number
  grade: QualityGrade
}

// Logistics Types
export type ShipmentStatus = 'dijadwalkan' | 'pickup' | 'transit' | 'delivered'

export interface Shipment {
  id: string
  orderId: string
  nomorResi: string
  driver: string
  noHpDriver: string
  kendaraan: string
  platNomor: string
  tanggalBerangkat: string
  tanggalSampai?: string
  status: ShipmentStatus
  rute: string[]
}

// Finance Types
export type TransactionType = 'simpanan' | 'pinjaman' | 'penjualan' | 'pembelian' | 'operasional'

export interface Transaction {
  id: string
  tanggal: string
  tipe: TransactionType
  kategori: string
  deskripsi: string
  debit: number
  kredit: number
  saldo: number
  referensi?: string
}

export interface Loan {
  id: string
  memberId: string
  memberNama: string
  jumlahPinjaman: number
  bunga: number
  tenor: number // in months
  tanggalPinjam: string
  tanggalJatuhTempo: string
  sisaPinjaman: number
  status: 'aktif' | 'lunas' | 'menunggak'
}

// Dashboard Stats
export interface DashboardStats {
  totalAnggota: number
  totalKomoditas: number
  totalStok: number
  nilaiStok: number
  pendapatanBulanIni: number
  orderAktif: number
  simpananTotal: number
  pinjamanAktif: number
}
