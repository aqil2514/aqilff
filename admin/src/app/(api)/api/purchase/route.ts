import { getPurchaseDataAndItems, getPurchaseDataAndItemsByDateRange } from "@/lib/supabase/purchase";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");

  try {
    let data;

    if (startDate && endDate) {
      data = await getPurchaseDataAndItemsByDateRange(startDate, endDate);
    } else {
      data = await getPurchaseDataAndItems();
    }


    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error("Gagal mengambil data pembelian:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan saat mengambil data pembelian" },
      { status: 500 }
    );
  }
}
