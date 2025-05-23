import { Transaction, TransactionItem } from "@/@types/transaction";
import { useTransactionData } from "@/components/providers/TransactionProvider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Row } from "@tanstack/react-table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";

export function DetailDialog({ row }: { row: Row<Transaction> }) {
  const {
    id,
    transaction_code,
    customer_name,
    total_amount,
    payment_method,
    notes,
    transaction_at
  } = row.original;

  const { transactionItems } = useTransactionData();

  const items = transactionItems.filter(
    (item: TransactionItem) => item.transaction_id === id
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Badge className="bg-blue-500 hover:bg-blue-600 active:scale-95 cursor-pointer">
          Detail
        </Badge>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detail Transaksi</DialogTitle>
          <DialogDescription>
            Detail untuk transaksi{" "}
            <span className="text-muted bg-accent-foreground px-2 rounded-sm">
              {transaction_code}
            </span>
            .
          </DialogDescription>
        </DialogHeader>

        <Separator className="my-2" />

        <ScrollArea className="max-h-[50vh] pr-2">
          <div className="space-y-3">
            {items.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                Tidak ada item dalam transaksi ini.
              </p>
            ) : (
              items.map((item, index) => (
                <div key={index} className="p-2 border rounded-lg shadow-sm">
                  <div className="font-medium">{item.product_name}</div>
                  <div className="text-sm text-muted-foreground">
                    Qty: {item.quantity} x Rp
                    {item.price_per_unit.toLocaleString()}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Subtotal: Rp
                    {(item.quantity * item.price_per_unit).toLocaleString()}
                  </div>
                </div>
              ))
            )}
          </div>
        </ScrollArea>

        <Separator className="my-4" />

        <div className="text-sm space-y-1">
          <p>
            <span className="font-medium">Total Bayar:</span>{" "}
            Rp{total_amount.toLocaleString()}
          </p>
          <p>
            <span className="font-medium">Metode Pembayaran:</span>{" "}
            {payment_method}
          </p>
          {customer_name && (
            <p>
              <span className="font-medium">Nama Pelanggan:</span>{" "}
              {customer_name}
            </p>
          )}
          <p>
            <span className="font-medium">Tanggal Transaksi:</span>{" "}
            {format(new Date(transaction_at), "dd MMMM yyyy, HH:mm")}
          </p>
          {notes && (
            <p>
              <span className="font-medium">Catatan:</span> {notes}
            </p>
          )}
        </div>

        <Separator className="my-4" />

        <DialogFooter>
          <Button type="button" variant="secondary">
            Tutup
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
