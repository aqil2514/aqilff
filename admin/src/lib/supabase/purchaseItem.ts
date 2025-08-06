import { supabaseAdmin } from "../supabaseServer";

const tableName = "purchase_items";

export async function getHppItemByProductId(product_id: string) {
  const { data, error } = await supabaseAdmin
    .from(tableName)
    .select("hpp, purchase_id(purchase_date)")
    .eq("product_id", product_id)
    .gt("remaining_quantity", 0)
    .order("created_at", { ascending: true })
    .limit(1);

  if (error || !data) {
    console.error(error);
    throw error;
  }

  return data[0].hpp;
}