import { DataListOption } from "@/@types/general";
import { Purchase, PurchaseItem } from "@/@types/purchases";
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

type Resource = {
  supplierNames: DataListOption[];
  supplierTypes: DataListOption[];
  productData: DataListOption[];
};

interface PurchaseContextProps {
  resource: Resource;
  purchases: Purchase[];
  setPurchases: React.Dispatch<SetStateAction<Purchase[]>>;
  purchaseItems: PurchaseItem[];
  setPurchaseItems: React.Dispatch<SetStateAction<PurchaseItem[]>>;
  dateRange: RangeData | null;
  setDateRange: React.Dispatch<SetStateAction<RangeData | null>>;
  isLoadingPurchases: boolean;
  setIsLoadingPurchases: React.Dispatch<SetStateAction<boolean>>;
}

const PurchaseContext = createContext<PurchaseContextProps>(
  {} as PurchaseContextProps
);

type PurchaseProviderProps = {
  children: React.ReactNode;
  resource: Resource;
};

export default function PurchaseProvider({
  resource,
  children,
}: PurchaseProviderProps) {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [purchaseItems, setPurchaseItems] = useState<PurchaseItem[]>([]);
  const [dateRange, setDateRange] = useState<RangeData | null>(null);
  const [isLoadingPurchases, setIsLoadingPurchases] = useState<boolean>(false);

  return (
    <PurchaseContext.Provider
      value={{
        resource,
        purchaseItems,
        purchases,
        setPurchaseItems,
        setPurchases,
        isLoadingPurchases,
        setIsLoadingPurchases,
        dateRange,
        setDateRange,
      }}
    >
      {children}
    </PurchaseContext.Provider>
  );
}

export const usePurchaseData = () => useContext(PurchaseContext);
