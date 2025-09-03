/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn, getDefaultDateRange } from "@/lib/utils";
import { RefreshCcw } from "lucide-react";
import { useMemo, useState } from "react";

import { ChevronLeft, ChevronRight, CalendarRange } from "lucide-react";

/* util tanggal lokal: format ke YYYY-MM-DD berdasar timezone lokal */
const fmt = (d: Date) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate()).toLocaleDateString(
    "en-CA"
  ); // YYYY-MM-DD

const addDays = (d: Date, n: number) => {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
};

const startOfWeek = (d: Date) => {
  // Senin sebagai awal minggu
  const day = d.getDay(); // 0=Min,1=Sen,...6=Sab
  const delta = (day + 6) % 7; // jarak ke Senin
  return addDays(new Date(d.getFullYear(), d.getMonth(), d.getDate()), -delta);
};

const endOfWeek = (d: Date) => addDays(startOfWeek(d), 6);
const startOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth(), 1);
const endOfMonth = (d: Date) => new Date(d.getFullYear(), d.getMonth() + 1, 0);

interface RetrieveHandlerCardrProps {
  retrieveHandler: (startDate: string, endDate: string) => Promise<any> | void;
}

export default function RetrieveHandlerCard({
  retrieveHandler,
}: RetrieveHandlerCardrProps) {
  const { defaultEndDate } = getDefaultDateRange();
  const [startDate, setStartDate] = useState<string>(defaultEndDate);
  const [endDate, setEndDate] = useState<string>(defaultEndDate);
  const [isLoading, setIsLoading] = useState(false);

  const isDateRangeValid = useMemo(() => {
    return !!startDate && !!endDate && startDate <= endDate;
  }, [startDate, endDate]);

  // helper untuk set range sekaligus
  const setRange = (start: Date, end: Date) => {
    setStartDate(fmt(start));
    setEndDate(fmt(end));
  };

  // PRESETS
  const quickToday = () => {
    const now = new Date();
    setRange(now, now);
  };

  const quickThisWeek = () => {
    const now = new Date();
    setRange(startOfWeek(now), endOfWeek(now));
  };

  const quickThisMonth = () => {
    const now = new Date();
    setRange(startOfMonth(now), endOfMonth(now));
  };

  const quickLastNDays = (n: number) => {
    const end = new Date();
    const start = addDays(end, -(n - 1));
    setRange(start, end);
  };

  // SHIFT PERIODE (berdasarkan range aktif sekarang)
  const shiftRange = (direction: -1 | 1) => {
    if (!isDateRangeValid) return;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const span = Math.round((+end - +start) / (1000 * 60 * 60 * 24)) + 1; // jumlah hari
    const newStart = addDays(start, direction * span);
    const newEnd = addDays(end, direction * span);
    setRange(newStart, newEnd);
  };

  const handleRetrieveData = async () => {
    if (!isDateRangeValid) return;
    try {
      setIsLoading(true);
      await retrieveHandler(startDate, endDate);
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Rentang Tanggal</CardTitle>
        <CardDescription>
          Pilih rentang tanggal untuk ambil data
        </CardDescription>
        <CardAction>
          <Button
            size="icon"
            variant="ghost"
            className={cn("cursor-pointer", isLoading && "animate-spin")}
            disabled={isLoading || !isDateRangeValid}
            onClick={handleRetrieveData}
            aria-label="Ambil data"
            title="Ambil data"
          >
            <RefreshCcw />
          </Button>
        </CardAction>
      </CardHeader>

      <CardContent className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="start-date">Tanggal Mulai</Label>
          <Input
            disabled={isLoading}
            value={startDate}
            type="date"
            id="start-date"
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="end-date">Tanggal Selesai</Label>
          <Input
            disabled={isLoading}
            value={endDate}
            type="date"
            id="end-date"
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </CardContent>

      <CardFooter className="flex flex-col gap-2">
        {/* Navigasi Cepat */}
        <div className="flex flex-wrap items-center gap-2">
          <Button
            size="sm"
            variant="outline"
            onClick={quickToday}
            disabled={isLoading}
          >
            <CalendarRange className="mr-2 h-4 w-4" />
            Hari ini
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={quickThisWeek}
            disabled={isLoading}
          >
            Minggu ini
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={quickThisMonth}
            disabled={isLoading}
          >
            Bulan ini
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => quickLastNDays(7)}
            disabled={isLoading}
          >
            7 hari terakhir
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClick={() => quickLastNDays(30)}
            disabled={isLoading}
          >
            30 hari terakhir
          </Button>

          {/* Shift periode aktif */}
          <div className="ml-auto flex items-center gap-2">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => shiftRange(-1)}
              disabled={isLoading || !isDateRangeValid}
              title="Periode sebelumnya"
              aria-label="Periode sebelumnya"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => shiftRange(1)}
              disabled={isLoading || !isDateRangeValid}
              title="Periode berikutnya"
              aria-label="Periode berikutnya"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Info ringkas / validasi */}
        <p className={cn("text-sm", !isDateRangeValid && "text-destructive")}>
          {isDateRangeValid
            ? `Rentang: ${startDate} s/d ${endDate}`
            : "Rentang tanggal tidak valid."}
        </p>
      </CardFooter>
    </Card>
  );
}
