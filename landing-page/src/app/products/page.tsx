import ProductsRoute from "@/components/Routes/Products";
import { getProducts } from "@/lib/supabase-fetch";

export default async function Products() {
  const products = await getProducts();
  return <ProductsRoute products={products} />;
}
