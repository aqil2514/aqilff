import { supabase } from "@/lib/supabaseServer";
import { NextResponse } from "next/server";

// TODO : Ini cari best Practicesnya. Bagusnya tampilin semua data, atau pilih filter dulu baru tampilin. Soalnya banyak banget kalo langsung tampilin semua data

export async function GET() {
  const [transactionDataRes, transactionItemsRes] = await Promise.all([
    supabase.from("transactions").select("*"),
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
