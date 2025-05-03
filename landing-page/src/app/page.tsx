import HomeRoute from "@/components/Routes/Home";
import { getCategories, getProducts } from "@/lib/supabase-fetch";

const getAllData = async () => {
  try {
    const [products, categories] = await Promise.all([
      getProducts(),
      getCategories(),
    ]);
    return { products, categories };
  } catch (err) {
    console.error("Failed to fetch data:", err);
    return { products: [], categories: [] };
  }
};

export default async function LandingPage() {
  const { categories, products } = await getAllData();
  return <HomeRoute categories={categories} products={products} />;
}
