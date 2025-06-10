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
import React, { JSX } from "react";
import PurchasePlanningForm from "./Form";
import PurchasePlanningFormProvider from "./FormProvider";
import FormDataAutomate from "./FormDataAutomate";

export type PurchasePlanningDialogType = "addForm" | "editForm" | "deleteForm";

const tringgerDialog: Record<PurchasePlanningDialogType, JSX.Element> = {
  addForm: (
    <Button className="bg-green-600 hover:bg-green-700 active:scale-95 duration-200 my-2 cursor-pointer">
      <MdAdd />
      Buat Rencana Pembelian
    </Button>
  ),
  deleteForm: <></>,
  editForm: <></>,
};

const dialogTitle: Record<PurchasePlanningDialogType, string> = {
  addForm: "Buat Rencana Pembelian",
  deleteForm: "Hapus Rencana Pembelian",
  editForm: "Edit Rencana Pembelian",
};

const dialogDescription: Record<PurchasePlanningDialogType, string> = {
  addForm: "Isi data untuk membuat rencana pembelian",
  deleteForm: "Konfirmasi penghapusan Rencana Pembelian",
  editForm: "Tentukan data rencana pembelian yang mau diubah",
};

interface PurchasePlanningDialogProps {
  type: PurchasePlanningDialogType;
}

export default function PurchasePlanningDialog({
  type,
}: PurchasePlanningDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{tringgerDialog[type]}</DialogTrigger>
      <DialogContent className="max-w-3/4 w-3/4 h-4/5 overflow-y-auto">
        <ScrollArea className="h-full">
          <DialogHeader>
            <DialogTitle>{dialogTitle[type]}</DialogTitle>
            <DialogDescription>{dialogDescription[type]}</DialogDescription>
          </DialogHeader>

          <PurchasePlanningFormProvider type={type}>
            <div className="grid grid-cols-2">
              <PurchasePlanningForm />
              <FormDataAutomate />
            </div>
          </PurchasePlanningFormProvider>

          <DialogFooter className="sm:justify-start my-4">
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
