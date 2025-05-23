import { supabase } from "@/lib/supabaseServer";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const start = searchParams.get("start");
  const end = searchParams.get("end");

  let transactionQuery = supabase.from("transactions").select("*");
  if (start && end) {
    const startDate = new Date(start);
    const endDate = new Date(end);

    // Set waktu start ke awal hari
    startDate.setUTCHours(0, 0, 0, 0);
    // Set waktu end ke akhir hari
    endDate.setUTCHours(23, 59, 59, 999);

    transactionQuery = transactionQuery
      .gte("transaction_at", startDate.toISOString())
      .lte("transaction_at", endDate.toISOString());
  }

  const [transactionDataRes, transactionItemsRes] = await Promise.all([
    transactionQuery,
    supabase.from("transaction_items").select("*"),
  ]);

  if (transactionDataRes.error || transactionItemsRes.error) {
    return NextResponse.json(
      {
        message: "Gagal mengambil data",
        transactionError: transactionDataRes.error,
        itemError: transactionItemsRes.error,
      },
      { status: 500 }
    );
  }

  return NextResponse.json(
    {
      transactions: transactionDataRes.data,
      transactionItems: transactionItemsRes.data,
    },
    { status: 200 }
  );
}
