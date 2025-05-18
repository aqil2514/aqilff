import { useProductsData } from "@/components/Providers/ProductsProvider";
import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

export function useSearchNameLogic() {
    const { setFilter, filter, products, setFilteredProducts } =
      useProductsData();
    const router = useRouter();
    const searchParams = useSearchParams();
    const searchRef = useRef<HTMLInputElement | null>(null);
  
    // Sinkronisasi dari URL ke state
    useEffect(() => {
      const query = searchParams.get("q") || "";
      setFilter((prev) => ({ ...prev, productName: query }));
    }, [searchParams, setFilter]);
  
    // Sinkronisasi dari state ke filteredProducts
    useEffect(() => {
      const name = filter.productName?.toLowerCase() || "";
      const newProducts = products.filter((prod) =>
        prod.name.toLowerCase().includes(name)
      );
      setFilteredProducts(newProducts);
    }, [filter.productName, products, setFilteredProducts]);
  
    const searchHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
      const name = e.target.value;
      setFilter((prev) => ({ ...prev, productName: name }));
      router.replace(`?search=true&q=${name}`);
    };
  
    return { searchHandler, filter, searchRef };
  }