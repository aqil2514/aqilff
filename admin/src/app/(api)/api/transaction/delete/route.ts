import { Transaction, TransactionItem } from "@/@types/transaction";
import { supabaseAdmin } from "@/lib/supabaseServer";
import { update_stock_log, updateStock } from "@/lib/utils-server";
import { NextRequest, NextResponse } from "next/server";

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

  if (tIData?.length === 0 || tIError)
    return NextResponse.json(
      {
        message: "Terjadi kesalahan saat ambil data Transaksi",
        transactionError,
      },
      { status: 500 }
    );

  transactionItems = tIData;

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

  await supabaseAdmin.from("transactions").delete().eq("id", transaction.id);

  return NextResponse.json(
    { message: "Transaksi berhasil dihapus" },
    { status: 200 }
  );
}
