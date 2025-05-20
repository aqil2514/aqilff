import { Transaction } from "@/@types/transaction";
import { columns } from "./columns";
import { DataTable } from "../data-table";

export default function TransactionTable({ data }: { data: Transaction[] }) {
  return <DataTable columns={columns} data={data} />;
}
