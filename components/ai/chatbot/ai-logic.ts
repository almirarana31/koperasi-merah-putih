export const getAIResponse = (query: string): string => {
  const lowerQuery = query.toLowerCase()

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
