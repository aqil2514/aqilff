import { Product } from "@/@types/products";
import { createContext, useContext } from "react";

interface ProductContextState {
  products: Product[];
}

type ProductProviderProps = ProductContextState & {
  children: React.ReactNode;
};

const ProductContext = createContext<ProductContextState>(
  {} as ProductContextState
);

export default function ProductsProvider({
  children,
  products,
}: ProductProviderProps) {
  return (
    <ProductContext.Provider value={{ products }}>
      {children}
    </ProductContext.Provider>
  );
}

export const useProductsData = () => useContext(ProductContext);
