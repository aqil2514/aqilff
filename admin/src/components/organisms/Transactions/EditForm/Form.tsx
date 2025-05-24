import { Transaction } from "@/@types/transaction";
import { Row } from "@tanstack/react-table";
import { useTransactionEditFormLogic } from "./logics";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { SelectPaymentMethod } from "../AddForm/Form";
import React from "react";
import { UseFieldArrayReturn, UseFormReturn } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { defaultTransactionItem } from "../transaction-utils";
import { IoMdAddCircle } from "react-icons/io";
import { FaTrashAlt } from "react-icons/fa";
import { Textarea } from "@/components/ui/textarea";

export default function EditTransactionForm({
  row,
}: {
  row: Row<Transaction>;
}) {
  const { isLoading, transactionSubmit, ...restProps } =
    useTransactionEditFormLogic(row);

  const { reset, register, getValues, setValue, handleSubmit } = restProps.form;

  return (
    <form className="my-4 space-y-4" onSubmit={handleSubmit(transactionSubmit)}>
      <div className="space-y-2">
        <Label htmlFor="transaction_at">Waktu Transaksi</Label>
        <Input
          id="transaction_at"
          type="datetime-local"
          {...register("transaction_at")}
        />
      </div>
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

      <SelectPaymentMethod getValues={getValues} setValue={setValue} />

      <div className="border rounded-2xl px-2 py-2 space-y-4">
        <p className="italic">Item yang dibeli</p>
        <TransactionItem {...restProps} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Keterangan :</Label>
        <Textarea id="notes" {...register("notes")} />
      </div>

      <div className="flex gap-2 items-center">
        <Button
          disabled={isLoading}
          type="submit"
          className="bg-blue-500 text-white px-4 py-2"
        >
          {isLoading ? "Mengedit..." : "Edit Transaksi"}
        </Button>
        <Button type="button" onClick={() => reset()}>
          Reset
        </Button>
      </div>
    </form>
  );
}

interface TransactionItemProps {
  fieldArray: UseFieldArrayReturn<Transaction, "items", "id">;
  form: UseFormReturn<Transaction, unknown, Transaction>;
  productsName: string[];
  productChangeHandler: (index: number, productName: string) => void;
  subTotal: (index: number) => string;
  subTotalChangeHandler: (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => void;
  totalPrice: string;
}

const TransactionItem: React.FC<TransactionItemProps> = ({
  fieldArray,
  form,
  productsName,
  productChangeHandler,
  subTotal,
  subTotalChangeHandler,
  totalPrice,
}) => {
  const { fields, append, remove } = fieldArray;
  const { register } = form;

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
      <p>Total : {totalPrice}</p>

      <div className="space-x-2">
        <Button
          type="button"
          variant={"ghost"}
          className="cursor-pointer text-blue-500 hover:text-blue-600"
          onClick={() => append(defaultTransactionItem)}
        >
          <IoMdAddCircle />
        </Button>
        {fields.length > 1 && (
          <Button
            type="button"
            variant={"ghost"}
            className="cursor-pointer text-red-500 hover:text-red-600"
            onClick={() => remove(0)}
          >
            <FaTrashAlt />
          </Button>
        )}
      </div>

      <datalist id="product-name-list">
        {productsName.map((prod) => (
          <option value={prod} key={prod} />
        ))}
      </datalist>
    </>
  );
};
