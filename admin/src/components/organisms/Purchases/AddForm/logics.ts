"use client";
import { Purchase } from "@/@types/purchases";
import { usePurchaseData } from "@/components/providers/PurchasesProvider";
import { getLocalDateTimeValue } from "@/lib/utils";
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
  const { resource } = usePurchaseData();
  const form = useForm<Purchase>({
    defaultValues: {
      purchase_date: getLocalDateTimeValue(),
      items: [defaultPurchaseItemValue],
    },
  });

  const [isGettingCode, setIsGettingCode] = useState<boolean>(false);

  const fieldArray = useFieldArray({
    name: "items",
    control: form.control,
  });

  const getCode = async () => {
    try {
      const { getValues, setValue } = form;
      const date = getValues("purchase_date");

      setIsGettingCode(true);
      const { data } = await axios.get("/api/purchases/get-code", {
        params: {
          start: date.slice(0, 10).split("-").join(""),
          end: date.slice(0, 10).split("-").join(""),
        },
      });

      toast(data.message, { type: "success" });
      const newCode = data.newCode;

      setValue("purchase_code", newCode);
    } catch (error) {
      if (isAxiosError(error)) {
        const data = error.response?.data;

        toast(data.message, { type: "error" });
      }
      console.error(error);
    } finally {
      setIsGettingCode(false);
    }
  };

  const list: ListForm = {
    supplierName: useCallback(() => {
      const res = resource.supplierNames
        .map((pur) => pur.value ?? "")
        .filter((v) => v !== "");

        console.log(res)

      const supplierNameSet = new Set<string>();

      for (const r of res) {
        supplierNameSet.add(r);
      }

      return Array.from(supplierNameSet).sort();
    }, [resource]),
    supplierType: useCallback(() => {
      const res = resource.supplierTypes
        .map((pur) => pur.value ?? "")
        .filter((v) => v !== "");

      const supplierTypeSet = new Set<string>();

      for (const r of res) {
        supplierTypeSet.add(r);
      }
      return Array.from(supplierTypeSet).sort();
    }, [resource]),
    productName: useCallback(() => {
      const result = resource.productData
        .map((prod) => {
          return { name: prod.value, id: prod.key as string };
        })
        .filter((prod) => prod.name !== "")
        .sort();

      return result;
    }, [resource]),
  };

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const purchaseSubmit: SubmitHandler<Purchase> = async (formData) => {
    try {
      setIsLoading(true);
      const { data } = await axios.post("/api/purchases/add", formData);

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

  return {
    ...form,
    ...fieldArray,
    getCode,
    isGettingCode,
    list,
    isLoading,
    purchaseSubmit,
  };
}
