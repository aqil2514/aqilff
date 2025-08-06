import { TableReportSales } from "@/@types/transaction";
import {
  formatToIndonesianDateTime,
  formatToPercent,
  formatToRupiah,
} from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";

export const ColumnsDef: ColumnDef<TableReportSales>[] = [
  {
    accessorKey: "transaction_at",
    id: "transaction_at",
    header: "Tanggal Transaksi",
    cell: ({ row }) => formatToIndonesianDateTime(row.original.transaction_at),
  },
  {
    accessorKey: "transaction_code",
    id: "transaction_code",
    header: "Kode Transaksi",
  },
  {
    accessorKey: "product_code",
    id: "product_code",
    header: "Kode Produk",
  },
  {
    accessorKey: "customer_name",
    id: "customer_name",
    header: "Nama Pembeli",
  },
  {
    accessorKey: "product_id.name",
    id: "product_id.name",
    header: "Nama Produk",
  },
  {
    accessorKey: "quantity",
    id: "quantity",
    header: "Kuantiti",
    cell: ({ row }) => `${row.original.quantity} PCS`,
  },
  {
    accessorKey: "subtotal",
    id: "subtotal",
    header: "Omzet",
    cell: ({ row }) => formatToRupiah(row.original.subtotal),
  },
  {
    accessorKey: "hpp",
    id: "hpp",
    header: "HPP",
    cell: ({ row }) => formatToRupiah(row.original.hpp as number),
  },
  {
    accessorKey: "margin",
    id: "margin",
    header: "Margin",
    cell: ({ row }) => formatToRupiah(row.original.margin as number),
  },
  {
    accessorKey: "margin%",
    id: "margin%",
    header: "Margin %",
    cell: ({ row }) =>
      formatToPercent((row.original.margin / row.original.subtotal) * 100),
  },
];
