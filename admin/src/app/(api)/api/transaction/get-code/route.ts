import { getTransactionDataAndItemsByDateRange } from "@/lib/supabase/transaction";
import { generateCode } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const start = searchParams.get("start");
  const end = searchParams.get("end");

  if (!start || !end) {
    return NextResponse.json(
      { message: "Tanggal belum dipilih" },
      { status: 400 }
    );
  }

  const transactionData = await getTransactionDataAndItemsByDateRange(start, end, {
    showDeletedData: true,
  });
  const arrayCode = transactionData.map((trx) => trx.transaction_code);
  const lastCode = arrayCode.sort().at(-1);
  const dateOnly = start.slice(0, 10).split("-").join("");
  const newCode = generateCode(dateOnly, lastCode, "TRX");

  return NextResponse.json(
    { newCode, message: "Kode Transaksi berhasil dibuat" },
    { status: 200 }
  );
}
