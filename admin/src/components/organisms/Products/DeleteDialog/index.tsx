"use client";
import { Product } from "@/@types/products";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Row } from "@tanstack/react-table";
import { useDeleteDialogLogic } from "./logic";
import { formatToRupiah } from "@/lib/utils";
import Image from "next/image";

export default function DeleteDialog({ row }: { row: Row<Product> }) {
  const { name, category, id, image_src, price, stock, deleteHandler, isLoading } =
    useDeleteDialogLogic(row);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="destructive">
          Hapus
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Hapus Product</DialogTitle>
        <DialogDescription>
          Konfirmasi lagi! Data yang dihapus tidak bisa dikembalikan.
        </DialogDescription>
        <div>
          <Image
            src={image_src}
            width={256}
            height={256}
            alt={`Gambar ${name}`}
            className="rounded-2xl block mx-auto"
          />
          <p>
            <strong>ID</strong> : {id}
          </p>
          <p>
            <strong>Nama Produk</strong> : {name}
          </p>
          <p>
            <strong>Kategori</strong> : {category}
          </p>
          <p>
            <strong>Harga</strong> : {formatToRupiah(price)}
          </p>
          <p>
            <strong>Stok</strong> : {stock} pcs
          </p>
          <br />
          <p>Yakin ingin hapus produk ini?</p>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button
              type="button"
              variant="secondary"
              className="cursor-pointer"
            >
              Batal
            </Button>
          </DialogClose>
          <Button
            type="button"
            variant={"destructive"}
            disabled={isLoading}
            className="cursor-pointer"
            onClick={deleteHandler}
          >
            {isLoading ? "Menghapus..." : "Lanjut hapus"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
