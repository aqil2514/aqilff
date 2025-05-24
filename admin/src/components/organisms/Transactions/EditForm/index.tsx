import { Transaction } from "@/@types/transaction";
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
import EditTransactionForm from "./Form";

export function EditDialog({ row }: { row: Row<Transaction> }) {
  const { transaction_code } = row.original;

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Badge className="bg-amber-500 hover:bg-amber-600 active:scale-95 cursor-pointer">
          Edit
        </Badge>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Transaksi</DialogTitle>
          <DialogDescription>
            Edit transaksi{" "}
            <span className="text-muted bg-accent-foreground px-2 rounded-sm">
              {transaction_code}
            </span>
            .
          </DialogDescription>
        </DialogHeader>

        <EditTransactionForm row={row} />

        <DialogFooter>
          <Button type="button" variant="secondary">
            Tutup
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
