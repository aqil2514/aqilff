import { TransactionItem } from "@/@types/transaction";
import { DataTable } from "@/components/molecules/DataTable";
import { useReportSalesData } from "@/components/providers/ReportSalesProvider";
import { formatToRupiah } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";

const columns: ColumnDef<TransactionItem>[] = [
  {
    accessorKey: "id",
    header: "ID Produk",
  },
  {
    accessorKey: "category",
    header: "Kategori",
  },
  {
    accessorKey: "product_name",
    header: "Nama Produk",
    filterFn: (row, columnId, filterValue) => {
      const cellValue = String(row.getValue(columnId) ?? "").toLowerCase();
      const keywords = filterValue.toLowerCase().split(" ").filter(Boolean);
      return keywords.every((kw: string) => cellValue.includes(kw));
    },
  },
  {
    accessorKey: "quantity",
    header: "Kuantitas",
  },
  {
    accessorKey: "subtotal",
    header: "Total Omzet",
    cell: ({ row }) => formatToRupiah(row.original.subtotal),
  },
  {
    accessorKey: "hpp",
    header: "Total HPP",
    cell: ({ row }) => formatToRupiah(row.original.hpp ?? 0),
  },
  {
    accessorKey: "margin_total",
    accessorFn: (row) => row.margin ?? 0,
    header: "Total Margin",
    cell: ({ row }) => {
      return formatToRupiah(row.original.margin);
    },
  },
  {
    accessorKey: "margin_percentage",
    accessorFn: (row) => {
      const margin = row.margin ?? 0;
      const subtotal = row.subtotal ?? 0;
      return subtotal > 0 ? (margin / subtotal) * 100 : 0;
    },
    header: "Margin (%)",
    cell: ({ row }) => {
      const margin = row.original.margin ?? 0;
      const subtotal = row.original.subtotal ?? 0;
      const percent = subtotal > 0 ? (margin / subtotal) * 100 : 0;

      return `${percent.toFixed(1)}%`;
    },
  },
];

export default function TransactionItemTable() {
  const {
    transaction,
    products,
    sorting,
    setSorting,
    columnFilters,
    setColumnFilters,
  } = useReportSalesData();

  const transactionItem = transaction.flatMap((tr) => tr.items ?? []);

  const summarizedItems = useMemo(() => {
    const map = new Map<string, TransactionItem>();

    for (const item of transactionItem) {
      const matchedProduct = products.find(
        (prod) => prod.id === item.product_id
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
        });
      }
    }

    return Array.from(map.values());
  }, [transactionItem, products]);

  return (
    <div className="bg-white shadow-md rounded-xl p-4 overflow-auto h-full">
      <DataTable
        columns={columns}
        data={summarizedItems}
        sorting={sorting}
        setSorting={setSorting}
        columnFilters={columnFilters}
        setColumnFilters={setColumnFilters}
      />
    </div>
  );
}
