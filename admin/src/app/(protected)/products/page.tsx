import { Product } from "@/@types/products";
import ProductTemplate from "@/components/templates/ProductTemplate";
import { supabase } from "@/lib/supabaseServer";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Produk",
};

export default async function ProductsPage() {
  try {
    const { data, error } = await supabase.from("products").select("*");

    if (!data || error) throw new Error("Data tidak bisa diambil : " + error);
    const products: Product[] = data;

    return <ProductTemplate products={products} />;
  } catch (error) {
    throw new Error("Data tidak bisa diambil : " + error);
  }
}
