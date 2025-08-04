import { useState } from "react";
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { DetailDialogItem } from "@/@types/ui";

interface DetailDialogProps {
  title?: string;
  description?: string;
  triggerLabel?: string;
  items?: DetailDialogItem[];
  onLoad?: () => Promise<DetailDialogItem[]>;
}

export function DetailDialog({
  title = "Detail",
  description,
  triggerLabel = "Detail",
  items,
  onLoad,
}: DetailDialogProps) {
  const [data, setData] = useState<DetailDialogItem[] | null>(items ?? null);
  const [loading, setLoading] = useState<boolean>(!!onLoad);

  const handleOpenChange = async (open: boolean) => {
    if (open && onLoad) {
      setLoading(true);
      try {
        const result = await onLoad();
        setData(result);
      } catch (e) {
        setData([]);
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Dialog onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Badge className="bg-blue-500 hover:bg-blue-600 active:scale-95 cursor-pointer">
          {triggerLabel}
        </Badge>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        <Separator className="my-2" />

        <ScrollArea className="max-h-[50vh] pr-2">
          <div className="space-y-3 text-sm">
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div
                  key={i}
                  className="flex justify-between gap-2 items-center"
                >
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))
            ) : data?.length === 0 ? (
              <p className="text-muted-foreground">
                Tidak ada data untuk ditampilkan.
              </p>
            ) : (
              data?.map((item, index) => (
                <div key={index} className="flex justify-between border-b pb-1">
                  <span className="font-medium text-muted-foreground">
                    {item.label}
                  </span>
                  <span className="text-right">{item.value}</span>
                </div>
              ))
            )}
          </div>
        </ScrollArea>

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
