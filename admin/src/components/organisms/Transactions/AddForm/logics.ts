import { Transaction } from "@/@types/transaction";
import { useTransactionData } from "@/components/providers/TransactionProvider";
import {
  formatToRupiah,
  generateTransactionCode,
  getLocalDateTimeValue,
} from "@/lib/utils";
import axios, { isAxiosError } from "axios";
import React, { useMemo, useState } from "react";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useRetrieveDataLogic } from "../RetrieveData/logics";

export function useTransactionFormLogics() {
  const { products, transactions } = useTransactionData();
  const { handleRetrieve } = useRetrieveDataLogic();

  const form = useForm<Transaction>({
    defaultValues: {
      customer_name: "",
      payment_method: "cash",
      items: [
        {
          product_id: "",
          product_name: "",
          discount: 0,
          price_per_unit: 0,
          product_sku: "",
          product_unit: "",
          quantity: 1,
          subtotal: 0,
          tip: 0,
        },
      ],
      transaction_at: getLocalDateTimeValue(),
    },
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
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

  const getTransactionCode = () => {
    const { setValue } = form;
    const transactionDate = form.getValues("transaction_at"); // contoh: "2025-05-20T12:30"
    const dateOnly = transactionDate.slice(0, 10).split("-").join(""); // "20250520"

    const filteredTransaction = transactions
      .filter((tr) => tr.transaction_code.includes(dateOnly))
      .map((tr) => tr.transaction_code)
      .sort();

    const lastTransaction = filteredTransaction.at(-1);

    const newCode = generateTransactionCode(dateOnly, lastTransaction);

    setValue("transaction_code", newCode);
  };

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
    const result = formatToRupiah(sub + tip - discount);

    return result;
  };

  const totalPrice = () => {
    const { watch, setValue } = form;
    const itemArray = watch(`items`);
    const total = itemArray.reduce((acc, item) => {
      const subTotal = Number(item.subtotal || 0);
      const discount = Number(item.discount || 0);
      const tip = Number(item.tip || 0);

      return acc + (subTotal + tip - discount);
    }, 0);

    setValue("total_amount", total);

    return formatToRupiah(total);
  };

  const transactionSubmit: SubmitHandler<Transaction> = async (formData) => {
    try {
      setIsLoading(true);

      const { data } = await axios.post("/api/transaction/add", formData);

      toast(data.message, { type: "success" });
      await handleRetrieve({ showToast: false });
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
    productChangeHandler,
    subTotalChangeHandler,
    subTotal,
    nowTime,
    totalPrice,
    transactionSubmit,
    isLoading,
  };
}
