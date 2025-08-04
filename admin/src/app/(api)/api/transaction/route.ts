import { getTransactionDataAndItemsByDateRange } from "@/lib/supabase/transaction";
import { NextRequest, NextResponse } from "next/server";

// TODO DELETE SOON
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const start = searchParams.get("start");
    const end = searchParams.get("end");

    if (!start || !end) {
      return NextResponse.json(
        { message: "Parameter 'start' dan 'end' harus diberikan" },
        { status: 400 }
      );
    }

    // Panggil fungsi yang sudah ada untuk ambil transaksi + item di rentang tanggal
    const transactionsWithItems = await getTransactionDataAndItemsByDateRange(
      start,
      end,
      {
        showDeletedData: false,
      }
    );

    return NextResponse.json(
      { transactions: transactionsWithItems },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Gagal mengambil data transaksi", error },
      { status: 500 }
    );
  }
}
