import { Transaction } from "@/@types/transaction";
import { formatToIndonesianDateTimeUTC, formatToRupiah } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { DetailDialog } from "../DetailDialog";
import { DeleteDialog } from "../DeleteDialog";
import { EditDialog } from "../EditForm";

export const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "transaction_at",
    header: "Waktu Transaksi",
    cell: ({ row }) => {
      const date = row.original.transaction_at;
      const isNoted = row.original.notes;

      const formatted = formatToIndonesianDateTimeUTC(date);

      if (isNoted) {
        return <span title="Transaksi memiliki catatan">🗒️ {formatted}</span>;
      }

      return formatted;
    },
  },
  {
    accessorKey: "transaction_code",
    header: "Kode Transaksi",
  },
  {
    accessorKey: "customer_name",
    header: "Nama Pembeli",
  },
  {
    accessorKey: "payment_method",
    header: "Metode Pembayaran",
  },
  {
    accessorKey: "total_amount",
    header: "Total Belanja",
    cell: ({ row }) => `${formatToRupiah(row.getValue("total_amount"))}`,
  },
  {
    id: "actions",
    header: "Aksi",
    cell: ({ row }) => (
      <div className="flex gap-2">
        <DetailDialog row={row} />
        <DeleteDialog row={row} />
        <EditDialog row={row} />
      </div>
    ),
  },
];
