import { Transaction } from "@/@types/transaction";
import { useTransactionData } from "@/components/providers/TransactionProvider";
import { formatToRupiah } from "@/lib/utils";
import { Row } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { calculateItemTotal, getTotalPrice } from "../transaction-utils";
import { toast } from "react-toastify";

export function useTransactionEditFormLogic({ original }: Row<Transaction>) {
  const { products } = useTransactionData();

  const trItems = original.items;

  const form = useForm<Transaction>({
    defaultValues: {
      ...original,
      items: trItems,
      transaction_at: new Date(original.transaction_at)
        .toISOString()
        .slice(0, 16),
    },
  });

  const { register, getValues, setValue, control } = form;

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

  const [isLoading, setIsLoading] = useState<boolean>(false);

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

  // const transactionSubmit: SubmitHandler<Transaction> = async (formData) => {
  //   try {
  //     setIsLoading(true);
  //     const { data } = await axios.put("/api/transaction/edit", formData);

  //     toast(data.message, { type: "success" });
  //   } catch (error) {
  //     if (isAxiosError(error)) {
  //       const data = error.response?.data;

  //       toast(data.message, { type: "error" });
  //     }
  //     console.error(error);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };
  const transactionSubmit: SubmitHandler<Transaction> = async (formData) => {
    console.log(formData);
    console.log(setIsLoading);
    toast("Fungsi Edit dalam pengembangan", {type:"info"})
  };

  return {
    form,
    fieldArray,
    register,
    getValues,
    setValue,
    isLoading,
    productsName,
    transactionSubmit,
    subTotal,
    subTotalChangeHandler,
    productChangeHandler,
    totalPrice,
  };
}
