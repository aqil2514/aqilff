import { Transaction } from "@/@types/transaction";
import { Row } from "@tanstack/react-table";
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
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { toast } from "react-toastify";
import axios, { isAxiosError } from "axios";

export function DeleteDialog({ row }: { row: Row<Transaction> }) {
  const { id, transaction_code } = row.original;
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);
      const { data } = await axios.delete("/api/transaction/delete", {
        params: { id },
      });

      toast(data.message, { type: "success" });

    } catch (error) {
      if (isAxiosError(error)) {
        const data = error.response?.data;

        toast(data.message, { type: "error" });
      }
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Badge className="bg-red-500 hover:bg-red-600 active:scale-95 cursor-pointer">
          Hapus
        </Badge>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Hapus Transaksi</DialogTitle>
          <DialogDescription>
            Apakah Anda yakin ingin menghapus transaksi{" "}
            <span className="font-medium text-foreground bg-muted px-2 rounded">
              {transaction_code}
            </span>
            ? Tindakan ini tidak dapat dibatalkan.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex justify-end gap-2">
          <Button variant="secondary">Batal</Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? "Menghapus..." : "Hapus"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
