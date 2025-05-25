import { Purchase } from "@/@types/purchases";
import { Badge } from "@/components/ui/badge";
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
import { Button } from "@/components/ui/button";

export default function DetailDialog({ row }: { row: Row<Purchase> }) {
  const items = row.original.items;

  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + item.hpp * item.quantity, 0);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Badge className="bg-blue-500 hover:bg-blue-400 cursor-pointer">
          Detail
        </Badge>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Detail Pembayaran</DialogTitle>
          <DialogDescription>
            Detail pembayaran barang dengan kode{" "}
            <span className="bg-black text-white px-2 rounded-sm">
              {row.original.purchase_code}
            </span>
          </DialogDescription>
        </DialogHeader>

        <Separator className="my-2" />

        <ScrollArea className="h-64 pr-4">
          {items.length === 0 ? (
            <p className="text-sm text-muted-foreground">Tidak ada item.</p>
          ) : (
            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={item.id || index} className="border p-3 rounded-md">
                  <div className="font-semibold">{item.product_name}</div>
                  <div className="text-sm text-muted-foreground">
                    <div>Jumlah: {item.quantity}</div>
                    <div>Sisa: {item.remaining_quantity}</div>
                    <div>Harga Beli: Rp {item.price.toLocaleString()}</div>
                    <div>HPP/unit: Rp {item.hpp.toLocaleString()}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        <Separator className="my-4" />

        <DialogFooter className="flex flex-col items-start space-y-2">
          <div className="text-sm text-muted-foreground">
            Total Jumlah Barang: <span className="font-medium">{totalQuantity}</span>
          </div>
          <div className="text-sm text-muted-foreground">
            Total Harga Pembelian:{" "}
            <span className="font-medium">Rp {totalPrice.toLocaleString()}</span>
          </div>
          <div className="mt-4 self-end">
            <Button variant="outline">Tutup</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
