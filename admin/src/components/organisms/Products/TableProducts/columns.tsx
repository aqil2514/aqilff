"use client";

import { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/@types/products";
import DeleteDialog from "../DeleteDialog";
import EditProductFormDialog from "../EditForm";

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "image_src",
    header: () => <span className="hidden md:inline">Gambar</span>,
    cell: ({ row }) => (
      <div className="hidden sm:block w-10 h-10 relative">
        <Image
          src={row.getValue("image_src") ?? "/image/No_Image_Available.jpg"}
          alt={row.original.name}
          fill
          className="rounded object-cover block mx-auto"
        />
      </div>
    ),
  },
  {
    accessorKey: "name",
    header: "Nama",
  },
  {
    accessorKey: "brand",
    header: "Brand",
  },
  {
    accessorKey: "parent_category",
    header: "Kategori Induk",
  },
  {
    accessorKey: "category",
    header: "Kategori",
  },
  {
    accessorKey: "description",
    header: "Deskripsi",
  },
  {
    accessorKey: "price",
    header: "Harga",
    //@ts-expect-error Dari sananya
    cell: ({ row }) => `Rp ${row.getValue("price").toLocaleString("id-ID")}`,
  },
  {
    accessorKey: "stock",
    header: "Stok",
    cell: ({ row }) => `${row.getValue("stock")} pcs`,
  },
  {
    accessorKey: "is_active",
    header: "Status",
    cell: ({ row }) => (
      <Badge variant={row.getValue("is_active") ? "default" : "destructive"}>
        {row.getValue("is_active") ? "Aktif" : "Nonaktif"}
      </Badge>
    ),
    filterFn: "equals"
  },
  {
    id: "actions",
    header: "Aksi",
    cell: ({ row }) => (
      <div className="flex gap-2">
        <EditProductFormDialog row={row} />
        <DeleteDialog row={row} />
      </div>
    ),
  },
];
