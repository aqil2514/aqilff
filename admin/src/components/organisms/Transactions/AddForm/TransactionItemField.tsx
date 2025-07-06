import { Button } from "@/components/ui/button";
import { productChangeHandler, subTotal, subTotalChangeHandler } from "../transaction-utils";
import { FaTrashAlt } from "react-icons/fa";
import { LabeledInput } from "@/components/atoms/inputs/LabeledInput";
import { UseFormRegister, UseFormReturn } from "react-hook-form";
import { Transaction } from "@/@types/transaction";
import { Product } from "@/@types/products";

type Props = {
  index: number;
  register: UseFormRegister<Transaction>;
  form: UseFormReturn<Transaction>;
  products: Product[];
  canRemove: boolean;
  onRemove: () => void;
};

export function TransactionItemField({
  index,
  register,
  form,
  products,
  canRemove,
  onRemove,
}: Props) {
  return (
    <div className="space-y-2 border p-4 rounded-md">
      <LabeledInput
        id="product-name"
        label={`Nama Produk #${index + 1}`}
        list="product-name-list"
        {...register(`items.${index}.product_name`)}
        onBlur={(e) =>
          productChangeHandler(index, e.target.value, form, products)
        }
      />

      <LabeledInput
        id="price_per_unit"
        label={`Harga Produk #${index + 1}`}
        type="number"
        disabled
        {...register(`items.${index}.price_per_unit`)}
      />

      <LabeledInput
        id="quantity"
        label={`Kuantitas Produk #${index + 1}`}
        type="number"
        {...register(`items.${index}.quantity`)}
        onChange={(e) => subTotalChangeHandler(e, index, form)}
      />

      <LabeledInput
        id="discount"
        label={`Diskon Produk #${index + 1}`}
        type="number"
        {...register(`items.${index}.discount`)}
      />

      <LabeledInput
        id="tip"
        label={`Tip Produk #${index + 1}`}
        type="number"
        {...register(`items.${index}.tip`)}
      />

      <p className="text-xs font-bold italic">
        Subtotal #{index + 1} : {subTotal(index, form)}
      </p>

      {canRemove && (
        <Button
          type="button"
          variant="ghost"
          className="text-red-500 hover:text-red-600"
          onClick={onRemove}
        >
          <FaTrashAlt />
        </Button>
      )}
    </div>
  );
}
