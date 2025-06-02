import { Transaction, TransactionItem } from "@/@types/transaction";
import {
  saveTransaction,
  saveTransactionItems,
} from "@/lib/supabase/transaction";
import { supabaseAdmin } from "@/lib/supabaseServer";
import { update_stock_log, updateStock } from "@/lib/utils/server/rpc";
import { formatTransaction, TransactionSchema } from "@/schema/transaction";
import { NextRequest, NextResponse } from "next/server";

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
  const raw = (await req.json()) as Transaction;
  const body = formatTransaction(raw);

  const parsed = TransactionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
  }

  const data = parsed.data;
  const { items, ...transactionPayload } = data;

  // Simpan transaksi utama
  const { success, createdTransaction, message: saveTrMessage } =
    await saveTransaction(transactionPayload);

  if (!success)
    return NextResponse.json({ message: saveTrMessage }, { status: 400 });

  const transactionId = (createdTransaction as { id: string }).id;

  const enrichedItems: TransactionItem[] = [];

  for (const item of items) {
    const { product_id, quantity, price_per_unit } = item;

    // Ambil daftar pembelian berdasarkan FIFO
    const { data: purchaseItems, error: purchaseError } = await supabaseAdmin
      .from("purchase_items")
      .select("*")
      .eq("product_id", product_id)
      .gt("remaining_quantity", 0)
      .is("deleted_at", null)
      .order("created_at", { ascending: true });

    if (purchaseError) {
      console.error("Gagal ambil purchase_items:", purchaseError);
      return NextResponse.json(
        { message: "Gagal ambil riwayat pembelian produk" },
        { status: 500 }
      );
    }

    let remainingToFulfill = quantity;
    let totalHPP = 0;
    const usedPurchases: { unit_price: number; quantity: number }[] = [];

    for (const purchase of purchaseItems || []) {
      if (remainingToFulfill <= 0) break;

      const usableQty = Math.min(purchase.remaining_quantity, remainingToFulfill);
      usedPurchases.push({
        unit_price: purchase.hpp,
        quantity: usableQty,
      });

      remainingToFulfill -= usableQty;
    }

    if (remainingToFulfill > 0) {
      return NextResponse.json(
        {
          message:
            "Produk belum memiliki riwayat pembelian yang valid (HPP kosong)",
        },
        { status: 400 }
      );
    }

    // Hitung total HPP
    for (const used of usedPurchases) {
      totalHPP += used.unit_price * used.quantity;
    }

    const finalHPP = totalHPP;
    const finalMargin = (price_per_unit - totalHPP / quantity) * quantity;

    enrichedItems.push({
      ...item,
      transaction_id: transactionId,
      hpp: finalHPP,
      margin: finalMargin,
    });

    // Update remaining_quantity di purchase_items
    let qtyToDeduct = quantity;
    for (const purchase of purchaseItems || []) {
      if (qtyToDeduct <= 0) break;

      const deductQty = Math.min(purchase.remaining_quantity, qtyToDeduct);

      const { error: updateError } = await supabaseAdmin
        .from("purchase_items")
        .update({
          remaining_quantity: purchase.remaining_quantity - deductQty,
        })
        .eq("id", purchase.id);

      if (updateError) {
        console.error("Gagal update remaining_quantity:", updateError);
        return NextResponse.json(
          { message: "Gagal mengurangi stok pembelian" },
          { status: 500 }
        );
      }

      qtyToDeduct -= deductQty;
    }
  }

  // Simpan semua item transaksi ke DB
  const itemInsertResults = await saveTransactionItems(enrichedItems, transactionId);

  for (const result of itemInsertResults) {
    if (result.error) {
      console.error("Item insert error:", result.error);
      return NextResponse.json(
        {
          message: "Terjadi kesalahan saat menyimpan item transaksi",
          itemError: result.error,
        },
        { status: 500 }
      );
    }

    const insertedItem = result.data?.[0] as TransactionItem;
    const { product_id, quantity } = insertedItem;

    // Kurangi stok total (update di tabel utama produk)
    const { success, error: stockError } = await updateStock({
      product_id,
      quantity,
      operation: "decrement",
    });

    if (!success) {
      return NextResponse.json(
        { message: "Gagal memperbarui stok", rpcError: stockError },
        { status: 500 }
      );
    }

    // Simpan log stok
    const { logError, message: logMsg } = await update_stock_log({
      product_id,
      quantity: -quantity,
      source: "transaction",
      reference_id: transactionId,
    });

    if (logError) {
      console.error("Log stok error:", logError);
      return NextResponse.json({ message: logMsg, logError }, { status: 500 });
    }
  }

  return NextResponse.json(
    { message: "Berhasil tambah transaksi" },
    { status: 201 }
  );
}