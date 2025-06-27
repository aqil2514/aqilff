import { DataListOption } from "@/@types/general";
import { PurchasePlanItem } from "@/@types/purchases";
import { RowSelectionState } from "@tanstack/react-table";
import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";

type RangeData = {
  start: string;
  end: string;
};

type Resource = {
  productData: DataListOption[];
};

interface PurchasePlanItemContextProps {
  resource: Resource;
  dateRange: RangeData | null;
  data: PurchasePlanItem[];
  setData: Dispatch<SetStateAction<PurchasePlanItem[]>>;
  setDateRange: React.Dispatch<SetStateAction<RangeData | null>>;
  isLoadingPurchasePlanItem: boolean;
  setIsLoadingPurchasePlanItem: React.Dispatch<SetStateAction<boolean>>;
  rowSelection?: RowSelectionState;
  setRowSelection?: React.Dispatch<SetStateAction<RowSelectionState>>;
  isMultipleSelectionRow: boolean;
  setIsMultipleSelectionRow: React.Dispatch<SetStateAction<boolean>>;
}

const PurchasePlanItemContext = createContext<PurchasePlanItemContextProps>(
  {} as PurchasePlanItemContextProps
);

type PurchaseProviderProps = {
  children: React.ReactNode;
  resource: Resource;
};

export default function PurchasePlanItemProvider({
  resource,
  children,
}: PurchaseProviderProps) {
  const [dateRange, setDateRange] = useState<RangeData | null>(null);
  const [isLoadingPurchasePlanItem, setIsLoadingPurchasePlanItem] =
    useState<boolean>(false);
  const [data, setData] = useState<PurchasePlanItem[]>([]);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const [isMultipleSelectionRow, setIsMultipleSelectionRow] =
    useState<boolean>(false);

  return (
    <PurchasePlanItemContext.Provider
      value={{
        resource,
        isLoadingPurchasePlanItem,
        setIsLoadingPurchasePlanItem,
        dateRange,
        setDateRange,
        data,
        setData,
        rowSelection,
        setRowSelection,
        isMultipleSelectionRow,
        setIsMultipleSelectionRow,
      }}
    >
      {children}
    </PurchasePlanItemContext.Provider>
  );
}

export const usePurchasePlanItemData = () =>
  useContext(PurchasePlanItemContext);
