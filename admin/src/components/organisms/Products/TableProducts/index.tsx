import { useProductsData } from "@/components/providers/ProductsProvider";
import ProductTable from "./products-table";

export default function TableProducts() {
  const { filteredProducts } = useProductsData();

  return (
    <div>
      <ProductTable data={filteredProducts} />
    </div>
  );
}
