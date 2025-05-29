import { supabaseAdmin } from "../supabaseServer";
import { Purchase, PurchaseItem } from "@/@types/purchases";
import { update_stock_log, updateStock } from "../utils/server/rpc";

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
    .is("deleted_at", null)
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
    .is("deleted_at", null)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Gagal mengambil item pembelian:", error);
    throw new Error("Gagal mengambil item pembelian");
  }

  return data as PurchaseItem[];
}

export async function getPurchaseDataAndItems(): Promise<Purchase[]> {
  const purchases = await getPurchaseData(); // sudah filter deleted_at

  const purchasesWithItems: Purchase[] = await Promise.all(
    purchases.map(async (purchase) => {
      const { data: items, error } = await supabaseAdmin
        .from("purchase_items")
        .select("*")
        .eq("purchase_id", purchase.id)
        .is("deleted_at", null); // tambahkan ini jika soft delete

      if (error) {
        console.error(
          `Gagal mengambil item untuk purchase ${purchase.id}:`,
          error
        );
        throw new Error("Gagal mengambil item pembelian");
      }

      return {
        ...purchase,
        items: items || [],
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
  endDate: string,
  options?: { showDeletedData: boolean }
): Promise<Purchase[]> {
  const fullStart = `${startDate}T00:00:00`;
  const fullEnd = `${endDate}T23:59:59`;
  const showDeletedData = options?.showDeletedData ?? false;

  let purchaseQuery = supabaseAdmin
    .from("purchases")
    .select("*")
    .gte("purchase_date", fullStart)
    .lte("purchase_date", fullEnd)
    .order("purchase_date", { ascending: true });

  if (!showDeletedData) {
    purchaseQuery = purchaseQuery.is("deleted_at", null);
  }

  const { data: purchases, error } = await purchaseQuery;

  if (error) {
    console.error("Gagal mengambil data pembelian:", error);
    throw new Error("Gagal mengambil data pembelian");
  }

  const purchasesWithItems: Purchase[] = await Promise.all(
    (purchases || []).map(async (purchase) => {
      let itemQuery = supabaseAdmin
        .from("purchase_items")
        .select("*")
        .eq("purchase_id", purchase.id);

      if (!showDeletedData) {
        itemQuery = itemQuery.is("deleted_at", null);
      }

      const { data: items, error: itemsError } = await itemQuery;

      if (itemsError) {
        console.error(
          "Gagal mengambil item untuk purchase",
          purchase.id,
          itemsError
        );
        throw new Error("Gagal mengambil item pembelian");
      }

      return {
        ...purchase,
        items: items || [],
      };
    })
  );

  return purchasesWithItems;
}

export async function deletePurchaseData(purchaseId: string) {
  const { data: purchase, error: purchaseError } = await supabaseAdmin
    .from("purchases")
    .select("*")
    .eq("id", purchaseId)
    .single();

  if (purchaseError || !purchase) {
    throw new Error("Data pembelian tidak ditemukan");
  }

  const { data: items, error: itemsError } = await supabaseAdmin
    .from("purchase_items")
    .select("*")
    .eq("purchase_id", purchaseId);

  if (itemsError) {
    throw new Error("Gagal mengambil item pembelian");
  }

  for (const item of items || []) {
    const { success, error: stockError } = await updateStock({
      product_id: String(item.product_id),
      quantity: item.quantity,
      operation: "decrement",
    });

    if (!success) {
      throw new Error(`Gagal memperbarui stok: ${stockError?.message}`);
    }

    const { logError } = await update_stock_log({
      product_id: String(item.product_id),
      quantity: item.quantity,
      source: "purchase-delete",
      reference_id: `purchase-delete-${purchaseId}`,
    });

    if (logError) {
      throw new Error("Gagal mencatat log stok saat hapus");
    }
  }

  const now = new Date().toISOString();

  const { error: itemsUpdateError } = await supabaseAdmin
    .from("purchase_items")
    .update({ deleted_at: now })
    .eq("purchase_id", purchaseId);

  if (itemsUpdateError) {
    throw new Error("Gagal menghapus item pembelian");
  }

  const { error: purchaseUpdateError } = await supabaseAdmin
    .from("purchases")
    .update({ deleted_at: now })
    .eq("id", purchaseId);

  if (purchaseUpdateError) {
    throw new Error("Gagal menghapus data pembelian");
  }

  return true;
}

type UpdatePurchasePayload = {
  purchase: Omit<Purchase, "items">;
  items: InsertPurchaseItem[];
};

export async function updatePurchaseData({
  purchase,
  items,
}: UpdatePurchasePayload): Promise<Purchase> {
  const data = await getPurchaseDataAndItems();
  const selectedData = data.find((pur) => pur.id === purchase.id);
  if (!selectedData) throw new Error("Data tidak ditemukan");

  const newData: Purchase = {
    ...purchase,
    notes: purchase.notes,
    purchase_date: purchase.purchase_date,
    supplier_name: purchase.supplier_name,
    supplier_type: purchase.supplier_type,
    items,
  };

  const { items: newItems, ...newPurchase } = newData;

  const { error: updatePurchaseError } = await supabaseAdmin
    .from("purchases")
    .update(newPurchase)
    .eq("id", purchase.id);

  if (updatePurchaseError) {
    console.error(updatePurchaseError);
    throw new Error("Terjadi kesalahan saat update data");
  }

  // Ambil semua data item lama
  const { data: oldItemData, error: oldDataFetchError } = await supabaseAdmin
    .from("purchase_items")
    .select<"*", PurchaseItem>("*")
    .eq("purchase_id", purchase.id);

  if (!oldItemData || oldItemData.length <= 0 || oldDataFetchError) {
    console.error(oldDataFetchError);
    throw new Error("Terjadi kesalahan saat ambil data lama");
  }

  // Kurangi stoknya sebanyak jumlah yang sebelumnya ditambahkan
  for (const item of oldItemData) {
    const { product_id, quantity } = item;
    const { error: errorTemporaryDeleteStock } = await updateStock({
      product_id: String(product_id),
      operation: "decrement",
      quantity,
    });

    if (errorTemporaryDeleteStock) {
      console.error(errorTemporaryDeleteStock);
      throw new Error("Terjadi kesalahan saat mengurangi stok");
    }

    const { logError: logTemporaryDeleteError } = await update_stock_log({
      product_id: String(product_id),
      quantity: -quantity,
      reference_id: "update-stock-delete",
      source: "purchase-update-rollback",
    });

    if (logTemporaryDeleteError) {
      console.error(logTemporaryDeleteError);
      throw new Error(
        "Terjadi kesalahan saat mencatat data yang akan dikurangi"
      );
    }
  }

  // Hapus semua itemnya
  const { error: errorDeleteItems } = await supabaseAdmin
    .from("purchase_items")
    .delete()
    .eq("purchase_id", purchase.id);

  if (errorDeleteItems) {
    console.error(errorDeleteItems);
    throw new Error("Terjadi kesalahan saat hapus Item");
  }

  // Input ulang semua item yang akan ditambah
  for (const item of newItems) {
    await insertPurchaseItemData(item, String(purchase.id));
  }

  // Return data terbaru
  return {
    ...purchase,
    items,
  };
}
