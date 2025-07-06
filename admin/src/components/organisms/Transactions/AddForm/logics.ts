import { Transaction } from "@/@types/transaction";
import { useTransactionData } from "@/components/providers/TransactionProvider";
import axios, { isAxiosError } from "axios";
import { useEffect, useState } from "react";
import { SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import { getDataCode } from "@/lib/utils/server";
import { getTotalPrice } from "../transaction-utils";

export function useTransactionFormLogics() {
  const { products, form } = useTransactionData();

  useEffect(() => {
    form.reset();
  }, [form]);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isGettingCode, setIsGettingCode] = useState<boolean>(false);

  const getTransactionCode = () =>
    getDataCode({
      form,
      codeField: "transaction_code",
      dateField: "transaction_at",
      setIsGettingCode,
      dataSrc: "transaction",
    });

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
      form.reset();
      setIsLoading(false);
    }
  };

  return {
    ...form,
    products,
    getTransactionCode,
    isGettingCode,
    transactionSubmit,
    isLoading,
  };
}

export function useTransactionItemFormLogics() {
  const { fieldArray, form, products, productsName } = useTransactionData();
  const { fields, append, remove } = fieldArray;
  const { register } = form;
  const totalPrice = getTotalPrice(form);

  return {
    products,
    productsName,
    fields,
    append,
    remove,
    register,
    totalPrice,
    form,
  };
}

export function useDialogLogics() {
  const { dateRange } = useTransactionData();

  return { dateRange };
}

