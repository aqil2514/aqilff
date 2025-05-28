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
import { ScrollArea } from "@/components/ui/scroll-area";
import { usePurchaseData } from "@/components/providers/PurchasesProvider";
import PurchaseForm from "./Form";
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Row } from "@tanstack/react-table";
import { Purchase } from "@/@types/purchases";

export type DialogType = "edit-form" | "add-form";

export interface PurchaseDialogProps {
  type: DialogType;
  row?: Row<Purchase>;
}

export default function PurchaseDialog({ type, row }: PurchaseDialogProps) {
  const { dateRange } = usePurchaseData();

  if(type !== "add-form" && !row) throw new Error("Row masih belum ada")

  if (!dateRange) return null;

  return (
    <Dialog>
      <TriggerDialog type={type} />
      <DialogContent className="sm:max-w-md h-4/5 overflow-y-auto">
        <ScrollArea className="h-full">
          <DialogHeader>
            <DialogTitle>Tambah Pembelian</DialogTitle>
            <DialogDescription>
              Menambahkan data pembelian barang.
            </DialogDescription>
          </DialogHeader>

          <PurchaseForm type={type} row={row} />

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

const TriggerDialog = ({ type }: { type: DialogType }) => {
  if (type === "add-form") {
    return (
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="bg-green-500 hover:bg-green-600 cursor-pointer text-white hover:text-white"
        >
          <MdAdd />
          Tambah Pembelian
        </Button>
      </DialogTrigger>
    );
  }

  if (type === "edit-form") {
    return (
      <DialogTrigger asChild>
        <Badge className="bg-amber-500 hover:bg-amber-600 active:scale-95 cursor-pointer">
          Edit
        </Badge>
      </DialogTrigger>
    );
  }
};
