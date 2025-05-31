import { getProductData } from "@/lib/supabase/products";
import { NextResponse } from "next/server";

export async function GET() {
  const products = await getProductData();

  return NextResponse.json({ products }, { status: 200 });
}
