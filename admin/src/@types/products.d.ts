/**
 * Representasi data produk dalam sistem.
 */
export interface Product {
  /**
   * ID unik dan tetap (immutable) yang digunakan secara internal untuk mereferensikan produk.
   * ID ini tidak boleh diubah setelah dibuat.
   * Contoh: "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
   */
  id: string;

  /**
   * Kode produk yang digunakan untuk referensi bisnis atau keperluan tampilan.
   * Nilai ini dapat diubah jika diperlukan, misalnya saat perubahan SKU atau branding.
   * Contoh: "FD-001"
   */
  code: string;

  /**
   * Merek atau produsen dari produk ini.
   * Contoh: "So Good", "Champ"
   */
  brand: string;

  /**
   * Nama produk yang akan ditampilkan kepada pengguna.
   * Contoh: "Nugget Ayam Original"
   */
  name: string;

  /**
   * Harga satuan dari produk.
   * Nilai ini disimpan dalam satuan mata uang lokal (misalnya IDR).
   * Contoh: 15000
   */
  price: number;

  /**
   * Kategori induk dari produk.
   * Contoh: "Frozen Food"
   */
  parent_category: string;

  /**
   * Subkategori dari produk.
   * Contoh: "Nugget", "Sosis"
   */
  category: string;

  /**
   * URL gambar produk.
   * Bisa berupa path relatif atau URL penuh.
   */
  image_src: string;

  /**
   * Deskripsi tambahan mengenai produk.
   * Tidak wajib diisi.
   */
  description?: string;

  /**
   * Jumlah stok produk yang tersedia saat ini.
   * Nilai ini akan berkurang saat ada transaksi penjualan.
   */
  stock: number;

  /**
   * Menandakan apakah produk ini aktif dan ditampilkan di daftar produk.
   */
  is_active: boolean;

  /**
   * Tanggal dan waktu saat produk ini dibuat.
   * Menggunakan format ISO (contoh: "2025-05-18T10:23:45.000Z").
   */
  created_at: string;

  /**
   * Tanggal dan waktu saat terakhir kali produk ini diperbarui.
   */
  updated_at: string;
}
