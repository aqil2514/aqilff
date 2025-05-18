import { Product } from "@/@types/products";
import React, {
  createContext,
  SetStateAction,
  useContext,
  useState,
} from "react";

interface ColumnFilter {
  id: string;
  value: unknown;
}
type ColumnFiltersState = ColumnFilter[];

interface ProductContextState {
  products: Product[];
  filteredProducts: Product[];
  setFilteredProducts: React.Dispatch<SetStateAction<Product[]>>;
  columnFilters: ColumnFiltersState;
  setColumnFilters: React.Dispatch<SetStateAction<ColumnFiltersState>>;
}

type ProductProviderProps = Pick<ProductContextState, "products"> & {
  children: React.ReactNode;
};

const ProductContext = createContext<ProductContextState>(
  {} as ProductContextState
);

export default function ProductsProvider({
  children,
  products,
}: ProductProviderProps) {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  return (
    <ProductContext.Provider
      value={{
        products,
        filteredProducts,
        setFilteredProducts,
        columnFilters,
        setColumnFilters,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export const useProductsData = () => useContext(ProductContext);
