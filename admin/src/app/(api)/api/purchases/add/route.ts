import { Purchase } from "@/@types/purchases";
import {
  insertPurchaseData,
  insertPurchaseItemData,
} from "@/lib/supabase/purchase";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const raw = (await req.json()) as Purchase;
    const { items, ...purchasePayload } = raw;

    const fixedItems = items.map((item) => {
      return {
        ...item,
        hpp: item.price / item.quantity,
        remaining_quantity: item.quantity,
      };
    });

    const data = await insertPurchaseData(purchasePayload);

    await Promise.all(
      fixedItems.map((item) => insertPurchaseItemData(item, String(data.id)))
    );

    return NextResponse.json(
      { message: "Pembelian berhasil disimpan" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error menyimpan pembelian:", error);
    return NextResponse.json(
      { message: "Gagal menyimpan pembelian" },
      { status: 500 }
    );
  }
}
