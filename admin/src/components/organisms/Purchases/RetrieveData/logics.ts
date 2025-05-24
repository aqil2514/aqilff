import { usePurchaseData } from "@/components/providers/PurchasesProvider";
import axios, { isAxiosError } from "axios";
import { useCallback, useMemo, useState } from "react";
import { toast } from "react-toastify";

export function useRetrieveDataLogic() {
  const today = new Date().toISOString().slice(0, 10);

  const [startDate, setStartDate] = useState<string>(today);
  const [endDate, setEndDate] = useState<string>(today);

  const {
    isLoadingPurchases,
    setPurchases,
    setIsLoadingPurchases,
    setDateRange,
  } = usePurchaseData();

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
        setIsLoadingPurchases(true);

        const { data } = await axios.get("/api/purchase", {
          params: {
            start: startDate,
            end: endDate,
          },
        });

        if (!data) {
          toast("Data tidak ditemukan.", { type: "info" });
          return;
        }

        setPurchases(data.data);

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
        setIsLoadingPurchases(false);
      }
    },
    [
      startDate,
      endDate,
      isDateRangeValid,
      setIsLoadingPurchases,
      setDateRange,
      setPurchases,
    ]
  );

  return {
    startDate,
    isLoadingPurchases,
    endDate,
    isDateRangeValid,
    setEndDate,
    setStartDate,
    handleRetrieve,
  };
}
