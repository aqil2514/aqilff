import { supabase } from "@/lib/supabaseServer";
import { NextResponse } from "next/server";

export async function GET() {
  const { data, error } = await supabase.from("products").select("*");
  const { data: tItems, error: tError } = await supabase
    .from("transaction_items")
    .select("*");

  if (error || tError) {
    return NextResponse.json(
      { error: error?.message, tError: tError?.message },
      { status: 500 }
    );
  }

  return NextResponse.json({ data, tItems }, { status: 200 });
}
