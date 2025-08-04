import { columns } from "./columns";
// import { DataTable } from "../data-table";
import { useTransactionData } from "@/components/providers/TransactionProvider";
import { formatToRupiah } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { DataTable } from "@/components/molecules/DataTable";
import { InitialTableState } from "@tanstack/react-table";

export default function TransactionTable() {
  const { transactions: data } = useTransactionData();

  if (!data) return <Skeleton className="w-full h-48" />;

  if (data.length === 0) {
    return (
      <p className="text-muted-foreground text-sm">
        Belum ada transaksi hari ini.
      </p>
    );
  }

  const omzet = formatToRupiah(
    data.reduce((acc, curr) => acc + curr.total_amount, 0)
  );

  const initialState: InitialTableState = {
    sorting: [{ id: "transaction_code", desc: false }],
    columnVisibility: { id: false },
  };

  return (
    <>
      <DataTable columns={columns} data={data} initialState={initialState} />
      <Card className="mt-4">
        <CardContent className="text-sm text-muted-foreground">
          Total Omzet:{" "}
          <span className="font-semibold text-primary">{omzet}</span> dari{" "}
          <span className="font-semibold">{data.length}</span> transaksi
        </CardContent>
      </Card>
    </>
  );
}
