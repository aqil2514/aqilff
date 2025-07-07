import { useReportSalesData } from "@/components/providers/ReportSalesProvider";
import { useEffect, useMemo, useState } from "react";
import { columns, simpleColumns } from "./Columns";
import { filterData, summarizeReportSales, transformOriginalReportItems } from "./utils";

export function useTabsContentOmzetPerDayLogics() {
  const [isNoData, setIsNoData] = useState<boolean>(false);
  const [isLessData, setIsLessData] = useState<boolean>(false);
  const { transaction } = useReportSalesData();

  const data = useMemo(() => {
    const grouped = new Map<string, number>();

    for (const tr of transaction) {
      const date = new Date(tr.transaction_at);
      const day = new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
        timeZone: "UTC",
      }).format(date);

      grouped.set(day, (grouped.get(day) || 0) + tr.total_amount);
    }

    return Array.from(grouped, ([name, total]) => ({ name, total }));
  }, [transaction]);

  useEffect(() => {
    if (!transaction || transaction.length === 0) {
      setIsNoData(true);
      setIsLessData(false);
    } else if (data.length < 2) {
      setIsNoData(false);
      setIsLessData(true);
    } else {
      setIsNoData(false);
      setIsLessData(false);
    }
  }, [data, transaction]);

  // Hitung info tambahan
  const totalOmzet = data.reduce((acc, curr) => acc + curr.total, 0);
  const avgOmzet = totalOmzet / data.length;
  const bestDay =
    data.length > 0
      ? data.reduce((prev, curr) => (curr.total > prev.total ? curr : prev))
      : undefined;

  return { avgOmzet, bestDay, data, isNoData, isLessData, totalOmzet };
}

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
