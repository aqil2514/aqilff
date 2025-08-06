import AddTransactionTemplate from "@/components/templates/Navigations/TransactionAddTemplate";
import { getProductData } from "@/lib/supabase/products";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Tambah Transaksi",
};

export const dynamic = "force-dynamic";

export default async function AddTransactionPage() {
  const products = await getProductData();

  return <AddTransactionTemplate products={products} />;
}
