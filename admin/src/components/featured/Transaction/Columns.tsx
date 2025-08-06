import { Transaction } from "@/@types/transaction";
import ColumnActionDropdown from "@/components/molecules/Dropdrown/ColumnActionDropdown";
import { formatToIndonesianDateTime, formatToRupiah } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";

export const TransactionColumns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "actions",
    header:"Aksi",
    cell: ({ row }) => {
      const label = row.original.transaction_code;
      const dataId = row.original.id as string

      return <ColumnActionDropdown dropdownLabel={label} dataId={dataId} />;
    },
  },
  {
    accessorKey: "transaction_at",
    id: "transaction_at",
    header: "Waktu",
    cell: ({ row }) => formatToIndonesianDateTime(row.original.transaction_at),
  },
  {
    accessorKey: "transaction_code",
    id: "transaction_code",
    header: "Kode Transaksi",
  },
  {
    accessorKey: "customer_name",
    id: "customer_name",
    header: "Nama Pembeli",
  },
  {
    accessorKey: "total_amount",
    id: "total_amount",
    header: "Total Transaksi",
    cell: ({ row }) => formatToRupiah(row.original.total_amount),
  },
];
