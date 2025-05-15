import { useProductsData } from "@/components/providers/ProductsProvider";
import ProductTable from "./products-table";

export default function TableProducts() {
  const { products } = useProductsData();
  return <ProductTable data={products} />;
}
