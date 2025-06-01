import { TransactionItem } from "@/@types/transaction";
import { DataTable } from "@/components/molecules/DataTable";
import { useReportSalesData } from "@/components/providers/ReportSalesProvider";
import { formatToRupiah } from "@/lib/utils";
import { ColumnDef, TableState } from "@tanstack/react-table";
import { useMemo } from "react";
import TableSortControl from "./TableSortControl";

const columns: ColumnDef<TransactionItem>[] = [
  {
    accessorKey: "id",
    header: "ID Produk",
  },
  {
    accessorKey: "product_name",
    header: "Nama Produk",
  },
  {
    accessorKey: "quantity",
    header: "Kuantitas",
  },
  {
    accessorKey: "subtotal",
    header: "Total",
    cell: ({ row }) => formatToRupiah(row.original.subtotal),
  },
  {
    accessorKey: "margin_total",
    header: "Total Margin",
    cell: ({ row }) => {
      console.log(row.original);

      return formatToRupiah(row.original.margin);
    },
  },
];

export default function TransactionItemTable() {
  const { transaction, products, sorting, setSorting } = useReportSalesData();

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
      } else {
        map.set(key, {
          ...item,
          id: matchedProduct?.code ?? item.id,
        });
      }
    }

    return Array.from(map.values());
  }, [transactionItem, products]);

  if (!transaction?.length) return null;

  const state: Partial<TableState> = {
    sorting,
  };

  return (
    <>
      <TableSortControl sorting={sorting} setSorting={setSorting} />
      <DataTable
        columns={columns}
        data={summarizedItems}
        state={state}
        setSorting={setSorting}
      />
    </>
  );
}
