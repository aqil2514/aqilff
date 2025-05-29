import { Transaction } from "@/@types/transaction";
import { useTransactionData } from "@/components/providers/TransactionProvider";
import { formatToRupiah, getLocalDateTimeValue } from "@/lib/utils";
import axios, { isAxiosError } from "axios";
import React, { useMemo, useState } from "react";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import {
  calculateItemTotal,
  defaultTransactionItem,
  getTotalPrice,
} from "../transaction-utils";
import { getDataCode } from "@/lib/utils/server";

export function useTransactionFormLogics() {
  const { products } = useTransactionData();

  const form = useForm<Transaction>({
    defaultValues: {
      customer_name: "",
      payment_method: "cash",
      items: [defaultTransactionItem],
      transaction_at: getLocalDateTimeValue(),
    },
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isGettingCode, setIsGettingCode] = useState<boolean>(false);

  const { control } = form;

  const fieldArray = useFieldArray({
    control,
    name: "items",
  });

  const productsName = useMemo(() => {
    const productsNameSet = new Set<string>();

    for (const prod of products) {
      productsNameSet.add(prod.name);
    }

    return Array.from(productsNameSet).sort();
  }, [products]);

  const getTransactionCode = () =>
    getDataCode({
      form,
      codeField: "transaction_code",
      dateField: "transaction_at",
      setIsGettingCode,
      dataSrc: "transaction",
    });

  const nowTime = new Date().toISOString().slice(0, 16);

  const productChangeHandler = (index: number, productName: string) => {
    const { setValue, getValues } = form;
    const found = products.find((p) => p.name === productName);
    if (!found) return;

    setValue(`items.${index}.product_id`, found.id);
    setValue(`items.${index}.price_per_unit`, found.price);

    const quantity = getValues(`items.${index}.quantity`) || 1;
    setValue(`items.${index}.subtotal`, quantity * found.price);
  };

  const subTotalChangeHandler = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const { setValue, getValues } = form;
    const qty = Number(e.target.value) || 0;

    const price = getValues(`items.${index}.price_per_unit`) || 0;
    setValue(`items.${index}.subtotal`, qty * price);
  };

  const subTotal = (index: number) => {
    const { watch } = form;
    const sub = Number(watch(`items.${index}.subtotal`));
    const discount = Number(watch(`items.${index}.discount`));
    const tip = Number(watch(`items.${index}.tip`));
    const result = formatToRupiah(calculateItemTotal(sub, tip, discount));

    return result;
  };

  const totalPrice = getTotalPrice(form);

  const transactionSubmit: SubmitHandler<Transaction> = async (formData) => {
    try {
      setIsLoading(true);

      const { data } = await axios.post("/api/transaction/add", formData);

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
    products,
    productsName,
    getTransactionCode,
    isGettingCode,
    productChangeHandler,
    subTotalChangeHandler,
    subTotal,
    nowTime,
    totalPrice,
    transactionSubmit,
    isLoading,
  };
}
