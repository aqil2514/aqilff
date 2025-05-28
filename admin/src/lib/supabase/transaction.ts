import { Transaction, TransactionItem } from "@/@types/transaction";
import { supabaseAdmin } from "../supabaseServer";

// Ambil semua transaksi (tanpa item)
export async function getTransactionData(): Promise<Transaction[]> {
  const { data, error } = await supabaseAdmin
    .from("transactions")
    .select("*")
    .is("deleted_at", null)
    .order("transaction_at", { ascending: false });

  if (error) {
    console.error("Gagal mengambil data transaksi:", error);
    throw new Error("Gagal mengambil data transaksi");
  }

  return data as Transaction[];
}

// Ambil semua item transaksi
export async function getTransactionItemData(): Promise<TransactionItem[]> {
  const { data, error } = await supabaseAdmin
    .from("transaction_items")
    .select("*")
    .is("deleted_at", null)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Gagal mengambil item transaksi:", error);
    throw new Error("Gagal mengambil item transaksi");
  }

  return data as TransactionItem[];
}

// Gabungkan transaksi dengan item berdasarkan ID
export async function getTransactionDataAndItems(): Promise<Transaction[]> {
  const transactions = await getTransactionData();

  const withItems: Transaction[] = await Promise.all(
    transactions.map(async (trx) => {
      const { data: items, error } = await supabaseAdmin
        .from("transaction_items")
        .select("*")
        .eq("transaction_id", trx.id)
        .is("deleted_at", null);

      if (error) {
        console.error(`Gagal mengambil item transaksi ${trx.id}:`, error);
        throw new Error("Gagal mengambil item transaksi");
      }

      return {
        ...trx,
        items: items || [],
      };
    })
  );

  return withItems;
}

// Ambil transaksi dan item berdasarkan tanggal transaksi
export async function getTransactionDataAndItemsByDateRange(
  startDate: string,
  endDate: string,
  options?: { showDeletedData: boolean }
): Promise<Transaction[]> {
  const fullStart = `${startDate}T00:00:00`;
  const fullEnd = `${endDate}T23:59:59`;
  const showDeletedData = options?.showDeletedData ?? false;

  let trxQuery = supabaseAdmin
    .from("transactions")
    .select("*")
    .gte("transaction_at", fullStart)
    .lte("transaction_at", fullEnd)
    .order("transaction_at", { ascending: true });

  if (!showDeletedData) {
    trxQuery = trxQuery.is("deleted_at", null);
  }

  const { data: transactions, error } = await trxQuery;

  if (error) {
    console.error("Gagal mengambil data transaksi:", error);
    throw new Error("Gagal mengambil data transaksi");
  }

  const withItems: Transaction[] = await Promise.all(
    (transactions || []).map(async (trx) => {
      let itemQuery = supabaseAdmin
        .from("transaction_items")
        .select("*")
        .eq("transaction_id", trx.id);

      if (!showDeletedData) {
        itemQuery = itemQuery.is("deleted_at", null);
      }

      const { data: items, error: itemError } = await itemQuery;

      if (itemError) {
        console.error(`Gagal mengambil item transaksi ${trx.id}:`, itemError);
        throw new Error("Gagal mengambil item transaksi");
      }

      return {
        ...trx,
        items: items || [],
      };
    })
  );

  return withItems;
}
