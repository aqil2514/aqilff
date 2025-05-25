import { DataTable } from "@/components/molecules/DataTable";
import { columns } from "./columns";
import { usePurchaseData } from "@/components/providers/PurchasesProvider";

export default function TablePurchases() {
  const { purchases } = usePurchaseData();

  return (
    <>
      <DataTable columns={columns} data={purchases} />
    </>
  );
}
