import { Transaction } from "@/@types/transaction";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  deleteTransactionById,
  getTransactionByIdHandler,
} from "@/lib/api/transaction/clientApiHelper";
import { Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";
import useSWR from "swr";

interface TransactionDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function TransactionDeleteDialog({
  onOpenChange,
  open,
}: TransactionDeleteDialogProps) {
  const searchParams = useSearchParams();
  const transactionId = searchParams.get("data-id");
  const router = useRouter();
  const [loadingDelete, setLoadingDelete] = useState<boolean>(false);

  function handleDialogChange(open: boolean) {
    if (!open) {
      router.replace("/transactions");
    }
    onOpenChange(open);
  }

  const { data, isLoading, error } = useSWR(transactionId, () =>
    getTransactionByIdHandler(transactionId!)
  );

  if (!data) return null;

  const transaction: Transaction = data.transaction;
  const deleteHandler = async () => {
    try {
      setLoadingDelete(true);
      await deleteTransactionById(transactionId!);
      toast.success("Transaksi berhasil dihapus");

      onOpenChange(false);
      router.replace("/transactions");
    } catch (error) {
      console.error(error);
      toast.error("Terjadi kesalahan saat hapus data");
    } finally {
      setLoadingDelete(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            Hapus Transaksi {transaction.transaction_code}
          </DialogTitle>
          <DialogDescription>
            Yakin ingin hapus transaksi ini?
          </DialogDescription>
        </DialogHeader>

        {isLoading && <LoadingComponent />}

        {error && (
          <div className="text-red-600 py-6 text-center font-medium">
            Gagal memuat detail transaksi. Silakan coba lagi.
          </div>
        )}
        <DialogFooter>
          <Button
            variant={"destructive"}
            disabled={loadingDelete}
            onClick={deleteHandler}
            className="bg-red-500 hover:bg-red-600 cursor-pointer"
          >
            {loadingDelete ? "Menghapus..." : "Konfirmasi"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

const LoadingComponent = () => {
  return (
    <div className="flex items-center justify-center py-10">
      <Loader2 className="animate-spin h-6 w-6 mr-2" />
      <span>Memuat data transaksi...</span>
    </div>
  );
};
