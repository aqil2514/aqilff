import { Table } from "@tanstack/react-table";
import { PurchasePlanItem } from "@/@types/purchases";
import { usePurchasePlanItemData } from "@/components/providers/PurchasePlanItemProvider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FaRegPaperPlane } from "react-icons/fa";
import { Edit2, Trash2 } from "lucide-react";
import { isValidUrl } from "@/lib/utils";
import { formatToRupiah } from "@/lib/utils";
import { useEffect } from "react";

export default function PurchasePlanningSelectionRowMenu(
  table: Table<PurchasePlanItem>
) {
  const { data, isMultipleSelectionRow } = usePurchasePlanItemData();

  useEffect(() => {
    table.resetRowSelection();
  }, [isMultipleSelectionRow, table]);

  if (!isMultipleSelectionRow) return null;

  const selectedRows = table.getSelectedRowModel().rows;

  if (data.length === 0 || selectedRows.length === 0) return null;

  const isSingle = selectedRows.length === 1;
  const selectedRow = selectedRows[0]?.original;
  const isUrl = isSingle && isValidUrl(selectedRow?.sourceItem ?? "");

  const totalPurchase = selectedRows.reduce(
    (sum, row) => sum + row.original.totalPurchaseValue,
    0
  );
  const totalSelling = selectedRows.reduce(
    (sum, row) => sum + row.original.totalSellingValue,
    0
  );
  const totalProfit = selectedRows.reduce(
    (sum, row) => sum + row.original.profit,
    0
  );

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 border rounded-lg bg-muted gap-4">
      {isSingle ? (
        <div>
          <p className="text-sm text-muted-foreground mb-1">Produk terpilih:</p>
          <h4 className="text-base font-semibold text-primary">
            {selectedRow.itemName}
          </h4>
          <div className="flex flex-wrap gap-2 mt-2">
            <Badge variant="outline">Pak: {selectedRow.packCount}</Badge>
            <Badge variant="outline">
              Per Pak: {selectedRow.quantityPerPack} pcs
            </Badge>
            <Badge variant="outline">
              Total: {selectedRow.quantityPerPack * selectedRow.packCount} pcs
            </Badge>
          </div>
        </div>
      ) : (
        <div>
          <p className="text-sm text-muted-foreground mb-1">
            {selectedRows.length} produk dipilih:
          </p>
          <div className="flex gap-4">
            <Badge variant="secondary">
              Total Beli: {formatToRupiah(totalPurchase)}
            </Badge>
            <Badge variant="secondary">
              Total Jual: {formatToRupiah(totalSelling)}
            </Badge>
            <Badge variant="secondary">
              Total Profit: {formatToRupiah(totalProfit)}
            </Badge>
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 flex-wrap">
        {isSingle && isUrl && (
          <Button
            variant="default"
            size="sm"
            className="bg-blue-500 hover:bg-blue-400 cursor-pointer"
            onClick={() => {
              window.open(selectedRow.sourceItem, "_blank");
            }}
          >
            <FaRegPaperPlane className="w-4 h-4 mr-1" />
            Kunjungi Situs
          </Button>
        )}

        {isSingle && (
          <Button variant="default" size="sm">
            <Edit2 className="w-4 h-4 mr-1" />
            Edit
          </Button>
        )}

        <Button variant="destructive" size="sm">
          <Trash2 className="w-4 h-4 mr-1" />
          Hapus
        </Button>
      </div>
    </div>
  );
}
