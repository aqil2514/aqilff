import { useProductsData } from "@/components/Providers/ProductsProvider";
import ProductCard from "../ProductCard";

export default function ProductList() {
  const { filteredProducts } = useProductsData();
  const isAvailable = filteredProducts.length > 0;

  return (
    <div className="h-[80vh] overflow-y-auto px-2 py-4">
      {isAvailable ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
        {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center h-full text-gray-400">
          <p className="text-lg font-medium">Ups, barang tidak ditemukan 😕</p>
          <p className="text-sm">Coba ganti filter atau kata pencarian ya.</p>
        </div>
      )}
    </div>
  );
}
