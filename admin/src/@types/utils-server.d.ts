import { PostgrestError } from "@supabase/supabase-js";

/**
 * Parameter yang dibutuhkan untuk mencatat perubahan stok.
 */
type UpdateLogStockRpcArgs = {
  /**
   * ID unik dari produk yang ingin diubah stoknya.
   */
  product_id: string;

  /**
   * Jumlah perubahan stok.
   * Gunakan nilai positif untuk menambah stok, negatif untuk mengurangi.
   */
  quantity: number;

  /**
   * Sumber perubahan stok, misalnya: "transaksi", "penyesuaian", atau "retur".
   */
  source: "transaction" | "transaction-delete" | "transaction-edit" | "rollback-transaction" |"penyesuaian";

  /**
   * ID referensi dari transaksi atau aktivitas yang menyebabkan perubahan stok.
   */
  reference_id: string;
};

/**
 * Hasil dari proses pencatatan log stok.
 */
export interface UpdateLogStock {
  /**
   * Pesan yang akan ditampilkan kepada pengguna.
   */
  message: string;

  /**
   * Kode status proses. 200 jika berhasil, 500 jika terjadi kesalahan.
   */
  status: number;

  /**
   * Objek error dari Supabase, jika pencatatan log stok gagal.
   */
  logError?: PostgrestError;
}

export interface UpdateStockParams {
  product_id: string;
  quantity: number;
  operation: "increment" | "decrement";
}
