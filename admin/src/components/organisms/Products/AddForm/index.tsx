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
import AddProductForm from "./Form";
import { ScrollArea } from "@/components/ui/scroll-area";
import React from "react";

export default function AddProductFormDialog({
  addRef,
}: {
  addRef: React.RefObject<HTMLButtonElement | null>;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          className="bg-green-600 hover:bg-green-700 active:scale-95 duration-200 my-2 cursor-pointer"
          ref={addRef}
        >
          <MdAdd />
          Tambah Data
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md h-4/5 overflow-y-auto">
        <ScrollArea className="h-full">
          <DialogHeader>
            <DialogTitle>Tambah Produk</DialogTitle>
            <DialogDescription>
              Isi data untuk menambah produk
            </DialogDescription>
          </DialogHeader>
          <AddProductForm />
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
