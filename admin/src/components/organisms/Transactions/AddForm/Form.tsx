import { Input } from "@/components/ui/input";
import { useTransactionFormLogics } from "./logics";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import React from "react";
import { Transaction } from "@/@types/transaction";
import {
  FieldArrayWithId,
  UseFieldArrayAppend,
  UseFormRegister,
} from "react-hook-form";

export default function TransactionAddForm() {
  const {
    register,
    handleSubmit,
    transactionSubmit,
    isLoading,
    reset,
    ...transactionItemProps
  } = useTransactionFormLogics();

  return (
    <form onSubmit={handleSubmit(transactionSubmit)} className="my-4 space-y-4">
      <div className="space-y-2">
        <Label htmlFor="transaction_code">Kode Transaksi :</Label>
        <Input
          id="transaction_code"
          {...register("transaction_code")}
          disabled
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="customer_name">Nama Pembeli :</Label>
        <Input id="customer_name" {...register("customer_name")} />
      </div>

      <div className="border rounded-2xl px-2 py-2 space-y-4">
        <p className="italic">Item yang dibeli</p>
        <TransactionItem register={register} {...transactionItemProps} />
      </div>

      <div className="flex gap-2 items-center">
        <Button
          disabled={isLoading}
          type="submit"
          className="bg-blue-500 text-white px-4 py-2"
        >
          {isLoading ? "Menyimpan" : "Simpan Transaksi"}
        </Button>
        <Button type="button" onClick={() => reset()}>
          Reset
        </Button>
      </div>
    </form>
  );
}

interface TransactionItemProps {
  fields: FieldArrayWithId<Transaction, "items", "id">[];
  register: UseFormRegister<Transaction>;
  productChangeHandler: (index: number, productName: string) => void;
  subTotalChangeHandler: (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => void;
  subTotal: (index: number) => string;
  totalPrice: () => string;
  append: UseFieldArrayAppend<Transaction, "items">;
  productsName: string[];
}

const TransactionItem: React.FC<TransactionItemProps> = ({
  fields,
  register,
  productChangeHandler,
  subTotal,
  subTotalChangeHandler,
  append,
  totalPrice,
  productsName,
}) => {
  return (
    <>
      {fields.map((field, index) => (
        <div key={field.id} className="space-y-2">
          <div className="space-y-2">
            <Label htmlFor="product-name">Nama Produk #{index + 1}:</Label>
            <Input
              list="product-name-list"
              id="product-name"
              {...register(`items.${index}.product_name`)}
              onBlur={(e) => productChangeHandler(index, e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="price_per_unit">Harga Produk #{index + 1}:</Label>
            <Input
              id="price_per_unit"
              type="number"
              {...register(`items.${index}.price_per_unit`)}
              disabled
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="quantity">Kuantitas Produk #{index + 1}:</Label>
            <Input
              type="number"
              id="quantity"
              {...register(`items.${index}.quantity`)}
              onChange={(e) => subTotalChangeHandler(e, index)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="discount">Diskon Produk #{index + 1}:</Label>
            <Input
              id="discount"
              type="number"
              step={500}
              {...register(`items.${index}.discount`)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tip">Tip Produk #{index + 1}:</Label>
            <Input
              id="tip"
              type="number"
              step={500}
              {...register(`items.${index}.tip`)}
            />
          </div>
          <p className="text-xs font-bold italic">Subtotal #{index + 1} : </p>
          <p>{subTotal(index)}</p>
        </div>
      ))}
      <p>Total : {totalPrice()}</p>

      <Button
        type="button"
        className="cursor-pointer"
        onClick={() =>
          append({
            product_id: "",
            product_name: "",
            discount: 0,
            price_per_unit: 0,
            product_sku: "",
            product_unit: "",
            quantity: 1,
            subtotal: 0,
          })
        }
      >
        Tambah Produk
      </Button>

      <datalist id="product-name-list">
        {productsName.map((prod) => (
          <option value={prod} key={prod} />
        ))}
      </datalist>
    </>
  );
};
