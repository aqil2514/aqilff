/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { Dispatch, SetStateAction, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { TbDatabaseCog } from "react-icons/tb";
import { Loader2 } from "lucide-react";
import { toast } from "react-toastify";
import axios, { isAxiosError } from "axios";

// ======================
// Types
// ======================
type DataSrc = "transactions" | "purchases";

export type RangeData = {
  start: string;
  end: string;
};

export interface GetDataFromServer<T extends any[]> {
  showToast?: boolean;
  setIsLoading: React.Dispatch<SetStateAction<boolean>>;
  isDateRangeValid: boolean;
  startDate: string;
  endDate: string;
  setDateRange: Dispatch<SetStateAction<RangeData | null>>;
  setData: Dispatch<SetStateAction<T>>;
  data_src: DataSrc;
}

export type RetrieveDataProps<T extends any[]> = {
  isLoading: boolean;
  setIsLoading: React.Dispatch<SetStateAction<boolean>>;
  setData: Dispatch<SetStateAction<T>>;
  data_src: DataSrc;
  setDateRange: Dispatch<SetStateAction<RangeData | null>>;
};

// ======================
// Helper: Fetch Data
// ======================
const getDataFromServer = async <T extends any[]>(
  options: GetDataFromServer<T>
) => {
  const {
    showToast = true,
    setIsLoading,
    isDateRangeValid,
    endDate,
    startDate,
    setDateRange,
    setData,
    data_src,
  } = options;

  if (!isDateRangeValid) {
    toast(
      "Rentang tanggal tidak valid. Pastikan tanggal awal tidak lebih besar dari tanggal akhir.",
      {
        type: "error",
      }
    );
    return;
  }

  try {
    setIsLoading(true);

    const { data } = await axios.get(`/api/${data_src}`, {
      params: { start: startDate, end: endDate },
    });

    const payload = data?.[data_src];

    if (!Array.isArray(payload) || payload.length === 0) {
      toast(`Data ${data_src} tidak ditemukan.`, { type: "info" });
      setDateRange({ start: startDate, end: endDate });
      setData([] as any);
      return;
    }

    setData(payload as T);

    if (showToast) {
      toast("Data berhasil diambil", { type: "success" });
    }

    setDateRange({ start: startDate, end: endDate });
  } catch (error) {
    if (isAxiosError(error)) {
      toast(
        error?.response?.data?.message ||
          "Terjadi kesalahan saat mengambil data transaksi.",
        {
          type: "error",
        }
      );
    } else {
      toast("Terjadi kesalahan tak terduga.", { type: "error" });
    }
    console.error(error);
  } finally {
    setIsLoading(false);
  }
};

// ======================
// Komponen UI: RetrieveDataPopover
// ======================
export function RetrieveDataPopover<T extends any[]>({
  isLoading,
  setIsLoading,
  setData,
  data_src,
  setDateRange,
}: RetrieveDataProps<T>) {
  const today = new Date().toISOString().slice(0, 10);

  const [startDate, setStartDate] = useState<string>(today);
  const [endDate, setEndDate] = useState<string>(today);

  const isDateRangeValid = useMemo(() => {
    if (!startDate || !endDate) return false;
    return startDate <= endDate;
  }, [startDate, endDate]);

  const handleRetrieve = () =>
    getDataFromServer<T>({
      data_src,
      endDate,
      isDateRangeValid,
      setData,
      setDateRange,
      setIsLoading,
      startDate,
    });

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className="gap-2"
          aria-label="Ambil data berdasarkan rentang tanggal"
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
              Tentukan tanggal awal dan akhir untuk mengambil data {data_src}.
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
              onClick={handleRetrieve}
              className="w-full mt-2"
              disabled={!isDateRangeValid || isLoading}
              aria-disabled={!isDateRangeValid || isLoading}
              title={
                !isDateRangeValid
                  ? "Tanggal awal harus kurang dari atau sama dengan tanggal akhir"
                  : undefined
              }
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
