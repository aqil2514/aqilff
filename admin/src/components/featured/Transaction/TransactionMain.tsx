import { DataTable } from "@/components/molecules/DataTable";
import { useTransactionData } from "./provider";
import { TransactionColumns } from "./Columns";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import TransactionDetailDialog from "./TransactionDetailDialog";
import TransactionDeleteDialog from "./TransactionDeleteDialog";

export default function TransactionMain() {
  const searchParams = useSearchParams();
  const action = searchParams.get("action");
  const dataId = searchParams.get("data-id");

  const [openDetailDialog, setOpenDetailDialog] = useState<boolean>(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState<boolean>(false);

  const router = useRouter();
  const { transactions } = useTransactionData();

  useEffect(() => {
    if (action === "edit" && dataId) {
      router.push(`/transactions/edit/${dataId}`);
    } else if (action === "detail" && dataId) {
      setOpenDetailDialog(true);
    } else if (action === "delete" && dataId) {
      setOpenDeleteDialog(true);
    }
  }, [action, dataId, router]);

  return (
    <>
      <DataTable data={transactions} columns={TransactionColumns} />
      <TransactionDetailDialog
        open={openDetailDialog && !!dataId}
        onOpenChange={setOpenDetailDialog}
      />
      <TransactionDeleteDialog
        onOpenChange={setOpenDeleteDialog}
        open={openDeleteDialog && !!dataId}
      />
    </>
  );
}
