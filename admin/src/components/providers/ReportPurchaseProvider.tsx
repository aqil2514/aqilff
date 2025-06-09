import { Product } from "@/@types/products";
import { Purchase } from "@/@types/purchases";
import { today } from "@/lib/variables";
import { ColumnSort } from "@tanstack/react-table";
import React, {
  createContext,
  SetStateAction,
  useContext,
  useState,
} from "react";

interface ReportPurchaseContextProps {
  startDate: string;
  setStartDate: React.Dispatch<SetStateAction<string>>;
  endDate: string;
  setEndDate: React.Dispatch<SetStateAction<string>>;
  purchase: Purchase[];
  setPurchase: React.Dispatch<SetStateAction<Purchase[]>>;
  products: Product[];
  setProducts: React.Dispatch<SetStateAction<Product[]>>;
  isLoadingFetch: boolean;
  setIsLoadingFetch: React.Dispatch<SetStateAction<boolean>>;
  sorting: ColumnSort[];
  setSorting: React.Dispatch<SetStateAction<ColumnSort[]>>;
}

const ReportPurchaseContext = createContext<ReportPurchaseContextProps>(
  {} as ReportPurchaseContextProps
);

export default function ReportPurchaseProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [startDate, setStartDate] = useState<string>(today);
  const [endDate, setEndDate] = useState<string>(today);
  const [purchase, setPurchase] = useState<Purchase[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoadingFetch, setIsLoadingFetch] = useState<boolean>(false);
  const [sorting, setSorting] = useState<ColumnSort[]>([]);

  const value: ReportPurchaseContextProps = {
    endDate,
    setEndDate,
    setStartDate,
    setPurchase,
    startDate,
    purchase,
    isLoadingFetch,
    setIsLoadingFetch,
    products,
    setProducts,
    setSorting,
    sorting,
  };

  return (
    <ReportPurchaseContext.Provider value={value}>
      {children}
    </ReportPurchaseContext.Provider>
  );
}

export const useReportPurchaseData = () => useContext(ReportPurchaseContext);
