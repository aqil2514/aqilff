import { Table } from "@tanstack/react-table";
import { PurchasePlanItem } from "@/@types/purchases";
import { usePurchasePlanItemData } from "@/components/providers/PurchasePlanItemProvider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, Edit2 } from "lucide-react";
import {
  isValidUrl,
} from "@/lib/utils";

import { FaRegPaperPlane } from "react-icons/fa";

export default function PurchasePlanningSelectionRowMenu(
  table: Table<PurchasePlanItem>
) {
  const { data } = usePurchasePlanItemData();
  const selectedRows = table.getSelectedRowModel().rows;
  const selectedRow = selectedRows[0]?.original;

  if (data.length === 0 || !selectedRow) return null;

  const isUrl = isValidUrl(selectedRow.sourceItem);

  return (
    <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 border rounded-lg bg-muted gap-4">
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

      <div className="flex items-center gap-2 flex-wrap">
        {isUrl && (
          <Button variant="default" size="sm" className="bg-blue-500 hover:bg-blue-400 cursor-pointer" onClick={() => {
            window.open(selectedRow.sourceItem, "_blank")
          }}>
            <FaRegPaperPlane className="w-4 h-4 mr-1" />
            Kunjungi Situs
          </Button>
        )}

        {/* 
        TODO : Buat Ini nanti
        <DetailDialog selectedRow={selectedRow} /> */}

        <Button variant="default" size="sm">
          <Edit2 className="w-4 h-4 mr-1" />
          Edit
        </Button>
        <Button variant="destructive" size="sm">
          <Trash2 className="w-4 h-4 mr-1" />
          Hapus
        </Button>
      </div>
    </div>
  );
}
