import { Transaction } from "@/@types/transaction";
import { useTransactionData } from "@/components/providers/TransactionProvider";
import { formatToRupiah, generateTransactionCode } from "@/lib/utils";
import axios, { isAxiosError } from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { toast } from "react-toastify";

export function useTransactionFormLogics() {
  const { products, transactions } = useTransactionData();
  const todayTransactionInfo = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10).replace(/-/g, ""); // "20250519"

    // Filter transaksi yang ID-nya mengandung tanggal hari ini
    const todayTransactions = transactions
      .filter((tr) => tr.transaction_code.includes(today))
      .sort((a, b) => (a.id > b.id ? 1 : -1)); // Urutkan jika perlu

    if (todayTransactions.length > 0) {
      return {
        isFirst: false,
        lastTransactionId: todayTransactions[todayTransactions.length - 1].transaction_code,
      };
    }

    return {
      isFirst: true,
      lastTransactionId: null,
    };
  }, [transactions]);

  const [lastCodeToday, setLastCodeToday] = useState<string>("");
  
  useEffect(() => {
    const { isFirst, lastTransactionId } = todayTransactionInfo;

    if (!isFirst && lastTransactionId) {
      setLastCodeToday(lastTransactionId);
    }
  }, [todayTransactionInfo]);

  const newCode = generateTransactionCode(lastCodeToday);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const form = useForm<Transaction>({
    defaultValues: {
      transaction_code: newCode,
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
    },
  });

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
    productChangeHandler,
    subTotalChangeHandler,
    subTotal,
    totalPrice,
    transactionSubmit,
    isLoading,
  };
}
