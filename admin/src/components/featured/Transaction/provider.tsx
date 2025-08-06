
import { Transaction } from "@/@types/transaction";
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";

interface TransactionContextState {
  transactions: Transaction[];
  setTransactions: Dispatch<SetStateAction<Transaction[]>>;
}

const TransactionContext = createContext<TransactionContextState>(
  {} as TransactionContextState
);

interface TransactionProviderProps {
  children: ReactNode;
}

export default function TransactionProvider({
  children,
}: TransactionProviderProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const value: TransactionContextState = {
    setTransactions,
    transactions,
  };

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
}

export const useTransactionData = () => useContext(TransactionContext);
