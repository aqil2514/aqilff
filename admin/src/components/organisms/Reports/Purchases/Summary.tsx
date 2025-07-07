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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatToRupiah } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  getAmountCurrentStock,
  getAmountShoppingItem,
  getCategoryAmountAllocationStock,
  getCategoryAmountCurrentStock,
} from "./utils";
import { Cell, Pie, PieChart, Tooltip } from "recharts";
import { ChartContainer } from "@/components/ui/chart";
import { ChartPieData } from "@/@types/general";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Circle } from "lucide-react";
import { chartConfig, COLORS } from "../Sales/Chart/utils";

export default function ReportPurchaseSummary() {
  return (
    <ScrollArea className="bg-white shadow-2xl h-full w-full rounded-2xl p-4 overflow-auto">
      <FilterDate />
      <Summary />
    </ScrollArea>
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
      <div className="flex gap-4 my-4">
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

const Summary = () => {
  return (
    <Tabs defaultValue="general" className="my-4">
      <TabsList>
        <TabsTrigger value="general">Umum</TabsTrigger>
        <TabsTrigger value="allocation">Alokasi</TabsTrigger>
        <TabsTrigger value="current">Real Time</TabsTrigger>
      </TabsList>
      <TabsContent value="general">
        <SummaryGeneralTab />
      </TabsContent>
      <TabsContent value="allocation">
        <SummaryStockAmount version="allocation" />
      </TabsContent>
      <TabsContent value="current">
        <SummaryStockAmount version="current" />
      </TabsContent>
    </Tabs>
  );
};

const SummaryGeneralTab = () => {
  const { purchase } = useReportPurchaseData();
  const items = purchase.flatMap((pur) => pur.items);

  const amountShoppingItem = getAmountShoppingItem(items);

  const amountCurrentStock = getAmountCurrentStock(items);

  return (
    <div className="flex flex-col gap-4 mt-4">
      <div className="p-4 bg-muted/50 border rounded-xl shadow-sm">
        <p className="text-sm text-muted-foreground mb-1">Total Belanja</p>
        <p className="text-xl font-semibold text-primary">{purchase.length}</p>
      </div>

      <div className="p-4 bg-muted/50 border rounded-xl shadow-sm">
        <p className="text-sm text-muted-foreground mb-1">
          Total Nominal Belanja
        </p>
        <p className="text-xl font-semibold text-green-600">
          {amountShoppingItem}
        </p>
      </div>

      <div className="p-4 bg-muted/50 border rounded-xl shadow-sm">
        <p className="text-sm text-muted-foreground mb-1">
          Nilai Stok Saat Ini
        </p>
        <p className="text-xl font-semibold text-yellow-600">
          {amountCurrentStock}
        </p>
      </div>
    </div>
  );
};

type StockPropsType = "allocation" | "current";
const SummaryStockAmount = ({ version }: { version: StockPropsType }) => {
  const { purchase, products } = useReportPurchaseData();
  const items = purchase.flatMap((pur) => pur.items);

  const total: Record<StockPropsType, number> = {
    allocation: Number(getAmountShoppingItem(items, false)),
    current: Number(getAmountCurrentStock(items, false)),
  };

  const data: Record<StockPropsType, ChartPieData[]> = {
    allocation: getCategoryAmountAllocationStock(items, products),
    current: getCategoryAmountCurrentStock(items, products),
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg capitalize">
          {version === "allocation" ? "Alokasi Stok" : "Stok Tersisa"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <ChartContainer config={chartConfig}>
          <PieChart>
            <Pie
              data={data[version]}
              cx="50%"
              cy="50%"
              outerRadius="80%"
              dataKey="value"
              label={({ name, value }) =>
                `${name}: ${((value / total[version]) * 100).toFixed(1)}%`
              }
            >
              {data[version].map((entry, index) => (
                <Cell
                  key={`cell-${entry.name}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => formatToRupiah(value)}
              labelFormatter={() => "Kategori"}
            />
          </PieChart>
        </ChartContainer>

        <div className="text-center">
          <p className="text-sm text-muted-foreground">Total</p>
          <p className="text-xl font-bold text-primary">
            {formatToRupiah(total[version])}
          </p>
        </div>

        <div className="flex flex-col gap-4 text-sm">
          {data[version].map((d, index) => (
            <div
              key={d.name}
              className="flex items-center justify-between px-3 py-2 rounded bg-muted/40"
            >
              <div className="flex items-center gap-2">
                <Circle
                  className="w-3 h-3"
                  style={{ color: COLORS[index % COLORS.length] }}
                  fill={COLORS[index % COLORS.length]}
                />
                <span>{d.name}</span>
              </div>
              <span className="font-medium">{formatToRupiah(d.value)}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
