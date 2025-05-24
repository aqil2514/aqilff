"use client";
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
import PurchaseAddForm from "./Form";
import { ScrollArea } from "@/components/ui/scroll-area";
import { usePurchaseData } from "@/components/providers/PurchasesProvider";

export function PurchaseAddFormDialog() {
  const { dateRange } = usePurchaseData();

  if (!dateRange) return null;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="bg-green-500 hover:bg-green-600 cursor-pointer text-white hover:text-white"
        >
          <MdAdd />
          Tambah Pembelian
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md h-4/5 overflow-y-auto">
        <ScrollArea className="h-full">
          <DialogHeader>
            <DialogTitle>Tambah Pembelian</DialogTitle>
            <DialogDescription>
              Menambahkan data pembelian barang.
            </DialogDescription>
          </DialogHeader>
          <PurchaseAddForm />
          <DialogFooter>
            <DialogClose asChild>
              <Button>Tutup</Button>
            </DialogClose>
          </DialogFooter>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
