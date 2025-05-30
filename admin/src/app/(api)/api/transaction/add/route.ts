import { Transaction, TransactionItem } from "@/@types/transaction";
import { supabaseAdmin } from "@/lib/supabaseServer";
import { update_stock_log, updateStock } from "@/lib/utils/server/rpc";
import { formatTransaction, TransactionSchema } from "@/schema/transaction";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const raw = (await req.json()) as Transaction;
  const body = formatTransaction(raw);

  const parsed = TransactionSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.format() }, { status: 400 });
  }

  const data = parsed.data;

  const { items, ...transactionPayload } = data;

  const { data: createdTransaction, error: transactionError } =
    await supabaseAdmin
      .from("transactions")
      .insert<typeof transactionPayload>(transactionPayload)
      .select()
      .single();

  if (transactionError) {
    console.error("Transaction insert error:", transactionError);
    return NextResponse.json(
      {
        message: "Terjadi kesalahan saat Tambah Transaksi pada server",
        transactionError,
      },
      { status: 500 }
    );
  }

  const transactionId = (createdTransaction as { id: string }).id;

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
      console.error("Item insert error:", result.error);
      return NextResponse.json(
        {
          message: "Terjadi kesalahan saat menyimpan item transaksi",
          itemError: result.error,
        },
        { status: 500 }
      );
    }

    const insertedItems = result.data?.[0] as TransactionItem;

    if (!insertedItems?.product_id) {
      console.error("product_id kosong atau tidak ditemukan", insertedItems);
      return NextResponse.json(
        { message: "Data produk item transaksi tidak lengkap" },
        { status: 400 }
      );
    }

    const { product_id, quantity } = insertedItems;

    // Kurangi stok
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
