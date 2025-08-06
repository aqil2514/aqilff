import { getProductData } from "@/lib/supabase/products";
import { getPurchaseItemData } from "@/lib/supabase/purchase";
import {
  getTransactionDataAndItemsByDateRange,
  saveTransaction,
} from "@/lib/supabase/transaction";
import { saveTransactionItems } from "@/lib/supabase/transactionItem";
import { updateStock } from "@/lib/supabase/utils";
import { checkData } from "@/lib/api/transaction/checkData";
import {
  formatToTransactionData,
  formatToTransactionItem,
} from "@/lib/api/transaction/formatData";
import { TransactionSchemaType } from "@/schema/transaction-schema";
import { NextRequest, NextResponse } from "next/server";

// TODO DELETE SOON GET
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const start = searchParams.get("start");
    const end = searchParams.get("end");

    if (!start || !end) {
      return NextResponse.json(
        { message: "Parameter 'start' dan 'end' harus diberikan" },
        { status: 400 }
      );
    }

    // Panggil fungsi yang sudah ada untuk ambil transaksi + item di rentang tanggal
    const transactionsWithItems = await getTransactionDataAndItemsByDateRange(
      start,
      end,
      {
        showDeletedData: false,
      }
    );

    return NextResponse.json(
      { transactions: transactionsWithItems },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Gagal mengambil data transaksi", error },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const formData: TransactionSchemaType = await req.json();
  const transactionId = crypto.randomUUID();
  const [products, purchaseItems] = await Promise.all([
    getProductData(),
    getPurchaseItemData(),
  ]);

  const transaction = formatToTransactionData(formData, transactionId);
  const transactionItem = formatToTransactionItem(
    formData.transaction_items,
    transactionId
  );

  const isChecked = checkData(transactionItem, products, purchaseItems);
  if (!isChecked.success)
    return NextResponse.json(
      { message: isChecked.message },
      { status: isChecked.status }
    );

  // Promise All ga bisa. Karena transactionItems harus nunggu transaction disave dulu
  await saveTransaction(transaction, transactionId);
  await saveTransactionItems(transactionItem);
  await updateStock(transactionItem, products, purchaseItems);

  return NextResponse.json({ message: "Transaksi berhasil ditambah" });
}
