import { TransactionItem } from "@/@types/transaction";
import { formatToRupiah } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<TransactionItem>[] = [
  {
    accessorKey: "transaction_at",
    header: "Tanggal Transaksi",
  },
  {
    accessorKey: "transaction_code",
    header: "Kode Transaksi",
  },
  {
    accessorKey: "customer_name",
    header: "Nama Pembeli",
    filterFn: (row, columnId, filterValue) => {
      const cellValue = String(row.getValue(columnId) ?? "").toLowerCase();
      const keywords = filterValue.toLowerCase().split(" ").filter(Boolean);
      return keywords.every((kw: string) => cellValue.includes(kw));
    },
  },
  {
    accessorKey: "id",
    header: "ID Produk",
  },
  {
    accessorKey: "category",
    header: "Kategori",
  },
  {
    accessorKey: "product_name",
    header: "Nama Produk",
    filterFn: (row, columnId, filterValue) => {
      const cellValue = String(row.getValue(columnId) ?? "").toLowerCase();
      const keywords = filterValue.toLowerCase().split(" ").filter(Boolean);
      return keywords.every((kw: string) => cellValue.includes(kw));
    },
  },
  {
    accessorKey: "quantity",
    header: "Kuantitas",
  },
  {
    accessorKey: "subtotal",
    header: "Total Omzet",
    cell: ({ row }) => formatToRupiah(row.original.subtotal),
  },
  {
    accessorKey: "hpp",
    header: "Total HPP",
    cell: ({ row }) => formatToRupiah(row.original.hpp ?? 0),
  },
  {
    accessorKey: "margin_total",
    accessorFn: (row) => row.margin ?? 0,
    header: "Total Margin",
    cell: ({ row }) => {
      return formatToRupiah(row.original.margin);
    },
  },
  {
    accessorKey: "margin_percentage",
    accessorFn: (row) => {
      const margin = row.margin ?? 0;
      const subtotal = row.subtotal ?? 0;
      return subtotal > 0 ? (margin / subtotal) * 100 : 0;
    },
    header: "Margin (%)",
    cell: ({ row }) => {
      const margin = row.original.margin ?? 0;
      const subtotal = row.original.subtotal ?? 0;
      const percent = subtotal > 0 ? (margin / subtotal) * 100 : 0;

      return `${percent.toFixed(1)}%`;
    },
  },
];

export const simpleColumns: ColumnDef<TransactionItem>[] = [
  {
    accessorKey: "transaction_at",
    header: "Tanggal",
  },
  {
    accessorKey: "transaction_code",
    header: "Kode Transaksi",
  },
  {
    accessorKey: "id",
    header: "ID Produk",
  },
  {
    accessorKey: "product_name",
    header: "Produk",
  },
  {
    accessorKey: "quantity",
    header: "Qty",
  },
  {
    accessorKey: "subtotal",
    header: "Omzet",
    cell: ({ row }) => formatToRupiah(row.original.subtotal),
  },
  {
    accessorKey: "hpp",
    header: "Total HPP",
    cell: ({ row }) => formatToRupiah(row.original.hpp ?? 0),
  },
  {
    accessorKey: "margin_total",
    accessorFn: (row) => row.margin ?? 0,
    header: "Total Margin",
    cell: ({ row }) => {
      return formatToRupiah(row.original.margin);
    },
  },
  {
    accessorKey: "margin_percentage",
    accessorFn: (row) => {
      const margin = row.margin ?? 0;
      const subtotal = row.subtotal ?? 0;
      return subtotal > 0 ? (margin / subtotal) * 100 : 0;
    },
    header: "Margin (%)",
    cell: ({ row }) => {
      const margin = row.original.margin ?? 0;
      const subtotal = row.original.subtotal ?? 0;
      const percent = subtotal > 0 ? (margin / subtotal) * 100 : 0;

      return `${percent.toFixed(1)}%`;
    },
  },
];
