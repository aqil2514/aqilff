import {
  getPurchaseDataAndItems,
  getPurchaseDataAndItemsByDateRange,
} from "@/lib/supabase/purchase";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const startDate = searchParams.get("start");
  const endDate = searchParams.get("end");

  try {
    let purchases;

    if (startDate && endDate) {
      purchases = await getPurchaseDataAndItemsByDateRange(startDate, endDate);
    } else {
      purchases = await getPurchaseDataAndItems();
    }

    return NextResponse.json({ purchases }, { status: 200 });
  } catch (error) {
    console.error("Gagal mengambil data pembelian:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan saat mengambil data pembelian" },
      { status: 500 }
    );
  }
}
