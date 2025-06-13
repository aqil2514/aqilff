import { PurchasePlanItem, PurchasePlanItemDb } from "@/@types/purchases";
import { supabaseAdmin } from "../supabaseServer";

export function convertToDbType(raw: PurchasePlanItem): PurchasePlanItemDb {
  return {
    item_name: raw.itemName,
    quantity_per_pack: Number(raw.quantityPerPack),
    pack_count: Number(raw.packCount),
    category: raw.category,
    purchase_price: Number(raw.purchasePrice),
    unit_cost: Number(raw.unitCost),
    margin_from_cost: Number(raw.marginFromCost.toFixed(2)),
    margin_per_item: Number(raw.marginPerItem.toFixed(2)),
    margin_from_selling: Number(raw.marginFromSelling.toFixed(2)),
    selling_price: Number(raw.sellingPrice),
    total_purchase_value: Number(raw.totalPurchaseValue),
    total_selling_value: Number(raw.totalSellingValue),
    profit: Number(raw.profit),
    status: raw.status,
    source_item: raw.sourceItem,
  };
}

export function convertFromDbType(db: PurchasePlanItemDb): PurchasePlanItem {
  return {
    id: db.id,
    itemName: db.item_name,
    quantityPerPack: db.quantity_per_pack,
    packCount: db.pack_count,
    category: db.category,
    purchasePrice: db.purchase_price,
    unitCost: db.unit_cost,
    marginPerItem: db.margin_per_item,
    marginFromCost: db.margin_from_cost,
    marginFromSelling: db.margin_from_selling,
    sellingPrice: db.selling_price,
    totalPurchaseValue: db.total_purchase_value,
    totalSellingValue: db.total_selling_value,
    profit: db.profit,
    status: db.status,
    sourceItem: db.source_item,
    createdAt: db.created_at,
    updatedAt: db.updated_at,
  };
}

export async function savePurchasePlanningItemData(raw: PurchasePlanItem) {
  const finalData: PurchasePlanItemDb = convertToDbType(raw);

  const { error } = await supabaseAdmin
    .from("purchase_plan_item")
    .insert(finalData);

  if (error) {
    console.error(error);
    return { success: false, message: "Terjadi kesalahan", error };
  }

  return { success: true, message: "Data berhasil ditambah", error: null };
}

export async function getPurchasePlanningItemData(): Promise<
  PurchasePlanItem[]
> {
  const { data, error } = await supabaseAdmin
    .from("purchase_plan_item")
    .select("*");

  if (error || !data) {
    console.error("Supabase error:", error?.message);
    throw new Error("Terjadi kesalahan saat mengambil data dari database.");
  }

  return data.map((item) => convertFromDbType(item as PurchasePlanItemDb));
}

export async function getPurchasePlanningItemDataByDateRange(
  start: string,
  end: string
): Promise<PurchasePlanItem[]> {
  const { data, error } = await supabaseAdmin
    .from("purchase_plan_item")
    .select("*")
    .gte("created_at", `${start}T00:00:00.000Z`)
    .lte("created_at", `${end}T23:59:59.999Z`);

    console.log(data)

  if (error || !data) {
    console.error("Supabase error (filter tanggal):", error?.message);
    throw new Error("Gagal mengambil data berdasarkan rentang tanggal.");
  }

  return data.map((item) => convertFromDbType(item as PurchasePlanItemDb));
}
