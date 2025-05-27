import { deletePurchaseData } from "@/lib/supabase/purchase";
import { NextResponse } from "next/server";

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const purchaseId = searchParams.get("id");

  if (!purchaseId) {
    return NextResponse.json(
      { message: "ID pembelian wajib disertakan" },
      { status: 400 }
    );
  }

  try {
    await deletePurchaseData(purchaseId);
    return NextResponse.json(
      { message: "Data pembelian berhasil dihapus" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Gagal menghapus data pembelian:", error);
    return NextResponse.json(
      { message: "Gagal menghapus data pembelian", error },
      { status: 500 }
    );
  }
}
