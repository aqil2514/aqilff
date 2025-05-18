import { useProductsData } from "@/components/Providers/ProductsProvider";
import React, { useCallback, useEffect, useMemo } from "react";

export function useFilterProductsLogic() {
  const { filter, setFilter, initFilter, products, setFilteredProducts } =
    useProductsData();

  const category = useMemo(() => {
    const categorySet = new Set<string>();

    for (const prod of products) {
      categorySet.add(prod.category);
    }

    return Array.from(categorySet);
  }, [products]);

  // Mengecek apakah ada filter aktif
  const isFilterActive = useCallback(() => {
    return filter.category !== "" || filter.inStockOnly === true;
  }, [filter]);

  useEffect(() => {
    const { category, inStockOnly } = filter;

    if (isFilterActive()) {
      const newProducts = products.filter((prod) => {
        const matchCategory = category === "" || prod.category === category;
        const matchStock = !inStockOnly || prod.is_active === true;

        return matchCategory && matchStock;
      });

      setFilteredProducts(newProducts);
    } else {
      setFilteredProducts(products);
    }
  }, [filter, products, setFilteredProducts, isFilterActive]);

  // Handler untuk perubahan kategori
  const categoryChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const target = e.target as HTMLInputElement;
    const value = target.value;

    setFilter((prev) => ({
      ...prev,
      category: prev.category === value ? "" : value, // toggle kategori
    }));
  };

  // Handler untuk filter lainnya
  const otherChangeHandler = {
    inStockOnly() {
      setFilter((prev) => ({
        ...prev,
        inStockOnly: !prev.inStockOnly,
      }));
    },
  };

  // Hapus semua filter
  const deleteAllFilter = () => {
    setFilter(initFilter);
  };

  return {
    category,
    filter,
    categoryChangeHandler,
    otherChangeHandler,
    isFilterActive,
    deleteAllFilter,
  };
}
