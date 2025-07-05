import { useReportSalesData } from "@/components/providers/ReportSalesProvider";
import { formatToIndonesianDateTimeUTC } from "@/lib/utils";
import { useEffect, useMemo, useState } from "react";
import { TableReportSales } from "./interface";
import { columns, simpleColumns } from "./Columns";
import { filterData } from "./utils";

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
    return transactionItem.map((item) => {
      const matchedProduct = products.find((p) => p.id === item.product_id);
      const matchedTransaction = transaction.find(
        (t) => t.id === item.transaction_id
      );

      return {
        ...item,
        id: matchedProduct?.code ?? item.id,
        margin: item.margin ?? 0,
        hpp: item.hpp ?? 0,
        category: matchedProduct?.parent_category ?? "No Category",
        transaction_at: formatToIndonesianDateTimeUTC(
          matchedTransaction?.transaction_at ?? ""
        ),
        transaction_code: matchedTransaction?.transaction_code ?? "-",
        customer_name: String(matchedTransaction?.customer_name ?? "-"),
      };
    });
  }, [transactionItem, products, transaction]);

  const summarizedItems = useMemo(() => {
    const map = new Map<string, TableReportSales>();

    for (const item of transactionItem) {
      const matchedProduct = products.find(
        (prod) => prod.id === item.product_id
      );
      const matchedTransaction = transaction.find(
        (tr) => tr.id === item.transaction_id
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
          category: matchedProduct?.parent_category ?? "No Category",
          transaction_at: formatToIndonesianDateTimeUTC(
            matchedTransaction!.transaction_at
          ),
          transaction_code: matchedTransaction!.transaction_code,
          customer_name: String(matchedTransaction!.customer_name),
        });
      }
    }

    return Array.from(map.values());
  }, [transactionItem, products, transaction]);

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
