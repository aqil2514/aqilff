"use client";

import { ColumnDef, Row } from "@tanstack/react-table";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Product } from "@/@types/products";
import DeleteDialog from "../DeleteDialog";
import EditProductFormDialog from "../EditForm";
import { GenericSelectFilter } from "../Filters/filters";

const statusFilterFn = (
  row: Row<unknown>,
  columnId: string,
  filterValue: string
) => {
  const boolValue = row.getValue(columnId);

  if (filterValue === "Aktif") return boolValue === true;
  if (filterValue === "Nonaktif") return boolValue === false;

  return true;
};

export const columns: ColumnDef<Product>[] = [
  {
    accessorKey: "id",
    header: () => (
      <GenericSelectFilter
        field="id"
        label="ID"
        extractor={(prod) => prod.id.slice(0, 4)}
      />
    ),
    filterFn: "includesString",
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
    header: () => (
      <GenericSelectFilter
        label="Brand"
        field="brand"
        extractor={(prod) => prod.brand}
      />
    ),
    filterFn: "includesString",
  },
  {
    accessorKey: "parent_category",
    header: () => (
      <GenericSelectFilter
        label="Kategori Induk"
        field="parent_category"
        extractor={(prod) => prod.parent_category}
      />
    ),
    filterFn: "includesString",
  },
  {
    accessorKey: "category",
    header: () => (
      <GenericSelectFilter
        label="Kategori"
        field="category"
        extractor={(prod) => prod.category}
      />
    ),
    filterFn: "includesString",
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
    header: () => (
      <GenericSelectFilter
        label="Status"
        field="is_active"
        extractor={(prod) => (prod.is_active ? "Aktif" : "Nonaktif")}
      />
    ),
    //@ts-expect-error Ini ada yang belum sesuai interface statufFilterFn
    filterFn: statusFilterFn,
    cell: ({ row }) => (
      <Badge variant={row.getValue("is_active") ? "default" : "destructive"}>
        {row.getValue("is_active") ? "Aktif" : "Nonaktif"}
      </Badge>
    ),
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
