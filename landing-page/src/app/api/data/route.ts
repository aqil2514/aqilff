import { Product } from "@/@types/interfaces";
import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET() {
  const { data } = await supabase.from("products").select("*");

  if (!data) throw new Error("Terjadi kesalahan saat ambil data");

  const products: Product[] = data;

  return NextResponse.json({ products }, { status: 200 });
}
