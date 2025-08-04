import { DetailDialogItem } from "@/@types/ui";
import { getTransactionItemDataByTransactionId } from "@/lib/supabase/transactionItem";
import { formatToRupiah } from "@/lib/utils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const raw = await getTransactionItemDataByTransactionId(id);

  const data: DetailDialogItem[] = raw.flatMap((r, i) => [
    {
      label: `Data #${i + 1}`,
      value: "",
    },
    {
      label: "Kode Produk",
      value: r.product_id.code,
    },
    {
      label: "Nama Produk",
      value: r.product_id.name,
    },
    {
      label: "Diskon",
      value: formatToRupiah(r.discount),
    },
    {
      label: "Tip",
      value: formatToRupiah(r.tip),
    },
    {
      label: "Total Harga",
      value: formatToRupiah(r.subtotal),
    },
    {
      label: "Jumlah Barang",
      value: `${r.quantity} pcs`,
    },
  ]);

  console.log(raw);

  return NextResponse.json({ message: "ok", data }, { status: 200 });
}
