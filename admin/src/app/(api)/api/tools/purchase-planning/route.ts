import { PurchasePlanItem } from "@/@types/purchases";
import {
  getPurchasePlanningItemData,
  getPurchasePlanningItemDataByDateRange,
  savePurchasePlanningItemData,
} from "@/lib/supabase/purchase_plan_items";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const raw = (await req.json()) as PurchasePlanItem;

  const { error, message } = await savePurchasePlanningItemData(raw);
  if (error) return NextResponse.json({ message }, { status: 500 });

  return NextResponse.json({ message }, { status: 200 });
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const startDate = searchParams.get("start");
  const endDate = searchParams.get("end");

  try {
    let purchasePlanItem;

    if (startDate && endDate) {
      purchasePlanItem = await getPurchasePlanningItemDataByDateRange(
        startDate,
        endDate
      );
    } else {
      purchasePlanItem = await getPurchasePlanningItemData();
    }

    return NextResponse.json(
      { purchasePlanning: purchasePlanItem },
      { status: 200 }
    );
  } catch (error) {
    console.error("Gagal mengambil data pembelian:", error);
    return NextResponse.json(
      { message: "Terjadi kesalahan saat mengambil data pembelian" },
      { status: 500 }
    );
  }
}
