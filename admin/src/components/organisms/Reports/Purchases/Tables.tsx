import { PurchaseItem } from "@/@types/purchases";
import { DataTable } from "@/components/molecules/DataTable";
import { useReportPurchaseData } from "@/components/providers/ReportPurchaseProvider";
import { formatToIndonesianDate, formatToRupiah } from "@/lib/utils";
import { ColumnDef } from "@tanstack/react-table";
import { useMemo } from "react";

type ReportPurchaseTable = PurchaseItem & {
  supplier_name: string;
};

export const columns: ColumnDef<ReportPurchaseTable>[] = [
  {
    accessorKey: "created_at",
    id: "created_at",
    header: "Tanggal Pembelian",
    cell: ({ row }) => formatToIndonesianDate(String(row.original.created_at)),
  },
  {
    accessorKey: "supplier_name",
    id: "supplier_name",
    header: "Nama Supplier",
    filterFn: "includesString",
  },
  {
    accessorKey: "product_id",
    id: "product_id",
    header: "ID Produk",
  },
  {
    accessorKey: "product_name",
    id: "product_name",
    header: "Nama Produk",
    filterFn: (row, columnId, filterValue) => {
      const cellValue = String(row.getValue(columnId) ?? "").toLowerCase();
      const keywords = filterValue.toLowerCase().split(" ").filter(Boolean);
      return keywords.every((kw: string) => cellValue.includes(kw));
    },
  },
  {
    accessorKey: "quantity",
    id: "quantity",
    header: "Jumlah Beli",
    cell: ({ row }) => `${row.original.quantity} pcs`,
  },
  {
    accessorKey: "remaining_quantity",
    id: "remaining_quantity",
    header: "Jumlah Saat Ini",
    cell: ({ row }) => `${row.original.remaining_quantity} pcs`,
  },
  {
    accessorKey: "hpp",
    id: "hpp",
    header: "Total HPP",
    cell: ({ row }) => formatToRupiah(row.original.hpp ?? 0),
  },
  {
    accessorKey: "subtotal",
    id: "subtotal",
    header: "Total Belanja",
    cell: ({ row }) => formatToRupiah(row.original.hpp * row.original.quantity),
  },
];

export default function ReportPurchaseTable() {
  const {
    purchase,
    products,
    sorting,
    setSorting,
    setColumnFilters,
    columnFilters,
  } = useReportPurchaseData();

  const purchaseItem = purchase.flatMap((tr) => tr.items ?? []);

  const summarizedItem = useMemo(() => {
    const newItems = purchaseItem.map((pur) => {
      const productCode = products.find(
        (prod) => prod.id === pur.product_id
      )!.code;
      const supplierName = purchase.find((purc) => purc.id === pur.purchase_id)!
        .supplier_name as string;

      return {
        ...pur,
        product_id: productCode,
        supplier_name: supplierName,
      };
    });
    return newItems;
  }, [purchaseItem, products, purchase]);

  return (
    <div className="bg-white shadow-2xl h-full w-full rounded-2xl p-4">
      <DataTable
        columns={columns}
        data={summarizedItem}
        sorting={sorting}
        setSorting={setSorting}
        columnFilters={columnFilters}
        setColumnFilters={setColumnFilters}
      />
    </div>
  );
}
