import { PurchasePlanItem } from "@/@types/purchases";
import { usePurchasePlanItemData } from "@/components/providers/PurchasePlanItemProvider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import {
  formatToIndonesianDateTime,
  formatToPercent,
  formatToRupiah,
} from "@/lib/utils";
import { ColumnDef, Row, Table } from "@tanstack/react-table";
import { Edit2, Trash2 } from "lucide-react";
import { PurchasePlanItemDetailDialog } from "./Dialog";

export const columnDef: ColumnDef<PurchasePlanItem>[] = [
  {
    id: "select",
    header: ({ table }) => <CheckHeader table={table} />,
    cell: ({ row }) => <CheckCell row={row} />,
  },
  {
    accessorKey: "createdAt",
    header: "Dibuat Pada",
    cell: ({ row }) => (
      <RowPopover
        row={row}
        value={formatToIndonesianDateTime(row.original.createdAt as string)}
      />
    ),
  },
  {
    accessorKey: "itemName",
    header: "Nama Produk",
    cell: ({ row }) => <RowPopover row={row} value={row.original.itemName} />,
  },
  {
    accessorKey: "quantityPerPack",
    header: "Jumlah Per Pak",
    cell: ({ row }) => (
      <RowPopover row={row} value={`${row.original.quantityPerPack} pcs`} />
    ),
  },
  {
    accessorKey: "packCount",
    header: "Jumlah Pak",
    cell: ({ row }) => (
      <RowPopover row={row} value={`${row.original.packCount} Pak`} />
    ),
  },
  {
    accessorKey: "totalCount",
    header: "Total Jumlah",
    cell: ({ row }) => (
      <RowPopover
        row={row}
        value={`${row.original.packCount * row.original.quantityPerPack} pcs`}
      />
    ),
  },
  {
    accessorKey: "purchasePrice",
    header: "Harga Beli Per Pak",
    cell: ({ row }) => (
      <RowPopover
        row={row}
        value={formatToRupiah(row.original.purchasePrice)}
      />
    ),
  },
  {
    accessorKey: "hpp",
    header: "HPP",
    cell: ({ row }) => (
      <RowPopover
        row={row}
        value={formatToRupiah(
          Number(row.original.purchasePrice / row.original.quantityPerPack)
        )}
      />
    ),
  },
  {
    accessorKey: "sellingPrice",
    header: "Harga Jual",
    cell: ({ row }) => (
      <RowPopover row={row} value={formatToRupiah(row.original.sellingPrice)} />
    ),
  },
  {
    accessorKey: "marginPerItem",
    header: "Margin",
    cell: ({ row }) => (
      <RowPopover
        row={row}
        value={formatToRupiah(row.original.marginPerItem)}
      />
    ),
  },
  {
    accessorKey: "marginFromCost",
    header: "Margin Beli",
    cell: ({ row }) => (
      <RowPopover
        row={row}
        value={formatToPercent(row.original.marginFromCost)}
      />
    ),
  },
  {
    accessorKey: "marginFromSelling",
    header: "Margin Jual",
    cell: ({ row }) => (
      <RowPopover
        row={row}
        value={formatToPercent(row.original.marginFromSelling)}
      />
    ),
  },
  {
    accessorKey: "totalPurchaseValue",
    header: "Total Nilai Beli",
    cell: ({ row }) => (
      <RowPopover
        row={row}
        value={formatToRupiah(row.original.totalPurchaseValue)}
      />
    ),
  },
  {
    accessorKey: "totalSellingValue",
    header: "Total Nilai Jual",
    cell: ({ row }) => (
      <RowPopover
        row={row}
        value={formatToRupiah(row.original.totalSellingValue)}
      />
    ),
  },
  {
    accessorKey: "profit",
    header: "Profit",
    cell: ({ row }) => (
      <RowPopover row={row} value={formatToRupiah(row.original.profit)} />
    ),
  },
];

const CheckHeader = ({ table }: { table: Table<PurchasePlanItem> }) => {
  const { isMultipleSelectionRow } = usePurchasePlanItemData();

  if (!isMultipleSelectionRow) return null;

  return (
    <Checkbox
      checked={
        table.getIsAllPageRowsSelected() ||
        (table.getIsSomePageRowsSelected() && "indeterminate")
      }
      onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
      aria-label="Select all"
    />
  );
};

const CheckCell = ({ row }: { row: Row<PurchasePlanItem> }) => {
  const { isMultipleSelectionRow } = usePurchasePlanItemData();

  if (!isMultipleSelectionRow) return null;

  return (
    <Checkbox
      checked={row.getIsSelected()}
      onCheckedChange={(value) => row.toggleSelected(!!value)}
      aria-label="Select row"
    />
  );
};

const RowPopover = ({
  value,
  row,
}: {
  value: string | number;
  row: Row<PurchasePlanItem>;
}) => {
  return (
    <Popover>
      <PopoverTrigger className="cursor-pointer hover:underline underline-offset-2 text-left w-full">
        {value}
      </PopoverTrigger>

      <PopoverContent className="w-[280px] space-y-3">
        <div className="space-y-1">
          <h4 className="text-sm font-semibold text-primary">
            {row.original.itemName}
          </h4>
          <p className="text-xs text-muted-foreground">
            Dibuat: {new Date(row.original.createdAt ?? "").toLocaleString("id-ID")}
          </p>
        </div>

        <Separator />

        <div className="flex flex-wrap gap-2 text-xs">
          <Badge variant="secondary">Per Pak: {row.original.quantityPerPack} pcs</Badge>
          <Badge variant="secondary">Jumlah Pak: {row.original.packCount}</Badge>
          <Badge variant="secondary">
            Total: {row.original.quantityPerPack * row.original.packCount} pcs
          </Badge>
        </div>

        <Separator />

        <div className="flex flex-col gap-2">
          <PurchasePlanItemDetailDialog row={row} />
          <Button variant="outline" size="sm" className="w-full justify-start">
            <Edit2 className="w-4 h-4 mr-2" />
            Edit Data
          </Button>
          <Button variant="destructive" size="sm" className="w-full justify-start">
            <Trash2 className="w-4 h-4 mr-2" />
            Hapus
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};
