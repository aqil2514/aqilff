import { getPurchaseDataAndItemsByDateRange } from "@/lib/supabase/purchase";
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

  const purchaseData = await getPurchaseDataAndItemsByDateRange(start, end);
  const arrayCode = purchaseData.map((pur) => pur.purchase_code);
  const lastCode = arrayCode.sort().at(-1);
  const dateOnly = start.slice(0, 10).split("-").join("");
  const newCode = generateCode(dateOnly, lastCode, "PUR");

  return NextResponse.json({ newCode, message:"Kode Pembayaran berhasil dibuat" }, { status: 200 });
}
