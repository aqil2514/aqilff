import ProductTemplate from "@/components/templates/ProductTemplate";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Produk",
};

export default function ProductsPage() {
  return <ProductTemplate />;
}
