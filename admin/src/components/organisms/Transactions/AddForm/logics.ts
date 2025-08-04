import { Transaction } from "@/@types/transaction";
import { useTransactionData } from "@/components/providers/TransactionProvider";
import axios, { isAxiosError } from "axios";
import { useEffect, useState } from "react";
import { SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import { getDataCode } from "@/lib/utils/server";
import { getTotalPrice } from "../transaction-utils";
import { Row } from "@tanstack/react-table";
import { getLocalDateTimeValue } from "@/lib/utils";

// NEXT update logicsnya agar bisa digunakan pada mode edit juga
export function useTransactionFormLogics(
  mode: "add" | "edit",
  row?: Row<Transaction>
) {
  const { products, form } = useTransactionData();

  useEffect(() => {
    if (mode !== "add" && row) return;

    form.reset();
  }, [form, mode, row]);

  useEffect(() => {
    const { setValue } = form;
    setValue("transaction_at", getLocalDateTimeValue());
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
      form.reset();
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
