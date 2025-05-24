import { Product } from "@/@types/products";
import { Purchase, PurchaseItem } from "@/@types/purchases";
import React, {
  createContext,
  SetStateAction,
  useContext,
  useState,
} from "react";

interface PurchaseContextProps {
  products: Product[];
  purchases: Purchase[];
  setPurchases: React.Dispatch<SetStateAction<Purchase[]>>;
  purchaseItems: PurchaseItem[];
  setPurchaseItems: React.Dispatch<SetStateAction<PurchaseItem[]>>;
}

const PurchaseContext = createContext<PurchaseContextProps>(
  {} as PurchaseContextProps
);

type PurchaseProviderProps = {
  children: React.ReactNode;
  products: Product[];
};

export default function PurchaseProvider({
  products,
  children,
}: PurchaseProviderProps) {
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [purchaseItems, setPurchaseItems] = useState<PurchaseItem[]>([]);

  return (
    <PurchaseContext.Provider
      value={{
        products,
        purchaseItems,
        purchases,
        setPurchaseItems,
        setPurchases,
      }}
    >
      {children}
    </PurchaseContext.Provider>
  );
}

export const usePurchaseData = () => useContext(PurchaseContext);
