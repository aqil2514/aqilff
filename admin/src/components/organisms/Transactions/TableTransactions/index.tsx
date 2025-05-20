import { useTransactionData } from "@/components/providers/TransactionProvider";
import TransactionTable from "./transactions-table";

export default function TableProducts() {
  const { transactions } = useTransactionData();

  return (
    <div>
      <TransactionTable data={transactions} />
    </div>
  );
}
