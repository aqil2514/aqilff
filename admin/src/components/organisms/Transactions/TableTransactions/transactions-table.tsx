import { columns } from "./columns";
import { DataTable } from "../data-table";
import { useTransactionData } from "@/components/providers/TransactionProvider";

export default function TransactionTable() {
  const { transactions: data } = useTransactionData();
  const visibleData = data.filter((d) => !d.deleted_at)

  return <DataTable columns={columns} data={visibleData} />;
}
