import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MdAdd } from "react-icons/md";
import { ScrollArea } from "@/components/ui/scroll-area";
import React from "react";
import TransactionAddForm from "./Form";
import { useTransactionData } from "@/components/providers/TransactionProvider";

export default function AddTransactionFormDialog() {
  const { dateRange } = useTransactionData();

  if (!dateRange) return null;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-green-600 hover:bg-green-700 active:scale-95 duration-200 my-2 cursor-pointer">
          <MdAdd />
          Buat Transaksi
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md h-4/5 overflow-y-auto">
        <ScrollArea className="h-full">
          <DialogHeader>
            <DialogTitle>Buat Transaksi</DialogTitle>
            <DialogDescription>
              Isi data untuk membuat transaksi
            </DialogDescription>
          </DialogHeader>
          <TransactionAddForm />
          <DialogFooter className="sm:justify-start">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
