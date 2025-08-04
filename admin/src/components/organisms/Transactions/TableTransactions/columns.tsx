import { Transaction } from "@/@types/transaction";
import { formatToIndonesianDateTimeUTC, formatToRupiah } from "@/lib/utils";
import { ColumnDef, Row } from "@tanstack/react-table";
import { DeleteDialog } from "../DeleteDialog";
import { DetailDialog } from "@/components/molecules/Dialog/DetailDialog";
import axios from "axios";
import { DetailDialogItem } from "@/@types/ui";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

const TransactionDetailDialog = ({ row }: { row: Row<Transaction> }) => {
  const [detailData, setDetailData] = useState<DetailDialogItem[]>([]);
  const transaction = async () => {
    try {
      const { data } = await axios.get(
        `/api/transaction/get-transaction/${row.original.id}`
      );

      setDetailData(data.data);
      return data.data as DetailDialogItem[];
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  return (
    <DetailDialog
      title="Detail Transaksi"
      description={`Detail untuk transkasi #${row.original.transaction_code}`}
      onLoad={transaction}
      items={detailData}
    />
  );
};

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
    cell: ({ row }) => {
      return (
        <div className="flex gap-2">
          <TransactionDetailDialog row={row} />
          <DeleteDialog row={row} />
          <Link href={"/transactions/edit/" + row.original.id}>
            <Badge className="bg-amber-500 hover:bg-amber-600 active:scale-95 cursor-pointer">
              Edit
            </Badge>
          </Link>
        </div>
      );
    },
  },
];
