import { Product } from "@/@types/products";
import { Transaction, TransactionItem } from "@/@types/transaction";
import React, {
  createContext,
  SetStateAction,
  useContext,
  useState,
} from "react";

type RangeData = {
  start: string;
  end: string;
};

interface TransactionContextState {
  products: Product[];
  dateRange: RangeData | null;
  setDateRange: React.Dispatch<SetStateAction<RangeData | null>>;
  transactions: Transaction[];
  setTransactions: React.Dispatch<SetStateAction<Transaction[]>>;
  transactionItems: TransactionItem[];
  setTransactionItems: React.Dispatch<SetStateAction<TransactionItem[]>>;
  isLoadingTransactions: boolean;
  setIsLoadingTransactions: React.Dispatch<SetStateAction<boolean>>;
}

type TransactionProviderProps = Pick<TransactionContextState, "products"> & {
  children: React.ReactNode;
};

const TransactionContext = createContext<TransactionContextState>(
  {} as TransactionContextState
);

export default function TransactionProvider({
  children,
  products,
}: TransactionProviderProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [transactionItems, setTransactionItems] = useState<TransactionItem[]>(
    []
  );
  const [isLoadingTransactions, setIsLoadingTransactions] =
    useState<boolean>(false);

  const [dateRange, setDateRange] = useState<RangeData | null>(null);

  return (
    <TransactionContext.Provider
      value={{
        isLoadingTransactions,
        setIsLoadingTransactions,
        products,
        setTransactionItems,
        dateRange,
        setDateRange,
        transactionItems,
        transactions,
        setTransactions,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
}

export const useTransactionData = () => useContext(TransactionContext);
