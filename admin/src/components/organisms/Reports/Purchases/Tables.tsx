import { PurchaseItem } from "@/@types/purchases";
import { DataTable } from "@/components/molecules/DataTable";
import { useReportPurchaseData } from "@/components/providers/ReportPurchaseProvider";
import { formatToIndonesianDate, formatToRupiah } from "@/lib/utils";
import { ColumnDef, TableState } from "@tanstack/react-table";
import { useMemo } from "react";

type TableData = PurchaseItem & {
  supplier_name: string;
};

const columns: ColumnDef<TableData>[] = [
  {
    accessorKey: "created_at",
    header: "Tanggal Pembelian",
    cell: ({ row }) => formatToIndonesianDate(String(row.original.created_at)),
  },
  {
    accessorKey: "supplier_name",
    header: "Nama Supplier",
  },
  {
    accessorKey: "product_id",
    header: "ID Produk",
  },
  {
    accessorKey: "product_name",
    header: "Nama Produk",
  },
  {
    accessorKey: "quantity",
    header: "Jumlah Beli",
    cell: ({ row }) => `${row.original.quantity} pcs`,
  },
  {
    accessorKey: "remaining_quantity",
    header: "Jumlah Saat Ini",
    cell: ({ row }) => `${row.original.remaining_quantity} pcs`,
  },
  {
    accessorKey: "hpp",
    header: "Total HPP",
    cell: ({ row }) => formatToRupiah(row.original.hpp ?? 0),
  },
  {
    accessorKey: "subtotal",
    header: "Total Belanja",
    cell: ({ row }) => formatToRupiah(row.original.hpp * row.original.quantity),
  },
];

export default function ReportPurchaseTable() {
  const { purchase, products, sorting, setSorting } = useReportPurchaseData();

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

  if (!purchase?.length) return null;

  const state: Partial<TableState> = {
    sorting,
  };

  return (
    <div className="bg-white shadow-2xl h-full w-full rounded-2xl p-4">
      <DataTable
        columns={columns}
        data={summarizedItem}
        state={state}
        setSorting={setSorting}
      />
    </div>
  );
}
