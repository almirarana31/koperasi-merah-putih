const normalizeScope = (scopeLabel?: string) => {
  const cleaned = scopeLabel?.trim()
  return cleaned && cleaned.length > 0 ? cleaned : "scope aktif"
}

const normalizeQuery = (query: string) => query.toLowerCase().replace(/\s+/g, " ").trim()

export const getAIResponse = (query: string, scopeLabel?: string): string => {
  const lowerQuery = normalizeQuery(query)
  const scope = normalizeScope(scopeLabel)
  const exactResponses: Record<string, string> = {
    "ringkasan performa nasional hari ini": `Ringkasan Performa Nasional Hari Ini untuk ${scope}:

- Total unit aktif: 1.248
- NPL agregat: 2,4%
- Anggota baru bulan berjalan: 1.240
- Produksi agregat: 12.500 ton
- Ketersediaan stok strategis: 94% dari target buffer

Prioritas tindak lanjut:
- Audit preventif tiga koperasi dengan kenaikan NPL mingguan
- Jaga suplai wilayah timur yang tumbuh 8,2% di atas target
- Optimalkan distribusi Jawa-Bali untuk menjaga margin harian`,
    "audit efisiensi logistik rute 04": `Audit Efisiensi Logistik Rute 04:

- Load factor: 78%
- Ketepatan waktu: 91%
- Biaya per ton-km: Rp428
- Deviasi waktu bongkar: +18 menit

Temuan utama:
- Dua titik transit masih menciptakan idle time berlebih
- Return trip belum terisi optimal pada 3 dari 5 perjalanan terakhir
- Konsolidasi muatan antarkoperasi masih bisa dinaikkan 12%

Tindak lanjut:
- Gabungkan pickup pagi pada node Garut Selatan
- Geser slot keberangkatan 35 menit lebih awal
- Isi muatan balik dengan stok kering prioritas`,
    "forecast ketahanan pangan q3 2026": `Forecast Ketahanan Pangan Q3 2026:

- Proyeksi produksi nasional: 38.400 ton
- Cadangan aman: 11,2 minggu
- Wilayah paling kuat: Jawa Barat, Jawa Tengah, Sulawesi Selatan
- Wilayah paling sensitif: Sumatra Barat dan Nusa Tenggara Timur

Risiko kuartal:
- Curah hujan tidak merata pada awal Agustus
- Volatilitas cabai dan bawang tetap tinggi
- Kebutuhan cold-chain naik menjelang puncak panen hortikultura

Rekomendasi:
- Tambah buffer distribusi untuk komoditas cepat rusak
- Kunci kontrak pasok antarwilayah mulai akhir Juni
- Pantau stok beras dan jagung mingguan secara ketat`,
    "analisis anomali stok koperasi sumatra": `Analisis Anomali Stok Koperasi Sumatra:

- Terdeteksi 4 unit dengan selisih stok di atas ambang 6%
- Komoditas paling terdampak: cabai merah, bawang merah, dan beras medium
- Pola anomali dominan muncul pada pembaruan stok malam hari

Unit prioritas:
1. Koperasi Tani Makmur - selisih 8,4%
2. Koperasi Pangan Sejahtera - selisih 7,1%
3. Koperasi Rantai Tani Barat - selisih 6,8%

Tindak lanjut:
- Cocokkan manifest keluar masuk 72 jam terakhir
- Audit fisik gudang cabai dan bawang terlebih dahulu
- Bekukan koreksi manual sampai rekonsiliasi selesai`,
  }

  const exactResponse = exactResponses[lowerQuery]
  if (exactResponse) return exactResponse

  if (lowerQuery.includes("performa nasional") || lowerQuery.includes("ringkasan")) {
    return `Ringkasan Kinerja untuk ${scope}:

- Total unit aktif: 1.248
- NPL agregat: 2,4%
- Anggota baru bulan berjalan: 1.240
- Produksi agregat: 12.500 ton

Prioritas tindak lanjut:
- Audit preventif untuk tiga koperasi dengan tren NPL meningkat
- Jaga suplai wilayah timur yang sedang tumbuh di atas target
- Optimalkan rute distribusi Jawa-Bali untuk menjaga margin`
  }

  if (lowerQuery.includes("audit") || lowerQuery.includes("unit koperasi")) {
    return `Prioritas Audit untuk ${scope}:

1. Koperasi Maju Jaya, Jawa Barat
   - Skor kesehatan: 58
   - Rasio likuiditas di bawah batas aman
   - NPL: 4,8%

2. Koperasi Tani Makmur, Sumatra
   - Skor kesehatan: 64
   - Pelaporan stok terlambat
   - NPL: 3,1%

Saran:
- Dahulukan audit lapangan pada unit dengan likuiditas tertekan
- Cocokkan stok fisik dengan laporan distribusi terakhir`
  }

  if (lowerQuery.includes("npl") || lowerQuery.includes("kredit macet")) {
    return `Status NPL untuk ${scope}:

- Jawa: 1,8% dan stabil
- Sumatra: 3,2% dan perlu perhatian
- Sulawesi: 2,1% dan membaik
- Bali: 1,5% dan sangat sehat

Rekomendasi:
- Perketat verifikasi pinjaman baru di wilayah dengan tren naik
- Aktifkan pendampingan usaha untuk anggota berisiko sedang
- Pantau komoditas hortikultura dengan volatilitas harga tinggi`
  }

  if (lowerQuery.includes("stok") || lowerQuery.includes("inventory")) {
    return `Status Stok untuk ${scope}:

- Beras Grade A: 120 ton, aman
- Cabai Merah: 2,5 ton, menipis
- Tomat: 1,8 ton, aman
- Wortel: 3,2 ton, aman

Rekomendasi:
- Tambah pasokan cabai merah dalam dua hari
- Pertahankan buffer stok lima sampai tujuh hari untuk komoditas utama`
  }

  if (lowerQuery.includes("harga") || lowerQuery.includes("prediksi")) {
    return `Prediksi Harga untuk ${scope}:

- Harga cabai saat ini: Rp45.000 per kg
- Proyeksi tiga hari: Rp48.000 per kg
- Proyeksi tujuh hari: Rp52.000 per kg

Rekomendasi:
- Tahan stok cabai selama tiga sampai tujuh hari jika kapasitas gudang aman
- Siapkan redistribusi lintas wilayah untuk menahan lonjakan harga`
  }

  if (lowerQuery.includes("anggota") || lowerQuery.includes("member")) {
    return `Sorotan Anggota untuk ${scope}:

1. Pak Budi Santoso
   - Transaksi: Rp45,5 juta
   - Volume: 2,5 ton

2. Ibu Siti Aminah
   - Transaksi: Rp38,2 juta
   - Volume: 1,8 ton

3. Pak Ahmad Dahlan
   - Transaksi: Rp32,7 juta
   - Volume: 1,5 ton

Saran:
- Prioritaskan pembinaan anggota dengan volume tinggi agar distribusi tetap stabil`
  }

  if (lowerQuery.includes("rekomendasi") || lowerQuery.includes("jual")) {
    return `Rekomendasi Komoditas untuk ${scope}:

- Cabai Merah: prioritas tinggi, demand meningkat
- Beras Grade A: stabil, margin konsisten
- Tomat: perlu perhatian, permintaan melemah

Langkah yang disarankan:
- Fokus penjualan pada komoditas dengan demand tinggi
- Jaga ritme distribusi untuk komoditas yang marginnya stabil
- Kurangi eksposur stok untuk komoditas dengan tren turun`
  }

  return `Analisis siap untuk ${scope}.

Saya dapat membantu dengan:
- Ringkasan performa dan kesehatan unit
- Prioritas audit dan risiko NPL
- Prediksi harga dan kebutuhan stok
- Analisis anggota dan rekomendasi tindak lanjut

Silakan ajukan pertanyaan yang lebih spesifik agar saya bisa memberi jawaban yang lebih terarah.`
}
