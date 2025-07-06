import { Input } from "@/components/ui/input";
import { useTransactionFormLogics } from "./logics";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import React from "react";
import { IoBarcode } from "react-icons/io5";
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
import { useTransactionData } from "@/components/providers/TransactionProvider";
import TransactionItem from "./TransactionItemForm";

export default function TransactionAddForm() {
  const {
    register,
    handleSubmit,
    transactionSubmit,
    isLoading,
    getTransactionCode,
    reset,
    isGettingCode,
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

      <SelectPaymentMethod />

      <div className="border rounded-2xl px-2 py-2 space-y-4">
        <p className="italic">Item yang dibeli</p>
        <TransactionItem />
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

export const SelectPaymentMethod = () => {
  const { form } = useTransactionData();
  const { setValue, getValues } = form;
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
