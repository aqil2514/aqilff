import { useProductsData } from "@/components/Providers/ProductsProvider";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export function useProductFilterLogic() {
  const { products, setFilteredProducts } = useProductsData();
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

  return {
    isSearchActive,
    setIsSearchActive,
    isFilterActive,
    setIsFilterActive,
    isActive,
    toggleFilter,
    toggleSearch,
  };
}

export function useSearchNameLogic() {
  const { setFilter, filter, products, setFilteredProducts } =
    useProductsData();
  const router = useRouter();
  const searchParams = useSearchParams();

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

  return { searchHandler, filter };
}
