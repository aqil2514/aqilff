import { getTransactionDataById } from "@/lib/supabase/transaction";
import { getTransactionItemDataByTransactionId } from "@/lib/supabase/transactionItem";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const [transactionItemRes, transactionRes] = await Promise.allSettled([
    getTransactionItemDataByTransactionId(id),
    getTransactionDataById(id),
  ]);

  if (
    transactionItemRes.status === "rejected" ||
    transactionRes.status === "rejected"
  ) {
    return NextResponse.json(
      { message: "Failed to fetch data" },
      { status: 500 }
    );
  }

  return NextResponse.json({
    message: "ok",
    transactionItem: transactionItemRes.value,
    transaction: transactionRes.value,
  });
}
