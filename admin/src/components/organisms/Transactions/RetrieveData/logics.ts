import { useTransactionData } from "@/components/providers/TransactionProvider";
import axios, { isAxiosError } from "axios";
import { useCallback, useMemo, useState } from "react";
import { toast } from "react-toastify";

export function useRetrieveDataLogic() {
  const today = new Date().toISOString().slice(0, 10);

  const [startDate, setStartDate] = useState<string>(today);
  const [endDate, setEndDate] = useState<string>(today);

  const {
    setTransactions,
    setTransactionItems,
    setIsLoadingTransactions,
    setDateRange,
  } = useTransactionData();

  // Validasi input
  const isDateRangeValid = useMemo(() => {
    if (!startDate || !endDate) return false;
    return startDate <= endDate;
  }, [startDate, endDate]);

  const handleRetrieve = useCallback(
    async (options?: { showToast: boolean }) => {
      const showToast = options?.showToast ?? true;

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
        setIsLoadingTransactions(true);

        const { data } = await axios.get("/api/transaction", {
          params: {
            start: startDate,
            end: endDate,
          },
        });

        if (!data || !data.transactions) {
          toast("Data transaksi tidak ditemukan.", { type: "info" });
          return;
        }

        setTransactions(data.transactions);
        setTransactionItems(data.transactionItems);

        if (showToast) {
          toast("Data berhasil diambil", { type: "success" });
        }
        setDateRange({ end: endDate, start: startDate });
      } catch (error) {
        if (isAxiosError(error)) {
          toast(
            error?.response?.data?.message ||
              "Terjadi kesalahan saat mengambil data transaksi.",
            { type: "error" }
          );
        }
        console.error(error);
      } finally {
        setIsLoadingTransactions(false);
      }
    },
    [
      startDate,
      endDate,
      isDateRangeValid,
      setIsLoadingTransactions,
      setTransactions,
      setDateRange,
      setTransactionItems,
    ]
  );

  return {
    startDate,
    endDate,
    isDateRangeValid,
    setEndDate,
    setStartDate,
    handleRetrieve,
  };
}
