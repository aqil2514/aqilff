import { columns } from "./columns";
import { DataTable } from "../data-table";
import { useTransactionData } from "@/components/providers/TransactionProvider";
import { formatToRupiah } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function TransactionTable() {
  const { transactions: data } = useTransactionData();

  if (!data) return <Skeleton className="w-full h-48" />;

  const visibleData = data.filter((d) => !d.deleted_at);

  if (visibleData.length === 0) {
    return <p className="text-muted-foreground text-sm">Belum ada transaksi hari ini.</p>;
  }

  const omzet = formatToRupiah(
    visibleData.reduce((acc, curr) => acc + curr.total_amount, 0)
  );

  return (
    <>
      <DataTable columns={columns} data={visibleData} />
      <Card className="mt-4">
        <CardContent className="text-sm text-muted-foreground">
          Total Omzet: <span className="font-semibold text-primary">{omzet}</span> dari{" "}
          <span className="font-semibold">{visibleData.length}</span> transaksi
        </CardContent>
      </Card>
    </>
  );
}
