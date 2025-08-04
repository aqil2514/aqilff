import {
  TableReportSales,
  TransactionItem,
  TransactionItemDbReport,
} from "@/@types/transaction";
import { supabaseAdmin } from "../supabaseServer";
import { getTransactionDataByDate } from "./transaction";

const tableName = "transaction_items";

export async function getTransactionItemData(): Promise<TransactionItem[]> {
  const { data, error } = await supabaseAdmin
    .from(tableName)
    .select("*")
    .is("deleted_at", null);

  if (error) {
    console.error("Gagal mengambil item transaksi:", error);
    throw new Error("Gagal mengambil item transaksi");
  }

  return data as TransactionItem[];
}

export async function getTransactionItemDataByTransactionId(
  transaction_id: string
) {
  const { data, error } = await supabaseAdmin
    .from(tableName)
    .select("*, product_id(code, name, price, id, category)")
    .eq("transaction_id", transaction_id);

  if (error) {
    console.error("Gagal mengambil item transaksi:", error);
    throw error;
  }

  return data as TransactionItem[];
}

export async function getTransactionItemDataReport(
  startDate: string,
  endDate: string
): Promise<TableReportSales[]> {
  const transactions = await getTransactionDataByDate(startDate, endDate);
  const trxIds = transactions.map((trx) => trx.id);

  const { data, error } = await supabaseAdmin
    .from(tableName)
    .select("*, product_id(code, name, price, id, category)")
    .in("transaction_id", trxIds)
    .is("deleted_at", null);

  if (error || !data) {
    console.error("Gagal mengambil data item transaksi:", error);
    throw error;
  }

  const transactionItems: TransactionItemDbReport[] = data;

  const reports: TableReportSales[] = transactions.flatMap((trx) => {
    const items = transactionItems.filter(
      (item) => item.transaction_id === trx.id
    );

    return items.map(
      (item): TableReportSales => ({
        margin: item.margin ?? 0,
        product_id: item.product_id,
        quantity: item.quantity ?? 0,
        subtotal: item.subtotal ?? 0,
        deleted_at: item.deleted_at ?? undefined,
        discount: item.discount ?? 0,
        hpp: item.hpp ?? 0,
        id: item.id?.toString(),
        product_code: item.product_id.code ?? "",
        tip: item.tip ?? 0,
        transaction_id: item.transaction_id,

        category: item.product_id?.category ?? "-",
        transaction_at: trx.transaction_at ?? "",
        transaction_code: trx.transaction_code,
        customer_name: trx.customer_name ?? "-",
      })
    );
  });

  return reports;
}
