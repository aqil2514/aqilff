import { useReportSalesData } from "@/components/providers/ReportSalesProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import React, { useMemo, useState } from "react";

export default function Summary() {
  return (
    <ScrollArea className="bg-white max-h-[450px] shadow-md rounded-xl h-full flex-1 p-4 space-y-6">
      <FilterControl />

      <SummaryStats />
    </ScrollArea>
  );
}

const SummaryStats = () => {
  const { transaction } = useReportSalesData();

  const summary = useMemo(() => {
    let totalRevenue = 0;
    let totalUnitsSold = 0;
    let totalMargin = 0;
    let totalHPP = 0;

    const productMap: Record<
      string,
      {
        name: string;
        quantity: number;
        amount: number;
        margin: number;
        hpp: number;
        marginPercentage?: number;
      }
    > = {};

    for (const trx of transaction) {
      totalRevenue += trx.total_amount;

      for (const item of trx.items ?? []) {
        totalUnitsSold += item.quantity;
        totalMargin += item.margin ?? 0;
        totalHPP += item.hpp ?? 0;

        if (!productMap[item.product_id]) {
          productMap[item.product_id] = {
            name: item.product_name,
            quantity: 0,
            amount: 0,
            margin: 0,
            hpp: 0,
          };
        }

        const prod = productMap[item.product_id];
        prod.quantity += item.quantity;
        prod.amount += item.subtotal ?? 0;
        prod.margin += item.margin ?? 0;
        prod.hpp += (item.hpp ?? 0) * item.quantity;
      }
    }
    for (const id in productMap) {
      const prod = productMap[id];
      prod.marginPercentage =
        prod.amount > 0 ? (prod.margin / prod.amount) * 100 : 0;
    }

    const sortedByQty = Object.values(productMap).sort(
      (a, b) => b.quantity - a.quantity
    );
    const sortedByAmount = Object.values(productMap).sort(
      (a, b) => b.amount - a.amount
    );
    const sortedByMargin = Object.values(productMap).sort(
      (a, b) => b.margin - a.margin
    );

    return {
      totalRevenue: Math.round(totalRevenue),
      totalUnitsSold,
      totalMargin: Math.round(totalMargin),
      totalHPP: Math.round(totalHPP),
      marginPercentage:
        totalRevenue > 0 ? (totalMargin / totalRevenue) * 100 : 0,
      totalTransactions: transaction.length,
      bestSellingProduct: sortedByQty[0],
      highestRevenueProduct: sortedByAmount[0],
      mostProfitableProduct: sortedByMargin[0],
    };
  }, [transaction]);

  if (transaction.length <= 0) return null;

  return (
    <>
      <h2>
        Statistik Penjualan Keseluruhan
        </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg">
        <div>
          <p className="text-sm text-gray-600">Total Transaksi</p>
          <p className="text-xl font-semibold">{summary.totalTransactions}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Total Omzet</p>
          <p className="text-xl font-semibold">
            Rp{" "}
            {summary.totalRevenue.toLocaleString("id-ID", {
              maximumFractionDigits: 0,
            })}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Total Unit Terjual</p>
          <p className="text-xl font-semibold">{summary.totalUnitsSold} pcs</p>
        </div>

        <div>
          <p className="text-sm text-gray-600">Total Modal (HPP)</p>
          <p className="text-xl font-semibold">
            Rp{" "}
            {summary.totalHPP.toLocaleString("id-ID", {
              maximumFractionDigits: 0,
            })}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Total Margin Kotor</p>
          <p className="text-xl font-semibold">
            Rp{" "}
            {summary.totalMargin.toLocaleString("id-ID", {
              maximumFractionDigits: 0,
            })}
          </p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Persentase Margin</p>
          <p className="text-xl font-semibold">
            {summary.marginPercentage.toLocaleString("id-ID", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
            %
          </p>
        </div>

        {summary.bestSellingProduct && (
          <div className="sm:col-span-2">
            <p className="text-sm text-gray-600">Produk Terlaris (Qty)</p>
            <p className="text-lg font-semibold">
              {summary.bestSellingProduct.name} (
              {summary.bestSellingProduct.quantity} pcs)
            </p>
          </div>
        )}

        {summary.highestRevenueProduct && (
          <div className="sm:col-span-2">
            <p className="text-sm text-gray-600">
              Produk Volume Terbesar (Omzet)
            </p>
            <p className="text-lg font-semibold">
              {summary.highestRevenueProduct.name} (Rp{" "}
              {Math.round(summary.highestRevenueProduct.amount).toLocaleString(
                "id-ID"
              )}
              )
            </p>
          </div>
        )}

        {summary.mostProfitableProduct && (
          <div className="sm:col-span-2">
            <p className="text-sm text-gray-600">
              Produk Paling Menguntungkan (Margin)
            </p>
            <p className="text-lg font-semibold">
              {summary.mostProfitableProduct.name} (Rp{" "}
              {Math.round(summary.mostProfitableProduct.margin).toLocaleString(
                "id-ID"
              )}
              )
            </p>
          </div>
        )}
      </div>
    </>
  );
};

const FilterControl = () => {
  return (
    <div className="space-y-4 mb-4 px-4">
      <FilterDate />
      <FilterText />
      <SortingControl />
    </div>
  );
};

const FilterDate = () => {
  const {
    endDate,
    setEndDate,
    startDate,
    setStartDate,
    isLoadingFetch,
    setIsLoadingFetch,
    setTransaction,
    setProducts,
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
    <>
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
    </>
  );
};

const columns = [
  { id: "category", header: "Kategori" },
  { id: "quantity", header: "Kuantiti" },
  { id: "margin_percentage", header: "Margin (%)" },
  { id: "product_name", header: "Nama Produk" },
  { id: "customer_name", header: "Nama Pembeli" },
  { id: "transaction_at", header: "Tanggal Transaksi" },
  { id: "hpp", header: "Total HPP" },
  { id: "subtotal", header: "Total Omzet" },
  { id: "margin_total", header: "Total Margin" },
];

const FilterText = () => {
  const { columnFilters, setColumnFilters } = useReportSalesData();
  const [selectedId, setSelectedId] = useState<string>("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    if (!selectedId) return;

    const existingFilterIndex = columnFilters.findIndex(
      (f) => f.id === selectedId
    );
    const updatedFilters = [...columnFilters];

    if (existingFilterIndex !== -1) {
      updatedFilters[existingFilterIndex] = { id: selectedId, value: newValue };
    } else {
      updatedFilters.push({ id: selectedId, value: newValue });
    }

    setColumnFilters(updatedFilters);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="search-value">
        <span className="text-xs mb-1 block">Cari Data Berdasarkan</span>
        <Select onValueChange={setSelectedId}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Pilih Kolom" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Filter Kolom</SelectLabel>
              {columns.map((col) => (
                <SelectItem key={col.id} value={col.id}>
                  {col.header}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </Label>

      <Input
        type="text"
        id="search-value"
        placeholder="Masukkan kata kunci"
        onChange={handleInputChange}
        disabled={!selectedId}
      />
    </div>
  );
};

const SortingControl = () => {
  const { setSorting } = useReportSalesData();
  const [sortColumn, setSortColumn] = useState<string>("");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const handleSortChange = () => {
    if (!sortColumn) return;
    setSorting([
      {
        id: sortColumn,
        desc: sortDirection === "desc",
      },
    ]);
  };

  return (
    <div className="space-y-2">
      <Label>Urutkan Berdasarkan</Label>
      <div className="flex items-center flex-wrap gap-2">
        <Select value={sortColumn} onValueChange={setSortColumn}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Pilih Kolom" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Kolom</SelectLabel>
              {columns.map((col) => (
                <SelectItem key={col.id} value={col.id}>
                  {col.header}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select
          value={sortDirection}
          onValueChange={(val) => setSortDirection(val as "asc" | "desc")}
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Arah" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="asc">A-Z</SelectItem>
            <SelectItem value="desc">Z-A</SelectItem>
          </SelectContent>
        </Select>

        <Button variant="outline" onClick={handleSortChange}>
          Terapkan
        </Button>
      </div>
    </div>
  );
};
