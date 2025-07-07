import { useReportSalesData } from "@/components/providers/ReportSalesProvider";
import { useMemo } from "react";
import { columns, simpleColumns } from "./Columns";
import { filterData, summarizeReportSales, transformOriginalReportItems } from "./utils";



export function useTabsContentTransactionItemTableLogics() {
  const {
    transaction,
    products,
    sorting,
    setSorting,
    columnFilters,
    setColumnFilters,
    viewMode,
    setViewMode,
  } = useReportSalesData();

  const transactionItem = transaction.flatMap((tr) => tr.items ?? []);

  const originalItems = useMemo(() => {
    return transformOriginalReportItems({
      items: transactionItem,
      transactions: transaction,
      products,
    });
  }, [transactionItem, transaction, products]);

  const summarizedItems = useMemo(() => {
    return summarizeReportSales({
      items: transactionItem,
      transactions: transaction,
      products,
    });
  }, [transactionItem, transaction, products]);

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
