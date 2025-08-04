/* eslint-disable @typescript-eslint/no-explicit-any */

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { getDefaultDateRange } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useMemo, useState } from "react";
import { TbDatabaseCog } from "react-icons/tb";

interface RetrieveDataPopoverProps {
  retrieveHandler: (startDate: string, endDate: string) => Promise<any> | void;
}

export default function RetrieveDataPopover({
  retrieveHandler,
}: RetrieveDataPopoverProps) {
  const { defaultEndDate } = getDefaultDateRange();
  const [isLoading, setIsLoading] = useState(false);
  const [startDate, setStartDate] = useState(defaultEndDate);
  const [endDate, setEndDate] = useState(defaultEndDate);
  const [open, setOpen] = useState(false);

  const isDateRangeValid = useMemo(() => {
    return !!startDate && !!endDate && startDate <= endDate;
  }, [startDate, endDate]);

  const handleRetrieveData = async () => {
    if (!isDateRangeValid) return;

    setIsLoading(true);
    try {
      await retrieveHandler(startDate, endDate);
      setOpen(false);
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="gap-2"
          aria-label="Ambil data berdasarkan rentang tanggal"
        >
          <TbDatabaseCog className="w-4 h-4" />
          Ambil Data
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="start">
        <div className="grid gap-4">
          <div className="space-y-1">
            <h4 className="text-sm font-medium leading-none">
              Pilih Rentang Tanggal
            </h4>
            <p className="text-xs text-muted-foreground">
              Tentukan tanggal awal dan akhir untuk mengambil data.
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
              className="w-full mt-2"
              disabled={!isDateRangeValid || isLoading}
              aria-disabled={!isDateRangeValid || isLoading}
              title={
                !isDateRangeValid
                  ? "Tanggal awal harus sebelum atau sama dengan tanggal akhir"
                  : "Ambil data dalam rentang ini"
              }
              onClick={handleRetrieveData}
            >
              {isLoading && <Loader2 className="animate-spin w-4 h-4 mr-2" />}
              Ambil Data
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
