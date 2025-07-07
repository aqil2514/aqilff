import { ColumnFiltersState } from "@tanstack/react-table";
import { TableReportSales } from "./interface";
import { Transaction, TransactionItem } from "@/@types/transaction";
import { Product } from "@/@types/products";
import { formatToIndonesianDateTimeUTC } from "@/lib/utils";

export function filterData(
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

export function summarizeReportSales({
  items,
  transactions,
  products,
}: {
  items: TransactionItem[];
  transactions: Transaction[];
  products: Product[];
}) {
  const map = new Map<string, TableReportSales>();

  for (const item of items) {
    const finalTotal = item.subtotal + (item.tip ?? 0) - (item.discount ?? 0);

    const matchedProduct = products.find((prod) => prod.id === item.product_id);
    const matchedTransaction = transactions.find(
      (tr) => tr.id === item.transaction_id
    );

    const key = matchedProduct?.code ?? item.product_name;

    if (map.has(key)) {
      const existing = map.get(key)!;
      existing.quantity += item.quantity;
      existing.subtotal += finalTotal;
      existing.hpp = (existing.hpp ?? 0) + (item.hpp ?? 0);
      existing.margin = existing.subtotal - (existing.hpp ?? 0);
    } else {
      map.set(key, {
        ...item,
        id: matchedProduct?.code ?? item.id,
        margin: finalTotal - (item.hpp ?? 0),
        hpp: item.hpp ?? 0,
        category: matchedProduct?.parent_category ?? "No Category",
        transaction_at: formatToIndonesianDateTimeUTC(
          matchedTransaction!.transaction_at
        ),
        subtotal: finalTotal,
        transaction_code: matchedTransaction!.transaction_code,
        customer_name: String(matchedTransaction!.customer_name),
      });
    }
  }

  return Array.from(map.values());
}

export function transformOriginalReportItems({
  items,
  transactions,
  products,
}: {
  items: TransactionItem[];
  transactions: Transaction[];
  products: Product[];
}): TableReportSales[] {
  return items.map((item) => {
    const matchedProduct = products.find((p) => p.id === item.product_id);
    const matchedTransaction = transactions.find(
      (t) => t.id === item.transaction_id
    );
    const finalTotal = item.subtotal + (item.tip ?? 0) - (item.discount ?? 0);

    return {
      ...item,
      id: matchedProduct?.code ?? item.id,
      subtotal: finalTotal,
      hpp: item.hpp ?? 0,
      margin: finalTotal - (item.hpp ?? 0),
      category: matchedProduct?.parent_category ?? "No Category",
      transaction_at: formatToIndonesianDateTimeUTC(
        matchedTransaction?.transaction_at ?? ""
      ),
      transaction_code: matchedTransaction?.transaction_code ?? "-",
      customer_name: String(matchedTransaction?.customer_name ?? "-"),
    };
  });
}
