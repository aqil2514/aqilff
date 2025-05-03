import { Category, Product } from "@/@types/interfaces";
import { supabase } from "./supabase";

export async function getCategories(): Promise<Category[]> {
  try {
    const { data, error } = await supabase.from("categories").select("*");

    if (error) throw error;

    return data as Category[];
  } catch (err) {
    throw new Error(
      "Terjadi kesalahan saat mengambil data produk",
      err as ErrorOptions
    );
  }
}

export async function getProducts(): Promise<Product[]> {
  try {
    const { data, error } = await supabase.from("products").select("*");

    if (error) throw error;

    return data as Product[];
  } catch (err) {
    throw new Error(
      "Terjadi kesalahan saat mengambil data produk",
      err as ErrorOptions
    );
  }
}
