import { useReportSalesData } from "@/components/providers/ReportSalesProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axios from "axios";
import React, { useMemo, useState } from "react";

export default function Summary() {
  return (
    <div className="p-4 space-y-6">
      <FilterDate />

      <SummaryStats />
    </div>
  );
}

const FilterDate = () => {
  const {
    endDate,
    setEndDate,
    startDate,
    setStartDate,
    isLoadingFetch,
    setIsLoadingFetch,
    setTransaction,
    setProducts
  } = useReportSalesData();

  const [error, setError] = useState<string | null>(null);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    if (id === "startDate") setStartDate(value);
    if (id === "endDate") setEndDate(value);
  };

  const handlerRetrieve = async () => {
    if (!startDate || !endDate) {
      setError("Tanggal tidak boleh kosong.");
      return;
    }

    if (startDate > endDate) {
      setError("Tanggal mulai tidak boleh lebih besar dari tanggal akhir.");
      return;
    }

    setError(null);
    setIsLoadingFetch(true);

    try {
      const { data } = await axios.get("/api/reports", {
        params: {
          source: "transactions",
          startDate,
          endDate,
        },
      });

      setTransaction(data.transactions);
      setProducts(data.products);
    } catch (err) {
      console.error("Gagal mengambil data:", err);
      setError("Terjadi kesalahan saat mengambil data.");
    } finally {
      setIsLoadingFetch(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startDate">Tanggal Mulai</Label>
          <Input
            type="date"
            id="startDate"
            value={startDate}
            onChange={handleDateChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="endDate">Tanggal Selesai</Label>
          <Input
            type="date"
            id="endDate"
            value={endDate}
            onChange={handleDateChange}
          />
        </div>
      </div>

      {error && (
        <div className="text-sm text-red-500 bg-red-50 p-2 rounded">
          {error}
        </div>
      )}

      <Button
        className="cursor-pointer active:scale-95 w-full sm:w-auto"
        onClick={handlerRetrieve}
        disabled={isLoadingFetch}
      >
        {isLoadingFetch ? "Mengambil Data..." : "Ambil Data"}
      </Button>
    </div>
  );
};

const SummaryStats = () => {
  const { transaction } = useReportSalesData();

  const summary = useMemo(() => {
    let totalOmzet = 0;
    let totalUnitTerjual = 0;
    const produkTerjual: Record<string, { name: string; quantity: number }> =
      {};

    for (const trx of transaction) {
      totalOmzet += trx.total_amount;

      for (const item of trx.items ?? []) {
        totalUnitTerjual += item.quantity;

        if (!produkTerjual[item.product_id]) {
          produkTerjual[item.product_id] = {
            name: item.product_name,
            quantity: 0,
          };
        }

        produkTerjual[item.product_id].quantity += item.quantity;
      }
    }

    const produkPalingLaris = Object.values(produkTerjual).sort(
      (a, b) => b.quantity - a.quantity
    )[0];

    return {
      totalOmzet,
      totalUnitTerjual,
      totalTransaksi: transaction.length,
      produkPalingLaris,
    };
  }, [transaction]);

  if (transaction.length <= 0) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg">
      <div>
        <p className="text-sm text-gray-600">Total Transaksi</p>
        <p className="text-xl font-semibold">{summary.totalTransaksi}</p>
      </div>
      <div>
        <p className="text-sm text-gray-600">Total Omzet</p>
        <p className="text-xl font-semibold">
          Rp {summary.totalOmzet.toLocaleString("id-ID")}
        </p>
      </div>
      <div>
        <p className="text-sm text-gray-600">Total Unit Terjual</p>
        <p className="text-xl font-semibold">{summary.totalUnitTerjual} pcs</p>
      </div>
      {summary.produkPalingLaris && (
        <div className="sm:col-span-2">
          <p className="text-sm text-gray-600">Produk Terlaris</p>
          <p className="text-lg font-semibold">
            {summary.produkPalingLaris.name} (
            {summary.produkPalingLaris.quantity} pcs)
          </p>
        </div>
      )}
    </div>
  );
};
