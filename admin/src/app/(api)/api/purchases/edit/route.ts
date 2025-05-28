import { Purchase } from "@/@types/purchases";
import { updatePurchaseData } from "@/lib/supabase/purchase";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
  const payload = (await req.json()) as Purchase;

  const { items, ...purchase } = payload;

  try {
    await updatePurchaseData({ purchase, items });

    return NextResponse.json(
      { message: "Data berhasil diupdate" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Terjadi kesalahan saat upload data" },
      { status: 400 }
    );
  }
}
