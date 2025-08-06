import { Transaction, TransactionItem } from "@/@types/transaction";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getTransactionByIdHandler } from "@/lib/api/transaction/clientApiHelper";
import { useRouter, useSearchParams } from "next/navigation";
import useSWR from "swr";
import { CgProfile } from "react-icons/cg";
import { FaMoneyBillWave } from "react-icons/fa";
import { MdDateRange, MdNotes } from "react-icons/md";
import { IoPricetagsOutline } from "react-icons/io5";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Loader2 } from "lucide-react";
import React from "react";

interface TransactionDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function TransactionDetailDialog({
  onOpenChange,
  open,
}: TransactionDetailDialogProps) {
  const searchParams = useSearchParams();
  const transactionId = searchParams.get("data-id");
  const router = useRouter();

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
  const transactionItem: TransactionItem[] = data.transactionItem;

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            Detail Transaksi {transaction.transaction_code}
          </DialogTitle>
          <DialogDescription>
            Melihat informasi lengkap transaksi
          </DialogDescription>
        </DialogHeader>

        {isLoading && <LoadingComponent />}

        {error && (
          <div className="text-red-600 py-6 text-center font-medium">
            Gagal memuat detail transaksi. Silakan coba lagi.
          </div>
        )}

        {data && (
          <DataComponent
            transaction={transaction}
            transactionItem={transactionItem}
          />
        )}
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

const DataComponent: React.FC<{
  transaction: Transaction;
  transactionItem: TransactionItem[];
}> = ({ transaction, transactionItem }) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <CgProfile className="text-lg" />
        <span>
          <strong>Nama Pembeli:</strong> {transaction.customer_name || "-"}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <FaMoneyBillWave className="text-lg" />
        <span>
          <strong>Metode Pembayaran:</strong> {transaction.payment_method}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <MdDateRange className="text-lg" />
        <span>
          <strong>Tanggal Transaksi:</strong>{" "}
          {format(new Date(transaction.transaction_at), "PPpp", {
            locale: id,
          })}
        </span>
      </div>

      {transaction.notes && (
        <div className="flex items-center gap-2">
          <MdNotes className="text-lg" />
          <span>
            <strong>Catatan:</strong> {transaction.notes}
          </span>
        </div>
      )}

      <Separator />

      <div>
        <strong>Item Transaksi:</strong>
        <div className="mt-2 space-y-2">
          {transactionItem.map((item, index) => {
            const product =
              typeof item.product_id === "string"
                ? { name: "Produk tidak diketahui", price: 0 }
                : item.product_id;

            const unitPrice = product.price;
            const discount = item.discount || 0;
            const tip = item.tip || 0;

            return (
              <div
                key={item.id || index}
                className="border p-3 rounded shadow-sm"
              >
                <div className="flex justify-between">
                  <span className="font-medium">{product.name}</span>
                  <span className="text-sm text-muted-foreground">
                    x{item.quantity}
                  </span>
                </div>

                <div className="text-sm">
                  Harga Satuan: Rp {unitPrice.toLocaleString()}
                </div>
                {discount > 0 && (
                  <div className="text-sm text-red-600">
                    Diskon: -Rp {discount.toLocaleString()}
                  </div>
                )}
                {tip > 0 && (
                  <div className="text-sm text-green-600">
                    Tip: +Rp {tip.toLocaleString()}
                  </div>
                )}
                <div className="text-sm font-semibold mt-1">
                  Subtotal: Rp {item.subtotal.toLocaleString()}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <Separator />

      <div className="flex items-center gap-2 text-lg">
        <IoPricetagsOutline />
        <strong>Total Pembayaran:</strong>{" "}
        <span className="ml-auto">
          Rp {transaction.total_amount.toLocaleString()}
        </span>
      </div>
    </div>
  );
};
