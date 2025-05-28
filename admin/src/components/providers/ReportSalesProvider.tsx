import { Product } from "@/@types/products";
import { Transaction } from "@/@types/transaction";
import { today } from "@/lib/variables";
import React, {
  createContext,
  SetStateAction,
  useContext,
  useState,
} from "react";

interface ReportSalesContextProps {
  startDate: string;
  setStartDate: React.Dispatch<SetStateAction<string>>;
  endDate: string;
  setEndDate: React.Dispatch<SetStateAction<string>>;
  transaction: Transaction[];
  setTransaction: React.Dispatch<SetStateAction<Transaction[]>>;
  products: Product[];
  setProducts: React.Dispatch<SetStateAction<Product[]>>;
  isLoadingFetch: boolean;
  setIsLoadingFetch: React.Dispatch<SetStateAction<boolean>>;
}

const ReportSalesContext = createContext<ReportSalesContextProps>(
  {} as ReportSalesContextProps
);

export default function ReportSalesProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [startDate, setStartDate] = useState<string>(today);
  const [endDate, setEndDate] = useState<string>(today);
  const [transaction, setTransaction] = useState<Transaction[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingFetch, setIsLoadingFetch] = useState<boolean>(false);

  const value: ReportSalesContextProps = {
    endDate,
    setEndDate,
    setStartDate,
    setTransaction,
    startDate,
    transaction,
    isLoadingFetch,
    setIsLoadingFetch,
    products,
    setProducts,
  };

  return (
    <ReportSalesContext.Provider value={value}>
      {children}
    </ReportSalesContext.Provider>
  );
}

export const useReportSalesData = () => useContext(ReportSalesContext);
