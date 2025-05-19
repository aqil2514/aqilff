import { Transaction } from "@/@types/transaction";
import { supabaseAdmin } from "@/lib/supabaseServer";
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
      .insert<typeof itemPayload>(itemPayload);
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
  }

  return NextResponse.json({ message:"Berhasil tambah transaksi" }, { status: 201 });
}
