
/**
 * Item individual dalam suatu transaksi.
 * Menyimpan snapshot data produk saat transaksi dilakukan,
 * agar histori tetap valid meskipun data produk berubah.
 */
export interface TransactionItem {
  /**
   * ID unik dari tabel transaction_item.
   */
  id?: string;

  /**
   * ID unik dari tabel transaction.
   */
  transaction_id?: string;

  /**
   * ID unik dari produk.
   */
  product_id: string;

  /**
   * Nama produk pada saat transaksi.
   */
  product_name: string;

  /**
   * Harga per satuan produk saat transaksi.
   */
  price_per_unit: number;

  /**
   * Satuan produk, seperti "pcs", "kg", "pak", dll (opsional).
   */
  product_unit?: string;

  /**
   * Diskon per unit produk (opsional).
   * Contoh: jika harga asli 10.000 dan diskon 1.000, maka harga per unit efektif adalah 9.000.
   */
  discount?: number;

  /**
   * Tip per unit produk (opsional).
   * Contoh: jika harga asli 10.000 dan tip 1.000, maka harga per unit efektif adalah 11.000.
   */
  tip?: number;

  /**
   * SKU unik dari produk (opsional), berguna untuk pelacakan logistik.
   */
  product_sku?: string;

  /**
   * Jumlah unit produk yang dibeli.
   */
  quantity: number;

  /**
   * Subtotal item = (price_per_unit - discount) * quantity.
   */
  subtotal: number;

  /**
   * Selisih dari harga beli dan harga jual.
   */
  margin: number;

  /**
   * Deleted At = Tanggal penghapusan Item Transaksi.
   */
  deleted_at?: string;
}

/**
 * Struktur data transaksi lengkap.
 * Menyimpan informasi pembelian beberapa produk sekaligus, beserta total pembayaran.
 */
export interface Transaction {
  /**
   * ID unik transaksi (biasanya UUID).
   */
  id: string;

  /**
   * Kode transaksi yang lebih ramah pengguna, misalnya "TRX-20250518-001".
   */
  transaction_code: string;

  /**
   * Daftar item produk yang dibeli dalam transaksi ini.
   */
  items: TransactionItem[];

  /**
   * Total jumlah pembayaran untuk seluruh item dalam transaksi ini.
   */
  total_amount: number;

  /**
   * Metode pembayaran yang digunakan.
   * Misalnya: "cash", "transfer", "ewallet", atau metode lain yang ditambahkan.
   */
  payment_method: "cash" | "transfer" | "ewallet" | string;

  /**
   * Nama pelanggan (opsional).
   */
  customer_name?: string;

  /**
   * Catatan tambahan untuk transaksi ini (opsional).
   */
  notes?: string;

  /**
   * Tanggal dan waktu transaksi dibuat.
   */
  created_at: Date;

  /**
   * Deleted At = Tanggal penghapusan Item Transaksi.
   */
  deleted_at?: string;

  /**
   * Tanggal dan waktu transaksi terjadi.
   */
  transaction_at: string;
}
