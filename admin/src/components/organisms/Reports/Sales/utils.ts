import { ColumnFiltersState } from "@tanstack/react-table";
import { TableReportSales } from "./interface";

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
