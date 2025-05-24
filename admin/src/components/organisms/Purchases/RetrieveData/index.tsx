import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Loader2 } from "lucide-react";
import { TbDatabaseCog } from "react-icons/tb";
import { useRetrieveDataLogic } from "./logics";

export default function RetrieveData() {
  const {
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    isDateRangeValid,
    handleRetrieve,
    isLoadingPurchases,
  } = useRetrieveDataLogic();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="gap-2"
          aria-label="Ambil data transaksi berdasarkan rentang tanggal"
        >
          <TbDatabaseCog />
          Ambil Data
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="start">
        <div className="grid gap-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Pilih Rentang Tanggal</h4>
            <p className="text-sm text-muted-foreground">
              Tentukan tanggal awal dan akhir untuk mengambil data transaksi.
            </p>
          </div>
          <div className="grid gap-2">
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="start-date">Dari</Label>
              <Input
                id="start-date"
                type="date"
                className="col-span-2 h-8"
                value={startDate}
                max={endDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-3 items-center gap-4">
              <Label htmlFor="end-date">Sampai</Label>
              <Input
                id="end-date"
                type="date"
                className="col-span-2 h-8"
                value={endDate}
                min={startDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <Button
              onClick={() => handleRetrieve()}
              className="w-full mt-2"
              disabled={!isDateRangeValid || isLoadingPurchases}
              aria-disabled={!isDateRangeValid || isLoadingPurchases}
              title={
                !isDateRangeValid
                  ? "Tanggal awal harus kurang dari atau sama dengan tanggal akhir"
                  : undefined
              }
            >
              {isLoadingPurchases && (
                <Loader2 className="animate-spin w-4 h-4 mr-2" />
              )}
              Ambil Data
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
