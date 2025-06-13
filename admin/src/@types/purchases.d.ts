/**
 * Mewakili sebuah data pembelian.
 */
export interface Purchase {
  /**
   * Identifikasi unik pembelian (UUID).
   */
  id?: string;

  /**
   * Tanggal dan waktu pembelian dilakukan (format ISO 8601).
   */
  purchase_date: string;

  /**
   * Kode pembelian yang dapat dibaca oleh manusia, biasanya terdiri dari prefix, tanggal, dan nomor urut.
   * Contoh: "PUR-20250524-001"
   */
  purchase_code: string;

  /**
   * Nama pemasok (supplier) pembelian, bisa kosong atau null.
   */
  supplier_name?: string | null;

  /**
   * Jenis pemasok.
   * Contoh : "Toko Fisik"
   */
  supplier_type?: "Toko Fisik" | "Shopee" | "Buatan Sendiri" | string;

  /**
   * Catatan tambahan terkait pembelian, bisa kosong atau null.
   */
  notes?: string | null;

  /**
   * Daftar item produk yang dibeli dalam transaksi ini.
   */
  items: PurchaseItem[];

  /**
   * Waktu saat data pembelian dibuat (format ISO 8601).
   */
  created_at?: string;
}

/**
 * Mewakili item produk dalam pembelian tertentu.
 */
export interface PurchaseItem {
  /**
   * Identifikasi unik item pembelian (UUID).
   */
  id?: string;

  /**
   * Kunci asing yang merujuk ke pembelian terkait (UUID).
   */
  purchase_id?: string;

  /**
   * Kunci asing yang merujuk ke produk (UUID), bisa kosong atau null.
   */
  product_id?: string | null;

  /**
   * Kunci asing yang merujuk ke produk (UUID), bisa kosong atau null.
   */
  product_name: string | null;

  /**
   * Jumlah produk yang dibeli.
   */
  quantity: number;

  /**
   * Jumlah produk yang tersisa (biasanya sama dengan quantity pada awalnya).
   */
  remaining_quantity: number;

  /**
   * Harga sekali beli (dalam satuan mata uang dengan 2 desimal).
   */
  price: number;

  /**
   * Harga per unit produk (dalam satuan mata uang dengan 2 desimal).
   */
  hpp: number;

  /**
   * Waktu saat data item pembelian dibuat (format ISO 8601).
   */
  created_at?: string;
}

/**
 * Interface untuk data rencana pembelian barang.
 */
export interface PurchasePlanItem {
  /**
   * ID unik dari item rencana.
   */
  id: string;

  /**
   * ID pengguna yang membuat data.
   */
  userId: string;

  /**
   * Nama barang.
   */
  itemName: string;

  /**
   * Jumlah unit per pack.
   */
  quantityPerPack: number;

  /**
   * Jumlah pack yang ingin dibeli.
   */
  packCount: number;

  /**
   * Kategori rencana pembelian produk.
   * Contoh : Restok, Produk Baru
   */
  category: string;

  /**
   * Harga beli per pack.
   */
  purchasePrice: number;

  /**
   * Harga satuan per item.
   */
  unitCost: number;

  /**
   * Harga jual per item.
   */
  sellingPrice: number;

  /**
   * Margin nominal per item.
   */
  marginPerItem: number;

  /**
   * Margin dari harga beli (dalam persen).
   */
  marginFromCost: number;

  /**
   * Margin dari harga jual (dalam persen).
   */
  marginFromSelling: number;

  /**
   * Total nilai pembelian untuk seluruh pack.
   */
  totalPurchaseValue: number;

  /**
   * Total nilai penjualan untuk semua item.
   */
  totalSellingValue: number;

  /**
   * Laba total dari item ini.
   */
  profit: number;

  /**
   * Status rencana
   */
  status: "Collecting" | "Fixed" | "Planning" | "Delivery" | "Arrived" | string;

  /**
   * Sumber Itemnya.
   */
  sourceItem: string;

  /**
   * Tanggal dibuat.
   */
  createdAt: string;

  /**
   * Tanggal diubah terakhir.
   */
  updatedAt: string;
}

export interface PurchasePlanItemDb {
  item_name: string;
  quantity_per_pack: number;
  pack_count: number;
  category: string;
  purchase_price: number;
  unit_cost: number;
  selling_price: number;
  total_purchase_value: number;
  total_selling_value: number;
  profit: number;
  status: string;
  source_item: string;
  created_at?: string;
  updated_at?: string;
}
