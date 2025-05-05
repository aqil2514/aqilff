import { useProductsData } from "@/components/Providers/ProductsProvider";
import ProductCard from "../ProductCard";

export default function ProductList() {
  const { filteredProducts } = useProductsData();

  return (
    <div className="h-[80vh] overflow-y-auto px-2 py-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
