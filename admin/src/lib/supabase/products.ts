import { Product } from "@/@types/products";
import { supabaseAdmin } from "../supabaseServer";

export async function getProductData(): Promise<Product[]> {
  const { data, error } = await supabaseAdmin
    .from("products")
    .select("*")
    .is("deleted_at", null);

  if (error) {
    console.error("Gagal mengambil data pembelian:", error);
    throw new Error("Gagal mengambil data pembelian");
  }

  return data as Product[];
}
