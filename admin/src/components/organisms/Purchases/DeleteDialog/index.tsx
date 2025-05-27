"use client";
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
import { Purchase } from "@/@types/purchases";

export function DeletePurchaseDialog({
  row,
  onSuccess,
}: {
  row: Row<Purchase>;
  onSuccess?: () => void;
}) {
  const { id, purchase_code } = row.original;
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleDelete = async () => {
    try {
      setLoading(true);
      const { data } = await axios.delete("/api/purchases/delete", {
        params: { id },
      });

      toast.success(data.message);
      setOpen(false);
      onSuccess?.();
    } catch (error) {
      if (isAxiosError(error)) {
        const data = error.response?.data;
        toast.error(data?.message || "Terjadi kesalahan saat menghapus");
      } else {
        toast.error("Terjadi kesalahan yang tidak terduga");
      }
      console.error("Error saat menghapus:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Badge className="bg-red-500 hover:bg-red-600 active:scale-95 cursor-pointer">
          Hapus
        </Badge>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Hapus Pembelian</DialogTitle>
          <DialogDescription>
            Apakah Anda yakin ingin menghapus pembelian{" "}
            <span className="font-medium text-foreground bg-muted px-2 rounded">
              {purchase_code}
            </span>
            ? Tindakan ini tidak dapat dibatalkan.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setOpen(false)} disabled={loading}>
            Batal
          </Button>
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
