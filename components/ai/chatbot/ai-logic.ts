export const getAIResponse = (query: string): string => {
  const lowerQuery = query.toLowerCase()

  if (lowerQuery.includes("performa nasional") || lowerQuery.includes("ringkasan")) {
    return `📊 **Executive Summary (Nasional):**

• **Total Unit Aktif:** 1,248 (99.8% Online)
• **NPL Agregat:** 2.4% (Zona Hijau ✓)
• **Anggota Baru:** +1,240 (↗️ 4.2% MoM)
• **Produksi Agregat:** 12,500 ton (+8% vs target)

**Rekomendasi Strategis:**
✓ Fokus pada Koperasi Wilayah Timur yang melampaui forecast
✓ Audit preventif untuk 3 unit dengan tren NPL naik
✓ Optimasi logistik Jawa-Bali untuk efisiensi margin`
  }

  if (lowerQuery.includes("audit") || lowerQuery.includes("unit koperasi")) {
    return `🔍 **Analisis Prioritas Audit:**

1. **Koperasi Maju Jaya (Jawa Barat)**
   - Skor: 58 (⚠️ KRITIS)
   - Masalah: Rasio likuiditas < 1.0
   - NPL: 4.8% (Mendekati batas intervensi)

2. **Koperasi Tani Makmur (Sumatra)**
   - Skor: 64 (⚠️ WASPADA)
   - Masalah: Penundaan pelaporan stok
   - NPL: 3.1%

**AI Insight:** Segera kirim tim audit untuk Koperasi Maju Jaya guna restrukturisasi piutang.`
  }

  if (lowerQuery.includes("npl") || lowerQuery.includes("kredit macet")) {
    return `🛡️ **Status NPL Agregat:** 2.4%

**Trend Wilayah:**
• Jawa: 1.8% (Stabil)
• Sumatra: 3.2% (Meningkat ⚠️)
• Sulawesi: 2.1% (Menurun ✓)
• Bali: 1.5% (Sangat Sehat ✓)

**Saran Mitigasi:**
✓ Terapkan skema asuransi gagal panen di Sumatra
✓ Perketat credit scoring untuk komoditas hortikultura
✓ Confidence: 92%`
  }

  if (lowerQuery.includes("stok") || lowerQuery.includes("inventory")) {
    return `📦 **Status Stok Hari Ini:**

• Beras Grade A: 120 ton (Stok Aman ✓)
• Cabai Merah: 2.5 ton (Stok Menipis ⚠️)
• Tomat: 1.8 ton (Stok Aman ✓)
• Wortel: 3.2 ton (Stok Aman ✓)

**Rekomendasi:**
✓ Order cabai merah 1 ton dalam 2 hari
✓ Stok lainnya mencukupi untuk 5-7 hari`
  }

  if (lowerQuery.includes("harga") || lowerQuery.includes("prediksi")) {
    return `📈 **Prediksi Harga Cabai Merah (7 Hari):**

Harga Saat Ini: Rp 45,000/kg
Trend: ↗️ Naik 15%

**Prediksi:**
• 3 hari: Rp 48,000/kg (+7%)
• 7 hari: Rp 52,000/kg (+15%)

**Rekomendasi:**
✓ TAHAN stok 5-7 hari
✓ Potensi profit tambahan: Rp 7,000/kg
✓ Confidence: 87%`
  }

  if (lowerQuery.includes("anggota") || lowerQuery.includes("member")) {
    return `👥 **Top 5 Anggota (Bulan Ini):**

1. **Pak Budi Santoso**
   - Transaksi: Rp 45.5 juta
   - Volume: 2.5 ton
   - Komoditas: Beras, Cabai

2. **Ibu Siti Aminah**
   - Transaksi: Rp 38.2 juta
   - Volume: 1.8 ton
   - Komoditas: Sayuran

3. **Pak Ahmad Dahlan**
   - Transaksi: Rp 32.7 juta
   - Volume: 1.5 ton
   - Komoditas: Buah-buahan`
  }

  if (lowerQuery.includes("rekomendasi") || lowerQuery.includes("jual")) {
    return `💡 **Rekomendasi Komoditas Minggu Ini:**

🥇 **Cabai Merah** (Prioritas Tinggi)
- Demand: Tinggi (↗️ +25%)
- Margin: 42%
- Potensi profit: Rp 52.5 juta

🥈 **Beras Grade A** (Stabil)
- Demand: Sedang (→ Stabil)
- Margin: 18%
- Potensi profit: Rp 40.5 juta

🥉 **Tomat** (Perhatian)
- Demand: Menurun (↘️ -12%)
- Margin: 35%
- Rekomendasi: Kurangi stok 20%`
  }

  return `Terima kasih atas pertanyaan Anda. Saya sedang menganalisis data untuk memberikan jawaban terbaik. 

Beberapa hal yang bisa saya bantu:
• Cek stok dan inventory
• Prediksi harga komoditas
• Analisis performa anggota
• Rekomendasi penjualan
• Forecast demand & supply

Silakan tanyakan lebih spesifik! 😊`
}
