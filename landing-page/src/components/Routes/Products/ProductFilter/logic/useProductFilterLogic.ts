import { useProductsData } from "@/components/Providers/ProductsProvider";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export function useProductFilterLogic() {
  const { products, setFilteredProducts, filter } = useProductsData();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [isSearchActive, setIsSearchActive] = useState<boolean>(false);
  const [isFilterActive, setIsFilterActive] = useState<boolean>(false);

  useEffect(() => {
    const search = searchParams.get("search");
    const filter = searchParams.get("filter");
    if (search) {
      setIsSearchActive(true);
    } else if (filter) {
      setIsFilterActive(true);
    }
  }, [searchParams]);

  const isActive = isSearchActive || isFilterActive;

  const toggleSearch = () => {
    if (isSearchActive) {
      setIsSearchActive(false);
      setFilteredProducts(products);
      router.replace("?");
    } else {
      setIsSearchActive(true);
      router.replace("?search=true");
    }
  };

  const toggleFilter = () => {
    if (isFilterActive) {
      setIsFilterActive(false);
      router.replace("?");
    } else {
      setIsFilterActive(true);
      router.replace("?filter=true");
    }
  };

 const filterCount = Object.entries(filter).reduce((count, [key, value]) => {
  if (key === "category" && value !== "") count++;
  if (key === "inStockOnly" && value === true) count++;
  return count;
}, 0);


  return {
    isSearchActive,
    setIsSearchActive,
    isFilterActive,
    setIsFilterActive,
    isActive,
    toggleFilter,
    toggleSearch,
    filterCount
  };
}
