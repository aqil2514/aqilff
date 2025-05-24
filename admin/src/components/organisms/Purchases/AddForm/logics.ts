"use client";
import { Purchase } from "@/@types/purchases";
import { usePurchaseData } from "@/components/providers/PurchasesProvider";
import { generateCode, getLocalDateTimeValue } from "@/lib/utils";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { defaultPurchaseItemValue } from "../purchase-utils";
import { useCallback, useState } from "react";
import axios, { isAxiosError } from "axios";
import { toast } from "react-toastify";

export type ListForm = {
  supplierName: () => string[];
  supplierType: () => string[];
  productName: () => {
    name: string;
    id: string;
  }[];
};

export function usePurchaseAddTransactionLogics() {
  const { purchases, products } = usePurchaseData();
  const form = useForm<Purchase>({
    defaultValues: {
      purchase_date: getLocalDateTimeValue(),
      items: [defaultPurchaseItemValue],
    },
  });

  const fieldArray = useFieldArray({
    name: "items",
    control: form.control,
  });

  const getCode = () => {
    const { getValues, setValue } = form;
    const date = getValues("purchase_date");
    const dateOnly = date.slice(0, 10).split("-").join("");
    const purchaseCode = purchases.map((pur) => pur.purchase_code);
    const lastCode = purchaseCode.at(-1);

    console.log(purchases)

    const newCode = generateCode(dateOnly, lastCode, "PUR");
    setValue("purchase_code", newCode);
  };

  const list: ListForm = {
    supplierName: useCallback(() => {
      const res = purchases
        .map((pur) => pur.supplier_name ?? "")
        .filter((v) => v !== "")
        .sort();
      return res;
    }, [purchases]),
    supplierType: useCallback(() => {
      const res = purchases
        .map((pur) => pur.supplier_type ?? "")
        .filter((v) => v !== "")
        .sort();
      return res;
    }, [purchases]),
    productName: useCallback(() => {
      const result = products
        .map((prod) => {
          return { name: prod.name, id: prod.id };
        })
        .filter((prod) => prod.name !== "")
        .sort();

      return result;
    }, [products]),
  };

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const purchaseSubmit: SubmitHandler<Purchase> = async (formData) => {
    try {
      setIsLoading(true);
      const { data } = await axios.post("/api/purchase/add", formData);

      toast(data.message, { type: "success" });
    } catch (error) {
      if (isAxiosError(error)) {
        const data = error.response?.data;

        toast(data.message, { type: "error" });
      }
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return { ...form, ...fieldArray, getCode, list, isLoading, purchaseSubmit };
}
