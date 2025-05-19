import { Product } from "@/@types/products";
import { Transaction, TransactionItem } from "@/@types/transaction";
import React, { createContext, useContext } from "react";

interface TransactionContextState {
  products: Product[];
  transactions: Transaction[];
  transactionItems: TransactionItem[];
}

type TransactionProviderProps = Pick<
  TransactionContextState,
  "products" | "transactions" | "transactionItems"
> & {
  children: React.ReactNode;
};

const TransactionContext = createContext<TransactionContextState>(
  {} as TransactionContextState
);

export default function TransactionProvider({
  children,
  products,
  transactions,
  transactionItems,
}: TransactionProviderProps) {
  return (
    <TransactionContext.Provider
      value={{
        products,
        transactionItems,
        transactions,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
}

export const useTransactionData = () => useContext(TransactionContext);
