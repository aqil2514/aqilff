import AddTransactionTemplate from "@/components/templates/Navigations/TransactionAddTemplate";
import { getProductData } from "@/lib/supabase/products";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tambah Transaksi",
};

export default async function AddTransactionPage() {
  const [products] = await Promise.all([getProductData()]);
  
  return <AddTransactionTemplate products={products} />;
}
