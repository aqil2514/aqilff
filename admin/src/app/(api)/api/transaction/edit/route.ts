import { Transaction, TransactionItem } from "@/@types/transaction";
import { supabaseAdmin } from "@/lib/supabaseServer";
import { updateStock, update_stock_log } from "@/lib/utils-server";
import { formatTransaction, TransactionSchema } from "@/schema/transaction";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  const raw = (await req.json()) as Transaction;
  const body = formatTransaction(raw);

  const parsed = TransactionSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
  }

  const data = parsed.data;
  const transactionId = body.id;
  const { items, ...transactionPayload } = data;

  // 1. Ambil item lama
  const { data: oldItems, error: oldItemsError } = await supabaseAdmin
    .from("transaction_items")
    .select("*")
    .eq("transaction_id", transactionId);

  if (oldItemsError) {
    return NextResponse.json(
      { message: "Gagal mengambil item transaksi lama", error: oldItemsError },
      { status: 500 }
    );
  }

  // 2. Kembalikan stok lama
  for (const item of oldItems || []) {
    const { product_id, quantity } = item as TransactionItem;

    const { success, error: rollbackError } = await updateStock({
      product_id,
      quantity,
      operation: "increment", // rollback
    });

    if (!success) {
      return NextResponse.json(
        { message: "Gagal rollback stok lama", error: rollbackError },
        { status: 500 }
      );
    }

    const { logError } = await update_stock_log({
      product_id,
      quantity,
      source: "rollback-transaction",
      reference_id: transactionId,
    });

    if (logError) {
      console.error("Gagal log rollback stok", logError);
    }
  }

  // 3. Hapus item lama
  const { error: deleteError } = await supabaseAdmin
    .from("transaction_items")
    .delete()
    .eq("transaction_id", transactionId);

  if (deleteError) {
    return NextResponse.json(
      { message: "Gagal menghapus item lama", error: deleteError },
      { status: 500 }
    );
  }

  // 4. Update transaksi utama
  const { error: updateTransactionError } = await supabaseAdmin
    .from("transactions")
    .update(transactionPayload)
    .eq("id", transactionId);

  if (updateTransactionError) {
    return NextResponse.json(
      {
        message: "Gagal mengupdate data transaksi",
        error: updateTransactionError,
      },
      { status: 500 }
    );
  }

  // 5. Tambahkan item baru + update stok baru
  const insertItems = items.map((item) => {
    const itemPayload = { ...item, transaction_id: transactionId };
    return supabaseAdmin
      .from("transaction_items")
      .insert<typeof itemPayload>(itemPayload)
      .select();
  });

  const itemInsertResults = await Promise.all(insertItems);

  for (const result of itemInsertResults) {
    if (result.error) {
      return NextResponse.json(
        { message: "Gagal menambahkan item baru", error: result.error },
        { status: 500 }
      );
    }

    const insertedItem = result.data?.[0] as TransactionItem;
    const { product_id, quantity } = insertedItem;

    const { success, error: stockError } = await updateStock({
      product_id,
      quantity,
      operation: "decrement",
    });

    if (!success) {
      return NextResponse.json(
        { message: "Gagal update stok baru", error: stockError },
        { status: 500 }
      );
    }

    const { logError } = await update_stock_log({
      product_id,
      quantity: -quantity,
      source: "transaction-edit",
      reference_id: transactionId,
    });

    if (logError) {
      console.error("Gagal log stok transaksi edit", logError);
    }
  }

  return NextResponse.json(
    { message: "Berhasil edit transaksi" },
    { status: 200 }
  );
}
