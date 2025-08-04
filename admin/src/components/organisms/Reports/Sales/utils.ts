import { ColumnFiltersState } from "@tanstack/react-table";
import { TableReportSales } from "./interface";
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

export function summarizeReportSales(raw: TableReportSales[]) {
  const map = new Map<string, TableReportSales>();

  for (const r of raw) {
    const key = r.product_code;
    if (map.has(key)) {
      const existing = map.get(key)!;
      existing.quantity += r.quantity;
      existing.subtotal += r.subtotal;
      existing.hpp! += (existing.hpp ?? 0) + (r.hpp ?? 0);
      existing.margin = existing.subtotal - (existing.hpp ?? 0);
    } else {
      map.set(key, {
        ...r,
        id: r.product_code,
        transaction_at: formatToIndonesianDateTimeUTC(r.transaction_at),
      });
    }
  }

  const reports = Array.from(map.values());

  return reports;
}

export function transformOriginalReportItems(
  raw: TableReportSales[]
): TableReportSales[] {
  return raw.map((item) => {
    const finalTotal = item.subtotal + (item.tip ?? 0) - (item.discount ?? 0);

    return {
      ...item,
      id: item.product_code,
      subtotal: finalTotal,
      hpp: item.hpp ?? 0,
      margin: finalTotal - (item.hpp ?? 0),
      category: item?.category ?? "No Category",
      transaction_at: formatToIndonesianDateTimeUTC(
        item?.transaction_at ?? ""
      ),
      transaction_code: item?.transaction_code ?? "-",
      customer_name: String(item?.customer_name ?? "-"),
    };
  });
}
