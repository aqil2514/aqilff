import { DataTable } from "@/components/molecules/DataTable";
import { formatToRupiah } from "@/lib/utils";
import {
  LucideBoxes,
  LucideIcon,
  LucidePackage,
  LucidePercent,
  LucideTrendingUp,
  LucideWallet,
} from "lucide-react";
import { TabsContent } from "@/components/ui/tabs";
import { TableReportSales } from "./interface";
import { useTabsContentTransactionItemTableLogics } from "./logics";

export default function TabsContentTransactionItemTable() {
  const {
    columnsToDisplay,
    dataToDisplay,
    filteredItems,
    setColumnFilters,
    setSorting,
    setViewMode,
    sorting,
    viewMode,
    columnFilters,
  } = useTabsContentTransactionItemTableLogics();

  return (
    <TabsContent value="table">
      <div>
        <div className="mb-4 flex flex-col md:flex-row items-start md:items-center gap-2">
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
    </TabsContent>
  );
}

interface Stats {
  label: string;
  value: number | string;
  icon: LucideIcon;
}
const TableFooter = ({ data }: { data: TableReportSales[] }) => {
  const totalQty = data.reduce((sum, d) => sum + d.quantity, 0);
  const totalOmzet = data.reduce((sum, d) => sum + (d.subtotal ?? 0), 0);
  const totalHPP = data.reduce((sum, d) => sum + (d.hpp ?? 0), 0);
  const totalMargin = data.reduce((sum, d) => sum + (d.margin ?? 0), 0);
  const marginPercent = totalOmzet > 0 ? (totalMargin / totalOmzet) * 100 : 0;

  const stats: Stats[] = [
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
