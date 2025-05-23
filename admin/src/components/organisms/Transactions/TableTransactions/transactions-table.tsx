import { columns } from "./columns";
import { DataTable } from "../data-table";
import { useTransactionData } from "@/components/providers/TransactionProvider";

export default function TransactionTable() {
  const { transactions: data } = useTransactionData();
  return <DataTable columns={columns} data={data} />;
}
