import { Product } from "@/@types/products";
import { Transaction } from "@/@types/transaction";
import { formatToRupiah } from "@/lib/utils";
import { UseFormReturn } from "react-hook-form";
import { toast } from "react-toastify";

type FormType = UseFormReturn<Transaction, undefined, Transaction>;

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
  if (!itemArray) return "";

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

export function subTotal(index: number, form: FormType) {
  const { watch } = form;
  const sub = Number(watch(`items.${index}.subtotal`));
  const discount = Number(watch(`items.${index}.discount`));
  const tip = Number(watch(`items.${index}.tip`));
  const result = formatToRupiah(calculateItemTotal(sub, tip, discount));

  return result;
}

export function subTotalChangeHandler(
  e: React.ChangeEvent<HTMLInputElement>,
  index: number,
  form: FormType
) {
  const { setValue, getValues } = form;
  const qty = Number(e.target.value) || 0;

  const price = getValues(`items.${index}.price_per_unit`) || 0;
  setValue(`items.${index}.subtotal`, qty * price);
}

export function productChangeHandler(
  index: number,
  productName: string,
  form: FormType,
  products: Product[]
) {
  const { setValue, getValues, setFocus } = form;
  const found = products.find((p) => p.name === productName);
  if (!found) {
    if (productName) {
      toast(`Product ${productName} tidak tersedia`, { type: "error" });
      setValue(`items.${index}.product_name`, "");
      setValue(`items.${index}.product_id`, "");
      setValue(`items.${index}.price_per_unit`, 0);
      setFocus(`items.${index}.quantity`)
    }
    return;
  }

  setValue(`items.${index}.product_id`, found.id);
  setValue(`items.${index}.price_per_unit`, found.price);

  const quantity = getValues(`items.${index}.quantity`) || 1;
  setValue(`items.${index}.subtotal`, quantity * found.price);
}
