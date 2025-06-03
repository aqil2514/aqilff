import { Product } from "@/@types/products";
import { PurchaseItem } from "@/@types/purchases";
import { Transaction, TransactionItem } from "@/@types/transaction";
import { getProductData } from "@/lib/supabase/products";
import { getPurchaseItemData } from "@/lib/supabase/purchase";
import { saveTransaction, saveTransactionItems } from "@/lib/supabase/transaction";
import { updateStock } from "@/lib/supabase/utils";
import { TransactionSchema } from "@/schema/transaction";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

/**
 * Alur Penambahan Data Transaksi Penjualan
 *
 * 1. Validasi input menggunakan Zod schema.
 * 2. Pisahkan data antara transaksi (transactions) dan item transaksi (transaction_items).
 *
 * 3. Simpan data transaksi ke tabel "transactions".
 *
 * 4. Untuk setiap item dalam transaction_items:
 *    - Ambil data dari tabel "purchase_items" berdasarkan product_id, urutkan berdasarkan created_at (FIFO).
 *    - Cari purchase_items dengan remaining_quantity > 0.
 *    - Lakukan pengurangan remaining_quantity sesuai quantity pada transaction_items.
 *      - Jika quantity dari satu batch tidak cukup, lanjut ke batch berikutnya hingga total quantity tercapai.
 *    - Jika total remaining_quantity < quantity yang dibutuhkan:
 *      - Batalkan proses transaksi.
 *      - Tampilkan pesan error: "Produk belum memiliki riwayat pembelian yang valid (HPP kosong)".
 *      - User harus membuat dummy purchase_items secara manual di database untuk mengisi HPP awal (sementara).
 *
 * 5. Hitung HPP dari purchase_items yang digunakan (berdasarkan FIFO dan quantity terpakai).
 *
 * 6. Hitung margin: margin = (harga_jual - HPP) * quantity.
 *
 * 7. Simpan item ke tabel "transaction_items" lengkap dengan HPP dan margin-nya.
 *
 * 8. Simpan log pengurangan stok ke tabel log (misal: stock_logs atau purchase_items_logs).
 */

export async function POST(req: NextRequest) {
  const raw = await req.json();
  const [productData, purchaseItemData] = await Promise.all([
    getProductData(),
    getPurchaseItemData(),
  ]);

  // Ini harus diformat. Kalau ga diformat, beberapa data ada yang masih dianggap String (Padahal number)
  const formattedRaw = formatData(raw);

  // Pengecekan di sini.
  const { checkMessage, checkPassed } = checkData(
    formattedRaw,
    productData,
    purchaseItemData
  );
  if (!checkPassed) {
    return NextResponse.json({ message: checkMessage }, { status: 400 });
  }

  const { items, ...transaction } = formattedRaw;
  // Pengolahan Item pada Transaction.items
  const formattedItems = formatItems(
    items as TransactionItem[],
    purchaseItemData
  );

  await saveTransaction(transaction);
  await saveTransactionItems(formattedItems, String(transaction.id));
  await updateStock(formattedItems, productData, purchaseItemData);

  return NextResponse.json({ message: "Data Berhasil Ditambah" }, { status: 200 });
}

interface CheckDataResult {
  checkPassed: boolean;
  checkMessage: string;
}

/**
 * @author Muhamad Aqil Maulana
 *
 * Pengecekan data untuk minimalisir error saat di pertengahan input ke DB
 *
 * Apa saja yang dicek?
 *
 * - Validasi ZOD
 * - Apakah produk yang diinput ada di database?
 * - Apakah kuantitinya ada di database?
 * - Apakah data kedatangannya sudah ada?
 *
 * @param raw Data Mentah
 * @param productData Data Produk
 * @param purchaseItemData Data Purchase Item (Data kedatangan barang)
 */
function checkData(
  raw: Transaction,
  productData: Product[],
  purchaseItemData: PurchaseItem[]
): CheckDataResult {
  // Validasi dengan ZOD
  try {
    TransactionSchema.parse(raw);
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.error("❌ Zod Validation Error:", error.flatten());
    } else {
      console.error("❌ Unknown Error:", error);
    }

    return {
      checkPassed: false,
      checkMessage: "Terjadi kesalahan saat input data",
    };
  }

  // Cek apakah di produk yang diinput ada di database?
  const productName = productData.map((pr) => pr.name);
  for (const item of raw.items as TransactionItem[]) {
    if (!productName.includes(item.product_name)) {
      return {
        checkPassed: false,
        checkMessage: `Produk '${item.product_name}' tidak ada di Database`,
      };
    }
  }

  // Cek apakah kuantitinya ada di database?
  for (const item of raw.items as TransactionItem[]) {
    const selectedData = productData.find(
      (pr) => pr.name === item.product_name
    );

    if (item.quantity <= 0) {
      return {
        checkPassed: false,
        checkMessage: `Jumlah item '${item.product_name}' tidak boleh nol atau negatif.`,
      };
    }

    if (!selectedData) {
      return {
        checkPassed: false,
        checkMessage: "Terjadi kesalahan saat pengecekan kuantiti",
      };
    }

    if (selectedData.stock < item.quantity)
      return {
        checkPassed: false,
        checkMessage: `Kuantiti yang tersedia hanya ${selectedData.stock}. Yang diminta ${item.quantity}`,
      };
  }

  // Cek apakah data kedatangannya sudah ada?
  for (const item of raw.items as TransactionItem[]) {
    const selectedPurchaseItem = purchaseItemData.filter(
      (pur) =>
        pur.product_name === item.product_name && pur.remaining_quantity >= 0
    );
    if (selectedPurchaseItem.length <= 0)
      return {
        checkMessage: `Data untuk barang '${item.product_name}' belum tersedia`,
        checkPassed: false,
      };

    const stockAmount = selectedPurchaseItem.reduce(
      (acc, curr) => acc + curr.remaining_quantity,
      0
    );

    if (stockAmount < item.quantity)
      return {
        checkPassed: false,
        checkMessage: `Kuantiti ${item.product_name} di data kedatangan hanya ${stockAmount}`,
      };
  }

  return { checkPassed: true, checkMessage: "Data lolos cek" };
}

/**
 * Format raw data jadi ke data yang siap dicek
 * @param raw Data Mentah
 * @returns
 */
function formatData(raw: Transaction): Transaction {
  const items: TransactionItem[] = [];
  const transactionId = crypto.randomUUID();

  for (const item of raw.items as TransactionItem[]) {
    const result: TransactionItem = {
      margin: Number(item.margin),
      price_per_unit: Number(item.price_per_unit),
      product_id: item.product_id,
      product_name: item.product_name,
      quantity: Number(item.quantity),
      subtotal: Number(item.subtotal),
      deleted_at: item.deleted_at,
      discount: Number(item.discount),
      hpp: Number(item.hpp),
      id: item.id,
      product_sku: item.product_sku,
      product_unit: item.product_unit,
      tip: Number(item.tip),
      transaction_id: transactionId,
    };

    items.push(result);
  }

  const data: Transaction = {
    id: transactionId,
    payment_method: raw.payment_method,
    total_amount: Number(raw.total_amount),
    transaction_at: raw.transaction_at,
    transaction_code: raw.transaction_code,
    created_at: raw.created_at,
    customer_name: raw.customer_name,
    deleted_at: raw.deleted_at,
    notes: raw.notes,
    items,
  };

  return data;

  /**
   * Contoh datanya masih seperti ini
   {
  id: '9e89cf11-cc57-41dd-8842-7e316ccb9982',
  payment_method: 'cash',
  total_amount: 12000,
  transaction_at: '2024-01-01T10:16',
  transaction_code: 'TRX-20240101-0007',
  created_at: undefined,
  customer_name: 'zxcczx',
  deleted_at: undefined,
  notes: '',
  items: [
    {
      margin: 0,
      price_per_unit: 500,
      product_id: 'ce50e007-8367-4bc1-b4a0-f6532e10ee1c',
      product_name: 'Chocolate Dollars',
      quantity: 24,
      subtotal: 12000,
      deleted_at: undefined,
      discount: 0,
      hpp: NaN,
      id: undefined,
      product_sku: '',
      product_unit: '',
      tip: 0,
      transaction_id: '9e89cf11-cc57-41dd-8842-7e316ccb9982'
    }
  ]
}
   */
}

/**
 * Format item agar siap digunakan
 *
 * - Penentuan HPP
 * - Penentuan Margin
 * @param items Data Item dari klien
 * @param purchaseItemData Data kedatangan dari DB
 */
function formatItems(
  items: TransactionItem[],
  purchaseItemData: PurchaseItem[]
) {
  const result: TransactionItem[] = [];

  for (const item of items) {
    const selectedPurchaseItem = purchaseItemData
      .filter(
        (pur) =>
          pur.product_name === item.product_name && pur.remaining_quantity > 0
      )
      .sort((a, b) => {
        const aDate = new Date(a.created_at as string).getTime();
        const bDate = new Date(b.created_at as string).getTime();
        return aDate - bDate; // FIFO
      });

    let remainingQty = item.quantity;
    let totalHpp = 0;

    for (const batch of selectedPurchaseItem) {
      if (remainingQty === 0) break;

      const takeQty = Math.min(batch.remaining_quantity, remainingQty);
      totalHpp += takeQty * batch.hpp;
      remainingQty -= takeQty;
    }

    item.hpp = totalHpp;
    item.margin = item.price_per_unit * item.quantity - item.hpp;

    result.push(item);
  }

  return result;
}
