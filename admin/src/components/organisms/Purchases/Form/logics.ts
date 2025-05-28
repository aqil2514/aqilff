"use client";
import { Purchase } from "@/@types/purchases";
import { usePurchaseData } from "@/components/providers/PurchasesProvider";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { getPurchaseDefaultValue } from "../purchase-utils";
import { useCallback, useState } from "react";
import axios, { isAxiosError } from "axios";
import { toast } from "react-toastify";
import { DialogType } from ".";
import { Row } from "@tanstack/react-table";

export type ListForm = {
  supplierName: () => string[];
  supplierType: () => string[];
  productName: () => {
    name: string;
    id: string;
  }[];
};

export function usePurchaseLogics(type: DialogType, row: Row<Purchase>) {
  const { resource } = usePurchaseData();
  const form = useForm<Purchase>({
    defaultValues: getPurchaseDefaultValue(type, row),
  });

  const [isGettingCode, setIsGettingCode] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

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

  const methodMap = {
    post: axios.post,
    put: axios.put,
  } as const;

  const purchaseSubmit: SubmitHandler<Purchase> = async (formData) => {
    const apiRoute: Record<DialogType, string> = {
      "add-form": "/api/purchases/add",
      "edit-form": "/api/purchases/edit",
    };

    const apiMethod: Record<DialogType, "post" | "put"> = {
      "add-form": "post",
      "edit-form": "put",
    };

    try {
      setIsLoading(true);

      const method = apiMethod[type];
      const url = apiRoute[type];

      const { data } = await methodMap[method](url, formData);

      toast(data?.message || "Berhasil", { type: "success" });
    } catch (error) {
      if (isAxiosError(error)) {
        const data = error.response?.data;
        toast(data?.message || "Terjadi kesalahan", { type: "error" });
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
