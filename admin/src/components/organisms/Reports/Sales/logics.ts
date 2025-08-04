import { useReportSalesData } from "@/components/providers/ReportSalesProvider";
import { useMemo } from "react";
import { columns, simpleColumns } from "./Columns";
import {
  filterData,
  summarizeReportSales,
  transformOriginalReportItems,
} from "./utils";

export function useTabsContentTransactionItemTableLogics() {
  const {
    transaction,
    sorting,
    setSorting,
    columnFilters,
    setColumnFilters,
    viewMode,
    setViewMode,
  } = useReportSalesData();

  const originalItems = useMemo(() => {
    return transformOriginalReportItems(transaction);
  }, [transaction]);

  const summarizedItems = useMemo(() => {
    return summarizeReportSales(transaction);
  }, [transaction]);

  const filteredItems = useMemo(() => {
    return filterData(summarizedItems, columnFilters);
  }, [summarizedItems, columnFilters]);

  const dataToDisplay =
    viewMode === "summary" ? summarizedItems : originalItems;

  const columnsToDisplay = viewMode === "summary" ? simpleColumns : columns;

  return {
    sorting,
    setSorting,
    setViewMode,
    setColumnFilters,
    dataToDisplay,
    filteredItems,
    columnsToDisplay,
    viewMode,
    columnFilters,
  };
}
