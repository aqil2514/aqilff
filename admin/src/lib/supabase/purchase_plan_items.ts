import { PurchasePlanItem, PurchasePlanItemDb } from "@/@types/purchases";
import { supabaseAdmin } from "../supabaseServer";

export function convertToDbType(raw: PurchasePlanItem) {
  return {
    item_name: raw.itemName,
    quantity_per_pack: Number(raw.quantityPerPack),
    pack_count: Number(raw.packCount),
    category: raw.category,
    purchase_price: Number(raw.purchasePrice),
    unit_cost: Number(raw.unitCost),
    selling_price: Number(raw.sellingPrice),
    total_purchase_value: Number(raw.totalPurchaseValue),
    total_selling_value: Number(raw.totalSellingValue),
    profit: Number(raw.profit),
    status: raw.status,
    source_item: raw.sourceItem,
  };
}

export async function savePurchasePlanningItemData(raw: PurchasePlanItem) {
  const finalData: PurchasePlanItemDb = convertToDbType(raw);

  const { error } = await supabaseAdmin
    .from("purchase_plan_item")
    .insert(finalData);

  if (error) return { success: false, message: "Terjadi kesalahan", error };

  return { success: true, message: "Data berhasil ditambah", error: null };
}
