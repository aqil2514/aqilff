import { useReportPurchaseData } from "@/components/providers/ReportPurchaseProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { useState } from "react";
import { columns } from "./Tables";

export default function ReportPurchaseSummary() {
  return (
    <div className="bg-white shadow-2xl h-full w-full rounded-2xl p-4">
      <FilterDate />
    </div>
  );
}

const FilterDate = () => {
  const {
    startDate,
    setEndDate,
    endDate,
    setStartDate,
    setIsLoadingFetch,
    setPurchase,
    setProducts,
    isLoadingFetch,
  } = useReportPurchaseData();
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    if (id === "start-date") setStartDate(value);
    if (id === "end-date") setEndDate(value);
  };

  const [error, setError] = useState<string | null>(null);

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
          source: "purchases",
          startDate,
          endDate,
        },
      });

      setPurchase(data.purchases);
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
      <div className="flex gap-4 mb-4">
        <div className="space-y-2">
          <Label htmlFor="start-date">Tanggal Mulai</Label>
          <Input
            value={startDate}
            onChange={handleDateChange}
            type="date"
            id="start-date"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="end-date">Tanggal Terakhir</Label>
          <Input
            value={endDate}
            type="date"
            id="end-date"
            onChange={handleDateChange}
          />
        </div>
        {error && (
          <div className="text-sm text-red-500 bg-red-50 p-2 rounded">
            {error}
          </div>
        )}
      </div>

      <Button
        className="cursor-pointer active:scale-95 w-full sm:w-auto"
        onClick={handlerRetrieve}
        disabled={isLoadingFetch}
      >
        {isLoadingFetch ? "Mengambil Data..." : "Ambil Data"}
      </Button>

      {startDate && endDate && (
        <>
          <FilterText />
          <SortControls />
        </>
      )}
    </>
  );
};

const FilterText = () => {
  const { columnFilters, setColumnFilters } = useReportPurchaseData();
  const [selectedId, setSelectedId] = useState<string>(""); // kolom terpilih

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    // Jika belum memilih kolom, jangan set filter
    if (!selectedId) return;

    // Update / tambahkan filter
    const existingFilterIndex = columnFilters.findIndex(
      (f) => f.id === selectedId
    );
    const updatedFilters = [...columnFilters];

    if (existingFilterIndex !== -1) {
      // Update filter yang sudah ada
      updatedFilters[existingFilterIndex] = {
        id: selectedId,
        value: newValue,
      };
    } else {
      // Tambahkan filter baru
      updatedFilters.push({
        id: selectedId,
        value: newValue,
      });
    }

    setColumnFilters(updatedFilters);
  };

  return (
    <div className="my-4 space-y-2">
      <Label htmlFor="search-value">
        <span className="text-xs mb-1 block">Cari Data Berdasarkan</span>
        <Select
          onValueChange={(val) => {
            setSelectedId(val);
          }}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Pilih Kolom" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Filter Kolom</SelectLabel>
              {columns.map((col) => (
                <SelectItem key={col.id} value={col.id as string}>
                  {col.header as string}
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

const SortControls = () => {
  const { setSorting } = useReportPurchaseData();
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
    <div className="space-y-2 mt-4">
      <Label>Urutkan Berdasarkan</Label>
      <div className="flex items-center flex-wrap gap-2">
        <Select onValueChange={(val) => setSortColumn(val)} value={sortColumn}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Pilih Kolom" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Kolom</SelectLabel>
              {columns.map((col) => (
                <SelectItem key={col.id} value={col.id as string}>
                  {col.header as string}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>

        <Select
          onValueChange={(val) => setSortDirection(val as "asc" | "desc")}
          value={sortDirection}
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
