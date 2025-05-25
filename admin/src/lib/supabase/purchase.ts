import { supabaseAdmin } from "../supabaseServer";
import { Purchase, PurchaseItem } from "@/@types/purchases";
import { update_stock_log, updateStock } from "../utils-server";

type InsertPurchase = Omit<Purchase, "items">;
type InsertPurchaseItem = Omit<PurchaseItem, "purchase_id">;

export async function insertPurchaseData(payload: InsertPurchase) {
  const { data, error } = await supabaseAdmin
    .from("purchases")
    .insert(payload)
    .select()
    .single();

  if (error) {
    console.error("Gagal menyimpan transaksi:", error);
    throw new Error("Gagal menyimpan transaksi");
  }

  return data as Purchase;
}

export async function insertPurchaseItemData(
  payload: InsertPurchaseItem,
  purchaseId: string
): Promise<PurchaseItem> {
  const { data, error } = await supabaseAdmin
    .from("purchase_items")
    .insert({
      purchase_id: purchaseId,
      ...payload,
    })
    .select()
    .single();

  if (error) {
    console.error("Gagal menyimpan purchase item:", error);
    throw new Error("Gagal menyimpan purchase item");
  }

  const { product_id, quantity } = payload;

  const { success, error: stockError } = await updateStock({
    product_id: String(product_id),
    quantity,
    operation: "increment",
  });

  if (!success) {
    throw new Error(`Gagal memperbarui stok: ${stockError?.message}`);
  }

  const { logError, message: logMsg } = await update_stock_log({
    product_id: String(product_id),
    quantity,
    source: "purchase",
    reference_id: purchaseId,
  });

  if (logError) {
    console.error("Gagal mencatat log stok:", logError);
    throw new Error(`Log stok error: ${logMsg}`);
  }

  return data as PurchaseItem;
}

export async function getPurchaseData(): Promise<Purchase[]> {
  const { data, error } = await supabaseAdmin
    .from("purchases")
    .select("*")
    .order("purchase_date", { ascending: false });

  if (error) {
    console.error("Gagal mengambil data pembelian:", error);
    throw new Error("Gagal mengambil data pembelian");
  }

  return data as Purchase[];
}

export async function getPurchaseItemData(): Promise<PurchaseItem[]> {
  const { data, error } = await supabaseAdmin
    .from("purchase_items")
    .select("*")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Gagal mengambil item pembelian:", error);
    throw new Error("Gagal mengambil item pembelian");
  }

  return data as PurchaseItem[];
}

export async function getPurchaseDataAndItems(): Promise<Purchase[]> {
  const purchases = await getPurchaseData();

  const purchasesWithItems: Purchase[] = await Promise.all(
    purchases.map(async (purchase) => {
      const items = await getPurchaseItemData();
      return {
        ...purchase,
        items,
      };
    })
  );

  return purchasesWithItems;
}

/**
 * Mengambil data pembelian dan item berdasarkan rentang tanggal pembelian.
 * @param startDate Format ISO string, contoh: "2025-05-01"
 * @param endDate Format ISO string, contoh: "2025-05-24"
 */
export async function getPurchaseDataAndItemsByDateRange(
  startDate: string,
  endDate: string
): Promise<Purchase[]> {
  const fullStart = `${startDate}T00:00:00`;
  const fullEnd = `${endDate}T23:59:59`;

  const { data: purchases, error } = await supabaseAdmin
    .from("purchases")
    .select("*")
    .gte("purchase_date", fullStart)
    .lte("purchase_date", fullEnd)
    .order("purchase_date", { ascending: true });

  if (error) {
    console.error("Gagal mengambil data pembelian:", error);
    throw new Error("Gagal mengambil data pembelian");
  }

  const purchasesWithItems: Purchase[] = await Promise.all(
    (purchases || []).map(async (purchase) => {
      const items = await getPurchaseItemData();
      return {
        ...purchase,
        items,
      };
    })
  );

  return purchasesWithItems;
}
