import { DataTable } from "@/components/molecules/DataTable";
import { usePurchasePlanItemData } from "@/components/providers/PurchasePlanItemProvider";
import PurchasePlanningSelectionRowMenu from "./TableMenu";
import { columnDef } from "./columns";

export default function PurchasePlanningTable() {
  const { data, rowSelection, setRowSelection, isMultipleSelectionRow } =
    usePurchasePlanItemData();

  return (
    <div className="bg-white shadow-2xl h-full w-full rounded-2xl p-4">
      <DataTable
        columns={columnDef}
        data={data}
        enableRowSelection
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
        SelectionRowMenu={PurchasePlanningSelectionRowMenu}
        enableMultiRowSelection={isMultipleSelectionRow}
      />
    </div>
  );
}
