import { Product } from "@/@types/products";
import React, {
  createContext,
  SetStateAction,
  useContext,
  useState,
} from "react";

interface ProductContextState {
  products: Product[];
  filteredProducts: Product[];
  setFilteredProducts: React.Dispatch<SetStateAction<Product[]>>;
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
  return (
    <ProductContext.Provider
      value={{ products, filteredProducts, setFilteredProducts }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export const useProductsData = () => useContext(ProductContext);
