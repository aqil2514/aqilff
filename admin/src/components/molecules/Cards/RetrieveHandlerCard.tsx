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
            size={"icon"}
            variant={"ghost"}
            className={cn("cursor-pointer", isLoading && "animate-spin")}
            disabled={isLoading}
            onClick={handleRetrieveData}
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
      <CardFooter>
        <p>
          Mengambil data dari {startDate} sampai {endDate}{" "}
        </p>
      </CardFooter>
    </Card>
  );
}
