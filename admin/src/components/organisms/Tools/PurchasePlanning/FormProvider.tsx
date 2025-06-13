/* eslint-disable @typescript-eslint/no-explicit-any */
import { PurchasePlanItem } from "@/@types/purchases";
import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { PurchasePlanningDialogType } from "./Dialog";

interface PurchasePlanningFormContext {
  form: UseFormReturn<PurchasePlanItem, any, PurchasePlanItem>;
  type: PurchasePlanningDialogType;
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
}

const FormContext = createContext<PurchasePlanningFormContext>(
  {} as PurchasePlanningFormContext
);

interface Props {
  children: React.ReactNode;
  type: PurchasePlanningDialogType;
}

const defaultValues: (type: PurchasePlanningDialogType) => PurchasePlanItem = (
  type: PurchasePlanningDialogType
) => {
  const defaultValue: PurchasePlanItem = {} as PurchasePlanItem;
  if (type === "addForm") {
    defaultValue.itemName = "";
    defaultValue.category = "";
    defaultValue.marginFromCost = 0;
    defaultValue.marginFromSelling = 0;
    defaultValue.marginPerItem = 0;
    defaultValue.packCount = 0;
    defaultValue.profit = 0;
    defaultValue.purchasePrice = 0;
    defaultValue.quantityPerPack = 0;
    defaultValue.sellingPrice = 0;
    defaultValue.sourceItem = "";
    defaultValue.status = "";
    defaultValue.totalPurchaseValue = 0;
    defaultValue.totalSellingValue = 0;
    defaultValue.unitCost = 0;

    return defaultValue;
  }
  return defaultValue;
};

export default function PurchasePlanningFormProvider({
  children,
  type,
}: Props) {
  const form = useForm<PurchasePlanItem>({
    defaultValues: defaultValues(type),
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const value: PurchasePlanningFormContext = {
    form,
    type,
    isLoading,
    setIsLoading,
  };

  return <FormContext.Provider value={value}>{children}</FormContext.Provider>;
}

export const usePurchasePlanningFormContext = () => useContext(FormContext);
