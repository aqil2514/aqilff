import { PurchasePlanItem } from "@/@types/purchases";
import { savePurchasePlanningItemData } from "@/lib/supabase/purchase_plan_items";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const raw = (await req.json()) as PurchasePlanItem;

  const { error, message } = await savePurchasePlanningItemData(raw);
  if (error) return NextResponse.json({ message }, { status: 500 });

  return NextResponse.json({ message }, { status: 200 });
}
