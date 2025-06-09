import { Input } from "@/components/ui/input";
import { useTransactionFormLogics } from "./logics";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import React from "react";
import { Transaction } from "@/@types/transaction";
import {
  FieldArrayWithId,
  UseFieldArrayAppend,
  UseFieldArrayRemove,
  UseFormGetValues,
  UseFormRegister,
  UseFormSetValue,
} from "react-hook-form";

import { IoMdAddCircle } from "react-icons/io";
import { IoBarcode } from "react-icons/io5";
import { FaTrashAlt } from "react-icons/fa";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { defaultTransactionItem } from "../transaction-utils";

export default function TransactionAddForm() {
  const {
    register,
    handleSubmit,
    transactionSubmit,
    isLoading,
    getTransactionCode,
    reset,
    isGettingCode,
    ...restProps
  } = useTransactionFormLogics();

  return (
    <form onSubmit={handleSubmit(transactionSubmit)} className="my-4 space-y-4">
      <div className="space-y-2">
        <Label htmlFor="transaction_at">Waktu Transaksi</Label>
        <Input
          id="transaction_at"
          type="datetime-local"
          {...register("transaction_at")}
        />
      </div>
      <div className="space-y-2">
        <div className="flex gap-2">
          <Label htmlFor="transaction_code">Kode Transaksi :</Label>
          <Button
            type="button"
            variant={"ghost"}
            className="cursor-pointer"
            onClick={getTransactionCode}
            disabled={isGettingCode}
          >
            {isGettingCode ? (
              <div className="animate-spin w-4 h-4 border-2 border-t-transparent border-blue-500 rounded-full" />
            ) : (
              <IoBarcode />
            )}
          </Button>
        </div>
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

      <SelectPaymentMethod {...restProps} />

      <div className="border rounded-2xl px-2 py-2 space-y-4">
        <p className="italic">Item yang dibeli</p>
        <TransactionItem register={register} {...restProps} />
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
  totalPrice: string;
  append: UseFieldArrayAppend<Transaction, "items">;
  productsName: string[];
  remove: UseFieldArrayRemove;
}

export const TransactionItem: React.FC<TransactionItemProps> = ({
  fields,
  register,
  productChangeHandler,
  subTotal,
  subTotalChangeHandler,
  append,
  totalPrice,
  productsName,
  remove,
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
              {...register(`items.${index}.discount`)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tip">Tip Produk #{index + 1}:</Label>
            <Input
              id="tip"
              type="number"
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

export const SelectPaymentMethod: React.FC<{
  setValue: UseFormSetValue<Transaction>;
  getValues: UseFormGetValues<Transaction>;
}> = ({ setValue, getValues }) => {
  return (
    <div className="space-y-2">
      <Label>Metode Pembayaran</Label>
      <Select
        defaultValue={getValues("payment_method")}
        onValueChange={(e) => setValue("payment_method", e)}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Metode Pembayaran" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Metode Pembayaran</SelectLabel>
            <SelectItem value="cash">Cash</SelectItem>
            <SelectItem value="digital">Digital</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
};
