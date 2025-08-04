import { getHppItemByProductId } from "@/lib/supabase/purchaseItem";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const productId = searchParams.get("product-id");
  if (!productId) throw new Error("Produk id belum disertakan");

  const hpp = await getHppItemByProductId(productId);

  return NextResponse.json({ hpp });
}
