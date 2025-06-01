import { Transaction, TransactionItem } from "@/@types/transaction";
import { supabaseAdmin } from "@/lib/supabaseServer";
import { update_stock_log, updateStock } from "@/lib/utils/server/rpc";
import { NextRequest, NextResponse } from "next/server";

/**
 * Handler untuk HTTP DELETE request yang digunakan untuk menghapus transaksi 
 * dan item transaksinya secara soft-delete (menambahkan nilai `deleted_at`) serta 
 * mengembalikan stok produk seperti semula.
 *
 * Alur aksi:
 * 1. Mendapatkan ID transaksi dari query parameter (?id=...).
 * 2. Mengambil data transaksi berdasarkan ID.
 * 3. Mengambil daftar item dari transaksi terkait.
 * 4. Untuk setiap item:
 *    - Menambahkan log update stok dengan reference `transaction-delete-{kode_transaksi}`.
 *    - Mengembalikan (menambah kembali) stok produk dengan jumlah dari transaksi.
 *    - Mengembalikan stok produk dari table purchase_items yang paling lama.
 * 5. Melakukan soft-delete terhadap item transaksi (`transaction_items`) dan transaksi (`transactions`)
 *    dengan menambahkan nilai `deleted_at`.
 *
 * @param {NextRequest} req - Objek request dari Next.js API Route.
 * @returns {Promise<NextResponse>} Response JSON yang menjelaskan hasil:
 * - 200: Jika transaksi berhasil dihapus dan stok dikembalikan.
 * - 400: Jika ID tidak disediakan.
 * - 500: Jika terjadi kesalahan saat mengambil data, memperbarui stok, atau soft-delete.
 *
 * @example
 * DELETE /api/transactions?id=trx-123
 *
 * Response:
 * {
 *   "message": "Transaksi berhasil dihapus"
 * }
 *
 * @remarks
 * - Operasi `delete` di sini bersifat soft delete, bukan benar-benar menghapus data.
 * - Update stok dilakukan menggunakan RPC `update_stock_log` dan `updateStock`.
 * - Kode referensi log untuk setiap item adalah `transaction-delete-{kode_transaksi}`.
 */

export async function DELETE(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const id = searchParams.get("id");
  let transaction: Transaction = {} as Transaction;
  let transactionItems: TransactionItem[] = [];

  if (!id)
    return NextResponse.json(
      { message: "ID tidak ditemukan" },
      { status: 400 }
    );

  const { data: tData, error: transactionError } = await supabaseAdmin
    .from("transactions")
    .select("*")
    .eq("id", id)
    .single();

  if (transactionError || !tData)
    return NextResponse.json(
      {
        message: "Terjadi kesalahan saat ambil data Transaksi",
        transactionError,
      },
      { status: 500 }
    );

  transaction = tData;

  const { data: tIData, error: tIError } = await supabaseAdmin
    .from("transaction_items")
    .select("*")
    .eq("transaction_id", transaction.id);

  if (tIError)
    return NextResponse.json(
      {
        message: "Terjadi kesalahan saat ambil data Item Transaksi",
        tIError,
      },
      { status: 500 }
    );

  transactionItems = tIData ?? [];

  for (const item of transactionItems) {
    const { logError, message, status } = await update_stock_log({
      product_id: String(item.product_id),
      quantity: item.quantity,
      reference_id: `transaction-delete-${transaction.transaction_code}`,
      source: "transaction-delete",
    });

    if (logError) {
      return NextResponse.json({ message, logError }, { status });
    }

    const { success, error: stockError } = await updateStock({
      product_id: String(item.product_id),
      quantity: item.quantity,
      operation: "increment",
    });

    if (!success) {
      return NextResponse.json(
        { message: "Gagal memperbarui stok", rpcError: stockError },
        { status: 500 }
      );
    }
  }

  // Soft delete transaction_items
  const now = new Date().toISOString();
  const { error: itemsUpdateError } = await supabaseAdmin
    .from("transaction_items")
    .update({ deleted_at: now })
    .eq("transaction_id", transaction.id);

  if (itemsUpdateError) {
    return NextResponse.json(
      { message: "Gagal menghapus item transaksi", error: itemsUpdateError },
      { status: 500 }
    );
  }

  // Soft delete transaction
  const { error: transactionUpdateError } = await supabaseAdmin
    .from("transactions")
    .update({ deleted_at: now })
    .eq("id", transaction.id);

  if (transactionUpdateError) {
    return NextResponse.json(
      { message: "Gagal menghapus transaksi", error: transactionUpdateError },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { message: "Transaksi berhasil dihapus" },
    { status: 200 }
  );
}
