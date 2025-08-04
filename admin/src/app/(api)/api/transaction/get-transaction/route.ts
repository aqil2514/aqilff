import { getTransactionDataByDate } from "@/lib/supabase/transaction";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");

  if (!startDate) {
    return NextResponse.json(
      {
        message: "Tanggal mulai belum diisi",
        data: [],
      },
      { status: 400 }
    );
  }

  if (!endDate) {
    return NextResponse.json(
      {
        message: "Tanggal selesai belum diisi",
        data: [],
      },
      { status: 400 }
    );
  }

  const trx = await getTransactionDataByDate(startDate, endDate);

  return NextResponse.json({
    message: "Data transaksi berhasil diambil",
    data: trx,
  });
}
