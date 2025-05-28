import { getProductData } from "@/lib/supabase/products";
import { getTransactionDataAndItemsByDateRange } from "@/lib/supabase/transaction";
import { NextRequest, NextResponse } from "next/server";

type SourceTypes = "transactions" | "purchases";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const source = searchParams.get("source") as SourceTypes | null;
  const startDate = searchParams.get("startDate") as string;
  const endDate = searchParams.get("endDate") as string;

  if (!source) throw new Error("Sumber belum ada");

  if (source === "transactions") {
    const [transactions, products] = await Promise.all([
      getTransactionDataAndItemsByDateRange(startDate, endDate),
      getProductData(),
    ]);
    return NextResponse.json({ transactions, products }, { status: 200 });
  }

  return NextResponse.json({}, { status: 200 });
}
