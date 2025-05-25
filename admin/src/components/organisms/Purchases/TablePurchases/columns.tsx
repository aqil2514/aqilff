import { ColumnDef, InitialTableState } from "@tanstack/react-table";
import { formatToIndonesianDateTimeUTC } from "@/lib/utils";
import { Purchase } from "@/@types/purchases";

export const columns: ColumnDef<Purchase>[] = [
  {
    accessorKey: "purchase_code",
    header: "Kode Pembelian",
  },
  {
    accessorKey: "purchase_date",
    header: "Tanggal Pembelian",
    cell: ({ row }) => {
      const date = row.original.purchase_date;
      return formatToIndonesianDateTimeUTC(date);
    },
  },
  {
    accessorKey: "supplier_name",
    header: "Nama Pemasok",
    cell: ({ row }) => row.original.supplier_name || "-",
  },
  {
    accessorKey: "supplier_type",
    header: "Jenis Pemasok",
    cell: ({ row }) => row.original.supplier_type || "-",
  },
  {
    accessorKey: "items",
    header: "Jumlah Item",
    cell: ({ row }) => {
      console.log(row.original)
      return `${row.original.items?.length || 0} produk`},
  },
  {
    accessorKey: "notes",
    header: "Catatan",
    cell: ({ row }) => row.original.notes || "-",
  },
  {
    accessorKey: "created_at",
    header: "Waktu Input",
    cell: ({ row }) => {
      const createdAt = row.original.created_at;
      return createdAt ? formatToIndonesianDateTimeUTC(createdAt) : "-";
    },
  },
  // {
  //   id: "actions",
  //   header: "Aksi",
  //   cell: ({ row }) => (
  //     <div className="flex gap-2">
  //       <DetailDialog row={row} />
  //       <DeleteDialog row={row} />
  //       <EditDialog row={row} />
  //     </div>
  //   ),
  // },
];

export const initialState:InitialTableState = {}