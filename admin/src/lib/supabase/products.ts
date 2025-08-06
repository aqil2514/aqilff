import { Product } from "@/@types/products";
import { supabaseAdmin } from "../supabaseServer";

const tableName = "products";

export async function getProductData(): Promise<Product[]> {
  const { data, error } = await supabaseAdmin
    .from(tableName)
    .select("*")
    .is("deleted_at", null);

  if (error) {
    console.error("Gagal mengambil data pembelian:", error);
    throw error;
  }

  return data as Product[];
}

export async function getProductById(productId: string) {
  const { data, error } = await supabaseAdmin
    .from(tableName)
    .select("*")
    .eq("id", productId)
    .single();
  if (error || !data) {
    console.error(error);
    throw error;
  }

  return data as Product;
}

export async function rollbackProductStockById(
  productId: string,
  quantityToAdd: number
) {
  const { data: product, error: getError } = await supabaseAdmin
    .from(tableName)
    .select("stock")
    .eq("id", productId)
    .single();

  if (getError || !product) {
    console.error("Gagal mengambil stok produk:", getError);
    throw getError;
  }

  const newStock = product.stock + quantityToAdd;

  const { error: updateError } = await supabaseAdmin
    .from(tableName)
    .update({ stock: newStock, is_active: true })
    .eq("id", productId);

  if (updateError) {
    console.error("Gagal mengembalikan stok:", updateError);
    throw updateError;
  }
}
