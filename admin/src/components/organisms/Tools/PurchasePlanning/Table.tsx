import { PurchasePlanItem } from "@/@types/purchases";
import { DataTable } from "@/components/molecules/DataTable";
import { usePurchasePlanItemData } from "@/components/providers/PurchasePlanItemProvider";
import { Checkbox } from "@/components/ui/checkbox";
import {
  formatToIndonesianDateTime,
  formatToPercent,
  formatToRupiah,
} from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import PurchasePlanningSelectionRowMenu from "./TableMenu";

const columnDef: ColumnDef<PurchasePlanItem>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
  },
  {
    accessorKey: "createdAt",
    header: "Dibuat Pada",
    cell: ({ row }) =>
      formatToIndonesianDateTime(row.original.createdAt as string),
  },
  {
    accessorKey: "itemName",
    header: "Nama Produk",
  },
  {
    accessorKey: "quantityPerPack",
    header: "Jumlah Per Pak",
    cell: ({ row }) => `${row.original.quantityPerPack} pcs`,
  },
  {
    accessorKey: "packCount",
    header: "Jumlah Pak",
    cell: ({ row }) => `${row.original.packCount} Pak`,
  },
  {
    accessorKey: "totalCount",
    header: "Total Jumlah",
    cell: ({ row }) =>
      `${row.original.packCount * row.original.quantityPerPack} pcs`,
  },
  {
    accessorKey: "purchasePrice",
    header: "Harga Beli Per Pak",
    cell: ({ row }) => formatToRupiah(row.original.purchasePrice),
  },
  {
    accessorKey: "hpp",
    header: "HPP",
    cell: ({ row }) =>
      formatToRupiah(
        Number(row.original.purchasePrice / row.original.quantityPerPack)
      ),
  },
  {
    accessorKey: "sellingPrice",
    header: "Harga Jual",
    cell: ({ row }) => formatToRupiah(row.original.sellingPrice),
  },
  {
    accessorKey: "marginPerItem",
    header: "Margin",
    cell: ({ row }) => formatToRupiah(row.original.marginPerItem),
  },
  {
    accessorKey: "marginFromCost",
    header: "Margin Beli",
    cell: ({ row }) => formatToPercent(row.original.marginFromCost),
  },
  {
    accessorKey: "marginFromSelling",
    header: "Margin Jual",
    cell: ({ row }) => formatToPercent(row.original.marginFromSelling),
  },
  {
    accessorKey: "totalPurchaseValue",
    header: "Total Nilai Beli",
    cell: ({ row }) => formatToRupiah(row.original.totalPurchaseValue),
  },
  {
    accessorKey: "totalSellingValue",
    header: "Total Nilai Jual",
    cell: ({ row }) => formatToRupiah(row.original.totalSellingValue),
  },
  {
    accessorKey: "profit",
    header: "Profit",
    cell: ({ row }) => formatToRupiah(row.original.profit),
  },
];

export default function PurchasePlanningTable() {
  const { data, rowSelection, setRowSelection } = usePurchasePlanItemData();

  return (
    <div className="bg-white shadow-2xl h-full w-full rounded-2xl p-4">
      <DataTable
        columns={columnDef}
        data={data}
        enableRowSelection
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
        SelectionRowMenu={PurchasePlanningSelectionRowMenu}
      />
    </div>
  );
}
