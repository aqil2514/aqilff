import { TransactionItem } from "@/@types/transaction";
import { DataTable } from "@/components/molecules/DataTable";
import { useReportSalesData } from "@/components/providers/ReportSalesProvider";
import { formatToIndonesianDateTimeUTC, formatToRupiah } from "@/lib/utils";
import { ColumnFiltersState } from "@tanstack/react-table";
import {
  LucideBoxes,
  LucidePackage,
  LucidePercent,
  LucideTrendingUp,
  LucideWallet,
} from "lucide-react";
import { useMemo } from "react";
import { columns, simpleColumns } from "./Columns";

function filterData(
  data: TableReportSales[],
  columnFilters: ColumnFiltersState
): TableReportSales[] {
  return data.filter((row) => {
    return columnFilters.every(({ id, value }) => {
      const key = id as keyof TableReportSales;

      if (typeof value !== "string") return true;

      const cellValue = String(row[key] ?? "").toLowerCase();
      const keywords = value
        .toLowerCase()
        .split(" ")
        .filter((kw: string) => Boolean(kw));

      return keywords.every((kw: string) => cellValue.includes(kw));
    });
  });
}

type TableReportSales = TransactionItem & {
  category: string;
  transaction_at: string;
  transaction_code: string;
  customer_name: string;
};
export default function TransactionItemTable() {
  const {
    transaction,
    products,
    sorting,
    setSorting,
    columnFilters,
    setColumnFilters,
    viewMode,
    setViewMode
  } = useReportSalesData();

  const transactionItem = transaction.flatMap((tr) => tr.items ?? []);

  const originalItems = useMemo(() => {
    return transactionItem.map((item) => {
      const matchedProduct = products.find((p) => p.id === item.product_id);
      const matchedTransaction = transaction.find(
        (t) => t.id === item.transaction_id
      );

      return {
        ...item,
        id: matchedProduct?.code ?? item.id,
        margin: item.margin ?? 0,
        hpp: item.hpp ?? 0,
        category: matchedProduct?.parent_category ?? "No Category",
        transaction_at: formatToIndonesianDateTimeUTC(
          matchedTransaction?.transaction_at ?? ""
        ),
        transaction_code: matchedTransaction?.transaction_code ?? "-",
        customer_name: String(matchedTransaction?.customer_name ?? "-"),
      };
    });
  }, [transactionItem, products, transaction]);

  const summarizedItems = useMemo(() => {
    const map = new Map<string, TableReportSales>();

    for (const item of transactionItem) {
      const matchedProduct = products.find(
        (prod) => prod.id === item.product_id
      );
      const matchedTransaction = transaction.find(
        (tr) => tr.id === item.transaction_id
      );
      const key = matchedProduct?.code ?? item.product_name;

      if (map.has(key)) {
        const existing = map.get(key)!;
        existing.quantity += item.quantity;
        existing.subtotal += item.subtotal;
        existing.margin = (existing.margin ?? 0) + (item.margin ?? 0);
        existing.hpp = (existing.hpp ?? 0) + (item.hpp ?? 0); // ➕ HPP
      } else {
        map.set(key, {
          ...item,
          id: matchedProduct?.code ?? item.id,
          margin: item.margin ?? 0,
          hpp: item.hpp ?? 0, // ➕ HPP
          category: matchedProduct?.parent_category ?? "No Category",
          transaction_at: formatToIndonesianDateTimeUTC(
            matchedTransaction!.transaction_at
          ),
          transaction_code: matchedTransaction!.transaction_code,
          customer_name: String(matchedTransaction!.customer_name),
        });
      }
    }

    return Array.from(map.values());
  }, [transactionItem, products, transaction]);

  const filteredItems = useMemo(() => {
    return filterData(summarizedItems, columnFilters);
  }, [summarizedItems, columnFilters]);

  const dataToDisplay =
    viewMode === "summary" ? summarizedItems : originalItems;

  const columnsToDisplay =
  viewMode === "summary" ? simpleColumns : columns;

  return (
    <div>
      <div className="mb-4 flex items-center gap-2">
        <label className="text-sm font-medium">Mode Tampilan:</label>
        <select
          className="border px-2 py-1 rounded text-sm"
          value={viewMode}
          onChange={(e) =>
            setViewMode(e.target.value as "original" | "summary")
          }
        >
          <option value="summary">Ringkasan Produk</option>
          <option value="original">Data Asli (Per Transaksi)</option>
        </select>
      </div>

      <DataTable
        columns={columnsToDisplay}
        data={dataToDisplay}
        sorting={sorting}
        setSorting={setSorting}
        columnFilters={columnFilters}
        setColumnFilters={setColumnFilters}
      />
      <TableFooter data={filteredItems} />
    </div>
  );
}

const TableFooter = ({ data }: { data: TableReportSales[] }) => {
  const totalQty = data.reduce((sum, d) => sum + d.quantity, 0);
  const totalOmzet = data.reduce((sum, d) => sum + (d.subtotal ?? 0), 0);
  const totalHPP = data.reduce((sum, d) => sum + (d.hpp ?? 0), 0);
  const totalMargin = data.reduce((sum, d) => sum + (d.margin ?? 0), 0);
  const marginPercent = totalOmzet > 0 ? (totalMargin / totalOmzet) * 100 : 0;

  const stats = [
    {
      label: "Total Produk Ditampilkan",
      value: data.length,
      icon: LucideBoxes,
    },
    {
      label: "Total Kuantitas",
      value: totalQty,
      icon: LucidePackage,
    },
    {
      label: "Total Omzet",
      value: formatToRupiah(totalOmzet),
      icon: LucideTrendingUp,
    },
    {
      label: "Total HPP",
      value: formatToRupiah(totalHPP),
      icon: LucideWallet,
    },
    {
      label: "Total Margin",
      value: formatToRupiah(totalMargin),
      icon: LucideWallet,
    },
    {
      label: "Rata-rata Margin (%)",
      value: `${marginPercent.toFixed(1)}%`,
      icon: LucidePercent,
    },
  ];

  return (
    <div className="bg-white border rounded-2xl shadow-sm p-6 mt-4">
      <h3 className="text-base font-semibold text-gray-800 mb-4">
        Ringkasan Penjualan
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-sm text-gray-700">
        {stats.map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
          >
            <Icon className="w-5 h-5 text-gray-500" />
            <div>
              <div className="text-xs text-gray-500">{label}</div>
              <div className="font-semibold text-gray-800">{value}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
