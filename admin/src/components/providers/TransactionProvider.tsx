import { Product } from "@/@types/products";
import { Transaction } from "@/@types/transaction";
import React, {
  createContext,
  SetStateAction,
  useContext,
  useMemo,
  useState,
} from "react";
import {
  useFieldArray,
  UseFieldArrayReturn,
  useForm,
  UseFormReturn,
} from "react-hook-form";
import { defaultTransactionItem } from "../organisms/Transactions/transaction-utils";
import { getLocalDateTimeValue } from "@/lib/utils";

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
  isLoadingTransactions: boolean;
  setIsLoadingTransactions: React.Dispatch<SetStateAction<boolean>>;
  form: UseFormReturn<Transaction, undefined, Transaction>;
  fieldArray: UseFieldArrayReturn<Transaction, "items", "id">;
  productsName: string[];
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

  const [isLoadingTransactions, setIsLoadingTransactions] =
    useState<boolean>(false);

  const [dateRange, setDateRange] = useState<RangeData | null>(null);
  const form = useForm<Transaction, undefined>({
    defaultValues: {
      customer_name: "",
      payment_method: "cash",
      items: [defaultTransactionItem],
      transaction_at: getLocalDateTimeValue(),
    },
  });

  const fieldArray = useFieldArray({
    control: form.control,
    name: "items",
  });

  const productsName = useMemo(() => {
    const productsNameSet = new Set<string>();

    for (const prod of products) {
      productsNameSet.add(prod.name);
    }

    return Array.from(productsNameSet).sort();
  }, [products]);

  const value: TransactionContextState = {
    isLoadingTransactions,
    setIsLoadingTransactions,
    products,
    dateRange,
    setDateRange,
    transactions,
    setTransactions,
    form,
    fieldArray,
    productsName,
  };

  return (
    <TransactionContext.Provider value={value}>
      {children}
    </TransactionContext.Provider>
  );
}

export const useTransactionData = () => useContext(TransactionContext);
