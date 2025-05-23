import { supabase } from "@/lib/supabaseServer";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const start = searchParams.get("start");
  const end = searchParams.get("end");

  let transactionQuery = supabase
    .from("transactions")
    .select("*")

  if (start && end) {
    const startDate = new Date(start);
    const endDate = new Date(end);

    startDate.setUTCHours(0, 0, 0, 0);
    endDate.setUTCHours(23, 59, 59, 999);

    transactionQuery = transactionQuery
      .gte("transaction_at", startDate.toISOString())
      .lte("transaction_at", endDate.toISOString());
  }

  const transactionDataRes = await transactionQuery;

  if (transactionDataRes.error) {
    return NextResponse.json(
      {
        message: "Gagal mengambil data transaksi",
        transactionError: transactionDataRes.error,
      },
      { status: 500 }
    );
  }

  const transactions = transactionDataRes.data;
  const transactionIds = transactions.map((tx) => tx.id);

  if (transactionIds.length === 0) {
    return NextResponse.json(
      {
        transactions: [],
        transactionItems: [],
      },
      { status: 200 }
    );
  }

  const transactionItemsRes = await supabase
    .from("transaction_items")
    .select("*")
    .in("transaction_id", transactionIds)

  if (transactionItemsRes.error) {
    return NextResponse.json(
      {
        message: "Gagal mengambil data item transaksi",
        itemError: transactionItemsRes.error,
      },
      { status: 500 }
    );
  }

  return NextResponse.json(
    {
      transactions,
      transactionItems: transactionItemsRes.data,
    },
    { status: 200 }
  );
}
