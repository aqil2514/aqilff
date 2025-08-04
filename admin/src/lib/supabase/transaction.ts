import {
  SimpleTransaction,
  Transaction,
  TransactionItem,
} from "@/@types/transaction";
import { supabaseAdmin } from "../supabaseServer";
import { PurchaseItem } from "@/@types/purchases";

interface HPPResult {
  totalHPP: number;
  usedItems: { id: string; quantity: number; price: number }[];
}

const tableName = "transactions";

export async function calculateAndUpdateHPP(
  product_id: string,
  quantity: number
): Promise<{ success: boolean; hppResult?: HPPResult; error?: string }> {
  const purchaseItems = await getAvailablePurchaseItemsFIFO(product_id);

  let remainingQty = quantity;
  let totalHPP = 0;
  const usedItems: HPPResult["usedItems"] = [];

  for (const item of purchaseItems) {
    if (remainingQty <= 0) break;

    const availableQty = item.remaining_quantity;
    const qtyToUse = Math.min(availableQty, remainingQty);

    // Update sisa stok
    const { error } = await supabaseAdmin
      .from("purchase_items")
      .update({ remaining_quantity: availableQty - qtyToUse })
      .eq("id", item.id);

    if (error) {
      console.error("Gagal update remaining_quantity:", error);
      return { success: false, error: "Gagal update remaining_quantity" };
    }

    usedItems.push({
      id: item.id as string,
      quantity: qtyToUse,
      price: item.hpp,
    });

    totalHPP += qtyToUse * item.hpp;
    remainingQty -= qtyToUse;
  }

  if (remainingQty > 0) {
    return {
      success: false,
      error: "Produk belum memiliki riwayat pembelian yang valid (HPP kosong)",
    };
  }

  return {
    success: true,
    hppResult: {
      totalHPP,
      usedItems,
    },
  };
}

export async function getAvailablePurchaseItemsFIFO(
  product_id: string
): Promise<PurchaseItem[]> {
  const { data, error } = await supabaseAdmin
    .from("purchase_items")
    .select("*")
    .eq("product_id", product_id)
    .gt("remaining_quantity", 0)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Gagal mengambil purchase_items:", error);
    throw new Error("Gagal mengambil data pembelian untuk produk ini");
  }

  return data as PurchaseItem[];
}

export async function getTransactionData(): Promise<Transaction[]> {
  const { data, error } = await supabaseAdmin
    .from(tableName)
    .select("*")
    .is("deleted_at", null)
    .order("transaction_at", { ascending: false });

  if (error) {
    console.error("Gagal mengambil data transaksi:", error);
    throw error;
  }

  return data as Transaction[];
}

export async function getTransactionDataById(
  transactionId: string
): Promise<Transaction> {
  const { data, error } = await supabaseAdmin
    .from(tableName)
    .select("*")
    .is("deleted_at", null)
    .order("transaction_at", { ascending: false })
    .eq("id", transactionId)
    .single();

  if (error || !data) {
    console.error("Gagal mengambil data transaksi:", error);
    throw error;
  }

  return data as Transaction;
}

export async function getTransactionDataByDate(
  startDate: string,
  endDate: string
) {
  const fullStart = `${startDate}T00:00:00`;
  const fullEnd = `${endDate}T23:59:59`;

  const { data, error } = await supabaseAdmin
    .from(tableName)
    .select(
      "transaction_code, customer_name, id, transaction_at, payment_method, total_amount"
    )
    .gte("transaction_at", fullStart)
    .lte("transaction_at", fullEnd)
    .is("deleted_at", null);

  if (error || !data) {
    console.error("Gagal mengambil transaksi:", error);
    throw error;
  }

  return data as SimpleTransaction[];
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
        throw itemError;
      }

      return {
        ...trx,
        items: items || [],
      };
    })
  );

  return withItems;
}

// Simpan transaksi
export async function saveTransaction(payload: Transaction) {
  const trx = await supabaseAdmin
    .from("transactions")
    .insert(payload)
    .select()
    .single();

  const { error: transactionError, data: createdTransaction } = trx;

  if (transactionError) {
    console.error("Transaction insert error:", transactionError);
    return {
      message: "Terjadi kesalahan saat input data transaksi",
      success: false,
    };
  }

  return { createdTransaction, success: true };
}

export async function updateTransaction(payload: Transaction) {
  const transactionId = payload.id;
  const { error: updateError } = await supabaseAdmin
    .from("transactions")
    .update(payload)
    .eq("id", transactionId);

  if (updateError) {
    console.error("Terjadi error saat update transaksi", updateError);

    return {
      message: "Terjadi error saat update transaksi",
      success: false,
    };
  }

  return { message: "Update transaksi berhasil", success: true };
}

export async function saveTransactionItems(
  payload: TransactionItem[],
  transactionId: string
) {
  const insertItems = payload.map((item) => {
    const itemPayload = { ...item, transaction_id: transactionId };
    return supabaseAdmin
      .from("transaction_items")
      .insert<typeof itemPayload>(itemPayload)
      .select();
  });

  const itemInsertResults = await Promise.all(insertItems);

  return itemInsertResults;
}
