import { Category, Product } from "@/@types/interfaces";
import React, { SetStateAction, useContext, useState } from "react";

interface FilterProductsProps {
  productName: string;
  category: string;
  inStockOnly: boolean;
}

interface ProductsContextProps {
  filteredProducts: Product[];
  products: Product[];
  category: Category[];
  setFilteredProducts: React.Dispatch<SetStateAction<Product[]>>;
  initFilter: FilterProductsProps;
  filter: FilterProductsProps;
  setFilter: React.Dispatch<SetStateAction<FilterProductsProps>>;
}

interface ProductsProviderProps {
  children: React.ReactNode;
  products: Product[];
  category: Category[];
}

const ProductsContext = React.createContext<ProductsContextProps>(
  {} as ProductsContextProps
);

const initFilter = {
  productName: "",
  category: "",
  inStockOnly: false,
};

export default function ProductsProvider({
  products,
  children,
  category,
}: ProductsProviderProps) {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const [filter, setFilter] = useState<FilterProductsProps>(initFilter);

  return (
    <ProductsContext.Provider
      value={{
        filteredProducts,
        category,
        setFilteredProducts,
        filter,
        setFilter,
        products,
        initFilter
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
}

export const useProductsData = () => useContext(ProductsContext);
