import ProductsRoute from "@/components/Routes/Products";
import { getCategories, getProducts } from "@/lib/supabase-fetch";

export default async function Products() {
  const [products, category] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);
  return <ProductsRoute products={products} category={category} />;
}
