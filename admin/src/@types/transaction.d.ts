// 🔄 Relasi dengan Product
// Saat transaksi terjadi 👇
// 1. Product.stock akan dikurangi sesuai jumlah yang dibeli.
// 2. Harga di TransactionItem.price_per_unit harus mengambil Product.price saat itu, bukan refer ke product langsung (biar historinya tetap valid walau harga berubah nanti).

// 🧠 Alur Transaksi Singkat
// 1. Pilih produk dari daftar produk aktif.
// 2. Tentukan jumlah pembelian per produk.
// 3. Hitung subtotal untuk tiap item.
// 4. Hitung total transaksi.
// 5. Simpan transaksi dan update stok.
// 6. (Opsional) Tambah catatan atau nama pelanggan.

export interface TransactionItem {
  product_id: string;
  product_name: string;      
  price_per_unit: number;    
  quantity: number;
  subtotal: number;
}

export interface Transaction {
  id: string;
  items: TransactionItem[];
  total_amount: number;
  payment_method: "cash" | "transfer" | "ewallet" | string;
  customer_name?: string;
  notes?: string;
  created_at: string;
}
