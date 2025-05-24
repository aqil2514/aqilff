import { supabaseAdmin } from "../supabaseServer";
import { Purchase, PurchaseItem } from "@/@types/purchases";

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
) {
  const { data, error } = await supabaseAdmin
    .from("purchase_items")
    .insert({
      purchase_id: purchaseId,
      ...payload,
    })
    .select()
    .single();

  if (error) {
    console.error("Gagal menyimpan transaksi:", error);
    throw new Error("Gagal menyimpan transaksi");
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
  const { data: purchases, error } = await supabaseAdmin
    .from("purchases")
    .select("*")
    .gte("purchase_date", startDate)
    .lte("purchase_date", endDate)
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