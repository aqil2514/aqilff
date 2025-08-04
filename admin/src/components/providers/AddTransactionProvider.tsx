import { Product } from "@/@types/products";
import React, { createContext, useContext } from "react";

interface AddTransactionContextState {
  products: Product[];
}

const AddTransactionContext = createContext<AddTransactionContextState>(
  {} as AddTransactionContextState
);

interface AddTransactionProviderProps {
  children: React.ReactNode;
  products: Product[];
}

export default function AddTransactionProvider({
  children,
  products,
}: AddTransactionProviderProps) {
  const value: AddTransactionContextState = {
    products,
  };

  return (
    <AddTransactionContext.Provider value={value}>
      {children}
    </AddTransactionContext.Provider>
  );
}

export const useAddTransactionData = () => useContext(AddTransactionContext);
