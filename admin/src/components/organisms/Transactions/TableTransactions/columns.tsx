import { Transaction } from "@/@types/transaction";
import { Badge } from "@/components/ui/badge";
import { formatToRupiah } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";

export const columns: ColumnDef<Transaction>[] = [
  {
    accessorKey: "id",
    header: "ID",
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
        <Badge className="bg-blue-500 hover:bg-blue-600 active:scale-95 duration-1000 cursor-pointer">Detail</Badge>
      </div>
    ),
  },
];
