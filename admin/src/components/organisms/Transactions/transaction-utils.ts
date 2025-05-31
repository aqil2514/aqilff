import { Transaction } from "@/@types/transaction";
import { formatToRupiah } from "@/lib/utils";
import { UseFormReturn } from "react-hook-form";

type FormType = UseFormReturn<Transaction, unknown, Transaction>;

export const defaultTransactionItem = {
  product_id: "",
  product_name: "",
  discount: 0,
  price_per_unit: 0,
  product_sku: "",
  product_unit: "",
  quantity: 1,
  subtotal: 0,
  tip: 0,
  margin: 0,
};

export function calculateItemTotal(sub: number, tip: number, discount: number) {
  return sub + tip - discount;
}

export function getTotalPrice(form: FormType) {
  const { watch, setValue } = form;
  const itemArray = watch(`items`);
  if(!itemArray) return "";

  const total = itemArray.reduce((acc, item) => {
    const subTotal = Number(item.subtotal || 0);
    const discount = Number(item.discount || 0);
    const tip = Number(item.tip || 0);

    return acc + (subTotal + tip - discount);
  }, 0);

  setValue("total_amount", total);

  return formatToRupiah(total);
}

export function getSubTotal(index: number, form: FormType) {
  const { watch } = form;
  const sub = Number(watch(`items.${index}.subtotal`));
  const discount = Number(watch(`items.${index}.discount`));
  const tip = Number(watch(`items.${index}.tip`));
  const result = formatToRupiah(calculateItemTotal(sub, tip, discount));

  return result;
}
