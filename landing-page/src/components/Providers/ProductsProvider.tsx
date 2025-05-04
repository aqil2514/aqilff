import { Product } from "@/@types/interfaces";
import React, { SetStateAction, useContext, useState } from "react";

interface FilterProductsProps {
  productName: string;
}

interface ProductsContextProps {
  filteredProducts: Product[];
  products: Product[];
  setFilteredProducts: React.Dispatch<SetStateAction<Product[]>>;
  filter: FilterProductsProps;
  setFilter: React.Dispatch<SetStateAction<FilterProductsProps>>;
}

interface ProductsProviderProps {
  children: React.ReactNode;
  products: Product[];
}

const ProductsContext = React.createContext<ProductsContextProps>(
  {} as ProductsContextProps
);

export default function ProductsProvider({
  products,
  children,
}: ProductsProviderProps) {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const [filter, setFilter] = useState<FilterProductsProps>(
    {
      productName:""
    }
  );
  return (
    <ProductsContext.Provider
      value={{ filteredProducts, setFilteredProducts, filter, setFilter, products }}
    >
      {children}
    </ProductsContext.Provider>
  );
}

export const useProductsData = () => useContext(ProductsContext);
