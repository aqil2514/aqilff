import ProductsRoute from "@/components/Routes/Products";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Produk | Aqil Frozen Food",
};

export default async function Products() {
  return <ProductsRoute />;
}
