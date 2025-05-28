import { ColumnDef, InitialTableState } from "@tanstack/react-table";
import { formatToIndonesianDateTime,  formatToRupiah } from "@/lib/utils";
import { Purchase } from "@/@types/purchases";
import DetailDialog from "../DetailDialog";
import { DeletePurchaseDialog } from "../DeleteDialog";
import PurchaseDialog from "../Form";

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
      return formatToIndonesianDateTime(date);
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
    accessorKey: "price",
    header: "Harga",
    cell: ({ row }) => {
      const price = row.original.items.map((item) => item.price);
      const totalPrice = price.reduce((acc, curr) => {
        return acc + curr;
      }, 0);

      return formatToRupiah(totalPrice);
    },
  },
  {
    accessorKey: "items",
    header: "Jumlah Item",
    cell: ({ row }) => {
      return `${row.original.items.length} item`;
    },
  },
  {
    id: "actions",
    header: "Aksi",
    cell: ({ row }) => (
      <div className="flex gap-2">
        <DetailDialog row={row} />
        <DeletePurchaseDialog row={row} />
        <PurchaseDialog type="edit-form" row={row} />
        {/* <DetailDialog row={row} />
        <DeleteDialog row={row} />
        <EditDialog row={row} /> */}
      </div>
    ),
  },
];

export const initialState: InitialTableState = {};
