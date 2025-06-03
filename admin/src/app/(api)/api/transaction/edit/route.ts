import { PurchaseItem } from "@/@types/purchases";
import { Transaction, TransactionItem } from "@/@types/transaction";
import { getPurchaseItemData } from "@/lib/supabase/purchase";
import {
  getTransactionItemData,
  updateTransaction,
} from "@/lib/supabase/transaction";
import { NextRequest, NextResponse } from "next/server";

// export async function PUT(req: NextRequest) {
//   const raw = (await req.json()) as Transaction;
//   const body = formatTransaction(raw);

//   const parsed = TransactionSchema.safeParse(body);
//   if (!parsed.success) {
//     return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
//   }

//   const data = parsed.data;
//   const transactionId = raw.id as string;
//   const { items, ...transactionPayload } = data;

//   // 1. Ambil item lama
//   const { data: oldItems, error: oldItemsError } = await supabaseAdmin
//     .from("transaction_items")
//     .select("*")
//     .eq("transaction_id", transactionId);

//   if (oldItemsError) {
//     return NextResponse.json(
//       { message: "Gagal mengambil item lama", error: oldItemsError },
//       { status: 500 }
//     );
//   }

//   // 2. Rollback stok & purchase_items
//   for (const item of oldItems || []) {
//     const { product_id, quantity } = item as TransactionItem;

//     const { success, error: rollbackError } = await updateStock({
//       product_id,
//       quantity,
//       operation: "increment",
//     });

//     if (!success) {
//       return NextResponse.json(
//         { message: "Gagal rollback stok lama", error: rollbackError },
//         { status: 500 }
//       );
//     }

//     const { logError } = await update_stock_log({
//       product_id,
//       quantity,
//       source: "rollback-transaction",
//       reference_id: transactionId,
//     });

//     if (logError) {
//       console.error("Gagal log rollback", logError);
//     }

//     // Rollback remaining_quantity
//     const { error: rollbackPurchaseError } = await supabaseAdmin.rpc(
//       "rollback_remaining_quantity",
//       {
//         product_id,
//         rollback_qty: quantity,
//       }
//     );

//     if (rollbackPurchaseError) {
//       return NextResponse.json(
//         {
//           message: "Gagal rollback remaining_quantity",
//           error: rollbackPurchaseError,
//         },
//         { status: 500 }
//       );
//     }
//   }

//   // 3. Hapus item lama
//   const { error: deleteError } = await supabaseAdmin
//     .from("transaction_items")
//     .delete()
//     .eq("transaction_id", transactionId);

//   if (deleteError) {
//     return NextResponse.json(
//       { message: "Gagal menghapus item lama", error: deleteError },
//       { status: 500 }
//     );
//   }

//   // 4. Update transaksi utama
//   const { error: updateTransactionError } = await supabaseAdmin
//     .from("transactions")
//     .update(transactionPayload)
//     .eq("id", transactionId);

//   if (updateTransactionError) {
//     return NextResponse.json(
//       { message: "Gagal mengupdate transaksi", error: updateTransactionError },
//       { status: 500 }
//     );
//   }

//   // 5. Tambahkan item baru, hitung ulang HPP pakai FIFO
//   for (const item of items) {
//     const { product_id, quantity, price_per_unit } = item;

//     // Ambil pembelian sesuai FIFO
//     const { data: purchases, error: purchaseError } = await supabaseAdmin
//       .from("purchase_items")
//       .select("*")
//       .eq("product_id", product_id)
//       .gt("remaining_quantity", 0)
//       .order("created_at", { ascending: true });

//     if (purchaseError) {
//       return NextResponse.json(
//         { message: "Gagal mengambil data pembelian", error: purchaseError },
//         { status: 500 }
//       );
//     }

//     let qtyNeeded = quantity;
//     let totalCost = 0;
//     const purchaseUpdates: { id: string; newQty: number }[] = [];

//     for (const p of purchases) {
//       if (qtyNeeded === 0) break;

//       const takeQty = Math.min(qtyNeeded, p.remaining_quantity);
//       totalCost += takeQty * p.purchase_price;
//       qtyNeeded -= takeQty;

//       purchaseUpdates.push({
//         id: p.id,
//         newQty: p.remaining_quantity - takeQty,
//       });
//     }

//     if (qtyNeeded > 0) {
//       return NextResponse.json(
//         { message: "Stok pembelian tidak cukup untuk produk", product_id },
//         { status: 400 }
//       );
//     }

//     const hpp = totalCost / quantity;
//     const margin = price_per_unit - hpp;

//     // Update remaining_quantity
//     for (const update of purchaseUpdates) {
//       const { error: updatePurchaseError } = await supabaseAdmin
//         .from("purchase_items")
//         .update({ remaining_quantity: update.newQty })
//         .eq("id", update.id);

//       if (updatePurchaseError) {
//         return NextResponse.json(
//           {
//             message: "Gagal update remaining_quantity",
//             error: updatePurchaseError,
//           },
//           { status: 500 }
//         );
//       }
//     }

//     // Insert item transaksi
//     const itemPayload = {
//       ...item,
//       transaction_id: transactionId,
//       hpp,
//       margin,
//     };

//     const { error: insertError } = await supabaseAdmin
//       .from("transaction_items")
//       .insert(itemPayload);

//     if (insertError) {
//       return NextResponse.json(
//         { message: "Gagal menambahkan item transaksi", error: insertError },
//         { status: 500 }
//       );
//     }

//     // Update stok produk (decrement)
//     const { success, error: stockError } = await updateStock({
//       product_id,
//       quantity,
//       operation: "decrement",
//     });

//     if (!success) {
//       return NextResponse.json(
//         { message: "Gagal mengurangi stok produk", error: stockError },
//         { status: 500 }
//       );
//     }

//     // Log stok
//     const { logError } = await update_stock_log({
//       product_id,
//       quantity: -quantity,
//       source: "transaction-edit",
//       reference_id: transactionId,
//     });

//     if (logError) {
//       console.error("Gagal log transaksi edit", logError);
//     }
//   }

//   return NextResponse.json(
//     { message: "Transaksi berhasil diubah" },
//     { status: 200 }
//   );
// }

/**
 * Alur Edit Data Transaksi Penjualan
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

export async function PUT(req: NextRequest) {
  const raw = (await req.json()) as Transaction;
  const { items: newItems, ...transactionPayload } = raw;
  if (!newItems) return;

  const [purchaseItems, transactionItems] = await Promise.all([
    getPurchaseItemData(),
    getTransactionItemData(),
  ]);

  const { success: checkPassed, message: checkMessage } = checkAllBeforeUpdate(
    purchaseItems,
    newItems,
    transactionItems
  );
  if (!checkPassed) {
    return NextResponse.json({ message: checkMessage }, { status: 400 });
  }

  // Update data transaksi
  const { success: updateTrSucces, message: messageUpdateTr } =
    await updateTransaction(transactionPayload);
  if (!updateTrSucces) {
    return NextResponse.json({ message: messageUpdateTr }, { status: 500 });
  }

  for (const nItem of newItems as TransactionItem[]) {
    // Urutkan data dari terbaru ke terlama
    const selectedPurchase = purchaseItems
      .filter(
        (pur) =>
          pur.product_id === nItem.product_id && pur.remaining_quantity !== 0
      )
      .sort((a, b) => {
        const aDate = new Date(a.created_at as string).getTime();
        const bDate = new Date(b.created_at as string).getTime();

        return bDate - aDate;
      });

    // Data terlama harusnya ada di paling akhir.
    const oldestPurchase = selectedPurchase.at(-1);

    console.log(oldestPurchase);
  }

  return NextResponse.json({ message: "ok" }, { status: 200 });
}

/**
 * Pengecekan data sebelum ditambahkan ke Database. Untuk menghindari error di tengah proses
 *
 * Apa yang dicek?
 * - Apakah data terbaru sudah ada di table purchase_items?
 * - Apakah kuantiti yang diinput oleh klien 0 atau negatif?
 * - Apakah kuantitinya tersedia?
 *
 *
 * @param itemDb Data dari Database purchase_items
 * @param newItems Data terbaru yang diinput oleh klien
 * @param oldItems Data lama yang pernah diinput oleh klien
 * @returns
 */
const checkAllBeforeUpdate = (
  itemDb: PurchaseItem[],
  newItems: TransactionItem[],
  oldItems: TransactionItem[]
) => {
  for (const nItem of newItems) {
    const selectedOldPurchaseItem = itemDb.find(
      (it) => it.product_id === nItem.product_id
    );
    const selectedOldTransactionItem = oldItems.find(
      (it) => it.id === nItem.id
    );

    if (!selectedOldPurchaseItem) {
      return {
        message:
          "Data item belum ada di table purchase_items. Tambahkan dulu datanya!",
        success: false,
      };
    }

    // Validasi jumlah kuantitas tidak boleh kosong atau negatif
    if (nItem.quantity <= 0) {
      return {
        message: `Quantity untuk produk '${nItem.product_name}' tidak boleh kurang dari 1.`,
        success: false,
      };
    }

    // Jika ingin memastikan penambahan tidak melebihi kapasitas total pembelian:
    const newQuantity = Number(nItem.quantity);
    const oldQuantity = Number(selectedOldTransactionItem?.quantity);

    // Kembalikan dulu semua stok lamanya agar gabung dengan kuantiti tersisa.
    const remainingQuantity = Number(
      selectedOldPurchaseItem.remaining_quantity
    );

    // Gabungan kuantiti lama dan sisa kuantiti dikurang kuantiti baru;
    const qtyDiff = oldQuantity + remainingQuantity - newQuantity;

    // Jika kuantitinya lebih kecil dari 0, artinya barang tidak cukup untuk memenuhi permintaan.
    if (qtyDiff < 0) {
      return {
        message: `Kuantitas baru untuk produk '${nItem.product_name}' melebihi stok tersedia.`,
        success: false,
      };
    }
  }

  return { message: "Validasi Berhasil", success: true };
};
